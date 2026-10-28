// Públic i Prestigi — Smoke test visual de la branca (Playwright).
// Executar amb el servidor a 127.0.0.1:8765 i 'playwright' disponible.
import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const base = 'http://127.0.0.1:8765/v1.2/';
mkdirSync('qa-captures', { recursive: true });
const opts = { headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] };
if (process.env.PIP_CHROME_PATH) opts.executablePath = process.env.PIP_CHROME_PATH;
const browser = await chromium.launch(opts);
const errors = [];
async function newPage(path, width = 1440, height = 960) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  page.on('pageerror', err => errors.push(path + ' — ' + err.message));
  const response = await page.goto(base + path, { waitUntil: 'domcontentloaded', timeout: 45000 });
  assert.equal(response?.status(), 200, 'HTTP 200 ' + path);
  return page;
}
async function checkChart(page, selector, expectedFirst, expectedLast) {
  await page.waitForFunction(selector => {
    const el = document.querySelector(selector);
    return !!(el && window.Chart && Chart.getChart(el));
  }, selector, { timeout: 45000 });
  const values = await page.evaluate(selector => {
    const chart = Chart.getChart(document.querySelector(selector));
    return {
      first: chart.data.datasets[0].data[0],
      last: chart.data.datasets[0].data.at(-1),
      ymax: chart.options.scales.y.max
    };
  }, selector);
  assert.ok(Math.abs(values.first - expectedFirst) < 0.00001, 'mercat inicial ' + selector);
  assert.ok(Math.abs(values.last - expectedLast) < 0.00001, 'mercat final ' + selector);
  return values;
}
try {
  {
    const page = await newPage('part-i.html#mercat');
    const initial = await checkChart(page, '#seccio-mercat-grafic canvas', 435.2, 66.9);
    assert.equal(initial.ymax, 460, 'límit correcte de 1965');
    await page.locator('#seccio-mercat-grafic').screenshot({ path: 'qa-captures/01-mercat-1965-2025.png' });
    await page.locator('#seccio-mercat-grafic [data-view="perhab"]').click();
    await page.waitForFunction(() =>
      Chart.getChart(document.querySelector('#seccio-mercat-grafic canvas'))?.options.scales.y.max === 15);
    await page.locator('#seccio-mercat-grafic').screenshot({ path: 'qa-captures/02-entrades-per-habitant.png' });
    console.log('OK Part I: mercat 1965/2025 i vista per habitant');
    await page.close();
  }
  {
    const page = await newPage('part-i.html#decades');
    await page.locator('#taula-decades-resum tbody tr').first().waitFor({ timeout: 45000 });
    assert.equal(await page.locator('#taula-decades-resum tbody tr').count(), 7);
    await page.locator('#taula-decades-resum').screenshot({ path: 'qa-captures/03-resum-decades.png' });
    console.log('OK Part I: set files al resum per dècades');
    await page.close();
  }
  {
    const page = await newPage('part-i.html#iic');
    await page.locator('#taula-iic tbody tr').first().waitFor({ timeout: 45000 });
    await page.locator('#pip-rankcomp-grafic svg').waitFor({ timeout: 45000 });
    await page.locator('[data-film="Mujeres al borde de un ataque de nervios"]').click();
    assert.ok((await page.locator('#pip-rankcomp-grafic svg').innerHTML()).includes('#7'),
      'rànquing actualitzat de Mujeres');
    await page.locator('.pip-rankcomp-figura').screenshot({ path: 'qa-captures/04-comparativa-iic.png' });
    console.log('OK Part I: rànquing IIC i selector de pel·lícula');
    await page.close();
  }
  {
    const page = await newPage('part-iii.html#caza-alcarras');
    await page.locator('#taula-caza-comparativa tbody tr').first().waitFor({ timeout: 45000 });
    const txt = await page.locator('#taula-caza-comparativa').innerText();
    assert.ok(txt.includes('403,1M') && txt.includes('59,1M'), 'mercats 1966 i 2022');
    assert.ok(txt.includes('0,08%') && txt.includes('0,68%'), 'quotes de referència');
    await page.locator('#taula-caza-comparativa').screenshot({ path: 'qa-captures/05-la-caza-alcarras.png' });
    console.log('OK Part III: La caza / Alcarràs');
    await page.close();
  }
  {
    const page = await newPage('part-iii.html#bunuel-mercat');
    await page.locator('#f30-main .f30-row').first().waitFor({ timeout: 45000 });
    assert.equal(await page.locator('#f30-main .f30-row').count(), 30, 'Top 30 francès');
    const initial = await checkChart(page, '#grafic-mercats-coda', 435.2, 66.9);
    assert.equal(initial.ymax, 460);
    await page.locator('#grafic-mercats-coda-bloc').screenshot({ path: 'qa-captures/06-espanya-franca-mercat.png' });
    await page.locator('#grafic-mercats-coda-bloc [data-view="perhab"]').click();
    await page.waitForFunction(() =>
      Chart.getChart(document.getElementById('grafic-mercats-coda'))?.options.scales.y.max === 15);
    await page.locator('#grafic-mercats-coda-bloc').screenshot({ path: 'qa-captures/07-espanya-franca-perhabitant.png' });
    await page.locator('#grafic-mercats-coda-bloc [data-view="quota"]').click();
    assert.equal(await page.locator('#mercats-quota-wrap').getAttribute('hidden'), null);
    await page.locator('#grafic-mercats-coda-bloc').screenshot({ path: 'qa-captures/08-espanya-franca-quota2025.png' });
    console.log('OK Part III: mercat i població Espanya-França, tres vistes');
    await page.close();
  }
  assert.deepEqual(errors, [], 'cap error JavaScript no capturat');
  console.log('VALIDACIÓ DE NAVEGADOR CORRECTA: 5 pàgines/estats, 8 captures, cap excepció.');
} finally {
  await browser.close();
}
