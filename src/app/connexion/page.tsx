import type { Metadata } from "next";
import { Suspense } from "react";
import ConnexionView from "@/components/ConnexionView";

export const metadata: Metadata = {
  title: "Connexion",
  robots: { index: false, follow: false, nocache: true },
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ConnexionView />
    </Suspense>
  );
}
