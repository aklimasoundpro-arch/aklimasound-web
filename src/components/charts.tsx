"use client";
/**
 * Graphes du cockpit admin — réimplémentation maison SVG/CSS
 * (même rendu & easing que les composants bklit fournis, sans framer-motion/visx).
 */

const EASE = "cubic-bezier(0.85, 0, 0.15, 1)";

/* ---------- Jauge à encoches (type bklit Gauge) ---------- */
export function Gauge({ value, centerValue, label, prefix = "" }: { value: number; centerValue: string; label: string; prefix?: string }) {
  const notches = 40;
  const start = 135, end = 405;
  const active = Math.round((value / 100) * notches);
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 140" className="w-full max-w-[240px]">
        {Array.from({ length: notches }).map((_, i) => {
          const a = ((start + (i * (end - start)) / (notches - 1)) * Math.PI) / 180;
          const x1 = 100 + Math.cos(a) * 70, y1 = 100 + Math.sin(a) * 70;
          const x2 = 100 + Math.cos(a) * 88, y2 = 100 + Math.sin(a) * 88;
          const on = i < active;
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={on ? "var(--color-gold)" : "rgba(245,240,230,.14)"}
              strokeWidth={3.4} strokeLinecap="butt"
              className="gauge-notch" style={{ animationDelay: `${i * 0.02}s`, ["--on" as string]: on ? "1" : "0" } as React.CSSProperties} />
          );
        })}
        <text x="100" y="92" textAnchor="middle" className="fill-ivory font-display" style={{ fontSize: 26, fontWeight: 700 }}>{prefix}{centerValue}</text>
        <text x="100" y="112" textAnchor="middle" className="fill-ivory" style={{ fontSize: 10, opacity: .55, letterSpacing: 2 }}>{label.toUpperCase()} · {value}%</text>
      </svg>
    </div>
  );
}

/* ---------- Tunnel horizontal (type bklit FunnelChart) ---------- */
export function Funnel({ data }: { data: { label: string; value: number }[] }) {
  const max = data[0]?.value || 1;
  return (
    <div className="space-y-2">
      {data.map((d, i) => {
        const w = 100 - (i * (100 - 34)) / Math.max(1, data.length - 1);
        const pct = Math.round((d.value / max) * 100);
        return (
          <div key={d.label} className="funnel-layer relative mx-auto flex items-center justify-between rounded-xl px-4 py-2.5 text-xs"
            style={{ width: `${w}%`, background: `color-mix(in oklab, var(--color-gold) ${18 + i * 6}%, transparent)`, border: "1px solid rgba(233,200,126,.25)", animationDelay: `${i * 0.12}s` }}>
            <span className="font-semibold text-ivory">{d.label}</span>
            <span className="text-ivory/80">{d.value.toLocaleString("fr-FR")} · {pct}%</span>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Composé barres + courbe (type bklit ComposedChart) ---------- */
export function Composed({ data, barKey, lineKey, barLabel, lineLabel }: { data: Record<string, number | string>[]; barKey: string; lineKey: string; barLabel: string; lineLabel: string }) {
  const W = 560, H = 200, P = 24;
  const vals = data.map((d) => Math.max(Number(d[barKey]), Number(d[lineKey])));
  const max = Math.max(...vals) * 1.15;
  const x = (i: number) => P + (i * (W - P * 2)) / (data.length - 1);
  const y = (v: number) => H - P - (v / max) * (H - P * 2);
  const bw = Math.min(18, ((W - P * 2) / data.length) * 0.45);
  // courbe lissée (approximation catmull-rom -> bézier)
  const pts = data.map((d, i) => [x(i), y(Number(d[lineKey]))] as const);
  let path = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
    const mx = (x0 + x1) / 2;
    path += ` C ${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1}`;
  }
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {[0.25, 0.5, 0.75, 1].map((g) => (
          <line key={g} x1={P} x2={W - P} y1={y(max * g)} y2={y(max * g)} stroke="rgba(245,240,230,.08)" />
        ))}
        {data.map((d, i) => (
          <rect key={i} x={x(i) - bw / 2} y={y(Number(d[barKey]))} width={bw} height={H - P - y(Number(d[barKey]))}
            fill="var(--color-gold)" opacity={0.75} className="chart-bar" style={{ animationDelay: `${i * 0.05}s` }} />
        ))}
        <path d={path} fill="none" stroke="var(--color-copper)" strokeWidth={2.4} className="chart-line" />
      </svg>
      <div className="mt-1 flex gap-4 text-[11px] text-ivory/60">
        <span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-sm bg-gold" /> {barLabel}</span>
        <span className="inline-flex items-center gap-1.5"><i className="h-0.5 w-4 bg-copper" /> {lineLabel}</span>
      </div>
    </div>
  );
}

/* ---------- Anneau segments (type bklit PieChart donut) ---------- */
export function Donut({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const R = 60, C = 2 * Math.PI * R;
  let off = 0;
  return (
    <div className="flex items-center gap-5">
      <svg viewBox="0 0 160 160" className="h-36 w-36 shrink-0 -rotate-90">
        {data.map((d) => {
          const len = (d.value / total) * C;
          const el = (
            <circle key={d.label} cx="80" cy="80" r={R} fill="none" stroke={d.color} strokeWidth="22"
              strokeDasharray={`${len - 2} ${C - len + 2}`} strokeDashoffset={-off} className="chart-slice" />
          );
          off += len;
          return el;
        })}
      </svg>
      <ul className="space-y-1.5 text-xs">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-2 text-ivory/70">
            <i className="h-2.5 w-2.5 rounded-sm" style={{ background: d.color }} />
            {d.label} — {Math.round((d.value / total) * 100)}%
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Anneaux de progression (type bklit RingChart) ---------- */
export function Rings({ data, centerLabel }: { data: { label: string; value: number; max: number; color: string }[]; centerLabel: string }) {
  return (
    <div className="flex items-center gap-5">
      <svg viewBox="0 0 160 160" className="h-36 w-36 shrink-0 -rotate-90">
        {data.map((d, i) => {
          const R = 70 - i * 14;
          const C = 2 * Math.PI * R;
          const p = Math.min(1, d.value / d.max);
          return (
            <g key={d.label}>
              <circle cx="80" cy="80" r={R} fill="none" stroke="rgba(245,240,230,.10)" strokeWidth="9" />
              <circle cx="80" cy="80" r={R} fill="none" stroke={d.color} strokeWidth="9" strokeLinecap="round"
                strokeDasharray={`${C * p} ${C}`} className="chart-ring" style={{ animationDelay: `${i * 0.12}s` }} />
            </g>
          );
        })}
      </svg>
      <ul className="space-y-1.5 text-xs">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-2 text-ivory/70">
            <i className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
            {d.label} — {d.value.toLocaleString("fr-FR")}
          </li>
        ))}
        <li className="pt-1 text-[10px] uppercase tracking-widest text-ivory/40">{centerLabel}</li>
      </ul>
    </div>
  );
}

/* ---------- Radar (type bklit RadarChart) ---------- */
export function Radar({ metrics, series }: { metrics: { key: string; label: string }[]; series: { label: string; color: string; values: Record<string, number> }[] }) {
  const C = 190, R = 66, n = metrics.length;
  const pt = (i: number, r: number) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [C / 2 + Math.cos(a) * r, C / 2 + Math.sin(a) * r] as const;
  };
  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox={`0 0 ${C} ${C}`} className="w-full max-w-[260px]">
        {[1, 2, 3, 4, 5].map((l) => (
          <polygon key={l} points={metrics.map((_, i) => pt(i, (R * l) / 5).join(",")).join(" ")}
            fill="none" stroke="rgba(245,240,230,.10)" strokeWidth={1} />
        ))}
        {metrics.map((_, i) => {
          const [x, y] = pt(i, R);
          return <line key={i} x1={C / 2} y1={C / 2} x2={x} y2={y} stroke="rgba(245,240,230,.10)" />;
        })}
        {series.map((s) => (
          <g key={s.label}>
            <polygon className="chart-radar" points={metrics.map((m, i) => pt(i, (Math.min(100, s.values[m.key] ?? 0) / 100) * R).join(",")).join(" ")}
              fill={s.color} fillOpacity={0.18} stroke={s.color} strokeWidth={2} />
            {metrics.map((m, i) => {
              const [x, y] = pt(i, (Math.min(100, s.values[m.key] ?? 0) / 100) * R);
              return <circle key={i} cx={x} cy={y} r={3} fill={s.color} />;
            })}
          </g>
        ))}
        {metrics.map((m, i) => {
          const [x, y] = pt(i, R + 16);
          return <text key={m.key} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="fill-ivory" style={{ fontSize: 8.5, opacity: .6 }}>{m.label}</text>;
        })}
      </svg>
      <div className="flex gap-4 text-[11px] text-ivory/60">
        {series.map((s) => (
          <span key={s.label} className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full" style={{ background: s.color }} /> {s.label}</span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Profit / perte (ligne bicolore) ---------- */
export function ProfitLoss({ data }: { data: { label: string; pnl: number }[] }) {
  const W = 560, H = 180, P = 24;
  const max = Math.max(...data.map((d) => Math.abs(d.pnl))) * 1.2;
  const x = (i: number) => P + (i * (W - P * 2)) / (data.length - 1);
  const y = (v: number) => H / 2 - (v / max) * (H / 2 - P);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <line x1={P} x2={W - P} y1={H / 2} y2={H / 2} stroke="rgba(245,240,230,.2)" strokeDasharray="4,4" />
      {data.slice(0, -1).map((d, i) => {
        const v = (d.pnl + data[i + 1].pnl) / 2;
        return (
          <line key={i} x1={x(i)} y1={y(d.pnl)} x2={x(i + 1)} y2={y(data[i + 1].pnl)}
            stroke={v >= 0 ? "#3ecf8e" : "#ff5c5c"} strokeWidth={2.4} className="chart-line" style={{ animationDelay: `${i * 0.04}s` }} />
        );
      })}
      {data.map((d, i) => (
        <circle key={i} cx={x(i)} cy={y(d.pnl)} r={3} fill={d.pnl >= 0 ? "#3ecf8e" : "#ff5c5c"} />
      ))}
    </svg>
  );
}
