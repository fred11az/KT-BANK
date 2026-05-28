"use client";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Wallet, ArrowLeftRight, CreditCard, PiggyBank,
  Heart, FileText, User, LogOut, Bell, Send, RefreshCw, Banknote,
  Eye, EyeOff, TrendingUp, TrendingDown, Menu, X, ChevronRight,
  Shield, Calculator, Copy, Check, Wifi
} from "lucide-react";

type KtCard = { id: string; last4: string; expiry_month: number; expiry_year: number; type: string; status: string };
type Account = { id: string; iban: string; bic: string; type: string; currency: string; balance: number; status: string; kt_cards: KtCard[] };
type Transaction = { id: string; type: string; amount: number; currency: string; description: string; counterpart_name: string; created_at: string };
type Profile = {
  id: string; prenom: string; nom: string; email: string; telephone: string;
  pays_residence: string; nationalite: string; situation_professionnelle: string;
  revenu_mensuel: string; kyc_status: string; status: string; created_at: string;
};

const NAV = [
  { icon: LayoutDashboard, label: "Tableau de bord", id: "dashboard" },
  { icon: Wallet, label: "Comptes", id: "accounts" },
  { icon: ArrowLeftRight, label: "Virements", id: "transfers" },
  { icon: CreditCard, label: "Cartes", id: "cards" },
  { icon: PiggyBank, label: "Épargne", id: "savings" },
  { icon: Heart, label: "Don / Zakat", id: "zakat" },
  { icon: FileText, label: "Documents", id: "docs" },
  { icon: User, label: "Profil", id: "profile" },
];

function initials(prenom: string, nom: string) {
  return `${prenom?.[0] ?? ""}${nom?.[0] ?? ""}`.toUpperCase();
}

function formatIban(iban: string) {
  return iban.replace(/(.{4})/g, "$1 ").trim();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function TxIcon({ type }: { type: string }) {
  const isIn = type === "credit";
  return (
    <div style={{ width: 40, height: 40, borderRadius: 12, background: isIn ? "#F0FDF4" : "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {isIn
        ? <TrendingUp size={18} color="#16A34A" />
        : <TrendingDown size={18} color="#DC2626" />}
    </div>
  );
}

function SkeletonRow() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px" }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: "#F1F5F9" }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: 13, width: "60%", background: "#F1F5F9", borderRadius: 6, marginBottom: 6 }} />
        <div style={{ height: 11, width: "35%", background: "#F1F5F9", borderRadius: 6 }} />
      </div>
      <div style={{ height: 13, width: 64, background: "#F1F5F9", borderRadius: 6 }} />
    </div>
  );
}

export default function ClientDashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ibanCopied, setIbanCopied] = useState(false);

  useEffect(() => {
    const t = sessionStorage.getItem("kt_token");
    if (!t) { window.location.href = "/client/login"; return; }
    setToken(t);
    fetch("/api/kt/client/me", { headers: { Authorization: `Bearer ${t}` } })
      .then((r) => {
        if (r.status === 401) { window.location.href = "/client/login"; return null; }
        return r.json();
      })
      .then((d) => {
        if (!d) return;
        setProfile(d.profile);
        setAccounts(d.accounts ?? []);
        setTransactions(d.transactions ?? []);
        setLoading(false);
      });
  }, []);

  function logout() {
    sessionStorage.removeItem("kt_token");
    sessionStorage.removeItem("kt_email");
    window.location.href = "/client/login";
  }

  function copyIban(iban: string) {
    navigator.clipboard.writeText(iban).then(() => {
      setIbanCopied(true);
      setTimeout(() => setIbanCopied(false), 2000);
    });
  }

  const mainAccount = accounts[0] ?? null;
  const mainCard = mainAccount?.kt_cards?.[0] ?? null;
  const balance = Number(mainAccount?.balance ?? 0);
  const zakatDue = (balance * 0.025).toFixed(2);

  const thisMonth = transactions.filter((tx) => {
    const d = new Date(tx.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const inflows = thisMonth.filter((t) => t.type === "credit").reduce((s, t) => s + Number(t.amount), 0);
  const outflows = thisMonth.filter((t) => t.type === "debit").reduce((s, t) => s + Number(t.amount), 0);

  if (!token) return null;

  function Sidebar({ mobile = false }: { mobile?: boolean }) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", width: mobile ? "100%" : 248, background: "linear-gradient(180deg,#002010 0%,#003D1F 60%,#005F2D 100%)", flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ padding: "24px 20px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg,#C9A84C,#E6C97A)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.85rem", color: "#002010", flexShrink: 0 }}>KT</div>
            <div>
              <p style={{ color: "white", fontWeight: 800, fontSize: "0.95rem", margin: 0 }}>KT Bank AG</p>
              <p style={{ color: "rgba(201,168,76,0.65)", fontSize: "0.72rem", margin: 0 }}>Espace Client</p>
            </div>
          </div>
        </div>

        {/* Client info */}
        {!loading && profile && (
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 42, height: 42, borderRadius: 14, background: "rgba(201,168,76,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.9rem", color: "#C9A84C", flexShrink: 0 }}>
                {initials(profile.prenom, profile.nom)}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ color: "white", fontWeight: 600, fontSize: "0.88rem", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {profile.prenom} {profile.nom}
                </p>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.73rem", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profile.email}</p>
              </div>
            </div>
            <div style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.07)", borderRadius: 20, padding: "3px 10px" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: profile.status === "active" ? "#4ADE80" : "#FCA5A5" }} />
              <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.7rem" }}>
                {profile.status === "active" ? "Compte actif" : profile.status}
              </span>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
          {NAV.map(({ icon: Icon, label, id }) => (
            <button key={id} onClick={() => { setActiveNav(id); if (mobile) setSidebarOpen(false); }}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: "none", background: activeNav === id ? "rgba(201,168,76,0.13)" : "transparent", color: activeNav === id ? "#C9A84C" : "rgba(255,255,255,0.55)", fontSize: "0.85rem", fontWeight: activeNav === id ? 600 : 400, cursor: "pointer", textAlign: "left", transition: "all 0.15s", borderLeft: `3px solid ${activeNav === id ? "#C9A84C" : "transparent"}`, marginBottom: 2 }}>
              <Icon size={16} />
              {label}
              {activeNav === id && <ChevronRight size={13} style={{ marginLeft: "auto" }} />}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button onClick={logout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: "none", background: "transparent", color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", cursor: "pointer" }}>
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#F5F7FA", fontFamily: "inherit" }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex" style={{ flexShrink: 0 }}>
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50 }} className="lg:hidden">
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} onClick={() => setSidebarOpen(false)} />
          <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: 248, zIndex: 10 }}>
            <Sidebar mobile />
          </div>
          <button onClick={() => setSidebarOpen(false)} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "white", zIndex: 20, cursor: "pointer" }}>
            <X size={24} />
          </button>
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Topbar */}
        <header style={{ background: "white", borderBottom: "1px solid #E9EEF4", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)} style={{ background: "#F5F7FA", border: "none", borderRadius: 10, padding: 8, cursor: "pointer" }}>
              <Menu size={20} color="#005F2D" />
            </button>
            {!loading && profile && (
              <div>
                <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.95rem", margin: 0 }}>
                  Bonjour, {profile.prenom} 👋
                </p>
                <p style={{ color: "#94A3B8", fontSize: "0.75rem", margin: 0 }}>
                  {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button style={{ position: "relative", background: "#F5F7FA", border: "none", borderRadius: 10, padding: 8, cursor: "pointer" }}>
              <Bell size={18} color="#64748B" />
              <span style={{ position: "absolute", top: 6, right: 6, width: 7, height: 7, borderRadius: "50%", background: "#EF4444", border: "2px solid white" }} />
            </button>
            {profile && (
              <div style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg,#003D1F,#005F2D)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: "0.8rem" }}>
                {initials(profile.prenom, profile.nom)}
              </div>
            )}
          </div>
        </header>

        {/* Scrollable content */}
        <main style={{ flex: 1, overflowY: "auto", padding: "24px 24px 32px" }}>

          {/* ── Row 1 : Balance + Card ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 20, marginBottom: 20 }} className="grid-balance">

            {/* Main balance card */}
            <div style={{ background: "linear-gradient(135deg,#002A14 0%,#004D23 45%,#006B32 100%)", borderRadius: 20, padding: "28px 32px", position: "relative", overflow: "hidden", boxShadow: "0 12px 40px rgba(0,95,45,0.3)" }}>
              <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", border: "40px solid rgba(201,168,76,0.07)" }} />
              <div style={{ position: "absolute", bottom: -20, left: 120, width: 100, height: 100, borderRadius: "50%", border: "24px solid rgba(255,255,255,0.04)" }} />
              <div style={{ position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div>
                    <p style={{ color: "rgba(201,168,76,0.75)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 4px" }}>
                      GiroKonto Principal
                    </p>
                    {mainAccount && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.78rem", margin: 0, fontFamily: "monospace" }}>
                          {formatIban(mainAccount.iban)}
                        </p>
                        <button onClick={() => copyIban(mainAccount.iban)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", padding: 0, display: "flex" }}>
                          {ibanCopied ? <Check size={13} color="#4ADE80" /> : <Copy size={13} />}
                        </button>
                      </div>
                    )}
                  </div>
                  <button onClick={() => setBalanceVisible(!balanceVisible)} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer", color: "rgba(255,255,255,0.6)", display: "flex" }}>
                    {balanceVisible ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                </div>

                <div style={{ marginBottom: 28 }}>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", margin: "0 0 6px" }}>Solde disponible</p>
                  <p style={{ color: "white", fontWeight: 800, fontSize: "2.6rem", margin: 0, letterSpacing: "-0.02em", lineHeight: 1 }}>
                    {balanceVisible
                      ? `${balance.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`
                      : "•••••• €"}
                  </p>
                  {inflows > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 8 }}>
                      <TrendingUp size={13} color="#86EFAC" />
                      <span style={{ color: "#86EFAC", fontSize: "0.78rem" }}>
                        +{inflows.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} € ce mois
                      </span>
                    </div>
                  )}
                </div>

                {/* Quick actions */}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {[
                    { icon: <Send size={15} />, label: "Virement" },
                    { icon: <RefreshCw size={15} />, label: "Recharge" },
                    { icon: <Banknote size={15} />, label: "Payer" },
                    { icon: <ArrowLeftRight size={15} />, label: "Historique" },
                  ].map((a) => (
                    <button key={a.label} style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 14px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, color: "white", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", backdropFilter: "blur(8px)" }}>
                      {a.icon} {a.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment card visual */}
            {mainCard && (
              <div style={{ width: 220, background: "linear-gradient(135deg,#1A1A2E 0%,#16213E 50%,#0F3460 100%)", borderRadius: 18, padding: "20px 20px", boxShadow: "0 8px 32px rgba(0,0,0,0.25)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 130 }}>
                <div style={{ position: "absolute", top: -20, right: -20, width: 90, height: 90, borderRadius: "50%", background: "rgba(201,168,76,0.08)" }} />
                <div style={{ position: "absolute", bottom: 10, left: -20, width: 70, height: 70, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
                <div style={{ position: "relative" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ width: 30, height: 22, borderRadius: 4, background: "linear-gradient(135deg,#C9A84C,#E6C97A)" }} />
                    <Wifi size={16} color="rgba(255,255,255,0.4)" />
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.65rem", margin: "0 0 3px", letterSpacing: "0.04em", textTransform: "uppercase" }}>Numéro de carte</p>
                  <p style={{ color: "white", fontFamily: "monospace", fontSize: "0.9rem", fontWeight: 600, margin: "0 0 14px", letterSpacing: "0.12em" }}>
                    •••• •••• •••• {mainCard.last4}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div>
                      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.6rem", margin: "0 0 2px", textTransform: "uppercase" }}>Expire</p>
                      <p style={{ color: "white", fontSize: "0.8rem", fontWeight: 600, margin: 0, fontFamily: "monospace" }}>
                        {String(mainCard.expiry_month).padStart(2, "0")}/{String(mainCard.expiry_year).slice(-2)}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ color: "rgba(201,168,76,0.8)", fontSize: "0.65rem", fontWeight: 700, margin: 0, letterSpacing: "0.06em" }}>KT BANK</p>
                      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.6rem", margin: 0, textTransform: "capitalize" }}>{mainCard.type}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Row 2 : Account info strip ── */}
          {mainAccount && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
              {[
                { label: "IBAN", value: mainAccount.iban.slice(-8), prefix: "…" },
                { label: "BIC", value: mainAccount.bic || "KTAGDEFF", prefix: "" },
                { label: "Devise", value: mainAccount.currency, prefix: "" },
                { label: "Statut du compte", value: mainAccount.status === "active" ? "Actif" : mainAccount.status, prefix: "", color: "#16A34A" },
              ].map((item) => (
                <div key={item.label} style={{ background: "white", borderRadius: 14, padding: "14px 18px", border: "1px solid #E9EEF4" }}>
                  <p style={{ color: "#94A3B8", fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px" }}>{item.label}</p>
                  <p style={{ color: item.color ?? "#0F172A", fontWeight: 700, fontSize: "0.9rem", margin: 0, fontFamily: item.label === "IBAN" || item.label === "BIC" ? "monospace" : "inherit" }}>
                    {item.prefix}{item.value}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* ── Row 3 : Transactions + Widgets ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "start" }}>

            {/* Transactions */}
            <div style={{ background: "white", borderRadius: 18, border: "1px solid #E9EEF4", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderBottom: "1px solid #F1F5F9" }}>
                <div>
                  <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.95rem", margin: 0 }}>Transactions récentes</p>
                  <p style={{ color: "#94A3B8", fontSize: "0.75rem", margin: "2px 0 0" }}>
                    {transactions.length > 0 ? `${transactions.length} opération${transactions.length > 1 ? "s" : ""}` : "Aucune opération"}
                  </p>
                </div>
                <button style={{ display: "flex", alignItems: "center", gap: 5, background: "#F0FDF4", border: "none", borderRadius: 8, padding: "6px 12px", color: "#005F2D", fontWeight: 600, fontSize: "0.78rem", cursor: "pointer" }}>
                  Voir tout <ChevronRight size={13} />
                </button>
              </div>

              {loading ? (
                <div>{[1, 2, 3, 4, 5].map((i) => <SkeletonRow key={i} />)}</div>
              ) : transactions.length === 0 ? (
                <div style={{ padding: "48px 20px", textAlign: "center" }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <ArrowLeftRight size={22} color="#CBD5E1" />
                  </div>
                  <p style={{ color: "#94A3B8", fontWeight: 500, fontSize: "0.9rem", margin: "0 0 4px" }}>Aucune transaction</p>
                  <p style={{ color: "#CBD5E1", fontSize: "0.8rem", margin: 0 }}>Vos opérations apparaîtront ici</p>
                </div>
              ) : (
                <div>
                  {transactions.map((tx) => (
                    <div key={tx.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderBottom: "1px solid #F8FAFC", transition: "background 0.1s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFBFC")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <TxIcon type={tx.type} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ color: "#0F172A", fontWeight: 500, fontSize: "0.88rem", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {tx.description || tx.counterpart_name || "Opération"}
                        </p>
                        <p style={{ color: "#94A3B8", fontSize: "0.75rem", margin: "3px 0 0" }}>
                          {formatDate(tx.created_at)} · {formatTime(tx.created_at)}
                        </p>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: "0.9rem", flexShrink: 0, color: tx.type === "credit" ? "#16A34A" : "#DC2626" }}>
                        {tx.type === "credit" ? "+" : "−"}{Math.abs(Number(tx.amount)).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} {tx.currency ?? "€"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Monthly stats */}
              <div style={{ background: "white", borderRadius: 18, border: "1px solid #E9EEF4", padding: "18px 20px" }}>
                <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.88rem", margin: "0 0 16px" }}>Ce mois</p>
                {[
                  { label: "Entrées", amount: inflows, color: "#16A34A", bg: "#F0FDF4", pct: inflows > 0 ? 100 : 0 },
                  { label: "Sorties", amount: outflows, color: "#DC2626", bg: "#FEF2F2", pct: inflows > 0 ? Math.min((outflows / inflows) * 100, 100) : 0 },
                ].map((s) => (
                  <div key={s.label} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ color: "#64748B", fontSize: "0.78rem" }}>{s.label}</span>
                      <span style={{ color: s.color, fontWeight: 700, fontSize: "0.82rem" }}>
                        {s.amount > 0 ? `${s.label === "Sorties" ? "−" : "+"}${s.amount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €` : "—"}
                      </span>
                    </div>
                    <div style={{ height: 5, borderRadius: 99, background: "#F1F5F9", overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 99, background: s.color, width: `${s.pct}%`, transition: "width 0.6s ease" }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Zakat calculator */}
              <div style={{ background: "white", borderRadius: 18, border: "1px solid #E9EEF4", padding: "18px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: "#FFF8E6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Calculator size={16} color="#C9A84C" />
                  </div>
                  <div>
                    <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.85rem", margin: 0 }}>Calculateur Zakat</p>
                    <p style={{ color: "#94A3B8", fontSize: "0.7rem", margin: 0 }}>2.5% de l&apos;épargne</p>
                  </div>
                </div>
                <div style={{ background: "#FFFBF0", borderRadius: 10, padding: "12px 14px", marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ color: "#64748B", fontSize: "0.78rem" }}>Solde de référence</span>
                    <span style={{ color: "#0F172A", fontWeight: 600, fontSize: "0.82rem" }}>{balance.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#C9A84C", fontWeight: 600, fontSize: "0.82rem" }}>Zakat due</span>
                    <span style={{ color: "#C9A84C", fontWeight: 800, fontSize: "1.05rem" }}>{parseFloat(zakatDue).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</span>
                  </div>
                </div>
                <button style={{ width: "100%", height: 38, background: "linear-gradient(135deg,#C9A84C,#E6C97A)", border: "none", borderRadius: 10, color: "#002010", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}>
                  Payer ma Zakat
                </button>
              </div>

              {/* Islamic certification */}
              <div style={{ background: "linear-gradient(135deg,#F0FDF4,#DCFCE7)", borderRadius: 18, border: "1px solid #BBF7D0", padding: "18px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <Shield size={16} color="#005F2D" />
                  <p style={{ color: "#005F2D", fontWeight: 700, fontSize: "0.85rem", margin: 0 }}>Finance Islamique</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {["Sans riba (intérêts)", "Mourabaha certifié", "Conseil islamique actif"].map((item) => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#005F2D", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Check size={9} color="white" />
                      </div>
                      <span style={{ color: "#166534", fontSize: "0.78rem" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* KYC status */}
              {profile && (
                <div style={{ background: "white", borderRadius: 18, border: "1px solid #E9EEF4", padding: "18px 20px" }}>
                  <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.85rem", margin: "0 0 12px" }}>Vérification KYC</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#64748B", fontSize: "0.8rem" }}>Statut</span>
                    <span style={{
                      fontSize: "0.75rem", fontWeight: 600, padding: "4px 10px", borderRadius: 20,
                      background: profile.kyc_status === "verified" ? "#F0FDF4" : "#FFFBF0",
                      color: profile.kyc_status === "verified" ? "#16A34A" : "#D97706",
                    }}>
                      {profile.kyc_status === "verified" ? "Vérifié" : profile.kyc_status === "pending" ? "En cours" : "À compléter"}
                    </span>
                  </div>
                  {profile.kyc_status !== "verified" && (
                    <button style={{ width: "100%", marginTop: 10, height: 36, background: "#005F2D", border: "none", borderRadius: 8, color: "white", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer" }}>
                      Compléter la vérification
                    </button>
                  )}
                </div>
              )}

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
