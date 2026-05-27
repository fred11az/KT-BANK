"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Shield,
  Zap,
  FileText,
  Star,
  ChevronDown,
  Euro,
  Home,
} from "lucide-react";

const PRIMARY = "#005F2D";
const GOLD = "#C9A84C";

const features = [
  {
    icon: <Euro size={26} />,
    title: "Bis zu 50.000 €",
    desc: "Finanzieren Sie Ihre persönlichen Vorhaben — ohne Zinsen, ohne Riba. Transparente Festgebühr nach Murabaha-Prinzip.",
    color: PRIMARY,
  },
  {
    icon: <Clock size={26} />,
    title: "Antwort in 24 Stunden",
    desc: "Nach vollständiger Einreichung Ihrer Unterlagen erhalten Sie eine Vorentscheidung innerhalb eines Arbeitstages.",
    color: GOLD,
  },
  {
    icon: <Shield size={26} />,
    title: "100% Scharia-konform",
    desc: "Kein Riba. Unser Shariah Board zertifiziert alle Finanzierungsprodukte gemäß islamischen Finanzprinzipien.",
    color: PRIMARY,
  },
  {
    icon: <Zap size={26} />,
    title: "Flexible Laufzeiten",
    desc: "Wählen Sie Laufzeiten von 6 bis 84 Monaten. Die monatliche Rate bleibt konstant und unveränderlich.",
    color: GOLD,
  },
  {
    icon: <FileText size={26} />,
    title: "Minimale Unterlagen",
    desc: "Nur 3 Gehaltsabrechnungen, Personalausweis und Kontoauszug. Keine aufwändige Bürokratie.",
    color: PRIMARY,
  },
  {
    icon: <Home size={26} />,
    title: "Vielseitig verwendbar",
    desc: "Renovierung, Bildung, Hochzeit, Reise oder unvorhergesehene Ausgaben — ohne Verwendungsnachweis.",
    color: GOLD,
  },
];

const eligibilityItems = [
  "Mindestalter 18 Jahre, Wohnsitz in Deutschland",
  "Regelmäßiges monatliches Nettoeinkommen (mind. 800 €)",
  "Positiver Schufa-Score (oder individuelle Prüfung möglich)",
  "Gültige IBAN bei KT Bank oder Bereitschaft zur Kontoeröffnung",
  "Mindestens 3 Monate am aktuellen Arbeitsplatz tätig",
  "Kein laufendes Insolvenzverfahren",
];

const processSteps = [
  { n: "01", title: "Online-Antrag stellen", desc: "Formular in weniger als 5 Minuten ausfüllen — kein Filialbesuch nötig." },
  { n: "02", title: "Dokumente hochladen", desc: "Personalausweis, Gehaltsabrechnungen und Kontoauszug digital einreichen." },
  { n: "03", title: "Prüfung & Entscheidung", desc: "Unser Team prüft Ihren Antrag und gibt eine Vorentscheidung innerhalb von 24h." },
  { n: "04", title: "Angebot unterzeichnen", desc: "Digitale Vertragsunterzeichnung — einfach, sicher und vollständig papierlos." },
  { n: "05", title: "Auszahlung", desc: "Nach Unterzeichnung wird der Betrag innerhalb von 48 Stunden überwiesen." },
];

const purposes = [
  { icon: "🏠", label: "Renovierung" },
  { icon: "💍", label: "Hochzeit" },
  { icon: "📚", label: "Bildung" },
  { icon: "✈️", label: "Reise" },
  { icon: "🚑", label: "Medizinisch" },
  { icon: "💼", label: "Selbstständigkeit" },
];

export default function PersonalLoansPage() {
  const [amount, setAmount] = useState(15000);
  const [months, setMonths] = useState(36);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", income: "", purpose: "", requestedAmount: "" });
  const [submitted, setSubmitted] = useState(false);
  const margin = 0.04;

  const totalCost = amount * (1 + margin);
  const monthly = (totalCost / months).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <section className="relative py-28 text-white overflow-hidden"
        style={{ background: `linear-gradient(135deg, #003D1C 0%, ${PRIMARY} 55%, #007A3D 100%)` }}>
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Ccircle cx='30' cy='30' r='20' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E\")", backgroundSize: "60px 60px" }} />
        <div className="relative max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
              style={{ background: "rgba(201,168,76,0.2)", border: "1px solid rgba(201,168,76,0.4)", color: "#E8C96B" }}>
              💰 Islamischer Kredit Personnel
            </div>
            <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
              Persönlicher Kredit<br />
              <span style={{ color: GOLD }}>bis zu 50.000 €</span><br />
              <span className="text-3xl font-bold text-green-200">100% Zinsfrei & Halal</span>
            </h1>
            <p className="text-green-100 text-xl leading-relaxed mb-8">
              Finanzieren Sie Ihre Träume nach islamischen Prinzipien. Kein Riba, keine versteckten Kosten —
              transparente Festgebühr nach Murabaha, zertifiziert vom Shariah Board.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              {["Bis 50.000 €", "Antwort in 24h", "0% Zinsen", "Laufzeit 6–84 Monate"].map((tag) => (
                <span key={tag} className="px-4 py-2 rounded-full text-sm font-medium"
                  style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
                  ✓ {tag}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="#simulator"
                className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all hover:-translate-y-1"
                style={{ background: `linear-gradient(135deg, ${GOLD}, #E8C96B)`, color: "#003D1C" }}>
                Simulieren <ArrowRight size={18} />
              </Link>
              <Link href="/contact"
                className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all hover:bg-white/10"
                style={{ border: "2px solid rgba(255,255,255,0.4)", color: "white" }}>
                Berater sprechen
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { val: "50.000 €", label: "Max. Kreditbetrag", icon: "💰" },
              { val: "24h", label: "Entscheidungszeit", icon: "⚡" },
              { val: "84 Monate", label: "Max. Laufzeit", icon: "📅" },
              { val: "0%", label: "Zinsen (Riba)", icon: "🕌" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl p-5"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-2xl font-black" style={{ color: GOLD }}>{s.val}</div>
                <div className="text-green-200 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none"><path d="M0,60 C360,0 1080,60 1440,20 L1440,60 Z" fill="#F9FAFB" /></svg>
        </div>
      </section>

      {/* Simulator */}
      <section id="simulator" className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-gray-900 mb-3">Kreditrechner</h2>
            <p className="text-gray-500 text-lg">Berechnen Sie Ihre monatliche Rate — zinslos nach Murabaha</p>
          </div>
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">Kreditbetrag</label>
                <span className="text-xl font-black" style={{ color: PRIMARY }}>€{amount.toLocaleString("de-DE")}</span>
              </div>
              <input type="range" min={1000} max={50000} step={500} value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: PRIMARY }} />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>€1.000</span><span>€50.000</span>
              </div>
            </div>
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Laufzeit</label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {[6, 12, 24, 36, 60, 84].map((m) => (
                  <button key={m} onClick={() => setMonths(m)}
                    className="py-2.5 rounded-xl text-sm font-bold transition-all"
                    style={months === m
                      ? { background: PRIMARY, color: "white", boxShadow: `0 4px 12px ${PRIMARY}50` }
                      : { background: "#F3F4F6", color: "#374151" }}>
                    {m} Mo.
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-2xl p-6 mb-6"
              style={{ background: `linear-gradient(135deg, ${PRIMARY}10, ${GOLD}10)` }}>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Finanzierungsbetrag</p>
                  <p className="text-lg font-black text-gray-900">€{amount.toLocaleString("de-DE")}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Monatliche Rate</p>
                  <p className="text-2xl font-black" style={{ color: PRIMARY }}>€{monthly}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Gesamtbetrag (4% Festgebühr)</p>
                  <p className="text-lg font-black text-gray-900">€{totalCost.toFixed(0)}</p>
                </div>
              </div>
              <p className="text-center text-xs text-gray-400 mt-3">
                * Festgebühr (Murabaha): 4% — kein variabler Zins, kein Riba. Simulation — unverbindlich.
              </p>
            </div>
            <Link href="/client/register"
              className="block w-full py-4 rounded-xl font-bold text-white text-center flex items-center justify-center gap-2 hover:opacity-90 transition-all"
              style={{ background: `linear-gradient(135deg, ${PRIMARY}, #007A3D)` }}>
              Jetzt beantragen <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Eligibility + Testimonial */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">Voraussetzungen</h2>
              <p className="text-gray-500 mb-6">Wir prüfen jeden Antrag individuell — diese Grundvoraussetzungen erhöhen Ihre Chancen erheblich.</p>
              <div className="space-y-3">
                {eligibilityItems.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle size={18} className="flex-shrink-0 mt-0.5" style={{ color: PRIMARY }} />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl p-8 border border-gray-100 shadow-md"
              style={{ background: "linear-gradient(135deg, #f0fdf4, #fafafa)" }}>
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map((i) => <Star key={i} size={18} fill={GOLD} color={GOLD} />)}
              </div>
              <p className="text-gray-700 text-lg leading-relaxed italic mb-6">
                "Ich brauchte 15.000 € für die Renovierung meines Hauses. Innerhalb von 2 Tagen hatte ich die
                Genehmigung und das Geld auf dem Konto — ohne Zinsen und vollständig halal."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center font-black text-white text-xl"
                  style={{ background: `linear-gradient(135deg, ${PRIMARY}, #007A3D)` }}>R</div>
                <div>
                  <div className="font-black text-gray-900">Rachid B.</div>
                  <div className="text-gray-500 text-sm">Frankfurt am Main</div>
                  <div className="text-xs font-semibold" style={{ color: PRIMARY }}>Kredit: 15.000 €</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-black text-center text-gray-900 mb-3">Wofür können Sie den Kredit nutzen?</h2>
          <p className="text-gray-500 text-center mb-10">Ohne Verwendungsnachweis — für jeden halal zulässigen Zweck.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {purposes.map((p) => (
              <div key={p.label} className="flex items-center gap-3 p-5 rounded-2xl border border-gray-100 hover:border-green-300 bg-white transition-colors">
                <div className="text-3xl">{p.icon}</div>
                <span className="font-semibold text-gray-700">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Antrag stellen</h2>
            <p className="text-gray-500 text-lg">Antwort innerhalb von 24 Stunden.</p>
          </div>
          {submitted ? (
            <div className="rounded-2xl p-12 text-center border-2 border-green-300"
              style={{ background: "linear-gradient(135deg, #f0fdf4, #ecfdf5)" }}>
              <CheckCircle size={56} style={{ color: PRIMARY }} className="mx-auto mb-4" />
              <h3 className="text-2xl font-black text-gray-900 mb-3">Antrag eingegangen!</h3>
              <p className="text-gray-600 text-lg">
                Hallo <strong>{formData.name}</strong>, Ihr Antrag wurde übermittelt.
                Wir melden uns innerhalb von 24 Stunden bei {formData.email}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-2 text-sm">Vollständiger Name *</label>
                  <input type="text" required placeholder="Max Mustermann"
                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-400 text-sm" />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2 text-sm">E-Mail *</label>
                  <input type="email" required placeholder="max@beispiel.de"
                    value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-400 text-sm" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-2 text-sm">Telefon *</label>
                  <input type="tel" required placeholder="+49 170 1234567"
                    value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-400 text-sm" />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2 text-sm">Monatliches Nettoeinkommen *</label>
                  <select required value={formData.income} onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-400 text-sm bg-white">
                    <option value="">Bitte wählen...</option>
                    <option>Unter €1.000</option>
                    <option>€1.000 – €2.000</option>
                    <option>€2.000 – €3.500</option>
                    <option>€3.500 – €5.000</option>
                    <option>Über €5.000</option>
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-2 text-sm">Kreditbetrag</label>
                  <select value={formData.requestedAmount} onChange={(e) => setFormData({ ...formData, requestedAmount: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-400 text-sm bg-white">
                    <option value="">Bitte wählen...</option>
                    <option>bis 5.000 €</option>
                    <option>5.000 – 10.000 €</option>
                    <option>10.000 – 20.000 €</option>
                    <option>20.000 – 35.000 €</option>
                    <option>35.000 – 50.000 €</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2 text-sm">Verwendungszweck</label>
                  <select value={formData.purpose} onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-400 text-sm bg-white">
                    <option value="">Bitte wählen...</option>
                    <option>Renovierung</option>
                    <option>Bildung</option>
                    <option>Hochzeit</option>
                    <option>Fahrzeug</option>
                    <option>Selbstständigkeit</option>
                    <option>Sonstiges</option>
                  </select>
                </div>
              </div>
              <button type="submit"
                className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2"
                style={{ background: `linear-gradient(135deg, ${PRIMARY}, #007A3D)` }}>
                Antrag absenden <ArrowRight size={20} />
              </button>
              <p className="text-center text-gray-400 text-xs">
                <Clock size={12} className="inline mr-1" />
                Antwort innerhalb von 24 Stunden — vertraulich &amp; unverbindlich
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Vorteile des KT Kredits</h2>
            <p className="text-gray-500 text-lg">Transparent, zinsfrei, Scharia-konform.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Shield size={28}/>, title: "100% Scharia-konform", desc: "Kein Riba. Basiert auf dem islamischen Murabaha-Prinzip: Fester Aufpreis statt Zinsen — von Anfang an bekannt." },
              { icon: <Zap size={28}/>, title: "Online-Entscheidung", desc: "Antrag stellen und innerhalb von 24 Stunden eine Vorentscheidung erhalten — kein Filialbesuch nötig." },
              { icon: <Clock size={28}/>, title: "Flexible Laufzeiten", desc: "Von 6 bis 84 Monate — Sie wählen die Laufzeit, die zu Ihrem Budget passt. Feste, unveränderliche Rate." },
              { icon: <FileText size={28}/>, title: "Minimale Unterlagen", desc: "Nur Personalausweis, 3 Gehaltsabrechnungen und Kontoauszug. Keine aufwändige Bürokratie." },
              { icon: <Star size={28}/>, title: "Bis zu 50.000 €", desc: "Von 1.000 bis 50.000 € — für alle persönlichen Projekte frei verwendbar (Halal-Zwecke)." },
              { icon: <CheckCircle size={28}/>, title: "Vorzeitige Rückzahlung", desc: "Jederzeit ohne Vorfälligkeitsentschädigung. Der Aufpreis wird anteilig reduziert." },
            ].map((f) => (
              <div key={f.title} className="flex gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-purple-200 transition-colors">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(124,58,237,0.1)", color: "#7C3AED" }}>
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-black text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Häufige Fragen</h2>
          </div>
          <FaqSection />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: "Karim B.", role: "Kunde seit 2021", text: "15.000 € für meine Hochzeit — ohne einen Cent Zinsen. Der Murabaha-Aufpreis war von Anfang an klar. Sehr empfehlenswert!" },
              { name: "Laila A.", role: "Kundin seit 2023", text: "8.000 € für mein Studium. Online beantragt, innerhalb von 2 Tagen auf dem Konto. Alles halal — ich bin sehr zufrieden." },
            ].map((t) => (
              <div key={t.name} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="#7C3AED" color="#7C3AED" />)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                    style={{ background: "#7C3AED" }}>{t.name[0]}</div>
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
      <section className="py-24" style={{ background: "linear-gradient(135deg, #2e0766, #4c1d95)" }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-5xl mb-6">💰</div>
          <h2 className="text-4xl font-black text-white mb-4">Ihre Projekte — halal finanziert</h2>
          <p className="text-purple-200 text-lg mb-8 max-w-2xl mx-auto">
            Bis zu 50.000 € ohne einen Cent Zinsen. Online beantragen, in 24h erhalten.
          </p>
          <Link href="/client/register"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-lg transition-all hover:-translate-y-1 hover:shadow-2xl"
            style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96B)", boxShadow: "0 8px 30px rgba(201,168,76,0.4)", color: "#2e0766" }}>
            Jetzt beantragen <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </>
  );
}

function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    { q: "Wie funktioniert der zinsfreie Kredit?", a: "Basiert auf dem islamischen Murabaha-Modell. KT Bank kauft das gewünschte Gut für Sie und verkauft es zu einem vereinbarten Gesamtpreis auf Raten. Kein Zins — nur ein transparenter Aufpreis." },
    { q: "Wie schnell erhalte ich das Geld?", a: "Nach Genehmigung erfolgt die Auszahlung innerhalb von 24-48 Stunden auf Ihr KT Bank Konto." },
    { q: "Welche Dokumente brauche ich?", a: "Personalausweis, Gehaltsnachweis (letzte 3 Monate), Kontoauszüge (letzte 3 Monate). Selbstständige: Steuerbescheid der letzten 2 Jahre." },
    { q: "Kann ich vorzeitig zurückzahlen?", a: "Ja — jederzeit ohne Vorfälligkeitsentschädigung. Der ausstehende Aufpreis wird anteilig reduziert." },
    { q: "Ist der Kredit wirklich Scharia-konform?", a: "Absolut. Unser Shariah Board prüft und zertifiziert alle Produkte. Basiert auf Murabaha — keine Zinsen, nur ein transparenter, vorab festgelegter Aufpreis." },
  ];
  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <button className="w-full flex items-center justify-between px-6 py-5 text-left"
            onClick={() => setOpen(open === i ? null : i)}>
            <span className="font-bold text-gray-900 pr-4">{faq.q}</span>
            <ChevronDown size={20} className="text-gray-400 flex-shrink-0 transition-transform duration-200"
              style={{ transform: open === i ? "rotate(180deg)" : "rotate(0deg)" }} />
          </button>
          {open === i && (
            <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-50 pt-3">{faq.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}
