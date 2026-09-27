import type { Metadata } from "next";
import LogicsView from "@/components/LogicsView";

export const metadata: Metadata = {
  title: "AKLIMASOUND LOGICS — Contrôle IA multiconsole multimarque & commandes vocales",
  description:
    "AKLIMASOUND LOGICS : logiciel SaaS qui unifie le contrôle de plusieurs consoles numériques de marques différentes (Yamaha, Behringer, Allen & Heath, Midas…) avec IA temps réel et commandes vocales mains libres. Auto-mix, anti-larsen, scènes cloud. Accès anticipé ouvert.",
  keywords: ["logiciel sonorisation", "contrôle IA console", "SaaS audio", "multi-console", "multimarque", "commandes vocales", "Aklimasound Logics", "auto-mix IA"],
  openGraph: {
    title: "AKLIMASOUND LOGICS — Toutes vos consoles, toutes marques, une seule interface IA + voix",
    description: "Logiciel SaaS multiconsole multimarque avec assistance IA et commandes vocales : auto-mix, contrôle à distance, scènes cloud. Accès anticipé ouvert.",
  },
};

export default function LogicsPage() {
  return <LogicsView />;
}
