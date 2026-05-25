/* Públic i Prestigi — Carregador de textos editorials des de Markdown
 *
 * Funcionament:
 * Cada contenidor HTML amb la classe "text-md" carrega un fitxer .md
 * de la carpeta /textos/ i el renderitza com a HTML.
 *
 * Atributs:
 *   data-text="part-i/decada-70s"   → carrega /textos/part-i/decada-70s.md
 *   data-bloc="intro"               → opcional: només renderitza el bloc <!-- intro -->
 *                                     Si no s'indica, renderitza tot el fitxer.
 *
 * Blocs dins d'un .md:
 *   <!-- intro -->
 *   Text introductori...
 *   <!-- /intro -->
 *
 *   <!-- comentari -->
 *   Text de comentari...
 *   <!-- /comentari -->
 *
 * Si el .md no té marques de bloc, tot el contingut es considera un bloc únic.
 */

(function() {
  'use strict';

  // Cache: evita descarregar el mateix .md més d'un cop per pàgina
  const cache = {};

  async function carregaFitxer(ruta) {
    if (cache[ruta]) return cache[ruta];
    try {
      const r = await fetch(ruta);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const text = await r.text();
      cache[ruta] = text;
      return text;
    } catch (e) {
      console.error('No s\'ha pogut carregar', ruta, e);
      return null;
    }
  }

  function extreuBloc(md, nomBloc) {
    if (!nomBloc) return md;
    // Cerca <!-- nomBloc --> ... <!-- /nomBloc -->
    const re = new RegExp(
      '<!--\\s*' + nomBloc + '\\s*-->([\\s\\S]*?)<!--\\s*/' + nomBloc + '\\s*-->',
      'i'
    );
    const m = md.match(re);
    return m ? m[1].trim() : '';
  }

  async function renderitza(div) {
    const ruta = 'textos/' + div.dataset.text + '.md';
    const bloc = div.dataset.bloc || null;

    const md = await carregaFitxer(ruta);
    if (md == null) {
      div.innerHTML = '<p class="text-md-error">[Text no disponible]</p>';
      return;
    }

    const contingut = bloc ? extreuBloc(md, bloc) : md;

    if (typeof marked === 'undefined') {
      console.error('marked.js no s\'ha carregat');
      div.textContent = contingut;
      return;
    }

    // Renderitza Markdown a HTML
    div.innerHTML = marked.parse(contingut);
    div.classList.add('text-md-carregat');
  }

  function inicialitza() {
    const divs = document.querySelectorAll('.text-md[data-text]');
    divs.forEach(renderitza);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicialitza);
  } else {
    inicialitza();
  }

  // Exposat per si cal forçar una re-renderització després d'un canvi dinàmic
  window.PiP_textos = { renderitza, inicialitza };
})();
