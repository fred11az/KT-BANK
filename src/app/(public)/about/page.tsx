"use client";
import Link from "next/link";
import { ArrowRight, CheckCircle, Star } from "lucide-react";

const timeline = [
  { year: "2004", title: "Fondation du groupe", desc: "Kuveyt Türk dépose une demande de licence bancaire en Allemagne.", accent: "var(--green-700)" },
  { year: "2010", title: "Négociations BaFin", desc: "Début des discussions avec l'autorité de régulation pour un agrément islamique.", accent: "var(--gold-400)" },
  { year: "2015", title: "Première banque islamique", desc: "KT Bank AG obtient sa licence BaFin — une première historique en Allemagne.", accent: "var(--green-700)" },
  { year: "2016", title: "Expansion nationale", desc: "Ouverture des agences de Frankfurt, Berlin et Cologne.", accent: "var(--gold-400)" },
  { year: "2018", title: "Transformation digitale", desc: "Lancement de l'application mobile et du GoldKonto.", accent: "var(--green-700)" },
  { year: "2020", title: "50 000 clients", desc: "Cap historique franchi et ouverture de l'agence de Munich.", accent: "var(--gold-400)" },
  { year: "2022", title: "100% digital", desc: "Lancement du Crédit Personnel en ligne — zéro déplacement requis.", accent: "var(--green-700)" },
  { year: "2024", title: "Nouvelle génération", desc: "JugendKonto, Financement Immobilier, Donation & Zakat, Crédit Pro.", accent: "var(--gold-400)" },
];

const team = [
  { name: "Dr. Kemal Yildirim", role: "Directeur Général (CEO)", initials: "KY", bio: "20 ans d'expérience en finance islamique internationale.", gold: false },
  { name: "Ayse Kaya", role: "Directrice Financière (CFO)", initials: "AK", bio: "Ancienne directrice chez Deutsche Bank, spécialiste en gestion de risques.", gold: true },
  { name: "Mehmet Demir", role: "Directeur des Opérations (COO)", initials: "MD", bio: "Expert en transformation digitale des services bancaires.", gold: false },
  { name: "Prof. Dr. Hassan Al-Amin", role: "Président du Shariah Board", initials: "HA", bio: "Professeur de finance islamique, consultant AAOIFI.", gold: true },
];

const awards = [
  { icon: "🏆", title: "Best Islamic Bank Germany", year: "2023", org: "Global Finance Awards" },
  { icon: "🛡️", title: "Licence BaFin", year: "2015", org: "Bundesanstalt für Finanzdienstleistungsaufsicht" },
  { icon: "✅", title: "Membre AAOIFI", year: "2015", org: "Accounting & Auditing Standards" },
  { icon: "☪️", title: "Certification Halal", year: "2015", org: "Conseil Européen de la Fatwa" },
];

export default function AboutPage() {
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
              ✦ À propos de KT Bank AG
            </span>
          </div>
          <h1 className="text-display mb-6 animate-fade-up delay-100">
            Notre Histoire,<br />
            <span className="text-gradient-gold">Votre Confiance</span>
          </h1>
          <p className="text-body-lg mb-10 animate-fade-up delay-200" style={{ color: "rgba(255,255,255,0.78)" }}>
            Depuis 2015, KT Bank AG est la première et unique banque islamique agréée en Allemagne.
            Plus de 50 000 clients nous font confiance pour une finance éthique et transparente.
          </p>
          <div className="flex flex-wrap justify-center gap-8 animate-fade-up delay-300">
            {[{ val: "2015", label: "Fondée" }, { val: "50K+", label: "Clients" }, { val: "4", label: "Agences" }, { val: "BaFin", label: "Agréée" }].map((s) => (
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
              <span className="section-label">Notre Mission</span>
              <h2 className="text-heading mb-6 mt-2">
                Finance éthique pour<br />
                <span className="text-gradient">tous les Allemands</span>
              </h2>
              <p className="text-body-lg mb-5" style={{ color: "var(--gray-600)" }}>
                KT Bank AG réconcilie modernité et valeurs islamiques. Nous offrons des services bancaires
                complets sans intérêts (riba), sans spéculation, ni investissements prohibés.
              </p>
              <p className="text-body mb-8" style={{ color: "var(--gray-500)" }}>
                Notre philosophie repose sur le partage équitable des risques et des bénéfices, la
                transparence totale et l'inclusion financière de tous les citoyens, quelle que soit leur foi.
              </p>
              <div className="flex flex-col gap-3">
                {["100% conforme à la charia islamique", "Agréée BaFin — protection client garantie", "Partenaire de Kuveyt Türk — 5M+ clients mondiaux"].map((item) => (
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
                    <div className="font-bold text-sm" style={{ color: "var(--gray-900)" }}>Certifié Halal</div>
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
            <span className="section-label">Notre Parcours</span>
            <h2 className="text-heading mt-4 mb-2">20 ans d'<span className="text-gradient">histoire</span></h2>
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
            <span className="section-label">Direction</span>
            <h2 className="text-heading mt-4 mb-2">L'équipe qui vous <span className="text-gradient">guide</span></h2>
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
              Reconnaissances
            </span>
            <h2 className="text-heading mt-4 mb-2" style={{ color: "white" }}>
              Des certifications qui <span className="text-gradient-gold">comptent</span>
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
          <h2 className="text-heading mb-4" style={{ color: "white" }}>Rejoignez l'aventure KT Bank</h2>
          <p className="text-body-lg mb-8" style={{ color: "rgba(255,255,255,0.85)" }}>
            Plus de 50 000 clients nous font confiance. Ouvrez votre compte en 10 minutes, 100% en ligne.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/client/register" className="btn btn-primary btn-xl">
              Ouvrir un compte <ArrowRight size={18} />
            </Link>
            <Link href="/contact" className="btn btn-outline-white btn-xl">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
