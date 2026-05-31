/* Públic i Prestigi — Part III: Anàlisi */

let festivalsData = [];
let filmsData = [];

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
    const [rf, ri] = await Promise.all([
      fetch('data/festivals.json'),
      fetch('data/films.json'),
    ]);
    festivalsData = await rf.json();
    filmsData = await ri.json();
    construirDobleCorona();
    construirSegonCercle();
    construirBretxa();
  } catch(e) { console.error('Error:', e); }
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
      <td class="col-center"><strong>#${f.top100_pos}</strong></td>
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

/* ============================================================
   BRETXA — Evolució públic vs. prestigi per dècada
   ============================================================ */
let bretxaDades = null;

function calcularBretxa() {
  const DEC_ORDRE  = ['60s','70s','80s','90s','2000s','2010s','2020s'];
  const DEC_LABELS = {
    '60s':   'Anys 1965–1969',
    '70s':   'Anys 70',
    '80s':   'Anys 80',
    '90s':   'Anys 90',
    '2000s': 'Anys 2000–2009',
    '2010s': 'Anys 2010–2019',
    '2020s': 'Anys 2020–2025',
  };

  return DEC_ORDRE.map(d => {
    const fest = festivalsData.filter(f => getDecada(f.any) === d);
    const sel = fest.length;
    const premiats = fest.filter(f => f.premiat).length;
    const seen = new Set();
    let dc = 0;
    fest.forEach(f => {
      if (f.in_top100) {
        const k = f.titol + '|' + f.any;
        if (!seen.has(k)) { seen.add(k); dc++; }
      }
    });
    const espF = fest.map(f => f.espectadors).filter(v => v != null && v > 0);
    const mitF = espF.length ? Math.round(espF.reduce((a,b) => a + b, 0) / espF.length) : 0;
    const top20 = filmsData
      .filter(film => film.decada === d)
      .sort((a, b) => (b.espectadors || 0) - (a.espectadors || 0))
      .slice(0, 20);
    const mit20 = top20.length
      ? Math.round(top20.reduce((s, f) => s + (f.espectadors || 0), 0) / top20.length)
      : 0;
    const ratio = mit20 ? mitF / mit20 : 0;
    return { decada: d, label: DEC_LABELS[d], sel, premiats, dc, mitF, mit20, ratio };
  });
}

function construirBretxa() {
  const taula = document.getElementById('taula-bretxa');
  if (!taula) return;

  bretxaDades = calcularBretxa();

  const files = bretxaDades.map((r, i) => {
    const bg = i % 2 === 0 ? '#ffffff' : '#f7f7f7';
    return `<tr style="background:${bg};border-bottom:2px solid #fff">
      <td><strong>${r.label}</strong></td>
      <td class="col-center col-subtil">${r.sel}</td>
      <td class="col-center col-subtil">${r.premiats}</td>
      <td class="col-center col-subtil">${r.dc}</td>
      <td class="col-num col-subtil">${fmt(r.mitF)}</td>
      <td class="col-num col-subtil">${fmt(r.mit20)}</td>
      <td class="col-center"><strong>${r.ratio.toFixed(2)}</strong></td>
    </tr>`;
  }).join('');

  taula.innerHTML = `
    <table class="taula-festivals">
      <thead><tr>
        <th>Dècada</th>
        <th class="col-center" style="width:55px">Sel.</th>
        <th class="col-center" style="width:55px">★</th>
        <th class="col-center" style="width:110px">Doble corona</th>
        <th class="col-num" style="width:120px">Mit. festivals</th>
        <th class="col-num" style="width:120px">Mit. Top 20 dèc</th>
        <th class="col-center" style="width:90px">Ràtio bretxa</th>
      </tr></thead>
      <tbody>${files}</tbody>
    </table>`;
}

// Es crida LAZY des de mostraSeccio() quan es visita 'bretxa' per primera vegada
window.PiP_graficBretxa = function() {
  const grafic = document.getElementById('grafic-bretxa');
  if (!grafic || typeof Chart === 'undefined' || !bretxaDades) return;
  if (window._chartBretxa) window._chartBretxa.destroy();
  const ctx = grafic.getContext('2d');
  window._chartBretxa = new Chart(ctx, {
    type: 'line',
    data: {
      labels: bretxaDades.map(r => r.label),
      datasets: [{
        label: 'Ràtio bretxa',
        data: bretxaDades.map(r => +r.ratio.toFixed(3)),
        borderColor: '#363737',
        backgroundColor: 'rgba(54,55,55,0.08)',
        borderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#363737',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        tension: 0.25,
        fill: true,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `Ràtio: ${ctx.parsed.y.toFixed(2)}`,
            afterLabel: ctx => {
              const r = bretxaDades[ctx.dataIndex];
              return [
                `Mit. festivals: ${fmt(r.mitF)}`,
                `Mit. Top 20 dèc: ${fmt(r.mit20)}`,
              ];
            },
          },
        },
      },
      scales: {
        y: {
          min: 0,
          max: 0.4,
          ticks: {
            callback: v => v.toFixed(2),
            color: '#666',
            font: { size: 11 },
          },
          grid: { color: '#eee' },
          title: { display: true, text: 'Ràtio bretxa (festivals / Top 20 dèc)', font: { size: 12 } },
        },
        x: {
          ticks: { color: '#363737', font: { size: 11 } },
          grid: { display: false },
        },
      },
    },
  });
};



document.addEventListener('DOMContentLoaded', carregarDades);
