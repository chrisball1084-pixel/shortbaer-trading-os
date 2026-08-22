import { ArrowUpRight, BookMarked } from "lucide-react";
import { SETUPS } from "@/lib/types";
import { Badge, Card, PageHeader } from "../ui";
const labels=["Marktumfeld","Voraussetzungen","Entry","Stop","Management","Exit","No-Trade-Kriterien","Gute Beispiele","Schlechte Beispiele"];
export function PlaybooksView(){return <div className="page"><PageHeader eyebrow="WIEDERHOLBARE SETUPS" title="Playbooks" description="Klare Regeln für gute Entscheidungen. Inhalte sind im ersten MVP noch zu definieren."/><div className="playbook-grid">{SETUPS.map((name,i)=><Card className="playbook-card" key={name}><div className="playbook-number">0{i+1}</div><BookMarked/><h2>{name}</h2><div className="tag-row">{labels.slice(0,3).map(x=><Badge key={x}>{x}</Badge>)}</div><div className="playbook-footer"><span>Platzhalter · noch zu definieren</span><ArrowUpRight size={17}/></div></Card>)}</div></div>}

