# Validació de la implantació a la branca de proves — 27-10-2026

**Branca:** auditoria-mercat-iic-2026  
**Base de main:** c1ee48fdc803431636ffca62342eadc5584ee070  
**Estat:** IMPLEMENTACIÓ CATALANA I CODI PRINCIPAL ACTUALITZATS A LA BRANCA; PENDENT DE PROVES VISUALS I REVISIÓ FINAL. **NO FUSIONAR AMB MAIN.**

## Implantat a la branca

- Mercat 1965–2025 (61 anys) a `data/market.json`, població 1964–2025 (62 anys) a `data/population.json` i la població compatible dins de `market.json`.
- Recalculats els 210 registres de `films.json` segons quota, penetració i IIC normalitzat. Dues excepcions de 1964 preservades (400M de mercat estimat); 1965 = ≈435,2M de MEDIA Salles. Públics acumulats i composició del corpus intactes.
- Eliminats els valors manuals dels 49 registres identificats de `js/part-iii.js`; `novaFilaEFA()` calcula l'IIC amb la mateixa metodologia, i les taules d'autor industrial consulten també els denominadors comuns.
- Les dades espanyoles `esMarket`, `espEntrades` i `espPoblacio` dels dos gràfics de `part-iii.html` procedeixen de `market.json` a temps d'execució. Els tres conjunts francesos `frMarket`, `fraEntrades` i `fraPoblacio` s'han comparat literalment amb `main`, i són idèntics.
- Ajustats els límits dels gràfics per representar 1965 (mercat fins a 460M i entrades per habitant fins a 15), les anotacions de 1965 i 2020 i la marca de població reconstruïda a 1965–1972.
- `js/decades-resum.js` calcula ara la mitjana de **totes les anualitats** d'una dècada, no la mitjana ponderada pels anys dels films del Top 100.
- Actualitzades les referències dependents del mercat a la Part I, la introducció general, les notes [1]–[4] i [31] i els capítols afectats de la Part III. Cap actualització del corpus de prestigi, de les sèries franceses, dels espectadors de pel·lícules ni de les IAA.

## Verificació programàtica executada amb els fitxers de la branca

| Comprovació | Resultat |
| --- | ---: |
| Anualitats de mercat | 61/61 |
| Anualitats de població | 62/62 |
| Films (Top 100 + context) | 100 + 110 |
| Mètriques quota, penetració i IIC comparades amb la simulació | 630/630 |
| Posicions noves de rànquing contrastades | 300/300 |
| Entrades manuals de la Part III, comparades amb la simulació | 49/49 |
| Invocacions de mètrica sense valors numèrics manuals | 49/49 |
| Scripts HTML incrustats analitzats sintàcticament | 11/11 |
| Coeficient de normalització | 0,6807356220097183 |
| Errors detectats en aquestes comprovacions | **0** |

Mitjanes de mercat per dècada (milions d'entrades anuals, amb el conjunt d'anys disponible): 60s 394,5; 70s 260,0; 80s 123,1; 90s 101,0; 2000s 128,8; 2010s 96,2; 2020–2025 57,4.

A més d'aquesta comprovació a través del connector GitHub, s'ha incorporat `auditoria/valida-dades.mjs` per poder repetir-la en una còpia local del repositori amb `node v1.2/auditoria/valida-dades.mjs`. **El nou script Node no s'ha executat encara en un checkout local; cal fer-ho abans de la fusió.**

## Punts pendents abans de la publicació

1. **Prova real en navegador de la branca**, amb els gràfics i les taules de Parts I i III, toggles, hovers, tooltips, càrrega asíncrona i consola. La branca GitHub no és automàticament una URL pública de previsualització de GitHub Pages.
2. Comprovació editorial amb la web visible: alineació dels textos dinàmics, notes, precisió numèrica i exemples del gràfic dels rànquings. Cal confirmar el manteniment de l'estil gràfic.
3. Una vegada validada la versió catalana, sincronitzar els textos i HTML de `v1.2/es/` que encara conservin valors anteriors, i repetir les proves.
4. Executar localment `valida-dades.mjs`, fer una inspecció final del diff i preparar una revisió abans de fusionar amb `main`.
5. La confirmació primària de la dada de 1965 a la Filmoteca continua separada i ajornada fins després de la publicació, segons la decisió editorial.

**No s'han fusionat, publicat ni desplegat els canvis d'aquesta branca.**
## Comprovació complementària del 28-10-2026

- Verificada la branca `auditoria-mercat-iic-2026` respecte de `main`: 8 commits i 29 fitxers diferents abans d'aquesta anotació; cap desfasament amb `main`.
- Reexecutat el codi del validador sobre els **fitxers íntegres recuperats de GitHub**, mitjançant lectura virtual de fitxers i funcions d'asserts equivalents: **3.254 assercions, 0 errors**. Aquesta prova no substitueix l'execució nativa de Node ni la prova de navegador.
- Revisió de literals antics de mercat i IIC als HTML de la branca i als JS principals, i als textos catalans de Parts I i III: cap referència desfasada als casos buscats.
- **Diferència francesa prèvia, no modificada:** el gràfic històric de 2025 conserva 156,79M entrades franceses, mentre el bloc de quota per nacionalitat dona un mercat de 156,2M. Les sèries franceses no s'han recalculat ni alterat; la comprovació de si són publicacions diferents o una discrepància prèvia queda fora d'aquesta auditoria quantitativa espanyola.
- Els estats històrics «pendent» de [l'inventari](inventari-canvis-per-fitxer.md) i [el mapa d'impacte](mapa-impacte-mercat.md) es conserven com a documentació inicial, amb avís de no confondre'ls amb el progrés de la branca.
- S'afegeix un flux de GitHub Actions limitat a aquesta branca per executar `node v1.2/auditoria/valida-dades.mjs` i comprovar la sintaxi dels principals mòduls JS. **No s'ha observat encara el resultat d'aquest flux en crear aquesta acta.**
