/* Públic i Prestigi — Taula resum per dècades + gràfic de distribució */

const COLORS_DECADES = {
  '60s':   { fons: '#f4f7fa', text: '#4a6070' },
  '70s':   { fons: '#edf2f7', text: '#3a5568' },
  '80s':   { fons: '#e4ecf4', text: '#2a4a60' },
  '90s':   { fons: '#dae6f0', text: '#1a3f58' },
  '2000s': { fons: '#cfe0ec', text: '#1a3850' },
  '2010s': { fons: '#c3d9e8', text: '#0a2f48' },
  '2020s': { fons: '#b6d2e4', text: '#0a2840' },
};



async function construirResumDecades() {
  const cont = document.getElementById('taula-decades-resum');
  if (!cont) return;

  let films;
  try {
    const r = await fetch('data/films.json');
    films = await r.json();
  } catch(e) {
    cont.innerHTML = '<p class="text-md-error">Error carregant les dades.</p>';
    return;
  }

  const ordre = ['60s','70s','80s','90s','2000s','2010s','2020s'];
  const etiquetes = {
    '60s': '60s', '70s': '70s', '80s': '80s',
    '90s': '90s', '2000s': '2000s',
    '2010s': '2010s', '2020s': '2020s'
  };

  const top100 = films.filter(f => f.in_top100);
  const total  = top100.length;

  const grups = {};
  ordre.forEach(d => { grups[d] = []; });
  top100.forEach(f => { if (grups[f.decada]) grups[f.decada].push(f); });

  const fmt  = n => n == null ? '—' : n.toLocaleString('ca-ES');
  const fmtP = (n, e) => n == null ? '—' : n.toFixed(2) + '%' + (e ? '≈' : '');
  const fmtM = (n, e) => n == null ? '—' : Math.round(n) + 'M' + (e ? '≈' : '');
  const fmtI = n => n == null ? '—' : n.toFixed(2);

  const files = ordre.map(decada => {
    const fs = grups[decada];
    if (!fs.length) return '';
    const lider = fs.reduce((a, b) => b.espectadors > a.espectadors ? b : a);
    const mercatMitja = fs.reduce((s, f) => s + (f.mercat_M || 0), 0) / fs.length;
    const mercatEst   = fs.some(f => f.mercat_estimat);
    const col = COLORS_DECADES[decada] || { fons: '#f5f5f5', text: '#333' };

    return `<tr style="background:${col.fons};border-bottom:2px solid #fff">
      <td style="color:${col.text};font-weight:600">${etiquetes[decada]}</td>
      <td class="col-titol"><strong><em>${lider.titol}</em></strong></td>
      <td class="col-subtil">${lider.director}</td>
      <td class="col-num">${fmt(lider.espectadors)}</td>
      <td class="col-num col-gris">${fmtM(mercatMitja, mercatEst)}</td>
      <td class="col-num col-gris">${fmtP(lider.penetracio, lider.penetracio_estimat)}</td>
      <td class="col-num col-iic">${fmtI(lider.iic)}</td>
    </tr>`;
  }).join('');

  cont.innerHTML = `
    <table class="taula-films taula-decades-resum">
      <thead>
        <tr>
          <th>Dècada</th>
          <th>Líder de la dècada</th>
          <th class="col-subtil">Director</th>
          <th class="col-num">Espectadors</th>
          <th class="col-num col-gris">Mercat</th>
          <th class="col-num col-gris">Penetració</th>
          <th class="col-num col-iic">IIC</th>
        </tr>
      </thead>
      <tbody>${files}</tbody>
    </table>`;

  const divIntermedi = document.querySelector('#seccio-decades .text-md-intermedi');
  if (divIntermedi && window.PiP_textos) {
    window.PiP_textos.renderitza(divIntermedi);
  }

  construirGraficDecades(grups, ordre, etiquetes, total);
}

function construirGraficDecades(grups, ordre, etiquetes, total) {
  const cont = document.getElementById('grafic-decades');
  if (!cont) return;

  const noms   = ordre.map(d => etiquetes[d]);
  const counts = ordre.map(d => grups[d].length);
  const pcts   = ordre.map(d => Math.round(grups[d].length / total * 100));
  // Convertir hex a rgba per al hover
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  };
  const colors      = ordre.map(d => COLORS_DECADES[d]?.fons || '#ccc');
  const colorsHover = ordre.map(d => hexToRgba(COLORS_DECADES[d]?.fons || '#cccccc', 0.4));
  const textColors  = ordre.map(d => COLORS_DECADES[d]?.text || '#333');

  cont.innerHTML = `
    <canvas id="grafic-decades-canvas"></canvas>
    <p class="grafic-peu">Nombre de pel·lícules del Top 100 per dècada i percentatge que representen sobre el total de 100 films.</p>`;
  const ctx = document.getElementById('grafic-decades-canvas').getContext('2d');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: noms,
      datasets: [{
        data: counts,
        backgroundColor: colors,
        hoverBackgroundColor: colorsHover,
        borderWidth: 0,
      }]
    },
    options: {
      animation: false,
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2.8,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Distribució del Top 100 per dècada',
          color: '#363737',
          font: { size: 13, weight: '600', family: '-apple-system, SF Pro Text, sans-serif' },
          padding: { bottom: 16 },
        },
        tooltip: {
          enabled: false,
          external: function(context) {
            let tooltipEl = document.getElementById('tooltip-decades');
            if (!tooltipEl) {
              tooltipEl = document.createElement('div');
              tooltipEl.id = 'tooltip-decades';
              tooltipEl.style.cssText = `
                position: absolute; background: rgba(255,255,255,0.97);
                border: 1px solid #e5e5e5; border-radius: 4px;
                padding: 10px 14px; font-size: 0.82rem; pointer-events: none;
                font-family: -apple-system, sans-serif; color: #363737;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1); z-index: 100;
                line-height: 1.6; min-width: 200px;
              `;
              document.body.appendChild(tooltipEl);
            }
            const { tooltip } = context;
            if (tooltip.opacity === 0) {
              tooltipEl.style.opacity = '0';
              return;
            }
            const i = tooltip.dataPoints[0].dataIndex;
            const d = grups[ordre[i]];
            const lider = d.reduce((a, b) => b.espectadors > a.espectadors ? b : a);
            tooltipEl.innerHTML = `
              <div style="font-weight:600;margin-bottom:4px">${etiquetes[ordre[i]]}</div>
              <div>${pcts[i]}% del Top 100 · ${counts[i]} films</div>
              <div style="margin-top:6px;font-size:0.78rem;color:#555">
                Líder: <em><strong>${lider.titol}</strong></em> (${lider.any})
              </div>`;
            const pos = context.chart.canvas.getBoundingClientRect();
            tooltipEl.style.opacity = '1';
            tooltipEl.style.left = pos.left + window.scrollX + tooltip.caretX + 12 + 'px';
            tooltipEl.style.top = pos.top + window.scrollY + tooltip.caretY - 20 + 'px';
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#555', font: { size: 12 } }
        },
        y: {
          title: {
            display: true,
            text: 'Nombre de pel·lícules al Top 100',
            color: '#666',
            font: { size: 11 }
          },
          ticks: {
            stepSize: 5,
            color: '#666',
            font: { size: 11 }
          },
          grid: { color: 'rgba(0,0,0,0.06)' },
          min: 0,
          max: 50,
        }
      }
    },
    plugins: [{
      id: 'pct-labels',
      afterDatasetsDraw(chart) {
        const { ctx, scales: { x, y } } = chart;
        ctx.save();
        counts.forEach((val, i) => {
          const xPos = x.getPixelForValue(i);
          const yPos = y.getPixelForValue(val);
          ctx.fillStyle = COLORS_DECADES[ordre[i]]?.text || '#333';
          ctx.textAlign = 'center';
          ctx.font = 'bold 12px -apple-system, sans-serif';
          ctx.fillText(`${val} films`, xPos, yPos - 18);
          ctx.font = '11px -apple-system, sans-serif';
          ctx.fillText(`${pcts[i]}%`, xPos, yPos - 5);
        });
        ctx.restore();
      }
    }]
  });
}

window.PiP_resümDecades = construirResumDecades;
document.addEventListener('DOMContentLoaded', construirResumDecades);
