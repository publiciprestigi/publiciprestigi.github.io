/* Públic i Prestigi — Part II: Prestigi */

let festivalsData = [];

const FC = {
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
    construirFestival('Cannes',       'seccio-cannes');
    construirFestival('Berlín',       'seccio-berlin');
    construirFestival('Venècia',      'seccio-venezia');
    construirFestival('Sant Sebastià','seccio-sansebastia');
    construirRànquingEspectadors();
    construirRànquingDirectors();
  } catch(e) { console.error('Error:', e); }
}

const fmt = n => n == null ? '—' : n.toLocaleString('ca-ES');

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
  const cont = document.getElementById('seccio-premiades');
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
      <h3 class="subtitol-ranking" style="margin-top:28px">${DEC_LABELS[dec]}</h3>
      <table class="taula-festivals">
        <thead><tr>
          <th style="width:45%">Títol</th>
          <th class="col-subtil" style="width:15%">Director</th>
          <th style="width:110px">Festival</th>
          <th style="width:30%">Premi</th>
        </tr></thead>
        <tbody>
          ${films.map(f => `<tr>
            <td>${titolFilm(f)}</td>
            <td class="col-subtil">${f.director}</td>
            <td>${nomFest(f.festival)}</td>
            <td class="col-subtil" style="font-size:0.82rem">${f.premi || '—'}</td>
          </tr>`).join('')}
        </tbody>
      </table>`;
  });
  cont.innerHTML = html;
}

/* ============================================================
   INTRODUCCIÓ
   ============================================================ */
function construirIntroduccio() {
  const cont = document.getElementById('seccio-introduccio');
  if (!cont) return;
  cont.innerHTML = `<p class="en-construccio">Contingut en construcció</p>`;
}

/* ============================================================
   TAULES PER FESTIVAL
   # · Títol · Director · Premi/Observació · Top 100 · Dècada · Espectadors
   ============================================================ */
function construirFestival(festival, seccioId) {
  const cont = document.getElementById(seccioId);
  if (!cont) return;

  const films   = festivalsData.filter(f => f.festival === festival).sort((a,b) => a.any - b.any);
  const color   = FC[festival];
  const total   = films.length;
  const nPremis = films.filter(f => f.premiat).length;

  const files = films.map((f, i) => {
    const isTop  = !!f.top100_pos;
    const rowCls = f.premiat ? 'film-premiat' : '';
    const premi  = f.premiat ? `<span class="estrella">★</span> ${f.premi || ''}` : (f.premi || '—');
    const top100 = isTop ? `${f.top100_pos}` : '—';
    const decada = (f.decada && f.decada !== '—') ? f.decada : '—';
    return `<tr class="${rowCls}">
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
        <th style="width:35%">Títol</th>
        <th class="col-subtil" style="width:13%">Director</th>
        <th style="width:25%">Premi / Observació</th>
        <th class="col-center" style="width:65px">Top 100</th>
        <th class="col-subtil" style="width:85px">Dècada</th>
        <th class="col-num" style="width:90px">Espectadors</th>
      </tr></thead>
      <tbody>${files}</tbody>
    </table>`;
}

/* ============================================================
   RÀNQUING PER ESPECTADORS
   ============================================================ */
function construirRànquingEspectadors() {
  const cont = document.getElementById('seccio-ranking-espectadors');
  if (!cont) return;

  let html = '';
  ['Cannes','Berlín','Venècia','Sant Sebastià'].forEach(festival => {
    const films = festivalsData.filter(f => f.festival === festival && f.espectadors)
      .sort((a,b) => b.espectadors - a.espectadors);
    const top10  = films.slice(0, 10);
    const resta  = films.slice(10);
    const cid    = `resp-${festival.replace(/\s/g,'-')}`;
    const color  = FC[festival];

    const fila = (f, i) => `<tr class="${f.premiat?'film-premiat':''}">
      <td class="col-pos">${i+1}</td>
      <td>${titolFilm(f)}</td>
      <td class="col-subtil">${f.director}</td>
      <td class="col-center">${f.premiat ? '<span class="estrella">★</span>' : ''}</td>
      <td class="col-center col-subtil">${f.top100_pos || '—'}</td>
      <td class="col-num col-subtil">${fmt(f.espectadors)}</td>
    </tr>`;

    html += `
      <h3 class="subtitol-ranking" style="margin-top:32px;padding-left:10px;border-left:3px solid ${color}">${festival}</h3>
      <table class="taula-festivals">
        <thead><tr>
          <th class="col-pos">#</th>
          <th>Títol</th>
          <th class="col-subtil">Director</th>
          <th class="col-center" style="width:50px">Premi</th>
          <th class="col-center" style="width:65px">Top 100</th>
          <th class="col-num">Espectadors</th>
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
  document.querySelectorAll(`.fila-extra-${cid}`).forEach(tr => {
    tr.style.display = tr.style.display !== 'none' ? 'none' : '';
  });
  btn.textContent = btn.textContent.startsWith('+') ? '− Amagar' : '+ Veure tots';
};

/* ============================================================
   RÀNQUING DIRECTORS
   ============================================================ */
function construirRànquingDirectors() {
  const cont = document.getElementById('seccio-ranking-directors');
  if (!cont) return;

  const dirs = {};
  festivalsData.forEach(f => {
    const d = f.director;
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
    b.c_sel-a.c_sel || b.b_sel-a.b_sel || b.v_sel-a.v_sel
  );

  // Helper: cell with sel + ★N in festival color
  const cel = (sel, pr, color) => {
    if (!sel) return `<td class="col-center col-subtil">—</td>`;
    const pr_txt = pr ? ` <span style="color:${color}">★${pr>1?pr:''}</span>` : '';
    return `<td class="col-center">${sel}${pr_txt}</td>`;
  };

  // Total ★ cell
  const celTotal = (pr) => {
    if (!pr) return `<td class="col-center col-subtil">—</td>`;
    return `<td class="col-center">★${pr>1?pr:''}</td>`;
  };

  /* --- TOP 25 TOTS ELS FESTIVALS --- */
  const top25 = llista.slice(0, 25);
  const fila25 = (d, i) => `<tr>
    <td class="col-pos">${i+1}</td>
    <td><strong>${d.nom}</strong></td>
    <td class="col-center">${d.total_sel}</td>
    ${celTotal(d.total_premis)}
    ${cel(d.c_sel, d.c_pr, FC['Cannes'])}
    ${cel(d.b_sel, d.b_pr, FC['Berlín'])}
    ${cel(d.v_sel, d.v_pr, FC['Venècia'])}
    ${cel(d.s_sel, d.s_pr, FC['Sant Sebastià'])}
  </tr>`;

  /* --- TOP 10 TRES GRANS --- */
  const top10_3 = Object.values(dirs)
    .filter(d => d.c_sel+d.b_sel+d.v_sel > 0)
    .sort((a,b) =>
      (b.c_sel+b.b_sel+b.v_sel)-(a.c_sel+a.b_sel+a.v_sel) ||
      (b.c_pr+b.b_pr+b.v_pr)-(a.c_pr+a.b_pr+a.v_pr)
    ).slice(0, 10);

  const fila3 = (d, i) => `<tr>
    <td class="col-pos">${i+1}</td>
    <td><strong>${d.nom}</strong></td>
    <td class="col-center">${d.c_sel+d.b_sel+d.v_sel}</td>
    ${celTotal(d.c_pr+d.b_pr+d.v_pr)}
    ${cel(d.c_sel, d.c_pr, FC['Cannes'])}
    ${cel(d.b_sel, d.b_pr, FC['Berlín'])}
    ${cel(d.v_sel, d.v_pr, FC['Venècia'])}
  </tr>`;

  /* --- TOP 3 MÉS PREMIATS PER FESTIVAL --- */
  const top3PerFest = (festival, key_sel, key_pr) => {
    return Object.values(dirs)
      .filter(d => d[key_sel] > 0)
      .sort((a,b) => b[key_pr]-a[key_pr] || b[key_sel]-a[key_sel])
      .slice(0, 3);
  };

  const top3c = top3PerFest('Cannes','c_sel','c_pr');
  const top3b = top3PerFest('Berlín','b_sel','b_pr');
  const top3v = top3PerFest('Venècia','v_sel','v_pr');
  const top3s = top3PerFest('Sant Sebastià','s_sel','s_pr');

  const celTop3 = (d, key_pr, color) => {
    if (!d) return '<td class="col-subtil">—</td>';
    const pr = d[key_pr] ? ` <span style="color:${color}">★${d[key_pr]>1?d[key_pr]:''}</span>` : '';
    return `<td><strong>${d.nom}</strong>${pr}</td>`;
  };

  cont.innerHTML = `
    <h3 class="subtitol-ranking-gran">Top 25 — Tots els festivals</h3>
    <table class="taula-festivals">
      <thead><tr>
        <th class="col-pos">#</th>
        <th>Director/a</th>
        <th class="col-center">Total sel.</th>
        <th class="col-center">Total ★</th>
        <th class="col-center" style="color:${FC['Cannes']}">Cannes</th>
        <th class="col-center" style="color:${FC['Berlín']}">Berlín</th>
        <th class="col-center" style="color:${FC['Venècia']}">Venècia</th>
        <th class="col-center" style="color:${FC['Sant Sebastià']}">Sant Sebastià</th>
      </tr></thead>
      <tbody>${top25.map((d,i) => fila25(d,i)).join('')}</tbody>
    </table>

    <h3 class="subtitol-ranking-gran" style="margin-top:40px">Top 10 — Només Cannes, Berlín i Venècia</h3>
    <p class="nota-taula">Exclou Sant Sebastià per la seva menor projecció internacional.</p>
    <table class="taula-festivals">
      <thead><tr>
        <th class="col-pos">#</th>
        <th>Director/a</th>
        <th class="col-center">Total sel.</th>
        <th class="col-center">Total ★</th>
        <th class="col-center" style="color:${FC['Cannes']}">Cannes</th>
        <th class="col-center" style="color:${FC['Berlín']}">Berlín</th>
        <th class="col-center" style="color:${FC['Venècia']}">Venècia</th>
      </tr></thead>
      <tbody>${top10_3.map((d,i) => fila3(d,i)).join('')}</tbody>
    </table>

    <h3 class="subtitol-ranking-gran" style="margin-top:40px">Top 3 — Més premiats</h3>
    <table class="taula-festivals">
      <thead><tr>
        <th style="width:110px">Festival</th>
        <th>1r</th>
        <th>2n</th>
        <th>3r</th>
      </tr></thead>
      <tbody>
        <tr>
          <td>${nomFest('Cannes')}</td>
          ${celTop3(top3c[0],'c_pr',FC['Cannes'])}
          ${celTop3(top3c[1],'c_pr',FC['Cannes'])}
          ${celTop3(top3c[2],'c_pr',FC['Cannes'])}
        </tr>
        <tr>
          <td>${nomFest('Berlín')}</td>
          ${celTop3(top3b[0],'b_pr',FC['Berlín'])}
          ${celTop3(top3b[1],'b_pr',FC['Berlín'])}
          ${celTop3(top3b[2],'b_pr',FC['Berlín'])}
        </tr>
        <tr>
          <td>${nomFest('Venècia')}</td>
          ${celTop3(top3v[0],'v_pr',FC['Venècia'])}
          ${celTop3(top3v[1],'v_pr',FC['Venècia'])}
          ${celTop3(top3v[2],'v_pr',FC['Venècia'])}
        </tr>
        <tr>
          <td>${nomFest('Sant Sebastià')}</td>
          ${celTop3(top3s[0],'s_pr',FC['Sant Sebastià'])}
          ${celTop3(top3s[1],'s_pr',FC['Sant Sebastià'])}
          ${celTop3(top3s[2],'s_pr',FC['Sant Sebastià'])}
        </tr>
      </tbody>
    </table>`;
}

document.addEventListener('DOMContentLoaded', carregarFestivals);
