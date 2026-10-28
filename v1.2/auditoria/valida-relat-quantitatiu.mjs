// Control automàtic dels exemples numèrics citats als textos catalans.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const base = new URL('../', import.meta.url);
const read = p => readFileSync(new URL(p, base), 'utf8');
const films = JSON.parse(read('data/films.json'));
const market = JSON.parse(read('data/market.json'));
const top = films.filter(f => f.in_top100);
const two = v => Number(v.toFixed(2));
const assertFilm = (title, year, props) => {
  const f = films.find(f => f.titol === title && f.any === year);
  assert.ok(f, 'film no trobat: ' + title);
  for (const [key, val] of Object.entries(props)) assert.equal(f[key], val, title+' '+key);
};
function positions(metric){
  const sorted=top.slice().sort((a,b)=>b[metric]-a[metric]);
  return new Map(sorted.map((f,i)=>[f.titol,i+1]));
}
const expected = [
 ['8 apellidos vascos',2014,{espectadors:1,quota:1,penetracio:1,iic:1}],
 ['La ciudad no es para mí',1966,{espectadors:11,quota:48,penetracio:4,iic:26}],
 ['Los santos inocentes',1984,{espectadors:99,quota:36,iic:47}],
 ['Mujeres al borde de un ataque de nervios',1988,{espectadors:22,quota:7,iic:9}],
 ['Padre no hay más que uno 3',2022,{espectadors:50,quota:5,penetracio:90,iic:11}],
 ['Padre no hay más que uno 4',2024,{espectadors:79,quota:17}],
 ['Padre no hay más que uno 5',2025,{espectadors:98,quota:16}],
 ['Juicio de faldas',1969,{espectadors:20,penetracio:13}],
 ['Por un puñado de dólares',1965,{espectadors:25,penetracio:14}],
 ['Mi canción es para ti',1965,{espectadors:14,penetracio:8}],
 ['Un beso en el puerto',1966,{espectadors:15,penetracio:9}],
 ['Pero... ¿en qué país vivimos?',1967,{espectadors:13,penetracio:10}],
 ['Lo imposible',2012,{quota:2}],
 ['Ocho apellidos catalanes',2015,{quota:3}],
 ['Los otros',2001,{iic:4}]
];
const pos = Object.fromEntries(['espectadors','quota','penetracio','iic'].map(k=>[k,positions(k)]));
for(const [title,year,ranks] of expected){
  const record=top.find(x=>x.titol===title&&x.any===year);
  assert.ok(record,'Títol exclòs del corpus: '+title);
  for(const [metric,rank] of Object.entries(ranks)) assert.equal(pos[metric].get(title),rank,title+' '+metric);
}
assertFilm('8 apellidos vascos',2014,{quota:10.68,iic:10});
assertFilm('Mujeres al borde de un ataque de nervios',1988,{quota:3.82,iic:3.91});
assertFilm('Padre no hay más que uno 3',2022,{quota:4.41,iic:3.35});
assertFilm('Los otros',2001,{iic:5.65});
assert.equal(top.length,100);
assert.equal(top.reduce((s,f)=>s+f.espectadors,0),294408270);
assert.deepEqual(top.filter(f=>f.any===1964).map(f=>f.titol).sort(),
 ['Búsqueme a esa chica','Tulipán negro'].sort());
assert.deepEqual(['60s','70s','80s','90s','2000s','2010s','2020s'].map(d=>top.filter(f=>f.decada===d).length),
 [43,18,3,6,14,13,3]);
const decades=[['60s',1965,1969,394.5],['70s',1970,1979,260.0],['80s',1980,1989,123.1],
 ['90s',1990,1999,101.0],['2000s',2000,2009,128.8],['2010s',2010,2019,96.2],['2020s',2020,2025,57.4]];
for(const [label,start,end,average] of decades) {
 const rows=market.filter(r=>r.any>=start&&r.any<=end);
 assert.equal(rows.length,end-start+1,label+' nombre anualitats');
 const mean=rows.reduce((s,r)=>s+r.entrades_M,0)/rows.length;
 assert.equal(two(mean*10)/10,average,label+' mitjana de mercat');
}
const texts={
 quota: read('textos/part-i/ranking-quota.md'),
 iic: read('textos/part-i/ranking-iic.md'),
 penetracio: read('textos/part-i/ranking-penetracio.md'),
 decades: read('textos/part-i/decades-intro.md'),
 mercat: read('textos/part-i/mercat-poblacio.md')
};
assert.ok(texts.quota.includes('públic acumulat')&&texts.quota.includes('mercat anual de referència'));
assert.ok(texts.quota.includes('10,68%')&&texts.quota.includes('6,51%')&&texts.quota.includes('5,92%'));
assert.ok(texts.iic.includes('3,82%')&&texts.iic.includes('4,41%')&&texts.iic.includes('403,1M'));
assert.ok(texts.decades.includes('294,4M')&&texts.decades.includes('1964'));
assert.ok(texts.mercat.includes('435,2M')&&texts.mercat.includes('66,9M'));
console.log('RELAT QUANTITATIU CORRECTE: 15 films contrastats, posicions, 7 dècades i textos clau.');
