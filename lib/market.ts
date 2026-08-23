import type { MarketAnalysis, MarketSnapshot, RoutineSection, TrafficLight } from "./types";
import { ROUTINE_SECTIONS } from "./types";

export interface TrafficLightMeta {
  value: TrafficLight;
  /** Kurzname der Stufe, wie er in Karten und Chips erscheint. */
  label: string;
  /** Handelsmodus, den diese Stufe vorgibt. */
  mode: string;
  /** Ein Satz, der die Stufe im Alltag greifbar macht. */
  hint: string;
  /** Farbfamilie für Badges, die nur drei Töne kennen. */
  tone: "green" | "yellow" | "red";
}

/** Fünf Stufen statt drei: Grün und Rot bekommen je eine stärkere Ausprägung. */
export const TRAFFIC_LIGHTS: TrafficLightMeta[] = [
  { value:"deep-green", label:"Tiefgrün", mode:"Full Bull", hint:"Breite Marktteilnahme, volle Swing-Größe vertretbar.", tone:"green" },
  { value:"green", label:"Grün", mode:"Vorsichtig Swing", hint:"Swing-Setups ja, aber selektiv und mit reduzierter Größe.", tone:"green" },
  { value:"yellow", label:"Gelb", mode:"Nur Daytrades", hint:"Übergang oder Risk-off. Intraday handeln, nichts über Nacht.", tone:"yellow" },
  { value:"red", label:"Rot", mode:"Vorsichtig bärisch", hint:"Long-Setups meiden, Shorts nur bei klarer Schwäche.", tone:"red" },
  { value:"deep-red", label:"Tiefrot", mode:"Aggressiv bärisch",  hint:"Bärenmarkt-Charakter. Short-Fokus oder Cash.", tone:"red" }
];

const BY_VALUE = new Map(TRAFFIC_LIGHTS.map(item => [item.value, item]));

export function lightMeta(value: TrafficLight): TrafficLightMeta {
  return BY_VALUE.get(value) ?? BY_VALUE.get("yellow")!;
}

/** Alte dreistufige Stände bleiben gültig; unbekannte Werte fallen auf Gelb zurück. */
export function normalizeTrafficLight(value: unknown): TrafficLight {
  if (typeof value === "string" && BY_VALUE.has(value as TrafficLight)) return value as TrafficLight;
  return "yellow";
}

export function todayIso(now: Date = new Date()): string {
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

export function completedSections(market: MarketAnalysis): number {
  return ROUTINE_SECTIONS.filter(key => market.sectionsCompleted[key]).length;
}

/** Erster noch offener Schritt – Ziel für „Routine fortsetzen“. */
export function firstOpenSection(market: MarketAnalysis): RoutineSection {
  return ROUTINE_SECTIONS.find(key => !market.sectionsCompleted[key]) ?? ROUTINE_SECTIONS[0];
}

export function toSnapshot(market: MarketAnalysis): MarketSnapshot {
  return {
    date: market.date,
    trafficLight: market.trafficLight,
    breakoutQuality: market.breakoutQuality,
    arkkQqq: market.arkkQqq,
    decided: market.sectionsCompleted.decision
  };
}

export interface ResolvedLight {
  light: TrafficLight;
  /** "today" = heute festgelegt, "history" = letzter abgeschlossener Tag, "none" = noch nie festgelegt. */
  origin: "today" | "history" | "none";
  date: string | null;
}

/**
 * Welche Ampel gehört auf die Startseite? Solange die heutige Entscheidung fehlt,
 * zeigt die App den letzten festgelegten Stand statt eines leeren Platzhalters.
 */
export function resolveDisplayLight(market: MarketAnalysis, history: MarketSnapshot[]): ResolvedLight {
  if (market.sectionsCompleted.decision) return { light: market.trafficLight, origin: "today", date: market.date };
  const last = history.find(entry => entry.decided);
  if (last) return { light: last.trafficLight, origin: "history", date: last.date };
  return { light: market.trafficLight, origin: "none", date: null };
}

/** „gestern“, „vor 3 Tagen“, „vor 2 Wochen“ – kurze Einordnung des Ampelstands. */
export function describeAge(date: string | null, today: string = todayIso()): string {
  if (!date) return "noch nie festgelegt";
  const days = Math.round((Date.parse(today) - Date.parse(date)) / 86400000);
  if (!Number.isFinite(days) || days < 0) return "aktueller Stand";
  if (days === 0) return "heute festgelegt";
  if (days === 1) return "Stand von gestern";
  if (days < 7) return `Stand von vor ${days} Tagen`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? "Stand von letzter Woche" : `Stand von vor ${weeks} Wochen`;
}
