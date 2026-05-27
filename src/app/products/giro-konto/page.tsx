"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  CreditCard,
  Smartphone,
  Shield,
  Zap,
  Globe,
  Clock,
  ChevronDown,
  Star,
  BanknoteIcon,
} from "lucide-react";

const features = [
  {
    icon: <CreditCard size={28} />,
    title: "Visa-Karte kostenlos",
    desc: "Erhalten Sie eine kostenlose Visa-Debitkarte, die weltweit akzeptiert wird — völlig gebührenfrei.",
  },
  {
    icon: <Smartphone size={28} />,
    title: "Mobile Banking App",
    desc: "Verwalten Sie Ihr Konto, überweisen Sie Geld und prüfen Sie Ihren Saldo jederzeit mit unserer modernen App.",
  },
  {
    icon: <Shield size={28} />,
    title: "BaFin reguliert",
    desc: "Vollständig durch die BaFin reguliert und durch den deutschen Einlagensicherungsfonds bis zu 100.000 € abgesichert.",
  },
  {
    icon: <Zap size={28} />,
    title: "Echtzeit-Überweisungen",
    desc: "Sofortüberweisungen innerhalb Deutschlands und des SEPA-Raums — 24 Stunden am Tag, 7 Tage die Woche.",
  },
  {
    icon: <Globe size={28} />,
    title: "Deutsche IBAN",
    desc: "Ihre persönliche deutsche IBAN (DE...) — sofort nach Kontoeröffnung verfügbar.",
  },
  {
    icon: <BanknoteIcon size={28} />,
    title: "Kein Riba (Zinsfreiheit)",
    desc: "Absolut zinsfrei — konform mit den Prinzipien des islamischen Finanzwesens (Scharia). Zertifiziert vom Shariah Board.",
  },
];

const steps = [
  { num: "01", title: "Online bewerben", desc: "Füllen Sie unser digitales Formular in 5 Minuten aus. Kein Papierkram, keine Bankfiliale erforderlich." },
  { num: "02", title: "Identität verifizieren", desc: "Verifizieren Sie Ihre Identität bequem per VideoIdent oder eID direkt von zu Hause." },
  { num: "03", title: "Konto erhalten", desc: "Ihr KT GiroKonto wird innerhalb von 24 Stunden aktiviert — inklusive IBAN und Visa-Karte." },
  { num: "04", title: "Sofort loslegen", desc: "Überweisen, empfangen, bezahlen — alles halal und ohne versteckte Gebühren." },
];

const faqs = [
  {
    q: "Fallen Kontoführungsgebühren an?",
    a: "Nein. Das KT GiroKonto ist vollständig kostenlos — keine monatliche Grundgebühr, keine Kontoführungsgebühren.",
  },
  {
    q: "Ist das Konto wirklich Scharia-konform?",
    a: "Ja. Unser Shariah Board, bestehend aus international anerkannten islamischen Gelehrten, zertifiziert alle unsere Produkte regelmäßig. Es werden keinerlei Zinsen (Riba) berechnet oder gutgeschrieben.",
  },
  {
    q: "Kann ich sofort überweisen?",
    a: "Ja. Wir unterstützen SEPA-Echtzeitüberweisungen (Instant Payments) in den gesamten SEPA-Raum — rund um die Uhr.",
  },
  {
    q: "Gibt es einen Dispokredit?",
    a: "Da Zinsen (Riba) im Islam verboten sind, bieten wir keinen klassischen Dispokredit an. Stattdessen bieten wir Qard Hasan (zinsloses Darlehen) für kurzfristige Liquiditätsbedürfnisse an.",
  },
  {
    q: "Welche Dokumente brauche ich?",
    a: "Lediglich Ihren gültigen Personalausweis oder Reisepass sowie Ihre aktuelle Meldeadresse in Deutschland.",
  },
  {
    q: "Gibt es Geldautomaten kostenlos?",
    a: "Sie können kostenlos an über 50.000 Geldautomaten in Deutschland Bargeld abheben (Sparkassen- und Volksbanken-Netz).",
  },
];

export default function GiroKontoPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* Hero */}
      <section
        className="relative py-28 text-white overflow-hidden"
        style={{ background: "linear-gradient(135deg, #003018 0%, #005F2D 55%, #007A3D 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Ccircle cx='30' cy='30' r='28' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E\")",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #C9A84C, transparent)", transform: "translate(30%, -30%)" }} />

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
                style={{ background: "rgba(201,168,76,0.2)", border: "1px solid rgba(201,168,76,0.4)", color: "#E8C96B" }}
              >
                💳 Kategorie: Konten
              </div>
              <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
                KT GiroKonto
                <br />
                <span style={{ color: "#E8C96B" }}>100% Halal</span>
              </h1>
              <p className="text-green-100 text-xl mb-8 leading-relaxed">
                Das erste islamische Girokonto Deutschlands. Verwalten Sie Ihr tägliches Banking
                komplett zinsfrei, transparent und modern — zertifiziert von unserem Shariah Board.
              </p>
              <div className="flex flex-wrap gap-4 mb-10">
                {["Kostenlos", "Zinsfrei", "BaFin-reguliert", "Sofort-IBAN"].map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 rounded-full text-sm font-semibold"
                    style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)" }}
                  >
                    ✓ {tag}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/client/register"
                  className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all hover:-translate-y-1 hover:shadow-2xl"
                  style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96B)", boxShadow: "0 8px 30px rgba(201,168,76,0.4)", color: "#1a1a1a" }}
                >
                  Konto eröffnen <ArrowRight size={18} />
                </Link>
                <Link
                  href="#features"
                  className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all hover:bg-white/10"
                  style={{ border: "2px solid rgba(255,255,255,0.4)", color: "white" }}
                >
                  Mehr erfahren
                </Link>
              </div>
            </div>

            {/* Card Visual */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div
                  className="w-80 h-48 rounded-2xl p-6 flex flex-col justify-between shadow-2xl"
                  style={{ background: "linear-gradient(135deg, #004020, #007A3D)", border: "1px solid rgba(201,168,76,0.3)" }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs text-green-300 mb-1">KT Bank AG</div>
                      <div className="font-black text-white text-lg">GiroKonto</div>
                    </div>
                    <div style={{ color: "#C9A84C" }} className="text-2xl font-black">☽</div>
                  </div>
                  <div>
                    <div className="text-green-300 text-xs mb-1">IBAN</div>
                    <div className="text-white font-mono text-sm">DE89 3704 0044 0532 0130 00</div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div style={{ color: "#E8C96B" }} className="text-xs font-semibold">100% Halal Certified</div>
                    <div className="text-white text-sm font-bold">VISA</div>
                  </div>
                </div>
                <div
                  className="absolute -bottom-4 -right-4 w-72 h-44 rounded-2xl"
                  style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96B)", opacity: 0.2, zIndex: -1 }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,60 C360,0 1080,60 1440,20 L1440,60 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { val: "0 €", label: "Kontoführungsgebühr" },
              { val: "50K+", label: "Zufriedene Kunden" },
              { val: "24h", label: "Aktivierungszeit" },
              { val: "100%", label: "Halal zertifiziert" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-black mb-1" style={{ color: "#005F2D" }}>{s.val}</div>
                <div className="text-gray-500 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Alles, was Sie von einem modernen Konto erwarten
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Das KT GiroKonto vereint alle Vorteile eines modernen deutschen Girokontos
              mit den ethischen Prinzipien des islamischen Finanzwesens.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-green-300 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(0,95,45,0.1)", color: "#005F2D" }}
                >
                  {f.icon}
                </div>
                <h3 className="font-black text-gray-900 text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Open */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              In 4 Schritten zum Konto
            </h2>
            <p className="text-gray-500 text-lg">Einfach, schnell, digital — kein Filialbesuch nötig.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={step.num} className="relative text-center">
                {i < steps.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5"
                    style={{ background: "linear-gradient(90deg, #005F2D, #C9A84C)", opacity: 0.3 }}
                  />
                )}
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-black text-xl mx-auto mb-4 relative z-10"
                  style={{ background: "linear-gradient(135deg, #005F2D, #007A3D)" }}
                >
                  {step.num}
                </div>
                <h3 className="font-black text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shariah Compliance */}
      <section
        className="py-16"
        style={{ background: "linear-gradient(135deg, #003018, #005F2D)" }}
      >
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-5xl mb-4">☽</div>
              <h2 className="text-3xl font-black text-white mb-4">
                Unsere Shariah-Compliance-Garantie
              </h2>
              <p className="text-green-200 text-lg leading-relaxed mb-6">
                Jedes Produkt der KT Bank wird von unserem unabhängigen Shariah Board
                aus international anerkannten islamischen Gelehrten geprüft und zertifiziert.
              </p>
              <div className="space-y-3">
                {[
                  "Keine Zinsen (Riba) auf Guthaben oder Schulden",
                  "Kein Handel mit Haram-Branchen (Alkohol, Waffen, Glücksspiel)",
                  "Vollständige Transparenz aller Gebühren",
                  "Jährliche Shariah-Prüfung und Zertifizierung",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-green-100">
                    <CheckCircle size={18} className="text-yellow-400 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "🏛️", label: "BaFin-Lizenz", sub: "Vollständig reguliert" },
                { icon: "📜", label: "Shariah Board", sub: "Zertifiziert 2025" },
                { icon: "🔒", label: "Einlagensicherung", sub: "Bis 100.000 €" },
                { icon: "⭐", label: "ISO 27001", sub: "Datensicherheit" },
              ].map((c) => (
                <div
                  key={c.label}
                  className="rounded-xl p-5 text-center"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  <div className="text-3xl mb-2">{c.icon}</div>
                  <div className="text-white font-bold text-sm">{c.label}</div>
                  <div className="text-green-300 text-xs">{c.sub}</div>
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
            <p className="text-gray-500">Alles, was Sie über das KT GiroKonto wissen möchten.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-green-200 transition-colors"
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-bold text-gray-900 pr-4">{faq.q}</span>
                  <ChevronDown
                    size={20}
                    className="text-gray-400 flex-shrink-0 transition-transform duration-200"
                    style={{ transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Ahmed K.", role: "Kunde seit 2019", text: "Endlich eine Bank, die meine islamischen Werte respektiert. Das GiroKonto ist kostenlos und die App ist fantastisch.", stars: 5 },
              { name: "Fatima B.", role: "Kundin seit 2021", text: "Sofort-IBAN, Echtzeit-Überweisung, kostenlose Karte — alles was ich brauche, ohne Zinsen. Ich empfehle KT Bank jedem Muslim.", stars: 5 },
              { name: "Yusuf M.", role: "Kunde seit 2020", text: "Der Kundendienst ist hervorragend. Alle Fragen werden schnell beantwortet. Das Shariah-Zertifikat gibt mir vollständiges Vertrauen.", stars: 5 },
            ].map((t) => (
              <div key={t.name} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={16} fill="#C9A84C" color="#C9A84C" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                    style={{ background: "#005F2D" }}
                  >
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
      <section
        className="py-24"
        style={{ background: "linear-gradient(135deg, #004020, #005F2D)" }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-5xl mb-6">💳</div>
          <h2 className="text-4xl font-black text-white mb-4">
            Bereit, Ihr halales Konto zu eröffnen?
          </h2>
          <p className="text-green-200 text-lg mb-8 max-w-2xl mx-auto">
            Schließen Sie sich über 50.000 zufriedenen Kunden an, die bereits ihr Banking
            mit KT Bank islamisch und zinsfrei gestalten.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/client/register"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all hover:-translate-y-1 hover:shadow-2xl"
              style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96B)", boxShadow: "0 8px 30px rgba(201,168,76,0.4)", color: "#1a1a1a" }}
            >
              Jetzt kostenlos eröffnen <ArrowRight size={18} />
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all hover:bg-white/10"
              style={{ border: "2px solid rgba(255,255,255,0.5)", color: "white" }}
            >
              Berater kontaktieren
            </Link>
          </div>
          <p className="text-green-300 text-sm mt-6">
            <Clock size={14} className="inline mr-1" />
            Kontoeröffnung in unter 10 Minuten — vollständig online
          </p>
        </div>
      </section>
    </>
  );
}
