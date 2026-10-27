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

## Pendents, sense tocar producció

1. Recuperar i contrastar la **sèrie INE anual completa de població resident** (1971–2025) i diferenciar els anys previs (1964–1970) com a estimacions documentades, preservant les dues excepcions oficials de 1964.
2. Fixar l'any de referència i la precisió, generant `poblacio-historica.csv` amb font per anualitat. La sèrie ECP actual té revisions respecte d'altres estadístiques antigues: cal seleccionar una sola versió coherent.
3. Simular penetració i IIC amb **els dos denominadors harmonitzats** i, després, decidir el coeficient normalitzador abans de recalcular rànquings.
4. Actualitzar conjuntament `market.json`, `films.json`, JS, HTML, textos i notes només quan la simulació final estigui validada.
