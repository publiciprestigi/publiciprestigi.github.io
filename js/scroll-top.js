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

    const sidebar = document.querySelector('.contingut-sidebar');

    function onScroll() {
      const pos = sidebar ? sidebar.scrollTop : window.scrollY;
      btn.classList.toggle('visible', pos > 300);
    }

    if (sidebar) {
      sidebar.addEventListener('scroll', onScroll, { passive: true });
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    btn.addEventListener('click', () => {
      if (sidebar) sidebar.scrollTo({ top: 0, behavior: 'smooth' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
