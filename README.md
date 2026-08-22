# ShortBär Trading OS

> **System statt Intuition.** Ein persönliches, mobiles Trading-Journal und Workflow-OS für Situational Awareness, Kandidaten, Planung und Review.

![Mobile Vorschau](./shortbaer-mobile-preview.png)

## Status

Dies ist der erste funktionierende MVP. Er führt **keine Orders aus**, verbindet sich mit **keinem Broker** und erzeugt **keine automatischen Handelssignale**. Alle enthaltenen Beispielwerte sind deutlich als `DEMO` markiert und stellen keine aktuellen Börsendaten dar.

## Funktionen

- **Heute:** Daily-Coach-Dashboard mit persönlicher Tagesansprache, Fortschritt, sechs Prozessschritten, Marktmodus sowie Focus Long und Focus Short.
- **Situational Awareness:** geführte Daily Routine mit Eventauswahl, separater SPY-/QQQ-MA-Matrix, korrekt benannter Vortags-Marktbreite, ETF-Leadership, Research-Checks und manueller Marktentscheidung.
- **Kandidaten:** Stock List, Watchlist und Focus List; Long/Short, Top Dog, Short Leader, Status, Setup, Trigger und Research-Felder.
- **Scan Inbox:** Copy-and-paste mit Kommas, Leerzeichen oder Zeilenumbrüchen, Bereinigung, Deduplizierung, schnelle Triage und TradingView-Text-Export.
- **ORB Assistant:** Long-Setup-Check, 66-%-ADR-Grenze, drei Stop-Tranchen, gewichtetes Risiko, Stückzahlen und Gesamtrisiko.
- **Journal:** automatische P&L-/R-Berechnung, Regelkonformität und Vier-Felder-Bewertung.
- **Playbooks:** sechs vorbereitete Setup-Karten, deren fachliche Inhalte noch zu definieren sind.
- **Einstellungen:** lokales JSON-Backup, Restore, Demo-Reset und Installationshinweis.

## Architektur

- **Next.js 16 / React 19 / TypeScript**, App Router
- Mobile-first Client-App; die UI-Bereiche werden ohne URL-Wechsel in einer App-Shell dargestellt
- Zentraler React-Store in `lib/store.tsx`
- Persistenz ausschließlich in Browser-`localStorage` unter `shortbaer-trading-os-v1`
- Reine, separat getestete ORB-Berechnungslogik in `lib/orb.ts`
- PWA-Manifest über Next.js plus kleiner eigener Network-first Service Worker
- Keine Datenbank, kein Login, keine Server-API, keine kostenpflichtigen Dienste

Diese Architektur ist für Version 1 bewusst einfach. Bei späterer Nutzung auf mehreren Geräten wäre eine lokale IndexedDB-Migration und erst danach eine optionale, verschlüsselte Synchronisation sinnvoll.

## Installation und Start

Voraussetzung: Node.js 20.9 oder neuer und pnpm.

```bash
pnpm install
pnpm dev
```

Danach [http://localhost:3000](http://localhost:3000) öffnen.

Produktionsmodus:

```bash
pnpm build
pnpm start
```

## Qualitätsprüfungen

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Die ORB-Tests prüfen das dokumentierte 100/103-Beispiel, die 66-%-ADR-Grenze, den optionalen Vortageshoch-Filter sowie die zeitlichen Entry-Bedingungen.

## Installation auf dem iPhone

1. Eine per HTTPS erreichbare produktive Instanz in Safari öffnen.
2. Auf **Teilen** tippen.
3. **Zum Home-Bildschirm** auswählen.

Das Manifest, App-Icon, Standalone-Layout und der Service Worker sind vorhanden. `localhost` funktioniert für Entwicklung; eine echte iPhone-Installation benötigt ein HTTPS-Deployment.

## Daten und Backup

Die App speichert Daten nur im aktuell verwendeten Browser. Browserdaten zu löschen entfernt auch das Journal. Unter **Einstellungen → Backup exportieren** deshalb regelmäßig eine JSON-Sicherung erstellen. Ein Export kann dort wieder importiert werden.

## Bekannte Grenzen

- Keine echte Markt-, Earnings- oder Volumendaten; Angaben werden manuell gepflegt.
- Die Daily Routine speichert aktuell nur den heutigen Zustand, noch keine historische Zeitreihe.
- Die 20-/50-Tage-Breadth-Felder und das Sektor-ETF-Universum bleiben bis zum Abgleich mit dem originalen Jeff-Sun-Sheet vorläufig.
- Keine IBKR-, TC2000-, TradingView- oder X-Integration.
- Nur Long-ORB-Berechnung; Short-ORB-Regeln sind noch nicht definiert.
- Relatives Volumen wird nur als Qualitätskriterium erwähnt, noch nicht berechnet.
- Marktampel und Tradingregeln sind teilweise ausdrücklich **vorläufig**.
- Screenshot-Feld im Journal ist ein Platzhalter.
- Playbook-Inhalte sind noch zu definieren.
- Keine Geräte-Synchronisation und keine Mehrbenutzerfähigkeit.
- Der einfache Service Worker ersetzt kein umfassend getestetes Offline-Synchronisationskonzept.

## Nächste sinnvolle Schritte

1. Den MVP zwei bis vier Wochen im echten Tagesprozess verwenden.
2. ORB-Regeln und Playbooks anhand realer Reviews fachlich finalisieren.
3. Datenexport-Schema versionieren und Screenshot-Speicherung über IndexedDB ergänzen.
4. Erst danach über optionale Cloud-Synchronisation oder Scanner-Import nachdenken.

Weitere Details stehen in [STATUS.md](./STATUS.md). Projektregeln für Mitwirkende stehen in [AGENTS.md](./AGENTS.md).
