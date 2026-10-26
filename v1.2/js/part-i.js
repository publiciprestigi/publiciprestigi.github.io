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
  const exemples = [
    '8 apellidos vascos', 'La muerte tenía un precio',
    'Mujeres al borde de un ataque de nervios', 'Padre no hay más que uno 3'
  ].filter(t => films.some(f => f.titol === t));
  const colors = ['#577a9d', '#b98248', '#a76a88', '#608f75'];
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const comentaris = [
    ['<em>8 apellidos vascos</em> ',
      'ocupa el primer lloc en les quatre classificacions. Quan totes les mètriques coincideixen, l’IIC no altera la lectura de l’èxit.',
      'ocupa el primer puesto en las cuatro clasificaciones. Cuando todas las métricas coinciden, el IIC no altera la lectura del éxito.'],
    ['<em>La muerte tenía un precio</em> ',
      'és #2 per penetració i #40 per quota. L’IIC la situa a l’#11 i reconeix el seu abast demogràfic sense ignorar que competia en un mercat enorme.',
      'es #2 por penetración y #40 por cuota. El IIC la sitúa en el #11 y reconoce su alcance demográfico sin ignorar que competía en un mercado enorme.'],
    ['<em>Mujeres al borde de un ataque de nervios</em> ',
      'passa del #22 per espectadors al #6 per quota i al #9 per IIC. En el mercat més reduït de 1988, el seu èxit tenia un pes relatiu molt superior al que suggereixen les entrades absolutes.',
      'pasa del #22 por espectadores al #6 por cuota y al #9 por IIC. En el mercado más reducido de 1988, su éxito tenía un peso relativo muy superior al que sugieren las entradas absolutas.'],
    ['<em>Padre no hay más que uno 3</em> ',
      'és #8 per quota però #89 per penetració. L’IIC la situa al #18 i modera el pes d’una quota molt alta en un mercat reduït.',
      'es #8 por cuota pero #89 por penetración. El IIC la sitúa en el #18 y modera el peso de una cuota muy alta en un mercado reducido.']
  ];
  cont.innerHTML =
    '<h3 class="pip-rankcomp-titol">' + pipT('Quatre mirades sobre l’èxit', 'Cuatro miradas sobre el éxito') + '</h3>' +
    '<p class="pip-rankcomp-intro">' + pipT(
      'Com canvia la posició d’una pel·lícula segons la manera de mesurar-ne el públic? Quatre casos mostren què passa quan penetració i quota coincideixen o ofereixen lectures molt diferents.',
      '¿Cómo cambia la posición de una película según cómo se mida su público? Cuatro casos muestran qué ocurre cuando penetración y cuota coinciden u ofrecen lecturas muy distintas.'
    ) + '</p>' +
    '<div class="pip-rankcomp-grafic" id="pip-rankcomp-grafic"></div>' +
    '<div class="pip-rankcomp-explora"><label class="pip-rankcomp-label" for="pip-rankcomp-tria">' +
    pipT('Destaca una altra pel·lícula del Top 100', 'Destaca otra película del Top 100') +
    '</label><select id="pip-rankcomp-tria" class="pip-rankcomp-select"></select>' +
    '<button type="button" class="pip-rankcomp-restablir" id="pip-rankcomp-restablir">' +
    pipT('Veure els quatre exemples', 'Ver los cuatro ejemplos') + '</button></div>' +
    '<ul class="pip-rankcomp-lectures">' +
      comentaris.map(c => '<li>' + c[0] + pipT(c[1], c[2]) + '</li>').join('') +
    '</ul>' +
    '<p class="pip-rankcomp-tancament">' + pipT(
      'L’IIC combina quota i penetració per oferir una lectura conjunta quan aquestes dues perspectives divergeixen.',
      'El IIC combina cuota y penetración para ofrecer una lectura conjunta cuando estas dos perspectivas divergen.'
    ) + '</p>';

  const select = cont.querySelector('#pip-rankcomp-tria');
  const optBase = document.createElement('option');
  optBase.value = '';
  optBase.textContent = pipT('— Selecciona una pel·lícula —', '— Selecciona una película —');
  select.appendChild(optBase);
  [...films].sort((a, b) => b.espectadors - a.espectadors).forEach((f, i) => {
    const opt = document.createElement('option');
    opt.value = f.titol;
    opt.textContent = '#' + (i + 1) + ' · ' + f.titol + ' (' + f.any + ')';
    select.appendChild(opt);
  });

  const graph = cont.querySelector('#pip-rankcomp-grafic');
  const restablir = cont.querySelector('#pip-rankcomp-restablir');
  const eixos = [275, 470, 665, 860];
  const y = pos => 68 + (pos - 1) * 3.0;
  const pos = (t, k) => posicions[k].get(t);
  const titolCurt = t => ({
    '8 apellidos vascos': '8 apellidos vascos',
    'La muerte tenía un precio': 'La muerte tenía un precio',
    'Mujeres al borde de un ataque de nervios': 'Mujeres al borde…',
    'Padre no hay más que uno 3': 'Padre no hay más que uno 3'
  })[t] || t;

  function dibuixar() {
    const triat = select.value;
    // Els quatre exemples sempre són visibles; quan se selecciona un film,
    // es dibuixa una cinquena trajectòria destacada, sense enfosquir les altres.
    const casos = [...exemples];
    if (triat && !casos.includes(triat)) casos.push(triat);
    const desplacaments = [-26, -9, 9, 26, 44]; // separació dels números propers a #1
    const trajectoria = (t, index) => {
      const esExtra = !exemples.includes(t);
      const c = esExtra ? '#2c668e' : colors[exemples.indexOf(t)];
      const dx = desplacaments[index] || 0;
      const punts = camps.map((k, i) => ({x:eixos[i] + dx, y:y(pos(t,k)), p:pos(t,k)}));
      if (punts.some(p=>!Number.isFinite(p.y))) return '';
      let html = '<path d="' + punts.map((p,i)=>(i?'L':'M')+p.x+' '+p.y).join(' ') +
        '" stroke="' + c + '" stroke-width="' + (esExtra ? 3.5 : 2.3) +
        '" fill="none" stroke-linejoin="round"/>';
      html += punts.map(p => '<circle cx="'+p.x+'" cy="'+p.y+'" r="13.4" fill="'+c+
        '" stroke="white" stroke-width="1.5"/><text x="'+p.x+'" y="'+(p.y+4)+
        '" text-anchor="middle" fill="white" font-size="11" font-weight="700">'+p.p+'</text>').join('');
      return html;
    };
    let svg = '<svg viewBox="0 0 1000 395" role="img" aria-label="' +
      esc(pipT('Posicions de quatre pel·lícules en quatre rànquings',
        'Posiciones de cuatro películas en cuatro rankings')) +
      '" xmlns="http://www.w3.org/2000/svg">';
    [1,25,50,75,100].forEach(n=>{
      const yy=y(n);
      svg += '<line x1="245" y1="'+yy+'" x2="900" y2="'+yy+
        '" stroke="currentColor" stroke-opacity=".10" stroke-dasharray="3 5"/>';
    });
    camps.forEach((k,i)=>{
      svg += '<line x1="'+eixos[i]+'" y1="57" x2="'+eixos[i]+
        '" y2="374" stroke="currentColor" stroke-opacity=".19"/>' +
        '<text x="'+eixos[i]+'" y="26" text-anchor="middle" fill="currentColor" font-size="15" font-weight="600">'+
        esc(labels[i])+'</text>';
    });
    // Identificadors fixes dels quatre exemples al lateral esquerre, no com a línies de fons.
    exemples.forEach((t,i)=>{
      const yy=77+i*29;
      svg += '<line x1="15" y1="'+(yy-4)+'" x2="29" y2="'+(yy-4)+
        '" stroke="'+colors[i]+'" stroke-width="4"/>' +
        '<text x="37" y="'+yy+'" font-size="12" fill="currentColor">'+esc(titolCurt(t))+'</text>';
    });
    casos.forEach((t,i)=>{svg+=trajectoria(t,i)});
    if(triat && exemples.includes(triat)){
      const idx=exemples.indexOf(triat);
      svg += '<rect x="9" y="'+(61+idx*29)+'" width="224" height="24" rx="3" fill="none" stroke="'+colors[idx]+'" stroke-width="1.5"/>';
    }
    svg+='</svg>';
    graph.innerHTML=svg;
  }
  select.addEventListener('change',dibuixar);
  restablir.addEventListener('click',()=>{select.value='';dibuixar();});
  dibuixar();
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

