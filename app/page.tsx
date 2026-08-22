"use client";
import { useState } from "react";
import { AppShell, type ViewId } from "@/components/app-shell";
import { TodayView } from "@/components/views/today";
import { AwarenessView } from "@/components/views/awareness";
import { CandidatesView } from "@/components/views/candidates";
import { ScanView } from "@/components/views/scan";
import { OrbView } from "@/components/views/orb";
import { JournalView } from "@/components/views/journal";
import { PlaybooksView } from "@/components/views/playbooks";
import { SettingsView } from "@/components/views/settings";

export default function Home(){
  const [view,setView]=useState<ViewId>("today");
  const navigate=(next:ViewId)=>{setView(next);window.scrollTo(0,0)};
  const views={ today:<TodayView onNavigate={navigate}/>, awareness:<AwarenessView/>, candidates:<CandidatesView/>, scan:<ScanView/>, orb:<OrbView/>, journal:<JournalView/>, playbooks:<PlaybooksView/>, settings:<SettingsView/> };
  return <AppShell active={view} onNavigate={navigate}>{views[view]}</AppShell>;
}
