/* Públic i Prestigi — Gràfic de mercat i població
 * Carrega data/market.json i renderitza el gràfic a #grafic-mercat-canvas
 */

async function construirGraficMercat() {
  const cont = document.getElementById('seccio-mercat-grafic');
  if (!cont) return;

  let dades;
  try {
    const r = await fetch('data/market.json');
    dades = await r.json();
  } catch(e) {
    cont.innerHTML = '<p class="text-md-error">Error carregant les dades del mercat.</p>';
    return;
  }

  const anys      = dades.map(d => d.any);
  const entrades  = dades.map(d => d.entrades_M);
  const poblacio  = dades.map(d => d.poblacio_M);
  const estimats  = dades.map(d => d.estimat);

  // Colors de les barres: vermell per 2020, blau uniforme per a la resta
  const colorsBarres = dades.map(d => {
    if (d.any === 2020) return 'rgba(180, 50, 50, 0.85)';
    return 'rgba(80, 120, 175, 0.85)';
  });

  // Límits de dècades per a les línies verticals
  const decades = [
    { any: 1980, etiqueta: 'Anys 80' },
    { any: 1990, etiqueta: 'Anys 90' },
    { any: 2000, etiqueta: 'Anys 2000' },
    { any: 2010, etiqueta: 'Anys 2010' },
  ];

  cont.innerHTML = `
    <div class="grafic-mercat-wrap">
      <canvas id="grafic-mercat-canvas"></canvas>
      <p class="grafic-peu">
      
        Entrades venudes totals a Espanya (barres blaves) i població (línia taronja).
        La caiguda del mercat és continuada i no s'explica per la població (que creix)
        sinó per la competència d'altres formes d'oci i la multiplicació de pantalles.

      </p>
    </div>`;

  const ctx = document.getElementById('grafic-mercat-canvas').getContext('2d');

  // Plugin per a les línies verticals de dècada i anotacions
  const pluginDecades = {
    id: 'decades',
    afterDraw(chart) {
      const { ctx, scales: { x, y } } = chart;
      ctx.save();

      decades.forEach(({ any, etiqueta }) => {
        const idx = anys.indexOf(any);
        if (idx < 0) return;
        const xPos = x.getPixelForValue(idx);
        const yTop = y.top;
        const yBot = y.bottom;

        // Línia vertical grisa
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(100,100,100,0.25)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 3]);
        ctx.moveTo(xPos, yTop);
        ctx.lineTo(xPos, yBot);
        ctx.stroke();
        ctx.setLineDash([]);

        // Etiqueta de dècada
        ctx.fillStyle = 'rgba(100,100,100,0.6)';
        ctx.font = '11px -apple-system, SF Pro Text, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(etiqueta, xPos + 4, yTop + 14);
      });

      // Anotació màxim
      const idxMax = 0; // 1965
      const xMax = x.getPixelForValue(idxMax);
      const yMax = y.getPixelForValue(entrades[idxMax]);
      ctx.fillStyle = '#363737';
      ctx.font = 'bold 10px -apple-system, SF Pro Text, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Màxim: ~390M', xMax + 6, yMax - 18);
      ctx.font = '10px -apple-system, SF Pro Text, sans-serif';
      ctx.fillText('(~1964–1966)', xMax + 6, yMax - 6);

      // Anotació 2020
      const idx2020 = anys.indexOf(2020);
      const x2020 = x.getPixelForValue(idx2020);
      const y2020 = y.getPixelForValue(entrades[idx2020]);
      ctx.fillStyle = 'rgba(180,50,50,0.9)';
      ctx.font = 'bold 10px -apple-system, SF Pro Text, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('Col·lapse pandèmic', x2020 + 4, y.top + 30);
      ctx.fillText('50M (2020)', x2020 + 4, y.top + 42);

      ctx.restore();
    }
  };

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: anys,
      datasets: [
        {
          label: 'Entrades venudes (M)',
          data: entrades,
          backgroundColor: colorsBarres,
          borderWidth: 0,
          yAxisID: 'y',
          order: 2,
        },
        {
          label: 'Població (M habitants)',
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
        }
      ]
    },
    options: {
      animation: false,
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2.4,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'top',
          align: 'end',
          labels: {
            font: { size: 12, family: '-apple-system, SF Pro Text, sans-serif' },
            color: '#363737',
            boxWidth: 14,
            padding: 16,
          }
        },
        title: {
          display: true,
          text: 'Entrades venudes a Espanya i evolució de la població (1965–2025)',
          color: '#363737',
          font: { size: 13, weight: '600', family: '-apple-system, SF Pro Text, sans-serif' },
          padding: { bottom: 16 },
        },
        tooltip: {
          callbacks: {
            title: ctx => `Any ${ctx[0].label}`,
            label: ctx => {
              const u = ctx.datasetIndex === 0 ? 'M entrades' : 'M habitants';
              const est = ctx.datasetIndex === 0 && estimats[ctx.dataIndex] ? ' (est.)' : '';
              return ` ${ctx.dataset.label.split('(')[0].trim()}: ${ctx.parsed.y.toFixed(1)}${u}${est}`;
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
          title: {
            display: true,
            text: 'Milions d\'entrades venudes',
            color: '#666',
            font: { size: 11 },
          },
          ticks: { color: '#666', font: { size: 11 } },
          grid: { color: 'rgba(0,0,0,0.06)' },
          min: 0,
          max: 420,
        },
        y2: {
          position: 'right',
          title: {
            display: true,
            text: 'Població (milions d\'habitants)',
            color: 'rgba(190, 110, 30, 0.8)',
            font: { size: 11 },
          },
          ticks: { color: 'rgba(190, 110, 30, 0.8)', font: { size: 11 } },
          grid: { display: false },
          min: 0,
          max: 90,
        }
      }
    },
    plugins: [pluginDecades]
  });
}

document.addEventListener('DOMContentLoaded', construirGraficMercat);
