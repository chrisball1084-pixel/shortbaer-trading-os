"use client";
import { useEffect, useRef, useState } from "react";
import { BarChart3, CalendarDays, Check, ChevronRight, CircleCheck, ExternalLink, Gauge, LineChart, ListChecks, Radar, SearchCheck, ShieldAlert, Sparkles, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { TRAFFIC_LIGHTS } from "@/lib/market";
import { ARKK_QQQ_LINK, EVENT_CALENDAR_LINKS, FINVIZ_SCANS, GROUP_ETFS, INDEX_LINKS, LEADERSHIP_LINKS, MAX_LEADING_GROUPS, MAX_LEADING_SECTORS, RESEARCH_SOURCES, ROUTINE_SECTIONS, SECTOR_ETFS, SKYWALKER_RS_APP, type BreakoutQuality, type CandidateList, type EventKey, type MaDirection, type MarketAnalysis, type PricePosition, type RelativeTrend, type RoutineSection } from "@/lib/types";
import { ExternalAnchor } from "../external-link";
import { Badge, Card, Field, Input, PageHeader } from "../ui";
import type { SectionTarget } from "@/app/page";

const sectionLabels:Record<RoutineSection,string>={events:"Events",indices:"Indizes",breadth:"Marktmonitor",leadership:"Leadership",scans:"Scans",research:"Research",decision:"Entscheidung",watchlists:"Watchlisten"};
const eventOptions:{key:EventKey;label:string;hint:string}[]=[
 {key:"fomc",label:"FOMC",hint:"Sitzung / Minutes"},{key:"rates",label:"Zinsentscheid",hint:"Fed-Zinsentscheidung"},
 {key:"cpi",label:"CPI",hint:"Verbraucherpreise"},{key:"ppi",label:"PPI",hint:"Erzeugerpreise"},
 {key:"earnings",label:"Quartalsberichte",hint:"Relevante Earnings"},{key:"none",label:"Kein Event",hint:"Heute nichts Relevantes"}
];
const positions:{value:PricePosition;label:string}[]=[{value:"above",label:"darüber"},{value:"at",label:"am MA"},{value:"below",label:"darunter"}];
const directions:{value:MaDirection;label:string}[]=[{value:"rising",label:"steigt"},{value:"flat",label:"flach"},{value:"falling",label:"fällt"}];
const ratioOptions:{value:RelativeTrend;label:string;hint:string}[]=[
 {value:"leading",label:"ARKK führt",hint:"Growth und Risk-on"},
 {value:"neutral",label:"seitwärts",hint:"kein klares Regime"},
 {value:"lagging",label:"ARKK hinkt",hint:"Risk-off, defensiv"}
];
const qualityLabels:Record<BreakoutQuality,string>={likely:"Wahrscheinlich",selective:"Selektiv",unlikely:"Unwahrscheinlich",unclear:"Unklar"};

function StepHeader({number,icon:Icon,title,subtitle,done}:{number:number;icon:typeof CalendarDays;title:string;subtitle:string;done:boolean}){
 return <div className="coach-step-header"><span className={done?"done":""}>{done?<Check size={15}/>:number}</span><div className="coach-step-icon"><Icon size={19}/></div><div><h2>{title}</h2><p>{subtitle}</p></div>{done&&<Badge tone="green">erledigt</Badge>}</div>;
}

export function AwarenessView({target,onOpenList}:{target?:SectionTarget;onOpenList:(list:CandidateList)=>void}){
 const {data,patchMarket}=useStore();
 // Der Store ist die einzige Quelle der Wahrheit; ein lokaler Formularzustand würde nur veralten.
 const form=data.market;
 const [groupDraft,setGroupDraft]=useState("");
 const completed=ROUTINE_SECTIONS.filter(key=>form.sectionsCompleted[key]).length;

 // Wer aus „Heute“ auf einen Schritt tippt, soll bei genau diesem Schritt landen – nicht ganz oben.
 const nonce=target?.nonce;
 const section=target?.section;
 const scrolled=useRef<number|undefined>(undefined);
 useEffect(()=>{
  if(!section||scrolled.current===nonce)return;
  scrolled.current=nonce;
  // Erst nach dem Layout springen; der Abstand zur Kopfzeile steckt in scroll-margin-top.
  const frame=requestAnimationFrame(()=>document.getElementById(`step-${section}`)?.scrollIntoView({behavior:"smooth",block:"start"}));
  return ()=>cancelAnimationFrame(frame);
 },[section,nonce]);

 const watchlistFlow:[CandidateList,string,string][]=[
  ["bullsnort","BullSnort","Earnings-Gappers der Woche"],
  ["stalkers","Stalkers List","Werte unter laufender Beobachtung"],
  ["fast-ready","Fast Ready","Setups kurz vor der Handelsreife"],
  ["focus-long","Focus Long","Konkrete Long-Setups für heute"],
  ["focus-short","Focus Short","Konkrete Short-Setups für heute"]
 ];
 const set=<K extends keyof MarketAnalysis>(key:K,value:MarketAnalysis[K])=>patchMarket({[key]:value} as Pick<MarketAnalysis,K>);
 const complete=(key:RoutineSection)=>set("sectionsCompleted",{...form.sectionsCompleted,[key]:!form.sectionsCompleted[key]});
 const toggleEvent=(key:EventKey)=>{const events={...form.events};if(key==="none"){Object.keys(events).forEach(item=>events[item as EventKey]=false);events.none=true}else{events.none=false;events[key]=!events[key]}set("events",events)};
 const updateMa=(index:"SPY"|"QQQ",ma:"ma10"|"ma20"|"ma50",field:"position"|"direction",value:PricePosition|MaDirection)=>set("indices",{...form.indices,[index]:{...form.indices[index],[ma]:{...form.indices[index][ma],[field]:value}}});
 const toggleList=(key:"leadingEtfs"|"scansChecked"|"researchChecked",value:string)=>set(key,form[key].includes(value)?form[key].filter(x=>x!==value):[...form[key],value]);
 const toggleGroup=(value:string)=>{
  const ticker=value.trim().toUpperCase();
  if(!ticker)return;
  if(form.leadingGroups.includes(ticker)){set("leadingGroups",form.leadingGroups.filter(x=>x!==ticker));return}
  set("leadingGroups",[...form.leadingGroups,ticker]);
 };

 return <div className="page coach-routine-page">
  <PageHeader eyebrow="GEFÜHRTE MARKTVORBEREITUNG" title="Daily Routine" description="Acht kurze Schritte. Keine Marktprognose, sondern ein verbindlicher Prozess." action={<div className="routine-score"><strong>{completed}/{ROUTINE_SECTIONS.length}</strong><span>erledigt</span></div>}/>
  <div className="routine-progress"><span style={{width:`${completed/ROUTINE_SECTIONS.length*100}%`}}/></div>
  <nav className="routine-mini-nav">{ROUTINE_SECTIONS.map((key,index)=><a key={key} href={`#step-${key}`} className={form.sectionsCompleted[key]?"done":""}><span>{form.sectionsCompleted[key]?<Check size={11}/>:index+1}</span>{sectionLabels[key]}</a>)}</nav>

  <div className="coach-step-list">
   <Card id="step-events" className="coach-step">
    <StepHeader number={1} icon={CalendarDays} title="Eventrisiko" subtitle="Was kann heute Zeit und Volatilität diktieren?" done={form.sectionsCompleted.events}/>
    <div className="external-resource-grid">{EVENT_CALENDAR_LINKS.map(item=><ExternalAnchor className="external-resource" key={item.url} href={item.url}><span><strong>{item.label}</strong><small>{item.hint}</small></span><ExternalLink size={17}/></ExternalAnchor>)}</div>
    <div className="option-grid events-grid">{eventOptions.map(item=><button key={item.key} className={form.events[item.key]?"selected":""} onClick={()=>toggleEvent(item.key)}><span className="option-check">{form.events[item.key]&&<Check size={14}/>}</span><strong>{item.label}</strong><small>{item.hint}</small></button>)}</div>
    <p className="microcopy">Termine werden bewusst manuell gesetzt. Die App liest keine Kalenderdaten ein und behauptet daher nie einen Termin, den es nicht gibt.</p>
    <StepComplete done={form.sectionsCompleted.events} onClick={()=>complete("events")}/>
   </Card>

   <Card id="step-indices" className="coach-step">
    <StepHeader number={2} icon={LineChart} title="SPY & QQQ" subtitle="Kurslage und Richtung jedes Key Moving Average separat prüfen." done={form.sectionsCompleted.indices}/>
    <div className="index-checks">{(["SPY","QQQ"] as const).map(index=><div className="index-coach-card" key={index}>
     <div className="index-name"><div><strong>{index}</strong><span>{index==="SPY"?"S&P 500":"Nasdaq 100"}</span></div><ExternalAnchor className="research-link compact-link" href={INDEX_LINKS[index]}>Chart <ExternalLink size={13}/></ExternalAnchor></div>
     {(["ma10","ma20","ma50"] as const).map(ma=><div className="ma-check" key={ma}>
      <div className="ma-name">{ma==="ma10"?"10-SMA":ma==="ma20"?"20-EMA":"50-SMA"}</div>
      <div className="segmented compact-segments">{positions.map(option=><button key={option.value} className={form.indices[index][ma].position===option.value?option.value:""} onClick={()=>updateMa(index,ma,"position",option.value)}>{option.label}</button>)}</div>
      <div className="segmented compact-segments">{directions.map(option=><button key={option.value} className={form.indices[index][ma].direction===option.value?option.value:""} onClick={()=>updateMa(index,ma,"direction",option.value)}>{option.label}</button>)}</div>
     </div>)}
    </div>)}</div>
    <div className="ratio-check">
     <div className="ratio-head"><div><strong>ARKK / QQQ</strong><small>Growth- und Risk-on-Barometer</small></div><ExternalAnchor className="research-link compact-link" href={ARKK_QQQ_LINK}>Ratio-Chart <ExternalLink size={13}/></ExternalAnchor></div>
     <div className="ratio-choice">{ratioOptions.map(option=><button key={option.value} className={form.arkkQqq===option.value?`selected ${option.value}`:""} onClick={()=>set("arkkQqq",form.arkkQqq===option.value?null:option.value)}><strong>{option.label}</strong><small>{option.hint}</small></button>)}</div>
    </div>
    <StepComplete done={form.sectionsCompleted.indices} onClick={()=>complete("indices")}/>
   </Card>

   <Card id="step-breadth" className="coach-step">
    <StepHeader number={3} icon={BarChart3} title="Marktmonitor" subtitle="Teilnahme und Expansion des Vortags erfassen." done={form.sectionsCompleted.breadth}/>
    <div className="breadth-inputs">
     <Field label="+4 % Breakouts · Vortag"><Input inputMode="numeric" type="number" min="0" placeholder="Anzahl" value={form.plus4Prev??""} onChange={e=>set("plus4Prev",e.target.value===""?null:Number(e.target.value))}/></Field>
     <Field label="−4 % Breakdowns · Vortag"><Input inputMode="numeric" type="number" min="0" placeholder="Anzahl" value={form.minus4Prev??""} onChange={e=>set("minus4Prev",e.target.value===""?null:Number(e.target.value))}/></Field>
     <Field label="US-Aktien über 20-Tage-MA"><div className="suffix-input"><Input inputMode="decimal" type="number" min="0" max="100" placeholder="Optional" value={form.above20??""} onChange={e=>set("above20",e.target.value===""?null:Number(e.target.value))}/><span>%</span></div></Field>
     <Field label="US-Aktien über 50-Tage-MA"><div className="suffix-input"><Input inputMode="decimal" type="number" min="0" max="100" placeholder="Optional" value={form.above50??""} onChange={e=>set("above50",e.target.value===""?null:Number(e.target.value))}/><span>%</span></div></Field>
    </div>
    <div className="provisional"><ShieldAlert size={16}/><span>20-/50-Tage-Breadth ist vorläufig, bis das exakte Jeff-Sun-Sheet abgeglichen wurde.</span></div>
    <StepComplete done={form.sectionsCompleted.breadth} onClick={()=>complete("breadth")}/>
   </Card>

   <Card id="step-leadership" className="coach-step">
    <StepHeader number={4} icon={Sparkles} title="Leadership & Relative Strength" subtitle="RS-App öffnen, führende Sektoren eingrenzen und die stärksten Gruppen festhalten." done={form.sectionsCompleted.leadership}/>
    <ExternalAnchor className="external-resource primary-resource" href={SKYWALKER_RS_APP}><span><strong>Skywalker RS App öffnen</strong><small>Relative Stärke je Sektor und Gruppe</small></span><ExternalLink size={17}/></ExternalAnchor>
    <div className="external-resource-grid">{LEADERSHIP_LINKS.map(item=><ExternalAnchor className="external-resource" key={item.url} href={item.url}><span><strong>{item.label}</strong><small>Auf Finviz prüfen</small></span><ExternalLink size={17}/></ExternalAnchor>)}</div>

    <span className="input-label">Führende Sektoren · maximal {MAX_LEADING_SECTORS}</span>
    <div className="etf-grid">{SECTOR_ETFS.map(etf=><button key={etf.ticker} className={form.leadingEtfs.includes(etf.ticker)?"selected":""} onClick={()=>toggleList("leadingEtfs",etf.ticker)}><span>{etf.ticker}</span><small>{etf.label}</small>{form.leadingEtfs.includes(etf.ticker)&&<Check size={15}/>}</button>)}</div>
    {form.leadingEtfs.length>MAX_LEADING_SECTORS&&<div className="provisional"><ShieldAlert size={16}/><span>{form.leadingEtfs.length} Sektoren gewählt. Für einen klaren Fokus auf {MAX_LEADING_SECTORS} eingrenzen.</span></div>}

    <span className="input-label">Stärkste Gruppen · maximal {MAX_LEADING_GROUPS}</span>
    <div className="group-grid">{GROUP_ETFS.map(ticker=><button key={ticker} className={form.leadingGroups.includes(ticker)?"selected":""} onClick={()=>toggleGroup(ticker)}>{ticker}</button>)}</div>
    <form className="group-entry" onSubmit={event=>{event.preventDefault();toggleGroup(groupDraft);setGroupDraft("")}}>
     <Input value={groupDraft} onChange={e=>setGroupDraft(e.target.value.toUpperCase())} placeholder="Eigene Gruppe, z. B. XOP" aria-label="Eigene Gruppe hinzufügen"/>
     <button className="secondary compact" type="submit" disabled={!groupDraft.trim()}>Hinzufügen</button>
    </form>
    {form.leadingGroups.length>0&&<div className="chip-row">{form.leadingGroups.map(ticker=><button key={ticker} className="chip" onClick={()=>toggleGroup(ticker)} aria-label={`${ticker} entfernen`}>{ticker}<X size={12}/></button>)}</div>}
    {form.leadingGroups.length>MAX_LEADING_GROUPS&&<div className="provisional"><ShieldAlert size={16}/><span>{form.leadingGroups.length} Gruppen notiert. Auf die Top {MAX_LEADING_GROUPS} verdichten.</span></div>}

    <p className="microcopy">Externe Recherchelinks · keine automatisch eingelesenen Marktdaten.</p>
    <StepComplete done={form.sectionsCompleted.leadership} onClick={()=>complete("leadership")}/>
   </Card>

   <Card id="step-scans" className="coach-step">
    <StepHeader number={5} icon={Radar} title="Finviz Momentum Scans" subtitle="Drei feste Scans öffnen, sichten und anschließend abhaken." done={form.sectionsCompleted.scans}/>
    <div className="scan-resource-list">{FINVIZ_SCANS.map(scan=><div className={form.scansChecked.includes(scan.id)?"scan-resource selected":"scan-resource"} key={scan.id}>
     <button aria-label={`${scan.label} abhaken`} onClick={()=>toggleList("scansChecked",scan.id)}><span className="option-check">{form.scansChecked.includes(scan.id)&&<Check size={14}/>}</span><span><strong>{scan.label}</strong><small>{scan.hint}</small></span></button>
     <ExternalAnchor href={scan.url} ariaLabel={`${scan.label} auf Finviz öffnen`}><ExternalLink size={17}/></ExternalAnchor>
    </div>)}</div>
    <StepComplete done={form.sectionsCompleted.scans} onClick={()=>complete("scans")}/>
   </Card>

   <Card id="step-research" className="coach-step">
    <StepHeader number={6} icon={SearchCheck} title="X-Research-Routine" subtitle="Account direkt öffnen und nur tatsächlich geprüfte Quellen abhaken." done={form.sectionsCompleted.research}/>
    <div className="research-source-list">{RESEARCH_SOURCES.map(source=><div className={form.researchChecked.includes(source.id)?"research-source selected":"research-source"} key={source.id}>
     <button aria-label={`${source.label} abhaken`} onClick={()=>toggleList("researchChecked",source.id)}><span className="option-check">{form.researchChecked.includes(source.id)&&<Check size={14}/>}</span><span><strong>{source.label}</strong><small>{source.handle}</small></span></button>
     <ExternalAnchor href={source.url} ariaLabel={`${source.label} auf X öffnen`}><ExternalLink size={17}/></ExternalAnchor>
    </div>)}</div>
    <StepComplete done={form.sectionsCompleted.research} onClick={()=>complete("research")}/>
   </Card>

   <Card id="step-decision" className="coach-step decision-step">
    <StepHeader number={7} icon={Gauge} title="Deine Entscheidung" subtitle="Analyse verdichten und einen klaren Handelsmodus festlegen." done={form.sectionsCompleted.decision}/>
    <span className="input-label">Marktampel · fünf Stufen, manuell gesetzt</span>
    <div className="light-scale">{TRAFFIC_LIGHTS.map(item=><button key={item.value} className={form.trafficLight===item.value?`selected ${item.value}`:item.value} onClick={()=>set("trafficLight",item.value)}>
     <span className="light-dot"/><strong>{item.label}</strong><em>{item.mode}</em><small>{item.hint}</small>
    </button>)}</div>
    <div className="decision-secondary">
     <span className="input-label">Breakouts wahrscheinlich?</span>
     <div className="quality-choice">{(Object.keys(qualityLabels) as BreakoutQuality[]).map(value=><button key={value} className={form.breakoutQuality===value?"selected":""} onClick={()=>set("breakoutQuality",value)}>{qualityLabels[value]}</button>)}</div>
    </div>
    <div className="provisional"><ShieldAlert size={16}/><span>Die Ampellogik bleibt bewusst manuell und vorläufig.</span></div>
    <button className={`step-complete ${form.sectionsCompleted.decision?"done":""}`} onClick={()=>complete("decision")}>{form.sectionsCompleted.decision?<><CircleCheck size={18}/> Entscheidung festgelegt</>:<>Entscheidung festlegen <ChevronRight size={17}/></>}</button>
   </Card>

   <Card id="step-watchlists" className="coach-step watchlist-step">
    <StepHeader number={8} icon={ListChecks} title="Watchlisten verdichten" subtitle="Nach der Marktentscheidung Kandidaten von den Ausgangslisten bis zur Focus List führen." done={form.sectionsCompleted.watchlists}/>
    <div className="watchlist-flow">
     <div className="watchlist-stage-group"><span className="input-label">Ausgangslisten</span>{watchlistFlow.slice(0,2).map(([list,label,hint])=><button key={list} onClick={()=>onOpenList(list)}><span><strong>{label}</strong><small>{hint}</small></span><b>{data.candidates.filter(candidate=>candidate.list===list).length}</b><ChevronRight size={17}/></button>)}</div>
     <div className="flow-arrow"><ChevronRight/></div>
     <div className="watchlist-stage-group"><span className="input-label">Verdichtung</span>{watchlistFlow.slice(2,3).map(([list,label,hint])=><button key={list} onClick={()=>onOpenList(list)}><span><strong>{label}</strong><small>{hint}</small></span><b>{data.candidates.filter(candidate=>candidate.list===list).length}</b><ChevronRight size={17}/></button>)}</div>
     <div className="flow-arrow"><ChevronRight/></div>
     <div className="watchlist-stage-group"><span className="input-label">Tagesfokus</span>{watchlistFlow.slice(3).map(([list,label,hint])=><button key={list} onClick={()=>onOpenList(list)}><span><strong>{label}</strong><small>{hint}</small></span><b>{data.candidates.filter(candidate=>candidate.list===list).length}</b><ChevronRight size={17}/></button>)}</div>
    </div>
    <p className="microcopy">BullSnort ist als deine Liste der während der Woche gesammelten, vor allem Earnings-getriebenen Gappers hinterlegt.</p>
    <button disabled={!form.sectionsCompleted.decision} className={`finish-routine ${form.sectionsCompleted.watchlists?"finished":""}`} onClick={()=>complete("watchlists")}>{form.sectionsCompleted.watchlists?<><CircleCheck/> Daily Routine abgeschlossen</>:form.sectionsCompleted.decision?<>Watchlisten-Review abschließen <ChevronRight/></>:<>Zuerst Marktentscheidung festlegen</>}</button>
   </Card>
  </div>
 </div>;
}

function StepComplete({done,onClick}:{done:boolean;onClick:()=>void}){return <button className={`step-complete ${done?"done":""}`} onClick={onClick}>{done?<><CircleCheck size={18}/> Schritt erledigt</>:<>Schritt abschließen <ChevronRight size={17}/></>}</button>}
