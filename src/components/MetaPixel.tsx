"use client";
import { useEffect } from "react";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

interface FbqStub {
  (...args: unknown[]): void;
  queue: unknown[][];
  loaded: boolean;
  version: string;
  callMethod?: (...args: unknown[]) => void;
}

/**
 * Meta Pixel (publicités Facebook/Instagram) — inactif tant que
 * NEXT_PUBLIC_META_PIXEL_ID n'est pas défini (variable d'environnement Netlify).
 * Événements de conversion envoyés depuis track.ts : Lead, Contact, InitiateCheckout.
 */
export function MetaPixel() {
  useEffect(() => {
    if (!PIXEL_ID) return;
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
  }, []);
  return null;
}
