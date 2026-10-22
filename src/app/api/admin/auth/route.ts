import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIE, ipOf, makeToken, rateOkDb, rateReset, setPassword, verifyPass, verifyToken } from "@/lib/db";

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
  try {
    return NextResponse.json({ ok: await verifyToken(await tokFrom(req)) }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 });
  }
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

  try {
    if (action === "login") {
      if (!await rateOkDb(`login:${ip}`, 10, 120_000)) {
        return NextResponse.json({ ok: false, error: "Trop de tentatives. Réessayez dans 2 minutes." }, { status: 429 });
      }
      if (!(await verifyPass(String(body.password ?? "")))) {
        return NextResponse.json({ ok: false, error: "Mot de passe incorrect." }, { status: 401 });
      }
      rateReset(`login:${ip}`);
      const tok = await makeToken();
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
      if (!(await verifyToken(await tokFrom(req)))) return NextResponse.json({ ok: false }, { status: 401 });
      if (!(await verifyPass(String(body.current ?? "")))) {
        return NextResponse.json({ ok: false, error: "Mot de passe actuel incorrect." }, { status: 401 });
      }
      const next = String(body.next ?? "");
      if (next.length < 10 || !/[A-Z]/.test(next) || !/[0-9]/.test(next)) {
        return NextResponse.json({ ok: false, error: "Nouveau mot de passe : 10 caractères min., 1 majuscule, 1 chiffre." }, { status: 400 });
      }
      await setPassword(next);
      const tok = await makeToken();
      jar.set(COOKIE, tok, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 7 * 86400, secure: process.env.NODE_ENV === "production" });
      return NextResponse.json({ ok: true, token: tok });
    }

    return NextResponse.json({ ok: false, error: "Action inconnue." }, { status: 400 });
  } catch {
    return NextResponse.json({ ok: false, error: "Service temporairement indisponible." }, { status: 502 });
  }
}
