# ShortBär Trading App – Änderungsdokument

Stand: 23. August 2026

Dieses Dokument führt die vom Nutzer in Notion gepflegte Notiz
„ShortBär Trading App Updates“ im Projekt nachvollziehbar fort.

## Runde 2 · umgesetzt am 23. August 2026

### Navigation und Kopfzeile

- Klick auf einen Schritt in „Heutiger Ablauf“ springt jetzt zur passenden
  Abschnittskarte statt an den Seitenanfang. Jede Karte hat eine feste ID
  (`step-events`, `step-indices`, …) und einen `scroll-margin-top`, der die
  klebende Kopfzeile berücksichtigt.
- „Routine fortsetzen“ führt zum ersten noch offenen Schritt.
- Die klebende Mini-Navigation der Routine klebt nicht mehr auf Höhe 0 und
  verschwindet damit nicht mehr halb hinter der Kopfzeile.
- Das Logo ist jetzt ein Inline-SVG. Als Bilddatei brach der Pfad unter dem
  GitHub-Pages-`basePath`, weshalb der Browser sein blaues Fragezeichen zeigte.
- Der erklärungslose Chip „LOCAL“ oben rechts ist durch den aktuellen
  Marktmodus ersetzt und führt per Tipp direkt zur Entscheidung.

### Marktampel

- Fünf Stufen statt drei: Tiefgrün (Full Bull), Grün (vorsichtig Swing),
  Gelb (nur Daytrades), Rot (vorsichtig bärisch), Tiefrot (aggressiv bärisch).
- Die Ampel steht ganz oben auf der Startseite.
- Ist die heutige Routine noch offen, zeigt die App den letzten festgelegten
  Stand mit Altersangabe („Stand von gestern“, „Stand von vor 3 Tagen“).
- Neu: automatischer Tageswechsel. Der abgelaufene Tag wandert in eine
  Historie (bis 90 Einträge), die neue Routine startet leer. Vorher blieben
  die Häkchen des Vortags dauerhaft gesetzt.
- Alte dreistufige Stände bleiben gültig und werden unverändert übernommen.

### Inhaltliche Ergänzungen

- ARKK/QQQ-Verhältnis als Growth- und Risk-on-Barometer im Schritt „SPY & QQQ“,
  inklusive Direktlink zum Ratio-Chart.
- „Marktbreite“ heißt jetzt „Marktmonitor“.
- Leadership: Direktlink zur eigenen Skywalker-RS-App, Hinweis auf maximal drei
  Sektoren sowie eine Auswahl der stärksten Gruppen (GDX, IBIT, XOP, … plus
  freie Eingabe, Richtwert Top 5).
- Eventrisiko: Direktlinks zum offiziellen FOMC-Kalender und zum
  Wirtschaftskalender. Die Termine bleiben bewusst manuell.
- X-Research: korrigierte Handles – MoeTrading = `@coingigglemoe`,
  Will Hunting = `@wmd4x`, zusätzlich `@bullsnort`. Der Vorläufigkeitshinweis
  entfällt, die Handles stehen jetzt direkt an der Quelle.
- Die Liste „Bulls Nord“ heißt korrekt „BullSnort“; bestehende Einträge werden
  automatisch migriert.

### Externe Links

- Finviz, TradingView, X und die RS-App öffnen über eine gemeinsame
  Link-Komponente. Läuft die App als installierte PWA, wird der Aufruf bewusst
  an ein neues Browserfenster übergeben statt an die eingebettete Vorschau.
  Im normalen Browser bleibt es ein gewöhnlicher Link, damit Mittelklick und
  „in neuem Tab öffnen“ weiter funktionieren.

### Technisch

- Die Routine-Ansicht hält keinen eigenen Formularzustand mehr, sondern
  schreibt über `patchMarket` direkt in den Store. Damit gehen mehrere
  Änderungen im selben Render-Zyklus nicht mehr verloren.
- Neue, testbare Ampellogik in `lib/market.ts` mit zehn zusätzlichen Tests.

## Runde 1 · umgesetzt

- TradingView-Direktlinks für SPY und QQQ in der Situational-Awareness-Routine
- Finviz-Direktlinks für Themes und Sektor-Performance bei Leadership & Relative Strength
- eigener Routinen-Schritt „Finviz Momentum Scans“ mit:
  - Near 52-Week High
  - Up 20 % Month
  - Up 30 % Quarter
- X-Research-Accounts als öffnende Links mit getrennten lokalen Erledigt-Haken
- Listenstruktur erweitert auf:
  - Stock List
  - BullSnort
  - Stalkers List
  - Fast Ready
  - Watchlist Long
  - Watchlist Short
  - Top Dogs
  - Focus Long
  - Focus Short
- Daily Routine um den abschließenden Watchlisten-Prozess ergänzt
- Scan Inbox kann Ticker direkt einer dieser Listen und der passenden Richtung zuordnen
- defensive Migration bestehender `watch`- und `focus`-Einträge anhand ihrer Richtung

## Offen · bewusst nicht umgesetzt

- **Automatisches Befüllen des Eventrisikos.** Dafür braucht es eine Datenquelle.
  Ohne sie müsste die App Termine raten, und ein falsch behaupteter FOMC-Termin
  wäre schlimmer als ein leeres Feld. Als nächster Schritt bietet sich eine
  gepflegte Terminliste im Projekt an, die einmal pro Quartal aktualisiert wird.
- **Watchlisten-Pflege gegen TradingView.** Ohne bezahlte API bleibt nur der
  Textexport, der bereits vorhanden ist.

## Grundsatz

Alle TradingView-, Finviz-, RS-App- und X-Verknüpfungen sind reine ausgehende
Recherchelinks. Die App liest keine Live-Daten ein und leitet daraus keine Signale ab.
