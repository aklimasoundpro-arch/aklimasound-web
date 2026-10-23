import { NextResponse } from "next/server";
import { getSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Réglages publics non sensibles : réduction membre + pop-up d'accueil. */
export async function GET() {
  const h = { "Cache-Control": "no-store" };
  try {
    const s = await getSettings();
    return NextResponse.json({ memberDiscount: s.memberDiscount, signupPopup: s.signupPopup }, { headers: h });
  } catch {
    return NextResponse.json({ memberDiscount: 0, signupPopup: false }, { headers: h });
  }
}
