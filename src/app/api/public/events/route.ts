import { NextResponse } from "next/server";
import { addRow, ipOf, rateOk } from "@/lib/db";

export const dynamic = "force-dynamic";

const str = (v: unknown, max: number) =>
  String(v ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "") // caractères de contrôle dangereux — \t \n \r conservés
    .trim()
    .slice(0, max);

/**
 * Journal des visites & clics (1re partie, sans cookie tiers).
 * Volume plus élevé que les formulaires : limite dédiée, anneaux de 5 000 événements.
 */
export async function POST(req: Request) {
  const ip = ipOf(req);
  if (!rateOk(`ev:${ip}`, 120, 60_000)) return NextResponse.json({ ok: false }, { status: 429 });
  // Anti-DoS : taille réelle du corps (insensible à Transfer-Encoding: chunked sans Content-Length)
  const raw = await req.text().catch(() => "");
  if (raw.length > 20_000) return NextResponse.json({ ok: false }, { status: 413 });
  let b: Record<string, unknown> | null = null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") b = parsed as Record<string, unknown>;
  } catch {
    b = null;
  }
  if (!b) return NextResponse.json({ ok: false }, { status: 400 });

  const event = str(b.event, 40);
  if (!event) return NextResponse.json({ ok: false }, { status: 400 });

  // UTM : uniquement des chaînes courtes
  const utmIn = b.utm && typeof b.utm === "object" ? (b.utm as Record<string, unknown>) : {};
  const utm: Record<string, string> = {};
  for (const [k, v] of Object.entries(utmIn).slice(0, 8)) {
    if (typeof v === "string" || typeof v === "number") utm[str(k, 20)] = str(v, 80);
  }

  try {
    await addRow(
      "events",
      {
        event,
        vid: str(b.vid, 24),
        page: str(b.page, 120),
        label: str(b.label, 120),
        ref: str(b.ref, 160),
        utm,
        lang: str(b.lang, 5),
      },
      5000
    );
  } catch {
    /* journalisation non critique : échec silencieux */
  }
  return NextResponse.json({ ok: true });
}
