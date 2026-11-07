"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, CheckCircle, Award, Banknote, RefreshCw, Lock, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const features = [
  { icon: Banknote, title: "Dès 1 €", desc: "Commencez à investir dans l'or physique avec seulement 1 €." },
  { icon: Award, title: "Certifié LBMA", desc: "Or de qualité London Bullion Market Association, le standard mondial." },
  { icon: Shield, title: "Sans frais cachés", desc: "Spread transparent, aucune commission de gestion mensuelle." },
  { icon: RefreshCw, title: "Rachat à tout moment", desc: "Revendez votre or quand vous le souhaitez, liquidité immédiate." },
  { icon: Lock, title: "Stockage sécurisé", desc: "Votre or est stocké dans des coffres certifiés en Suisse." },
  { icon: Star, title: "Halal certifié", desc: "Conformité Sharia — pas de spéculation, actif tangible réel." },
];

export default function GoldKontoPage() {
  const { t } = useLanguage();
  const go = t.home.goldkonto;
  return (
    <>
      {/* Hero */}
      <section
        className="relative pt-28 pb-32 text-white overflow-hidden hero-grid"
        style={{ background: "linear-gradient(135deg, #1a0e00 0%, #3d2100 50%, #5a3200 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 70% 30%, rgba(201,146,26,0.18) 0%, transparent 60%)" }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 10% 80%, rgba(0,95,45,0.15) 0%, transparent 50%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-up">
              <span className="badge badge-gold mb-6">{t.nav.categories.save}</span>
              <h1 className="text-display text-white mb-6">{go.heading}</h1>
              <p className="text-body-lg mb-8" style={{ color: "rgba(255,255,255,0.78)" }}>
                {go.desc}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/client/register" className="btn btn-gold btn-lg flex items-center gap-2">
                  {go.cta} <ArrowRight size={18} />
                </Link>
                <Link href="#features" className="btn btn-outline-white btn-lg">{go.more}</Link>
              </div>
            </div>

            {/* Official KT Bank photo */}
            <div className="animate-fade-up delay-200">
              <div className="relative w-full aspect-[4/5] sm:aspect-[4/3] rounded-2xl overflow-hidden"
                style={{ border: "1px solid rgba(201,146,26,0.35)" }}>
                <Image src="/images/home/goldkonto.jpg" alt={go.heading} fill style={{ objectFit: "cover" }} sizes="(min-width: 1024px) 50vw, 100vw" priority />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-10" style={{ background: "linear-gradient(to top, #FAFAFA, transparent)" }} />
      </section>

      {/* LBMA section */}
      <section className="py-20 lg:py-24" style={{ background: "linear-gradient(135deg, #1a0e00, #3d2100)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge badge-gold mb-6">Certification internationale</span>
              <h2 className="text-heading text-white mb-5">Standard LBMA</h2>
              <p className="text-body-lg mb-6" style={{ color: "rgba(255,255,255,0.75)" }}>
                La London Bullion Market Association définit les standards mondiaux de qualité de l&apos;or. Notre or est de pureté 999.9‰ — le meilleur qui soit.
              </p>
              <div className="space-y-3">
                {["Or 999.9‰ pureté garantie", "Stockage coffre-fort certifié en Suisse", "Audit annuel indépendant", "Assurance couvrant 100% de votre or"].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle size={18} style={{ color: "var(--gold-400)" }} />
                    <span style={{ color: "rgba(255,255,255,0.85)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "LBMA Certifié", sub: "Standard mondial" },
                { label: "Sharia Board", sub: "Certifié 2025" },
                { label: "Stockage Suisse", sub: "Coffre certifié" },
                { label: "Assurance 100%", sub: "Couverture totale" },
              ].map((c) => (
                <div key={c.label} className="text-center p-5 rounded-xl"
                  style={{ background: "rgba(201,146,26,0.1)", border: "1px solid rgba(201,146,26,0.25)" }}>
                  <div className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, var(--gold-400), var(--gold-300))" }}>
                    <span className="text-white font-black text-sm">✦</span>
                  </div>
                  <p className="font-bold text-white text-sm">{c.label}</p>
                  <p className="text-small" style={{ color: "var(--gold-200)" }}>{c.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 lg:py-24" style={{ background: "var(--gray-50)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="section-label">Avantages</span>
            <h2 className="text-heading" style={{ color: "var(--gray-900)" }}>Pourquoi KT Gold ?</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-7">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: "var(--gold-100)", color: "var(--gold-600)" }}>
                  <Icon size={26} />
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ color: "var(--gray-900)" }}>{title}</h3>
                <p className="text-small leading-relaxed" style={{ color: "var(--gray-500)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24" style={{ background: "linear-gradient(135deg, #1a0e00, #3d2100)" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <span className="badge badge-gold mb-6">Investissement halal</span>
          <h2 className="text-heading text-white mb-4">Commencez avec 1 € aujourd&apos;hui</h2>
          <p className="text-body-lg mb-10" style={{ color: "rgba(255,255,255,0.72)" }}>
            Protégez votre pouvoir d&apos;achat avec de l&apos;or physique certifié.
          </p>
          <Link href="/client/register" className="btn btn-gold btn-xl flex items-center gap-2 mx-auto w-fit">
            Investir dans l&apos;or <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </>
  );
}
