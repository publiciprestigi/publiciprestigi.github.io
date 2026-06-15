/* scroll-top.js — Públic i Prestigi
   Botó discret per tornar a dalt de la pàgina
*/
(function () {
  const btn = document.createElement('button');
  btn.id = 'btn-top';
  btn.setAttribute('aria-label', 'Tornar a dalt');
  btn.textContent = '↑';
  document.body.appendChild(btn);

  const sidebar = document.querySelector('.contingut-sidebar');
  const scrollTarget = sidebar || window;

  function onScroll() {
    const pos = sidebar ? sidebar.scrollTop : window.scrollY;
    if (pos > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }

  scrollTarget.addEventListener('scroll', onScroll, { passive: true });

  btn.addEventListener('click', () => {
    if (sidebar) {
      sidebar.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
})();
