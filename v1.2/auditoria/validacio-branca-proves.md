# Validació inicial de la branca de proves

**Branca:** `audit-mercat-iic-v12` · 27-10-2026. **NO fusionar amb main encara.** Es preparen només `data/market.json` i `data/films.json`; els textos, gràfics i indicadors que apareixen manualment a JS/HTML **encara no estan sincronitzats**. Visualitzar el conjunt de la branca abans de corregir-los pot mostrar discrepàncies.

## Dades comparades amb main

- **61 anualitats de mercat:** les 61 s'han actualitzat amb els valors documentats o reconstruïts, amb el 1965 com a estimació històrica documentada. 60 poblacions anuals del fitxer de mercat han canviat; la del 2025 queda com estava.
- **210 pel·lícules:** 100 Top 100, 110 films de context. S'han preservat **exactament** les 210 identitats, títols, anys, directors, dècades, posicions originals, condicions `in_top100`, textos de context i **espectadors acumulats**. Zero errors en el contrast camp a camp.
- Registres afectats: 208 `mercat_M`, 176 `penetracio`, 158 `quota`, 176 `iic`. Hi ha indicadors que no canvien perquè el nou càlcul coincideix a dos decimals, no perquè s'hagin omès.
- Marques de qualitat: 1965 `market.estimat=true`; 1964 manté els dos films i els **400M estimats**. `penetracio_estimat=true` per als films de 1964–1972, reconstrucció acadèmica; mercat `estimat` només per al 1965, a la sèrie 1965–2025. La llegenda visible d'aquestes marques s'ha de revisar en aplicar, per no suggerir que una font acadèmica és simplement una interpolació improvisada.
- Coeficient intern per simular IIC: `10 / max(√(quota_no_arrodonida × penetració_no_arrodonida))`, amb `8 apellidos vascos` (2014) com a referència, valor aproximat `0,6807356220097183`. Quota, penetració i IIC es calculen primer sense arrodonir i després es guarden a dos decimals.
- Validació sintàctica: els dos fitxers es poden tornar a interpretar com a JSON, tenen tots els camps numèrics finits i cadascun dels 210 IIC guardats reprodueix la fórmula proposada a dos decimals. La posició del màxim continua a 10,00.
- **61 anys** al JSON actiu de mercat de la branca; no s'hi introdueix cap 1964 artificiós, el 1964 és una excepció només de dos films al corpus de l'ICAA.

## Comprovacions pendents a la mateixa branca

1. Actualitzar els exemples i les taules fixades al `js/part-iii.js`, inclòs el mètode `novaFilaEFA`, sense alterar els seus espectadors originals i IAA.
2. Substituir o centralitzar les sèries espanyoles `esMarket`, `espEntrades` i `espPoblacio` incrustades a `part-iii.html`, sense tocar les de França.
3. Actualitzar els textos `textos/part-i/`, `textos/part-iii/`, les notes i les capçaleres amb les quantitats inventariades a [inventari-canvis-per-fitxer.md](inventari-canvis-per-fitxer.md).
4. Validar tots els rànquings, tooltips, mitjanes per dècada i el disseny dels gràfics abans de sol·licitar la fusió a `main`.

**Estat: les dues bases de dades estan preparades i verificades internament, però la branca completa de la web NO està validada per a publicació.**
