# Inventari editorial i tècnic de canvis abans d'implantar l'històric — Públic i Prestigi v1.2

**ESTAT: PLA DE CANVIS, NO EXECUTAT A LA WEB.** Revisió del 27-10-2026. Basat en els fitxers **actuals** de `main/v1.2/`, no en la v1.1 publicada. Respectar totes les decisions editorials establertes que no depenguin de les dades auditades.

**Font de comparació per film:** [rankings-abans-despres-1964-2025.csv](rankings-abans-despres-1964-2025.csv), **210 films i 100 Top 100**; [49 ocurrències de valors fixos a la Part III](impacte-taules-fixes-part-iii.csv). La [normalització i els empats](proposta-calcul-normalitzacio-iic.md) són una **proposta que cal aprovar abans de publicar**.

## 0. Criteris transversals — límits dels canvis

- Conservar **l'ordre oficial i la pertinença al Top 100** (incloses les dues pel·lícules datades el **1964** a l'Anuari ICAA 2023); no modificar cap espectador acumulat ni canviar el corpus per un càlcul de mercat.
- **Mercat 1965 ≈435,2M** amb font sectorial MEDIA Salles; població 1964–1972 prové de reconstrucció acadèmica; a partir de 1973 prové de l'INE. Marcar les aproximacions correctament.
- Penetració: nombre d'**entrades acumulades per cada 100 habitants**, no percentatge de persones diferents.
- «Quota de mercat»: **índex propi amb espectadors acumulats / volum anual del mercat de referència**. No descriure-la literalment com el percentatge real de les entrades *venudes en aquell mateix any* a una pel·lícula; els dos períodes poden no coincidir. Aquest aclariment és essencial a «Fonts i eines» i, per remissió, a les notes.
- Proposta d'IIC: `k × √(quota × penetració)`, amb `k` derivat de l'ancoratge de *8 apellidos vascos* (aproximadament **0,680735622**). Calcular abans d'arrodonir, **guardar dos decimals**, ordenar les puntuacions guardades amb empat estable de l'ordre original del corpus.
- El corpus de prestigi, els espectadors absoluts, els criteris de festivals i les IAA **no canvien perquè es revisin els denominadors del mercat**. No alterar les visuals ni l'estil de gràfics sense necessitat.
- **No modificar expressions, puntuació o estructura dels textos no afectats per un fet nou verificat.**

## 1. Fitxers de dades — canvis imprescindibles, coordinats

| Fitxer | Operació pendent |
| --- | --- |
| `v1.2/data/market.json` | Actualitzar la sèrie 1965–2025 d'entrades anuals segons [auditoria 61 anys](mercat-1965-2025.csv) i la de població amb [62 anys](poblacio-1964-2025.csv). **No forçar decimals inexistents a 2022–2025.** 1965 resta estimat; 1966–2025 es tracten segons la procedència documentada. |
| `v1.2/data/films.json` | Recalcular **quota, penetració i IIC per als 210 registres**, usant els mateixos denominadors anuals; actualitzar `mercat_M`, `mercat_estimat`, `quota_estimat` i `penetracio_estimat` segons el grau de font. L'any i públic dels dos films ICAA de 1964 no es modifiquen, ni es substitueix el seu mercat estimat de 400M pel de 1965. |
| `v1.2/auditoria/` | Conservar la taula d'entrada, les fonts, la comparativa i l'explicació de l'IIC com a acta permanent dels canvis. |

**Valor de control de l'actualització:** 61 totals anuals de mercat, 62 poblacions de 1964–2025, 210 públics acumulats intactes, 100 films Top 100 exactes, i totes les fórmules reproduïbles.

## 2. Part I — textos amb canvis quantificables

| Fitxer i ubicació | Estat actual / valor afectat | Proposta de canvi **encara no executada** |
| --- | --- | --- |
| `textos/introduccions-parts.md`, preguntes Part I | «390 milions de 1965 als 65 milions de 2025» | **≈435,2M → 66,9M**, adaptant només aquesta pregunta. |
| `textos/part-i/fonts-i-eines.md`, paràgraf comparatiu | *La ciudad no es para mí*, **370M / 1,16%**, i *Mujeres…*, **85M / 3,94%** | **403,1M / 1,07%** i **87,6M / 3,82%**. Revisar el matís «gairebé quadruplica» en coherència amb el nou quocient. |
| `textos/part-i/fonts-i-eines.md`, quatre mètriques | Fórmula `0,683`, explicació de quota com si fos taquilla del mateix any | Proposar normalització **0,680735622...**, amb la definició precisa d'indicador propi basat en públic acumulat. Afegir fonts i les dues excepcions ICAA del 1964, sense alterar el Top 100. |
| `textos/part-i/fonts-i-eines.md`, exemples de context històric | «Als 60s … 10 o 12 vegades l'any» | Per 1965 la sèrie proposada dona **≈13,59 entrades/habitant**; 1969 **≈10,90**. Revisar rang 1965–1969 d'acord amb la nova nota [2]. |
| `textos/part-i/mercat-poblacio.md`, introducció | **390M → 65M; −83%; població 32,1M → 49,13M** | **≈435,2M → 66,9M; ≈−84,6%; població 32,013M → 49,128M** (≈+53,5%). Revisar l'exemple «dos milions» i els percentatges relatius. |
| `textos/part-i/decades-intro.md` | «Les 100 pel·lícules entre 1965 i 2025» i columna amb mitjanes de dècada | Respectar les dues inclusions de 1964 del corpus oficial; adequar el redactat metodològic sense canviar període nominal. Verificar la mitjana del mercat obtinguda programàticament. |
| `textos/part-i/decada-60s.md` | «prop de 400M» i exemples IIC | Mitjana nova **≈394,5M (1965–1969)**: el redactat general continua sent adequat; verificar exemples, **no reescriure innecessàriament**. |
| `textos/part-i/decada-70s.md` | «el mercat cau de 305 a 195 milions» | **≈331M (1970) → ≈200M (1979)**. |
| `textos/part-i/decada-80s.md` | *Mujeres…* IIC **3,98** | **3,91**. |
| `textos/part-i/decada-90s.md` | «entre 80 i 110 milions» | Rang de la dècada **≈84,9M–131,3M**. Evitar una falsa estabilitat. |
| `textos/part-i/decada-2000s.md` | *Los otros*, IIC **5,66**, «tercer valor més alt» | IIC **5,65**, **quart** valor del Top 100 (ja era quart abans). L'escala màxima de 147M (2001) i final de 110M (2009) continuen vàlides. |
| `textos/part-i/decada-2010s.md` | «mercat relativament estable entre 101 i 105 milions» | Rang real **≈78,7M–104,9M** durant la dècada; la frase necessita matís. Conserva el lideratge d'*8 apellidos vascos* (IIC 10). |
| `textos/part-i/decada-2020s.md` | 2020 **50M**, 2025 **65M**, IIC *Padre… 3* **3,07** | **27,0M**, **66,9M**, IIC **3,35**. |
| `textos/part-i/ranking-quota.md` | *Lo imposible* **6,52%**, *Ocho apellidos catalanes* **5,99%** | **6,51%** i **5,92%**; el primer lloc d'*8 apellidos vascos* **10,68%** no canvia. |
| `textos/part-i/ranking-quota.md` | *Mujeres…* quota **#6**; *Padre… 3* **#8**, *Padre… 5* **#15** | **#7**, **#5**, **#16**, respectivament; *Padre… 4* continua **#17**. |
| `textos/part-i/ranking-iic.md`, bloc de quatre exemples | *La ciudad…* quota #45 / IIC #24 | **Quota #48 / IIC #26**, quota **1,07%**, mercat **403,1M**; penetració continua **#4**. |
| Mateix fitxer, *Los santos inocentes* | Mercat **115M**, quota #36, IIC #47 | **121,6M**, quota #36, IIC #47: **les posicions no canvien**, només el context numèric i el valor de la quota. |
| Mateix fitxer, *Mujeres…* | Mercat 85M, quota 3,94%/#6, IIC #9 | **87,6M**, **3,82%/#7**, IIC **3,91/#9**. |
| Mateix fitxer, *Padre… 3* | Mercat 71M, quota 3,67%/#8, penetració #89, IIC #18 | **59,1M**, **4,41%/#5**, penetració **#90**, IIC **3,35/#11**. |
| `textos/part-i/ranking-penetracio.md` | Posicions de penetració citades en paràgrafs | Revalidar-les amb el CSV final i **conservar les que es mantinguin**, sense modificar les xifres d'espectadors. |
| `textos/part-i/ranking-directors.md`, `ranking-espectadors.md` | Referències qualitatives al mercat | **Comprovació, no reescriptura automàtica**; el rànquing de públic absolut no canvia. |

## 3. Part II — revisar metodologia, preservar corpus

- `textos/part-ii/dades-i-criteri.md`: assegurar la coherència documental amb les noves definicions, **sense canviar els criteris de festivals, Oscar o EFA**. No hem localitzat una necessitat de recàlcul de prestigi derivada del mercat.
- Taules de festivals i acadèmies: els **espectadors acumulats** continuen sent els del corpus; no recalcular dades de públic francès o de festivals per una revisió del mercat espanyol.
- Les traduccions de `v1.2/es/` no s'han de barrejar a mig procés amb el català: després de validar la v1.2 catalana, actualitzar-ne **totes les xifres i les formulacions metodològiques** en la versió castellana.

## 4. Part III — afectacions essencials

| Fitxer / ubicació | Intervenció proposada |
| --- | --- |
| `textos/part-iii/caza-alcarras.md` | *La caza* 1966, mercat **370 → 403,1M**, quota **0,09 → 0,08%**, IIC **0,21 → 0,20**. *Alcarràs* 2022, mercat **71 → 59,1M**, quota **0,57 → 0,68%**, IIC **0,47 → 0,52**. No canviar-ne espectadors ni IAA. |
| `js/part-iii.js`, comparativa `construirCazaAlcarras()` | Les dues entrades anteriors hi estan també **escrites directament al JS** i s'han de sincronitzar. |
| `js/part-iii.js`, trajectòries de directors | **49 ocurrències** amb camps `mercat`, `quota`, `iic` fixos, corresponents també a films del corpus de prestigi. S'han recalculat individualment al [fitxer de 49 casos](impacte-taules-fixes-part-iii.csv); alguns títols es repeteixen. Cal substituir-les de forma controlada o centralitzar el càlcul, sense modificar els espectadors acumulats. **No es resolen actualitzant només els 210 registres de `films.json`.** |
| `js/part-iii.js`, `novaFilaEFA()` | Hi ha un càlcul propi `Math.sqrt(penetracio*quota/2.15)` que s'aproxima al coeficient antic 0,683. Substituir-lo pel procediment únic d'IIC i els denominadors nous. Preservar l'IAA de cada film. |
| `textos/part-iii/bretxa.md` i gràfic JS | La **ràtio de bretxa** construïda amb mitjanes d'entrades dels films **no canvia per revisar mercat i població**. Només s'actualitza la sèrie de mitjana anual del mercat amb què es compara gràficament i les frases que hi depenguin. |
| `textos/part-iii/bunuel-mercat.md` | Recalcular els comentaris de **mercat i entrades per habitant a Espanya**. Per al 1965, **≈13,59 entrades/habitant**; la frase «superava les dotze» continua sent vàlida. Respectar els públics per film de Buñuel i la sèrie oficial **francesa del CNC**, que no depèn de la revisió espanyola. |
| `v1.2/part-iii.html` | Substituir o centralitzar les **dues representacions directes del mercat espanyol**: `esMarket` i `espEntrades`, i la matriu `espPoblacio`. Verificar les 61 anualitats, els gràfics Espanya–França, les freqüències anuals i els tooltips. **No alterar `frMarket`, `fraEntrades` ni INSEE sense una auditoria francesa independent.** |
| `textos/part-iii/conclusions.md` | «390M de 1965 a 65M de 2025» → **≈435,2M a 66,9M**, caiguda aproximada del **84,6%**. Revalidar només els arguments que depenen d'aquest canvi; conservar les ràtios de bretxa que depenen de públic absolut. |
| `textos/part-iii/lleis.md` | Exemple de 2011–2013, actualment «~100M a ~70M»: verificar i precisar **98,3M → 78,7M** sense atribuir causalitat exclusiva a l'IVA. |
| `textos/part-iii/dues-generacions.md` | Verificar els percentatges de penetració de Saura i la generació actual contra la sèrie única; si una pel·lícula no és a `films.json`, obtenir-ne les entrades del corpus de prestigi, no substituir-les per xifres no documentades. |
| `textos/part-iii/autor-industrial.md`, `doble-corona.md`, `mapa-canon.md` | **Control de coherència, no canvi generalitzat** si només parlen de públic absolut, IAA, prestigi o context qualitatiu. |

## 5. Notes i portada

| Referència | Necessitat |
| --- | --- |
| `notes.html` **[1]** | Distingir els registres d'espectadors per film del mercat total anual, i documentar **les dues excepcions de 1964 de l'Anuari ICAA 2023**, sense presumir-ne errors. |
| `notes.html` **[2]** | Substituir rang antic **310–390M / 9,4–12,2** de 1965–1969 pel rang reconstruït **364,6–435,2M / ≈10,90–13,59** i **2025 65M / 1,32** per **66,9M / ≈1,36**. Especificar font sectorial de mercat 1965 i reconstrucció acadèmica de població inicial. |
| `notes.html` **[3]** | Substituir la descripció genèrica de fonts mixtes i estimacions poc delimitades per la jerarquia aprovada: butlletins retrospectius ICAA + excepció 1965 + estadística definitiva 2025 + font INE/Maluquer per població. No presentar Comscore provisional com la font definitiva del 2025. |
| `notes.html` **[4]** | Actualitzar el 2025 a **66,9M** i, si es conserva la recaptació, **≈460,3M €** de la publicació oficial definitiva; retirar l'atribució errònia a l'avanç provisional de **65M / 453M €** i recalcular la variació 2024–2025 segons el mateix origen. Verificar enllaç de la publicació oficial. |
| `notes.html` **[31]** | Afegir la precisió de procedència de les sèries espanyoles i preservar els criteris del CNC/INSEE francesos. |
| `index.html`, `part-i.html`, `part-ii.html`, `part-iii.html` | Comprovar fragments de text incrustat, capçaleres, gràfics i càrrega de MD; **no substituir indiscriminadament números**. |
| `es/` | Una vegada estabilitzats els textos catalans, revisar xifres ja traduïdes i completar les traduccions que falten. |

## 6. Dependències tècniques a verificar

- `js/mercat.js` llegeix `market.json`: verificar els dos gràfics mercat/població i dades per habitant amb la mateixa font, sense canvis de disseny.
- `js/decades-resum.js` construeix la taula de mercat mitjà per dècada a partir de dades combinades; la nova mitjana **1965–1969 ≈394,5M**, 1970s **≈260,0M**, 1990s **≈101,0M**, 2020–2025 **≈57,4M**. **Cal revisar exactament el subconjunt d'anys de cada dècada que tria el codi** abans de validar les etiquetes.
- `js/part-i.js` ordena camps numèrics de `films.json`. Després del canvi de JSON, els rànquings s'actualitzen, però les explicacions MD no: **cal revisar-les conjuntament**.
- `js/part-iii.js` barreja dades carregades, valors fixos i càlculs parcials; aquí es concentra el risc més gran de divergències internes.
- `part-iii.html` conté dades anuals escrites com a objectes i arrays. És imprescindible sincronitzar-les o centralitzar-les, mantenint la comparació amb França i els gràfics funcionals.
- Els colors, dimensions, llegendes i interaccions de les visualitzacions **no són objecte d'aquesta operació**, excepte un error demostrable causat pels valors nous.

## 7. Validació final abans de fer canvis

1. Aprovar [la fórmula, el coeficient i els desempats](proposta-calcul-normalitzacio-iic.md) i el corpus de fonts.
2. Generar els fitxers candidats en **una branca GitHub o còpia de treball separada**. No modificar directament la web pública activa durant la fase de comprovació.
3. Validar el CSV de 210 films, les 49 ocurrències manuals de JS, les sèries anuals incrustades als HTML i els textos citats.
4. Fer una comparació `abans → després` de les seccions afectades; revisar visualment tots els gràfics modificats.
5. Amb el conjunt aprovat, aplicar els canvis de manera coordinada i deixar-ne una acta de verificació al GitHub.

**No s'ha canviat cap fitxer de producció en l'elaboració d'aquest inventari.**
