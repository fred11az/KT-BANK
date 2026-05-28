"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, Home, TrendingDown, Percent, Users } from "lucide-react";

const processSteps = [
  { num: "01", title: "Évaluation du projet", desc: "Analyse de votre capacité financière et du bien immobilier ciblé." },
  { num: "02", title: "Choix de la structure", desc: "Murabaha ou Diminishing Musharaka — nous recommandons selon votre profil." },
  { num: "03", title: "Évaluation du bien", desc: "Expertise indépendante du bien immobilier par nos partenaires certifiés." },
  { num: "04", title: "Validation Sharia", desc: "Revue du contrat par notre Shariah Board — conformité islamique garantie." },
  { num: "05", title: "Financement & acquisition", desc: "KT Bank finance l'achat. Vous commencez vos mensualités." },
  { num: "06", title: "Transfert de propriété", desc: "À la dernière échéance, le bien devient entièrement le vôtre." },
];

export default function RealEstatePage() {
  const [price, setPrice] = useState(300000);
  const [downPct, setDownPct] = useState(20);
  const [years, setYears] = useState(20);

  const down = Math.round((price * downPct) / 100);
  const financed = price - down;
  const totalMonths = years * 12;
  const marginRate = 0.045;
  const total = financed * (1 + (marginRate * totalMonths) / 12);
  const monthly = totalMonths > 0 ? total / totalMonths : 0;

  return (
    <>
      {/* Hero */}
      <section
        className="relative pt-28 pb-32 text-white overflow-hidden hero-grid"
        style={{ background: "linear-gradient(135deg, #1c0a00 0%, #431407 50%, #7c2d12 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 70% 25%, rgba(251,191,36,0.15) 0%, transparent 55%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl animate-fade-up">
            <span className="badge mb-6" style={{ background: "rgba(251,146,60,0.2)", color: "#fed7aa", border: "1px solid rgba(251,146,60,0.35)" }}>
              Immobilier islamique · Halal
            </span>
            <h1 className="text-display text-white mb-6">
              Votre maison,<br />
              <span style={{ background: "linear-gradient(135deg, #fb923c, #f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                sans Riba
              </span>
            </h1>
            <p className="text-body-lg mb-10" style={{ color: "rgba(255,255,255,0.78)" }}>
              Financez votre propriété avec Murabaha ou Diminishing Musharaka. Zéro intérêt, contrat halal certifié, propriété progressive.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#calculator" className="btn btn-xl flex items-center gap-2 text-white"
                style={{ background: "linear-gradient(135deg, #ea580c, #c2410c)", boxShadow: "0 8px 30px rgba(234,88,12,0.4)" }}>
                Calculer ma mensualité <ArrowRight size={20} />
              </a>
              <a href="#products" className="btn btn-outline-white btn-xl">Nos structures</a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-10" style={{ background: "linear-gradient(to top, #FAFAFA, transparent)" }} />
      </section>

      {/* Murabaha vs Diminishing Musharaka */}
      <section id="products" className="py-20 lg:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="section-label">Structures disponibles</span>
            <h2 className="text-heading" style={{ color: "var(--gray-900)" }}>Murabaha vs Diminishing Musharaka</h2>
            <p className="text-body mt-3 max-w-2xl mx-auto" style={{ color: "var(--gray-500)" }}>
              Deux approches islamiques certifiées — choisissez celle qui correspond à votre projet.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Murabaha */}
            <div className="card p-8" style={{ borderColor: "#ea580c", borderWidth: 2 }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(234,88,12,0.12)", color: "#ea580c" }}>
                  <Home size={24} />
                </div>
                <div>
                  <h3 className="font-black text-xl" style={{ color: "var(--gray-900)" }}>Murabaha</h3>
                  <span className="badge" style={{ background: "rgba(234,88,12,0.12)", color: "#ea580c" }}>Vente à terme</span>
                </div>
              </div>
              <p className="text-body mb-5" style={{ color: "var(--gray-600)" }}>
                KT Bank achète le bien, puis vous le revend à un prix majoré fixe et convenu à l&apos;avance. Mensualités constantes.
              </p>
              <div className="space-y-2">
                {["Prix de vente fixé dès le départ", "Mensualités identiques sur toute la durée", "Simple et prévisible", "Idéal pour résidence principale"].map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <CheckCircle size={15} style={{ color: "#ea580c" }} />
                    <span className="text-small" style={{ color: "var(--gray-600)" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Diminishing Musharaka */}
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(5,150,105,0.12)", color: "#059669" }}>
                  <TrendingDown size={24} />
                </div>
                <div>
                  <h3 className="font-black text-xl" style={{ color: "var(--gray-900)" }}>Diminishing Musharaka</h3>
                  <span className="badge badge-green">Partenariat décroissant</span>
                </div>
              </div>
              <p className="text-body mb-5" style={{ color: "var(--gray-600)" }}>
                KT Bank et vous co-possédez le bien. Vous rachetez progressivement la part de la banque — votre participation augmente chaque mois.
              </p>
              <div className="space-y-2">
                {["Co-propriété progressive", "Loyer payé sur la part de la banque", "Flexibilité de remboursement anticipé", "Idéal pour investissement locatif"].map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <CheckCircle size={15} style={{ color: "#059669" }} />
                    <span className="text-small" style={{ color: "var(--gray-600)" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mortgage calculator */}
      <section id="calculator" className="py-20 lg:py-24"
        style={{ background: "linear-gradient(135deg, #1c0a00, #431407)" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="badge mb-4" style={{ background: "rgba(251,146,60,0.2)", color: "#fed7aa" }}>Simulateur</span>
            <h2 className="text-heading text-white">Calculez votre financement</h2>
            <p className="text-body mt-3" style={{ color: "rgba(255,255,255,0.65)" }}>Marge fixe 4.5% — transparente et certifiée.</p>
          </div>
          <div className="p-8 rounded-2xl" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(251,146,60,0.25)" }}>
            {/* Price */}
            <div className="mb-7">
              <div className="flex justify-between items-center mb-2">
                <label className="label text-white mb-0">Prix du bien</label>
                <span className="font-black text-xl" style={{ color: "#fb923c" }}>{price.toLocaleString("fr-FR")} €</span>
              </div>
              <input type="range" min={50000} max={2000000} step={5000} value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: "#ea580c" }} />
              <div className="flex justify-between text-small mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                <span>50 000 €</span><span>2 000 000 €</span>
              </div>
            </div>

            {/* Down payment */}
            <div className="mb-7">
              <div className="flex justify-between items-center mb-2">
                <label className="label text-white mb-0">Apport</label>
                <span className="font-black text-xl text-white">{downPct}% — {down.toLocaleString("fr-FR")} €</span>
              </div>
              <input type="range" min={5} max={80} step={5} value={downPct}
                onChange={(e) => setDownPct(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: "#059669" }} />
              <div className="flex justify-between text-small mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                <span>5%</span><span>80%</span>
              </div>
            </div>

            {/* Duration */}
            <div className="mb-8">
              <label className="label text-white mb-3">Durée</label>
              <div className="flex flex-wrap gap-3">
                {[10, 15, 20, 25, 30].map((y) => (
                  <button key={y} onClick={() => setYears(y)}
                    className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
                    style={years === y
                      ? { background: "#ea580c", color: "white", boxShadow: "0 4px 16px rgba(234,88,12,0.4)" }
                      : { background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" }}>
                    {y} ans
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl text-center"
              style={{ background: "rgba(251,146,60,0.12)", border: "1px solid rgba(251,146,60,0.3)" }}>
              <p className="text-small mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>Mensualité estimée</p>
              <p className="font-black mb-2" style={{ color: "#fb923c", fontSize: "3.5rem", lineHeight: 1 }}>
                {monthly.toFixed(2)} €
              </p>
              <p className="text-small" style={{ color: "rgba(255,255,255,0.5)" }}>
                Financé : {financed.toLocaleString("fr-FR")} € — Total : {total.toFixed(2)} €
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6-step process */}
      <section className="py-20 lg:py-24" style={{ background: "var(--gray-50)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="section-label">Processus</span>
            <h2 className="text-heading" style={{ color: "var(--gray-900)" }}>6 étapes vers votre bien</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {processSteps.map((step) => (
              <div key={step.num} className="card p-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg mb-4"
                  style={{ background: "rgba(234,88,12,0.1)", color: "#ea580c" }}>
                  {step.num}
                </div>
                <h3 className="font-bold mb-2" style={{ color: "var(--gray-900)" }}>{step.title}</h3>
                <p className="text-small leading-relaxed" style={{ color: "var(--gray-500)" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24" style={{ background: "linear-gradient(135deg, #1c0a00, #431407)" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Home size={32} style={{ color: "#fb923c" }} />
            <Percent size={32} style={{ color: "#fb923c" }} />
            <Users size={32} style={{ color: "#fb923c" }} />
          </div>
          <h2 className="text-heading text-white mb-4">Propriétaire halal en 2025</h2>
          <p className="text-body-lg mb-10" style={{ color: "rgba(255,255,255,0.72)" }}>
            Démarrez votre projet immobilier islamique avec KT Bank. Conseil personnalisé gratuit.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/client/register" className="btn btn-xl flex items-center gap-2 text-white"
              style={{ background: "linear-gradient(135deg, #ea580c, #c2410c)", boxShadow: "0 8px 30px rgba(234,88,12,0.4)" }}>
              Commencer ma demande <ArrowRight size={20} />
            </Link>
            <Link href="/contact" className="btn btn-outline-white btn-xl">Consulter un expert</Link>
          </div>
        </div>
      </section>
    </>
  );
}
