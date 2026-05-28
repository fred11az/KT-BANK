"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X, ArrowRight } from "lucide-react";

/* ── Desktop nav structure ── */
const DESKTOP_NAV = [
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
  { label: "Contact", href: "/contact" },
];

/* ── Mobile menu accordion structure ── */
const MOBILE_SECTIONS = [
  {
    heading: "Clients privés",
    items: [
      {
        label: "Comptes & Cartes",
        children: [
          { label: "Compte courant", href: "/products/giro-konto" },
          { label: "KT Jetzz Card", href: "/products/jetzz-card" },
          { label: "KT GoldKonto", href: "/products/gold-konto" },
        ],
      },
      {
        label: "Économiser",
        children: [
          { label: "KT FestgeldKonto", href: "/products/festgeld-konto" },
          { label: "KT JugendKonto", href: "/products/youth-savings" },
        ],
      },
      {
        label: "Financements",
        children: [
          { label: "Crédit Personnel", href: "/products/personal-loans" },
          { label: "Financement Auto", href: "/products/vehicle-financing" },
          { label: "Financement Immobilier", href: "/products/real-estate" },
        ],
      },
      {
        label: "Autres",
        children: [
          { label: "KT Donation & Zakat", href: "/products/donation" },
          { label: "Finance Islamique", href: "/islamic-banking" },
        ],
      },
      {
        label: "Service",
        children: [
          { label: "Contact", href: "/contact" },
          { label: "Agences", href: "/branches" },
        ],
      },
    ],
  },
  {
    heading: "Entreprise / Business",
    items: [
      {
        label: "Entreprise",
        children: [
          { label: "Solutions Corporate", href: "/corporate" },
          { label: "Crédit Pro & PME", href: "/products/corporate-credit" },
        ],
      },
      {
        label: "Aide",
        children: [
          { label: "Contact", href: "/contact" },
        ],
      },
    ],
  },
];

/* ── Logo component ── */
function Logo() {
  return (
    <div className="flex items-center gap-1.5">
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #005F2D, #008545)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: 900,
          fontSize: 13,
          flexShrink: 0,
        }}
      >
        KT
      </div>
      <span style={{ fontWeight: 900, fontSize: 18, color: "#005F2D", letterSpacing: -0.5 }}>
        Bank
      </span>
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
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

  const toggleAccordion = (key: string) => {
    setOpenAccordion((prev) => (prev === key ? null : key));
  };

  return (
    <>
      {/* ── Main header ── */}
      <header
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(255,255,255,0.96)" : "white",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          boxShadow: scrolled
            ? "0 1px 0 rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.06)"
            : "0 1px 0 #E5E7EB",
        }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-16 relative">

          {/* Mobile: hamburger left */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg"
            style={{ color: "var(--gray-700)" }}
            aria-label="Ouvrir le menu"
          >
            <Menu size={22} />
          </button>

          {/* Mobile: Logo centered absolutely */}
          <Link
            href="/"
            className="lg:hidden"
            style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}
            aria-label="KT Bank — accueil"
          >
            <Logo />
          </Link>

          {/* Desktop: Logo left */}
          <Link href="/" className="hidden lg:flex items-center mr-10 flex-shrink-0" aria-label="KT Bank — accueil">
            <Logo />
          </Link>

          {/* Desktop: Nav links center */}
          <div className="hidden lg:flex items-center gap-1 flex-1">
            {DESKTOP_NAV.map((item) =>
              item.mega ? (
                <div
                  key={item.label}
                  ref={megaRef}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  className="relative"
                >
                  <button
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{ color: megaOpen ? "var(--green-700)" : "var(--gray-700)" }}
                    onClick={() => setMegaOpen(!megaOpen)}
                  >
                    {item.label}
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${megaOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Mega menu */}
                  {megaOpen && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[680px] rounded-2xl shadow-2xl overflow-hidden"
                      style={{ background: "white", border: "1px solid var(--gray-200)" }}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="grid grid-cols-3 gap-0 p-5">
                        {item.mega.map((group) => (
                          <div key={group.group}>
                            <div
                              className="text-xs font-bold uppercase tracking-widest mb-3 px-2"
                              style={{ color: "var(--gray-400)" }}
                            >
                              {group.group}
                            </div>
                            <div className="space-y-0.5">
                              {group.items.map((sub) => (
                                <Link
                                  key={sub.href}
                                  href={sub.href}
                                  onClick={() => setMegaOpen(false)}
                                  className="flex items-start gap-3 px-2 py-2 rounded-xl transition-colors group"
                                  style={{ color: "inherit" }}
                                  onMouseEnter={(e) =>
                                    (e.currentTarget.style.background = "var(--gray-50)")
                                  }
                                  onMouseLeave={(e) =>
                                    (e.currentTarget.style.background = "transparent")
                                  }
                                >
                                  <span className="text-xl mt-0.5 flex-shrink-0">{sub.icon}</span>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span
                                        className="text-sm font-semibold"
                                        style={{ color: "var(--gray-900)" }}
                                      >
                                        {sub.label}
                                      </span>
                                      {sub.isNew && (
                                        <span className="badge badge-new text-[10px] py-0.5">
                                          Nouveau
                                        </span>
                                      )}
                                    </div>
                                    <div
                                      className="text-xs mt-0.5"
                                      style={{ color: "var(--gray-500)" }}
                                    >
                                      {sub.sub}
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div
                        className="px-5 py-3 border-t flex items-center justify-between"
                        style={{
                          background: "var(--gray-50)",
                          borderColor: "var(--gray-200)",
                        }}
                      >
                        <span className="text-xs" style={{ color: "var(--gray-500)" }}>
                          🏅 10 produits 100% halal certifiés
                        </span>
                        <Link
                          href="/products"
                          onClick={() => setMegaOpen(false)}
                          className="text-xs font-semibold flex items-center gap-1 transition-colors"
                          style={{ color: "var(--green-700)" }}
                        >
                          Voir tout <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{ color: "var(--gray-700)" }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.color = "var(--green-700)";
                    (e.target as HTMLElement).style.background = "var(--gray-50)";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.color = "var(--gray-700)";
                    (e.target as HTMLElement).style.background = "transparent";
                  }}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* Desktop: CTA buttons right */}
          <div className="hidden lg:flex items-center gap-2 ml-4">
            <Link href="/client" className="btn btn-outline btn-sm">
              Connexion
            </Link>
            <Link href="/client/register" className="btn btn-primary btn-sm">
              Ouvrir un compte
            </Link>
          </div>

          {/* Mobile: CTA pill right */}
          <div className="lg:hidden ml-auto">
            <Link
              href="/client/register"
              className="btn btn-primary btn-sm"
              style={{ fontSize: "0.75rem", padding: "8px 14px" }}
            >
              Ouvrir un compte
            </Link>
          </div>
        </nav>
      </header>

      {/* ── Mobile full-screen overlay menu ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[100] flex flex-col overflow-y-auto lg:hidden"
          style={{ background: "#005F2D" }}
        >
          {/* Top row */}
          <div className="flex items-center justify-between px-5 py-4 flex-shrink-0">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-1.5"
              aria-label="KT Bank — accueil"
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: 900,
                  fontSize: 13,
                  flexShrink: 0,
                }}
              >
                KT
              </div>
              <span style={{ fontWeight: 900, fontSize: 18, color: "white", letterSpacing: -0.5 }}>
                Bank
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <span
                className="text-sm font-medium"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                🌐 FR
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-full"
                style={{ background: "rgba(255,255,255,0.12)", color: "white" }}
                aria-label="Fermer le menu"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Accordion sections */}
          <div className="flex-1 px-4 py-2 space-y-6">
            {MOBILE_SECTIONS.map((section) => (
              <div key={section.heading}>
                {/* Section heading */}
                <div
                  className="text-xs font-bold uppercase tracking-widest mb-3 px-1"
                  style={{ color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em" }}
                >
                  {section.heading}
                </div>

                {/* Accordion items */}
                <div className="space-y-2">
                  {section.items.map((item) => {
                    const key = `${section.heading}__${item.label}`;
                    const isOpen = openAccordion === key;
                    return (
                      <div
                        key={item.label}
                        className="rounded-xl overflow-hidden"
                        style={{ border: "1px solid rgba(255,255,255,0.2)" }}
                      >
                        <button
                          onClick={() => toggleAccordion(key)}
                          className="w-full flex items-center justify-between px-4 py-3.5"
                          style={{ color: "white", background: "transparent" }}
                        >
                          <span className="text-sm font-semibold">{item.label}</span>
                          <ChevronDown
                            size={16}
                            style={{
                              color: "rgba(255,255,255,0.7)",
                              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                              transition: "transform 0.2s",
                            }}
                          />
                        </button>

                        {isOpen && (
                          <div
                            className="px-4 pb-3 pt-1 space-y-1"
                            style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
                          >
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => setMobileOpen(false)}
                                className="block py-2.5 px-2 text-sm rounded-lg transition-colors"
                                style={{ color: "rgba(255,255,255,0.85)" }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.color = "white")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.color = "rgba(255,255,255,0.85)")
                                }
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA area */}
          <div className="px-4 py-6 space-y-3 flex-shrink-0">
            <Link
              href="/client/register"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center py-3.5 rounded-full font-bold text-sm"
              style={{
                background: "white",
                color: "#005F2D",
              }}
            >
              Ouvrir un compte
            </Link>
            <Link
              href="/client"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center py-2.5 font-semibold text-sm"
              style={{ color: "rgba(255,255,255,0.85)" }}
            >
              Connexion →
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
