# Mapa d'impacte de la nova sèrie de mercat — v1.2

**Estat: simulació, pendent de revisió editorial i metodològica. No aplicar automàticament.** Revisió del 27-10-2026. S'utilitza la sèrie de [mercat-1965-2025.csv](mercat-1965-2025.csv), i ara també [poblacio-1964-2025.csv](poblacio-1964-2025.csv) (reconstrucció acadèmica 1964–1972 i INE 1973–2025) per a la [simulació demogràfica conjunta](impacte-mercat-poblacio-1964-2025.csv); i s'han inspeccionat les dependències actuals del repositori. L'objectiu és evitar canvis fragmentaris o xifres incoherents. Les dades actives i la web no han estat modificades.

**Llista de control per a l'aplicació:** [inventari complet de canvis per fitxer](inventari-canvis-per-fitxer.md), amb els valors actuals i proposats. **No executar sense revisar aquest inventari.**

## Què calcula la simulació

- **210 registres** a `data/films.json`, dels quals **100 Top 100** i **110 films de context**. Es preserven els seus espectadors acumulats i la pertinença al corpus; la **penetració es recalcula en una simulació separada** a partir dels denominadors demogràfics documentats.
- Nova **quota de referència** = 100 × espectadors acumulats del film / total d'entrades venudes a Espanya durant l'any associat al film. **No equival a la quota anual oficial de distribució** de la pel·lícula.
- **48 films Top 100** (i **48 registres totals**) tenen un IIC guardat que divergeix en ≥0,05 punts del càlcul `0,683 × √(quota guardada × penetració guardada)`; cap dels 110 films de context no presenta una divergència d'aquesta magnitud. **Els 48 casos ja constaven amb els mateixos valors al `v1/data/films.json` anterior.** La reconstrucció inversa dels denominadors apunta a antics valors de mercat, especialment uns 400M per a 24 films de 1966–1969, però no identifica amb certesa el càlcul d'origen. Vegeu l'[auditoria detallada de l'IIC](auditoria-iic.md). El nou mercat, per si sol, no resol aquesta inconsistència anterior.
- Per desambiguar, el CSV mostra **dues simulacions separades**: `IIC_només_canvi_mercat` (IIC guardat multiplicat per √[mercat anterior/mercat nou]) i `IIC_formula_mercat_nou` (recalculat des de la fórmula publicada). **Cap d'elles no és encara un IIC aprovat.**
- **Simulació antiga només de mercat (orientativa):** 75/100 posicions de quota, 84/100 d'IIC amb fórmula vigent a mercat nou, o 80/100 si s'escala l'IIC guardat; aquestes xifres provenen de calcular/ordenar **sense haver harmonitzat la població** i no són el recompte per implantar. **Simulació conjunta que reprodueix els valors guardats a dos decimals i l'empat estable de la web:** **73/100** posicions de quota, **60/100** de penetració i **84/100** d'IIC. El recompte de referència és el de [rankings-abans-despres-1964-2025.csv](rankings-abans-despres-1964-2025.csv), amb les [regles de càlcul i normalització proposades](proposta-calcul-normalitzacio-iic.md). Aquests canvis inclouen desplaçaments indirectes.
- **Decisió editorial fixa — dues inclusions de 1964:** `Búsqueme a esa chica` i `Tulipán negro` consten al **Top 100 de l'Anuari oficial ICAA 2023**, corpus adoptat per l'estudi. **No se n'altera la inclusió, el 1964, la classificació ni els espectadors acumulats**, ni es pressuposa un error de l'ICAA. Són una excepció documentada al període principal 1965–2025. El denominador de **400M estimat del 1964** és una qüestió separada: es manté sense canvis mentre no se'n validi l'origen; no se li aplica automàticament la xifra acordada per al 1965. Vegeu també `criteri-mercat.md`.
- Hi ha **4 pel·lícules de 2019** (`Padre no hay más que uno`, `Si yo fuera rico`, `Mientras dure la guerra`, `Lo dejo cuando quiera`) que actualment tenen un mercat **105M** a `films.json`, mentre `market.json` dona **105,5M**. La nova sèrie resol aquesta duplicitat quan s'apliqui.

## Cadena de dependències abans de publicar

| Bloc | Fitxers / ubicacions | Canvis previstos |
| --- | --- | --- |
| Font anual | `data/market.json` | Adoptar els 61 valors, marcar 1965 com a estimació documentada, preservar unitats i precisió |
| Base de títols | `data/films.json` | Revisar mercat associat, quota i IIC; conservar els dos films de 1964 amb any i inclusió ICAA inalterats; no tocar espectadors acumulats |
| Part I — gràfics | `js/mercat.js`, `js/decades-resum.js`, `js/part-i.js` | Dades per habitant, resum, rànquings i gràfic de comparació de les quatre mètriques |
| Part I — introduccions i context | `textos/introduccions-parts.md`, `textos/part-i/fonts-i-eines.md`, `mercat-poblacio.md`, `decades-intro.md`, `decada-60s.md` … `decada-2020s.md` | Canviar només les quantificacions i afirmacions que quedin invalidades, incloses les dades de 2020 i 2025 |
| Part I — rànquings narrats | `textos/part-i/ranking-quota.md`, `ranking-iic.md` | Percentatges, exemples, ordenacions i «Com varien els rànquings i què aporta l'IIC» |
| Part II | `textos/part-ii/dades-i-criteri.md`, `js/part-ii.js` | Verificar criteris; el corpus de festivals, Oscar i EFA no depèn directament del mercat |
| Part III — comparatives | `js/part-iii.js`, `part-iii.html` | Actualitzar llistes codificades d'any/mercat, quota i IIC; centralitzar quan sigui factible sense canviar la visualització |
| Part III — textos | `textos/part-iii/caza-alcarras.md`, `bretxa.md`, `bunuel-mercat.md`, `conclusions.md` | Validar totes les xifres i comentaris de mercat; no modificar la ràtio de bretxa si només depèn d'espectadors absoluts |
| Notes | `notes.html` — especialment [2], [3], [4] i [31] | Reescriure les fonts i les magnituds verificades; [1] conserva la distinció entre dades per títol i totals anuals |
| Control de publicació | `index.html`, `part-i.html`, `part-ii.html`, `part-iii.html` i equivalents `es/` | Detectar valors escrits directament als HTML, comprovar scripts, gràfics, notes, codi compartit i futures traduccions |

## Mostra orientativa de conseqüències (subjecta a criteri definitiu de l'IIC)

- *Mi canción es para ti* (1965): quota 1.03% → **0.93%**, IIC guardat 2.58 → **2.34** amb la fórmula publicada (provisional).
- *La ciudad no es para mí* (1966): quota 1.16% → **1.07%**, IIC guardat 2.69 → **2.58** amb la fórmula publicada (provisional).
- *Mujeres al borde de un ataque de nervios* (1988): quota 3.94% → **3.82%**, IIC guardat 3.98 → **3.92** amb la fórmula publicada (provisional).
- *Todo sobre mi madre* (1999): quota 2.36% → **1.97%**, IIC guardat 2.67 → **2.44** amb la fórmula publicada (provisional).
- *Padre no hay más que uno 3* (2022): quota 3.67% → **4.41%**, IIC guardat 3.07 → **3.37** amb la fórmula publicada (provisional).
- *Padre no hay más que uno 5* (2025): quota 3.14% → **3.05%**, IIC guardat 2.47 → **2.43** amb la fórmula publicada (provisional).

## Quantificació de l'efecte demogràfic sobre les notes i les conclusions

Amb la sèrie candidata documentada, el **1965** tindria ≈435,2M d'entrades i **32.013.271** habitants (reconstrucció acadèmica): **≈13,59 entrades per habitant**. El 1969, 364.640.582 entrades / 33.453.732 habitants: **≈10,90**. El **2025**, 66,9M / 49.128.297 habitants: **≈1,36**. Són quocients d'entrades/persones residents, **no persones diferents que hagin anat al cinema**. Per a 2020: 27.000.821 / 47.318.050 = **≈0,57**.

Caldrà revisar en conseqüència els percentatges i rangs actuals a `notes.html` (especialment nota **[2]**, on encara figura 1965–1969 de 310–390M i 2025 de 65M / 1,32), l'exemple de `textos/part-i/fonts-i-eines.md` i la conclusió del mercat 1965–2025. Les xifres **són una simulació**, no textos nous ja aplicats.

La sèrie de [població documentada](poblacio-1964-2025.csv) inclou **9 anys inicials reconstruïts acadèmicament** (1964–1972) i 53 anys de publicació INE (1973–2025); el [quadre de comparació de fonts](contrast-poblacio-1964-1972.csv) conserva les alternatives i el contrast [INE de juliol](control-ine-poblacio-juliol-1963-1972.csv). La [simulació conjunta](impacte-mercat-poblacio-1964-2025.csv) és l'escenari de referència actual per revisar els impactes.

## Ordre d'implantació, quan s'aprovi

1. Aprovar la reconstrucció acadèmica 1964–1972 (amb contrast INE a 1 de juliol), la sèrie INE 1973–2025 i acordar la fórmula operativa exacta de l'IIC (incloent arrodoniments i normalització) i la justificació documental del denominador estimat de 400M del 1964, sense alterar el corpus ICAA.
2. Aplicar conjuntament les dues bases `market.json` i `films.json`, amb comprovació de consistència en els 210 registres. Conservar els valors anteriors als commits de GitHub.
3. Actualitzar les dades repetides a `js/part-iii.js`, `part-iii.html` i la resta de JS/HTML, procurant una sola font de mercat.
4. Revisar **llavors** els fragments editorials i les notes, sense reobrir decisions estilístiques no afectades.
5. Verificar de forma programàtica que totes les magnituds i posicions concorden, i visualment que gràfics i tooltips no han canviat de forma inesperada. Només després abordar el castellà.

**No es modifica cap pàgina ni cap indicador de producció en aquesta fase.**
