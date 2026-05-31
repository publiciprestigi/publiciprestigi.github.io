/* Públic i Prestigi — Part III: Anàlisi */

let festivalsData = [];
let filmsData = [];
let marketData = [];

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
    const [rf, ri, rm] = await Promise.all([
      fetch('data/festivals.json'),
      fetch('data/films.json'),
      fetch('data/market.json'),
    ]);
    festivalsData = await rf.json();
    filmsData = await ri.json();
    marketData = await rm.json();
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
    const decada = (f.decada && f.decada !== '—') ? f.decada : '—';
    return `<tr style="background:${bg};border-bottom:2px solid #fff">
      <td class="col-pos">${i+1}</td>
      <td>${titolFilm(f)}</td>
      <td class="col-subtil">${f.director}</td>
      <td>${nomFest(f.festival)}</td>
      <td class="col-center">${premi}</td>
      <td class="col-center col-subtil">#${f.top100_pos}</td>
      <td class="col-subtil col-decada">${decada}</td>
      <td class="col-num col-subtil">${fmt(f.espectadors)}</td>
    </tr>`;
  }).join('');

  cont.innerHTML = `
    <table class="taula-festivals">
      <thead><tr>
        <th class="col-pos">#</th>
        <th style="width:40%">Títol</th>
        <th class="col-subtil" style="width:12%">Director</th>
        <th style="width:100px">Festival</th>
        <th class="col-center" style="width:55px">Premi</th>
        <th class="col-center" style="width:70px">Top 100</th>
        <th class="col-subtil" style="width:75px">Dècada</th>
        <th class="col-num" style="width:110px">Espectadors</th>
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
    const decada = (f.decada && f.decada !== '—') ? f.decada : '—';
    return `<tr style="background:${bg};border-bottom:2px solid #fff">
      <td class="col-pos">${i+11}</td>
      <td>${titolFilm(f)}</td>
      <td class="col-subtil">${f.director}</td>
      <td>${nomFest(f.festival)}</td>
      <td class="col-center">${premi}</td>
      <td class="col-center col-subtil">—</td>
      <td class="col-subtil col-decada">${decada}</td>
      <td class="col-num col-subtil">${fmt(f.espectadors)}</td>
    </tr>`;
  }).join('');

  cont.innerHTML = `
    <table class="taula-festivals">
      <thead><tr>
        <th class="col-pos">#</th>
        <th style="width:40%">Títol</th>
        <th class="col-subtil" style="width:12%">Director</th>
        <th style="width:100px">Festival</th>
        <th class="col-center" style="width:55px">Premi</th>
        <th class="col-center" style="width:70px">Top 100</th>
        <th class="col-subtil" style="width:75px">Dècada</th>
        <th class="col-num" style="width:110px">Espectadors</th>
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
    // Mercat mitjà anual de la dècada (M entrades)
    const mercatDec = marketData.filter(x => getDecada(x.any) === d).map(x => x.entrades_M);
    const mercatMit = mercatDec.length ? mercatDec.reduce((a,b) => a+b, 0) / mercatDec.length : 0;
    return { decada: d, label: DEC_LABELS[d], sel, premiats, dc, mitF, mit20, ratio, mercatMit };
  });
}

function construirBretxa() {
  const taula = document.getElementById('taula-bretxa');
  if (!taula) return;

  bretxaDades = calcularBretxa();

  // Etiquetes curtes (com Part I "Resum per dècada")
  const ETIQ_CURTA = {
    '60s':'60s','70s':'70s','80s':'80s','90s':'90s',
    '2000s':'2000s','2010s':'2010s','2020s':'2020s'
  };

  // Colors semàfor segons ràtio
  function colorRatio(r) {
    if (r > 0.25)  return { fons: '#e6f0e8', text: '#2E7D5E' }; // verd
    if (r >= 0.10) return { fons: '#faefdb', text: '#b87509' }; // taronja
    return { fons: '#f7e3e3', text: '#a93226' };                // vermell
  }

  const files = bretxaDades.map(r => {
    const c = colorRatio(r.ratio);
    return `<tr style="background:${c.fons};border-bottom:2px solid #fff">
      <td class="col-center"><strong>${ETIQ_CURTA[r.decada]}</strong></td>
      <td class="col-center" style="color:#6b6b6b">${r.dc}</td>
      <td class="col-num">${fmt(r.mitF)}</td>
      <td class="col-num">${fmt(r.mit20)}</td>
      <td class="col-center"><strong style="color:${c.text}">${r.ratio.toFixed(2)}</strong></td>
    </tr>`;
  }).join('');

  taula.innerHTML = `
    <table class="taula-festivals">
      <thead><tr>
        <th class="col-center" style="width:80px">Dècada</th>
        <th class="col-center" style="width:110px">Doble corona</th>
        <th class="col-num" style="width:140px">Mitjana festivals</th>
        <th class="col-num" style="width:140px">Mitjana Top 100</th>
        <th class="col-center" style="width:110px">Ràtio bretxa</th>
      </tr></thead>
      <tbody>${files}</tbody>
    </table>`;
}

// Es crida LAZY des de mostraSeccio() quan es visita 'bretxa' per primera vegada
window.PiP_graficBretxa = function() {
  const grafic = document.getElementById('grafic-bretxa');
  if (!grafic || typeof Chart === 'undefined' || !bretxaDades) return;
  if (window._chartBretxa) window._chartBretxa.destroy();

  // Color de cada punt de la ràtio segons llindar (semàfor)
  function colorPunt(r) {
    if (r > 0.25)  return '#2E7D5E'; // verd
    if (r >= 0.10) return '#b87509'; // taronja
    return '#a93226';                // vermell
  }
  const colorsPunts = bretxaDades.map(r => colorPunt(r.ratio));

  const ctx = grafic.getContext('2d');
  window._chartBretxa = new Chart(ctx, {
    type: 'line',
    data: {
      labels: bretxaDades.map(r => r.label),
      datasets: [
        {
          label: 'Mercat anual mitjà (M entrades)',
          data: bretxaDades.map(r => +r.mercatMit.toFixed(1)),
          borderColor: '#b8b8b8',
          backgroundColor: 'rgba(184,184,184,0.10)',
          borderWidth: 2,
          borderDash: [6, 4],
          pointRadius: 4,
          pointBackgroundColor: '#b8b8b8',
          pointBorderColor: '#fff',
          pointBorderWidth: 1.5,
          tension: 0.25,
          fill: true,
          yAxisID: 'yMercat',
          order: 2,
        },
        {
          label: 'Ràtio bretxa',
          data: bretxaDades.map(r => +r.ratio.toFixed(3)),
          borderColor: '#363737',
          backgroundColor: 'transparent',
          borderWidth: 2.5,
          pointRadius: 7,
          pointHoverRadius: 9,
          pointBackgroundColor: colorsPunts,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          tension: 0.25,
          fill: false,
          yAxisID: 'yRatio',
          order: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: { boxWidth: 14, font: { size: 11 } },
        },
        tooltip: {
          callbacks: {
            label: ctx => {
              if (ctx.dataset.yAxisID === 'yRatio')
                return `Ràtio bretxa: ${ctx.parsed.y.toFixed(2)}`;
              return `Mercat: ${ctx.parsed.y.toFixed(0)} M entrades`;
            },
          },
        },
      },
      scales: {
        yRatio: {
          type: 'linear',
          position: 'left',
          min: 0,
          max: 0.4,
          ticks: { callback: v => v.toFixed(2), color: '#363737', font: { size: 11 } },
          grid: { color: '#eee' },
          title: { display: true, text: 'Ràtio bretxa', font: { size: 12 }, color: '#363737' },
        },
        yMercat: {
          type: 'linear',
          position: 'right',
          min: 0,
          max: 400,
          ticks: { callback: v => v + ' M', color: '#888', font: { size: 11 } },
          grid: { display: false },
          title: { display: true, text: 'Mercat anual (M entrades)', font: { size: 12 }, color: '#888' },
        },
        x: {
          ticks: { color: '#363737', font: { size: 11 } },
          grid: { display: false },
        },
      },
    },
  });
};



window.PiP_graficCorpus = function() {
  const grafic = document.getElementById('grafic-corpus');
  if (!grafic || typeof Chart === 'undefined' || !bretxaDades) return;
  if (window._chartCorpus) window._chartCorpus.destroy();
  const ctx = grafic.getContext('2d');

  window._chartCorpus = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: bretxaDades.map(r => r.label),
      datasets: [
        {
          label: 'Films seleccionats',
          data: bretxaDades.map(r => r.sel),
          backgroundColor: '#c8d4dc',
          borderColor: '#9eb0bb',
          borderWidth: 1,
        },
        {
          label: 'Films premiats',
          data: bretxaDades.map(r => r.premiats),
          backgroundColor: '#daa520',
          borderColor: '#a98217',
          borderWidth: 1,
        },
        {
          label: 'Doble corona (Top 100)',
          data: bretxaDades.map(r => r.dc),
          backgroundColor: '#363737',
          borderColor: '#1f1f1f',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: { boxWidth: 14, font: { size: 11 } },
        },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y}`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: '#363737', font: { size: 11 } },
          grid: { color: '#eee' },
          title: { display: true, text: 'Nombre de films', font: { size: 12 } },
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
