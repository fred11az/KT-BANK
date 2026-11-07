"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle, Shield, Zap, Globe, Gift, CreditCard, Bell, RefreshCw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const installments = [
  { months: 3, rate: 0.5, label: "3 mois" },
  { months: 6, rate: 0.8, label: "6 mois" },
  { months: 12, rate: 1.2, label: "12 mois" },
  { months: 24, rate: 1.8, label: "24 mois" },
];

const benefits = [
  { icon: Shield, text: "Assurance achat incluse" },
  { icon: Globe, text: "Acceptée dans 200+ pays" },
  { icon: Zap, text: "Paiement sans contact" },
  { icon: Gift, text: "Programme de cashback" },
  { icon: Bell, text: "Alertes instantanées" },
  { icon: RefreshCw, text: "Remboursement flexible" },
  { icon: CreditCard, text: "Limite personnalisée" },
  { icon: CheckCircle, text: "Halal certifié (0% Riba)" },
];

interface FormState {
  name: string;
  email: string;
  income: string;
}

export default function JetzzCardPage() {
  const { t } = useLanguage();
  const j = t.home.jetzzcard;
  const [form, setForm] = useState<FormState>({ name: "", email: "", income: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      {/* Hero — dark premium */}
      <section
        className="relative pt-28 pb-36 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #070B14 0%, #0D1526 50%, #111D36 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none hero-grid" style={{ opacity: 0.6 }} />
        <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 60%)", transform: "translate(20%,-20%)" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-up">
              <span className="badge mb-6" style={{ background: "rgba(99,102,241,0.2)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.35)" }}>
                ✦ {j.heading}
              </span>
              <h1 className="text-display text-white mb-6">{j.heading}</h1>
              <p className="text-body-lg mb-10" style={{ color: "rgba(255,255,255,0.72)" }}>
                {j.desc}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="#apply" className="btn btn-xl flex items-center gap-2 text-white"
                  style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 8px 30px rgba(99,102,241,0.4)" }}>
                  {j.cta} <ArrowRight size={20} />
                </Link>
                <Link href="#plans" className="btn btn-outline-white btn-xl">{j.more}</Link>
              </div>
            </div>

            {/* Official KT Bank photo */}
            <div className="flex justify-center lg:justify-end animate-fade-up delay-200">
              <div className="relative w-full sm:w-[380px] aspect-[4/5] rounded-3xl overflow-hidden"
                style={{ boxShadow: "0 30px 80px rgba(99,102,241,0.5), 0 0 0 1px rgba(255,255,255,0.1)" }}>
                <Image src="/images/home/jetzzcard.jpg" alt={j.heading} fill style={{ objectFit: "cover" }} sizes="(min-width: 1024px) 380px, 100vw" priority />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-10" style={{ background: "linear-gradient(to top, #FAFAFA, transparent)" }} />
      </section>

      {/* Installment plans */}
      <section id="plans" className="py-20 lg:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="section-label">Paiement fractionné</span>
            <h2 className="text-heading" style={{ color: "var(--gray-900)" }}>Exemple pour un achat de 1 000 €</h2>
            <p className="text-body mt-3" style={{ color: "var(--gray-500)" }}>
              Frais de service fixes, zéro intérêt — conforme à la Sharia.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {installments.map((plan) => {
              const fee = (1000 * plan.rate) / 100;
              const total = 1000 + fee;
              const monthly = total / plan.months;
              return (
                <div key={plan.months} className="card p-6 text-center hover:border-indigo-300"
                  style={{ borderColor: plan.months === 12 ? "#6366f1" : undefined }}>
                  {plan.months === 12 && (
                    <div className="badge mb-3 mx-auto" style={{ background: "rgba(99,102,241,0.15)", color: "#6366f1" }}>
                      Populaire
                    </div>
                  )}
                  <p className="font-black text-3xl mb-1" style={{ color: "var(--gray-900)" }}>{plan.label}</p>
                  <p className="text-small mb-4" style={{ color: "var(--gray-400)" }}>Durée</p>
                  <div className="divider-gold mx-auto mb-4" />
                  <p className="font-black text-2xl mb-1" style={{ color: plan.months === 12 ? "#6366f1" : "var(--green-700)" }}>
                    {monthly.toFixed(2)} €<span className="text-sm font-normal">/mois</span>
                  </p>
                  <p className="text-small mb-2" style={{ color: "var(--gray-500)" }}>
                    Frais : +{fee.toFixed(2)} € ({plan.rate}%)
                  </p>
                  <p className="text-small" style={{ color: "var(--gray-400)" }}>Total : {total.toFixed(2)} €</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 lg:py-24" style={{ background: "var(--gray-50)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="section-label">Avantages</span>
            <h2 className="text-heading" style={{ color: "var(--gray-900)" }}>8 raisons de choisir Jetzz</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map(({ icon: Icon, text }) => (
              <div key={text} className="card p-6 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center"
                  style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1" }}>
                  <Icon size={22} />
                </div>
                <p className="font-semibold text-sm" style={{ color: "var(--gray-800)" }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application form */}
      <section id="apply" className="py-20 lg:py-24 bg-white">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="section-label">Demande</span>
            <h2 className="text-heading" style={{ color: "var(--gray-900)" }}>Demandez votre carte</h2>
            <p className="text-body mt-3" style={{ color: "var(--gray-500)" }}>Réponse en moins de 24h.</p>
          </div>
          {submitted ? (
            <div className="card p-10 text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
                style={{ background: "rgba(99,102,241,0.15)" }}>
                <CheckCircle size={32} style={{ color: "#6366f1" }} />
              </div>
              <h3 className="text-heading mb-3" style={{ color: "var(--gray-900)", fontSize: "1.5rem" }}>Demande reçue !</h3>
              <p className="text-body" style={{ color: "var(--gray-500)" }}>Nous vous contacterons sous 24h pour finaliser votre dossier.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card p-8 space-y-5">
              <div>
                <label className="label">Nom complet</label>
                <input className="input" placeholder="Mohammed Al-Rashid" required
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="label">Adresse e-mail</label>
                <input className="input" type="email" placeholder="vous@exemple.com" required
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="label">Revenu mensuel net (€)</label>
                <input className="input" type="number" placeholder="2 500" min="0" required
                  value={form.income} onChange={(e) => setForm({ ...form, income: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-xl w-full flex items-center justify-center gap-2 text-white"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 8px 24px rgba(99,102,241,0.35)" }}>
                Soumettre ma demande <ArrowRight size={20} />
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
