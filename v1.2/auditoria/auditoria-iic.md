# Auditoria de coherència de l'IIC (v1.2)

**Estat: DIAGNÒSTIC DOCUMENTAT, NO APLICAT A LA WEB.** Revisió iniciada el 27-10-2026. No modifica `data/films.json`, cap rànquing ni cap gràfic. Consultar també la [simulació individual de 210 films](impacte-mercat-1965-2025.csv), que conté els dos possibles càlculs del nou IIC.

## Definició vigent

La fórmula publicada a `textos/part-i/fonts-i-eines.md` és:

`IIC = 0,683 × √(quota_pct × penetració_pct)`

Les magnituds `quota` i `penetracio` del JSON s'expressen com a **punts percentuals** (p. ex. 2,01 i 6,76); no cal dividir-les de nou per 100 dins la fórmula. `iic` es presenta habitualment amb dos decimals. El coeficient 0,683 manté el màxim entorn de 10 en la configuració actual del rànquing. **No s'ha aprovat cap fórmula alternativa.**

## Resultat de la revisió

- `data/films.json` conté **210 films**, **100** del Top 100 i **110** de context.
- **48 dels 100** tenen un IIC guardat que es desvia en almenys **0,05 punts** de `0,683 × √(quota guardada × penetració guardada)`; **0 dels 110** films de context tenen una desviació d'aquesta magnitud.
- **Els 48 casos es troben idèntics en el `v1/data/films.json` anterior**, amb les mateixes `quota`, `penetracio` i `iic`; ja existien abans de les revisions de la v1.2. La primera càrrega de `v1.2/data/films.json` del 23-09-2026 també els conservava.
- Repartiment de discrepàncies entre els 100: 1964–1969: **26**; 1970s: **14**; 1980s: **1**; 1990s: **0**; 2000s: **6**; 2010s: **1**; 2020s: **0**.

## Indicis de càlculs heretats de mercats anteriors

Per investigar l'origen, podem obtenir un **denominador implícit orientatiu** a partir de l'IIC guardat i de la penetració actual: `mercat_implicit_M = 100 × espectadors × 0,683² × penetració_pct / (IIC_guardat² × 1.000.000)`. És una inferència inversa, **no una dada històrica real ni una font oficial**. Arrodoniments previs i altres correccions poden afectar-la.

| Film | Any | Mercat a `films.json` | Mercat implícit aprox. | IIC guardat | IIC segons fórmula + camps actuals |
| --- | ---: | ---: | ---: | ---: | ---: |
| *Juicio de faldas* | 1969 | 310M | 394,6M | 2,09 | 2,36 |
| *La residencia* | 1969 | 310M | 399,3M | 1,74 | 1,97 |
| *Relaciones casi públicas* | 1968 | 330M | 399,3M | 1,71 | 1,88 |
| *El otro lado de la cama* | 2002 | 140,7M | 182,5M | 2,21 | 2,52 |
| *Celda 211* | 2009 | 110M | 157,1M | 1,70 | 2,03 |
| *Mi canción es para ti* | 1965 | 390M | 358,9M | 2,58 | 2,47 |

Els **24 casos discrepants de 1966–1969** tenen tots un mercat implícit entre **394,6M i 410,9M** (mitjana 402,9M), compatible amb una antiga estimació uniforme d'aproximadament 400M. Altres pel·lícules apunten a mercats implícits diferents. **És evidència forta d'actualitzacions parcials en el passat, però no una prova de quin fitxer o càlcul original els va generar.**

## Proposta metodològica per a l'aplicació (pendent de validació)

1. Preservar **el corpus oficial**, els espectadors acumulats, el criteri d'any i les penetracions existents; les dues excepcions de l'ICAA datades el **1964** continuen al Top 100 i mantenen, de moment, el denominador estimat propi de 400M.
2. Establir **una fórmula única**, la publicada a «Fonts i eines». Un cop aprovada la sèrie anual del mercat, recalcular **totes les quotes** a partir dels espectadors acumulats / mercat de referència de cada any i **tots els IIC** amb la mateixa fórmula. Mostrar dos decimals, calculant a màxima precisió disponible abans d'arrodonir.
3. Comprovar els percentatges de penetració ja guardats i decidir si se'n manté la precisió de dos decimals o es recalculeu a partir de poblacions originals amb traçabilitat. **No canviar els denominadors de població automàticament.**
4. Recalcular els rànquings i comparatives **des d'una mateixa font**. No «escalar» els IIC antics: alguns ja són inconsistents amb la fórmula vigent. Documentar totes les posicions i els comentaris afectats abans de tocar els fitxers actius.
5. Validar sense canviar cap xifra absoluta d'espectadors i detectar automàticament qualsevol fila que no compleixi la fórmula a la tolerància d'arrodoniment aprovada. Conservar com a referència el CSV amb l'«abans i després».

**Decisió pendent:** confirmar el recàlcul homogeni de quota i penetració a partir de fonts anuals, i fixar la normalització del màxim 10. La [sèrie poblacional en contrast](poblacio-1964-2025.csv), la [verificació de penetració](auditoria-penetracio.md) i la [simulació conjunta](impacte-mercat-poblacio-1964-2025.csv) documenten aquest problema abans d'aplicar res. El diagnòstic està justificat; **el desplegament no s'ha autoritzat ni executat**.
