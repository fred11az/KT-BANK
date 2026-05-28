"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, Building, Users, TrendingUp, Layers } from "lucide-react";

const islamicProducts = [
  {
    icon: Users,
    name: "Musharaka",
    tag: "Partenariat",
    desc: "KT Bank participe en capital dans votre entreprise. Profits et pertes partagés proportionnellement à l'apport.",
    details: ["Participation active ou passive", "Partage des bénéfices selon accord", "Idéal pour projets d'expansion"],
  },
  {
    icon: TrendingUp,
    name: "Mudaraba",
    tag: "Capital + Expertise",
    desc: "Vous apportez l'expertise et le travail. KT Bank apporte le capital. Les profits sont partagés selon un ratio préétabli.",
    details: ["Aucune garantie de capital requise", "Ratio bénéfices négocié à l'avance", "Idéal pour startups et projets innovants"],
  },
  {
    icon: Layers,
    name: "Ijara",
    tag: "Crédit-bail islamique",
    desc: "KT Bank acquiert l'actif (équipement, immobilier) et vous le loue. Option d'achat en fin de contrat.",
    details: ["Loyers fixes et prévisibles", "Propriété transférée à terme", "Idéal pour acquisitions d'actifs"],
  },
  {
    icon: Building,
    name: "Istisna",
    tag: "Financement de production",
    desc: "Financement de la fabrication ou construction d'un actif sur mesure. KT Bank préfinance, vous livrez.",
    details: ["Financement étapes par étapes", "Contrat sur spécifications précises", "Idéal pour manufacturing & BTP"],
  },
];

const eligibilityCriteria = [
  "Entreprise enregistrée en Allemagne (GmbH, AG, KG...)",
  "Au moins 2 ans d'activité commerciale",
  "Chiffre d'affaires annuel ≥ 200 000 €",
  "Pas de procédure d'insolvabilité en cours",
  "Dirigeant résident en Allemagne",
  "Activité conforme aux principes Sharia (pas d'alcool, jeux, armes...)",
];

interface CorpForm {
  company: string;
  sector: string;
  amount: string;
  description: string;
}

export default function CorporateCreditPage() {
  const [form, setForm] = useState<CorpForm>({ company: "", sector: "", amount: "", description: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      {/* Hero */}
      <section
        className="relative pt-28 pb-32 text-white overflow-hidden hero-grid"
        style={{ background: "linear-gradient(135deg, #050913 0%, #0f1a35 50%, #1c2d5a 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 65% 25%, rgba(201,146,26,0.14) 0%, transparent 55%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl animate-fade-up">
            <span className="badge badge-gold mb-6">Finance d&apos;entreprise · Islamique</span>
            <h1 className="text-display text-white mb-6">
              Crédit corporate<br />
              <span className="text-gradient-gold">conforme Sharia</span>
            </h1>
            <p className="text-body-lg mb-10" style={{ color: "rgba(255,255,255,0.78)" }}>
              Musharaka, Mudaraba, Ijara, Istisna — des solutions de financement islamiques pour votre croissance.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#products" className="btn btn-gold btn-xl flex items-center gap-2">
                Découvrir nos solutions <ArrowRight size={20} />
              </a>
              <a href="#apply" className="btn btn-outline-white btn-xl">Soumettre un dossier</a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-10" style={{ background: "linear-gradient(to top, #FAFAFA, transparent)" }} />
      </section>

      {/* 4 Islamic products */}
      <section id="products" className="py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="section-label">Nos instruments</span>
            <h2 className="text-heading" style={{ color: "var(--gray-900)" }}>4 structures islamiques certifiées</h2>
            <p className="text-body mt-3 max-w-2xl mx-auto" style={{ color: "var(--gray-500)" }}>
              Chaque structure est adaptée à votre projet, certifiée par notre Shariah Board.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {islamicProducts.map(({ icon: Icon, name, tag, desc, details }) => (
              <div key={name} className="card p-8">
                <div className="flex items-start gap-5 mb-5">
                  <div className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center"
                    style={{ background: "rgba(201,146,26,0.12)", color: "var(--gold-500)" }}>
                    <Icon size={26} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-black text-xl" style={{ color: "var(--gray-900)" }}>{name}</h3>
                      <span className="badge badge-gold">{tag}</span>
                    </div>
                    <p className="text-small leading-relaxed" style={{ color: "var(--gray-500)" }}>{desc}</p>
                  </div>
                </div>
                <div className="space-y-2 pt-5 border-t" style={{ borderColor: "var(--gray-100)" }}>
                  {details.map((d) => (
                    <div key={d} className="flex items-center gap-2">
                      <CheckCircle size={15} style={{ color: "var(--gold-500)" }} />
                      <span className="text-small" style={{ color: "var(--gray-600)" }}>{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-20 lg:py-24"
        style={{ background: "linear-gradient(135deg, #050913, #0f1a35)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="badge badge-gold mb-4">Éligibilité</span>
            <h2 className="text-heading text-white">Critères d&apos;éligibilité</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {eligibilityCriteria.map((item) => (
              <div key={item} className="flex items-start gap-3 p-4 rounded-xl"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(201,146,26,0.2)" }}>
                <CheckCircle size={18} className="flex-shrink-0 mt-0.5" style={{ color: "var(--gold-400)" }} />
                <span style={{ color: "rgba(255,255,255,0.85)" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application form */}
      <section id="apply" className="py-20 lg:py-24" style={{ background: "var(--gray-50)" }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="section-label">Demande</span>
            <h2 className="text-heading" style={{ color: "var(--gray-900)" }}>Soumettre un dossier</h2>
            <p className="text-body mt-3" style={{ color: "var(--gray-500)" }}>
              Un conseiller corporate vous contactera sous 48h.
            </p>
          </div>
          {submitted ? (
            <div className="card p-10 text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
                style={{ background: "rgba(201,146,26,0.15)" }}>
                <CheckCircle size={32} style={{ color: "var(--gold-500)" }} />
              </div>
              <h3 className="font-bold text-xl mb-3" style={{ color: "var(--gray-900)" }}>Dossier transmis !</h3>
              <p className="text-body" style={{ color: "var(--gray-500)" }}>
                Notre équipe corporate étudiera votre dossier et vous contactera sous 48h.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card p-8 space-y-5">
              <div>
                <label className="label">Nom de l&apos;entreprise</label>
                <input className="input" placeholder="KT Ventures GmbH" required
                  value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              </div>
              <div>
                <label className="label">Secteur d&apos;activité</label>
                <select className="input" value={form.sector}
                  onChange={(e) => setForm({ ...form, sector: e.target.value })} required>
                  <option value="">Sélectionnez...</option>
                  {["Technologie", "Commerce", "Immobilier", "Industrie", "Services", "Agriculture", "Autre"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Montant de financement souhaité (€)</label>
                <input className="input" type="number" min={50000} placeholder="500 000" required
                  value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              </div>
              <div>
                <label className="label">Description du projet</label>
                <textarea className="input" rows={4} placeholder="Décrivez votre projet et l'utilisation des fonds..." required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-gold btn-xl w-full flex items-center justify-center gap-2">
                Soumettre mon dossier <ArrowRight size={20} />
              </button>
            </form>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #050913, #0f1a35)" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-heading text-white mb-4">Besoin d&apos;un rendez-vous ?</h2>
          <p className="text-body-lg mb-8" style={{ color: "rgba(255,255,255,0.72)" }}>
            Notre équipe de conseillers corporate est disponible pour étudier votre projet en détail.
          </p>
          <Link href="/contact" className="btn btn-gold btn-xl flex items-center gap-2 mx-auto w-fit">
            Prendre rendez-vous <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </>
  );
}
