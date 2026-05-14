# Varebil-simulator

En frontend-applikasjon for simulering av varebil-avdelinger. Planlegg og visualiser kjøringer med en Gantt-lignende ukentlig tidslinje.

## Teknologi

- **React 19** + **Vite**
- **Tailwind CSS v4**
- **localStorage** – all data lagres lokalt i nettleseren, ingen backend

## Kom i gang

```bash
npm install
npm run dev
```

Åpne `http://localhost:5173` i nettleseren.

## Bygg for produksjon

```bash
npm run build
```

Output legges i `/dist`-mappen og er klar for deploy til GitHub Pages eller annen statisk hosting.

## Deploy til GitHub Pages

1. Bygg prosjektet: `npm run build`
2. Push `/dist`-mappen til `gh-pages`-branchen, eller bruk en GitHub Actions-workflow som kjører `npm run build` og deployer `/dist`.

## Funksjoner

- **Avdelinger** – opprett og navngi flere avdelinger (f.eks. "Oslo-avdelingen"). Bytt mellom dem i sidemenyen.
- **Biler** – legg til biler med registreringsnummer, merke/modell og valgfri beskrivelse.
- **Ukentlig tidslinje** – Gantt-lignende visning fra mandag til søndag, én rad per bil.
- **Kjøringer** – legg til kjøringer med type, km, pris, start/slutt-tid og faste ukedager. Vises som fargede blokker i tidslinjen.
- **Hover-detaljer** – hold musen over en kjøringsblokk for å se type, tidsrom, km og pris.
- **Persistent lagring** – all data lagres automatisk i `localStorage` og er tilgjengelig etter refresh.

## Kjøringstyper og farger

| Type | Farge |
|---|---|
| Leveranse | Blå |
| Henting | Grønn |
| Fast rute | Lilla |
| Annet | Oransje |
