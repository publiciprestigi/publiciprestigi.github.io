/* Públic i Prestigi — Indicador de scroll lateral (fade dret) */

// Funció utilitària global: aplica el fade a totes les taules
// scrollables dins un contenidor donat (o document si no s'especifica)
window.PiP_aplicaFade = function(arrel) {
  if (window.innerWidth > 768) return;
  const base = arrel || document;

  // Taules JS estàtiques (amb classe pròpia, scroll directe al contenidor)
  const selectorsDirectes = [
    '.taula-films', '.taula-ranking', '.taula-festivals',
    '.taula-decades-resum', '.grafic-mercat-wrap', '.grafic-wrap',
    '#grafic-decades'
  ];
  selectorsDirectes.forEach(sel => {
    base.querySelectorAll(sel).forEach(el => {
      if (el.classList.contains('scroll-fade-wrap')) return; // ja aplicat
      if (el.scrollWidth > el.clientWidth + 4) {
        el.classList.add('scroll-fade-wrap');
        el.addEventListener('scroll', function() {
          el.classList.toggle('scrolled-end',
            el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
        }, { passive: true });
      }
    });
  });

  // Taules Markdown (embolcallades per textos.js amb .taula-scroll-wrap)
  base.querySelectorAll('.taula-scroll-wrap').forEach(el => {
    if (el.classList.contains('scroll-fade-wrap')) return;
    if (el.scrollWidth > el.clientWidth + 4) {
      el.classList.add('scroll-fade-wrap');
      el.addEventListener('scroll', function() {
        el.classList.toggle('scrolled-end',
          el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
      }, { passive: true });
    }
  });
};
