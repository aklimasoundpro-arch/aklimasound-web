"use client";
import { useEffect } from "react";
import { getConsent } from "@/lib/track";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

interface FbqStub {
  (...args: unknown[]): void;
  queue: unknown[][];
  loaded: boolean;
  version: string;
  callMethod?: (...args: unknown[]) => void;
}

/**
 * Meta Pixel (publicités Facebook/Instagram).
 * Double condition : NEXT_PUBLIC_META_PIXEL_ID défini (variable Netlify)
 * ET consentement « marketing » du visiteur (bandeau cookies).
 * Événements de conversion envoyés depuis track.ts : Lead, Contact, InitiateCheckout.
 */
export function MetaPixel() {
  useEffect(() => {
    if (!PIXEL_ID) return;
    let cancelled = false;

    const maybeLoad = () => {
      if (cancelled || !getConsent().marketing) return;
      const w = window as unknown as Record<string, unknown>;
      if (w.fbq) return;

      const n = function (...args: unknown[]) {
        if (n.callMethod) n.callMethod(...args);
        else n.queue.push(args);
      } as FbqStub;
      n.queue = [];
      n.loaded = true;
      n.version = "2.0";
      w.fbq = n;
      w._fbq = n;

      const s = document.createElement("script");
      s.async = true;
      s.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.appendChild(s);

      n("init", PIXEL_ID);
      n("track", "PageView");
    };

    maybeLoad();
    window.addEventListener("aks-consent", maybeLoad);
    return () => {
      cancelled = true;
      window.removeEventListener("aks-consent", maybeLoad);
    };
  }, []);
  return null;
}
