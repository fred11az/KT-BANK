"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function PersonalLoansPage() {
  const [amount, setAmount] = useState(15000);
  const [months, setMonths] = useState(36);
  const margin = 0.04;

  const totalCost = amount * (1 + margin);
  const monthly = (totalCost / months).toFixed(2);

  return (
    <>
      <section className="relative py-28 text-white overflow-hidden"
        style={{ background: "linear-gradient(135deg, #4C1D95 0%, #7C3AED 60%, #8B5CF6 100%)" }}>
        <div className="relative max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6"
              style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>
              💰 Crédit Personnel Halal
            </div>
            <h1 className="text-5xl font-black mb-6">
              Jusqu'à <span style={{ color: "#FCD34D" }}>50 000€</span><br/>
              sans intérêts
            </h1>
            <p className="text-purple-100 text-lg leading-relaxed mb-8">
              Réalisez vos projets personnels (travaux, mariage, études, voyage) avec notre crédit islamique.
              Décision en ligne, aucun déplacement requis.
            </p>
            <div className="flex flex-wrap gap-3">
              {["✅ En ligne 100%", "⚡ Réponse rapide", "🔒 Taux fixe garanti", "☪️ Halal certifié"].map((i) => (
                <span key={i} className="px-4 py-2 rounded-full text-sm" style={{ background: "rgba(255,255,255,0.2)" }}>{i}</span>
              ))}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
            <div className="text-center">
              <div className="text-6xl mb-4">💰</div>
              <div className="text-4xl font-black text-white mb-2">50 000 €</div>
              <div className="text-purple-200">Montant maximum disponible</div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[{ v: "100%", l: "En ligne" }, { v: "24h", l: "Réponse" }, { v: "0%", l: "Intérêts" }, { v: "60 mois", l: "Max durée" }].map((s) => (
                  <div key={s.l} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.1)" }}>
                    <div className="text-xl font-black text-white">{s.v}</div>
                    <div className="text-xs text-purple-200">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none"><path d="M0,60 C360,0 1080,60 1440,15 L1440,60 Z" fill="#FAFAFA"/></svg>
        </div>
      </section>

      {/* Simulator */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-4xl font-black text-center text-gray-900 mb-10">Simulez votre crédit</h2>
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="space-y-6 mb-8">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-semibold text-gray-700">Montant souhaité</label>
                  <span className="font-black text-lg" style={{ color: "#7C3AED" }}>€{amount.toLocaleString("fr-FR")}</span>
                </div>
                <input type="range" min={1000} max={50000} step={500} value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  className="w-full accent-purple-600"/>
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>€1 000</span><span>€50 000</span></div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-semibold text-gray-700">Durée</label>
                  <span className="font-black text-lg" style={{ color: "#7C3AED" }}>{months} mois</span>
                </div>
                <input type="range" min={6} max={60} step={6} value={months}
                  onChange={e => setMonths(Number(e.target.value))}
                  className="w-full accent-purple-600"/>
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>6 mois</span><span>60 mois</span></div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xs text-gray-500">Montant total</div>
                  <div className="text-xl font-black text-gray-900">€{totalCost.toFixed(0)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Marge fixe</div>
                  <div className="text-xl font-black text-gray-900">4%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Mensualité</div>
                  <div className="text-2xl font-black" style={{ color: "#7C3AED" }}>€{monthly}</div>
                </div>
              </div>
            </div>
            <Link href="/client/register"
              className="mt-6 w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white"
              style={{ background: "linear-gradient(135deg, #7C3AED, #8B5CF6)" }}>
              Faire ma demande <ArrowRight size={18}/>
            </Link>
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-black text-center text-gray-900 mb-12">Conditions d'éligibilité</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Résidence en Allemagne",
              "Âge minimum : 18 ans",
              "Revenus stables (CDI, indépendant, retraite)",
              "Compte KT Bank (ouverture possible lors de la demande)",
              "Pas de fichage négatif (SCHUFA)",
              "Durée de résidence minimum : 1 an",
            ].map((c) => (
              <div key={c} className="flex items-center gap-3 p-4 rounded-2xl border border-gray-100 bg-gray-50">
                <CheckCircle size={18} style={{ color: "#005F2D" }}/>
                <span className="text-gray-700 text-sm">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-black text-center text-gray-900 mb-10">Pour quels projets ?</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {[{ i: "🏠", l: "Travaux" }, { i: "💍", l: "Mariage" }, { i: "📚", l: "Études" }, { i: "✈️", l: "Voyage" }, { i: "🚑", l: "Médical" }, { i: "🎓", l: "Formation" }].map((p) => (
              <div key={p.l} className="text-center p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all">
                <div className="text-3xl mb-1">{p.i}</div>
                <div className="text-sm font-medium text-gray-700">{p.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
