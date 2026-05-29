"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAdmin } from "../layout";
import { Search, ChevronRight } from "lucide-react";

type Client = { id: string; email: string; prenom: string; nom: string; telephone: string; pays_residence: string; situation_professionnelle: string; status: string; kyc_status: string; registration_step: number; created_at: string };

const STATUS_LABEL: Record<string, string> = { active: "Actif", suspended: "Suspendu", pending: "En attente" };
const STATUS_COLOR: Record<string, string> = { active: "#22C55E", suspended: "#EF4444", pending: "#F59E0B" };

export default function ClientsPage() {
  const { token } = useAdmin();
  const [clients, setClients] = useState<Client[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    function check() { setIsMobile(window.innerWidth < 768); }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  function load(search = "") {
    setLoading(true);
    fetch(`/api/kt/admin/clients?q=${encodeURIComponent(search)}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { setClients(d.clients ?? []); setLoading(false); });
  }

  useEffect(() => { load(); }, []);

  return (
    <div style={{ padding: isMobile ? "20px 16px" : 32 }}>
      <h1 style={{ color: "white", fontWeight: 800, fontSize: "1.5rem", marginBottom: 6 }}>Clients</h1>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.88rem", marginBottom: 24 }}>{clients.length} client{clients.length !== 1 ? "s" : ""} enregistré{clients.length !== 1 ? "s" : ""}</p>

      <div style={{ position: "relative", marginBottom: 20 }}>
        <Search size={16} color="rgba(255,255,255,0.35)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
        <input
          placeholder="Nom, e-mail…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load(q)}
          style={{ width: "100%", height: 44, background: "#1A1D27", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "white", fontSize: "0.9rem", paddingLeft: 40, paddingRight: 16, outline: "none", boxSizing: "border-box" }}
        />
      </div>

      {isMobile ? (
        /* Mobile card list */
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {loading ? (
            <div style={{ padding: 32, color: "rgba(255,255,255,0.3)", textAlign: "center", fontSize: "0.9rem" }}>Chargement…</div>
          ) : clients.length === 0 ? (
            <div style={{ padding: 32, color: "rgba(255,255,255,0.3)", textAlign: "center", fontSize: "0.9rem" }}>Aucun client trouvé</div>
          ) : clients.map((c) => (
            <Link key={c.id} href={`/kt-admin/clients/${c.id}`} style={{ textDecoration: "none", display: "block" }}>
              <div style={{ background: "#1A1D27", borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)", padding: "14px 16px", display: "flex", alignItems: "center", gap: 14 }}>
                {/* Avatar */}
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(0,95,45,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ color: "#4CAF82", fontWeight: 800, fontSize: "1rem" }}>
                    {(c.prenom?.[0] ?? c.email[0] ?? "?").toUpperCase()}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: "white", fontWeight: 700, fontSize: "0.92rem", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {c.prenom || "—"} {c.nom || ""}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem", margin: "2px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {c.email}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: "0.7rem", fontWeight: 700, background: `${STATUS_COLOR[c.status] ?? "#888"}22`, color: STATUS_COLOR[c.status] ?? "#888" }}>
                    {STATUS_LABEL[c.status] ?? c.status}
                  </span>
                  <ChevronRight size={16} color="rgba(255,255,255,0.3)" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* Desktop table */
        <div style={{ background: "#1A1D27", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                {["Client", "E-mail", "Téléphone", "Pays", "Situation pro", "Statut", "Inscription", ""].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", color: "rgba(255,255,255,0.35)", fontSize: "0.75rem", fontWeight: 600, textAlign: "left", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ padding: 32, color: "rgba(255,255,255,0.3)", textAlign: "center", fontSize: "0.9rem" }}>Chargement…</td></tr>
              ) : clients.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: 32, color: "rgba(255,255,255,0.3)", textAlign: "center", fontSize: "0.9rem" }}>Aucun client trouvé</td></tr>
              ) : clients.map((c) => (
                <tr key={c.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "14px 16px" }}>
                    <p style={{ color: "white", fontWeight: 600, fontSize: "0.88rem", margin: 0 }}>{c.prenom || "—"} {c.nom || ""}</p>
                  </td>
                  <td style={{ padding: "14px 16px", color: "rgba(255,255,255,0.55)", fontSize: "0.85rem" }}>{c.email}</td>
                  <td style={{ padding: "14px 16px", color: "rgba(255,255,255,0.55)", fontSize: "0.85rem" }}>{c.telephone || "—"}</td>
                  <td style={{ padding: "14px 16px", color: "rgba(255,255,255,0.55)", fontSize: "0.85rem" }}>{c.pays_residence || "—"}</td>
                  <td style={{ padding: "14px 16px", color: "rgba(255,255,255,0.55)", fontSize: "0.85rem" }}>{c.situation_professionnelle || "—"}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: "0.72rem", fontWeight: 600, background: `${STATUS_COLOR[c.status] ?? "#888"}22`, color: STATUS_COLOR[c.status] ?? "#888" }}>
                      {STATUS_LABEL[c.status] ?? c.status}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", color: "rgba(255,255,255,0.35)", fontSize: "0.8rem" }}>
                    {new Date(c.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <Link href={`/kt-admin/clients/${c.id}`} style={{ color: "#4CAF82", fontSize: "0.82rem", textDecoration: "none", fontWeight: 600 }}>Voir →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
