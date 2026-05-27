"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Home,
  Calculator,
  Users,
  Shield,
  Clock,
  Star,
  FileText,
} from "lucide-react";

const steps = [
  { n: "01", t: "Erstberatung", d: "Kostenlose Beratung mit unserem Immobilienfinanzierungs-Experten — persönlich, telefonisch oder per Video." },
  { n: "02", t: "Objektprüfung", d: "Wir prüfen die gewünschte Immobilie auf Verkehrswert, Lage und Eignung für islamische Finanzierung." },
  { n: "03", t: "Finanzierungsangebot", d: "Innerhalb von 5 Werktagen erhalten Sie ein maßgeschneidertes Angebot — Murabaha oder Diminishing Musharaka." },
  { n: "04", t: "Shariah-Prüfung", d: "Jede Transaktion wird durch unser Shariah Board auf Scharia-Konformität geprüft und zertifiziert." },
  { n: "05", t: "Notartermin", d: "Gemeinsam mit unseren Partnernotaren in ganz Deutschland wird der Kaufvertrag beurkundet." },
  { n: "06", t: "Eigentumsübergabe", d: "Nach Kaufpreiszahlung erhalten Sie die Schlüssel — Sie sind offiziell Eigentümer Ihrer halalen Immobilie." },
];

const models = [
  {
    title: "Murabaha",
    subtitle: "Kaufpreisfinanzierung",
    icon: "🏡",
    color: "#B45309",
    desc: "KT Bank kauft die Immobilie und verkauft sie zu einem vereinbarten Aufpreis (Profit Margin) an Sie weiter. Sie zahlen in monatlichen Raten. Kein Zins — nur ein transparenter, vorab festgelegter Aufpreis.",
    pros: ["Einfaches, verständliches Modell", "Fester Gesamtpreis von Anfang an", "Keine Überraschungen", "Kürzere Laufzeiten bis 20 Jahre"],
    ideal: "Ideal für Käufer, die schnell kaufen möchten und einen fixen Gesamtpreis bevorzugen.",
  },
  {
    title: "Diminishing Musharaka",
    subtitle: "Schrumpfende Partnerschaft",
    icon: "📈",
    color: "#005F2D",
    desc: "KT Bank und Sie werden gemeinsame Miteigentümer der Immobilie. Sie zahlen monatlich Miete für KT Banks Anteil und kaufen sukzessive KT Banks Anteile auf — bis Sie alleiniger Eigentümer sind. Kein Zins, nur Miete.",
    pros: ["Flexibel bei Vorzahlungen", "Laufzeiten bis 30 Jahre", "Monatliche Rate sinkt mit Zeit", "Hauptwohnsitz & Kapitalanlage"],
    ideal: "Ideal für langfristige Finanzierungen mit flexiblen Raten und Wunsch nach niedrigen Anfangsraten.",
  },
];

const partnerNotaries = [
  { city: "Frankfurt", name: "Notariat Dr. Müller & Partner" },
  { city: "Berlin", name: "Berliner Notargesellschaft" },
  { city: "Köln", name: "Notariat Rheinland GmbH" },
  { city: "München", name: "Bayerisches Notariat Süd" },
  { city: "Hamburg", name: "Hamburgisches Notariat" },
  { city: "Stuttgart", name: "Württembergische Notare" },
];

export default function RealEstatePage() {
  const [propertyPrice, setPropertyPrice] = useState(350000);
  const [downPayment, setDownPayment] = useState(70000);
  const [years, setYears] = useState(25);
  const [model, setModel] = useState<"murabaha" | "musharaka">("musharaka");

  const loanAmount = propertyPrice - downPayment;
  const profitRate = model === "murabaha" ? 0.038 : 0.032;
  const months = years * 12;
  const monthlyRate = profitRate / 12;
  const monthlyPayment = loanAmount > 0
    ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
    : 0;
  const totalPayment = monthlyPayment * months;
  const totalProfit = totalPayment - loanAmount;
  const downPercent = Math.round((downPayment / propertyPrice) * 100);

  const [formData, setFormData] = useState({ name: "", email: "", phone: "", budget: "", city: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      {/* Hero */}
      <section
        className="relative py-28 text-white overflow-hidden"
        style={{ background: "linear-gradient(135deg, #431407 0%, #7c2d12 40%, #B45309 100%)" }}
      >
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect x='20' y='20' width='60' height='60' fill='none' stroke='white' stroke-width='1'/%3E%3Crect x='30' y='10' width='40' height='20' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E\")",
            backgroundSize: "100px 100px",
          }} />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #C9A84C, transparent)", transform: "translate(30%, -30%)" }} />

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
                style={{ background: "rgba(201,168,76,0.2)", border: "1px solid rgba(201,168,76,0.4)", color: "#E8C96B" }}>
                🏠 Kategorie: Immobilienfinanzierung
              </div>
              <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
                Halale Immobilien-
                <br />
                <span style={{ color: "#E8C96B" }}>finanzierung</span>
                <br />
                <span className="text-3xl font-bold text-orange-200">Zinsfrei. Sicher. Ihr.</span>
              </h1>
              <p className="text-orange-100 text-xl mb-8 leading-relaxed">
                Kaufen Sie Ihre Traumimmobilie mit islamischer Finanzierung. Murabaha oder
                Diminishing Musharaka — komplett ohne Zinsen, bis 30 Jahre Laufzeit,
                bis zu 90% Finanzierung. Mit Partnernotaren in ganz Deutschland.
              </p>
              <div className="flex flex-wrap gap-4 mb-10">
                {["Zinsfrei (Halal)", "Bis 90% Finanzierung", "Bis 30 Jahre", "Partnernotare DE"].map((tag) => (
                  <span key={tag} className="px-4 py-2 rounded-full text-sm font-semibold"
                    style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)" }}>
                    ✓ {tag}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="#calculator"
                  className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all hover:-translate-y-1 hover:shadow-2xl"
                  style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96B)", boxShadow: "0 8px 30px rgba(201,168,76,0.4)", color: "#431407" }}>
                  <Calculator size={18} /> Jetzt simulieren
                </Link>
                <Link href="#application"
                  className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all hover:bg-white/10"
                  style={{ border: "2px solid rgba(255,255,255,0.4)", color: "white" }}>
                  Beratung anfragen
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { v: "30 J.", l: "Max. Laufzeit", i: "📅" },
                { v: "90%", l: "Finanzierungsquote", i: "🏠" },
                { v: "5 WT", l: "Angebotserstellung", i: "⚡" },
                { v: "6", l: "Partnernotare", i: "⚖️" },
              ].map((s) => (
                <div key={s.l} className="rounded-xl p-5"
                  style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
                  <div className="text-3xl mb-2">{s.i}</div>
                  <div className="text-2xl font-black" style={{ color: "#E8C96B" }}>{s.v}</div>
                  <div className="text-orange-200 text-sm">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,60 C360,0 1080,60 1440,20 L1440,60 Z" fill="#F9FAFB" />
          </svg>
        </div>
      </section>

      {/* Financing Models */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Murabaha vs. Diminishing Musharaka</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Zwei bewährte islamische Finanzierungsmodelle — beide 100% zinsfrei und Scharia-konform.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {models.map((m) => (
              <div key={m.title}
                className="bg-white rounded-2xl p-8 border-2 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl"
                style={{ borderColor: `${m.color}30` }}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{m.icon}</div>
                  <div>
                    <h3 className="font-black text-gray-900 text-2xl">{m.title}</h3>
                    <div className="text-sm font-semibold" style={{ color: m.color }}>{m.subtitle}</div>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed mb-5">{m.desc}</p>
                <div className="space-y-2 mb-5">
                  {m.pros.map((p) => (
                    <div key={p} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle size={14} style={{ color: m.color }} className="flex-shrink-0" />
                      {p}
                    </div>
                  ))}
                </div>
                <div className="rounded-xl p-4 text-sm italic"
                  style={{ background: `${m.color}08`, borderLeft: `3px solid ${m.color}`, color: "#374151" }}>
                  {m.ideal}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mortgage Calculator */}
      <section id="calculator" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <Calculator size={40} className="mx-auto mb-4" style={{ color: "#B45309" }} />
            <h2 className="text-4xl font-black text-gray-900 mb-4">Finanzierungsrechner</h2>
            <p className="text-gray-500 text-lg">Simulieren Sie Ihre monatliche Rate — statische Berechnung basierend auf aktuellen Profit-Margins.</p>
          </div>

          <div className="rounded-2xl p-8 border-2 shadow-lg"
            style={{ background: "linear-gradient(135deg, #fff8f0, #fffbf7)", borderColor: "#B4530930" }}>
            {/* Model selection */}
            <div className="mb-8">
              <label className="block font-bold text-gray-800 mb-3">Finanzierungsmodell</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setModel("murabaha")}
                  className="py-3 px-4 rounded-xl font-bold transition-all"
                  style={model === "murabaha"
                    ? { background: "#B45309", color: "white" }
                    : { background: "#f3f4f6", color: "#374151" }}>
                  🏡 Murabaha (Profit: 3,8%)
                </button>
                <button type="button" onClick={() => setModel("musharaka")}
                  className="py-3 px-4 rounded-xl font-bold transition-all"
                  style={model === "musharaka"
                    ? { background: "#005F2D", color: "white" }
                    : { background: "#f3f4f6", color: "#374151" }}>
                  📈 Dim. Musharaka (3,2%)
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block font-bold text-gray-700 mb-2">Kaufpreis</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold" style={{ color: "#B45309" }}>€</span>
                  <input type="number" value={propertyPrice}
                    onChange={(e) => setPropertyPrice(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-3 rounded-xl border-2 font-semibold focus:outline-none"
                    style={{ borderColor: "#B4530930" }} />
                </div>
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-2">Eigenkapital ({downPercent}%)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold" style={{ color: "#B45309" }}>€</span>
                  <input type="number" value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-3 rounded-xl border-2 font-semibold focus:outline-none"
                    style={{ borderColor: "#B4530930" }} />
                </div>
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-2">Laufzeit: {years} Jahre</label>
                <input type="range" min={5} max={30} value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full mt-4" style={{ accentColor: "#B45309" }} />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>5 J.</span><span>30 J.</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Finanzierungsbetrag", val: `${loanAmount.toLocaleString("de-DE")} €`, highlight: false },
                { label: "Monatliche Rate", val: `${monthlyPayment.toLocaleString("de-DE", { maximumFractionDigits: 0 })} €`, highlight: true },
                { label: "Gesamtkosten", val: `${totalPayment.toLocaleString("de-DE", { maximumFractionDigits: 0 })} €`, highlight: false },
                { label: "Profit Margin", val: `${totalProfit.toLocaleString("de-DE", { maximumFractionDigits: 0 })} €`, highlight: false },
              ].map((s) => (
                <div key={s.label} className="text-center rounded-xl p-4 bg-white border"
                  style={{ borderColor: s.highlight ? "#B45309" : "#e5e7eb" }}>
                  <div className="text-xl font-black"
                    style={{ color: s.highlight ? "#B45309" : "#1f2937" }}>{s.val}</div>
                  <div className="text-gray-500 text-xs mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-400 text-xs mt-4">
              * Richtwerte — individuelle Angebote basieren auf Bonitätsprüfung und Objektbewertung.
            </p>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Der Weg zu Ihrer halalen Immobilie</h2>
            <p className="text-gray-500 text-lg">6 klar definierte Schritte — von der Beratung bis zur Schlüsselübergabe.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div key={step.n} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-orange-200 transition-colors hover:-translate-y-1 duration-300">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white mb-4"
                  style={{ background: "linear-gradient(135deg, #B45309, #D97706)" }}>
                  {step.n}
                </div>
                <h3 className="font-black text-gray-900 mb-2">{step.t}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Notaries */}
      <section className="py-16" style={{ background: "linear-gradient(135deg, #431407, #7c2d12)" }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <FileText size={40} className="mx-auto mb-4 text-orange-300" />
            <h2 className="text-3xl font-black text-white mb-3">Unsere Partnernotare</h2>
            <p className="text-orange-200 text-lg">In den 6 größten deutschen Städten — für eine reibungslose Beurkundung.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {partnerNotaries.map((n) => (
              <div key={n.city} className="rounded-xl p-5 flex items-center gap-4"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black"
                  style={{ background: "rgba(201,168,76,0.3)" }}>⚖️</div>
                <div>
                  <div className="font-black text-white">{n.city}</div>
                  <div className="text-orange-300 text-xs">{n.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="application" className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <Home size={40} className="mx-auto mb-4" style={{ color: "#B45309" }} />
            <h2 className="text-4xl font-black text-gray-900 mb-4">Beratung anfragen</h2>
            <p className="text-gray-500 text-lg">Kostenlos, unverbindlich, halal.</p>
          </div>
          {submitted ? (
            <div className="rounded-2xl p-12 text-center border-2 border-orange-300"
              style={{ background: "linear-gradient(135deg, #fff8f0, #fffbf7)" }}>
              <div className="text-5xl mb-4">🏠</div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Anfrage erhalten!</h3>
              <p className="text-gray-600">Unser Immobilien-Berater meldet sich innerhalb von 24h.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-2 text-sm">Ihr Name *</label>
                  <input type="text" required placeholder="Ahmed Mustermann"
                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-400 text-sm" />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2 text-sm">E-Mail *</label>
                  <input type="email" required placeholder="ihre@email.de"
                    value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-400 text-sm" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-2 text-sm">Telefon</label>
                  <input type="tel" placeholder="+49 30 1234567"
                    value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-400 text-sm" />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2 text-sm">Kaufpreisbereich</label>
                  <select value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-400 text-sm bg-white">
                    <option value="">Bitte wählen...</option>
                    <option>bis 200.000 €</option>
                    <option>200.000 – 400.000 €</option>
                    <option>400.000 – 700.000 €</option>
                    <option>über 700.000 €</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-2 text-sm">Gewünschter Standort</label>
                <input type="text" placeholder="z.B. Berlin, Frankfurt..."
                  value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-400 text-sm" />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-2 text-sm">Zusätzliche Informationen</label>
                <textarea rows={3} placeholder="Beschreiben Sie kurz Ihr Immobilienprojekt..."
                  value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-400 text-sm resize-none" />
              </div>
              <button type="submit"
                className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #B45309, #D97706)" }}>
                <Home size={20} /> Beratung anfragen <ArrowRight size={18} />
              </button>
            </form>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24" style={{ background: "linear-gradient(135deg, #431407, #7c2d12)" }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-5xl mb-6">🏠</div>
          <h2 className="text-4xl font-black text-white mb-4">
            Ihr Eigenheim — halal finanziert
          </h2>
          <p className="text-orange-200 text-lg mb-8 max-w-2xl mx-auto">
            Werden Sie Hauseigentümer ohne einen einzigen Cent Zinsen zu zahlen.
            Mit KT Bank ist das möglich — und das schon seit 2015.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/client/register"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all hover:-translate-y-1 hover:shadow-2xl"
              style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96B)", boxShadow: "0 8px 30px rgba(201,168,76,0.4)", color: "#431407" }}>
              Konto eröffnen <ArrowRight size={18} />
            </Link>
            <Link href="/contact"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold"
              style={{ border: "2px solid rgba(255,255,255,0.4)", color: "white" }}>
              Berater sprechen
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
