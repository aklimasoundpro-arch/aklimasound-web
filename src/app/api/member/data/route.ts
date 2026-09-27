/** Espace membre : historique des devis et réservations du membre connecté. */
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSettings, MEMBER_COOKIE, verifyMemberToken } from "@/lib/db";
import { supa, supaReady } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const camel = (o: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(o).map(([k, v]) => [k.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase()), v]));

export async function GET(req: Request) {
  if (!supaReady()) return NextResponse.json({ ok: false, code: "unavailable" }, { status: 503 });
  try {
    const tok = req.headers.get("x-aks-member") || (await cookies()).get(MEMBER_COOKIE)?.value || undefined;
    const userId = await verifyMemberToken(tok);
    if (!userId) return NextResponse.json({ ok: false, code: "no_session" }, { status: 401 });
    const s = supa()!;
    const [q, bk] = await Promise.all([
      s.from("quotes").select("id,created_at,domain,offer,date,place,total,status,msg")
        .eq("member_id", userId).order("created_at", { ascending: false }).limit(50),
      s.from("bookings").select("id,created_at,domain,offer,date,place,total,deposit_rate,proof_ref,proof_file,status")
        .eq("member_id", userId).order("created_at", { ascending: false }).limit(50),
    ]);
    if (q.error || bk.error) throw new Error(q.error?.message || bk.error?.message || "supabase");
    const { memberDiscount } = await getSettings();
    return NextResponse.json(
      {
        ok: true,
        discount: memberDiscount,
        quotes: ((q.data ?? []) as Record<string, unknown>[]).map(camel),
        bookings: ((bk.data ?? []) as Record<string, unknown>[]).map(camel),
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json({ ok: false, code: "server_error" }, { status: 502 });
  }
}
