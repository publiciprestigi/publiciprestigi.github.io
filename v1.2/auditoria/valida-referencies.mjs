// Auditoria d'enllaços de notes i blocs Markdown a la v1.2 catalana.
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = p => readFileSync(join(root, p), 'utf8');
const html = ['index.html','part-i.html','part-ii.html','part-iii.html','notes.html','sobre.html','versions.html'];
const noteHTML=read('notes.html');
const ids=[...noteHTML.matchAll(/<div class="nota" id="n(\d+)"/g)].map(x=>+x[1]);
const numbers=[...noteHTML.matchAll(/<span class="nota-num">\[(\d+)\]<\/span>/g)].map(x=>+x[1]);
assert.deepEqual(ids,Array.from({length:32},(_,i)=>i+1),'notes [1]–[32] consecutives');
assert.deepEqual(numbers,ids,'encapçalaments de notes');
const files=[];
function walk(dir){for(const f of readdirSync(join(root,dir),{withFileTypes:true})){const p=join(dir,f.name);if(f.isDirectory())walk(p);else if(f.name.endsWith('.md'))files.push(p)}}
walk('textos');
const refs=[],bad=[];
for(const path of [...html,...files]) {
 const s=read(path);
 for(const m of s.matchAll(/<sup>\s*\[(\d+)\]\s*<\/sup>|notes\.html#n(\d+)/g)){
  const number=+(m[1]||m[2]);
  refs.push({path,number});
  if(!ids.includes(number))bad.push(path+': nota inexistent '+number);
 }
}
let checked=0,absent=[];
for(const path of ['index.html','part-i.html','part-ii.html','part-iii.html']) {
 const s=read(path);
 for(const tag of s.matchAll(/<div\b[^>]*\bdata-text="([^"]+)"[^>]*>/g)) {
   const file='textos/'+tag[1]+'.md';
   checked++;
   if(!existsSync(join(root,file)))absent.push(path+' -> '+file);
   const block=tag[0].match(/\bdata-bloc="([^"]+)"/)?.[1];
   if(block&&existsSync(join(root,file))){
    const md=read(file),o='<!-- '+block+' -->',c='<!-- /'+block+' -->';
    if(!md.includes(o)||!md.includes(c))bad.push(path+': bloc '+block+' absent de '+file);
   }
 }
}
console.log(JSON.stringify({notes:ids.length,files:files.length,citations:refs.length,blocks:checked,missingFiles:absent,badReferences:bad},null,2));
assert.deepEqual(absent,[],'tots els Markdown de les pàgines existeixen');
assert.deepEqual(bad,[],'notes i blocs enllaçats correctament');
