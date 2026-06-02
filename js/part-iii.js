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
    construirCazaAlcarras();
    construirLleis();
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
      iic: '0,21', iaa_xifra: '341.377', iaa_mult: '(×1,0)', iaa_est: false,
    },
    {
      titol: 'Alcarràs', any: 2022, director: 'Carla Simón',
      festival: 'Berlín', premiat: true,
      espectadors: 403195,
      mercat: '71M', penetr: '0,84%', quota: '0,57%',
      iic: '0,47', iaa_xifra: '1,06M–1,56M', iaa_mult: '(×2,5–4,0)', iaa_est: true,
    },
  ];

  const files = films.map((f, i) => {
    const bg = i % 2 === 0 ? '#ffffff' : '#f7f7f7';
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
      <td class="col-num"><strong>${f.iaa_xifra}</strong><br><span style="font-weight:400;color:#6b6b6b;font-size:0.9em">${f.iaa_mult}</span></td>
    </tr>`;
  }).join('');

  cont.innerHTML = `
    <table class="taula-festivals" style="font-size:0.82em">
      <thead><tr>
        <th style="width:22%">Títol</th>
        <th class="col-subtil" style="width:12%">Director</th>
        <th style="width:70px">Festival</th>
        <th class="col-center" style="width:30px">★</th>
        <th class="col-center" style="width:55px">Top 100</th>
        <th class="col-num" style="width:110px">Espectadors</th>
        <th class="col-num" style="width:65px">Mercat</th>
        <th class="col-num" style="width:65px">Penetr.</th>
        <th class="col-num" style="width:55px">Quota</th>
        <th class="col-center" style="width:40px">IIC</th>
        <th class="col-num" style="width:100px">IAA estimat</th>
      </tr></thead>
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
    { xifra: '1,06M–1,56M', mult: '(×2,5–4,0)', total: 1310195 },
    { xifra: '341.377', mult: '(×1,0)', total: 341377 },
  ];

  const pluginTotals = {
    id: 'cazaTotals',
    afterDraw(chart) {
      const ctx2 = chart.ctx;
      ctx2.save();
      ctx2.font = '600 11px -apple-system, Arial, sans-serif';
      ctx2.fillStyle = '#363737';
      ctx2.textBaseline = 'middle';
      etiquetesTotals.forEach((et, i) => {
        const x = chart.scales.x.getPixelForValue(et.total) + 6;
        const meta = chart.getDatasetMeta(0);
        const bar = meta.data[i];
        if (!bar) return;
        const y = bar.y;
        ctx2.font = 'bold 13px -apple-system, Arial, sans-serif';
        ctx2.fillStyle = '#363737';
        ctx2.fillText(et.xifra, x, y);
        const xifraWidth = ctx2.measureText(et.xifra + ' ').width;
        ctx2.font = '12px -apple-system, Arial, sans-serif';
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
    leg.style.cssText = 'text-align:center;font-size:11px;margin-top:10px;margin-bottom:0;display:flex;justify-content:center;align-items:center;gap:14px;flex-wrap:wrap;color:#555;font-family:-apple-system,Arial,sans-serif';
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
    s.textContent = `.ll-outer{position:relative;margin:0}.ll-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:8px}.ll-hint{position:absolute;top:0;right:0;width:28px;height:calc(100% - 8px);background:linear-gradient(to right,transparent,rgba(255,255,255,.55));pointer-events:none;transition:opacity .4s;z-index:20}.ll-g{position:relative;min-width:1600px;font-size:15px;font-family:-apple-system,"SF Pro Text",BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif}.ll-g6{display:grid;grid-template-columns:31.67% 8.33% 6.67% 18.33% 23.33% 11.67%}.ll-lm{position:absolute;top:0;bottom:0;width:0;border-left:1px dashed rgba(255,255,255,.42);z-index:4;pointer-events:none}.ll-lm.cl{border-left-color:rgba(0,0,0,.16)}.ll-gov{display:flex;height:26px;overflow:hidden}.ll-gb{display:flex;align-items:center;padding:0 8px;font-size:.68em;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:#fff;border-right:1px solid rgba(255,255,255,.3);white-space:nowrap;overflow:hidden}.ll-per .c{padding:11px 12px 9px;font-size:.85em;font-weight:700;color:#fff;border-right:1px solid rgba(255,255,255,.18)}.ll-mom{position:relative;height:96px;background:#f5f5f5;border-top:1px solid #e0e0e0;border-bottom:1px solid #e0e0e0;overflow:visible}.ll-mp{position:absolute;z-index:10;width:0}.ll-ml{position:absolute;left:0;top:0;bottom:0;width:0;border-left:1px dashed #b0b0b0}.ll-mc{position:absolute;left:0;top:10px;transform:translateX(-50%);width:24px;height:24px;border-radius:50%;background:#363737;color:#fff;font-size:.68em;font-weight:700;display:flex;align-items:center;justify-content:center;border:2px solid #f5f5f5;box-shadow:0 1px 3px rgba(0,0,0,.22);z-index:2}.ll-ma{position:absolute;left:0;top:40px;transform:translateX(-50%);font-size:.65em;color:#888;white-space:nowrap;font-style:italic;text-align:center}.ll-mn{position:absolute;left:0;top:56px;transform:translateX(-50%);font-size:.72em;color:#333;white-space:nowrap;font-weight:700;text-align:center}.ll-fin .c{padding:12px 11px;font-size:.82em;color:#fff;font-style:italic;border-right:1px solid rgba(255,255,255,.18);line-height:1.4;min-height:80px}.ll-fin .c .nf{display:block;font-style:normal;font-weight:700;font-size:.9em;opacity:.82;margin-bottom:4px}.ll-iaa .c{padding:11px 10px;font-size:.95em;font-weight:400;color:#fff;text-align:center;border-right:1px solid rgba(255,255,255,.2)}.ll-eix{position:relative;height:32px;border-top:1px solid #ccc;margin-top:8px;padding-bottom:10px}.ll-ea{position:absolute;font-size:.72em;color:#999;transform:translateX(-50%);padding-top:3px;white-space:nowrap}.ll-ef{font-size:.75em;color:#888;text-transform:uppercase;letter-spacing:.05em;padding:5px 0 2px}.ll-tit{font-size:.82em;color:#363737;font-weight:700;margin-bottom:10px}.ll-leg{font-size:.78em;color:#888;font-style:italic;margin-top:10px;line-height:1.5}.c1{background:#2C3E50}.c2{background:#1A5276}.c3{background:#1E8449}.c4{background:#7D3C98}.c5{background:#B7770D}.c6{background:#922B21}.gf{background:#4E342E}.gt{background:#546E7A}.gps{background:#B71C1C}.gpp{background:#0D47A1}`;
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
  <div class="c c4"><span class="nf">5 finestres</span>Sala + TVE + TV privada/pagament + TV autonòmiques + DVD</div>
  <div class="c c5"><span class="nf">6 finestres</span>Sala + TVE + TV privada/pagament + TV autonòmiques + DVD + plataformes</div>
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

document.addEventListener('DOMContentLoaded', carregarDades);
