"use client";
import Link from "next/link";
import { ArrowRight, CheckCircle, TrendingUp, Shield, Globe, Users, Building2 } from "lucide-react";

const solutions = [
  {
    ar: "المُشَارَكَة",
    name: "Musharaka",
    tagline: "Partenariat en capital",
    desc: "Co-investissement où la banque et l'entreprise partagent capital, gestion, profits et risques proportionnellement. Idéal pour les projets d'expansion.",
    features: ["De 50 000€ à 5 M€", "Durée flexible", "Partage équitable", "Suivi mensuel"],
    icon: "🤝",
    color: "var(--green-700)",
  },
  {
    ar: "المُضَارَبَة",
    name: "Mudaraba",
    tagline: "Financement de projet",
    desc: "KT Bank apporte le capital, vous apportez l'expertise et la gestion. Les profits sont partagés selon un ratio convenu. Zéro intérêt.",
    features: ["Capital 100% KT Bank", "Expertise apportée par vous", "Ratio profit négociable", "Reporting transparent"],
    icon: "📊",
    color: "var(--gold-400)",
  },
  {
    ar: "الإِجَارَة",
    name: "Ijara",
    tagline: "Location-vente islamique",
    desc: "KT Bank acquiert l'actif (équipement, local, véhicule) et vous le loue. Option d'achat à terme à prix convenu dès le départ.",
    features: ["Équipements & immobilier", "Loyers fixes ou dégressifs", "Option d'achat garantie", "Déduction fiscale possible"],
    icon: "🏗️",
    color: "var(--green-700)",
  },
  {
    ar: "الاِسْتِصْنَاع",
    name: "Istisna",
    tagline: "Financement de construction",
    desc: "Financement de projets à fabriquer ou construire. KT Bank finance la production et livre le bien fini à un prix et une date convenus.",
    features: ["Construction & fabrication", "Paiements progressifs", "Prix fixé à l'avance", "Suivi chantier inclus"],
    icon: "🏢",
    color: "var(--gold-400)",
  },
];

const features = [
  { icon: Shield, title: "Conformité BaFin", desc: "Régulés par l'autorité bancaire allemande. Votre entreprise bénéficie de la même protection que dans une banque conventionnelle." },
  { icon: TrendingUp, title: "Jusqu'à 5 M€", desc: "Nous finançons les PME comme les grandes entreprises. Montants adaptés à vos besoins réels de croissance." },
  { icon: Globe, title: "Réseau international", desc: "Accès au réseau de Kuveyt Türk — 5 millions de clients, présence dans 20 pays. Ouverture vers les marchés du Golfe." },
  { icon: Users, title: "Conseillers dédiés", desc: "Un chargé de compte entreprise dédié, parlant DE/EN/TR/AR. Disponible pour vos questions, sans rendez-vous." },
];

const stats = [
  { val: "150M€+", label: "Financements accordés" },
  { val: "500+", label: "Entreprises financées" },
  { val: "20 pays", label: "Réseau Kuveyt Türk" },
  { val: "100%", label: "Halal certifié" },
];

export default function CorporatePage() {
  return (
    <>
      {/* HERO */}
      <section
        className="relative py-28 lg:py-36 text-white overflow-hidden hero-grid"
        style={{ background: "linear-gradient(160deg, #0A0F1E 0%, #111827 50%, #1A2744 100%)" }}
      >
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full pointer-events-none opacity-10"
          style={{ background: "radial-gradient(circle, var(--green-600), transparent)", transform: "translate(-30%, -30%)" }} />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full pointer-events-none opacity-10"
          style={{ background: "radial-gradient(circle, var(--gold-400), transparent)", transform: "translate(20%, 30%)" }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="animate-fade-up">
            <span className="section-label" style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", color: "#E8C96B" }}>
              🏢 KT Bank Entreprise
            </span>
          </div>
          <h1 className="text-display mt-4 mb-6 animate-fade-up delay-100">
            Financez votre croissance<br />
            <span className="text-gradient-gold">sans compromis</span>
          </h1>
          <p className="text-body-lg mb-10 animate-fade-up delay-200" style={{ color: "rgba(255,255,255,0.75)" }}>
            Des solutions de financement islamique sur mesure pour les PME, ETI et grandes entreprises.
            De 50 000€ à 5 millions d'euros, avec un accompagnement dédié.
          </p>
          <div className="flex flex-wrap justify-center gap-8 mb-10 animate-fade-up delay-300">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-black" style={{ color: "#E8C96B" }}>{s.val}</div>
                <div className="text-small" style={{ color: "rgba(255,255,255,0.5)" }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up delay-400">
            <Link href="/contact" className="btn btn-gold btn-xl">
              Demander un financement <ArrowRight size={18} />
            </Link>
            <Link href="/client/register" className="btn btn-outline-white btn-xl">
              Ouvrir un compte pro
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
          style={{ background: "linear-gradient(to top, #FAFAFA, transparent)" }} />
      </section>

      {/* SOLUTIONS */}
      <section className="py-20 lg:py-28" style={{ background: "white" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="section-label">Nos Solutions</span>
            <h2 className="text-heading mt-4 mb-2">
              4 modes de financement <span className="text-gradient">islamiques</span>
            </h2>
            <div className="divider-gold" />
            <p className="text-body mt-6 max-w-2xl mx-auto" style={{ color: "var(--gray-500)" }}>
              Chaque structure est conçue pour correspondre à un besoin précis, certifiée par notre Shariah Board.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {solutions.map((sol, i) => (
              <div key={sol.name} className="card card-interactive p-8 animate-fade-up" style={{ animationDelay: `${i * 70}ms`, borderTop: `3px solid ${sol.color}` }}>
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className="text-3xl mb-2">{sol.icon}</div>
                    <div className="text-xl font-bold mb-1" style={{ fontFamily: "serif", color: sol.color }}>{sol.ar}</div>
                    <h3 className="font-black text-xl" style={{ color: "var(--gray-900)" }}>{sol.name}</h3>
                    <p className="text-small font-medium" style={{ color: "var(--gray-500)" }}>{sol.tagline}</p>
                  </div>
                </div>
                <p className="text-body mb-5" style={{ color: "var(--gray-600)" }}>{sol.desc}</p>
                <div className="grid grid-cols-2 gap-2">
                  {sol.features.map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckCircle size={13} style={{ color: sol.color, flexShrink: 0 }} />
                      <span className="text-xs" style={{ color: "var(--gray-600)" }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY KT CORPORATE */}
      <section className="py-20 lg:py-28" style={{ background: "var(--gray-50)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="section-label">Pourquoi KT Corporate</span>
            <h2 className="text-heading mt-4 mb-2">
              Votre banque <span className="text-gradient">partenaire</span>
            </h2>
            <div className="divider-gold" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={feat.title} className="card p-7 animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: "var(--green-50)" }}>
                    <Icon size={20} style={{ color: "var(--green-700)" }} />
                  </div>
                  <h3 className="font-bold text-sm mb-2" style={{ color: "var(--gray-900)" }}>{feat.title}</h3>
                  <p className="text-small leading-relaxed" style={{ color: "var(--gray-500)" }}>{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-20" style={{ background: "white" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="section-label">Processus</span>
            <h2 className="text-heading mt-4 mb-2">Simple. <span className="text-gradient">Rapide. Transparent.</span></h2>
            <div className="divider-gold" />
          </div>
          <div className="grid sm:grid-cols-4 gap-6 text-center">
            {[
              { n: "01", label: "Demande en ligne", desc: "Formulaire en 5 min" },
              { n: "02", label: "Analyse rapide", desc: "Réponse sous 48h" },
              { n: "03", label: "Montage dossier", desc: "Avec votre conseiller" },
              { n: "04", label: "Financement", desc: "Versement sous 7j" },
            ].map((step, i) => (
              <div key={step.n} className="animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg mx-auto mb-4"
                  style={{ background: i % 2 === 0 ? "var(--green-700)" : "linear-gradient(135deg, var(--gold-400), var(--gold-300))" }}>
                  {step.n}
                </div>
                <h3 className="font-bold text-sm mb-1" style={{ color: "var(--gray-900)" }}>{step.label}</h3>
                <p className="text-xs" style={{ color: "var(--gray-500)" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, var(--gold-500), var(--gold-300))" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <Building2 size={36} className="mx-auto mb-5 opacity-80" style={{ color: "white" }} />
          <h2 className="text-heading mb-4" style={{ color: "white" }}>Prêt à financer votre projet ?</h2>
          <p className="text-body-lg mb-8" style={{ color: "rgba(255,255,255,0.85)" }}>
            Parlez-nous de votre projet. Un conseiller dédié vous contacte sous 24h.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn btn-primary btn-xl">
              Demander un financement <ArrowRight size={18} />
            </Link>
            <Link href="/client/register" className="btn btn-outline-white btn-xl">
              Ouvrir un compte pro
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
