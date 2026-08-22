export interface OrbInput { entry: number; lowOfDay: number; adr: number; riskBudget: number; first30MinutesComplete: boolean; candleClosedAboveRange: boolean; requirePriorDayHigh: boolean; priorDayHighExceeded: boolean; }
export interface OrbResult { distance: number; distancePercentAdr: number; stops: [number, number, number]; risksPerShare: [number, number, number]; weightedRiskPerShare: number; sharesPerTranche: [number, number, number]; totalShares: number; totalRisk: number; valid: boolean; reasons: string[]; }
const round = (value: number, digits = 2) => Number(value.toFixed(digits));

export function calculateOrb(input: OrbInput): OrbResult {
  const reasons: string[] = [];
  if (!(input.entry > input.lowOfDay)) reasons.push("Entry muss über dem Tagestief liegen");
  if (!(input.adr > 0)) reasons.push("ADR muss größer als 0 sein");
  if (!(input.riskBudget > 0)) reasons.push("Risikobudget muss größer als 0 sein");
  if (!input.first30MinutesComplete) reasons.push("Erste 30 Handelsminuten noch nicht beendet");
  if (!input.candleClosedAboveRange) reasons.push("Keine 5-Minuten-Kerze über dem Opening-Range-High geschlossen");
  if (input.requirePriorDayHigh && !input.priorDayHighExceeded) reasons.push("Vortageshoch noch nicht überschritten");
  const distance = Math.max(0, input.entry - input.lowOfDay);
  const distancePercentAdr = input.adr > 0 ? (distance / input.adr) * 100 : 0;
  if (distancePercentAdr > 66) reasons.push("Kein Trade – Move zu weit fortgeschritten");
  const stops: [number, number, number] = [input.lowOfDay, input.lowOfDay + distance / 3, input.lowOfDay + distance * 2 / 3].map(v => round(v)) as [number, number, number];
  const risksPerShare = stops.map(stop => round(Math.max(0, input.entry - stop))) as [number, number, number];
  const weightedRiskPerShare = round(risksPerShare.reduce((sum, risk) => sum + risk, 0) / 3);
  const trancheBudget = input.riskBudget / 3;
  const sharesPerTranche = risksPerShare.map(risk => risk > 0 ? Math.floor(trancheBudget / risk) : 0) as [number, number, number];
  const totalRisk = round(sharesPerTranche.reduce((sum, shares, i) => sum + shares * risksPerShare[i], 0));
  return { distance:round(distance), distancePercentAdr:round(distancePercentAdr, 1), stops, risksPerShare, weightedRiskPerShare, sharesPerTranche, totalShares:sharesPerTranche.reduce((a,b)=>a+b,0), totalRisk, valid:reasons.length === 0, reasons };
}

