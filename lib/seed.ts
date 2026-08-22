import type { AppData } from "./types";

const today = new Date().toISOString().slice(0, 10);
export const seedData: AppData = {
  market: {
    date: today,
    trafficLight: "yellow",
    events: { fomc:false, rates:false, cpi:false, ppi:false, earnings:false, none:false },
    indices: {
      SPY: { ma10:{position:"at",direction:"flat"}, ma20:{position:"at",direction:"flat"}, ma50:{position:"at",direction:"flat"} },
      QQQ: { ma10:{position:"at",direction:"flat"}, ma20:{position:"at",direction:"flat"}, ma50:{position:"at",direction:"flat"} }
    },
    plus4Prev:null, minus4Prev:null, above20:null, above50:null,
    leadingEtfs:[], scansChecked:[], researchChecked:[], breakoutQuality:"unclear",
    sectionsCompleted: { events:false, indices:false, breadth:false, leadership:false, scans:false, research:false, decision:false, watchlists:false }
  },
  candidates: [
    { id:"demo-nvda", ticker:"NVDA", company:"NVIDIA Corp.", direction:"Long", list:"focus-long", topDog:true, shortLeader:false, status:"Trigger nahe", sector:"Technology", group:"Semiconductors", theme:"AI Infrastructure", setup:"30-Minuten Opening Range Breakout", source:"eigener TC2000-Scan", fundamentals:"DEMO – Fundamentals vor Trade prüfen", earningsDate:"", trigger:146.5, entry:null, stop:null, tradingViewUrl:"https://www.tradingview.com/chart/?symbol=NASDAQ%3ANVDA", note:"DEMO – nur Workflow-Beispiel", demo:true },
    { id:"demo-xle", ticker:"XLE", company:"Energy Select Sector SPDR", direction:"Long", list:"watch-long", topDog:false, shortLeader:false, status:"Basisbildung", sector:"Energy", group:"Sector ETF", theme:"Energy", setup:"Swing Breakout", source:"TradingView", fundamentals:"ETF", earningsDate:"", trigger:95.2, entry:null, stop:null, tradingViewUrl:"https://www.tradingview.com/chart/?symbol=AMEX%3AXLE", note:"DEMO", demo:true },
    { id:"demo-tsla", ticker:"TSLA", company:"Tesla, Inc.", direction:"Short", list:"stock", topDog:false, shortLeader:true, status:"aktiv", sector:"Consumer Cyclical", group:"Auto Manufacturers", theme:"EV", setup:"Moving-Average Reclaim / Pullback", source:"Gapper", fundamentals:"DEMO – noch zu prüfen", earningsDate:"", trigger:null, entry:null, stop:null, tradingViewUrl:"https://www.tradingview.com/chart/?symbol=NASDAQ%3ATSLA", note:"DEMO – Short-These noch zu definieren", demo:true }
  ],
  journal: [{ id:"demo-journal", date:today, ticker:"DEMO", direction:"Long", tradeType:"Daytrade", setup:"30-Minuten Opening Range Breakout", trafficLight:"yellow", entry:103, exit:105, initialStop:101, positionSize:100, pnl:200, rMultiple:1, ruleCompliant:true, source:"eigener TC2000-Scan", emotion:"Ruhig", mistake:"Keine", lesson:"DEMO – Prozess vor Ergebnis bewerten", demo:true }],
  tasks: [
    { id:"task-1", label:"Situational Awareness aktualisieren", done:false },
    { id:"task-2", label:"Scan Inbox triagieren", done:false },
    { id:"task-3", label:"Offene Trades reviewen", done:false }
  ]
};
