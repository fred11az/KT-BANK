"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, Shield, Clock, FileText, Car, Banknote } from "lucide-react";

const processSteps = [
  { num: "01", title: "Simulation en ligne", desc: "Calculez votre mensualité en quelques secondes avec notre simulateur." },
  { num: "02", title: "Sélection du véhicule", desc: "Choisissez votre voiture chez un concessionnaire partenaire ou trouvez-la vous-même." },
  { num: "03", title: "Dossier digital", desc: "Soumettez vos documents en ligne — carte d'identité, revenus, permis de conduire." },
  { num: "04", title: "Achat Murabaha", desc: "KT Bank achète le véhicule, puis vous le revend avec une marge fixe transparente." },
  { num: "05", title: "Livraison & conduite", desc: "Recevez votre véhicule et commencez à rouler en conformité avec vos valeurs." },
];

const features = [
  { icon: Shield, title: "Contrat Murabaha", desc: "KT Bank achète et revend — pas d'intérêts, marge fixe déclarée." },
  { icon: Car, title: "Neuf & occasion", desc: "Tous types de véhicules : voitures, utilitaires, motos." },
  { icon: Banknote, title: "Jusqu'à 100% financement", desc: "Apport optionnel — financez l'intégralité du prix si éligible." },
  { icon: Clock, title: "Jusqu'à 84 mois", desc: "Mensualités adaptées à votre budget sur 12 à 84 mois." },
  { icon: FileText, title: "Processus digital", desc: "Aucun déplacement requis. Signature électronique incluse." },
  { icon: CheckCircle, title: "Halal certifié", desc: "Conformité Sharia vérifiée par notre Shariah Board." },
];

const MONTHS = [12, 24, 36, 48, 60, 84];

export default function VehicleFinancingPage() {
  const [price, setPrice] = useState(20000);
  const [down, setDown] = useState(4000);
  const [months, setMonths] = useState(36);

  const financed = Math.max(0, price - down);
  const margin = 0.04;
  const total = financed * (1 + (margin * months) / 12);
  const monthly = months > 0 ? total / months : 0;

  return (
    <>
      {/* Hero */}
      <section
        className="relative pt-28 pb-32 text-white overflow-hidden hero-grid"
        style={{ background: "linear-gradient(135deg, #020617 0%, #0c1a3d 50%, #1e3a8a 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 70% 30%, rgba(59,130,246,0.2) 0%, transparent 60%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl animate-fade-up">
            <span className="badge mb-6" style={{ background: "rgba(59,130,246,0.2)", color: "#93c5fd", border: "1px solid rgba(59,130,246,0.35)" }}>
              Murabaha · Financement véhicule
            </span>
            <h1 className="text-display text-white mb-6">
              Votre voiture,<br />
              <span style={{ background: "linear-gradient(135deg, #60a5fa, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                sans intérêts
              </span>
            </h1>
            <p className="text-body-lg mb-10" style={{ color: "rgba(255,255,255,0.78)" }}>
              Financement islamique Murabaha pour votre véhicule. Marge fixe transparente, zéro Riba. Roulez halal.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#calculator" className="btn btn-xl flex items-center gap-2 text-white"
                style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)", boxShadow: "0 8px 30px rgba(37,99,235,0.4)" }}>
                Calculer ma mensualité <ArrowRight size={20} />
              </Link>
              <Link href="#process" className="btn btn-outline-white btn-xl">Comment ça marche</Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-10" style={{ background: "linear-gradient(to top, #FAFAFA, transparent)" }} />
      </section>

      {/* Murabaha Calculator */}
      <section id="calculator" className="py-20 lg:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="section-label">Simulateur Murabaha</span>
            <h2 className="text-heading" style={{ color: "var(--gray-900)" }}>Calculez votre financement</h2>
          </div>
          <div className="card p-8 space-y-7">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="label mb-0">Prix du véhicule</label>
                <span className="font-black text-xl" style={{ color: "#2563eb" }}>{price.toLocaleString("fr-FR")} €</span>
              </div>
              <input type="range" min={2000} max={150000} step={1000} value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: "#2563eb" }} />
              <div className="flex justify-between text-small mt-1" style={{ color: "var(--gray-400)" }}>
                <span>2 000 €</span><span>150 000 €</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="label mb-0">Apport personnel</label>
                <span className="font-black text-xl" style={{ color: "var(--green-700)" }}>{down.toLocaleString("fr-FR")} €</span>
              </div>
              <input type="range" min={0} max={price} step={500} value={down}
                onChange={(e) => setDown(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: "var(--green-700)" }} />
              <div className="flex justify-between text-small mt-1" style={{ color: "var(--gray-400)" }}>
                <span>0 €</span><span>{price.toLocaleString("fr-FR")} €</span>
              </div>
            </div>

            <div>
              <label className="label mb-3">Durée</label>
              <div className="flex flex-wrap gap-3">
                {MONTHS.map((m) => (
                  <button key={m} onClick={() => setMonths(m)}
                    className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
                    style={months === m
                      ? { background: "#2563eb", color: "white", boxShadow: "0 4px 16px rgba(37,99,235,0.35)" }
                      : { background: "var(--gray-100)", color: "var(--gray-600)" }}>
                    {m} mois
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl text-center"
              style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.07), rgba(29,78,216,0.04))", border: "1px solid rgba(37,99,235,0.2)" }}>
              <p className="text-small mb-2" style={{ color: "var(--gray-500)" }}>Mensualité estimée</p>
              <p className="font-black mb-2" style={{ color: "#2563eb", fontSize: "3.5rem", lineHeight: 1 }}>
                {monthly.toFixed(2)} €
              </p>
              <p className="text-small" style={{ color: "var(--gray-400)" }}>
                Montant financé : {financed.toLocaleString("fr-FR")} € — Total : {total.toFixed(2)} €
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5-step process */}
      <section id="process" className="py-20 lg:py-24"
        style={{ background: "linear-gradient(135deg, #020617, #0c1a3d)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="badge mb-4" style={{ background: "rgba(59,130,246,0.2)", color: "#93c5fd" }}>Processus</span>
            <h2 className="text-heading text-white">5 étapes vers votre véhicule</h2>
          </div>
          <div className="space-y-4">
            {processSteps.map((step, i) => (
              <div key={step.num} className="flex items-start gap-6 p-6 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(59,130,246,0.2)" }}>
                <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center font-black"
                  style={{ background: i === 2 ? "#2563eb" : "rgba(37,99,235,0.2)", color: i === 2 ? "white" : "#60a5fa" }}>
                  {step.num}
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">{step.title}</h3>
                  <p className="text-small" style={{ color: "rgba(255,255,255,0.6)" }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 lg:py-24" style={{ background: "var(--gray-50)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="section-label">Avantages</span>
            <h2 className="text-heading" style={{ color: "var(--gray-900)" }}>Pourquoi KT Vehicle ?</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-7">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: "rgba(37,99,235,0.1)", color: "#2563eb" }}>
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
      <section className="py-24" style={{ background: "linear-gradient(135deg, #020617, #0c1a3d)" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-heading text-white mb-4">Prêt à rouler halal ?</h2>
          <p className="text-body-lg mb-10" style={{ color: "rgba(255,255,255,0.72)" }}>
            Démarrez votre demande en ligne. Réponse sous 48h.
          </p>
          <Link href="/client/register" className="btn btn-xl flex items-center gap-2 mx-auto w-fit text-white"
            style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)", boxShadow: "0 8px 30px rgba(37,99,235,0.4)" }}>
            Financer mon véhicule <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </>
  );
}
