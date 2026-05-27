"use client";
import { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Gift,
  ChevronDown,
  ChevronUp,
  Star,
  Smartphone,
  Clock,
  Percent,
} from "lucide-react";

const PRIMARY = "#005F2D";
const GOLD = "#C9A84C";

const features = [
  {
    icon: <CreditCard size={26} />,
    title: "Keine Jahresgebühr",
    desc: "Die KT Jetzz Card ist dauerhaft kostenlos — ohne versteckte Gebühren oder Mindestnutzung.",
  },
  {
    icon: <Percent size={26} />,
    title: "3–24 Monatsraten",
    desc: "Flexible Ratenzahlung von 3 bis 24 Monaten auf alle Einkäufe — zinskonform nach Scharia.",
  },
  {
    icon: <ShieldCheck size={26} />,
    title: "Scharia-konform",
    desc: "Zertifiziert vom KT Bank Shariah Board. Kein Riba, keine versteckten Zinsen.",
  },
  {
    icon: <Globe size={26} />,
    title: "Weltweit akzeptiert",
    desc: "Visa-Netzwerk — überall auf der Welt einsetzbar, online und im Geschäft.",
  },
  {
    icon: <Smartphone size={26} />,
    title: "Apple & Google Pay",
    desc: "Kontaktloses Bezahlen mit Ihrem Smartphone oder Ihrer Smartwatch.",
  },
  {
    icon: <Gift size={26} />,
    title: "Cashback-Programm",
    desc: "Bis zu 1,5% Cashback auf ausgewählte Partnerkategorien — direkt auf Ihr Konto.",
  },
  {
    icon: <Zap size={26} />,
    title: "Sofort verfügbar",
    desc: "Virtuelle Karte sofort nach Genehmigung — physische Karte in 3–5 Werktagen.",
  },
  {
    icon: <Clock size={26} />,
    title: "24/7 Kartenkontrolle",
    desc: "Sperren, entsperren und Limits anpassen direkt in der App — rund um die Uhr.",
  },
];

const installmentPlans = [
  { months: 3, rate: 0 },
  { months: 6, rate: 0 },
  { months: 12, rate: 0.5 },
  { months: 18, rate: 0.8 },
  { months: 24, rate: 1.0 },
];

const faqs = [
  {
    q: "Ist die Jetzz Card wirklich kostenlos?",
    a: "Ja, die KT Jetzz Card hat keine Jahresgebühr, keine Aktivierungsgebühr und keine monatliche Grundgebühr. Nur bei bestimmten Ratenplänen ab 12 Monaten fällt eine kleine Bearbeitungsgebühr an.",
  },
  {
    q: "Wie funktioniert die Ratenzahlung?",
    a: "Nach einem Kauf können Sie in der App oder online wählen, ob Sie in 3, 6, 12, 18 oder 24 Monaten zahlen möchten. Für 3- und 6-Monatspläne fallen keine Zusatzkosten an.",
  },
  {
    q: "Ist die Karte Scharia-konform?",
    a: "Absolut. Die Jetzz Card basiert auf einem Tawarruq-Modell, das vom KT Bank Shariah Board geprüft und zertifiziert wurde. Kein Riba (Zinsen) auf ausstehende Beträge.",
  },
  {
    q: "Was ist das Kreditlimit?",
    a: "Das Kreditlimit wird individuell basierend auf Ihrer Bonität vergeben — in der Regel zwischen €500 und €10.000. Eine Erhöhung ist jederzeit beantragbar.",
  },
  {
    q: "Wie schnell erhalte ich meine Karte?",
    a: "Die virtuelle Karte ist sofort nach Genehmigung einsatzbereit. Die physische Plastikkarte erreicht Sie in 3–5 Werktagen per Post.",
  },
  {
    q: "Kann ich meine Karte im Ausland nutzen?",
    a: "Ja, die Jetzz Card ist weltweit überall dort gültig, wo Visa akzeptiert wird. Fremdwährungstransaktionen werden zu einem transparenten Kurs abgerechnet.",
  },
];

export default function JetzzCardPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    income: "",
    plan: "6",
  });
  const [submitted, setSubmitted] = useState(false);
  const [calcAmount, setCalcAmount] = useState(1000);
  const [calcMonths, setCalcMonths] = useState(6);

  const selectedPlan = installmentPlans.find((p) => p.months === calcMonths);
  const monthlyPayment = selectedPlan
    ? ((calcAmount * (1 + selectedPlan.rate / 100)) / calcMonths).toFixed(2)
    : "0.00";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section
        style={{
          background: `linear-gradient(135deg, ${PRIMARY} 0%, #00803C 50%, #004d23 100%)`,
        }}
        className="relative overflow-hidden py-24 px-4"
      >
        <div className="absolute inset-0 opacity-10">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-white"
              style={{
                width: `${80 + i * 40}px`,
                height: `${80 + i * 40}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: "translate(-50%,-50%)",
              }}
            />
          ))}
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-white">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mb-4"
                style={{ background: "rgba(201,168,76,0.25)", color: GOLD }}
              >
                <Star size={14} fill={GOLD} /> Neu: KT Jetzz Card
              </div>
              <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight mb-4">
                Die islamische<br />
                <span style={{ color: GOLD }}>Kreditkarte</span><br />
                ohne Jahresgebühr
              </h1>
              <p className="text-white/80 text-lg mb-8 max-w-lg">
                Bezahlen, Raten, Cashback — alles Scharia-konform. Kein Riba, keine Jahresgebühr. Jetzt sofort beantragen.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/client/register"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white"
                  style={{ background: GOLD }}
                >
                  Jetzt beantragen <ArrowRight size={18} />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold border border-white/40 text-white hover:bg-white/10 transition"
                >
                  Mehr erfahren
                </a>
              </div>
              <div className="mt-8 flex gap-6 text-sm text-white/70">
                <span className="flex items-center gap-1"><CheckCircle size={14} className="text-green-300" /> Keine Jahresgebühr</span>
                <span className="flex items-center gap-1"><CheckCircle size={14} className="text-green-300" /> 100% Halal</span>
                <span className="flex items-center gap-1"><CheckCircle size={14} className="text-green-300" /> Sofort virtuell</span>
              </div>
            </div>

            {/* Card Visual Mockup */}
            <div className="flex-shrink-0 relative">
              <div
                className="w-80 h-48 rounded-2xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${GOLD} 0%, #a8862a 100%)`,
                }}
              >
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20"
                  style={{ background: "white", transform: "translate(30%,-30%)" }} />
                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-20"
                  style={{ background: "white", transform: "translate(-30%,30%)" }} />
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <p className="text-white/70 text-xs font-medium">KT Bank AG</p>
                    <p className="text-white font-bold text-lg">JETZZ</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="w-10 h-7 rounded bg-white/30 border border-white/50 flex items-center justify-center">
                      <div className="w-6 h-4 rounded-sm bg-yellow-200/60" />
                    </div>
                  </div>
                </div>
                <div className="relative z-10">
                  <p className="text-white font-mono text-lg tracking-widest">
                    4532 •••• •••• 8812
                  </p>
                  <div className="flex justify-between items-end mt-2">
                    <div>
                      <p className="text-white/60 text-xs">INHABER</p>
                      <p className="text-white font-semibold text-sm">MAX MUSTERMANN</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/60 text-xs">GÜLTIG BIS</p>
                      <p className="text-white font-semibold text-sm">12/28</p>
                    </div>
                    <div className="text-white font-bold italic text-xl">VISA</div>
                  </div>
                </div>
              </div>
              {/* Back card shadow */}
              <div
                className="absolute -bottom-3 -right-3 w-80 h-48 rounded-2xl -z-10 opacity-40"
                style={{ background: PRIMARY }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Installment Calculator */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: PRIMARY }}>
            Ratenrechner
          </h2>
          <p className="text-center text-gray-500 mb-10">Berechnen Sie Ihre monatliche Rate</p>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Kaufbetrag (€)
                </label>
                <input
                  type="number"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:ring-2"
                  style={{ focusRingColor: PRIMARY } as React.CSSProperties}
                  min={100}
                  max={10000}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Laufzeit (Monate)
                </label>
                <select
                  value={calcMonths}
                  onChange={(e) => setCalcMonths(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none"
                >
                  {installmentPlans.map((p) => (
                    <option key={p.months} value={p.months}>
                      {p.months} Monate {p.rate === 0 ? "(gebührenfrei)" : `(+${p.rate}%)`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div
              className="rounded-xl p-6 text-center"
              style={{ background: `linear-gradient(135deg, ${PRIMARY}15, ${GOLD}15)` }}
            >
              <p className="text-gray-500 text-sm mb-1">Monatliche Rate</p>
              <p className="text-5xl font-extrabold" style={{ color: PRIMARY }}>
                €{monthlyPayment}
              </p>
              <p className="text-gray-400 text-xs mt-2">
                Gesamtbetrag: €{(parseFloat(monthlyPayment) * calcMonths).toFixed(2)} über {calcMonths} Monate
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: PRIMARY }}>
            Alle Vorteile der Jetzz Card
          </h2>
          <p className="text-center text-gray-500 mb-12">Die moderne islamische Kreditkarte für den Alltag</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform"
                  style={{ background: i % 2 === 0 ? PRIMARY : GOLD }}
                >
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: PRIMARY }}>
            Jetzz Card beantragen
          </h2>
          <p className="text-center text-gray-500 mb-10">Ausfüllen und in wenigen Tagen Ihre Karte erhalten</p>
          {submitted ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-lg">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: `${PRIMARY}20` }}
              >
                <CheckCircle size={32} style={{ color: PRIMARY }} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Antrag eingegangen!</h3>
              <p className="text-gray-500 mb-6">
                Wir prüfen Ihren Antrag und melden uns innerhalb von 24 Stunden per E-Mail.
              </p>
              <Link
                href="/client/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white"
                style={{ background: PRIMARY }}
              >
                Zum Dashboard <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl p-8 shadow-lg space-y-5"
            >
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Vollständiger Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Max Mustermann"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">E-Mail-Adresse *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="max@beispiel.de"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-600"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Telefon *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+49 170 1234567"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Monatliches Nettoeinkommen *</label>
                  <select
                    required
                    value={formData.income}
                    onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-600"
                  >
                    <option value="">Bitte wählen</option>
                    <option value="under1000">Unter €1.000</option>
                    <option value="1000-2000">€1.000 – €2.000</option>
                    <option value="2000-3500">€2.000 – €3.500</option>
                    <option value="3500-5000">€3.500 – €5.000</option>
                    <option value="over5000">Über €5.000</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Bevorzugter Ratenplan</label>
                <select
                  value={formData.plan}
                  onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-600"
                >
                  {installmentPlans.map((p) => (
                    <option key={p.months} value={String(p.months)}>
                      {p.months} Monate {p.rate === 0 ? "— kostenlos" : `— +${p.rate}% Bearbeitungsgebühr`}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-4 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-2 hover:opacity-90 transition"
                style={{ background: PRIMARY }}
              >
                Antrag einreichen <ArrowRight size={20} />
              </button>
              <p className="text-xs text-gray-400 text-center">
                Mit dem Absenden stimmen Sie unseren{" "}
                <Link href="/contact" className="underline" style={{ color: PRIMARY }}>
                  Datenschutzbestimmungen
                </Link>{" "}
                zu.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: PRIMARY }}>
            Häufige Fragen
          </h2>
          <p className="text-center text-gray-500 mb-10">Alles, was Sie über die Jetzz Card wissen müssen</p>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center px-6 py-5 text-left font-semibold text-gray-900 hover:bg-gray-50 transition"
                >
                  {faq.q}
                  {openFaq === i ? (
                    <ChevronUp size={20} className="text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-16 px-4 text-center"
        style={{ background: `linear-gradient(135deg, ${PRIMARY}, #004d23)` }}
      >
        <h2 className="text-3xl font-bold text-white mb-4">
          Bereit für Ihre Jetzz Card?
        </h2>
        <p className="text-white/70 mb-8 max-w-xl mx-auto">
          Beantragen Sie jetzt Ihre kostenlose islamische Kreditkarte und erleben Sie eine neue Art des Bezahlens.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/client/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-lg"
            style={{ background: GOLD }}
          >
            Jetzt registrieren <ArrowRight size={20} />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold border border-white/40 text-white hover:bg-white/10 transition"
          >
            Beratung anfordern
          </Link>
        </div>
      </section>
    </div>
  );
}
