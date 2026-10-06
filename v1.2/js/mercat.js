/* Públic i Prestigi — Gràfic de mercat i població
 * Carrega data/market.json i renderitza una doble lectura:
 * 1) mercat i població
 * 2) entrades anuals per habitant
 */

const PIP_MERCAT_ES = document.documentElement.lang === 'es';
const pipMercatT = (ca, es) => PIP_MERCAT_ES ? es : ca;

async function construirGraficMercat() {
  const cont = document.getElementById('seccio-mercat-grafic');
  if (!cont) return;

  let dades;
  try {
    const r = await fetch(pipPath('data/market.json'));
    dades = await r.json();
  } catch(e) {
    cont.innerHTML = `<p class="text-md-error">${pipMercatT('Error carregant les dades del mercat.','Error al cargar los datos del mercado.')}</p>`;
    return;
  }

  const anys      = dades.map(d => d.any);
  const entrades  = dades.map(d => d.entrades_M);
  const poblacio  = dades.map(d => d.poblacio_M);
  const estimats  = dades.map(d => d.estimat);
  const perHab    = dades.map(d => Number((d.entrades_M / d.poblacio_M).toFixed(2)));

  const COLORS_SAT_MERCAT = {
    '60s':'#8aaec8','70s':'#7aa0be','80s':'#6a92b4','90s':'#5a84aa',
    '2000s':'#4a76a0','2010s':'#3a6896','2020s':'#2a5a8c'
  };
  const COLORS_CLAR_MERCAT = {
    '60s':'#f4f7fa','70s':'#edf2f7','80s':'#e4ecf4','90s':'#dae6f0',
    '2000s':'#cfe0ec','2010s':'#c3d9e8','2020s':'#b6d2e4'
  };
  const decadaPerAny = (any) => {
    if (any === 2020) return null;
    if (any <= 1969) return '60s';
    if (any <= 1979) return '70s';
    if (any <= 1989) return '80s';
    if (any <= 1999) return '90s';
    if (any <= 2009) return '2000s';
    if (any <= 2019) return '2010s';
    return '2020s';
  };
  const colorPerAny = (any) => {
    const dec = decadaPerAny(any);
    if (!dec) return '#b43232';
    return COLORS_SAT_MERCAT[dec];
  };
  const colorHoverPerAny = (any) => {
    const dec = decadaPerAny(any);
    if (!dec) return '#e8a0a0';
    return COLORS_CLAR_MERCAT[dec];
  };
  const colorsBarres = dades.map(d => colorPerAny(d.any));
  const colorsHover  = dades.map(d => colorHoverPerAny(d.any));

  const decades = [
    { any: 1980, etiqueta: pipMercatT('Anys 80','Años 80') },
    { any: 1990, etiqueta: pipMercatT('Anys 90','Años 90') },
    { any: 2000, etiqueta: pipMercatT('Anys 2000','Años 2000') },
    { any: 2010, etiqueta: pipMercatT('Anys 2010','Años 2010') },
  ];

  cont.innerHTML = `
    <div class="grafic-mercat-wrap">
      <p id="grafic-mercat-titol" class="grafic-mercat-titol">${pipMercatT(
        'Entrades venudes a Espanya i evolució de la població (1965–2025)',
        'Entradas vendidas en España y evolución de la población (1965–2025)'
      )}</p>
      <div class="mercat-view-controls" role="group" aria-label="${pipMercatT('Canvia la lectura del gràfic','Cambia la lectura del gráfico')}">
        <button type="button" class="mercat-view-toggle is-active" data-view="mercat" aria-pressed="true">${pipMercatT('Mercat i població','Mercado y población')}</button>
        <button type="button" class="mercat-view-toggle" data-view="perhab" aria-pressed="false">${pipMercatT('Entrades per habitant','Entradas por habitante')}</button>
      </div>
      <div class="grafic-mercat-canvas-wrap">
        <canvas id="grafic-mercat-canvas"></canvas>
      </div>
      <p id="grafic-mercat-peu" class="grafic-nota">${pipMercatT(
        'Entrades venudes (barres) i població (línia) a Espanya, 1965–2025.',
        'Entradas vendidas (barras) y población (línea) en España, 1965–2025.'
      )}</p>
      <p class="grafic-font">${pipMercatT(
        'Font: base de <em>Públic i Prestigi</em>.',
        'Fuente: base de <em>Públic i Prestigi</em>.'
      )}</p>
    </div>`;

  const ctx = document.getElementById('grafic-mercat-canvas').getContext('2d');
  const titol = document.getElementById('grafic-mercat-titol');
  const peu = document.getElementById('grafic-mercat-peu');

  const pluginDecades = {
    id: 'decades',
    afterDraw(chart) {
      const { ctx, scales: { x, y } } = chart;
      const isMobil = window.innerWidth <= 768;
      const mida = isMobil ? 9 : 11;
      ctx.save();

      decades.forEach(({ any, etiqueta }) => {
        const idx = anys.indexOf(any);
        if (idx < 0) return;
        const xPos = x.getPixelForValue(idx);
        const yTop = y.top;
        const yBot = y.bottom;

        ctx.beginPath();
        ctx.strokeStyle = 'rgba(100,100,100,0.25)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 3]);
        ctx.moveTo(xPos, yTop);
        ctx.lineTo(xPos, yBot);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      if (chart.$view === 'mercat') {
        const idxMax = 0;
        const xMax = x.getPixelForValue(idxMax);
        const yMax = y.getPixelForValue(entrades[idxMax]);
        ctx.fillStyle = '#363737';
        ctx.font = `bold ${mida}px "Inter", -apple-system, sans-serif`;
        ctx.textAlign = 'left';
        ctx.fillText(pipMercatT('Màxim: ~390M','Máximo: ~390M'), xMax + 4, yMax - (isMobil ? 10 : 18));
        if (!isMobil) {
          ctx.font = `${mida}px "Inter", -apple-system, sans-serif`;
          ctx.fillText('(~1964–1966)', xMax + 6, yMax - 6);
        }

        const idx2020 = anys.indexOf(2020);
        const x2020 = x.getPixelForValue(idx2020);
        ctx.fillStyle = 'rgba(180,50,50,0.9)';
        ctx.font = `bold ${mida}px "Inter", -apple-system, sans-serif`;
        ctx.textAlign = 'right';
        ctx.fillText(isMobil ? '2020' : pipMercatT('Col·lapse pandèmic','Colapso pandémico'), x2020 + 4, y.top + (isMobil ? 20 : 30));
        if (!isMobil) ctx.fillText('50M (2020)', x2020 + 4, y.top + 42);
      }

      ctx.restore();
    }
  };

  const mercatDatasets = [
    {
      label: pipMercatT('Entrades venudes (M)','Entradas vendidas (M)'),
      data: entrades,
      backgroundColor: colorsBarres,
      hoverBackgroundColor: colorsHover,
      borderWidth: 0,
      yAxisID: 'y',
      order: 2,
      pointStyle: 'rect'
    },
    {
      label: pipMercatT('Població (M habitants)','Población (M habitantes)'),
      data: poblacio,
      type: 'line',
      borderColor: 'rgba(190, 110, 30, 0.9)',
      backgroundColor: 'transparent',
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 4,
      tension: 0.3,
      yAxisID: 'y2',
      order: 1,
      pointStyle: 'line'
    }
  ];

  const perHabDatasets = [
    {
      label: pipMercatT('Entrades per habitant','Entradas por habitante'),
      data: perHab,
      type: 'line',
      borderColor: '#2a5a8c',
      backgroundColor: 'transparent',
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 4,
      tension: 0.24,
      yAxisID: 'y',
      pointStyle: 'line'
    }
  ];

  const chart = new Chart(ctx, {
    type: 'bar',
    data: { labels: anys, datasets: mercatDatasets },
    options: {
      animation: false,
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          position: 'top',
          align: 'center',
          labels: {
            usePointStyle: true,
            pointStyleWidth: 18,
            font: { size: 11, family: '"Inter", -apple-system, sans-serif' },
            color: '#555',
            padding: 13,
            generateLabels(chart) {
              const labels = Chart.defaults.plugins.legend.labels.generateLabels(chart);
              labels.forEach(label => {
                const ds = chart.data.datasets[label.datasetIndex];
                if (ds.type === 'line') {
                  label.fillStyle = 'transparent';
                  label.strokeStyle = ds.borderColor;
                  label.lineWidth = 2;
                  label.pointStyle = 'line';
                } else {
                  label.fillStyle = ds.backgroundColor;
                  label.strokeStyle = Array.isArray(ds.backgroundColor) ? '#5a84aa' : ds.backgroundColor;
                  label.lineWidth = 0;
                  label.pointStyle = 'rect';
                }
              });
              return labels;
            }
          }
        },
        title: { display: false },
        tooltip: {
          backgroundColor: 'rgba(45,45,45,0.95)',
          cornerRadius: 6,
          padding: 8,
          titleFont: { size: 12, weight: '600', family: '"Inter", -apple-system, "SF Pro Text", sans-serif' },
          bodyFont: { size: 12, family: '"Inter", -apple-system, "SF Pro Text", sans-serif' },
          callbacks: {
            title: c => `${pipMercatT('Any','Año')} ${c[0].label}`,
            label: c => {
              if (chart.$view === 'perhab') {
                const est = estimats[c.dataIndex] ? ` ${pipMercatT('(est.)','(est.)')}` : '';
                return ` ${pipMercatT('Entrades per habitant','Entradas por habitante')}: ${Number(c.parsed.y).toLocaleString(PIP_MERCAT_ES ? 'es-ES' : 'ca-ES',{minimumFractionDigits:2,maximumFractionDigits:2})}${est}`;
              }
              const u = c.datasetIndex === 0 ? pipMercatT('M entrades','M entradas') : pipMercatT('M habitants','M habitantes');
              const est = c.datasetIndex === 0 && estimats[c.dataIndex] ? ' (est.)' : '';
              return ` ${c.dataset.label.split('(')[0].trim()}: ${c.parsed.y.toFixed(1)}${u}${est}`;
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            maxTicksLimit: 13,
            color: '#666',
            font: { size: 11 },
            callback: (val, idx) => anys[idx] % 5 === 0 ? anys[idx] : '',
          },
          grid: { display: false },
        },
        y: {
          position: 'left',
          title: { display: false },
          ticks: { color: '#666', font: { size: 11 } },
          grid: { color: 'rgba(0,0,0,0.06)' },
          min: 0,
          max: 420,
        },
        y2: {
          position: 'right',
          display: true,
          title: { display: false },
          ticks: { color: 'rgba(190, 110, 30, 0.8)', font: { size: 11 } },
          grid: { display: false },
          min: 0,
          max: 90,
        }
      }
    },
    plugins: [pluginDecades]
  });
  chart.$view = 'mercat';

  const buttons = [...cont.querySelectorAll('.mercat-view-toggle')];
  const setView = (view) => {
    chart.$view = view;

    if (view === 'perhab') {
      chart.config.type = 'line';
      chart.data.datasets = perHabDatasets;
      titol.textContent = pipMercatT(
        'Entrades anuals per habitant — Espanya (1965–2025)',
        'Entradas anuales por habitante — España (1965–2025)'
      );
      peu.textContent = pipMercatT(
        'Entrades anuals venudes dividides per la població d’Espanya.',
        'Entradas anuales vendidas divididas por la población de España.'
      );
      chart.options.scales.y.min = 0;
      chart.options.scales.y.max = 13;
      chart.options.scales.y2.display = false;
    } else {
      chart.config.type = 'bar';
      chart.data.datasets = mercatDatasets;
      titol.textContent = pipMercatT(
        'Entrades venudes a Espanya i evolució de la població (1965–2025)',
        'Entradas vendidas en España y evolución de la población (1965–2025)'
      );
      peu.textContent = pipMercatT(
        'Entrades venudes (barres) i població (línia) a Espanya, 1965–2025.',
        'Entradas vendidas (barras) y población (línea) en España, 1965–2025.'
      );
      chart.options.scales.y.min = 0;
      chart.options.scales.y.max = 420;
      chart.options.scales.y2.display = true;
    }

    buttons.forEach(btn => {
      const active = btn.dataset.view === view;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    chart.update();
  };

  buttons.forEach(btn => btn.addEventListener('click', () => setView(btn.dataset.view)));
}

window.PiP_graficMercat = construirGraficMercat;

// Si la pàgina s'obre directament a #mercat, mostraSeccio() s'executa abans
// que aquest fitxer s'hagi carregat. En aquest cas inicialitzem el gràfic aquí.
(function inicialitzaMercatSiJaEsVisible() {
  const arrenca = () => {
    const seccio = document.getElementById('seccio-mercat');
    const cont = document.getElementById('seccio-mercat-grafic');
    if (!seccio || !cont || cont.dataset.pipMercatInit === '1') return;

    const esMercat = window.location.hash === '#mercat' ||
      window.getComputedStyle(seccio).display !== 'none';

    if (esMercat) {
      cont.dataset.pipMercatInit = '1';
      construirGraficMercat();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', arrenca, { once: true });
  } else {
    setTimeout(arrenca, 0);
  }
})();
