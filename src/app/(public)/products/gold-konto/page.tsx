"use client";
import Link from "next/link";
import { ArrowRight, TrendingUp, Shield, CheckCircle, Award, Banknote, RefreshCw, Lock, Star } from "lucide-react";

const features = [
  { icon: Banknote, title: "Dès 1 €", desc: "Commencez à investir dans l'or physique avec seulement 1 €." },
  { icon: Award, title: "Certifié LBMA", desc: "Or de qualité London Bullion Market Association, le standard mondial." },
  { icon: Shield, title: "Sans frais cachés", desc: "Spread transparent, aucune commission de gestion mensuelle." },
  { icon: RefreshCw, title: "Rachat à tout moment", desc: "Revendez votre or quand vous le souhaitez, liquidité immédiate." },
  { icon: Lock, title: "Stockage sécurisé", desc: "Votre or est stocké dans des coffres certifiés en Suisse." },
  { icon: Star, title: "Halal certifié", desc: "Conformité Sharia — pas de spéculation, actif tangible réel." },
];

const periods = [
  { label: "3 mois", perf: "+1.2%", trend: "Stable" },
  { label: "6 mois", perf: "+2.8%", trend: "Hausse" },
  { label: "12 mois", perf: "+4.2%", trend: "Forte hausse" },
];

export default function GoldKontoPage() {
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
              <span className="badge badge-gold mb-6">Or Physique · Halal</span>
              <h1 className="text-display text-white mb-6">
                Investissez dans l&apos;or<br />
                <span className="text-gradient-gold">physique dès 1 €</span>
              </h1>
              <p className="text-body-lg mb-8" style={{ color: "rgba(255,255,255,0.78)" }}>
                Protégez votre patrimoine avec de l&apos;or certifié LBMA, stocké en coffre suisse. Un investissement halal, tangible, sans intérêts.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/client/register" className="btn btn-gold btn-lg flex items-center gap-2">
                  Investir maintenant <ArrowRight size={18} />
                </Link>
                <Link href="#features" className="btn btn-outline-white btn-lg">Découvrir</Link>
              </div>
            </div>

            {/* Gold price card */}
            <div className="animate-fade-up delay-200">
              <div className="p-8 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,146,26,0.35)", backdropFilter: "blur(20px)" }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-small mb-1" style={{ color: "var(--gold-200)" }}>Cours actuel (XAU/g)</p>
                    <p className="font-black text-white" style={{ fontSize: "3rem", lineHeight: 1 }}>€62.30</p>
                  </div>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                    style={{ background: "linear-gradient(135deg, var(--gold-400), var(--gold-300))", boxShadow: "var(--shadow-gold)" }}>
                    ✦
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-8">
                  <TrendingUp size={18} style={{ color: "var(--gold-300)" }} />
                  <span className="font-bold" style={{ color: "var(--gold-300)" }}>+4.2% sur 12 mois</span>
                  <span className="text-small" style={{ color: "rgba(255,255,255,0.5)" }}>vs. dépôt bancaire 0%</span>
                </div>
                <div className="divider-gold" style={{ margin: "0 0 24px" }} />
                <div className="grid grid-cols-3 gap-4">
                  {periods.map((p) => (
                    <div key={p.label} className="text-center p-3 rounded-xl"
                      style={{ background: "rgba(201,146,26,0.12)", border: "1px solid rgba(201,146,26,0.2)" }}>
                      <p className="text-small mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>{p.label}</p>
                      <p className="font-black" style={{ color: "var(--gold-300)" }}>{p.perf}</p>
                      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.7rem" }}>{p.trend}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-10" style={{ background: "linear-gradient(to top, #FAFAFA, transparent)" }} />
      </section>

      {/* Performance table */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="section-label">Performance</span>
            <h2 className="text-heading" style={{ color: "var(--gray-900)" }}>Historique des rendements</h2>
            <p className="text-body mt-3" style={{ color: "var(--gray-500)" }}>
              Données basées sur le cours LBMA (London Bullion Market Association).
            </p>
          </div>
          <div className="card overflow-hidden p-0">
            <table className="table">
              <thead>
                <tr>
                  <th>Période</th>
                  <th>Performance</th>
                  <th>€100 → valeur</th>
                  <th>Tendance</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { p: "3 mois", perf: "+1.2%", val: "€101.20", t: "Stable" },
                  { p: "6 mois", perf: "+2.8%", val: "€102.80", t: "Hausse" },
                  { p: "12 mois", perf: "+4.2%", val: "€104.20", t: "Forte hausse" },
                  { p: "3 ans", perf: "+18.6%", val: "€118.60", t: "Croissance" },
                ].map((row) => (
                  <tr key={row.p}>
                    <td className="font-semibold">{row.p}</td>
                    <td><span className="font-bold" style={{ color: "var(--green-600)" }}>{row.perf}</span></td>
                    <td style={{ color: "var(--gray-700)" }}>{row.val}</td>
                    <td><span className="badge badge-gold">{row.t}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-small mt-3 text-center" style={{ color: "var(--gray-400)" }}>
            * Les performances passées ne préjugent pas des performances futures.
          </p>
        </div>
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
