/* Públic i Prestigi — Indicador de scroll lateral (fade dret) */

window.PiP_aplicaFade = function(arrel) {
  if (window.innerWidth > 768) return;
  const base = arrel || document;

  // Embolcallar taules JS estàtiques que no tenen wrapper
  const selectorsDirectes = [
    '.taula-films', '.taula-ranking', '.taula-festivals', '.taula-decades-resum'
  ];
  selectorsDirectes.forEach(sel => {
    base.querySelectorAll(sel).forEach(taula => {
      if (taula.parentNode.classList.contains('taula-scroll-wrap')) return;
      const wrap = document.createElement('div');
      wrap.className = 'taula-scroll-wrap';
      taula.parentNode.insertBefore(wrap, taula);
      wrap.appendChild(taula);
    });
  });

  // Per a cada wrapper: afegir fade si cal, un cop visible
  function activaFade(el) {
    if (el.classList.contains('scroll-fade-init')) return;
    el.classList.add('scroll-fade-init');

    function comprova() {
      if (el.scrollWidth > el.clientWidth + 4) {
        el.classList.add('scroll-fade-wrap');
        el.addEventListener('scroll', function() {
          el.classList.toggle('scrolled-end',
            el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
        }, { passive: true });
      }
    }

    // Intent immediat (si l'element és visible)
    comprova();

    // Observer: s'activa quan l'element esdevé visible
    if (!el.classList.contains('scroll-fade-wrap')) {
      const obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            comprova();
            if (el.classList.contains('scroll-fade-wrap')) {
              obs.disconnect();
            }
          }
        });
      }, { threshold: 0.01 });
      obs.observe(el);
    }
  }

  base.querySelectorAll('.taula-scroll-wrap').forEach(activaFade);
  ['.grafic-mercat-wrap', '.grafic-wrap', '#grafic-decades'].forEach(sel => {
    base.querySelectorAll(sel).forEach(activaFade);
  });
};
