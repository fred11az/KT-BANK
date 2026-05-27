"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  BookOpen,
  Shield,
  Gift,
  Star,
  Users,
  Smartphone,
} from "lucide-react";

const ageTiers = [
  {
    range: "0 – 12 Jahre",
    icon: "🌱",
    title: "KT Kinderkonto",
    color: "#10B981",
    rate: "3,5% p.a.",
    features: [
      "Eltern eröffnen das Konto",
      "Automatisches Sparziel-Feature",
      "Kindgerechte App-Ansicht",
      "Taschengeld-Überweisung leicht gemacht",
      "Illustriertes Finanzbuch für Kinder",
      "Halal-Investmentoptionen für Eltern",
    ],
    desc: "Der beste Moment zum Sparen ist beim Aufwachsen. Mit dem KT Kinderkonto legen Sie den Grundstein für die finanzielle Zukunft Ihres Kindes — islamisch, sicher und transparent.",
  },
  {
    range: "13 – 18 Jahre",
    icon: "📚",
    title: "KT SchülerKonto",
    color: "#3B82F6",
    rate: "4,0% p.a.",
    features: [
      "Jugendkarte (Visa Debit)",
      "Taschengeldfunktion mit Limit",
      "App mit Finanz-Gamification",
      "Elternkontrolle mit Freigabefunktion",
      "Islamsiche Finanzbildung (In-App)",
      "Einkaufsschutz weltweit",
    ],
    desc: "Teenager lernen mit dem KT SchülerKonto den verantwortungsvollen Umgang mit Geld. Eltern behalten die Kontrolle, Jugendliche gewinnen Selbstständigkeit.",
  },
  {
    range: "18 – 25 Jahre",
    icon: "🎓",
    title: "KT StudiKonto",
    color: "#8B5CF6",
    rate: "4,5% p.a.",
    features: [
      "Kostenloses Girokonto",
      "Studentenrabatte (20+ Partner)",
      "Kostenloses Reiseversicherung",
      "Internationale Überweisungen (0 €)",
      "Kreditlimit (zinsfrei, Qard Hasan)",
      "Automatisches Sparprogramm",
    ],
    desc: "Das ideale Konto für Studenten und junge Berufseinsteigende. Kostenlos, modern und ganz ohne Zinsen — denn Ihre Zukunft sollte nicht durch Riba belastet werden.",
  },
];

const educationModules = [
  { icon: "📖", title: "Was ist Riba?", desc: "Verstehen, warum Zinsen im Islam verboten sind und welche Alternativen es gibt." },
  { icon: "💰", title: "Halales Sparen", desc: "Die islamischen Grundsätze des Sparens und Investierens — praxisnah erklärt." },
  { icon: "🤝", title: "Zakat verstehen", desc: "Warum Geben ein islamisches Grundprinzip ist und wie Zakat berechnet wird." },
  { icon: "📈", title: "Halale Investments", desc: "Aktien, Gold, Immobilien — was ist halal? Schritt-für-Schritt-Erklärung." },
  { icon: "🏠", title: "Erste eigene Wohnung", desc: "Islamische Wohnimmobilienfinanzierung — Murabaha und Diminishing Musharaka." },
  { icon: "🌍", title: "Globale Finanzwelt", desc: "Wie islamisches Finanzwesen weltweit funktioniert und wächst." },
];

const parentFeatures = [
  { icon: <Shield size={22} />, title: "Ausgabenlimit setzen", desc: "Definieren Sie tägliche/wöchentliche Ausgabenlimits für Ihre Kinder." },
  { icon: <Smartphone size={22} />, title: "Echtzeit-Benachrichtigungen", desc: "Sie erhalten Push-Benachrichtigungen bei jeder Transaktion." },
  { icon: <Users size={22} />, title: "Taschengeld automatisch", desc: "Automatische wöchentliche oder monatliche Taschengeldzahlung einrichten." },
  { icon: <BookOpen size={22} />, title: "Lernfortschritt sehen", desc: "Verfolgen Sie, welche Finanzlektionen Ihr Kind abgeschlossen hat." },
];

export default function YouthSavingsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    childName: "", birthDate: "", parentName: "", email: "", phone: ""
  });
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
        style={{ background: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #059669 100%)" }}
      >
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Ccircle cx='20' cy='20' r='10' fill='white' opacity='0.5'/%3E%3Ccircle cx='60' cy='60' r='10' fill='white' opacity='0.5'/%3E%3C/svg%3E\")",
            backgroundSize: "80px 80px",
          }} />
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #C9A84C, transparent)", transform: "translate(30%, -30%)" }} />

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
                style={{ background: "rgba(201,168,76,0.2)", border: "1px solid rgba(201,168,76,0.4)", color: "#E8C96B" }}>
                🌱 Kategorie: Jeunesse
              </div>
              <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
                KT JugendKonto
                <br />
                <span style={{ color: "#E8C96B" }}>Für die Zukunft</span>
                <br />
                <span className="text-3xl font-bold text-green-200">0 bis 25 Jahre</span>
              </h1>
              <p className="text-green-100 text-xl mb-8 leading-relaxed">
                Das erste islamische Jugendkonto Deutschlands. Kindergerecht, sicher, halal —
                mit 50 € Willkommensbonus und der besten Sparrate für junge Menschen.
              </p>

              {/* Welcome Bonus Banner */}
              <div className="rounded-2xl p-5 mb-8 flex items-center gap-4"
                style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.25), rgba(201,168,76,0.1))", border: "2px solid rgba(201,168,76,0.5)" }}>
                <div className="text-4xl">🎁</div>
                <div>
                  <div className="font-black text-white text-lg">50 € Willkommensbonus</div>
                  <div className="text-green-200 text-sm">Direkt nach Kontoeröffnung gutgeschrieben — kein Mindestguthaben nötig!</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="#open-account"
                  className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all hover:-translate-y-1 hover:shadow-2xl"
                  style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96B)", boxShadow: "0 8px 30px rgba(201,168,76,0.4)", color: "#064e3b" }}>
                  <Gift size={18} /> Konto eröffnen <ArrowRight size={18} />
                </Link>
                <Link href="#education"
                  className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all hover:bg-white/10"
                  style={{ border: "2px solid rgba(255,255,255,0.4)", color: "white" }}>
                  Finanzbildung entdecken
                </Link>
              </div>
            </div>

            {/* Age Tiers Quick */}
            <div className="space-y-4">
              {ageTiers.map((tier, i) => (
                <div key={i}
                  className="rounded-xl p-5 cursor-pointer transition-all"
                  style={{
                    background: activeTab === i ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)",
                    border: `1px solid ${activeTab === i ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.1)"}`,
                  }}
                  onClick={() => setActiveTab(i)}>
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{tier.icon}</div>
                    <div>
                      <div className="font-black text-white">{tier.title}</div>
                      <div className="text-green-200 text-sm">{tier.range}</div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="font-black text-yellow-300">{tier.rate}</div>
                      <div className="text-green-300 text-xs">Sparrate</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,60 C360,0 1080,60 1440,20 L1440,60 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Age Tier Detail */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Konto nach Alter</h2>
            <p className="text-gray-500 text-lg">Jede Altersgruppe hat ihr eigenes, passendes Konto.</p>
          </div>

          {/* Tab navigation */}
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {ageTiers.map((tier, i) => (
              <button key={i} onClick={() => setActiveTab(i)}
                className="px-6 py-3 rounded-full font-bold transition-all"
                style={activeTab === i
                  ? { background: tier.color, color: "white", boxShadow: `0 4px 15px ${tier.color}50` }
                  : { background: "#f3f4f6", color: "#374151" }}>
                {tier.icon} {tier.title}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-6xl mb-4">{ageTiers[activeTab].icon}</div>
              <div className="inline-block px-4 py-2 rounded-full text-sm font-bold mb-4"
                style={{ background: `${ageTiers[activeTab].color}15`, color: ageTiers[activeTab].color }}>
                {ageTiers[activeTab].range}
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-3">{ageTiers[activeTab].title}</h3>
              <p className="text-gray-500 text-lg leading-relaxed mb-6">{ageTiers[activeTab].desc}</p>
              <div className="grid grid-cols-2 gap-3">
                {ageTiers[activeTab].features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle size={14} style={{ color: ageTiers[activeTab].color }} className="flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl p-8 text-center"
              style={{ background: `linear-gradient(135deg, ${ageTiers[activeTab].color}15, ${ageTiers[activeTab].color}05)`, border: `2px solid ${ageTiers[activeTab].color}30` }}>
              <div className="text-5xl font-black mb-2" style={{ color: ageTiers[activeTab].color }}>
                {ageTiers[activeTab].rate}
              </div>
              <div className="text-gray-600 text-lg mb-6">Sparrate pro Jahr</div>
              <div className="rounded-xl p-5 mb-4" style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)" }}>
                <div className="font-black text-2xl mb-1" style={{ color: "#C9A84C" }}>50 € Bonus</div>
                <div className="text-gray-600 text-sm">Willkommensbonus bei Eröffnung</div>
              </div>
              <Link href="#open-account"
                className="block w-full py-3 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5"
                style={{ background: ageTiers[activeTab].color }}>
                Jetzt eröffnen
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Islamic Financial Education */}
      <section id="education" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <BookOpen size={40} className="mx-auto mb-4" style={{ color: "#10B981" }} />
            <h2 className="text-4xl font-black text-gray-900 mb-4">Islamische Finanzbildung</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Exklusiv in der KT JugendKonto-App: Interaktive Lernmodule, die Ihren Kindern
              die Prinzipien islamischer Finanzen spielerisch erklären.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {educationModules.map((mod) => (
              <div key={mod.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-green-300 hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-4">{mod.icon}</div>
                <h3 className="font-black text-gray-900 mb-2">{mod.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parent Controls */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Elternkontrolle</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Behalten Sie immer den Überblick. Als Elternteil haben Sie volle Kontrolle über
              das Konto Ihres Kindes — sicher und einfach über die KT Bank App.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {parentFeatures.map((f) => (
              <div key={f.title}
                className="flex gap-5 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-green-200 transition-colors">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(16,185,129,0.1)", color: "#10B981" }}>
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-black text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-gray-500 text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Welcome Bonus + Account Opening Form */}
      <section id="open-account" className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-5xl mb-4">🎁</div>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Konto eröffnen & 50 € erhalten</h2>
            <p className="text-gray-500 text-lg">Das KT JugendKonto ist kostenlos — immer.</p>
          </div>

          {submitted ? (
            <div className="rounded-2xl p-12 text-center border-2 border-green-300"
              style={{ background: "linear-gradient(135deg, #f0fdf4, #ecfdf5)" }}>
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Antrag eingegangen!</h3>
              <p className="text-gray-600 text-lg mb-2">Das KT JugendKonto für <strong>{formData.childName}</strong> wird bearbeitet.</p>
              <p className="text-gray-500 text-sm">Der 50 € Willkommensbonus wird nach Aktivierung gutgeschrieben.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-2 text-sm">Name des Kindes *</label>
                  <input type="text" required placeholder="Aisha Mustermann"
                    value={formData.childName} onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-400 text-sm" />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2 text-sm">Geburtsdatum *</label>
                  <input type="date" required
                    value={formData.birthDate} onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-400 text-sm" />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-2 text-sm">Name des Elternteils *</label>
                <input type="text" required placeholder="Ahmed Mustermann"
                  value={formData.parentName} onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-400 text-sm" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-2 text-sm">E-Mail *</label>
                  <input type="email" required placeholder="eltern@email.de"
                    value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-400 text-sm" />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2 text-sm">Telefon</label>
                  <input type="tel" placeholder="+49 30 1234567"
                    value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-400 text-sm" />
                </div>
              </div>
              <button type="submit"
                className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #059669, #10B981)" }}>
                <Gift size={20} /> Konto eröffnen + 50 € Bonus <ArrowRight size={18} />
              </button>
              <p className="text-center text-gray-400 text-xs">
                Kostenlos, keine Mindesteinlage, 100% Halal-zertifiziert
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { name: "Mariam L.", role: "Mutter von 3 Kindern", text: "Das JugendKonto ist wunderbar. Meine Kinder verstehen jetzt, was Sparen bedeutet — und alles ist halal. Der 50€ Bonus war ein toller Start!" },
              { name: "Abdullah K.", role: "Student, 21 Jahre", text: "Das StudiKonto spart mir monatlich Gebühren. Internationale Überweisungen nach Marokko kostenlos — das ist genial! Und ich zahle keine Zinsen." },
            ].map((t) => (
              <div key={t.name} className="rounded-2xl p-6 border border-gray-100 bg-gray-50">
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="#10B981" color="#10B981" />)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                    style={{ background: "#10B981" }}>{t.name[0]}</div>
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
      <section className="py-24" style={{ background: "linear-gradient(135deg, #064e3b, #059669)" }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-5xl mb-6">🌱</div>
          <h2 className="text-4xl font-black text-white mb-4">
            Investieren Sie in die Zukunft Ihres Kindes
          </h2>
          <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
            Das KT JugendKonto ist kostenlos, halal und mit 50 € Startbonus —
            der beste Geschenk für Ihre Kinder.
          </p>
          <Link href="/client/register"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-lg transition-all hover:-translate-y-1 hover:shadow-2xl"
            style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96B)", boxShadow: "0 8px 30px rgba(201,168,76,0.4)", color: "#064e3b" }}>
            Jetzt eröffnen <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </>
  );
}
