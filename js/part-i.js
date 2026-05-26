/* Públic i Prestigi — Part I */

// COLORS_DECADES definit a decades-resum.js

let filmsData = [];

async function carregarFilms() {
  try {
    const r = await fetch('data/films.json');
    filmsData = await r.json();
    construirTaulesDècades();
    construirRànquings();
  } catch(e) { console.error('Error:', e); }
}

const fmt = n => n == null ? '—' : n.toLocaleString('ca-ES');
const fmtPct = (n, e) => n == null ? '—' : n.toFixed(2) + '%' + (e ? '≈' : '');
const fmtIIC = n => n == null ? '—' : n.toFixed(2);
const fmtMercat = (n, e) => n == null ? '—' : n.toFixed(1) + 'M' + (e ? '≈' : '');

function construirFila(film, decada, hidden) {
  const posHist = film.pos_hist ? `${film.pos_hist}` : '—';
  const cls = film.in_top100 ? 'film-top100' : 'film-context';
  const titol = `<strong><em>${film.titol}</em></strong> <span class="film-any">(${film.any})</span>`;
  const bg = decada && COLORS_DECADES[decada] ? COLORS_DECADES[decada].fons : '';
  const display = hidden ? 'display:none;' : '';
  const styleAttr = (bg || display) ? `style="${display}${bg ? 'background:' + bg : ''}"` : '';
  return `<tr class="${cls}" data-context="${!film.in_top100}" ${styleAttr}>
    <td>${film.pos_decade}</td>
    <td class="col-subtil col-center">${posHist}</td>
    <td class="col-titol">${titol}</td>
    <td class="col-subtil">${film.director}</td>
    <td class="col-num">${fmt(film.espectadors)}</td>
    <td class="col-num col-gris">${fmtMercat(film.mercat_M, film.mercat_estimat)}</td>
    <td class="col-num col-gris">${fmtPct(film.penetracio, film.penetracio_estimat)}</td>
    <td class="col-num col-gris">${fmtPct(film.quota, film.quota_estimat)}</td>
    <td class="col-num col-iic">${fmtIIC(film.iic)}</td>
    <td class="col-context-doc">${film.context_text || ''}</td>
  </tr>`;
}

function capcalera() {
  return `<thead><tr>
    <th>#</th>
    <th class="col-subtil col-center">T100</th>
    <th>Títol</th>
    <th class="col-subtil">Director</th>
    <th class="col-num">Espectadors</th>
    <th class="col-num col-gris">Mercat</th>
    <th class="col-num col-gris">Penetració</th>
    <th class="col-num col-gris">Quota</th>
    <th class="col-num col-iic">IIC</th>
    <th class="col-context-doc col-context-header">Context</th>
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
        ${top100.map(f => construirFila(f, decadaId)).join('')}
        ${context.length ? `
          <tr class="fila-boto-context">
            <td colspan="10">
              <button class="btn-context" onclick="toggleContext('${decadaId}', this)">
                + Mostrar ${context.length} pel·lícules de context (Continuació del rànquing de la dècada)
              </button>
            </td>
          </tr>
          ${context.map(f => construirFila(f, decadaId, true)).join('')}
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
  btn.textContent = visible
    ? `+ Mostrar ${count} pel·lícules de context (Continuació del rànquing de la dècada)`
    : `− Amagar pel·lícules de context`;
};

function construirTaulesDècades() {
  // NOTA: els id interns són "taula-XXs", no "seccio-XXs",
  // per evitar conflicte amb els div exteriors de navegació
  [['60s','taula-60s'],['70s','taula-70s'],['80s','taula-80s'],
   ['90s','taula-90s'],['2000s','taula-2000s'],['2010s','taula-2010s'],
   ['2020s','taula-2020s']].forEach(([id, sid]) => {
    const c = document.getElementById(sid);
    if (c) construirTaulaDècada(id, c);
  });
}

/* --- Rànquings --- */

function posicionsEspectadors() {
  const pos = {};
  filmsData.filter(f => f.in_top100)
    .sort((a, b) => b.espectadors - a.espectadors)
    .forEach((f, i) => { pos[f.titol] = i + 1; });
  return pos;
}

function varHtml(posActual, posRef) {
  const diff = posRef - posActual;
  if (diff > 0) return `<span class="var-up">↑${diff}</span>`;
  if (diff < 0) return `<span class="var-down">↓${Math.abs(diff)}</span>`;
  return `<span class="var-eq">=</span>`;
}

function construirRànquing(metrica, contenidorId, label) {
  const cont = document.getElementById(contenidorId);
  if (!cont) return;
  const posEsp = posicionsEspectadors();
  const top100 = filmsData.filter(f => f.in_top100 && f[metrica] != null)
    .sort((a, b) => b[metrica] - a[metrica]);
  const top10 = top100.slice(0, 10);
  const resta = top100.slice(10);
  const esEsp = metrica === 'espectadors';

  const fila = (f, i) => {
    const posActual = i + 1;
    const posRef = posEsp[f.titol] || posActual;
    const val = metrica === 'espectadors' ? fmt(f[metrica])
      : metrica === 'iic' ? fmtIIC(f[metrica])
      : fmtPct(f[metrica], f[metrica + '_estimat']);
    const varCol = esEsp ? '' : `<td class="col-var">${varHtml(posActual, posRef)}</td>`;
    const posTop = esEsp ? '' : `<td class="col-center col-subtil">${posRef}</td>`;
    return `<tr>
      <td class="col-pos">${posActual}</td>
      ${posTop}
      <td><strong><em>${f.titol}</em></strong> <span class="film-any">(${f.any})</span></td>
      <td class="col-subtil">${f.director}</td>
      <td class="col-num col-iic">${val}</td>
      ${varCol}
    </tr>`;
  };

  const thead = `<thead><tr>
    <th class="col-pos">#</th>
    ${esEsp ? '' : '<th class="col-center col-subtil">T100</th>'}
    <th>Títol</th>
    <th class="col-subtil">Director</th>
    <th class="col-num col-iic">${label}</th>
    ${esEsp ? '' : '<th class="col-var" title="Variació respecte al rànquing per espectadors">Var.</th>'}
  </tr></thead>`;

  cont.innerHTML = `<table class="taula-ranking">
    ${thead}
    <tbody>
      ${top10.map((f,i) => fila(f,i)).join('')}
      ${resta.length ? `
        <tr class="fila-boto-context">
          <td colspan="${esEsp ? 4 : 6}">
            <button class="btn-context" onclick="expandirRanking('${contenidorId}', this)">
              + Veure Top 100 complet
            </button>
          </td>
        </tr>
        ${resta.map((f,i) => fila(f,i+10).replace('<tr>', '<tr style="display:none" class="fila-extra">')).join('')}
      ` : ''}
    </tbody>
  </table>`;
}

window.expandirRanking = function(cid, btn) {
  const files = document.querySelectorAll(`#${cid} .fila-extra`);
  const visible = files[0] && files[0].style.display !== 'none';
  files.forEach(tr => tr.style.display = visible ? 'none' : '');
  btn.textContent = visible ? '+ Veure Top 100 complet' : '− Amagar';
  // Amaga/mostra el comentari editorial segons si estem al Top 10 o Top 100
  const seccio = document.getElementById(cid)?.closest('.seccio-contingut');
  if (seccio) {
    const comentari = seccio.querySelector('.text-md-comentari');
    if (comentari) comentari.style.display = visible ? '' : 'none';
  }
};

/* --- Rànquing directors --- */
function construirRànquingDirectors() {
  const cont = document.getElementById('taula-directors');
  if (!cont) return;

  const totalEsp = filmsData.filter(f => f.in_top100)
    .reduce((acc, f) => acc + (f.espectadors || 0), 0);

  const dirs = {};
  filmsData.forEach(f => {
    const d = f.director;
    if (!dirs[d]) dirs[d] = { nom: d, top100: 0, espTop: 0, espContext: 0, citats: 0, filmsTop100: [], filmsContext: [] };
    if (f.in_top100) {
      dirs[d].top100++;
      dirs[d].espTop += f.espectadors || 0;
      dirs[d].filmsTop100.push(`<strong><em>${f.titol}</em></strong> <span class="film-any">(${f.any})</span>`);
    } else {
      dirs[d].espContext += f.espectadors || 0;
      dirs[d].filmsContext.push(`<strong><em>${f.titol}</em></strong> <span class="film-any">(${f.any})</span>`);
    }
    dirs[d].citats++;
  });

  let ctrDir = 0;

  const llista1 = Object.values(dirs).filter(d => d.top100 > 0)
    .sort((a, b) => b.top100 - a.top100 || b.espTop - a.espTop);

  const posR1 = {};
  llista1.forEach((d, i) => { posR1[d.nom] = i + 1; });

  const filaR1 = (d, i) => {
    const id = `dir1-${++ctrDir}`;
    const filmsHtml = d.filmsTop100.join(' · ');
    return `<tr${i>=10?' style="display:none" class="fila-extra-d1"':''}>
      <td class="col-pos">${i+1}</td>
      <td>
        <strong>${d.nom}</strong>
        <div id="${id}" class="dir-films-list" style="display:none">${filmsHtml}</div>
      </td>
      <td class="col-center">${d.top100}</td>
      <td class="col-num">${fmt(d.espTop)}</td>
      <td class="col-num col-gris">${(d.espTop/totalEsp*100).toFixed(1)}%</td>
      <td class="col-center">
        <button class="btn-films-dir" onclick="toggleDirFilms('${id}', this)" title="Veure films">+</button>
      </td>
    </tr>`;
  };

  const llista2 = Object.values(dirs).filter(d => d.top100 > 0 || d.citats > 1)
    .map(d => ({ ...d, espTotal: d.espTop + d.espContext }))
    .sort((a, b) => b.espTotal - a.espTotal);

  const filaR2 = (d, i) => {
    const id = `dir2-${++ctrDir}`;
    const posRef = posR1[d.nom] || null;
    const posActual = i + 1;
    let vHtml;
    if (!posRef) {
      vHtml = '<span class="var-nou">NOU</span>';
    } else {
      vHtml = varHtml(posActual, posRef);
    }
    const add = d.filmsContext.length;
    let filmsHtml = '';
    if (d.filmsTop100.length) filmsHtml += `<span class="dir-films-grup">Top 100</span>${d.filmsTop100.join(' · ')}`;
    if (d.filmsContext.length) filmsHtml += `<span class="dir-films-grup" style="margin-top:6px">Addicionals</span>${d.filmsContext.join(' · ')}`;
    return `<tr${i>=10?' style="display:none" class="fila-extra-d2"':''}>
      <td class="col-pos">${posActual}</td>
      <td class="col-var">${vHtml}</td>
      <td>
        <strong>${d.nom}</strong>
        <div id="${id}" class="dir-films-list" style="display:none">${filmsHtml}</div>
      </td>
      <td class="col-center">${d.top100}</td>
      <td class="col-center">${add > 0 ? '+'+add : '—'}</td>
      <td class="col-num">${fmt(d.espTotal)}</td>
      <td class="col-center">
        <button class="btn-films-dir" onclick="toggleDirFilms('${id}', this)" title="Veure films">+</button>
      </td>
    </tr>`;
  };

  cont.innerHTML = `
    <h3 class="subtitol-ranking">Només films del Top 100</h3>
    <table class="taula-ranking">
      <thead><tr>
        <th class="col-pos">#</th>
        <th>Director</th>
        <th class="col-center">Núm. films</th>
        <th class="col-num" style="text-align:right">Espectadors acumulats</th>
        <th class="col-num col-gris">% total</th>
        <th class="col-center">Films</th>
      </tr></thead>
      <tbody>
        ${llista1.slice(0,10).map((d,i) => filaR1(d,i)).join('')}
        <tr class="fila-boto-context">
          <td colspan="6"><button class="btn-context" onclick="expandirD1(this)">+ Veure llista completa</button></td>
        </tr>
        ${llista1.slice(10).map((d,i) => filaR1(d,i+10)).join('')}
      </tbody>
    </table>
    <div id="comentari-directors-1"></div>

    <h3 class="subtitol-ranking" style="margin-top:40px">De tots els films citats (Top 100 + context)</h3>
    <table class="taula-ranking">
      <thead><tr>
        <th class="col-pos">#</th>
        <th class="col-var">Var.</th>
        <th>Director</th>
        <th class="col-center">Núm. films</th>
        <th class="col-center">Add.</th>
        <th class="col-num" style="text-align:right">Espectadors totals</th>
        <th class="col-center">Films</th>
      </tr></thead>
      <tbody>
        ${llista2.slice(0,10).map((d,i) => filaR2(d,i)).join('')}
        <tr class="fila-boto-context">
          <td colspan="7"><button class="btn-context" onclick="expandirD2(this)">+ Veure llista completa</button></td>
        </tr>
        ${llista2.slice(10).map((d,i) => filaR2(d,i+10)).join('')}
      </tbody>
    </table>`;
}

// Carregar els textos Markdown inserits dins el HTML de directors
function carregarTextosDirectors() {
  setTimeout(() => {
    const cont = document.getElementById('taula-directors');
    if (!cont || !window.PiP_textos) return;
    cont.querySelectorAll('.text-md[data-text]').forEach(div => {
      window.PiP_textos.renderitza(div);
    });
  }, 50);
  carregarTextosDirectors();
}

window.toggleDirFilms = function(id, btn) {
  const div = document.getElementById(id);
  if (!div) return;
  const vis = div.style.display !== 'none';
  div.style.display = vis ? 'none' : 'block';
  btn.textContent = vis ? '+' : '−';
};

window.expandirD1 = function(btn) {
  document.querySelectorAll('.fila-extra-d1').forEach(tr => tr.style.display = tr.style.display !== 'none' ? 'none' : '');
  btn.textContent = btn.textContent.startsWith('+') ? '− Amagar' : '+ Veure llista completa';
};
window.expandirD2 = function(btn) {
  document.querySelectorAll('.fila-extra-d2').forEach(tr => tr.style.display = tr.style.display !== 'none' ? 'none' : '');
  btn.textContent = btn.textContent.startsWith('+') ? '− Amagar' : '+ Veure llista completa';
};

function construirRànquings() {
  construirRànquing('espectadors', 'taula-espectadors', 'Espectadors');
  construirRànquing('penetracio',  'taula-penetracio',  'Penetració');
  construirRànquing('quota',       'taula-quota',       'Quota de mercat');
  construirRànquing('iic',         'taula-iic',         'IIC');
  construirRànquingDirectors();
}

document.addEventListener('DOMContentLoaded', carregarFilms);
