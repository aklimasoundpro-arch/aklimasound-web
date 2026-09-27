import type { Metadata } from "next";
import CompteView from "@/components/CompteView";

export const metadata: Metadata = {
  title: "Mon compte",
  robots: { index: false, follow: false, nocache: true },
};

export default function Page() {
  return <CompteView />;
}
