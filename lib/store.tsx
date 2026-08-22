"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { seedData } from "./seed";
import type { AppData, Candidate, JournalEntry, MarketAnalysis, Task } from "./types";

const KEY = "shortbaer-trading-os-v1";
interface StoreValue { data: AppData; hydrated: boolean; updateMarket:(market:MarketAnalysis)=>void; setCandidates:(items:Candidate[])=>void; addJournal:(entry:JournalEntry)=>void; setTasks:(tasks:Task[])=>void; reset:()=>void; exportData:()=>string; importData:(raw:string)=>boolean; }
const StoreContext = createContext<StoreValue | null>(null);

function normalizeData(value:unknown):AppData {
  if(!value || typeof value!=="object") return seedData;
  const raw=value as Partial<AppData>;
  const marketRaw=(raw.market && typeof raw.market==="object" ? raw.market : {}) as Partial<MarketAnalysis>;
  const market:MarketAnalysis={
    ...seedData.market,
    ...marketRaw,
    events:{...seedData.market.events,...(marketRaw.events??{})},
    indices:{
      SPY:{...seedData.market.indices.SPY,...(marketRaw.indices?.SPY??{})},
      QQQ:{...seedData.market.indices.QQQ,...(marketRaw.indices?.QQQ??{})}
    },
    sectionsCompleted:{...seedData.market.sectionsCompleted,...(marketRaw.sectionsCompleted??{})},
    leadingEtfs:Array.isArray(marketRaw.leadingEtfs)?marketRaw.leadingEtfs:[],
    scansChecked:Array.isArray(marketRaw.scansChecked)?marketRaw.scansChecked:[],
    researchChecked:Array.isArray(marketRaw.researchChecked)?marketRaw.researchChecked:[]
  };
  const candidates=(Array.isArray(raw.candidates)?raw.candidates:seedData.candidates).map(candidate=>{
    const legacyList=String(candidate.list);
    if(legacyList==="watch") return {...candidate,list:candidate.direction==="Short"?"watch-short":"watch-long"} as Candidate;
    if(legacyList==="focus") return {...candidate,list:candidate.direction==="Short"?"focus-short":"focus-long"} as Candidate;
    return candidate;
  });
  return { market, candidates, journal:Array.isArray(raw.journal)?raw.journal:seedData.journal, tasks:Array.isArray(raw.tasks)?raw.tasks:seedData.tasks };
}

export function StoreProvider({ children }:{ children:ReactNode }) {
  const [data, setData] = useState<AppData>(seedData);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { const timer=window.setTimeout(()=>{ try { const saved=localStorage.getItem(KEY); if(saved) setData(normalizeData(JSON.parse(saved))); } catch {} finally { setHydrated(true); } },0); return ()=>window.clearTimeout(timer); }, []);
  useEffect(() => { if(hydrated) localStorage.setItem(KEY, JSON.stringify(data)); }, [data, hydrated]);
  const update = (part:Partial<AppData>) => setData(old => ({...old,...part}));
  return <StoreContext.Provider value={{ data, hydrated, updateMarket:market=>update({market}), setCandidates:candidates=>update({candidates}), addJournal:entry=>update({journal:[entry,...data.journal]}), setTasks:tasks=>update({tasks}), reset:()=>setData(seedData), exportData:()=>JSON.stringify(data,null,2), importData:raw=>{ try { const next=normalizeData(JSON.parse(raw)); if(!next.market || !Array.isArray(next.candidates) || !Array.isArray(next.journal)) return false; setData(next); return true; } catch { return false; } } }}>{children}</StoreContext.Provider>;
}
export function useStore(){ const value=useContext(StoreContext); if(!value) throw new Error("StoreProvider fehlt"); return value; }
