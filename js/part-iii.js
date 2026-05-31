/* Públic i Prestigi — Part III: Anàlisi */

let festivalsData = [];

const FC = {
  'Cannes':       '#9B2335',
  'Berlín':       '#1E4080',
  'Venècia':      '#2E7D5E',
  'Sant Sebastià':'#6B3FA0',
};

const fmt = n => n == null ? '—' : n.toLocaleString('ca-ES');

function titolFilm(f) {
  return `<strong><em>${f.titol}</em></strong> <span class="film-any">(${f.any})</span>`;
}

function nomFest(festival) {
  return `<strong style="color:${FC[festival]}">${festival}</strong>`;
}

async function carregarDades() {
  try {
    const r = await fetch('data/festivals.json');
    festivalsData = await r.json();
    construirDobleCorona();
    construirSegonCercle();
  } catch(e) { console.error('Error:', e); }
}

/* ============================================================
   DOBLE CORONA — Films de festival presents al Top 100
   ============================================================ */
function construirDobleCorona() {
  const cont = document.getElementById('taula-doble-corona');
  if (!cont) return;

  // Films únics in_top100 (deduplicació per títol+any si està a >1 festival)
  const seen = new Map();
  festivalsData.filter(f => f.in_top100).forEach(f => {
    const k = f.titol + '|' + f.any;
    if (!seen.has(k)) seen.set(k, f);
  });
  const films = [...seen.values()].sort((a,b) => (b.espectadors||0) - (a.espectadors||0));

  const files = films.map((f, i) => {
    const bg = i % 2 === 0 ? '#ffffff' : '#f7f7f7';
    const premi = f.premiat ? '<span class="estrella">★</span>' : '';
    return `<tr style="background:${bg};border-bottom:2px solid #fff">
      <td class="col-pos">${i+1}</td>
      <td>${titolFilm(f)}</td>
      <td class="col-subtil">${f.director}</td>
      <td>${nomFest(f.festival)}</td>
      <td class="col-center">${premi}</td>
      <td class="col-num col-subtil">${fmt(f.espectadors)}</td>
      <td class="col-center col-subtil">#${f.top100_pos}</td>
    </tr>`;
  }).join('');

  cont.innerHTML = `
    <table class="taula-festivals">
      <thead><tr>
        <th class="col-pos">#</th>
        <th style="width:34%">Títol</th>
        <th class="col-subtil" style="width:18%">Director</th>
        <th style="width:110px">Festival</th>
        <th class="col-center" style="width:55px">Premi</th>
        <th class="col-num" style="width:115px">Espectadors</th>
        <th class="col-center" style="width:75px">Top 100</th>
      </tr></thead>
      <tbody>${files}</tbody>
    </table>`;
}

/* ============================================================
   SEGON CERCLE — Films de festival amb ≥ 1M no al Top 100
   ============================================================ */
function construirSegonCercle() {
  const cont = document.getElementById('taula-segon-cercle');
  if (!cont) return;

  const seen = new Map();
  festivalsData
    .filter(f => !f.in_top100 && (f.espectadors||0) >= 1_000_000)
    .forEach(f => {
      const k = f.titol + '|' + f.any;
      if (!seen.has(k)) seen.set(k, f);
    });
  const films = [...seen.values()]
    .sort((a,b) => (b.espectadors||0) - (a.espectadors||0))
    .slice(0, 15);

  const files = films.map((f, i) => {
    const bg = i % 2 === 0 ? '#ffffff' : '#f7f7f7';
    const premi = f.premiat ? '<span class="estrella">★</span>' : '';
    return `<tr style="background:${bg};border-bottom:2px solid #fff">
      <td class="col-pos">${i+11}</td>
      <td>${titolFilm(f)}</td>
      <td class="col-subtil">${f.director}</td>
      <td>${nomFest(f.festival)}</td>
      <td class="col-center">${premi}</td>
      <td class="col-num col-subtil">${fmt(f.espectadors)}</td>
    </tr>`;
  }).join('');

  cont.innerHTML = `
    <table class="taula-festivals">
      <thead><tr>
        <th class="col-pos">#</th>
        <th style="width:34%">Títol</th>
        <th class="col-subtil" style="width:18%">Director</th>
        <th style="width:110px">Festival</th>
        <th class="col-center" style="width:55px">Premi</th>
        <th class="col-num" style="width:115px">Espectadors</th>
      </tr></thead>
      <tbody>${files}</tbody>
    </table>`;
}

document.addEventListener('DOMContentLoaded', carregarDades);
