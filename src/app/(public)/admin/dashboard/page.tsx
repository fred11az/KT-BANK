"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Package,
  ArrowLeftRight,
  Send,
  ClipboardList,
  BarChart2,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  MoreHorizontal,
  Shield,
  Wallet,
  UserCheck,
  Activity,
} from "lucide-react";

// ─── Mock data ──────────────────────────────────────────────
const STATS = [
  { label: "Total Clients", value: "50,428", change: "+234 ce mois", positive: true, icon: <Users size={20} />, color: "#005F2D" },
  { label: "Total Dépôts", value: "€247M", change: "+€12.4M ce mois", positive: true, icon: <Wallet size={20} />, color: "#C9A84C" },
  { label: "Transactions/mois", value: "12,450", change: "+8.2% vs mois dernier", positive: true, icon: <Activity size={20} />, color: "#3B82F6" },
  { label: "Nouveaux clients", value: "234", change: "ce mois • objectif: 200", positive: true, icon: <UserCheck size={20} />, color: "#8B5CF6" },
];

const RECENT_CLIENTS = [
  { name: "Ayaan Khan", email: "ayaan.khan@gmail.com", produit: "GiroKonto", statut: "Actif", date: "27 Mai 2024", avatar: "AK" },
  { name: "Fatima Zahra", email: "f.zahra@hotmail.de", produit: "GoldKonto", statut: "En attente", date: "26 Mai 2024", avatar: "FZ" },
  { name: "Omar Al-Rashid", email: "o.rashid@web.de", produit: "FestgeldKonto", statut: "Actif", date: "25 Mai 2024", avatar: "OR" },
  { name: "Amira Benali", email: "amira.benali@yahoo.fr", produit: "GiroKonto", statut: "Vérifié", date: "24 Mai 2024", avatar: "AB" },
  { name: "Yusuf Demir", email: "yusuf.demir@gmx.de", produit: "GoldKonto", statut: "En cours", date: "23 Mai 2024", avatar: "YD" },
  { name: "Khadija Osman", email: "k.osman@t-online.de", produit: "GiroKonto", statut: "Actif", date: "22 Mai 2024", avatar: "KO" },
];

const PENDING_REQUESTS = [
  { client: "Fatima Zahra", type: "Ouverture GoldKonto", date: "26 Mai", priority: "Haute", docs: "Complets" },
  { client: "Ibrahim Müller", type: "Virement international", date: "25 Mai", priority: "Normale", docs: "En attente" },
  { client: "Layla Al-Hassan", type: "Upgrade FestgeldKonto", date: "24 Mai", priority: "Normale", docs: "Complets" },
  { client: "Ahmed Özkan", type: "Ouverture GiroKonto", date: "23 Mai", priority: "Basse", docs: "Incomplets" },
  { client: "Maryam Siddiqui", type: "Fermeture de compte", date: "22 Mai", priority: "Haute", docs: "Complets" },
];

const RECENT_TRANSACTIONS = [
  { id: "TXN-8821", client: "Mohammed Yilmaz", type: "Crédit salaire", amount: +3200, date: "27 Mai 14:22" },
  { id: "TXN-8820", client: "Fatima Zahra", type: "Dépôt GoldKonto", amount: +5000, date: "27 Mai 11:05" },
  { id: "TXN-8819", client: "Omar Al-Rashid", type: "Virement sortant", amount: -1250, date: "26 Mai 16:40" },
  { id: "TXN-8818", client: "Ayaan Khan", type: "Paiement Zakat", amount: -620, date: "26 Mai 09:15" },
  { id: "TXN-8817", client: "Amira Benali", type: "Recharge Jetzz", amount: -200, date: "25 Mai 18:30" },
  { id: "TXN-8816", client: "Yusuf Demir", type: "Crédit Mourabaha", amount: +8500, date: "25 Mai 10:00" },
];

// Monthly bar data (percentage of max)
const CHART_DATA = [
  { month: "Jan", deposits: 65, withdrawals: 40 },
  { month: "Fév", deposits: 72, withdrawals: 45 },
  { month: "Mar", deposits: 58, withdrawals: 38 },
  { month: "Avr", deposits: 85, withdrawals: 55 },
  { month: "Mai", deposits: 92, withdrawals: 60 },
  { month: "Juin", deposits: 78, withdrawals: 50 },
  { month: "Juil", deposits: 88, withdrawals: 62 },
  { month: "Aoû", deposits: 70, withdrawals: 42 },
  { month: "Sep", deposits: 95, withdrawals: 65 },
  { month: "Oct", deposits: 82, withdrawals: 55 },
  { month: "Nov", deposits: 90, withdrawals: 58 },
  { month: "Déc", deposits: 100, withdrawals: 70 },
];

const NAV_ITEMS = [
  { icon: <LayoutDashboard size={18} />, label: "Dashboard", active: true },
  { icon: <Users size={18} />, label: "Clients" },
  { icon: <Package size={18} />, label: "Produits" },
  { icon: <ArrowLeftRight size={18} />, label: "Transactions" },
  { icon: <Send size={18} />, label: "Virements" },
  { icon: <ClipboardList size={18} />, label: "Demandes" },
  { icon: <BarChart2 size={18} />, label: "Analytics" },
  { icon: <Settings size={18} />, label: "Paramètres" },
];

const STATUS_STYLES: Record<string, { bg: string; color: string; dot: string }> = {
  "Actif": { bg: "rgba(34,197,94,0.1)", color: "#16A34A", dot: "#22C55E" },
  "En attente": { bg: "rgba(234,179,8,0.1)", color: "#CA8A04", dot: "#EAB308" },
  "Vérifié": { bg: "rgba(59,130,246,0.1)", color: "#2563EB", dot: "#3B82F6" },
  "En cours": { bg: "rgba(168,85,247,0.1)", color: "#7C3AED", dot: "#A855F7" },
};

const PRIORITY_STYLES: Record<string, { bg: string; color: string }> = {
  "Haute": { bg: "rgba(239,68,68,0.15)", color: "#EF4444" },
  "Normale": { bg: "rgba(59,130,246,0.15)", color: "#3B82F6" },
  "Basse": { bg: "rgba(100,116,139,0.15)", color: "#64748B" },
};

// ─── Component ─────────────────────────────────────────────
export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Dashboard");

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div
      className="flex flex-col h-full"
      style={{
        background: "#1E293B",
        width: mobile ? "100%" : 240,
        borderRight: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Logo */}
      <div className="p-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm"
            style={{ background: "linear-gradient(135deg, #C9A84C, #E6C97A)", color: "#003D1F" }}
          >
            KT
          </div>
          <div>
            <p className="font-bold text-white text-sm">KT Bank</p>
            <p className="text-xs" style={{ color: "#475569" }}>Administration</p>
          </div>
        </div>
      </div>

      {/* Admin badge */}
      <div className="px-4 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.12)" }}>
          <Shield size={14} style={{ color: "#C9A84C" }} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">Admin Système</p>
            <p className="text-xs truncate" style={{ color: "#64748B" }}>admin@ktbank.de</p>
          </div>
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#22C55E" }} />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <p className="text-xs font-semibold px-3 mb-2 mt-2" style={{ color: "#334155" }}>NAVIGATION</p>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            onClick={() => { setActiveNav(item.label); if (mobile) setSidebarOpen(false); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
            style={{
              background: activeNav === item.label ? "rgba(201,168,76,0.12)" : "transparent",
              color: activeNav === item.label ? "#C9A84C" : "#64748B",
              borderLeft: activeNav === item.label ? "3px solid #C9A84C" : "3px solid transparent",
            }}
            onMouseEnter={(e) => {
              if (activeNav !== item.label) {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.color = "#94A3B8";
              }
            }}
            onMouseLeave={(e) => {
              if (activeNav !== item.label) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#64748B";
              }
            }}
          >
            {item.icon}
            {item.label}
            {activeNav === item.label && <ChevronRight size={14} className="ml-auto" />}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <Link
          href="/admin"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium"
          style={{ color: "#475569" }}
        >
          <LogOut size={18} />
          Déconnexion
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#0F172A" }}>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0" style={{ width: 240 }}>
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 z-10">
            <Sidebar mobile />
          </div>
          <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-white z-20">
            <X size={24} />
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header
          className="flex items-center justify-between px-4 sm:px-6 py-4 flex-shrink-0"
          style={{ background: "#1E293B", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl"
              style={{ background: "#334155" }}
            >
              <Menu size={18} style={{ color: "#94A3B8" }} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-white">Tableau de bord</h1>
              <p className="text-xs" style={{ color: "#475569" }}>Mardi 27 Mai 2024 • Données en temps réel</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#475569" }} />
              <input
                placeholder="Rechercher..."
                className="pl-9 pr-4 py-2 rounded-xl text-sm outline-none"
                style={{ background: "#0F172A", border: "1px solid #334155", color: "#94A3B8", width: 200 }}
              />
            </div>
            <button className="relative p-2 rounded-xl" style={{ background: "#334155" }}>
              <Bell size={17} style={{ color: "#94A3B8" }} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: "#C9A84C" }} />
            </button>
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold"
              style={{ background: "linear-gradient(135deg, #C9A84C, #E6C97A)", color: "#003D1F" }}
            >
              AD
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">

          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {STATS.map((stat, i) => (
              <div
                key={i}
                className="rounded-2xl p-5 relative overflow-hidden"
                style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div style={{
                  position: "absolute", top: -20, right: -20, width: 80, height: 80,
                  borderRadius: "50%", background: `${stat.color}08`,
                }} />
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${stat.color}15`, color: stat.color }}
                  >
                    {stat.icon}
                  </div>
                  <TrendingUp size={14} style={{ color: "#22C55E" }} />
                </div>
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-xs font-medium mb-1" style={{ color: "#64748B" }}>{stat.label}</p>
                <div className="flex items-center gap-1">
                  <TrendingUp size={11} style={{ color: "#22C55E" }} />
                  <span className="text-xs" style={{ color: "#22C55E" }}>{stat.change}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Revenue chart */}
          <div
            className="rounded-2xl p-5 mb-6"
            style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-bold text-white">Vue d&apos;ensemble financière 2024</h2>
                <p className="text-xs mt-0.5" style={{ color: "#475569" }}>Dépôts vs Retraits — en millions d&apos;euros</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#C9A84C" }} />
                  <span style={{ color: "#64748B" }}>Dépôts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#3B82F6" }} />
                  <span style={{ color: "#64748B" }}>Retraits</span>
                </div>
              </div>
            </div>

            {/* Bar chart */}
            <div className="flex items-end gap-2 h-40">
              {CHART_DATA.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex gap-0.5 items-end" style={{ height: 128 }}>
                    <div
                      className="flex-1 rounded-t-lg transition-all"
                      style={{
                        height: `${d.deposits}%`,
                        background: "linear-gradient(180deg, #E6C97A, #C9A84C)",
                        opacity: 0.9,
                      }}
                    />
                    <div
                      className="flex-1 rounded-t-lg transition-all"
                      style={{
                        height: `${d.withdrawals}%`,
                        background: "linear-gradient(180deg, #60A5FA, #3B82F6)",
                        opacity: 0.7,
                      }}
                    />
                  </div>
                  <span className="text-xs" style={{ color: "#334155" }}>{d.month}</span>
                </div>
              ))}
            </div>

            {/* Y-axis labels */}
            <div className="flex justify-between mt-2 pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              <div className="text-center">
                <p className="text-lg font-bold" style={{ color: "#C9A84C" }}>€247M</p>
                <p className="text-xs" style={{ color: "#475569" }}>Total dépôts</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold" style={{ color: "#3B82F6" }}>€89M</p>
                <p className="text-xs" style={{ color: "#475569" }}>Total retraits</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold" style={{ color: "#22C55E" }}>€158M</p>
                <p className="text-xs" style={{ color: "#475569" }}>Encours net</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white">+35.8%</p>
                <p className="text-xs" style={{ color: "#475569" }}>Croissance YTD</p>
              </div>
            </div>
          </div>

          {/* Bottom grids */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {/* Recent clients + Pending */}
            <div className="xl:col-span-2 space-y-4">
              {/* Recent clients */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  <div>
                    <h2 className="font-bold text-white">Nouveaux clients</h2>
                    <p className="text-xs mt-0.5" style={{ color: "#475569" }}>Inscriptions récentes</p>
                  </div>
                  <button
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1"
                    style={{ color: "#C9A84C", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.15)" }}
                  >
                    Voir tout <ChevronRight size={12} />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        {["Nom", "Email", "Produit", "Statut", "Date"].map((h) => (
                          <th key={h} className="px-5 py-3 text-left text-xs font-semibold" style={{ color: "#334155" }}>
                            {h}
                          </th>
                        ))}
                        <th className="px-5 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {RECENT_CLIENTS.map((c, i) => {
                        const s = STATUS_STYLES[c.statut] || STATUS_STYLES["Actif"];
                        return (
                          <tr
                            key={i}
                            style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                            className="transition-colors"
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2.5">
                                <div
                                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                                  style={{ background: "rgba(201,168,76,0.1)", color: "#C9A84C" }}
                                >
                                  {c.avatar}
                                </div>
                                <span className="text-sm font-medium text-white">{c.name}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3">
                              <span className="text-xs" style={{ color: "#64748B" }}>{c.email}</span>
                            </td>
                            <td className="px-5 py-3">
                              <span className="text-xs font-medium" style={{ color: "#94A3B8" }}>{c.produit}</span>
                            </td>
                            <td className="px-5 py-3">
                              <span
                                className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                                style={{ background: s.bg, color: s.color }}
                              >
                                <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
                                {c.statut}
                              </span>
                            </td>
                            <td className="px-5 py-3">
                              <span className="text-xs" style={{ color: "#475569" }}>{c.date}</span>
                            </td>
                            <td className="px-5 py-3">
                              <button style={{ color: "#334155" }}>
                                <MoreHorizontal size={16} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pending requests */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  <div>
                    <h2 className="font-bold text-white">Demandes en attente</h2>
                    <p className="text-xs mt-0.5" style={{ color: "#475569" }}>5 demandes nécessitent une action</p>
                  </div>
                  <span
                    className="text-xs font-bold px-2 py-1 rounded-full"
                    style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}
                  >
                    5 en attente
                  </span>
                </div>
                <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.03)" }}>
                  {PENDING_REQUESTS.map((req, i) => {
                    const p = PRIORITY_STYLES[req.priority];
                    return (
                      <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: "rgba(255,255,255,0.04)" }}
                        >
                          {req.docs === "Complets" ? (
                            <CheckCircle size={15} style={{ color: "#22C55E" }} />
                          ) : req.docs === "En attente" ? (
                            <Clock size={15} style={{ color: "#EAB308" }} />
                          ) : (
                            <AlertCircle size={15} style={{ color: "#EF4444" }} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white">{req.client}</p>
                          <p className="text-xs truncate" style={{ color: "#64748B" }}>{req.type}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: p.bg, color: p.color }}
                          >
                            {req.priority}
                          </span>
                          <span className="text-xs" style={{ color: "#334155" }}>{req.date}</span>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <button
                            className="p-1.5 rounded-lg text-xs"
                            style={{ background: "rgba(34,197,94,0.1)", color: "#22C55E" }}
                          >
                            <CheckCircle size={13} />
                          </button>
                          <button
                            className="p-1.5 rounded-lg"
                            style={{ background: "rgba(255,255,255,0.04)", color: "#64748B" }}
                          >
                            <Eye size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              {/* Recent transactions */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div className="p-5 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  <h2 className="font-bold text-white">Transactions récentes</h2>
                  <p className="text-xs mt-0.5" style={{ color: "#475569" }}>Dernières 6 opérations</p>
                </div>
                <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.03)" }}>
                  {RECENT_TRANSACTIONS.map((tx, i) => (
                    <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background: tx.amount > 0 ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                        }}
                      >
                        {tx.amount > 0
                          ? <TrendingUp size={15} style={{ color: "#22C55E" }} />
                          : <TrendingDown size={15} style={{ color: "#EF4444" }} />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white truncate">{tx.client}</p>
                        <p className="text-xs truncate" style={{ color: "#475569" }}>{tx.type}</p>
                        <p className="text-xs" style={{ color: "#334155" }}>{tx.date}</p>
                      </div>
                      <span
                        className="text-sm font-bold flex-shrink-0"
                        style={{ color: tx.amount > 0 ? "#22C55E" : "#EF4444" }}
                      >
                        {tx.amount > 0 ? "+" : ""}
                        {tx.amount.toLocaleString("fr-FR")} €
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product distribution */}
              <div
                className="rounded-2xl p-5"
                style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <h2 className="font-bold text-white mb-4">Distribution produits</h2>
                <div className="space-y-3">
                  {[
                    { label: "GiroKonto", pct: 58, count: "29,248", color: "#005F2D" },
                    { label: "GoldKonto", pct: 28, count: "14,120", color: "#C9A84C" },
                    { label: "FestgeldKonto", pct: 14, count: "7,060", color: "#3B82F6" },
                  ].map((p) => (
                    <div key={p.label}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-medium" style={{ color: "#94A3B8" }}>{p.label}</span>
                        <div className="text-right">
                          <span className="text-xs font-bold text-white">{p.pct}%</span>
                          <span className="text-xs ml-2" style={{ color: "#475569" }}>{p.count} clients</span>
                        </div>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${p.pct}%`, background: p.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System status */}
              <div
                className="rounded-2xl p-5"
                style={{ background: "#1E293B", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <h2 className="font-bold text-white mb-4">État du système</h2>
                <div className="space-y-2.5">
                  {[
                    { label: "API Paiements", status: "Opérationnel", ok: true },
                    { label: "Base de données", status: "Opérationnel", ok: true },
                    { label: "Auth / 2FA", status: "Opérationnel", ok: true },
                    { label: "BaFin Reporting", status: "Maintenance", ok: false },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: "#64748B" }}>{s.label}</span>
                      <span
                        className="flex items-center gap-1.5 text-xs font-semibold"
                        style={{ color: s.ok ? "#22C55E" : "#EAB308" }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: s.ok ? "#22C55E" : "#EAB308" }}
                        />
                        {s.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
