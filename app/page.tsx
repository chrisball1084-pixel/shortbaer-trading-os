"use client";
import { useState } from "react";
import { AppShell, type Navigate, type ViewId } from "@/components/app-shell";
import { TodayView } from "@/components/views/today";
import { AwarenessView } from "@/components/views/awareness";
import { CandidatesView } from "@/components/views/candidates";
import { ScanView } from "@/components/views/scan";
import { OrbView } from "@/components/views/orb";
import { JournalView } from "@/components/views/journal";
import { PlaybooksView } from "@/components/views/playbooks";
import { SettingsView } from "@/components/views/settings";
import type { CandidateList, RoutineSection } from "@/lib/types";

/** Sprungziel innerhalb der Routine. Der Zähler sorgt dafür, dass auch zweimal derselbe Schritt scrollt. */
export interface SectionTarget { section: RoutineSection | null; nonce: number; }

export default function Home(){
  const [view,setView]=useState<ViewId>("today");
  const [target,setTarget]=useState<SectionTarget>({section:null,nonce:0});
  const [candidateList,setCandidateList]=useState<CandidateList>("focus-long");

  const navigate:Navigate=(next,section)=>{
    setView(next);
    setTarget(old=>({section:section??null,nonce:old.nonce+1}));
    // Ohne Sprungziel oben starten; mit Ziel übernimmt die Zielansicht das Scrollen.
    if(!section) window.scrollTo(0,0);
  };
  const openCandidateList=(list:CandidateList)=>{setCandidateList(list);setView("candidates");window.scrollTo(0,0)};

  const views={
    today:<TodayView onNavigate={navigate}/>,
    awareness:<AwarenessView target={target} onOpenList={openCandidateList}/>,
    candidates:<CandidatesView key={candidateList} initialTab={candidateList}/>,
    scan:<ScanView/>, orb:<OrbView/>, journal:<JournalView/>, playbooks:<PlaybooksView/>, settings:<SettingsView/>
  };
  return <AppShell active={view} onNavigate={navigate}>{views[view]}</AppShell>;
}
