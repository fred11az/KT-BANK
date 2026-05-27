"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X, ArrowRight } from "lucide-react";

const NAV = [
  {
    label: "Produits",
    href: "/products",
    mega: [
      {
        group: "Comptes & Cartes",
        items: [
          { label: "KT GiroKonto", sub: "Compte courant sans frais", icon: "💳", href: "/products/giro-konto" },
          { label: "KT GoldKonto", sub: "Épargne en or physique", icon: "🥇", href: "/products/gold-konto" },
          { label: "KT Jetzz Card", sub: "Carte sans frais annuels", icon: "💎", href: "/products/jetzz-card" },
        ],
      },
      {
        group: "Financements",
        items: [
          { label: "Crédit Personnel", sub: "Jusqu'à 50 000 €", icon: "💰", href: "/products/personal-loans" },
          { label: "Financement Auto", sub: "Murabaha véhicule", icon: "🚗", href: "/products/vehicle-financing" },
          { label: "Financement Immobilier", sub: "Murabaha & Musharaka", icon: "🏠", href: "/products/real-estate", isNew: true },
        ],
      },
      {
        group: "Épargne & Nouveau",
        items: [
          { label: "KT FestgeldKonto", sub: "Rendement garanti 4.5%", icon: "📈", href: "/products/festgeld-konto" },
          { label: "KT Donation & Zakat", sub: "Calculateur & dons", icon: "🤲", href: "/products/donation", isNew: true },
          { label: "Crédit Pro & PME", sub: "Jusqu'à 5 M€", icon: "🏢", href: "/products/corporate-credit", isNew: true },
          { label: "KT JugendKonto", sub: "Jeunesse 0–25 ans", icon: "🌱", href: "/products/youth-savings", isNew: true },
        ],
      },
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
  const [megaOpen, setMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const megaRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMegaOpen(true);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setMegaOpen(false), 150);
  };

  return (
    <>
      {/* Top strip */}
      <div className="hidden lg:flex items-center justify-between px-6 py-1.5 text-xs font-medium text-white"
        style={{ background: "var(--green-900)" }}>
        <span className="flex items-center gap-4">
          <span>🏛️ Régulée BaFin · Dépôts garantis jusqu'à 100 000 €</span>
          <span className="opacity-40">|</span>
          <span>☪️ Certifié Shariah Board · 100% Halal</span>
        </span>
        <span className="flex items-center gap-4">
          <a href="tel:+4969247517000" className="opacity-80 hover:opacity-100 transition">📞 +49 69 2475 1700</a>
          <span className="opacity-40">|</span>
          <Link href="/client" className="opacity-80 hover:opacity-100 transition">Espace Client →</Link>
        </span>
      </div>

      {/* Main nav */}
      <header
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(255,255,255,0.96)" : "white",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          boxShadow: scrolled ? "0 1px 0 rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.06)" : "0 1px 0 #E5E7EB",
        }}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 mr-10 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-black"
              style={{ background: "linear-gradient(135deg, var(--green-700), var(--green-500))" }}>
              KT
            </div>
            <div className="leading-none">
              <div className="font-bold text-base" style={{ color: "var(--green-800)" }}>KT Bank AG</div>
              <div className="text-[10px] font-medium" style={{ color: "var(--gray-400)" }}>Meine Werte, meine Bank.</div>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-1 flex-1">
            {NAV.map((item) =>
              item.mega ? (
                <div key={item.label} ref={megaRef}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  className="relative">
                  <button
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{ color: megaOpen ? "var(--green-700)" : "var(--gray-700)" }}
                    onClick={() => setMegaOpen(!megaOpen)}>
                    {item.label}
                    <ChevronDown size={14} className={`transition-transform ${megaOpen ? "rotate-180" : ""}`}/>
                  </button>

                  {/* Mega menu */}
                  {megaOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[680px] rounded-2xl shadow-2xl overflow-hidden"
                      style={{ background: "white", border: "1px solid var(--gray-200)" }}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}>
                      <div className="grid grid-cols-3 gap-0 p-5">
                        {item.mega.map((group) => (
                          <div key={group.group}>
                            <div className="text-xs font-bold uppercase tracking-widest mb-3 px-2"
                              style={{ color: "var(--gray-400)" }}>
                              {group.group}
                            </div>
                            <div className="space-y-0.5">
                              {group.items.map((sub) => (
                                <Link key={sub.href} href={sub.href}
                                  onClick={() => setMegaOpen(false)}
                                  className="flex items-start gap-3 px-2 py-2 rounded-xl transition-colors group"
                                  style={{ color: "inherit" }}
                                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--gray-50)")}
                                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                                  <span className="text-xl mt-0.5 flex-shrink-0">{sub.icon}</span>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-semibold" style={{ color: "var(--gray-900)" }}>
                                        {sub.label}
                                      </span>
                                      {sub.isNew && (
                                        <span className="badge badge-new text-[10px] py-0.5">Nouveau</span>
                                      )}
                                    </div>
                                    <div className="text-xs mt-0.5" style={{ color: "var(--gray-500)" }}>{sub.sub}</div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="px-5 py-3 border-t flex items-center justify-between"
                        style={{ background: "var(--gray-50)", borderColor: "var(--gray-200)" }}>
                        <span className="text-xs" style={{ color: "var(--gray-500)" }}>
                          🏅 10 produits 100% halal certifiés
                        </span>
                        <Link href="/products" onClick={() => setMegaOpen(false)}
                          className="text-xs font-semibold flex items-center gap-1 transition-colors"
                          style={{ color: "var(--green-700)" }}>
                          Voir tout <ArrowRight size={12}/>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link key={item.label} href={item.href}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{ color: "var(--gray-700)" }}
                  onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "var(--green-700)"; (e.target as HTMLElement).style.background = "var(--gray-50)"; }}
                  onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "var(--gray-700)"; (e.target as HTMLElement).style.background = "transparent"; }}>
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-2 ml-4">
            <Link href="/client" className="btn btn-outline btn-sm">
              Connexion
            </Link>
            <Link href="/client/register" className="btn btn-primary btn-sm">
              Ouvrir un compte
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(true)} className="lg:hidden ml-auto p-2 rounded-lg"
            style={{ color: "var(--gray-700)" }}
            aria-label="Menu">
            <Menu size={22}/>
          </button>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] flex lg:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)}/>
          {/* Drawer */}
          <div className="relative ml-auto w-full max-w-sm h-full flex flex-col overflow-y-auto shadow-2xl"
            style={{ background: "white" }}>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--gray-100)" }}>
              <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black"
                  style={{ background: "linear-gradient(135deg, var(--green-700), var(--green-500))" }}>KT</div>
                <span className="font-bold text-sm" style={{ color: "var(--green-800)" }}>KT Bank AG</span>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg"
                style={{ color: "var(--gray-600)", background: "var(--gray-100)" }}>
                <X size={18}/>
              </button>
            </div>

            {/* Nav items */}
            <div className="flex-1 px-4 py-4 space-y-1">
              {NAV.map((item) => (
                <div key={item.label}>
                  {item.mega ? (
                    <>
                      <button
                        onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                        className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold transition-colors"
                        style={{ color: "var(--gray-800)", background: mobileExpanded === item.label ? "var(--gray-50)" : "transparent" }}>
                        {item.label}
                        <ChevronDown size={16} style={{ transform: mobileExpanded === item.label ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}/>
                      </button>
                      {mobileExpanded === item.label && (
                        <div className="mt-1 ml-3 space-y-3 pb-2">
                          {item.mega.map((group) => (
                            <div key={group.group}>
                              <div className="text-[10px] font-bold uppercase tracking-widest px-2 mb-1" style={{ color: "var(--gray-400)" }}>
                                {group.group}
                              </div>
                              {group.items.map((sub) => (
                                <Link key={sub.href} href={sub.href}
                                  onClick={() => setMobileOpen(false)}
                                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors"
                                  style={{ color: "var(--gray-700)" }}
                                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--gray-50)")}
                                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                                  <span className="text-base">{sub.icon}</span>
                                  <span className="text-sm font-medium">{sub.label}</span>
                                  {sub.isNew && <span className="badge badge-new text-[10px] ml-auto">New</span>}
                                </Link>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link href={item.href} onClick={() => setMobileOpen(false)}
                      className="block px-3 py-3 rounded-xl text-sm font-semibold"
                      style={{ color: "var(--gray-800)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--gray-50)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile CTA */}
            <div className="p-4 border-t space-y-2" style={{ borderColor: "var(--gray-100)" }}>
              <Link href="/client/register" onClick={() => setMobileOpen(false)}
                className="btn btn-primary w-full justify-center">
                Ouvrir un compte gratuit
              </Link>
              <Link href="/client" onClick={() => setMobileOpen(false)}
                className="btn btn-outline w-full justify-center">
                Connexion espace client
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
