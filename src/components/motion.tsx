"use client";
import { useEffect, useRef, useState, ReactNode } from "react";

/**
 * Révélation au scroll, SANS dépendance vitale au JS :
 * le contenu est visible par défaut (SSR), l'animation CSS ne joue
 * que si IntersectionObserver fonctionne. Zéro risque de page vide.
 */
export function Reveal({ children, delay = 0, y = 28, className }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add("reveal-in");
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -60px 0px", threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{ animationDelay: `${delay}s`, ["--rv-y" as string]: `${y}px` } as React.CSSProperties}>
      {children}
    </div>
  );
}

/** Titre mot-à-mot avec flou : animation 100 % CSS (joue même sans JS). */
export function BlurText({ text, delay = 90, className = "" }: { text: string; delay?: number; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span
          key={i}
          aria-hidden
          className="blur-word inline-block will-change-transform"
          style={{ animationDelay: `${(i * delay) / 1000}s` }}
        >
          {w}
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  );
}

/** Compteur : valeur finale affichée par défaut, compte à rebours visuel si JS OK. */
export function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(to);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        setV(0);
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / 1400);
          setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to]);
  return <span ref={ref}>{v.toLocaleString("fr-FR")}{suffix}</span>;
}

/** Barres d'égaliseur décoratives (CSS pur). */
export function EqBars({ n = 5, className = "" }: { n?: number; className?: string }) {
  return (
    <span className={`inline-flex items-end gap-[3px] h-4 ${className}`} aria-hidden>
      {Array.from({ length: n }).map((_, i) => (
        <span key={i} className="eq-bar w-[3px] rounded-sm bg-current" style={{ height: "100%", animationDelay: `${i * 0.13}s` }} />
      ))}
    </span>
  );
}
