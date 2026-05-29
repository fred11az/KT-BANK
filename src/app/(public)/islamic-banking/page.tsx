"use client";
import Link from "next/link";
import { ArrowRight, CheckCircle, BookOpen } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function IslamicBankingPage() {
  const { t } = useLanguage();
  const de = t.lang !== "fr";

  const principles = [
    { ar: "الرِّبَا", name: de ? "Riba (Zinsen)" : "Riba (Intérêts)", desc: de ? "Jede feste Zinsgebühr oder Überschuss ist verboten. Geld kann nicht von selbst Geld erzeugen." : "Tout intérêt ou surplus fixe est interdit. L'argent ne peut pas générer de l'argent par lui-même.", icon: "⚖️", forbidden: true },
    { ar: "الغَرَر", name: de ? "Gharar (Spekulation)" : "Gharar (Spéculation)", desc: de ? "Ungewisse, unklare oder stark spekulative Transaktionen sind verboten." : "Les transactions incertaines, ambiguës ou hautement spéculatives sont prohibées.", icon: "🎲", forbidden: true },
    { ar: "المُضَارَبَة", name: "Mudaraba", desc: de ? "Partnerschaft, bei der einer das Kapital einbringt und der andere das Know-how. Gewinne und Verluste werden geteilt." : "Partenariat où l'un apporte le capital, l'autre l'expertise. Les profits et pertes sont partagés.", icon: "🤝", forbidden: false },
    { ar: "المُشَارَكَة", name: "Musharaka", desc: de ? "Gemeinschaftsunternehmen, bei dem mehrere Parteien Kapital, Management, Gewinne und Risiken teilen." : "Coentreprise où plusieurs parties partagent capital, gestion, profits et risques.", icon: "🏗️", forbidden: false },
    { ar: "المُرَابَحَة", name: "Murabaha", desc: de ? "Kauf mit transparentem Aufschlag. Die Bank kauft das Gut und verkauft es zum vereinbarten Festpreis weiter." : "Vente à coût majoré transparent. La banque achète le bien puis le revend à prix fixe convenu.", icon: "🏠", forbidden: false },
    { ar: "الإِجَارَة", name: "Ijara", desc: de ? "Islamischer Mietkaufvertrag. Entspricht dem Leasing, ohne Zinsen." : "Contrat de location-vente islamique. Équivalent au leasing, sans intérêts.", icon: "🔑", forbidden: false },
  ];

  const prohibited = [
    { icon: "🍷", label: de ? "Alkohol & Tabak" : "Alcool & tabac" },
    { icon: "🎰", label: de ? "Glücksspiel" : "Jeux d'argent" },
    { icon: "💣", label: de ? "Rüstung" : "Armement" },
    { icon: "📺", label: de ? "Unzulässige Unterhaltung" : "Divertissement illicite" },
    { icon: "🏦", label: de ? "Konventionelles Banking" : "Banque conventionnelle" },
    { icon: "🐷", label: de ? "Schweineprodukte" : "Industrie porcine" },
  ];

  const boardMembers = [
    { name: "Prof. Dr. Hassan Al-Amin", role: de ? "Vorsitzender des Shariah Boards" : "Président du Shariah Board", desc: de ? "Doktor des islamischen Rechts, AAOIFI-Berater. 30 Jahre Expertise in Halal-Finanzwesen." : "Docteur en droit islamique, consultant AAOIFI. 30 ans d'expertise en finance halal." },
    { name: "Dr. Yusuf Ibrahim", role: de ? "Senior-Mitglied" : "Membre Senior", desc: de ? "Spezialist für islamische Rechtsprechung moderner Finanzverträge." : "Spécialiste en jurisprudence islamique des contrats financiers modernes." },
    { name: "Sheikh Omar Farouq", role: de ? "Experte Fiqh Al-Muamalat" : "Expert Fiqh Al-Muamalat", desc: de ? "Anerkannte Autorität im islamischen Transaktionsrecht in Europa." : "Autorité reconnue en droit des transactions islamiques en Europe." },
  ];

  const understandPoints = de
    ? ["Keine Zinsen (Riba)", "Reale Vermögenswerte erforderlich", "Risiko- & Gewinnverteilung", "Vollständige Vertragstransparenz"]
    : ["Pas d'intérêts (riba)", "Actifs réels obligatoires", "Partage des risques & profits", "Transparence contractuelle"];

  return (
    <>
      {/* HERO */}
      <section
        className="relative py-28 lg:py-36 text-white overflow-hidden hero-grid"
        style={{ background: "linear-gradient(160deg, var(--green-900) 0%, var(--green-800) 50%, var(--green-700) 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 70% 50%, var(--gold-400), transparent 60%)" }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="animate-fade-up">
            <span className="section-label" style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", color: "#E8C96B" }}>
              ☪️ {de ? "Islamisches Bankwesen" : "Finance Islamique"}
            </span>
          </div>
          <div className="text-7xl lg:text-9xl mb-4 animate-fade-up delay-100 opacity-20 font-arabic select-none" aria-hidden="true">
            ﷽
          </div>
          <h1 className="text-display mb-6 animate-fade-up delay-200">
            {de ? "Islamisches Bankwesen:\n" : "Finance Islamique :\n"}
            <br />
            <span className="text-gradient-gold">{de ? "Der ethische Weg" : "La Voie Éthique"}</span>
          </h1>
          <p className="text-body-lg mb-10 animate-fade-up delay-300" style={{ color: "rgba(255,255,255,0.78)" }}>
            {de
              ? "Islamisches Bankwesen ist keine Einschränkung — es ist eine Weltanschauung, in der Geld der Realwirtschaft, der Risikoverteilung und der sozialen Gerechtigkeit dient."
              : "La finance islamique n'est pas une contrainte — c'est une vision du monde où l'argent sert l'économie réelle, le partage des risques et la justice sociale."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up delay-400">
            <Link href="/client/register" className="btn btn-gold btn-xl">
              {de ? "Halal-Konto eröffnen" : "Ouvrir un compte halal"} <ArrowRight size={18} />
            </Link>
            <Link href="/products" className="btn btn-outline-white btn-xl">
              {de ? "Unsere Produkte" : "Nos produits"}
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
          style={{ background: "linear-gradient(to top, #FAFAFA, transparent)" }} />
      </section>

      {/* WHAT IS ISLAMIC BANKING */}
      <section className="py-20 lg:py-28" style={{ background: "white" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
                <img src="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&q=80" alt={de ? "Islamisches Bankwesen" : "Finance islamique"} className="w-full h-full object-cover" />
              </div>
              <div className="hidden md:block absolute -top-4 -right-4 card px-4 py-3 shadow-xl text-center">
                <div className="text-2xl font-black" style={{ color: "var(--green-700)" }}>1,8Mrd</div>
                <div className="text-xs" style={{ color: "var(--gray-500)" }}>{de ? "Muslime weltweit" : "musulmans dans le monde"}</div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="section-label">{de ? "Verstehen" : "Comprendre"}</span>
              <h2 className="text-heading mt-2 mb-6">
                {de ? "Was ist islamisches\n" : "Qu'est-ce que la\n"}
                <br />
                <span className="text-gradient">{de ? "Bankwesen?" : "finance islamique ?"}</span>
              </h2>
              <p className="text-body-lg mb-5" style={{ color: "var(--gray-600)" }}>
                {de
                  ? "Islamisches Bankwesen ist ein Finanzsystem, das auf den Grundsätzen der Scharia (islamisches Recht) basiert. Es verbietet Riba (Zinsen), Gharar (übermäßige Unsicherheit) und Investitionen in schädliche Sektoren."
                  : "La finance islamique est un système financier fondé sur les principes de la charia (loi islamique). Elle interdit le riba (intérêts), le gharar (incertitude excessive) et les investissements dans des secteurs jugés nuisibles."}
              </p>
              <p className="text-body mb-8" style={{ color: "var(--gray-500)" }}>
                {de
                  ? "Stattdessen fördert sie die gerechte Verteilung von Gewinnen und Verlusten, die Bindung an reale Vermögenswerte und vollständige Transparenz bei jeder Transaktion."
                  : "À la place, elle promeut le partage équitable des profits et des pertes, l'adossement à des actifs réels et la transparence totale dans chaque transaction."}
              </p>
              <div className="flex flex-col gap-3">
                {understandPoints.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle size={17} style={{ color: "var(--green-700)", flexShrink: 0 }} />
                    <span className="text-body" style={{ color: "var(--gray-700)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 PRINCIPLES */}
      <section className="py-20 lg:py-28" style={{ background: "var(--gray-50)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="section-label">{de ? "Die Grundlagen" : "Les fondements"}</span>
            <h2 className="text-heading mt-4 mb-2">
              6 {de ? "wesentliche " : "principes "}
              <span className="text-gradient">{de ? "Grundsätze" : "essentiels"}</span>
            </h2>
            <div className="divider-gold" />
            <p className="text-body mt-6 max-w-2xl mx-auto" style={{ color: "var(--gray-500)" }}>
              {de
                ? "Zwei verbotene Grundsätze, vier erlaubte Finanzierungsformen — das ist die Architektur der Halal-Finanzwirtschaft."
                : "Deux principes prohibés, quatre modes de financement licites — voici l'architecture de la finance halal."}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {principles.map((p, i) => (
              <div key={p.name} className="card card-interactive p-6 animate-fade-up" style={{ animationDelay: `${i * 60}ms`, borderLeft: `3px solid ${p.forbidden ? "#EF4444" : "var(--green-700)"}` }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-2xl mb-1">{p.icon}</div>
                    <div className="text-xl font-bold" style={{ fontFamily: "serif", color: p.forbidden ? "#EF4444" : "var(--green-700)" }}>{p.ar}</div>
                  </div>
                  {p.forbidden ? (
                    <span className="badge" style={{ background: "#FEE2E2", color: "#DC2626" }}>{de ? "Verboten" : "Interdit"}</span>
                  ) : (
                    <span className="badge badge-green">{de ? "Erlaubt" : "Licite"}</span>
                  )}
                </div>
                <h3 className="font-bold text-sm mb-2" style={{ color: "var(--gray-900)" }}>{p.name}</h3>
                <p className="text-small" style={{ color: "var(--gray-500)" }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROHIBITED SECTORS */}
      <section className="py-20" style={{ background: "var(--gray-900)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="section-label" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#FCA5A5" }}>
              {de ? "Verbotene Sektoren" : "Secteurs prohibés"}
            </span>
            <h2 className="text-heading mt-4 mb-2" style={{ color: "white" }}>
              {de ? "Was wir nicht " : "Ce que nous ne "}
              <span style={{ color: "#FCA5A5" }}>{de ? "finanzieren" : "finançons pas"}</span>
            </h2>
            <p className="text-body max-w-xl mx-auto mt-4" style={{ color: "rgba(255,255,255,0.5)" }}>
              {de
                ? "Unser Shariah Board prüft jede Investition. Diese Sektoren sind kategorisch ausgeschlossen."
                : "Notre Shariah Board vérifie chaque investissement. Ces secteurs sont catégoriquement exclus."}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {prohibited.map((item, i) => (
              <div key={item.label} className="card-glass p-5 text-center animate-fade-up" style={{ animationDelay: `${i * 60}ms`, border: "1px solid rgba(239,68,68,0.2)" }}>
                <div className="text-3xl mb-3">{item.icon}</div>
                <p className="text-small font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHARIAH BOARD */}
      <section className="py-20 lg:py-28" style={{ background: "white" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="section-label">{de ? "Konformitätsgarantie" : "Garantie de conformité"}</span>
            <h2 className="text-heading mt-4 mb-2">
              {de ? "Unser " : "Notre "}
              <span className="text-gradient">Shariah Board</span>
            </h2>
            <div className="divider-gold" />
            <p className="text-body mt-6 max-w-2xl mx-auto" style={{ color: "var(--gray-500)" }}>
              {de
                ? "Ein unabhängiges Komitee aus islamischen Rechtsexperten überwacht jedes Produkt und jede Transaktion."
                : "Un comité indépendant d'experts en droit islamique supervise chaque produit et transaction."}
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {boardMembers.map((member, i) => (
              <div key={member.name} className="card p-7 text-center animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4"
                  style={{ background: "linear-gradient(135deg, var(--green-800), var(--green-600))" }}>
                  ☪️
                </div>
                <h3 className="font-bold text-sm mb-1" style={{ color: "var(--gray-900)" }}>{member.name}</h3>
                <p className="text-xs font-semibold mb-3" style={{ color: "var(--green-700)" }}>{member.role}</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--gray-500)" }}>{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, var(--gold-500), var(--gold-300))" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <BookOpen size={36} className="mx-auto mb-5 opacity-80" style={{ color: "white" }} />
          <h2 className="text-heading mb-4" style={{ color: "white" }}>
            {de ? "Beginnen Sie Ihren Halal-Weg" : "Commencez votre parcours halal"}
          </h2>
          <p className="text-body-lg mb-8" style={{ color: "rgba(255,255,255,0.85)" }}>
            {de
              ? "Eröffnen Sie Ihr KT Bank Konto in 10 Minuten. 100% zertifiziert, 100% online."
              : "Ouvrez votre compte KT Bank en 10 minutes. 100% certifié, 100% en ligne."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/client/register" className="btn btn-primary btn-xl">
              {de ? "Konto eröffnen" : "Ouvrir un compte"} <ArrowRight size={18} />
            </Link>
            <Link href="/contact" className="btn btn-outline-white btn-xl">
              {de ? "Frage stellen" : "Poser une question"}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
