"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  CreditCard,
  ArrowLeftRight,
  Wallet,
  PiggyBank,
  Heart,
  FileText,
  User,
  LogOut,
  Bell,
  Send,
  RefreshCw,
  Banknote,
  History,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Menu,
  X,
  Globe,
  Star,
  Shield,
  Calculator,
  Eye,
  EyeOff,
} from "lucide-react";

const CLIENT = { name: "Mohammed Yilmaz", email: "client@ktbank.de", iban: "DE89 3704 0044 0532 0130 00" };

const TRANSACTIONS = [
  { date: "27 Mai 2024", desc: "Virement reçu – Arbeitgeber GmbH", amount: +3200.0, type: "credit", cat: "Salaire" },
  { date: "25 Mai 2024", desc: "REWE Supermarché Frankfurt", amount: -87.4, type: "debit", cat: "Alimentation" },
  { date: "24 Mai 2024", desc: "DB Bahn – Ticket ICE", amount: -54.0, type: "debit", cat: "Transport" },
  { date: "22 Mai 2024", desc: "Don Zakat – KT Solidarity Fund", amount: -620.0, type: "debit", cat: "Zakat" },
  { date: "20 Mai 2024", desc: "Amazon.de – Commande #1482", amount: -123.5, type: "debit", cat: "Shopping" },
  { date: "18 Mai 2024", desc: "Loyer – Wohnungsgesellschaft", amount: -980.0, type: "debit", cat: "Logement" },
  { date: "15 Mai 2024", desc: "Virement KT GoldKonto", amount: -500.0, type: "debit", cat: "Épargne" },
];

const QUICK_ACTIONS = [
  { label: "Virement", icon: <Send size={20} />, color: "#005F2D" },
  { label: "Recharge", icon: <RefreshCw size={20} />, color: "#C9A84C" },
  { label: "Payer", icon: <Banknote size={20} />, color: "#1D4ED8" },
  { label: "Historique", icon: <History size={20} />, color: "#7C3AED" },
];

const NAV_ITEMS = [
  { icon: <LayoutDashboard size={18} />, label: "Tableau de bord", href: "/client/dashboard", active: true },
  { icon: <Wallet size={18} />, label: "Comptes", href: "#" },
  { icon: <ArrowLeftRight size={18} />, label: "Virements", href: "#" },
  { icon: <CreditCard size={18} />, label: "Cartes", href: "#" },
  { icon: <PiggyBank size={18} />, label: "Épargne", href: "#" },
  { icon: <Heart size={18} />, label: "Don / Zakat", href: "#" },
  { icon: <FileText size={18} />, label: "Documents", href: "#" },
  { icon: <User size={18} />, label: "Profil", href: "#" },
];

export default function ClientDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [activeNav, setActiveNav] = useState("Tableau de bord");

  const balance = 24850.0;
  const goldBalance = 3200.0;
  const savings = balance;
  const zakat = (savings * 0.025).toFixed(2);

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div
      className="flex flex-col h-full"
      style={{
        background: "linear-gradient(180deg, #002F17 0%, #005F2D 100%)",
        width: mobile ? "100%" : 240,
      }}
    >
      {/* Logo */}
      <div className="p-5 border-b" style={{ borderColor: "rgba(201,168,76,0.2)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm"
            style={{ background: "linear-gradient(135deg, #C9A84C, #E6C97A)", color: "#003D1F" }}
          >
            KT
          </div>
          <div>
            <p className="font-bold text-white text-sm">KT Bank</p>
            <p className="text-xs" style={{ color: "rgba(201,168,76,0.7)" }}>Espace Client</p>
          </div>
        </div>
      </div>

      {/* Client info */}
      <div className="p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
            style={{ background: "rgba(201,168,76,0.2)", color: "#C9A84C" }}
          >
            MY
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{CLIENT.name}</p>
            <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.4)" }}>{CLIENT.email}</p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            onClick={() => { setActiveNav(item.label); if (mobile) setSidebarOpen(false); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
            style={{
              background: activeNav === item.label ? "rgba(201,168,76,0.15)" : "transparent",
              color: activeNav === item.label ? "#C9A84C" : "rgba(255,255,255,0.65)",
              borderLeft: activeNav === item.label ? "3px solid #C9A84C" : "3px solid transparent",
            }}
          >
            {item.icon}
            {item.label}
            {activeNav === item.label && <ChevronRight size={14} className="ml-auto" />}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <Link
          href="/client"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          <LogOut size={18} />
          Déconnexion
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#F1F5F9" }}>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-shrink-0" style={{ width: 240 }}>
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 z-10">
            <Sidebar mobile />
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 text-white z-20"
          >
            <X size={24} />
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header
          className="flex items-center justify-between px-4 sm:px-6 py-4 flex-shrink-0"
          style={{ background: "white", borderBottom: "1px solid #E2E8F0", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg"
              style={{ background: "#F1F5F9" }}
            >
              <Menu size={20} style={{ color: "#005F2D" }} />
            </button>
            <div>
              <h1 className="text-lg font-bold" style={{ color: "#0F172A" }}>
                Bonjour, {CLIENT.name.split(" ")[0]} 👋
              </h1>
              <p className="text-xs text-gray-500">Mardi 27 Mai 2024 • Tout va bien</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg" style={{ background: "#F1F5F9" }}>
              <Bell size={18} style={{ color: "#64748B" }} />
              <span
                className="absolute top-1 right-1 w-2 h-2 rounded-full"
                style={{ background: "#EF4444" }}
              />
            </button>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs"
              style={{ background: "linear-gradient(135deg, #005F2D, #007A3D)", color: "white" }}
            >
              MY
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Balance cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {/* Main balance */}
            <div
              className="lg:col-span-2 rounded-2xl p-6 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #003D1F 0%, #005F2D 50%, #007A3D 100%)",
                boxShadow: "0 8px 32px rgba(0,95,45,0.35)",
              }}
            >
              <svg style={{ position: "absolute", top: 0, right: 0, opacity: 0.05, width: 200, height: 200 }} viewBox="0 0 200 200">
                <circle cx="150" cy="50" r="80" fill="none" stroke="#C9A84C" strokeWidth="40" />
              </svg>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-medium" style={{ color: "rgba(201,168,76,0.8)" }}>GiroKonto Principal</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>IBAN: {CLIENT.iban}</p>
                  </div>
                  <button onClick={() => setBalanceVisible(!balanceVisible)} style={{ color: "rgba(255,255,255,0.6)" }}>
                    {balanceVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
                <div className="mb-4">
                  <p className="text-4xl font-bold text-white tracking-tight">
                    {balanceVisible ? `€${balance.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}` : "€ •••••••"}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp size={14} style={{ color: "#C9A84C" }} />
                    <span className="text-xs" style={{ color: "#C9A84C" }}>+€3,200 ce mois</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {QUICK_ACTIONS.map((action) => (
                    <button
                      key={action.label}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                      style={{
                        background: "rgba(255,255,255,0.15)",
                        color: "white",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255,255,255,0.2)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
                    >
                      {action.icon}
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Gold balance */}
            <div
              className="rounded-2xl p-5 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #78350F 0%, #92400E 50%, #B45309 100%)",
                boxShadow: "0 8px 32px rgba(180,83,9,0.25)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Star size={16} style={{ color: "#C9A84C" }} />
                <p className="text-xs font-semibold" style={{ color: "#C9A84C" }}>GoldKonto</p>
              </div>
              <p className="text-3xl font-bold text-white mb-1">
                €{goldBalance.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>≈ 47.8g d&apos;or fin</p>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span style={{ color: "rgba(255,255,255,0.6)" }}>Prix or / gramme</span>
                  <span className="text-white font-semibold">€66.94</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: "rgba(255,255,255,0.6)" }}>Variation 24h</span>
                  <span style={{ color: "#86EFAC" }}>+0.8%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span style={{ color: "rgba(255,255,255,0.6)" }}>Purité</span>
                  <span className="text-white font-semibold">999.9 / Fine</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom section: transactions + widgets */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {/* Transactions table */}
            <div className="xl:col-span-2 rounded-2xl bg-white shadow-sm overflow-hidden" style={{ border: "1px solid #E2E8F0" }}>
              <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "#F1F5F9" }}>
                <div>
                  <h2 className="font-bold text-gray-900">Transactions récentes</h2>
                  <p className="text-xs text-gray-500 mt-0.5">7 dernières opérations</p>
                </div>
                <button
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1"
                  style={{ color: "#005F2D", background: "#F0FDF4" }}
                >
                  Voir tout <ChevronRight size={12} />
                </button>
              </div>
              <div className="divide-y divide-gray-50">
                {TRANSACTIONS.map((tx, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: tx.type === "credit" ? "#F0FDF4" : "#FEF2F2",
                      }}
                    >
                      {tx.type === "credit" ? (
                        <TrendingUp size={16} style={{ color: "#16A34A" }} />
                      ) : (
                        <TrendingDown size={16} style={{ color: "#DC2626" }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{tx.desc}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400">{tx.date}</span>
                        <span
                          className="text-xs px-1.5 py-0.5 rounded-full"
                          style={{ background: "#F1F5F9", color: "#64748B" }}
                        >
                          {tx.cat}
                        </span>
                      </div>
                    </div>
                    <span
                      className="text-sm font-bold flex-shrink-0"
                      style={{ color: tx.type === "credit" ? "#16A34A" : "#DC2626" }}
                    >
                      {tx.type === "credit" ? "+" : ""}
                      {tx.amount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right widgets */}
            <div className="space-y-4">
              {/* Zakat calculator */}
              <div className="rounded-2xl bg-white shadow-sm p-5" style={{ border: "1px solid #E2E8F0" }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#FFF9E6" }}>
                    <Calculator size={16} style={{ color: "#C9A84C" }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Calculateur Zakat</h3>
                    <p className="text-xs text-gray-500">2.5% de l&apos;épargne annuelle</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Épargne totale</span>
                    <span className="font-semibold text-gray-900">€{balance.toLocaleString("fr-FR")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Taux Zakat</span>
                    <span className="font-semibold text-gray-900">2.5%</span>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold" style={{ color: "#C9A84C" }}>Zakat due</span>
                    <span className="font-bold text-lg" style={{ color: "#C9A84C" }}>€{parseFloat(zakat).toLocaleString("fr-FR")}</span>
                  </div>
                </div>
                <button
                  className="w-full mt-4 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: "linear-gradient(135deg, #C9A84C, #E6C97A)", color: "#003D1F" }}
                >
                  Payer ma Zakat
                </button>
              </div>

              {/* Halal certification */}
              <div
                className="rounded-2xl p-5"
                style={{ background: "linear-gradient(135deg, #F0FDF4, #DCFCE7)", border: "1px solid #BBF7D0" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Shield size={18} style={{ color: "#005F2D" }} />
                  <h3 className="text-sm font-bold" style={{ color: "#005F2D" }}>Certification Islamique</h3>
                </div>
                <p className="text-xs text-gray-600 mb-3">
                  Votre compte est géré selon les principes de la Charia. Aucun intérêt (riba) n&apos;est appliqué.
                </p>
                <div className="space-y-1.5">
                  {["Sans riba (intérêts)", "Mourabaha certifié", "Conseil islamique actif"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs" style={{ color: "#166534" }}>
                      <span style={{ color: "#005F2D" }}>✓</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick stats */}
              <div className="rounded-2xl bg-white shadow-sm p-5" style={{ border: "1px solid #E2E8F0" }}>
                <h3 className="text-sm font-bold text-gray-900 mb-4">Ce mois</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Revenus</span>
                      <span className="font-semibold text-green-600">+€3,200</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: "75%", background: "#16A34A" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Dépenses</span>
                      <span className="font-semibold text-red-500">-€1,864.90</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: "45%", background: "#EF4444" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Épargne</span>
                      <span className="font-semibold" style={{ color: "#C9A84C" }}>€500</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: "20%", background: "#C9A84C" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Zakat</span>
                      <span className="font-semibold" style={{ color: "#7C3AED" }}>€620</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: "15%", background: "#7C3AED" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Account info */}
              <div className="rounded-2xl bg-white shadow-sm p-5" style={{ border: "1px solid #E2E8F0" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Globe size={16} style={{ color: "#64748B" }} />
                  <h3 className="text-sm font-bold text-gray-900">Informations compte</h3>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">IBAN</span>
                    <span className="font-mono font-medium text-gray-800 text-xs">DE89 3704 0044</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">BIC</span>
                    <span className="font-mono font-medium text-gray-800">KTBKDEFF</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Produit</span>
                    <span className="font-semibold" style={{ color: "#005F2D" }}>GiroKonto Premium</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Depuis</span>
                    <span className="font-medium text-gray-800">Janvier 2022</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
