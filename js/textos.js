/* Públic i Prestigi — Carregador de textos editorials des de Markdown */

(function() {
  'use strict';

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
    // Extreu el text entre <!-- nomBloc --> i <!-- /nomBloc --> del Markdown brut
    const re = new RegExp(
      '<!--\\s*' + nomBloc + '\\s*-->[\\r\\n]?([\\s\\S]*?)[\\r\\n]?<!--\\s*\\/' + nomBloc + '\\s*-->',
      'i'
    );
    const m = md.match(re);
    if (!m) {
      console.warn('Bloc "' + nomBloc + '" no trobat al fitxer');
      return '';
    }
    return m[1].trim();
  }

  async function renderitza(div) {
    const ruta = 'textos/' + div.dataset.text + '.md';
    const bloc = div.dataset.bloc || null;

    const md = await carregaFitxer(ruta);
    if (md == null) {
      div.innerHTML = '<p class="text-md-error">[Text no disponible]</p>';
      return;
    }

    // IMPORTANT: primer extreure el bloc del Markdown brut, després convertir a HTML
    const contingut = extreuBloc(md, bloc);

    if (!contingut) {
      div.innerHTML = '';
      return;
    }

    if (typeof marked === 'undefined') {
      console.error('marked.js no s\'ha carregat');
      div.textContent = contingut;
      return;
    }

    // Convertir <sup>[N]</sup> en <sup><a href="notes.html#nN">[N]</a></sup>
    const html = marked.parse(contingut).replace(
      /<sup>\[(\d+)\]<\/sup>/g,
      '<sup><a href="notes.html#n$1">[$1]</a></sup>'
    );
    div.innerHTML = html;
    div.classList.add('text-md-carregat');
  }

  function inicialitza() {
    document.querySelectorAll('.text-md[data-text]').forEach(renderitza);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicialitza);
  } else {
    inicialitza();
  }

  window.PiP_textos = { renderitza, inicialitza };
})();
