/**
 * Upload de la preuve d'acompte (membre connecté, pour SA réservation).
 * Garde-fous : type MIME sur liste blanche + octets magiques vérifiés (le type
 * déclaré doit correspondre au contenu réel), 5 Mo max, quota 10/heure/membre,
 * bucket privé, chemin non devinable {member_id}/{booking_id}/{uuid}.{ext}.
 */
import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { MEMBER_COOKIE, notify, patchRow, rateOkDb, verifyMemberToken } from "@/lib/db";
import { supa, supaReady } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const MAX_BYTES = 5 * 1024 * 1024;

const MAGIC: Record<string, (b: Buffer) => boolean> = {
  "image/jpeg": (b) => b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  "image/png": (b) => b.length > 4 && b.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47])),
  "image/webp": (b) => b.length > 12 && b.subarray(0, 4).toString("latin1") === "RIFF" && b.subarray(8, 12).toString("latin1") === "WEBP",
  "application/pdf": (b) => b.length > 5 && b.subarray(0, 5).toString("latin1") === "%PDF-",
};
const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "application/pdf": "pdf" };

export async function POST(req: Request) {
  if (!supaReady()) return NextResponse.json({ ok: false, code: "unavailable" }, { status: 503 });
  try {
    const tok = req.headers.get("x-aks-member") || (await cookies()).get(MEMBER_COOKIE)?.value || undefined;
    const userId = await verifyMemberToken(tok);
    if (!userId) return NextResponse.json({ ok: false, code: "no_session" }, { status: 401 });
    if (!await rateOkDb(`upload:${userId}`, 10, 3_600_000)) {
      return NextResponse.json({ ok: false, code: "rate_limited" }, { status: 429 });
    }

    const form = await req.formData().catch(() => null);
    const file = form?.get("file");
    const bookingId = String(form?.get("bookingId") ?? "");
    if (!(file instanceof File) || !/^[0-9a-fA-F-]{36}$/.test(bookingId)) {
      return NextResponse.json({ ok: false, code: "invalid" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) return NextResponse.json({ ok: false, code: "too_large" }, { status: 413 });

    const type = file.type;
    const check = MAGIC[type];
    if (!check) return NextResponse.json({ ok: false, code: "bad_type" }, { status: 415 });
    const buf = Buffer.from(await file.arrayBuffer());
    if (!check(buf)) return NextResponse.json({ ok: false, code: "bad_type" }, { status: 415 }); // contenu ≠ type déclaré

    const s = supa()!;
    const { data: booking } = await s
      .from("bookings")
      .select("id,status,member_id,customer")
      .eq("id", bookingId)
      .maybeSingle();
    // Réponse volontairement identique (403) si la réservation n'existe pas ou appartient à un autre membre
    if (!booking || booking.member_id !== userId) {
      return NextResponse.json({ ok: false, code: "forbidden" }, { status: 403 });
    }
    if (!["deposit_proof", "confirmed"].includes(String(booking.status))) {
      return NextResponse.json({ ok: false, code: "bad_status" }, { status: 409 });
    }

    const path = `${userId}/${bookingId}/${randomUUID()}.${EXT[type]}`;
    const { error } = await s.storage.from("aks-preuves").upload(path, buf, { contentType: type, upsert: false });
    if (error) return NextResponse.json({ ok: false, code: "server_error" }, { status: 502 });

    await patchRow("bookings", bookingId, { proofFile: path });
    await notify(`Preuve d'acompte reçue (membre) — ${String(booking.customer).slice(0, 60)}`, "check", true);
    return NextResponse.json({ ok: true, path });
  } catch {
    return NextResponse.json({ ok: false, code: "server_error" }, { status: 502 });
  }
}
