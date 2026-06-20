/* Públic i Prestigi — Indicador de scroll lateral (fade dret) */

function _aplicaFadeAElement(el) {
  if (el.classList.contains('scroll-fade-wrap')) return;
  if (el.scrollWidth > el.clientWidth + 4) {
    el.classList.add('scroll-fade-wrap');
    el.addEventListener('scroll', function() {
      el.classList.toggle('scrolled-end',
        el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
    }, { passive: true });
  }
}

window.PiP_aplicaFade = function(arrel) {
  if (window.innerWidth > 768) return;
  const base = arrel || document;

  // 1. Embolcallar taules JS estàtiques que encara no tenen wrapper
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

  // 2. Aplicar fade a tots els wrappers i gràfics — intent immediat
  base.querySelectorAll('.taula-scroll-wrap').forEach(_aplicaFadeAElement);
  ['.grafic-mercat-wrap', '.grafic-wrap', '#grafic-decades'].forEach(sel => {
    base.querySelectorAll(sel).forEach(_aplicaFadeAElement);
  });

  // 3. Segon intent a 300ms per als casos on el layout no estava llest
  setTimeout(function() {
    base.querySelectorAll('.taula-scroll-wrap').forEach(_aplicaFadeAElement);
    ['.grafic-mercat-wrap', '.grafic-wrap', '#grafic-decades'].forEach(sel => {
      base.querySelectorAll(sel).forEach(_aplicaFadeAElement);
    });
  }, 300);
};
