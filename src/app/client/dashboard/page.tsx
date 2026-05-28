"use client";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Wallet, ArrowLeftRight, CreditCard, PiggyBank,
  Heart, FileText, User, LogOut, Bell, Send, RefreshCw, Banknote,
  Eye, EyeOff, TrendingUp, TrendingDown, Menu, X, ChevronRight,
  Shield, Calculator, Check, Wifi, Info, Phone, Mail, MapPin,
  Lock, Plus, AlertCircle, Building2, Clock
} from "lucide-react";

/* ── Types ── */
type KtCard = { id: string; last4: string; expiry_month: number; expiry_year: number; type: string; status: string };
type Account = { id: string; iban: string; bic: string; type: string; currency: string; balance: number; status: string; opened_at: string; created_at: string; kt_cards: KtCard[] };
type Transaction = { id: string; type: string; amount: number; currency: string; description: string; counterpart_name: string; created_at: string };
type Profile = {
  id: string; prenom: string; nom: string; email: string; telephone: string;
  pays_residence: string; nationalite: string; adresse: string; ville: string;
  code_postal: string; situation_professionnelle: string; revenu_mensuel: string;
  kyc_status: string; status: string; created_at: string;
};

/* ── Helpers ── */
function initials(p: string, n: string) { return `${p?.[0] ?? ""}${n?.[0] ?? ""}`.toUpperCase(); }
function fmtDate(iso: string) { return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }); }
function fmtTime(iso: string) { return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }); }
function fmtIbanMasked(iban: string) {
  // Show only first 4 and last 4, mask the rest
  const clean = iban.replace(/\s/g, "");
  return `${clean.slice(0, 4)} •••• •••• •••• ${clean.slice(-4)}`;
}

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

/* ── Sub-components ── */
function TxIcon({ type }: { type: string }) {
  const isIn = type === "credit";
  return (
    <div style={{ width: 40, height: 40, borderRadius: 12, background: isIn ? "#F0FDF4" : "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {isIn ? <TrendingUp size={18} color="#16A34A" /> : <TrendingDown size={18} color="#DC2626" />}
    </div>
  );
}

function Skeleton() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px" }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: "#F1F5F9" }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: 12, width: "60%", background: "#F1F5F9", borderRadius: 6, marginBottom: 6 }} />
        <div style={{ height: 10, width: "35%", background: "#F1F5F9", borderRadius: 6 }} />
      </div>
      <div style={{ height: 12, width: 60, background: "#F1F5F9", borderRadius: 6 }} />
    </div>
  );
}

/* ── Card visual component ── */
function BankCard({ card, holderName, balance }: { card: KtCard; holderName: string; balance: number }) {
  const isPremium = card.type === "credit" || balance > 10000;
  return (
    <div style={{
      width: "100%", maxWidth: 380, aspectRatio: "1.586",
      background: isPremium
        ? "linear-gradient(135deg,#1A1028 0%,#2D1B69 40%,#0F3460 100%)"
        : "linear-gradient(135deg,#0D1B2A 0%,#1B2A4A 40%,#162340 100%)",
      borderRadius: 18, padding: "5% 7%", position: "relative", overflow: "hidden",
      boxShadow: "0 20px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.05)",
      display: "flex", flexDirection: "column", justifyContent: "space-between",
    }}>
      {/* Background circles */}
      <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "55%", aspectRatio: "1", borderRadius: "50%", background: isPremium ? "rgba(201,168,76,0.1)" : "rgba(0,95,45,0.15)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-15%", left: "5%", width: "40%", aspectRatio: "1", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
        <div style={{ width: "13%", aspectRatio: "1.4", borderRadius: 4, background: "linear-gradient(135deg,#C9A84C,#E6C97A)", boxShadow: "0 2px 8px rgba(201,168,76,0.4)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "3%" }}>
          <Wifi size={18} color="rgba(255,255,255,0.4)" />
          <span style={{ color: isPremium ? "#C9A84C" : "rgba(255,255,255,0.7)", fontWeight: 800, fontSize: "clamp(0.65rem,2vw,0.85rem)", letterSpacing: "0.06em" }}>
            KT BANK
          </span>
        </div>
      </div>

      {/* Card number */}
      <div>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "clamp(0.55rem,1.5vw,0.68rem)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>
          Numéro de carte
        </p>
        <p style={{ color: "white", fontFamily: "monospace", fontSize: "clamp(0.85rem,2.5vw,1.1rem)", fontWeight: 600, letterSpacing: "0.18em", margin: 0 }}>
          •••• •••• •••• {card.last4}
        </p>
      </div>

      {/* Bottom row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "clamp(0.5rem,1.2vw,0.6rem)", textTransform: "uppercase", margin: "0 0 2px", letterSpacing: "0.06em" }}>Titulaire</p>
          <p style={{ color: "white", fontWeight: 700, fontSize: "clamp(0.72rem,2vw,0.88rem)", margin: 0, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            {holderName}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "clamp(0.5rem,1.2vw,0.6rem)", textTransform: "uppercase", margin: "0 0 2px", letterSpacing: "0.06em" }}>Expire</p>
          <p style={{ color: "white", fontWeight: 700, fontSize: "clamp(0.72rem,2vw,0.88rem)", fontFamily: "monospace", margin: 0 }}>
            {String(card.expiry_month).padStart(2, "0")}/{String(card.expiry_year).slice(-2)}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ color: isPremium ? "#C9A84C" : "rgba(255,255,255,0.5)", fontWeight: 700, fontSize: "clamp(0.6rem,1.5vw,0.75rem)", letterSpacing: "0.04em", margin: 0, textTransform: "capitalize" }}>
            {card.type === "debit" ? "Débit" : "Crédit"}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Section wrappers ── */
function Panel({ title, subtitle, children, action }: { title: string; subtitle?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div style={{ background: "white", borderRadius: 18, border: "1px solid #E9EEF4", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid #F1F5F9" }}>
        <div>
          <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.92rem", margin: 0 }}>{title}</p>
          {subtitle && <p style={{ color: "#94A3B8", fontSize: "0.75rem", margin: "2px 0 0" }}>{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 22px", borderBottom: "1px solid #F8FAFC" }}>
      <span style={{ color: "#64748B", fontSize: "0.82rem" }}>{label}</span>
      <span style={{ color: "#0F172A", fontWeight: 500, fontSize: "0.85rem", fontFamily: mono ? "monospace" : "inherit" }}>{value}</span>
    </div>
  );
}

/* ── MAIN COMPONENT ── */
export default function ClientDashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // IBAN modal
  const [showIbanModal, setShowIbanModal] = useState(false);
  // Card request modal
  const [showCardRequest, setShowCardRequest] = useState(false);
  const [cardTier, setCardTier] = useState<"standard" | "premium">("standard");
  const [cardRequested, setCardRequested] = useState(false);
  // Transfer state
  const [transfer, setTransfer] = useState({ to: "", iban: "", amount: "", ref: "" });
  const [transferSent, setTransferSent] = useState(false);

  useEffect(() => {
    const t = sessionStorage.getItem("kt_token");
    if (!t) { window.location.href = "/client/login"; return; }
    setToken(t);
    fetch("/api/kt/client/me", { headers: { Authorization: `Bearer ${t}` } })
      .then((r) => { if (r.status === 401) { window.location.href = "/client/login"; return null; } return r.json(); })
      .then((d) => { if (!d) return; setProfile(d.profile); setAccounts(d.accounts ?? []); setTransactions(d.transactions ?? []); setLoading(false); });
  }, []);

  function logout() { sessionStorage.removeItem("kt_token"); sessionStorage.removeItem("kt_email"); window.location.href = "/client/login"; }

  if (!token) return null;

  const mainAccount = accounts[0] ?? null;
  const mainCard = mainAccount?.kt_cards?.[0] ?? null;
  const balance = Number(mainAccount?.balance ?? 0);
  const zakatDue = balance * 0.025;

  const now = new Date();
  const thisMonth = transactions.filter((tx) => { const d = new Date(tx.created_at); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
  const inflows = thisMonth.filter((t) => t.type === "credit").reduce((s, t) => s + Number(t.amount), 0);
  const outflows = thisMonth.filter((t) => t.type === "debit").reduce((s, t) => s + Number(t.amount), 0);
  const holderName = profile ? `${profile.prenom} ${profile.nom}` : "";

  /* ── SIDEBAR ── */
  function Sidebar({ mobile = false }: { mobile?: boolean }) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", width: mobile ? "100%" : 248, background: "linear-gradient(180deg,#001A0D 0%,#003319 55%,#005428 100%)", flexShrink: 0 }}>
        <div style={{ padding: "22px 18px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg,#C9A84C,#E6C97A)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.85rem", color: "#001A0D", flexShrink: 0 }}>KT</div>
            <div>
              <p style={{ color: "white", fontWeight: 800, fontSize: "0.92rem", margin: 0 }}>KT Bank AG</p>
              <p style={{ color: "rgba(201,168,76,0.6)", fontSize: "0.7rem", margin: 0 }}>Espace Client</p>
            </div>
          </div>
        </div>

        {!loading && profile && (
          <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 13, background: "rgba(201,168,76,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.88rem", color: "#C9A84C", flexShrink: 0 }}>
                {initials(profile.prenom, profile.nom)}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ color: "white", fontWeight: 600, fontSize: "0.85rem", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profile.prenom} {profile.nom}</p>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profile.email}</p>
              </div>
            </div>
            <div style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.06)", borderRadius: 20, padding: "3px 9px" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80" }} />
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.68rem" }}>Compte actif</span>
            </div>
          </div>
        )}

        <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
          {NAV.map(({ icon: Icon, label, id }) => (
            <button key={id} onClick={() => { setActiveNav(id); if (mobile) setSidebarOpen(false); }}
              style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, border: "none", background: activeNav === id ? "rgba(201,168,76,0.12)" : "transparent", color: activeNav === id ? "#C9A84C" : "rgba(255,255,255,0.5)", fontSize: "0.83rem", fontWeight: activeNav === id ? 600 : 400, cursor: "pointer", textAlign: "left", transition: "all 0.12s", borderLeft: `3px solid ${activeNav === id ? "#C9A84C" : "transparent"}`, marginBottom: 2 }}>
              <Icon size={16} />
              <span style={{ flex: 1 }}>{label}</span>
              {activeNav === id && <ChevronRight size={13} />}
            </button>
          ))}
        </nav>

        <div style={{ padding: "10px 8px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button onClick={logout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, border: "none", background: "transparent", color: "rgba(255,255,255,0.35)", fontSize: "0.83rem", cursor: "pointer" }}>
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </div>
    );
  }

  /* ── PAGE SECTIONS ── */

  function DashboardHome() {
    const [balVis, setBalVis] = useState(true);
    return (
      <div style={{ padding: "24px", maxWidth: 1100 }}>
        {/* Balance hero */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20, marginBottom: 20 }}>
          <div style={{ background: "linear-gradient(135deg,#001A0D 0%,#003319 45%,#005428 100%)", borderRadius: 22, padding: "28px 32px", position: "relative", overflow: "hidden", boxShadow: "0 12px 40px rgba(0,83,40,0.3)" }}>
            <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", border: "50px solid rgba(201,168,76,0.06)", pointerEvents: "none" }} />
            <div style={{ position: "relative", display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <p style={{ color: "rgba(201,168,76,0.7)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>GiroKonto Principal</p>
                  <button onClick={() => setShowIbanModal(true)} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 6, padding: "3px 8px", cursor: "pointer", color: "rgba(255,255,255,0.45)", fontSize: "0.7rem", display: "flex", alignItems: "center", gap: 4 }}>
                    <Lock size={10} /> Voir IBAN
                  </button>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <p style={{ color: "white", fontWeight: 800, fontSize: "clamp(2rem,5vw,2.8rem)", margin: 0, letterSpacing: "-0.02em", lineHeight: 1 }}>
                    {balVis ? `${balance.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €` : "•••••• €"}
                  </p>
                  <button onClick={() => setBalVis(!balVis)} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer", color: "rgba(255,255,255,0.6)", display: "flex" }}>
                    {balVis ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                </div>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem", margin: 0 }}>Solde disponible • {mainAccount?.currency ?? "EUR"}</p>
                {inflows > 0 && <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 6 }}><TrendingUp size={13} color="#86EFAC" /><span style={{ color: "#86EFAC", fontSize: "0.75rem" }}>+{inflows.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} € ce mois</span></div>}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  { icon: <Send size={14} />, label: "Virement", nav: "transfers" },
                  { icon: <CreditCard size={14} />, label: "Carte", nav: "cards" },
                  { icon: <Banknote size={14} />, label: "Comptes", nav: "accounts" },
                  { icon: <FileText size={14} />, label: "Docs", nav: "docs" },
                ].map((a) => (
                  <button key={a.label} onClick={() => setActiveNav(a.nav)}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "white", fontSize: "0.78rem", fontWeight: 500, cursor: "pointer" }}>
                    {a.icon}{a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Entrées ce mois", value: `+${inflows.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`, color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0" },
            { label: "Sorties ce mois", value: `-${outflows.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`, color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
            { label: "Transactions", value: String(transactions.length), color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE" },
            { label: "Zakat estimée", value: `${zakatDue.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`, color: "#C9A84C", bg: "#FFFBF0", border: "#FDE68A" },
          ].map((s) => (
            <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 14, padding: "14px 16px" }}>
              <p style={{ color: "#64748B", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 5px" }}>{s.label}</p>
              <p style={{ color: s.color, fontWeight: 800, fontSize: "1.05rem", margin: 0 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Transactions + card side by side */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>
          <Panel title="Transactions récentes" subtitle={`${transactions.length} opération${transactions.length !== 1 ? "s" : ""}`}
            action={<button onClick={() => setActiveNav("accounts")} style={{ display: "flex", alignItems: "center", gap: 5, background: "#F0FDF4", border: "none", borderRadius: 8, padding: "5px 11px", color: "#005F2D", fontWeight: 600, fontSize: "0.75rem", cursor: "pointer" }}>Voir tout <ChevronRight size={12} /></button>}>
            {loading ? [1,2,3,4].map((i) => <Skeleton key={i} />) : transactions.length === 0 ? (
              <div style={{ padding: "40px 22px", textAlign: "center" }}>
                <ArrowLeftRight size={28} color="#CBD5E1" style={{ margin: "0 auto 12px" }} />
                <p style={{ color: "#94A3B8", fontSize: "0.88rem", margin: "0 0 4px" }}>Aucune transaction</p>
                <p style={{ color: "#CBD5E1", fontSize: "0.78rem", margin: 0 }}>Vos opérations apparaîtront ici</p>
              </div>
            ) : transactions.slice(0, 7).map((tx) => (
              <div key={tx.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 22px", borderBottom: "1px solid #F8FAFC" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFBFC")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <TxIcon type={tx.type} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: "#0F172A", fontWeight: 500, fontSize: "0.85rem", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {tx.description || tx.counterpart_name || "Opération"}
                  </p>
                  <p style={{ color: "#94A3B8", fontSize: "0.72rem", margin: "3px 0 0" }}>{fmtDate(tx.created_at)} · {fmtTime(tx.created_at)}</p>
                </div>
                <span style={{ fontWeight: 700, fontSize: "0.88rem", flexShrink: 0, color: tx.type === "credit" ? "#16A34A" : "#DC2626" }}>
                  {tx.type === "credit" ? "+" : "−"}{Math.abs(Number(tx.amount)).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                </span>
              </div>
            ))}
          </Panel>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Card */}
            <div style={{ background: "white", borderRadius: 18, border: "1px solid #E9EEF4", padding: 20 }}>
              <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.88rem", margin: "0 0 14px" }}>Ma carte</p>
              {mainCard ? (
                <BankCard card={mainCard} holderName={holderName} balance={balance} />
              ) : (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <CreditCard size={28} color="#CBD5E1" style={{ margin: "0 auto 8px" }} />
                  <p style={{ color: "#94A3B8", fontSize: "0.82rem", margin: 0 }}>Aucune carte active</p>
                </div>
              )}
              <button onClick={() => setActiveNav("cards")} style={{ width: "100%", marginTop: 14, height: 38, background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, color: "#005F2D", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <CreditCard size={14} /> Gérer mes cartes
              </button>
            </div>

            {/* Islamic */}
            <div style={{ background: "linear-gradient(135deg,#F0FDF4,#DCFCE7)", borderRadius: 16, border: "1px solid #BBF7D0", padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <Shield size={15} color="#005F2D" /><p style={{ color: "#005F2D", fontWeight: 700, fontSize: "0.82rem", margin: 0 }}>Finance Islamique</p>
              </div>
              {["Sans riba", "Mourabaha certifié", "Conseil islamique actif"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                  <div style={{ width: 15, height: 15, borderRadius: "50%", background: "#005F2D", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Check size={8} color="white" /></div>
                  <span style={{ color: "#166534", fontSize: "0.76rem" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function AccountsPage() {
    return (
      <div style={{ padding: 24, maxWidth: 800 }}>
        <h2 style={{ color: "#0F172A", fontWeight: 800, fontSize: "1.2rem", margin: "0 0 20px" }}>Mes Comptes</h2>
        {accounts.map((acc) => (
          <div key={acc.id} style={{ background: "white", borderRadius: 18, border: "1px solid #E9EEF4", marginBottom: 16, overflow: "hidden" }}>
            <div style={{ background: "linear-gradient(135deg,#001A0D,#003319)", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ color: "rgba(201,168,76,0.8)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px" }}>{acc.type.toUpperCase()} · {acc.currency}</p>
                <p style={{ color: "white", fontWeight: 800, fontSize: "1.8rem", margin: 0, letterSpacing: "-0.01em" }}>
                  {Number(acc.balance).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                </p>
              </div>
              <span style={{ background: acc.status === "active" ? "rgba(74,222,128,0.15)" : "rgba(252,165,165,0.15)", color: acc.status === "active" ? "#4ADE80" : "#FCA5A5", fontSize: "0.72rem", fontWeight: 700, padding: "4px 10px", borderRadius: 20 }}>
                {acc.status === "active" ? "Actif" : acc.status}
              </span>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px", borderBottom: "1px solid #F1F5F9" }}>
                <span style={{ color: "#64748B", fontSize: "0.82rem" }}>IBAN</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#0F172A", fontFamily: "monospace", fontSize: "0.85rem", fontWeight: 500 }}>{fmtIbanMasked(acc.iban)}</span>
                  <button onClick={() => setShowIbanModal(true)} style={{ background: "#F1F5F9", border: "none", borderRadius: 6, padding: "3px 8px", cursor: "pointer", color: "#64748B", fontSize: "0.7rem", display: "flex", alignItems: "center", gap: 4 }}>
                    <Lock size={10} /> Voir complet
                  </button>
                </div>
              </div>
              <InfoRow label="BIC / SWIFT" value={acc.bic || "KTAGDEFF"} mono />
              <InfoRow label="Devise" value={acc.currency} />
              <InfoRow label="Ouvert le" value={fmtDate(acc.opened_at ?? acc.created_at)} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  function TransfersPage() {
    const [form, setForm] = useState({ to: "", iban: "", amount: "", ref: "" });
    const [phase, setPhase] = useState<"form" | "progress" | "fee" | "done" | "error">("form");
    const [progress, setProgress] = useState(0);
    const [errorMsg, setErrorMsg] = useState("");
    const [transferId, setTransferId] = useState("");
    const [fee, setFee] = useState<{ amount: number; currency: string } | null>(null);
    const [feePayment, setFeePayment] = useState<Record<string, string>>({});
    const [feeConfirming, setFeeConfirming] = useState(false);

    async function submit() {
      if (!form.to || !form.iban || !form.amount) return;
      if (Number(form.amount) <= 0) { setErrorMsg("Montant invalide"); return; }
      if (balance <= 0 || Number(form.amount) > balance) {
        setErrorMsg(`Solde insuffisant. Votre solde disponible est de ${balance.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €.`);
        return;
      }
      setErrorMsg("");
      setPhase("progress");
      setProgress(0);

      // POST to API
      const res = await fetch("/api/kt/client/transfer", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ to_name: form.to, to_iban: form.iban, amount: Number(form.amount), reference: form.ref }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.code === "ACCOUNT_SUSPENDED") {
          setErrorMsg("Votre compte est désactivé. Veuillez contacter votre conseiller.");
        } else if (data.code === "INSUFFICIENT_FUNDS") {
          setErrorMsg(`Solde insuffisant. Solde actuel : ${Number(data.balance).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`);
        } else {
          setErrorMsg(data.error || "Erreur lors du traitement.");
        }
        setPhase("error");
        return;
      }

      setTransferId(data.transfer_id);
      setFee(data.fee);
      setFeePayment(data.fee_payment ?? {});

      // Animate progress to 68%
      let p = 0;
      const interval = setInterval(() => {
        p += 2;
        setProgress(p);
        if (p >= 68) { clearInterval(interval); setPhase("fee"); }
      }, 60);
    }

    async function confirmFee() {
      setFeeConfirming(true);
      await fetch("/api/kt/client/transfer", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ transfer_id: transferId }),
      });
      setFeeConfirming(false);
      setPhase("done");
    }

    function reset() {
      setPhase("form"); setProgress(0); setForm({ to: "", iban: "", amount: "", ref: "" });
      setErrorMsg(""); setTransferId(""); setFee(null);
    }

    if (phase === "done") return (
      <div style={{ padding: 24, maxWidth: 560 }}>
        <h2 style={{ color: "#0F172A", fontWeight: 800, fontSize: "1.2rem", margin: "0 0 20px" }}>Virement SEPA</h2>
        <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 18, padding: 32, textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#005F2D", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Check size={24} color="white" />
          </div>
          <p style={{ color: "#005F2D", fontWeight: 800, fontSize: "1.1rem", margin: "0 0 8px" }}>Virement soumis</p>
          <p style={{ color: "#166534", fontSize: "0.85rem", margin: "0 0 20px", lineHeight: 1.6 }}>
            Votre virement est en cours de traitement. Notre équipe le validera sous 24 heures ouvrables.
          </p>
          <button onClick={reset} style={{ padding: "10px 24px", background: "#005F2D", border: "none", borderRadius: 10, color: "white", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>
            Nouveau virement
          </button>
        </div>
      </div>
    );

    if (phase === "progress" || phase === "fee") return (
      <div style={{ padding: 24, maxWidth: 560 }}>
        <h2 style={{ color: "#0F172A", fontWeight: 800, fontSize: "1.2rem", margin: "0 0 20px" }}>Virement SEPA</h2>
        <div style={{ background: "white", borderRadius: 18, border: "1px solid #E9EEF4", padding: 28 }}>
          <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.92rem", margin: "0 0 6px" }}>
            {phase === "fee" ? "Action requise" : "Traitement en cours…"}
          </p>
          <p style={{ color: "#64748B", fontSize: "0.82rem", margin: "0 0 20px" }}>
            Virement de {Number(form.amount).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} € vers {form.to}
          </p>
          {/* Progress bar */}
          <div style={{ height: 8, background: "#F1F5F9", borderRadius: 99, overflow: "hidden", marginBottom: 8 }}>
            <div style={{ height: "100%", borderRadius: 99, background: phase === "fee" ? "#D97706" : "#005F2D", width: `${progress}%`, transition: "width 0.06s linear" }} />
          </div>
          <p style={{ color: phase === "fee" ? "#D97706" : "#94A3B8", fontSize: "0.75rem", margin: "0 0 24px", fontWeight: phase === "fee" ? 600 : 400 }}>
            {phase === "fee" ? "⚠ Paiement des frais requis pour continuer" : `${progress}% — Vérification en cours…`}
          </p>

          {phase === "fee" && fee && (
            <div>
              <div style={{ background: "#FFFBF0", border: "1px solid #FDE68A", borderRadius: 14, padding: "18px 20px", marginBottom: 16 }}>
                <p style={{ color: "#92400E", fontWeight: 700, fontSize: "0.88rem", margin: "0 0 12px" }}>
                  Frais de virement — {fee.amount} {fee.currency}
                </p>
                <p style={{ color: "#78350F", fontSize: "0.8rem", margin: "0 0 14px", lineHeight: 1.6 }}>
                  Pour finaliser votre virement, veuillez régler les frais de traitement en effectuant un virement vers les coordonnées suivantes :
                </p>
                <div style={{ background: "white", borderRadius: 10, padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    ["Bénéficiaire", feePayment.name],
                    ["IBAN", feePayment.iban],
                    ["BIC / SWIFT", feePayment.bic],
                    ["Banque", feePayment.bank],
                    ["Référence", feePayment.reference],
                    ["Montant", `${fee.amount} ${fee.currency}`],
                  ].filter(([, v]) => v).map(([label, value]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: "#64748B", fontSize: "0.78rem" }}>{label}</span>
                      <span style={{ color: "#0F172A", fontWeight: 600, fontSize: "0.82rem", fontFamily: label === "IBAN" || label === "BIC / SWIFT" ? "monospace" : "inherit" }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={confirmFee} disabled={feeConfirming}
                style={{ width: "100%", height: 48, background: "#005F2D", border: "none", borderRadius: 12, color: "white", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", opacity: feeConfirming ? 0.7 : 1 }}>
                {feeConfirming ? "Confirmation…" : "J'ai effectué le paiement des frais"}
              </button>
              <button onClick={reset} style={{ width: "100%", marginTop: 8, height: 40, background: "transparent", border: "1px solid #E2E8F0", borderRadius: 10, color: "#64748B", fontSize: "0.82rem", cursor: "pointer" }}>
                Annuler le virement
              </button>
            </div>
          )}
        </div>
      </div>
    );

    return (
      <div style={{ padding: 24, maxWidth: 560 }}>
        <h2 style={{ color: "#0F172A", fontWeight: 800, fontSize: "1.2rem", margin: "0 0 20px" }}>Virement SEPA</h2>
        {(phase === "error" && errorMsg) && (
          <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 12, padding: "12px 16px", marginBottom: 16, display: "flex", gap: 8, alignItems: "flex-start" }}>
            <AlertCircle size={16} color="#DC2626" style={{ marginTop: 1, flexShrink: 0 }} />
            <p style={{ color: "#991B1B", fontSize: "0.82rem", margin: 0 }}>{errorMsg}</p>
          </div>
        )}
        <div style={{ background: "white", borderRadius: 18, border: "1px solid #E9EEF4", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { label: "Nom du bénéficiaire", key: "to", placeholder: "Max Mustermann", type: "text" },
            { label: "IBAN du bénéficiaire", key: "iban", placeholder: "DE89 3704 0044 0532 0130 00", type: "text" },
            { label: "Montant (€)", key: "amount", placeholder: "0.00", type: "number" },
            { label: "Référence / Motif", key: "ref", placeholder: "Loyer Mai 2025", type: "text" },
          ].map(({ label, key, placeholder, type }) => (
            <div key={key}>
              <label style={{ color: "#64748B", fontSize: "0.75rem", fontWeight: 600, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</label>
              <input type={type} placeholder={placeholder} value={form[key as keyof typeof form]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                style={{ width: "100%", height: 46, background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, color: "#0F172A", fontSize: "0.9rem", padding: "0 14px", boxSizing: "border-box", outline: "none" }} />
            </div>
          ))}
          {balance <= 0 && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", display: "flex", gap: 8, alignItems: "flex-start" }}>
              <AlertCircle size={15} color="#DC2626" style={{ marginTop: 1, flexShrink: 0 }} />
              <p style={{ color: "#991B1B", fontSize: "0.78rem", margin: 0 }}>Votre solde est insuffisant pour effectuer un virement.</p>
            </div>
          )}
          <div style={{ background: "#FFFBF0", border: "1px solid #FDE68A", borderRadius: 10, padding: "10px 14px", display: "flex", gap: 8, alignItems: "flex-start" }}>
            <AlertCircle size={15} color="#D97706" style={{ marginTop: 1, flexShrink: 0 }} />
            <p style={{ color: "#92400E", fontSize: "0.78rem", margin: 0, lineHeight: 1.5 }}>Des frais de traitement seront demandés lors de la soumission du virement.</p>
          </div>
          <button onClick={submit} disabled={!form.to || !form.iban || !form.amount || balance <= 0}
            style={{ height: 48, background: "#005F2D", border: "none", borderRadius: 12, color: "white", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", opacity: (!form.to || !form.iban || !form.amount || balance <= 0) ? 0.5 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Send size={16} /> Envoyer le virement
          </button>
        </div>
      </div>
    );
  }

  function CardsPage() {
    return (
      <div style={{ padding: 24, maxWidth: 700 }}>
        <h2 style={{ color: "#0F172A", fontWeight: 800, fontSize: "1.2rem", margin: "0 0 20px" }}>Mes Cartes</h2>
        {accounts.flatMap((acc) => acc.kt_cards.map((card) => (
          <div key={card.id} style={{ background: "white", borderRadius: 18, border: "1px solid #E9EEF4", padding: 24, marginBottom: 16 }}>
            <div style={{ marginBottom: 20, display: "flex", justifyContent: "center" }}>
              <BankCard card={card} holderName={holderName} balance={balance} />
            </div>
            <div>
              <InfoRow label="Titulaire" value={holderName} />
              <InfoRow label="Numéro" value={`•••• •••• •••• ${card.last4}`} mono />
              <InfoRow label="Expiration" value={`${String(card.expiry_month).padStart(2, "0")}/${card.expiry_year}`} />
              <InfoRow label="Type" value={card.type === "debit" ? "Carte de débit" : "Carte de crédit"} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 22px" }}>
                <span style={{ color: "#64748B", fontSize: "0.82rem" }}>Statut</span>
                <span style={{ background: card.status === "active" ? "#F0FDF4" : "#FEF2F2", color: card.status === "active" ? "#16A34A" : "#DC2626", fontSize: "0.75rem", fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>
                  {card.status === "active" ? "Active" : card.status}
                </span>
              </div>
            </div>
          </div>
        )))}

        {/* Request new card */}
        <div style={{ background: "white", borderRadius: 18, border: "2px dashed #E2E8F0", padding: 24 }}>
          <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.92rem", margin: "0 0 6px" }}>Demander une nouvelle carte</p>
          <p style={{ color: "#64748B", fontSize: "0.82rem", margin: "0 0 16px", lineHeight: 1.6 }}>
            Choisissez votre carte selon vos besoins de transactions quotidiennes.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <button onClick={() => { setCardTier("standard"); setShowCardRequest(true); }}
              style={{ padding: "14px 16px", background: "#F8FAFC", border: "2px solid #E2E8F0", borderRadius: 12, textAlign: "left", cursor: "pointer" }}>
              <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.85rem", margin: "0 0 4px" }}>Standard</p>
              <p style={{ color: "#005F2D", fontWeight: 800, fontSize: "1rem", margin: "0 0 4px" }}>260 €</p>
              <p style={{ color: "#64748B", fontSize: "0.72rem", margin: 0 }}>Transactions jusqu&apos;à 25 000 €</p>
            </button>
            <button onClick={() => { setCardTier("premium"); setShowCardRequest(true); }}
              style={{ padding: "14px 16px", background: "#FFFBF0", border: "2px solid #FDE68A", borderRadius: 12, textAlign: "left", cursor: "pointer" }}>
              <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.85rem", margin: "0 0 4px" }}>Premium</p>
              <p style={{ color: "#C9A84C", fontWeight: 800, fontSize: "1rem", margin: "0 0 4px" }}>500 €</p>
              <p style={{ color: "#64748B", fontSize: "0.72rem", margin: 0 }}>Transactions illimitées (25 000 €+)</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  function SavingsPage() {
    return (
      <div style={{ padding: 24, maxWidth: 700 }}>
        <h2 style={{ color: "#0F172A", fontWeight: 800, fontSize: "1.2rem", margin: "0 0 20px" }}>Épargne & Investissement</h2>
        <div style={{ background: "white", borderRadius: 18, border: "1px solid #E9EEF4", padding: 32, textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <PiggyBank size={26} color="#005F2D" />
          </div>
          <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "1rem", margin: "0 0 8px" }}>Produits d&apos;épargne islamiques</p>
          <p style={{ color: "#64748B", fontSize: "0.85rem", margin: "0 0 20px", lineHeight: 1.6, maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
            Compte épargne (Wadiah), compte d&apos;investissement (Mudarabah) et dépôts à terme halal disponibles bientôt.
          </p>
          <div style={{ background: "#FFFBF0", border: "1px solid #FDE68A", borderRadius: 12, padding: "12px 16px", display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Clock size={15} color="#D97706" />
            <span style={{ color: "#92400E", fontSize: "0.82rem", fontWeight: 600 }}>Bientôt disponible</span>
          </div>
        </div>
      </div>
    );
  }

  function ZakatPage() {
    const [paid, setPaid] = useState(false);
    return (
      <div style={{ padding: 24, maxWidth: 600 }}>
        <h2 style={{ color: "#0F172A", fontWeight: 800, fontSize: "1.2rem", margin: "0 0 20px" }}>Don & Zakat</h2>
        <div style={{ background: "white", borderRadius: 18, border: "1px solid #E9EEF4", padding: 24, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: "#FFFBF0", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Calculator size={18} color="#C9A84C" />
            </div>
            <div>
              <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.9rem", margin: 0 }}>Calculateur Zakat</p>
              <p style={{ color: "#94A3B8", fontSize: "0.75rem", margin: 0 }}>2.5% de l&apos;épargne annuelle</p>
            </div>
          </div>
          <div style={{ background: "#F8FAFC", borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #F1F5F9" }}>
              <span style={{ color: "#64748B", fontSize: "0.82rem" }}>Solde de référence</span>
              <span style={{ color: "#0F172A", fontWeight: 600, fontSize: "0.85rem" }}>{balance.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #F1F5F9" }}>
              <span style={{ color: "#64748B", fontSize: "0.82rem" }}>Taux</span>
              <span style={{ color: "#0F172A", fontWeight: 600, fontSize: "0.85rem" }}>2.5%</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0 0" }}>
              <span style={{ color: "#C9A84C", fontWeight: 700, fontSize: "0.9rem" }}>Zakat due</span>
              <span style={{ color: "#C9A84C", fontWeight: 800, fontSize: "1.2rem" }}>{zakatDue.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</span>
            </div>
          </div>
          {paid ? (
            <div style={{ background: "#F0FDF4", borderRadius: 10, padding: "12px 16px", textAlign: "center" }}>
              <Check size={20} color="#005F2D" style={{ margin: "0 auto 6px" }} />
              <p style={{ color: "#005F2D", fontWeight: 700, fontSize: "0.85rem", margin: 0 }}>Zakat soumise avec succès !</p>
            </div>
          ) : (
            <button onClick={() => setPaid(true)} style={{ width: "100%", height: 46, background: "linear-gradient(135deg,#C9A84C,#E6C97A)", border: "none", borderRadius: 12, color: "#001A0D", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}>
              Payer ma Zakat — {zakatDue.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
            </button>
          )}
        </div>
        <div style={{ background: "linear-gradient(135deg,#F0FDF4,#DCFCE7)", borderRadius: 16, border: "1px solid #BBF7D0", padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Heart size={15} color="#005F2D" />
            <p style={{ color: "#005F2D", fontWeight: 700, fontSize: "0.85rem", margin: 0 }}>Dons & Charité</p>
          </div>
          <p style={{ color: "#166534", fontSize: "0.8rem", margin: "0 0 12px", lineHeight: 1.6 }}>Contribuez à des projets solidaires certifiés par notre Conseil Islamique.</p>
          <div style={{ background: "#fff", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
            <Clock size={14} color="#D97706" /><span style={{ color: "#92400E", fontSize: "0.78rem" }}>Plateforme de dons — bientôt disponible</span>
          </div>
        </div>
      </div>
    );
  }

  function DocsPage() {
    return (
      <div style={{ padding: 24, maxWidth: 700 }}>
        <h2 style={{ color: "#0F172A", fontWeight: 800, fontSize: "1.2rem", margin: "0 0 20px" }}>Documents</h2>
        {[
          { label: "Contrat de compte courant", date: fmtDate(profile?.created_at ?? new Date().toISOString()), icon: FileText },
          { label: "Conditions générales KT Bank AG", date: "01 Jan. 2024", icon: FileText },
          { label: "Politique de confidentialité", date: "01 Jan. 2024", icon: Shield },
        ].map(({ label, date, icon: Icon }) => (
          <div key={label} style={{ background: "white", borderRadius: 14, border: "1px solid #E9EEF4", padding: "16px 20px", marginBottom: 10, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={18} color="#005F2D" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: "#0F172A", fontWeight: 500, fontSize: "0.85rem", margin: 0 }}>{label}</p>
              <p style={{ color: "#94A3B8", fontSize: "0.72rem", margin: "3px 0 0" }}>Émis le {date}</p>
            </div>
            <button style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 8, padding: "6px 12px", color: "#005F2D", fontWeight: 600, fontSize: "0.75rem", cursor: "pointer" }}>
              Télécharger
            </button>
          </div>
        ))}
      </div>
    );
  }

  function ProfilePage() {
    return (
      <div style={{ padding: 24, maxWidth: 700 }}>
        <h2 style={{ color: "#0F172A", fontWeight: 800, fontSize: "1.2rem", margin: "0 0 20px" }}>Mon Profil</h2>
        {loading || !profile ? <Skeleton /> : (
          <>
            <div style={{ background: "white", borderRadius: 18, border: "1px solid #E9EEF4", marginBottom: 16, overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg,#001A0D,#003319)", padding: "24px 24px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 54, height: 54, borderRadius: 16, background: "rgba(201,168,76,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.1rem", color: "#C9A84C" }}>
                  {initials(profile.prenom, profile.nom)}
                </div>
                <div>
                  <p style={{ color: "white", fontWeight: 800, fontSize: "1.1rem", margin: 0 }}>{profile.prenom} {profile.nom}</p>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", margin: "4px 0 0" }}>Client depuis {fmtDate(profile.created_at)}</p>
                </div>
              </div>
              <InfoRow label="E-mail" value={profile.email} />
              <InfoRow label="Téléphone" value={profile.telephone || "—"} />
              <InfoRow label="Adresse" value={profile.adresse ? `${profile.adresse}, ${profile.code_postal} ${profile.ville}` : "—"} />
              <InfoRow label="Pays de résidence" value={profile.pays_residence || "—"} />
              <InfoRow label="Nationalité" value={profile.nationalite || "—"} />
              <InfoRow label="Situation professionnelle" value={profile.situation_professionnelle || "—"} />
            </div>
            <div style={{ background: "white", borderRadius: 18, border: "1px solid #E9EEF4", overflow: "hidden" }}>
              <div style={{ padding: "16px 22px", borderBottom: "1px solid #F1F5F9" }}>
                <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.88rem", margin: 0 }}>Sécurité & Vérifications</p>
              </div>
              {[
                { label: "E-mail vérifié", ok: true, icon: Mail },
                { label: "Téléphone vérifié", ok: !!profile.telephone, icon: Phone },
                { label: "KYC", ok: profile.kyc_status === "verified", val: profile.kyc_status === "verified" ? "Vérifié" : "En cours", icon: Shield },
              ].map(({ label, ok, val, icon: Icon }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 22px", borderBottom: "1px solid #F8FAFC" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Icon size={15} color={ok ? "#005F2D" : "#D97706"} />
                    <span style={{ color: "#0F172A", fontSize: "0.85rem" }}>{label}</span>
                  </div>
                  <span style={{ background: ok ? "#F0FDF4" : "#FFFBF0", color: ok ? "#16A34A" : "#D97706", fontSize: "0.72rem", fontWeight: 600, padding: "3px 9px", borderRadius: 20 }}>
                    {val ?? (ok ? "Vérifié" : "En attente")}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14 }}>
              <p style={{ color: "#64748B", fontSize: "0.78rem", marginBottom: 10 }}>Pour modifier vos informations personnelles, contactez votre conseiller :</p>
              <div style={{ display: "flex", gap: 10 }}>
                <a href="mailto:support@kt-bank-ag.com" style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "white", border: "1px solid #E2E8F0", borderRadius: 10, color: "#005F2D", fontWeight: 600, fontSize: "0.8rem", textDecoration: "none" }}>
                  <Mail size={14} /> support@kt-bank-ag.com
                </a>
                <a href="tel:+4969123456" style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "white", border: "1px solid #E2E8F0", borderRadius: 10, color: "#005F2D", fontWeight: 600, fontSize: "0.8rem", textDecoration: "none" }}>
                  <Phone size={14} /> +49 69 123 456
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  /* ── MODALS ── */
  function IbanModal() {
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
        <div style={{ background: "white", borderRadius: 20, padding: 32, maxWidth: 440, width: "100%", boxShadow: "0 24px 60px rgba(0,0,0,0.2)" }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Lock size={22} color="#005F2D" />
          </div>
          <p style={{ color: "#0F172A", fontWeight: 800, fontSize: "1.05rem", textAlign: "center", margin: "0 0 10px" }}>Informations IBAN</p>
          <p style={{ color: "#64748B", fontSize: "0.85rem", textAlign: "center", lineHeight: 1.6, margin: "0 0 20px" }}>
            Pour obtenir votre IBAN complet et vos coordonnées bancaires complètes, veuillez contacter votre gestionnaire de compte.
          </p>
          {/* German message */}
          <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 14, padding: "16px 18px", marginBottom: 20 }}>
            <p style={{ color: "#64748B", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 8px" }}>Auf Deutsch</p>
            <p style={{ color: "#0F172A", fontSize: "0.88rem", lineHeight: 1.6, margin: 0 }}>
              Bitte kontaktieren Sie Ihren Kontenverwalter, um Ihre vollständigen Bankdaten (IBAN) zu erhalten.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <a href="mailto:support@kt-bank-ag.com" style={{ flex: 1, height: 44, background: "#005F2D", border: "none", borderRadius: 12, color: "white", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, textDecoration: "none" }}>
              <Mail size={15} /> Contacter
            </a>
            <button onClick={() => setShowIbanModal(false)} style={{ flex: 1, height: 44, background: "#F1F5F9", border: "none", borderRadius: 12, color: "#64748B", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}>
              Fermer
            </button>
          </div>
        </div>
      </div>
    );
  }

  function CardRequestModal() {
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
        <div style={{ background: "white", borderRadius: 20, padding: 32, maxWidth: 460, width: "100%", boxShadow: "0 24px 60px rgba(0,0,0,0.2)" }}>
          {cardRequested ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Check size={26} color="#005F2D" />
              </div>
              <p style={{ color: "#0F172A", fontWeight: 800, fontSize: "1.05rem", margin: "0 0 10px" }}>Demande enregistrée !</p>
              <p style={{ color: "#64748B", fontSize: "0.85rem", lineHeight: 1.6, margin: "0 0 20px" }}>
                Votre demande de carte {cardTier === "premium" ? "Premium (500 €)" : "Standard (260 €)"} a été soumise. Un conseiller vous contactera sous 48h.
              </p>
              <button onClick={() => { setShowCardRequest(false); setCardRequested(false); }} style={{ padding: "10px 28px", background: "#005F2D", border: "none", borderRadius: 12, color: "white", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer" }}>
                Fermer
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <p style={{ color: "#0F172A", fontWeight: 800, fontSize: "1rem", margin: 0 }}>Demander une carte</p>
                <button onClick={() => setShowCardRequest(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><X size={20} /></button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[
                  { id: "standard", label: "Standard", price: "260 €", desc: "Transactions jusqu'à 25 000 €", color: "#005F2D", bg: "#F0FDF4", border: "#BBF7D0" },
                  { id: "premium", label: "Premium", price: "500 €", desc: "Transactions illimitées (25 000 €+)", color: "#C9A84C", bg: "#FFFBF0", border: "#FDE68A" },
                ].map((tier) => (
                  <button key={tier.id} onClick={() => setCardTier(tier.id as "standard" | "premium")}
                    style={{ padding: "14px", background: cardTier === tier.id ? tier.bg : "#F8FAFC", border: `2px solid ${cardTier === tier.id ? tier.border : "#E2E8F0"}`, borderRadius: 14, textAlign: "left", cursor: "pointer", transition: "all 0.15s" }}>
                    <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.85rem", margin: "0 0 4px" }}>{tier.label}</p>
                    <p style={{ color: tier.color, fontWeight: 800, fontSize: "1.05rem", margin: "0 0 4px" }}>{tier.price}</p>
                    <p style={{ color: "#64748B", fontSize: "0.7rem", margin: 0, lineHeight: 1.4 }}>{tier.desc}</p>
                  </button>
                ))}
              </div>
              <div style={{ background: "#F8FAFC", borderRadius: 12, padding: "12px 16px", marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ color: "#64748B", fontSize: "0.82rem" }}>Titulaire</span>
                  <span style={{ color: "#0F172A", fontWeight: 600, fontSize: "0.82rem" }}>{holderName}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748B", fontSize: "0.82rem" }}>Frais d&apos;émission</span>
                  <span style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.88rem" }}>{cardTier === "premium" ? "500 €" : "260 €"}</span>
                </div>
              </div>
              <button onClick={() => setCardRequested(true)} style={{ width: "100%", height: 48, background: "#005F2D", border: "none", borderRadius: 12, color: "white", fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Plus size={16} /> Confirmer la demande
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  const pages: Record<string, React.ReactNode> = {
    dashboard: <DashboardHome />,
    accounts: <AccountsPage />,
    transfers: <TransfersPage />,
    cards: <CardsPage />,
    savings: <SavingsPage />,
    zakat: <ZakatPage />,
    docs: <DocsPage />,
    profile: <ProfilePage />,
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#F5F7FA", fontFamily: "'Inter',sans-serif" }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex" style={{ flexShrink: 0 }}>
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50 }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} onClick={() => setSidebarOpen(false)} />
          <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: 248, zIndex: 10 }}>
            <Sidebar mobile />
          </div>
          <button onClick={() => setSidebarOpen(false)} style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, padding: 8, color: "white", zIndex: 20, cursor: "pointer" }}>
            <X size={22} />
          </button>
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {/* Topbar */}
        <header style={{ background: "white", borderBottom: "1px solid #E9EEF4", padding: "0 20px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)} style={{ background: "#F5F7FA", border: "none", borderRadius: 10, padding: 8, cursor: "pointer", display: "flex" }}>
              <Menu size={20} color="#005F2D" />
            </button>
            {!loading && profile && (
              <div>
                <p style={{ color: "#0F172A", fontWeight: 700, fontSize: "0.9rem", margin: 0 }}>
                  Bonjour, {profile.prenom} 👋
                </p>
                <p style={{ color: "#94A3B8", fontSize: "0.72rem", margin: 0 }}>
                  {now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button style={{ position: "relative", background: "#F5F7FA", border: "none", borderRadius: 10, padding: 8, cursor: "pointer", display: "flex" }}>
              <Bell size={17} color="#64748B" />
              <span style={{ position: "absolute", top: 5, right: 5, width: 7, height: 7, borderRadius: "50%", background: "#EF4444", border: "2px solid white" }} />
            </button>
            {profile && (
              <div style={{ width: 36, height: 36, borderRadius: 11, background: "linear-gradient(135deg,#001A0D,#003319)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: "0.78rem" }}>
                {initials(profile.prenom, profile.nom)}
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {pages[activeNav] ?? <DashboardHome />}
        </div>
      </div>

      {/* Modals */}
      {showIbanModal && <IbanModal />}
      {showCardRequest && <CardRequestModal />}

      {/* Suspended account overlay */}
      {!loading && profile?.status === "suspended" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.82)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }}>
          <div style={{ background: "white", borderRadius: 24, padding: "40px 32px", maxWidth: 440, width: "100%", textAlign: "center", boxShadow: "0 32px 80px rgba(0,0,0,0.4)" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Lock size={28} color="#DC2626" />
            </div>
            <p style={{ color: "#0F172A", fontWeight: 800, fontSize: "1.2rem", margin: "0 0 10px" }}>
              Compte désactivé
            </p>
            <p style={{ color: "#64748B", fontSize: "0.88rem", lineHeight: 1.7, margin: "0 0 20px" }}>
              Votre compte a été temporairement désactivé. Aucune opération de dépôt ou de retrait n&apos;a été enregistrée depuis la création de votre compte.
            </p>
            {/* German version */}
            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: "14px 16px", marginBottom: 24 }}>
              <p style={{ color: "#94A3B8", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 6px" }}>Auf Deutsch</p>
              <p style={{ color: "#334155", fontSize: "0.85rem", lineHeight: 1.6, margin: 0 }}>
                Ihr Konto wurde vorübergehend deaktiviert, da seit der Kontoeröffnung keine Einzahlungen oder Abhebungen stattgefunden haben. Bitte aktivieren Sie Ihr Konto, indem Sie Ihren Kundenbetreuer kontaktieren.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <a href="mailto:support@kt-bank-ag.com"
                style={{ flex: 1, height: 46, background: "#005F2D", border: "none", borderRadius: 12, color: "white", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, textDecoration: "none" }}>
                <Mail size={15} /> Contacter le support
              </a>
              <button onClick={logout}
                style={{ height: 46, padding: "0 18px", background: "#F1F5F9", border: "none", borderRadius: 12, color: "#64748B", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}>
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
