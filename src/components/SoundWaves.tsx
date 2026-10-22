"use client";
import { useEffect, useRef } from "react";

/**
 * Fond « ondes sonores » : pluie de rayons lumineux + N ondes superposées
 * qui ondulent en continu (composant maison, canvas 2D).
 */
export default function SoundWaves({ className = "", density = 1, waves = 3 }: { className?: string; density?: number; waves?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    let w = 0, h = 0, raf = 0, t = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    type Ray = { x: number; y: number; len: number; sp: number; op: number };
    let rays: Ray[] = [];
    const init = () => {
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round((w / 14) * density);
      rays = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        len: 26 + Math.random() * 90,
        sp: 0.5 + Math.random() * 1.6,
        op: 0.04 + Math.random() * 0.12,
      }));
    };

    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);

      // Pluie de rayons dorés
      for (const r of rays) {
        r.y += r.sp;
        if (r.y - r.len > h) { r.y = -r.len; r.x = Math.random() * w; }
        const g = ctx.createLinearGradient(r.x, r.y - r.len, r.x, r.y);
        g.addColorStop(0, "rgba(255,255,255,0)");
        g.addColorStop(1, `rgba(255,255,255,${r.op})`);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(r.x, r.y - r.len);
        ctx.lineTo(r.x, r.y);
        ctx.stroke();
      }

      // N ondes sonores superposées, amplitudes et vitesses variées
      const palette = ["255,255,255", "161,161,170", "245,240,230"];
      for (let i = 0; i < waves; i++) {
        const p = waves === 1 ? 0.5 : i / (waves - 1);
        const amp = h * (0.028 + 0.05 * Math.sin(p * Math.PI) + 0.012 * i);
        const freq = 0.006 + 0.0035 * (i % 3);
        const sp = 0.6 + 0.28 * i;
        const col = `rgba(${palette[i % 3]},${(0.30 - 0.035 * i).toFixed(2)})`;
        const y = h * (0.52 + 0.055 * i);
        ctx.beginPath();
        for (let x = 0; x <= w; x += 4) {
          const env = Math.sin((x / w) * Math.PI);
          const yy = y + Math.sin(x * freq + t * sp * 2) * amp * env
                       + Math.sin(x * freq * 2.7 + t * sp * 3.1) * amp * 0.35 * env;
          x === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
        }
        ctx.strokeStyle = col;
        ctx.lineWidth = 1.6 - 0.12 * i;
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };

    init();
    draw();
    const ro = new ResizeObserver(init);
    ro.observe(cv);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [density, waves]);

  return <canvas ref={ref} className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden />;
}
