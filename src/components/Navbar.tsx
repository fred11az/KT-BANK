"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X, ArrowRight, Lock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Lang } from "@/lib/translations";

function Logo({ white }: { white?: boolean }) {
  return (
    <div className="flex items-center">
      <Image
        src="/kt-logo.png"
        alt="KT Bank"
        width={120}
        height={34}
        style={{ objectFit: "contain", filter: white ? "brightness(0) invert(1)" : "none" }}
        priority
      />
    </div>
  );
}

function LangToggle({ compact }: { compact?: boolean }) {
  const { lang, setLang } = useLanguage();
  const other: Lang = lang === "de" ? "fr" : "de";
  return (
    <button
      onClick={() => setLang(other)}
      title={lang === "de" ? "Auf Französisch wechseln" : "Passer en allemand"}
      style={{
        display:"flex", alignItems:"center", gap:4, padding: compact ? "4px 8px" : "4px 10px",
        borderRadius:999, border: compact ? "1px solid rgba(255,255,255,0.3)" : "1px solid #E5E7EB",
        background: compact ? "rgba(255,255,255,0.12)" : "transparent",
        cursor:"pointer", fontWeight:700, fontSize:"0.78rem",
        color: compact ? "white" : "#005F2D",
        letterSpacing:"0.04em",
      }}
    >
      <span style={{ fontSize:"0.85rem" }}>{lang === "de" ? "🇩🇪" : "🇫🇷"}</span>
      {lang.toUpperCase()}
      <ChevronDown size={10}/>
    </button>
  );
}

export default function Navbar() {
  const { t } = useLanguage();
  const n = t.nav;

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

  const enterMega = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setMegaOpen(true); };
  const leaveMega = () => { timeoutRef.current = setTimeout(() => setMegaOpen(false), 150); };
  const toggleAcc = (k: string) => setOpenAccordion((p) => p === k ? null : k);

  /* Desktop mega menu data */
  const MEGA = [
    {
      group: n.groups.accounts,
      items: [
        { label: n.items.giro, sub: n.items.giroSub, icon: "💳", href: "/products/giro-konto" },
        { label: n.items.gold, sub: n.items.goldSub, icon: "🥇", href: "/products/gold-konto" },
        { label: n.items.jetzz, sub: n.items.jetzzSub, icon: "💎", href: "/products/jetzz-card" },
      ],
    },
    {
      group: n.groups.financing,
      items: [
        { label: n.items.personalLoan, sub: n.items.personalLoanSub, icon: "💰", href: "/products/personal-loans" },
        { label: n.items.vehicleFinancing, sub: n.items.vehicleFinancingSub, icon: "🚗", href: "/products/vehicle-financing" },
        { label: n.items.realEstate, sub: n.items.realEstateSub, icon: "🏠", href: "/products/real-estate", isNew: true },
      ],
    },
    {
      group: n.groups.savings,
      items: [
        { label: n.items.festgeld, sub: n.items.festgeldSub, icon: "📈", href: "/products/festgeld-konto" },
        { label: n.items.donation, sub: n.items.donationSub, icon: "🤲", href: "/products/donation", isNew: true },
        { label: n.items.corporate, sub: n.items.corporateSub, icon: "🏢", href: "/products/corporate-credit", isNew: true },
        { label: n.items.youth, sub: n.items.youthSub, icon: "🌱", href: "/products/youth-savings", isNew: true },
      ],
    },
  ];

  /* Mobile accordion data */
  const MOBILE = [
    {
      heading: n.privateCustomers,
      items: [
        { label: n.categories.accountsCards, children: [
          { label: n.items.giro, href: "/products/giro-konto" },
          { label: n.items.jetzz, href: "/products/jetzz-card" },
          { label: n.items.gold, href: "/products/gold-konto" },
        ]},
        { label: n.categories.save, children: [
          { label: n.items.festgeld, href: "/products/festgeld-konto" },
          { label: n.items.youth, href: "/products/youth-savings" },
        ]},
        { label: n.categories.financing, children: [
          { label: n.items.personalLoan, href: "/products/personal-loans" },
          { label: n.items.vehicleFinancing, href: "/products/vehicle-financing" },
          { label: n.items.realEstate, href: "/products/real-estate" },
        ]},
        { label: n.categories.other, children: [
          { label: n.items.donation, href: "/products/donation" },
          { label: n.islamicBanking, href: "/islamic-banking" },
        ]},
        { label: n.categories.service, children: [
          { label: n.contact, href: "/contact" },
          { label: n.items.branches, href: "/branches" },
        ]},
      ],
    },
    {
      heading: n.business,
      items: [
        { label: n.categories.company, children: [
          { label: n.items.solutions, href: "/corporate" },
          { label: n.items.pme, href: "/products/corporate-credit" },
        ]},
        { label: n.categories.help, children: [
          { label: n.contact, href: "/contact" },
        ]},
      ],
    },
  ];

  return (
    <>
      {/* ── Top info strip ── */}
      <div style={{ background:"#F2F2F2", borderBottom:"1px solid #E5E7EB" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between" style={{ height:40 }}>
          {/* Customers tab */}
          <span style={{ display:"inline-flex", alignItems:"center", background:"#005F2D", color:"white", fontWeight:600, fontSize:"0.8rem", padding:"4px 14px", borderRadius:999 }}>
            {n.customers}
          </span>
          {/* Right: lang + login */}
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <LangToggle/>
            <Link href="/client/login" style={{ display:"flex", alignItems:"center", gap:5, color:"#374151", fontSize:"0.82rem", fontWeight:500, textDecoration:"none" }}>
              <Lock size={14}/> {n.login}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main header ── */}
      <header className="sticky top-0 z-50 transition-all duration-300"
        style={{ background: scrolled ? "rgba(255,255,255,0.96)" : "white", backdropFilter: scrolled ? "blur(20px)" : "none",
          boxShadow: scrolled ? "0 1px 0 rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.06)" : "0 1px 0 #E5E7EB" }}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-16 relative">

          {/* Mobile: hamburger */}
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg" style={{ color:"var(--gray-700)" }} aria-label="Menu">
            <Menu size={22}/>
          </button>

          {/* Mobile: Logo centered */}
          <Link href="/" className="lg:hidden" style={{ position:"absolute", left:"50%", transform:"translateX(-50%)" }} aria-label="KT Bank">
            <Logo/>
          </Link>

          {/* Desktop: Logo */}
          <Link href="/" className="hidden lg:flex items-center mr-10 flex-shrink-0" aria-label="KT Bank">
            <Logo/>
          </Link>

          {/* Desktop: Links */}
          <div className="hidden lg:flex items-center gap-1 flex-1">
            {/* Products with mega */}
            <div ref={megaRef} onMouseEnter={enterMega} onMouseLeave={leaveMega} className="relative">
              <button onClick={() => setMegaOpen(!megaOpen)}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ color: megaOpen ? "var(--green-700)" : "var(--gray-700)" }}>
                {n.products}
                <ChevronDown size={14} className={`transition-transform ${megaOpen ? "rotate-180" : ""}`}/>
              </button>
              {megaOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[680px] rounded-2xl shadow-2xl overflow-hidden"
                  style={{ background:"white", border:"1px solid var(--gray-200)" }}
                  onMouseEnter={enterMega} onMouseLeave={leaveMega}>
                  <div className="grid grid-cols-3 gap-0 p-5">
                    {MEGA.map((group) => (
                      <div key={group.group}>
                        <div className="text-xs font-bold uppercase tracking-widest mb-3 px-2" style={{ color:"var(--gray-400)" }}>{group.group}</div>
                        <div className="space-y-0.5">
                          {group.items.map((sub) => (
                            <Link key={sub.href} href={sub.href} onClick={() => setMegaOpen(false)}
                              className="flex items-start gap-3 px-2 py-2 rounded-xl transition-colors"
                              style={{ color:"inherit" }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--gray-50)")}
                              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                              <span className="text-xl mt-0.5 flex-shrink-0">{sub.icon}</span>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold" style={{ color:"var(--gray-900)" }}>{sub.label}</span>
                                  {"isNew" in sub && sub.isNew && <span className="badge badge-new text-[10px] py-0.5">{n.items.new}</span>}
                                </div>
                                <div className="text-xs mt-0.5" style={{ color:"var(--gray-500)" }}>{sub.sub}</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-5 py-3 border-t flex items-center justify-between" style={{ background:"var(--gray-50)", borderColor:"var(--gray-200)" }}>
                    <span className="text-xs" style={{ color:"var(--gray-500)" }}>{n.halalBadge}</span>
                    <Link href="/products" onClick={() => setMegaOpen(false)} className="text-xs font-semibold flex items-center gap-1" style={{ color:"var(--green-700)" }}>
                      {n.seeAll} <ArrowRight size={12}/>
                    </Link>
                  </div>
                </div>
              )}
            </div>
            {[
              { label: n.corporate, href: "/corporate" },
              { label: n.islamicBanking, href: "/islamic-banking" },
              { label: n.contact, href: "/contact" },
            ].map((item) => (
              <Link key={item.href} href={item.href}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ color:"var(--gray-700)" }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.color="var(--green-700)"; (e.target as HTMLElement).style.background="var(--gray-50)"; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.color="var(--gray-700)"; (e.target as HTMLElement).style.background="transparent"; }}>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop: CTAs */}
          <div className="hidden lg:flex items-center gap-2 ml-4">
            <Link href="/client/login" className="btn btn-outline btn-sm">{n.login}</Link>
            <Link href="/client/register" className="btn btn-primary btn-sm">{n.openAccount}</Link>
          </div>

          {/* Mobile: CTA */}
          <div className="lg:hidden ml-auto">
            <Link href="/client/register" className="btn btn-primary btn-sm" style={{ fontSize:"0.75rem", padding:"8px 14px" }}>
              {n.openAccount}
            </Link>
          </div>
        </nav>
      </header>

      {/* ── Mobile overlay menu ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col overflow-y-auto lg:hidden" style={{ background:"#005F2D" }}>
          <div className="flex items-center justify-between px-5 py-4 flex-shrink-0">
            <Link href="/" onClick={() => setMobileOpen(false)}>
              <Logo white/>
            </Link>
            <div className="flex items-center gap-3">
              <LangToggle compact/>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-full"
                style={{ background:"rgba(255,255,255,0.12)", color:"white" }} aria-label="Schließen / Fermer">
                <X size={18}/>
              </button>
            </div>
          </div>

          <div className="flex-1 px-4 py-2 space-y-6">
            {MOBILE.map((section) => (
              <div key={section.heading}>
                <div className="text-xs font-bold uppercase tracking-widest mb-3 px-1" style={{ color:"rgba(255,255,255,0.45)", letterSpacing:"0.1em" }}>
                  {section.heading}
                </div>
                <div className="space-y-2">
                  {section.items.map((item) => {
                    const key = `${section.heading}__${item.label}`;
                    const isOpen = openAccordion === key;
                    return (
                      <div key={item.label} className="rounded-xl overflow-hidden" style={{ border:"1px solid rgba(255,255,255,0.2)" }}>
                        <button onClick={() => toggleAcc(key)} className="w-full flex items-center justify-between px-4 py-3.5" style={{ color:"white", background:"transparent" }}>
                          <span className="text-sm font-semibold">{item.label}</span>
                          <ChevronDown size={16} style={{ color:"rgba(255,255,255,0.7)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition:"transform 0.2s" }}/>
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-3 pt-1 space-y-1" style={{ borderTop:"1px solid rgba(255,255,255,0.1)" }}>
                            {item.children.map((child) => (
                              <Link key={child.href} href={child.href} onClick={() => setMobileOpen(false)}
                                className="block py-2.5 px-2 text-sm rounded-lg" style={{ color:"rgba(255,255,255,0.85)" }}>
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

          <div className="px-4 py-6 space-y-3 flex-shrink-0">
            <Link href="/client/register" onClick={() => setMobileOpen(false)}
              className="block w-full text-center py-3.5 rounded-full font-bold text-sm"
              style={{ background:"white", color:"#005F2D" }}>
              {n.openAccount}
            </Link>
            <Link href="/client/login" onClick={() => setMobileOpen(false)}
              className="block w-full text-center py-2.5 font-semibold text-sm"
              style={{ color:"rgba(255,255,255,0.85)" }}>
              {n.connect}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
