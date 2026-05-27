"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Shield,
  RefreshCw,
  Lock,
  Award,
  ChevronDown,
  Star,
  BarChart2,
} from "lucide-react";

const goldPrices = [
  { period: "1 Monat", change: "+2.4%", price: "87,42 €/g" },
  { period: "3 Monate", change: "+5.1%", price: "87,42 €/g" },
  { period: "6 Monate", change: "+8.7%", price: "87,42 €/g" },
  { period: "1 Jahr", change: "+18.3%", price: "87,42 €/g" },
  { period: "5 Jahre", change: "+62.4%", price: "87,42 €/g" },
];

const features = [
  { icon: <Award size={28} />, title: "LBMA-zertifiziertes Gold", desc: "Nur physisches Gold höchster Qualität (999,9 Feinheit), zertifiziert von der London Bullion Market Association." },
  { icon: <TrendingUp size={28} />, title: "Ab 1 € investieren", desc: "Starten Sie schon ab 1 Euro. Kaufen Sie bruchteilhaftes Gold — flexibel nach Ihrem Budget und ohne Mindestanlage." },
  { icon: <RefreshCw size={28} />, title: "Jederzeit verkaufen", desc: "Verkaufen Sie Ihr Gold jederzeit zum aktuellen Marktpreis. Innerhalb von 24 Stunden auf Ihrem Konto." },
  { icon: <Lock size={28} />, title: "Sicherer Tresor", desc: "Ihr Gold wird in hochgesicherten Tresoren in Deutschland gelagert — versichert, zertifiziert und Ihnen gehörend." },
  { icon: <Shield size={28} />, title: "Kein Verwaltungsgebühr", desc: "Keine jährlichen Verwaltungsgebühren. Nur ein transparenter Spread beim Kauf/Verkauf." },
  { icon: <BarChart2 size={28} />, title: "Shariah-konforme Anlage", desc: "Gold als Wertaufbewahrungsmittel (Hifz al-mal) ist im Islam ausdrücklich erlaubt. Unser Shariah Board bestätigt die Konformität." },
];

const faqs = [
  { q: "Wie kaufe ich Gold mit dem KT GoldKonto?", a: "Öffnen Sie die App oder das Online-Banking, wählen Sie 'Gold kaufen', geben Sie den Betrag ein und bestätigen Sie. Der Kauf wird sofort zum aktuellen LBMA-Preis ausgeführt." },
  { q: "Kann ich mein Gold physisch erhalten?", a: "Ja. Sie können jederzeit eine physische Lieferung Ihres Goldes in Form von Münzen oder Barren beantragen. Lieferungsgebühren fallen an." },
  { q: "Ist das GoldKonto Scharia-konform?", a: "Absolut. Gold ist eines der im Islam anerkannten Wertaufbewahrungsmittel. Unser Shariah Board hat das GoldKonto vollständig geprüft und zertifiziert. Es gibt keine Zinsen, keine Spekulation." },
  { q: "Was passiert, wenn der Goldpreis fällt?", a: "Wie bei jeder physischen Anlage tragen Sie das Marktrisiko. Wir empfehlen eine langfristige Perspektive. Historisch hat Gold über 10+ Jahre immer an Wert gewonnen." },
  { q: "Gibt es ein Limit beim Goldkauf?", a: "Ab 1 € bis zu 100.000 € pro Tag. Für größere Beträge kontaktieren Sie bitte unseren Private-Banking-Bereich." },
  { q: "Welche Steuern fallen auf Goldgewinne an?", a: "In Deutschland sind Gewinne aus physischem Gold nach einer Haltefrist von 1 Jahr steuerbefreit. Wir stellen Ihnen alle nötigen Unterlagen für Ihre Steuererklärung zur Verfügung." },
];

export default function GoldKontoPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [investAmount, setInvestAmount] = useState(1000);
  const [years, setYears] = useState(5);

  const goldGramsNow = investAmount / 87.42;
  const avgAnnualReturn = 0.092;
  const projectedValue = investAmount * Math.pow(1 + avgAnnualReturn, years);
  const projectedGrams = projectedValue / 87.42;

  return (
    <>
      {/* Hero */}
      <section
        className="relative py-28 text-white overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a0f00 0%, #3d2b00 50%, #5a4000 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect x='10' y='10' width='60' height='60' fill='none' stroke='%23C9A84C' stroke-width='1' transform='rotate(45 40 40)'/%3E%3C/svg%3E\")",
            backgroundSize: "80px 80px",
          }}
        />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #C9A84C, transparent)", transform: "translate(40%, -40%)" }} />

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
                style={{ background: "rgba(201,168,76,0.2)", border: "1px solid rgba(201,168,76,0.4)", color: "#E8C96B" }}
              >
                🥇 Kategorie: Investissement
              </div>
              <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
                KT GoldKonto
                <br />
                <span style={{ color: "#E8C96B" }}>Physisches Gold</span>
                <br />
                <span className="text-3xl font-bold text-yellow-200">ab 1 Euro</span>
              </h1>
              <p className="text-yellow-100 text-xl mb-8 leading-relaxed">
                Investieren Sie in LBMA-zertifiziertes physisches Gold — das bewährteste
                Wertaufbewahrungsmittel der islamischen Finanzgeschichte. Ohne Zinsen,
                ohne Spekulation, ohne versteckte Gebühren.
              </p>
              <div className="flex flex-wrap gap-4 mb-10">
                {["LBMA-zertifiziert", "Ab 1 €", "0 € Verwaltungsgebühr", "Jederzeit verkaufen"].map((tag) => (
                  <span key={tag} className="px-4 py-2 rounded-full text-sm font-semibold"
                    style={{ background: "rgba(201,168,76,0.2)", border: "1px solid rgba(201,168,76,0.4)", color: "#E8C96B" }}>
                    ✓ {tag}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/client/register"
                  className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all hover:-translate-y-1 hover:shadow-2xl"
                  style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96B)", boxShadow: "0 8px 30px rgba(201,168,76,0.5)", color: "#1a0f00" }}>
                  GoldKonto eröffnen <ArrowRight size={18} />
                </Link>
                <Link href="#simulator"
                  className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all"
                  style={{ border: "2px solid rgba(201,168,76,0.5)", color: "#E8C96B" }}>
                  Gold-Simulator testen
                </Link>
              </div>
            </div>

            {/* Live Gold Price Widget */}
            <div
              className="rounded-2xl p-6 shadow-2xl"
              style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)", backdropFilter: "blur(10px)" }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-yellow-300 text-xs font-semibold uppercase tracking-widest mb-1">Aktueller Goldpreis</div>
                  <div className="text-4xl font-black" style={{ color: "#E8C96B" }}>87,42 €/g</div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold text-lg">+1.24%</div>
                  <div className="text-yellow-300 text-xs">Heute</div>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                {goldPrices.map((p) => (
                  <div key={p.period} className="flex items-center justify-between py-2 border-b border-yellow-900/30">
                    <span className="text-yellow-200 text-sm">{p.period}</span>
                    <span className="text-green-400 font-bold text-sm">{p.change}</span>
                  </div>
                ))}
              </div>
              <div className="text-center text-yellow-400 text-xs">
                Preise aktualisiert alle 15 Minuten — Quelle: LBMA
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,60 C360,0 1080,60 1440,20 L1440,60 Z" fill="#F9FAFB" />
          </svg>
        </div>
      </section>

      {/* LBMA Certification Banner */}
      <section className="py-10 bg-gray-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { icon: "🏅", title: "LBMA-zertifiziert", sub: "999,9 Feinheit" },
              { icon: "🏦", title: "Lagerung in DE", sub: "Hochsicherheitstresor" },
              { icon: "📋", title: "Shariah-konform", sub: "Board-zertifiziert" },
              { icon: "🛡️", title: "Vollversichert", sub: "Lloyd's of London" },
            ].map((c) => (
              <div key={c.title} className="bg-white rounded-xl p-5 border border-gray-100">
                <div className="text-3xl mb-2">{c.icon}</div>
                <div className="font-black text-gray-900 text-sm">{c.title}</div>
                <div className="text-gray-400 text-xs">{c.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gold Price Simulation Widget */}
      <section id="simulator" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Gold-Wachstumssimulator</h2>
            <p className="text-gray-500 text-lg">Berechnen Sie, wie Ihr Gold über die Zeit wächst (historische Basis: Ø 9,2% p.a.)</p>
          </div>
          <div
            className="rounded-2xl p-8 border"
            style={{ background: "linear-gradient(135deg, #fffbf0, #fff8e7)", borderColor: "#C9A84C33" }}
          >
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-gray-700 font-bold mb-2">Investitionsbetrag</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold" style={{ color: "#C9A84C" }}>€</span>
                  <input
                    type="number"
                    value={investAmount}
                    onChange={(e) => setInvestAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-4 rounded-xl border-2 font-bold text-lg focus:outline-none"
                    style={{ borderColor: "#C9A84C", background: "white" }}
                    min={1}
                  />
                </div>
                <div className="flex gap-2 mt-3">
                  {[500, 1000, 5000, 10000].map((v) => (
                    <button key={v} onClick={() => setInvestAmount(v)}
                      className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
                      style={investAmount === v
                        ? { background: "#C9A84C", color: "white" }
                        : { background: "#f3f4f6", color: "#374151" }}>
                      {v >= 1000 ? `${v / 1000}K` : v}€
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">Anlagehorizont: {years} Jahre</label>
                <input
                  type="range"
                  min={1}
                  max={30}
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full mt-4"
                  style={{ accentColor: "#C9A84C" }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1 Jahr</span>
                  <span>30 Jahre</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="text-center bg-white rounded-xl p-5 border border-yellow-200">
                <div className="text-2xl font-black" style={{ color: "#C9A84C" }}>
                  {goldGramsNow.toFixed(2)}g
                </div>
                <div className="text-gray-500 text-sm">Gold heute</div>
              </div>
              <div className="text-center bg-white rounded-xl p-5 border border-yellow-200">
                <div className="text-2xl font-black" style={{ color: "#005F2D" }}>
                  {projectedGrams.toFixed(2)}g
                </div>
                <div className="text-gray-500 text-sm">Äquiv. in {years}J.</div>
              </div>
              <div className="text-center bg-white rounded-xl p-5 border border-green-200">
                <div className="text-2xl font-black" style={{ color: "#005F2D" }}>
                  {projectedValue.toLocaleString("de-DE", { maximumFractionDigits: 0 })} €
                </div>
                <div className="text-gray-500 text-sm">Hochgerechneter Wert</div>
              </div>
            </div>
            <p className="text-center text-gray-400 text-xs mt-4">
              * Simulation basiert auf historischem Ø-Wachstum. Vergangene Performance garantiert keine zukünftigen Ergebnisse.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Warum KT GoldKonto?</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Die sicherste islamische Anlage — seit Jahrhunderten bewährt, heute digital verfügbar.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-yellow-300 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(201,168,76,0.1)", color: "#C9A84C" }}>
                  {f.icon}
                </div>
                <h3 className="font-black text-gray-900 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LBMA Detail */}
      <section className="py-16" style={{ background: "linear-gradient(135deg, #1a0f00, #3d2b00)" }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-4xl mb-4">🏅</div>
              <h2 className="text-3xl font-black text-white mb-4">LBMA-Zertifizierung — Das Goldstandard-Siegel</h2>
              <p className="text-yellow-200 text-lg leading-relaxed mb-6">
                Die London Bullion Market Association (LBMA) ist die weltweit führende
                Körperschaft für den Goldmarkt. Nur Gold mit LBMA-Zertifizierung erfüllt
                die höchsten Reinheitsstandards (999,9 Feinheit — 24 Karat).
              </p>
              <div className="space-y-3">
                {[
                  "999,9 Goldfeinheit — höchste Qualitätsstufe",
                  "Herkunftszertifikat für jede Goldeinheit",
                  "Unabhängige Drittpartei-Prüfung",
                  "Handelbar an allen großen Goldbörsen weltweit",
                  "Konflikttreie Goldherkunft (Konfliktfreies Gold)",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-yellow-100">
                    <CheckCircle size={16} style={{ color: "#C9A84C" }} className="flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { v: "999,9", l: "Goldfeinheit" },
                { v: "Lloyd's", l: "Versicherung" },
                { v: "24/7", l: "Zugriff" },
                { v: "100%", l: "Ihr Eigentum" },
              ].map((s) => (
                <div key={s.l} className="rounded-xl p-6 text-center"
                  style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)" }}>
                  <div className="text-3xl font-black mb-1" style={{ color: "#E8C96B" }}>{s.v}</div>
                  <div className="text-yellow-300 text-sm">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Häufige Fragen</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-yellow-200 transition-colors">
                <button className="w-full flex items-center justify-between px-6 py-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-bold text-gray-900 pr-4">{faq.q}</span>
                  <ChevronDown size={20} className="text-gray-400 flex-shrink-0 transition-transform duration-200"
                    style={{ transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)" }} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-50 pt-3">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: "Ibrahim A.", role: "Investor seit 2020", text: "Das GoldKonto ist die beste islamische Geldanlage die ich kenne. Transparent, sicher, halal — und das Gold gehört mir wirklich.", stars: 5 },
              { name: "Mariam K.", role: "Kundin seit 2022", text: "Ich spare jeden Monat 200 € in Gold. In 2 Jahren habe ich schon schöne Renditen gesehen. Und ich schlafe ruhig, weil es halal ist.", stars: 5 },
            ].map((t) => (
              <div key={t.name} className="rounded-2xl p-6 border"
                style={{ background: "linear-gradient(135deg, #fffbf0, #fff8e7)", borderColor: "#C9A84C33" }}>
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={16} fill="#C9A84C" color="#C9A84C" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                    style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96B)", color: "#1a0f00" }}>
                    {t.name[0]}
                  </div>
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

      {/* CTA */}
      <section className="py-24" style={{ background: "linear-gradient(135deg, #1a0f00, #3d2b00)" }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-5xl mb-6">🥇</div>
          <h2 className="text-4xl font-black text-white mb-4">
            Beginnen Sie heute mit Gold zu sparen
          </h2>
          <p className="text-yellow-200 text-lg mb-8 max-w-2xl mx-auto">
            Schon ab 1 € investieren Sie in echtes, physisches, LBMA-zertifiziertes Gold.
            Halal, sicher, transparent.
          </p>
          <Link href="/client/register"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-lg transition-all hover:-translate-y-1 hover:shadow-2xl"
            style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96B)", boxShadow: "0 8px 30px rgba(201,168,76,0.5)", color: "#1a0f00" }}>
            GoldKonto jetzt eröffnen <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </>
  );
}
