import { NextResponse } from "next/server";
import { addRow, rateOk } from "@/lib/db";

export const dynamic = "force-dynamic";

const str = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

/**
 * Journal des visites & clics (1re partie, sans cookie tiers).
 * Volume plus élevé que les formulaires : limite dédiée, anneaux de 5 000 événements.
 */
export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  if (!rateOk(`ev:${ip}`, 120, 60_000)) return NextResponse.json({ ok: false }, { status: 429 });
  // Anti-DoS : événements bornés (< 1 Ko normalement)
  if (Number(req.headers.get("content-length") ?? 0) > 20_000) return NextResponse.json({ ok: false }, { status: 413 });
  const b = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!b) return NextResponse.json({ ok: false }, { status: 400 });

  const event = str(b.event, 40);
  if (!event) return NextResponse.json({ ok: false }, { status: 400 });

  addRow(
    "events",
    {
      event,
      vid: str(b.vid, 24),
      page: str(b.page, 120),
      label: str(b.label, 120),
      ref: str(b.ref, 160),
      utm: (b.utm && typeof b.utm === "object" ? b.utm : {}) as Record<string, string>,
      lang: str(b.lang, 5),
    },
    5000
  );
  return NextResponse.json({ ok: true });
}
