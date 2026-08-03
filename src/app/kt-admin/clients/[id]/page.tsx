"use client";
import { useEffect, useState } from "react";
import { useAdmin } from "../../layout";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, User, Briefcase, Home, Heart, Shield, CreditCard, Building, Plus, Minus, PowerOff, Power, ArrowLeftRight, Check, X, TrendingUp, TrendingDown, History, Euro, RotateCcw, Trash2, Mail } from "lucide-react";

type Profile = Record<string, unknown>;
type FeePayment = { name: string; iban: string; bic: string; bank: string; reference: string };
type TransferFee = { amount: number; currency: string };
type KtTx = { id: string; type: string; amount: number; currency: string; description: string; status: string; created_at: string };
type Account = { id: string; iban: string; type: string; currency: string; balance: number; status: string; label?: string | null; business_info?: Record<string, string> | null; kt_cards: { last4: string; expiry_month: number; expiry_year: number; type: string; status: string }[]; kt_transactions: KtTx[] };
type FeeInvoice = { id: string; title: string | null; description: string | null; amount: number; currency: string; status: string; proof_url: string | null; proof_method: string | null; proof_reference: string | null; created_at: string };
type Transfer = { id: string; to_name: string; to_iban: string; amount: number; fee_amount: number; fee_paid: boolean; status: string; reference: string; rejection_reason?: string; payment_reference: string; payment_proof_url: string; created_at: string };
type KycDoc = { id: string; document_type: string; file_path: string; status: string; notes?: string; created_at: string };

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
    cancelled: ["rgba(255,255,255,.06)", "rgba(255,255,255,.4)", "Annulé"],
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
  const [creditAccountId, setCreditAccountId] = useState<string>("");
  const [creditLoading, setCreditLoading] = useState(false);
  const [creditDone, setCreditDone] = useState(false);

  // Business account approval + fee invoices
  const [bizLoading, setBizLoading] = useState<string | null>(null);
  const [feeInvoices, setFeeInvoices] = useState<FeeInvoice[]>([]);
  const [invTitle, setInvTitle] = useState("");
  const [invDesc, setInvDesc] = useState("");
  const [invAmount, setInvAmount] = useState("");
  const [invSepa, setInvSepa] = useState(true);
  const [invCrypto, setInvCrypto] = useState(true);
  const [invLoading, setInvLoading] = useState(false);

  // Per-client fee config
  const [customFee, setCustomFee] = useState<TransferFee | null>(null);
  const [customPayment, setCustomPayment] = useState<FeePayment | null>(null);
  const [feeForm, setFeeForm] = useState<TransferFee>({ amount: 50, currency: "EUR" });
  const [payForm, setPayForm] = useState<FeePayment>({ name: "", iban: "", bic: "", bank: "", reference: "" });
  const [feeSaving, setFeeSaving] = useState(false);
  const [feeSaved, setFeeSaved] = useState(false);

  const [feeFree, setFeeFree] = useState(false);
  const [feeFreeLoading, setFeeFreeLoading] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    function check() { setIsMobile(window.innerWidth < 768); }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // KYC
  const [kycDocuments, setKycDocuments] = useState<KycDoc[]>([]);
  const [kycAction, setKycAction] = useState<"approve" | "reject" | null>(null);
  const [kycNotes, setKycNotes] = useState("");
  const [kycSaving, setKycSaving] = useState(false);
  const [activationRequired, setActivationRequired] = useState(false);

  // Action panel (reject / cancel) per transfer
  const [actionTarget, setActionTarget] = useState<string | null>(null);
  const [actionMode, setActionMode] = useState<"reject" | "cancel">("reject");
  const [actionReason, setActionReason] = useState("");

  function load() {
    setLoading(true);
    fetch(`/api/kt/admin/clients/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        setProfile(d.profile ?? null);
        setAccounts(d.accounts ?? []);
        setTransfers(d.transfers ?? []);
        setKycDocuments(d.kyc_documents ?? []);
        setNewStatus(String(d.profile?.status ?? ""));
        setActivationRequired(!!(d.profile?.activation_required));
        setFeeFree(!!(d.profile?.fee_free));
        const cf = d.profile?.custom_fee as TransferFee | null;
        const cp = d.profile?.custom_fee_payment as FeePayment | null;
        setCustomFee(cf ?? null);
        setCustomPayment(cp ?? null);
        if (cf) setFeeForm(cf);
        if (cp) setPayForm(cp);
        setLoading(false);
      });
  }

  useEffect(() => { load(); loadInvoices(); }, [id, token]);

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
    await fetch(`/api/kt/admin/clients/${id}`, { method: "PATCH", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ credit_amount: signed, credit_label: creditLabel || undefined, account_id: creditAccountId || undefined }) });
    setCreditLoading(false); setCreditDone(true); setCreditAmount(""); setCreditLabel("");
    setTimeout(() => { setCreditDone(false); load(); }, 2000);
  }

  async function decideBusiness(accountId: string, action: "approve" | "reject") {
    let reason: string | undefined;
    if (action === "reject") { reason = window.prompt("Motif du refus (optionnel) :") ?? undefined; }
    setBizLoading(accountId);
    await fetch(`/api/kt/admin/clients/${id}`, { method: "PATCH", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ business_account_id: accountId, business_action: action, rejection_reason: reason }) });
    setBizLoading(null);
    load();
  }

  function loadInvoices() {
    fetch(`/api/kt/admin/fee-invoices?profile_id=${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d?.invoices) setFeeInvoices(d.invoices); })
      .catch(() => {});
  }

  async function createInvoice() {
    if (!invAmount || Number(invAmount) <= 0) return;
    setInvLoading(true);
    const crypto = invCrypto ? ["btc", "usdt_bep20", "eth", "sol"] : [];
    const res = await fetch(`/api/kt/admin/fee-invoices`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ profile_id: id, title: invTitle || undefined, description: invDesc || undefined, amount: Number(invAmount), currency: "EUR", methods: { sepa: invSepa, crypto } }),
    });
    setInvLoading(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      window.alert(`Échec de l'émission de la facture : ${d.details || d.error || res.status}`);
      return;
    }
    setInvTitle(""); setInvDesc(""); setInvAmount("");
    loadInvoices();
  }

  async function setInvoiceStatus(invId: string, status: string) {
    await fetch(`/api/kt/admin/fee-invoices`, { method: "PATCH", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ id: invId, status }) });
    loadInvoices();
  }

  async function deleteInvoice(invId: string) {
    if (!window.confirm("Supprimer cette facture de frais ?")) return;
    await fetch(`/api/kt/admin/fee-invoices?id=${invId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    loadInvoices();
  }

  async function viewKycDoc(path: string) {
    const res = await fetch(`/api/kt/admin/kyc-doc?path=${encodeURIComponent(path)}`, { headers: { Authorization: `Bearer ${token}` } });
    const { url } = await res.json();
    if (url) window.open(url, "_blank");
  }

  async function saveKycStatus(kyc_status: string, notes?: string) {
    setKycSaving(true);
    await fetch(`/api/kt/admin/clients/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ kyc_status, kyc_notes: notes || undefined }),
    });
    setKycAction(null); setKycNotes(""); setKycSaving(false);
    load();
  }

  async function toggleActivationRequired(value: boolean) {
    await fetch(`/api/kt/admin/clients/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ activation_required: value }),
    });
  }

  async function viewProof(path: string) {
    const res = await fetch(`/api/kt/admin/transfer-proof?path=${encodeURIComponent(path)}`, { headers: { Authorization: `Bearer ${token}` } });
    const { url } = await res.json();
    if (url) window.open(url, "_blank");
  }

  async function saveFeeConfig() {
    setFeeSaving(true);
    await fetch(`/api/kt/admin/clients/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ custom_fee: feeForm, custom_fee_payment: payForm }),
    });
    setCustomFee(feeForm);
    setCustomPayment(payForm);
    setFeeSaving(false);
    setFeeSaved(true);
    setTimeout(() => setFeeSaved(false), 3000);
  }

  async function toggleFeeFree(val: boolean) {
    setFeeFreeLoading(true);
    await fetch(`/api/kt/admin/clients/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ fee_free: val }),
    });
    setFeeFree(val);
    setFeeFreeLoading(false);
  }

  async function resetFeeConfig() {
    setFeeSaving(true);
    await fetch(`/api/kt/admin/clients/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ custom_fee: null, custom_fee_payment: null }),
    });
    setCustomFee(null);
    setCustomPayment(null);
    setFeeForm({ amount: 50, currency: "EUR" });
    setPayForm({ name: "", iban: "", bic: "", bank: "", reference: "" });
    setFeeSaving(false);
  }

  async function deleteClient() {
    setDeleting(true);
    setDeleteError("");
    try {
      const res = await fetch(`/api/kt/admin/clients/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setDeleteError(data.error || `Erreur ${res.status} — la suppression a échoué`);
        setDeleting(false);
        return;
      }
      router.push("/kt-admin/clients");
    } catch {
      setDeleteError("Erreur réseau — veuillez réessayer");
      setDeleting(false);
    }
  }

  async function updateTransfer(transfer_id: string, transfer_status: string, reason?: string) {
    await fetch(`/api/kt/admin/clients/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ transfer_id, transfer_status, rejection_reason: reason || undefined }),
    });
    setActionTarget(null);
    setActionReason("");
    load();
  }

  if (loading) return <div style={{ padding: 24, color: "rgba(255,255,255,0.4)" }}>Chargement…</div>;
  if (!profile) return <div style={{ padding: 24, color: "#FF6B6B" }}>Client introuvable</div>;

  const ayants = (profile.ayants_droit as unknown[]) ?? [];
  const isSuspended = profile.status === "suspended";

  return (
    <div style={{ padding: isMobile ? "16px 12px" : 32, maxWidth: 960 }}>
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
          <button onClick={() => {
              const email = String(profile.email ?? "");
              const name = `${String(profile.prenom ?? "")} ${String(profile.nom ?? "")}`.trim();
              router.push(`/kt-admin/inbox?to=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`);
            }}
            disabled={!profile.email}
            style={{ height: 38, padding: "0 14px", background: "rgba(0,95,45,0.15)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 8, fontSize: "0.82rem", fontWeight: 600, cursor: profile.email ? "pointer" : "not-allowed", opacity: profile.email ? 1 : 0.5, display: "flex", alignItems: "center", gap: 6 }}>
            <Mail size={14} /> Envoyer un mail
          </button>
          <button onClick={() => setDeleteConfirm(true)}
            style={{ height: 38, padding: "0 14px", background: "rgba(248,113,113,0.08)", color: "#F87171", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 8, fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <Trash2 size={14} /> Supprimer
          </button>
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
          {(() => {
            const sel = accounts.find((a) => a.id === creditAccountId) ?? accounts.find((a) => a.status === "active") ?? accounts[0];
            return sel ? <span style={{ marginLeft: "auto", color: "#4CAF82", fontWeight: 800 }}>Solde : {Number(sel.balance).toFixed(2)} €</span> : null;
          })()}
        </div>
        <div style={{ padding: "14px 20px", display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
          {accounts.filter((a) => a.status === "active").length > 1 && (
            <select value={creditAccountId} onChange={(e) => setCreditAccountId(e.target.value)}
              style={{ height: 38, background: "#252836", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "white", fontSize: "0.82rem", padding: "0 10px", outline: "none" }}>
              <option value="">Compte principal</option>
              {accounts.filter((a) => a.status === "active").map((a) => (
                <option key={a.id} value={a.id}>{a.type === "business" ? (a.business_info?.company_name || "Entreprise") : a.type} — {Number(a.balance).toFixed(0)} €</option>
              ))}
            </select>
          )}
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

      {/* KYC */}
      {(() => {
        const kycStatus = String(profile.kyc_status ?? "unverified");
        const kycColors: Record<string, [string, string, string]> = {
          approved: ["rgba(74,222,128,0.12)", "#4ADE80", "Approuvé"],
          pending: ["rgba(251,191,36,0.12)", "#FBB824", "En attente"],
          rejected: ["rgba(248,113,113,0.12)", "#F87171", "Rejeté"],
          unverified: ["rgba(255,255,255,0.06)", "rgba(255,255,255,0.4)", "Non vérifié"],
        };
        const [kycBg, kycColor, kycLabel] = kycColors[kycStatus] ?? kycColors.unverified;
        const docLabels: Record<string, string> = { id_front: "CI Recto", id_back: "CI Verso", selfie: "Selfie" };

        return (
          <div style={{ background: "#1A1D27", borderRadius: 14, border: `1px solid ${kycStatus === "approved" ? "rgba(74,222,128,0.25)" : kycStatus === "pending" ? "rgba(251,191,36,0.25)" : kycStatus === "rejected" ? "rgba(248,113,113,0.2)" : "rgba(255,255,255,0.06)"}`, marginBottom: 16, overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <Shield size={15} color="#4CAF82" />
              <p style={{ color: "white", fontWeight: 600, fontSize: "0.88rem", margin: 0 }}>Vérification KYC</p>
              <span style={{ background: kycBg, color: kycColor, fontSize: "0.72rem", fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>{kycLabel}</span>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer" }}>
                  <div
                    onClick={() => {
                      const next = !activationRequired;
                      setActivationRequired(next);
                      toggleActivationRequired(next);
                    }}
                    style={{ width: 36, height: 20, borderRadius: 10, background: activationRequired ? "#005F2D" : "rgba(255,255,255,0.12)", position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}
                  >
                    <div style={{ position: "absolute", top: 2, left: activationRequired ? 18 : 2, width: 16, height: 16, borderRadius: "50%", background: activationRequired ? "#4ADE80" : "rgba(255,255,255,0.4)", transition: "left 0.2s" }} />
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.75rem", fontWeight: 500 }}>Activation requise (250 €)</span>
                </label>
              </div>
            </div>

            <div style={{ padding: "14px 20px" }}>
              {kycDocuments.length === 0 ? (
                <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.82rem", margin: 0 }}>Aucun document soumis</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
                  {kycDocuments.map((doc) => (
                    <div key={doc.id} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "10px 14px" }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ color: "white", fontSize: "0.82rem", fontWeight: 600, margin: 0 }}>{docLabels[doc.document_type] ?? doc.document_type}</p>
                        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.7rem", margin: "2px 0 0" }}>{new Date(doc.created_at).toLocaleString("fr-FR")}</p>
                        {doc.notes && <p style={{ color: "#F87171", fontSize: "0.7rem", margin: "3px 0 0" }}>Note : {doc.notes}</p>}
                      </div>
                      <span style={{ background: doc.status === "approved" ? "rgba(74,222,128,0.12)" : doc.status === "rejected" ? "rgba(248,113,113,0.12)" : "rgba(251,191,36,0.12)", color: doc.status === "approved" ? "#4ADE80" : doc.status === "rejected" ? "#F87171" : "#FBB824", fontSize: "0.68rem", fontWeight: 700, padding: "2px 8px", borderRadius: 20, flexShrink: 0 }}>
                        {doc.status === "approved" ? "Approuvé" : doc.status === "rejected" ? "Rejeté" : "En attente"}
                      </span>
                      <button onClick={() => viewKycDoc(doc.file_path)} style={{ background: "rgba(99,102,241,0.15)", border: "none", borderRadius: 8, padding: "5px 11px", color: "#818CF8", fontSize: "0.73rem", fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>
                        Voir
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {kycStatus !== "approved" && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: kycDocuments.length > 0 ? 0 : 8 }}>
                  <button onClick={() => setKycAction(kycAction === "approve" ? null : "approve")} style={{ height: 34, padding: "0 14px", background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 8, color: "#4ADE80", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                    <Check size={13} /> Approuver KYC
                  </button>
                  <button onClick={() => setKycAction(kycAction === "reject" ? null : "reject")} style={{ height: 34, padding: "0 14px", background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 8, color: "#F87171", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                    <X size={13} /> Rejeter KYC
                  </button>
                </div>
              )}
              {kycStatus === "approved" && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button onClick={() => setKycAction(kycAction === "reject" ? null : "reject")} style={{ height: 34, padding: "0 14px", background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 8, color: "#F87171", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                    <X size={13} /> Révoquer KYC
                  </button>
                </div>
              )}

              {kycAction && (
                <div style={{ marginTop: 12, background: kycAction === "approve" ? "rgba(74,222,128,0.06)" : "rgba(248,113,113,0.06)", border: `1px solid ${kycAction === "approve" ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)"}`, borderRadius: 10, padding: "12px 14px" }}>
                  <p style={{ color: kycAction === "approve" ? "#4ADE80" : "#F87171", fontSize: "0.78rem", fontWeight: 600, margin: "0 0 6px" }}>
                    {kycAction === "approve" ? "Approuver le KYC de ce client ?" : "Rejeter le KYC — motif (optionnel)"}
                  </p>
                  {kycAction === "reject" && (
                    <input
                      type="text"
                      placeholder="Ex: Document illisible, photo non conforme…"
                      value={kycNotes}
                      onChange={(e) => setKycNotes(e.target.value)}
                      style={{ width: "100%", height: 38, background: "#252836", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "white", fontSize: "0.82rem", padding: "0 12px", boxSizing: "border-box", outline: "none", marginBottom: 10 }}
                    />
                  )}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => saveKycStatus(kycAction === "approve" ? "approved" : "rejected", kycNotes || undefined)}
                      disabled={kycSaving}
                      style={{ flex: 1, height: 34, background: kycAction === "approve" ? "#005F2D" : "#991B1B", border: "none", borderRadius: 8, color: "white", fontWeight: 700, fontSize: "0.78rem", cursor: kycSaving ? "not-allowed" : "pointer", opacity: kycSaving ? 0.7 : 1 }}>
                      {kycSaving ? "…" : kycAction === "approve" ? "Confirmer l'approbation" : "Confirmer le rejet"}
                    </button>
                    <button onClick={() => { setKycAction(null); setKycNotes(""); }} style={{ height: 34, padding: "0 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", cursor: "pointer" }}>
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Fee-free toggle */}
      <div style={{ background: "#1A1D27", borderRadius: 14, border: `1px solid ${feeFree ? "rgba(0,95,45,0.5)" : "rgba(255,255,255,0.06)"}`, marginBottom: 16, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <p style={{ color: "white", fontWeight: 600, fontSize: "0.88rem", margin: "0 0 3px" }}>Virement sans frais</p>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.75rem", margin: 0, lineHeight: 1.5 }}>
            {feeFree ? "Activé — ce client ne paie aucun frais de virement." : "Désactivé — les frais standard s'appliquent."}
          </p>
        </div>
        <button onClick={() => toggleFeeFree(!feeFree)} disabled={feeFreeLoading}
          style={{
            display: "flex", alignItems: "center", gap: 10, padding: "10px 18px",
            background: feeFree ? "rgba(0,95,45,0.2)" : "rgba(255,255,255,0.06)",
            border: `1px solid ${feeFree ? "rgba(0,95,45,0.5)" : "rgba(255,255,255,0.12)"}`,
            borderRadius: 10, cursor: feeFreeLoading ? "not-allowed" : "pointer", transition: "all 0.2s", flexShrink: 0,
          }}>
          <div style={{
            width: 40, height: 22, borderRadius: 11, background: feeFree ? "#005F2D" : "rgba(255,255,255,0.12)",
            position: "relative", transition: "background 0.2s",
          }}>
            <div style={{
              position: "absolute", top: 3, left: feeFree ? 21 : 3,
              width: 16, height: 16, borderRadius: "50%", background: "white",
              transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
            }} />
          </div>
          <span style={{ color: feeFree ? "#4CAF82" : "rgba(255,255,255,0.4)", fontWeight: 600, fontSize: "0.82rem" }}>
            {feeFreeLoading ? "…" : feeFree ? "Activé" : "Désactivé"}
          </span>
        </button>
      </div>

      {/* Per-client fee config */}
      <div style={{ background: "#1A1D27", borderRadius: 14, border: `1px solid ${customFee ? "rgba(0,95,45,0.4)" : "rgba(255,255,255,0.06)"}`, marginBottom: 16, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <Euro size={15} color="#4CAF82" />
          <p style={{ color: "white", fontWeight: 600, fontSize: "0.88rem", margin: 0 }}>Frais & Coordonnées de paiement</p>
          {customFee
            ? <span style={{ marginLeft: 6, background: "rgba(0,95,45,0.25)", color: "#4CAF82", fontSize: "0.68rem", fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>Personnalisé — {customFee.amount} {customFee.currency}</span>
            : <span style={{ marginLeft: 6, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)", fontSize: "0.68rem", fontWeight: 600, padding: "2px 8px", borderRadius: 20 }}>Paramètres globaux</span>
          }
          {customFee && (
            <button onClick={resetFeeConfig} disabled={feeSaving} style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "5px 10px", color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", cursor: "pointer" }}>
              <RotateCcw size={12} /> Réinitialiser (global)
            </button>
          )}
        </div>
        <div style={{ padding: "16px 20px" }}>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem", marginBottom: 16, lineHeight: 1.5 }}>
            Configurez des frais et des coordonnées de paiement spécifiques à ce client. Si vide, les paramètres globaux (page Paramètres) s&apos;appliquent.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div>
              <label style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>Montant des frais (€)</label>
              <input type="number" min="0" value={feeForm.amount}
                onChange={(e) => setFeeForm((f) => ({ ...f, amount: Number(e.target.value) }))}
                style={{ width: "100%", height: 40, background: "#252836", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#4CAF82", fontWeight: 700, fontSize: "1rem", padding: "0 12px", boxSizing: "border-box", outline: "none" }} />
            </div>
            <div>
              <label style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>Devise</label>
              <select value={feeForm.currency} onChange={(e) => setFeeForm((f) => ({ ...f, currency: e.target.value }))}
                style={{ width: "100%", height: 40, background: "#252836", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "white", fontSize: "0.88rem", padding: "0 12px", outline: "none" }}>
                <option value="EUR">EUR</option><option value="USD">USD</option><option value="GBP">GBP</option>
              </select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 14 }}>
            {([
              ["Bénéficiaire (nom)", "name", false],
              ["Banque", "bank", false],
              ["IBAN", "iban", true],
              ["BIC / SWIFT", "bic", true],
              ["Référence à indiquer", "reference", false],
            ] as [string, keyof FeePayment, boolean][]).map(([label, key, mono]) => (
              <div key={key} style={key === "reference" ? { gridColumn: "1 / -1" } : {}}>
                <label style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>{label}</label>
                <input type="text" value={payForm[key]}
                  onChange={(e) => setPayForm((p) => ({ ...p, [key]: e.target.value }))}
                  style={{ width: "100%", height: 40, background: "#252836", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "white", fontSize: "0.85rem", padding: "0 12px", boxSizing: "border-box", outline: "none", fontFamily: mono ? "monospace" : "inherit" }} />
              </div>
            ))}
          </div>
          <button onClick={saveFeeConfig} disabled={feeSaving}
            style={{ height: 38, padding: "0 18px", background: feeSaved ? "#4CAF82" : "#005F2D", border: "none", borderRadius: 8, color: "white", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, opacity: feeSaving ? 0.7 : 1 }}>
            {feeSaved ? <><Check size={14} /> Enregistré</> : feeSaving ? "…" : "Enregistrer pour ce client"}
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
            <div key={t.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ padding: "12px 20px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <p style={{ color: "white", fontWeight: 600, fontSize: "0.85rem", margin: 0 }}>{t.to_name}</p>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.72rem", margin: "2px 0 0", fontFamily: "monospace" }}>{t.to_iban}</p>
                  {t.reference && <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.7rem", margin: "2px 0 0" }}>Réf virement : {t.reference}</p>}
                  {t.payment_reference && <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.7rem", margin: "2px 0 0" }}>Réf paiement frais : {t.payment_reference}</p>}
                  {t.rejection_reason && <p style={{ color: "#F87171", fontSize: "0.7rem", margin: "4px 0 0" }}>Motif : {t.rejection_reason}</p>}
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
                    {(t.status === "pending_fee" || t.status === "processing") && (<>
                      <button onClick={() => updateTransfer(t.id, "completed")} style={{ background: "rgba(74,222,128,0.15)", border: "none", borderRadius: 6, padding: "3px 8px", color: "#4ADE80", fontSize: "0.7rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
                        <Check size={11} /> Valider
                      </button>
                      <button onClick={() => { setActionTarget(t.id); setActionMode("cancel"); setActionReason(""); }} style={{ background: "rgba(251,191,36,0.12)", border: "none", borderRadius: 6, padding: "3px 8px", color: "#FBB824", fontSize: "0.7rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
                        <X size={11} /> Annuler
                      </button>
                      <button onClick={() => { setActionTarget(t.id); setActionMode("reject"); setActionReason(""); }} style={{ background: "rgba(248,113,113,0.15)", border: "none", borderRadius: 6, padding: "3px 8px", color: "#F87171", fontSize: "0.7rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
                        <X size={11} /> Rejeter
                      </button>
                    </>)}
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.65rem", margin: 0 }}>{new Date(t.created_at).toLocaleDateString("fr-FR")}</p>
                </div>
              </div>
              {/* Inline action panel (reject / cancel) */}
              {actionTarget === t.id && (
                <div style={{ margin: "0 20px 14px", background: actionMode === "reject" ? "rgba(248,113,113,0.06)" : "rgba(251,191,36,0.06)", border: `1px solid ${actionMode === "reject" ? "rgba(248,113,113,0.2)" : "rgba(251,191,36,0.2)"}`, borderRadius: 10, padding: "12px 14px" }}>
                  <p style={{ color: actionMode === "reject" ? "#F87171" : "#FBB824", fontSize: "0.75rem", fontWeight: 600, margin: "0 0 4px" }}>
                    {actionMode === "reject" ? "Motif de rejet" : "Motif d'annulation"} <span>*</span>
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", margin: "0 0 8px" }}>
                    Obligatoire — sera affiché au client dans son tableau de bord et par e-mail. Le montant sera remboursé automatiquement.
                  </p>
                  <input
                    type="text"
                    placeholder={actionMode === "reject" ? "Ex: Informations incorrectes, document insuffisant…" : "Ex: Demande du client, délai expiré…"}
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    style={{ width: "100%", height: 38, background: "#252836", border: `1px solid ${actionReason ? "rgba(255,255,255,0.15)" : (actionMode === "reject" ? "rgba(248,113,113,0.6)" : "rgba(251,191,36,0.6)")}`, borderRadius: 8, color: "white", fontSize: "0.82rem", padding: "0 12px", boxSizing: "border-box", outline: "none", marginBottom: 10 }}
                  />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => updateTransfer(t.id, actionMode === "reject" ? "rejected" : "cancelled", actionReason)}
                      disabled={!actionReason.trim()}
                      style={{ flex: 1, height: 34, background: actionReason.trim() ? (actionMode === "reject" ? "#991B1B" : "#78350F") : "rgba(153,27,27,0.35)", border: "none", borderRadius: 8, color: "white", fontWeight: 700, fontSize: "0.78rem", cursor: actionReason.trim() ? "pointer" : "not-allowed" }}>
                      {actionMode === "reject" ? "Confirmer le rejet" : "Confirmer l'annulation"}
                    </button>
                    <button onClick={() => setActionTarget(null)}
                      style={{ height: 34, padding: "0 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", cursor: "pointer" }}>
                      Fermer
                    </button>
                  </div>
                </div>
              )}
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

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24 }}>
          <div style={{ background: "#1A1D27", borderRadius: 16, border: "1px solid rgba(248,113,113,0.3)", padding: 28, maxWidth: 420, width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(248,113,113,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Trash2 size={18} color="#F87171" />
              </div>
              <div>
                <p style={{ color: "white", fontWeight: 700, fontSize: "0.95rem", margin: 0 }}>Supprimer ce client ?</p>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem", margin: "3px 0 0" }}>{String(profile.prenom ?? "")} {String(profile.nom ?? "")} — {String(profile.email ?? "")}</p>
              </div>
            </div>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.82rem", lineHeight: 1.6, marginBottom: 20 }}>
              Cette action est <strong style={{ color: "#F87171" }}>irréversible</strong>. Toutes les données seront supprimées : profil, comptes, transactions, virements, cartes et sessions.
            </p>
            {deleteError && (
              <div style={{ background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.4)", borderRadius: 8, padding: "10px 14px", marginBottom: 16 }}>
                <p style={{ color: "#F87171", fontSize: "0.82rem", margin: 0, fontWeight: 600 }}>⚠ {deleteError}</p>
              </div>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setDeleteConfirm(false); setDeleteError(""); }} disabled={deleting}
                style={{ flex: 1, height: 42, background: "#252836", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}>
                Annuler
              </button>
              <button onClick={deleteClient} disabled={deleting}
                style={{ flex: 1, height: 42, background: "#991B1B", border: "none", borderRadius: 10, color: "white", fontWeight: 700, fontSize: "0.85rem", cursor: deleting ? "not-allowed" : "pointer", opacity: deleting ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                {deleting ? "Suppression…" : <><Trash2 size={14} /> Supprimer définitivement</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {accounts.map((acc) => (
        <div key={acc.id} style={{ background: "#1A1D27", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <Building size={15} color={acc.type === "business" ? "#C9A84C" : "#4CAF82"} />
            <p style={{ color: "white", fontWeight: 600, fontSize: "0.88rem", margin: 0 }}>
              {acc.type === "business" ? `Compte entreprise${acc.business_info?.company_name ? ` — ${acc.business_info.company_name}` : ""}` : `Compte ${acc.type}`} — {acc.currency}
            </p>
            {acc.status === "pending"
              ? <span style={{ marginLeft: "auto", background: "rgba(251,184,36,0.15)", color: "#FBB824", fontWeight: 700, fontSize: "0.72rem", padding: "3px 10px", borderRadius: 20 }}>À valider</span>
              : <span style={{ marginLeft: "auto", color: "#4CAF82", fontWeight: 800 }}>{Number(acc.balance).toFixed(2)} €</span>}
          </div>

          {acc.type === "business" && acc.business_info && (
            <div style={{ padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "8px 24px" }}>
              {Object.entries(acc.business_info).filter(([, v]) => v).map(([k, v]) => (
                <Field key={k} label={k.replace(/_/g, " ")} value={v} />
              ))}
            </div>
          )}

          {acc.type === "business" && acc.status === "pending" && (
            <div style={{ padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 10 }}>
              <button onClick={() => decideBusiness(acc.id, "approve")} disabled={bizLoading === acc.id}
                style={{ flex: 1, height: 40, background: "#005F2D", border: "none", borderRadius: 9, color: "white", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, opacity: bizLoading === acc.id ? 0.6 : 1 }}>
                <Check size={14} /> Approuver le compte
              </button>
              <button onClick={() => decideBusiness(acc.id, "reject")} disabled={bizLoading === acc.id}
                style={{ flex: 1, height: 40, background: "#7F1D1D", border: "none", borderRadius: 9, color: "white", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, opacity: bizLoading === acc.id ? 0.6 : 1 }}>
                <X size={14} /> Refuser
              </button>
            </div>
          )}

          <div style={{ padding: "14px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "10px 24px" }}>
            <Field label="IBAN" value={acc.iban || "—"} /><Field label="BIC" value={acc.iban ? "KTAGDEFF" : "—"} /><Field label="Statut" value={acc.status} />
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

      {/* Fee invoices (Règlement de frais) */}
      <div style={{ background: "#1A1D27", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 16, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 8 }}>
          <Euro size={15} color="#4CAF82" />
          <p style={{ color: "white", fontWeight: 600, fontSize: "0.88rem", margin: 0 }}>Facturation de frais</p>
        </div>

        <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", margin: "0 0 12px", lineHeight: 1.5 }}>
            Émettez une facture de frais. Le client reçoit un email dans sa langue + une notification, et peut régler par SEPA ou crypto puis envoyer une preuve.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <input type="text" placeholder="Intitulé (ex: Frais de dossier)" value={invTitle} onChange={(e) => setInvTitle(e.target.value)}
              style={{ height: 40, background: "#252836", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, color: "white", fontSize: "0.85rem", padding: "0 12px", outline: "none" }} />
            <input type="number" min="0" placeholder="Montant (€)" value={invAmount} onChange={(e) => setInvAmount(e.target.value)}
              style={{ height: 40, background: "#252836", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, color: "white", fontSize: "0.85rem", padding: "0 12px", outline: "none" }} />
          </div>
          <input type="text" placeholder="Description (optionnel)" value={invDesc} onChange={(e) => setInvDesc(e.target.value)}
            style={{ width: "100%", height: 40, background: "#252836", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, color: "white", fontSize: "0.85rem", padding: "0 12px", outline: "none", boxSizing: "border-box", marginBottom: 10 }} />
          <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.65)", fontSize: "0.82rem", cursor: "pointer" }}>
              <input type="checkbox" checked={invSepa} onChange={(e) => setInvSepa(e.target.checked)} /> Virement SEPA
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.65)", fontSize: "0.82rem", cursor: "pointer" }}>
              <input type="checkbox" checked={invCrypto} onChange={(e) => setInvCrypto(e.target.checked)} /> Crypto
            </label>
            <button onClick={createInvoice} disabled={invLoading || !invAmount}
              style={{ marginLeft: "auto", height: 40, padding: "0 18px", background: "#005F2D", border: "none", borderRadius: 9, color: "white", fontWeight: 700, fontSize: "0.82rem", cursor: invLoading || !invAmount ? "not-allowed" : "pointer", opacity: invLoading || !invAmount ? 0.5 : 1, display: "flex", alignItems: "center", gap: 6 }}>
              <Plus size={14} /> {invLoading ? "Envoi…" : "Émettre la facture"}
            </button>
          </div>
        </div>

        <div style={{ padding: "8px 20px 16px" }}>
          {feeInvoices.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.82rem", margin: "12px 0", textAlign: "center" }}>Aucune facture émise.</p>
          ) : feeInvoices.map((inv) => {
            const sc = inv.status === "paid" ? ["rgba(74,222,128,0.15)", "#4ADE80", "Payé"]
              : inv.status === "proof_submitted" ? ["rgba(59,130,246,0.15)", "#60A5FA", "Preuve reçue"]
              : inv.status === "cancelled" ? ["rgba(148,163,184,0.15)", "#94A3B8", "Annulé"]
              : ["rgba(251,184,36,0.15)", "#FBB824", "En attente"];
            return (
              <div key={inv.id} style={{ background: "#0F1117", borderRadius: 10, border: "1px solid rgba(255,255,255,0.05)", padding: "12px 14px", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ color: "white", fontWeight: 700, fontSize: "0.86rem" }}>{Number(inv.amount).toFixed(2)} {inv.currency}</span>
                  <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem" }}>{inv.title || "Frais"}</span>
                  <span style={{ background: sc[0], color: sc[1], fontWeight: 700, fontSize: "0.7rem", padding: "3px 9px", borderRadius: 20 }}>{sc[2]}</span>
                  <span style={{ marginLeft: "auto", color: "rgba(255,255,255,0.3)", fontSize: "0.72rem" }}>{new Date(inv.created_at).toLocaleDateString("fr-FR")}</span>
                </div>
                {inv.description && <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem", margin: "6px 0 0" }}>{inv.description}</p>}
                <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                  {inv.proof_url && (
                    <button onClick={() => viewProof(inv.proof_url!)}
                      style={{ height: 32, padding: "0 12px", background: "rgba(59,130,246,0.15)", border: "none", borderRadius: 8, color: "#60A5FA", fontWeight: 600, fontSize: "0.76rem", cursor: "pointer" }}>
                      Voir la preuve{inv.proof_method ? ` (${inv.proof_method})` : ""}
                    </button>
                  )}
                  {inv.status !== "paid" && (
                    <button onClick={() => setInvoiceStatus(inv.id, "paid")}
                      style={{ height: 32, padding: "0 12px", background: "#005F2D", border: "none", borderRadius: 8, color: "white", fontWeight: 600, fontSize: "0.76rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                      <Check size={12} /> Marquer payé
                    </button>
                  )}
                  {inv.status !== "cancelled" && inv.status !== "paid" && (
                    <button onClick={() => setInvoiceStatus(inv.id, "cancelled")}
                      style={{ height: 32, padding: "0 12px", background: "#252836", border: "none", borderRadius: 8, color: "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: "0.76rem", cursor: "pointer" }}>
                      Annuler
                    </button>
                  )}
                  <button onClick={() => deleteInvoice(inv.id)}
                    style={{ height: 32, padding: "0 10px", background: "rgba(248,113,113,0.12)", border: "none", borderRadius: 8, color: "#F87171", fontWeight: 600, fontSize: "0.76rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                    <Trash2 size={12} /> Supprimer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
