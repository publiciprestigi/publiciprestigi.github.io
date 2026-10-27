/**
 * Públic i Prestigi v1.2 — coherència de mercat, població i IIC.
 * Executar des de qualsevol directori:
 *   node v1.2/scripts/validar-metrics.mjs
 * Només llegeix fitxers; no modifica ni publica res.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const json = p => JSON.parse(read(p));
const fail = message => { throw new Error(message); };
const invariant = (condition, message) => { if (!condition) fail(message); };
const approx = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol;
const round2 = n => Number(n.toFixed(2));
const decimal = s => Number(String(s).replace(',', '.').replace(/[≈%M]/g, ''));

const markets = json('data/market.json');
const films = json('data/films.json');
const byYear = new Map(markets.map(x => [x.any, x]));
const top = films.filter(x => x.in_top100);

invariant(markets.length === 61, 'Calen 61 anys de mercat');
invariant(films.length === 210, 'Calen 210 registres de films');
invariant(top.length === 100, 'El Top 100 ha de tenir 100 títols');
for (let i = 0; i < markets.length; i++) {
  const x = markets[i];
  invariant(x.any === 1965 + i, 'Anualitat de mercat fora de sèrie');
  invariant(x.entrades_M > 0 && x.poblacio_M > 0, 'Denominador invàlid ' + x.any);
  invariant(x.estimat === (x.any === 1965), 'Marca de mercat estimat incorrecta ' + x.any);
  invariant(x.poblacio_estimada === (x.any <= 1972), 'Marca de població reconstruïda incorrecta ' + x.any);
}

const anchor = top.find(x => x.titol === '8 apellidos vascos' && x.any === 2014);
invariant(anchor, 'No existeix el títol que normalitza l’IIC');
const ref = byYear.get(2014);
const aq = 100 * anchor.espectadors / (ref.entrades_M * 1e6);
const ap = 100 * anchor.espectadors / (ref.poblacio_M * 1e6);
const k = 10 / Math.sqrt(aq * ap);

for (const film of films) {
  const m = byYear.get(film.any);
  const mTotal = m?.entrades_M ?? (film.any === 1964 ? 400 : null);
  const population = m?.poblacio_M ?? (film.any === 1964 ? 31.633628 : null);
  invariant(mTotal && population, 'Denominador de film desconegut: ' + film.titol);
  const quota = 100 * film.espectadors / (mTotal * 1e6);
  const penetration = 100 * film.espectadors / (population * 1e6);
  invariant(approx(film.mercat_M, mTotal), 'Mercat discrepant: ' + film.titol);
  invariant(film.quota === round2(quota), 'Quota discrepant: ' + film.titol);
  invariant(film.penetracio === round2(penetration), 'Penetració discrepant: ' + film.titol);
  invariant(film.iic === round2(k * Math.sqrt(quota * penetration)), 'IIC discrepant: ' + film.titol);
  invariant(film.mercat_estimat === (film.any <= 1965), 'Marca mercat de film incorrecta: ' + film.titol);
  invariant(film.quota_estimat === (film.any <= 1965), 'Marca quota incorrecta: ' + film.titol);
  invariant(film.penetracio_estimat === (film.any <= 1972), 'Marca penetració incorrecta: ' + film.titol);
}
const exceptions = top.filter(x => x.any === 1964);
invariant(exceptions.length === 2 &&
  exceptions.some(x => x.titol === 'Búsqueme a esa chica') &&
  exceptions.some(x => x.titol === 'Tulipán negro'), 'Excepcions ICAA de 1964 alterades');
invariant(anchor.iic === 10, 'El màxim de l’IIC no dona 10');

const html = read('part-iii.html');
function inline(name) {
  const r = new RegExp('\\bconst\\s+' + name + '\\s*=\\s*(\\{[^;]*\\}|\\[[^;]*\\]);');
  const found = html.match(r);
  invariant(found, 'Falta ' + name + ' a part-iii.html');
  return JSON.parse(found[1]);
}
const marketObject = inline('esMarket');
const annualEntries = inline('espEntrades');
const annualPopulation = inline('espPoblacio');
invariant(annualEntries.length === 61 && annualPopulation.length === 61, 'Longitud incorrecta dels gràfics de la Part III');
markets.forEach((x, i) => {
  invariant(marketObject[x.any] === x.entrades_M, 'esMarket no sincronitzat ' + x.any);
  invariant(annualEntries[i] === x.entrades_M, 'espEntrades no sincronitzat ' + x.any);
  invariant(annualPopulation[i] === x.poblacio_M, 'espPoblacio no sincronitzada ' + x.any);
});

const js = read('js/part-iii.js');
const fixed = /(?:\{\s*any:\s*(\d{4}),\s*titol:\s*'([^']+)'[\s\S]{0,300}?mercat:\s*'([^']+)'[\s\S]{0,135}?quota:\s*'([^']+)'[\s\S]{0,75}?iic:\s*'([^']+)'|\{\s*titol:\s*'([^']+)',\s*any:\s*(\d{4})[\s\S]{0,300}?mercat:\s*'([^']+)'[\s\S]{0,135}?quota:\s*'([^']+)'[\s\S]{0,75}?iic:\s*'([^']+)')/g;
const records = [...js.matchAll(fixed)];
invariant(records.length === 49, 'No es troben les 49 entrades fixes de la Part III');
for (const match of records) {
  const excerpt = match[0];
  const year = Number(match[1] ?? match[7]);
  const film = match[2] ?? match[6];
  const audience = Number(excerpt.match(/\b(?:esp|espectadors)\s*:\s*(\d{2,9})\b/)?.[1] ?? 0);
  const m = byYear.get(year);
  invariant(m && audience > 0, 'Dades incompletes al JS: ' + film);
  const quota = 100 * audience / (m.entrades_M * 1e6);
  const penetration = 100 * audience / (m.poblacio_M * 1e6);
  const stored = Object.fromEntries(['mercat','penetr','quota','iic'].map(key => {
    const value = excerpt.match(new RegExp('\\b' + key + ":\\s*'([^']+)'"))?.[1];
    return [key, decimal(value)];
  }));
  invariant(approx(stored.mercat, Number(m.entrades_M.toFixed(1)), .051), 'Mercat fix JS: ' + film);
  invariant(approx(stored.penetr, round2(penetration), .001), 'Penetració fixa JS: ' + film);
  invariant(approx(stored.quota, round2(quota), .001), 'Quota fixa JS: ' + film);
  invariant(approx(stored.iic, round2(k * Math.sqrt(quota * penetration)), .001), 'IIC fix JS: ' + film);
}
invariant(js.includes('pipIICCoeficient()*Math.sqrt(penetracio*quota)'), 'Fórmula EFA no unificada');
const marketJs = read('js/mercat.js');
invariant(marketJs.includes('Math.round(entrades[idx2020])') &&
          marketJs.includes('Math.round(entrades[idxMax])'),
          'Les etiquetes del gràfic de mercat no són dinàmiques');
console.log('Correcte: 61 anualitats, 210 films, 100 Top 100, 49 files JS i dues sèries HTML sincronitzades.');
console.log('Coeficient IIC calculat:', k);
