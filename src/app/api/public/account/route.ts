/**
 * Comptes membres (site public) — Supabase Auth piloté côté SERVEUR.
 * Actions : signup | resend | login | me | logout | forgot | reset
 * Sécurité : quotas par IP fiable (dernière valeur XFF), honeypot, corps borné,
 * validation stricte, aucune énumération de comptes sur forgot/resend,
 * jetons de session HMAC dédiés (secret distinct de l'admin), cookie HttpOnly.
 */
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSettings, ipOf, makeMemberToken, MEMBER_COOKIE, rateOkDb, verifyMemberToken } from "@/lib/db";
import { authApiKey, supa, supaReady, supaUrl } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const str = (v: unknown, max: number) =>
  String(v ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, max);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
const passOk = (p: string) => p.length >= 8 && p.length <= 128 && /[a-zA-Z]/.test(p) && /[0-9]/.test(p);

async function readBody(req: Request, maxBytes = 10_000) {
  const raw = await req.text().catch(() => "");
  if (raw.length > maxBytes) return { tooBig: true as const, body: null };
  try {
    const b = JSON.parse(raw);
    return { tooBig: false as const, body: b && typeof b === "object" ? (b as Record<string, unknown>) : null };
  } catch {
    return { tooBig: false as const, body: null };
  }
}

/** Appel GoTrue brut (Auth Supabase) — serveur uniquement. */
async function gotrue(path: string, body?: Record<string, unknown>) {
  const r = await fetch(`${supaUrl()}/auth/v1/${path}`, {
    method: body ? "POST" : "GET",
    headers: { "Content-Type": "application/json", apikey: authApiKey(), Authorization: `Bearer ${authApiKey()}` },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = (await r.json().catch(() => ({}))) as Record<string, unknown>;
  return { status: r.status, data };
}

const siteUrl = (req: Request) => process.env.SITE_URL || new URL(req.url).origin;

async function memberTokFrom(req: Request) {
  return req.headers.get("x-aks-member") || (await cookies()).get(MEMBER_COOKIE)?.value || undefined;
}

const cookieOpts = () => ({
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 30 * 86400,
  secure: process.env.NODE_ENV === "production",
});

const bad = (code: string) => NextResponse.json({ ok: false, code }, { status: 400 });
const limited = () => NextResponse.json({ ok: false, code: "rate_limited" }, { status: 429 });
const unavailable = () =>
  NextResponse.json({ ok: false, code: "unavailable", error: "Service comptes indisponible." }, { status: 503 });
const serverErr = () => NextResponse.json({ ok: false, code: "server_error" }, { status: 502 });

async function profileOf(userId: string) {
  const s = supa()!;
  const [{ data: m }, { data: u }] = await Promise.all([
    s.from("members").select("*").eq("id", userId).maybeSingle(),
    s.auth.admin.getUserById(userId),
  ]);
  if (!m) return { ok: false as const, code: "no_profile" };
  const { memberDiscount } = await getSettings();
  const mm = m as Record<string, unknown>;
  return {
    ok: true as const,
    profile: {
      firstName: String(mm.first_name ?? ""),
      lastName: String(mm.last_name ?? ""),
      email: String(mm.email ?? ""),
      newsletter: Boolean(mm.newsletter),
      confirmed: Boolean(u?.user?.email_confirmed_at),
    },
    discount: memberDiscount,
  };
}

export async function GET(req: Request) {
  if (!supaReady()) return unavailable();
  try {
    const tok = await memberTokFrom(req);
    const userId = await verifyMemberToken(tok);
    if (!userId) return NextResponse.json({ ok: false, code: "no_session" }, { status: 401 });
    const prof = await profileOf(userId);
    if (!prof.ok) return NextResponse.json({ ok: false, code: prof.code }, { status: 401 });
    return NextResponse.json({ ...prof, token: tok }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return serverErr();
  }
}

export async function POST(req: Request) {
  if (!supaReady()) return unavailable();
  const ip = ipOf(req);
  const { tooBig, body: b } = await readBody(req, 10_000);
  if (tooBig) return NextResponse.json({ ok: false, code: "payload", error: "Charge trop volumineuse." }, { status: 413 });
  if (!b) return bad("invalid");
  if (str(b.website, 20)) return bad("bot"); // honeypot
  const action = str(b.action, 20);
  const jar = await cookies();
  const s = supa()!;

  try {
    /* ---------- Création de compte ---------- */
    if (action === "signup") {
      if (!await rateOkDb(`signup:${ip}`, 5, 3_600_000)) return limited();
      const firstName = str(b.firstName, 40);
      const lastName = str(b.lastName, 40);
      const email = str(b.email, 120).toLowerCase();
      const password = String(b.password ?? "");
      if (firstName.length < 2 || lastName.length < 2) return bad("name");
      if (!EMAIL_RE.test(email)) return bad("email");
      if (!passOk(password)) return bad("password");
      const { error } = await s.auth.admin.createUser({
        email,
        password,
        email_confirm: false, // l'e-mail de confirmation (Brevo SMTP) doit être cliqué
        user_metadata: { first_name: firstName, last_name: lastName, newsletter: b.newsletter === true },
      });
      if (error) {
        if (/already|registered|exists/i.test(error.message)) {
          return NextResponse.json({ ok: false, code: "email_exists" }, { status: 409 });
        }
        return serverErr();
      }
      return NextResponse.json({ ok: true, confirm: true, email });
    }

    /* ---------- Renvoi de l'e-mail de confirmation ---------- */
    if (action === "resend") {
      if (!await rateOkDb(`resend:${ip}`, 3, 3_600_000)) return limited();
      const email = str(b.email, 120).toLowerCase();
      if (!EMAIL_RE.test(email)) return bad("email");
      await gotrue("resend", { email, type: "signup" });
      return NextResponse.json({ ok: true }); // réponse toujours identique → pas d'énumération de comptes
    }

    /* ---------- Connexion ---------- */
    if (action === "login") {
      if (!await rateOkDb(`mlogin:${ip}`, 10, 120_000)) return limited();
      const email = str(b.email, 120).toLowerCase();
      const password = String(b.password ?? "").slice(0, 128);
      if (!EMAIL_RE.test(email) || !password) return bad("credentials");
      const { status, data } = await gotrue("token?grant_type=password", { email, password });
      if (status !== 200 || !data?.user) {
        if (String((data as { error_code?: string })?.error_code ?? "") === "email_not_confirmed") {
          return NextResponse.json({ ok: false, code: "not_confirmed" }, { status: 403 });
        }
        return NextResponse.json({ ok: false, code: "bad_credentials" }, { status: 401 });
      }
      const user = data.user as { id: string };
      const prof = await profileOf(user.id);
      if (!prof.ok) return serverErr();
      const tok = await makeMemberToken(user.id);
      jar.set(MEMBER_COOKIE, tok, cookieOpts());
      return NextResponse.json({ ...prof, token: tok });
    }

    /* ---------- Session courante ---------- */
    if (action === "me") {
      const tok = await memberTokFrom(req);
      const userId = await verifyMemberToken(tok);
      if (!userId) return NextResponse.json({ ok: false, code: "no_session" }, { status: 401 });
      const prof = await profileOf(userId);
      if (!prof.ok) return NextResponse.json({ ok: false, code: prof.code }, { status: 401 });
      return NextResponse.json({ ...prof, token: tok });
    }

    /* ---------- Déconnexion ---------- */
    if (action === "logout") {
      jar.delete(MEMBER_COOKIE);
      return NextResponse.json({ ok: true });
    }

    /* ---------- Mot de passe oublié (toujours ok → pas d'énumération) ---------- */
    if (action === "forgot") {
      if (!await rateOkDb(`forgot:${ip}`, 3, 3_600_000)) return limited();
      const email = str(b.email, 120).toLowerCase();
      if (!EMAIL_RE.test(email)) return bad("email");
      await gotrue(`recover?redirect_to=${encodeURIComponent(`${siteUrl(req)}/connexion`)}`, { email });
      return NextResponse.json({ ok: true });
    }

    /* ---------- Réinitialisation (lien reçu par e-mail) ---------- */
    if (action === "reset") {
      if (!await rateOkDb(`reset:${ip}`, 5, 3_600_000)) return limited();
      const tokenHash = str(b.tokenHash, 2000);
      const password = String(b.password ?? "");
      if (!tokenHash) return bad("token");
      if (!passOk(password)) return bad("password");
      const { status, data } = await gotrue("verify", { token_hash: tokenHash, type: "recovery" });
      if (status !== 200 || !data?.user) return NextResponse.json({ ok: false, code: "bad_token" }, { status: 400 });
      const user = data.user as { id: string };
      const { error } = await s.auth.admin.updateUserById(user.id, { password });
      if (error) return serverErr();
      return NextResponse.json({ ok: true });
    }

    return bad("unknown_action");
  } catch {
    return serverErr();
  }
}
