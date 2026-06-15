/* scroll-top.js — Públic i Prestigi
   Botó discret per tornar a dalt de la pàgina
*/
(function () {
  function init() {
    const btn = document.createElement('button');
    btn.id = 'btn-top';
    btn.setAttribute('aria-label', 'Tornar a dalt');
    btn.textContent = '↑';
    document.body.appendChild(btn);

    function getScrollTop() {
      return document.documentElement.scrollTop || document.body.scrollTop || 0;
    }

    function onScroll() {
      btn.classList.toggle('visible', getScrollTop() > 300);
    }

    document.addEventListener('scroll', onScroll, { passive: true });

    btn.addEventListener('click', () => {
      document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
      document.body.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
