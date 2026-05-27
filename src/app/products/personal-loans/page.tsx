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
