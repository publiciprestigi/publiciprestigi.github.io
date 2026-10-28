# Validació de la implantació a la branca de proves — 27-10-2026

**Branca:** auditoria-mercat-iic-2026  
**Base de main:** c1ee48fdc803431636ffca62342eadc5584ee070  
**Estat:** IMPLEMENTACIÓ CATALANA ACTUALITZADA; VALIDACIÓ DE DADES EN NODE I PROVES FUNCIONALS DESKTOP EN CHROME SUPERADES. Queden la revisió visual/editorial completa, l'eventual correcció de punts detectats i la validació de publicació. **NO FUSIONAR AMB MAIN.**

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

El validador `auditoria/valida-dades.mjs` s'ha executat correctament amb **Node 22 en GitHub Actions** el 28-10-2026. A més, les proves de navegador automàtiques amb **Chrome i Playwright**, servint la branca localment, han completat correctament els controls previstos. Vegeu [l'execució completa de GitHub Actions](https://github.com/publiciprestigi/publiciprestigi.github.io/actions/runs/40651516431). La disponibilitat d'aquestes proves no substitueix una revisió editorial completa ni l'aprovació visual manual.

## Punts pendents abans de la publicació

1. **Revisió visual manual completa** sobre una previsualització o entorn de navegador de la branca, incloent-hi versions mòbils, tooltips, coherència tipogràfica, totes les taules i interaccions. Les proves automàtiques de Chrome en les seccions quantitatives principals ja han passat. GitHub Pages no publica automàticament aquesta branca.
2. Comprovació editorial amb la web visible: alineació dels textos dinàmics, notes, precisió numèrica i exemples del gràfic dels rànquings. Cal confirmar el manteniment de l'estil gràfic.
3. **Al final de tot**, quan la v1.2 catalana estigui tancada íntegrament, fer una **traducció integral nova al castellà**; no una correcció fragmentària de la versió antiga de `v1.2/es/`. La traducció no forma part de l'auditoria actual.
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

## Prova automàtica de navegador i revisió de captures — 28-10-2026

- Flux limitat a la branca `auditoria-mercat-iic-2026`: [execució verificada](https://github.com/publiciprestigi/publiciprestigi.github.io/actions/runs/40651516431), conclusió **success**, amb els dos jobs `validador` i `navegador` completats satisfactòriament.
- El servidor HTTP local del runner serveix els fitxers reals de `v1.2/`; Chrome obre les Parts I i III, verifica els mercats 1965/2025 i els límits d'eix, canvia a la vista per habitant, contrasta les 7 files del resum per dècades, prova el selector de rànquings i el #7 de quota de `Mujeres al borde…`, les dues files `La caza`/`Alcarràs`, el Top 30 francès i les tres vistes de la comparativa Espanya–França.
- **11 captures de pantalla disponibles com a artefacte** `captures-auditoria-v12` a la pàgina de l'execució anterior. Es van revisar les vistes gràfiques de mercat, per habitant, comparativa IIC, quadre de dècades, Buñuel i `La caza vs. Alcarràs`.
- Corregit un problema d'inicialització del plugin de `js/mercat.js` que ocultava les anotacions `Màxim: ≈435,2M` i `Col·lapse pandèmic: 27,0M` fins a redibuixar el Chart. La nova captura les mostra correctament a la primera vista.
- La captura del contenidor de `La caza vs. Alcarràs` retallava aparentment columnes per la seva caixa de 720px; una **captura de pàgina completa** a 1440px confirma que la taula s'estén a la dreta i que es veuen `Quota`, `IIC` i `IAA` amb l'estil preexistent. No s'han canviat el CSS ni les mides de les taules.
- **Límit de la prova:** cobertura funcional dirigida, amb comprovació d'escriptori i dues captures mòbils, però no inspecció exhaustiva de cada dispositiu, hover i contingut; per això mantenim la revisió editorial/visual manual i la fusió amb `main` com a pendents.


### Verificació de pantalles estretes

- La prova automatitzada del 28-10-2026 inclou amplada de **390px** per als gràfics de mercat de la Part I i de comparació Espanya–França a la Part III. Ambdós s'han carregat correctament amb els valors 1965 = 435,2M i 2025 = 66,9M.
- Les captures `09-mercat-mobil.png` i `10-comparativa-mercat-mobil.png` s'han revisat: els eixos no retallen l'extrem de 1965 i els controls i llegendes es conserven llegibles. Sense errors de consola/JavaScript capturats pel test.
- Les captures són una **mostra de les seccions quantitatives actualitzades**, no una certificació completa d'accessibilitat ni d'adaptació mòbil de tots els capítols i taules de la web. No s'ha alterat el CSS.

## Cobertura general de la versió catalana — 28-10-2026

- **Prova de navegació ampliada:** les 35 seccions de les Parts I (15), II (11) i III (9) han estat recorregudes en Chrome/Playwright sobre els fitxers servits localment, sense desplegar la branca. **40 contenidors de taula amb files** han estat detectats i el text Markdown s'ha renderitzat a totes les seccions amb blocs esperats. Cap error JavaScript no capturat i cap resposta HTTP local 4xx/5xx. Vegeu [l'execució de cobertura](https://github.com/publiciprestigi/publiciprestigi.github.io/actions/runs/40652121840), i l'artefacte `cobertura-seccions.json` amb el detall per capítol.
- Les captures `cobertura-part-i-iic.png`, `cobertura-part-ii-directors.png` i `cobertura-part-iii-generacions.png` mostren tres estats representatius. La cobertura no equival a una auditoria manual completa de totes les interaccions i de tots els dispositius.
- **5 textos contextuals catalans corregits a `data/films.json`:** `Mujeres al borde de un ataque de nervios`, `Los otros`, `8 apellidos vascos`, `Lo imposible` i `Ocho apellidos catalanes`. S'han eliminat percentatges heretats o la confusió entre quota pròpia de referència i quota de taquilla efectiva. Sense canvis en públics absoluts, anys, classificació, mètriques ni textos castellans.
- **Notes i blocs de Markdown:** validació automàtica a Node 22 amb 32 notes numerades consecutivament, 36 fitxers Markdown de la versió catalana, 32 referències a notes i 105 vinculacions `data-text` de les pàgines. **Zero notes inexistents, zero arxius absents, zero referències a blocs inexistents.** Vegeu [l'execució GitHub Actions](https://github.com/publiciprestigi/publiciprestigi.github.io/actions/runs/40652401516).
- La comparativa francesa de 2025 (`156,79M` a la sèrie històrica i `156,2M` al bloc de quotes) segueix marcada com a discrepància prèvia fora de l'àmbit de correcció d'aquesta auditoria, sense alterar les dades CNC/INSEE.

**Pendents abans de fusionar:** lectura editorial manual de la v1.2 catalana completa i inspecció de detalls gràfics en totes les resolucions, revisió conscient de l'excepció francesa i confirmació final de la branca. La traducció integral al castellà queda expressament ajornada fins al final de tot el procés català.

## Identificada la discrepància francesa de 2025

El valor **156,79M** del gràfic històric de França correspon a l'**avanç provisional del CNC del 30-12-2025**; el valor **156,2M** del bloc de quotes correspon al **balanç definitiu del CNC del 12-05-2026**. La diferència està documentada a [nota-serie-franca-2025.md](nota-serie-franca-2025.md). Els valors francesos es mantenen intactes, i qualsevol harmonització posterior serà una revisió independent i explícita.
