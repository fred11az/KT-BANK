"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, User, Shield } from "lucide-react";

const navItems = [
  {
    label: "Produits",
    href: "/products",
    children: [
      { label: "KT GiroKonto", href: "/products/giro-konto", icon: "💳", desc: "Compte courant halal" },
      { label: "KT GoldKonto", href: "/products/gold-konto", icon: "🥇", desc: "Investissement or physique" },
      { label: "KT Jetzz Card", href: "/products/jetzz-card", icon: "💳", desc: "Carte sans frais annuels" },
      { label: "Financement Auto", href: "/products/vehicle-financing", icon: "🚗", desc: "Véhicule sans intérêts" },
      { label: "Crédit Personnel", href: "/products/personal-loans", icon: "💰", desc: "Jusqu'à 50 000€" },
      { label: "KT FestgeldKonto", href: "/products/festgeld-konto", icon: "📈", desc: "Épargne garantie" },
      { label: "KT Donation & Zakat", href: "/products/donation", icon: "🤲", desc: "Nouveau", isNew: true },
      { label: "Crédit Pro & PME", href: "/products/corporate-credit", icon: "🏢", desc: "Nouveau", isNew: true },
      { label: "KT JugendKonto", href: "/products/youth-savings", icon: "🌱", desc: "Nouveau", isNew: true },
      { label: "Financement Immobilier", href: "/products/real-estate", icon: "🏠", desc: "Nouveau", isNew: true },
    ],
  },
  { label: "Entreprises", href: "/corporate" },
  { label: "Finance Islamique", href: "/islamic-banking" },
  { label: "À propos", href: "/about" },
  { label: "Agences", href: "/branches" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
      {/* Top bar */}
      <div style={{ background: "linear-gradient(135deg, #005F2D, #007A3D)" }} className="text-white text-xs py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <span>🏦 La première banque islamique d'Allemagne · BaFin régulée</span>
          <div className="flex gap-4">
            <a href="tel:+4969247517000" className="hover:opacity-80 transition">📞 +49 69 2475 1700</a>
            <span className="opacity-50">|</span>
            <Link href="/client" className="hover:opacity-80 transition flex items-center gap-1">
              <User size={12}/> Espace Client
            </Link>
            <Link href="/admin" className="hover:opacity-80 transition flex items-center gap-1">
              <Shield size={12}/> Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
              style={{ background: "linear-gradient(135deg, #005F2D, #007A3D)" }}>
              KT
            </div>
            <div>
              <div className="font-bold text-lg" style={{ color: "#005F2D" }}>KT Bank AG</div>
              <div className="text-xs text-gray-500 -mt-1">Meine Werte, meine Bank.</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div key={item.label} className="relative"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}>
                <Link href={item.href}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-green-800 hover:bg-green-50 transition-all">
                  {item.label}
                  {item.children && <ChevronDown size={14} className={`transition-transform ${activeDropdown === item.label ? "rotate-180" : ""}`}/>}
                </Link>

                {item.children && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 mt-1">
                    <div className="grid grid-cols-1 gap-1">
                      {item.children.map((child) => (
                        <Link key={child.href} href={child.href}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-green-50 transition-all group">
                          <span className="text-xl">{child.icon}</span>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-800 group-hover:text-green-800 flex items-center gap-2">
                              {child.label}
                              {child.isNew && (
                                <span className="text-xs px-1.5 py-0.5 rounded-full text-white font-bold"
                                  style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96B)" }}>
                                  Nouveau
                                </span>
                              )}
                            </div>
                            {!child.isNew && <div className="text-xs text-gray-500">{child.desc}</div>}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/client"
              className="px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-all hover:bg-green-50"
              style={{ borderColor: "#005F2D", color: "#005F2D" }}>
              Connexion
            </Link>
            <Link href="/client/register"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #005F2D, #007A3D)" }}>
              Ouvrir un compte
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
            {mobileOpen ? <X size={22}/> : <Menu size={22}/>}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 max-h-screen overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <div key={item.label}>
                <Link href={item.href} onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-800 transition-all">
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-4 space-y-1">
                    {item.children.map((child) => (
                      <Link key={child.href} href={child.href} onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-gray-600 hover:bg-green-50 hover:text-green-800 transition-all">
                        <span>{child.icon}</span>
                        <span>{child.label}</span>
                        {child.isNew && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full text-white font-bold ml-auto"
                            style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96B)" }}>
                            Nouveau
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4 flex flex-col gap-2">
              <Link href="/client" onClick={() => setMobileOpen(false)}
                className="w-full text-center px-4 py-3 rounded-xl text-sm font-semibold border-2"
                style={{ borderColor: "#005F2D", color: "#005F2D" }}>
                Connexion
              </Link>
              <Link href="/client/register" onClick={() => setMobileOpen(false)}
                className="w-full text-center px-4 py-3 rounded-xl text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #005F2D, #007A3D)" }}>
                Ouvrir un compte
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
