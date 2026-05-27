"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Building2,
  TrendingUp,
  Users,
  FileText,
  Clock,
  Star,
  ChevronDown,
} from "lucide-react";

const products = [
  {
    icon: "🤝",
    title: "Musharaka",
    subtitle: "Partnerschaftsfinanzierung",
    desc: "KT Bank und Ihr Unternehmen investieren gemeinsam. Gewinne und Verluste werden anteilig geteilt. Ideal für Wachstumsprojekte und Joint Ventures.",
    features: ["Gewinn- und Verlustbeteiligung", "Flexible Strukturierung", "Bis zu 5 Mio. €", "Keine Zinszahlungen"],
    color: "#005F2D",
    amount: "bis 5 Mio. €",
  },
  {
    icon: "📊",
    title: "Mudaraba",
    subtitle: "Investitionsfinanzierung",
    desc: "Sie bringen das Knowhow, KT Bank das Kapital. Die Bank trägt das Verlustrisiko, Sie managen das Projekt. Gewinne werden vorab vereinbart aufgeteilt.",
    features: ["Nur Gewinnbeteiligung", "Kein Verlustrisiko für Unternehmer", "Projektfinanzierung", "Start-up geeignet"],
    color: "#C9A84C",
    amount: "bis 2 Mio. €",
  },
  {
    icon: "🏗️",
    title: "Ijara",
    subtitle: "Islamisches Leasing",
    desc: "KT Bank kauft die Ausrüstung, Immobilie oder Fahrzeugflotte und vermietet sie an Ihr Unternehmen. Am Ende der Laufzeit können Sie das Gut erwerben.",
    features: ["Maschinen, Immobilien, Fahrzeuge", "Steuerlich optimierbar", "Flexible Laufzeit", "Kaufoption inklusive"],
    color: "#1E40AF",
    amount: "bis 3 Mio. €",
  },
  {
    icon: "🏗️",
    title: "Istisna",
    subtitle: "Auftragsfinanzierung",
    desc: "Finanzierung für die Herstellung oder Konstruktion von Gütern. KT Bank finanziert die Produktion vorab — das Gut wird nach Fertigstellung übergeben.",
    features: ["Bau- und Produktionsprojekte", "Vorabfinanzierung", "Bis 36 Monate", "Branchen: Bau, Manufaktur"],
    color: "#7C3AED",
    amount: "bis 4 Mio. €",
  },
];

const eligibility = [
  "Unternehmen mit Sitz in Deutschland (GmbH, AG, GbR, Einzelunternehmer)",
  "Mindestens 2 Jahre Geschäftstätigkeit (Ausnahmen für Start-ups möglich)",
  "Positive Bilanz oder Businessplan (bei Neugründungen)",
  "Keine aktiven Insolvenzverfahren",
  "Kontoinhaber bei KT Bank oder Bereitschaft zur Kontoeröffnung",
  "Vorlage aktueller Jahresabschlüsse (letzte 2 Jahre)",
];

const faqs = [
  { q: "Wie lange dauert die Kreditentscheidung?", a: "Unsere spezialisierten Unternehmensberater geben in der Regel innerhalb von 72 Stunden eine vorläufige Entscheidung. Die vollständige Genehmigung mit Vertragserstellung dauert 7–14 Werktage." },
  { q: "Gibt es eine Mindestfinanzierungssumme?", a: "Ja, die Mindestfinanzierungssumme beträgt 50.000 €. Für kleinere Beträge empfehlen wir unseren KT Kredit Personnel (bis 50.000 €)." },
  { q: "Welche Sicherheiten werden benötigt?", a: "Je nach Finanzierungsstruktur und -höhe können Grundpfandrechte, Bürgschaften, Unternehmensanteile oder Sachwerte als Sicherheit dienen. Unser Berater erarbeitet mit Ihnen eine individuelle Lösung." },
  { q: "Können ausländische Unternehmen finanziert werden?", a: "Aktuell finanzieren wir primär Unternehmen mit Sitz oder Geschäftstätigkeit in Deutschland. EU-Unternehmen mit deutschem Bezug können im Einzelfall berücksichtigt werden." },
  { q: "Ist die Finanzierung wirklich zinsfrei?", a: "Ja. Alle unsere Unternehmensfinanzierungen basieren auf islamischen Finanzierungsmodellen (Musharaka, Mudaraba, Ijara, Istisna) — komplett ohne Zinsen (Riba). Unser Shariah Board zertifiziert jede Transaktion." },
];

const steps = [
  { n: "01", t: "Erstberatung anfragen", d: "Füllen Sie das Formular unten aus. Ein Unternehmensberater meldet sich innerhalb von 24h." },
  { n: "02", t: "Unterlagen einreichen", d: "Jahresabschlüsse, Businessplan, Gesellschaftervertrag — wir geben Ihnen eine klare Checkliste." },
  { n: "03", t: "Prüfung & Angebot", d: "Unser Team prüft Ihre Unterlagen und erstellt ein individuelles Finanzierungsangebot innerhalb 72h." },
  { n: "04", t: "Shariah-Prüfung", d: "Das Finanzierungsmodell wird durch unser Shariah Board auf Konformität geprüft und zertifiziert." },
  { n: "05", t: "Vertragsunterzeichnung", d: "Vertragsunterzeichnung digital oder in einer unserer 4 Filialen in Deutschland." },
  { n: "06", t: "Auszahlung", d: "Nach Vertragsunterzeichnung erfolgt die Auszahlung innerhalb von 48 Stunden auf Ihr KT Konto." },
];

export default function CorporateCreditPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({ company: "", contact: "", email: "", phone: "", amount: "", product: "", message: "" });
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
        style={{ background: "linear-gradient(135deg, #0a0a1a 0%, #0F172A 55%, #1a2a4a 100%)" }}
      >
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect x='5' y='5' width='70' height='70' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E\")",
            backgroundSize: "80px 80px",
          }} />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #C9A84C, transparent)", transform: "translate(30%, -30%)" }} />

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
                style={{ background: "rgba(201,168,76,0.2)", border: "1px solid rgba(201,168,76,0.4)", color: "#E8C96B" }}>
                🏢 Kategorie: Unternehmensfinanzierung
              </div>
              <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
                Kredit Pro & PME
                <br />
                <span style={{ color: "#E8C96B" }}>Bis zu 5 Mio. €</span>
                <br />
                <span className="text-3xl font-bold text-blue-300">Zinsfrei & Halal</span>
              </h1>
              <p className="text-blue-100 text-xl mb-8 leading-relaxed">
                Islamische Unternehmensfinanzierungen für Freiberufler, KMU und Großunternehmen.
                Musharaka, Mudaraba, Ijara und Istisna — maßgeschneidert für Ihren Bedarf.
              </p>
              <div className="flex flex-wrap gap-4 mb-10">
                {["Bis 5 Mio. €", "Entscheid in 72h", "Zinsfrei (Halal)", "BaFin-reguliert"].map((tag) => (
                  <span key={tag} className="px-4 py-2 rounded-full text-sm font-semibold"
                    style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)" }}>
                    ✓ {tag}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="#application"
                  className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all hover:-translate-y-1 hover:shadow-2xl"
                  style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96B)", boxShadow: "0 8px 30px rgba(201,168,76,0.4)", color: "#0a0a1a" }}>
                  Antrag stellen <ArrowRight size={18} />
                </Link>
                <Link href="/contact"
                  className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all hover:bg-white/10"
                  style={{ border: "2px solid rgba(255,255,255,0.4)", color: "white" }}>
                  Berater anrufen
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { val: "5 Mio. €", label: "Max. Finanzierung", icon: "💰" },
                { val: "72h", label: "Entscheidungszeit", icon: "⚡" },
                { val: "4", label: "Finanzierungsmodelle", icon: "📋" },
                { val: "100+", label: "KMU finanziert 2024", icon: "🏢" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl p-5"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <div className="text-2xl font-black" style={{ color: "#E8C96B" }}>{s.val}</div>
                  <div className="text-blue-200 text-sm">{s.label}</div>
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

      {/* Financing Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Unsere Finanzierungsprodukte</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Vier bewährte islamische Finanzierungsmodelle — für jede Unternehmenssituation die passende Lösung.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {products.map((p) => (
              <div key={p.title}
                className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-300 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                  style={{ background: `linear-gradient(90deg, ${p.color}, ${p.color}88)` }} />
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl">{p.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-gray-900 text-2xl">{p.title}</h3>
                      <span className="px-3 py-1 rounded-full text-xs font-bold"
                        style={{ background: `${p.color}15`, color: p.color }}>{p.amount}</span>
                    </div>
                    <div className="text-sm font-semibold" style={{ color: p.color }}>{p.subtitle}</div>
                  </div>
                </div>
                <p className="text-gray-500 leading-relaxed mb-5">{p.desc}</p>
                <div className="grid grid-cols-2 gap-2">
                  {p.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle size={14} style={{ color: p.color }} className="flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <FileText size={40} className="mb-4" style={{ color: "#005F2D" }} />
              <h2 className="text-4xl font-black text-gray-900 mb-4">Voraussetzungen</h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-6">
                Wir finanzieren Unternehmen jeder Größe — vom Einzelunternehmer bis zum mittelständischen Betrieb.
              </p>
              <div className="space-y-3">
                {eligibility.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle size={18} className="flex-shrink-0 mt-0.5" style={{ color: "#005F2D" }} />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              {/* Testimonial */}
              <div className="rounded-2xl p-8 border border-gray-100 shadow-lg"
                style={{ background: "linear-gradient(135deg, #f0fdf4, #f9fafb)" }}>
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="#C9A84C" color="#C9A84C" />)}
                </div>
                <p className="text-gray-700 text-lg leading-relaxed italic mb-6">
                  "Dank der Musharaka-Finanzierung von KT Bank konnte ich mein Restaurant in Berlin
                  erweitern — ohne einen einzigen Cent Zinsen zu zahlen. Der Prozess war einfach,
                  der Berater professionell und das Ergebnis spricht für sich."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center font-black text-white text-xl"
                    style={{ background: "linear-gradient(135deg, #005F2D, #007A3D)" }}>
                    Y
                  </div>
                  <div>
                    <div className="font-black text-gray-900">Yusuf Al-Mansur</div>
                    <div className="text-gray-500 text-sm">Geschäftsführer, Al-Bab Restaurant GmbH</div>
                    <div className="text-xs font-semibold" style={{ color: "#005F2D" }}>Musharaka-Finanzierung: 450.000 €</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Von der Anfrage zur Auszahlung</h2>
            <p className="text-gray-500 text-lg">Unser strukturierter 6-Schritte-Prozess für Ihre Unternehmensfinanzierung.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div key={step.n} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-green-200 transition-colors">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white mb-4"
                  style={{ background: "linear-gradient(135deg, #005F2D, #007A3D)" }}>
                  {step.n}
                </div>
                <h3 className="font-black text-gray-900 mb-2">{step.t}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Häufige Fragen</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                <button className="w-full flex items-center justify-between px-6 py-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-bold text-gray-900 pr-4">{faq.q}</span>
                  <ChevronDown size={20} className="text-gray-400 flex-shrink-0 transition-transform duration-200"
                    style={{ transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)" }} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="application" className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <Building2 size={40} className="mx-auto mb-4" style={{ color: "#005F2D" }} />
            <h2 className="text-4xl font-black text-gray-900 mb-4">Finanzierungsanfrage stellen</h2>
            <p className="text-gray-500 text-lg">Ein Berater meldet sich innerhalb von 24 Stunden.</p>
          </div>

          {submitted ? (
            <div className="rounded-2xl p-12 text-center border-2 border-green-300"
              style={{ background: "linear-gradient(135deg, #f0fdf4, #ecfdf5)" }}>
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Anfrage eingegangen!</h3>
              <p className="text-gray-600 text-lg">Unser Unternehmensberater-Team meldet sich innerhalb von 24 Stunden bei Ihnen.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-2 text-sm">Unternehmensname *</label>
                  <input type="text" required placeholder="KMU Muster GmbH"
                    value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-400 text-sm" />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2 text-sm">Ansprechpartner *</label>
                  <input type="text" required placeholder="Max Mustermann"
                    value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-400 text-sm" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-2 text-sm">E-Mail *</label>
                  <input type="email" required placeholder="info@ihrunternehmen.de"
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
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-2 text-sm">Gewünschter Finanzierungsbetrag</label>
                  <select value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-400 text-sm bg-white">
                    <option value="">Bitte wählen...</option>
                    <option>50.000 – 200.000 €</option>
                    <option>200.000 – 500.000 €</option>
                    <option>500.000 – 1 Mio. €</option>
                    <option>1 – 5 Mio. €</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-2 text-sm">Finanzierungsmodell</label>
                  <select value={formData.product} onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-400 text-sm bg-white">
                    <option value="">Bitte wählen...</option>
                    <option>Musharaka</option>
                    <option>Mudaraba</option>
                    <option>Ijara</option>
                    <option>Istisna</option>
                    <option>Noch nicht sicher</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-2 text-sm">Kurze Projektbeschreibung</label>
                <textarea rows={4} placeholder="Beschreiben Sie kurz Ihr Vorhaben und wie die Finanzierung eingesetzt werden soll..."
                  value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-400 text-sm resize-none" />
              </div>
              <button type="submit"
                className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #005F2D, #007A3D)" }}>
                <Building2 size={20} /> Anfrage absenden <ArrowRight size={18} />
              </button>
              <p className="text-center text-gray-400 text-xs">
                <Clock size={12} className="inline mr-1" />
                Antwort innerhalb von 24 Stunden — vertraulich & unverbindlich
              </p>
            </form>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24" style={{ background: "linear-gradient(135deg, #0a0a1a, #0F172A)" }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-5xl mb-6">🏢</div>
          <h2 className="text-4xl font-black text-white mb-4">Wachsen Sie mit islamischer Finanzierung</h2>
          <p className="text-blue-200 text-lg mb-8 max-w-2xl mx-auto">
            Über 100 Unternehmen in Deutschland vertrauen KT Bank für ihre zinsfreie Wachstumsfinanzierung.
          </p>
          <Link href="/client/register"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-lg transition-all hover:-translate-y-1 hover:shadow-2xl"
            style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96B)", boxShadow: "0 8px 30px rgba(201,168,76,0.4)", color: "#0a0a1a" }}>
            Jetzt Konto eröffnen <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </>
  );
}
