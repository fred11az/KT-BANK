"use client";
import Link from "next/link";
import { ArrowRight, CheckCircle, Star, Shield, Zap, Globe, TrendingUp, ChevronRight } from "lucide-react";

/* ─────────── DATA ─────────── */
const PRODUCTS = [
  { id: "giro-konto",       icon: "💳", name: "KT GiroKonto",          cat: "Compte courant",   tag: "Gratuit",    desc: "Compte courant sans frais, IBAN allemand, app mobile.",          color: "#005F2D", popular: false, isNew: false },
  { id: "gold-konto",       icon: "🥇", name: "KT GoldKonto",          cat: "Investissement",   tag: "+4.2 %/an",  desc: "Investissez dans l'or physique certifié LBMA dès 1 €.",           color: "#B07D12", popular: true,  isNew: false },
  { id: "jetzz-card",       icon: "💎", name: "KT Jetzz Card",         cat: "Carte",            tag: "0 €/an",     desc: "Carte sans frais, paiement en 3–24 mois sans intérêts.",          color: "#1D4ED8", popular: false, isNew: false },
  { id: "personal-loans",   icon: "💰", name: "Crédit Personnel",      cat: "Financement",      tag: "50 000 €",   desc: "Financement halal jusqu'à 50 000 €, réponse en 24 h.",            color: "#7C3AED", popular: false, isNew: false },
  { id: "vehicle-financing",icon: "🚗", name: "Financement Auto",      cat: "Financement",      tag: "100 mois",   desc: "Murabaha auto — neuf & occasion, accord instantané.",             color: "#1E40AF", popular: false, isNew: false },
  { id: "festgeld-konto",   icon: "📈", name: "KT FestgeldKonto",      cat: "Épargne",          tag: "4.5 %",      desc: "Rendement garanti au-dessus du marché, 3–12 mois.",              color: "#059669", popular: false, isNew: false },
  { id: "donation",         icon: "🤲", name: "KT Donation & Zakat",   cat: "Solidarité",       tag: "Nouveau",    desc: "Calculateur Zakat intégré, dons certifiés, reçu fiscal.",         color: "#D97706", popular: false, isNew: true  },
  { id: "corporate-credit", icon: "🏢", name: "Crédit Pro & PME",      cat: "Entreprise",       tag: "5 M€",       desc: "Musharaka, Mudaraba, Ijara pour les entrepreneurs.",              color: "#0F172A", popular: false, isNew: true  },
  { id: "youth-savings",    icon: "🌱", name: "KT JugendKonto",        cat: "Jeunesse",         tag: "0–25 ans",   desc: "Épargne halal jeunesse, bonus 50 € de bienvenue.",                color: "#10B981", popular: false, isNew: true  },
  { id: "real-estate",      icon: "🏠", name: "Financement Immobilier",cat: "Immobilier",       tag: "Nouveau",    desc: "Achetez via Murabaha ou Diminishing Musharaka.",                  color: "#B45309", popular: false, isNew: true  },
];

const STATS = [
  { n: "50 000+", l: "Clients" },
  { n: "€2.5 Mrd", l: "Actifs gérés" },
  { n: "4", l: "Agences" },
  { n: "9 ans", l: "d'excellence" },
];

const TESTIMONIALS = [
  { name: "Ahmed K.", role: "Client depuis 2018", text: "Enfin une banque qui respecte mes valeurs. Simple, moderne, et vraiment halal.", rating: 5 },
  { name: "Fatima M.", role: "Cliente depuis 2020", text: "Le GoldKonto est excellent. J'investis en or en quelques clics, les rendements sont au rendez-vous.", rating: 5 },
  { name: "Yusuf B.", role: "Client Entreprise",   text: "Le Crédit Pro m'a permis de financer mon expansion. Accompagnement remarquable.", rating: 5 },
  { name: "Mariam L.", role: "Cliente depuis 2021", text: "Le JugendKonto pour mes enfants — parfait pour les initier à l'épargne halal.", rating: 5 },
];

/* ─────────── HERO ─────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #002B14 0%, #004020 35%, #005F2D 70%, #007038 100%)" }}>

      {/* Grid pattern */}
      <div className="absolute inset-0 hero-grid opacity-100 pointer-events-none"/>

      {/* Glow blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(201,146,26,0.12) 0%, transparent 65%)" }}/>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,133,69,0.2) 0%, transparent 65%)" }}/>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-32 lg:pt-28 lg:pb-40">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 animate-fade-up"
              style={{ background: "rgba(201,146,26,0.15)", border: "1px solid rgba(201,146,26,0.3)", color: "#E8C96B" }}>
              🌙 Première banque islamique agréée en Allemagne
            </div>

            <h1 className="text-display text-white mb-5 animate-fade-up delay-100">
              Mes Valeurs,{" "}
              <span className="text-gradient-gold">Ma Banque.</span>
            </h1>

            <p className="text-body-lg mb-8 animate-fade-up delay-200"
              style={{ color: "rgba(255,255,255,0.72)", maxWidth: "480px" }}>
              Des services bancaires complets, conformes à la charia.
              Régulée BaFin, certifiée Sharia Board — pour les 50 000 familles qui nous font confiance.
            </p>

            <div className="flex flex-wrap gap-3 mb-10 animate-fade-up delay-300">
              {["✅ 100 % Halal", "🛡️ BaFin régulée", "💰 Dépôts garantis"].map(t => (
                <span key={t} className="text-small font-medium px-3.5 py-1.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.15)" }}>
                  {t}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 animate-fade-up delay-400">
              <Link href="/client/register" className="btn btn-gold btn-xl">
                Ouvrir un compte gratuit <ArrowRight size={18}/>
              </Link>
              <Link href="/products" className="btn btn-outline-white btn-xl">
                Nos produits
              </Link>
            </div>
          </div>

          {/* Right — card mockup */}
          <div className="relative flex justify-center lg:justify-end animate-fade-in delay-300">
            <div className="relative w-full max-w-sm">

              {/* Main bank card */}
              <div className="card-glass rounded-2xl p-6 text-white shadow-2xl animate-float">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="text-xs font-medium mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>KT GiroKonto</div>
                    <div className="text-2xl font-black tracking-tight">€ 24 850,00</div>
                  </div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black"
                    style={{ background: "rgba(201,146,26,0.3)", color: "#E8C96B" }}>
                    KT
                  </div>
                </div>
                <div className="text-sm font-mono mb-5" style={{ color: "rgba(255,255,255,0.5)", letterSpacing: "0.15em" }}>
                  •••• •••• •••• 8492
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>Titulaire</div>
                    <div className="text-sm font-semibold">Ahmed Al-Rashid</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>Expire</div>
                    <div className="text-sm font-semibold">12/28</div>
                  </div>
                </div>
              </div>

              {/* Floating stat — top right */}
              <div className="absolute -top-3 -right-3 sm:-right-6 card rounded-xl px-4 py-3 shadow-xl animate-fade-up delay-400">
                <div className="text-xs font-medium mb-0.5" style={{ color: "var(--gray-500)" }}>GoldKonto</div>
                <div className="text-xl font-black" style={{ color: "var(--gold-400)" }}>+4.2 %</div>
                <div className="flex items-center gap-1 text-xs font-medium mt-0.5" style={{ color: "var(--green-600)" }}>
                  <TrendingUp size={11}/> Ce mois
                </div>
              </div>

              {/* Floating stat — bottom left */}
              <div className="absolute -bottom-3 -left-3 sm:-left-6 card rounded-xl px-4 py-3 shadow-xl animate-fade-up delay-500">
                <div className="text-xs font-medium mb-0.5" style={{ color: "var(--gray-500)" }}>Zakat 2024</div>
                <div className="text-xl font-black" style={{ color: "var(--green-700)" }}>€ 620</div>
                <div className="text-xs" style={{ color: "var(--gray-400)" }}>Auto-calculé</div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 gap-2 mt-8">
                {STATS.map(s => (
                  <div key={s.l} className="card-glass rounded-xl p-3 text-center">
                    <div className="text-lg font-black text-white">{s.n}</div>
                    <div className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
        style={{ background: "linear-gradient(to top, #FAFAFA, transparent)" }}/>
    </section>
  );
}

/* ─────────── TRUST BAR ─────────── */
function TrustBar() {
  const items = [
    { icon: "🏛️", text: "Régulée BaFin" },
    { icon: "🛡️", text: "Dépôts garantis 100 K€" },
    { icon: "☪️", text: "Certifié Shariah Board" },
    { icon: "🔐", text: "SSL / 2FA" },
    { icon: "📱", text: "App Store 4.8 ★" },
    { icon: "🤝", text: "50 000+ clients" },
  ];
  return (
    <section className="py-5 border-b" style={{ background: "white", borderColor: "var(--gray-200)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {items.map(i => (
            <div key={i.text} className="flex items-center gap-2 text-small font-medium" style={{ color: "var(--gray-500)" }}>
              <span className="text-base">{i.icon}</span>{i.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────── PRODUCTS ─────────── */
function Products() {
  return (
    <section className="py-24" style={{ background: "var(--gray-50)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="section-label mx-auto inline-flex">Nos Produits</div>
          <h2 className="text-heading" style={{ color: "var(--gray-900)" }}>
            Une solution pour{" "}
            <span className="text-gradient">chaque besoin</span>
          </h2>
          <p className="text-body mt-3 mx-auto" style={{ color: "var(--gray-500)", maxWidth: "520px" }}>
            10 produits 100 % halal — comptes, épargne, financements, investissements et nouvelles offres exclusives.
          </p>
          <div className="divider-gold"/>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
          {PRODUCTS.map((p, i) => (
            <Link key={p.id} href={`/products/${p.id}`}
              className="card card-interactive flex flex-col p-5 animate-fade-up"
              style={{ animationDelay: `${i * 40}ms` }}>
              {/* accent line */}
              <div className="h-0.5 w-full rounded-t-xl mb-5 -mx-5 -mt-5 px-0"
                style={{ background: p.color, width: "calc(100% + 40px)", maxWidth: "none", borderRadius: "var(--radius-xl) var(--radius-xl) 0 0" }}/>

              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{p.icon}</span>
                <div className="flex gap-1.5">
                  {p.popular && <span className="badge badge-green">⭐ Top</span>}
                  {p.isNew && <span className="badge badge-new">Nouveau</span>}
                </div>
              </div>

              <div className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: p.color }}>{p.cat}</div>
              <h3 className="font-bold text-base mb-2" style={{ color: "var(--gray-900)" }}>{p.name}</h3>
              <p className="text-small flex-1 mb-4" style={{ color: "var(--gray-500)" }}>{p.desc}</p>

              <div className="flex items-center justify-between pt-3 border-t mt-auto" style={{ borderColor: "var(--gray-100)" }}>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg"
                  style={{ background: `${p.color}12`, color: p.color }}>
                  {p.tag}
                </span>
                <span className="text-xs font-semibold flex items-center gap-0.5 transition-all group-hover:gap-1.5"
                  style={{ color: "var(--green-700)" }}>
                  Voir <ChevronRight size={12}/>
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/products" className="btn btn-outline">
            Voir tous les produits <ArrowRight size={16}/>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────── ISLAMIC BANKING ─────────── */
function IslamicSection() {
  return (
    <section className="py-24" style={{ background: "white" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="section-label">☪️ Finance Islamique</div>
            <h2 className="text-heading mb-5" style={{ color: "var(--gray-900)" }}>
              La banque qui{" "}
              <span className="text-gradient">respecte vos valeurs</span>
            </h2>
            <p className="text-body-lg mb-8" style={{ color: "var(--gray-600)" }}>
              Fondée sur les principes de la charia islamique, KT Bank AG interdit
              les intérêts (riba), la spéculation (gharar) et n'investit que dans
              des secteurs licites et éthiques.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { icon: "🚫", t: "Sans Riba", s: "Zéro intérêt sur tous nos produits" },
                { icon: "✅", t: "Halal certifié", s: "Validé par le Shariah Board" },
                { icon: "🌿", t: "Éthique", s: "Investissements responsables" },
                { icon: "🤝", t: "Partage des profits", s: "Musharaka & Mudaraba" },
              ].map(x => (
                <div key={x.t} className="p-4 rounded-2xl border" style={{ borderColor: "var(--gray-200)" }}>
                  <span className="text-xl">{x.icon}</span>
                  <div className="font-semibold text-sm mt-2 mb-0.5" style={{ color: "var(--gray-900)" }}>{x.t}</div>
                  <div className="text-xs" style={{ color: "var(--gray-500)" }}>{x.s}</div>
                </div>
              ))}
            </div>
            <Link href="/islamic-banking" className="btn btn-primary">
              En savoir plus <ArrowRight size={16}/>
            </Link>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=700&q=85"
                alt="Finance islamique" className="w-full h-80 object-cover"/>
              <div className="p-6" style={{ background: "var(--green-700)" }}>
                <div className="text-white font-bold text-lg mb-1">Shariah Board Certifié</div>
                <div className="text-sm" style={{ color: "rgba(255,255,255,0.72)" }}>
                  Chaque produit est validé par nos 5 érudits islamiques indépendants.
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-5 card rounded-2xl p-4 shadow-xl">
              <div className="text-2xl mb-1">☪️</div>
              <div className="font-bold text-sm" style={{ color: "var(--gray-900)" }}>100 % Halal</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--gray-500)" }}>Académie Islamique Fiqh</div>
              <div className="flex gap-0.5 mt-1.5">
                {[1,2,3,4,5].map(i => <Star key={i} size={11} style={{ fill: "#FBBF24", color: "#FBBF24" }}/>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── NEW PRODUCTS HIGHLIGHT ─────────── */
function NewProducts() {
  const items = [
    { icon: "🤲", t: "KT Donation & Zakat",    d: "Calculateur Zakat, dons certifiés ONG, reçu fiscal automatique.", href: "/products/donation",         col: "#D97706" },
    { icon: "🏢", t: "Crédit Pro & PME",        d: "Musharaka, Mudaraba, Ijara. De 50 K€ à 5 M€ pour les entrepreneurs.", href: "/products/corporate-credit", col: "#E8C96B" },
    { icon: "🌱", t: "KT JugendKonto",          d: "Compte jeunesse halal dès la naissance. Bonus de bienvenue 50 €.", href: "/products/youth-savings",    col: "#10B981" },
    { icon: "🏠", t: "Financement Immobilier",  d: "Achetez via Murabaha ou Diminishing Musharaka — sans intérêts.", href: "/products/real-estate",      col: "#C9A84C" },
  ];
  return (
    <section className="py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, var(--green-900) 0%, var(--green-800) 50%, var(--green-700) 100%)" }}>
      <div className="absolute inset-0 hero-grid pointer-events-none"/>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{ background: "rgba(201,146,26,0.15)", border: "1px solid rgba(201,146,26,0.3)", color: "#E8C96B" }}>
            ✦ Nouvelles offres exclusives
          </div>
          <h2 className="text-heading text-white mb-3">
            Des produits qui n'existaient pas.{" "}
            <span className="text-gradient-gold">Maintenant oui.</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)" }} className="text-body">
            Nous avons développé des produits islamiques innovants pour vos besoins spécifiques.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {items.map((item, i) => (
            <Link key={item.href} href={item.href}
              className="group flex flex-col p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl animate-fade-up"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", animationDelay: `${i*80}ms` }}>
              <span className="text-4xl mb-4">{item.icon}</span>
              <h3 className="font-bold text-base text-white mb-2">{item.t}</h3>
              <p className="text-small flex-1 mb-4" style={{ color: "rgba(255,255,255,0.6)" }}>{item.d}</p>
              <span className="flex items-center gap-1 text-xs font-semibold transition-all group-hover:gap-2"
                style={{ color: item.col }}>
                Découvrir <ArrowRight size={12}/>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────── STATS ─────────── */
function Stats() {
  const items = [
    { n: "50 000+", l: "Clients satisfaits",    icon: "👥", c: "var(--green-700)" },
    { n: "€ 2.5 Mrd", l: "Actifs sous gestion", icon: "💰", c: "var(--gold-400)" },
    { n: "4",          l: "Agences en Allemagne",icon: "🏦", c: "var(--green-700)" },
    { n: "9+",         l: "Années d'excellence", icon: "⭐", c: "var(--gold-400)" },
  ];
  return (
    <section className="py-20" style={{ background: "white" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {items.map(s => (
            <div key={s.l} className="card text-center p-6 lg:p-8">
              <span className="text-3xl mb-3 block">{s.icon}</span>
              <div className="font-black mb-1.5" style={{ fontSize: "clamp(1.75rem,3vw,2.5rem)", color: s.c }}>{s.n}</div>
              <div className="text-small font-medium" style={{ color: "var(--gray-500)" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────── TESTIMONIALS ─────────── */
function Testimonials() {
  return (
    <section className="py-24" style={{ background: "var(--gray-50)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="section-label mx-auto inline-flex">Témoignages</div>
          <h2 className="text-heading" style={{ color: "var(--gray-900)" }}>
            Ce que disent nos <span className="text-gradient">clients</span>
          </h2>
          <div className="divider-gold"/>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name} className="card p-6 flex flex-col animate-fade-up" style={{ animationDelay: `${i*80}ms` }}>
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.rating)].map((_,j) => <Star key={j} size={13} style={{ fill: "#FBBF24", color: "#FBBF24" }}/>)}
              </div>
              <p className="text-small flex-1 mb-5 italic" style={{ color: "var(--gray-600)" }}>
                "{t.text}"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: "var(--gray-100)" }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, var(--green-700), var(--green-500))" }}>
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: "var(--gray-900)" }}>{t.name}</div>
                  <div className="text-xs" style={{ color: "var(--gray-400)" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────── WHY US ─────────── */
function WhyUs() {
  return (
    <section className="py-24" style={{ background: "white" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-heading" style={{ color: "var(--gray-900)" }}>
            Pourquoi choisir <span className="text-gradient">KT Bank ?</span>
          </h2>
          <div className="divider-gold"/>
        </div>
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {[
            { icon: <Shield size={28}/>, t: "Sécurité maximale", d: "BaFin régulée · Dépôts garantis jusqu'à 100 000 € par l'EDB · Certification ISO 27001.", col: "var(--green-700)" },
            { icon: <Globe size={28}/>, t: "100 % Islamique", d: "Seule banque islamique complète en Allemagne. Certifiée AAOIFI par un Shariah Board indépendant de 5 érudits.", col: "var(--green-700)" },
            { icon: <Zap size={28}/>, t: "Digital & Moderne", d: "Ouverture de compte en 10 min, app mobile intuitive, virements instantanés, notifications en temps réel.", col: "var(--green-700)" },
          ].map(x => (
            <div key={x.t} className="card p-8 text-center group">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ background: "var(--green-50)", color: x.col }}>
                {x.icon}
              </div>
              <h3 className="font-bold text-lg mb-3" style={{ color: "var(--gray-900)" }}>{x.t}</h3>
              <p className="text-small" style={{ color: "var(--gray-500)" }}>{x.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────── CTA ─────────── */
function CTA() {
  return (
    <section className="py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, var(--gold-500) 0%, var(--gold-300) 50%, var(--gold-200) 100%)" }}>
      <div className="absolute inset-0 hero-grid pointer-events-none opacity-40"/>
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-heading text-white mb-4">
          Prêt à rejoindre KT Bank ?
        </h2>
        <p className="text-body-lg mb-10" style={{ color: "rgba(255,255,255,0.85)" }}>
          Ouvrez votre compte en 10 minutes. 100 % en ligne, 100 % halal, 100 % gratuit.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/client/register" className="btn btn-xl"
            style={{ background: "var(--green-700)", color: "white" }}>
            Créer mon compte <ArrowRight size={18}/>
          </Link>
          <Link href="/contact" className="btn btn-xl"
            style={{ background: "rgba(255,255,255,0.9)", color: "var(--green-800)" }}>
            Parler à un conseiller
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────── PAGE ─────────── */
export default function HomePage() {
  return (
    <>
      <Hero/>
      <TrustBar/>
      <Products/>
      <IslamicSection/>
      <NewProducts/>
      <Stats/>
      <Testimonials/>
      <WhyUs/>
      <CTA/>
    </>
  );
}
