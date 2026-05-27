"use client";
import Link from "next/link";
import { ArrowRight, CheckCircle, Building, TrendingUp, Globe, Shield } from "lucide-react";

export default function CorporatePage() {
  const solutions = [
    {
      icon: "🤝",
      title: "Musharaka",
      subtitle: "Partenariat islamique",
      desc: "Participation conjointe au capital. Les profits et pertes sont partagés proportionnellement entre KT Bank et votre entreprise.",
      for: "Financement de projets, expansion, création",
      amount: "De €50K à €5M",
    },
    {
      icon: "💼",
      title: "Mudaraba",
      subtitle: "Contrat de fiducie",
      desc: "KT Bank apporte les fonds, votre équipe apporte l'expertise et le travail. Les profits sont partagés selon un ratio convenu.",
      for: "Startups, projets innovants",
      amount: "De €10K à €2M",
    },
    {
      icon: "🏗️",
      title: "Ijara",
      subtitle: "Crédit-bail islamique",
      desc: "KT Bank achète l'équipement ou le local, et vous le loue. À terme, vous pouvez en devenir propriétaire.",
      for: "Équipements, véhicules de société, bureaux",
      amount: "De €5K à €3M",
    },
    {
      icon: "🏭",
      title: "Istisna",
      subtitle: "Financement à la construction",
      desc: "Financement sur mesure pour les projets de construction et de fabrication. Paiements progressifs selon l'avancement.",
      for: "Construction, manufacturing",
      amount: "Sur devis",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative py-28 text-white overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #005F2D 100%)" }}>
        <div className="relative max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{ background: "rgba(201,168,76,0.2)", border: "1px solid rgba(201,168,76,0.4)", color: "#E8C96B" }}>
              🏢 Corporate Banking
            </div>
            <h1 className="text-5xl font-black mb-6">
              Développez votre entreprise{" "}
              <span style={{ color: "#E8C96B" }}>sans compromis</span>
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              KT Bank propose des solutions de financement islamique sur mesure pour les TPE, PME et grandes entreprises.
              De €5 000 à €5 000 000, sans intérêts et sans attente.
            </p>
            <div className="flex gap-4">
              <Link href="/products/corporate-credit"
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all hover:-translate-y-1"
                style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96B)" }}>
                Voir les solutions <ArrowRight size={16}/>
              </Link>
              <Link href="/contact"
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold border-2 transition-all hover:bg-white/10"
                style={{ borderColor: "rgba(255,255,255,0.3)", color: "white" }}>
                Parler à un conseiller
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "€5M", label: "Financement max", icon: "💰" },
              { value: "72h", label: "Décision rapide", icon: "⚡" },
              { value: "500+", label: "Entreprises financées", icon: "🏢" },
              { value: "0%", label: "Intérêts", icon: "🚫" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl p-5 text-center"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-2xl font-black mb-1" style={{ color: "#E8C96B" }}>{s.value}</div>
                <div className="text-gray-300 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none"><path d="M0,60 C360,0 1080,60 1440,15 L1440,60 Z" fill="#FAFAFA"/></svg>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Nos Solutions <span style={{ color: "#005F2D" }}>Islamiques</span>
            </h2>
            <div className="w-20 h-1 mx-auto rounded-full" style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96B)" }}></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {solutions.map((sol) => (
              <div key={sol.title} className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all">
                <div className="text-4xl mb-4">{sol.icon}</div>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-2xl font-black text-gray-900">{sol.title}</h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: "#D1FAE5", color: "#005F2D" }}>
                    {sol.subtitle}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">{sol.desc}</p>
                <div className="flex flex-wrap gap-3">
                  <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                    🎯 {sol.for}
                  </span>
                  <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full font-bold"
                    style={{ background: "#D1FAE5", color: "#005F2D" }}>
                    💶 {sol.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why KT Corporate */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-4">Pourquoi KT Bank pour votre entreprise ?</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Building size={28}/>, title: "Expertise sectorielle", desc: "Conseillers spécialisés par secteur d'activité" },
              { icon: <TrendingUp size={28}/>, title: "Croissance partagée", desc: "Nous investissons dans votre succès, pas seulement dans vos dettes" },
              { icon: <Globe size={28}/>, title: "Réseau international", desc: "Accès au réseau Kuveyt Türk dans 13 pays" },
              { icon: <Shield size={28}/>, title: "100% conforme charia", desc: "Certifié pour les entreprises halal et non-halal" },
            ].map((item) => (
              <div key={item.title} className="text-center p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-all">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                  style={{ background: "#D1FAE5", color: "#005F2D" }}>
                  {item.icon}
                </div>
                <div className="font-bold text-gray-900 mb-2">{item.title}</div>
                <div className="text-gray-500 text-sm">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #004020, #005F2D)" }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-white mb-4">Prêt à financer votre projet ?</h2>
          <p className="text-green-200 text-lg mb-8">Nos conseillers corporate vous répondent sous 24h.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/products/corporate-credit"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all hover:-translate-y-1"
              style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96B)", color: "white" }}>
              Faire une demande <ArrowRight size={18}/>
            </Link>
            <Link href="/contact"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white border-2 border-white/30 transition-all hover:bg-white/10">
              Contacter un conseiller
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
