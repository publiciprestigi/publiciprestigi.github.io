# Dades de Públic i Prestigi — v1.2

Aquesta carpeta recull les dades del projecte per al període 1965–2025. No tots els fitxers s'utilitzen per generar la web actual.

## Fitxers operatius

Els HTML i JavaScript de la versió 1.2 carreguen aquests fitxers:

- `films.json`: Top 100 i pel·lícules de context, amb les dades d'espectadors i els indicadors comparatius.
- `market.json`: sèrie anual del mercat cinematogràfic espanyol i població de referència.
- `festivals.json`: corpus de seleccions i premis dels quatre festivals de l'estudi.
- `fora-competicio.json`: seccions complementàries dels festivals.
- `oscar.json` i `efa.json`: reconeixements dels Oscar i els European Film Awards.
- `metadata.json`: versió activa, etiquetes i dates de publicació.

Els textos editorials es mantenen als fitxers Markdown de `textos/` i `es/textos/`; les notes metodològiques visibles són a `notes.html` i `es/notes.html`.

## Fitxers auxiliars (no carregats per la web actual)

- `population.json`: sèrie demogràfica de contrast. Les dades de població dels anys 1965–2025 coincideixen amb les de `market.json`; per als càlculs publicats s'utilitza `market.json`.
- `breach.json`: resum de la bretxa per dècades, sincronitzat amb les dades de la v1.2 (11 dobles corones als quatre festivals). La taula publicada es calcula directament amb `festivals.json`, `films.json` i `market.json`, no amb aquest resum.

## Fitxers històrics (legacy, no operatius)

Aquests fitxers es conserven com a referència de treball, però poden contenir valors de versions anteriors i **no s'han d'utilitzar com a font vigent** sense una revisió específica:

- `directors.json`: agregacions i denominacions de directors no sincronitzades amb el Top 100 actual.
- `decades.json`: recomptes generals útils, però algunes quotes, índexs IIC i mitjanes de mercat són antics.
- `notes.json`: recull anterior de 23 notes; les pàgines metodològiques actuals en publiquen 32 en cada idioma.

## Fonts i criteris

Les dades de públic parteixen dels anuaris de l'ICAA; les sèries de mercat i població es documenten amb fonts ministerials, INE i les reconstruccions indicades a l'estudi. Els reconeixements provenen dels organismes i festivals corresponents.

Per a les definicions, excepcions, criteris de selecció i fonts precises, consulteu [Fonts i eines](https://publiciprestigi.com/part-i.html#intro) i les [notes metodològiques](https://publiciprestigi.com/notes.html). Les dades es publiquen en el context d'aquests criteris i no s'han d'interpretar al marge de les notes i limitacions de l'estudi.
