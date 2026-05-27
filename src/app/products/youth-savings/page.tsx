"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, Shield, Gift, Lock, Star, Users } from "lucide-react";

const AGE_TIERS = [
  {
    label: "0–12 ans",
    range: "0-12",
    icon: "🌱",
    title: "Épargne enfant",
    color: "#059669",
    features: [
      "Compte ouvert par les parents",
      "Profit annuel jusqu'à 3.5%",
      "Pas de frais de gestion",
      "Aucun retrait avant 12 ans (option)",
      "Bonus d'anniversaire chaque année",
    ],
  },
  {
    label: "13–18 ans",
    range: "13-18",
    icon: "📚",
    title: "Compte Ado",
    color: "#7c3aed",
    features: [
      "Accès app mobile supervisé",
      "Carte prépayée avec limites parentales",
      "Objectifs d'épargne gamifiés",
      "Éducation financière islamique intégrée",
      "Notifications parents en temps réel",
    ],
  },
  {
    label: "18–25 ans",
    range: "18-25",
    icon: "🚀",
    title: "Compte Jeune adulte",
    color: "#2563eb",
    features: [
      "Autonomie complète du compte",
      "Profit 4.0% sur l'épargne",
      "Accès au prêt étudiant halal",
      "Carte Visa Débit gratuite",
      "Coaching financier islamique",
    ],
  },
];

interface FormData {
  childName: string;
  parentName: string;
  email: string;
  dob: string;
}

export default function YouthSavingsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [form, setForm] = useState<FormData>({ childName: "", parentName: "", email: "", dob: "" });
  const [submitted, setSubmitted] = useState(false);

  const active = AGE_TIERS[activeTab];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      {/* Hero */}
      <section
        className="relative pt-28 pb-32 text-white overflow-hidden hero-grid"
        style={{ background: "linear-gradient(135deg, var(--green-900) 0%, var(--green-700) 60%, #007A3D 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 70% 20%, rgba(201,146,26,0.15) 0%, transparent 55%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-up">
              <span className="badge badge-gold mb-6">KT JugendKonto · Halal</span>
              <h1 className="text-display text-white mb-6">
                KT JugendKonto<br />
                <span style={{ color: "var(--gold-300)" }}>Halal dès la naissance</span>
              </h1>
              <p className="text-body-lg mb-8" style={{ color: "rgba(255,255,255,0.8)" }}>
                Offrez à vos enfants un avenir financier conforme à vos valeurs islamiques. Épargne sécurisée, profit halal, éducation intégrée.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#open" className="btn btn-gold btn-lg flex items-center gap-2">
                  Ouvrir pour mon enfant <ArrowRight size={18} />
                </a>
                <a href="#tiers" className="btn btn-outline-white btn-lg">Découvrir</a>
              </div>
            </div>

            {/* Bonus card */}
            <div className="animate-fade-up delay-200">
              <div className="p-8 rounded-2xl text-center"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(201,146,26,0.4)", backdropFilter: "blur(20px)" }}>
                <div className="text-5xl mb-4">🎁</div>
                <h3 className="font-black text-white text-2xl mb-2">Bonus de bienvenue</h3>
                <p className="font-black mb-4" style={{ color: "var(--gold-300)", fontSize: "4rem", lineHeight: 1 }}>50 €</p>
                <p style={{ color: "rgba(255,255,255,0.72)" }}>
                  Crédités automatiquement à l&apos;ouverture du compte — pour donner à votre enfant le meilleur départ possible.
                </p>
                <div className="mt-5 pt-5 border-t flex items-center justify-center gap-2"
                  style={{ borderColor: "rgba(255,255,255,0.15)", color: "var(--gold-200)" }}>
                  <CheckCircle size={16} />
                  <span className="text-small">Valable jusqu&apos;au 31/12/2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-10" style={{ background: "linear-gradient(to top, #FAFAFA, transparent)" }} />
      </section>

      {/* Age tier tabs */}
      <section id="tiers" className="py-20 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="section-label">Tranches d&apos;âge</span>
            <h2 className="text-heading" style={{ color: "var(--gray-900)" }}>Un compte adapté à chaque âge</h2>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 p-1.5 rounded-2xl" style={{ background: "var(--gray-100)" }}>
            {AGE_TIERS.map((t, i) => (
              <button key={t.range} onClick={() => setActiveTab(i)}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all"
                style={activeTab === i
                  ? { background: "white", color: t.color, boxShadow: "var(--shadow-md)" }
                  : { color: "var(--gray-500)" }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="card p-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-4xl">{active.icon}</div>
              <div>
                <h3 className="font-black text-2xl" style={{ color: "var(--gray-900)" }}>{active.title}</h3>
                <p className="text-small" style={{ color: "var(--gray-500)" }}>Pour les {active.label}</p>
              </div>
              <div className="ml-auto w-4 h-4 rounded-full" style={{ background: active.color }} />
            </div>
            <div className="space-y-3">
              {active.features.map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <CheckCircle size={18} style={{ color: active.color }} />
                  <span className="text-body" style={{ color: "var(--gray-700)" }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Parent controls */}
      <section className="py-20 lg:py-24"
        style={{ background: "linear-gradient(135deg, var(--green-900), var(--green-700))" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge badge-gold mb-6">Contrôle parental</span>
              <h2 className="text-heading text-white mb-5">Parents : vous restez maîtres</h2>
              <p className="text-body-lg mb-6" style={{ color: "rgba(255,255,255,0.78)" }}>
                Supervision complète depuis l&apos;app KT Bank. Notifications en temps réel, limites de dépenses, historique détaillé.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Shield, text: "Approbation de chaque transaction" },
                  { icon: Lock, text: "Limites journalières personnalisables" },
                  { icon: Users, text: "Gestion multi-enfants depuis un seul compte" },
                  { icon: Star, text: "Rapports mensuels automatiques" },
                  { icon: Gift, text: "Transferts familiaux instantanés" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(201,146,26,0.2)" }}>
                      <Icon size={16} style={{ color: "var(--gold-300)" }} />
                    </div>
                    <span style={{ color: "rgba(255,255,255,0.88)" }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { val: "0 €", label: "Frais de gestion" },
                { val: "50 €", label: "Bonus bienvenue" },
                { val: "4.0%", label: "Profit max / an" },
                { val: "100%", label: "Halal certifié" },
              ].map((s) => (
                <div key={s.label} className="p-6 rounded-2xl text-center"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}>
                  <p className="font-black text-3xl mb-1" style={{ color: "var(--gold-300)" }}>{s.val}</p>
                  <p className="text-small" style={{ color: "rgba(255,255,255,0.6)" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Open account form */}
      <section id="open" className="py-20 lg:py-24" style={{ background: "var(--gray-50)" }}>
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="section-label">Ouvrir un compte</span>
            <h2 className="text-heading" style={{ color: "var(--gray-900)" }}>Créez le compte de votre enfant</h2>
          </div>
          {submitted ? (
            <div className="card p-10 text-center">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="font-bold text-xl mb-3" style={{ color: "var(--gray-900)" }}>Demande envoyée !</h3>
              <p className="text-body" style={{ color: "var(--gray-500)" }}>
                Compte créé pour <strong>{form.childName}</strong>. Le bonus de 50 € sera crédité sous 48h. Barakallah feekum.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card p-8 space-y-5">
              <div>
                <label className="label">Prénom et nom de l&apos;enfant</label>
                <input className="input" placeholder="Aisha Kader" required
                  value={form.childName} onChange={(e) => setForm({ ...form, childName: e.target.value })} />
              </div>
              <div>
                <label className="label">Date de naissance</label>
                <input className="input" type="date" required
                  value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
              </div>
              <div>
                <label className="label">Nom du parent / tuteur</label>
                <input className="input" placeholder="Omar Kader" required
                  value={form.parentName} onChange={(e) => setForm({ ...form, parentName: e.target.value })} />
              </div>
              <div>
                <label className="label">E-mail du parent</label>
                <input className="input" type="email" placeholder="parent@exemple.com" required
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <button type="submit"
                className="btn btn-lg w-full flex items-center justify-center gap-2 text-white"
                style={{ background: "linear-gradient(135deg, var(--green-700), var(--green-600))", boxShadow: "var(--shadow-green)" }}>
                Ouvrir avec 50 € offerts <Gift size={18} />
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
