/* Públic i Prestigi — Buscador global */
(function() {
  'use strict';

  const ES = document.documentElement.lang === 'es';
  const TXT = {
    noResults: ES ? 'Ningún resultado para' : 'Cap resultat per a',
    part: ES ? 'Parte' : 'Part',
  };
  const FESTIVAL_ES = { 'Venècia': 'Venecia', 'Sant Sebastià': 'San Sebastián', 'Berlín': 'Berlín', 'Cannes': 'Cannes' };

  const MD_FONTS = [
    // Part I
    { ruta: 'textos/part-i/fonts-i-eines.md',      titol: ES ? 'Fuentes y herramientas' : 'Fonts i eines',           part: 'I', seccio: 'intro',        url: 'part-i.html#intro' },
    { ruta: 'textos/part-i/mercat-poblacio.md',     titol: ES ? 'Mercado y población' : 'Mercat i població',        part: 'I', seccio: 'mercat',       url: 'part-i.html#mercat' },
    { ruta: 'textos/part-i/decades-intro.md',       titol: ES ? 'Resumen por década' : 'Resum per dècada',         part: 'I', seccio: 'decades',      url: 'part-i.html#decades' },
    { ruta: 'textos/part-i/decada-60s.md',          titol: ES ? 'Años 60s' : 'Anys 60s',                 part: 'I', seccio: '60s',          url: 'part-i.html#60s' },
    { ruta: 'textos/part-i/decada-70s.md',          titol: ES ? 'Años 70s' : 'Anys 70s',                 part: 'I', seccio: '70s',          url: 'part-i.html#70s' },
    { ruta: 'textos/part-i/decada-80s.md',          titol: ES ? 'Años 80s' : 'Anys 80s',                 part: 'I', seccio: '80s',          url: 'part-i.html#80s' },
    { ruta: 'textos/part-i/decada-90s.md',          titol: ES ? 'Años 90s' : 'Anys 90s',                 part: 'I', seccio: '90s',          url: 'part-i.html#90s' },
    { ruta: 'textos/part-i/decada-2000s.md',        titol: ES ? 'Años 2000s' : 'Anys 2000s',               part: 'I', seccio: '2000s',        url: 'part-i.html#2000s' },
    { ruta: 'textos/part-i/decada-2010s.md',        titol: ES ? 'Años 2010s' : 'Anys 2010s',               part: 'I', seccio: '2010s',        url: 'part-i.html#2010s' },
    { ruta: 'textos/part-i/decada-2020s.md',        titol: ES ? 'Años 2020s' : 'Anys 2020s',               part: 'I', seccio: '2020s',        url: 'part-i.html#2020s' },
    { ruta: 'textos/part-i/ranking-espectadors.md', titol: ES ? 'Ranking por espectadores' : 'Rànquing per espectadors', part: 'I', seccio: 'espectadors',  url: 'part-i.html#espectadors' },
    { ruta: 'textos/part-i/ranking-penetracio.md',  titol: ES ? 'Ranking por penetración' : 'Rànquing per penetració',  part: 'I', seccio: 'penetracio',   url: 'part-i.html#penetracio' },
    { ruta: 'textos/part-i/ranking-quota.md',       titol: ES ? 'Ranking por cuota' : 'Rànquing per quota',       part: 'I', seccio: 'quota',        url: 'part-i.html#quota' },
    { ruta: 'textos/part-i/ranking-iic.md',         titol: ES ? 'Ranking por IIC' : 'Rànquing per IIC',         part: 'I', seccio: 'iic',          url: 'part-i.html#iic' },
    { ruta: 'textos/part-i/ranking-directors.md',   titol: ES ? 'Ranking de directores' : 'Rànquing de directors',    part: 'I', seccio: 'directors',    url: 'part-i.html#directors' },
    // Part II
    { ruta: 'textos/part-ii/dades-i-criteri.md',    titol: ES ? 'Datos y criterio' : 'Dades i criteri',          part: 'II', seccio: 'intro',       url: 'part-ii.html#intro' },
    { ruta: 'textos/part-ii/premiades-intro.md',    titol: ES ? 'Premiadas por década' : 'Premiades per dècada',     part: 'II', seccio: 'premiades',   url: 'part-ii.html#premiades' },
    { ruta: 'textos/part-ii/festival-cannes.md',    titol: 'Festival de Cannes',       part: 'II', seccio: 'cannes',      url: 'part-ii.html#cannes' },
    { ruta: 'textos/part-ii/festival-venezia.md',   titol: ES ? 'Festival de Venecia' : 'Festival de Venècia',      part: 'II', seccio: 'venecia',     url: 'part-ii.html#venecia' },
    { ruta: 'textos/part-ii/festival-berlin.md',    titol: 'Festival de Berlín',       part: 'II', seccio: 'berlin',      url: 'part-ii.html#berlin' },
    { ruta: 'textos/part-ii/festival-sansebastia.md',titol: ES ? 'Festival de San Sebastián' : 'Festival de Sant Sebastià',part: 'II', seccio: 'sansebastia', url: 'part-ii.html#sansebastia' },
    { ruta: 'textos/part-ii/ranking-espectadors.md',titol: ES ? 'Ranking por espectadores' : 'Rànquing per espectadors', part: 'II', seccio: 'espectadors', url: 'part-ii.html#espectadors' },
    { ruta: 'textos/part-ii/ranking-directors.md',  titol: ES ? 'Ranking de directores' : 'Rànquing de directors',   part: 'II', seccio: 'directors',   url: 'part-ii.html#directors' },
    // Part III
    { ruta: 'textos/part-iii/doble-corona.md',      titol: 'La doble corona',          part: 'III', seccio: 'doble-corona',    url: 'part-iii.html#doble-corona' },
    { ruta: 'textos/part-iii/bretxa.md',            titol: ES ? 'Evolución de la brecha' : 'Evolució de la bretxa',    part: 'III', seccio: 'bretxa',          url: 'part-iii.html#bretxa' },
    { ruta: 'textos/part-iii/caza-alcarras.md',     titol: 'La caza vs. Alcarràs',     part: 'III', seccio: 'caza-alcarras',   url: 'part-iii.html#caza-alcarras' },
    { ruta: 'textos/part-iii/lleis.md',             titol: ES ? 'Cine, leyes y tecnología' : 'Cinema, lleis i tecnologia',part: 'III',seccio: 'lleis',            url: 'part-iii.html#lleis' },
    { ruta: 'textos/part-iii/dues-generacions.md',  titol: ES ? 'Dos generaciones' : 'Dues generacions',         part: 'III', seccio: 'generacions',     url: 'part-iii.html#generacions' },
    { ruta: 'textos/part-iii/autor-industrial.md',  titol: ES ? "Cine de autor industrial" : "Cinema d'autor industrial",part: 'III', seccio: 'autor-industrial',url: 'part-iii.html#autor-industrial' },
    { ruta: 'textos/part-iii/mapa-canon.md',        titol: ES ? 'El mapa del canon' : 'El mapa del cànon',        part: 'III', seccio: 'mapa-canon',      url: 'part-iii.html#mapa-canon' },
    { ruta: 'textos/part-iii/conclusions.md',       titol: ES ? 'Conclusiones' : 'Conclusions',              part: 'III', seccio: 'conclusions',     url: 'part-iii.html#conclusions' },
  ];

  const PART_COLOR = { 'I': '#2a5582', 'II': '#9B2335', 'III': '#6B3FA0' };

  let index = [];
  let indexat = false;

  async function construirIndex() {
    if (indexat) return;

    // 1. Films
    try {
      const r = await fetch(pipPath('data/films.json'));
      const films = await r.json();
      films.forEach(f => {
        const dec = f.decada || '';
        const url = f.decada ? `part-i.html#${f.decada}` : 'part-i.html#espectadors';
        index.push({
          tipus: 'film',
          text: [f.titol, f.director, String(f.any), dec, ES ? (f.context_text_es || f.context_text || '') : (f.context_text || '')].join(' ').toLowerCase(),
          titol: f.titol,
          subtitol: `${f.director} · ${f.any}`,
          part: 'I',
          url: url,
        });
      });
    } catch(e) {}

    // 2. Festivals
    try {
      const r = await fetch(pipPath('data/festivals.json'));
      const festivals = await r.json();
      festivals.forEach(f => {
        const premi = ES ? (f.premi_es || f.premi || '') : (f.premi || '');
        index.push({
          tipus: 'festival',
          text: [f.titol, f.director, String(f.any), ES ? (FESTIVAL_ES[f.festival] || f.festival) : f.festival, premi].join(' ').toLowerCase(),
          titol: f.titol,
          subtitol: `${f.director} · ${(ES ? (FESTIVAL_ES[f.festival] || f.festival) : f.festival)} ${f.any}${f.premiat ? ' ★' : ''}`,
          part: 'II',
          url: `part-ii.html#${f.festival === 'Cannes' ? 'cannes' : f.festival === 'Berlín' ? 'berlin' : f.festival === 'Venècia' ? 'venecia' : 'sansebastia'}`,
        });
      });
    } catch(e) {}

    // 3. Textos MD
    await Promise.all(MD_FONTS.map(async (md) => {
      try {
        const r = await fetch(md.ruta);
        if (!r.ok) return;
        const text = await r.text();
        // Netejar markdown: treure #, *, etc.
        const net = text.replace(/^#+\s*/gm, '').replace(/[*_`\[\]]/g, '').replace(/<!--.*?-->/gs, '');
        // Dividir en fragments de ~200 paraules per a millors resultats
        const paragrafs = net.split(/\n{2,}/).filter(p => p.trim().length > 30);
        paragrafs.forEach(p => {
          const pNet = p.trim();
          index.push({
            tipus: 'text',
            text: pNet.toLowerCase(),
            titol: md.titol,
            subtitol: pNet.slice(0, 100) + (pNet.length > 100 ? '…' : ''),
            subtitolRaw: pNet,
            part: md.part,
            url: md.url,
          });
        });
      } catch(e) {}
    }));

    indexat = true;
  }

  function cerca(query) {
    const q = query.toLowerCase().trim();
    if (q.length < 2) return [];

    const termes = q.split(/\s+/);
    const resultats = [];
    const vistos = new Set();

    index.forEach(entry => {
      const matches = termes.every(t => entry.text.includes(t));
      if (!matches) return;

      // Deduplicar per url+titol
      const clau = entry.url + '|' + entry.titol;
      if (vistos.has(clau)) return;
      vistos.add(clau);

      resultats.push(entry);
    });

    // Prioritzar films/festivals per damunt de textos
    resultats.sort((a, b) => {
      const prio = { film: 0, festival: 1, text: 2 };
      return prio[a.tipus] - prio[b.tipus];
    });

    return resultats;
  }

  function destacaText(text, query) {
    // Troba el fragment més rellevant i posa la query en negreta
    const q = query.toLowerCase();
    const idx = text.toLowerCase().indexOf(q.split(' ')[0]);
    let fragment;
    if (idx >= 0) {
      const start = Math.max(0, idx - 60);
      const end = Math.min(text.length, idx + q.length + 120);
      fragment = (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
    } else {
      fragment = text.slice(0, 180) + (text.length > 180 ? '…' : '');
    }
    // Remarcar cada terme de la query
    const termes = query.split(/\s+/).filter(t => t.length > 1);
    termes.forEach(t => {
      const re = new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      fragment = fragment.replace(re, '<mark>$1</mark>');
    });
    return fragment;
  }

  function renderResultats(resultats, query) {
    const cont = document.getElementById('buscador-resultats');
    if (!cont) return;

    if (!resultats.length) {
      cont.innerHTML = '<p class="buscador-buit">' + TXT.noResults + ' "' + query + '"</p>';
      return;
    }

    cont.innerHTML = resultats.map(r => {
      const color = PART_COLOR[r.part] || '#555';
      const badge = `<span class="buscador-badge" style="color:${color}">${TXT.part} ${r.part} · ${r.titol}</span>`;
      const sub = r.tipus === 'text'
        ? destacaText(r.subtitolRaw || r.subtitol, query)
        : r.subtitol;
      return `<a href="${r.url}" class="buscador-resultat" onclick="document.getElementById('buscador-overlay').style.display='none'">
        ${badge}
        <span class="buscador-resultat-sub">${sub}</span>
      </a>`;
    }).join('');
  }

  // Inicialitzar quan el buscador s'obre
  let initiat = false;
  const observer = new MutationObserver(() => {
    const overlay = document.getElementById('buscador-overlay');
    if (overlay && overlay.style.display !== 'none' && !initiat) {
      initiat = true;
      construirIndex();
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('buscador-overlay');
    if (overlay) {
      observer.observe(overlay, { attributes: true, attributeFilter: ['style'] });
      // Restaurar última cerca quan s'obre
      const origToggle = window.toggleBuscador;
      if (origToggle) {
        window.toggleBuscador = function() {
          origToggle();
          const o = document.getElementById('buscador-overlay');
          const inp = document.getElementById('buscador-input');
          if (o && o.style.display !== 'none' && inp) {
            const q = sessionStorage.getItem('pip_cerca') || '';
            if (q && !inp.value) {
              inp.value = q;
              inp.dispatchEvent(new Event('input'));
            }
          }
        };
      }
    }

    const input = document.getElementById('buscador-input');
    if (input) {
      let timer;
      input.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          const q = input.value.trim();
          sessionStorage.setItem('pip_cerca', q);
          if (q.length < 2) {
            const cont = document.getElementById('buscador-resultats');
            if (cont) cont.innerHTML = '';
            return;
          }
          renderResultats(cerca(q), q);
        }, 200);
      });
    }
    // Restaurar buscador quan l'usuari torna enrere al navegador
    window.addEventListener('popstate', function() {
      const q = sessionStorage.getItem('pip_cerca') || '';
      if (q.length >= 2) {
        setTimeout(function() {
          const toggleFn = window.toggleBuscador;
          const overlay = document.getElementById('buscador-overlay');
          const inp = document.getElementById('buscador-input');
          if (overlay && overlay.style.display === 'none' && toggleFn) {
            toggleFn();
          }
          if (inp && !inp.value) {
            inp.value = q;
            inp.dispatchEvent(new Event('input'));
          }
        }, 100);
      }
    });

  });

})();
