/* Públic i Prestigi — Carregador de textos editorials des de Markdown */

(function() {
  'use strict';

  const cache = {};
  const ES = document.documentElement.lang === 'es';

  async function carregaFitxer(ruta) {
    if (cache[ruta]) return cache[ruta];
    try {
      const r = await fetch(ruta);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const text = await r.text();
      cache[ruta] = text;
      return text;
    } catch (e) {
      console.error(ES ? 'No se ha podido cargar' : 'No s\'ha pogut carregar', ruta, e);
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
      console.warn((ES ? 'Bloque' : 'Bloc') + ' "' + nomBloc + '" ' + (ES ? 'no encontrado en el archivo' : 'no trobat al fitxer'));
      return '';
    }
    return m[1].trim();
  }

  async function renderitza(div) {
    const ruta = 'textos/' + div.dataset.text + '.md';
    const bloc = div.dataset.bloc || null;

    const md = await carregaFitxer(ruta);
    if (md == null) {
      div.innerHTML = '<p class="text-md-error">' + (ES ? '[Texto no disponible]' : '[Text no disponible]') + '</p>';
      return;
    }

    // IMPORTANT: primer extreure el bloc del Markdown brut, després convertir a HTML
    const contingut = extreuBloc(md, bloc);

    if (!contingut) {
      div.innerHTML = '';
      return;
    }

    if (typeof marked === 'undefined') {
      console.error(ES ? 'marked.js no se ha cargado' : 'marked.js no s\'ha carregat');
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

    // Embolcalla cada taula amb un div per a scroll lateral independent
    div.querySelectorAll('table').forEach(taula => {
      const wrap = document.createElement('div');
      wrap.className = 'taula-scroll-wrap';
      taula.parentNode.insertBefore(wrap, taula);
      wrap.appendChild(taula);
    });

    // Aplica fade als wraps (mòbil): s'executa just després del render
    if (window.innerWidth <= 768) {
      div.querySelectorAll('.taula-scroll-wrap').forEach(el => {
        if (el.scrollWidth > el.clientWidth + 4) {
          el.classList.add('scroll-fade-wrap');
          el.addEventListener('scroll', function() {
            el.classList.toggle('scrolled-end',
              el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
          }, { passive: true });
        }
      });
    }
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

/* Taules responsives: el contenidor, no la taula, gestiona el scroll. */
(function () {
  const selector = 'table.taula-films, table.taula-ranking, table.taula-festivals, table.taula-decades-resum, .text-md table, .text-md-intermedi table, .pip3-taula-ampla';
  let programat = false;
  function actualitza() {
    programat = false;
    document.querySelectorAll(selector).forEach(table => {
      if (!table.closest('.pip-taula-scroll') && !table.closest('.taula-scroll-wrap')) {
        const contenidor = document.createElement('div');
        contenidor.className = 'pip-taula-scroll';
        table.parentNode.insertBefore(contenidor, table);
        contenidor.appendChild(table);
      }
    });
    document.querySelectorAll('.pip-taula-scroll, .taula-scroll-wrap').forEach(el => {
      const pendent = el.scrollWidth > el.clientWidth + 6 && el.scrollLeft + el.clientWidth < el.scrollWidth - 6;
      el.classList.toggle('pip-scroll-pendent', pendent);
      if (!el.dataset.pipScrollObservat) {
        el.addEventListener('scroll', () => el.classList.toggle('pip-scroll-pendent', el.scrollWidth > el.clientWidth + 6 && el.scrollLeft + el.clientWidth < el.scrollWidth - 6), {passive:true});
        el.dataset.pipScrollObservat = '1';
      }
    });
  }
  function programa(){if(!programat){programat=true;requestAnimationFrame(actualitza)}}
  function inicia(){programa();window.addEventListener('resize',programa,{passive:true});new MutationObserver(programa).observe(document.body,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',inicia);else inicia();
})();
