import { NextResponse } from "next/server";
import { addRow, notify, rateOk } from "@/lib/db";

export const dynamic = "force-dynamic";

const str = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
const num = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : 0;
};

/** Soumissions publiques : leads, devis, réservations. POST uniquement. */
export async function POST(req: Request, ctx: { params: Promise<{ col: string }> }) {
  const { col } = await ctx.params;
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  if (!rateOk(`pub:${col}:${ip}`, 6, 60_000)) {
    return NextResponse.json({ ok: false, error: "Trop de demandes. Réessayez dans une minute." }, { status: 429 });
  }
  const b = await req.json().catch(() => null) as Record<string, unknown> | null;
  if (!b || str(b.website, 20)) return NextResponse.json({ ok: false }, { status: 400 }); // honeypot

  if (col === "leads") {
    const name = str(b.name, 80), phone = str(b.phone, 20), email = str(b.email, 120);
    if (name.length < 5 || !/^[+0-9 ().-]{8,20}$/.test(phone)) return NextResponse.json({ ok: false }, { status: 400 });
    addRow("leads", { name, phone, email, source: str(b.source, 40) || "WhatsApp (porte)" });
    return NextResponse.json({ ok: true });
  }

  if (col === "quotes") {
    const name = str(b.name, 80), phone = str(b.phone, 20);
    if (name.length < 2 || !/^[+0-9 ().-]{8,20}$/.test(phone)) return NextResponse.json({ ok: false }, { status: 400 });
    const offer = str(b.offer, 80) || "À conseiller";
    addRow("quotes", {
      name, phone, email: str(b.email, 120), domain: str(b.domain, 60), offer,
      date: str(b.date, 10), place: str(b.place, 80), total: num(b.total),
      source: str(b.source, 30) || "formulaire", status: "nouveau", msg: str(b.msg, 600),
    });
    notify(`Nouvelle demande de devis — ${offer}${b.domain ? ` (${b.domain})` : ""}`, "file", true);
    return NextResponse.json({ ok: true });
  }

  if (col === "bookings") {
    const customer = str(b.customer, 80), phone = str(b.phone, 20);
    if (customer.length < 2 || !/^[+0-9 ().-]{8,20}$/.test(phone)) return NextResponse.json({ ok: false }, { status: 400 });
    const rate = num(b.depositRate) === 50 ? 50 : 30;
    const total = num(b.total);
    const deposit = total ? Math.round((total * rate) / 100 / 500) * 500 : 0;
    addRow("bookings", {
      customer, phone, domain: str(b.domain, 60), offer: str(b.offer, 80),
      date: str(b.date, 10), place: str(b.place, 80), total,
      depositRate: rate, proofRef: str(b.proofRef, 40), status: "deposit_proof",
      channel: str(b.channel, 30) || "site",
    });
    notify(`Preuve d'acompte à valider — ${customer}${deposit ? ` (${deposit.toLocaleString("fr-FR")} F × ${rate} %)` : ""}`, "check", true);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: "collection inconnue" }, { status: 404 });
}
