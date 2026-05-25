/* Públic i Prestigi — Taula resum per dècades
 * Calcula i renderitza la taula de resum a #taula-decades-resum
 * a partir de data/films.json
 */

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
  const total  = top100.length; // 100

  // Agrupa per dècada
  const grups = {};
  ordre.forEach(d => { grups[d] = []; });
  top100.forEach(f => { if (grups[f.decada]) grups[f.decada].push(f); });

  const fmt  = n => n == null ? '—' : n.toLocaleString('ca-ES');
  const fmtP = (n, e) => n == null ? '—' : n.toFixed(2) + '%' + (e ? '≈' : '');
  const fmtM = (n, e) => n == null ? '—' : n.toFixed(0) + 'M' + (e ? '≈' : '');
  const fmtI = n => n == null ? '—' : n.toFixed(2);

  const files = ordre.map(decada => {
    const fs = grups[decada];
    if (!fs.length) return '';

    const pct = Math.round(fs.length / total * 100);

    // Líder: film amb més espectadors
    const lider = fs.reduce((a, b) => b.espectadors > a.espectadors ? b : a);

    // Mercat mitjà de la dècada (dels films del grup)
    const mercatMitja = fs.reduce((s, f) => s + (f.mercat_M || 0), 0) / fs.length;
    const mercatEst   = fs.some(f => f.mercat_estimat);

    // IIC líder
    const iicLider = lider.iic;

    // Color per dècada (discret, sobre el text de la cel·la dècada)
    const colorsDec = {
      '60s': '#5a7fa8', '70s': '#6a8fa8', '80s': '#7a8fa0',
      '90s': '#6a8f8a', '2000s': '#7a8f7a', '2010s': '#8a7a6a', '2020s': '#8a6a5a'
    };
    const color = colorsDec[decada] || '#555';

    return `<tr>
      <td class="col-decada" style="color:${color};font-weight:600">${etiquetes[decada]}</td>
      <td class="col-center">${fs.length}</td>
      <td class="col-center">${pct}%</td>
      <td class="col-titol-lider"><em>${lider.titol}</em></td>
      <td class="col-subtil">${lider.director}</td>
      <td class="col-num">${fmt(lider.espectadors)}</td>
      <td class="col-num col-gris">${fmtM(mercatMitja, mercatEst)}</td>
      <td class="col-num col-gris">${fmtP(lider.penetracio, lider.penetracio_estimat)}</td>
      <td class="col-num col-gris">${fmtP(lider.quota, lider.quota_estimat)}</td>
      <td class="col-num col-iic">${fmtI(iicLider)}</td>
    </tr>`;
  }).join('');

  cont.innerHTML = `
    <table class="taula-films taula-decades-resum">
      <thead>
        <tr>
          <th>Dècada</th>
          <th class="col-center">Films</th>
          <th class="col-center">%</th>
          <th>Líder de la dècada</th>
          <th class="col-subtil">Director</th>
          <th class="col-num">Espectadors</th>
          <th class="col-num col-gris">Mercat mitjà</th>
          <th class="col-num col-gris">Penetr.</th>
          <th class="col-num col-gris">Quota</th>
          <th class="col-num">IIC líder</th>
        </tr>
      </thead>
      <tbody>${files}</tbody>
    </table>`;
}

document.addEventListener('DOMContentLoaded', construirResumDecades);
