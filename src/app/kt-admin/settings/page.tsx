"use client";
import { useEffect, useState } from "react";
import { useAdmin } from "../layout";
import { Settings, Save, Euro, Building2, RefreshCw, Check } from "lucide-react";

type FeePayment = { name: string; iban: string; bic: string; bank: string; reference: string };
type TransferFee = { amount: number; currency: string };

export default function SettingsPage() {
  const { token } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [fee, setFee] = useState<TransferFee>({ amount: 50, currency: "EUR" });
  const [payment, setPayment] = useState<FeePayment>({ name: "", iban: "", bic: "", bank: "", reference: "FRAIS-VIREMENT" });

  useEffect(() => {
    fetch("/api/kt/admin/settings", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        if (d.transfer_fee) setFee(d.transfer_fee);
        if (d.fee_payment) setPayment(d.fee_payment);
        setLoading(false);
      });
  }, [token]);

  async function save() {
    setSaving(true);
    await fetch("/api/kt/admin/settings", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ transfer_fee: fee, fee_payment: payment }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

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
