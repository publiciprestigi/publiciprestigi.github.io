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

## Sèrie poblacional identificada i simulació conjunta

S'ha creat [poblacio-1964-2025.csv](poblacio-1964-2025.csv), amb una fila per any entre **1964 i 2025**. Hi ha **53 anualitats documentades directament a l'INE** (1973–2025), dues anualitats (1971–1972) recuperades d'una font secundària que cita l'INE i pendents de comprovació primària, i **7 anualitats 1964–1970 sense base anual de població resident a 1 de gener encara contrastada**. **No** s'han convertit les poblacions inferides dels films en dades oficials.

La sèrie INE consultada és [CP335 — Total nacional, població, ambdós sexes](https://www.ine.es/consul/serie.do?L=0&c=2&d=true&nult=100&s=CP335) fins al 2019; per als anys 2020–2025 es prioritzen els valors revisats de l'[ECP / Cens anual](https://ine.es/htdocs/prensa/ecp_tabla.htm). El tram 1971–1972 té de moment [referència secundària](https://relojpublico.es/poblacion/evolucion/), i cal confirmar-ne el registre primari.

La [simulació conjunta de mercat, població i IIC](impacte-mercat-poblacio-1964-2025.csv) recull **210 films**. Per als **48 films** associats a anys sense xifra primària INE aprovada o pendent (incloses les dues excepcions 1964), el càlcul utilitza provisionalment la població de `market.json` o, en els dos casos de 1964, la penetració guardada. **No és encara un resultat definitiu.**

La normalització teòrica a màxim 10, si es mantenen aquests denominadors provisionals, demanaria un coeficient intern d'aproximadament **0,680735622** en lloc de 0,683. Aquest número és només **el resultat de la simulació actual**, no un nou coeficient editorial aprovat: pot variar en tancar les anualitats pendents i s'ha de documentar íntegrament el procediment.

## Document històric localitzat per als anys 60

S'ha localitzat també una **taula primària del mateix INE, a l'Anuario Estadístico de 1982**, que publica població de dret **a 1 de juliol** per als anys 1963–1972, amb files separades per la Península i les illes, Ceuta i Melilla ([INE, taula 1.1.8, pàgina 64](https://www.ine.es/inebaseweb/pdfDispacher.do?td=132783)). Conté, per exemple, un total de **31.953.793** per a 1965 a la fila principal (sense Ceuta i Melilla), al qual caldria sumar les ciutats i resoldre l'ajust de data si volem obtenir un **1 de gener**. **No és equivalent directament al denominador anual adoptat per a la resta de la sèrie**. És una font primària útil per construir una estimació documentada de 1964–1970, però encara no s'ha utilitzat per emplenar els anys pendents del CSV ni per canviar les penetracions.

## Pendents, sense tocar producció

1. Confirmar les poblacions 1971–1972 a l'INE i establir una estimació demogràfica justificada per a 1964–1970, incloent l'abast territorial de les fonts històriques.
2. Comprovar l'alineació de sèries estadístiques (INE CP335 retrospectiva / ECP) i declarar l'any de referència de la població a les notes.
3. Recalcular penetracions, quotes, IIC i ordenacions a partir dels dos denominadors, amb precisió completa abans de presentar dues decimals. Fixar el coeficient amb l'escala 0–10 i els desempataments reproduïbles.
4. Validar la simulació amb exemples i les fonts abans de la modificació coordinada de `market.json`, `films.json`, JS, HTML, textos i notes.
