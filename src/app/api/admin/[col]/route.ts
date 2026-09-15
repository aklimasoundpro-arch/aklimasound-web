import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIE, Col, addRow, db, delRow, notify, patchRow, persist, verifyToken } from "@/lib/db";

export const dynamic = "force-dynamic";
const COLS: Col[] = ["leads", "quotes", "bookings", "products", "notifications", "events"];

async function authed(req: Request) {
  const url = new URL(req.url);
  const tok =
    url.searchParams.get("tok") ||
    req.headers.get("x-aks-token") ||
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    (await cookies()).get(COOKIE)?.value ||
    undefined;
  return verifyToken(tok);
}

export async function GET(req: Request, ctx: { params: Promise<{ col: string }> }) {
  if (!(await authed(req))) return NextResponse.json({ error: "non autorisé" }, { status: 401 });
  const { col } = await ctx.params;
  const d = db();
  if (col === "settings") return NextResponse.json({ memberDiscount: d.settings.memberDiscount });
  if (!COLS.includes(col as Col)) return NextResponse.json({ error: "collection inconnue" }, { status: 404 });
  return NextResponse.json(d[col as Col]);
}

export async function POST(req: Request, ctx: { params: Promise<{ col: string }> }) {
  if (!(await authed(req))) return NextResponse.json({ error: "non autorisé" }, { status: 401 });
  const { col } = await ctx.params;
  if (!COLS.includes(col as Col)) return NextResponse.json({ error: "collection inconnue" }, { status: 404 });
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "corps invalide" }, { status: 400 });
  const row = addRow(col as Col, body as Record<string, unknown>);
  return NextResponse.json(row, { status: 201 });
}

export async function PATCH(req: Request, ctx: { params: Promise<{ col: string }> }) {
  if (!(await authed(req))) return NextResponse.json({ error: "non autorisé" }, { status: 401 });
  const { col } = await ctx.params;
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "corps invalide" }, { status: 400 });
  const { id, ...patch } = body as Record<string, unknown> & { id?: string };

  if (col === "settings") {
    const d = db();
    if (typeof patch.memberDiscount === "number" && patch.memberDiscount >= 0 && patch.memberDiscount <= 50) {
      d.settings.memberDiscount = Math.round(patch.memberDiscount);
      persist();
      notify(`Réduction membre réglée à ${d.settings.memberDiscount} %`, "badge", false);
    }
    return NextResponse.json({ ok: true, memberDiscount: d.settings.memberDiscount });
  }
  if (!COLS.includes(col as Col) || !id) return NextResponse.json({ error: "demande invalide" }, { status: 400 });

  const c = col as Col;
  // effets métier
  if (c === "bookings" && patch.status === "confirmed") {
    notify("Acompte validé — réservation confirmée, date bloquée", "check", false);
  }
  const row = patchRow(c, String(id), patch);
  if (!row) return NextResponse.json({ error: "introuvable" }, { status: 404 });
  return NextResponse.json(row);
}

export async function DELETE(req: Request, ctx: { params: Promise<{ col: string }> }) {
  if (!(await authed(req))) return NextResponse.json({ error: "non autorisé" }, { status: 401 });
  const { col } = await ctx.params;
  if (!COLS.includes(col as Col)) return NextResponse.json({ error: "collection inconnue" }, { status: 404 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id manquant" }, { status: 400 });
  return NextResponse.json({ ok: delRow(col as Col, id) });
}
