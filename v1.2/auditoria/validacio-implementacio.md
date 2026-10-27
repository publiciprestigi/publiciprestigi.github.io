# Validació d'implantació — auditoria de mercat, població i IIC

**Branca:** `auditoria-mercat-iic-2026` · **Base original:** `c1ee48fdc803431636ffca62342eadc5584ee070` · **Data:** 27-10-2026

## Estat

**FASE 1 — DADES PREPARADES; APLICACIÓ PARCIAL, NO PUBLICABLE.** Els fitxers `data/market.json`, `data/films.json` i `data/population.json` s'han generat a la branca de proves des dels CSV de l'auditoria. Encara no s'han sincronitzat els valors del JS/HTML, les notes ni els textos; no fusionar amb `main` fins acabar-ho.

## Procediment reproduïble

- Mercat: `mercat-1965-2025.csv`, 61 anys; els recomptes en unitats prevalen sobre la columna expressada en milions. Les xifres publicades únicament amb precisió de 0,1M es conserven amb aquesta precisió. 1965 = 435,2M, estimació documentada MEDIA Salles.
- Població: `poblacio-1964-2025.csv`, 62 anys, sempre en persones; reconstrucció acadèmica 1964–1972 i INE des de 1973. `population.json` conserva la sèrie completa, inclòs 1964, i `market.json` ofereix els camps de compatibilitat del període 1965–2025.
- Excepcions: dos films oficials de 1964, mercat separat de 400M estimats; no es canvien títols, anys, públics acumulats, Top 100 o ordre dels registres.
- Quota = `100 × espectadors / mercat_any_en_unitats`. Penetració = `100 × espectadors / poblacio_any_en_persones`.
- IIC = `k × sqrt(quota_sense_arrodonir × penetracio_sense_arrodonir)`; `k = 10 / sqrt(quota_8_apellidos_vascos × penetracio_8_apellidos_vascos)` = **0.6807356220097183**.
- Guardar els tres indicadors amb `Number(valor.toFixed(2))`; ordenar amb valors publicats a dos decimals i empat estable segons ordre original del corpus.
- `mercat_estimat` i `quota_estimat` només per a 1964–1965; `penetracio_estimat` per a 1964–1972. El camp `estimat` de `market.json` s'aplica només a 1965.

## Proves executades abans del commit

| Control | Resultat |
| --- | ---: |
| Files de mercat | 61/61 |
| Files de població | 62/62 |
| Films totals | 210/210 |
| Top 100 | 100/100 |
| Context | 110/110 |
| Coincidència de quota, penetració i IIC amb el CSV de simulació | 630/630 |
| Coincidència de posicions antigues i noves amb el CSV de simulació | 600/600 |
| Desplaçaments del rànquing de quota | 73 |
| Desplaçaments del rànquing de penetració | 60 |
| Desplaçaments del rànquing d'IIC | 84 |
| Films de 1964 amb 400M | 2/2 |
| Anys, espectadors acumulats, pertinència al Top 100 i ordre del corpus inalterats | 210/210 |
| Ancoratge d'IIC (8 apellidos vascos) | 10,00 |

## Pendent de validació integral

- Sincronitzar els 49 registres manuals de `js/part-iii.js`, la fórmula de `novaFilaEFA()`, les sèries duplicades de `part-iii.html` i les dades de la resta de JS.
- Actualitzar les referències quantitatives de textos catalans, fonts, notes metodològiques i després les traduccions.
- Verificar gràfics, tooltips, rànquings i càrrega de pàgines; contrastar `main` vs branca. No canviar les dades franceses, espectadors absoluts, IAA ni prestigi.
