/* Manté la secció actual (#hash) en canviar entre CA i ES. */
(function () {
  function preparaEnllacIdioma(enllac) {
    if (!enllac || enllac.dataset.pipHashIdioma === '1') return;

    const hrefOriginal = enllac.getAttribute('href');
    if (!hrefOriginal) return;

    const hrefBase = hrefOriginal.split('#')[0];

    function sincronitzaHashIdioma() {
      enllac.setAttribute('href', hrefBase + window.location.hash);
    }

    enllac.dataset.pipHashIdioma = '1';
    sincronitzaHashIdioma();

    enllac.addEventListener('pointerdown', sincronitzaHashIdioma);
    enllac.addEventListener('focus', sincronitzaHashIdioma);
    enllac.addEventListener('mouseenter', sincronitzaHashIdioma);
    window.addEventListener('hashchange', sincronitzaHashIdioma);
  }

  function inicialitzaIdioma() {
    document
      .querySelectorAll('.capcalera-idioma a:not(.actiu)[href]')
      .forEach(preparaEnllacIdioma);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicialitzaIdioma);
  } else {
    inicialitzaIdioma();
  }
})();


/* Menú mòbil v1.2: part actual oberta i capítol actiu identificat. */
(function () {
  function inicialitzaDrawerContextual() {
    const drawer = document.getElementById('drawer');
    if (!drawer) return;

    function sincronitza() {
      const part = ['i', 'ii', 'iii'].find(n => document.body.classList.contains('part-' + n));
      const current = part ? document.getElementById('drawer-part-' + part) : null;
      const sidebarActive = document.querySelector('.sidebar-link.actiu[data-seccio]');
      const activa = document.body.classList.contains('pip-en-portada')
        ? 'portada'
        : (sidebarActive ? sidebarActive.dataset.seccio : decodeURIComponent(location.hash.slice(1)));

      drawer.querySelectorAll('.drawer-seccio[id^="drawer-part-"]').forEach(section => {
        const esActual = section === current;
        section.classList.toggle('part-actual', esActual);
        section.classList.toggle('obert', esActual);
        const button = section.querySelector('.drawer-seccio-toggle');
        if (button) {
          button.setAttribute('aria-expanded', String(esActual));
          button.setAttribute('aria-label', esActual ? 'Plegar' : 'Desplegar');
        }
      });

      drawer.querySelectorAll('.drawer-link').forEach(link => {
        link.classList.remove('actiu');
        link.removeAttribute('aria-current');
      });
      if (current && activa && activa !== 'portada') {
        const activeLink = Array.from(current.querySelectorAll('.drawer-link')).find(link => {
          const onClick = link.getAttribute('onclick') || '';
          const href = link.getAttribute('href') || '';
          return onClick.includes("'" + activa + "'") || href.endsWith('#' + activa);
        });
        if (activeLink) {
          activeLink.classList.add('actiu');
          activeLink.setAttribute('aria-current', 'page');
          activeLink.scrollIntoView({block:'nearest'});
        }
      }
    }

    new MutationObserver(() => {
      if (drawer.classList.contains('obert')) sincronitza();
    }).observe(drawer, {attributes:true, attributeFilter:['class']});

    drawer.querySelectorAll('.drawer-seccio-toggle').forEach(button => {
      button.addEventListener('click', () => {
        const opened = button.closest('.drawer-seccio').classList.contains('obert');
        button.setAttribute('aria-expanded', String(opened));
        button.setAttribute('aria-label', opened ? 'Plegar' : 'Desplegar');
      });
    });

    window.addEventListener('hashchange', () => {
      if (drawer.classList.contains('obert')) sincronitza();
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicialitzaDrawerContextual);
  } else {
    inicialitzaDrawerContextual();
  }
})();
