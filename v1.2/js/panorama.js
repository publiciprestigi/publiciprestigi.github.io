/* Públic i Prestigi — Panorama de la Part II · maqueta v1.2 */
(function () {
  'use strict';
  const es = document.documentElement.lang === 'es';
  const tr = (ca, cast) => es ? cast : ca;
  const palette = {fest:'#9B2335',both:'#E32636',acad:'#D49CA5'};
  const institutional = {'Cannes':'#9B2335','Venècia':'#2E7D5E','Berlín':'#1976D2','Sant Sebastià':'#E07B2A','Oscar':'#b59732','EFA':'#8C6239'};
  const key = f => f.any + '|' + String(f.titol).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
  const pct = (v,n) => (v*100/n).toLocaleString(es?'es-ES':'ca-ES',{maximumFractionDigits:1,minimumFractionDigits:1})+'%';
  const int = v => v.toLocaleString(es?'es-ES':'ca-ES');
  const options = {responsive:true,maintainAspectRatio:false,animation:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'rgba(45,45,45,.95)',titleFont:{family:'Inter',size:12},bodyFont:{family:'Inter',size:12},padding:10,cornerRadius:6}},scales:{}};
  function normRows(fest,oscar,efa) {
    const map = new Map();
    for (const [rows,source] of [[fest,'f'],[oscar.films,'o'],[efa.films,'e']]) for (const f of rows) {
      const k=key(f);
      const entry=map.get(k)||{titol:f.titol,any:f.any,espectadors:null,top:false,source:new Set(),institucions:new Set()};
      entry.source.add(source);
      entry.institucions.add(source==='f'?f.festival:source==='o'?'Oscar':'EFA');
      if (f.espectadors!==null && Number.isFinite(f.espectadors)) entry.espectadors=f.espectadors;
      if (f.in_top100 || f.top100_pos) entry.top=true;
      map.set(k,entry);
    }
    return [...map.values()];
  }
  function classificacio(f) {return f.source.has('f') ? (f.source.has('o')||f.source.has('e')?'both':'fest') : 'acad';}
  const cap = title => '<h2 class="pip-panorama-chart-title">'+title+'</h2>';
  const source = () => '<p class="pip-panorama-font">'+tr('Fonts: base de dades de Públic i Prestigi; arxius dels festivals, Oscar i EFA.','Fuentes: base de datos de Públic i Prestigi; archivos de festivales, Oscar y EFA.')+'</p>';
  function draw(data) {
    const host=document.getElementById('pip-panorama-content');
    if (!host || typeof Chart==='undefined') return;
    if (data.length!==340) {host.textContent=tr('No s’ha pogut validar el conjunt de dades.','No se ha podido validar el conjunto de datos.');return;}
    const counts={fest:0,both:0,acad:0};
    for(const f of data) counts[classificacio(f)]++;
    const legend=[
      ['fest',tr('Només festivals','Solo festivales')],
      ['both',tr('Festivals i acadèmies','Festivales y academias')],
      ['acad',tr('Només acadèmies','Solo academias')]
    ];
    const legendHTML = legend.map(([k,l])=>'<span class="pip-panorama-key"><i style="background:'+palette[k]+'"></i>'+l+'</span>').join('');
    const institutions=['Cannes','Venècia','Berlín','Sant Sebastià','Oscar','EFA'];
    const institute = institutions.map(n=>({name:n,n:data.filter(f=>f.institucions.has(n)).length}));
    const max=Math.max(...institute.map(x=>x.n));
    const instHTML=institute.map((a,i)=>'<div class="pip-panorama-inst-row"><span class="pip-panorama-inst-name">'+(es?{'Venècia':'Venecia','Sant Sebastià':'San Sebastián'}[a.name]||a.name:a.name)+'</span><div class="pip-panorama-inst-track"><div class="pip-panorama-inst-fill" style="background:'+institutional[a.name]+';width:'+(100*a.n/max)+'%"></div></div><strong>'+int(a.n)+'</strong></div>'+(i===3?'<div class="pip-panorama-inst-divider"></div>':'')).join('');
    const decades=['60s','70s','80s','90s','2000s','2010s','2020s'];
    const groups=decades.map((d,i)=>data.filter(f=>f.any>=(i===0?1965:i===1?1970:i===2?1980:i===3?1990:i===4?2000:i===5?2010:2020)&&f.any<=(i===0?1969:i===1?1979:i===2?1989:i===3?1999:i===4?2009:i===5?2019:2025)));
    const bands=[
      [tr('Top 100','Top 100'), f=>f.top],
      [tr('1M–2,02M','1M–2,02M'),f=>!f.top&&f.espectadors>=1000000],
      ['500K–1M',f=>!f.top&&f.espectadors>=500000&&f.espectadors<1000000],
      ['250K–500K',f=>f.espectadors>=250000&&f.espectadors<500000],
      ['100K–250K',f=>f.espectadors>=100000&&f.espectadors<250000],
      ['50K–100K',f=>f.espectadors>=50000&&f.espectadors<100000],
      ['25K–50K',f=>f.espectadors>=25000&&f.espectadors<50000],
      [tr('Menys de 25K','Menos de 25K'),f=>f.espectadors!==null&&f.espectadors<25000],
      [tr('Sense dades','Sin datos'),f=>f.espectadors===null]
    ];
    const bandCounts=bands.map(([n,test])=>data.filter(test).length);
    host.innerHTML = '<div class="pip-panorama-block">'+
      '<h2 class="pip-panorama-sub">'+tr('Procedència del reconeixement','Procedencia del reconocimiento')+'</h2>'+
      cap(tr('Festivals i acadèmies (1965–2025)','Festivales y academias (1965–2025)'))+
      '<div class="pip-panorama-mainbar" aria-label="'+tr('Distribució de 340 pel·lícules per origen','Distribución de 340 películas por origen')+'">'+legend.map(([k])=>'<div style="flex:'+counts[k]+';background:'+palette[k]+'" title="'+int(counts[k])+' · '+pct(counts[k],data.length)+'"></div>').join('')+'</div>'+
      '<div class="pip-panorama-three">'+legend.map(([k,l])=>'<div><span class="pip-panorama-num">'+int(counts[k])+'</span><span class="pip-panorama-perc">'+pct(counts[k],data.length)+'</span><span class="pip-panorama-label"><i style="background:'+palette[k]+'"></i>'+l+'</span></div>').join('')+'</div>'+
      '<p class="pip-panorama-nota">'+tr('32 pel·lícules coincideixen en tots dos circuits.','32 películas coinciden en ambos circuitos.')+'</p>'+
      cap(tr('Pel·lícules per institució (1965–2025)','Películas por institución (1965–2025)'))+
      '<div class="pip-panorama-institucions">'+instHTML+'</div>'+
      '<p class="pip-panorama-nota">'+tr('Els totals institucionals no són acumulables: una pel·lícula pot aparèixer en més d’una institució.','Los totales institucionales no son acumulables: una película puede figurar en más de una institución.')+'</p>'+source()+'</div>'+
      '<div class="pip-panorama-block">'+
      '<h2 class="pip-panorama-sub">'+tr('Evolució per dècades','Evolución por décadas')+'</h2>'+
      cap(tr('Pel·lícules amb reconeixement internacional per dècada (1965–2025)','Películas con reconocimiento internacional por década (1965–2025)'))+
      '<div class="pip-panorama-legend">'+legendHTML+'</div><div class="pip-panorama-canvas"><canvas id="pip-panorama-decades"></canvas></div>'+
      '<p class="pip-panorama-nota">'+tr('Dècada de producció de la pel·lícula, no de concessió del reconeixement. 1965–69 i 2020–25 són períodes parcials.','Década de producción de la película, no de concesión del reconocimiento. 1965–69 y 2020–25 son períodos parciales.')+'</p>'+source()+'</div>'+
      '<div class="pip-panorama-block">'+
      '<h2 class="pip-panorama-sub">'+tr('Espectadors a Espanya','Espectadores en España')+'</h2>'+
      cap(tr('Distribució per franges d’espectadors (1965–2025)','Distribución por franjas de espectadores (1965–2025)'))+
      '<div class="pip-panorama-canvas pip-panorama-canvas-public"><canvas id="pip-panorama-public"></canvas></div>'+
      '<p class="pip-panorama-nota">'+tr('340 pel·lícules distribuïdes segons els espectadors a les sales espanyoles.','340 películas distribuidas según sus espectadores en las salas españolas.')+'</p>'+source()+'</div>';
    const base={...options,scales:{x:{grid:{display:false},ticks:{font:{family:'Inter',size:11},color:'#666'}},y:{beginAtZero:true,stacked:true,grid:{color:'#eee'},ticks:{precision:0,font:{family:'Inter',size:11},color:'#777'}}}};
    const chartDecades = new Chart(document.getElementById('pip-panorama-decades'),{type:'bar',data:{labels:decades,datasets:legend.map(([k,l])=>({label:l,data:groups.map(g=>g.filter(f=>classificacio(f)===k).length),backgroundColor:palette[k],borderWidth:0,stack:'total'}))},options:{...base,plugins:{...options.plugins,tooltip:{...options.plugins.tooltip,callbacks:{label:c=>' '+c.dataset.label+': '+c.parsed.y}}},scales:{...base.scales,x:{...base.scales.x,stacked:true}}}});
    const chartPublic = new Chart(document.getElementById('pip-panorama-public'),{type:'bar',data:{labels:bands.map(x=>x[0]),datasets:[{data:bandCounts,backgroundColor:bands.map((x,i)=>i===0?'#87709f':i===8?'#bbb':'#9B2335'),borderWidth:0}]},options:{...options,plugins:{...options.plugins,tooltip:{...options.plugins.tooltip,callbacks:{label:c=>' '+int(c.parsed.y)+' · '+pct(c.parsed.y,data.length)}}},scales:{x:{grid:{display:false},ticks:{maxRotation:48,minRotation:45,font:{family:'Inter',size:11},color:'#666'}},y:{beginAtZero:true,grid:{color:'#eee'},ticks:{precision:0,font:{family:'Inter',size:11},color:'#777'}}}}});
    window.PiP_panoramaResize = () => { chartDecades.resize(); chartPublic.resize(); };
    if (document.getElementById('seccio-panorama')?.style.display === 'block') requestAnimationFrame(window.PiP_panoramaResize);
  }
  async function load() {
    const root=document.getElementById('pip-panorama-content'); if(!root)return;
    try {const base=typeof pipPath==='function'?pipPath('data/'):'data/';const [f,o,e]=await Promise.all(['festivals.json','oscar.json','efa.json'].map(async name=>{const r=await fetch(base+name);if(!r.ok)throw Error(name+' '+r.status);return r.json();}));draw(normRows(f,o,e));}
    catch(err){console.error('Panorama:',err);root.textContent=tr('No s’han pogut carregar les dades del panorama.','No se han podido cargar los datos del panorama.');}
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',load);else load();
})();
