"use client";
import type { ReactNode } from "react";
import { Activity, BookOpenCheck, BriefcaseBusiness, Calculator, ClipboardList, LayoutDashboard, Settings, Telescope } from "lucide-react";
import { BrandMark } from "./brand-mark";
import { useStore } from "@/lib/store";
import { describeAge, lightMeta, resolveDisplayLight } from "@/lib/market";
import type { RoutineSection } from "@/lib/types";

export type ViewId = "today"|"awareness"|"candidates"|"scan"|"orb"|"journal"|"playbooks"|"settings";
export type Navigate = (id: ViewId, section?: RoutineSection) => void;

const items: {id:ViewId;label:string;short:string;icon:typeof Activity}[]=[
  {id:"today",label:"Heute",short:"Heute",icon:LayoutDashboard},{id:"awareness",label:"Situational Awareness",short:"Markt",icon:Activity},
  {id:"candidates",label:"Watchlists",short:"Listen",icon:Telescope},{id:"scan",label:"Scan Inbox",short:"Inbox",icon:ClipboardList},
  {id:"orb",label:"ORB Assistant",short:"ORB",icon:Calculator},{id:"journal",label:"Journal",short:"Journal",icon:BookOpenCheck},
  {id:"playbooks",label:"Playbooks",short:"Playbooks",icon:BriefcaseBusiness},{id:"settings",label:"Einstellungen",short:"Mehr",icon:Settings}
];

export function AppShell({active,onNavigate,children}:{active:ViewId;onNavigate:Navigate;children:ReactNode}){
  const {data}=useStore();
  const resolved=resolveDisplayLight(data.market,data.history);
  const meta=lightMeta(resolved.light);
  // Statt des erklärungslosen „LOCAL“ steht hier jetzt der Marktmodus – die Information,
  // die beim Öffnen der App tatsächlich zählt.
  const lightChip=<button
    type="button"
    className={`light-chip ${resolved.light}`}
    onClick={()=>onNavigate("awareness","decision")}
    title={`${meta.mode} · ${resolved.origin==="today"?"heute festgelegt":describeAge(resolved.date)}`}
  ><span className="light-dot"/>{meta.label}{resolved.origin==="history"&&<small>alt</small>}{resolved.origin==="none"&&<small>offen</small>}</button>;

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><BrandMark size={40}/><div><strong>ShortBär</strong><span>TRADING OS</span></div></div>
      <div className="motto">SYSTEM STATT INTUITION</div>
      <nav>{items.map(({id,label,icon:Icon})=><button key={id} className={active===id?"active":""} onClick={()=>onNavigate(id)}><Icon size={19}/><span>{label}</span></button>)}</nav>
      <div className="safety-note"><span className="dot"/>Nur Planung · Keine Orders</div>
    </aside>
    <main>
      <header className="mobile-header">
        <button type="button" className="brand" onClick={()=>onNavigate("today")}><BrandMark size={36}/><div><strong>ShortBär</strong><span>TRADING OS</span></div></button>
        {lightChip}
      </header>
      {children}
    </main>
    <nav className="bottom-nav">{items.map(({id,short,icon:Icon})=><button key={id} className={active===id?"active":""} onClick={()=>onNavigate(id)}><Icon size={19}/><span>{short}</span></button>)}</nav>
  </div>;
}
