/* Públic i Prestigi — Panorama de la Part II · maqueta v1.2 */
(function () {
  'use strict';
  const es = document.documentElement.lang === 'es';
  const tr = (ca, cast) => es ? cast : ca;
  const palette = {fest:'#9B2335',both:'#A05A29',acad:'#c8a000'};
  // Patró compartit: línies diagonals fines amb els dos colors institucionals.
  const stripeCSS = 'repeating-linear-gradient(135deg, #9B2335 0px, #9B2335 3px, #c8a000 3px, #c8a000 6px)';
  function stripeCanvas(ctx) {
    const tile=document.createElement('canvas');
    tile.width=12; tile.height=12;
    const c=tile.getContext('2d');
    c.fillStyle='#c8a000'; c.fillRect(0,0,12,12);
    c.strokeStyle='#9B2335'; c.lineWidth=5;
    c.beginPath();
    for (let k=-12;k<=24;k+=12) { c.moveTo(k,0); c.lineTo(k+12,12); }
    c.stroke();
    return ctx.createPattern(tile,'repeat');
  }
  const fade = hex => { const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return `rgba(${r},${g},${b},0.6)`; };
  const institutional = {'Cannes':'#9B2335','Venècia':'#B84555','Berlín':'#CC6977','Sant Sebastià':'#DA929A','Oscar':'#c8a000','EFA':'#C5AE63'};
  const key = f => f.any + '|' + String(f.titol).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
  const pct = (v,n) => (v*100/n).toLocaleString(es?'es-ES':'ca-ES',{maximumFractionDigits:1,minimumFractionDigits:1})+'%';
  const pctWhole = (v,n) => Math.round(v*100/n)+'%';
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
    const publicHost=document.getElementById('pip-panorama-espectadors');
    if (!host || !publicHost || typeof Chart==='undefined') return;
    if (data.length!==340) {host.textContent=tr('No s’ha pogut validar el conjunt de dades.','No se ha podido validar el conjunto de datos.');return;}
    const counts={fest:0,both:0,acad:0};
    for(const f of data) counts[classificacio(f)]++;
    const legend=[
      ['fest',tr('Només de festivals','Solo de festivales')],
      ['both',tr('Coincidents','Coincidentes')],
      ['acad',tr('Només d’acadèmies','Solo de academias')]
    ];
    const legendHTML = legend.map(([k,l])=>'<span class="pip-panorama-key"><i style="background:'+palette[k]+'"></i>'+l+'</span>').join('');
    const institutions=['Cannes','Venècia','Berlín','Sant Sebastià','Oscar','EFA'];
    const institute = institutions.map(n=>({name:n,n:data.filter(f=>f.institucions.has(n)).length}));
    const max=Math.max(...institute.map(x=>x.n));
    const instHTML=institute.map((a,i)=>'<div class="pip-panorama-inst-row"><span class="pip-panorama-inst-name">'+(es?{'Venècia':'Venecia','Sant Sebastià':'San Sebastián'}[a.name]||a.name:a.name)+'</span><div class="pip-panorama-inst-track"><div class="pip-panorama-inst-fill" style="background:'+institutional[a.name]+';width:'+(100*a.n/max)+'%"></div></div><span class="pip-panorama-inst-count"><strong>'+int(a.n)+'</strong></span></div>'+(i===3?'<div class="pip-panorama-inst-divider"></div>':'')).join('');
    const bands=[
      [tr('Més de 2,01M (Top 100)','Más de 2,01M (Top 100)'), f=>f.top],
      [tr('1M–2,01M','1M–2,01M'),f=>!f.top&&f.espectadors>=1000000],
      ['500K–1M',f=>!f.top&&f.espectadors>=500000&&f.espectadors<1000000],
      ['250K–500K',f=>f.espectadors>=250000&&f.espectadors<500000],
      ['100K–250K',f=>f.espectadors>=100000&&f.espectadors<250000],
      [tr('Menys de 100K','Menos de 100K'),f=>f.espectadors!==null&&f.espectadors<100000],
      [tr('Sense dades','Sin datos'),f=>f.espectadors===null]
    ];
    const bandCounts=bands.map(([n,test])=>data.filter(test).length);
    // Lectura ascendent: de menys públic al Top 100; sense dades, al final.
    const order=[5,4,3,2,1,0,6];
    const orderedBands=order.map(i=>bands[i]);
    const orderedCounts=order.map(i=>bandCounts[i]);
    const orderedGroups=order.map(i=>data.filter(bands[i][1]));
    if(orderedCounts.reduce((a,b)=>a+b,0)!==data.length) throw Error('Distribució incompleta');
    host.innerHTML = '<div class="pip-panorama-block">'+
      cap(tr('Els 340 films amb reconeixement internacional (1965–2025)','Las 340 películas con reconocimiento internacional (1965–2025)'))+
      '<div class="pip-panorama-switch" role="group" aria-label="'+tr('Vista de la procedència','Vista de la procedencia')+'">'+
      '<button class="pip-panorama-toggle is-active" type="button" data-pip-vista="organismes" aria-pressed="true">'+tr('Per festivals i acadèmies','Por festivales y academias')+'</button>'+
      '<button class="pip-panorama-toggle" type="button" data-pip-vista="circuits" aria-pressed="false">'+tr('Per grups','Por grupos')+'</button></div>'+
      '<div class="pip-panorama-view" data-pip-panel="circuits" hidden>'+
      '<div class="pip-circuit-key">'+legend.map(([k,l])=>'<div class="pip-circuit-key-item"><span class="pip-circuit-key-label"><i style="background:'+palette[k]+'"></i>'+l+'</span><span class="pip-circuit-key-stats"><strong>'+int(counts[k])+'</strong> '+tr('films','películas')+' <span>· '+pct(counts[k],data.length)+'</span></span></div>').join('')+'</div>'+
      '<div class="pip-panorama-mainbar" aria-label="'+tr('Distribució dels 340 films en tres grups','Distribución de las 340 películas en tres grupos')+'">'+legend.map(([k])=>'<div style="flex:'+counts[k]+';background:'+palette[k]+'" title="'+int(counts[k])+' '+tr('films','películas')+' · '+pct(counts[k],data.length)+'"></div>').join('')+'</div>'+
      '<p class="pip-panorama-nota">'+tr('Distribució dels films segons el circuit de reconeixement, als festivals, a les acadèmies o en tots dos.','Distribución de las películas según el circuito de reconocimiento, en los festivales, en las academias o en ambos.')+'</p></div>'+
      '<div class="pip-panorama-view" data-pip-panel="organismes">'+
      '<div class="pip-panorama-institucions">'+instHTML+'</div>'+
      '<p class="pip-panorama-nota">'+tr('Nombre de pel·lícules reconegudes en cadascun dels quatre festivals i les dues acadèmies.','Número de películas reconocidas en cada uno de los cuatro festivales y las dos academias.')+'</p></div>'+
      source()+'</div>';
    host.querySelectorAll('[data-pip-vista]').forEach(button => button.addEventListener('click', () => {
      const view=button.dataset.pipVista;
      host.querySelectorAll('[data-pip-vista]').forEach(b=>{
        const selected=b.dataset.pipVista===view;
        b.classList.toggle('is-active',selected);
        b.setAttribute('aria-pressed',String(selected));
      });
      host.querySelectorAll('[data-pip-panel]').forEach(panel=>{
        panel.hidden=panel.dataset.pipPanel!==view;
      });
    }));
    publicHost.innerHTML = '<div class="pip-panorama-block">'+
      cap(tr('Distribució dels 340 films per volum d’espectadors (1965–2025)','Distribución de las 340 películas por volumen de espectadores (1965–2025)'))+
      '<div class="pip-panorama-canvas pip-panorama-canvas-public"><canvas id="pip-panorama-public"></canvas></div>'+
      '<p class="pip-panorama-nota">'+tr('Cada barra representa el nombre de films de la franja.','Cada barra representa el número de películas de la franja.')+'</p>'+source()+'</div>';
    const chartPublic = new Chart(document.getElementById('pip-panorama-public'),{
      type:'bar',
      data:{
        labels:orderedBands.map(x=>x[0]),
        datasets:[
          {label:tr('Films','Películas'),
           data:orderedCounts.map((n,index)=>index===order.length-1?0:n),
           backgroundColor:orderedCounts.map((_,index)=>order[index]===0?'#5a4a8a':'#9B2335'),
           hoverBackgroundColor:orderedCounts.map((_,index)=>order[index]===0?'#5a4a8a':'#9B2335'),
           borderWidth:0,stack:'total',maxBarThickness:25},
          {label:tr('Sense dades','Sin datos'),
           data:orderedCounts.map((n,index)=>index===order.length-1?n:0),
           backgroundColor:'#bdbdbd',hoverBackgroundColor:'#bdbdbd',
           borderWidth:0,stack:'total',maxBarThickness:25}
        ]
      },
      options:{
        ...options,indexAxis:'y',
        interaction:{mode:'index',intersect:true},
        plugins:{...options.plugins,tooltip:{
          ...options.plugins.tooltip,
          mode:'index',intersect:true,
          filter:c=>c.parsed.x>0,
          callbacks:{
            title:items=>items[0]?.label||'',
            label:c=>{
              const n=c.parsed.x;
              if(c.dataIndex===order.length-1) return ' '+int(n)+' '+tr('films','películas');
              const total=orderedCounts[c.dataIndex];
              return ' '+int(n)+' '+tr('films','películas')+' ('+pctWhole(n,data.length)+')';
            },
            footer:()=>''
          }
        }},
        scales:{
          x:{stacked:true,beginAtZero:true,grid:{color:'#eee'},ticks:{precision:0,font:{family:'Inter',size:11},color:'#777'}},
          y:{stacked:true,grid:{display:false},ticks:{font:{family:'Inter',size:11},color:'#666'}}
        }
      },
      plugins:[]
    });
    window.PiP_panoramaResize = () => {};
    window.PiP_panoramaEspectadorsResize = () => { chartPublic.resize(); };
    if (document.getElementById('seccio-panorama')?.style.display === 'block') requestAnimationFrame(window.PiP_panoramaResize);
    if (document.getElementById('seccio-espectadors')?.style.display === 'block') requestAnimationFrame(window.PiP_panoramaEspectadorsResize);
  }
  async function load() {
    const root=document.getElementById('pip-panorama-content'); if(!root || !document.getElementById('pip-panorama-espectadors'))return;
    try {const base=typeof pipPath==='function'?pipPath('data/'):'data/';const [f,o,e]=await Promise.all(['festivals.json','oscar.json','efa.json'].map(async name=>{const r=await fetch(base+name);if(!r.ok)throw Error(name+' '+r.status);return r.json();}));draw(normRows(f,o,e));}
    catch(err){console.error('Panorama:',err);root.textContent=tr('No s’han pogut carregar les dades del panorama.','No se han podido cargar los datos del panorama.');}
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',load);else load();
})();
