"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureUtm, track } from "@/lib/track";

/**
 * Suivi automatique du site public :
 * - 1 « pageview » par page visitée (+ UTM des pubs au premier passage)
 * - 1 événement par clic sur tout élément portant data-track="nom"
 */
export function SiteTracker() {
  const path = usePathname();

  useEffect(() => {
    const utm = captureUtm();
    track("pageview", utm ? { utm } : {});
  }, [path]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.("[data-track]") as HTMLElement | null;
      if (!el) return;
      const label = (el.getAttribute("data-label") || el.textContent || "").trim().slice(0, 100);
      track(el.dataset.track || "click", { label });
    };
    document.addEventListener("click", onClick, { capture: true, passive: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
