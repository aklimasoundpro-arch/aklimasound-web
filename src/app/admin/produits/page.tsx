"use client";
import { useState } from "react";
import { AdminShell, ACard, useRows } from "@/components/AdminShell";
import { Icon } from "@/components/icons";
import { api } from "@/lib/admin-api";
import { fcfa } from "@/lib/data";

type Product = { id: string; name: string; cat: string; price: number; stock: number; status: string };
const STATUS = ["disponible", "commande", "rupture"];

export default function Produits() {
  const { rows, reload, loading } = useRows<Product>("products");
  const [form, setForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body = {
      name: fd.get("name"), cat: fd.get("cat"), price: Number(fd.get("price") || 0),
      stock: Number(fd.get("stock") || 0), status: fd.get("status"),
    };
    if (editing) await api.patch("products", editing.id, body).catch(() => {});
    else await api.create("products", body).catch(() => {});
    setForm(false); setEditing(null); reload();
  };

  return (
    <AdminShell title="Produits (vente & installation)">
      <div className="mb-5 flex flex-wrap gap-3">
        <button onClick={() => { setEditing(null); setForm((v) => !v); }} className="btn btn-gold !py-2 text-xs"><Icon name="package" className="h-3.5 w-3.5" /> Ajouter un produit</button>
      </div>

      {(form || editing) && (
        <ACard title={editing ? `Modifier — ${editing.name}` : "Nouveau produit"} className="mb-6">
          <form onSubmit={save} className="grid gap-3 sm:grid-cols-3">
            <input className="input" name="name" defaultValue={editing?.name} placeholder="Nom du produit *" required />
            <input className="input" name="cat" defaultValue={editing?.cat} placeholder="Catégorie (Façade, Basses…)" />
            <input className="input" name="price" type="number" min={0} defaultValue={editing?.price ?? ""} placeholder="Prix (F)" />
            <input className="input" name="stock" type="number" min={0} defaultValue={editing?.stock ?? 0} placeholder="Stock" />
            <select className="input" name="status" defaultValue={editing?.status ?? "disponible"}>
              {STATUS.map((s) => <option key={s} className="bg-ink" value={s}>{s}</option>)}
            </select>
            <div className="flex gap-2">
              <button className="btn btn-gold !py-2 text-xs">Enregistrer</button>
              <button type="button" onClick={() => { setForm(false); setEditing(null); }} className="btn btn-outline !py-2 text-xs">Annuler</button>
            </div>
          </form>
        </ACard>
      )}

      {loading ? (
        <p className="py-12 text-center text-sm text-ivory/45">Chargement…</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((p) => (
            <div key={p.id} className="glass card-hover rounded-2xl p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-ivory/90">{p.name}</p>
                  <p className="text-xs text-ivory/50">{p.cat}</p>
                </div>
                <span className={`chip !py-0.5 !text-[9px] ${p.status === "rupture" ? "!border-live/40 !text-live" : p.status === "commande" ? "!border-copper/40 !text-copper" : ""}`}>{p.status}</span>
              </div>
              <p className="mt-2 font-display text-lg font-bold text-gold">{fcfa(p.price)}</p>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-ivory/60">
                  Stock :
                  <button onClick={async () => { await api.patch("products", p.id, { stock: Math.max(0, p.stock - 1) }).catch(() => {}); reload(); }} className="h-6 w-6 rounded-lg bg-white/5 hover:bg-white/10">−</button>
                  <b className="w-6 text-center">{p.stock}</b>
                  <button onClick={async () => { await api.patch("products", p.id, { stock: p.stock + 1 }).catch(() => {}); reload(); }} className="h-6 w-6 rounded-lg bg-white/5 hover:bg-white/10">+</button>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => { setEditing(p); setForm(true); }} className="rounded-lg bg-white/5 px-2 py-1 text-[10px] text-ivory/60 hover:text-gold">Modifier</button>
                  <button onClick={async () => { await api.del("products", p.id).catch(() => {}); reload(); }} className="rounded-lg bg-white/5 px-2 py-1 text-[10px] text-ivory/40 hover:text-live">Suppr.</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
