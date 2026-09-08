/* Local-only portfolio interactions. No backend requests are made by the demo. */
(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const compact = node => node?.textContent.replace(/\s+/g, ' ').trim() || '';
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };
  const button = (text, className = 'chip') => {
    const node = make('button', className, text);
    node.type = 'button';
    return node;
  };
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const goTo = id => document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });

  // Narrative summaries are derived from the existing project descriptions.
  // Architecture is illustrative; no private infrastructure or metrics are claimed.
  const details = [
    { categories: ['AI', 'Backend'], problem: 'Market information and signals require repeated analysis before they can support decisions.', flow: ['Market information', 'Python / AI', 'FastAPI / Redis', 'Insights'], result: 'Supports automated market analysis and insight generation.' },
    { categories: ['Data', 'Backend'], problem: 'Business events need to be filtered and routed to the right customer workflow in real time.', flow: ['Kafka', 'Node.js filtering', 'Downstream APIs', 'Customer workflows'], result: 'Connects incoming events to downstream customer workflows.' },
    { categories: ['Data', 'Telecom'], problem: 'High-volume telecom datasets need consistent validation and transformation before delivery.', flow: ['Telecom datasets', 'Python validation', 'Oracle / SQL', 'Scheduled delivery'], result: 'Automates ingestion, validation, transformation and delivery.' },
    { categories: ['Data', 'Telecom'], problem: 'Raw call-detail records need preparation before downstream pipelines can use them.', flow: ['CDR files', 'Bash / AWK', 'Validation / renaming', 'Downstream pipeline'], result: 'Prepares filtered and validated call-detail records automatically.' },
    { categories: ['Backend', 'Data'], problem: 'Queue health, storage capacity and processing failures need operational visibility.', flow: ['Queues / Redis / files', 'Python checks', 'Validation', 'Operational reports'], result: 'Brings operational checks into automated reporting.' },
    { categories: ['Backend'], problem: 'Internal campaign and offer capabilities need a structured API interface.', flow: ['API request', 'Express / Node.js', 'Oracle', 'Structured response'], result: 'Exposes database-backed campaign and offer information through APIs.' },
    { categories: ['Telecom', 'Data', 'Backend'], problem: 'Recommendations need customer behavior, events and segmentation rules to work together.', flow: ['Usage / Kafka events', 'Java / rules', 'Oracle / Redis', 'Recommendations'], result: 'Supports recommendation flows using customer indicators and segmentation rules.' },
    { categories: ['Backend', 'Telecom'], problem: 'Customer order events need to connect with campaign and benefit services.', flow: ['Kafka order events', 'Node.js workflow', 'Campaign APIs', 'Benefit services'], result: 'Connects customer order events to campaign and benefit workflows in real time.' },
    { categories: ['AI', 'Backend'], problem: 'Multi-step digital workflows require coordination between data, logic and APIs.', flow: ['Data / task', 'Python AI agent', 'FastAPI / Redis', 'Workflow execution'], result: 'Combines data, automation logic and APIs for multi-step workflows.' },
    { categories: ['Telecom', 'Backend'], problem: 'International travelers need a simple way to purchase and activate mobile connectivity.', flow: ['Purchase', 'Payment processing', 'eSIMGo API', 'QR provisioning'], result: 'Enables digital eSIM delivery and self-service activation for travelers.' }
  ];
  const projects = $$('.project-card').map((card, index) => ({
    ...details[index], card, title: compact($('h3', card)), description: compact($('.project-description', card)),
    technologies: $$('.project-tech span', card).map(compact),
    live: $('.project-link', card)?.href,
    solution: compact($('.project-split > div:first-child p', card)) || compact($('.project-description', card)),
    impact: compact($('.project-split > div:last-child p', card)) || details[index].result
  }));
  const grid = $('.projects-grid');
  const filters = make('div', 'filter-bar');
  filters.setAttribute('role', 'group');
  filters.setAttribute('aria-label', 'Filter projects by category');
  const summary = make('p', 'filter-summary');
  summary.setAttribute('role', 'status');
  const empty = make('p', 'filter-empty', 'No projects match these filters. Choose All to reset.');
  empty.hidden = true;
  grid.before(filters, summary, empty);
  let category = 'All';
  let technology = '';
  const categoryButtons = ['All', 'Data', 'Backend', 'AI', 'Telecom'].map(name => {
    const node = button(name);
    node.addEventListener('click', () => { category = name; if (name === 'All') technology = ''; applyFilters(); });
    filters.append(node);
    return node;
  });
  const clearTech = button('');
  filters.append(clearTech);
  clearTech.addEventListener('click', () => { technology = ''; applyFilters(); });
  function applyFilters() {
    let count = 0;
    projects.forEach(project => {
      const visible = (category === 'All' || project.categories.includes(category)) && (!technology || project.technologies.includes(technology));
      project.card.hidden = !visible;
      if (visible) { count++; project.card.classList.add('active'); }
    });
    categoryButtons.forEach(node => node.setAttribute('aria-pressed', String(node.textContent === category)));
    clearTech.hidden = !technology;
    clearTech.textContent = `${technology} ×`;
    clearTech.setAttribute('aria-label', `Clear ${technology} technology filter`);
    summary.textContent = `${count} of ${projects.length} projects · ${category}${technology ? ` / ${technology}` : ''}`;
    empty.hidden = count > 0;
  }
  function filterTechnology(name) { category = 'All'; technology = name; applyFilters(); goTo('projects'); }
  applyFilters();
  const aliases = { 'Oracle DB': 'Oracle' };
  $$('.skill-tags span, .project-tech span').forEach(span => {
    const name = compact(span);
    const tech = aliases[name] || name;
    if (!projects.some(project => project.technologies.includes(tech))) return;
    const node = button(name);
    node.setAttribute('aria-label', `Show projects using ${tech}`);
    node.addEventListener('click', () => filterTechnology(tech));
    span.replaceWith(node);
  });

  const dialog = make('dialog', 'project-dialog');
  dialog.setAttribute('aria-labelledby', 'project-dialog-title');
  const close = button('Close ×', 'dialog-close');
  close.autofocus = true;
  const content = make('div');
  dialog.append(close, content);
  document.body.append(dialog);
  let opener;
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = $$('button, a[href]', dialog);
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); opener?.focus({ preventScroll: true }); });
  function openProject(project, trigger) {
    opener = trigger;
    content.replaceChildren();
    content.append(make('span', 'demo-label', project.categories.join(' / ')));
    const title = make('h2', '', project.title);
    title.id = 'project-dialog-title';
    content.append(title);
    [['01 / The problem', project.problem], ['02 / My solution', project.solution]].forEach(([heading, text]) => content.append(make('h3', '', heading), make('p', '', text)));
    content.append(make('h3', '', '03 / Architecture'), make('p', '', 'Illustrative flow based on the project overview.'));
    const flow = make('div', 'architecture-flow');
    project.flow.forEach((step, index) => { if (index) { const arrow = make('b', '', '→'); arrow.setAttribute('aria-hidden', 'true'); flow.append(arrow); } flow.append(make('span', '', step)); });
    content.append(flow, make('h3', '', '04 / Outcome'), make('p', '', project.impact));
    const links = make('div', 'detail-links');
    if (project.live) {
      const link = make('a', '', 'Visit live site ↗');
      link.href = project.live; link.target = '_blank'; link.rel = 'noopener noreferrer'; links.append(link);
    }
    if (project === projects[1]) {
      const preview = make('figure', 'demo-preview');
      const screenshot = make('img');
      screenshot.src = 'screenshots/pipeline-demo.png';
      screenshot.alt = 'Sample event simulation showing Kafka, Backend, Redis and API stages with a simulated successful response.';
      screenshot.loading = 'lazy';
      preview.append(screenshot, make('figcaption', 'detail-note', 'Simulation preview · sample data, not a production screenshot.'));
      content.append(preview);
      const demo = button('Try event simulation →');
      demo.addEventListener('click', () => { dialog.close(); goTo('pipeline-demo'); $('#event-sample').focus({ preventScroll: true }); });
      links.append(demo);
    }
    content.append(links, make('p', 'detail-note', 'Project screenshots and source repository links are not published in this portfolio.'));
    dialog.showModal(); document.body.classList.add('dialog-open'); dialog.scrollTop = 0;
  }
  projects.forEach(project => {
    const trigger = button('Explore project →', 'detail-open');
    trigger.setAttribute('aria-label', `Explore ${project.title}`);
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.addEventListener('click', () => openProject(project, trigger));
    project.card.append(trigger);
    project.card.addEventListener('click', event => {
      if (event.target.closest('a, button, input, select') || window.getSelection()?.toString()) return;
      openProject(project, trigger);
    });
  });

  // A bounded text log, never an evaluated shell or HTML interpreter.
  const current = $('.terminal-current');
  current.replaceChildren();
  const log = make('div', 'terminal-log');
  log.setAttribute('role', 'log'); log.setAttribute('aria-label', 'Terminal output'); log.tabIndex = 0;
  log.append(make('p', '', 'Interactive portfolio · type help or choose a command.'));
  const form = make('form', 'terminal-form');
  const input = make('input'); input.id = 'terminal-command'; input.setAttribute('aria-label', 'Terminal command');
  input.placeholder = 'Type help…'; input.autocomplete = 'off'; input.spellcheck = false; input.maxLength = 100;
  const submit = button('Run', 'chip'); submit.type = 'submit';
  form.append(make('span', 'terminal-prompt', '$'), input, submit);
  const commands = make('div', 'command-buttons');
  current.replaceWith(log, form, commands);
  function runCommand(value) {
    const command = value.trim().toLowerCase();
    if (!command) return;
    const responses = {
      help: 'help — show commands\nprojects — list all 10 projects\nskills — show technology stack\ncontact — show contact details\nclear — clear terminal',
      projects: projects.map((project, index) => `${String(index + 1).padStart(2, '0')}  ${project.title}`).join('\n'),
      skills: [...new Set(projects.flatMap(project => project.technologies))].join(' · '),
      contact: `${$('.contact-email').getAttribute('href').slice(7)}\nGitHub: https://github.com/gansumiya-ts\nPhone: +976 86118340`
    };
    if (command === 'clear') log.replaceChildren();
    else log.append(make('p', '', `$ ${value.trim()}\n${Object.hasOwn(responses, command) ? responses[command] : 'Unknown command. Type help to see available commands.'}`));
    while (log.children.length > 20) log.firstElementChild.remove();
    log.scrollTop = log.scrollHeight; input.value = '';
  }
  form.addEventListener('submit', event => { event.preventDefault(); runCommand(input.value); });
  ['help', 'projects', 'skills', 'contact'].forEach(command => { const node = button(command); node.addEventListener('click', () => runCommand(command)); commands.append(node); });

  const demo = make('section', 'pipeline-demo glass-card');
  demo.id = 'pipeline-demo'; demo.setAttribute('aria-labelledby', 'pipeline-title');
  demo.innerHTML = `
    <span class="demo-label">INTERACTIVE LAB / SAMPLE DATA SIMULATION</span>
    <h3 id="pipeline-title">Follow an event through the system.</h3>
    <p>Kafka → Backend → Redis → API. Explore a sample customer workflow inspired by the Kafka Event Processing Platform. All data and API responses are simulated in your browser.</p>
    <div class="demo-controls"><label for="event-sample">Sample event</label>
      <select id="event-sample"><option value="eligible">Eligible order</option><option value="filtered">Cancelled order · filtered</option><option value="duplicate">Duplicate event · skipped</option></select>
      <button type="button" class="demo-run">Run demo / Send event →</button>
    </div>
    <ol class="pipeline-track" aria-label="Event pipeline"><li>Kafka<small>Waiting</small></li><li>Backend<small>Waiting</small></li><li>Redis<small>Waiting</small></li><li>API<small>Waiting</small></li></ol>
    <div class="demo-data"><div><h4>INPUT / SAMPLE PAYLOAD</h4><pre class="demo-payload"></pre></div><div><h4>PROCESSING LOG / SIMULATED OUTPUT</h4><pre class="demo-output">Choose a sample and run the demo.</pre></div></div>
    <p class="demo-status" role="status">Ready. No real customer data or external API calls are used.</p>`;
  grid.after(demo);
  const sample = $('#event-sample');
  const run = $('.demo-run', demo);
  const steps = $$('.pipeline-track li', demo);
  const output = $('.demo-output', demo);
  const status = $('.demo-status', demo);
  const samples = {
    eligible: { eventId: 'demo-001', type: 'order.completed', customerId: 'sample-customer', offerId: 'sample-offer' },
    filtered: { eventId: 'demo-002', type: 'order.cancelled', customerId: 'sample-customer', offerId: 'sample-offer' },
    duplicate: { eventId: 'demo-001', type: 'order.completed', customerId: 'sample-customer', offerId: 'sample-offer' }
  };
  function resetDemo() {
    $('.demo-payload', demo).textContent = JSON.stringify(samples[sample.value], null, 2);
    steps.forEach(step => { step.className = ''; step.removeAttribute('aria-current'); $('small', step).textContent = 'Waiting'; });
    output.textContent = sample.value === 'duplicate' ? 'Fixture: Redis already contains demo-001.\nReady to test duplicate handling.' : 'Choose a sample and run the demo.';
    status.textContent = 'Ready. No real customer data or external API calls are used.';
  }
  sample.addEventListener('change', resetDemo); resetDemo();
  const pause = () => new Promise(resolve => setTimeout(resolve, reducedMotion.matches ? 0 : 650));
  run.addEventListener('click', async () => {
    resetDemo(); run.disabled = true; sample.disabled = true; output.textContent = '';
    const payload = samples[sample.value];
    const messages = [
      `Received ${payload.eventId} on sample.orders.`,
      payload.type === 'order.completed' ? 'Validated required fields; order.completed passes the filter.' : 'Filtered: order.cancelled does not trigger the customer workflow.',
      sample.value === 'duplicate' ? 'Duplicate found in simulated Redis; stop to avoid a repeated API call.' : `Simulated Redis: stored ${payload.eventId} as an idempotency key.`,
      `Simulated POST /api/campaigns/activate\n${JSON.stringify({ customerId: payload.customerId, offerId: payload.offerId })}\nSimulated response: 200 OK`
    ];
    try {
      for (let index = 0; index < steps.length; index++) {
        const step = steps[index]; step.className = 'current'; step.setAttribute('aria-current', 'step'); $('small', step).textContent = 'Processing';
        status.textContent = `${['Kafka', 'Backend', 'Redis', 'API'][index]}: ${messages[index]}`;
        await pause();
        output.textContent += `${index + 1}. ${messages[index]}\n\n`;
        step.className = 'done'; step.removeAttribute('aria-current'); $('small', step).textContent = 'Complete';
        if ((index === 1 && sample.value === 'filtered') || (index === 2 && sample.value === 'duplicate')) {
          $('small', step).textContent = sample.value === 'filtered' ? 'Filtered' : 'Duplicate';
          steps.slice(index + 1).forEach(next => { $('small', next).textContent = 'Skipped'; });
          status.textContent = 'Simulation complete. Event skipped; no API call was simulated.';
          return;
        }
      }
      status.textContent = 'Simulation complete. Eligible payload routed to the sample campaign API. No network request was sent.';
    } finally { run.disabled = false; sample.disabled = false; }
  });

  const email = $('.contact-email');
  const copy = button('Copy email', 'copy-email');
  const copyStatus = make('p', 'copy-status'); copyStatus.setAttribute('role', 'status');
  email.after(copy, copyStatus);
  let copyTimer;
  copy.addEventListener('click', async () => {
    clearTimeout(copyTimer);
    try { await navigator.clipboard.writeText(email.getAttribute('href').slice(7)); copyStatus.textContent = 'Copied'; }
    catch { copyStatus.textContent = 'Could not copy automatically. Select and copy the email address above.'; }
    copyTimer = setTimeout(() => { copyStatus.textContent = ''; }, 5000);
  });
})();
