/* Públic i Prestigi — Indicador de scroll lateral (fade dret) */

window.PiP_aplicaFade = function(arrel) {
  if (window.innerWidth > 768) return;
  const base = arrel || document;

  // Taules JS estàtiques: embolcallem la taula amb un div que fa el scroll
  // (igual que .taula-scroll-wrap per a les Markdown)
  const selectorsDirectes = [
    '.taula-films', '.taula-ranking', '.taula-festivals', '.taula-decades-resum'
  ];

  selectorsDirectes.forEach(sel => {
    base.querySelectorAll(sel).forEach(taula => {
      // Evitar doble embolcall
      if (taula.parentNode.classList.contains('taula-scroll-wrap')) return;

      const wrap = document.createElement('div');
      wrap.className = 'taula-scroll-wrap';
      taula.parentNode.insertBefore(wrap, taula);
      wrap.appendChild(taula);
    });
  });

  // Ara apliquem fade a TOTS els .taula-scroll-wrap (Markdown + JS estàtiques)
  base.querySelectorAll('.taula-scroll-wrap').forEach(el => {
    if (el.classList.contains('scroll-fade-wrap')) return;
    // Forçar reflow per obtenir scrollWidth real
    void el.offsetWidth;
    if (el.scrollWidth > el.clientWidth + 4) {
      el.classList.add('scroll-fade-wrap');
      el.addEventListener('scroll', function() {
        el.classList.toggle('scrolled-end',
          el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
      }, { passive: true });
    }
  });

  // Gràfics amb scroll propi (no taules)
  ['.grafic-mercat-wrap', '.grafic-wrap', '#grafic-decades'].forEach(sel => {
    base.querySelectorAll(sel).forEach(el => {
      if (el.classList.contains('scroll-fade-wrap')) return;
      void el.offsetWidth;
      if (el.scrollWidth > el.clientWidth + 4) {
        el.classList.add('scroll-fade-wrap');
        el.addEventListener('scroll', function() {
          el.classList.toggle('scrolled-end',
            el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
        }, { passive: true });
      }
    });
  });
};
