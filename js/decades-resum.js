/* Públic i Prestigi — Taula resum per dècades + gràfic de distribució */

const COLORS_DECADES = {
  '60s':   { fons: '#ede0c4', text: '#6b5230' },
  '70s':   { fons: '#e0d4a8', text: '#5a4a20' },
  '80s':   { fons: '#ccd8b4', text: '#3a5030' },
  '90s':   { fons: '#b4d0c8', text: '#2a5048' },
  '2000s': { fons: '#a0c0d4', text: '#1a4060' },
  '2010s': { fons: '#88aac8', text: '#1a3858' },
  '2020s': { fons: '#7098b8', text: '#0a2848' },
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
    '60s': 'Anys 1965–1969', '70s': 'Anys 70', '80s': 'Anys 80',
    '90s': 'Anys 90', '2000s': 'Anys 2000–2009',
    '2010s': 'Anys 2010–2019', '2020s': 'Anys 2020–2025'
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

    return `<tr style="background:${col.fons}">
      <td style="color:${col.text};font-weight:600">${etiquetes[decada]}</td>
      <td class="col-titol"><strong><em>${lider.titol}</em></strong></td>
      <td class="col-subtil">${lider.director}</td>
      <td class="col-num">${fmt(lider.espectadors)}</td>
      <td class="col-num col-gris">${fmtM(mercatMitja, mercatEst)}</td>
      <td class="col-num col-gris">${fmtP(lider.penetracio, lider.penetracio_estimat)}</td>
      <td class="col-num col-iic">${fmtI(lider.iic)}</td>
    </tr>`;
  }).join('');

  // Taula
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
          <th class="col-num">IIC</th>
        </tr>
      </thead>
      <tbody>${files}</tbody>
    </table>`;

  // Text intermedi (bloc del .md)
  const divIntermedi = document.querySelector('#seccio-decades .text-md-intermedi');
  if (divIntermedi && window.PiP_textos) {
    window.PiP_textos.renderitza(divIntermedi);
  }

  // Gràfic de distribució
  construirGraficDecades(grups, ordre, etiquetes, total);
}

function construirGraficDecades(grups, ordre, etiquetes, total) {
  const cont = document.getElementById('grafic-decades');
  if (!cont) return;

  const noms   = ordre.map(d => etiquetes[d]);
  const counts = ordre.map(d => grups[d].length);
  const pcts   = ordre.map(d => Math.round(grups[d].length / total * 100));
  const colors = ordre.map(d => COLORS_DECADES[d]?.fons || '#ccc');
  const textColors = ordre.map(d => COLORS_DECADES[d]?.text || '#333');

  cont.innerHTML = '<canvas id="grafic-decades-canvas"></canvas>';
  const ctx = document.getElementById('grafic-decades-canvas').getContext('2d');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: noms,
      datasets: [{
        data: counts,
        backgroundColor: colors,
        borderColor: textColors.map(c => c + '88'),
        borderWidth: 1,
      }]
    },
    options: {
      animation: false,
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2.8,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.parsed.y} pel·lícules (${pcts[ctx.dataIndex]}% del Top 100)`
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
          ctx.fillStyle = textColors[i];
          ctx.font = 'bold 11px -apple-system, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`${val} (${pcts[i]}%)`, xPos, yPos - 6);
        });
        ctx.restore();
      }
    }]
  });
}

window.PiP_resümDecades = construirResumDecades;
document.addEventListener('DOMContentLoaded', construirResumDecades);
