"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, Heart, Calculator, Users, Globe } from "lucide-react";

const donationTypes = [
  {
    icon: "🌙",
    title: "Zakat",
    subtitle: "Pflichtabgabe (2,5%)",
    desc: "Die dritte Säule des Islam. 2,5% Ihres jährlichen Nisab-Überschusses werden an Bedürftige abgegeben. KT Bank hilft Ihnen, Ihre Zakat korrekt zu berechnen und zu überweisen.",
    color: "#005F2D",
  },
  {
    icon: "🤲",
    title: "Sadaqa",
    subtitle: "Freiwillige Spende",
    desc: "Freiwillige Spenden ohne Mindestbetrag. Jeder Cent zählt. Sadaqa reinigt das Vermögen und bringt Barakah ins Leben des Spenders.",
    color: "#C9A84C",
  },
  {
    icon: "🌙",
    title: "Zakat al-Fitr",
    subtitle: "Ramadan-Pflichtspende",
    desc: "Am Ende des Ramadan für jeden Haushaltsmitglied zu entrichten. Aktueller Betrag: ca. 7 € pro Person. Sicherstellen, dass alle Muslime am Eid feiern können.",
    color: "#7C3AED",
  },
  {
    icon: "🌱",
    title: "Sadaqa Jariya",
    subtitle: "Fortlaufende Wohltaten",
    desc: "Dauerhafte Spenden für Brunnen, Schulen, Moscheen — die Belohnung fließt weiter, solange das Werk genutzt wird. Eine der beliebtesten Spendenformen.",
    color: "#059669",
  },
];

const ngos = [
  { name: "Islamic Relief Deutschland", focus: "Nothilfe, Entwicklung", countries: "40+ Länder" },
  { name: "Caritas International", focus: "Humanitäre Hilfe", countries: "80+ Länder" },
  { name: "Human Appeal", focus: "Bildung, Wasser, Nahrung", countries: "25+ Länder" },
  { name: "Zakat Foundation", focus: "Zakat-Verteilung", countries: "Weltweit" },
  { name: "Penny Appeal", focus: "Wasserprojekte, Waisen", countries: "30+ Länder" },
  { name: "Muslim Aid", focus: "Bildung, Gesundheit", countries: "70+ Länder" },
];

const quotes = [
  { arabic: "مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ", german: "Das Gleichnis derer, die ihr Vermögen auf dem Weg Allahs ausgeben, ist wie das eines Samens, aus dem sieben Ähren wachsen.", source: "Quran 2:261" },
  { arabic: "الصَّدَقَةُ تُطْفِئُ الْخَطِيئَةَ كَمَا يُطْفِئُ الْمَاءُ النَّارَ", german: "Sadaqa löscht Sünden, so wie Wasser das Feuer löscht.", source: "Hadith — Tirmidhi" },
];

export default function DonationPage() {
  const [nisabAmount, setNisabAmount] = useState<string>("");
  const [zakatResult, setZakatResult] = useState<number | null>(null);
  const [donationAmount, setDonationAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedType, setSelectedType] = useState("Zakat");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const NISAB_GOLD = 5281; // in EUR (85g gold × current price)

  const calculateZakat = () => {
    const amount = parseFloat(nisabAmount);
    if (isNaN(amount) || amount <= 0) return;
    if (amount < NISAB_GOLD) {
      setZakatResult(0);
    } else {
      setZakatResult(amount * 0.025);
    }
  };

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const finalAmount = donationAmount ?? (customAmount ? parseFloat(customAmount) : 0);

  return (
    <>
      {/* Hero */}
      <section
        className="relative py-28 text-white overflow-hidden"
        style={{ background: "linear-gradient(135deg, #003018 0%, #005F2D 55%, #007A3D 100%)" }}
      >
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cpolygon fill='white' points='50,0 100,25 100,75 50,100 0,75 0,25'/%3E%3C/svg%3E\")",
            backgroundSize: "80px 80px",
          }} />

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
            style={{ background: "rgba(201,168,76,0.2)", border: "1px solid rgba(201,168,76,0.4)", color: "#E8C96B" }}>
            🤲 Kategorie: Solidarité
          </div>
          <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
            KT Donation & Zakat
            <br />
            <span style={{ color: "#E8C96B" }}>Geben ist Segen</span>
          </h1>
          <p className="text-green-100 text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            Verwalten Sie Ihre Zakat, Sadaqa und Spenden direkt über Ihr KT Bank Konto.
            Transparent, zertifiziert und mit steuerlichem Nachweis — damit Ihr Geben ankommt.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { val: "€2.4M+", label: "Gespendet 2024" },
              { val: "6", label: "NGO-Partner" },
              { val: "100%", label: "Transparent" },
              { val: "40+", label: "Länder erreicht" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-black" style={{ color: "#E8C96B" }}>{s.val}</div>
                <div className="text-green-200 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,60 C360,0 1080,60 1440,20 L1440,60 Z" fill="#F9FAFB" />
          </svg>
        </div>
      </section>

      {/* Islamic Quotes */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            {quotes.map((q, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
                <div className="text-xl font-bold mb-3 leading-relaxed" style={{ color: "#005F2D", direction: "rtl", fontFamily: "serif" }}>
                  {q.arabic}
                </div>
                <p className="text-gray-600 text-sm italic leading-relaxed mb-2">"{q.german}"</p>
                <div className="text-xs font-semibold" style={{ color: "#C9A84C" }}>{q.source}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zakat Calculator */}
      <section id="zakat-calculator" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(0,95,45,0.1)" }}>
              <Calculator size={32} style={{ color: "#005F2D" }} />
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Zakat-Rechner</h2>
            <p className="text-gray-500 text-lg">
              Berechnen Sie Ihre Zakat basierend auf Ihrem Gesamtvermögen. Der Nisab-Schwellenwert
              (85g Gold) beträgt derzeit ca. <strong style={{ color: "#005F2D" }}>5.281 €</strong>.
            </p>
          </div>

          <div className="rounded-2xl p-8 border-2 shadow-lg"
            style={{ borderColor: "#005F2D22", background: "linear-gradient(135deg, #f0fdf4, #f9fafb)" }}>
            <div className="mb-6">
              <label className="block font-bold text-gray-800 mb-2 text-lg">
                Ihr Gesamtvermögen (nach Abzug von Schulden)
              </label>
              <p className="text-gray-500 text-sm mb-3">
                Beinhaltet: Bargeld, Bankguthaben, Investitionen, Handelswaren, Schulden, die man besitzt.
              </p>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-xl" style={{ color: "#005F2D" }}>€</span>
                <input
                  type="number"
                  placeholder="z.B. 15000"
                  value={nisabAmount}
                  onChange={(e) => { setNisabAmount(e.target.value); setZakatResult(null); }}
                  className="w-full pl-10 pr-4 py-4 rounded-xl border-2 text-lg font-semibold focus:outline-none"
                  style={{ borderColor: "#005F2D44" }}
                />
              </div>
            </div>

            <button
              onClick={calculateZakat}
              className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #005F2D, #007A3D)" }}
            >
              <Calculator size={20} /> Zakat berechnen
            </button>

            {zakatResult !== null && (
              <div className="mt-6 rounded-xl p-6 text-center"
                style={{ background: zakatResult === 0 ? "#fef2f2" : "#f0fdf4", border: `2px solid ${zakatResult === 0 ? "#fca5a5" : "#86efac"}` }}>
                {zakatResult === 0 ? (
                  <>
                    <div className="text-2xl mb-2">ℹ️</div>
                    <h3 className="font-black text-gray-800 text-lg mb-2">Kein Zakat fällig</h3>
                    <p className="text-gray-600 text-sm">
                      Ihr Vermögen liegt unter dem Nisab-Schwellenwert von 5.281 €.
                      Freiwillige Sadaqa ist jedoch immer willkommen!
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-2xl mb-2">✅</div>
                    <h3 className="font-black text-gray-800 text-lg mb-2">Ihre Zakat für dieses Jahr:</h3>
                    <div className="text-5xl font-black mb-3" style={{ color: "#005F2D" }}>
                      {zakatResult.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                    </div>
                    <p className="text-gray-500 text-sm mb-2">
                      (2,5% von {parseFloat(nisabAmount).toLocaleString("de-DE")} €)
                    </p>
                    <p className="text-green-700 text-sm font-semibold">
                      Übertragen Sie Ihre Zakat direkt aus dem KT Bank Konto an unsere zertifizierten NGO-Partner.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Donation Types */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Arten der islamischen Spende</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Der Islam kennt verschiedene Formen der Wohltätigkeit — jede mit ihrer eigenen Bedeutung und Belohnung.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {donationTypes.map((type) => (
              <div key={type.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg">
                <div className="text-4xl mb-3">{type.icon}</div>
                <div className="text-xs font-bold px-3 py-1 rounded-full inline-block mb-3"
                  style={{ background: `${type.color}15`, color: type.color }}>
                  {type.subtitle}
                </div>
                <h3 className="font-black text-gray-900 text-xl mb-3">{type.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <Heart size={40} className="mx-auto mb-4" style={{ color: "#005F2D" }} />
            <h2 className="text-4xl font-black text-gray-900 mb-4">Jetzt spenden</h2>
            <p className="text-gray-500 text-lg">Sicher, transparent, mit steuerlichem Nachweis.</p>
          </div>

          {submitted ? (
            <div className="rounded-2xl p-12 text-center border-2"
              style={{ background: "linear-gradient(135deg, #f0fdf4, #ecfdf5)", borderColor: "#86efac" }}>
              <div className="text-6xl mb-4">🤲</div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Jazakallahu Khayran!</h3>
              <p className="text-gray-600 text-lg mb-2">Ihre Spende von <strong style={{ color: "#005F2D" }}>{finalAmount} €</strong> wurde erfasst.</p>
              <p className="text-gray-500 text-sm">Sie erhalten eine Spendenbestätigung per E-Mail für Ihre Steuererklärung.</p>
            </div>
          ) : (
            <form onSubmit={handleDonate} className="rounded-2xl p-8 border border-gray-100 shadow-lg">
              {/* Type Selection */}
              <div className="mb-6">
                <label className="block font-bold text-gray-800 mb-3">Art der Spende</label>
                <div className="grid grid-cols-2 gap-3">
                  {["Zakat", "Sadaqa", "Zakat al-Fitr", "Sadaqa Jariya"].map((type) => (
                    <button key={type} type="button"
                      onClick={() => setSelectedType(type)}
                      className="py-3 px-4 rounded-xl font-semibold text-sm transition-all"
                      style={selectedType === type
                        ? { background: "#005F2D", color: "white" }
                        : { background: "#f3f4f6", color: "#374151", border: "1px solid #E5E7EB" }}>
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Selection */}
              <div className="mb-6">
                <label className="block font-bold text-gray-800 mb-3">Betrag wählen</label>
                <div className="grid grid-cols-4 gap-3 mb-3">
                  {[10, 25, 50, 100].map((amount) => (
                    <button key={amount} type="button"
                      onClick={() => { setDonationAmount(amount); setCustomAmount(""); }}
                      className="py-3 rounded-xl font-bold text-lg transition-all"
                      style={donationAmount === amount && !customAmount
                        ? { background: "linear-gradient(135deg, #C9A84C, #E8C96B)", color: "#1a1a1a", boxShadow: "0 4px 15px rgba(201,168,76,0.4)" }
                        : { background: "#f3f4f6", color: "#374151", border: "1px solid #E5E7EB" }}>
                      {amount}€
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold" style={{ color: "#C9A84C" }}>€</span>
                  <input
                    type="number"
                    placeholder="Eigener Betrag"
                    value={customAmount}
                    onChange={(e) => { setCustomAmount(e.target.value); setDonationAmount(null); }}
                    className="w-full pl-8 pr-4 py-3 rounded-xl border focus:outline-none"
                    style={{ borderColor: customAmount ? "#C9A84C" : "#E5E7EB" }}
                  />
                </div>
              </div>

              {/* Donor Info */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block font-semibold text-gray-700 mb-2 text-sm">Name (optional)</label>
                  <input type="text" placeholder="Ihr Name"
                    value={donorName} onChange={(e) => setDonorName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-400 text-sm" />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2 text-sm">E-Mail (für Quittung)</label>
                  <input type="email" placeholder="ihre@email.de" required
                    value={donorEmail} onChange={(e) => setDonorEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-400 text-sm" />
                </div>
              </div>

              <button
                type="submit"
                disabled={!finalAmount || finalAmount <= 0}
                className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #005F2D, #007A3D)" }}>
                <Heart size={20} /> {finalAmount > 0 ? `${finalAmount} € spenden` : "Betrag auswählen"}
              </button>
              <p className="text-center text-gray-400 text-xs mt-3">
                🔒 Sichere Zahlung • Steuerlich absetzbar • 100% transparent
              </p>
            </form>
          )}
        </div>
      </section>

      {/* NGO Partners */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <Users size={40} className="mx-auto mb-4" style={{ color: "#005F2D" }} />
            <h2 className="text-4xl font-black text-gray-900 mb-4">Unsere NGO-Partner</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Wir arbeiten ausschließlich mit geprüften, transparenten Hilfsorganisationen zusammen.
              Jeder Partner wird jährlich auf Shariah-Konformität und Wirksamkeit geprüft.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ngos.map((ngo) => (
              <div key={ngo.name}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-green-200 hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(0,95,45,0.1)" }}>
                  <Globe size={24} style={{ color: "#005F2D" }} />
                </div>
                <h3 className="font-black text-gray-900 mb-2">{ngo.name}</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: "rgba(0,95,45,0.08)", color: "#005F2D" }}>{ngo.focus}</span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: "rgba(201,168,76,0.1)", color: "#C9A84C" }}>{ngo.countries}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16" style={{ background: "linear-gradient(135deg, #003018, #005F2D)" }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-4">Wie Ihre Spende ankommt</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { n: "01", t: "Spenden", d: "Sie wählen Betrag und Spendenart in der App oder online." },
              { n: "02", t: "Prüfung", d: "Unser Shariah-Team prüft und genehmigt die Verteilung." },
              { n: "03", t: "Überweisung", d: "Das Geld wird direkt an die NGO-Partner transferiert." },
              { n: "04", t: "Bericht", d: "Sie erhalten einen Verwendungsnachweis per E-Mail." },
            ].map((step) => (
              <div key={step.n} className="text-center">
                <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center font-black text-white text-lg mb-3"
                  style={{ background: "rgba(201,168,76,0.3)", border: "2px solid rgba(201,168,76,0.5)" }}>
                  {step.n}
                </div>
                <h3 className="font-black text-white mb-2">{step.t}</h3>
                <p className="text-green-200 text-sm">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-5xl mb-6">🤲</div>
          <h2 className="text-4xl font-black text-gray-900 mb-4">
            Geben Sie mit Barakah
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Eröffnen Sie Ihr KT Bank Konto und verwalten Sie all Ihre islamischen Spenden,
            Zakat und Sadaqa auf einer einzigen Plattform.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/client/register"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all hover:-translate-y-1 hover:shadow-xl"
              style={{ background: "linear-gradient(135deg, #005F2D, #007A3D)" }}>
              Konto eröffnen <ArrowRight size={18} />
            </Link>
            <a href="#zakat-calculator"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all"
              style={{ border: "2px solid #005F2D", color: "#005F2D" }}>
              Zakat berechnen
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
