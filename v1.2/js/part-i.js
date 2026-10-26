/* Públic i Prestigi — Part I */

// COLORS_DECADES definit a decades-resum.js

let filmsData = [];

const PIP_ES = document.documentElement.lang === 'es';
const pipT = (ca, es) => PIP_ES ? es : ca;
const pipShowContext = n => PIP_ES
  ? `+ Mostrar ${n} films de contexto (Continuación del ranking de la década)`
  : `+ Mostrar ${n} pel·lícules de context (Continuació del rànquing de la dècada)`;
const pipHideContext = () => pipT('− Amagar pel·lícules de context', '− Ocultar films de contexto');
const pipViewFullList = () => pipT('+ Veure llista completa', '+ Ver lista completa');
const pipHide = () => pipT('− Amagar', '− Ocultar');


async function carregarFilms() {
  try {
    const r = await fetch(pipPath('data/films.json'));
    filmsData = await r.json();
    construirTaulesDècades();
    construirRànquings();
    if (window.PiP_aplicaFade) window.PiP_aplicaFade();
  } catch(e) { console.error('Error:', e); }
}

const md2html = s => s ? s.replace(/\*([^*]+)\*/g, '<em>$1</em>') : '';

const fmt = n => n == null ? '—' : n.toLocaleString(PIP_ES ? 'es-ES' : 'ca-ES');
const fmtPct = (n, e) => n == null ? '—' : n.toFixed(2) + '%' + (e ? '≈' : '');
const fmtIIC = n => n == null ? '—' : n.toFixed(2);
const fmtMercat = (n, e) => n == null ? '—' : n.toFixed(1) + 'M' + (e ? '≈' : '');

function construirFila(film, decada, hidden) {
  const posHist = film.pos_hist ? `${film.pos_hist}` : '—';
  const cls = film.in_top100 ? 'film-top100' : 'film-context';
  const titol = `<strong><em>${film.titol}</em></strong> <span class="film-any">(${film.any})</span>`;
  const bg = decada && COLORS_DECADES[decada] ? COLORS_DECADES[decada].fons : '';
  const display = hidden ? 'display:none;' : '';
  const styleAttr = (bg || display) ? `style="${display}${bg ? 'background:' + bg + ';border-bottom:2px solid #fff' : ''}"` : '';
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
    <td class="col-context-doc">${md2html(PIP_ES ? (film.context_text_es || film.context_text) : film.context_text)}</td>
  </tr>`;
}

function capcalera() {
  return `<thead><tr>
    <th>#</th>
    <th class="col-subtil col-center">T100</th>
    <th>${pipT('Títol','Título')}</th>
    <th class="col-subtil">${pipT('Direcció','Dirección')}</th>
    <th class="col-num">${pipT('Espectadors','Espectadores')}</th>
    <th class="col-num col-gris">${pipT('Mercat','Mercado')}</th>
    <th class="col-num col-gris">${pipT('Penetració','Penetración')}</th>
    <th class="col-num col-gris">${pipT('Quota','Cuota')}</th>
    <th class="col-num col-iic">IIC</th>
    <th class="col-context-doc col-context-header">${pipT('Context','Contexto')}</th>
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
                ${pipShowContext(context.length)}
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
    ? pipShowContext(count)
    : pipHideContext();
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
    <th>${pipT('Títol','Título')}</th>
    <th class="col-subtil">${pipT('Direcció','Dirección')}</th>
    <th class="col-num col-iic">${label}</th>
    ${esEsp ? '' : `<th class="col-var" title="${pipT('Variació respecte al rànquing per espectadors','Variación respecto al ranking por espectadores')}">Var.</th>`}
  </tr></thead>`;

  cont.innerHTML = `<table class="taula-ranking">
    ${thead}
    <tbody>
      ${top10.map((f,i) => fila(f,i)).join('')}
      ${resta.length ? `
        <tr class="fila-boto-context">
          <td colspan="${esEsp ? 4 : 6}">
            <button class="btn-context" onclick="expandirRanking('${contenidorId}', this)">
              ${pipT('+ Veure Top 100 complet', '+ Ver Top 100 completo')}
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
  btn.textContent = visible ? pipT('+ Veure Top 100 complet', '+ Ver Top 100 completo') : pipHide();
  // Amaga/mostra el comentari editorial segons si estem al Top 10 o Top 100
  const seccio = document.getElementById(cid)?.closest('.seccio-contingut');
  if (seccio) {
    const comentari = seccio.querySelector('.text-md-comentari');
    if (comentari) comentari.style.display = visible ? '' : 'none';
  }
};

/* --- Rànquing directors --- */
function construirRànquingDirectors() {
  const cont1 = document.getElementById('taula-directors-r1');
  const cont2 = document.getElementById('taula-directors-r2');
  if (!cont1) return;

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
    .sort((a, b) => b.espTop - a.espTop || b.top100 - a.top100);

  const posR1 = {};
  llista1.forEach((d, i) => { posR1[d.nom] = i + 1; });

  const filaR1 = (d, i) => {
    const id = `dir1-${++ctrDir}`;
    const filmsHtml = d.filmsTop100.join(' · ');
    return `<tr id="${id}-main"${i>=10?' style="display:none" class="fila-extra-d1"':''}>
      <td class="col-pos" style="padding-right:12px;white-space:nowrap">${i+1}</td>
      <td><strong>${d.nom}</strong></td>
      <td class="col-center">${d.top100}</td>
      <td class="col-num">${fmt(d.espTop)}</td>
      <td class="col-num col-gris">${(d.espTop/totalEsp*100).toFixed(1)}%</td>
      <td class="col-center">
        <button class="btn-films-dir" onclick="toggleDirFilms('${id}', this)" title="${pipT('Veure films','Ver films')}">+</button>
      </td>
    </tr>
    <tr id="${id}" data-main-row="${id}-main" style="display:none;background:#f7f7f7">
      <td colspan="2" style="padding:0;border:0"></td>
      <td colspan="4" style="padding-top:12px;padding-bottom:12px;vertical-align:top;max-width:none">
        <div class="dir-films-list" style="max-width:none;margin-top:0;line-height:1.5">${filmsHtml}</div>
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
      vHtml = `<span class="var-nou">${pipT('NOU','NUEVO')}</span>`;
    } else {
      vHtml = varHtml(posActual, posRef);
    }
    const add = d.filmsContext.length;
    let filmsHtml = '';
    if (d.filmsTop100.length) filmsHtml += `<span class="dir-films-grup">Top 100</span>${d.filmsTop100.join(' · ')}`;
    if (d.filmsContext.length) filmsHtml += `<span class="dir-films-grup" style="margin-top:6px">${pipT('Addicionals','Adicionales')}</span>${d.filmsContext.join(' · ')}`;
    return `<tr id="${id}-main"${i>=10?' style="display:none" class="fila-extra-d2"':''}>
      <td class="col-pos" style="padding-right:12px;white-space:nowrap">${posActual}</td>
      <td class="col-var">${vHtml}</td>
      <td><strong>${d.nom}</strong></td>
      <td class="col-center">${d.top100}</td>
      <td class="col-center">${add > 0 ? '+'+add : '—'}</td>
      <td class="col-num">${fmt(d.espTotal)}</td>
      <td class="col-center">
        <button class="btn-films-dir" onclick="toggleDirFilms('${id}', this)" title="${pipT('Veure films','Ver films')}">+</button>
      </td>
    </tr>
    <tr id="${id}" data-main-row="${id}-main" style="display:none;background:#f7f7f7">
      <td colspan="3" style="padding:0;border:0"></td>
      <td colspan="4" style="padding-top:12px;padding-bottom:12px;vertical-align:top;max-width:none">
        <div class="dir-films-list" style="max-width:none;margin-top:0;line-height:1.5">${filmsHtml}</div>
      </td>
    </tr>`;
  };

  cont1.innerHTML = `
    <h3 class="subtitol-ranking-gran">${pipT('Només films del Top 100','Solo films del Top 100')}</h3>
    <table class="taula-ranking" style="table-layout:fixed">
      <colgroup><col style="width:6%"><col style="width:31%"><col style="width:17%"><col style="width:28%"><col style="width:11%"><col style="width:7%"></colgroup>
      <thead><tr>
        <th class="col-pos">#</th>
        <th>Direcció</th>
        <th class="col-center">${pipT('Núm. films','N.º de films')}</th>
        <th class="col-num" style="text-align:right">${pipT('Espectadors acumulats','Espectadores acumulados')}</th>
        <th class="col-num col-gris">${pipT('% total','% total')}</th>
        <th class="col-center">Films</th>
      </tr></thead>
      <tbody>
        ${llista1.slice(0,10).map((d,i) => filaR1(d,i)).join('')}
        <tr class="fila-boto-context">
          <td colspan="6"><button class="btn-context" onclick="expandirD1(this)">${pipViewFullList()}</button></td>
        </tr>
        ${llista1.slice(10).map((d,i) => filaR1(d,i+10)).join('')}
      </tbody>
    </table>`;

  cont2.innerHTML = `
    <h3 class="subtitol-ranking-gran">${pipT('De tots els films citats (Top 100 + context)','De todos los films citados (Top 100 + contexto)')}</h3>
    <table class="taula-ranking" style="table-layout:fixed">
      <colgroup><col style="width:6%"><col style="width:7%"><col style="width:25%"><col style="width:17%"><col style="width:8%"><col style="width:30%"><col style="width:7%"></colgroup>
      <thead><tr>
        <th class="col-pos">#</th>
        <th class="col-var">Var.</th>
        <th>Direcció</th>
        <th class="col-center">${pipT('Núm. films','N.º de films')}</th>
        <th class="col-center">Add.</th>
        <th class="col-num" style="text-align:right">${pipT('Espectadors totals','Espectadores totales')}</th>
        <th class="col-center">Films</th>
      </tr></thead>
      <tbody>
        ${llista2.slice(0,10).map((d,i) => filaR2(d,i)).join('')}
        <tr class="fila-boto-context">
          <td colspan="7"><button class="btn-context" onclick="expandirD2(this)">${pipViewFullList()}</button></td>
        </tr>
        ${llista2.slice(10).map((d,i) => filaR2(d,i+10)).join('')}
      </tbody>
    </table>`;
}

window.toggleDirFilms = function(id, btn) {
  const row = document.getElementById(id);
  if (!row) return;
  const vis = row.style.display !== 'none';
  row.style.display = vis ? 'none' : 'table-row';
  const mainRow = document.getElementById(row.dataset.mainRow || '');
  if (mainRow) mainRow.style.borderBottom = vis ? '' : '0';
  btn.textContent = vis ? '+' : '−';
};

window.expandirD1 = function(btn) {
  document.querySelectorAll('.fila-extra-d1').forEach(tr => tr.style.display = tr.style.display !== 'none' ? 'none' : '');
  btn.textContent = btn.textContent.startsWith('+') ? pipHide() : pipViewFullList();
};
window.expandirD2 = function(btn) {
  document.querySelectorAll('.fila-extra-d2').forEach(tr => tr.style.display = tr.style.display !== 'none' ? 'none' : '');
  btn.textContent = btn.textContent.startsWith('+') ? pipHide() : pipViewFullList();
};


/* Comparació transversal dels quatre rànquings. Mateix corpus Top 100 i
   mateix ordenament que les taules, incloent-hi empats estables. */
function construirComparativaRankings() {
  const cont = document.getElementById('pip-comparativa-rankings');
  if (!cont) return;
  const films = filmsData.filter(f => f.in_top100);
  const camps = ['espectadors', 'penetracio', 'quota', 'iic'];
  const labels = PIP_ES ? ['Espectadores', 'Penetración', 'Cuota', 'IIC'] :
    ['Espectadors', 'Penetració', 'Quota', 'IIC'];
  const posicions = {};
  camps.forEach(k => {
    posicions[k] = new Map(films.filter(f => f[k] != null)
      .sort((a, b) => b[k] - a[k])
      .map((f, i) => [f.titol, i + 1]));
  });
  const exemples = ['8 apellidos vascos', 'La muerte tenía un precio',
    'Mujeres al borde de un ataque de nervios', 'Padre no hay más que uno 3',
    'Los otros'].filter(t => films.some(f => f.titol === t));
  const color = ['#577a9d', '#b98248', '#608f75', '#a76a88', '#777d88'];
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  cont.innerHTML = 
    '<h3 class="pip-rankcomp-titol">' + pipT('Quatre mirades sobre l’èxit', 'Cuatro miradas sobre el éxito') + '</h3>' +
    '<p class="pip-rankcomp-intro">' + pipT(
      'Com canvia la posició d’una pel·lícula segons la manera de mesurar-ne el públic? Les línies mostren cinc casos representatius. Tria qualsevol film del Top 100 per destacar-ne el recorregut.',
      '¿Cómo cambia la posición de una película según cómo se mida su público? Las líneas muestran cinco casos representativos. Elige cualquier película del Top 100 para destacar su recorrido.'
    ) + '</p>' +
    '<label class="pip-rankcomp-label" for="pip-rankcomp-tria">' + pipT('Pel·lícula', 'Película') + '</label> ' +
    '<select id="pip-rankcomp-tria" class="pip-rankcomp-select"></select>' +
    '<div class="pip-rankcomp-grafic" id="pip-rankcomp-grafic"></div>' +
    '<div class="pip-rankcomp-detall" id="pip-rankcomp-detall" aria-live="polite"></div>' +
    '<p class="pip-rankcomp-nota">' + pipT(
      'Les posicions es calculen sobre les mateixes 100 pel·lícules dels rànquings anteriors. Un número més baix indica una posició més alta. L’IIC combina quota i penetració, no és una mitjana de posicions.',
      'Las posiciones se calculan sobre las mismas 100 películas de los rankings anteriores. Un número menor indica una posición superior. El IIC combina cuota y penetración, no es una media de posiciones.'
    ) + '</p>';
  const select = cont.querySelector('#pip-rankcomp-tria');
  [...films].sort((a, b) => a.titol.localeCompare(b.titol, PIP_ES ? 'es' : 'ca')).forEach(f => {
    const opt = document.createElement('option');
    opt.value = f.titol;
    opt.textContent = f.titol + ' (' + f.any + ')';
    select.appendChild(opt);
  });
  select.value = exemples.includes('La muerte tenía un precio') ?
    'La muerte tenía un precio' : films[0].titol;
  const graph = cont.querySelector('#pip-rankcomp-grafic');
  const detall = cont.querySelector('#pip-rankcomp-detall');
  const x = [110, 310, 510, 710];
  const y = pos => 57 + (pos - 1) * 2.5;
  const punt = (t, k) => posicions[k].get(t);
  function draw() {
    const seleccionat = select.value;
    const inclosos = [...new Set([...exemples, seleccionat])];
    const linia = (t, c, sel) => {
      const points = camps.map((k, i) => ({ x: x[i], y: y(punt(t, k)), p: punt(t, k) }))
        .filter(d => Number.isFinite(d.y));
      if (points.length !== 4) return '';
      const d = points.map((v, i) => (i ? 'L' : 'M') + v.x + ' ' + v.y.toFixed(2)).join(' ');
      return '<path d="' + d + '" fill="none" stroke="' + c + '" stroke-width="' + (sel ? 4 : 2) +
        '" opacity="' + (sel ? 1 : .40) + '" stroke-linejoin="round" />' +
        points.map(v => '<circle cx="' + v.x + '" cy="' + v.y.toFixed(2) +
          '" r="' + (sel ? 6 : 3) + '" fill="' + c + '" stroke="white" stroke-width="' + (sel ? 1.5 : .5) + '"/>').join('');
    };
    let svg = '<svg viewBox="0 0 820 332" role="img" aria-label="' +
      esc(pipT('Comparació de les posicions als quatre rànquings',
        'Comparación de posiciones en los cuatro rankings')) +
      '" xmlns="http://www.w3.org/2000/svg">';
    [1, 25, 50, 75, 100].forEach(p => {
      const yy = y(p);
      svg += '<line x1="110" y1="' + yy + '" x2="710" y2="' + yy +
        '" stroke="currentColor" stroke-opacity=".10" stroke-dasharray="3 5"/>' +
        '<text x="89" y="' + (yy + 4) + '" fill="currentColor" opacity=".65" font-size="12" text-anchor="end">#' + p + '</text>';
    });
    camps.forEach((k, i) => {
      svg += '<line x1="' + x[i] + '" y1="51" x2="' + x[i] +
        '" y2="311" stroke="currentColor" stroke-opacity=".22"/>' +
        '<text x="' + x[i] + '" y="25" text-anchor="middle" fill="currentColor" font-size="14" font-weight="600">' +
        esc(labels[i]) + '</text>';
    });
    inclosos.filter(t => t !== seleccionat).forEach(t => svg += linia(t, color[exemples.indexOf(t)] || '#92999f', false));
    svg += linia(seleccionat, '#b85d36', true);
    svg += '</svg>';
    graph.innerHTML = svg;
    const fs = films.find(f => f.titol === seleccionat);
    detall.innerHTML = '<strong><em>' + esc(seleccionat) + '</em></strong> ' +
      '<span>(' + (fs ? fs.any : '') + ')</span> · ' +
      camps.map((k, i) => esc(labels[i]) + ' <strong>#' + (punt(seleccionat, k) || '—') + '</strong>').join(' · ');
  }
  select.addEventListener('change', draw);
  draw();
}

function construirRànquings() {
  construirRànquing('espectadors', 'taula-espectadors', pipT('Espectadors','Espectadores'));
  construirRànquing('penetracio',  'taula-penetracio',  pipT('Penetració','Penetración'));
  construirRànquing('quota',       'taula-quota',       pipT('Quota de mercat','Cuota de mercado'));
  construirRànquing('iic',         'taula-iic',         'IIC');
  construirComparativaRankings();
  construirRànquingDirectors();
}

document.addEventListener('DOMContentLoaded', carregarFilms);

