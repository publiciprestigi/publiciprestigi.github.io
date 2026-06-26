/* Públic i Prestigi — Buscador global */
(function() {
  'use strict';

  const MD_FONTS = [
    // Part I
    { ruta: 'textos/part-i/fonts-i-eines.md',      titol: 'Fonts i eines',           part: 'I', seccio: 'intro',        url: 'part-i.html#intro' },
    { ruta: 'textos/part-i/mercat-poblacio.md',     titol: 'Mercat i població',        part: 'I', seccio: 'mercat',       url: 'part-i.html#mercat' },
    { ruta: 'textos/part-i/decades-intro.md',       titol: 'Resum per dècada',         part: 'I', seccio: 'decades',      url: 'part-i.html#decades' },
    { ruta: 'textos/part-i/decada-60s.md',          titol: 'Anys 60s',                 part: 'I', seccio: '60s',          url: 'part-i.html#60s' },
    { ruta: 'textos/part-i/decada-70s.md',          titol: 'Anys 70s',                 part: 'I', seccio: '70s',          url: 'part-i.html#70s' },
    { ruta: 'textos/part-i/decada-80s.md',          titol: 'Anys 80s',                 part: 'I', seccio: '80s',          url: 'part-i.html#80s' },
    { ruta: 'textos/part-i/decada-90s.md',          titol: 'Anys 90s',                 part: 'I', seccio: '90s',          url: 'part-i.html#90s' },
    { ruta: 'textos/part-i/decada-2000s.md',        titol: 'Anys 2000s',               part: 'I', seccio: '2000s',        url: 'part-i.html#2000s' },
    { ruta: 'textos/part-i/decada-2010s.md',        titol: 'Anys 2010s',               part: 'I', seccio: '2010s',        url: 'part-i.html#2010s' },
    { ruta: 'textos/part-i/decada-2020s.md',        titol: 'Anys 2020s',               part: 'I', seccio: '2020s',        url: 'part-i.html#2020s' },
    { ruta: 'textos/part-i/ranking-espectadors.md', titol: 'Rànquing per espectadors', part: 'I', seccio: 'espectadors',  url: 'part-i.html#espectadors' },
    { ruta: 'textos/part-i/ranking-penetracio.md',  titol: 'Rànquing per penetració',  part: 'I', seccio: 'penetracio',   url: 'part-i.html#penetracio' },
    { ruta: 'textos/part-i/ranking-quota.md',       titol: 'Rànquing per quota',       part: 'I', seccio: 'quota',        url: 'part-i.html#quota' },
    { ruta: 'textos/part-i/ranking-iic.md',         titol: 'Rànquing per IIC',         part: 'I', seccio: 'iic',          url: 'part-i.html#iic' },
    { ruta: 'textos/part-i/ranking-directors.md',   titol: 'Rànquing de directors',    part: 'I', seccio: 'directors',    url: 'part-i.html#directors' },
    // Part II
    { ruta: 'textos/part-ii/dades-i-criteri.md',    titol: 'Dades i criteri',          part: 'II', seccio: 'intro',       url: 'part-ii.html#intro' },
    { ruta: 'textos/part-ii/premiades-intro.md',    titol: 'Premiades per dècada',     part: 'II', seccio: 'premiades',   url: 'part-ii.html#premiades' },
    { ruta: 'textos/part-ii/festival-cannes.md',    titol: 'Festival de Cannes',       part: 'II', seccio: 'cannes',      url: 'part-ii.html#cannes' },
    { ruta: 'textos/part-ii/festival-venezia.md',   titol: 'Festival de Venècia',      part: 'II', seccio: 'venecia',     url: 'part-ii.html#venecia' },
    { ruta: 'textos/part-ii/festival-berlin.md',    titol: 'Festival de Berlín',       part: 'II', seccio: 'berlin',      url: 'part-ii.html#berlin' },
    { ruta: 'textos/part-ii/festival-sansebastia.md',titol:'Festival de Sant Sebastià',part: 'II', seccio: 'sansebastia', url: 'part-ii.html#sansebastia' },
    { ruta: 'textos/part-ii/ranking-espectadors.md',titol: 'Rànquing per espectadors', part: 'II', seccio: 'espectadors', url: 'part-ii.html#espectadors' },
    { ruta: 'textos/part-ii/ranking-directors.md',  titol: 'Rànquing de directors',   part: 'II', seccio: 'directors',   url: 'part-ii.html#directors' },
    // Part III
    { ruta: 'textos/part-iii/doble-corona.md',      titol: 'La doble corona',          part: 'III', seccio: 'doble-corona',    url: 'part-iii.html#doble-corona' },
    { ruta: 'textos/part-iii/bretxa.md',            titol: 'Evolució de la bretxa',    part: 'III', seccio: 'bretxa',          url: 'part-iii.html#bretxa' },
    { ruta: 'textos/part-iii/caza-alcarras.md',     titol: 'La caza vs. Alcarràs',     part: 'III', seccio: 'caza-alcarras',   url: 'part-iii.html#caza-alcarras' },
    { ruta: 'textos/part-iii/lleis.md',             titol: 'Cinema, lleis i tecnologia',part: 'III',seccio: 'lleis',            url: 'part-iii.html#lleis' },
    { ruta: 'textos/part-iii/dues-generacions.md',  titol: 'Dues generacions',         part: 'III', seccio: 'generacions',     url: 'part-iii.html#generacions' },
    { ruta: 'textos/part-iii/autor-industrial.md',  titol: "Cinema d'autor industrial",part: 'III', seccio: 'autor-industrial',url: 'part-iii.html#autor-industrial' },
    { ruta: 'textos/part-iii/conclusions.md',       titol: 'Conclusions',              part: 'III', seccio: 'conclusions',     url: 'part-iii.html#conclusions' },
  ];

  const PART_COLOR = { 'I': '#2a5582', 'II': '#9B2335', 'III': '#5a4a8a' };

  let index = [];
  let indexat = false;

  async function construirIndex() {
    if (indexat) return;

    // 1. Films
    try {
      const r = await fetch('data/films.json');
      const films = await r.json();
      films.forEach(f => {
        const dec = f.decada || '';
        const url = f.decada ? `part-i.html#${f.decada}` : 'part-i.html#espectadors';
        index.push({
          tipus: 'film',
          text: [f.titol, f.director, String(f.any), dec].join(' ').toLowerCase(),
          titol: f.titol,
          subtitol: `${f.director} · ${f.any}`,
          part: 'I',
          url: url,
        });
      });
    } catch(e) {}

    // 2. Festivals
    try {
      const r = await fetch('data/festivals.json');
      const festivals = await r.json();
      festivals.forEach(f => {
        const premi = f.premi || '';
        index.push({
          tipus: 'festival',
          text: [f.titol, f.director, String(f.any), f.festival, premi].join(' ').toLowerCase(),
          titol: f.titol,
          subtitol: `${f.director} · ${f.festival} ${f.any}${f.premiat ? ' ★' : ''}`,
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
          index.push({
            tipus: 'text',
            text: p.toLowerCase(),
            titol: md.titol,
            subtitol: p.trim().slice(0, 100) + (p.trim().length > 100 ? '…' : ''),
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

    return resultats.slice(0, 12);
  }

  function renderResultats(resultats, query) {
    const cont = document.getElementById('buscador-resultats');
    if (!cont) return;

    if (!resultats.length) {
      cont.innerHTML = '<p class="buscador-buit">Cap resultat per a "' + query + '"</p>';
      return;
    }

    cont.innerHTML = resultats.map(r => {
      const color = PART_COLOR[r.part] || '#555';
      const badge = `<span class="buscador-badge" style="color:${color}">Part ${r.part}</span>`;
      return `<a href="${r.url}" class="buscador-resultat" onclick="document.getElementById('buscador-overlay').style.display='none'">
        ${badge}
        <span class="buscador-resultat-titol">${r.titol}</span>
        <span class="buscador-resultat-sub">${r.subtitol}</span>
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
    if (overlay) observer.observe(overlay, { attributes: true, attributeFilter: ['style'] });

    const input = document.getElementById('buscador-input');
    if (input) {
      let timer;
      input.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          const q = input.value.trim();
          if (q.length < 2) {
            const cont = document.getElementById('buscador-resultats');
            if (cont) cont.innerHTML = '';
            return;
          }
          renderResultats(cerca(q), q);
        }, 200);
      });
    }
  });

})();
