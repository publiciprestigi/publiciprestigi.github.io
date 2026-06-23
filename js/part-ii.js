/* Públic i Prestigi — Part II: Prestigi */

let festivalsData = [];

const FC = {
  'Cannes':       '#9B2335',
  'Berlín':       '#1976D2',
  'Venècia':      '#2E7D5E',
  'Sant Sebastià':'#E07B2A',
};

async function carregarFestivals() {
  try {
    const r = await fetch('data/festivals.json');
    festivalsData = await r.json();
    construirPremiades();
    construirIntroduccio();
    construirFestival('Cannes',       'taula-cannes');
    construirFestival('Venècia',      'taula-venezia');
    construirFestival('Berlín',       'taula-berlin');
    construirFestival('Sant Sebastià','taula-sansebastia');
    construirRànquingEspectadors();
    construirRànquingDirectors();
    if (window.PiP_aplicaFade) window.PiP_aplicaFade();
  } catch(e) { console.error('Error:', e); }
}

const fmt = n => n == null ? '—' : n.toLocaleString('ca-ES');

function calcularMediana(films) {
  const valors = films
    .map(f => f.espectadors)
    .filter(v => v != null && v > 0)
    .sort((a, b) => a - b);
  if (!valors.length) return null;
  const mid = Math.floor(valors.length / 2);
  return valors.length % 2 !== 0 ? valors[mid] : Math.round((valors[mid-1] + valors[mid]) / 2);
}

function titolFilm(f) {
  return `<strong><em>${f.titol}</em></strong> <span class="film-any">(${f.any})</span>`;
}

function nomFest(festival) {
  return `<strong style="color:${FC[festival]}">${festival}</strong>`;
}

function getDecada(any) {
  if (any <= 1969) return '60s';
  if (any <= 1979) return '70s';
  if (any <= 1989) return '80s';
  if (any <= 1999) return '90s';
  if (any <= 2009) return '2000s';
  if (any <= 2019) return '2010s';
  return '2020s';
}

/* ============================================================
   PREMIADES PER DÈCADA
   ============================================================ */
function construirPremiades() {
  const cont = document.getElementById('taula-premiades');
  if (!cont) return;

  const DEC_LABELS = {
    '60s':'Anys 1965–1969','70s':'Anys 70','80s':'Anys 80','90s':'Anys 90',
    '2000s':'Anys 2000–2009','2010s':'Anys 2010–2019','2020s':'Anys 2020–2025'
  };

  const premiades = festivalsData.filter(f => f.premiat).sort((a,b) => a.any - b.any);

  let html = '';
  ['60s','70s','80s','90s','2000s','2010s','2020s'].forEach(dec => {
    const films = premiades.filter(f => getDecada(f.any) === dec);
    if (!films.length) return;
    html += `
      <h3 class="subtitol-ranking-gran" style="margin-top:28px">${DEC_LABELS[dec]}</h3>
      <table class="taula-festivals">
        <thead><tr>
          <th style="width:32%">Títol</th>
          <th class="col-subtil" style="width:18%">Director</th>
          <th style="width:100px">Festival</th>
          <th style="width:36%">Premi</th>
        </tr></thead>
        <tbody>
          ${films.map((f,i) => `<tr style="background:${i%2===0?'#ffffff':'#f7f7f7'};border-bottom:2px solid #fff">
            <td>${titolFilm(f)}</td>
            <td class="col-subtil">${f.director}</td>
            <td>${nomFest(f.festival)}</td>
            <td class="col-subtil" style="font-size:0.82rem">${f.premi || '—'}</td>
          </tr>`).join('')}
        </tbody>
      </table>`;
  });
  cont.innerHTML = html;

  // ── Càlcul automàtic des de festivalsData ──
  const DECADES = ['60s','70s','80s','90s','2000s','2010s','2020s'];
  const FESTS   = ['Cannes','Venècia','Berlín','Sant Sebastià'];
  const COLORS  = { 'Cannes':'#9B2335','Berlín':'#1976D2','Venècia':'#2E7D5E','Sant Sebastià':'#E07B2A' };
  const HOVER   = { 'Cannes':'rgba(155,35,53,0.5)','Berlín':'rgba(25,118,210,0.5)','Venècia':'rgba(46,125,94,0.5)','Sant Sebastià':'rgba(224,123,42,0.5)' };

  // Màxims guardons
  const MAXIMS2 = [
    { nom: "Palma d'Or",  color: '#9B2335', patro: /palma d.or/i },
    { nom: "Os d'Or",     color: '#1976D2', patro: /os d.or/i },
    { nom: "Lleó d'Or",   color: '#2E7D5E', patro: /lle[oó] d.or/i },
    { nom: "Conxa d'Or",  color: '#E07B2A', patro: /conxa d.or/i },
  ];

  const tPremiades = festivalsData.filter(f => f.premiat);

  // Comptadors per festival
  const perFest = {};
  FESTS.forEach(f => { perFest[f] = 0; });
  tPremiades.forEach(f => { if (perFest[f.festival] !== undefined) perFest[f.festival]++; });
  const totalPremiades = tPremiades.length;

  // Màxims guardons
  const comptMaxims = {};
  MAXIMS2.forEach(m => { comptMaxims[m.nom] = 0; });
  tPremiades.forEach(f => {
    MAXIMS2.forEach(m => { if (f.premi && m.patro.test(f.premi)) comptMaxims[m.nom]++; });
  });
  const totalMaxims = Object.values(comptMaxims).reduce((s,v) => s+v, 0);

  // Dades gràfic per dècada i festival
  const graficData = {};
  FESTS.forEach(fest => {
    graficData[fest] = DECADES.map(dec =>
      tPremiades.filter(f => f.festival === fest && getDecada(f.any) === dec).length
    );
  });

  // Generar cards festivals
  const cardsFest = FESTS.map(fest => `
    <div style="background:#f7f7f7;border-radius:6px;padding:12px 10px;text-align:center;">
      <div style="font-size:12px;color:${COLORS[fest]};font-weight:500;margin-bottom:4px;">${fest}</div>
      <div style="font-size:24px;font-weight:500;color:#363737;">${perFest[fest]}</div>
    </div>`).join('');

  // Generar cards màxims
  const cardsMaxims = MAXIMS2.map(m => `
    <div style="background:#fcefc0;border-radius:6px;padding:12px 10px;text-align:center;">
      <div style="font-size:12px;color:${m.color};font-weight:500;margin-bottom:4px">${m.nom}</div>
      <div style="font-size:24px;font-weight:500;color:#363737;">${comptMaxims[m.nom]}</div>
    </div>`).join('');

  const graficDiv = document.createElement('div');
  graficDiv.innerHTML = `
    <div style="margin-top:0;padding-top:0;border-top:none">
      <p style="text-align:center;font-size:15px;font-weight:700;color:#363737;margin-bottom:16px;margin-top:0">Evolució premiades per dècada (1965–2025)</p>
      <div style="display:flex;flex-wrap:wrap;gap:16px;margin-bottom:12px;font-size:12px;color:#888;">
        ${FESTS.map(f => `<span style="display:flex;align-items:center;gap:6px;"><span style="width:10px;height:10px;border-radius:2px;background:${COLORS[f]};display:inline-block;"></span>${f}</span>`).join('')}
      </div>
      <div style="position:relative;width:100%;height:260px;">
        <canvas id="grafic-premis-decades"></canvas>
      </div>
      <p class="grafic-peu">Nombre de films premiats per festival i dècada.</p>

      <p style="text-align:center;font-size:15px;font-weight:700;color:#363737;margin-bottom:16px;margin-top:36px;padding-top:28px;border-top:1px solid #e0e0e0">Premiades per festival (1965–2025)</p>
      <div style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;margin-bottom:24px;">
        ${cardsFest}
        <div style="background:#f7f7f7;border-radius:6px;padding:12px 10px;text-align:center;border:1px solid #ddd;">
          <div style="font-size:12px;color:#888;font-weight:500;margin-bottom:4px;">Total</div>
          <div style="font-size:24px;font-weight:500;color:#363737;">${totalPremiades}</div>
        </div>
      </div>

      <p style="text-align:center;font-size:15px;font-weight:700;color:#363737;margin-bottom:16px;margin-top:36px;padding-top:28px;border-top:1px solid #e0e0e0">Màxims guardons (1965–2025)</p>
      <div style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;margin-bottom:8px;">
        ${cardsMaxims}
        <div style="background:#f7f7f7;border-radius:6px;padding:12px 10px;text-align:center;border:1px solid #ddd;">
          <div style="font-size:12px;color:#888;font-weight:500;margin-bottom:4px;">Total</div>
          <div style="font-size:24px;font-weight:500;color:#363737;">${totalMaxims}</div>
        </div>
      </div>
    </div>`;
  const resDiv = document.getElementById('taula-resum-premis');
  if (resDiv) resDiv.appendChild(graficDiv);
  else cont.appendChild(graficDiv);

  setTimeout(() => {
    const canvas = document.getElementById('grafic-premis-decades');
    if (!canvas || !window.Chart) return;
    new window.Chart(canvas, {
      type: 'bar',
      data: {
        labels: DECADES,
        datasets: FESTS.map(fest => ({
          label: fest,
          data: graficData[fest],
          backgroundColor: COLORS[fest],
          hoverBackgroundColor: HOVER[fest],
          borderWidth: 0,
        }))
      },
      options: {
        responsive: true, maintainAspectRatio: false, animation: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            filter: (item) => item.raw > 0,
            callbacks: {
              label: (item) => ` ${item.dataset.label}: ${item.raw}`,
              footer: (items) => {
                if (items.length <= 1) return '';
                return 'Total dècada: ' + items.reduce((s,i) => s+i.raw, 0);
              }
            }
          }
        },
        scales: {
          x: { stacked: true, grid: { display: false }, ticks: { font: { size: 12 } } },
          y: { stacked: true, beginAtZero: true,
               title: { display: false },
               ticks: { stepSize: 2, font: { size: 12 } }, grid: { color: 'rgba(0,0,0,0.06)' } }
        }
      }
    });
  }, 100);
}

/* ============================================================
   INTRODUCCIÓ — el text ve del sistema Markdown (textos.js)
   ============================================================ */
function construirIntroduccio() {
  // No fa res — el contingut el carrega textos.js des de part-ii/dades-i-criteri.md
}

/* ============================================================
   TAULES PER FESTIVAL
   ============================================================ */
function construirFestival(festival, seccioId) {
  const cont = document.getElementById(seccioId);
  if (!cont) return;

  const films   = festivalsData.filter(f => f.festival === festival).sort((a,b) => a.any - b.any);
  const color   = FC[festival];
  const total   = films.length;
  const nPremis = films.filter(f => f.premiat).length;

  const COLORS_FEST = {
    'Cannes':        'rgba(155, 35, 53, 0.07)',
    'Berlín':        'rgba(25, 118, 210, 0.07)',
    'Venècia':       'rgba(46, 125, 94, 0.07)',
    'Sant Sebastià': 'rgba(224, 123, 42, 0.07)',
  };
  const bgFest = COLORS_FEST[festival] || '#fff';

  const files = films.map((f, i) => {
    const isTop  = !!f.top100_pos;
    const premi  = f.premiat ? `<span class="estrella">★</span> ${f.premi || ''}` : (f.premi || '—');
    const top100 = isTop ? `#${f.top100_pos}` : '—';
    const decada = (f.decada && f.decada !== '—') ? f.decada : '—';
    return `<tr style="background:${bgFest};border-bottom:2px solid #fff">
      <td class="col-subtil col-pos">${i+1}</td>
      <td>${titolFilm(f)}</td>
      <td class="col-subtil">${f.director}</td>
      <td class="col-premi">${premi}</td>
      <td class="col-center col-subtil">${top100}</td>
      <td class="col-subtil col-decada">${decada}</td>
      <td class="col-num col-subtil">${fmt(f.espectadors)}</td>
    </tr>`;
  }).join('');

  cont.innerHTML = `
    <p class="festival-resum" style="border-left:3px solid ${color};padding-left:12px;margin-bottom:20px">
      <strong>${total} participacions documentades</strong> · <strong>${nPremis} premiades</strong>
    </p>
    <table class="taula-festivals">
      <thead><tr>
        <th class="col-pos">#</th>
        <th style="width:40%">Títol</th>
        <th class="col-subtil" style="width:12%">Director</th>
        <th style="width:22%">Premi / Nota</th>
        <th class="col-center" style="width:60px">Top 100</th>
        <th class="col-subtil" style="width:75px">Dècada</th>
        <th class="col-num" style="width:85px">Espectadors</th>
      </tr></thead>
      <tbody>${files}</tbody>
    </table>`;
}

/* ============================================================
   RÀNQUING PER ESPECTADORS
   ============================================================ */
function construirRànquingEspectadors() {
  const cont = document.getElementById('taula-ranking-espectadors');
  if (!cont) return;

  let html = '';
  ['Cannes','Venècia','Berlín','Sant Sebastià'].forEach(festival => {
    const films = festivalsData.filter(f => f.festival === festival && f.espectadors)
      .sort((a,b) => b.espectadors - a.espectadors);
    const top10  = films.slice(0, 10);
    const resta  = films.slice(10);
    const cid    = `resp-${festival.replace(/\s/g,'-')}`;
    const color  = FC[festival];

    const mediana = calcularMediana(films);
    const medianaTxt = mediana ? `Mediana de tots els films seleccionats: ${fmt(mediana)} espectadors` : '';

    const fila = (f, i) => {
      const bg = i % 2 === 0 ? '#ffffff' : '#f7f7f7';
      return `<tr style="background:${bg};border-bottom:2px solid #fff">
        <td class="col-pos">${i+1}</td>
        <td>${titolFilm(f)}</td>
        <td class="col-subtil">${f.director}</td>
        <td class="col-center">${f.premiat ? '<span class="estrella">★</span>' : ''}</td>
        <td class="col-center col-subtil">${f.top100_pos ? '#' + f.top100_pos : '—'}</td>
        <td class="col-num col-subtil">${fmt(f.espectadors)}</td>
      </tr>`;
    };

    html += `
      <h2 class="subtitol-festival-ranking" style="margin-top:32px;color:${color}">${festival}</h2>
      <p class="festival-mediana">${medianaTxt}</p>
      <table class="taula-festivals">
        <thead><tr>
          <th class="col-pos">#</th>
          <th>Títol</th>
          <th class="col-subtil">Director</th>
          <th class="col-center" style="width:50px">Premi</th>
          <th class="col-center" style="width:65px">Top 100</th>
          <th class="col-num" style="text-align:right">Espectadors</th>
        </tr></thead>
        <tbody>
          ${top10.map((f,i) => fila(f,i)).join('')}
          ${resta.length ? `
            <tr class="fila-boto-context">
              <td colspan="6">
                <button class="btn-context" onclick="expandirRankEsp('${cid}',this)">
                  + Veure tots els ${films.length} films
                </button>
              </td>
            </tr>
            ${resta.map((f,i) => fila(f,i+10).replace('<tr ','<tr style="display:none" class="fila-extra-'+cid+' ')).join('')}
          ` : ''}
        </tbody>
      </table>`;
  });
  cont.innerHTML = html;
}

window.expandirRankEsp = function(cid, btn) {
  const files = document.querySelectorAll(`.fila-extra-${cid}`);
  const visible = files.length > 0 && files[0].style.display !== 'none';
  files.forEach(tr => tr.style.display = visible ? 'none' : '');
  btn.textContent = visible ? '+ Veure tots els films' : '− Amagar';
};

/* ============================================================
   RÀNQUING DIRECTORS
   ============================================================ */
function construirRànquingDirectors() {
  const cont25 = document.getElementById('taula-ranking-directors-top25');
  const cont10 = document.getElementById('taula-ranking-directors-top10');
  const cont3  = document.getElementById('taula-ranking-directors-top3');
  if (!cont25) return;

  // Àlies per agrupar membres de col·lectius sota un representant
  const ALIASES_DIRS = [
    { clau: 'Arregi', nom: 'Aitor Arregi' },
  ];

  const dirs = {};
  festivalsData.forEach(f => {
    let d = f.director;
    for (const alias of ALIASES_DIRS) {
      if (f.director.includes(alias.clau)) { d = alias.nom; break; }
    }
    if (!dirs[d]) dirs[d] = {
      nom: d, total_sel: 0, total_premis: 0,
      c_sel:0, c_pr:0, b_sel:0, b_pr:0, v_sel:0, v_pr:0, s_sel:0, s_pr:0,
    };
    dirs[d].total_sel++;
    if (f.premiat) dirs[d].total_premis++;
    if      (f.festival==='Cannes')        { dirs[d].c_sel++; if(f.premiat) dirs[d].c_pr++; }
    else if (f.festival==='Berlín')        { dirs[d].b_sel++; if(f.premiat) dirs[d].b_pr++; }
    else if (f.festival==='Venècia')       { dirs[d].v_sel++; if(f.premiat) dirs[d].v_pr++; }
    else if (f.festival==='Sant Sebastià') { dirs[d].s_sel++; if(f.premiat) dirs[d].s_pr++; }
  });

  const llista = Object.values(dirs).sort((a,b) =>
    b.total_sel-a.total_sel || b.total_premis-a.total_premis ||
    b.c_sel-a.c_sel || b.v_sel-a.v_sel || b.b_sel-a.b_sel
  );

  // CORREGIT: sempre mostra ★N, fins i tot quan N=1
  const cel = (sel, pr, color) => {
    if (!sel) return `<td class="col-center col-subtil">—</td>`;
    const pr_txt = pr ? ` <span style="color:${color}">★${pr}</span>` : '';
    return `<td class="col-center">${sel}${pr_txt}</td>`;
  };

  const celTotal = (pr) => {
    if (!pr) return `<td class="col-center col-subtil">—</td>`;
    return `<td class="col-center">★${pr}</td>`;
  };

  /* --- TOP 25 TOTS ELS FESTIVALS --- */
  const top25 = llista.slice(0, 25);
  let _dirCtr = 0;

  const filmsDir = (d) => {
    const fests = ['Cannes','Venècia','Berlín','Sant Sebastià'];
    let html = '';
    const aliasClau25 = ALIASES_DIRS.find(a => a.nom === d.nom)?.clau;
    fests.forEach(fest => {
      const films = festivalsData.filter(f => f.festival === fest &&
        (aliasClau25 ? f.director.includes(aliasClau25) : f.director === d.nom));
      if (!films.length) return;
      html += `<span class="dir-films-grup" style="color:${FC[fest]}">${fest}</span>`;
      html += films.map(f => {
        const pr = f.premiat ? `<span class="estrella">★</span> ` : '';
        return `<strong><em>${f.titol}</em></strong> ${pr}<span class="film-any">(${f.any})</span>`;
      }).join(' · ');
      html += ' ';
    });
    return html;
  };

  const fila25 = (d, i) => {
    const id = `d25-${++_dirCtr}`;
    const bg25 = i % 2 === 0 ? '#ffffff' : '#f7f7f7';
    return `<tr style="background:${bg25};border-bottom:2px solid #fff">
      <td class="col-pos">${i+1}</td>
      <td>
        <strong>${d.nom}</strong>
        <div id="${id}" class="dir-films-list" style="display:none">${filmsDir(d)}</div>
      </td>
      <td class="col-center">${d.total_sel}</td>
      ${celTotal(d.total_premis)}
      ${cel(d.c_sel, d.c_pr, FC['Cannes'])}
      ${cel(d.v_sel, d.v_pr, FC['Venècia'])}
      ${cel(d.b_sel, d.b_pr, FC['Berlín'])}
      ${cel(d.s_sel, d.s_pr, FC['Sant Sebastià'])}
      <td class="col-center">
        <button class="btn-films-dir" onclick="toggleDirFilms('${id}',this)">+</button>
      </td>
    </tr>`;
  };

  /* --- TOP 10 TRES GRANS --- */
  const top10_3 = Object.values(dirs)
    .filter(d => d.c_sel+d.b_sel+d.v_sel > 0)
    .sort((a,b) =>
      (b.c_sel+b.v_sel+b.b_sel)-(a.c_sel+a.v_sel+a.b_sel) ||
      (b.c_pr+b.b_pr+b.v_pr)-(a.c_pr+a.b_pr+a.v_pr)
    ).slice(0, 10);

  const filmsDir3 = (d) => {
    const fests = ['Cannes','Venècia','Berlín'];
    let html = '';
    fests.forEach(fest => {
      const films = festivalsData.filter(f => f.festival === fest && f.director === d.nom);
      if (!films.length) return;
      html += `<span class="dir-films-grup" style="color:${FC[fest]}">${fest}</span>`;
      html += films.map(f => {
        const pr = f.premiat ? `<span class="estrella">★</span> ` : '';
        return `<strong><em>${f.titol}</em></strong> ${pr}<span class="film-any">(${f.any})</span>`;
      }).join(' · ');
      html += ' ';
    });
    return html;
  };

  const fila3 = (d, i) => {
    const id = `d3-${++_dirCtr}`;
    const bg3 = i % 2 === 0 ? '#ffffff' : '#f7f7f7';
    return `<tr style="background:${bg3};border-bottom:2px solid #fff">
      <td class="col-pos">${i+1}</td>
      <td>
        <strong>${d.nom}</strong>
        <div id="${id}" class="dir-films-list" style="display:none">${filmsDir3(d)}</div>
      </td>
      <td class="col-center">${d.c_sel+d.b_sel+d.v_sel}</td>
      ${celTotal(d.c_pr+d.b_pr+d.v_pr)}
      ${cel(d.c_sel, d.c_pr, FC['Cannes'])}
      ${cel(d.v_sel, d.v_pr, FC['Venècia'])}
      ${cel(d.b_sel, d.b_pr, FC['Berlín'])}
      <td class="col-center">
        <button class="btn-films-dir" onclick="toggleDirFilms('${id}',this)">+</button>
      </td>
    </tr>`;
  };

  /* --- TOP 3 MÉS PREMIATS PER FESTIVAL --- */
  // Àlies: agrupa directors d'un col·lectiu sota un representant
  const ALIASES_TOP3 = [
    { clau: 'Arregi', nom: 'Aitor Arregi' },
  ];

  const top3PerFest = (festival, key_sel, key_pr) => {
    const dirsAlies = {};
    festivalsData.filter(f => f.festival === festival).forEach(f => {
      let nomDir = f.director;
      for (const alias of ALIASES_TOP3) {
        if (f.director.includes(alias.clau)) { nomDir = alias.nom; break; }
      }
      if (!dirsAlies[nomDir]) dirsAlies[nomDir] = { nom: nomDir, [key_sel]: 0, [key_pr]: 0 };
      dirsAlies[nomDir][key_sel]++;
      if (f.premiat) dirsAlies[nomDir][key_pr]++;
    });
    return Object.values(dirsAlies)
      .filter(d => d[key_pr] > 0)
      .sort((a,b) => b[key_pr]-a[key_pr] || b[key_sel]-a[key_sel])
      .slice(0, 3);
  };

  const top3c = top3PerFest('Cannes','c_sel','c_pr');
  const top3b = top3PerFest('Berlín','b_sel','b_pr');
  const top3v = top3PerFest('Venècia','v_sel','v_pr');
  const top3s = top3PerFest('Sant Sebastià','s_sel','s_pr');

  // CORREGIT: sempre mostra ★N fins i tot quan N=1
  const celTop3 = (d, key_pr, color) => {
    if (!d) return '<td class="col-subtil">—</td>';
    const pr = d[key_pr] ? ` <span style="color:${color}">★${d[key_pr]}</span>` : '';
    return `<td>${d.nom}${pr}</td>`;
  };

  const celTop3Exp = (d, key_pr, color, fest, id) => {
    if (!d) return '<td class="col-subtil">—</td>';
    const pr = d[key_pr] ? ` <span style="color:${color}">★${d[key_pr]}</span>` : '';
    // Si és un àlies, buscar per la clau original (ex: "Arregi")
    const aliasClau = ALIASES_TOP3.find(a => a.nom === d.nom)?.clau;
    const films = festivalsData
      .filter(f => f.festival === fest && f.premiat &&
        (aliasClau ? f.director.includes(aliasClau) : f.director === d.nom))
      .map(f => `<strong><em>${f.titol}</em></strong> <span class="film-any">(${f.any})</span>`)
      .join(' · ');
    const nota = d.nom === 'Aitor Arregi' ? '&nbsp;<sup><a href="notes.html#n7">[7]</a></sup>' : '';
    return `<td>${d.nom}${nota}${pr}
      <div id="${id}" class="top3-dir-films" style="display:none">${films}</div>
    </td>`;
  };

  cont25.innerHTML = `
    <h3 class="subtitol-ranking-gran">Top 25 — Tots els festivals</h3>
    <table class="taula-festivals">
      <thead><tr>
        <th class="col-pos">#</th>
        <th>Director/a</th>
        <th class="col-center">Total sel.</th>
        <th class="col-center">Total ★</th>
        <th class="col-center" style="color:${FC['Cannes']}">Cannes</th>
        <th class="col-center" style="color:${FC['Venècia']}">Venècia</th>
        <th class="col-center" style="color:${FC['Berlín']}">Berlín</th>
        <th class="col-center" style="color:${FC['Sant Sebastià']}">Sant Sebastià</th>
        <th class="col-center">Films</th>
      </tr></thead>
      <tbody>${top25.map((d,i) => fila25(d,i)).join('')}</tbody>
    </table>`;

  cont10.innerHTML = `
    <h3 class="subtitol-ranking-gran">Top 10 — Només Cannes, Venècia i Berlín</h3>
    <table class="taula-festivals">
      <thead><tr>
        <th class="col-pos">#</th>
        <th>Director/a</th>
        <th class="col-center">Total sel.</th>
        <th class="col-center">Total ★</th>
        <th class="col-center" style="color:${FC['Cannes']}">Cannes</th>
        <th class="col-center" style="color:${FC['Venècia']}">Venècia</th>
        <th class="col-center" style="color:${FC['Berlín']}">Berlín</th>
      </tr></thead>
      <tbody>${top10_3.map((d,i) => fila3(d,i)).join('')}</tbody>
    </table>`;

  cont3.innerHTML = `
    <h3 class="subtitol-ranking-gran">Top 3 — Més premiats</h3>
    <table class="taula-festivals">
      <thead><tr>
        <th style="width:110px">Festival</th>
        <th>1r</th>
        <th>2n</th>
        <th>3r</th>
        <th class="col-center" style="width:40px">Films</th>
      </tr></thead>
      <tbody>
        <tr data-fest="top3-c">
          <td>${nomFest('Cannes')}</td>
          ${celTop3Exp(top3c[0],'c_pr',FC['Cannes'],'Cannes','top3-c-0')}
          ${celTop3Exp(top3c[1],'c_pr',FC['Cannes'],'Cannes','top3-c-1')}
          ${celTop3Exp(top3c[2],'c_pr',FC['Cannes'],'Cannes','top3-c-2')}
          <td class="col-center">
            <button class="btn-films-dir" onclick="toggleTop3Films('top3-c',this)">+</button>
          </td>
        </tr>
        <tr data-fest="top3-v">
          <td>${nomFest('Venècia')}</td>
          ${celTop3Exp(top3v[0],'v_pr',FC['Venècia'],'Venècia','top3-v-0')}
          ${celTop3Exp(top3v[1],'v_pr',FC['Venècia'],'Venècia','top3-v-1')}
          ${celTop3Exp(top3v[2],'v_pr',FC['Venècia'],'Venècia','top3-v-2')}
          <td class="col-center">
            <button class="btn-films-dir" onclick="toggleTop3Films('top3-v',this)">+</button>
          </td>
        </tr>
          <tr data-fest="top3-b">
          <td>${nomFest('Berlín')}</td>
          ${celTop3Exp(top3b[0],'b_pr',FC['Berlín'],'Berlín','top3-b-0')}
          ${celTop3Exp(top3b[1],'b_pr',FC['Berlín'],'Berlín','top3-b-1')}
          ${celTop3Exp(top3b[2],'b_pr',FC['Berlín'],'Berlín','top3-b-2')}
          <td class="col-center">
            <button class="btn-films-dir" onclick="toggleTop3Films('top3-b',this)">+</button>
          </td>
        </tr>
        <tr data-fest="top3-s">
          <td>${nomFest('Sant Sebastià')}</td>
          ${celTop3Exp(top3s[0],'s_pr',FC['Sant Sebastià'],'Sant Sebastià','top3-s-0')}
          ${celTop3Exp(top3s[1],'s_pr',FC['Sant Sebastià'],'Sant Sebastià','top3-s-1')}
          ${celTop3Exp(top3s[2],'s_pr',FC['Sant Sebastià'],'Sant Sebastià','top3-s-2')}
          <td class="col-center">
            <button class="btn-films-dir" onclick="toggleTop3Films('top3-s',this)">+</button>
          </td>
        </tr>
      </tbody>
    </table>`;
}

window.toggleTop3Films = function(key, btn) {
  const divs = [0,1,2].map(i => document.getElementById(key+'-'+i)).filter(Boolean);
  if (!divs.length) return;
  const vis = divs[0].style.display !== 'none';
  divs.forEach(d => d.style.display = vis ? 'none' : 'block');
  btn.textContent = vis ? '+' : '−';
};

window.toggleDirFilms = function(id, btn) {
  const div = document.getElementById(id);
  if (!div) return;
  const vis = div.style.display !== 'none';
  div.style.display = vis ? 'none' : 'block';
  btn.textContent = vis ? '+' : '−';
};

document.addEventListener('DOMContentLoaded', carregarFestivals);
