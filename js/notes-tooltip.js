/* notes-tooltip.js — Públic i Prestigi
   Tooltip de notes: hover desktop / clic mòbil
   Carrega el contingut des de notes.html via fetch (una sola vegada)
*/

(function () {
  // ── Ruta relativa a notes.html des de qualsevol pàgina de l'estudi ──
  const NOTES_URL = 'notes.html';
  const OFFSET_PX = 12; // distància entre sup i tooltip

  let notesMap = {};   // { 'n1': '<span...>text html</span>', ... }
  let tooltipEl = null;
  let hideTimer = null;
  let loaded = false;

  // ── Carregar notes.html i extreure contingut de cada .nota ──
  function carregarNotes() {
    return fetch(NOTES_URL)
      .then(r => r.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        doc.querySelectorAll('.nota').forEach(el => {
          const id = el.id; // 'n1', 'n2', ...
          // Eliminar el número [X] del principi (span.nota-num) per no duplicar
          const clon = el.cloneNode(true);
          const num = clon.querySelector('.nota-num');
          if (num) num.remove();
          notesMap[id] = clon.innerHTML.trim();
        });
        loaded = true;
      })
      .catch(() => { loaded = false; });
  }

  // ── Crear element tooltip ──
  function crearTooltip() {
    tooltipEl = document.createElement('div');
    tooltipEl.id = 'nota-tooltip';
    tooltipEl.style.cssText = `
      position: fixed;
      z-index: 9999;
      max-width: 380px;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 6px;
      padding: 12px 16px;
      font-size: 0.82rem;
      line-height: 1.55;
      color: #363737;
      box-shadow: 0 4px 16px rgba(0,0,0,0.10);
      display: none;
      pointer-events: auto;
    `;
    tooltipEl.addEventListener('mouseenter', () => cancelHide());
    tooltipEl.addEventListener('mouseleave', () => programarOcultar());
    document.body.appendChild(tooltipEl);
  }

  // ── Posicionar tooltip prop del sup ──
  function posicionar(supEl) {
    const rect = supEl.getBoundingClientRect();
    const tw = 380;
    let left = rect.left;
    let top = rect.bottom + OFFSET_PX;

    // Evitar que surti per la dreta
    if (left + tw > window.innerWidth - 16) {
      left = window.innerWidth - tw - 16;
    }
    // Evitar que surti per baix: mostrar per sobre
    if (top + 200 > window.innerHeight) {
      top = rect.top - OFFSET_PX - tooltipEl.offsetHeight;
    }

    tooltipEl.style.left = Math.max(8, left) + 'px';
    tooltipEl.style.top = top + 'px';
  }

  function mostrar(supEl, notaId) {
    if (!loaded || !notesMap[notaId]) return;
    cancelHide();
    tooltipEl.innerHTML = notesMap[notaId];
    tooltipEl.style.display = 'block';
    posicionar(supEl);
  }

  function programarOcultar() {
    hideTimer = setTimeout(() => {
      if (tooltipEl) tooltipEl.style.display = 'none';
    }, 200);
  }

  function cancelHide() {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
  }

  // ── Detectar si és tàctil ──
  function esTactil() {
    return window.matchMedia('(hover: none)').matches;
  }

  // ── Inicialitzar listeners sobre tots els sup a[href*="notes.html#n"] ──
  function inicialitzar() {
    crearTooltip();

    document.addEventListener('click', e => {
      const a = e.target.closest('sup a[href*="notes.html#n"]');
      if (!a) {
        // Clic fora: ocultar
        if (tooltipEl) tooltipEl.style.display = 'none';
        return;
      }
      if (esTactil()) {
        // Mòbil: mostrar tooltip i bloquejar navegació
        const notaId = a.getAttribute('href').split('#')[1];
        if (loaded && notesMap[notaId]) {
          e.preventDefault();
          const sup = a.closest('sup');
          if (tooltipEl.style.display === 'block') {
            tooltipEl.style.display = 'none';
          } else {
            mostrar(sup, notaId);
          }
        }
        // Si no carregat, deixar navegar normalment
      }
    });

    document.addEventListener('mouseover', e => {
      if (esTactil()) return;
      const a = e.target.closest('sup a[href*="notes.html#n"]');
      if (!a) return;
      const notaId = a.getAttribute('href').split('#')[1];
      const sup = a.closest('sup');
      mostrar(sup, notaId);
    });

    document.addEventListener('mouseout', e => {
      if (esTactil()) return;
      const a = e.target.closest('sup a[href*="notes.html#n"]');
      if (!a) return;
      programarOcultar();
    });
  }

  // ── Punt d'entrada ──
  carregarNotes().then(() => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', inicialitzar);
    } else {
      inicialitzar();
    }
  });

})();
