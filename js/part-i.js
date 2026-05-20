/* ============================================================
   Públic i Prestigi — Part I: Públic
   ============================================================ */

let filmsData = [];

async function carregarFilms() {
  try {
    const r = await fetch('data/films.json');
    filmsData = await r.json();
    construirTaulesDècades();
    construirRànquings();
  } catch(e) {
    console.error('Error carregant films.json:', e);
  }
}

function fmt(n) {
  if (n === null || n === undefined) return '—';
  return n.toLocaleString('ca-ES');
}
function fmtPct(n, est) {
  if (n === null || n === undefined) return '—';
  return n.toFixed(2) + '%' + (est ? '≈' : '');
}
function fmtIIC(n) {
  if (n === null || n === undefined) return '—';
  return n.toFixed(2);
}
function fmtMercat(n, est) {
  if (n === null || n === undefined) return '—';
  return n.toFixed(1) + 'M' + (est ? '≈' : '');
}

let _ctxCounter = 0;

function construirFila(film) {
  const posHist = film.pos_hist ? `#${film.pos_hist}` : '—';
  const cls = film.in_top100 ? 'film-top100' : 'film-context';
  const titolText = film.in_top100
    ? `<strong><em>${film.titol}</em></strong> (${film.any})`
    : `<em>${film.titol}</em> (${film.any})`;
  const ctxId = film.context_text ? `ctx-${++_ctxCounter}` : null;
  const iBtn = ctxId
    ? `<button class="btn-info" onclick="toggleCtxFila('${ctxId}')" title="Context">i</button>`
    : '';
  const ctxRow = ctxId
    ? `<tr id="${ctxId}" class="fila-context-text" style="display:none">
        <td colspan="9" class="cel-context-text">${film.context_text}</td>
       </tr>`
    : '';

  return `<tr class="${cls}" data-context="${!film.in_top100}">
    <td>${film.pos_decade}</td>
    <td class="col-subtil">${posHist}</td>
    <td class="col-titol">${titolText}</td>
    <td class="col-subtil">${film.director}</td>
    <td class="col-num">${fmt(film.espectadors)}</td>
    <td class="col-num col-gris">${fmtMercat(film.mercat_M, film.mercat_estimat)}</td>
    <td class="col-num col-gris">${fmtPct(film.penetracio, film.penetracio_estimat)}</td>
    <td class="col-num col-gris">${fmtPct(film.quota, film.quota_estimat)}</td>
    <td class="col-num col-iic">${fmtIIC(film.iic)} ${iBtn}</td>
  </tr>${ctxRow}`;
}

window.toggleCtxFila = function(id) {
  const r = document.getElementById(id);
  if (!r) return;
  r.style.display = r.style.display === 'none' ? '' : 'none';
  const btn = r.previousElementSibling.querySelector('.btn-info');
  if (btn) btn.classList.toggle('actiu');
};

function capcalera() {
  return `<thead><tr>
    <th title="Posició dins la dècada">P.dèc.</th>
    <th title="Posició al Top 100 històric" class="col-subtil">P.hist.</th>
    <th>Títol</th>
    <th class="col-subtil">Director/a</th>
    <th class="col-num">Espectadors</th>
    <th class="col-num col-gris">Mercat</th>
    <th class="col-num col-gris">Penetració</th>
    <th class="col-num col-gris">Quota</th>
    <th class="col-num">IIC</th>
  </tr></thead>`;
}

function construirTaulaDècada(decadaId, cont) {
  const films = filmsData.filter(f => f.decada === decadaId)
    .sort((a, b) => a.pos_decade - b.pos_decade);
  if (!films.length) return;
  const top100 = films.filter(f => f.in_top100);
  const context = films.filter(f => !f.in_top100);
  cont.innerHTML = `
    <table class="taula-films" data-decada="${decadaId}">
      ${capcalera()}
      <tbody>
        ${top100.map(construirFila).join('')}
        ${context.length ? `
          <tr class="fila-boto-context">
            <td colspan="9">
              <button class="btn-context" onclick="toggleContext('${decadaId}', this)">
                + Mostrar ${context.length} pel·lícules de context (Continuació del rànquing de la dècada)
              </button>
            </td>
          </tr>
          ${context.map(f => construirFila(f).replace('data-context="true"', 'data-context="true" style="display:none"')).join('')}
        ` : ''}
      </tbody>
    </table>`;
}

window.toggleContext = function(decadaId, btn) {
  const taula = document.querySelector(`table[data-decada="${decadaId}"]`);
  if (!taula) return;
  const files = taula.querySelectorAll('tr[data-context="true"]');
  const count = files.length;
  const visible = files[0] && files[0].style.display !== 'none';
  files.forEach(tr => tr.style.display = visible ? 'none' : '');
  btn.textContent = visible ? `+ Mostrar ${count} pel·lícules de context` : `− Amagar pel·lícules de context`;
};

function construirTaulesDècades() {
  [['60s','seccio-60s'],['70s','seccio-70s'],['80s','seccio-80s'],
   ['90s','seccio-90s'],['2000s','seccio-2000s'],['2010s','seccio-2010s'],
   ['2020s','seccio-2020s']].forEach(([id, sid]) => {
    const c = document.getElementById(sid);
    if (c) construirTaulaDècada(id, c);
  });
}

function construirRànquing(metrica, contenidorId, label) {
  const cont = document.getElementById(contenidorId);
  if (!cont) return;
  const top100 = filmsData.filter(f => f.in_top100 && f[metrica] !== null)
    .sort((a, b) => b[metrica] - a[metrica]);
  const top10 = top100.slice(0, 10);
  const resta = top100.slice(10);
  // Calcular posició al Top 100 per espectadors per a la columna Var.
  const posEsp = {};
  filmsData.filter(f => f.in_top100)
    .sort((a, b) => b.espectadors - a.espectadors)
    .forEach((f, i) => { posEsp[f.titol] = i + 1; });

  const fila = (f, i) => {
    const val = metrica === 'espectadors' ? fmt(f[metrica])
      : metrica === 'iic' ? fmtIIC(f[metrica])
      : fmtPct(f[metrica], f[metrica + '_estimat']);

    let varHtml = '';
    if (metrica !== 'espectadors') {
      const posActual = i + 1;
      const posRef = posEsp[f.titol] || posActual;
      const diff = posRef - posActual;
      if (diff > 0) varHtml = `<span class="var-up">↑${diff}</span>`;
      else if (diff < 0) varHtml = `<span class="var-down">↓${Math.abs(diff)}</span>`;
      else varHtml = `<span class="var-eq">=</span>`;
    }

    return `<tr><td>${i+1}</td>
      <td><strong><em>${f.titol}</em></strong> (${f.any})</td>
      <td class="col-subtil">${f.director}</td>
      <td class="col-num col-iic">${val}</td>
      ${metrica !== 'espectadors' ? `<td class="col-var">${varHtml}</td>` : ''}
      </tr>`;
  };
  cont.innerHTML = `<table class="taula-ranking">
    <thead><tr>
      <th style="width:32px">#</th>
      <th>Títol</th>
      <th class="col-subtil">Director/a</th>
      <th class="col-num">${label}</th>
      ${metrica !== 'espectadors' ? '<th class="col-var" title="Variació respecte al rànquing per espectadors">Var.</th>' : ''}
    </tr></thead>
    <tbody>
      ${top10.map((f,i) => fila(f,i)).join('')}
      ${resta.length ? `
        <tr class="fila-boto-context">
          <td colspan="${metrica !== 'espectadors' ? 5 : 4}">
            <button class="btn-context" onclick="expandirRanking('${contenidorId}', this)">
              + Veure Top 100 complet
            </button>
          </td>
        </tr>
        ${resta.map((f,i) => fila(f,i+10).replace('<tr>','<tr style="display:none" class="fila-extra">')).join('')}
      ` : ''}
    </tbody></table>`;
}

window.expandirRanking = function(cid, btn) {
  const files = document.querySelectorAll(`#${cid} .fila-extra`);
  const visible = files[0] && files[0].style.display !== 'none';
  files.forEach(tr => tr.style.display = visible ? 'none' : '');
  btn.textContent = visible ? '+ Veure Top 100 complet' : '− Amagar';
};

function construirRànquingDirectors() {
  const cont = document.getElementById('seccio-directors');
  if (!cont) return;
  const dirs = {};
  filmsData.forEach(f => {
    if (!dirs[f.director]) dirs[f.director] = { nom: f.director, top100: 0, esp: 0, citats: 0 };
    if (f.in_top100) { dirs[f.director].top100++; dirs[f.director].esp += f.espectadors || 0; }
    dirs[f.director].citats++;
  });
  const llista = Object.values(dirs).filter(d => d.top100 > 0)
    .sort((a, b) => b.esp - a.esp);
  const fila = (d, i) => `<tr class="${i>=10?'fila-extra':''}">
    <td>${i+1}</td><td>${d.nom}</td>
    <td class="col-num">${d.top100}</td>
    <td class="col-num">${fmt(d.esp)}</td>
    <td class="col-num">${d.citats}</td></tr>`;
  cont.innerHTML = `<table class="taula-ranking">
    <thead><tr><th>#</th><th>Director/a</th>
    <th class="col-num">Films Top 100</th>
    <th class="col-num">Espectadors acumulats</th>
    <th class="col-num">Total citats</th></tr></thead>
    <tbody>
      ${llista.slice(0,10).map((d,i) => fila(d,i)).join('')}
      <tr class="fila-boto-context">
        <td colspan="5"><button class="btn-context" onclick="expandirDirectors(this)">
          + Veure llista completa
        </button></td>
      </tr>
      ${llista.slice(10).map((d,i) => fila(d,i+10).replace('<tr class="fila-extra">','<tr class="fila-extra" style="display:none">')).join('')}
    </tbody></table>`;
}

window.expandirDirectors = function(btn) {
  const files = document.querySelectorAll('#seccio-directors .fila-extra');
  const visible = files[0] && files[0].style.display !== 'none';
  files.forEach(tr => tr.style.display = visible ? 'none' : '');
  btn.textContent = visible ? '+ Veure llista completa' : '− Amagar';
};

function construirRànquings() {
  construirRànquing('espectadors', 'seccio-espectadors', 'Espectadors');
  construirRànquing('penetracio', 'seccio-penetracio', 'Penetració');
  construirRànquing('quota', 'seccio-quota', 'Quota de mercat');
  construirRànquing('iic', 'seccio-iic', 'IIC');
  construirRànquingDirectors();
}

document.addEventListener('DOMContentLoaded', carregarFilms);
