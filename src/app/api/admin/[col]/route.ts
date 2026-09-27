import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { addRow, Col, COOKIE, delRow, getSettings, listRows, notify, patchRow, setMemberDiscount, verifyToken } from "@/lib/db";

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

const dbErr = () => NextResponse.json({ error: "base temporairement indisponible" }, { status: 502 });

async function readBody(req: Request, maxBytes = 100_000) {
  const raw = await req.text().catch(() => "");
  if (raw.length > maxBytes) return { tooBig: true as const, body: null };
  try {
    const b = JSON.parse(raw);
    return { tooBig: false as const, body: b && typeof b === "object" ? (b as Record<string, unknown>) : null };
  } catch {
    return { tooBig: false as const, body: null };
  }
}

export async function GET(req: Request, ctx: { params: Promise<{ col: string }> }) {
  if (!(await authed(req))) return NextResponse.json({ error: "non autorisé" }, { status: 401 });
  const { col } = await ctx.params;
  try {
    if (col === "settings") return NextResponse.json({ memberDiscount: (await getSettings()).memberDiscount });
    if (!COLS.includes(col as Col)) return NextResponse.json({ error: "collection inconnue" }, { status: 404 });
    return NextResponse.json(await listRows(col as Col));
  } catch {
    return dbErr();
  }
}

export async function POST(req: Request, ctx: { params: Promise<{ col: string }> }) {
  if (!(await authed(req))) return NextResponse.json({ error: "non autorisé" }, { status: 401 });
  const { col } = await ctx.params;
  if (!COLS.includes(col as Col)) return NextResponse.json({ error: "collection inconnue" }, { status: 404 });
  const { tooBig, body } = await readBody(req);
  if (tooBig) return NextResponse.json({ error: "charge trop volumineuse" }, { status: 413 });
  if (!body) return NextResponse.json({ error: "corps invalide" }, { status: 400 });
  try {
    const row = await addRow(col as Col, body);
    return NextResponse.json(row, { status: 201 });
  } catch {
    return dbErr();
  }
}

export async function PATCH(req: Request, ctx: { params: Promise<{ col: string }> }) {
  if (!(await authed(req))) return NextResponse.json({ error: "non autorisé" }, { status: 401 });
  const { col } = await ctx.params;
  const { tooBig, body } = await readBody(req);
  if (tooBig) return NextResponse.json({ error: "charge trop volumineuse" }, { status: 413 });
  if (!body) return NextResponse.json({ error: "corps invalide" }, { status: 400 });
  const { id, ...rest } = body as Record<string, unknown> & { id?: string };

  // Durcissement : clés dangereuses (pollution de prototype) et champs immuables rejetés
  const DANGER = new Set(["__proto__", "constructor", "prototype", "createdAt"]);
  const patch: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(rest)) if (!DANGER.has(k)) patch[k] = v;

  try {
    if (col === "settings") {
      if (
        typeof patch.memberDiscount === "number" && Number.isFinite(patch.memberDiscount) &&
        patch.memberDiscount >= 0 && patch.memberDiscount <= 50
      ) {
        const n = Math.round(patch.memberDiscount);
        await setMemberDiscount(n);
        await notify(`Réduction membre réglée à ${n} %`, "badge", false);
        return NextResponse.json({ ok: true, memberDiscount: n });
      }
      return NextResponse.json({ ok: true, memberDiscount: (await getSettings()).memberDiscount });
    }
    if (!COLS.includes(col as Col) || !id) return NextResponse.json({ error: "demande invalide" }, { status: 400 });

    // Statuts valides uniquement (intégrité des données + kanban)
    const BOOKING_STATUS = ["deposit_proof", "confirmed", "ongoing", "done", "cancelled"];
    const QUOTE_STATUS = ["nouveau", "envoyé", "accepté", "refusé"];
    const c = col as Col;
    if (c === "bookings" && patch.status !== undefined && !BOOKING_STATUS.includes(String(patch.status))) delete patch.status;
    if (c === "quotes" && patch.status !== undefined && !QUOTE_STATUS.includes(String(patch.status))) delete patch.status;

    // effets métier
    if (c === "bookings" && patch.status === "confirmed") {
      await notify("Acompte validé — réservation confirmée, date bloquée", "check", false);
    }
    const row = await patchRow(c, String(id), patch);
    if (!row) return NextResponse.json({ error: "introuvable" }, { status: 404 });
    return NextResponse.json(row);
  } catch {
    return dbErr();
  }
}

export async function DELETE(req: Request, ctx: { params: Promise<{ col: string }> }) {
  if (!(await authed(req))) return NextResponse.json({ error: "non autorisé" }, { status: 401 });
  const { col } = await ctx.params;
  if (!COLS.includes(col as Col)) return NextResponse.json({ error: "collection inconnue" }, { status: 404 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id manquant" }, { status: 400 });
  try {
    return NextResponse.json({ ok: await delRow(col as Col, id) });
  } catch {
    return dbErr();
  }
}
