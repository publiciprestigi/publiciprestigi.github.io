# Auditoria del mercat espanyol, 1965–2025 · versió de treball (27-10-2026)

**Estat: PROVISIONAL / NO APLICADA A LA WEB.** Aquest fitxer i `mercat-1965-2025.csv` són una proposta de conciliació documental; no constitueixen una nova sèrie publicada. No han modificat `../data/market.json`, `../data/films.json`, els JS, els HTML ni els textos de la web.

## Criteri únic

1. Denominador: **total anual d'entrades venudes a les sales comercials d'Espanya**, pel·lícules de qualsevol nacionalitat, durant l'any natural.
2. Prioritat: estadística oficial consolidada del Ministeri/ICAA per davant d'avanços de Comscore/Rentrak; si hi ha revisions retrospectives de l'ICAA, prioritzar la més recent **contrastada**. No barrejar total de sales amb espectadores acumulats d'una pel·lícula.
3. No derivar entrades de recaptació monetària, ni d'una conversió de pessetes a euros.
4. Preservar tota dada original i la traçabilitat de l'elecció; cada canvi ha de disposar de font i precisar si el recompte és exacte o publicat en milions arrodonits.
5. Si no hi ha total anual oficial verificat, deixar-lo **sense verificar**: no inventar una xifra «oficial». Separar explícitament el 1965 del corpus de pel·lícules, que sí que conté títols estrenats aquell any.
6. Només quan estigui aprovada la sèrie completa es propagaran els canvis al mercat, la quota, l'IIC, els rànquings, les comparatives de la Part III, els scripts incrustats als HTML i les notes [2]–[4]. No modificar els espectadors acumulats del Top 100 per aquest motiu.

## Cobertura de la proposta

- **1965:** dada anual encara no contrastada, la proposta queda en blanc. El valor viu de 390M continua identificat com a estimació.
- **1966–2021:** 56 anualitats amb recompte en unitats documentat en butlletins o evolucions oficials. Cal resoldre les petites contradiccions editorials explícites de 1969, 1971 i 2001.
- **2022–2025:** quatre anualitats de la sèrie estadística oficial, de moment amb precisió publicada de **0,1 milions**. No extrapolar decimals absents.
- Els registres del CSV conserven per separat la xifra de la web, la candidata, la precisió i la incidència documental.
- **40 anualitats** de les 60 documentades difereixen en almenys 1 milió d'entrades de `data/market.json` (comparació abans de cap canvi).

## Fonts primàries, amb identificador del CSV

- **B76:** https://www.cultura.gob.es/dam/jcr%3A0ef4a9ed-7c95-43d0-aa57-c39f4f423142/boletin-1976.pdf
- **B89:** https://www.cultura.gob.es/dam/jcr%3A03708774-f098-4a5e-99a6-59998af9dc34/bolet-n-1989.pdf
- **B01:** https://www.cultura.gob.es/dam/jcr%3Ad5b427a5-2303-4e0c-a979-2a3350866545/bolet-n-2001.pdf
- **EV05:** https://www.cultura.gob.es/dam/jcr%3Aa35d5fae-b963-44d5-afe8-264c9fb10393/4-02-cuadrosevolucion.pdf
- **EV15:** https://www.cultura.gob.es/dam/jcr%3Aa3ae9d4c-39a9-4db5-9e8e-459484cdea7b/21-evolucion-exhibicion.pdf
- **EV21:** https://www.cultura.gob.es/dam/jcr%3Ad7641b87-137e-4657-91a4-a243bf17d004/boletin-2021.pdf
- **CULT25:** https://www.cultura.gob.es/dam/jcr%3A4060b6e9-4fa9-4f18-923f-f15066dcc03c/nota-resumen-cine-y-contenidos-audiovisuales-2021.pdf

Fonts addicionals de contrast: [Boletín Informativo 1997](https://www.cultura.gob.es/dam/jcr%3Ae17ffac2-87f7-4884-b22f-f8af56af6ffa/boletin-1997.pdf) (revisions 1982–1997), [Boletín Informativo 1987](https://www.cultura.gob.es/dam/jcr%3Ae85d8473-d486-4a20-99a4-98c729999aa5/bolet-n-1987.pdf) (diferències anteriors), [CULTURABase](https://www.cultura.gob.es/servicios-a-la-ciudadania/estadisticas/cultura/mc/culturabase/cine-contenidos-audiovisuales/resultados-cine-contenidos-audiovisuales.html) (actualització oficial 2025 publicada el maig de 2026).

## Incidències expressament obertes

- **1965:** el quadre històric de l'ICAA documenta la recaptació però **no** el total d'espectadors. No atribuir els 403,1M de 1966 al 1965.
- **1969:** dues transcripcions oficials difereixen en només 20 entrades.
- **1971:** discrepància menor entre el butlletí original de 1976 i altres reproduccions històriques.
- **2001:** una taula de detall i la sèrie evolutiva del mateix butlletí mostren 146,210M i 146,810M respectivament. La sèrie evolutiva posterior també reporta 146,810M. Cal confirmar-ne el recompte de referència.
- **2022–2025:** cal cercar recomptes oficials en unitats, si existeixen, abans de carregar els valors a un sistema que fa arrodoniments a centèsimes de quota.
- **Definició de «quota»:** actualment compara els espectadors *acumulats* d'un film amb un *mercat anual*. És un indicador relatiu propi, no la quota anual oficial de taquilla de la pel·lícula: documentar-ho sense abandonar ni alterar unilateralment el criteri editorial.

## Límit d'aquesta auditoria

La proposta no és un **fitxer substitutiu** de `data/market.json`. És una base de contrast amb avisos oberts. Qualsevol aprovació posterior haurà d'incloure comprovacions de tota la cadena de dependències dels gràfics.
