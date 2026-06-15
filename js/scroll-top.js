/* scroll-top.js — Públic i Prestigi
   Botó discret per tornar a dalt de la pàgina
*/
(function () {
  const btn = document.createElement('button');
  btn.id = 'btn-top';
  btn.setAttribute('aria-label', 'Tornar a dalt');
  btn.textContent = '↑';
  document.body.appendChild(btn);

  function onScroll() {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
