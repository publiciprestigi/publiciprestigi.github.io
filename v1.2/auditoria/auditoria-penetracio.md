# Auditoria de penetració demogràfica — v1.2 (27-10-2026)

**Estat: DIAGNÒSTIC / NO APLICAT A LA WEB.** Aquest informe acompanya el [CSV individual dels 210 films](auditoria-penetracio-1964-2025.csv), la [sèrie anual de mercat](mercat-1965-2025.csv) i el [diagnòstic de l'IIC](auditoria-iic.md). La revisió no ha canviat `data/market.json`, `data/films.json`, HTML, JS, rànquings ni notes.

## Mètode verificat

- La penetració de cada film representa `100 × espectadors acumulats / població de referència de l'any del film` (en **punts percentuals**). Els espectadors acumulats **no** representen persones úniques.
- El camp `poblacio_M` de `data/market.json` està arrodonit per a gairebé tots els anys, de manera que **no pot garantir per si sol** la reproducció de penetracions expressades amb dues xifres decimals.
- A més d'aquesta diferència de precisió, les penetracions del JSON han estat calculades en diverses etapes i alguns films d'un mateix any impliquen poblacions diferents. La població **inferida** retrospectivament dels seus valors és una eina diagnòstica, **no una nova font estadística**.
- Comparació dels **210 registres**: 208 tenen any disponible en `market.json` (els altres dos són els Top 100 oficials de 1964, que no es redaten). **138** tenen una diferència superior a **0,01 punts percentuals** i **36** superior a **0,05** respecte del càlcul directe amb `poblacio_M`.

## Criteri demogràfic a adoptar abans de recalcular

**Proposta:** una única sèrie anual de **població resident a Espanya l'1 de gener**, del **INE**, preferint la revisió oficial consolidada de la sèrie anual comparable. Si hi ha sèries incompatibles (padró municipal, població resident, projeccions, dades provisionals), no combinar-les ni substituir-les a ull. Les poblacions dels anys inicials sense sèrie anual comparable del mateix nivell documental han de portar una marca `estimada` i explicació de mètode (p. ex. interpolació censal documentada); no convertir valors inferits dels films en «població INE».

L'INE especifica que la seva sèrie ECP comparable de població resident té cobertura anual **des de 1971 o 2002**, segons el nivell de detall. Per a 1964–1970 cal establir una base històrica diferent i identificar-la. Font: [INE — ECP, preguntes freqüents](https://www.ine.es/dyngs/INEbase/operacion.htm?c=Estadistica_C&cid=1254736177095&idp=1254735572981&menu=faq).

### Valors oficials ja contrastats a 1 de gener (mostra)

| Any | INE, persones | Estat |
|---|---:|---|
| 2014 | 46.512.199 | INE, sèrie de xifres de població |
| 2020 | 47.318.050 | INE, sèrie ECP |
| 2021 | 47.400.798 | INE, sèrie ECP |
| 2022 | 47.486.727 | INE, sèrie ECP |
| 2023 | 48.085.361 | INE, sèrie ECP |
| 2024 | 48.619.695 | INE, sèrie ECP |
| 2025 | 49.128.297 | INE, Cens anual 2025 |

Fonts: [INE, dades de població a 1 de gener](https://ine.es/htdocs/prensa/ecp_tabla.htm), [INE, sèrie 2014](https://www.ine.es/consul/serie.do?L=0&c=2&d=true&nult=100&s=CP335), [INE, Cens anual 2025](https://www.ine.es/dyngs/Prensa/CensoVariables2025.htm).

**Exemple de 2023:** el valor del JSON de mercat és **48,3M**, les penetracions guardades per als cinc films de context impliquen aproximadament **47,4M**, mentre que la població de referència INE a 1 de gener de 2023 és **48,085361M**. Per exemple, *Campeonex* passa orientativament de **4,12%** a **4,06%** amb el denominador INE. Els valors oficials 2025 emprats recentment a la base sí que estan alineats amb el Cens.

## Efecte sobre la normalització de l'IIC

El coeficient actual `0,683` s'ha documentat a «Fonts i eines» i aproxima el màxim 10 en el rànquing existent. Però si apliquem la població revisada de 2014 (**46.512.199**) i el mercat oficial de 2014 (**87,988991M**), *8 apellidos vascos* obtindria un **IIC de 10,03** mantenint exactament aquest coeficient.

**Això encara no és cap canvi aprovat.** Per conservar rigorosament l'escala 0–10 sense modificar la forma de l'índex, la proposta és determinar el **coeficient de normalització un cop tancades i verificades les sèries anuals de població i de mercat**; si s'aprova la renormalització, s'ha d'especificar el coeficient amb precisió suficient al text i fer servir el mateix valor intern sense arrodonir en tots els càlculs. No «retallar» a 10 les puntuacions a posteriori sense una explicació metodològica.

## Sèrie poblacional completa en contrast, 1964–2025

Ja tenim una **proposta documentada per als 62 anys**, però **no totes les xifres tenen la mateixa naturalesa**:

- **1964–1972 (9 anualitats)** — reconstrucció acadèmica de **Jordi Maluquer de Motes**, «El crecimiento moderno de la población de España de 1850 a 2001: una serie homogénea anual», *Investigaciones de Historia Económica*, vol. 4, núm. 10 (2008), p. 129–162, **quadre 5**, amb població a **1 de gener** per any. És una reconstrucció de balances demogràfics amb metodologia publicada, **no** un recompte directament publicat per l'INE. [Article acadèmic i taula 5](https://www.elsevier.es/es-revista-investigaciones-historia-economica-economic-328-pdf-download-S1698698908701395).
- **1973–2019 (47 anualitats)** — sèrie oficial [INE CP335](https://www.ine.es/consul/serie.do?L=0&c=2&d=true&nult=100&s=CP335), valor del primer semestre / 1 de gener; recompte en persones i estat definitiu en la taula d'origen.
- **2020–2025 (6 anualitats)** — dades INE de població resident a 1 de gener, [sèries ECP / cens anual](https://www.ine.es/dyngs/Prensa/CensoVariables2025.htm), sempre amb data i criteri documentats. Cal mantenir registrada la versió estadística consultada.

Aquest és el contingut de [poblacio-1964-2025.csv](poblacio-1964-2025.csv). **No hi ha cap anualitat buida al fitxer proposat.** Els registres de 1964–1972 estan marcats com a `RECONSTRUCCIO_ACADEMICA_HOMOGENIA`, no com a `DOCUMENTAT_INE`.

Per decidir les primeres nou anualitats hem preservat un [quadre comparatiu de tres fonts](contrast-poblacio-1964-1972.csv): l'estimació acadèmica del **1 de gener** i el **1 de juliol**, el recompte històric de l'INE a 1 de juliol (amb Ceuta i Melilla) i la sèrie de final de desembre publicada per Datosmacro. La reconstrucció acadèmica és **la candidata preferida per a la simulació**, perquè explica el mètode i dona una sèrie homogènia anual. La sèrie de Datosmacro queda com a testimoni d'una altra reconstrucció, no com a font adoptada.

La [simulació actualitzada de mercat, població i IIC](impacte-mercat-poblacio-1964-2025.csv) calcula els **210 films** amb aquests denominadors, sense recórrer a poblacions deduïdes del mateix indicador. És encara una **simulació editorial**, ja que la selecció definitiva de la font acadèmica inicial i el valor del coeficient de normalització s'han de validar abans de publicar.

Amb la fórmula funcional que combina quota i penetració, el coeficient que porta el màxim a 10 és **0,680735622...** en aquesta simulació (màxim obtingut per *8 apellidos vascos*). El valor és independent dels anys 1964–1972 mentre el màxim continuï essent aquest film; **no s'ha incorporat a la web**.

### Frontera estadística entre 1972 i 1973

Cal explicitar que la reconstrucció acadèmica i l'INE CP335 no són la mateixa operació estadística. La primera dona **34.283.489 habitants a 1 de gener de 1972** i **34.656.209 el 1973**; la sèrie INE CP335 que utilitza el projecte dona **34.800.600 a 1 de gener de 1973**. La divergència de 1973 és d'aproximadament **144.391 habitants (0,4%)**, entre dos procediments diferents. La sèrie composta proposada prioritza l'INE directe des de 1973. Documentar aquest enllaç evita presentar el conjunt com si hagués estat produït per una única institució i amb una metodologia invariable.

## Document històric localitzat per als anys 60

S'ha localitzat també una **taula primària del mateix INE, a l'Anuario Estadístico de 1982**, que publica població de dret **a 1 de juliol** per als anys 1963–1972, amb files separades per la Península i les illes, Ceuta i Melilla ([INE, taula 1.1.8, pàgina 64](https://www.ine.es/inebaseweb/pdfDispacher.do?td=132783)). Conté, per exemple, un total de **31.953.793** per a 1965 a la fila principal (sense Ceuta i Melilla), al qual caldria sumar les ciutats i resoldre l'ajust de data si volem obtenir un **1 de gener**. **No és equivalent directament al denominador anual adoptat per a la resta de la sèrie**. És una **comprovació oficial independent** de la reconstrucció acadèmica proposada per a 1964–1972, no el mateix còmput de població a 1 de gener. El [quadre de control amb la suma de Ceuta i Melilla](control-ine-poblacio-juliol-1963-1972.csv) en conserva les dades originals.

## Pendents, sense tocar producció

1. Aprovar, si escau, la **reconstrucció històrica acadèmica per a 1964–1972** i la utilització de l'INE CP335 / ECP per al període 1973–2025, amb el tall de sèrie expressament documentat.
2. Escollir la normalització de l'IIC i la precisió de publicació, evitant el truncament arbitrari de valors majors de 10.
3. Revisar la [simulació conjunta dels 210 films](impacte-mercat-poblacio-1964-2025.csv) i el rànquing abans / després abans de modificar les dades actives.
4. Actualitzar conjuntament `market.json`, `films.json`, JS, HTML, textos i notes únicament quan s'aprovi la simulació i s'hagin auditat totes les dependències.
