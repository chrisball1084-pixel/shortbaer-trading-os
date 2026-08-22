"use client";
import { ArrowRight, BarChart3, CalendarDays, Check, CircleAlert, Gauge, LineChart, ListChecks, Radar, SearchCheck, Sparkles } from "lucide-react";
import { useStore } from "@/lib/store";
import { ROUTINE_SECTIONS, type RoutineSection } from "@/lib/types";
import type { ViewId } from "../app-shell";
import { Badge, Card, PageHeader, SectionTitle, toneForLight } from "../ui";

const mode={green:"Swing Long",yellow:"Daytrading · Risk-off",red:"Short-Fokus"} as const;
const stepMeta:Record<RoutineSection,{label:string;description:string;icon:typeof CalendarDays}>={
  events:{label:"Eventrisiko",description:"Makro und Quartalsberichte markieren",icon:CalendarDays},
  indices:{label:"SPY & QQQ",description:"Kurslage und Richtung der Key MAs",icon:LineChart},
  breadth:{label:"Marktbreite",description:"+4/−4 % und MA-Partizipation",icon:BarChart3},
  leadership:{label:"Leadership",description:"Führende Sektor-ETFs aus dem RS-Sheet",icon:Sparkles},
  scans:{label:"Finviz Scans",description:"Momentum-Scans öffnen und prüfen",icon:Radar},
  research:{label:"X Research",description:"Daily Accounts öffnen und abhaken",icon:SearchCheck},
  decision:{label:"Entscheidung",description:"Marktampel und Handelsmodus festlegen",icon:Gauge},
  watchlists:{label:"Watchlisten",description:"Bulls Nord und Stalkers bis zur Focus List verdichten",icon:ListChecks}
};
const eventLabels:Record<string,string>={fomc:"FOMC",rates:"Zinsentscheid",cpi:"CPI",ppi:"PPI",earnings:"Quartalsberichte",none:"Kein Event"};

export function TodayView({onNavigate}:{onNavigate:(id:ViewId)=>void}){
 const {data}=useStore();
 const done=ROUTINE_SECTIONS.filter(key=>data.market.sectionsCompleted[key]).length;
 const progress=Math.round(done/ROUTINE_SECTIONS.length*100);
 const focusLong=data.candidates.filter(c=>c.list==="focus-long"&&c.status!=="ausgeschlossen");
 const focusShort=data.candidates.filter(c=>c.list==="focus-short"&&c.status!=="ausgeschlossen");
 const activeEvents=Object.entries(data.market.events).filter(([,active])=>active).map(([key])=>eventLabels[key]);
 const todayLabel=new Intl.DateTimeFormat("de-DE",{weekday:"long",day:"2-digit",month:"long"}).format(new Date());
 return <div className="page daily-page">
  <PageHeader eyebrow="DEIN DAILY COACH" title="Guten Morgen, Chris" description={`${todayLabel} · Erst der Prozess, dann der Trade.`}/>
  <Card className="coach-hero"><div className="coach-progress" style={{"--progress":`${progress*3.6}deg`} as React.CSSProperties}><div><strong>{progress}%</strong><span>fertig</span></div></div><div className="coach-copy"><span className="overline">DAILY ROUTINE</span><h2>{done===ROUTINE_SECTIONS.length?"Routine abgeschlossen":"Dein Marktplan braucht Klarheit"}</h2><p>{done===ROUTINE_SECTIONS.length?"Alle acht Schritte sind erledigt. Halte dich jetzt an deinen festgelegten Modus.":`${done} von ${ROUTINE_SECTIONS.length} Schritten abgeschlossen · etwa ${Math.max(2,(ROUTINE_SECTIONS.length-done)*2)} Minuten verbleibend`}</p><button className="primary" onClick={()=>onNavigate("awareness")}>{done?"Routine fortsetzen":"Routine starten"}<ArrowRight size={17}/></button></div></Card>

  <div className="daily-layout"><div className="stack"><Card className="routine-card"><SectionTitle meta={`${done}/${ROUTINE_SECTIONS.length}`}>Heutiger Ablauf</SectionTitle><div className="routine-steps">{ROUTINE_SECTIONS.map((key,index)=>{const item=stepMeta[key];const Icon=item.icon;const complete=data.market.sectionsCompleted[key];return <button key={key} className={complete?"complete":""} onClick={()=>onNavigate("awareness")}><span className="step-index">{complete?<Check size={15}/>:index+1}</span><span className="step-icon"><Icon size={18}/></span><span className="step-copy"><strong>{item.label}</strong><small>{item.description}</small></span><ArrowRight size={16}/></button>})}</div></Card></div>
   <div className="stack"><Card className={`decision-card ${data.market.trafficLight}`}><div className="decision-top"><div><span className="overline">HEUTIGER MODUS</span><div className="light-row"><span className="traffic-light"/><h2>{data.market.trafficLight==="green"?"Grün":data.market.trafficLight==="red"?"Rot":"Gelb"}</h2></div><p>{mode[data.market.trafficLight]}</p></div><Badge tone={toneForLight(data.market.trafficLight)}>{data.market.sectionsCompleted.decision?"festgelegt":"vorläufig"}</Badge></div><button className="secondary full" onClick={()=>onNavigate("awareness")}>Entscheidung prüfen</button></Card>
   <Card><SectionTitle>Eventrisiko</SectionTitle>{activeEvents.length?<div className="selection-summary">{activeEvents.map(event=><Badge key={event} tone={event==="Kein Event"?"green":"yellow"}>{event}</Badge>)}</div>:<p className="muted">Noch nicht geprüft.</p>}</Card>
   <div className="disclaimer"><CircleAlert size={15}/> Prozesshilfe, keine Anlageberatung oder Handelssignale.</div></div></div>

  <div className="focus-grid"><Card><SectionTitle meta={`${focusLong.length}`}>Focus Long</SectionTitle>{focusLong.map(c=><button className="focus-row" key={c.id} onClick={()=>onNavigate("candidates")}><div><div><strong>{c.ticker}</strong>{c.demo&&<Badge>DEMO</Badge>}</div><span>{c.setup||"Setup noch zu definieren"}</span></div><div className="align-right"><Badge tone="green">Long</Badge><small>{c.trigger?`Trigger ${c.trigger.toFixed(2)}`:"Kein Trigger"}</small></div></button>)}{!focusLong.length&&<p className="muted">Keine Long-Setups für heute.</p>}</Card>
  <Card><SectionTitle meta={`${focusShort.length}`}>Focus Short</SectionTitle>{focusShort.map(c=><button className="focus-row" key={c.id} onClick={()=>onNavigate("candidates")}><div><div><strong>{c.ticker}</strong>{c.demo&&<Badge>DEMO</Badge>}</div><span>{c.setup||"Setup noch zu definieren"}</span></div><div className="align-right"><Badge tone="red">Short</Badge><small>{c.trigger?`Trigger ${c.trigger.toFixed(2)}`:"Kein Trigger"}</small></div></button>)}{!focusShort.length&&<p className="muted">Keine Short-Setups für heute.</p>}</Card></div>
  <div className="compact-status"><ListChecks size={15}/> Daily Routine wird ausschließlich lokal in diesem Browser gespeichert.</div>
 </div>;
}
