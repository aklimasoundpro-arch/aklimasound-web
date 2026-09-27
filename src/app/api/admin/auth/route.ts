import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIE, ipOf, makeToken, rateOk, rateReset, setPassword, verifyPass, verifyToken } from "@/lib/db";

export const dynamic = "force-dynamic";

async function tokFrom(req: Request) {
  const url = new URL(req.url);
  return (
    url.searchParams.get("tok") ||
    req.headers.get("x-aks-token") ||
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    (await cookies()).get(COOKIE)?.value ||
    undefined
  );
}

export async function GET(req: Request) {
  return NextResponse.json({ ok: verifyToken(await tokFrom(req)) }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  const ip = ipOf(req);
  let body: Record<string, string>;
  try {
    const raw = await req.text();
    if (raw.length > 10_000) return NextResponse.json({ ok: false, error: "Charge trop volumineuse." }, { status: 413 });
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }
  const { action } = body;
  const jar = await cookies();

  if (action === "login") {
    if (!rateOk(`login:${ip}`, 10, 120_000)) {
      return NextResponse.json({ ok: false, error: "Trop de tentatives. Réessayez dans 2 minutes." }, { status: 429 });
    }
    if (!verifyPass(String(body.password ?? ""))) {
      return NextResponse.json({ ok: false, error: "Mot de passe incorrect." }, { status: 401 });
    }
    rateReset(`login:${ip}`);
    const tok = makeToken();
    jar.set(COOKIE, tok, {
      httpOnly: true, sameSite: "lax", path: "/",
      maxAge: 7 * 86400, secure: process.env.NODE_ENV === "production",
    });
    return NextResponse.json({ ok: true, token: tok });
  }

  if (action === "logout") {
    jar.delete(COOKIE);
    return NextResponse.json({ ok: true });
  }

  if (action === "password") {
    if (!verifyToken(await tokFrom(req))) return NextResponse.json({ ok: false }, { status: 401 });
    if (!verifyPass(String(body.current ?? ""))) return NextResponse.json({ ok: false, error: "Mot de passe actuel incorrect." }, { status: 401 });
    const next = String(body.next ?? "");
    if (next.length < 10 || !/[A-Z]/.test(next) || !/[0-9]/.test(next)) {
      return NextResponse.json({ ok: false, error: "Nouveau mot de passe : 10 caractères min., 1 majuscule, 1 chiffre." }, { status: 400 });
    }
    setPassword(next);
    const tok = makeToken();
    jar.set(COOKIE, tok, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 7 * 86400, secure: process.env.NODE_ENV === "production" });
    return NextResponse.json({ ok: true, token: tok });
  }

  return NextResponse.json({ ok: false, error: "Action inconnue." }, { status: 400 });
}
