const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const file = path.resolve(__dirname, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(__dirname + path.sep)) { res.writeHead(403).end(); return; }
  const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png' };
  fs.readFile(file, (error, data) => { if (error) res.writeHead(404).end(); else { res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream'); res.end(data); } });
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce', permissions: ['clipboard-read', 'clipboard-write'] });
    const page = await context.newPage();
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.project-card:visible').count(), 10);
    for (const [category, count] of [['Data', 5], ['Backend', 8], ['AI', 2], ['Telecom', 5]]) {
      await page.getByRole('button', { name: category, exact: true }).click();
      assert.equal(await page.locator('.project-card:visible').count(), count, category);
    }
    await page.locator('.skill-tags button').filter({ hasText: /^Kafka$/ }).click();
    assert.equal(await page.locator('.project-card:visible').count(), 3);
    await page.getByRole('button', { name: 'AI', exact: true }).click();
    assert.equal(await page.locator('.project-card:visible').count(), 0);
    assert.equal(await page.locator('.filter-empty').isVisible(), true);
    await page.getByRole('button', { name: 'All', exact: true }).click();
    for (let index = 0; index < 10; index++) {
      const trigger = page.locator('.detail-open').nth(index);
      await trigger.focus(); await page.keyboard.press('Enter');
      assert.equal(await page.locator('dialog').isVisible(), true);
      assert.equal(await page.locator('dialog h3').count(), 4);
      await page.keyboard.press('Escape');
      assert.equal(await trigger.evaluate(node => document.activeElement === node), true);
    }
    await page.locator('.detail-open').nth(1).click();
    await page.keyboard.press('Shift+Tab');
    assert.equal(await page.evaluate(() => document.querySelector('dialog').contains(document.activeElement)), true);
    await page.getByRole('button', { name: 'Try event simulation' }).click();
    assert.equal(await page.locator('dialog').isVisible(), false);
    for (const scenario of ['eligible', 'filtered', 'duplicate', 'eligible']) {
      await page.locator('#event-sample').selectOption(scenario);
      await page.locator('.demo-run').click();
      await page.waitForFunction(() => !document.querySelector('.demo-run').disabled);
      const output = await page.locator('.demo-output').innerText();
      assert.equal(output.includes('200 OK'), scenario === 'eligible');
      if (scenario !== 'eligible') assert.equal(await page.locator('.pipeline-track li').last().innerText(), 'API\nSkipped');
    }
    await page.locator('#terminal-command').fill('projects'); await page.locator('#terminal-command').press('Enter');
    assert.match(await page.locator('.terminal-log').innerText(), /eSimLinq/);
    for (const command of ['help', 'skills', 'contact']) await page.locator('.command-buttons').getByRole('button', { name: command, exact: true }).click();
    await page.locator('#terminal-command').fill('<img src=x onerror=alert(1)>'); await page.locator('#terminal-command').press('Enter');
    assert.equal(await page.locator('.terminal-log img').count(), 0);
    assert.match(await page.locator('.terminal-log').innerText(), /Unknown command/);
    await page.locator('.copy-email').click();
    await page.waitForFunction(() => document.querySelector('.copy-status').textContent === 'Copied');
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), 'gansumiyatsedevsuren@gmail.com');
    await page.locator('#pipeline-demo').scrollIntoViewIfNeeded();
    fs.mkdirSync(path.join(__dirname, 'screenshots'), { recursive: true });
    await page.locator('#pipeline-demo').screenshot({ path: path.join(__dirname, 'screenshots/pipeline-demo.png') });
    await page.screenshot({ path: path.join(__dirname, 'screenshots/desktop.png') });
    await page.locator('.detail-open').nth(1).click();
    await page.screenshot({ path: path.join(__dirname, 'screenshots/project-detail.png') });
    await page.keyboard.press('Escape');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('#pipeline-demo').scrollIntoViewIfNeeded();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'mobile overflow');
    await page.screenshot({ path: path.join(__dirname, 'screenshots/mobile.png') });
    await page.locator('.command-buttons').getByRole('button', { name: 'help', exact: true }).click();
    await page.locator('.detail-open').nth(0).click();
    assert.equal(await page.evaluate(() => document.querySelector('dialog').scrollWidth <= document.querySelector('dialog').clientWidth), true, 'modal overflow');
    await page.keyboard.press('Escape');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.locator('.demo-run').click();
    assert.equal(await page.locator('.demo-run').isDisabled(), true);
    await page.waitForFunction(() => !document.querySelector('.demo-run').disabled);
    const touchContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    const touchPage = await touchContext.newPage();
    await touchPage.goto(`http://127.0.0.1:${server.address().port}/`);
    await touchPage.locator('.command-buttons').getByRole('button', { name: 'projects', exact: true }).tap();
    assert.match(await touchPage.locator('.terminal-log').innerText(), /eSimLinq/);
    await touchPage.locator('.detail-open').nth(1).tap();
    assert.equal(await touchPage.locator('dialog').isVisible(), true);
    await touchPage.locator('dialog img').scrollIntoViewIfNeeded();
    await touchPage.waitForFunction(() => document.querySelector('dialog img').naturalWidth > 0);
    await touchPage.locator('.dialog-close').tap();
    await touchPage.locator('#mobile-menu-button').tap();
    await touchPage.locator('#mobile-menu a[href="#projects"]').tap();
    await touchPage.waitForFunction(() => document.querySelector('#mobile-menu-button').getAttribute('aria-expanded') === 'false');
    await touchPage.waitForFunction(() => document.querySelector('.nav-links a[href="#projects"]').getAttribute('aria-current') === 'location');
    await touchContext.close();
    assert.deepEqual(errors, []);
    console.log('PASS: category/stack filters, empty state, 10 dialogs, keyboard focus, terminal safety, three demo paths and replay, clipboard, mobile layout, reduced/normal motion; no JS errors.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => server.close());
