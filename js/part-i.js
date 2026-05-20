/* Públic i Prestigi — Part I */

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

function construirFila(film) {
  const posHist = film.pos_hist ? `#${film.pos_hist}` : '—';
  const cls = film.in_top100 ? 'film-top100' : 'film-context';
  const titol = film.in_top100
    ? `<strong><em>${film.titol}</em></strong> (${film.any})`
    : `<em>${film.titol}</em> (${film.any})`;
  return `<tr class="${cls}" data-context="${!film.in_top100}">
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
    <th class="col-subtil col-center">Top 100</th>
    <th>Títol</th>
    <th class="col-subtil">Director/a</th>
    <th class="col-num">Espectadors</th>
    <th class="col-num col-gris">Mercat</th>
    <th class="col-num col-gris">Penetració</th>
    <th class="col-num col-gris">Quota</th>
    <th class="col-num">IIC</th>
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
        ${top100.map(construirFila).join('')}
        ${context.length ? `
          <tr class="fila-boto-context">
            <td colspan="10">
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
  btn.textContent = visible
    ? `+ Mostrar ${count} pel·lícules de context (Continuació del rànquing de la dècada)`
    : `− Amagar pel·lícules de context`;
};

function construirTaulesDècades() {
  [['60s','seccio-60s'],['70s','seccio-70s'],['80s','seccio-80s'],
   ['90s','seccio-90s'],['2000s','seccio-2000s'],['2010s','seccio-2010s'],
   ['2020s','seccio-2020s']].forEach(([id, sid]) => {
    const c = document.getElementById(sid);
    if (c) construirTaulaDècada(id, c);
  });
}

/* --- Rànquings --- */

// Posicions per espectadors (referència per a Var.)
function posicionsEspectadors() {
  const pos = {};
  filmsData.filter(f => f.in_top100)
    .sort((a, b) => b.espectadors - a.espectadors)
    .forEach((f, i) => { pos[f.titol] = i + 1; });
  return pos;
}

function varHtml(posActual, posRef) {
  const diff = posRef - posActual; // positiu = puja de posició = millora
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
      <td><strong><em>${f.titol}</em></strong> (${f.any})</td>
      <td class="col-subtil">${f.director}</td>
      <td class="col-num col-iic">${val}</td>
      ${varCol}
    </tr>`;
  };

  const thead = `<thead><tr>
    <th class="col-pos">#</th>
    ${esEsp ? '' : '<th class="col-center col-subtil">Top 100</th>'}
    <th>Títol</th>
    <th class="col-subtil">Director/a</th>
    <th class="col-num">${label}</th>
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
};

/* --- Rànquing directors --- */
function construirRànquingDirectors() {
  const cont = document.getElementById('seccio-directors');
  if (!cont) return;

  // Calcular total espectadors Top 100
  const totalEsp = filmsData.filter(f => f.in_top100)
    .reduce((acc, f) => acc + (f.espectadors || 0), 0);

  // Acumular per director
  const dirs = {};
  filmsData.forEach(f => {
    const d = f.director;
    if (!dirs[d]) dirs[d] = { nom: d, top100: 0, esp: 0, citats: 0, filmsTop100: [], filmsContext: [] };
    if (f.in_top100) {
      dirs[d].top100++;
      dirs[d].esp += f.espectadors || 0;
      dirs[d].filmsTop100.push(`${f.titol} (${f.any})`);
    } else {
      dirs[d].filmsContext.push(`${f.titol} (${f.any})`);
    }
    dirs[d].citats++;
  });

  // Rànquing 1: sols Top 100, ordenat per núm. films (desempat espectadors)
  const llista1 = Object.values(dirs).filter(d => d.top100 > 0)
    .sort((a, b) => b.top100 - a.top100 || b.esp - a.esp);

  // Rànquing 2: tots els citats, ordenat per espectadors totals
  const llista2 = Object.values(dirs).filter(d => d.top100 > 0 || d.citats > 1)
    .map(d => ({ ...d, espTotal: d.esp }))
    .sort((a, b) => b.espTotal - a.espTotal);

  // Posicions del rànquing 1 per calcular Var. al rànquing 2
  const posR1 = {};
  llista1.forEach((d, i) => { posR1[d.nom] = i + 1; });

  const filaR1 = (d, i) => `<tr>
    <td class="col-pos">${i+1}</td>
    <td class="col-num">${d.top100}</td>
    <td><strong>${d.nom}</strong><br><span class="films-llista">${d.filmsTop100.map(t=>`<em>${t}</em>`).join(' · ')}</span></td>
    <td class="col-num">${fmt(d.esp)}</td>
    <td class="col-num col-gris">${(d.esp/totalEsp*100).toFixed(1)}%</td>
  </tr>`;

  const filaR2 = (d, i) => {
    const posActual = i + 1;
    const posRef = posR1[d.nom] || '—';
    const vHtml = posRef !== '—' ? varHtml(posActual, posRef) : '—';
    return `<tr${i>=10?' style="display:none" class="fila-extra"':''}>
      <td class="col-pos">${posActual}</td>
      <td class="col-var">${vHtml}</td>
      <td class="col-num">${d.top100}</td>
      <td class="col-num">${d.citats - d.top100 > 0 ? '+' + (d.citats - d.top100) : '—'}</td>
      <td><strong>${d.nom}</strong><br>
        <span class="films-llista">${d.filmsTop100.map(t=>`<em>${t}</em>`).join(' · ')}</span>
        ${d.filmsContext.length ? `<br><span class="films-llista col-gris">${d.filmsContext.map(t=>`<em>${t}</em>`).join(' · ')}</span>` : ''}
      </td>
      <td class="col-num">${fmt(d.espTotal)}</td>
    </tr>`;
  };

  cont.innerHTML = `
    <h3 class="subtitol-ranking">Top 10 per directors — sols films Top 100</h3>
    <p class="nota-taula">Directors per nombre de films al Top 100 (desempat per espectadors acumulats).</p>
    <table class="taula-ranking">
      <thead><tr>
        <th class="col-pos">#</th>
        <th class="col-num">Films T100</th>
        <th>Director/a · Pel·lícules</th>
        <th class="col-num">Espectadors acumulats</th>
        <th class="col-num col-gris">% total</th>
      </tr></thead>
      <tbody>${llista1.slice(0,10).map((d,i) => filaR1(d,i)).join('')}
        <tr class="fila-boto-context">
          <td colspan="5"><button class="btn-context" onclick="expandirDirectors1(this)">+ Veure llista completa</button></td>
        </tr>
        ${llista1.slice(10).map((d,i) => filaR1(d,i+10).replace('<tr>', '<tr style="display:none" class="fila-extra-d1">')).join('')}
      </tbody>
    </table>

    <h3 class="subtitol-ranking" style="margin-top:40px">Top 10 per directors — tots els films citats</h3>
    <p class="nota-taula">Incorpora els films de context de cada director. La variació (Var.) indica el canvi de posició respecte al rànquing anterior.</p>
    <table class="taula-ranking">
      <thead><tr>
        <th class="col-pos">#</th>
        <th class="col-var">Var.</th>
        <th class="col-num">T100</th>
        <th class="col-num">Add.</th>
        <th>Director/a · Pel·lícules</th>
        <th class="col-num">Espectadors totals</th>
      </tr></thead>
      <tbody>${llista2.slice(0,10).map((d,i) => filaR2(d,i)).join('')}
        <tr class="fila-boto-context">
          <td colspan="6"><button class="btn-context" onclick="expandirDirectors2(this)">+ Veure llista completa</button></td>
        </tr>
        ${llista2.slice(10).map((d,i) => filaR2(d,i+10)).join('')}
      </tbody>
    </table>`;
}

window.expandirDirectors1 = function(btn) {
  document.querySelectorAll('.fila-extra-d1').forEach(tr => tr.style.display = tr.style.display !== 'none' ? 'none' : '');
  btn.textContent = btn.textContent.startsWith('+') ? '− Amagar' : '+ Veure llista completa';
};
window.expandirDirectors2 = function(btn) {
  document.querySelectorAll('#seccio-directors .fila-extra').forEach(tr => tr.style.display = tr.style.display !== 'none' ? 'none' : '');
  btn.textContent = btn.textContent.startsWith('+') ? '− Amagar' : '+ Veure llista completa';
};

function construirRànquings() {
  construirRànquing('espectadors', 'seccio-espectadors', 'Espectadors');
  construirRànquing('penetracio', 'seccio-penetracio', 'Penetració');
  construirRànquing('quota', 'seccio-quota', 'Quota de mercat');
  construirRànquing('iic', 'seccio-iic', 'IIC');
  construirRànquingDirectors();
}

document.addEventListener('DOMContentLoaded', carregarFilms);
