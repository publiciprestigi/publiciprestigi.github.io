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
