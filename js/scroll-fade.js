// Afegeix classe .scroll-fade-wrap als contenidors scrollables
// i elimina el fade quan l'usuari arriba al final
(function() {
  if (window.innerWidth > 768) return;

  const selectors = [
    '.taula-films', '.taula-ranking', '.taula-festivals',
    '.taula-decades-resum', '.grafic-mercat-wrap', '.grafic-wrap',
    '#grafic-decades'
  ];

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      // Només si el contingut és més ample que el contenidor
      if (el.scrollWidth > el.clientWidth + 4) {
        el.classList.add('scroll-fade-wrap');
        el.addEventListener('scroll', function() {
          const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
          el.classList.toggle('scrolled-end', atEnd);
        }, { passive: true });
      }
    });
  });
})();
