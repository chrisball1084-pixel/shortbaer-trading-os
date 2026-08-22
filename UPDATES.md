# ShortBär Trading App – Änderungsdokument

Stand: 2. August 2026

Dieses Dokument führt die vom Nutzer ursprünglich in Notion gepflegte Notiz
„ShortBär Trading App Updates“ im Projekt nachvollziehbar fort.

## Umgesetzt

- TradingView-Direktlinks für SPY und QQQ in der Situational-Awareness-Routine
- Finviz-Direktlinks für Themes und Sektor-Performance bei Leadership & Relative Strength
- eigener Routinen-Schritt „Finviz Momentum Scans“ mit:
  - Near 52-Week High
  - Up 20 % Month
  - Up 30 % Quarter
- X-Research-Accounts als öffnende Links mit getrennten lokalen Erledigt-Haken
- Listenstruktur erweitert auf:
  - Stock List
  - Watchlist Long
  - Watchlist Short
  - Top Dogs
  - Focus Long
  - Focus Short
- Scan Inbox kann Ticker direkt einer dieser Listen und der passenden Richtung zuordnen
- defensive Migration bestehender `watch`- und `focus`-Einträge anhand ihrer Richtung

## Vorläufig

- Die Profile von MoeTrading und Will Hunting waren anhand der Anzeigenamen nicht
  eindeutig verifizierbar. Bis die exakten Handles vorliegen, führen die Links zu
  einer als vorläufig gekennzeichneten X-Profilsuche.

## Grundsatz

Alle TradingView-, Finviz- und X-Verknüpfungen sind reine ausgehende
Recherchelinks. Die App liest keine Live-Daten ein und leitet daraus keine Signale ab.
