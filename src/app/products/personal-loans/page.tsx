"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, Clock, Shield, Zap, FileText, Users, Banknote } from "lucide-react";

const features = [
  { icon: Zap, title: "Réponse en 24h", desc: "Décision rapide, fonds disponibles en 48h après validation." },
  { icon: Shield, title: "Sans intérêts (Riba)", desc: "Marge fixe transparente, aucun intérêt composé — conforme Sharia." },
  { icon: FileText, title: "Zéro paperasse", desc: "Processus 100% digital. Signez en ligne depuis chez vous." },
  { icon: Clock, title: "Jusqu'à 84 mois", desc: "Remboursez à votre rythme avec des mensualités fixes." },
  { icon: Users, title: "Dédié aux résidents", desc: "Ouvert à tous les résidents allemands, quelle que soit leur origine." },
  { icon: Banknote, title: "Jusqu'à 50 000 €", desc: "Financez vos projets personnels avec jusqu'à 50 000 €." },
];

const eligibility = [
  "Résident en Allemagne depuis au moins 12 mois",
  "Revenu mensuel net minimum 1 200 €",
  "Âge : 21 à 65 ans",
  "Pas d'insolvabilité déclarée (Schufa)",
  "Compte bancaire allemand actif",
  "Pièce d'identité valide (passeport ou carte nationale)",
];

const MONTHS_OPTIONS = [6, 12, 24, 36, 60, 84];

interface FormData {
  name: string;
  email: string;
  phone: string;
  income: string;
  purpose: string;
  amount: string;
}

export default function PersonalLoansPage() {
  const [amount, setAmount] = useState(10000);
  const [months, setMonths] = useState(24);
  const [form, setForm] = useState<FormData>({ name: "", email: "", phone: "", income: "", purpose: "", amount: "" });
  const [submitted, setSubmitted] = useState(false);

  const totalRepayment = amount * (1 + (0.04 * months) / 12);
  const monthly = totalRepayment / months;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      {/* Hero */}
      <section
        className="relative pt-28 pb-32 text-white overflow-hidden hero-grid"
        style={{ background: "linear-gradient(135deg, #1e003d 0%, #3b0764 50%, #581c87 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 60% 20%, rgba(0,95,45,0.15) 0%, transparent 55%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl animate-fade-up">
            <span className="badge mb-6" style={{ background: "rgba(168,85,247,0.2)", color: "#d8b4fe", border: "1px solid rgba(168,85,247,0.35)" }}>
              Financement personnel · Halal
            </span>
            <h1 className="text-display text-white mb-6">
              Prêt personnel<br />
              <span style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                sans intérêts
              </span>
            </h1>
            <p className="text-body-lg mb-8" style={{ color: "rgba(255,255,255,0.78)" }}>
              Jusqu&apos;à 50 000 € avec une marge fixe et transparente. Zéro Riba, zéro surprise — financement islamique certifié.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#simulator" className="btn btn-xl flex items-center gap-2 text-white"
                style={{ background: "linear-gradient(135deg, #9333ea, #7c3aed)", boxShadow: "0 8px 30px rgba(147,51,234,0.4)" }}>
                Simuler mon prêt <ArrowRight size={20} />
              </Link>
              <Link href="#apply" className="btn btn-outline-white btn-xl">Postuler</Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-10" style={{ background: "linear-gradient(to top, #FAFAFA, transparent)" }} />
      </section>

      {/* Simulator */}
      <section id="simulator" className="py-20 lg:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="section-label">Simulateur</span>
            <h2 className="text-heading" style={{ color: "var(--gray-900)" }}>Calculez votre mensualité</h2>
            <p className="text-body mt-3" style={{ color: "var(--gray-500)" }}>Marge fixe de 4% — transparente et sans intérêts composés.</p>
          </div>

          <div className="card p-8">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <label className="label mb-0">Montant emprunté</label>
                <span className="font-black text-2xl" style={{ color: "#9333ea" }}>{amount.toLocaleString("fr-FR")} €</span>
              </div>
              <input type="range" min={1000} max={50000} step={500} value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: "#9333ea", background: `linear-gradient(to right, #9333ea ${((amount - 1000) / 49000) * 100}%, var(--gray-200) 0%)` }} />
              <div className="flex justify-between text-small mt-1" style={{ color: "var(--gray-400)" }}>
                <span>1 000 €</span><span>50 000 €</span>
              </div>
            </div>

            <div className="mb-8">
              <label className="label mb-3">Durée de remboursement</label>
              <div className="flex flex-wrap gap-3">
                {MONTHS_OPTIONS.map((m) => (
                  <button key={m} onClick={() => setMonths(m)}
                    className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
                    style={months === m
                      ? { background: "#9333ea", color: "white", boxShadow: "0 4px 16px rgba(147,51,234,0.35)" }
                      : { background: "var(--gray-100)", color: "var(--gray-600)" }}>
                    {m} mois
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl text-center"
              style={{ background: "linear-gradient(135deg, rgba(147,51,234,0.08), rgba(124,58,237,0.05))", border: "1px solid rgba(147,51,234,0.2)" }}>
              <p className="text-small mb-2" style={{ color: "var(--gray-500)" }}>Mensualité estimée</p>
              <p className="font-black mb-2" style={{ color: "#9333ea", fontSize: "3.5rem", lineHeight: 1 }}>
                {monthly.toFixed(2)} €
              </p>
              <p className="text-small" style={{ color: "var(--gray-400)" }}>
                Total remboursé : {totalRepayment.toFixed(2)} € — Marge totale : {(totalRepayment - amount).toFixed(2)} €
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 lg:py-24" style={{ background: "var(--gray-50)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="section-label">Avantages</span>
            <h2 className="text-heading" style={{ color: "var(--gray-900)" }}>Pourquoi KT Personal Loan ?</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-7">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: "rgba(147,51,234,0.1)", color: "#9333ea" }}>
                  <Icon size={26} />
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ color: "var(--gray-900)" }}>{title}</h3>
                <p className="text-small leading-relaxed" style={{ color: "var(--gray-500)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="section-label">Éligibilité</span>
            <h2 className="text-heading" style={{ color: "var(--gray-900)" }}>Critères d&apos;éligibilité</h2>
          </div>
          <div className="card p-8">
            <div className="grid sm:grid-cols-2 gap-4">
              {eligibility.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle size={20} className="flex-shrink-0 mt-0.5" style={{ color: "#9333ea" }} />
                  <span className="text-body" style={{ color: "var(--gray-700)" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Application form */}
      <section id="apply" className="py-20 lg:py-24" style={{ background: "var(--gray-50)" }}>
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="section-label">Demande</span>
            <h2 className="text-heading" style={{ color: "var(--gray-900)" }}>Postulez en ligne</h2>
          </div>
          {submitted ? (
            <div className="card p-10 text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
                style={{ background: "rgba(147,51,234,0.15)" }}>
                <CheckCircle size={32} style={{ color: "#9333ea" }} />
              </div>
              <h3 className="font-bold text-xl mb-3" style={{ color: "var(--gray-900)" }}>Dossier soumis avec succès !</h3>
              <p className="text-body" style={{ color: "var(--gray-500)" }}>
                Un conseiller vous contactera sous 24h pour finaliser votre demande.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card p-8 space-y-5">
              {[
                { key: "name", label: "Nom complet", type: "text", placeholder: "Mohammed Al-Rashid" },
                { key: "email", label: "E-mail", type: "email", placeholder: "vous@exemple.com" },
                { key: "phone", label: "Téléphone", type: "tel", placeholder: "+49 151 0000 0000" },
                { key: "income", label: "Revenu mensuel net (€)", type: "number", placeholder: "2 500" },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label className="label">{label}</label>
                  <input className="input" type={type} placeholder={placeholder} required
                    value={form[key as keyof FormData]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
                </div>
              ))}
              <div>
                <label className="label">Objet du prêt</label>
                <select className="input" value={form.purpose}
                  onChange={(e) => setForm({ ...form, purpose: e.target.value })} required>
                  <option value="">Sélectionnez...</option>
                  {["Rénovation domicile", "Achat véhicule", "Mariage", "Études", "Autre"].map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Montant souhaité (€)</label>
                <input className="input" type="number" min={1000} max={50000} placeholder="10 000" required
                  value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-xl w-full flex items-center justify-center gap-2 text-white"
                style={{ background: "linear-gradient(135deg, #9333ea, #7c3aed)", boxShadow: "0 8px 24px rgba(147,51,234,0.35)" }}>
                Envoyer ma demande <ArrowRight size={20} />
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
