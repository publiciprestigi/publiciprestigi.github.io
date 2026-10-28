# Inventari de dades de Públic i Prestigi v1.2

**Estat a la branca `auditoria-mercat-iic-2026` (28-10-2026):** les dades espanyoles de mercat, població, quota, penetració i IIC estan harmonitzades, incorporades i validades a la branca de proves. **Encara no s'han fusionat a `main` ni publicat.** Aquest inventari substitueix la descripció de treball del 27-10-2026.

## Fonts de dades vigents a la branca de proves

- `films.json` — corpus de **210 films** (100 del Top 100 i 110 de context), amb els espectadors acumulats originals i quota, penetració i IIC recalculats. En ús a les Parts I i III, els rànquings, el resum per dècades i el cercador. Les dues excepcions de 1964 es conserven datades com a l'Anuari ICAA 2023.
- `market.json` — **61 anualitats, 1965–2025**, amb mercat espanyol i població de referència. És la font operativa única dels mercats espanyols als gràfics de la Part I i III, les mitjanes per dècada i els càlculs manuals de la Part III. El 1965 és una estimació documentada (≈435,2M de MEDIA Salles), separada dels totals ministerials posteriors.
- `population.json` — **62 anualitats, 1964–2025**, en persones, amb font i estat. Sèrie auxiliar **d'auditoria i de reproducció dels càlculs**; la web consulta habitualment la població inclosa a `market.json` per a 1965–2025. Per als dos films de 1964, `films.json` utilitza població reconstruïda de 1964 i un mercat de 400M estimat que **no forma part** de `market.json`.
- `festivals.json`, `fora-competicio.json`, `oscar.json` i `efa.json` — corpus de prestigi i seccions complementàries; es conserven sense alteracions derivades de l'auditoria quantitativa espanyola.
- `metadata.json` — informació de versió, consultada per diverses pàgines.

## Fitxers històrics no utilitzats per generar els resultats actuals

Els fitxers següents es mantenen per a contrast o traçabilitat; **no són la font vigent** de les taules i gràfics i contenen valors heretats que poden ser diferents de l'auditoria:

- `breach.json` — antiga agregació de la bretxa; avui es calcula directament a `js/part-iii.js`.
- `decades.json` — resum antic amb mètriques precomputades; les taules es construeixen actualment amb `films.json` i `market.json`.
- `directors.json` — agregació històrica, no connectada als rànquings vigents.
- `notes.json` — antiga col·lecció de notes; la font vigent catalana és `../notes.html` (32 notes).

**No eliminar ni recalcular aquests quatre arxius com si fossin fonts operatives.** Abans de reutilitzar-los cal una decisió específica sobre el seu paper històric.

## Codi, contingut i controls

- `../js/part-i.js`, `../js/decades-resum.js`, `../js/mercat.js` i `../js/part-iii.js` consumeixen les sèries vigents. Les taules fixes auditades de la Part III calculen els indicadors amb els denominadors comuns; la fórmula antiga d'IIC de `novaFilaEFA()` s'ha substituït.
- Els dos gràfics espanyols integrats a `../part-iii.html` consulten `market.json`; **les sèries franceses CNC/INSEE no s'han modificat**.
- Els textos editorials catalans viuen a `../textos/`, les notes a `../notes.html`. La traducció castellana actual **no s'ha harmonitzat**; es tornarà a traduir íntegrament només després del tancament de la versió catalana.
- El criteri i les fonts s'expliquen a `../auditoria/criteri-mercat.md` i als CSV de l'auditoria. El document [validacio-implementacio.md](../auditoria/validacio-implementacio.md) registra les proves i els pendents; els scripts `valida-dades.mjs`, `valida-relat-quantitatiu.mjs` i `valida-referencies.mjs` es comproven en GitHub Actions, amb proves de navegador addicionals.

Aquest inventari descriu **l'estat de la branca**, no una versió de producció. No fusionar-la ni publicar-la fins a la validació editorial final.
