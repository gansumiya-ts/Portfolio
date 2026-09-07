document.addEventListener('DOMContentLoaded', () => {
  /* TYPEWRITER */
  const typeEl = document.querySelector('.typewriter');
  if(typeEl){
    const phrases = JSON.parse(typeEl.dataset.phrases);
    let i=0, j=0, isDeleting=false;
    const tick = () => {
      const full = phrases[i];
      j = Math.max(0, Math.min(full.length, j));
      const txt = isDeleting ? full.slice(0, j--) : full.slice(0, j++);
      typeEl.textContent = txt;
      let delay = isDeleting ? 60 : 120;
      if(!isDeleting && j === full.length+1){ delay = 1200; isDeleting = true; }
      else if(isDeleting && j === 0){ isDeleting = false; i = (i+1)%phrases.length; delay = 250; }
      setTimeout(tick, delay);
    };
    tick();
  }

  /* THEME TOGGLE */
  const toggle = document.getElementById('theme-toggle');
  const applyTheme = (dark) => document.documentElement.classList.toggle('dark', dark);
  const saved = localStorage.getItem('theme') === 'dark';
  applyTheme(saved);
  if(toggle){
    toggle.textContent = saved ? '☀️' : '🌙';
    toggle.addEventListener('click', () => {
      const isDark = !document.documentElement.classList.contains('dark');
      applyTheme(isDark);
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      toggle.textContent = isDark ? '☀️' : '🌙';
    });
  }

  /* REVEAL ON SCROLL */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting) e.target.classList.add('is-visible');
    });
  }, {threshold: 0.12});
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  /* PROJECT MODAL */
  const modal = document.getElementById('project-modal');
  const modalImage = document.getElementById('modal-image');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalClose = document.getElementById('modal-close');
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      modalImage.src = card.dataset.image || '';
      modalImage.alt = card.dataset.title || '';
      modalTitle.textContent = card.dataset.title || '';
      modalDesc.textContent = card.dataset.desc || '';
      modal.setAttribute('aria-hidden', 'false');
      // move focus into the modal for accessibility
      modalClose.focus();
    });
  });
  const closeModal = () => modal.setAttribute('aria-hidden', 'true');
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if(e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeModal(); });

  /* SMOOTH SCROLL FOR ANCHORS */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if(href.length > 1){
        e.preventDefault();
        const target = document.querySelector(href);
        if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  /* CONTACT FORM: small client-side validation + fake submit */
  const form = document.getElementById('contact-form');
  if(form) form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    const prev = btn.textContent;
    btn.textContent = 'Sending...';
    setTimeout(() => {
      btn.textContent = 'Sent!';
      form.reset();
      setTimeout(()=> { btn.disabled = false; btn.textContent = prev; }, 1500);
    }, 900);
  });
});
