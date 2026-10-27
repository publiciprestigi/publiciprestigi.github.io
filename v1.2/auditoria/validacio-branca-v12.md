# Acta de comprovació — branca de proves v1.2

**Data:** 27-10-2026  
**Branca:** `v12-revisio-mercat-poblacio-iic`  
**Base:** `main`  
**Estat:** proves numèriques superades, **pendent d'execució del validador local, revisió visual i aprovació**. Aquesta branca no s'ha fusionat; la web de producció no s'ha modificat.

## Objectiu

Harmonitzar la sèrie espanyola del mercat, la població, quota, penetració i IIC de *Públic i Prestigi* 1965–2025, mantenint el corpus oficial, les xifres acumulades dels films, les dues excepcions ICAA de 1964, les fonts del prestigi, el CNC francès i l'IAA.

## Comparació amb main

El GitHub registra **24 fitxers canviats** entre `main` i la branca a l'hora d'aquesta acta.

- `v1.2/auditoria/poblacio-1964-2025.csv` — modified (124 línies)
- `v1.2/data/films.json` — modified (2020 línies)
- `v1.2/data/market.json` — modified (427 línies)
- `v1.2/js/mercat.js` — modified (6 línies)
- `v1.2/js/part-iii.js` — modified (118 línies)
- `v1.2/notes.html` — modified (10 línies)
- `v1.2/part-iii.html` — modified (6 línies)
- `v1.2/scripts/validar-metrics.mjs` — added (109 línies)
- `v1.2/textos/introduccions-parts.md` — modified (2 línies)
- `v1.2/textos/part-i/decada-2000s.md` — modified (2 línies)
- `v1.2/textos/part-i/decada-2010s.md` — modified (2 línies)
- `v1.2/textos/part-i/decada-2020s.md` — modified (2 línies)
- `v1.2/textos/part-i/decada-70s.md` — modified (2 línies)
- `v1.2/textos/part-i/decada-80s.md` — modified (2 línies)
- `v1.2/textos/part-i/decada-90s.md` — modified (2 línies)
- `v1.2/textos/part-i/decades-intro.md` — modified (2 línies)
- `v1.2/textos/part-i/fonts-i-eines.md` — modified (16 línies)
- `v1.2/textos/part-i/mercat-poblacio.md` — modified (2 línies)
- `v1.2/textos/part-i/ranking-iic.md` — modified (8 línies)
- `v1.2/textos/part-i/ranking-penetracio.md` — modified (2 línies)
- `v1.2/textos/part-i/ranking-quota.md` — modified (8 línies)
- `v1.2/textos/part-iii/caza-alcarras.md` — modified (2 línies)
- `v1.2/textos/part-iii/conclusions.md` — modified (2 línies)
- `v1.2/textos/part-iii/lleis.md` — modified (2 línies)

## Comprovacions de dades executades en la revisió

| Control | Resultat |
| --- | --- |
| Registres anuals de `data/market.json` | **61/61** (1965–2025), sense buits |
| Poblacions documentades a l'auditoria | **62/62** (1964–2025), amb font i categoria |
| Corpus de `data/films.json` | **210/210** |
| Films `in_top100` | **100/100**, sense canviar els espectadors ni els anys |
| Registres de context | **110/110** |
| Les dues excepcions ICAA datades el 1964 | **Conservades** amb mercat estimat propi de 400M |
| Quotes, penetracions i IIC recalculats | **210/210 reproduïbles**, segons els denominadors i l'arrodoniment establerts |
| Màxim normalitzat de l'IIC | **10,00** (*8 apellidos vascos*), coeficient derivat ≈ **0,6807356220097183** |
| Entrades fixades a `js/part-iii.js` | **49/49** comprovades (alguns films consten més d'una vegada) |
| Sèries espanyoles incrustades al `part-iii.html` | **61/61** valors de `esMarket`, `espEntrades` i `espPoblacio` coherents |
| Sèries franceses del `part-iii.html` | **Sense canvis** (`frMarket`, `fraEntrades`, `fraPoblacio`) |
| `js/mercat.js` | Eliminades les etiquetes fixes «~390M» i «50M (2020)»; les dades s'utilitzen per construir-les |
| Arxiu d'auditoria de població | **62 files, 9 columnes**, reparat a la branca per eliminar camps mal separats |

Amb el criteri estable dels valors **publicats a dos decimals**, la simulació de canvi de posicions del Top 100 és de **73** en quota, **60** en penetració i **84** en IIC, comptant els desplaçaments indirectes.

## Documentació editorial

A la branca s'han preparat, entre d'altres, **«Fonts i eines»**, introduccions, dècades, comentaris dels tres rànquings, comparativa *La caza* / *Alcarràs*, conclusions i notes **[1], [2], [3], [4], [31]**. Només s'han corregit xifres i explicacions que en depenen directament, sense alterar els criteris de festivals ni el corpus.

La **quota comparativa** de l'estudi és espectadors acumulats / mercat anual de referència; no es presenta com la quota oficial de taquilla del mateix exercici.

## Revisions encara necessàries abans de publicar

1. **Executar el validador** `node v1.2/scripts/validar-metrics.mjs` des d'una còpia local de la branca. L'script és de lectura i retorna error en qualsevol incoherència; les comprovacions equivalents s'han fet durant aquesta revisió, però **no s'ha executat encara l'script com a procés Node**.
2. Fer una **inspecció visual en navegador**, tant en ordinador com en mòbil, dels gràfics i rànquings de Part I i de les comparatives de Part III. Especial atenció a solapaments d'etiquetes, amplada, llegendes, tooltips i canvis d'escala de les barres.
3. Revisar editorialment les substitucions del català i les notes metodològiques, incloent la diferència entre fonts oficials, reconstruccions acadèmiques i estimacions sectorials.
4. **Versió castellana:** els documents i pàgines de `v1.2/es/` encara no s'han harmonitzat en aquesta branca; evitar que es publiquin amb les xifres antigues i els mateixos gràfics actualitzats. Aquest és un **bloqueig de publicació**, no una tasca completada.
5. Confirmar en el gràfic de Buñuel que les sèries espanyoles actualitzades no han canviat les franceses, el text d'interpretació ni els criteris de quotes nacionals del 2025.
6. Comprovar els texts editorials de la Part III que citen penetracions de pel·lícules del corpus de prestigi no incloses als 210 films, quan depenguin de la població revisada.
7. Fer la comprovació final dels valors mostrats als selectors de la gràfica comparativa de quatre mètriques i dels possibles empats, amb el mateix ordre del JSON.
8. Només amb els punts anteriors resolts, plantejar la fusió de la branca. **No fusionar automàticament**.

## Punt documental posterior a la publicació

La dada de mercat de **1965 ≈435,2M** de MEDIA Salles està adoptada com a estimació sectorial documentada. La consulta al volum original de 1968 de la Filmoteca de Catalunya es farà **després** de publicar la v1.2, tal com s'ha acordat. No canviar la categoria de la dada ni atribuir-la directament a l'ICAA sense aquesta verificació.

## Referències de la mateixa auditoria

- [Sèrie de mercat](mercat-1965-2025.csv)
- [Sèrie de població](poblacio-1964-2025.csv)
- [Informe de l'IIC](auditoria-iic.md)
- [Càlcul i rànquings abans/després](rankings-abans-despres-1964-2025.csv)
- [Inventari detallat de canvis](inventari-canvis-per-fitxer.md)
- [Pauta de normalització](proposta-calcul-normalitzacio-iic.md)
