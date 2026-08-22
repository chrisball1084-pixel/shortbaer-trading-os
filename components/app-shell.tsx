"use client";
import type { ReactNode } from "react";
import Image from "next/image";
import { Activity, BookOpenCheck, BriefcaseBusiness, Calculator, ClipboardList, LayoutDashboard, Settings, Telescope } from "lucide-react";

export type ViewId = "today"|"awareness"|"candidates"|"scan"|"orb"|"journal"|"playbooks"|"settings";
const items: {id:ViewId;label:string;short:string;icon:typeof Activity}[]=[
  {id:"today",label:"Heute",short:"Heute",icon:LayoutDashboard},{id:"awareness",label:"Situational Awareness",short:"Markt",icon:Activity},
  {id:"candidates",label:"Watchlists",short:"Listen",icon:Telescope},{id:"scan",label:"Scan Inbox",short:"Inbox",icon:ClipboardList},
  {id:"orb",label:"ORB Assistant",short:"ORB",icon:Calculator},{id:"journal",label:"Journal",short:"Journal",icon:BookOpenCheck},
  {id:"playbooks",label:"Playbooks",short:"Playbooks",icon:BriefcaseBusiness},{id:"settings",label:"Einstellungen",short:"Mehr",icon:Settings}
];
export function AppShell({active,onNavigate,children}:{active:ViewId;onNavigate:(id:ViewId)=>void;children:ReactNode}){
  return <div className="app-shell">
    <aside className="sidebar"><div className="brand"><Image src="/icon.svg" width={40} height={40} alt=""/><div><strong>ShortBär</strong><span>TRADING OS</span></div></div><div className="motto">SYSTEM STATT INTUITION</div><nav>{items.map(({id,label,icon:Icon})=><button key={id} className={active===id?"active":""} onClick={()=>onNavigate(id)}><Icon size={19}/><span>{label}</span></button>)}</nav><div className="safety-note"><span className="dot"/>Nur Planung · Keine Orders</div></aside>
    <main><header className="mobile-header"><div className="brand"><Image src="/icon.svg" width={40} height={40} alt=""/><div><strong>ShortBär</strong><span>TRADING OS</span></div></div><span className="demo-chip">LOCAL</span></header>{children}</main>
    <nav className="bottom-nav">{items.map(({id,short,icon:Icon})=><button key={id} className={active===id?"active":""} onClick={()=>onNavigate(id)}><Icon size={19}/><span>{short}</span></button>)}</nav>
  </div>;
}
