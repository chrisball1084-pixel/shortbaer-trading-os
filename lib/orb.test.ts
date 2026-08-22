import { describe, expect, it } from "vitest";
import { calculateOrb } from "./orb";

const validInput = { entry:103, lowOfDay:100, adr:6, riskBudget:300, first30MinutesComplete:true, candleClosedAboveRange:true, requirePriorDayHigh:false, priorDayHighExceeded:false };
describe("calculateOrb", () => {
  it("berechnet Distanz, Stops und Risiko des Beispiels", () => {
    const result = calculateOrb(validInput);
    expect(result.distance).toBe(3);
    expect(result.distancePercentAdr).toBe(50);
    expect(result.stops).toEqual([100, 101, 102]);
    expect(result.weightedRiskPerShare).toBe(2);
    expect(result.valid).toBe(true);
    expect(result.totalRisk).toBeLessThanOrEqual(300);
  });
  it("lehnt Moves über 66 Prozent ADR ab", () => {
    const result = calculateOrb({ ...validInput, adr:4 });
    expect(result.distancePercentAdr).toBe(75);
    expect(result.valid).toBe(false);
    expect(result.reasons).toContain("Kein Trade – Move zu weit fortgeschritten");
  });
  it("erzwingt das Vortageshoch nur bei aktivierter Option", () => {
    expect(calculateOrb({ ...validInput, requirePriorDayHigh:true }).valid).toBe(false);
    expect(calculateOrb({ ...validInput, requirePriorDayHigh:false }).valid).toBe(true);
  });
  it("validiert die zeitlichen Entry-Bedingungen", () => {
    const result = calculateOrb({ ...validInput, first30MinutesComplete:false, candleClosedAboveRange:false });
    expect(result.valid).toBe(false);
    expect(result.reasons).toHaveLength(2);
  });
});

