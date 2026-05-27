"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, Car, Calculator } from "lucide-react";

export default function VehicleFinancingPage() {
  const [price, setPrice] = useState("20000");
  const [down, setDown] = useState("5000");
  const [months, setMonths] = useState("60");
  const [margin] = useState(0.035); // 3.5% margin (halal, no interest)

  const totalFinanced = Math.max(0, parseFloat(price || "0") - parseFloat(down || "0"));
  const totalCost = totalFinanced * (1 + margin);
  const monthly = months ? (totalCost / parseFloat(months)).toFixed(2) : "0.00";

  const steps = [
    { n: "01", title: "Simulez en ligne", desc: "Utilisez notre calculateur pour estimer vos mensualités" },
    { n: "02", title: "Choisissez votre véhicule", desc: "Neuf ou occasion, tous types de véhicules acceptés" },
    { n: "03", title: "Soumettez votre dossier", desc: "100% en ligne, réponse en 24h" },
    { n: "04", title: "KT Bank achète le véhicule", desc: "La banque achète le véhicule au concessionnaire (Murabaha)" },
    { n: "05", title: "Vous devenez propriétaire", desc: "KT Bank vous revend le véhicule avec une marge fixe et transparente" },
  ];

  return (
    <>
      <section className="relative py-28 text-white overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #1E40AF 60%, #2563EB 100%)" }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cpolygon fill='white' points='50,0 100,25 100,75 50,100 0,75 0,25'/%3E%3C/svg%3E\")", backgroundSize: "80px" }}></div>
        <div className="relative max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>
              🚗 Financement Automobile
            </div>
            <h1 className="text-5xl font-black mb-6">
              Votre véhicule{" "}
              <span style={{ color: "#FCD34D" }}>sans intérêts</span>
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed mb-8">
              Financement halal via le contrat Murabaha. KT Bank achète le véhicule et vous le revend
              avec une marge fixe et transparente. Aucun intérêt, accord en 24h, jusqu'à 100 mois.
            </p>
            <div className="flex flex-wrap gap-3">
              {["✅ Accord en 24h", "🚗 Neuf & Occasion", "📅 Jusqu'à 100 mois", "0% Intérêt"].map((i) => (
                <span key={i} className="px-4 py-2 rounded-full text-sm" style={{ background: "rgba(255,255,255,0.2)" }}>{i}</span>
              ))}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
            <div className="text-center text-white text-6xl mb-4">🚗</div>
            <div className="text-center text-white">
              <div className="font-bold text-xl mb-1">Contrat Murabaha</div>
              <div className="text-blue-200 text-sm">KT Bank achète → vous revend → vous remboursez</div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none"><path d="M0,60 C360,0 1080,60 1440,15 L1440,60 Z" fill="#FAFAFA"/></svg>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-10">
            <Calculator size={40} className="mx-auto mb-4" style={{ color: "#1E40AF" }}/>
            <h2 className="text-4xl font-black text-gray-900 mb-2">Simulateur de financement</h2>
            <p className="text-gray-500">Estimez vos mensualités (contrat Murabaha — sans intérêts)</p>
          </div>
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="space-y-4 mb-8">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Prix du véhicule (€)</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none text-sm focus:border-blue-500 transition" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Apport personnel (€)</label>
                <input type="number" value={down} onChange={e => setDown(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none text-sm focus:border-blue-500 transition" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Durée (mois)</label>
                <select value={months} onChange={e => setMonths(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none text-sm focus:border-blue-500 transition bg-white">
                  {[12,24,36,48,60,72,84,96,100].map(m => <option key={m} value={m}>{m} mois</option>)}
                </select>
              </div>
            </div>
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Montant financé</div>
                  <div className="text-xl font-black text-gray-900">€{totalFinanced.toLocaleString("fr-FR")}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Coût total (marge fixe)</div>
                  <div className="text-xl font-black text-gray-900">€{totalCost.toFixed(0)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Mensualité estimée</div>
                  <div className="text-2xl font-black" style={{ color: "#1E40AF" }}>€{monthly}</div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center">
                * Simulation indicative. Marge fixe de 3.5%. Pas d'intérêts variables. Offre sous réserve d'acceptation.
              </p>
            </div>
            <Link href="/client/register"
              className="mt-6 w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #1E40AF, #2563EB)" }}>
              Faire ma demande <ArrowRight size={18}/>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-black text-gray-900 text-center mb-12">Comment ça marche ?</h2>
          <div className="space-y-6">
            {steps.map((s) => (
              <div key={s.n} className="flex items-start gap-6 p-5 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #1E40AF, #2563EB)" }}>
                  {s.n}
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">{s.title}</div>
                  <div className="text-gray-500 text-sm mt-1">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { icon: "🕌", feat: "100% Halal certifié — Murabaha" },
              { icon: "⚡", feat: "Accord en 24h garantis" },
              { icon: "📅", feat: "Jusqu'à 100 mois de remboursement" },
              { icon: "🚗", feat: "Véhicules neufs et d'occasion" },
              { icon: "💯", feat: "Financement jusqu'à 100% du prix" },
              { icon: "🔐", feat: "Marge fixe, jamais variable" },
            ].map((f) => (
              <div key={f.feat} className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-gray-100">
                <span className="text-2xl">{f.icon}</span>
                <span className="text-sm font-medium text-gray-700">{f.feat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shariah Explanation */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-5xl mb-4">☽</div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">Murabaha Auto — Wie es funktioniert</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-5">
                Beim islamischen Murabaha-Autokredit kauft KT Bank das Fahrzeug in Ihrem Auftrag direkt vom Händler.
                Dann verkauft die Bank es zu einem transparent vereinbarten Gesamtpreis an Sie.
                Sie zahlen in monatlichen Raten — ohne einen einzigen Cent Zinsen.
              </p>
              <div className="space-y-3">
                {[
                  "KT Bank kauft das Fahrzeug vom Händler",
                  "Sie einigen sich auf Gesamtpreis & Laufzeit",
                  "Feste monatliche Rate — keine Überraschungen",
                  "Kein Zins (Riba) — nur ein transparenter Aufpreis",
                  "Fahrzeug gehört sofort Ihnen",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle size={16} style={{ color: "#1E40AF" }} className="flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "🏎️", title: "Alle Fahrzeugarten", sub: "PKW, SUV, Van, Elektro" },
                { icon: "🔑", title: "Neu & Gebraucht", sub: "Bis 100% Finanzierung" },
                { icon: "📅", title: "Bis 100 Monate", sub: "Flexible Laufzeit" },
                { icon: "⚡", title: "Entscheid in 24h", sub: "Schnelle Bearbeitung" },
              ].map((c) => (
                <div key={c.title} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <div className="text-3xl mb-2">{c.icon}</div>
                  <div className="font-black text-gray-900 text-sm">{c.title}</div>
                  <div className="text-gray-500 text-xs">{c.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: "Hassan M.", role: "Kunde seit 2022", text: "Mein neues Elektroauto — finanziert ohne Zinsen über KT Bank. Der Prozess war einfach und transparent. Ich bin sehr zufrieden." },
              { name: "Sara K.", role: "Kundin seit 2021", text: "Gebrauchtwagen für meine Familie, 48 Monate, kein Zinsen. KT Bank hat das hervorragend abgewickelt. Empfehlung!" },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map(i => <span key={i} style={{ color: "#1E40AF" }}>★</span>)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                    style={{ background: "#1E40AF" }}>{t.name[0]}</div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-gray-400 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24" style={{ background: "linear-gradient(135deg, #1E3A5F, #1E40AF)" }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-5xl mb-6">🚗</div>
          <h2 className="text-4xl font-black text-white mb-4">Ihr Fahrzeug — halal finanziert</h2>
          <p className="text-blue-200 text-lg mb-8 max-w-2xl mx-auto">
            Neues oder gebrauchtes Fahrzeug, bis zu 100 Monate, ohne Zinsen.
            Online beantragen und Entscheid in 24h erhalten.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/client/register"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all hover:-translate-y-1 hover:shadow-2xl"
              style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96B)", boxShadow: "0 8px 30px rgba(201,168,76,0.4)", color: "#1E3A5F" }}>
              Finanzierung beantragen <ArrowRight size={18}/>
            </Link>
            <Link href="/contact"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold"
              style={{ border: "2px solid rgba(255,255,255,0.4)", color: "white" }}>
              Berater kontaktieren
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
