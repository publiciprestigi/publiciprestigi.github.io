# Inventari de dades de la v1.2

Aquest document descriu quins fitxers es carreguen efectivament a la web v1.2, segons la revisió dels HTML i JavaScript del 27-10-2026. **«En ús» no implica que les dades numèriques ja estiguin auditades.** La sèrie del mercat i els indicadors que en depenen continuen pendents de verificació amb l'ICAA.

## Fitxers carregats per la web

- `films.json` — pel·lícules, Top 100, films de context i mètriques; utilitzat a les Parts I i III, al resum per dècades i al cercador.
- `market.json` — sèrie anual de mercat i població; utilitzat pels gràfics de mercat i per la Part III. **Pendent d'auditoria quantitativa.**
- `festivals.json` — seleccions, premis i espectadors dels festivals; utilitzat a la Part II, la Part III, el panorama i el cercador.
- `fora-competicio.json` — seccions fora de competició i paral·leles; utilitzat a la Part II.
- `oscar.json` — corpus dels Oscar; utilitzat a les Parts II i III i al panorama.
- `efa.json` — corpus dels EFA; utilitzat a les Parts II i III i al panorama.
- `metadata.json` — dades de versió; carregat per diverses pàgines.

## Fitxers de dades que la v1.2 no carrega directament

Aquests quatre fitxers **no apareixen com a dependències dels HTML o scripts de la v1.2 actuals**. Es conserven temporalment com a material històric o de contrast; **no s'han de tractar com a font vigent** ni fer-los servir per construir la traducció castellana.

- `breach.json` — resum de la bretxa per dècades d'una fase anterior; el capítol actual calcula els seus resultats a JavaScript.
- `decades.json` — resum de dècades amb xifres i indicadors precomputats; les taules i el resum actuals parteixen de `films.json`.
- `directors.json` — agregacions històriques de directors; els rànquings actuals es construeixen amb altres dades.
- `notes.json` — recull antic amb 23 notes i traduccions; **no és la font dels tooltips**. Les notes vigents es troben a `../notes.html` (32 notes), amb l'equivalent castellà a `../es/notes.html`.

## On es construeixen els gràfics

La distribució habitual és HTML per al contenidor i els controls, JavaScript per al dibuix i els càlculs, JSON per a les dades, i Markdown (`../textos/`) per als comentaris editorials.

No tots els gràfics segueixen aquesta separació. A `../part-iii.html` hi ha **scripts incrustats** que creen gràfics i contenen algunes sèries de dades dins l'HTML, especialment en les comparacions de mercats i en els apartats de Buñuel. No són fitxers JSON. Quan es revisin les dades del mercat i es prepari la versió castellana, caldrà tenir-los presents per evitar divergències. Cap gràfic s'ha reestructurat en aquesta neteja.

## Precaució

No suprimir ni modificar dades històriques sense comprovar-ne les dependències i preservar-ne la traçabilitat. Aquest inventari només ordena les fonts i identifica fitxers no utilitzats; no modifica els càlculs ni el corpus de l'estudi.
