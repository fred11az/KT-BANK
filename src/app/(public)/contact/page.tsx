"use client";
import { useState } from "react";
import { Mail, MapPin, Clock, Send, CheckCircle, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ContactPage() {
  const { t } = useLanguage();
  const de = t.lang !== "fr";

  const s = de ? {
    label: "✉️ Kontaktieren Sie uns",
    heroTitle: "Wir sind",
    heroGold: "für Sie da",
    heroSub: "Haben Sie eine Frage, ein Anliegen oder ein Projekt? Unser mehrsprachiges Team antwortet innerhalb von 24 Stunden.",
    cards: [
      { icon: Mail, label: "E-Mail", value: "support@kt-bank-ag.com", sub: "Antwort innerhalb 24h", href: "mailto:support@kt-bank-ag.com" },
      { icon: MapPin, label: "Hauptsitz", value: "Bockenheimer Landstr. 33", sub: "60325 Frankfurt am Main", href: null },
      { icon: Clock, label: "Öffnungszeiten", value: "Mo–Fr: 9–17 Uhr", sub: "Sa: Geschlossen", href: null },
    ],
    formLabel: "Schreiben Sie uns",
    formTitle: "Ein Projekt?",
    formTitleGold: "Sprechen wir darüber.",
    formDesc: "Unsere auf islamische Finanzen spezialisierten Berater stehen Ihnen gerne zur Verfügung. Jede Anfrage wird persönlich bearbeitet.",
    bullets: ["Garantierte Antwort innerhalb von 24h", "Berater auf DE / EN / TR / AR", "Datenschutz gewährleistet"],
    urgencyTitle: "Dringende Anfrage?",
    urgencyDesc: "Schreiben Sie uns direkt:",
    urgencyBtn: "support@kt-bank-ag.com",
    subjects: ["Kontoeröffnung", "Immobilienfinanzierung", "Autofinanzierung", "Privatkredit", "GoldKonto", "Scharia-Frage", "Beschwerde", "Sonstiges"],
    formFields: { name: "Vollständiger Name *", email: "E-Mail *", phone: "Telefon", subject: "Betreff *", subjectPlaceholder: "Auswählen…", message: "Nachricht *", messagePlaceholder: "Beschreiben Sie Ihr Anliegen…", gdpr: "Ich stimme der Datenschutzrichtlinie und der Verarbeitung meiner Daten gemäß DSGVO zu.", submit: "Nachricht senden", sending: "Wird gesendet…" },
    successTitle: "Nachricht gesendet!",
    successDesc: "Vielen Dank. Wir antworten innerhalb von 24 Werktunden.",
    successBtn: "Neue Nachricht",
    faqLabel: "FAQ",
    faqTitle: "Häufig gestellte",
    faqTitleGold: "Fragen",
    faqs: [
      { q: "Wie eröffne ich ein KT Bank Konto?", a: "Besuchen Sie unsere Registrierungsseite, füllen Sie das Online-Formular aus und führen Sie die Identitätsprüfung über VideoIdent durch. Das Konto wird innerhalb von 24 Wertstunden eröffnet." },
      { q: "Sind meine Einlagen geschützt?", a: "Ja. KT Bank AG ist Mitglied der Entschädigungseinrichtung deutscher Banken. Ihre Einlagen sind bis zu 100.000€ pro Person abgesichert." },
      { q: "Wie funktioniert das GoldKonto?", a: "Mit dem GoldKonto können Sie LBMA-zertifiziertes Feingold ab 1€ kaufen. Das Gold wird in gesicherten Tresoren in Deutschland gelagert. Sie können jederzeit verkaufen." },
      { q: "Wie vereinbare ich einen Termin in der Filiale?", a: "Nutzen Sie unser Kontaktformular oder rufen Sie direkt in Ihrer Filiale an. Wir bieten Ihnen innerhalb von 48h einen Termin an. Videoberatung ist ebenfalls verfügbar." },
    ],
  } : {
    label: "✉️ Contactez-nous",
    heroTitle: "Nous sommes",
    heroGold: "à votre écoute",
    heroSub: "Une question, une demande, un projet ? Notre équipe multilingue vous répond sous 24h.",
    cards: [
      { icon: Mail, label: "Email", value: "support@kt-bank-ag.com", sub: "Réponse sous 24h", href: "mailto:support@kt-bank-ag.com" },
      { icon: MapPin, label: "Siège social", value: "Bockenheimer Landstr. 33", sub: "60325 Frankfurt am Main", href: null },
      { icon: Clock, label: "Horaires", value: "Lun–Ven : 9h–17h", sub: "Sam : Fermé", href: null },
    ],
    formLabel: "Écrivez-nous",
    formTitle: "Un projet ?",
    formTitleGold: "Parlons-en.",
    formDesc: "Nos conseillers spécialisés en finance islamique sont disponibles pour vous accompagner. Chaque demande est traitée personnellement.",
    bullets: ["Réponse garantie sous 24h", "Conseillers DE / EN / TR / AR", "Confidentialité assurée"],
    urgencyTitle: "Urgence ?",
    urgencyDesc: "Écrivez-nous directement :",
    urgencyBtn: "support@kt-bank-ag.com",
    subjects: ["Ouverture de compte", "Financement immobilier", "Financement auto", "Crédit personnel", "GoldKonto", "Question Shariah", "Réclamation", "Autre"],
    formFields: { name: "Nom complet *", email: "Email *", phone: "Téléphone", subject: "Sujet *", subjectPlaceholder: "Choisir…", message: "Message *", messagePlaceholder: "Décrivez votre demande…", gdpr: "J'accepte la politique de confidentialité et le traitement de mes données conformément au RGPD.", submit: "Envoyer le message", sending: "Envoi en cours…" },
    successTitle: "Message envoyé !",
    successDesc: `Merci. Nous vous répondons sous 24h ouvrées.`,
    successBtn: "Nouveau message",
    faqLabel: "FAQ",
    faqTitle: "Questions",
    faqTitleGold: "fréquentes",
    faqs: [
      { q: "Comment ouvrir un compte KT Bank ?", a: "Rendez-vous sur notre page d'inscription, complétez le formulaire en ligne et effectuez la vérification d'identité via VideoIdent. Le compte est ouvert sous 24h ouvrées." },
      { q: "Mes dépôts sont-ils protégés ?", a: "Oui. KT Bank AG est membre du Fonds de Garantie des Dépôts Allemands (Entschädigungseinrichtung deutscher Banken). Vos dépôts sont garantis jusqu'à 100 000€ par personne." },
      { q: "Comment fonctionne le GoldKonto ?", a: "Le GoldKonto vous permet d'acheter de l'or physique certifié LBMA à partir de 1€. L'or est stocké dans des coffres sécurisés en Allemagne. Vous pouvez vendre à tout moment." },
      { q: "Comment obtenir un rendez-vous en agence ?", a: "Utilisez notre formulaire de contact ou contactez directement votre agence par email. Nous vous proposons un créneau sous 48h. Les rendez-vous en visioconférence sont aussi disponibles." },
    ],
  };

  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "", gdpr: false });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1400);
  };

  return (
    <>
      {/* HERO */}
      <section
        className="relative py-24 lg:py-28 text-white overflow-hidden hero-grid"
        style={{ background: "linear-gradient(160deg, var(--green-900) 0%, var(--green-700) 100%)" }}
      >
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <span className="section-label animate-fade-up" style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", color: "#E8C96B" }}>
            {s.label}
          </span>
          <h1 className="text-display mt-4 mb-4 animate-fade-up delay-100">
            {s.heroTitle}<br /><span className="text-gradient-gold">{s.heroGold}</span>
          </h1>
          <p className="text-body-lg animate-fade-up delay-200" style={{ color: "rgba(255,255,255,0.78)" }}>
            {s.heroSub}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
          style={{ background: "linear-gradient(to top, #FAFAFA, transparent)" }} />
      </section>

      {/* CONTACT CARDS */}
      <section className="py-14" style={{ background: "white" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {s.cards.map((card, i) => {
              const Icon = card.icon;
              const inner = (
                <>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: "var(--green-50)" }}>
                    <Icon size={18} style={{ color: "var(--green-700)" }} />
                  </div>
                  <p className="text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: "var(--gray-500)" }}>{card.label}</p>
                  <p className="font-bold text-sm mb-1" style={{ color: "var(--gray-900)" }}>{card.value}</p>
                  <p className="text-xs" style={{ color: "var(--gray-500)" }}>{card.sub}</p>
                </>
              );
              return card.href ? (
                <a key={card.label} href={card.href} className="card card-interactive p-5 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                  {inner}
                </a>
              ) : (
                <div key={card.label} className="card p-5 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FORM + SUCCESS */}
      <section className="py-16 lg:py-20" style={{ background: "var(--gray-50)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <span className="section-label">{s.formLabel}</span>
              <h2 className="text-heading mt-4 mb-5">
                {s.formTitle} <span className="text-gradient">{s.formTitleGold}</span>
              </h2>
              <p className="text-body-lg mb-6" style={{ color: "var(--gray-600)" }}>{s.formDesc}</p>
              <div className="flex flex-col gap-3 mb-8">
                {s.bullets.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle size={16} style={{ color: "var(--green-700)", flexShrink: 0 }} />
                    <span className="text-body" style={{ color: "var(--gray-700)" }}>{item}</span>
                  </div>
                ))}
              </div>
              <div className="card p-6" style={{ borderLeft: "3px solid var(--gold-400)" }}>
                <p className="text-sm font-semibold mb-1" style={{ color: "var(--gray-900)" }}>{s.urgencyTitle}</p>
                <p className="text-body mb-3" style={{ color: "var(--gray-500)" }}>{s.urgencyDesc}</p>
                <a href="mailto:support@kt-bank-ag.com" className="btn btn-primary btn-sm">
                  <Mail size={14} /> {s.urgencyBtn}
                </a>
              </div>
            </div>

            <div className="card p-7 lg:p-9">
              {sent ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                    style={{ background: "var(--green-100)" }}>
                    <CheckCircle size={32} style={{ color: "var(--green-700)" }} />
                  </div>
                  <h3 className="text-subheading mb-3" style={{ color: "var(--gray-900)" }}>{s.successTitle}</h3>
                  <p className="text-body" style={{ color: "var(--gray-500)" }}>{s.successDesc}</p>
                  <button onClick={() => setSent(false)} className="btn btn-outline btn-sm mt-6">
                    {s.successBtn}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">{s.formFields.name}</label>
                      <input className="input" placeholder="Ahmed Benali" required
                        value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div>
                      <label className="label">{s.formFields.email}</label>
                      <input className="input" type="email" placeholder="vous@email.com" required
                        value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label">{s.formFields.phone}</label>
                      <input className="input" type="tel" placeholder="+49 …"
                        value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    </div>
                    <div>
                      <label className="label">{s.formFields.subject}</label>
                      <select className="input" required value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                        <option value="">{s.formFields.subjectPlaceholder}</option>
                        {s.subjects.map((sub) => <option key={sub} value={sub}>{sub}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="label">{s.formFields.message}</label>
                    <textarea className="input" rows={5} placeholder={s.formFields.messagePlaceholder} required
                      value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" required checked={form.gdpr}
                      onChange={(e) => setForm({ ...form, gdpr: e.target.checked })}
                      className="mt-1 w-4 h-4 rounded accent-green-700 flex-shrink-0" />
                    <span className="text-small" style={{ color: "var(--gray-500)" }}>{s.formFields.gdpr}</span>
                  </label>
                  <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full justify-center">
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        {s.formFields.sending}
                      </span>
                    ) : (
                      <>{s.formFields.submit} <Send size={16} /></>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20" style={{ background: "white" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="section-label">{s.faqLabel}</span>
            <h2 className="text-heading mt-4 mb-2">{s.faqTitle} <span className="text-gradient">{s.faqTitleGold}</span></h2>
            <div className="divider-gold" />
          </div>
          <div className="flex flex-col gap-3">
            {s.faqs.map((faq, i) => (
              <details
                key={i}
                className="card overflow-hidden"
                open={openFaq === i}
                onToggle={(e) => setOpenFaq((e.target as HTMLDetailsElement).open ? i : null)}
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-sm list-none"
                  style={{ color: "var(--gray-900)" }}>
                  {faq.q}
                  <ChevronDown size={16} className="flex-shrink-0 transition-transform duration-200"
                    style={{ color: "var(--gray-400)", transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)" }} />
                </summary>
                <div className="px-5 pb-5 pt-0">
                  <div className="h-px mb-4" style={{ background: "var(--gray-100)" }} />
                  <p className="text-body" style={{ color: "var(--gray-600)" }}>{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
