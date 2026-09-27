import type { Metadata } from "next";
import LogicsView from "@/components/LogicsView";

export const metadata: Metadata = {
  title: "AKLIMASOUND LOGICS — Logiciel de contrôle par IA multiconsole",
  description:
    "AKLIMASOUND LOGICS : logiciel SaaS de contrôle par IA de plusieurs consoles de mixage numériques depuis une seule interface. Auto-mix intelligent, contrôle à distance, scènes cloud. Accès anticipé ouvert.",
  keywords: ["logiciel sonorisation", "contrôle IA console", "SaaS audio", "multi-console", "Aklimasound Logics", "auto-mix IA"],
  openGraph: {
    title: "AKLIMASOUND LOGICS — Le contrôle par IA de vos consoles numériques",
    description: "Logiciel SaaS multiconsole avec assistance IA : auto-mix, contrôle à distance, scènes cloud. Accès anticipé ouvert.",
  },
};

export default function LogicsPage() {
  return <LogicsView />;
}
