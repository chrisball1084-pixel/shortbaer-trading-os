"use client";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { emptyMarket, seedData } from "./seed";
import { completedSections, normalizeTrafficLight, todayIso, toSnapshot } from "./market";
import type { AppData, Candidate, CandidateList, JournalEntry, MarketAnalysis, MarketSnapshot, Task } from "./types";

const KEY = "shortbaer-trading-os-v1";
/** Rund ein Quartal Ampelhistorie reicht für den Rückblick und hält localStorage klein. */
const HISTORY_LIMIT = 90;

interface StoreValue {
  data: AppData;
  hydrated: boolean;
  /** Teilaktualisierung der Tagesanalyse; mehrere Änderungen im selben Tick gehen nicht verloren. */
  patchMarket: (part: Partial<MarketAnalysis>) => void;
  setCandidates: (items: Candidate[]) => void;
  addJournal: (entry: JournalEntry) => void;
  setTasks: (tasks: Task[]) => void;
  reset: () => void;
  exportData: () => string;
  importData: (raw: string) => boolean;
}
const StoreContext = createContext<StoreValue | null>(null);

/** Listennamen, die es in früheren Versionen gab. */
const LEGACY_LISTS: Record<string, CandidateList> = { "bulls-nord": "bullsnort" };

function migrateCandidate(candidate: Candidate): Candidate {
  const list = String(candidate.list);
  if (LEGACY_LISTS[list]) return { ...candidate, list: LEGACY_LISTS[list] };
  if (list === "watch") return { ...candidate, list: candidate.direction === "Short" ? "watch-short" : "watch-long" };
  if (list === "focus") return { ...candidate, list: candidate.direction === "Short" ? "focus-short" : "focus-long" };
  return candidate;
}

function normalizeData(value: unknown): AppData {
  if (!value || typeof value !== "object") return seedData;
  const raw = value as Partial<AppData>;
  const base = emptyMarket();
  const marketRaw = (raw.market && typeof raw.market === "object" ? raw.market : {}) as Partial<MarketAnalysis>;
  const market: MarketAnalysis = {
    ...base,
    ...marketRaw,
    date: typeof marketRaw.date === "string" ? marketRaw.date : base.date,
    trafficLight: normalizeTrafficLight(marketRaw.trafficLight),
    events: { ...base.events, ...(marketRaw.events ?? {}) },
    indices: {
      SPY: { ...base.indices.SPY, ...(marketRaw.indices?.SPY ?? {}) },
      QQQ: { ...base.indices.QQQ, ...(marketRaw.indices?.QQQ ?? {}) }
    },
    sectionsCompleted: { ...base.sectionsCompleted, ...(marketRaw.sectionsCompleted ?? {}) },
    arkkQqq: marketRaw.arkkQqq ?? null,
    leadingEtfs: Array.isArray(marketRaw.leadingEtfs) ? marketRaw.leadingEtfs : [],
    leadingGroups: Array.isArray(marketRaw.leadingGroups) ? marketRaw.leadingGroups : [],
    scansChecked: Array.isArray(marketRaw.scansChecked) ? marketRaw.scansChecked : [],
    researchChecked: Array.isArray(marketRaw.researchChecked) ? marketRaw.researchChecked : []
  };
  const history = (Array.isArray(raw.history) ? raw.history : [])
    .filter((entry): entry is MarketSnapshot => Boolean(entry) && typeof entry.date === "string")
    .map(entry => ({ ...entry, trafficLight: normalizeTrafficLight(entry.trafficLight) }));
  const candidates = (Array.isArray(raw.candidates) ? raw.candidates : seedData.candidates).map(migrateCandidate);
  const journal = (Array.isArray(raw.journal) ? raw.journal : seedData.journal)
    .map(entry => ({ ...entry, trafficLight: normalizeTrafficLight(entry.trafficLight) }));
  return { market, history, candidates, journal, tasks: Array.isArray(raw.tasks) ? raw.tasks : seedData.tasks };
}

/**
 * Tageswechsel: Der abgelaufene Tag wandert in die Historie, der neue startet leer.
 * Ohne das blieben Häkchen der Vortagesroutine dauerhaft gesetzt.
 */
function rollOver(data: AppData, today: string = todayIso()): AppData {
  if (data.market.date === today) return data;
  const worthKeeping = completedSections(data.market) > 0;
  const history = worthKeeping ? [toSnapshot(data.market), ...data.history].slice(0, HISTORY_LIMIT) : data.history;
  // Die zuletzt gewählte Ampel bleibt als Ausgangspunkt stehen, gilt aber erst nach neuer Entscheidung.
  return { ...data, market: { ...emptyMarket(today), trafficLight: data.market.trafficLight }, history };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(seedData);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = localStorage.getItem(KEY);
        if (saved) setData(rollOver(normalizeData(JSON.parse(saved))));
      } catch {
        // Beschädigter oder gesperrter Speicher: Die App startet mit Seed-Daten.
      } finally {
        setHydrated(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  // Wer die PWA über Nacht offen lässt, bekommt beim Zurückkehren trotzdem einen frischen Tag.
  useEffect(() => {
    const onVisible = () => { if (document.visibilityState === "visible") setData(current => rollOver(current)); };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  useEffect(() => { if (hydrated) localStorage.setItem(KEY, JSON.stringify(data)); }, [data, hydrated]);

  const update = useCallback((part: Partial<AppData>) => setData(old => ({ ...old, ...part })), []);
  const value: StoreValue = {
    data,
    hydrated,
    patchMarket: part => setData(old => ({ ...old, market: { ...old.market, ...part } })),
    setCandidates: candidates => update({ candidates }),
    addJournal: entry => setData(old => ({ ...old, journal: [entry, ...old.journal] })),
    setTasks: tasks => update({ tasks }),
    reset: () => setData(seedData),
    exportData: () => JSON.stringify(data, null, 2),
    importData: raw => {
      try {
        const next = normalizeData(JSON.parse(raw));
        if (!next.market || !Array.isArray(next.candidates) || !Array.isArray(next.journal)) return false;
        setData(rollOver(next));
        return true;
      } catch {
        return false;
      }
    }
  };
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("StoreProvider fehlt");
  return value;
}
