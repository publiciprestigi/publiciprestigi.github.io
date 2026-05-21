/* Públic i Prestigi — Part II: Prestigi */

let festivalsData = [];

const FESTIVAL_COLORS = {
  'Cannes':       '#9B2335',
  'Berlín':       '#1E4080',
  'Venècia':      '#2E7D5E',
  'Sant Sebastià':'#6B3FA0',
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

function nomFestivalColor(festival) {
  const color = FESTIVAL_COLORS[festival] || '#666';
  return `<strong style="color:${color}">${festival}</strong>`;
}

/* Columna Top 100: mostra #N si és al Top 100, o text de dècada si és context */
function celTop100(film) {
  if (film.top100_pos) return `<span class="top100-pos">#${film.top100_pos}</span>`;
  if (film.decada && film.decada !== '—') return `<span class="decada-pos">${film.decada}</span>`;
  return '—';
}

/* --- PREMIADES PER DÈCADA --- */
function construirPremiades() {
  const cont = document.getElementById('seccio-premiades');
  if (!cont) return;

  const decLabels = {
    '60s':'Anys 1965–1969','70s':'Anys 70','80s':'Anys 80','90s':'Anys 90',
    '2000s':'Anys 2000–2009','2010s':'Anys 2010–2019','2020s':'Anys 2020–2025'
  };

  const getDecada = (any) => {
    if (any <= 1969) return '60s';
    if (any <= 1979) return '70s';
    if (any <= 1989) return '80s';
    if (any <= 1999) return '90s';
    if (any <= 2009) return '2000s';
    if (any <= 2019) return '2010s';
    return '2020s';
  };

  const premiades = festivalsData.filter(f => f.premiat)
    .sort((a, b) => a.any - b.any);

  let html = '';
  ['60s','70s','80s','90s','2000s','2010s','2020s'].forEach(dec => {
    const films = premiades.filter(f => getDecada(f.any) === dec);
    if (!films.length) return;

    html += `<h3 class="subtitol-ranking" style="margin-top:28px">${decLabels[dec]}</h3>
    <table class="taula-festivals">
      <thead><tr>
        <th style="width:36px">Any</th>
        <th>Títol</th>
        <th class="col-subtil">Director</th>
        <th style="width:100px">Festival</th>
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
        <th>Títol</th>
        <th class="col-subtil">Director</th>
        <th>Premi / Observació</th>
        <th class="col-center" style="width:60px">Top 100</th>
        <th class="col-subtil" style="width:90px">Dècada</th>
        <th class="col-num" style="width:90px">Espect.</th>
      </tr></thead>
      <tbody>
        ${films.map(f => {
          const isTop100 = !!f.top100_pos;
          const rowCls = f.premiat ? 'film-premiat' : (isTop100 ? 'film-top100-fest' : '');
          const premi = f.premiat ? `<span class="estrella">★</span> ${f.premi || ''}` : (f.premi || '—');
          return `<tr class="${rowCls}">
            <td>${f.any}</td>
            <td>${isTop100 ? `<strong><em>${f.titol}</em></strong>` : `<em>${f.titol}</em>`}</td>
            <td class="col-subtil">${f.director}</td>
            <td class="col-premi">${premi}</td>
            <td class="col-center">${f.top100_pos ? `<span class="top100-pos">#${f.top100_pos}</span>` : '—'}</td>
            <td class="col-subtil">${f.decada && f.decada !== '—' ? f.decada : '—'}</td>
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
    const cid = `resp-${festival.replace(/[\s']/g,'-')}`;
    const color = FESTIVAL_COLORS[festival];

    html += `
      <h3 class="subtitol-ranking" style="margin-top:32px; padding-left:10px; border-left: 3px solid ${color}">${festival}</h3>
      <table class="taula-festivals">
        <thead><tr>
          <th class="col-pos">#</th>
          <th>Títol</th>
          <th class="col-subtil">Director</th>
          <th class="col-center" style="width:36px">★</th>
          <th class="col-center" style="width:60px">Top 100</th>
          <th class="col-num">Espectadors</th>
        </tr></thead>
        <tbody>
          ${top10.map((f, i) => `<tr class="${f.premiat?'film-premiat':''}">
            <td class="col-pos">${i+1}</td>
            <td>${f.top100_pos?`<strong><em>${f.titol}</em></strong>`:`<em>${f.titol}</em>`} <span class="film-any">(${f.any})</span></td>
            <td class="col-subtil">${f.director}</td>
            <td class="col-center">${f.premiat ? '<span class="estrella">★</span>' : ''}</td>
            <td class="col-center">${f.top100_pos ? `<span class="top100-pos">#${f.top100_pos}</span>` : '—'}</td>
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
            ${resta.map((f, i) => `<tr class="fila-extra-${cid} ${f.premiat?'film-premiat':''}" style="display:none">
              <td class="col-pos">${i+11}</td>
              <td>${f.top100_pos?`<strong><em>${f.titol}</em></strong>`:`<em>${f.titol}</em>`} <span class="film-any">(${f.any})</span></td>
              <td class="col-subtil">${f.director}</td>
              <td class="col-center">${f.premiat ? '<span class="estrella">★</span>' : ''}</td>
              <td class="col-center">${f.top100_pos ? `<span class="top100-pos">#${f.top100_pos}</span>` : '—'}</td>
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
  btn.textContent = btn.textContent.startsWith('+') ? '− Amagar' : '+ Veure tots';
};

/* --- RÀNQUING DIRECTORS --- */
function construirRànquingDirectors() {
  const cont = document.getElementById('seccio-ranking-directors');
  if (!cont) return;

  const dirs = {};
  festivalsData.forEach(f => {
    const d = f.director;
    if (!dirs[d]) dirs[d] = {
      nom: d, total_sel: 0, total_premis: 0,
      cannes_sel: 0, cannes_premis: 0,
      berlin_sel: 0, berlin_premis: 0,
      venezia_sel: 0, venezia_premis: 0,
      ss_sel: 0, ss_premis: 0,
    };
    dirs[d].total_sel++;
    if (f.premiat) dirs[d].total_premis++;
    if (f.festival === 'Cannes') { dirs[d].cannes_sel++; if (f.premiat) dirs[d].cannes_premis++; }
    else if (f.festival === 'Berlín') { dirs[d].berlin_sel++; if (f.premiat) dirs[d].berlin_premis++; }
    else if (f.festival === 'Venècia') { dirs[d].venezia_sel++; if (f.premiat) dirs[d].venezia_premis++; }
    else if (f.festival === 'Sant Sebastià') { dirs[d].ss_sel++; if (f.premiat) dirs[d].ss_premis++; }
  });

  const llista = Object.values(dirs).sort((a, b) =>
    b.total_sel - a.total_sel || b.total_premis - a.total_premis ||
    b.cannes_sel - a.cannes_sel || b.berlin_sel - a.berlin_sel || b.venezia_sel - a.venezia_sel
  );

  const celFest = (sel, premis, color) => {
    if (!sel) return `<td class="col-center col-subtil">—</td>`;
    const str = premis ? `${sel} <span class="estrella">★${premis > 1 ? premis : ''}</span>` : `${sel}`;
    return `<td class="col-center">${str}</td>`;
  };

  const top25 = llista.slice(0, 25);

  const fila = (d, i) => `<tr${i>=10?' style="display:none" class="fila-extra-dirs"':''}>
    <td class="col-pos">${i+1}</td>
    <td><strong>${d.nom}</strong></td>
    <td class="col-center">${d.total_sel}</td>
    ${celFest(d.cannes_sel, d.cannes_premis, FESTIVAL_COLORS['Cannes'])}
    ${celFest(d.berlin_sel, d.berlin_premis, FESTIVAL_COLORS['Berlín'])}
    ${celFest(d.venezia_sel, d.venezia_premis, FESTIVAL_COLORS['Venècia'])}
    ${celFest(d.ss_sel, d.ss_premis, FESTIVAL_COLORS['Sant Sebastià'])}
    <td class="col-center">${d.total_premis || '—'}</td>
  </tr>`;

  // Top 10 sense SS
  const top10_3 = llista.filter(d => d.cannes_sel + d.berlin_sel + d.venezia_sel > 0)
    .sort((a, b) =>
      (b.cannes_sel+b.berlin_sel+b.venezia_sel) - (a.cannes_sel+a.berlin_sel+a.venezia_sel) ||
      (b.cannes_premis+b.berlin_premis+b.venezia_premis) - (a.cannes_premis+a.berlin_premis+a.venezia_premis)
    ).slice(0, 10);

  const fila3 = (d, i) => `<tr>
    <td class="col-pos">${i+1}</td>
    <td><strong>${d.nom}</strong></td>
    <td class="col-center">${d.cannes_sel+d.berlin_sel+d.venezia_sel}</td>
    ${celFest(d.cannes_sel, d.cannes_premis)}
    ${celFest(d.berlin_sel, d.berlin_premis)}
    ${celFest(d.venezia_sel, d.venezia_premis)}
    <td class="col-center">${(d.cannes_premis+d.berlin_premis+d.venezia_premis) || '—'}</td>
  </tr>`;

  cont.innerHTML = `
    <p class="nota-taula">Top 25 per presència acumulada als quatre festivals. Desempat per premis i jerarquia de festival.</p>
    <table class="taula-festivals">
      <thead><tr>
        <th class="col-pos">#</th><th>Director</th>
        <th class="col-center">Total sel.</th>
        <th class="col-center" style="color:${FESTIVAL_COLORS['Cannes']}">Cannes</th>
        <th class="col-center" style="color:${FESTIVAL_COLORS['Berlín']}">Berlín</th>
        <th class="col-center" style="color:${FESTIVAL_COLORS['Venècia']}">Venècia</th>
        <th class="col-center" style="color:${FESTIVAL_COLORS['Sant Sebastià']}">SS</th>
        <th class="col-center">Premis</th>
      </tr></thead>
      <tbody>
        ${top25.map((d,i) => fila(d,i)).join('')}
        <tr class="fila-boto-context">
          <td colspan="8"><button class="btn-context" onclick="expandirDirs(this)">+ Veure Top 25 complet</button></td>
        </tr>
      </tbody>
    </table>

    <h3 class="subtitol-ranking" style="margin-top:40px">Top 10 — Tres grans festivals (Cannes, Berlín, Venècia)</h3>
    <p class="nota-taula">Exclou Sant Sebastià per la seva menor projecció internacional.</p>
    <table class="taula-festivals">
      <thead><tr>
        <th class="col-pos">#</th><th>Director</th>
        <th class="col-center">Total sel.</th>
        <th class="col-center" style="color:${FESTIVAL_COLORS['Cannes']}">Cannes</th>
        <th class="col-center" style="color:${FESTIVAL_COLORS['Berlín']}">Berlín</th>
        <th class="col-center" style="color:${FESTIVAL_COLORS['Venècia']}">Venècia</th>
        <th class="col-center">Premis</th>
      </tr></thead>
      <tbody>${top10_3.map((d,i) => fila3(d,i)).join('')}</tbody>
    </table>`;
}

window.expandirDirs = function(btn) {
  document.querySelectorAll('.fila-extra-dirs').forEach(tr => {
    tr.style.display = tr.style.display !== 'none' ? 'none' : '';
  });
  btn.textContent = btn.textContent.startsWith('+') ? '− Amagar' : '+ Veure Top 25 complet';
};

document.addEventListener('DOMContentLoaded', carregarFestivals);
