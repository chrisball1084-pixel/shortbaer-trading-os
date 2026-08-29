# ShortBär Trading OS — technische Projektdokumentation

## Zweck

ShortBär Trading OS ist ein persönliches, mobiles Workflow- und Journal-System für systematisches Long-/Short-Swingtrading mit US-Aktien und ETFs. Die Anwendung strukturiert Situational Awareness, Kandidaten, Watchlists, Setups, Risiko, Journaling und Review. Sie führt keine Orders aus und erzeugt keine automatischen Handelssignale.

## Source-of-Truth-Regel

- Dieses Dokument ist die zentrale **technische** Projektdokumentation.
- Das zugehörige Notion-Dokument ist die **Product Source of Truth** für neue Ideen, Bugs, Anforderungen, offene Entscheidungen und den aktuellen Produktstatus.
- Der aktuelle Code ist maßgeblich dafür, was tatsächlich implementiert ist.
- `STATUS.md` ist ein zeitgebundener Status-Snapshot und darf veralten.
- `UPDATES.md` ist Änderungs-/Release-Historie, nicht primäre Agent-Instruktion.
- Historische Notion-Abschnitte und lange Changelogs nur lesen, wenn sie für die aktuelle Aufgabe relevant sind.

## Architektur

- Next.js mit App Router
- React + TypeScript
- mobile-first Client-App
- zentraler React-Store in `lib/store.tsx`
- lokale Persistenz im Browser
- PWA mit Manifest und Service Worker
- statisches Deployment über GitHub Pages
- keine Datenbank, kein Login, keine Broker- oder Orderintegration

Die genaue Versionslage aus `package.json` und dem aktuellen Code lesen; keine schnell veraltenden Framework-Versionen hier als dauerhafte Regel behandeln.

## Zentrale Bereiche

Die Anwendung umfasst insbesondere:

- Heute / Daily-Coach-Dashboard
- Situational Awareness / tägliche Routine
- Marktampel / Marktmodus
- SPY-/QQQ-Kontext und Leadership
- Kandidaten und Prozesslisten
- Scan Inbox
- ORB Assistant
- Journal
- Playbooks
- Einstellungen, Backup und Restore

Beim Ändern immer zuerst aktuelle Komponenten, Store-Shape und bestehende Tests prüfen. Funktions- oder Komponentennamen können sich ändern.

## Datenmodell und Persistenz

Der Zustand wird lokal im Browser gespeichert. Änderungen am Datenmodell müssen bestehende Nutzerdaten berücksichtigen.

Dauerhafte Regeln:

- Migrationen für bestehende lokale Daten vorsehen, wenn sich die Struktur ändert.
- Backup-/Restore-Format bei relevanten Schemaänderungen versionieren oder migrationsfähig halten.
- Keine stillen Datenverluste bei Tageswechseln, Listenmigrationen oder neuen Feldern.
- Lokale Daten nicht unnötig duplizieren.

## Produkt- und Sicherheitsgrenzen

- Keine Orderausführung oder Brokersteuerung ohne explizite neue Produktentscheidung.
- Keine automatischen Handelssignale als bestehende Funktion behaupten.
- Markt-, Earnings-, Volumen- oder Eventdaten nur dann automatisch befüllen, wenn eine verlässliche Quelle vorhanden ist; nichts raten.
- Unklare Tradingregeln nicht aus Entwicklerannahmen ableiten. Fachfragen nach `WAITING FOR ME` verschieben.
- Beispiel-/Demodaten müssen als solche erkennbar bleiben.
- Keine API-Keys, Tokens, Passwörter oder sonstige Secrets in Repo, Agent-Dateien oder Notion speichern.

## Fachliche Bereiche mit besonderem Schutz

### Marktampel

Die Marktampel ist aktuell ein zentraler, bewusst stark nutzergeführter Bestandteil. Eine Umstellung auf vollständig regelbasierte Logik benötigt explizit definierte objektive Kriterien und darf nicht implizit erfunden werden.

### ORB

Die vorhandene Long-ORB-Logik und Risikoberechnung nur mit den aktuellen Tests und dokumentierten Regeln verändern. Short-ORB, relatives Volumen und weitere Setups nur implementieren, wenn die fachlichen Regeln eindeutig geklärt sind.

### Watchlists und Prozesslisten

Die App dient als Prozess- und Entscheidungs-OS, nicht als Ersatz für spezialisiertes Charting. Bei Erweiterungen prüfen, ob ein Feld wirklich im OS gepflegt werden soll oder besser in TradingView/anderen Tools bleibt. Begründungen, Status und Workflow-Kontext sind der Mehrwert der App.

### Externe Links / iOS-PWA

Web-Apps können auf iOS nicht jede Übergabe an Safari oder native Apps erzwingen. Keine technische Garantie dokumentieren, wenn sie die Plattform nicht bietet. Fallbacks wie kopierbare URLs sind legitime Produktlösungen.

## Tests und Qualität

Vor Abschluss relevanter Änderungen grundsätzlich ausführen:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

- Neue oder behobene Logik nach Möglichkeit mit Regressionstests absichern.
- Keine feste Testanzahl als dauerhafte Agent-Regel dokumentieren.
- Änderungen an Persistenz, Tageswechsel, ORB-Berechnung und Navigation besonders auf Regressionen prüfen.
- Mobile Darstellung und PWA-Verhalten bei UI-relevanten Änderungen berücksichtigen.

## Deployment

Das Projekt wird statisch für GitHub Pages gebaut. Änderungen an `next.config.ts`, Base Path, Asset-Pfaden, Manifest oder Service Worker können die produktive PWA direkt beeinflussen und müssen entsprechend vorsichtig geprüft werden.

## Bestehende Dokumente

- `README.md` — menschlicher Überblick, Installation, Funktionen und Grenzen
- `docs/PROJECT.md` — dauerhafte technische Source of Truth
- `STATUS.md` — zeitgebundener MVP-/Status-Snapshot
- `UPDATES.md` — historische Änderungen
- `AGENTS.md` — kurze Codex-Arbeitsanweisung
- `CLAUDE.md` — kurze Claude-Code-Arbeitsanweisung

## Notion-Sync-Workflow

Der Befehl **„Notion Sync durchführen“** bedeutet:

1. `AGENTS.md` bzw. `CLAUDE.md` und dieses Dokument lesen.
2. Im Notion Product Hub primär `CURRENT STATE`, `INBOX`, `OPEN`, `WAITING FOR ME` und relevante `PRODUCT DECISIONS` lesen.
3. Alte Changelogs/Rohnotizen nur bei Bedarf lesen.
4. Neue Punkte gegen den aktuellen Code verifizieren.
5. Als Bug, Feature, Verbesserung, Frage oder notwendige Nutzerentscheidung klassifizieren.
6. Eindeutig definierte Änderungen möglichst klein implementieren; keine unnötigen Refactors.
7. `pnpm lint`, `pnpm typecheck`, `pnpm test` und `pnpm build` bzw. die für die Änderung relevanten Prüfungen ausführen.
8. Dieses Dokument nur aktualisieren, wenn sich dauerhafte Architektur, Datenmodell, Kernlogik, Plattformgrenzen, Test- oder Deploymentregeln ändern.
9. Notion aufräumen: Current State aktualisieren, erledigte Punkte abschließen, Entscheidungsbedarf nach `WAITING FOR ME`, Changelog kompakt ergänzen.
10. Abschließend Änderungen, Tests und offene Nutzerentscheidungen kurz berichten.
