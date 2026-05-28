"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAdmin } from "./layout";
import { Users, TrendingUp, CheckCircle, Clock, ArrowLeftRight, AlertCircle } from "lucide-react";

type Client = { id: string; email: string; prenom: string; nom: string; status: string; registration_step: number; created_at: string };
type Transfer = { id: string; profile_id: string; to_name: string; amount: number; status: string; created_at: string; kt_profiles: { prenom: string; nom: string } | null };

export default function AdminDashboard() {
  const { token } = useAdmin();
  const [clients, setClients] = useState<Client[]>([]);
  const [pendingTransfers, setPendingTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/kt/admin/clients", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { setClients(d.clients ?? []); setLoading(false); });
    fetch("/api/kt/admin/transfers?status=processing", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setPendingTransfers(d.transfers ?? []));
  }, [token]);

  const active = clients.filter((c) => c.status === "active").length;
  const pending = clients.filter((c) => c.registration_step < 7).length;
  const today = clients.filter((c) => new Date(c.created_at).toDateString() === new Date().toDateString()).length;

  const stats = [
    { label: "Total clients", value: clients.length, icon: Users, color: "#005F2D" },
    { label: "Comptes actifs", value: active, icon: CheckCircle, color: "#22C55E" },
    { label: "Virements à traiter", value: pendingTransfers.length, icon: ArrowLeftRight, color: pendingTransfers.length > 0 ? "#EF4444" : "#F59E0B" },
    { label: "Aujourd'hui", value: today, icon: TrendingUp, color: "#3B82F6" },
  ];

  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ color: "white", fontWeight: 800, fontSize: "1.5rem", marginBottom: 6 }}>Dashboard</h1>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.88rem", marginBottom: 28 }}>Vue d'ensemble — KT Bank AG</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} style={{ background: "#1A1D27", borderRadius: 14, padding: "20px 24px", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", margin: 0 }}>{label}</p>
              <Icon size={18} color={color} />
            </div>
            <p style={{ color: "white", fontWeight: 800, fontSize: "1.8rem", margin: 0 }}>{loading ? "—" : value}</p>
          </div>
        ))}
      </div>

      {/* Pending transfers alert */}
      {pendingTransfers.length > 0 && (
        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 14, padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <AlertCircle size={18} color="#EF4444" />
            <p style={{ color: "white", fontWeight: 600, fontSize: "0.9rem", margin: 0 }}>
              {pendingTransfers.length} virement{pendingTransfers.length > 1 ? "s" : ""} en attente de validation
            </p>
          </div>
          <Link href="/kt-admin/transfers" style={{ background: "#EF4444", color: "white", borderRadius: 8, padding: "6px 14px", fontSize: "0.8rem", fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" }}>
            Traiter maintenant →
          </Link>
        </div>
      )}

      <div style={{ background: "#1A1D27", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ color: "white", fontWeight: 600, fontSize: "0.95rem", margin: 0 }}>Inscriptions récentes</p>
          <Link href="/kt-admin/clients" style={{ color: "#4CAF82", fontSize: "0.82rem", textDecoration: "none" }}>Voir tout →</Link>
        </div>
        {loading ? (
          <p style={{ padding: 24, color: "rgba(255,255,255,0.3)", fontSize: "0.88rem" }}>Chargement…</p>
        ) : clients.slice(0, 8).map((c) => (
          <Link key={c.id} href={`/kt-admin/clients/${c.id}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderBottom: "1px solid rgba(255,255,255,0.04)", textDecoration: "none" }}>
            <div>
              <p style={{ color: "white", fontWeight: 600, fontSize: "0.9rem", margin: 0 }}>{c.prenom || "—"} {c.nom || ""}</p>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem", margin: "2px 0 0" }}>{c.email}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 999, fontSize: "0.72rem", fontWeight: 600, background: c.status === "active" ? "rgba(34,197,94,0.15)" : "rgba(245,158,11,0.15)", color: c.status === "active" ? "#22C55E" : "#F59E0B" }}>
                {c.status === "active" ? "Actif" : "En cours"}
              </span>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.72rem", margin: "4px 0 0" }}>
                {new Date(c.created_at).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
