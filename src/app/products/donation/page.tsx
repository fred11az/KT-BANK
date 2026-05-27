"use client";
import { useState } from "react";
import Link from "next/link";
import { Heart, CheckCircle } from "lucide-react";

const DONATION_TYPES = [
  { id: "zakat", label: "Zakat", icon: "🌙", desc: "2.5% de votre épargne annuelle au-dessus du Nisab (€5 500)." },
  { id: "sadaqa", label: "Sadaqa", icon: "💚", desc: "Don volontaire à tout moment — chaque bien compte." },
  { id: "fitr", label: "Zakat al-Fitr", icon: "⭐", desc: "Don obligatoire à la fin du Ramadan pour chaque membre du foyer." },
  { id: "jariya", label: "Sadaqa Jariya", icon: "🌱", desc: "Don durable — puits, école, mosquée. Récompense continue." },
];

const AMOUNTS = [10, 25, 50, 100];

const PROJECTS = [
  "Eau potable — Afrique subsaharienne",
  "École islamique — Bangladesh",
  "Aide alimentaire d'urgence — Gaza",
  "Construction mosquée — Allemagne",
  "Soutien aux réfugiés — Europe",
];

const PARTNERS = ["Islamic Relief", "Mercy Relief", "Zakat House", "UNHCR", "Caritas Islamica", "Humanitas"];

const NISAB = 5500;

export default function DonationPage() {
  const [savings, setSavings] = useState("");
  const [zakatResult, setZakatResult] = useState<number | null>(null);

  const [donationType, setDonationType] = useState("zakat");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(25);
  const [customAmount, setCustomAmount] = useState("");
  const [project, setProject] = useState(PROJECTS[0]);
  const [submitted, setSubmitted] = useState(false);

  function calcZakat() {
    const val = parseFloat(savings);
    if (!isNaN(val) && val > NISAB) {
      setZakatResult((val - NISAB) * 0.025);
    } else {
      setZakatResult(0);
    }
  }

  function handleDonate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  const finalAmount = selectedAmount ?? (parseFloat(customAmount) || 0);

  return (
    <>
      {/* Hero */}
      <section
        className="relative pt-28 pb-32 text-white overflow-hidden hero-grid"
        style={{ background: "linear-gradient(135deg, #451a03 0%, #92400e 50%, #b45309 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 60% 30%, rgba(251,191,36,0.2) 0%, transparent 60%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl"
              style={{ background: "rgba(251,191,36,0.2)", border: "1px solid rgba(251,191,36,0.4)" }}>
              🌙
            </div>
            <span className="badge mb-4" style={{ background: "rgba(251,191,36,0.2)", color: "#fde68a", border: "1px solid rgba(251,191,36,0.35)" }}>
              Don islamique · Zakat · Sadaqa
            </span>
            <h1 className="text-display text-white mb-5">
              Donnez avec <span style={{ color: "#fde68a" }}>intention</span>
            </h1>
            <p className="text-body-lg mb-6" style={{ color: "rgba(255,255,255,0.8)" }}>
              &ldquo;Qui est-ce qui prêterait à Allah un prêt sincère qu&apos;Il lui rendrait au double ?&rdquo; — Sourate Al-Baqara 2:245
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="#donate" className="btn btn-xl flex items-center gap-2 text-white"
                style={{ background: "linear-gradient(135deg, #d97706, #b45309)", boxShadow: "0 8px 30px rgba(217,119,6,0.4)" }}>
                <Heart size={20} /> Faire un don
              </a>
              <a href="#calculator" className="btn btn-outline-white btn-xl">Calculer ma Zakat</a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-10" style={{ background: "linear-gradient(to top, #FAFAFA, transparent)" }} />
      </section>

      {/* 4 donation types */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="section-label">Types de dons</span>
            <h2 className="text-heading" style={{ color: "var(--gray-900)" }}>Quelle forme de don ?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DONATION_TYPES.map((type) => (
              <div key={type.id} className="card p-6 text-center">
                <div className="text-4xl mb-4">{type.icon}</div>
                <h3 className="font-bold text-lg mb-2" style={{ color: "var(--gray-900)" }}>{type.label}</h3>
                <p className="text-small leading-relaxed" style={{ color: "var(--gray-500)" }}>{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zakat calculator */}
      <section id="calculator" className="py-20 lg:py-24"
        style={{ background: "linear-gradient(135deg, #451a03, #92400e)" }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="badge mb-4" style={{ background: "rgba(251,191,36,0.2)", color: "#fde68a" }}>Calculateur</span>
            <h2 className="text-heading text-white">Calculez votre Zakat</h2>
            <p className="text-body mt-3" style={{ color: "rgba(255,255,255,0.7)" }}>
              Nisab : {NISAB.toLocaleString("fr-FR")} € — Sur l&apos;excédent, vous devez 2.5%
            </p>
          </div>
          <div className="p-8 rounded-2xl" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(251,191,36,0.25)", backdropFilter: "blur(16px)" }}>
            <label className="label text-white mb-2">Votre épargne annuelle (€)</label>
            <div className="flex gap-3 mb-6">
              <input className="input flex-1" type="number" placeholder={`Ex: ${(NISAB * 2).toLocaleString("fr-FR")}`}
                value={savings} onChange={(e) => setSavings(e.target.value)} />
              <button onClick={calcZakat}
                className="btn btn-lg px-6 text-white flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #d97706, #b45309)" }}>
                Calculer
              </button>
            </div>
            {zakatResult !== null && (
              <div className="p-5 rounded-xl text-center"
                style={{ background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.3)" }}>
                {zakatResult > 0 ? (
                  <>
                    <p className="text-small mb-2" style={{ color: "rgba(255,255,255,0.7)" }}>Votre Zakat obligatoire</p>
                    <p className="font-black text-3xl" style={{ color: "#fde68a" }}>{zakatResult.toFixed(2)} €</p>
                    <p className="text-small mt-2" style={{ color: "rgba(255,255,255,0.6)" }}>
                      Soit 2.5% de {(parseFloat(savings) - NISAB).toFixed(2)} € (au-dessus du Nisab)
                    </p>
                  </>
                ) : (
                  <p style={{ color: "#fde68a" }}>
                    Votre épargne est en dessous du Nisab ({NISAB.toLocaleString("fr-FR")} €). La Zakat n&apos;est pas obligatoire, mais la Sadaqa est toujours bienvenue. 💚
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Donation form */}
      <section id="donate" className="py-20 lg:py-24 bg-white">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="section-label">Faire un don</span>
            <h2 className="text-heading" style={{ color: "var(--gray-900)" }}>Choisissez votre don</h2>
          </div>
          {submitted ? (
            <div className="card p-10 text-center">
              <div className="text-5xl mb-4">🌙</div>
              <h3 className="font-black text-2xl mb-3" style={{ color: "var(--gray-900)" }}>JazakAllah Khairan !</h3>
              <p className="text-body mb-2" style={{ color: "var(--gray-600)" }}>
                Votre don de <strong>{finalAmount} €</strong> pour <em>{project}</em> a été reçu.
              </p>
              <p className="text-small" style={{ color: "var(--gray-400)" }}>Que Allah accepte votre sadaqa et vous récompense.</p>
            </div>
          ) : (
            <form onSubmit={handleDonate} className="card p-8 space-y-6">
              {/* Type */}
              <div>
                <label className="label">Type de don</label>
                <div className="grid grid-cols-2 gap-3">
                  {DONATION_TYPES.map((t) => (
                    <button key={t.id} type="button" onClick={() => setDonationType(t.id)}
                      className="flex items-center gap-2 p-3 rounded-xl font-semibold text-sm transition-all text-left"
                      style={donationType === t.id
                        ? { background: "rgba(217,119,6,0.12)", border: "2px solid #d97706", color: "#92400e" }
                        : { background: "var(--gray-50)", border: "2px solid var(--gray-200)", color: "var(--gray-600)" }}>
                      <span>{t.icon}</span> {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="label">Montant</label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {AMOUNTS.map((a) => (
                    <button key={a} type="button" onClick={() => { setSelectedAmount(a); setCustomAmount(""); }}
                      className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
                      style={selectedAmount === a
                        ? { background: "#d97706", color: "white", boxShadow: "0 4px 16px rgba(217,119,6,0.35)" }
                        : { background: "var(--gray-100)", color: "var(--gray-700)" }}>
                      {a} €
                    </button>
                  ))}
                </div>
                <input className="input" type="number" placeholder="Montant personnalisé (€)" min={1}
                  value={customAmount}
                  onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }} />
              </div>

              {/* Project */}
              <div>
                <label className="label">Projet</label>
                <select className="input" value={project} onChange={(e) => setProject(e.target.value)}>
                  {PROJECTS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <button type="submit" disabled={finalAmount <= 0}
                className="btn btn-xl w-full flex items-center justify-center gap-2 text-white disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #d97706, #b45309)", boxShadow: "0 8px 24px rgba(217,119,6,0.35)" }}>
                <Heart size={20} /> Donner {finalAmount > 0 ? `${finalAmount} €` : ""}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* NGO Partners */}
      <section className="py-16" style={{ background: "var(--gray-50)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="section-label mb-6">Nos partenaires ONG</span>
          <h3 className="text-heading mb-8" style={{ color: "var(--gray-900)" }}>Partenaires de confiance</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {PARTNERS.map((p) => (
              <span key={p} className="px-5 py-2.5 rounded-full font-semibold text-sm"
                style={{ background: "var(--gold-100)", color: "var(--gold-600)", border: "1px solid var(--gold-200)" }}>
                {p}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-center gap-3 mt-8">
            <CheckCircle size={18} style={{ color: "var(--green-600)" }} />
            <p className="text-body" style={{ color: "var(--gray-600)" }}>100% des dons atteignent les bénéficiaires. Aucune commission prélevée.</p>
          </div>
        </div>
      </section>
    </>
  );
}
