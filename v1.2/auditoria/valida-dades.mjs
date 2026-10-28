// Públic i Prestigi v1.2 — comprovacions reproduïbles abans de la fusió.
// Executar des de qualsevol carpeta: node v1.2/auditoria/valida-dades.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');
const json = path => JSON.parse(read(path));
const parseNumber = x => Number(String(x).replace(',', '.'));
function csv(path) {
  const lines = read(path).trim().split(/\r?\n/);
  const parseLine = line => {
    const result = [];
    let value = '', quoted = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (quoted && line[i + 1] === '"') { value += '"'; i++; }
        else quoted = !quoted;
      } else if (ch === ';' && !quoted) { result.push(value); value = ''; }
      else value += ch;
    }
    result.push(value);
    return result;
  };
  const headers = parseLine(lines.shift());
  return lines.map(line => {
    const fields = parseLine(line);
    return Object.fromEntries(headers.map((key, i) => [key, fields[i] ?? '']));
  });
}
const market = json('data/market.json');
const population = json('data/population.json');
const films = json('data/films.json');
const marketAudit = csv('auditoria/mercat-1965-2025.csv');
const popAudit = csv('auditoria/poblacio-1964-2025.csv');
const expected = csv('auditoria/rankings-abans-despres-1964-2025.csv');
const fixed = csv('auditoria/impacte-taules-fixes-part-iii.csv');
assert.equal(market.length, 61, 'mercat 1965–2025');
assert.equal(population.length, 62, 'població 1964–2025');
assert.equal(marketAudit.length, 61);
assert.equal(popAudit.length, 62);
assert.equal(films.length, 210);
assert.equal(expected.length, 210);
assert.equal(films.filter(f => f.in_top100).length, 100);
assert.equal(fixed.length, 49);
const marketByYear = new Map(market.map(m => [m.any, m]));
const popByYear = new Map(population.map(p => [p.any, p]));
for (const row of marketAudit) {
  const year = +row.any;
  const value = row.espectadors_font
    ? +row.espectadors_font
    : Math.round(parseNumber(row.proposta_M) * 1e6);
  const actual = marketByYear.get(year);
  assert.ok(actual, 'mercat absent: ' + year);
  assert.ok(Math.abs(actual.entrades_M * 1e6 - value) < 0.01, 'mercat: ' + year);
  assert.equal(actual.estimat, year === 1965, 'font mercat: ' + year);
}
for (const row of popAudit) {
  const year = +row.any, persons = +row.poblacio_candidata_persones;
  const actual = popByYear.get(year);
  assert.ok(actual, 'població absent: ' + year);
  assert.equal(actual.poblacio_persones, persons, 'població: ' + year);
  assert.equal(actual.estat, row.estat, 'estat població: ' + year);
  if (year >= 1965)
    assert.ok(Math.abs(marketByYear.get(year).poblacio_M * 1e6 - persons) < 0.01,
      'compatibilitat població/mercat: ' + year);
}
const f1964 = films.filter(f => f.any === 1964 && f.in_top100);
assert.deepEqual(f1964.map(f => f.titol).sort(),
  ['Búsqueme a esa chica', 'Tulipán negro'].sort(), 'excepcions de 1964');
assert.ok(f1964.every(f => f.mercat_M === 400), 'mercat 1964 = 400M estimats');
const anchor = films.find(f => f.titol === '8 apellidos vascos' && f.any === 2014);
assert.ok(anchor, 'film de referència IIC');
const m2014 = marketByYear.get(2014);
const qRef = 100 * anchor.espectadors / (m2014.entrades_M * 1e6);
const pRef = 100 * anchor.espectadors / (m2014.poblacio_M * 1e6);
const k = 10 / Math.sqrt(qRef * pRef);
const two = n => Number(n.toFixed(2));
assert.ok(Math.abs(k - 0.6807356220097183) < 1e-12);
for (const film of films) {
  const m = film.any === 1964
    ? { entrades_M: 400, poblacio_M: popByYear.get(1964).poblacio_M }
    : marketByYear.get(film.any);
  assert.ok(m, 'mercat absent per al film ' + film.titol);
  const q = 100 * film.espectadors / (m.entrades_M * 1e6);
  const p = 100 * film.espectadors / (m.poblacio_M * 1e6);
  const iic = k * Math.sqrt(q * p);
  const row = expected.find(r => +r.any === film.any
    && r.film === film.titol && +r.espectadors_icAA_corpus === film.espectadors);
  assert.ok(row, 'film diferent del corpus auditat: ' + film.titol);
  for (const [key, calculated, column] of [
    ['quota', q, 'quota_nova_pct'],
    ['penetracio', p, 'penetracio_nova_pct'],
    ['iic', iic, 'iic_nou']
  ]) {
    assert.equal(film[key], two(calculated), key + ': ' + film.titol);
    assert.equal(film[key], parseNumber(row[column]), 'simulació ' + key + ': ' + film.titol);
  }
  assert.equal(film.mercat_estimat, film.any <= 1965);
  assert.equal(film.quota_estimat, film.any <= 1965);
  assert.equal(film.penetracio_estimat, film.any <= 1972);
}
const rank = key => new Map(films.filter(f => f.in_top100)
  .slice().sort((a, b) => b[key] - a[key])
  .map((f, i) => [f.any + '|' + f.titol, i + 1]));
for (const [metric, col] of [
  ['quota', 'rank_quota_despres'],
  ['penetracio', 'rank_pen_despres'],
  ['iic', 'rank_iic_despres']
]) {
  const positions = rank(metric);
  for (const r of expected.filter(r => r.tipus === 'TOP100'))
    assert.equal(positions.get(r.any + '|' + r.film), +r[col],
      'posició ' + metric + ': ' + r.film);
}
const js = read('js/part-iii.js');
const start = js.indexOf('function indicadorsMercatIII(');
const end = js.indexOf('\n}\n\n', start);
assert.ok(start >= 0 && end > start, 'calculadora comuna Part III');
const helper = new Function('marketData', 'filmsData',
  js.slice(start, end + 2) + '\nreturn indicadorsMercatIII;')(market, films);
const args = [...js.matchAll(/\.\.\.indicadorsMercatIII\((\d{4}), (\d+)\)/g)]
  .map(m => m[1] + '|' + m[2]);
assert.equal(args.length, 49, '49 invocacions de mètriques manuals');
const count = (items, x) => items.filter(item => item === x).length;
for (const r of fixed) {
  const key = r.any + '|' + r.espectadors_guardats;
  assert.equal(count(args, key),
    count(fixed.map(x => x.any + '|' + x.espectadors_guardats), key),
    'entrada manual: ' + r.film);
  const metrics = helper(+r.any, +r.espectadors_guardats);
  assert.equal(parseNumber(metrics.quota.replace(/[≈%]/g, '')), parseNumber(r.quota_nova_pct));
  assert.equal(parseNumber(metrics.penetr.replace(/[≈%]/g, '')), parseNumber(r.penetracio_nova_pct));
  assert.equal(parseNumber(metrics.iic), parseNumber(r.iic_nou));
}
assert.ok(!js.includes('Math.sqrt(penetracio*quota/2.15)'), 'fórmula antiga IIC eliminada');
const html = read('part-iii.html');
assert.ok(html.includes('window.pipMarketDataPromise'));
assert.ok(html.includes('mercatEspanya.map(d => d.poblacio_M)'));
assert.ok(!html.includes('const espEntrades = [390.0'));
for (const source of [js, read('js/mercat.js'), read('js/decades-resum.js')])
  new Function(source);
for (const script of html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi))
  new Function(script[1]);
console.log('VALIDACIÓ CORRECTA: 61 mercats, 62 poblacions, 210 films, 630 mètriques, ' +
  '300 posicions, 49 entrades manuals, codi JS/HTML sense errors de sintaxi.');
