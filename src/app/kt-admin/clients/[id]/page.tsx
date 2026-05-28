"use client";
import { useEffect, useState } from "react";
import { useAdmin } from "../../layout";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, User, Briefcase, Home, Heart, Shield, CreditCard, Building, Plus, Minus, PowerOff, Power, ArrowLeftRight, Check, X, TrendingUp, TrendingDown, History } from "lucide-react";

type Profile = Record<string, unknown>;
type KtTx = { id: string; type: string; amount: number; currency: string; description: string; status: string; created_at: string };
type Account = { id: string; iban: string; type: string; currency: string; balance: number; status: string; kt_cards: { last4: string; expiry_month: number; expiry_year: number; type: string; status: string }[]; kt_transactions: KtTx[] };
type Transfer = { id: string; to_name: string; to_iban: string; amount: number; fee_amount: number; fee_paid: boolean; status: string; reference: string; payment_reference: string; payment_proof_url: string; created_at: string };

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div style={{ background: "#1A1D27", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Icon size={15} color="#4CAF82" />
        <p style={{ color: "white", fontWeight: 600, fontSize: "0.88rem", margin: 0 }}>{title}</p>
      </div>
      <div style={{ padding: "14px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px 24px" }}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: unknown }) {
  const v = value === null || value === undefined || value === "" ? "—"
    : typeof value === "boolean" ? (value ? "Oui" : "Non")
    : typeof value === "object" ? JSON.stringify(value)
    : String(value);
  return (
    <div>
      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 3px" }}>{label}</p>
      <p style={{ color: "white", fontSize: "0.85rem", margin: 0, fontWeight: 500, wordBreak: "break-all" }}>{v}</p>
    </div>
  );
}

function TBadge({ status }: { status: string }) {
  const m: Record<string, [string, string, string]> = {
    pending_fee: ["rgba(251,191,36,.15)", "#FBB824", "Attente frais"],
    processing: ["rgba(59,130,246,.15)", "#60A5FA", "En traitement"],
    completed: ["rgba(74,222,128,.15)", "#4ADE80", "Complété"],
    rejected: ["rgba(248,113,113,.15)", "#F87171", "Rejeté"],
  };
  const [bg, color, label] = m[status] ?? ["rgba(255,255,255,.1)", "rgba(255,255,255,.5)", status];
  return <span style={{ background: bg, color, fontSize: "0.72rem", fontWeight: 600, padding: "3px 9px", borderRadius: 20 }}>{label}</span>;
}

export default function ClientDetailPage() {
  const { token } = useAdmin();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [creditAmount, setCreditAmount] = useState("");
  const [creditLabel, setCreditLabel] = useState("");
  const [creditDir, setCreditDir] = useState<"credit" | "debit">("credit");
  const [creditLoading, setCreditLoading] = useState(false);
  const [creditDone, setCreditDone] = useState(false);

  function load() {
    setLoading(true);
    fetch(`/api/kt/admin/clients/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { setProfile(d.profile ?? null); setAccounts(d.accounts ?? []); setTransfers(d.transfers ?? []); setNewStatus(String(d.profile?.status ?? "")); setLoading(false); });
  }

  useEffect(() => { load(); }, [id, token]);

  async function updateStatus() {
    setSaving(true);
    await fetch(`/api/kt/admin/clients/${id}`, { method: "PATCH", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }) });
    setSaving(false);
    setProfile((p) => p ? { ...p, status: newStatus } : p);
  }

  async function toggleAccount() {
    const next = profile?.status === "active" ? "suspended" : "active";
    setSaving(true);
    await fetch(`/api/kt/admin/clients/${id}`, { method: "PATCH", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ status: next }) });
    setSaving(false);
    setProfile((p) => p ? { ...p, status: next } : p);
    setNewStatus(next);
  }

  async function applyCredit() {
    if (!creditAmount) return;
    setCreditLoading(true);
    const signed = creditDir === "debit" ? -Math.abs(Number(creditAmount)) : Math.abs(Number(creditAmount));
    await fetch(`/api/kt/admin/clients/${id}`, { method: "PATCH", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ credit_amount: signed, credit_label: creditLabel || undefined }) });
    setCreditLoading(false); setCreditDone(true); setCreditAmount(""); setCreditLabel("");
    setTimeout(() => { setCreditDone(false); load(); }, 2000);
  }

  async function viewProof(path: string) {
    const res = await fetch(`/api/kt/admin/transfer-proof?path=${encodeURIComponent(path)}`, { headers: { Authorization: `Bearer ${token}` } });
    const { url } = await res.json();
    if (url) window.open(url, "_blank");
  }

  async function updateTransfer(transfer_id: string, transfer_status: string) {
    await fetch(`/api/kt/admin/clients/${id}`, { method: "PATCH", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ transfer_id, transfer_status }) });
    load();
  }

  if (loading) return <div style={{ padding: 32, color: "rgba(255,255,255,0.4)" }}>Chargement…</div>;
  if (!profile) return <div style={{ padding: 32, color: "#FF6B6B" }}>Client introuvable</div>;

  const ayants = (profile.ayants_droit as unknown[]) ?? [];
  const isSuspended = profile.status === "suspended";

  return (
    <div style={{ padding: 32, maxWidth: 960 }}>
      <button onClick={() => router.back()} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "0.82rem", marginBottom: 20, padding: 0 }}>
        <ChevronLeft size={16} /> Retour
      </button>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ color: "white", fontWeight: 800, fontSize: "1.4rem", margin: 0 }}>{String(profile.prenom ?? "—")} {String(profile.nom ?? "")}</h1>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem", margin: "4px 0 0" }}>{String(profile.email ?? "")}</p>
          {isSuspended && <span style={{ display: "inline-flex", marginTop: 6, background: "rgba(248,113,113,0.15)", color: "#F87171", fontSize: "0.72rem", fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>⚠ Compte désactivé</span>}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <button onClick={toggleAccount} disabled={saving}
            style={{ height: 38, padding: "0 14px", background: isSuspended ? "rgba(74,222,128,0.15)" : "rgba(248,113,113,0.15)", color: isSuspended ? "#4ADE80" : "#F87171", border: `1px solid ${isSuspended ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.3)"}`, borderRadius: 8, fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            {isSuspended ? <><Power size={14} /> Réactiver</> : <><PowerOff size={14} /> Désactiver</>}
          </button>
          <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} style={{ height: 38, background: "#252836", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "white", fontSize: "0.82rem", padding: "0 10px", outline: "none" }}>
            <option value="active">Actif</option><option value="suspended">Suspendu</option><option value="pending">En attente</option>
          </select>
          <button onClick={updateStatus} disabled={saving} style={{ height: 38, padding: "0 14px", background: "#005F2D", color: "white", border: "none", borderRadius: 8, fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" }}>
            {saving ? "…" : "Sauvegarder"}
          </button>
        </div>
      </div>

      {/* Balance operation */}
      <div style={{ background: "#1A1D27", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 16, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8 }}>
          <Building size={15} color="#4CAF82" />
          <p style={{ color: "white", fontWeight: 600, fontSize: "0.88rem", margin: 0 }}>Opération de solde</p>
          {accounts[0] && <span style={{ marginLeft: "auto", color: "#4CAF82", fontWeight: 800 }}>Solde : {Number(accounts[0].balance).toFixed(2)} €</span>}
        </div>
        <div style={{ padding: "14px 20px", display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 6 }}>
            {(["credit", "debit"] as const).map((d) => (
              <button key={d} onClick={() => setCreditDir(d)} style={{ height: 38, padding: "0 14px", borderRadius: 8, border: "none", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer", background: creditDir === d ? (d === "credit" ? "#005F2D" : "#7F1D1D") : "#252836", color: creditDir === d ? "white" : "rgba(255,255,255,0.45)", display: "flex", alignItems: "center", gap: 6 }}>
                {d === "credit" ? <><Plus size={13} /> Crédit</> : <><Minus size={13} /> Débit</>}
              </button>
            ))}
          </div>
          <input type="number" placeholder="Montant (€)" value={creditAmount} onChange={(e) => setCreditAmount(e.target.value)} style={{ flex: 1, minWidth: 120, height: 38, background: "#252836", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "white", fontSize: "0.88rem", padding: "0 12px", outline: "none" }} />
          <input type="text" placeholder="Libellé (ex: Dépôt initial)" value={creditLabel} onChange={(e) => setCreditLabel(e.target.value)} style={{ flex: 2, minWidth: 160, height: 38, background: "#252836", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "white", fontSize: "0.88rem", padding: "0 12px", outline: "none" }} />
          <button onClick={applyCredit} disabled={creditLoading || !creditAmount} style={{ height: 38, padding: "0 16px", background: creditDone ? "#4CAF82" : creditDir === "credit" ? "#005F2D" : "#991B1B", border: "none", borderRadius: 8, color: "white", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, opacity: !creditAmount ? 0.5 : 1 }}>
            {creditDone ? <><Check size={14} /> Appliqué</> : creditLoading ? "…" : "Appliquer"}
          </button>
        </div>
      </div>

      {/* Transfers */}
      {transfers.length > 0 && (
        <div style={{ background: "#1A1D27", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 16, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8 }}>
            <ArrowLeftRight size={15} color="#4CAF82" />
            <p style={{ color: "white", fontWeight: 600, fontSize: "0.88rem", margin: 0 }}>Demandes de virements ({transfers.length})</p>
          </div>
          {transfers.map((t) => (
            <div key={t.id} style={{ padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <p style={{ color: "white", fontWeight: 600, fontSize: "0.85rem", margin: 0 }}>{t.to_name}</p>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.72rem", margin: "2px 0 0", fontFamily: "monospace" }}>{t.to_iban}</p>
                {t.reference && <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.7rem", margin: "2px 0 0" }}>Réf virement : {t.reference}</p>}
                {t.payment_reference && <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.7rem", margin: "2px 0 0" }}>Réf paiement frais : {t.payment_reference}</p>}
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ color: "white", fontWeight: 700, fontSize: "0.88rem", margin: 0 }}>{Number(t.amount).toFixed(2)} €</p>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", margin: "2px 0 0" }}>Frais : {Number(t.fee_amount).toFixed(0)} € {t.fee_paid ? "✓" : "⏳"}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}>
                <TBadge status={t.status} />
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  {t.payment_proof_url && (
                    <button onClick={() => viewProof(t.payment_proof_url)} style={{ background: "rgba(99,102,241,0.15)", border: "none", borderRadius: 6, padding: "3px 8px", color: "#818CF8", fontSize: "0.7rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
                      🧾 Preuve
                    </button>
                  )}
                  {t.status !== "completed" && <button onClick={() => updateTransfer(t.id, "completed")} style={{ background: "rgba(74,222,128,0.15)", border: "none", borderRadius: 6, padding: "3px 8px", color: "#4ADE80", fontSize: "0.7rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}><Check size={11} /> Valider</button>}
                  {t.status !== "rejected" && <button onClick={() => updateTransfer(t.id, "rejected")} style={{ background: "rgba(248,113,113,0.15)", border: "none", borderRadius: 6, padding: "3px 8px", color: "#F87171", fontSize: "0.7rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}><X size={11} /> Rejeter</button>}
                </div>
                <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.65rem", margin: 0 }}>{new Date(t.created_at).toLocaleDateString("fr-FR")}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Section title="Identité" icon={User}>
        <Field label="Prénom" value={profile.prenom} /><Field label="Nom" value={profile.nom} />
        <Field label="Sexe" value={profile.sexe} /><Field label="Date de naissance" value={profile.date_naissance} />
        <Field label="Pays de naissance" value={profile.pays_naissance} /><Field label="Nationalité" value={profile.nationalite} />
        <Field label="Situation familiale" value={profile.situation_familiale} /><Field label="Type de document" value={profile.type_document} />
      </Section>

      <Section title="Coordonnées" icon={Home}>
        <Field label="E-mail" value={profile.email} /><Field label="Téléphone" value={profile.telephone} />
        <Field label="Adresse" value={profile.adresse} /><Field label="Code postal" value={profile.code_postal} />
        <Field label="Ville" value={profile.ville} /><Field label="Pays de résidence" value={profile.pays_residence} />
      </Section>

      <Section title="Situation professionnelle" icon={Briefcase}>
        <Field label="Situation" value={profile.situation_professionnelle} />
        <Field label="Employeur" value={profile.nom_employeur} />
        <Field label="Revenu mensuel" value={profile.revenu_mensuel} />
      </Section>

      <Section title="Famille" icon={Heart}>
        <Field label="Enfants" value={profile.nombre_enfants} />
        <Field label="Personnes à charge" value={profile.personnes_a_charge} />
      </Section>

      {ayants.length > 0 && (
        <div style={{ background: "#1A1D27", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <Shield size={15} color="#4CAF82" /><p style={{ color: "white", fontWeight: 600, fontSize: "0.88rem", margin: 0 }}>Ayants droit ({ayants.length})</p>
          </div>
          <div style={{ padding: "14px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
            {ayants.map((ad: unknown, i: number) => { const a = ad as Record<string, string>; return (
              <div key={i} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "10px 14px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: "6px 16px" }}>
                <Field label="Prénom" value={a.prenom} /><Field label="Nom" value={a.nom} /><Field label="Lien" value={a.lien} /><Field label="DDN" value={a.date_naissance} />
              </div>
            ); })}
          </div>
        </div>
      )}

      <Section title="Conformité" icon={Shield}>
        <Field label="FATCA" value={profile.is_fatca} /><Field label="Code promo" value={profile.code_promo} />
        <Field label="KYC" value={profile.kyc_status} /><Field label="Email vérifié" value={profile.email_verified} />
        <Field label="Tél. vérifié" value={profile.phone_verified} /><Field label="Crédits en cours" value={profile.a_credits_en_cours} />
      </Section>

      {accounts.map((acc) => (
        <div key={acc.id} style={{ background: "#1A1D27", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <Building size={15} color="#4CAF82" />
            <p style={{ color: "white", fontWeight: 600, fontSize: "0.88rem", margin: 0 }}>Compte {acc.type} — {acc.currency}</p>
            <span style={{ marginLeft: "auto", color: "#4CAF82", fontWeight: 800 }}>{Number(acc.balance).toFixed(2)} €</span>
          </div>
          <div style={{ padding: "14px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "10px 24px" }}>
            <Field label="IBAN" value={acc.iban} /><Field label="BIC" value="KTAGDEFF" /><Field label="Statut" value={acc.status} />
          </div>
          {acc.kt_cards?.map((card, ci) => (
            <div key={ci} style={{ margin: "0 20px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 14 }}>
              <CreditCard size={18} color="#C9A84C" />
              <div>
                <p style={{ color: "white", fontSize: "0.85rem", margin: 0, fontWeight: 600 }}>Carte {card.type} •••• {card.last4}</p>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.75rem", margin: "2px 0 0" }}>Expire {String(card.expiry_month).padStart(2, "0")}/{card.expiry_year} — {card.status}</p>
              </div>
            </div>
          ))}

          {/* Transaction history */}
          {acc.kt_transactions && acc.kt_transactions.length > 0 && (
            <div style={{ margin: "0 20px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <History size={13} color="rgba(255,255,255,0.4)" />
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
                  Historique ({acc.kt_transactions.length} opérations)
                </p>
              </div>
              {[...acc.kt_transactions]
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .slice(0, 20)
                .map((tx) => (
                  <div key={tx.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: tx.type === "credit" ? "rgba(74,222,128,0.12)" : "rgba(248,113,113,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {tx.type === "credit" ? <TrendingUp size={13} color="#4ADE80" /> : <TrendingDown size={13} color="#F87171" />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: "white", fontSize: "0.82rem", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tx.description || "—"}</p>
                      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", margin: "2px 0 0" }}>{new Date(tx.created_at).toLocaleString("fr-FR")}</p>
                    </div>
                    <p style={{ color: tx.type === "credit" ? "#4ADE80" : "#F87171", fontWeight: 700, fontSize: "0.88rem", margin: 0, flexShrink: 0 }}>
                      {tx.type === "credit" ? "+" : "-"}{Number(tx.amount).toFixed(2)} {tx.currency}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
