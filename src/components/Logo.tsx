"use client";
/** Logo animé en continu : couronne de barres d'ondes qui danse (fidèle au logo AKS). */
const HEIGHTS = [28, 42, 58, 38, 72, 52, 88, 66, 100, 78, 58, 84, 48, 64, 38, 52, 28];

export function LogoCrown({ bars = 17, className = "" }: { bars?: number; className?: string }) {
  return (
    <span className={`flex items-end gap-[3px] ${className}`} aria-hidden>
      {HEIGHTS.slice(0, bars).map((h, i) => (
        <span
          key={i}
          className="logo-bar w-[4px] rounded-full"
          style={{
            height: `${h}%`,
            animationDelay: `${(i * 0.09).toFixed(2)}s`,
            animationDuration: `${(0.9 + (i % 5) * 0.16).toFixed(2)}s`,
          }}
        />
      ))}
    </span>
  );
}
