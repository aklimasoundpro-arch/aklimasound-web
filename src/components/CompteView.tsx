"use client";
/** Espace membre : profil, réduction, historique devis/réservations, preuve d'acompte. */
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { QuoteModal } from "./Modals";
import { Reveal } from "./motion";
import { SectionHead } from "./ui";
import { Icon } from "./icons";
import { useI18n } from "@/lib/i18n";
import { useMember } from "@/lib/member";
import { fcfa } from "@/lib/data";
import { track } from "@/lib/track";

type QuoteRow = {
  id: string; createdAt: string; domain: string; offer: string; date: string;
  place: string; total: number; status: string; msg: string;
};
type BookingRow = {
  id: string; createdAt: string; domain: string; offer: string; date: string; place: string;
  total: number; depositRate: number; proofRef: string; proofFile: string; status: string;
};

const QUOTE_STATUS: Record<string, { fr: string; en: string }> = {
  nouveau: { fr: "Nouveau", en: "New" },
  "envoyé": { fr: "Envoyé", en: "Sent" },
  "accepté": { fr: "Accepté", en: "Accepted" },
  "refusé": { fr: "Refusé", en: "Declined" },
};
const BOOKING_STATUS: Record<string, { fr: string; en: string }> = {
  deposit_proof: { fr: "Acompte à confirmer", en: "Deposit to confirm" },
  confirmed: { fr: "Confirmée", en: "Confirmed" },
  ongoing: { fr: "En cours", en: "Ongoing" },
  done: { fr: "Terminée", en: "Completed" },
  cancelled: { fr: "Annulée", en: "Cancelled" },
};
const CHIP: Record<string, string> = {
  nouveau: "border-gold/40 text-gold",
  "envoyé": "border-ivory/30 text-ivory/70",
  "accepté": "border-wa/40 text-wa",
  "refusé": "border-live/40 text-live",
  deposit_proof: "border-gold/40 text-gold",
  confirmed: "border-wa/40 text-wa",
  ongoing: "border-live/40 text-live",
  done: "border-ivory/30 text-ivory/70",
  cancelled: "border-ivory/15 text-ivory/40",
};

export default function CompteView() {
  const { lang } = useI18n();
  const fr = lang === "fr";
  const router = useRouter();
  const { ready, connected, profile, discount, call, setTokenLocal, getToken } = useMember();
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quotes, setQuotes] = useState<QuoteRow[]>([]);
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [busyResend, setBusyResend] = useState(false);
  const [info, setInfo] = useState("");
  const [upState, setUpState] = useState<Record<string, string>>({});
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const load = useCallback(async () => {
    try {
      const tok = getToken();
      const r = await fetch("/api/member/data", {
        headers: tok ? { "x-aks-member": tok } : {},
        credentials: "include",
        cache: "no-store",
      });
      const j = (await r.json().catch(() => ({}))) as { ok?: boolean; quotes?: QuoteRow[]; bookings?: BookingRow[] };
      if (j.ok) {
        setQuotes(j.quotes ?? []);
        setBookings(j.bookings ?? []);
      }
    } catch { /* silencieux */ }
    setLoaded(true);
  }, [getToken]);

  useEffect(() => {
    if (connected) {
      void load();
      track("compte_view");
    }
  }, [connected, load]);

  async function resendConfirm() {
    if (!profile || busyResend) return;
    setBusyResend(true);
    const r = await call({ action: "resend", email: profile.email });
    setBusyResend(false);
    setInfo(r.ok
      ? (fr ? "E-mail de confirmation renvoyé." : "Confirmation email resent.")
      : (fr ? "Trop de tentatives, réessayez plus tard." : "Too many attempts, try again later."));
  }

  async function upload(bookingId: string, file: File | null) {
    if (!file) return;
    setUpState((s) => ({ ...s, [bookingId]: "busy" }));
    const fd = new FormData();
    fd.append("file", file);
    fd.append("bookingId", bookingId);
    try {
      const tok = getToken();
      const r = await fetch("/api/member/upload", {
        method: "POST",
        headers: tok ? { "x-aks-member": tok } : {},
        credentials: "include",
        body: fd,
      });
      const j = (await r.json().catch(() => ({}))) as { ok?: boolean; code?: string };
      if (j.ok) {
        setUpState((s) => ({ ...s, [bookingId]: "ok" }));
        track("proof_uploaded");
        void load();
      } else {
        const up: Record<string, { fr: string; en: string }> = {
          too_large: { fr: "Fichier trop lourd (5 Mo max).", en: "File too large (5 MB max)." },
          bad_type: { fr: "Format refusé — JPEG, PNG, WebP ou PDF uniquement.", en: "Format rejected — JPEG, PNG, WebP or PDF only." },
          rate_limited: { fr: "Trop d'envois, réessayez plus tard.", en: "Too many uploads, try again later." },
          bad_status: { fr: "Cette réservation n'attend plus de preuve.", en: "This booking no longer expects a proof." },
        };
        setUpState((s) => ({ ...s, [bookingId]: (j.code && up[j.code]) ? (fr ? up[j.code!].fr : up[j.code!].en) : (fr ? "Échec de l'envoi." : "Upload failed.") }));
      }
    } catch {
      setUpState((s) => ({ ...s, [bookingId]: fr ? "Connexion impossible." : "Cannot connect." }));
    }
  }

  async function logout() {
    await call({ action: "logout" });
    setTokenLocal(null);
    router.push("/");
  }

  const d = (iso: string) => {
    try { return new Date(iso).toLocaleDateString(fr ? "fr-FR" : "en-GB", { day: "numeric", month: "short", year: "numeric" }); }
    catch { return iso.slice(0, 10); }
  };

  return (
    <>
      <Navbar onQuote={() => setQuoteOpen(true)} />
      <main className="relative min-h-screen px-4 pb-24 pt-28 sm:px-6">
        <div className="mx-auto max-w-5xl">
          {!ready ? (
            <p className="py-24 text-center text-ivory/50">{fr ? "Chargement…" : "Loading…"}</p>
          ) : !connected ? (
            <div className="glass mx-auto max-w-md rounded-3xl p-10 text-center">
              <h1 className="font-display text-2xl font-bold">{fr ? "Espace membres" : "Member area"}</h1>
              <p className="mt-3 text-sm text-ivory/65">
                {fr
                  ? "Connectez-vous pour retrouver vos devis, vos réservations et vos prix membres réduits."
                  : "Sign in to see your quotes, bookings and reduced member prices."}
              </p>
              <Link href="/connexion" className="btn btn-gold mt-6 w-full">{fr ? "Se connecter / Créer un compte" : "Sign in / Create account"}</Link>
            </div>
          ) : (
            <>
              {/* En-tête membre */}
              <Reveal>
                <div className="glass flex flex-wrap items-center justify-between gap-4 rounded-3xl p-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-gold/80">{fr ? "Espace membres" : "Member area"}</p>
                    <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">
                      {fr ? "Bonjour" : "Hello"} {profile?.firstName} {profile?.lastName}
                    </h1>
                    <p className="mt-1 text-sm text-ivory/55">{profile?.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {discount > 0 && (
                      <span className="chip border-gold/40 text-gold">{fr ? `Prix membre −${discount} % activé` : `Member price −${discount}% active`}</span>
                    )}
                    <button onClick={logout} className="btn btn-outline !py-2 text-sm">{fr ? "Se déconnecter" : "Sign out"}</button>
                  </div>
                </div>
              </Reveal>

              {info && <p className="mt-4 rounded-xl border border-wa/30 bg-wa/10 p-3 text-sm text-ivory/85">{info}</p>}

              {/* E-mail non confirmé */}
              {profile && !profile.confirmed && (
                <Reveal>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gold/40 bg-gold/10 p-4 text-sm text-ivory/80">
                    <span>{fr ? "Confirmez votre e-mail pour activer pleinement votre compte (lien envoyé à l'inscription)." : "Confirm your email to fully activate your account (link sent at signup)."}</span>
                    <button onClick={resendConfirm} disabled={busyResend} className="btn btn-outline !py-1.5 text-xs">
                      {fr ? "Renvoyer l'e-mail" : "Resend email"}
                    </button>
                  </div>
                </Reveal>
              )}

              {/* Profil */}
              <Reveal>
                <section className="mt-8">
                  <SectionHead kicker={fr ? "Mon profil" : "My profile"} title={fr ? "Informations du compte" : "Account information"} />
                  <div className="glass mt-6 grid gap-4 rounded-3xl p-6 sm:grid-cols-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-ivory/40">{fr ? "Prénom" : "First name"}</p>
                      <p className="mt-1 font-semibold">{profile?.firstName || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-ivory/40">{fr ? "Nom" : "Last name"}</p>
                      <p className="mt-1 font-semibold">{profile?.lastName || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-ivory/40">Newsletter</p>
                      <p className="mt-1 font-semibold">
                        {profile?.newsletter
                          ? (fr ? "Abonné(e) aux actualités & offres" : "Subscribed to news & offers")
                          : (fr ? "Non abonné(e)" : "Not subscribed")}
                      </p>
                    </div>
                  </div>
                </section>
              </Reveal>

              {/* Réservations */}
              <Reveal>
                <section className="mt-10">
                  <SectionHead kicker={fr ? "Mes réservations" : "My bookings"} title={fr ? "Suivi de vos événements" : "Your events at a glance"} />
                  <div className="mt-6 space-y-4">
                    {loaded && bookings.length === 0 && (
                      <p className="glass rounded-2xl p-6 text-center text-sm text-ivory/55">
                        {fr ? "Aucune réservation pour l'instant." : "No bookings yet."}{" "}
                        <Link href="/devis" className="text-gold underline">{fr ? "Estimer mon projet" : "Estimate my project"}</Link>
                      </p>
                    )}
                    {bookings.map((b) => (
                      <div key={b.id} className="glass rounded-2xl p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-display text-lg font-bold">{b.offer || (fr ? "Prestation" : "Service")}</p>
                            <p className="mt-0.5 text-sm text-ivory/60">
                              {b.domain && `${b.domain} — `}{b.date || (fr ? "date à définir" : "date TBD")}{b.place ? ` — ${b.place}` : ""}
                            </p>
                            <p className="mt-1 text-xs text-ivory/40">{fr ? "Créée le" : "Created"} {d(b.createdAt)}</p>
                          </div>
                          <div className="text-right">
                            <span className={`chip ${CHIP[b.status] ?? "border-ivory/20 text-ivory/60"}`}>
                              {BOOKING_STATUS[b.status] ? (fr ? BOOKING_STATUS[b.status].fr : BOOKING_STATUS[b.status].en) : b.status}
                            </span>
                            {b.total > 0 && (
                              <p className="mt-2 font-display text-lg font-bold text-gradient-gold">{fcfa(b.total)}</p>
                            )}
                            {b.total > 0 && (
                              <p className="text-[11px] text-ivory/45">
                                {fr ? `Acompte ${b.depositRate} %` : `Deposit ${b.depositRate}%`} : {fcfa(Math.round((b.total * b.depositRate) / 100 / 500) * 500)}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Preuve d'acompte */}
                        {(b.status === "deposit_proof" || b.status === "confirmed") && (
                          <div className="mt-4 border-t border-ivory/10 pt-4">
                            {b.proofFile ? (
                              <p className="flex items-center gap-2 text-sm text-wa">
                                <Icon name="check" className="h-4 w-4" />
                                {fr ? "Preuve d'acompte transmise — merci !" : "Deposit proof submitted — thank you!"}
                              </p>
                            ) : (
                              <div className="flex flex-wrap items-center gap-3">
                                <input
                                  ref={(el) => { fileRefs.current[b.id] = el; }}
                                  type="file"
                                  accept="image/jpeg,image/png,image/webp,application/pdf"
                                  className="hidden"
                                  onChange={(e) => { void upload(b.id, e.target.files?.[0] ?? null); e.currentTarget.value = ""; }}
                                />
                                <button
                                  onClick={() => fileRefs.current[b.id]?.click()}
                                  disabled={upState[b.id] === "busy"}
                                  className="btn btn-gold !py-2 text-sm"
                                >
                                  <Icon name="file" className="h-4 w-4" />
                                  {upState[b.id] === "busy"
                                    ? (fr ? "Envoi…" : "Uploading…")
                                    : (fr ? "Déposer ma preuve d'acompte" : "Upload my deposit proof")}
                                </button>
                                <span className="text-[11px] text-ivory/45">{fr ? "JPEG, PNG, WebP ou PDF — 5 Mo max" : "JPEG, PNG, WebP or PDF — 5 MB max"}</span>
                                {upState[b.id] && upState[b.id] !== "busy" && upState[b.id] !== "ok" && (
                                  <span className="text-xs text-live">{upState[b.id]}</span>
                                )}
                              </div>
                            )}
                            {!b.proofFile && b.proofRef && (
                              <p className="mt-2 text-[11px] text-ivory/45">{fr ? "Référence transmise" : "Reference provided"} : {b.proofRef}</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              </Reveal>

              {/* Devis */}
              <Reveal>
                <section className="mt-10">
                  <SectionHead kicker={fr ? "Mes devis" : "My quotes"} title={fr ? "Vos demandes en cours" : "Your requests"} />
                  <div className="mt-6 space-y-3">
                    {loaded && quotes.length === 0 && (
                      <p className="glass rounded-2xl p-6 text-center text-sm text-ivory/55">
                        {fr ? "Aucun devis pour l'instant." : "No quotes yet."}{" "}
                        <button onClick={() => setQuoteOpen(true)} className="text-gold underline">{fr ? "Demander un devis" : "Request a quote"}</button>
                      </p>
                    )}
                    {quotes.map((q) => (
                      <div key={q.id} className="glass flex flex-wrap items-center justify-between gap-3 rounded-2xl p-5">
                        <div>
                          <p className="font-semibold">{q.offer || (fr ? "Devis" : "Quote")}{q.domain ? ` — ${q.domain}` : ""}</p>
                          <p className="mt-0.5 text-sm text-ivory/55">
                            {q.date || (fr ? "date à définir" : "date TBD")}{q.place ? ` — ${q.place}` : ""} · {fr ? "reçu le" : "received"} {d(q.createdAt)}
                          </p>
                          {q.msg && <p className="mt-1 text-xs text-ivory/40 line-clamp-2">{q.msg}</p>}
                        </div>
                        <div className="text-right">
                          <span className={`chip ${CHIP[q.status] ?? "border-ivory/20 text-ivory/60"}`}>
                            {QUOTE_STATUS[q.status] ? (fr ? QUOTE_STATUS[q.status].fr : QUOTE_STATUS[q.status].en) : q.status}
                          </span>
                          {q.total > 0 && <p className="mt-2 font-display font-bold text-gradient-gold">{fcfa(q.total)}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </Reveal>
            </>
          )}
        </div>
      </main>
      <Footer />
      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </>
  );
}
