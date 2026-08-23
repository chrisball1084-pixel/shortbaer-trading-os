import { describe, expect, it } from "vitest";
import { describeAge, firstOpenSection, normalizeTrafficLight, resolveDisplayLight, TRAFFIC_LIGHTS, toSnapshot } from "./market";
import { emptyMarket } from "./seed";
import type { MarketSnapshot } from "./types";

describe("Marktampel", () => {
  it("kennt fünf Stufen von tiefgrün bis tiefrot", () => {
    expect(TRAFFIC_LIGHTS.map(item => item.value)).toEqual(["deep-green", "green", "yellow", "red", "deep-red"]);
  });

  it("übernimmt alte dreistufige Stände unverändert", () => {
    expect(normalizeTrafficLight("green")).toBe("green");
    expect(normalizeTrafficLight("red")).toBe("red");
  });

  it("fällt bei unbekannten Werten auf Gelb zurück", () => {
    expect(normalizeTrafficLight("dunkelblau")).toBe("yellow");
    expect(normalizeTrafficLight(undefined)).toBe("yellow");
  });
});

describe("resolveDisplayLight", () => {
  const history: MarketSnapshot[] = [
    { date: "2026-08-21", trafficLight: "deep-green", breakoutQuality: "likely", arkkQqq: "leading", decided: false },
    { date: "2026-08-20", trafficLight: "red", breakoutQuality: "unlikely", arkkQqq: "lagging", decided: true }
  ];

  it("zeigt die heutige Ampel, sobald die Entscheidung festgelegt ist", () => {
    const market = { ...emptyMarket("2026-08-23"), trafficLight: "deep-red" as const };
    market.sectionsCompleted.decision = true;
    expect(resolveDisplayLight(market, history)).toEqual({ light: "deep-red", origin: "today", date: "2026-08-23" });
  });

  it("greift auf den letzten festgelegten Tag zurück, solange die Routine offen ist", () => {
    const resolved = resolveDisplayLight(emptyMarket("2026-08-23"), history);
    // Der 21. steht zwar vorn, wurde aber nie entschieden.
    expect(resolved).toEqual({ light: "red", origin: "history", date: "2026-08-20" });
  });

  it("meldet ohne jede Historie, dass noch nie etwas festgelegt wurde", () => {
    expect(resolveDisplayLight(emptyMarket("2026-08-23"), []).origin).toBe("none");
  });
});

describe("Routinefortschritt", () => {
  it("führt zum ersten offenen Schritt", () => {
    const market = emptyMarket("2026-08-23");
    market.sectionsCompleted.events = true;
    market.sectionsCompleted.indices = true;
    expect(firstOpenSection(market)).toBe("breadth");
  });

  it("bleibt bei vollständiger Routine beim ersten Schritt", () => {
    const market = emptyMarket("2026-08-23");
    Object.keys(market.sectionsCompleted).forEach(key => {
      market.sectionsCompleted[key as keyof typeof market.sectionsCompleted] = true;
    });
    expect(firstOpenSection(market)).toBe("events");
  });

  it("sichert den Tag als Snapshot", () => {
    const market = emptyMarket("2026-08-22");
    market.sectionsCompleted.decision = true;
    expect(toSnapshot(market)).toEqual({ date: "2026-08-22", trafficLight: "yellow", breakoutQuality: "unclear", arkkQqq: null, decided: true });
  });
});

describe("describeAge", () => {
  it("beschreibt Tage und Wochen in Alltagssprache", () => {
    expect(describeAge("2026-08-23", "2026-08-23")).toBe("heute festgelegt");
    expect(describeAge("2026-08-22", "2026-08-23")).toBe("Stand von gestern");
    expect(describeAge("2026-08-20", "2026-08-23")).toBe("Stand von vor 3 Tagen");
    expect(describeAge("2026-08-14", "2026-08-23")).toBe("Stand von letzter Woche");
    expect(describeAge(null, "2026-08-23")).toBe("noch nie festgelegt");
  });
});
