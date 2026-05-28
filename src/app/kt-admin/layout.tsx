"use client";
import { useState, useEffect, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Inbox, LayoutDashboard, LogOut, Lock, Settings } from "lucide-react";

const AdminCtx = createContext<{ token: string; logout: () => void }>({ token: "", logout: () => {} });
export const useAdmin = () => useContext(AdminCtx);

function LoginScreen({ onLogin }: { onLogin: (t: string) => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function tryLogin() {
    if (!pw) return;
    setLoading(true); setErr("");
    const res = await fetch("/api/kt/admin/clients", {
      headers: { Authorization: `Bearer ${pw}` },
    });
    setLoading(false);
    if (res.status === 401) { setErr("Mot de passe incorrect"); return; }
    sessionStorage.setItem("kt_admin_token", pw);
    onLogin(pw);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0F1117", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 380, background: "#1A1D27", borderRadius: 16, padding: 36, border: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#005F2D", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Lock size={16} color="white" />
          </div>
          <div>
            <p style={{ color: "white", fontWeight: 700, fontSize: "0.95rem", margin: 0 }}>KT Bank Admin</p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", margin: 0 }}>Espace de gestion</p>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="password" placeholder="Mot de passe admin"
            value={pw} onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && tryLogin()}
            style={{ height: 48, background: "#252836", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "white", fontSize: "0.95rem", padding: "0 16px", outline: "none", boxSizing: "border-box", width: "100%" }}
          />
          {err && <p style={{ color: "#FF6B6B", fontSize: "0.82rem", margin: 0 }}>{err}</p>}
          <button onClick={tryLogin} disabled={loading}
            style={{ height: 48, background: "#005F2D", color: "white", fontWeight: 700, fontSize: "0.95rem", border: "none", borderRadius: 10, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Connexion…" : "Accéder"}
          </button>
        </div>
      </div>
    </div>
  );
}

const NAV = [
  { href: "/kt-admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/kt-admin/clients", label: "Clients", icon: Users },
  { href: "/kt-admin/inbox", label: "Messagerie", icon: Inbox },
  { href: "/kt-admin/settings", label: "Paramètres", icon: Settings },
];

function Sidebar({ logout }: { logout: () => void }) {
  const path = usePathname();
  return (
    <aside style={{ width: 220, background: "#1A1D27", borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", padding: "24px 12px", flexShrink: 0, minHeight: "100vh" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 8px", marginBottom: 28 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: "#005F2D", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "white", fontWeight: 900, fontSize: 11 }}>KT</span>
        </div>
        <div>
          <p style={{ color: "white", fontWeight: 700, fontSize: "0.85rem", margin: 0 }}>KT Bank</p>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.7rem", margin: 0 }}>Admin</p>
        </div>
      </div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = path === href || (href !== "/kt-admin" && path.startsWith(href));
          return (
            <Link key={href} href={href} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10,
              background: active ? "rgba(0,95,45,0.2)" : "transparent",
              color: active ? "#4CAF82" : "rgba(255,255,255,0.55)",
              textDecoration: "none", fontSize: "0.88rem", fontWeight: active ? 600 : 400,
            }}>
              <Icon size={16} /> {label}
            </Link>
          );
        })}
      </nav>
      <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer", fontSize: "0.85rem", borderRadius: 10 }}>
        <LogOut size={16} /> Déconnexion
      </button>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("kt_admin_token");
    setToken(stored);
    setChecked(true);
  }, []);

  function logout() { sessionStorage.removeItem("kt_admin_token"); setToken(null); }

  if (!checked) return null;
  if (!token) return <LoginScreen onLogin={setToken} />;

  return (
    <AdminCtx.Provider value={{ token, logout }}>
      <div style={{ display: "flex", minHeight: "100vh", background: "#0F1117" }}>
        <Sidebar logout={logout} />
        <main style={{ flex: 1, overflow: "auto" }}>{children}</main>
      </div>
    </AdminCtx.Provider>
  );
}
