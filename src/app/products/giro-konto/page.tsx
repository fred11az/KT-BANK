"use client";
import Link from "next/link";
import { ArrowRight, CheckCircle, CreditCard, Smartphone, Shield, Zap, Globe, Banknote, Check, X } from "lucide-react";

const features = [
  { icon: Banknote, title: "Sans frais", desc: "Aucun frais de gestion mensuel, aucune commission cachée. Gratuit à vie." },
  { icon: Globe, title: "IBAN allemand", desc: "Votre IBAN DE… personnel disponible en 24h, accepté partout en Europe." },
  { icon: Smartphone, title: "App mobile", desc: "Gérez votre compte, suivez vos dépenses et transférez en temps réel." },
  { icon: Zap, title: "Virement instantané", desc: "SEPA Instant Payment 24h/7j — argent reçu en moins de 10 secondes." },
  { icon: CreditCard, title: "Carte Visa", desc: "Carte Visa Débit gratuite, acceptée dans plus de 200 pays." },
  { icon: Shield, title: "Halal certifié", desc: "Certifié par notre Shariah Board. Zéro intérêt (Riba), zéro compromis." },
];

const steps = [
  { num: "01", title: "Postulez en ligne", desc: "Formulaire digital en 5 minutes. Aucun déplacement requis." },
  { num: "02", title: "Vérifiez votre identité", desc: "VideoIdent ou eID depuis chez vous, en quelques minutes." },
  { num: "03", title: "Recevez votre IBAN", desc: "Compte activé sous 24h avec votre IBAN et carte Visa." },
  { num: "04", title: "Commencez à utiliser", desc: "Virements, paiements, épargne — 100% halal dès le premier jour." },
];

const comparison = [
  { feature: "Frais de gestion", kt: "0 €", classic: "5–15 €/mois" },
  { feature: "Intérêts (Riba)", kt: false, classic: true },
  { feature: "IBAN allemand immédiat", kt: true, classic: "3–7 jours" },
  { feature: "Certification Sharia", kt: true, classic: false },
  { feature: "Virement instantané", kt: true, classic: "En option payante" },
  { feature: "App mobile moderne", kt: true, classic: "Variable" },
];

export default function GiroKontoPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative pt-28 pb-32 text-white overflow-hidden hero-grid"
        style={{ background: "linear-gradient(135deg, var(--green-900) 0%, var(--green-700) 60%, #007A3D 100%)" }}
      >
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, var(--gold-400), transparent)", transform: "translate(30%,-30%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-up">
              <span className="section-label" style={{ background: "rgba(201,146,26,0.2)", border: "1px solid rgba(201,146,26,0.4)", color: "var(--gold-200)" }}>
                Compte courant
              </span>
              <h1 className="text-display text-white mt-2 mb-6">
                KT GiroKonto<br />
                <span style={{ color: "var(--gold-300)" }}>Sans frais. Halal.</span>
              </h1>
              <p className="text-body-lg mb-8" style={{ color: "rgba(255,255,255,0.8)" }}>
                Le premier compte courant islamique d'Allemagne. Gérez votre quotidien sans intérêts, sans compromis — certifié Sharia, réglementé BaFin.
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                {["Gratuit à vie", "Zéro Riba", "BaFin", "IBAN instantané"].map((t) => (
                  <span key={t} className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold"
                    style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)" }}>
                    <Check size={14} /> {t}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/client/register" className="btn btn-gold btn-lg flex items-center gap-2">
                  Ouvrir mon compte <ArrowRight size={18} />
                </Link>
                <Link href="#comparison" className="btn btn-outline-white btn-lg">En savoir plus</Link>
              </div>
            </div>

            {/* Card visual */}
            <div className="flex justify-center lg:justify-end animate-fade-up delay-200">
              <div className="relative">
                <div className="w-[340px] h-[200px] rounded-2xl p-7 flex flex-col justify-between shadow-2xl"
                  style={{ background: "linear-gradient(135deg, var(--green-800), #007A3D)", border: "1px solid rgba(201,146,26,0.4)" }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs mb-1" style={{ color: "var(--green-400)" }}>KT Bank AG</p>
                      <p className="font-black text-white text-xl">GiroKonto</p>
                    </div>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(201,146,26,0.25)" }}>
                      <span style={{ color: "var(--gold-300)" }}>☽</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>IBAN</p>
                    <p className="text-white font-mono text-sm tracking-wider">DE89 3704 0044 0532 0130 00</p>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="badge badge-gold text-xs">✓ Halal Certified</span>
                    <span className="text-white font-black text-lg tracking-widest">VISA</span>
                  </div>
                </div>
                <div className="absolute -bottom-3 -right-3 w-[320px] h-[185px] rounded-2xl -z-10"
                  style={{ background: "linear-gradient(135deg, var(--gold-400), var(--gold-200))", opacity: 0.18 }} />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-10" style={{ background: "linear-gradient(to top, #FAFAFA, transparent)" }} />
      </section>

      {/* Stats bar */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { val: "0 €", label: "Frais de gestion" },
              { val: "50K+", label: "Clients satisfaits" },
              { val: "24h", label: "Ouverture du compte" },
              { val: "100%", label: "Certifié Halal" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-black mb-1" style={{ color: "var(--green-700)" }}>{s.val}</p>
                <p className="text-small" style={{ color: "var(--gray-500)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 lg:py-24" style={{ background: "var(--gray-50)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="section-label">Fonctionnalités</span>
            <h2 className="text-heading" style={{ color: "var(--gray-900)" }}>Tout ce qu&apos;il vous faut</h2>
            <p className="text-body-lg mt-3 max-w-2xl mx-auto" style={{ color: "var(--gray-500)" }}>
              Un compte courant moderne qui respecte vos valeurs islamiques.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-7">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: "var(--green-50)", color: "var(--green-700)" }}>
                  <Icon size={26} />
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ color: "var(--gray-900)" }}>{title}</h3>
                <p className="text-small leading-relaxed" style={{ color: "var(--gray-500)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="section-label">Processus</span>
            <h2 className="text-heading" style={{ color: "var(--gray-900)" }}>Ouvrez en 4 étapes</h2>
            <p className="text-body mt-3" style={{ color: "var(--gray-500)" }}>Entièrement digital, sans agence, en moins de 10 minutes.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={step.num} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+32px)] w-[calc(100%-64px)] h-px"
                    style={{ background: "linear-gradient(90deg, var(--green-700), var(--gold-400))", opacity: 0.3 }} />
                )}
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-black text-xl mx-auto mb-4 relative z-10"
                  style={{ background: "linear-gradient(135deg, var(--green-800), var(--green-600))", boxShadow: "var(--shadow-green)" }}>
                  {step.num}
                </div>
                <h3 className="font-bold mb-2" style={{ color: "var(--gray-900)" }}>{step.title}</h3>
                <p className="text-small leading-relaxed" style={{ color: "var(--gray-500)" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section id="comparison" className="py-20 lg:py-24" style={{ background: "var(--gray-50)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="section-label">Comparatif</span>
            <h2 className="text-heading" style={{ color: "var(--gray-900)" }}>KT GiroKonto vs banque classique</h2>
          </div>
          <div className="card overflow-hidden p-0">
            <table className="table">
              <thead>
                <tr>
                  <th>Caractéristique</th>
                  <th style={{ color: "var(--green-700)" }}>KT GiroKonto</th>
                  <th>Banque classique</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.feature}>
                    <td className="font-medium">{row.feature}</td>
                    <td>
                      {typeof row.kt === "boolean" ? (
                        row.kt
                          ? <CheckCircle size={18} style={{ color: "var(--green-600)" }} />
                          : <X size={18} className="text-red-400" />
                      ) : (
                        <span className="font-semibold" style={{ color: "var(--green-700)" }}>{row.kt}</span>
                      )}
                    </td>
                    <td>
                      {typeof row.classic === "boolean" ? (
                        row.classic
                          ? <CheckCircle size={18} style={{ color: "var(--green-600)" }} />
                          : <X size={18} className="text-red-400" />
                      ) : (
                        <span style={{ color: "var(--gray-500)" }}>{row.classic}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24" style={{ background: "linear-gradient(135deg, var(--green-900), var(--green-700))" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <span className="badge badge-gold mb-6">Offre gratuite</span>
          <h2 className="text-heading text-white mb-4">Prêt à ouvrir votre compte halal ?</h2>
          <p className="text-body-lg mb-10" style={{ color: "rgba(255,255,255,0.75)" }}>
            Rejoignez plus de 50 000 clients qui gèrent leur argent en conformité avec leurs valeurs.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/client/register" className="btn btn-gold btn-xl flex items-center gap-2">
              Ouvrir gratuitement <ArrowRight size={20} />
            </Link>
            <Link href="/contact" className="btn btn-outline-white btn-xl">Contacter un conseiller</Link>
          </div>
        </div>
      </section>
    </>
  );
}
