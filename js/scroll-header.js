/* Públic i Prestigi — Amaga capçalera en scroll avall, mostra en scroll amunt */
(function() {
  var lastY = 0;
  var ticking = false;
  var cap = document.querySelector('.capcalera');
  if (!cap) return;

  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        var y = window.scrollY;
        if (y < 80) {
          // Prop del top: sempre visible
          cap.classList.remove('capcalera--hidden');
        } else if (y > lastY) {
          // Scroll avall: amagar
          cap.classList.add('capcalera--hidden');
        } else {
          // Scroll amunt: mostrar
          cap.classList.remove('capcalera--hidden');
        }
        lastY = y;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();
