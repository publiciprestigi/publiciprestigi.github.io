/* Públic i Prestigi — Part III: Anàlisi */

let festivalsData = [];
let filmsData = [];
let marketData = [];

const FC = {
  'Cannes':       '#9B2335',
  'Berlín':       '#1976D2',
  'Venècia':      '#2E7D5E',
  'Sant Sebastià':'#E07B2A',
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
    window._filmsData = filmsData;
    window._festivalsData = festivalsData;
    construirDobleCorona();
    construirSegonCercle();
    construirBretxa();
    construirCazaAlcarras();
    construirDuesGeneracions();
    construirLleis();
    window.PiP_graficConclusions1 = construirGraficConclusions1;
    window.PiP_graficConclusions2 = construirGraficConclusions2;
    if (window.PiP_aplicaFade) window.PiP_aplicaFade();
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
    .slice(0, 25);

  const files = films.map((f, i) => {
    const bg = i % 2 === 0 ? '#ffffff' : '#f7f7f7';
    const premi = f.premiat ? '<span class="estrella">★</span>' : '';
    const decada = (f.decada && f.decada !== '—') ? f.decada : '—';
    return `<tr style="background:${bg};border-bottom:2px solid #fff">
      <td class="col-pos">${i+12}</td>
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
    '60s':   '60s',
    '70s':   '70s',
    '80s':   '80s',
    '90s':   '90s',
    '2000s': '2000s',
    '2010s': '2010s',
    '2020s': '2020s',
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



/* ============================================================
   CAZA-ALCARRAS — Taula comparativa i gràfic IAA
   ============================================================ */
function construirCazaAlcarras() {
  const cont = document.getElementById('taula-caza-comparativa');
  if (!cont) return;

  const films = [
    {
      titol: 'La caza', any: 1966, director: 'Carlos Saura',
      festival: 'Berlín', premiat: true,
      espectadors: 341377,
      mercat: '370M≈', penetr: '1,06%≈', quota: '0,09%≈',
      iic: '0,21', iaa_xifra: '341.377', iaa_mult: '', iaa_est: false,
    },
    {
      titol: 'Alcarràs', any: 2022, director: 'Carla Simón',
      festival: 'Berlín', premiat: true,
      espectadors: 403195,
      mercat: '71M', penetr: '0,84%', quota: '0,57%',
      iic: '0,47', iaa_xifra: '~1,31M', iaa_mult: '', iaa_est: true,
    },
  ];

  const COLORS_DEC = {
    '60s':   '#f4f7fa', '70s':   '#edf2f7', '80s':   '#e4ecf4',
    '90s':   '#dae6f0', '2000s': '#cfe0ec', '2010s': '#c3d9e8',
    '2020s': '#b6d2e4',
  };

  const files = films.map((f, i) => {
    const bg = COLORS_DEC[getDecada(f.any)] || '#ffffff';
    const premi = f.premiat ? '<span class="estrella">★</span>' : '';
    const titolCell = `<strong><em>${f.titol}</em></strong> <span class="col-subtil">(${f.any})</span>`;
    const gris = s => `<span style="color:#6b6b6b">${s}</span>`;
    return `<tr style="background:${bg};border-bottom:2px solid #fff">
      <td>${titolCell}</td>
      <td class="col-subtil">${f.director}</td>
      <td>${nomFest(f.festival)}</td>
      <td class="col-center">${premi}</td>
      <td class="col-center col-subtil">—</td>
      <td class="col-num">${fmt(f.espectadors)}</td>
      <td class="col-num col-subtil">${gris(f.mercat)}</td>
      <td class="col-num col-subtil">${gris(f.penetr)}</td>
      <td class="col-num col-subtil">${gris(f.quota)}</td>
      <td class="col-center col-subtil">${f.iic}</td>
      <td class="col-num" style="text-align:right"><strong style="color:#555">${f.iaa_xifra}</strong></td>
    </tr>`;
  }).join('');

  cont.innerHTML = `
    <table class="taula-festivals" style="font-size:0.82em;width:100%">
      <thead><tr>${TAULA_PELI_HEADER}</tr></thead>
      <tbody>${files}</tbody>
    </table>`;
}

window.PiP_graficCazaIAA = function() {
  const el = document.getElementById('grafic-caza-iaa');
  if (!el || typeof Chart === 'undefined') return;
  if (window._chartCazaIAA) window._chartCazaIAA.destroy();

  // Títol del gràfic
  if (!document.getElementById('caza-iaa-tit')) {
    const tit = document.createElement('p');
    tit.id = 'caza-iaa-tit';
    tit.style.cssText = 'font-size:.82em;font-weight:700;color:#363737;text-align:center;margin-bottom:10px';
    tit.innerHTML = 'IAA estimat: <em>La caza</em> (1966) vs. <em>Alcarràs</em> (2022)';
    el.parentNode.insertBefore(tit, el);
  }

  const ctx = el.getContext('2d');

  function hatch(color) {
    const c = document.createElement('canvas');
    c.width = 8; c.height = 8;
    const cx = c.getContext('2d');
    cx.fillStyle = color;
    cx.fillRect(0, 0, 8, 8);
    cx.strokeStyle = 'rgba(255,255,255,0.65)';
    cx.lineWidth = 1.5;
    cx.beginPath();
    cx.moveTo(0, 8); cx.lineTo(8, 0);
    cx.moveTo(-2, 2); cx.lineTo(2, -2);
    cx.moveTo(6, 10); cx.lineTo(10, 6);
    cx.stroke();
    return ctx.createPattern(c, 'repeat');
  }

  // Etiquetes totals al final de cada barra
  const etiquetesTotals = [
    { xifra: '~1,31M', mult: '(×3,25)', total: 1310195 },
    { xifra: '341.377', mult: '(×1,0)', total: 341377 },
  ];

  const pluginTotals = {
    id: 'cazaTotals',
    afterDraw(chart) {
      const ctx2 = chart.ctx;
      ctx2.save();
      ctx2.font = '600 11px "Inter", -apple-system, Arial, sans-serif';
      ctx2.fillStyle = '#363737';
      ctx2.textBaseline = 'middle';
      etiquetesTotals.forEach((et, i) => {
        const x = chart.scales.x.getPixelForValue(et.total) + 6;
        const meta = chart.getDatasetMeta(0);
        const bar = meta.data[i];
        if (!bar) return;
        const y = bar.y;
        ctx2.font = 'bold 13px "Inter", -apple-system, Arial, sans-serif';
        ctx2.fillStyle = '#363737';
        ctx2.fillText(et.xifra, x, y);
        const xifraWidth = ctx2.measureText(et.xifra + ' ').width;
        ctx2.font = '12px "Inter", -apple-system, Arial, sans-serif';
        ctx2.fillStyle = '#888';
        ctx2.fillText(et.mult, x + xifraWidth, y);
      });
      ctx2.restore();
    },
  };

  // Llegenda HTML centrada (en lloc de la de Chart.js)
  if (!document.getElementById('caza-iaa-leg')) {
    const leg = document.createElement('div');
    leg.id = 'caza-iaa-leg';
    leg.style.cssText = 'text-align:center;font-size:11px;margin-top:10px;margin-bottom:24px;display:flex;justify-content:center;align-items:center;gap:14px;flex-wrap:wrap;color:#555;font-family:-apple-system,Arial,sans-serif';
    leg.innerHTML = `
      <span style="display:flex;align-items:center;gap:4px"><span style="width:12px;height:12px;background:#1E4080;display:inline-block;border-radius:2px"></span>Sala</span>
      <span style="display:flex;align-items:center;gap:4px"><span style="width:12px;height:12px;background:#9B2335;display:inline-block;border-radius:2px"></span>TV pública (TV3 + La 2 TVE)</span>
      <span style="display:flex;align-items:center;gap:4px"><span style="width:12px;height:12px;display:inline-block;border-radius:2px;background:repeating-linear-gradient(-45deg,#d4a017,#d4a017 2px,#f5e8c0 2px,#f5e8c0 5px)"></span>TV pagament (estimació)</span>
      <span style="display:flex;align-items:center;gap:4px"><span style="width:12px;height:12px;display:inline-block;border-radius:2px;background:repeating-linear-gradient(-45deg,#6B3FA0,#6B3FA0 2px,#e8dff5 2px,#e8dff5 5px)"></span>Plataformes (estimació)</span>`;
    el.parentNode.insertAdjacentElement('afterend', leg);
  }

  window._chartCazaIAA = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Alcarràs', 'La caza'],
      datasets: [
        {
          label: 'Sala',
          data: [403195, 341377],
          backgroundColor: '#1E4080',
          borderWidth: 0,
        },
        {
          label: 'TV pública (TV3 + La 2 TVE)',
          data: [530000, 0],
          backgroundColor: '#9B2335',
          borderWidth: 0,
        },
        {
          label: 'TV pagament (estimació)',
          data: [150000, 0],
          backgroundColor: hatch('#d4a017'),
          borderWidth: 0,
        },
        {
          label: 'Plataformes (estimació)',
          data: [227000, 0],
          backgroundColor: hatch('#6B3FA0'),
          borderWidth: 0,
        },
      ],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      layout: { padding: { right: 160 } },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: ctx => {
              const v = ctx.parsed.x;
              if (v === 0) return null;
              return `${ctx.dataset.label}: ~${(v/1000).toFixed(0)}k esp.`;
            },
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            callback: v => v >= 1000000 ? (v/1000000).toFixed(1)+'M' : (v/1000).toFixed(0)+'k',
            color: '#363737', font: { size: 11 },
          },
          grid: { color: '#eee' },
          title: { display: true, text: 'Espectadors', font: { size: 12 } },
        },
        y: {
          stacked: true,
          ticks: {
            color: '#363737',
            font: { size: 12 },
          },
          grid: { display: false },
        },
      },
    },
    plugins: [pluginTotals],
  });

};

/* ============================================================
   LLEIS — Timeline gràfic horitzontal amb scroll
   ============================================================ */
// ═══════════════════════════════════════════════════════════════
// DUES GENERACIONS, DOS MERCATS I UN PRESTIGI
// ═══════════════════════════════════════════════════════════════

let FILMS_SAURA = null;
let FILMS_ALMODOVAR = null;
let FILMS_ACTUAL = null;

const COLORS_DEC_GLOBAL = {
  '60s':   '#f4f7fa', '70s':   '#edf2f7', '80s':   '#e4ecf4',
  '90s':   '#dae6f0', '2000s': '#cfe0ec', '2010s': '#c3d9e8',
  '2020s': '#b6d2e4',
};

const COLORS_DIRECTOR = {
  'Rodrigo Sorogoyen':    { fort: '#d4b266', fluix: '#f0e2b8', paler: '#f7eed6' }, // blat/palla
  'Oliver Laxe':          { fort: '#c89c5a', fluix: '#f0d4ac', paler: '#f7e2cf' }, // ocre
  'Carla Simón':          { fort: '#c88a5e', fluix: '#f0c4ac', paler: '#f7d8cf' }, // terracota clar
  'Alauda Ruiz de Azúa':  { fort: '#c8785e', fluix: '#f0b4ac', paler: '#f7cfcf' }, // salmó
};

const TAULA_PELI_HEADER = `
  <th style="width:30%">Títol</th>
  <th class="col-subtil" style="width:12%">Director</th>
  <th style="width:70px">Festival</th>
  <th class="col-center" style="width:30px">★</th>
  <th class="col-center" style="width:60px">Top 100</th>
  <th class="col-num" style="width:100px">Espectadors</th>
  <th class="col-num" style="width:65px">Mercat</th>
  <th class="col-num" style="width:65px">Penetr.</th>
  <th class="col-num" style="width:55px">Quota</th>
  <th class="col-center" style="width:40px">IIC</th>
  <th class="col-num" style="width:95px;text-align:right">IAA estimat</th>
`;

function construirDuesGeneracions() {
  FILMS_SAURA = [
    { any:1966, titol:'La caza', festival:'Berlín', premiat:true, esp:341377, top100:null, mercat:'370M≈', penetr:'1,06%≈', quota:'0,09%≈', iic:'0,21', iaa_xifra:'341.377', iaa_mult:'', iaa_est:false },
    { any:1968, titol:'Peppermint Frappé', festival:'Berlín', premiat:true, esp:669165, top100:null, mercat:'330M≈', penetr:'1,91%≈', quota:'0,20%≈', iic:'0,42', iaa_xifra:'669.165', iaa_mult:'', iaa_est:false },
    { any:1968, titol:'Stress es tres, tres', festival:'Venècia', premiat:false, esp:151363, top100:null, mercat:'330M≈', penetr:'0,43%≈', quota:'0,05%≈', iic:'0,10', iaa_xifra:'151.363', iaa_mult:'', iaa_est:false },
    { any:1973, titol:'Ana y los lobos', festival:'Cannes', premiat:false, esp:478667, top100:null, mercat:'280M≈', penetr:'1,40%≈', quota:'0,17%≈', iic:'0,33', iaa_xifra:'478.667', iaa_mult:'', iaa_est:false },
    { any:1974, titol:'La prima Angélica', festival:'Cannes', premiat:true, esp:1410478, top100:null, mercat:'270M≈', penetr:'4,01%≈', quota:'0,52%≈', iic:'0,99', iaa_xifra:'1.410.478', iaa_mult:'', iaa_est:false },
    { any:1976, titol:'Cría cuervos', festival:'Cannes', premiat:true, esp:1293113, top100:null, mercat:'240M≈', penetr:'3,59%≈', quota:'0,54%≈', iic:'0,95', iaa_xifra:'1.293.113', iaa_mult:'', iaa_est:false },
    { any:1977, titol:'Elisa, vida mía', festival:'Cannes', premiat:true, esp:365475, top100:null, mercat:'220M≈', penetr:'1,01%≈', quota:'0,17%≈', iic:'0,28', iaa_xifra:'365.475', iaa_mult:'', iaa_est:false },
    { any:1978, titol:'Los ojos vendados', festival:'Cannes', premiat:false, esp:104249, top100:null, mercat:'205M≈', penetr:'0,28%≈', quota:'0,05%≈', iic:'0,08', iaa_xifra:'104.249', iaa_mult:'', iaa_est:false },
    { any:1979, titol:'Mamá cumple cien años', festival:'Sant Sebastià', premiat:true, esp:1120399, top100:null, mercat:'200M≈', penetr:'3,04%≈', quota:'0,56%≈', iic:'0,89', iaa_xifra:'1.120.399', iaa_mult:'', iaa_est:false },
    { any:1981, titol:'Deprisa, deprisa', festival:'Berlín', premiat:true, esp:1049600, top100:{pos:25,dec:'80s'}, mercat:'165M≈', penetr:'2,78%≈', quota:'0,64%≈', iic:'0,91', iaa_xifra:'1.049.600', iaa_mult:'', iaa_est:false },
    { any:1983, titol:'Carmen', festival:'Cannes', premiat:true, esp:427324, top100:null, mercat:'115M≈', penetr:'1,12%≈', quota:'0,37%≈', iic:'0,44', iaa_xifra:'427.324', iaa_mult:'', iaa_est:false },
    { any:1984, titol:'Los zancos', festival:'Venècia', premiat:false, esp:56789, top100:null, mercat:'115M≈', penetr:'0,15%≈', quota:'0,05%≈', iic:'0,06', iaa_xifra:'~170.000', iaa_mult:'', iaa_est:true },
    { any:1988, titol:'El Dorado', festival:'Cannes', premiat:false, esp:571690, top100:null, mercat:'85M≈', penetr:'1,47%≈', quota:'0,67%≈', iic:'0,68', iaa_xifra:'~1,71M', iaa_mult:'', iaa_est:true },
    { any:1989, titol:'La noche oscura', festival:'Berlín', premiat:false, esp:36008, top100:null, mercat:'80M≈', penetr:'0,09%≈', quota:'0,05%≈', iic:'0,05', iaa_xifra:'~108.000', iaa_mult:'', iaa_est:true },
    { any:1990, titol:'Ay, Carmela', festival:null, premiat:false, esp:907295, top100:{pos:28,dec:'90s'}, mercat:'80M≈', penetr:'2,33%≈', quota:'1,13%≈', iic:'1,11', iaa_xifra:'~2,27M', iaa_mult:'', iaa_est:true },
    { any:1993, titol:'¡Dispara!', festival:'Venècia', premiat:false, esp:169814, top100:null, mercat:'90M≈', penetr:'0,44%≈', quota:'0,19%≈', iic:'0,20', iaa_xifra:'~425.000', iaa_mult:'', iaa_est:true },
    { any:1996, titol:'Taxi', festival:'Sant Sebastià', premiat:false, esp:139825, top100:null, mercat:'98M≈', penetr:'0,36%≈', quota:'0,14%≈', iic:'0,15', iaa_xifra:'~301.000', iaa_mult:'', iaa_est:true },
  ];

  FILMS_ALMODOVAR = [
    { any:1982, titol:'Laberinto de pasiones', festival:'Sant Sebastià', premiat:false, esp:358252, top100:null, mercat:'150M≈', penetr:'0,95%≈', quota:'0,24%≈', iic:'0,33', iaa_xifra:'358.252', iaa_mult:'', iaa_est:false },
    { any:1988, titol:'Mujeres al borde…', festival:'Venècia', premiat:true, esp:3348457, top100:{globalPos:22}, mercat:'85M≈', penetr:'8,61%≈', quota:'3,94%≈', iic:'3,98', iaa_xifra:'~10,04M', iaa_mult:'', iaa_est:true },
    { any:1989, titol:'Átame', festival:'Berlín', premiat:false, esp:1351825, top100:{pos:8,dec:'80s'}, mercat:'80M≈', penetr:'3,48%≈', quota:'1,69%≈', iic:'1,66', iaa_xifra:'~4,06M', iaa_mult:'', iaa_est:true },
    { any:1991, titol:'Tacones lejanos', festival:null, premiat:false, esp:2073064, top100:{pos:6,dec:'90s'}, mercat:'88M≈', penetr:'5,32%≈', quota:'2,36%≈', iic:'2,42', iaa_xifra:'~5,19M', iaa_mult:'', iaa_est:true },
    { any:1993, titol:'Kika', festival:null, premiat:false, esp:1038568, top100:{pos:24,dec:'90s'}, mercat:'90M≈', penetr:'2,65%≈', quota:'1,15%≈', iic:'1,19', iaa_xifra:'~2,60M', iaa_mult:'', iaa_est:true },
    { any:1995, titol:'La flor de mi secreto', festival:null, premiat:false, esp:981846, top100:{pos:25,dec:'90s'}, mercat:'96M≈', penetr:'2,50%≈', quota:'1,02%≈', iic:'1,09', iaa_xifra:'~2,12M', iaa_mult:'', iaa_est:true },
    { any:1997, titol:'Carne trémula', festival:null, premiat:false, esp:1433465, top100:{pos:12,dec:'90s'}, mercat:'100M≈', penetr:'3,64%≈', quota:'1,43%≈', iic:'1,56', iaa_xifra:'~3,08M', iaa_mult:'', iaa_est:true },
    { any:1999, titol:'Todo sobre mi madre', festival:'Cannes', premiat:true, esp:2590699, top100:{globalPos:52}, mercat:'110M', penetr:'6,48%', quota:'2,36%', iic:'2,67', iaa_xifra:'~5,57M', iaa_mult:'', iaa_est:true },
    { any:2002, titol:'Hable con ella', festival:null, premiat:false, esp:1367655, top100:{pos:26,dec:'2000s'}, mercat:'140M≈', penetr:'3,30%≈', quota:'0,97%≈', iic:'1,22', iaa_xifra:'~2,94M', iaa_mult:'', iaa_est:true },
    { any:2006, titol:'Volver', festival:'Cannes', premiat:true, esp:1932119, top100:{pos:16,dec:'2000s'}, mercat:'121M', penetr:'4,37%', quota:'1,59%', iic:'1,80', iaa_xifra:'~4,83M', iaa_mult:'', iaa_est:true },
    { any:2009, titol:'Los abrazos rotos', festival:'Cannes', premiat:false, esp:696722, top100:null, mercat:'101M≈', penetr:'1,49%≈', quota:'0,69%≈', iic:'0,69', iaa_xifra:'~1,74M', iaa_mult:'', iaa_est:true },
    { any:2011, titol:'La piel que habito', festival:'Cannes', premiat:false, esp:735403, top100:null, mercat:'98M≈', penetr:'1,58%≈', quota:'0,75%≈', iic:'0,74', iaa_xifra:'~1,84M', iaa_mult:'', iaa_est:true },
    { any:2016, titol:'Julieta', festival:'Cannes', premiat:false, esp:355378, top100:null, mercat:'96M≈', penetr:'0,76%≈', quota:'0,37%≈', iic:'0,36', iaa_xifra:'~0,89M', iaa_mult:'', iaa_est:true },
    { any:2019, titol:'Dolor y gloria', festival:'Cannes', premiat:true, esp:964859, top100:null, mercat:'105M≈', penetr:'2,07%≈', quota:'0,92%≈', iic:'0,94', iaa_xifra:'~2,40M', iaa_mult:'', iaa_est:true },
    { any:2021, titol:'Madres paralelas', festival:'Venècia', premiat:true, esp:425643, top100:null, mercat:'55M≈', penetr:'0,90%≈', quota:'0,77%≈', iic:'0,57', iaa_xifra:'~1,40M', iaa_mult:'', iaa_est:true },
    { any:2024, titol:'La habitación de al lado', festival:'Venècia', premiat:true, esp:402313, top100:null, mercat:'90M≈', penetr:'0,85%≈', quota:'0,45%≈', iic:'0,42', iaa_xifra:'~1,30M', iaa_mult:'', iaa_est:true },
  ];

  FILMS_ACTUAL = [
    { any:2013, titol:'Stockholm', director:'Rodrigo Sorogoyen', festival:null, premiat:false, esp:13945, top100:null, mercat:'90M≈', penetr:'0,03%≈', quota:'0,02%≈', iic:'0,02≈', iaa_xifra:'~35.000', iaa_mult:'', iaa_est:true },
    { any:2016, titol:'Que Dios nos perdone', director:'Rodrigo Sorogoyen', festival:'Sant Sebastià', premiat:true, esp:223302, top100:null, mercat:'96M≈', penetr:'0,48%≈', quota:'0,23%≈', iic:'0,23≈', iaa_xifra:'~558.000', iaa_mult:'', iaa_est:true },
    { any:2018, titol:'El reino', director:'Rodrigo Sorogoyen', festival:'Sant Sebastià', premiat:false, esp:365264, top100:null, mercat:'98M≈', penetr:'0,78%≈', quota:'0,37%≈', iic:'0,37≈', iaa_xifra:'~0,91M', iaa_mult:'', iaa_est:true },
    { any:2019, titol:'Madre', director:'Rodrigo Sorogoyen', festival:null, premiat:false, esp:29585, top100:null, mercat:'105M≈', penetr:'0,06%≈', quota:'0,03%≈', iic:'0,03≈', iaa_xifra:'~75.000', iaa_mult:'', iaa_est:true },
    { any:2022, titol:'As bestas', director:'Rodrigo Sorogoyen', festival:null, premiat:false, esp:1112098, top100:{pos:11,dec:'2020s'}, mercat:'71M', penetr:'2,35%', quota:'1,57%', iic:'1,31', iaa_xifra:'~3,62M', iaa_mult:'', iaa_est:true },
    { any:2010, titol:'Todos vós sodes capitáns', director:'Oliver Laxe', festival:'Cannes', premiat:false, esp:905, top100:null, mercat:'101M≈', penetr:'0,00%≈', quota:'0,00%≈', iic:'0,00', iaa_xifra:'~2.250', iaa_mult:'', iaa_est:true },
    { any:2016, titol:'Mimosas', director:'Oliver Laxe', festival:'Cannes', premiat:false, esp:12097, top100:null, mercat:'96M≈', penetr:'0,03%≈', quota:'0,01%≈', iic:'0,01≈', iaa_xifra:'~30.000', iaa_mult:'', iaa_est:true },
    { any:2019, titol:'O que arde', director:'Oliver Laxe', festival:'Cannes', premiat:false, esp:104633, top100:null, mercat:'105M≈', penetr:'0,22%≈', quota:'0,10%≈', iic:'0,10≈', iaa_xifra:'~262.000', iaa_mult:'', iaa_est:true },
    { any:2025, titol:'Sirât', director:'Oliver Laxe', festival:'Cannes', premiat:true, esp:458542, top100:null, mercat:'65M≈', penetr:'0,97%≈', quota:'0,71%≈', iic:'0,57≈', iaa_xifra:'~1,50M', iaa_mult:'', iaa_est:true },
    { any:2017, titol:'Estiu 1993', director:'Carla Simón', festival:'Berlín', premiat:false, esp:198214, top100:null, mercat:'100M≈', penetr:'0,43%≈', quota:'0,20%≈', iic:'0,20≈', iaa_xifra:'~495.000', iaa_mult:'', iaa_est:true },
    { any:2022, titol:'Alcarràs', director:'Carla Simón', festival:'Berlín', premiat:true, esp:403195, top100:null, mercat:'71M', penetr:'0,86%', quota:'0,57%', iic:'0,48', iaa_xifra:'~1,31M', iaa_mult:'', iaa_est:true },
    { any:2025, titol:'Romería', director:'Carla Simón', festival:'Cannes', premiat:false, esp:281749, top100:null, mercat:'65M≈', penetr:'0,57%≈', quota:'0,33%≈', iic:'0,30≈', iaa_xifra:'~0,92M', iaa_mult:'', iaa_est:true },
    { any:2022, titol:'Cinco lobitos', director:'Alauda Ruiz de Azúa', festival:null, premiat:false, esp:154708, top100:null, mercat:'71M≈', penetr:'0,33%≈', quota:'0,22%≈', iic:'0,18≈', iaa_xifra:'~504.000', iaa_mult:'', iaa_est:true },
    { any:2025, titol:'Los domingos', director:'Alauda Ruiz de Azúa', festival:'Sant Sebastià', premiat:true, esp:688335, top100:{pos:21,dec:'2020s'}, mercat:'65M', penetr:'1,45%', quota:'1,06%', iic:'0,85', iaa_xifra:'~2,24M', iaa_mult:'', iaa_est:true },
  ];

  renderTaulaGen(FILMS_SAURA, 'taula-saura', 'Carlos Saura');
  renderTaulaGen(FILMS_ALMODOVAR, 'taula-almodovar', 'Pedro Almodóvar');
  renderTaulaGen(FILMS_ACTUAL, 'taula-actual', null);  // director per fila
}

function renderTaulaGen(films, contId, directorFix) {
  const cont = document.getElementById(contId);
  if (!cont) return;

  const gris = s => `<span style="color:#6b6b6b">${s}</span>`;

  const files = films.map((f, i) => {
    // Color de fons: si és la taula d'actuals (sense directorFix), color del director;
    // si no, color de la dècada
    const bg = !directorFix && COLORS_DIRECTOR[f.director]
      ? COLORS_DIRECTOR[f.director].fluix
      : COLORS_DEC_GLOBAL[getDecada(f.any)] || '#ffffff';
    const premi = f.premiat ? '<span class="estrella">★</span>' : '';
    const titolCell = `<strong><em>${f.titol}</em></strong> <span class="col-subtil">(${f.any})</span>`;
    const dir = directorFix || f.director;
    const fest = f.festival ? nomFest(f.festival) : '<span class="col-subtil">—</span>';
    let topText = '—';
    if (f.top100) {
      topText = f.top100.globalPos
        ? `#${f.top100.globalPos}`
        : `${f.top100.pos}a als ${f.top100.dec}`;
    }
    const top = `<span class="col-subtil" style="font-size:.9em">${topText}</span>`;
    return `<tr style="background:${bg};border-bottom:2px solid #fff">
      <td>${titolCell}</td>
      <td class="col-subtil">${dir}</td>
      <td>${fest}</td>
      <td class="col-center">${premi}</td>
      <td class="col-center">${top}</td>
      <td class="col-num">${fmt(f.esp)}</td>
      <td class="col-num col-subtil">${gris(f.mercat)}</td>
      <td class="col-num col-subtil">${gris(f.penetr)}</td>
      <td class="col-num col-subtil">${gris(f.quota)}</td>
      <td class="col-center col-subtil">${f.iic}</td>
      <td class="col-num" style="text-align:right"><strong style="color:#555">${f.iaa_xifra}</strong></td>
    </tr>`;
  }).join('');

  cont.innerHTML = `
    <table class="taula-festivals" style="font-size:0.82em;width:100%">
      <thead><tr>${TAULA_PELI_HEADER}</tr></thead>
      <tbody>${files}</tbody>
    </table>`;
}

// GRÀFIC 1: Saura vs Almodóvar — Trajectòria espectadors a sala
window.PiP_graficSauraAlmodovar = function() {
  const el = document.getElementById('grafic-saura-almodovar');
  if (!el || typeof Chart === 'undefined' || !FILMS_SAURA) return;
  if (window._chartSauraAlmod) window._chartSauraAlmod.destroy();

  // Títol
  const bloc = document.getElementById('grafic-sa-bloc');
  if (bloc && !document.getElementById('sa-tit')) {
    const tit = document.createElement('p');
    tit.id = 'sa-tit';
    tit.style.cssText = 'font-size:.82em;font-weight:700;color:#363737;text-align:center;margin:0 0 10px';
    tit.innerHTML = 'Saura i Almodóvar — Trajectòria d\'espectadors a sala per film (1966–2024)';
    bloc.insertBefore(tit, bloc.firstChild);
  }

  const ctx = el.getContext('2d');

  const dataSaura = FILMS_SAURA.map(f => ({
    x: f.any, y: f.esp,
    titol: f.titol, premiat: f.premiat,
  }));
  const dataAlm = FILMS_ALMODOVAR.map(f => ({
    x: f.any, y: f.esp,
    titol: f.titol, premiat: f.premiat,
  }));

  // Plugin etiquetes amb el nom del film (tots en color del director)
  const pluginNoms = {
    id: 'sa-noms',
    afterDatasetsDraw(chart) {
      const c = chart.ctx;
      const yBottom = chart.scales.y.bottom;
      c.save();
      c.font = 'italic 11px "Inter", -apple-system, Arial, sans-serif';
      c.textAlign = 'center';
      c.textBaseline = 'alphabetic';
      chart.data.datasets.forEach((ds, di) => {
        const meta = chart.getDatasetMeta(di);
        c.fillStyle = ds.borderColor;
        ds.data.forEach((pt, i) => {
          const point = meta.data[i];
          if (!point) return;
          const preferDown = i % 2 !== 0;
          const dy = (preferDown && point.y + 22 > yBottom) ? -10 : (preferDown ? 18 : -10);
          c.fillText(pt.titol, point.x, point.y + dy);
        });
      });
      c.restore();
    },
  };

  // Plugin línia llindar Top 100 (2.020.217 esp.)
  const pluginLlindar = {
    id: 'sa-llindar',
    afterDraw(chart) {
      const VAL = 2020217;
      const c = chart.ctx;
      const y = chart.scales.y.getPixelForValue(VAL);
      if (y < chart.scales.y.top || y > chart.scales.y.bottom) return;
      c.save();
      c.strokeStyle = '#888';
      c.setLineDash([6, 4]);
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(chart.scales.x.left, y);
      c.lineTo(chart.scales.x.right, y);
      c.stroke();
      c.setLineDash([]);
      c.font = '11px "Inter", -apple-system, Arial, sans-serif';
      c.fillStyle = '#888';
      c.textAlign = 'right';
      c.textBaseline = 'bottom';
      c.fillText('Llindar Top 100', chart.scales.x.right - 6, y - 3);
      c.restore();
    },
  };

  window._chartSauraAlmod = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'Carlos Saura',
          data: dataSaura,
          borderColor: '#1E4080',
          backgroundColor: '#1E4080',
          borderWidth: 2.5,
          tension: 0.15,
          pointRadius: 7,
          pointStyle: 'circle',
          pointBorderWidth: 1.5,
          pointBorderColor: '#fff',
        },
        {
          label: 'Pedro Almodóvar',
          data: dataAlm,
          borderColor: '#9B2335',
          backgroundColor: '#9B2335',
          borderWidth: 2.5,
          tension: 0.15,
          pointRadius: 7,
          pointStyle: 'circle',
          pointBorderWidth: 1.5,
          pointBorderColor: '#fff',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      layout: { padding: { bottom: 28 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: items => items[0].raw.titol + ' (' + items[0].parsed.x + ')',
            label: ctx => fmt(ctx.parsed.y) + ' espectadors',
          },
        },
      },
      scales: {
        x: {
          type: 'linear',
          min: 1965, max: 2026,
          ticks: { stepSize: 5, color: '#363737', font: { size: 12 } },
          grid: { color: '#eee' },
        },
        y: {
          min: 0, max: 3700000,
          ticks: {
            callback: v => v >= 1000000 ? (v/1000000).toFixed(1)+'M' : (v/1000).toFixed(0)+'k',
            color: '#363737', font: { size: 11 },
          },
          grid: { color: '#eee' },
          title: { display: true, text: 'Espectadors a sala', font: { size: 12 } },
        },
      },
    },
    plugins: [pluginNoms, pluginLlindar],
  });

  // Llegenda HTML centrada
  if (bloc && !document.getElementById('sa-leg')) {
    const leg = document.createElement('div');
    leg.id = 'sa-leg';
    leg.style.cssText = 'text-align:center;font-size:11px;margin-top:10px;display:flex;justify-content:center;align-items:center;gap:18px;flex-wrap:wrap;color:#555;font-family:-apple-system,Arial,sans-serif';
    leg.innerHTML = `
      <span style="display:flex;align-items:center;gap:5px"><span style="width:18px;height:2px;background:#1E4080;display:inline-block"></span><span>Carlos Saura</span></span>
      <span style="display:flex;align-items:center;gap:5px"><span style="width:18px;height:2px;background:#9B2335;display:inline-block"></span><span>Pedro Almodóvar</span></span>
      <span style="display:flex;align-items:center;gap:5px"><span style="display:inline-block;width:22px;height:1px;border-top:1px dashed #888"></span><span>Llindar Top 100 (2,02M esp.)</span></span>`;
    bloc.appendChild(leg);
  }

  // Degradat scroll: desapareix en arribar al final
  const hint = document.getElementById('sa-scroll-hint');
  const wrap = document.getElementById('sa-scroll-wrap');
  if (hint && wrap) {
    wrap.addEventListener('scroll', () => {
      const atEnd = wrap.scrollLeft + wrap.clientWidth >= wrap.scrollWidth - 12;
      hint.style.opacity = atEnd ? '0' : '1';
    });
  }
};

// GRÀFIC 2: Generació actual — Barres horitzontals
window.PiP_graficGeneracioActual = function() {
  const el = document.getElementById('grafic-generacio-actual');
  if (!el || typeof Chart === 'undefined' || !FILMS_ACTUAL) return;
  if (window._chartGenActual) window._chartGenActual.destroy();

  // Títol
  const bloc = document.getElementById('grafic-ga-bloc');
  if (bloc && !document.getElementById('ga-tit')) {
    const tit = document.createElement('p');
    tit.id = 'ga-tit';
    tit.style.cssText = 'font-size:.82em;font-weight:700;color:#363737;text-align:center;margin:0 0 10px';
    tit.innerHTML = 'Generació actual — Espectadors a sala (barra sòlida) vs. IAA estimat (barra clara)';
    bloc.insertBefore(tit, bloc.firstChild);
  }

  const COLORS_DIR = {
    'Rodrigo Sorogoyen':    { fort: COLORS_DIRECTOR['Rodrigo Sorogoyen'].fort,    fluix: COLORS_DIRECTOR['Rodrigo Sorogoyen'].fluix },
    'Oliver Laxe':          { fort: COLORS_DIRECTOR['Oliver Laxe'].fort,          fluix: COLORS_DIRECTOR['Oliver Laxe'].fluix },
    'Carla Simón':          { fort: COLORS_DIRECTOR['Carla Simón'].fort,          fluix: COLORS_DIRECTOR['Carla Simón'].fluix },
    'Alauda Ruiz de Azúa':  { fort: COLORS_DIRECTOR['Alauda Ruiz de Azúa'].fort,  fluix: COLORS_DIRECTOR['Alauda Ruiz de Azúa'].fluix },
  };

  // Parsejar rang IAA → mig
  function rangMig(xifra) {
    // xifra: '~1,01M–1,61M' o '~28.000–42.000'
    const cleaned = xifra.replace(/[~\s]/g, '');
    const parts = cleaned.split('–');
    function aNum(s) {
      if (s.includes('M')) return parseFloat(s.replace(',', '.').replace('M','')) * 1000000;
      return parseInt(s.replace(/\./g, ''), 10);
    }
    if (parts.length === 2) {
      return (aNum(parts[0]) + aNum(parts[1])) / 2;
    }
    return aNum(parts[0]);
  }

  function rangText(f) {
    return f.iaa_xifra + ' ' + f.iaa_mult;
  }

  // Ordenat per director (Sorogoyen, Laxe, Simón, Ruiz de Azúa) i any
  const orden = [...FILMS_ACTUAL];

  const labels = orden.map(f => `${f.titol} — ${f.director.split(' ').slice(-1)[0]} (${f.any})`);
  const sala = orden.map(f => f.esp);
  const iaaAdd = orden.map(f => Math.max(0, rangMig(f.iaa_xifra) - f.esp));
  const colorsFort = orden.map(f => COLORS_DIR[f.director].fort);
  const colorsFluix = orden.map(f => COLORS_DIR[f.director].fluix);
  const colorsPaler = orden.map(f => COLORS_DIRECTOR[f.director].paler);

  // Plugin: línia separadora subtil entre canvis de director
  const sepDirectors = {
    id: 'sep-directors',
    afterDraw(chart) {
      const c = chart.ctx;
      const meta = chart.getDatasetMeta(0);
      c.save();
      c.strokeStyle = 'rgba(0,0,0,0.18)';
      c.setLineDash([3, 3]);
      c.lineWidth = 1;
      for (let i = 0; i < orden.length - 1; i++) {
        if (orden[i].director !== orden[i+1].director) {
          const bar1 = meta.data[i];
          const bar2 = meta.data[i+1];
          if (bar1 && bar2) {
            const y = (bar1.y + bar2.y) / 2;
            c.beginPath();
            c.moveTo(chart.scales.x.left, y);
            c.lineTo(chart.scales.x.right, y);
            c.stroke();
          }
        }
      }
      c.restore();
    },
  };

  // Plugin: línia vertical llindar Top 100 (2.020.217 esp.)
  const pluginLlindar = {
    id: 'ga-llindar',
    afterDraw(chart) {
      const VAL = 2020217;
      const c = chart.ctx;
      const x = chart.scales.x.getPixelForValue(VAL);
      if (x < chart.scales.x.left || x > chart.scales.x.right) return;
      c.save();
      c.strokeStyle = '#888';
      c.setLineDash([6, 4]);
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(x, chart.scales.y.top);
      c.lineTo(x, chart.scales.y.bottom);
      c.stroke();
      c.setLineDash([]);
      c.font = '11px "Inter", -apple-system, Arial, sans-serif';
      c.fillStyle = '#888';
      c.textAlign = 'left';
      c.textBaseline = 'top';
      c.fillText('Llindar Top 100', x + 4, chart.scales.y.top + 4);
      c.restore();
    },
  };

  const ctx = el.getContext('2d');
  window._chartGenActual = new Chart(ctx, {
    type: 'bar',
    plugins: [sepDirectors, pluginLlindar],
    data: {
      labels,
      datasets: [
        { label: 'Espectadors a sala', data: sala, backgroundColor: colorsFort, hoverBackgroundColor: colorsPaler, borderWidth: 0 },
        { label: 'IAA estimat (valor mig)', data: iaaAdd, backgroundColor: colorsFluix, hoverBackgroundColor: colorsPaler, borderWidth: 0 },
      ],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      layout: { padding: { right: 40 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: items => orden[items[0].dataIndex].titol + ' (' + orden[items[0].dataIndex].any + ')',
            label: ctx => {
              const f = orden[ctx.dataIndex];
              if (ctx.datasetIndex === 0) return 'Sala: ' + fmt(f.esp) + ' esp.';
              return 'IAA estimat: ' + rangText(f);
            },
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            callback: v => v >= 1000000 ? (v/1000000).toFixed(1)+'M' : (v/1000).toFixed(0)+'k',
            color: '#363737', font: { size: 12 },
          },
          grid: { color: '#eee' },
          title: { display: true, text: 'Espectadors (sala + IAA estimat)', font: { size: 13 } },
        },
        y: {
          stacked: true,
          ticks: { color: '#363737', font: { size: 12 } },
          grid: { display: false },
        },
      },
    },
  });

  // Llegenda HTML per director
  if (bloc && !document.getElementById('ga-leg')) {
    const leg = document.createElement('div');
    leg.id = 'ga-leg';
    leg.style.cssText = 'text-align:center;font-size:11px;margin-top:10px;display:flex;justify-content:center;align-items:center;gap:14px;flex-wrap:wrap;color:#555;font-family:-apple-system,Arial,sans-serif';
    leg.innerHTML = `
      <span style="display:flex;align-items:center;gap:4px"><span style="width:12px;height:12px;background:#f0e2b8;display:inline-block;border-radius:2px;border:1px solid rgba(0,0,0,.1)"></span>Rodrigo Sorogoyen</span>
      <span style="display:flex;align-items:center;gap:4px"><span style="width:12px;height:12px;background:#f0d4ac;display:inline-block;border-radius:2px;border:1px solid rgba(0,0,0,.1)"></span>Oliver Laxe</span>
      <span style="display:flex;align-items:center;gap:4px"><span style="width:12px;height:12px;background:#f0c4ac;display:inline-block;border-radius:2px;border:1px solid rgba(0,0,0,.1)"></span>Carla Simón</span>
      <span style="display:flex;align-items:center;gap:4px"><span style="width:12px;height:12px;background:#f0b4ac;display:inline-block;border-radius:2px;border:1px solid rgba(0,0,0,.1)"></span>Alauda Ruiz de Azúa</span>
      <span style="display:flex;align-items:center;gap:5px;margin-left:8px"><span style="display:inline-block;width:22px;height:1px;border-top:1px dashed #888"></span><span>Llindar Top 100 (2,02M esp.)</span></span>`;
    bloc.appendChild(leg);
  }
};

// ═══════════════════════════════════════════════════════════════
// CINEMA D'AUTOR INDUSTRIAL — Gràfic 3 directors
// ═══════════════════════════════════════════════════════════════

window.PiP_graficAutorIndustrial = function() {
  const el = document.getElementById('grafic-autor-industrial');
  if (!el || typeof Chart === 'undefined') return;
  if (window._chartAutorInd) window._chartAutorInd.destroy();

  const FILMS_IGLESIA = [
    { x:1995, y:1419191, titol:'El día de la bestia',          festival:false, premiat:false, top100:false },
    { x:1999, y:1669964, titol:'Muertos de risa',              festival:false, premiat:false, top100:false },
    { x:2000, y:1609084, titol:'La comunidad',                 festival:false, premiat:false, top100:false },
    { x:2008, y:1423300, titol:'Los crímenes de Oxford',       festival:false, premiat:false, top100:false },
    { x:2010, y: 369118, titol:'Balada triste de trompeta',    festival:true,  premiat:true,  top100:false },
    { x:2017, y:3284907, titol:'Perfectos desconocidos',       festival:false, premiat:false, top100:true  },
    { x:2022, y: 673654, titol:'El cuarto pasajero',           festival:false, premiat:false, top100:false },
  ];
  const FILMS_AMENABAR = [
    { x:1996, y: 855481, titol:'Tesis',                        festival:false, premiat:false, top100:false },
    { x:1997, y:1794539, titol:'Abre los ojos',                festival:false, premiat:false, top100:false },
    { x:2001, y:6410785, titol:'Los otros',                    festival:false, premiat:false, top100:true  },
    { x:2004, y:4099475, titol:'Mar adentro',                  festival:true,  premiat:true,  top100:true  },
    { x:2009, y:3492894, titol:'Ágora',                        festival:false, premiat:false, top100:true  },
    { x:2019, y:1888896, titol:'Mientras dure la guerra',      festival:false, premiat:false, top100:false },
    { x:2025, y: 797366, titol:'El cautivo',                   festival:false, premiat:false, top100:false },
  ];
  const FILMS_BAYONA = [
    { x:2007, y:4420987, titol:'El orfanato',                  festival:false, premiat:false, top100:true  },
    { x:2012, y:6129976, titol:'Lo imposible',                 festival:false, premiat:false, top100:true  },
    { x:2016, y:4613760, titol:'Un monstruo viene a verme',    festival:false, premiat:false, top100:true  },
  ];

  // Títol al bloc
  const bloc = document.getElementById('grafic-ai-bloc');
  if (bloc && !document.getElementById('ai-tit')) {
    const tit = document.createElement('p');
    tit.id = 'ai-tit';
    tit.style.cssText = 'font-size:.82em;font-weight:700;color:#363737;text-align:center;margin:0 0 10px';
    tit.innerHTML = 'De la Iglesia, Amenábar i Bayona — Trajectòria d\'espectadors a sala per film (1995–2025)';
    bloc.insertBefore(tit, bloc.firstChild);
  }

  const ctx = el.getContext('2d');

  const COL_IGLESIA  = '#b8463a';  // vermell càlid
  const COL_AMENABAR = '#1e3d6b';  // blau marí
  const COL_BAYONA   = '#1e6b5c';  // verd

  // Plugin etiquetes amb el nom del film (tots en color del director)
  const pluginNoms = {
    id: 'ai-noms',
    afterDatasetsDraw(chart) {
      const c = chart.ctx;
      c.save();
      c.font = 'italic 11px "Inter", -apple-system, Arial, sans-serif';
      c.textAlign = 'center';
      c.textBaseline = 'alphabetic';
      chart.data.datasets.forEach((ds, di) => {
        const meta = chart.getDatasetMeta(di);
        c.fillStyle = ds.borderColor;
        ds.data.forEach((pt, i) => {
          const point = meta.data[i];
          if (!point) return;
          const dy = i % 2 === 0 ? -14 : 20;
          c.fillText(pt.titol, point.x, point.y + dy);
        });
      });
      c.restore();
    },
  };

  // Plugin línia llindar Top 100 (2.020.217 esp.)
  const pluginLlindar = {
    id: 'ai-llindar',
    afterDraw(chart) {
      const VAL = 2020217;
      const c = chart.ctx;
      const y = chart.scales.y.getPixelForValue(VAL);
      if (y < chart.scales.y.top || y > chart.scales.y.bottom) return;
      c.save();
      c.strokeStyle = '#888';
      c.setLineDash([6, 4]);
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(chart.scales.x.left, y);
      c.lineTo(chart.scales.x.right, y);
      c.stroke();
      c.setLineDash([]);
      c.font = '11px "Inter", -apple-system, Arial, sans-serif';
      c.fillStyle = '#888';
      c.textAlign = 'right';
      c.textBaseline = 'bottom';
      c.fillText('Llindar Top 100', chart.scales.x.right - 6, y - 3);
      c.restore();
    },
  };

  window._chartAutorInd = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'Álex de la Iglesia',
          data: FILMS_IGLESIA,
          borderColor: COL_IGLESIA,
          backgroundColor: COL_IGLESIA,
          borderWidth: 2.5,
          tension: 0.15,
          pointRadius: 7,
          pointStyle: 'circle',
          pointBackgroundColor: COL_IGLESIA,
          pointBorderWidth: 1.5,
          pointBorderColor: '#fff',
        },
        {
          label: 'Alejandro Amenábar',
          data: FILMS_AMENABAR,
          borderColor: COL_AMENABAR,
          backgroundColor: COL_AMENABAR,
          borderWidth: 2.5,
          tension: 0.15,
          pointRadius: 7,
          pointStyle: 'circle',
          pointBackgroundColor: COL_AMENABAR,
          pointBorderWidth: 1.5,
          pointBorderColor: '#fff',
        },
        {
          label: 'J.A. Bayona',
          data: FILMS_BAYONA,
          borderColor: COL_BAYONA,
          backgroundColor: COL_BAYONA,
          borderWidth: 2.5,
          tension: 0.15,
          pointRadius: 7,
          pointStyle: 'circle',
          pointBackgroundColor: COL_BAYONA,
          pointBorderWidth: 1.5,
          pointBorderColor: '#fff',
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      layout: { padding: { bottom: 28 } },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: items => items[0].raw.titol + ' (' + items[0].parsed.x + ')',
            label: ctx => fmt(ctx.parsed.y) + ' espectadors',
          },
        },
      },
      scales: {
        x: {
          type: 'linear',
          min: 1994, max: 2027,
          ticks: { stepSize: 5, color: '#363737', font: { size: 12 } },
          grid: { color: '#eee' },
        },
        y: {
          min: 0, max: 7000000,
          ticks: {
            callback: v => v >= 1000000 ? (v/1000000).toFixed(1)+'M' : (v/1000).toFixed(0)+'k',
            color: '#363737', font: { size: 11 },
          },
          grid: { color: '#eee' },
          title: { display: true, text: 'Espectadors a sala', font: { size: 12 } },
        },
      },
    },
    plugins: [pluginNoms, pluginLlindar],
  });

  // Llegenda HTML
  if (bloc && !document.getElementById('ai-leg')) {
    const leg = document.createElement('div');
    leg.id = 'ai-leg';
    leg.style.cssText = 'text-align:center;font-size:11px;margin-top:10px;display:flex;justify-content:center;align-items:center;gap:18px;flex-wrap:wrap;color:#555;font-family:-apple-system,Arial,sans-serif';
    leg.innerHTML = `
      <span style="display:flex;align-items:center;gap:5px"><span style="width:18px;height:2px;background:${COL_IGLESIA};display:inline-block"></span><span>Álex de la Iglesia</span></span>
      <span style="display:flex;align-items:center;gap:5px"><span style="width:18px;height:2px;background:${COL_AMENABAR};display:inline-block"></span><span>Alejandro Amenábar</span></span>
      <span style="display:flex;align-items:center;gap:5px"><span style="width:18px;height:2px;background:${COL_BAYONA};display:inline-block"></span><span>J.A. Bayona</span></span>
      <span style="display:flex;align-items:center;gap:5px"><span style="display:inline-block;width:22px;height:1px;border-top:1px dashed #888"></span><span>Llindar Top 100 (2,02M esp.)</span></span>`;
    bloc.appendChild(leg);
  }

  // Degradat scroll
  const hint = document.getElementById('ai-scroll-hint');
  const wrap = document.getElementById('ai-scroll-wrap');
  if (hint && wrap) {
    wrap.addEventListener('scroll', () => {
      const atEnd = wrap.scrollLeft + wrap.clientWidth >= wrap.scrollWidth - 12;
      hint.style.opacity = atEnd ? '0' : '1';
    });
  }
};

function construirLleis() {
  const cont = document.getElementById('grafic-lleis');
  if (!cont) return;

  // Línies separadores al contenidor extern (fora del scroll)
  cont.style.borderTop = '1px solid #e0e0e0';
  cont.style.borderBottom = '1px solid #e0e0e0';
  cont.style.padding = '20px 0';
  cont.style.margin = '20px 0';

  if (!document.getElementById('ll-styles')) {
    const s = document.createElement('style');
    s.id = 'll-styles';
    s.textContent = `.ll-outer{position:relative;margin:0}.ll-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:8px}.ll-hint{position:absolute;top:0;right:0;width:28px;height:calc(100% - 8px);background:linear-gradient(to right,transparent,rgba(255,255,255,.55));pointer-events:none;transition:opacity .4s;z-index:20}.ll-g{position:relative;min-width:1600px;font-size:15px;font-family:-apple-system,"SF Pro Text",BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif}.ll-g6{display:grid;grid-template-columns:31.67% 8.33% 6.67% 18.33% 23.33% 11.67%}.ll-lm{position:absolute;top:0;bottom:0;width:0;border-left:1px dashed rgba(255,255,255,.42);z-index:4;pointer-events:none}.ll-lm.cl{border-left-color:rgba(0,0,0,.16)}.ll-gov{display:flex;height:26px;overflow:hidden}.ll-gb{display:flex;align-items:center;padding:0 8px;font-size:.68em;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#fff;border-right:1px solid rgba(255,255,255,.3);white-space:nowrap;overflow:hidden}.ll-per .c{padding:11px 12px 9px;font-size:.85em;font-weight:700;color:#fff;border-right:1px solid rgba(255,255,255,.18)}.ll-mom{position:relative;height:96px;background:#f5f5f5;border-top:1px solid #e0e0e0;border-bottom:1px solid #e0e0e0;overflow:visible}.ll-mp{position:absolute;z-index:10;width:0}.ll-ml{position:absolute;left:0;top:0;bottom:0;width:0;border-left:1px dashed #b0b0b0}.ll-mc{position:absolute;left:0;top:10px;transform:translateX(-50%);width:24px;height:24px;border-radius:50%;background:#363737;color:#fff;font-size:.68em;font-weight:700;display:flex;align-items:center;justify-content:center;border:2px solid #f5f5f5;box-shadow:0 1px 3px rgba(0,0,0,.22);z-index:2}.ll-ma{position:absolute;left:0;top:40px;transform:translateX(-50%);font-size:.65em;color:#888;white-space:nowrap;font-style:italic;text-align:center}.ll-mn{position:absolute;left:0;top:56px;transform:translateX(-50%);font-size:.72em;color:#333;white-space:nowrap;font-weight:700;text-align:center}.ll-fin .c{padding:12px 11px;font-size:.82em;color:#fff;font-style:italic;border-right:1px solid rgba(255,255,255,.18);line-height:1.4;min-height:80px}.ll-fin .c .nf{display:block;font-style:normal;font-weight:700;font-size:.9em;opacity:.82;margin-bottom:4px}.ll-iaa .c{display:flex;align-items:center;justify-content:center;height:26px;padding:0 10px;font-size:.68em;font-weight:400;color:#fff;border-right:1px solid rgba(255,255,255,.2)}.ll-eix{position:relative;height:32px;border-top:1px solid #ccc;margin-top:8px;padding-bottom:10px}.ll-ea{position:absolute;font-size:.72em;color:#999;transform:translateX(-50%);padding-top:3px;white-space:nowrap}.ll-ef{font-size:.75em;color:#888;text-transform:uppercase;letter-spacing:.05em;padding:5px 0 2px}.ll-tit{font-size:.82em;color:#363737;font-weight:700;margin-bottom:10px}.ll-leg{font-size:.78em;color:#888;font-style:italic;margin-top:10px;line-height:1.5}.c1{background:#2C3E50}.c2{background:#1A5276}.c3{background:#1E8449}.c4{background:#7D3C98}.c5{background:#B7770D}.c6{background:#922B21}.gf{background:#4E342E}.gt{background:#546E7A}.gps{background:#B71C1C}.gpp{background:#0D47A1}`;
    document.head.appendChild(s);
  }

  cont.innerHTML = `
<p class="ll-tit">Context de distribució, legislació i factor IAA (1965–2025)</p>
<div class="ll-outer">
<div class="ll-hint" id="ll-scroll-hint"></div>
<div class="ll-wrap" id="ll-scroll-wrap"><div class="ll-g">

<div class="ll-lm" style="left:30%"></div><div class="ll-lm" style="left:41.7%"></div>
<div class="ll-lm" style="left:70%"></div><div class="ll-lm" style="left:78.3%"></div>
<div class="ll-lm" style="left:83.3%"></div><div class="ll-lm" style="left:90%"></div>
<div class="ll-lm" style="left:95%"></div>
<div class="ll-lm cl" style="left:30%;z-index:5"></div><div class="ll-lm cl" style="left:41.7%;z-index:5"></div>
<div class="ll-lm cl" style="left:70%;z-index:5"></div><div class="ll-lm cl" style="left:78.3%;z-index:5"></div>
<div class="ll-lm cl" style="left:83.3%;z-index:5"></div><div class="ll-lm cl" style="left:90%;z-index:5"></div>
<div class="ll-lm cl" style="left:95%;z-index:5"></div>

<div class="ll-gov">
  <div class="ll-gb gf" style="width:16.7%">Franquisme</div>
  <div class="ll-gb gt" style="width:11.6%">Transició</div>
  <div class="ll-gb gps" style="width:23.3%">PSOE</div>
  <div class="ll-gb gpp" style="width:13.3%">PP</div>
  <div class="ll-gb gps" style="width:11.7%">PSOE</div>
  <div class="ll-gb gpp" style="width:11.7%">PP</div>
  <div class="ll-gb gps" style="flex:1">PSOE</div>
</div>

<div class="ll-ef">Períodes</div>
<div class="ll-g6 ll-per">
  <div class="c c1">1965–1984</div><div class="c c2">1984–1989</div>
  <div class="c c3">1990–1994</div><div class="c c4">1994–2005</div>
  <div class="c c5">2005–2019</div><div class="c c6">2020–2025</div>
</div>

<div class="ll-ef">Moments clau</div>
<div class="ll-mom">
  <div class="ll-mp" style="left:30%"><div class="ll-ml"></div><div class="ll-mc">1</div><div class="ll-ma">1983</div><div class="ll-mn">Decret Miró</div></div>
  <div class="ll-mp" style="left:41.7%"><div class="ll-ml"></div><div class="ll-mc">2</div><div class="ll-ma">1990</div><div class="ll-mn">TV privades</div></div>
  <div class="ll-mp" style="left:70%"><div class="ll-ml"></div><div class="ll-mc">3</div><div class="ll-ma">2007</div><div class="ll-mn">Llei Cinema</div></div>
  <div class="ll-mp" style="left:78.3%"><div class="ll-ml"></div><div class="ll-mc">4</div><div class="ll-ma">2012</div><div class="ll-mn">IVA 21%</div></div>
  <div class="ll-mp" style="left:83.3%"><div class="ll-ml"></div><div class="ll-mc">5</div><div class="ll-ma">2015</div><div class="ll-mn">Netflix</div></div>
  <div class="ll-mp" style="left:90%"><div class="ll-ml"></div><div class="ll-mc">6</div><div class="ll-ma">2018</div><div class="ll-mn">Paritat</div></div>
  <div class="ll-mp" style="left:95%"><div class="ll-ml"></div><div class="ll-mc">7</div><div class="ll-ma">2022</div><div class="ll-mn">Llei Audiovisual</div></div>
</div>

<div class="ll-ef">Finestres disponibles</div>
<div class="ll-g6 ll-fin">
  <div class="c c1"><span class="nf">1 finestra</span>Sala de cinema</div>
  <div class="c c2"><span class="nf">3 finestres</span>Sala + TVE + VHS</div>
  <div class="c c3"><span class="nf">4 finestres</span>Sala + TVE + VHS + TV autonòmiques</div>
  <div class="c c4"><span class="nf">5 finestres</span>Sala + TVE + TV privades/pagament + TV autonòmiques + DVD</div>
  <div class="c c5"><span class="nf">6 finestres</span>Sala + TVE + TV privades/pagament + TV autonòmiques + DVD + plataformes</div>
  <div class="c c6"><span class="nf">6+ finestres</span>Sala + TVE + TV priv./pag. + TV auton. + plataformes en expansió</div>
</div>

<div class="ll-ef">Factor IAA</div>
<div class="ll-g6 ll-iaa">
  <div class="c" style="background:rgba(44,62,80,.62)">×1,0</div>
  <div class="c" style="background:rgba(26,82,118,.62)">×2,5–3,5</div>
  <div class="c" style="background:rgba(30,132,73,.62)">×2,0–3,0</div>
  <div class="c" style="background:rgba(125,60,152,.62)">×1,8–2,5</div>
  <div class="c" style="background:rgba(183,119,13,.62)">×2,0–3,0</div>
  <div class="c" style="background:rgba(146,43,33,.62)">×2,5–4,0</div>
</div>

<div class="ll-eix">
  <div class="ll-ea" style="left:0%">1965</div>
  <div class="ll-ea" style="left:16.7%">1975</div>
  <div class="ll-ea" style="left:28.3%">1982</div>
  <div class="ll-ea" style="left:51.7%">1996</div>
  <div class="ll-ea" style="left:65%">2004</div>
  <div class="ll-ea" style="left:76.7%">2011</div>
  <div class="ll-ea" style="left:88.3%">2018</div>
  <div class="ll-ea" style="left:100%">2025</div>
</div>

</div></div>
</div>
<p class="ll-leg">Franja superior: context polític. Franges centrals: períodes, moments clau i finestres disponibles. Franja inferior: factor multiplicador IAA.</p>`;

  // Degradat scroll: desapareix quan s'arriba al final
  const hint = document.getElementById('ll-scroll-hint');
  const wrap = document.getElementById('ll-scroll-wrap');
  if (hint && wrap) {
    wrap.addEventListener('scroll', () => {
      const atEnd = wrap.scrollLeft + wrap.clientWidth >= wrap.scrollWidth - 12;
      hint.style.opacity = atEnd ? '0' : '1';
    });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  carregarDades();
  construirGraficDobleCorona();
});

function construirGraficDobleCorona() {
  const wrap = document.getElementById('grafic-doble-corona-wrap');
  if (!wrap) return;

  wrap.style.cssText = 'margin-top:28px;border-top:1px solid #e5e5e5;border-bottom:1px solid #e5e5e5;padding:28px 0 20px;position:relative;';

  const COL_PUB = '#2a5582';
  const COL_PREST = '#9B2335';
  const COL_OR = '#c8a000';

  const dobles = [
    { any:1968, titol:'No somos de piedra',  top100:'#46', festival:'Sant Sebastià', premi:null,           premiat:false },
    { any:1974, titol:'Tormento',            top100:'#57', festival:'Sant Sebastià', premi:null,           premiat:false },
    { any:1975, titol:'Furtivos',            top100:'#16', festival:'Sant Sebastià', premi:'Conxa d\'Or',  premiat:true  },
    { any:1977, titol:'La guerra de papá',   top100:'#18', festival:'Sant Sebastià', premi:null,           premiat:false },
    { any:1984, titol:'Los santos inocentes',top100:'#62', festival:'Cannes',        premi:'Millor actor', premiat:true  },
    { any:1988, titol:'Mujeres al borde de un ataque de nervios', top100:'#22', festival:'Venècia', premi:'Millor guió', premiat:true },
    { any:1999, titol:'Todo sobre mi madre', top100:'#52', festival:'Cannes',        premi:'Millor direcció', premiat:true },
    { any:2001, titol:'Juana la Loca',       top100:'#68', festival:'Sant Sebastià', premi:'Millor actriu',premiat:true  },
    { any:2002, titol:'Los lunes al sol',    top100:'#70', festival:'Sant Sebastià', premi:'Conxa d\'Or',  premiat:true  },
    { any:2004, titol:'Mar adentro',         top100:'#12', festival:'Venècia',       premi:'Lleó de Plata',premiat:true  },
  ];
  const doblesAnys = new Set(dobles.map(d => d.any));

  // Dades completes: un valor per film, anys reals del Top 100
  const pubFilms = [
    {any:1965,titol:'La ciudad no es para mí'},{any:1966,titol:'El golfo'},{any:1966,titol:'Sopa de ganso'},
    {any:1966,titol:'El arte de vivir'},{any:1966,titol:'La pandilla'},{any:1967,titol:'Crónica de 9 meses'},
    {any:1967,titol:'Abuelo made in Spain'},{any:1967,titol:'La familia y uno más'},{any:1968,titol:'No somos de piedra'},
    {any:1968,titol:'Cantando a la vida'},{any:1968,titol:'La vida sigue igual'},{any:1969,titol:'Hay que matar a B'},
    {any:1969,titol:'El astronauta'},{any:1970,titol:'Vente a Alemania Pepe'},{any:1971,titol:'No firmes más letras Ramón'},
    {any:1972,titol:'Mi querida señorita'},{any:1974,titol:'Tormento'},{any:1975,titol:'Furtivos'},
    {any:1975,titol:'El casto Susanito'},{any:1976,titol:'El puente'},{any:1977,titol:'La guerra de papá'},
    {any:1977,titol:'El anillo de nibelungo'},{any:1978,titol:'El soltero'},{any:1981,titol:'La colmena'},
    {any:1984,titol:'Los santos inocentes'},{any:1988,titol:'Mujeres al borde de un ataque de nervios'},
    {any:1991,titol:'Tacones lejanos'},{any:1995,titol:'Boca a boca'},{any:1997,titol:'La buena estrella'},
    {any:1998,titol:'El abuelo'},{any:1999,titol:'Todo sobre mi madre'},{any:2001,titol:'Juana la Loca'},
    {any:2001,titol:'El hijo de la novia'},{any:2002,titol:'Los lunes al sol'},{any:2003,titol:'Soldados de Salamina'},
    {any:2004,titol:'Mar adentro'},{any:2005,titol:'Habana Blues'},{any:2006,titol:'El laberinto del fauno'},
    {any:2007,titol:'El orfanato'},{any:2009,titol:'Celda 211'},{any:2009,titol:'Agora'},
    {any:2011,titol:'No habrá paz para los malvados'},{any:2012,titol:'Blancanieves'},{any:2014,titol:'La isla mínima'},
    {any:2015,titol:'Truman'},{any:2016,titol:'Un monstruo viene a verme'},{any:2017,titol:'Verano 1993'},
    {any:2017,titol:'El bar'},{any:2018,titol:'Campeones'},{any:2019,titol:'Dolor y gloria'},
    {any:2022,titol:'El buen patrón'},{any:2024,titol:'Padre no hay más que uno 4'},{any:2025,titol:'Padre no hay más que uno 5'},
  ];

  const prestFilms = [
    {any:1965,titol:'La caza'},{any:1966,titol:'Nueve cartas a Berta'},{any:1968,titol:'Stress es tres tres'},
    {any:1970,titol:'El momento de la verdad'},{any:1973,titol:'El espíritu de la colmena'},
    {any:1974,titol:'Tormento'},{any:1976,titol:'Pascual Duarte'},{any:1977,titol:'El desencanto'},
    {any:1978,titol:'Cría cuervos'},{any:1981,titol:'Deprisa deprisa'},{any:1983,titol:'El sur'},
    {any:1984,titol:'Los santos inocentes'},{any:1985,titol:'El año de las luces'},{any:1986,titol:'El viaje a ninguna parte'},
    {any:1988,titol:'Mujeres al borde de un ataque de nervios'},{any:1989,titol:'Ay Carmela'},
    {any:1991,titol:'Las edades de Lulú'},{any:1992,titol:'Belle époque'},{any:1994,titol:'Hola, ¿estás sola?'},
    {any:1996,titol:'Martín (Hache)'},{any:1997,titol:'La buena estrella'},{any:1999,titol:'Todo sobre mi madre'},
    {any:2001,titol:'Juana la Loca'},{any:2002,titol:'Los lunes al sol'},{any:2003,titol:'El pianista'},
    {any:2004,titol:'Mar adentro'},{any:2006,titol:'Volver'},{any:2007,titol:'El orfanato'},
    {any:2009,titol:'El secreto de sus ojos'},{any:2010,titol:'Biutiful'},{any:2011,titol:'No habrá paz para los malvados'},
    {any:2012,titol:'Blancanieves'},{any:2013,titol:'La gran belleza'},{any:2014,titol:'La isla mínima'},
    {any:2015,titol:'Truman'},{any:2016,titol:'El olivo'},{any:2017,titol:'Verano 1993'},
    {any:2018,titol:'Entre dos aguas'},{any:2019,titol:'Dolor y gloria'},{any:2021,titol:'El buen patrón'},
    {any:2022,titol:'Alcarràs'},{any:2023,titol:'Cerrar los ojos'},{any:2024,titol:'Marco'},
    {any:2025,titol:'La infiltrada'},
  ];

  // Stacking: per cada any, distribueix verticalment els dots
  // cap avall des de la línia central (alterna: 0, -S, +S, -2S, +2S...)
  function stackDots(films, baseY, R, step) {
    const byYear = {};
    films.forEach(f => {
      if (!byYear[f.any]) byYear[f.any] = [];
      byYear[f.any].push(f);
    });
    const result = [];
    Object.entries(byYear).forEach(([anyStr, arr]) => {
      const n = arr.length;
      arr.forEach((f, i) => {
        // Distribució: 0, +step, -step, +2*step, -2*step...
        const offset = Math.ceil(i / 2) * (i % 2 === 0 ? 1 : -1) * step;
        result.push({ ...f, cy: baseY + offset });
      });
    });
    return result;
  }

  const A0=1964, A1=2025, W=860;
  const STEP = 9; // separació vertical entre dots solapats
  const YP_BASE = 80, YF_BASE = 180;
  const R = 4, RD = 6;
  const ns='http://www.w3.org/2000/svg';

  const pubStacked   = stackDots(pubFilms,  YP_BASE, R, STEP);
  const prestStacked = stackDots(prestFilms, YF_BASE, R, STEP);

  // Altura total dinàmica
  const maxYP = Math.max(...pubStacked.map(f => f.cy));
  const maxYF = Math.max(...prestStacked.map(f => f.cy));
  const minYP = Math.min(...pubStacked.map(f => f.cy));
  const minYF = Math.min(...prestStacked.map(f => f.cy));
  const PAD_TOP = 30, PAD_BOT = 50;
  const H = Math.max(maxYP, maxYF) + PAD_BOT;

  // Títol
  const titolEl = document.createElement('p');
  titolEl.style.cssText = 'font-size:0.82em;font-weight:600;color:#363737;margin-bottom:16px;text-align:center;font-family:system-ui,sans-serif;';
  titolEl.textContent = 'Dobles corones: films al Top 100 i a secció oficial competitiva de festival (1965–2025)';
  wrap.appendChild(titolEl);

  const svg = document.createElementNS(ns,'svg');
  svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
  svg.setAttribute('width','100%');
  svg.setAttribute('preserveAspectRatio','xMidYMid meet');
  svg.style.cssText='display:block;width:100%;overflow:visible;';

  function el(tag,attrs,par){
    const e=document.createElementNS(ns,tag);
    for(const[k,v]of Object.entries(attrs))e.setAttribute(k,v);
    if(par)par.appendChild(e);return e;
  }
  function x(a){ return 8 + (a - A0) / (A1 - A0) * (W - 16); }

  // Línies verticals dècada
  [1965,1975,1985,1995,2005,2015,2025].forEach(a=>{
    el('line',{x1:x(a),y1:PAD_TOP,x2:x(a),y2:H-PAD_BOT+10,stroke:'#f0f0f0','stroke-width':'1'},svg);
    const t=el('text',{x:x(a),y:H-PAD_BOT+22,'font-size':'9',fill:'#bbb','text-anchor':'middle','font-family':'system-ui,sans-serif'},svg);
    t.textContent=a;
  });

  // Línia horitzontal separadora al centre
  const ySep = (YP_BASE + YF_BASE) / 2;
  el('line',{x1:8,y1:ySep,x2:W-8,y2:ySep,stroke:'#e8e8e8','stroke-width':'1'},svg);

  // Etiquetes carrils
  el('text',{x:8,y:PAD_TOP+2,'font-size':'10',fill:COL_PUB,'font-weight':'700','font-family':'system-ui,sans-serif'},svg).textContent='PÚBLIC';
  el('text',{x:8,y:ySep+14,'font-size':'10',fill:COL_PREST,'font-weight':'700','font-family':'system-ui,sans-serif'},svg).textContent='PRESTIGI';

  // Connexions dobles corones
  dobles.forEach(d=>{
    const pubDot  = pubStacked.find(f  => f.any === d.any && (f.titol === d.titol || doblesAnys.has(f.any)));
    const prestDot= prestStacked.find(f => f.any === d.any && (f.titol === d.titol || doblesAnys.has(f.any)));
    const y1 = pubDot  ? pubDot.cy  : YP_BASE;
    const y2 = prestDot? prestDot.cy: YF_BASE;
    el('line',{x1:x(d.any),y1:y1,x2:x(d.any),y2:y2,stroke:'#ddd','stroke-width':'0.8','stroke-dasharray':'3,2'},svg);
  });

  // Punts PÚBLIC
  const cerclesDobles = [];
  pubStacked.forEach(f=>{
    const isDC = doblesAnys.has(f.any) && dobles.some(d=>d.any===f.any && (d.titol===f.titol||pubFilms.filter(p=>p.any===f.any).length===1));
    const esDC = doblesAnys.has(f.any) && dobles.find(d=>d.any===f.any && d.titol===f.titol);
    if (esDC) {
      const c=el('circle',{cx:x(f.any),cy:f.cy,r:RD,fill:'white',stroke:COL_PUB,'stroke-width':'2',style:'cursor:pointer'},svg);
      cerclesDobles.push({el:c,data:{...esDC,cy:f.cy}});
    } else {
      el('circle',{cx:x(f.any),cy:f.cy,r:R,fill:COL_PUB,opacity:'0.85'},svg);
    }
  });

  // Punts PRESTIGI
  prestStacked.forEach(f=>{
    const esDC = doblesAnys.has(f.any) && dobles.find(d=>d.any===f.any && d.titol===f.titol);
    if (esDC) {
      const c=el('circle',{cx:x(f.any),cy:f.cy,r:RD,fill:'white',stroke:COL_PREST,'stroke-width':'2',style:'cursor:pointer'},svg);
      cerclesDobles.push({el:c,data:{...esDC,cy:f.cy}});
    } else {
      el('circle',{cx:x(f.any),cy:f.cy,r:R,fill:COL_PREST,opacity:'0.85'},svg);
    }
  });

  // Llegenda
  const legY = H - PAD_BOT + 34;
  const legItems=[
    {col:COL_PUB,  label:'Públic — Top 100 (100 films)', buit:false},
    {col:COL_PREST,label:'Prestigi — Festivals (264 films)', buit:false},
    {col:COL_PUB,  label:'Doble corona (11 films)', buit:true},
  ];
  let lx = W/2 - 270;
  legItems.forEach(item=>{
    if(item.buit){
      el('circle',{cx:lx+6,cy:legY,r:'5.5',fill:'white',stroke:item.col,'stroke-width':'1.8'},svg);
    }else{
      el('circle',{cx:lx+6,cy:legY,r:'5',fill:item.col},svg);
    }
    const t=el('text',{x:lx+16,y:legY+4,'font-size':'11',fill:'#555','font-family':'system-ui,sans-serif'},svg);
    t.textContent=item.label;
    lx+=item.label.length*5.8+28;
  });

  wrap.appendChild(svg);

  // Tooltip
  const tooltip=document.createElement('div');
  tooltip.style.cssText='position:absolute;background:#1a1a1a;color:#fff;font-size:12px;padding:10px 13px;border-radius:4px;pointer-events:none;display:none;z-index:20;line-height:1.6;max-width:220px;font-family:system-ui,sans-serif;';
  wrap.style.position='relative';
  wrap.appendChild(tooltip);

  cerclesDobles.forEach(({el:c,data:d})=>{
    c.addEventListener('mouseenter',e=>{
      const svgRect=svg.getBoundingClientRect();
      const cx=parseFloat(c.getAttribute('cx'));
      const cy=parseFloat(c.getAttribute('cy'));
      const svgW=svgRect.width;
      const svgH=svgRect.height;
      const px=(cx/W)*svgW;
      const py=(cy/H)*svgH;
      let html=`<strong>${d.titol}</strong><br>${d.any}`;
      if(d.top100)html+=`<br>${d.top100} al Top 100`;
      html+=`<br>${d.festival}`;
      if(d.premi)html+=` · ${d.premi}`;
      tooltip.innerHTML=html;
      tooltip.style.display='block';
      const tw=220;
      let left=px+10;
      if(left+tw>svgW)left=px-tw-10;
      tooltip.style.left=left+'px';
      tooltip.style.top=(py-10+svgRect.top-wrap.getBoundingClientRect().top)+'px';
      c.setAttribute('opacity','0.7');
    });
    c.addEventListener('mouseleave',()=>{
      tooltip.style.display='none';
      c.setAttribute('opacity','1');
    });
  });
}

// ============================================================
// GRÀFIC PUNT-1 CONCLUSIONS: Diagrama de dots públic/prestigi
// ============================================================
function construirGraficConclusions1() {
  const wrap = document.getElementById('grafic-conclusions-1');
  if (!wrap) return;

  // Colors: accent web per blau, vermell festivals, verd segon cercle
  const COL_BLAU    = '#1a75c4';
  const COL_VERMELL = '#9B2335';
  const COL_VERD    = '#2d7a4f';

  // 11 dobles corones
  const dobles = [
    { any:1968, titol:'No somos de piedra',  top100:'#46', festival:'Sant Sebastià', premi:null },
    { any:1974, titol:'Tormento',            top100:'#57', festival:'Sant Sebastià', premi:null },
    { any:1975, titol:'Furtivos',            top100:'#16', festival:'Sant Sebastià', premi:'Conxa d\'Or' },
    { any:1977, titol:'La guerra de papá',   top100:'#18', festival:'Sant Sebastià', premi:null },
    { any:1984, titol:'Los santos inocentes',top100:'#62', festival:'Cannes',        premi:'Millor actor' },
    { any:1988, titol:'Mujeres al borde de un ataque de nervios', top100:'#22', festival:'Venècia', premi:'Millor guió' },
    { any:1999, titol:'Todo sobre mi madre', top100:'#52', festival:'Cannes',        premi:'Millor direcció' },
    { any:2001, titol:'Juana la Loca',       top100:'#68', festival:'Sant Sebastià', premi:'Millor actriu' },
    { any:2002, titol:'Los lunes al sol',    top100:'#70', festival:'Sant Sebastià', premi:'Conxa d\'Or' },
    { any:2004, titol:'Mar adentro',         top100:'#12', festival:'Venècia',       premi:'Lleó de Plata' },
  ];
  const doblesAnys = new Set(dobles.map(d => d.any));

  // 25 films del segon cercle (≥1M espectadors, no al Top 100)
  const segonCercle = [
    { any:1966, titol:'La caza' },
    { any:1973, titol:'El espíritu de la colmena' },
    { any:1976, titol:'Pascual Duarte' },
    { any:1978, titol:'Cría cuervos' },
    { any:1981, titol:'Deprisa deprisa' },
    { any:1983, titol:'El sur' },
    { any:1986, titol:'El viaje a ninguna parte' },
    { any:1989, titol:'Ay Carmela' },
    { any:1992, titol:'Belle époque' },
    { any:1996, titol:'Martín (Hache)' },
    { any:2003, titol:'El pianista' },
    { any:2006, titol:'Volver' },
    { any:2009, titol:'El secreto de sus ojos' },
    { any:2010, titol:'Biutiful' },
    { any:2013, titol:'La gran belleza' },
  ];
  const segonCercleAnys = new Set(segonCercle.map(f => f.any));
  const segonCercleTitols = new Set(segonCercle.map(f => f.titol));

  // Top 100 — un film per entrada
  const pubFilms = [
    {any:1965,titol:'La ciudad no es para mí'},{any:1966,titol:'El golfo'},{any:1966,titol:'Sopa de ganso'},
    {any:1966,titol:'El arte de vivir'},{any:1966,titol:'La pandilla'},{any:1967,titol:'Crónica de 9 meses'},
    {any:1967,titol:'Abuelo made in Spain'},{any:1967,titol:'La familia y uno más'},{any:1968,titol:'No somos de piedra'},
    {any:1968,titol:'Cantando a la vida'},{any:1968,titol:'La vida sigue igual'},{any:1969,titol:'Hay que matar a B'},
    {any:1969,titol:'El astronauta'},{any:1970,titol:'Vente a Alemania Pepe'},{any:1971,titol:'No firmes más letras Ramón'},
    {any:1972,titol:'Mi querida señorita'},{any:1974,titol:'Tormento'},{any:1975,titol:'Furtivos'},
    {any:1975,titol:'El casto Susanito'},{any:1976,titol:'El puente'},{any:1977,titol:'La guerra de papá'},
    {any:1977,titol:'El anillo de nibelungo'},{any:1978,titol:'El soltero'},{any:1981,titol:'La colmena'},
    {any:1984,titol:'Los santos inocentes'},{any:1988,titol:'Mujeres al borde de un ataque de nervios'},
    {any:1991,titol:'Tacones lejanos'},{any:1995,titol:'Boca a boca'},{any:1997,titol:'La buena estrella'},
    {any:1998,titol:'El abuelo'},{any:1999,titol:'Todo sobre mi madre'},{any:2001,titol:'Juana la Loca'},
    {any:2001,titol:'El hijo de la novia'},{any:2002,titol:'Los lunes al sol'},{any:2003,titol:'Soldados de Salamina'},
    {any:2004,titol:'Mar adentro'},{any:2005,titol:'Habana Blues'},{any:2006,titol:'El laberinto del fauno'},
    {any:2007,titol:'El orfanato'},{any:2009,titol:'Celda 211'},{any:2009,titol:'Agora'},
    {any:2011,titol:'No habrá paz para los malvados'},{any:2012,titol:'Blancanieves'},{any:2014,titol:'La isla mínima'},
    {any:2015,titol:'Truman'},{any:2016,titol:'Un monstruo viene a verme'},{any:2017,titol:'Verano 1993'},
    {any:2017,titol:'El bar'},{any:2018,titol:'Campeones'},{any:2019,titol:'Dolor y gloria'},
    {any:2022,titol:'El buen patrón'},{any:2024,titol:'Padre no hay más que uno 4'},{any:2025,titol:'Padre no hay más que uno 5'},
  ];

  // Festivals — films seleccionats (inclou dobles corones i segon cercle)
  const prestFilms = [
    {any:1965,titol:'La caza'},{any:1966,titol:'Nueve cartas a Berta'},{any:1968,titol:'Stress es tres tres'},
    {any:1970,titol:'El momento de la verdad'},{any:1973,titol:'El espíritu de la colmena'},
    {any:1974,titol:'Tormento'},{any:1976,titol:'Pascual Duarte'},{any:1977,titol:'El desencanto'},
    {any:1978,titol:'Cría cuervos'},{any:1981,titol:'Deprisa deprisa'},{any:1983,titol:'El sur'},
    {any:1984,titol:'Los santos inocentes'},{any:1985,titol:'El año de las luces'},{any:1986,titol:'El viaje a ninguna parte'},
    {any:1988,titol:'Mujeres al borde de un ataque de nervios'},{any:1989,titol:'Ay Carmela'},
    {any:1991,titol:'Las edades de Lulú'},{any:1992,titol:'Belle époque'},{any:1994,titol:'Hola, ¿estás sola?'},
    {any:1996,titol:'Martín (Hache)'},{any:1997,titol:'La buena estrella'},{any:1999,titol:'Todo sobre mi madre'},
    {any:2001,titol:'Juana la Loca'},{any:2002,titol:'Los lunes al sol'},{any:2003,titol:'El pianista'},
    {any:2004,titol:'Mar adentro'},{any:2006,titol:'Volver'},{any:2007,titol:'El orfanato'},
    {any:2009,titol:'El secreto de sus ojos'},{any:2010,titol:'Biutiful'},{any:2011,titol:'No habrá paz para los malvados'},
    {any:2012,titol:'Blancanieves'},{any:2013,titol:'La gran belleza'},{any:2014,titol:'La isla mínima'},
    {any:2015,titol:'Truman'},{any:2016,titol:'El olivo'},{any:2017,titol:'Verano 1993'},
    {any:2018,titol:'Entre dos aguas'},{any:2019,titol:'Dolor y gloria'},{any:2021,titol:'El buen patrón'},
    {any:2022,titol:'Alcarràs'},{any:2023,titol:'Cerrar los ojos'},{any:2024,titol:'Marco'},
    {any:2025,titol:'La infiltrada'},
  ];

  function stackDots(films, baseY, step) {
    const byYear = {};
    films.forEach(f => {
      if (!byYear[f.any]) byYear[f.any] = [];
      byYear[f.any].push(f);
    });
    const result = [];
    Object.entries(byYear).forEach(([, arr]) => {
      arr.forEach((f, i) => {
        const offset = Math.ceil(i / 2) * (i % 2 === 0 ? 1 : -1) * step;
        result.push({ ...f, cy: baseY + offset });
      });
    });
    return result;
  }

  const A0 = 1964, A1 = 2025, W = 860;
  const STEP = 9;
  const YP_BASE = 60, YF_BASE = 160;
  const PAD_TOP = 28, PAD_BOT = 60;
  const R = 4, RD = 6;
  const ns = 'http://www.w3.org/2000/svg';

  const pubStacked   = stackDots(pubFilms,   YP_BASE, STEP);
  const prestStacked = stackDots(prestFilms,  YF_BASE, STEP);

  const maxY = Math.max(...pubStacked.map(f=>f.cy), ...prestStacked.map(f=>f.cy));
  const H = maxY + PAD_BOT;

  function xPos(any) { return 12 + (any - A0) / (A1 - A0) * (W - 24); }

  function el(tag, attrs, par) {
    const e = document.createElementNS(ns, tag);
    Object.entries(attrs).forEach(([k,v]) => e.setAttribute(k,v));
    if (par) par.appendChild(e);
    return e;
  }

  wrap.style.position = 'relative';

  const svg = el('svg', { viewBox:`0 0 ${W} ${H}`, width:'100%', style:'overflow:visible;display:block;' }, wrap);

  // Anys a la part SUPERIOR
  [1965,1975,1985,1995,2005,2015,2025].forEach(any => {
    const x = xPos(any);
    // Línies verticals lleugeríssimes (fons, no destacades)
    el('line', { x1:x, y1:PAD_TOP, x2:x, y2:maxY+8, stroke:'#f0f0f0', 'stroke-width':'1' }, svg);
    // Etiqueta a dalt
    el('text', { x, y:PAD_TOP-6, 'text-anchor':'middle', 'font-size':'9', fill:'#bbb', 'font-family':'system-ui,sans-serif' }, svg).textContent = any;
  });

  // Línies verticals NOMÉS per a dobles corones (grises, destacades)
  dobles.forEach(d => {
    const pd = pubStacked.find(f => f.titol === d.titol);
    const fd = prestStacked.find(f => f.titol === d.titol);
    const y1 = pd ? pd.cy : YP_BASE;
    const y2 = fd ? fd.cy : YF_BASE;
    el('line', { x1:xPos(d.any), y1, x2:xPos(d.any), y2, stroke:'#ccc', 'stroke-width':'1', 'stroke-dasharray':'3,2' }, svg);
  });

  const puntsInteractius = [];

  // ── Fila PÚBLIC ──
  pubStacked.forEach(f => {
    const esDC = dobles.find(d => d.titol === f.titol);
    if (esDC) {
      // Doble corona: cercle blau buit
      const c = el('circle', { cx:xPos(f.any), cy:f.cy, r:RD, fill:'white', stroke:COL_BLAU, 'stroke-width':'2', style:'cursor:pointer' }, svg);
      puntsInteractius.push({ el:c, data:{ ...esDC, tipus:'corona-pub' } });
    } else {
      el('circle', { cx:xPos(f.any), cy:f.cy, r:R, fill:COL_BLAU, opacity:'0.9' }, svg);
    }
  });

  // ── Fila PRESTIGI ──
  prestStacked.forEach(f => {
    const esDC = dobles.find(d => d.titol === f.titol);
    const eSC  = segonCercleTitols.has(f.titol);
    if (esDC) {
      // Doble corona: cercle vermell buit
      const c = el('circle', { cx:xPos(f.any), cy:f.cy, r:RD, fill:'white', stroke:COL_VERMELL, 'stroke-width':'2', style:'cursor:pointer' }, svg);
      puntsInteractius.push({ el:c, data:{ ...esDC, tipus:'corona-prest' } });
    } else if (eSC) {
      // Segon cercle: cercle verd buit
      const sc = segonCercle.find(s => s.titol === f.titol);
      const c = el('circle', { cx:xPos(f.any), cy:f.cy, r:RD, fill:'white', stroke:COL_VERD, 'stroke-width':'1.5', style:'cursor:pointer' }, svg);
      puntsInteractius.push({ el:c, data:{ ...f, ...sc, tipus:'segon-cercle' } });
    } else {
      el('circle', { cx:xPos(f.any), cy:f.cy, r:R, fill:COL_VERMELL, opacity:'0.9' }, svg);
    }
  });

  // ── Llegenda (sota el gràfic, mida adequada, ben separada) ──
  const legY = maxY + 28;
  const LEG_R = 6;
  const LEG_FS = '12.5';
  const LEG_GAP = 14;

  const legItems = [
    { tipus:'ple',   col:COL_BLAU,    label:'Públic — Top 100' },
    { tipus:'ple',   col:COL_VERMELL, label:'Prestigi — Festivals' },
    { tipus:'doble', label:'Doble corona' },
    { tipus:'buit',  col:COL_VERD,    label:'Segon cercle' },
  ];

  // Calcular amplada total per centrar
  const textW = { 'Públic — Top 100': 120, 'Prestigi — Festivals': 140, 'Doble corona': 110, 'Segon cercle': 100 };
  const itemW = legItems.map(item => LEG_R*2 + LEG_GAP + (textW[item.label] || 110) + 24);
  const totalW = itemW.reduce((a,b) => a+b, 0);
  let lx = (W - totalW) / 2;

  legItems.forEach((item, i) => {
    const cx = lx + LEG_R;
    const cy = legY;
    if (item.tipus === 'ple') {
      el('circle', { cx, cy, r:LEG_R, fill:item.col }, svg);
    } else if (item.tipus === 'doble') {
      // Cercle blau buit + cercle vermell buit junts
      el('circle', { cx:cx-4, cy, r:LEG_R, fill:'white', stroke:COL_BLAU, 'stroke-width':'2' }, svg);
      el('circle', { cx:cx+4, cy, r:LEG_R, fill:'white', stroke:COL_VERMELL, 'stroke-width':'2' }, svg);
    } else {
      el('circle', { cx, cy, r:LEG_R, fill:'white', stroke:item.col, 'stroke-width':'1.5' }, svg);
    }
    const tx = item.tipus === 'doble' ? cx + LEG_R + 6 : cx + LEG_R + 6;
    const t = el('text', { x:tx, y:cy+4, 'font-size':LEG_FS, fill:'#555', 'font-family':'system-ui,sans-serif' }, svg);
    t.textContent = item.label;
    lx += itemW[i];
  });

  // ── Tooltip ──
  const tooltip = document.createElement('div');
  tooltip.style.cssText = 'position:absolute;background:#1a1a1a;color:#fff;font-size:12px;padding:8px 12px;border-radius:4px;pointer-events:none;display:none;z-index:20;line-height:1.5;max-width:220px;font-family:system-ui,sans-serif;';
  wrap.appendChild(tooltip);

  puntsInteractius.forEach(({ el:c, data:d }) => {
    c.addEventListener('mouseenter', () => {
      const svgRect = svg.getBoundingClientRect();
      const wRect   = wrap.getBoundingClientRect();
      const cx = parseFloat(c.getAttribute('cx'));
      const cy = parseFloat(c.getAttribute('cy'));
      const px = (cx / W) * svgRect.width;
      const py = (cy / H) * svgRect.height;
      let html = `<strong>${d.titol}</strong><br>${d.any}`;
      if (d.tipus === 'corona-pub' || d.tipus === 'corona-prest') {
        if (d.top100) html += `<br>${d.top100} al Top 100`;
        html += `<br>${d.festival}`;
        if (d.premi) html += ` · ${d.premi}`;
        html += `<br><span style="color:#aaa">Doble corona</span>`;
      } else if (d.tipus === 'segon-cercle') {
        html += `<br><span style="color:#aaa">Segon cercle — ≥1M espectadors</span>`;
      }
      tooltip.innerHTML = html;
      tooltip.style.display = 'block';
      let left = px + 10;
      if (left + 220 > svgRect.width) left = px - 230;
      tooltip.style.left = left + 'px';
      tooltip.style.top = (py - 10 + svgRect.top - wRect.top) + 'px';
      c.setAttribute('opacity', '0.7');
    });
    c.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
      c.setAttribute('opacity', '1');
    });
  });
}

// ============================================================
// GRÀFIC PUNT-2 CONCLUSIONS: Premiats vs mitjana espectadors
// ============================================================
function construirGraficConclusions2() {
  const wrap = document.getElementById('grafic-conclusions-2');
  if (!wrap) return;

  const decades =  ['1965–69', '70s', '80s', '90s', '2000s', '2010s', '2020s'];
  const premiats = [2, 9, 3, 9, 4, 15, 11];
  const mitjanes = [346323, 515710, 320613, 238790, 186546, 202150, 172584];

  const W = 760, H = 240;
  const PAD_L = 52, PAD_R = 60, PAD_T = 30, PAD_B = 48;
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;
  const barW = plotW / decades.length;

  const maxPrem = Math.max(...premiats);
  const maxMit  = Math.max(...mitjanes);

  // Colors coherents amb la web
  const COL_BARRA = '#c8d4e3';
  const COL_BARRA_STROKE = '#a8b8d0';
  const COL_LINIA = '#9B2335';   // vermell prestigi
  const COL_PUNT  = '#9B2335';

  const ns = 'http://www.w3.org/2000/svg';
  function el(tag, attrs, par) {
    const e = document.createElementNS(ns, tag);
    Object.entries(attrs).forEach(([k,v]) => e.setAttribute(k,v));
    if (par) par.appendChild(e);
    return e;
  }

  function yBar(val) { return PAD_T + plotH - (val / maxPrem) * plotH; }
  function yLin(val) { return PAD_T + plotH - (val / maxMit)  * plotH; }

  const svg = el('svg', { viewBox:`0 0 ${W} ${H}`, width:'100%', style:'overflow:visible;display:block;' }, wrap);

  // Grid horitzontal
  [0, 0.25, 0.5, 0.75, 1].forEach(frac => {
    const y = PAD_T + frac * plotH;
    el('line', { x1:PAD_L, y1:y, x2:W-PAD_R, y2:y, stroke:'#f2f2f2', 'stroke-width':'1' }, svg);
  });

  // Eix base
  el('line', { x1:PAD_L, y1:PAD_T+plotH, x2:W-PAD_R, y2:PAD_T+plotH, stroke:'#e0e0e0', 'stroke-width':'1' }, svg);

  // Eix Y esquerra — escala premiats
  [0, 5, 10, 15].forEach(v => {
    if (v > maxPrem) return;
    const y = yBar(v);
    el('text', { x:PAD_L-6, y:y+4, 'text-anchor':'end', 'font-size':'9', fill:'#bbb', 'font-family':'system-ui,sans-serif' }, svg).textContent = v;
  });

  // Eix Y dret — escala espectadors (en milers)
  [0, 100, 200, 300, 400, 500].forEach(v => {
    const val = v * 1000;
    if (val > maxMit * 1.05) return;
    const y = yLin(val);
    el('text', { x:W-PAD_R+6, y:y+4, 'text-anchor':'start', 'font-size':'9', fill:COL_LINIA, 'font-family':'system-ui,sans-serif', opacity:'0.7' }, svg).textContent = v + 'k';
  });

  // Barres i etiquetes eix X
  decades.forEach((dec, i) => {
    const cx = PAD_L + i * barW + barW / 2;
    const bh = (premiats[i] / maxPrem) * plotH;
    const by = PAD_T + plotH - bh;

    el('rect', {
      x: PAD_L + i * barW + barW * 0.18,
      y: by,
      width: barW * 0.64,
      height: bh,
      fill: COL_BARRA,
      stroke: COL_BARRA_STROKE,
      'stroke-width': '0.5',
      rx: '2'
    }, svg);

    // Valor sobre la barra
    el('text', {
      x: cx, y: by - 5,
      'text-anchor': 'middle', 'font-size': '10', fill: '#888', 'font-family': 'system-ui,sans-serif'
    }, svg).textContent = premiats[i];

    // Etiqueta dècada
    el('text', {
      x: cx, y: H - PAD_B + 16,
      'text-anchor': 'middle', 'font-size': '10', fill: '#aaa', 'font-family': 'system-ui,sans-serif'
    }, svg).textContent = dec;
  });

  // Línia espectadors
  const punts = decades.map((_, i) => ({
    x: PAD_L + i * barW + barW / 2,
    y: yLin(mitjanes[i])
  }));

  let pathD = punts.map((p,i) => (i===0?'M':'L') + ` ${p.x} ${p.y}`).join(' ');
  el('path', { d:pathD, fill:'none', stroke:COL_LINIA, 'stroke-width':'2', 'stroke-linejoin':'round', opacity:'0.85' }, svg);

  punts.forEach((p, i) => {
    el('circle', { cx:p.x, cy:p.y, r:'3.5', fill:COL_PUNT, opacity:'0.85' }, svg);
  });

  // Etiquetes de la línia (valor en k sobre cada punt)
  punts.forEach((p, i) => {
    const kVal = Math.round(mitjanes[i] / 1000);
    el('text', {
      x: p.x, y: p.y - 8,
      'text-anchor': 'middle', 'font-size': '9', fill: COL_LINIA, 'font-family': 'system-ui,sans-serif', opacity:'0.8'
    }, svg).textContent = kVal + 'k';
  });

  // Etiquetes eixos
  el('text', {
    x: PAD_L - 6, y: PAD_T - 10,
    'text-anchor': 'end', 'font-size': '9.5', fill: '#aaa', 'font-family': 'system-ui,sans-serif'
  }, svg).textContent = 'Premiats';

  el('text', {
    x: W - PAD_R + 6, y: PAD_T - 10,
    'text-anchor': 'start', 'font-size': '9.5', fill: COL_LINIA, 'font-family': 'system-ui,sans-serif', opacity:'0.7'
  }, svg).textContent = 'Esp. (mit.)';

  // Llegenda
  const legY = H - PAD_B + 32;
  const legItems = [
    { tipus: 'rect', col: COL_BARRA, stroke: COL_BARRA_STROKE, label: 'Films premiats als 4 festivals' },
    { tipus: 'line', col: COL_LINIA, label: 'Mitjana espectadors films de festival' },
  ];
  let lx = W / 2 - 220;
  legItems.forEach(item => {
    if (item.tipus === 'rect') {
      el('rect', { x:lx, y:legY-6, width:14, height:10, fill:item.col, stroke:item.stroke, 'stroke-width':'0.5', rx:'1' }, svg);
      lx += 20;
    } else {
      el('line', { x1:lx, y1:legY-1, x2:lx+14, y2:legY-1, stroke:item.col, 'stroke-width':'2', opacity:'0.85' }, svg);
      el('circle', { cx:lx+7, cy:legY-1, r:'3', fill:item.col, opacity:'0.85' }, svg);
      lx += 20;
    }
    const t = el('text', { x:lx, y:legY+3, 'font-size':'10', fill:'#777', 'font-family':'system-ui,sans-serif' }, svg);
    t.textContent = item.label;
    lx += item.label.length * 5.5 + 24;
  });
}
