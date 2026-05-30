"use client";
import { useEffect, useState } from "react";
import { useAdmin } from "@/app/kt-admin/layout";
import { Check, X, Clock, ChevronDown, ChevronUp, RefreshCw, AlertCircle } from "lucide-react";

type CreditRequest = {
  id: string;
  type: "islamic" | "standard";
  amount: number;
  duration_months: number;
  monthly_payment: number;
  total_repayment: number;
  interest_rate: number;
  purpose?: string;
  employment_status?: string;
  monthly_income?: number;
  existing_debts?: number;
  property_owned?: boolean;
  marital_status?: string;
  dependents?: number;
  status: "pending" | "approved" | "rejected";
  rejection_reason?: string;
  admin_notes?: string;
  created_at: string;
  kt_profiles: { prenom: string; nom: string; email: string; lang: string } | null;
};

const STATUS_LABELS: Record<string, [string, string, string]> = {
  pending:  ["#FFF7ED", "#D97706", "En attente"],
  approved: ["#F0FDF4", "#16A34A", "Approuvé"],
  rejected: ["#FEF2F2", "#DC2626", "Rejeté"],
};

function fmt(n: number) { return n.toLocaleString("fr-FR", { minimumFractionDigits: 2 }) + " €"; }
function fmtDate(iso: string) { return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }); }

function StatusBadge({ status }: { status: string }) {
  const [bg, color, label] = STATUS_LABELS[status] ?? ["#F1F5F9", "#64748B", status];
  return (
    <span style={{ background: bg, color, fontSize: "0.72rem", fontWeight: 700, padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

function CreditRow({ req, onUpdated }: { req: CreditRequest; onUpdated: () => void }) {
  const { token } = useAdmin();
  const [expanded, setExpanded] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [reason, setReason] = useState("");
  const [adminNotes, setAdminNotes] = useState(req.admin_notes ?? "");

  const profile = req.kt_profiles;
  const typeLabel = req.type === "islamic" ? "Islamique 0%" : "Standard 2%";

  async function act(status: "approved" | "rejected" | "pending") {
    setProcessing(true);
    await fetch("/api/kt/admin/credits", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ id: req.id, status, rejection_reason: reason || undefined, admin_notes: adminNotes || undefined }),
    });
    setProcessing(false);
    setShowRejectForm(false);
    onUpdated();
  }

  return (
    <div style={{ background: "#1A1D27", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden", marginBottom: 10 }}>
      {/* Row header */}
      <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <button onClick={() => setExpanded(!expanded)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", padding: 0, display: "flex", flexShrink: 0 }}>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        <div style={{ flex: 1, minWidth: 160 }}>
          <p style={{ color: "white", fontWeight: 700, fontSize: "0.88rem", margin: "0 0 2px" }}>
            {profile ? `${profile.prenom} ${profile.nom}` : "—"}
          </p>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.72rem", margin: 0 }}>{profile?.email ?? "—"}</p>
        </div>

        <div style={{ textAlign: "center", minWidth: 80 }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 2px" }}>Type</p>
          <p style={{ color: req.type === "islamic" ? "#86EFAC" : "#93C5FD", fontWeight: 700, fontSize: "0.78rem", margin: 0 }}>{typeLabel}</p>
        </div>

        <div style={{ textAlign: "center", minWidth: 100 }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 2px" }}>Montant</p>
          <p style={{ color: "white", fontWeight: 800, fontSize: "0.95rem", margin: 0 }}>{fmt(req.amount)}</p>
        </div>

        <div style={{ textAlign: "center", minWidth: 80 }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 2px" }}>Durée</p>
          <p style={{ color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: "0.82rem", margin: 0 }}>{req.duration_months} mois</p>
        </div>

        <div style={{ textAlign: "center", minWidth: 90 }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 2px" }}>Mensualité</p>
          <p style={{ color: "#4CAF82", fontWeight: 700, fontSize: "0.82rem", margin: 0 }}>{fmt(req.monthly_payment)}</p>
        </div>

        <div style={{ minWidth: 80 }}>
          <StatusBadge status={req.status} />
        </div>

        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.72rem", minWidth: 70, textAlign: "right" }}>
          {fmtDate(req.created_at)}
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "18px 18px 18px 46px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "10px 24px", marginBottom: 16 }}>
            {[
              ["Total remboursement", fmt(req.total_repayment)],
              ["Taux d'intérêt", req.type === "islamic" ? "0% (Mourabaha)" : "2% annuel"],
              ["Objet", req.purpose ?? "—"],
              ["Statut emploi", req.employment_status ?? "—"],
              ["Revenus mensuels", req.monthly_income ? fmt(req.monthly_income) : "—"],
              ["Dettes existantes", req.existing_debts ? fmt(req.existing_debts) : "0 €"],
              ["Propriétaire", req.property_owned ? "Oui" : "Non"],
              ["Situation familiale", req.marital_status ?? "—"],
              ["Personnes à charge", String(req.dependents ?? 0)],
            ].map(([k, v]) => (
              <div key={k}>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 2px" }}>{k}</p>
                <p style={{ color: "white", fontSize: "0.82rem", fontWeight: 500, margin: 0 }}>{v}</p>
              </div>
            ))}
          </div>

          {req.rejection_reason && (
            <div style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 10, padding: "10px 14px", marginBottom: 12 }}>
              <p style={{ color: "#F87171", fontSize: "0.78rem", fontWeight: 600, margin: "0 0 4px" }}>Motif de rejet</p>
              <p style={{ color: "rgba(248,113,113,0.8)", fontSize: "0.82rem", margin: 0 }}>{req.rejection_reason}</p>
            </div>
          )}

          {/* Admin notes */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>
              Notes internes (non visibles par le client)
            </label>
            <textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)}
              rows={2}
              style={{ width: "100%", background: "#252836", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "white", fontSize: "0.82rem", padding: "10px 12px", boxSizing: "border-box", resize: "vertical", outline: "none", fontFamily: "inherit" }}
              placeholder="Notes de l'équipe…" />
          </div>

          {/* Actions */}
          {req.status === "pending" && (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {!showRejectForm ? (
                <>
                  <button onClick={() => act("approved")} disabled={processing}
                    style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 20px", background: "#005F2D", border: "none", borderRadius: 10, color: "white", fontWeight: 700, fontSize: "0.82rem", cursor: processing ? "not-allowed" : "pointer", opacity: processing ? 0.6 : 1 }}>
                    <Check size={14} /> Approuver
                  </button>
                  <button onClick={() => setShowRejectForm(true)}
                    style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 20px", background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: 10, color: "#F87171", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}>
                    <X size={14} /> Rejeter
                  </button>
                </>
              ) : (
                <div style={{ width: "100%" }}>
                  <textarea value={reason} onChange={(e) => setReason(e.target.value)}
                    rows={2} placeholder="Motif de rejet (visible par le client)…"
                    style={{ width: "100%", background: "#252836", border: "1px solid rgba(220,38,38,0.3)", borderRadius: 10, color: "white", fontSize: "0.82rem", padding: "10px 12px", boxSizing: "border-box", resize: "vertical", outline: "none", fontFamily: "inherit", marginBottom: 10 }} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => act("rejected")} disabled={processing}
                      style={{ padding: "9px 18px", background: "#DC2626", border: "none", borderRadius: 10, color: "white", fontWeight: 700, fontSize: "0.82rem", cursor: processing ? "not-allowed" : "pointer", opacity: processing ? 0.6 : 1 }}>
                      Confirmer le rejet
                    </button>
                    <button onClick={() => { setShowRejectForm(false); setReason(""); }}
                      style={{ padding: "9px 14px", background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 10, color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", cursor: "pointer" }}>
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {req.status !== "pending" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {req.status === "approved" ? <Check size={16} color="#4CAF82" /> : <X size={16} color="#F87171" />}
              <span style={{ color: req.status === "approved" ? "#4CAF82" : "#F87171", fontSize: "0.82rem", fontWeight: 600 }}>
                Dossier {req.status === "approved" ? "approuvé" : "rejeté"}
              </span>
              {/* Allow re-evaluation */}
              <button onClick={() => act("pending")} disabled={processing}
                style={{ marginLeft: 10, padding: "5px 12px", background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, color: "rgba(255,255,255,0.4)", fontSize: "0.72rem", cursor: "pointer" }}>
                Remettre en attente
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminCreditsPage() {
  const { token } = useAdmin();
  const [requests, setRequests] = useState<CreditRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    const url = statusFilter === "all" ? "/api/kt/admin/credits" : `/api/kt/admin/credits?status=${statusFilter}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) { setError("Erreur de chargement"); setLoading(false); return; }
    const d = await res.json();
    setRequests(d.requests ?? []);
    setLoading(false);
  }

  useEffect(() => { if (token) load(); }, [token, statusFilter]); // eslint-disable-line

  const counts = { all: requests.length, pending: 0, approved: 0, rejected: 0 };
  for (const r of requests) { if (r.status in counts) counts[r.status as keyof typeof counts]++; }
  // counts.all is always total regardless of filter
  const totalAll = statusFilter === "all" ? requests.length : undefined;

  return (
    <div style={{ padding: "24px 20px", maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <div>
          <h1 style={{ color: "white", fontWeight: 800, fontSize: "1.3rem", margin: "0 0 4px" }}>Demandes de crédit</h1>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.82rem", margin: 0 }}>Gestion et décisions sur les dossiers</p>
        </div>
        <button onClick={load} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "rgba(255,255,255,0.6)", fontSize: "0.82rem", cursor: "pointer" }}>
          <RefreshCw size={13} /> Actualiser
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {[
          { key: "all", label: "Tous" },
          { key: "pending", label: "En attente" },
          { key: "approved", label: "Approuvés" },
          { key: "rejected", label: "Rejetés" },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setStatusFilter(key)}
            style={{
              padding: "7px 16px", borderRadius: 20, fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
              background: statusFilter === key ? "#005F2D" : "rgba(255,255,255,0.06)",
              color: statusFilter === key ? "white" : "rgba(255,255,255,0.5)",
              border: statusFilter === key ? "none" : "1px solid rgba(255,255,255,0.1)",
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 10, marginBottom: 24 }}>
        {[
          { label: "Total", value: totalAll ?? requests.length, color: "white" },
          { label: "En attente", value: requests.filter((r) => r.status === "pending").length, color: "#D97706" },
          { label: "Approuvés", value: requests.filter((r) => r.status === "approved").length, color: "#16A34A" },
          { label: "Rejetés", value: requests.filter((r) => r.status === "rejected").length, color: "#DC2626" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: "#1A1D27", borderRadius: 12, padding: "14px 16px", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 5px" }}>{label}</p>
            <p style={{ color, fontWeight: 800, fontSize: "1.5rem", margin: 0 }}>{value}</p>
          </div>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.3)", fontSize: "0.85rem" }}>
          <RefreshCw size={20} style={{ animation: "spin 1s linear infinite", display: "inline-block" }} />
          <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
          <p style={{ margin: "10px 0 0" }}>Chargement…</p>
        </div>
      ) : error ? (
        <div style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.25)", borderRadius: 12, padding: "16px 20px", display: "flex", gap: 10, alignItems: "center" }}>
          <AlertCircle size={18} color="#F87171" />
          <p style={{ color: "#F87171", margin: 0, fontSize: "0.85rem" }}>{error}</p>
        </div>
      ) : requests.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 24px", background: "#1A1D27", borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)" }}>
          <Clock size={32} color="rgba(255,255,255,0.15)" style={{ display: "block", margin: "0 auto 12px" }} />
          <p style={{ color: "rgba(255,255,255,0.3)", margin: 0, fontSize: "0.88rem" }}>Aucune demande {statusFilter !== "all" ? "dans cette catégorie" : ""}</p>
        </div>
      ) : (
        requests.map((req) => <CreditRow key={req.id} req={req} onUpdated={load} />)
      )}
    </div>
  );
}
