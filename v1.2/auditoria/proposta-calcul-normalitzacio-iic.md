# Proposta de càlcul, normalització i ordenació de l'IIC — v1.2

**ESTAT: PROPOSTA TÈCNICA PREPARADA, PENDENT D'APROVACIÓ EDITORIAL. NO APLICADA A LA WEB.**

Dependències: [mercat 1965–2025](mercat-1965-2025.csv), [població 1964–2025](poblacio-1964-2025.csv), [210 films abans/després](rankings-abans-despres-1964-2025.csv), [49 entrades fixes de la Part III](impacte-taules-fixes-part-iii.csv).

## Definicions i denominadors

- `E` = entrades acumulades de la pel·lícula, exactament les que consten al corpus (`espectadors`). No canviar-les per aquesta revisió.
- `M_y` = total anual d'entrades venudes a les sales a Espanya, totes les nacionalitats, l'any de referència del film. Es pren de la sèrie documentada; 1965 = **≈435,2M** de MEDIA Salles, estimació editorial documentada. Els **dos films ICAA de 1964** mantenen el denominador separat **400M estimat** mentre no es validi un total de mercat del 1964; la seva inclusió, any i públic acumulat són inalterables.
- `P_y` = població resident de referència, per any, en persones (no en milions arrodonits). **1964–1972:** reconstrucció acadèmica de Maluquer de Motes (1 de gener); **1973–2025:** INE, sèries comparables seleccionades. Cal consignar la diferència de fonts i la discontinuïtat metodològica de 1973.
- **Quota de referència (punts percentuals)** = `100 × E / M_y`. És un **indicador propi basat en la relació entre públic acumulat del film i mercat anual de referència**; no la quota oficial real del film dins la taquilla del mateix any.
- **Penetració demogràfica (punts percentuals)** = `100 × E / P_y`; és nombre d'entrades per cada 100 habitants, **no percentatge de persones diferents**.

## IIC i escala 0–10

Fórmula funcional existent, sense canviar-ne la lògica:

`IIC = k × √(quota × penetració)`

Per a la v1.2, **proposem** fixar `k` amb la pel·lícula de referència del màxim, **`8 apellidos vascos` (2014)**, sense truncaments artificials:

`k = 10 / √(quota_del_film_de_referència × penetració_del_film_de_referència)`

Amb **87.988.991 entrades totals de mercat el 2014** i **46.512.199 habitants a 1 de gener**, el coeficient de la simulació és aproximadament **0,6807356220097183**. El film de referència dona exactament 10,00 quan es calcula el coeficient a màxima precisió. Això **substituiria, amb justificació, el 0,683 de la nota actual**. El valor intern ha de calcular-se des de les dades de referència —no utilitzar una constant reduïda a tres decimals— i guardar-se juntament amb la versió metodològica.

**Si en una edició futura un altre film superés 10**, caldria revisar i versionar explícitament la normalització: no limitar els resultats a 10 silenciosament.

## Precisió, valors guardats i rànquings

1. Fer tots els càlculs amb els denominadors disponibles en unitats, **sense arrodonir quota ni penetració abans de calcular l'IIC**. No inventar unitats per a anys de mercat publicats només en dècimes de milió.
2. Un cop calculats els tres indicadors, **guardar i mostrar dos decimals** a `films.json` i als altres registres de mètriques. Per compatibilitat amb la web, l'arrodoniment proposat és el que efectua JavaScript amb `Number(valor.toFixed(2))`.
3. **Ordenar les puntuacions publicades**, no els valors interns ocults: `sort((a,b)=>b.metrica-a.metrica)`, com ja fa `js/part-i.js`. En empat visible a dos decimals, preservar l'ordre original del corpus (la sort de JavaScript és estable). No inventar desempat per director, any o espectadors.
4. Els rànquings d'espectadors acumulats i la composició del Top 100 són **independents** d'aquesta recalibració i es conserven.
5. Mantenir les marques editorials d'estimació desglossades: *mercat* estimat per al 1964 i 1965; *població* reconstruïda acadèmicament al tram 1964–1972. No marcar com a estimat un recompte oficial de mercat només perquè abans s'hagués estimat a `market.json`.
6. Una fila de dades que no reprodueixi aquestes fórmules amb les precisions declarades s'ha de considerar **error de consistència** i corregir-se abans de publicar.
7. La **revisió del mercat i de la població no es pot donar per completada** si queden valors `mercat`, `quota` o `iic` introduïts directament en JS/HTML sense contrastar amb el mateix origen.

## Abast de la simulació segons l'ordenació actual

En comparar les posicions del Top 100 actuals amb les noves, guardades a dos decimals i ordenades amb el criteri anterior:

- **73 de 100 posicions** canviaran al rànquing de quota.
- **60 de 100 posicions** canviaran al rànquing de penetració.
- **84 de 100 posicions** canviaran al rànquing de l'IIC.

Aquests recomptes inclouen els **desplaçaments indirectes**; no volen dir que 84 pel·lícules canviïn d'espectadors ni que el corpus es modifiqui.

Si s'ordenen els càlculs amb tots els decimals interns en lloc de les puntuacions a dos decimals, canvien **85** posicions de l'IIC i **75** de quota, simplement pels empats que haurien de mostrar-se com a tals. Per això **la simulació de referència i els textos han d'utilitzar el mateix criteri que la web**.

## Exemples de verificació

| Film | Quota anterior → proposta | IIC anterior → proposta | Posició IIC anterior → proposta |
| --- | --- | --- | --- |
| *8 apellidos vascos* (2014) | 10,68 → 10,68% | 10,00 → 10,00 | #1 → #1 |
| *La ciudad no es para mí* (1966) | 1,16 → 1,07% | 2,69 → 2,56 | #24 → #26 |
| *Mi canción es para ti* (1965) | 1,03 → 0,93% | 2,58 → 2,33 | #30 → #39 |
| *Mujeres al borde de un ataque de nervios* (1988) | 3,94 → 3,82% | 3,98 → 3,91 | #9 → #9 |
| *Padre no hay más que uno 3* (2022) | 3,67 → 4,41% | 3,07 → 3,35 | #18 → #11 |
| *El otro lado de la cama* (2002) | 2,01 → 2,01% | 2,21 → 2,53 | #41 → #28 |
| *Celda 211* (2009) | 1,94 → 1,94% | 1,70 → 2,03 | #57 → #48 |

La [taula exhaustiva dels 210 registres](rankings-abans-despres-1964-2025.csv) conté les xifres, fonts, marques i posicions individuals. **Tots els números d'aquesta proposta són previs a l'actualització de producció.**

## Validacions que cal executar en l'aplicació

- Comptar exactament **100 Top 100 i 110 context**, sense pèrdua de films ni modificacions d'espectadors.
- Verificar **61 anualitats de mercat** i **62 de població**, amb les excepcions de 1964 i la de mercat 1965 documentades.
- Verificar **210 quotes i penetracions** recomputades, **210 IIC** consistents amb la fórmula i la normalització, i els rànquings.
- Verificar les **49 ocurrències d'indicadors preexistents escrits manualment a `js/part-iii.js`**, amb títols duplicats, i totes les sèries de mercat/població incrustades a `part-iii.html`.
- Revisar els gràfics i els textos en català i no propagar al castellà cap versió parcial anterior.
- Conservar la revisió antiga al control de versions i un informe explícit del delta abans/després.

**Fins que no es validi i aprovi aquesta pauta, només es modifica la documentació d'auditoria, no els fitxers funcionals.**
