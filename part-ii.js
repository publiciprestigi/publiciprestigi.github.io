/* Públic i Prestigi — Part II: Prestigi */

let festivalsData = [];

const FESTIVAL_COLORS = {
  'Cannes':       '#8B1A1A',
  'Berlín':       '#1A3A6B',
  'Venècia':      '#7A5C00',
  'Sant Sebastià':'#1A5C35',
};

const FESTIVAL_SHORT = {
  'Cannes': 'CAN', 'Berlín': 'BER', 'Venècia': 'VEN', 'Sant Sebastià': 'SS'
};

async function carregarFestivals() {
  try {
    const r = await fetch('data/festivals.json');
    festivalsData = await r.json();
    construirPremiades();
    construirIntroduccio();
    construirFestival('Cannes', 'seccio-cannes');
    construirFestival('Berlín', 'seccio-berlin');
    construirFestival('Venècia', 'seccio-venezia');
    construirFestival('Sant Sebastià', 'seccio-sansebastia');
    construirRànquingEspectadors();
    construirRànquingDirectors();
  } catch(e) { console.error('Error:', e); }
}

const fmt = n => n == null ? '—' : n.toLocaleString('ca-ES');

function badgeFestival(festival) {
  const color = FESTIVAL_COLORS[festival] || '#666';
  return `<span class="badge-festival" style="background:${color}">${festival}</span>`;
}

function nomFestival(festival) {
  const color = FESTIVAL_COLORS[festival] || '#666';
  return `<span class="nom-festival" style="color:${color}">${festival}</span>`;
}

/* --- PREMIADES PER DÈCADA --- */
function construirPremiades() {
  const cont = document.getElementById('seccio-premiades');
  if (!cont) return;

  const decades = ['60s','70s','80s','90s','2000s','2010s','2020s'];
  const decLabels = {
    '60s':'Anys 1965–1969','70s':'Anys 70','80s':'Anys 80','90s':'Anys 90',
    '2000s':'Anys 2000–2009','2010s':'Anys 2010–2019','2020s':'Anys 2020–2025'
  };

  const premiades = festivalsData.filter(f => f.premiat)
    .sort((a, b) => a.any - b.any);

  let html = '';
  decades.forEach(dec => {
    const films = premiades.filter(f => {
      const any = f.any;
      if (dec === '60s') return any >= 1965 && any <= 1969;
      if (dec === '70s') return any >= 1970 && any <= 1979;
      if (dec === '80s') return any >= 1980 && any <= 1989;
      if (dec === '90s') return any >= 1990 && any <= 1999;
      if (dec === '2000s') return any >= 2000 && any <= 2009;
      if (dec === '2010s') return any >= 2010 && any <= 2019;
      if (dec === '2020s') return any >= 2020;
    });
    if (!films.length) return;

    html += `<h3 class="subtitol-ranking" style="margin-top:32px">${decLabels[dec]}</h3>
    <table class="taula-festivals">
      <thead><tr>
        <th style="width:36px">Any</th>
        <th>Títol</th>
        <th class="col-subtil">Director</th>
        <th style="width:120px">Festival</th>
        <th>Premi</th>
      </tr></thead>
      <tbody>
        ${films.map(f => `<tr>
          <td>${f.any}</td>
          <td><strong><em>${f.titol}</em></strong></td>
          <td class="col-subtil">${f.director}</td>
          <td>${badgeFestival(f.festival)}</td>
          <td class="col-premi">${f.premi || '—'}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;
  });

  cont.innerHTML = html;
}

/* --- INTRODUCCIÓ --- */
function construirIntroduccio() {
  const cont = document.getElementById('seccio-introduccio');
  if (!cont) return;
  cont.innerHTML = `<p class="en-construccio">Contingut en construcció</p>`;
}

/* --- TAULA PER FESTIVAL --- */
function construirFestival(festival, seccioId) {
  const cont = document.getElementById(seccioId);
  if (!cont) return;

  const films = festivalsData.filter(f => f.festival === festival)
    .sort((a, b) => a.any - b.any);

  const color = FESTIVAL_COLORS[festival];
  const total = films.length;
  const premiades = films.filter(f => f.premiat).length;

  cont.innerHTML = `
    <p class="festival-resum" style="border-left: 3px solid ${color}; padding-left: 12px; margin-bottom: 24px;">
      <strong>${total} participacions documentades</strong> · <strong>${premiades} premiades</strong>
    </p>
    <table class="taula-festivals">
      <thead><tr>
        <th style="width:36px">Any</th>
        <th>Títol</th>
        <th class="col-subtil">Director</th>
        <th style="width:36px" class="col-center" title="Premi">★</th>
        <th style="width:48px" class="col-center">T100</th>
        <th class="col-num">Espectadors</th>
      </tr></thead>
      <tbody>
        ${films.map(f => {
          const premiatCls = f.premiat ? 'film-premiat' : '';
          const top100txt = f.top100_pos ? `${f.top100_pos}` : '—';
          const premi = f.premiat ? `<span class="estrella" title="${f.premi || 'Premiat'}">★</span>` : '';
          return `<tr class="${premiatCls}">
            <td>${f.any}</td>
            <td><strong><em>${f.titol}</em></strong></td>
            <td class="col-subtil">${f.director}</td>
            <td class="col-center">${premi}</td>
            <td class="col-center col-subtil">${top100txt}</td>
            <td class="col-num">${fmt(f.espectadors)}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>`;
}

/* --- RÀNQUING PER ESPECTADORS --- */
function construirRànquingEspectadors() {
  const cont = document.getElementById('seccio-ranking-espectadors');
  if (!cont) return;

  const festivals = ['Cannes', 'Berlín', 'Venècia', 'Sant Sebastià'];
  let html = '';

  festivals.forEach(festival => {
    const films = festivalsData
      .filter(f => f.festival === festival && f.espectadors)
      .sort((a, b) => b.espectadors - a.espectadors);

    const top10 = films.slice(0, 10);
    const resta = films.slice(10);
    const cid = `rank-esp-${festival.replace(/\s/g,'-')}`;
    const color = FESTIVAL_COLORS[festival];

    html += `
      <h3 class="subtitol-ranking" style="margin-top:32px; border-left: 3px solid ${color}; padding-left:10px">${festival}</h3>
      <table class="taula-festivals">
        <thead><tr>
          <th class="col-pos">#</th>
          <th>Títol</th>
          <th class="col-subtil">Director</th>
          <th class="col-center" style="width:36px">★</th>
          <th class="col-center">T100</th>
          <th class="col-num">Espectadors</th>
        </tr></thead>
        <tbody>
          ${top10.map((f, i) => `<tr>
            <td class="col-pos">${i+1}</td>
            <td><strong><em>${f.titol}</em></strong> <span class="film-any">(${f.any})</span></td>
            <td class="col-subtil">${f.director}</td>
            <td class="col-center">${f.premiat ? '<span class="estrella">★</span>' : ''}</td>
            <td class="col-center col-subtil">${f.top100_pos || '—'}</td>
            <td class="col-num">${fmt(f.espectadors)}</td>
          </tr>`).join('')}
          ${resta.length ? `
            <tr class="fila-boto-context">
              <td colspan="6">
                <button class="btn-context" onclick="expandirRankEsp('${cid}', this)">
                  + Veure tots els ${films.length} films
                </button>
              </td>
            </tr>
            ${resta.map((f, i) => `<tr class="fila-extra-${cid}" style="display:none">
              <td class="col-pos">${i+11}</td>
              <td><strong><em>${f.titol}</em></strong> <span class="film-any">(${f.any})</span></td>
              <td class="col-subtil">${f.director}</td>
              <td class="col-center">${f.premiat ? '<span class="estrella">★</span>' : ''}</td>
              <td class="col-center col-subtil">${f.top100_pos || '—'}</td>
              <td class="col-num">${fmt(f.espectadors)}</td>
            </tr>`).join('')}
          ` : ''}
        </tbody>
      </table>`;
  });

  cont.innerHTML = html;
}

window.expandirRankEsp = function(cid, btn) {
  document.querySelectorAll(`.fila-extra-${cid}`).forEach(tr => {
    tr.style.display = tr.style.display !== 'none' ? 'none' : '';
  });
  btn.textContent = btn.textContent.startsWith('+') ? '− Amagar' : `+ Veure tots`;
};

/* --- RÀNQUING DIRECTORS --- */
function construirRànquingDirectors() {
  const cont = document.getElementById('seccio-ranking-directors');
  if (!cont) return;

  const dirs = {};
  festivalsData.forEach(f => {
    const d = f.director;
    if (!dirs[d]) dirs[d] = {
      nom: d,
      total_sel: 0, total_premis: 0,
      cannes_sel: 0, cannes_premis: 0,
      berlin_sel: 0, berlin_premis: 0,
      venezia_sel: 0, venezia_premis: 0,
      ss_sel: 0, ss_premis: 0,
    };
    dirs[d].total_sel++;
    if (f.premiat) dirs[d].total_premis++;
    const fest = f.festival;
    if (fest === 'Cannes') { dirs[d].cannes_sel++; if (f.premiat) dirs[d].cannes_premis++; }
    else if (fest === 'Berlín') { dirs[d].berlin_sel++; if (f.premiat) dirs[d].berlin_premis++; }
    else if (fest === 'Venècia') { dirs[d].venezia_sel++; if (f.premiat) dirs[d].venezia_premis++; }
    else if (fest === 'Sant Sebastià') { dirs[d].ss_sel++; if (f.premiat) dirs[d].ss_premis++; }
  });

  // Sort: total_sel desc, tiebreak by Cannes > Berlín > Venècia > SS
  const llista = Object.values(dirs).sort((a, b) =>
    b.total_sel - a.total_sel ||
    b.total_premis - a.total_premis ||
    b.cannes_sel - a.cannes_sel ||
    b.berlin_sel - a.berlin_sel ||
    b.venezia_sel - a.venezia_sel
  );

  const celFest = (sel, premis) => {
    if (!sel) return '<td class="col-center col-subtil">—</td>';
    return `<td class="col-center">${sel}${premis ? ` <span class="estrella">★${premis > 1 ? premis : ''}</span>` : ''}</td>`;
  };

  const top25 = llista.slice(0, 25);
  const resta = llista.slice(25);

  const fila = (d, i) => `<tr${i>=10?' style="display:none" class="fila-extra-dirs"':''}>
    <td class="col-pos">${i+1}</td>
    <td><strong>${d.nom}</strong></td>
    <td class="col-center">${d.total_sel}</td>
    ${celFest(d.cannes_sel, d.cannes_premis)}
    ${celFest(d.berlin_sel, d.berlin_premis)}
    ${celFest(d.venezia_sel, d.venezia_premis)}
    ${celFest(d.ss_sel, d.ss_premis)}
    <td class="col-center">${d.total_premis || '—'}</td>
  </tr>`;

  cont.innerHTML = `
    <p class="nota-taula">Top 25 directors per presència acumulada als quatre festivals. Desempat per nombre de premis i jerarquia de festival (Cannes > Berlín > Venècia > Sant Sebastià).</p>
    <table class="taula-festivals">
      <thead><tr>
        <th class="col-pos">#</th>
        <th>Director</th>
        <th class="col-center">Total sel.</th>
        <th class="col-center" style="color:${FESTIVAL_COLORS['Cannes']}">Cannes</th>
        <th class="col-center" style="color:${FESTIVAL_COLORS['Berlín']}">Berlín</th>
        <th class="col-center" style="color:${FESTIVAL_COLORS['Venècia']}">Venècia</th>
        <th class="col-center" style="color:${FESTIVAL_COLORS['Sant Sebastià']}">SS</th>
        <th class="col-center">Premis</th>
      </tr></thead>
      <tbody>
        ${top25.map((d, i) => fila(d, i)).join('')}
        <tr class="fila-boto-context">
          <td colspan="8">
            <button class="btn-context" onclick="expandirDirs(this)">+ Veure Top 10 complet</button>
          </td>
        </tr>
        ${top25.slice(10).map((d, i) => '').join('')}
      </tbody>
    </table>`;

  // Also build the 3-festival top 10 (without SS)
  const top10_3fest = llista.filter(d => d.cannes_sel + d.berlin_sel + d.venezia_sel > 0)
    .sort((a, b) =>
      (b.cannes_sel + b.berlin_sel + b.venezia_sel) - (a.cannes_sel + a.berlin_sel + a.venezia_sel) ||
      b.total_premis - a.total_premis
    ).slice(0, 10);

  const cont3 = document.getElementById('seccio-ranking-directors');
  if (top10_3fest.length) {
    cont.innerHTML += `
      <h3 class="subtitol-ranking" style="margin-top:40px">Top 10 — Tres grans festivals (Cannes, Berlín, Venècia)</h3>
      <p class="nota-taula">Exclou Sant Sebastià per la seva menor projecció internacional.</p>
      <table class="taula-festivals">
        <thead><tr>
          <th class="col-pos">#</th>
          <th>Director</th>
          <th class="col-center">Total sel. (3)</th>
          <th class="col-center" style="color:${FESTIVAL_COLORS['Cannes']}">Cannes</th>
          <th class="col-center" style="color:${FESTIVAL_COLORS['Berlín']}">Berlín</th>
          <th class="col-center" style="color:${FESTIVAL_COLORS['Venècia']}">Venècia</th>
          <th class="col-center">Premis</th>
        </tr></thead>
        <tbody>
          ${top10_3fest.map((d, i) => `<tr>
            <td class="col-pos">${i+1}</td>
            <td><strong>${d.nom}</strong></td>
            <td class="col-center">${d.cannes_sel + d.berlin_sel + d.venezia_sel}</td>
            ${celFest(d.cannes_sel, d.cannes_premis)}
            ${celFest(d.berlin_sel, d.berlin_premis)}
            ${celFest(d.venezia_sel, d.venezia_premis)}
            <td class="col-center">${d.cannes_premis + d.berlin_premis + d.venezia_premis || '—'}</td>
          </tr>`).join('')}
        </tbody>
      </table>`;
  }
}

window.expandirDirs = function(btn) {
  document.querySelectorAll('.fila-extra-dirs').forEach(tr => {
    tr.style.display = tr.style.display !== 'none' ? 'none' : '';
  });
  btn.textContent = btn.textContent.startsWith('+') ? '− Amagar' : '+ Veure Top 10 complet';
};

document.addEventListener('DOMContentLoaded', carregarFestivals);
