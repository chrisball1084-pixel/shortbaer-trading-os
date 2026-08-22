export type TrafficLight = "green" | "yellow" | "red";
export type Direction = "Long" | "Short";
export type CandidateList = "stock" | "bulls-nord" | "stalkers" | "fast-ready" | "watch-long" | "watch-short" | "top-dogs" | "focus-long" | "focus-short";
export type CandidateStatus = "aktiv" | "extended" | "Basisbildung" | "Trigger nahe" | "ausgeschlossen";
export type PricePosition = "above" | "below" | "at";
export type MaDirection = "rising" | "flat" | "falling";
export type RoutineSection = "events" | "indices" | "breadth" | "leadership" | "scans" | "research" | "decision" | "watchlists";
export type EventKey = "fomc" | "rates" | "cpi" | "ppi" | "earnings" | "none";
export type BreakoutQuality = "likely" | "selective" | "unlikely" | "unclear";

export interface MovingAverageCheck { position: PricePosition; direction: MaDirection; }
export interface IndexChecklist { ma10: MovingAverageCheck; ma20: MovingAverageCheck; ma50: MovingAverageCheck; }

export interface MarketAnalysis {
  date: string;
  trafficLight: TrafficLight;
  events: Record<EventKey, boolean>;
  indices: { SPY: IndexChecklist; QQQ: IndexChecklist };
  plus4Prev: number | null;
  minus4Prev: number | null;
  above20: number | null;
  above50: number | null;
  leadingEtfs: string[];
  scansChecked: string[];
  researchChecked: string[];
  breakoutQuality: BreakoutQuality;
  sectionsCompleted: Record<RoutineSection, boolean>;
}

export interface Candidate {
  id: string; ticker: string; company: string; direction: Direction; list: CandidateList;
  topDog: boolean; shortLeader: boolean; status: CandidateStatus; sector: string; group: string;
  theme: string; setup: string; source: string; fundamentals: string; earningsDate: string;
  trigger: number | null; entry: number | null; stop: number | null; tradingViewUrl: string; note: string;
  demo?: boolean;
}

export interface JournalEntry {
  id: string; date: string; ticker: string; direction: Direction;
  tradeType: "Daytrade" | "Swing" | "Day-to-Swing"; setup: string; trafficLight: TrafficLight;
  entry: number; exit: number; initialStop: number; positionSize: number; pnl: number; rMultiple: number;
  ruleCompliant: boolean; source: string; emotion: string; mistake: string; lesson: string;
  screenshotName?: string; demo?: boolean;
}

export interface Task { id: string; label: string; done: boolean; }
export interface AppData { market: MarketAnalysis; candidates: Candidate[]; journal: JournalEntry[]; tasks: Task[]; }

export const SOURCES = ["eigener TC2000-Scan", "TradingView", "Gapper", "Lone Stock Trader", "Jeff Sun", "TML Trader", "MoeTrading", "Will Hunting", "Ariel Hernandez", "sonstiges FinTwit"] as const;
export const SETUPS = ["30-Minuten Opening Range Breakout", "Moving-Average Reclaim / Pullback", "Monday High / Monday Low Sweep", "6/20 Entry", "Swing Breakout", "Pullback zum 20-Tage-Moving-Average"] as const;
export const ROUTINE_SECTIONS: RoutineSection[] = ["events", "indices", "breadth", "leadership", "scans", "research", "decision", "watchlists"];
export const SECTOR_ETFS = [
  { ticker:"XLC", label:"Communication" }, { ticker:"XLY", label:"Consumer Cyclical" },
  { ticker:"XLP", label:"Consumer Defensive" }, { ticker:"XLE", label:"Energy" },
  { ticker:"XLF", label:"Financials" }, { ticker:"XLV", label:"Health Care" },
  { ticker:"XLI", label:"Industrials" }, { ticker:"XLB", label:"Materials" },
  { ticker:"XLRE", label:"Real Estate" }, { ticker:"XLK", label:"Technology" },
  { ticker:"XLU", label:"Utilities" }
] as const;
export const INDEX_LINKS = {
  SPY: "https://www.tradingview.com/chart/?symbol=AMEX%3ASPY",
  QQQ: "https://www.tradingview.com/chart/?symbol=NASDAQ%3AQQQ"
} as const;
export const LEADERSHIP_LINKS = [
  { label:"Themes · 4 Wochen", url:"https://finviz.com/map?t=themes&st=w4" },
  { label:"Sektoren · Tagesperformance", url:"https://finviz.com/groups?g=sector&v=210&o=name&st=d1" }
] as const;
export const FINVIZ_SCANS = [
  { id:"near-52-week-high", label:"Near 52-Week High", hint:"0–10 % unter 52-Wochen-Hoch", url:"https://finviz.com/screener?v=111&f=cap_smallover%2Csh_price_o7%2Cta_averagetruerange_o3%2Cta_highlow52w_b0to10h%2Cta_sma20_pa%2Cta_sma200_pa%2Cta_sma50_pa&ft=3&o=-marketcap&preset=s151700304" },
  { id:"up-20-month", label:"Up 20 % Month", hint:"Mindestens 20 % in 4 Wochen", url:"https://finviz.com/screener?v=111&f=cap_smallover%2Csh_price_o7%2Cta_averagetruerange_o3%2Cta_perf_4w20o%2Cta_sma20_pa%2Cta_sma200_pa%2Cta_sma50_pa&ft=3&o=-marketcap&preset=s151700311" },
  { id:"up-30-quarter", label:"Up 30 % Quarter", hint:"Mindestens 30 % in 13 Wochen", url:"https://finviz.com/screener?v=111&f=cap_smallover%2Csh_price_o7%2Cta_averagetruerange_o3%2Cta_perf_13w30o%2Cta_sma20_pa%2Cta_sma200_pa%2Cta_sma50_pa&ft=3&o=-marketcap&preset=s151700311" }
] as const;
export const RESEARCH_SOURCES = [
  { id:"lone-stock-trader", label:"Lone Stock Trader", url:"https://x.com/LoneStockTrader", provisional:false },
  { id:"jeff-sun", label:"Jeff Sun", url:"https://x.com/jfsrev", provisional:false },
  { id:"tml-trader", label:"TML Trader", url:"https://x.com/TMLTrader", provisional:false },
  { id:"moe-trading", label:"MoeTrading", url:"https://x.com/search?q=MoeTrading&src=typed_query&f=user", provisional:true },
  { id:"will-hunting", label:"Will Hunting", url:"https://x.com/search?q=Will%20Hunting%20trader&src=typed_query&f=user", provisional:true },
  { id:"ariel-hernandez", label:"Ariel Hernandez", url:"https://x.com/RealSimpleAriel", provisional:false }
] as const;
