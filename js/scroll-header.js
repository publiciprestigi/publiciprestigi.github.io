/* Públic i Prestigi — Amaga capçalera i nav en scroll avall, mostra en scroll amunt */
(function() {
  var lastY = 0;
  var ticking = false;
  var cap = document.querySelector('.capcalera');
  var nav = document.querySelector('.navegacio');

  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        var y = window.scrollY;
        if (y < 80) {
          if (cap) cap.classList.remove('capcalera--hidden');
          if (nav) nav.classList.remove('navegacio--hidden');
        } else if (y > lastY) {
          if (cap) cap.classList.add('capcalera--hidden');
          if (nav) nav.classList.add('navegacio--hidden');
        } else {
          if (cap) cap.classList.remove('capcalera--hidden');
          if (nav) nav.classList.remove('navegacio--hidden');
        }
        lastY = y;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();
