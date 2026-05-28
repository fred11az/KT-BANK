"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAdmin } from "../layout";
import { ArrowLeftRight, Check, X, RefreshCw, ExternalLink, FileCheck } from "lucide-react";

type Transfer = {
  id: string; profile_id: string; account_id: string;
  to_name: string; to_iban: string; amount: number; fee_amount: number;
  fee_paid: boolean; status: string; reference: string | null;
  payment_reference: string | null; payment_proof_url: string | null;
  created_at: string;
  kt_profiles: { prenom: string; nom: string; email: string } | null;
};

const STATUS: Record<string, [string, string]> = {
  pending_fee: ["#FBB824", "Attente frais"],
  processing:  ["#60A5FA", "En traitement"],
  completed:   ["#4ADE80", "Complété"],
  rejected:    ["#F87171", "Rejeté"],
};

function Badge({ status }: { status: string }) {
  const [color, label] = STATUS[status] ?? ["#888", status];
  return (
    <span style={{ background: `${color}22`, color, fontSize: "0.72rem", fontWeight: 700, padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

export default function TransfersPage() {
  const { token } = useAdmin();
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  function load() {
    setLoading(true);
    fetch(`/api/kt/admin/transfers?status=${filter}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { setTransfers(d.transfers ?? []); setLoading(false); });
  }

  useEffect(() => { load(); }, [filter]);

  async function act(transfer_id: string, transfer_status: string) {
    setActing(transfer_id + transfer_status);
    await fetch("/api/kt/admin/transfers", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ transfer_id, transfer_status }),
    });
    setActing(null);
    load();
  }

  async function viewProof(path: string) {
    const res = await fetch(`/api/kt/admin/transfer-proof?path=${encodeURIComponent(path)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const { url } = await res.json();
    if (url) window.open(url, "_blank");
  }

  const FILTERS = [
    { key: "all", label: "Tous" },
    { key: "pending_fee", label: "Attente frais" },
    { key: "processing", label: "En traitement" },
    { key: "completed", label: "Complétés" },
    { key: "rejected", label: "Rejetés" },
  ];

  const pendingCount = transfers.filter((t) => t.status === "processing").length;

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(0,95,45,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ArrowLeftRight size={20} color="#4CAF82" />
        </div>
        <div>
          <h1 style={{ color: "white", fontWeight: 800, fontSize: "1.2rem", margin: 0 }}>
            Virements
            {pendingCount > 0 && filter === "all" && (
              <span style={{ marginLeft: 10, background: "#EF4444", color: "white", fontSize: "0.65rem", fontWeight: 700, padding: "2px 7px", borderRadius: 999, verticalAlign: "middle" }}>
                {pendingCount} à traiter
              </span>
            )}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem", margin: 0 }}>Demandes de virements de tous les clients</p>
        </div>
        <button onClick={load} style={{ marginLeft: "auto", background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: 8 }}>
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {FILTERS.map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key)}
            style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600,
              background: filter === key ? "#005F2D" : "#1A1D27",
              color: filter === key ? "white" : "rgba(255,255,255,0.45)" }}>
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "#1A1D27", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
        {loading ? (
          <p style={{ padding: 32, color: "rgba(255,255,255,0.3)", textAlign: "center" }}>Chargement…</p>
        ) : transfers.length === 0 ? (
          <p style={{ padding: 32, color: "rgba(255,255,255,0.3)", textAlign: "center" }}>Aucune demande</p>
        ) : transfers.map((t) => {
          const name = t.kt_profiles ? `${t.kt_profiles.prenom} ${t.kt_profiles.nom}` : "—";
          const email = t.kt_profiles?.email ?? "";
          return (
            <div key={t.id} style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>

              {/* Client */}
              <div style={{ minWidth: 160 }}>
                <Link href={`/kt-admin/clients/${t.profile_id}`}
                  style={{ color: "white", fontWeight: 600, fontSize: "0.88rem", textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}>
                  {name} <ExternalLink size={11} color="#4CAF82" />
                </Link>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.72rem", margin: "2px 0 0" }}>{email}</p>
              </div>

              {/* Beneficiary */}
              <div style={{ flex: 1, minWidth: 160 }}>
                <p style={{ color: "white", fontSize: "0.85rem", margin: 0, fontWeight: 500 }}>{t.to_name}</p>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", margin: "2px 0 0", fontFamily: "monospace" }}>{t.to_iban}</p>
                {t.reference && <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.68rem", margin: "2px 0 0" }}>Réf : {t.reference}</p>}
              </div>

              {/* Amount */}
              <div style={{ textAlign: "right", minWidth: 90 }}>
                <p style={{ color: "white", fontWeight: 800, fontSize: "0.95rem", margin: 0 }}>{Number(t.amount).toFixed(2)} €</p>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", margin: "2px 0 0" }}>
                  Frais {Number(t.fee_amount).toFixed(0)} € {t.fee_paid ? "✅" : "⏳"}
                </p>
              </div>

              {/* Payment ref + proof */}
              <div style={{ minWidth: 120 }}>
                {t.payment_reference && (
                  <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.7rem", margin: "0 0 4px" }}>
                    Réf paiement : <span style={{ color: "white", fontFamily: "monospace" }}>{t.payment_reference}</span>
                  </p>
                )}
                {t.payment_proof_url && (
                  <button onClick={() => viewProof(t.payment_proof_url!)}
                    style={{ background: "rgba(99,102,241,0.15)", border: "none", borderRadius: 6, padding: "3px 9px", color: "#818CF8", fontSize: "0.7rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                    <FileCheck size={11} /> Voir preuve
                  </button>
                )}
              </div>

              {/* Status + actions */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, minWidth: 120 }}>
                <Badge status={t.status} />
                <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.65rem", margin: 0 }}>
                  {new Date(t.created_at).toLocaleDateString("fr-FR")}
                </p>
                {(t.status === "processing" || t.status === "pending_fee") && (
                  <div style={{ display: "flex", gap: 5 }}>
                    <button onClick={() => act(t.id, "completed")} disabled={acting !== null}
                      style={{ background: "rgba(74,222,128,0.15)", border: "none", borderRadius: 6, padding: "4px 10px", color: "#4ADE80", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, opacity: acting ? 0.6 : 1 }}>
                      <Check size={12} /> Valider
                    </button>
                    <button onClick={() => act(t.id, "rejected")} disabled={acting !== null}
                      style={{ background: "rgba(248,113,113,0.15)", border: "none", borderRadius: 6, padding: "4px 10px", color: "#F87171", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, opacity: acting ? 0.6 : 1 }}>
                      <X size={12} /> Rejeter
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
