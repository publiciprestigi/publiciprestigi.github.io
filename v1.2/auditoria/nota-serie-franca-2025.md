# França 2025 — harmonització de l'avanç provisional amb el balanç definitiu del CNC

**Resolució del 28-10-2026:** es pren com a dada de referència **156,2 milions d'entrades**, del balanç definitiu de maig de 2026. Aquesta correcció afecta només el punt francès de 2025 als dos conjunts històrics de `v1.2/part-iii.html`, i no altera cap altre any ni cap dada d'espectadors per film, població o quota oficial per nacionalitat.

## Procedència de les dues xifres

- **156,79M**, quota de films francesos **37,7%**. Avanç estimat del CNC de **30-12-2025**. https://www.cnc.fr/professionnels/communiques-de-presse/malgre-une-annee-en-demiteinte-avec-pres-de-157-millions-dentrees-dans-ses-salles-de-cinema-la-france-demeure-largement-le-premier-marche-europeen_2519012
- **156,2M**, quota de films francesos **37,9%**. **Balanç definitiu del CNC de 12-05-2026**, posterior i prioritari segons la jerarquia de fonts de l'estudi. https://www.cnc.fr/professionnels/etudes-et-rapports/bilans/bilan-2025-du-cnc_2589800

La diferència de 0,59M és una substitució d'estimació provisional per xifra definitiva, no una correcció retrospectiva de la sèrie històrica francesa completa.

## Efectes a la comparativa de Buñuel

1. `frMarket[2025]` (quota de referència dels films del Top 30 francès) passa de 156,79 a **156,2**.
2. `fraEntrades[2025]` (mercat històric) passa de 156,79 a **156,2**. Les entrades per habitant es recalculen automàticament en temps d'execució: **156,2 ÷ 68,720337 ≈ 2,27**, amb la població anual del Banc Mundial utilitzada ja al gràfic.
3. La fotografia de quotes per nacionalitat ja utilitzava **156,2M i 37,9%** i no necessita modificació.
4. La nota metodològica **[31]** identifica correctament la població francesa com a sèrie del **Banc Mundial (SP.POP.TOTL)**, en lloc de l'atribució anterior a l'INSEE. La població no s'ha recalculat.

**Fora de l'abast:** recàlcul de la sèrie francesa 1965–2024, canvis de la sèrie espanyola, dels rànquings, del corpus o de `v1.2/es/`. La traducció castellana completa de la v1.2 continua reservada al final de la revisió catalana.
