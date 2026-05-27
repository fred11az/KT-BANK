"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, TrendingUp, Shield, CheckCircle } from "lucide-react";

export default function FestgeldKontoPage() {
  const [amount, setAmount] = useState("10000");
  const [duration, setDuration] = useState("12");

  const rates: Record<string, number> = { "3": 0.035, "6": 0.040, "12": 0.045 };
  const rate = rates[duration] || 0.045;
  const profit = parseFloat(amount || "0") * rate * (parseFloat(duration) / 12);
  const total = parseFloat(amount || "0") + profit;

  return (
    <>
      <section className="relative py-28 text-white overflow-hidden"
        style={{ background: "linear-gradient(135deg, #064E3B 0%, #065F46 50%, #059669 100%)" }}>
        <div className="relative max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6"
              style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>
              📈 KT FestgeldKonto — Épargne Garantie
            </div>
            <h1 className="text-5xl font-black mb-6">
              Votre épargne qui{" "}
              <span style={{ color: "#FCD34D" }}>fructifie</span>
            </h1>
            <p className="text-green-100 text-lg leading-relaxed mb-8">
              Bénéficiez de rendements garantis et au-dessus du marché, conformes à la finance islamique.
              Jusqu'à 4.5% de profit annuel, sans aucun frais.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[{ rate: "3.5%", dur: "3 mois" }, { rate: "4.0%", dur: "6 mois" }, { rate: "4.5%", dur: "12 mois" }].map((r) => (
                <div key={r.dur} className="text-center p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}>
                  <div className="text-2xl font-black" style={{ color: "#FCD34D" }}>{r.rate}</div>
                  <div className="text-green-200 text-sm">{r.dur}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
            <TrendingUp size={48} className="mb-4" style={{ color: "#FCD34D" }}/>
            <div className="text-3xl font-black text-white mb-2">Rendements garantis</div>
            <div className="text-green-200 mb-4">Profit fixe et transparent dès le départ. Halal certifié.</div>
            <div className="flex flex-col gap-2">
              {["Aucun frais de gestion", "Renouvellement automatique", "Sécurisé par le Fonds de Garantie (EDB)", "Conforme à la charia (Mudaraba)"].map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-green-100">
                  <CheckCircle size={14} style={{ color: "#FCD34D" }}/>
                  {f}
                </div>
              ))}
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
          <h2 className="text-4xl font-black text-center text-gray-900 mb-10">Calculez votre profit</h2>
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="space-y-4 mb-8">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Montant à déposer (€)</label>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none text-sm focus:border-green-500 transition"
                  placeholder="Minimum 1 000€"/>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Durée</label>
                <div className="grid grid-cols-3 gap-3">
                  {[["3", "3 mois", "3.5%"], ["6", "6 mois", "4.0%"], ["12", "12 mois", "4.5%"]].map(([v, label, r]) => (
                    <button key={v} onClick={() => setDuration(v)}
                      className={`py-3 rounded-xl font-medium text-sm border-2 transition-all ${duration === v ? "text-white" : "border-gray-200 text-gray-700 bg-white"}`}
                      style={duration === v ? { background: "linear-gradient(135deg, #059669, #10B981)", borderColor: "transparent" } : {}}>
                      {label}<br/><span className="text-xs font-bold" style={duration === v ? { color: "#FCD34D" } : { color: "#059669" }}>{r}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xs text-gray-500">Dépôt initial</div>
                  <div className="text-xl font-black text-gray-900">€{parseFloat(amount||"0").toLocaleString("fr-FR")}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Profit garanti</div>
                  <div className="text-xl font-black" style={{ color: "#059669" }}>+€{profit.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Total à l'échéance</div>
                  <div className="text-2xl font-black" style={{ color: "#059669" }}>€{total.toFixed(2)}</div>
                </div>
              </div>
            </div>
            <Link href="/client/register"
              className="mt-6 w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white"
              style={{ background: "linear-gradient(135deg, #059669, #10B981)" }}>
              Ouvrir mon FestgeldKonto <ArrowRight size={18}/>
            </Link>
          </div>
        </div>
      </section>

      {/* Rates table */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-black text-center text-gray-900 mb-10">Tableau des taux</h2>
          <div className="rounded-2xl overflow-hidden border border-gray-200">
            <table className="w-full">
              <thead style={{ background: "linear-gradient(135deg, #059669, #10B981)" }}>
                <tr>
                  <th className="px-6 py-4 text-left text-white font-semibold">Durée</th>
                  <th className="px-6 py-4 text-center text-white font-semibold">Taux de profit</th>
                  <th className="px-6 py-4 text-center text-white font-semibold">Profit sur 10 000€</th>
                  <th className="px-6 py-4 text-right text-white font-semibold">Montant final</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { dur: "3 mois", rate: "3.5%", profit: "87.50€", total: "10 087.50€" },
                  { dur: "6 mois", rate: "4.0%", profit: "200.00€", total: "10 200.00€" },
                  { dur: "12 mois", rate: "4.5%", profit: "450.00€", total: "10 450.00€", best: true },
                ].map((row) => (
                  <tr key={row.dur} className={row.best ? "bg-green-50" : "bg-white border-t border-gray-100"}>
                    <td className="px-6 py-4 font-medium text-gray-900">{row.dur} {row.best && <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-bold">Meilleur taux</span>}</td>
                    <td className="px-6 py-4 text-center font-black text-lg" style={{ color: "#059669" }}>{row.rate}</td>
                    <td className="px-6 py-4 text-center text-gray-700">+{row.profit}</td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-center text-gray-400 mt-3">Basé sur un dépôt de 10 000€. Les profits sont garantis dès l'ouverture du compte.</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: <Shield size={28}/>, title: "Dépôts garantis", desc: "Jusqu'à 100 000€ par l'EDB" },
            { icon: <TrendingUp size={28}/>, title: "Rendement supérieur", desc: "Au-dessus du marché européen" },
            { icon: "☪️", title: "Halal certifié", desc: "Contrat Mudaraba conforme charia" },
            { icon: "🔄", title: "Renouvellement auto", desc: "Ou récupération à l'échéance" },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-6 text-center border border-gray-100 hover:shadow-md transition-all">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center" style={{ background: "#D1FAE5", color: "#059669" }}>
                {typeof f.icon === "string" ? <span className="text-2xl">{f.icon}</span> : f.icon}
              </div>
              <div className="font-bold text-gray-900 text-sm mb-1">{f.title}</div>
              <div className="text-gray-500 text-xs">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mudaraba Explanation */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-5xl mb-4">📜</div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">Mudaraba — Das islamische Gewinnbeteiligungsmodell</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-5">
                Das KT FestgeldKonto basiert auf dem islamischen Mudaraba-Prinzip. Sie als Kapitalgeber
                (Rabb al-Maal) stellen Ihr Geld zur Verfügung. KT Bank (Mudarib) investiert es
                in halale, Scharia-konforme Projekte. Der vorab vereinbarte Profit wird transparent
                zwischen Ihnen und der Bank aufgeteilt.
              </p>
              <div className="space-y-3">
                {[
                  "Vorab vereinbarte, transparente Profitrate",
                  "Investition ausschließlich in Halal-Projekte",
                  "Keine Zinsen (Riba) — echter Gewinn aus realer Wirtschaft",
                  "Jährliche Shariah-Board-Zertifizierung",
                  "Einlagensicherung bis 100.000 € (EDB)",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle size={16} style={{ color: "#059669" }} className="flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {[
                { step: "1", title: "Sie einzahlen", desc: "Mindestens 1.000 €, Laufzeit 3, 6 oder 12 Monate." },
                { step: "2", title: "KT Bank investiert", desc: "Ihr Kapital wird in Scharia-konforme Projekte investiert." },
                { step: "3", title: "Gewinn wird verteilt", desc: "Der vorab vereinbarte Profit wird Ihrem Konto gutgeschrieben." },
                { step: "4", title: "Rückzahlung", desc: "Am Ende der Laufzeit erhalten Sie Ihr Kapital + Profit zurück." },
              ].map((s) => (
                <div key={s.step} className="flex gap-4 p-5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white flex-shrink-0"
                    style={{ background: "#059669" }}>{s.step}</div>
                  <div>
                    <div className="font-black text-gray-900 mb-1">{s.title}</div>
                    <div className="text-gray-500 text-sm">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Who is it for */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Für wen ist das FestgeldKonto?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "👨‍👩‍👧", title: "Familien", desc: "Sichern Sie das Ersparte für Ihre Familie — mit garantierter Rendite und islamischen Prinzipien." },
              { icon: "🏢", title: "Selbstständige", desc: "Parken Sie Unternehmensgewinne sicher und profitabel — ohne Zinsen." },
              { icon: "🎓", title: "Junge Sparer", desc: "Beginnen Sie schon ab 1.000 € Ihrem langfristigen Sparziel entgegenzuarbeiten." },
            ].map((p) => (
              <div key={p.title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-3">{p.icon}</div>
                <h3 className="font-black text-gray-900 mb-2">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24" style={{ background: "linear-gradient(135deg, #064E3B, #059669)" }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-5xl mb-6">📈</div>
          <h2 className="text-4xl font-black text-white mb-4">Lassen Sie Ihr Geld für Sie arbeiten</h2>
          <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
            Bis zu 4,5% garantierter Profit pro Jahr. Halal, sicher, transparent.
            Ab 1.000 € Mindesteinlage.
          </p>
          <Link href="/client/register"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-lg transition-all hover:-translate-y-1 hover:shadow-2xl"
            style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96B)", boxShadow: "0 8px 30px rgba(201,168,76,0.4)", color: "#064E3B" }}>
            FestgeldKonto eröffnen <ArrowRight size={20}/>
          </Link>
        </div>
      </section>
    </>
  );
}
