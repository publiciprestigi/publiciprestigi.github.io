// Revisió funcional de tots els capítols castellans sense desplegament públic.
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
const base = 'http://127.0.0.1:8765/v1.2/es/';
const pages = [
 {file:'part-i.html',ids:['intro','mercat','decades','60s','70s','80s','90s','2000s','2010s','2020s','espectadors','penetracio','quota','iic','directors']},
 {file:'part-ii.html',ids:['intro','panorama','cannes','venecia','berlin','sansebastia','premiades','oscar','efa','espectadors','directors']},
 {file:'part-iii.html',ids:['doble-corona','bretxa','caza-alcarras','lleis','generacions','autor-industrial','mapa-canon','bunuel-mercat','conclusions']}
];
mkdirSync('qa-captures', {recursive:true});
const opts={headless:true,args:['--no-sandbox','--disable-dev-shm-usage']};
if(process.env.PIP_CHROME_PATH) opts.executablePath=process.env.PIP_CHROME_PATH;
const browser=await chromium.launch(opts);
const records=[],errors=[],requests=[];
try {
for(const item of pages) {
 const page=await browser.newPage({viewport:{width:1440,height:960},deviceScaleFactor:1});
 page.on('pageerror',e=>errors.push(item.file+': '+e.message));
 page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400) requests.push(item.file+': '+r.status()+' '+r.url())});
 const response=await page.goto(base+item.file+'#intro',{waitUntil:'domcontentloaded',timeout:45000});
 assert.equal(response?.status(),200,'HTML ES '+item.file);
 assert.equal(await page.locator('html').getAttribute('lang'),'es','idioma ES '+item.file);
 await page.waitForTimeout(1100); // dades JSON i Markdown en aquest entorn
 for(const id of item.ids){
  const nav=page.locator('.sidebar-link[data-seccio="'+id+'"]');
  assert.ok(await nav.count()>0,'Navegació absent: '+item.file+'#'+id);
  await nav.first().evaluate(el=>el.click());
  const target=page.locator('#seccio-'+id);
  assert.equal(await target.count(),1,'Secció absent: '+item.file+'#'+id);
  await page.waitForFunction(id=>{
   const el=document.getElementById('seccio-'+id);
   return !!el&&getComputedStyle(el).display!=='none';
  },id,{timeout:7000});
  await page.waitForTimeout(200);
  const state=await target.evaluate(el=>{
   const md=[...el.querySelectorAll('.text-md[data-text]')];
   const tables=[...el.querySelectorAll('[id^="taula-"]')].filter(n=>!n.parentElement?.closest('[id^="taula-"]'));
   const readyTables=tables.filter(t=>t.querySelector('tr')).map(t=>({id:t.id,rows:t.querySelectorAll('tr').length}));
   return {textCount:md.length,rendered:md.filter(x=>x.textContent.trim().length>20).length,
    tableCount:tables.length,readyTables,visible:getComputedStyle(el).display!=='none',width:el.scrollWidth};
  });
  if(state.textCount>0 && state.rendered===0)errors.push(item.file+'#'+id+': text Markdown sense renderitzar');
  if(state.tableCount>0 && state.readyTables.length===0 && !['panorama','mapa-canon'].includes(id))errors.push(item.file+'#'+id+': taula sense files');
  records.push({page:item.file,section:id,...state});
 }
 if(item.file==='part-ii.html'){
  await page.locator('.sidebar-link[data-seccio="panorama"]').first().evaluate(el=>el.click());
  await page.waitForTimeout(700);
  assert.ok((await page.locator('#pip-panorama-content').innerText()).includes('2,01M'),'llindar del panorama ES');
 }
 if(item.file==='part-iii.html'){
  await page.locator('.sidebar-link[data-seccio="generacions"]').first().evaluate(el=>el.click());
  await page.waitForTimeout(650);
  assert.ok((await page.locator('#seccio-generacions').innerText()).includes('2,01M'),'llindar Part III ES');
 }
 if(item.file==='part-i.html'){
  await page.locator('.sidebar-link[data-seccio="iic"]').first().evaluate(el=>el.click());
  await page.locator('#pip-rankcomp-grafic svg').waitFor({timeout:12000});
  await page.screenshot({path:'qa-captures/cobertura-es-part-i-iic.png'});
 }
 if(item.file==='part-ii.html'){
  await page.locator('.sidebar-link[data-seccio="directors"]').first().evaluate(el=>el.click());
  await page.screenshot({path:'qa-captures/cobertura-es-part-ii-directors.png'});
 }
 if(item.file==='part-iii.html'){
  await page.locator('.sidebar-link[data-seccio="generacions"]').first().evaluate(el=>el.click());
  await page.waitForTimeout(800);
  await page.screenshot({path:'qa-captures/cobertura-es-part-iii-generacions.png'});
 }
 await page.close();
}
writeFileSync('qa-captures/cobertura-es-seccions.json',JSON.stringify({sections:records,errors,requests},null,2));
console.log('CAPÍTOLS REVISATS:',records.length);
console.log('TAULES DETECTADES:',records.reduce((n,x)=>n+x.readyTables.length,0));
console.log('ERRORS JAVASCRIPT O CONTINGUT:',JSON.stringify(errors));
console.log('RESPOSTES LOCALS AMB ERROR:',JSON.stringify(requests));
assert.deepEqual(errors,[],'sense excepcions o seccions buides');
assert.deepEqual(requests,[],'sense recursos locals 4xx/5xx');
console.log('COBERTURA SUPERADA');
} finally {await browser.close();}
