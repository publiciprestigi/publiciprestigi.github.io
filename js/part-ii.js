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
  cont.innerHTML = `
    <div class="contingut-text">
      <p>Les quatre taules que segueixen recullen totes les pel·lícules espanyoles documentades en secció oficial a concurs a <strong style="color:${FC['Cannes']}">Cannes</strong> (28), <strong style="color:${FC['Berlín']}">Berlín</strong> (42), <strong style="color:${FC['Venècia']}">Venècia</strong> (30) i <strong style="color:${FC['Sant Sebastià']}">Sant Sebastià</strong> (167) entre 1965 i 2025 (un total de 267). Per a cada film s'indica si apareix al Top 100 d'espectadors de la Part I (posició global, posició dins la dècada i nombre d'espectadors acumulats segons fitxa vigent de l'ICAA a març del 2026).</p>
      <p>L'ordre de presentació respon al prestigi internacional consagrat per la FIAPF: Cannes, Berlín i Venècia formen la tríada dels festivals de classe A de referència mundial. Sant Sebastià, tot i tenir la mateixa categoria, és un festival d'àmbit i projecció relativament menor. Aquesta diferència de rang explica per què el cinema espanyol hi té una presència molt superior numèricament: el festival és percebut per la indústria nacional com una finestra natural per a produccions de qualitat orientades al mercat domèstic, cosa que genera una sobrerepresentació respecte als tres grans festivals europeus.</p>
      <p>Una nota metodològica prèvia sobre el valor de les dades que segueixen: la selecció oficial a competició en un dels quatre grans festivals és, en si mateixa, un reconeixement de primer nivell: és la institució del festival que valida el film davant la comunitat cinematogràfica internacional i el col·loca en el debat crític global. Aquesta validació no és trivial —menys de l'1% de la producció mundial de cada any accedeix a la competició oficial de Cannes, Berlín o Venècia.</p>
      <p>Els premis que atorguen els jurats posteriorment afegeixen un reconeixement addicional, però de naturalesa diferent: depenen de la composició canviant del jurat, de les tendències estètiques del moment, dels equilibris geogràfics i polítics, i d'un grau inevitable de subjectivitat. No mesuren qualitat objectiva sinó que reflecteixen el consens d'un grup concret en un moment concret. Per això, en aquest document tractem tot el corpus de pel·lícules seleccionades, premiades o no, com a objecte d'anàlisi rellevant. El símbol ★ assenyala els premis obtinguts.</p>
    </div>`;
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
  const titolFestival = {
    'Cannes':       'Festival de Cannes — Compétition officielle',
    'Berlín':       'Festival de Berlín — Wettbewerb',
    'Venècia':      'Festival de Venècia — Concorso',
    'Sant Sebastià':'Festival de Sant Sebastià — Sección Oficial a concurso',
  }[festival];
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
      <h3 class="subtitol-ranking" style="margin-top:32px;color:${color}">${festival}</h3>
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
  let _dirCtr = 0;

  const filmsDir = (d) => {
    const fests = ['Cannes','Berlín','Venècia','Sant Sebastià'];
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

  const fila25 = (d, i) => {
    const id = `d25-${++_dirCtr}`;
    return `<tr>
      <td class="col-pos">${i+1}</td>
      <td>
        <strong>${d.nom}</strong>
        <div id="${id}" class="dir-films-list" style="display:none">${filmsDir(d)}</div>
      </td>
      <td class="col-center">${d.total_sel}</td>
      ${celTotal(d.total_premis)}
      ${cel(d.c_sel, d.c_pr, FC['Cannes'])}
      ${cel(d.b_sel, d.b_pr, FC['Berlín'])}
      ${cel(d.v_sel, d.v_pr, FC['Venècia'])}
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
      (b.c_sel+b.b_sel+b.v_sel)-(a.c_sel+a.b_sel+a.v_sel) ||
      (b.c_pr+b.b_pr+b.v_pr)-(a.c_pr+a.b_pr+a.v_pr)
    ).slice(0, 10);

  const filmsDir3 = (d) => {
    const fests = ['Cannes','Berlín','Venècia'];
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
    return `<tr>
      <td class="col-pos">${i+1}</td>
      <td>
        <strong>${d.nom}</strong>
        <div id="${id}" class="dir-films-list" style="display:none">${filmsDir3(d)}</div>
      </td>
      <td class="col-center">${d.c_sel+d.b_sel+d.v_sel}</td>
      ${celTotal(d.c_pr+d.b_pr+d.v_pr)}
      ${cel(d.c_sel, d.c_pr, FC['Cannes'])}
      ${cel(d.b_sel, d.b_pr, FC['Berlín'])}
      ${cel(d.v_sel, d.v_pr, FC['Venècia'])}
      <td class="col-center">
        <button class="btn-films-dir" onclick="toggleDirFilms('${id}',this)">+</button>
      </td>
    </tr>`;
  };

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
    return `<td>${d.nom}${pr}</td>`;
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
        <th class="col-center">Films</th>
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
        <th class="col-center">Films</th>
      </tr></thead>
      <tbody>
        <tr>
          <td>${nomFest('Cannes')}</td>
          ${celTop3(top3c[0],'c_pr',FC['Cannes'])}
          ${celTop3(top3c[1],'c_pr',FC['Cannes'])}
          ${celTop3(top3c[2],'c_pr',FC['Cannes'])}
          <td class="col-center"><button class="btn-films-dir" onclick="toggleTop3Films('top3-c',this)">+</button>
          <div id="top3-c" class="dir-films-list" style="display:none">${[top3c[0],top3c[1],top3c[2]].filter(Boolean).map(d=>`<span class="dir-films-grup" style="color:${FC['Cannes']}">${d.nom}</span>${festivalsData.filter(f=>f.festival==='Cannes'&&f.director===d.nom).map(f=>`<strong><em>${f.titol}</em></strong>${f.premiat?` <span class="estrella">★</span>`:''} <span class="film-any">(${f.any})</span>`).join(' · ')}`).join('<br>')}</div></td>
        </tr>
        <tr>
          <td>${nomFest('Berlín')}</td>
          ${celTop3(top3b[0],'b_pr',FC['Berlín'])}
          ${celTop3(top3b[1],'b_pr',FC['Berlín'])}
          ${celTop3(top3b[2],'b_pr',FC['Berlín'])}
          <td class="col-center"><button class="btn-films-dir" onclick="toggleTop3Films('top3-b',this)">+</button>
          <div id="top3-b" class="dir-films-list" style="display:none">${[top3b[0],top3b[1],top3b[2]].filter(Boolean).map(d=>`<span class="dir-films-grup" style="color:${FC['Berlín']}">${d.nom}</span>${festivalsData.filter(f=>f.festival==='Berlín'&&f.director===d.nom).map(f=>`<strong><em>${f.titol}</em></strong>${f.premiat?` <span class="estrella">★</span>`:''} <span class="film-any">(${f.any})</span>`).join(' · ')}`).join('<br>')}</div></td>
        </tr>
        <tr>
          <td>${nomFest('Venècia')}</td>
          ${celTop3(top3v[0],'v_pr',FC['Venècia'])}
          ${celTop3(top3v[1],'v_pr',FC['Venècia'])}
          ${celTop3(top3v[2],'v_pr',FC['Venècia'])}
          <td class="col-center"><button class="btn-films-dir" onclick="toggleTop3Films('top3-v',this)">+</button>
          <div id="top3-v" class="dir-films-list" style="display:none">${[top3v[0],top3v[1],top3v[2]].filter(Boolean).map(d=>`<span class="dir-films-grup" style="color:${FC['Venècia']}">${d.nom}</span>${festivalsData.filter(f=>f.festival==='Venècia'&&f.director===d.nom).map(f=>`<strong><em>${f.titol}</em></strong>${f.premiat?` <span class="estrella">★</span>`:''} <span class="film-any">(${f.any})</span>`).join(' · ')}`).join('<br>')}</div></td>
        </tr>
        <tr>
          <td>${nomFest('Sant Sebastià')}</td>
          ${celTop3(top3s[0],'s_pr',FC['Sant Sebastià'])}
          ${celTop3(top3s[1],'s_pr',FC['Sant Sebastià'])}
          ${celTop3(top3s[2],'s_pr',FC['Sant Sebastià'])}
          <td class="col-center"><button class="btn-films-dir" onclick="toggleTop3Films('top3-s',this)">+</button>
          <div id="top3-s" class="dir-films-list" style="display:none">${[top3s[0],top3s[1],top3s[2]].filter(Boolean).map(d=>`<span class="dir-films-grup" style="color:${FC['Sant Sebastià']}">${d.nom}</span>${festivalsData.filter(f=>f.festival==='Sant Sebastià'&&f.director===d.nom).map(f=>`<strong><em>${f.titol}</em></strong>${f.premiat?` <span class="estrella">★</span>`:''} <span class="film-any">(${f.any})</span>`).join(' · ')}`).join('<br>')}</div></td>
        </tr>
      </tbody>
    </table>`;
}

window.toggleTop3Films = function(id, btn) {
  const div = document.getElementById(id);
  if (!div) return;
  const vis = div.style.display !== 'none';
  div.style.display = vis ? 'none' : 'block';
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
