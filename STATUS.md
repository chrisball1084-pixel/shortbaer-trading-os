# MVP-Status

Stand: 23. August 2026

## Fertig

- Mobile-first Dark-Mode-App mit Desktop-Sidebar und mobiler Bottom-Navigation
- Hesselink-inspiriertes Designsystem mit Dark Navy, Cyan-Akzenten, technischer Display-Typografie, Karten-Tiefenwirkung und aktualisierten PWA-Icons
- Alle acht angeforderten Hauptbereiche
- Installierbare PWA-Grundlage: Manifest, Icons, Standalone-Metadaten und Service Worker
- Lokale Persistenz ohne Login und ohne Server
- Klar gekennzeichnete Seed-/Demodaten
- Situational-Awareness-Eingabe inklusive manueller, fünfstufiger Marktampel mit Vortagsstand
- Daily-Coach-Überarbeitung mit acht geführten, einzeln abschließbaren Schritten
- Separate Kurslage und MA-Richtung für SPY und QQQ an 10-SMA, 20-EMA und 50-SMA
- Event-Checkboxen, Research-Routine und kompakte Sektor-ETF-Leadership-Auswahl
- Marktmonitor mit +4-%-Breakouts / −4-%-Breakdowns des Vortags sowie vorläufige 20-/50-Tage-Partizipation
- Sofortige lokale Speicherung und Migration des bisherigen lokalen Datenmodells
- Kandidaten-CRUD mit BullSnort, Stalkers, Fast Ready, Long-/Short-Watchlists, Top Dogs und Focus Lists
- Abschließender Daily-Prozess BullSnort/Stalkers → Fast Ready → Focus List
- Scan-Inbox mit flexibler Eingabe, Deduplizierung, Quelle, Triage in alle Prozesslisten, Top Dog und TradingView-Text-Export
- ORB-Long-Rechner inklusive Stop-Tranchen, ADR-Prüfung und risikobasierter Stückzahl
- Journal-Erfassung mit automatischem P&L, Ergebnis in R und Prozess-/Ergebnis-Bewertung
- Playbook-Platzhalter für alle sechs Setups
- JSON-Backup, Import und Demo-Reset
- Sicherheitsabgrenzung in App, README und `AGENTS.md`
- Mobile visuelle Prüfung bei 390 × 844 px; keine Konsolenfehler und kein horizontaler Overflow

## Technisch geprüft

- `lint`: bestanden
- `typecheck`: bestanden
- `test`: 14/14 bestanden
- `build`: bestanden (statisch prerenderbar)

## Nicht fertig / bewusst außerhalb des MVP

- Broker- oder Orderintegration
- Live-Marktdaten und automatische Signale
- TC2000-, TradingView- oder X-API
- Short-ORB-Logik
- Journal-Screenshot-Speicherung
- Vollständige Playbook-Inhalte und Beispielbibliothek
- Vollständige Historie abgeschlossener Daily Routines (nur die Ampel wird gesichert)
- Automatischer Import des Jeff-Sun-RS-Sheets oder von Marktbreitedaten
- Cloud-Synchronisation, Login und Mehrbenutzerbetrieb
- Push-Benachrichtigungen

## Offene fachliche Fragen

- Nach welchen objektiven Kriterien wechselt die Marktampel später von manuell auf regelbasiert?
- Wie genau wird „erhöhtes relatives Gesamtvolumen“ für den ORB definiert und ab welchem Grenzwert gilt es?
- Soll der optionale Vortageshoch-Filter pro Trade oder global im Playbook gelten?
- Werden Tranchen-Stückzahlen stets abgerundet oder soll Rest-Risiko auf bestimmte Tranchen verteilt werden?
- Welche Regeln gelten spiegelbildlich oder abweichend für einen Short-ORB?
- Was sind die finalen Regeln für 6/20 Entry und Monday High / Monday Low Sweep?
- Welche Kriterien bestimmen Top Dog und Short Leader verbindlich, statt nur manuell?

## Empfohlene nächste Aufgabe

**Nicht sofort weitere Features bauen.** Den MVP zuerst zwei bis vier Wochen im persönlichen Workflow einsetzen und pro Nutzung Reibungspunkte sowie fehlende Pflichtfelder notieren. Danach als eng begrenzte nächste Version: fachlich finalisierte ORB-/Playbook-Regeln plus Journal-Screenshots in IndexedDB.
