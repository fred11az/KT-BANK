"use client";
import Link from "next/link";
import { ArrowRight, CheckCircle, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();
  const de = t.lang !== "fr";

  const timeline = [
    { year: "2004", title: de ? "Gründung der Gruppe" : "Fondation du groupe", desc: de ? "Kuveyt Türk stellt einen Antrag auf Banklizenz in Deutschland." : "Kuveyt Türk dépose une demande de licence bancaire en Allemagne.", accent: "var(--green-700)" },
    { year: "2010", title: de ? "BaFin-Verhandlungen" : "Négociations BaFin", desc: de ? "Beginn der Gespräche mit der Aufsichtsbehörde für eine islamische Zulassung." : "Début des discussions avec l'autorité de régulation pour un agrément islamique.", accent: "var(--gold-400)" },
    { year: "2015", title: de ? "Erste islamische Bank" : "Première banque islamique", desc: de ? "KT Bank AG erhält BaFin-Lizenz — ein historisches Novum in Deutschland." : "KT Bank AG obtient sa licence BaFin — une première historique en Allemagne.", accent: "var(--green-700)" },
    { year: "2016", title: de ? "Nationale Expansion" : "Expansion nationale", desc: de ? "Eröffnung der Filialen in Frankfurt, Berlin und Köln." : "Ouverture des agences de Frankfurt, Berlin et Cologne.", accent: "var(--gold-400)" },
    { year: "2018", title: de ? "Digitale Transformation" : "Transformation digitale", desc: de ? "Launch der mobilen App und des GoldKontos." : "Lancement de l'application mobile et du GoldKonto.", accent: "var(--green-700)" },
    { year: "2020", title: de ? "50.000 Kunden" : "50 000 clients", desc: de ? "Historische Marke erreicht und Eröffnung der Münchener Filiale." : "Cap historique franchi et ouverture de l'agence de Munich.", accent: "var(--gold-400)" },
    { year: "2022", title: de ? "100% digital" : "100% digital", desc: de ? "Start des Online-Privatkredits — ohne Filialbesuch." : "Lancement du Crédit Personnel en ligne — zéro déplacement requis.", accent: "var(--green-700)" },
    { year: "2024", title: de ? "Neue Generation" : "Nouvelle génération", desc: de ? "JugendKonto, Immobilienfinanzierung, Donation & Zakat, Unternehmenskredit." : "JugendKonto, Financement Immobilier, Donation & Zakat, Crédit Pro.", accent: "var(--gold-400)" },
  ];

  const team = [
    { name: "Dr. Kemal Yildirim", role: de ? "Vorstandsvorsitzender (CEO)" : "Directeur Général (CEO)", initials: "KY", bio: de ? "20 Jahre Erfahrung in internationaler islamischer Finanzwirtschaft." : "20 ans d'expérience en finance islamique internationale.", gold: false },
    { name: "Ayse Kaya", role: de ? "Finanzvorstand (CFO)" : "Directrice Financière (CFO)", initials: "AK", bio: de ? "Ehemalige Direktorin der Deutschen Bank, Spezialistin für Risikomanagement." : "Ancienne directrice chez Deutsche Bank, spécialiste en gestion de risques.", gold: true },
    { name: "Mehmet Demir", role: de ? "Betriebsvorstand (COO)" : "Directeur des Opérations (COO)", initials: "MD", bio: de ? "Experte für digitale Transformation im Bankwesen." : "Expert en transformation digitale des services bancaires.", gold: false },
    { name: "Prof. Dr. Hassan Al-Amin", role: de ? "Vorsitzender des Shariah Boards" : "Président du Shariah Board", initials: "HA", bio: de ? "Professor für islamische Finanzen, AAOIFI-Berater." : "Professeur de finance islamique, consultant AAOIFI.", gold: true },
  ];

  const awards = [
    { icon: "🏆", title: "Best Islamic Bank Germany", year: "2023", org: "Global Finance Awards" },
    { icon: "🛡️", title: de ? "BaFin-Lizenz" : "Licence BaFin", year: "2015", org: "Bundesanstalt für Finanzdienstleistungsaufsicht" },
    { icon: "✅", title: de ? "AAOIFI-Mitglied" : "Membre AAOIFI", year: "2015", org: "Accounting & Auditing Standards" },
    { icon: "☪️", title: de ? "Halal-Zertifikat" : "Certification Halal", year: "2015", org: de ? "Europäischer Fatwa-Rat" : "Conseil Européen de la Fatwa" },
  ];

  const missionPoints = de
    ? ["100 % schariakonforme Bankprodukte", "BaFin-reguliert — voller Kundenschutz", "Partner von Kuveyt Türk — 5M+ Kunden weltweit"]
    : ["100% conforme à la charia islamique", "Agréée BaFin — protection client garantie", "Partenaire de Kuveyt Türk — 5M+ clients mondiaux"];

  return (
    <>
      {/* HERO */}
      <section
        className="relative py-28 lg:py-36 text-white overflow-hidden hero-grid"
        style={{ background: "linear-gradient(160deg, var(--green-900) 0%, var(--green-700) 100%)" }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none opacity-10"
          style={{ background: "radial-gradient(circle, var(--gold-300), transparent)", transform: "translate(30%, -30%)" }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="animate-fade-up">
            <span className="section-label mb-6" style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", color: "#E8C96B" }}>
              ✦ {de ? "Über KT Bank AG" : "À propos de KT Bank AG"}
            </span>
          </div>
          <h1 className="text-display mb-6 animate-fade-up delay-100">
            {de ? "Unsere Geschichte,\n" : "Notre Histoire,\n"}
            <br />
            <span className="text-gradient-gold">{de ? "Ihr Vertrauen" : "Votre Confiance"}</span>
          </h1>
          <p className="text-body-lg mb-10 animate-fade-up delay-200" style={{ color: "rgba(255,255,255,0.78)" }}>
            {de
              ? "Seit 2015 ist KT Bank AG die erste und einzige zugelassene islamische Bank in Deutschland. Über 50.000 Kunden vertrauen uns für ethisches und transparentes Banking."
              : "Depuis 2015, KT Bank AG est la première et unique banque islamique agréée en Allemagne. Plus de 50 000 clients nous font confiance pour une finance éthique et transparente."}
          </p>
          <div className="flex flex-wrap justify-center gap-8 animate-fade-up delay-300">
            {[
              { val: "2015", label: de ? "Gegründet" : "Fondée" },
              { val: "50K+", label: de ? "Kunden" : "Clients" },
              { val: "4", label: de ? "Filialen" : "Agences" },
              { val: "BaFin", label: de ? "Lizenziert" : "Agréée" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-black" style={{ color: "#E8C96B" }}>{s.val}</div>
                <div className="text-small" style={{ color: "rgba(255,255,255,0.55)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
          style={{ background: "linear-gradient(to top, #FAFAFA, transparent)" }} />
      </section>

      {/* MISSION */}
      <section className="py-20 lg:py-28" style={{ background: "white" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="section-label">{de ? "Unsere Mission" : "Notre Mission"}</span>
              <h2 className="text-heading mb-6 mt-2">
                {de ? "Ethisches Banking für\n" : "Finance éthique pour\n"}
                <br />
                <span className="text-gradient">{de ? "alle Deutschen" : "tous les Allemands"}</span>
              </h2>
              <p className="text-body-lg mb-5" style={{ color: "var(--gray-600)" }}>
                {de
                  ? "KT Bank AG vereint Modernität mit islamischen Werten. Wir bieten vollständige Bankdienstleistungen ohne Zinsen (Riba), ohne Spekulation und ohne verbotene Investitionen."
                  : "KT Bank AG réconcilie modernité et valeurs islamiques. Nous offrons des services bancaires complets sans intérêts (riba), sans spéculation, ni investissements prohibés."}
              </p>
              <p className="text-body mb-8" style={{ color: "var(--gray-500)" }}>
                {de
                  ? "Unsere Philosophie basiert auf gerechter Risiko- und Gewinnverteilung, vollständiger Transparenz und der finanziellen Inklusion aller Bürger, unabhängig von ihrem Glauben."
                  : "Notre philosophie repose sur le partage équitable des risques et des bénéfices, la transparence totale et l'inclusion financière de tous les citoyens, quelle que soit leur foi."}
              </p>
              <div className="flex flex-col gap-3">
                {missionPoints.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle size={17} style={{ color: "var(--green-700)", flexShrink: 0 }} />
                    <span className="text-body" style={{ color: "var(--gray-700)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
                <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&q=80" alt="KT Bank mission" className="w-full h-full object-cover" />
              </div>
              <div className="hidden md:block absolute -bottom-5 -left-5 card px-5 py-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                    style={{ background: "var(--green-700)" }}>✓</div>
                  <div>
                    <div className="font-bold text-sm" style={{ color: "var(--gray-900)" }}>{de ? "Halal-zertifiziert" : "Certifié Halal"}</div>
                    <div className="text-xs" style={{ color: "var(--gray-500)" }}>AAOIFI & Shariah Board</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-20 lg:py-28" style={{ background: "var(--gray-50)" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="section-label">{de ? "Unsere Geschichte" : "Notre Parcours"}</span>
            <h2 className="text-heading mt-4 mb-2">
              {de ? "20 Jahre " : "20 ans d'"}
              <span className="text-gradient">{de ? "Geschichte" : "histoire"}</span>
            </h2>
            <div className="divider-gold" />
          </div>
          <div className="relative">
            <div className="absolute left-7 top-0 bottom-0 w-px" style={{ background: "var(--gray-200)" }} />
            <div className="flex flex-col gap-6">
              {timeline.map((item, i) => (
                <div key={item.year} className="relative flex gap-5 animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ background: item.accent, boxShadow: `0 4px 16px ${item.accent}55` }}>
                    {i + 1}
                  </div>
                  <div className="card p-5 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="badge badge-gold">{item.year}</span>
                      <span className="font-bold text-sm" style={{ color: "var(--gray-900)" }}>{item.title}</span>
                    </div>
                    <p className="text-small" style={{ color: "var(--gray-500)" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MANAGEMENT */}
      <section className="py-20 lg:py-28" style={{ background: "white" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="section-label">{de ? "Führungsteam" : "Direction"}</span>
            <h2 className="text-heading mt-4 mb-2">
              {de ? "Das Team, das Sie " : "L'équipe qui vous "}
              <span className="text-gradient">{de ? "begleitet" : "guide"}</span>
            </h2>
            <div className="divider-gold" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <div key={member.name} className="card card-interactive p-6 text-center animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-4"
                  style={{ background: member.gold ? "linear-gradient(135deg, var(--gold-400), var(--gold-300))" : "var(--green-700)" }}>
                  {member.initials}
                </div>
                <h3 className="font-bold text-sm mb-1" style={{ color: "var(--gray-900)" }}>{member.name}</h3>
                <p className="text-xs font-semibold mb-3" style={{ color: "var(--green-700)" }}>{member.role}</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--gray-500)" }}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AWARDS */}
      <section className="py-20" style={{ background: "var(--gray-900)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="section-label" style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", color: "#E8C96B" }}>
              {de ? "Auszeichnungen" : "Reconnaissances"}
            </span>
            <h2 className="text-heading mt-4 mb-2" style={{ color: "white" }}>
              {de ? "Zertifizierungen, die " : "Des certifications qui "}
              <span className="text-gradient-gold">{de ? "zählen" : "comptent"}</span>
            </h2>
            <div className="divider-gold" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {awards.map((award, i) => (
              <div key={award.title} className="card-glass p-6 text-center animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="text-4xl mb-4">{award.icon}</div>
                <h3 className="font-bold text-sm mb-1" style={{ color: "white" }}>{award.title}</h3>
                <p className="text-xs mb-2 font-semibold" style={{ color: "#E8C96B" }}>{award.year}</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{award.org}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, var(--gold-500), var(--gold-300))" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <Star size={36} className="mx-auto mb-5 opacity-80" style={{ color: "white" }} />
          <h2 className="text-heading mb-4" style={{ color: "white" }}>
            {de ? "Teil der KT Bank-Familie werden" : "Rejoignez l'aventure KT Bank"}
          </h2>
          <p className="text-body-lg mb-8" style={{ color: "rgba(255,255,255,0.85)" }}>
            {de
              ? "Über 50.000 Kunden vertrauen uns. Eröffnen Sie Ihr Konto in 10 Minuten, 100% online."
              : "Plus de 50 000 clients nous font confiance. Ouvrez votre compte en 10 minutes, 100% en ligne."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/client/register" className="btn btn-primary btn-xl">
              {de ? "Konto eröffnen" : "Ouvrir un compte"} <ArrowRight size={18} />
            </Link>
            <Link href="/contact" className="btn btn-outline-white btn-xl">
              {de ? "Kontakt aufnehmen" : "Nous contacter"}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
