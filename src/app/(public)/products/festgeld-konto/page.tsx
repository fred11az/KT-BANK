"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, TrendingUp, Shield, Lock, CheckCircle } from "lucide-react";

const rateTable = [
  { duration: "3 mois", rate: "3.5%", minAmount: "1 000 €", note: "Profit fixe trimestriel" },
  { duration: "6 mois", rate: "4.0%", minAmount: "1 000 €", note: "Profit fixe semestriel" },
  { duration: "12 mois", rate: "4.5%", minAmount: "1 000 €", note: "Profit annuel — taux le plus attractif" },
  { duration: "24 mois", rate: "4.8%", minAmount: "5 000 €", note: "Profit long terme, verrouillé" },
];

const DURATIONS = [
  { label: "3 mois", months: 3, rate: 0.035 },
  { label: "6 mois", months: 6, rate: 0.04 },
  { label: "12 mois", months: 12, rate: 0.045 },
];

const featureCards = [
  { icon: TrendingUp, title: "Taux jusqu'à 4.5%", desc: "Des rendements compétitifs sur vos dépôts à terme." },
  { icon: Shield, title: "Garantie BaFin", desc: "Dépôts garantis jusqu'à 100 000 € par le fonds allemand." },
  { icon: Lock, title: "Capital sécurisé", desc: "Votre capital est préservé — aucun risque de perte." },
  { icon: CheckCircle, title: "Halal & Sharia", desc: "Contrat Wakala — profit partagé, pas d'intérêts (Riba)." },
];

export default function FestgeldKontoPage() {
  const [amount, setAmount] = useState(10000);
  const [durationIdx, setDurationIdx] = useState(1);

  const selected = DURATIONS[durationIdx];
  const profit = amount * selected.rate * (selected.months / 12);
  const total = amount + profit;

  return (
    <>
      {/* Hero */}
      <section
        className="relative pt-28 pb-32 text-white overflow-hidden hero-grid"
        style={{ background: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #065f46 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 75% 25%, rgba(0,185,100,0.18) 0%, transparent 55%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-up">
              <span className="badge badge-green mb-6" style={{ background: "rgba(6,95,70,0.5)", color: "#6ee7b7", border: "1px solid rgba(52,211,153,0.35)" }}>
                Épargne à terme · Wakala
              </span>
              <h1 className="text-display text-white mb-6">
                KT FestGeld<br />
                <span style={{ color: "#6ee7b7" }}>jusqu&apos;à 4.5% / an</span>
              </h1>
              <p className="text-body-lg mb-8" style={{ color: "rgba(255,255,255,0.78)" }}>
                Faites fructifier votre épargne avec un profit fixe et garanti. Contrat Wakala conforme Sharia, capital protégé par la BaFin.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="#calculator" className="btn btn-xl flex items-center gap-2 text-white"
                  style={{ background: "linear-gradient(135deg, #059669, #047857)", boxShadow: "0 8px 30px rgba(5,150,105,0.4)" }}>
                  Calculer mon profit <ArrowRight size={20} />
                </Link>
                <Link href="#rates" className="btn btn-outline-white btn-xl">Voir les taux</Link>
              </div>
            </div>

            {/* Rate preview */}
            <div className="animate-fade-up delay-200">
              <div className="space-y-3">
                {DURATIONS.map((d, i) => (
                  <div key={d.label} className="flex items-center justify-between p-5 rounded-2xl"
                    style={{ background: i === 2 ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.07)", border: `1px solid ${i === 2 ? "rgba(52,211,153,0.4)" : "rgba(255,255,255,0.12)"}` }}>
                    <div>
                      <p className="font-bold text-white">{d.label}</p>
                      <p className="text-small" style={{ color: "rgba(255,255,255,0.55)" }}>Durée de blocage</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-2xl" style={{ color: i === 2 ? "#6ee7b7" : "#a7f3d0" }}>
                        {(d.rate * 100).toFixed(1)}%
                      </p>
                      <p className="text-small" style={{ color: "rgba(255,255,255,0.5)" }}>/ an</p>
                    </div>
                    {i === 2 && <span className="badge ml-3" style={{ background: "#059669", color: "white" }}>Meilleur</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-10" style={{ background: "linear-gradient(to top, #FAFAFA, transparent)" }} />
      </section>

      {/* Profit calculator */}
      <section id="calculator" className="py-20 lg:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="section-label">Calculateur</span>
            <h2 className="text-heading" style={{ color: "var(--gray-900)" }}>Estimez votre profit</h2>
          </div>
          <div className="card p-8">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <label className="label mb-0">Montant déposé</label>
                <span className="font-black text-xl" style={{ color: "#059669" }}>{amount.toLocaleString("fr-FR")} €</span>
              </div>
              <input type="range" min={1000} max={500000} step={1000} value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: "#059669" }} />
              <div className="flex justify-between text-small mt-1" style={{ color: "var(--gray-400)" }}>
                <span>1 000 €</span><span>500 000 €</span>
              </div>
            </div>

            <div className="mb-8">
              <label className="label mb-3">Durée</label>
              <div className="flex gap-3">
                {DURATIONS.map((d, i) => (
                  <button key={d.label} onClick={() => setDurationIdx(i)}
                    className="flex-1 py-3 rounded-xl font-bold text-sm transition-all"
                    style={durationIdx === i
                      ? { background: "#059669", color: "white", boxShadow: "0 4px 16px rgba(5,150,105,0.35)" }
                      : { background: "var(--gray-100)", color: "var(--gray-600)" }}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl text-center"
                style={{ background: "rgba(5,150,105,0.07)", border: "1px solid rgba(5,150,105,0.2)" }}>
                <p className="text-small mb-2" style={{ color: "var(--gray-500)" }}>Profit estimé</p>
                <p className="font-black text-3xl" style={{ color: "#059669" }}>+{profit.toFixed(2)} €</p>
                <p className="text-small mt-1" style={{ color: "var(--gray-400)" }}>Taux {(selected.rate * 100).toFixed(1)}% / an</p>
              </div>
              <div className="p-5 rounded-2xl text-center"
                style={{ background: "rgba(5,150,105,0.04)", border: "1px solid rgba(5,150,105,0.12)" }}>
                <p className="text-small mb-2" style={{ color: "var(--gray-500)" }}>Capital + profit</p>
                <p className="font-black text-3xl" style={{ color: "var(--gray-900)" }}>{total.toFixed(2)} €</p>
                <p className="text-small mt-1" style={{ color: "var(--gray-400)" }}>À l&apos;échéance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full rate table */}
      <section id="rates" className="py-20 lg:py-24" style={{ background: "var(--gray-50)" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="section-label">Grille tarifaire</span>
            <h2 className="text-heading" style={{ color: "var(--gray-900)" }}>Taux de profit</h2>
          </div>
          <div className="card overflow-hidden p-0">
            <table className="table">
              <thead>
                <tr>
                  <th>Durée</th>
                  <th>Taux annuel</th>
                  <th>Montant min.</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {rateTable.map((row) => (
                  <tr key={row.duration}>
                    <td className="font-semibold">{row.duration}</td>
                    <td><span className="font-black" style={{ color: "#059669" }}>{row.rate}</span></td>
                    <td style={{ color: "var(--gray-600)" }}>{row.minAmount}</td>
                    <td className="text-small" style={{ color: "var(--gray-500)" }}>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="section-label">Pourquoi KT FestGeld ?</span>
            <h2 className="text-heading" style={{ color: "var(--gray-900)" }}>Sécurité et performance</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureCards.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-7 text-center">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: "rgba(5,150,105,0.1)", color: "#059669" }}>
                  <Icon size={26} />
                </div>
                <h3 className="font-bold mb-2" style={{ color: "var(--gray-900)" }}>{title}</h3>
                <p className="text-small leading-relaxed" style={{ color: "var(--gray-500)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24" style={{ background: "linear-gradient(135deg, #022c22, #065f46)" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-heading text-white mb-4">Commencez à faire fructifier votre épargne</h2>
          <p className="text-body-lg mb-10" style={{ color: "rgba(255,255,255,0.72)" }}>
            Jusqu&apos;à 4.5% de profit annuel — garanti, halal, protégé par la BaFin.
          </p>
          <Link href="/client/register" className="btn btn-xl flex items-center gap-2 mx-auto w-fit text-white"
            style={{ background: "linear-gradient(135deg, #059669, #047857)", boxShadow: "0 8px 30px rgba(5,150,105,0.4)" }}>
            Ouvrir mon FestGeld <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </>
  );
}
