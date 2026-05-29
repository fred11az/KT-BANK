"use client";
import Link from "next/link";
import { MapPin, Phone, Clock, ArrowRight, Globe, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BranchesPage() {
  const { t } = useLanguage();
  const de = t.lang !== "fr";

  const branches = [
    {
      city: "Frankfurt",
      subtitle: de ? "Hauptsitz" : "Siège social",
      address: "Bockenheimer Landstraße 33, 60325 Frankfurt am Main",
      phone: "+49 69 2475 1700",
      hours: de ? "Mo–Fr: 9–17 Uhr" : "Lun–Ven : 9h–17h",
      image: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=400&q=80",
      mapsUrl: "https://maps.google.com/?q=Bockenheimer+Landstraße+33+Frankfurt",
      badge: de ? "Hauptsitz" : "Siège",
    },
    {
      city: "Berlin",
      subtitle: de ? "Hauptfiliale" : "Agence principale",
      address: "Wilmersdorfer Str. 50/51, 10627 Berlin",
      phone: "+49 30 3150 0450",
      hours: de ? "Mo–Fr: 9–17 Uhr" : "Lun–Ven : 9h–17h",
      image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80",
      mapsUrl: "https://maps.google.com/?q=Wilmersdorfer+Str+50+Berlin",
      badge: null,
    },
    {
      city: de ? "Köln" : "Cologne",
      subtitle: de ? "Regionalfiliale" : "Agence régionale",
      address: "Venloer Str. 24, 50672 Köln",
      phone: "+49 221 2758 5310",
      hours: de ? "Mo–Fr: 9–17 Uhr" : "Lun–Ven : 9h–17h",
      image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&q=80",
      mapsUrl: "https://maps.google.com/?q=Venloer+Str+24+Köln",
      badge: null,
    },
    {
      city: de ? "München" : "Munich",
      subtitle: de ? "Regionalfiliale" : "Agence régionale",
      address: "Landsberger Str. 110, 80339 München",
      phone: "+49 89 4520 5700",
      hours: de ? "Mo–Fr: 9–17 Uhr" : "Lun–Ven : 9h–17h",
      image: "https://images.unsplash.com/photo-1549921296-3b0f9a35af35?w=400&q=80",
      mapsUrl: "https://maps.google.com/?q=Landsberger+Str+110+München",
      badge: de ? "Neu" : "Nouveau",
    },
  ];

  const services = [
    { icon: "💳", label: de ? "Kontoeröffnung" : "Ouverture de compte" },
    { icon: "🏠", label: de ? "Immobilienfinanzierung" : "Financement immobilier" },
    { icon: "🚗", label: de ? "Autofinanzierung" : "Financement auto" },
    { icon: "🤝", label: de ? "Unternehmensberatung" : "Conseil entreprise" },
    { icon: "🥇", label: de ? "Goldinvestment" : "Investissement or" },
    { icon: "💰", label: de ? "Privatkredit" : "Crédit personnel" },
    { icon: "🤲", label: de ? "Zakat & Spenden" : "Zakat & donations" },
    { icon: "📱", label: de ? "App-Support" : "Support application" },
  ];

  const languages = [
    { flag: "🇩🇪", lang: "Deutsch", code: "DE" },
    { flag: "🇬🇧", lang: "English", code: "EN" },
    { flag: "🇹🇷", lang: "Türkçe", code: "TR" },
    { flag: "🇸🇦", lang: "العربية", code: "AR" },
  ];

  return (
    <>
      {/* HERO */}
      <section
        className="relative py-24 lg:py-32 text-white overflow-hidden hero-grid"
        style={{ background: "linear-gradient(160deg, var(--green-900) 0%, var(--green-700) 100%)" }}
      >
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full pointer-events-none opacity-10"
          style={{ background: "radial-gradient(circle, var(--gold-300), transparent)", transform: "translate(20%, 20%)" }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="animate-fade-up">
            <span className="section-label" style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", color: "#E8C96B" }}>
              🗺️ {de ? "Unsere Filialen" : "Nos Agences"}
            </span>
          </div>
          <h1 className="text-display mt-4 mb-6 animate-fade-up delay-100">
            {de ? "Nah bei Ihnen, " : "Près de vous, "}
            <span className="text-gradient-gold">{de ? "überall" : "partout"}</span>
          </h1>
          <p className="text-body-lg mb-8 animate-fade-up delay-200" style={{ color: "rgba(255,255,255,0.78)" }}>
            {de
              ? "4 Filialen deutschlandweit. Jeder Berater spricht Ihre Sprache und kennt Ihre Werte."
              : "4 agences à travers l'Allemagne. Chaque conseiller parle votre langue et connaît vos valeurs."}
          </p>
          <div className="flex flex-wrap justify-center gap-8 animate-fade-up delay-300">
            {[
              { val: "4", label: de ? "Filialen" : "Agences" },
              { val: "4", label: de ? "Sprachen" : "Langues" },
              { val: de ? "9–17 Uhr" : "9h–17h", label: de ? "Öffnungszeiten" : "Horaires" },
              { val: de ? "Termin" : "Sur RDV", label: de ? "Auch verfügbar" : "Aussi dispo" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-black" style={{ color: "#E8C96B" }}>{s.val}</div>
                <div className="text-small" style={{ color: "rgba(255,255,255,0.55)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
          style={{ background: "linear-gradient(to top, #FAFAFA, transparent)" }} />
      </section>

      {/* BRANCH CARDS */}
      <section className="py-20 lg:py-28" style={{ background: "white" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="section-label">{de ? "Unsere Filialen" : "Nos Agences"}</span>
            <h2 className="text-heading mt-4 mb-2">
              {de ? "Finden Sie Ihre " : "Trouvez votre "}
              <span className="text-gradient">{de ? "Filiale" : "agence"}</span>
            </h2>
            <div className="divider-gold" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {branches.map((branch, i) => (
              <div key={branch.city} className="card card-interactive overflow-hidden animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
                <div className="relative h-44 overflow-hidden">
                  <img src={branch.image} alt={branch.city} className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)" }} />
                  <div className="absolute bottom-3 left-3">
                    <h3 className="text-white font-black text-xl">{branch.city}</h3>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>{branch.subtitle}</p>
                  </div>
                  {branch.badge && (
                    <div className="absolute top-3 right-3 badge badge-gold">{branch.badge}</div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex flex-col gap-2 mb-5">
                    <div className="flex items-start gap-2">
                      <MapPin size={14} style={{ color: "var(--green-700)", flexShrink: 0, marginTop: 2 }} />
                      <span className="text-xs leading-relaxed" style={{ color: "var(--gray-600)" }}>{branch.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={14} style={{ color: "var(--green-700)", flexShrink: 0 }} />
                      <span className="text-xs" style={{ color: "var(--gray-600)" }}>{branch.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} style={{ color: "var(--green-700)", flexShrink: 0 }} />
                      <span className="text-xs" style={{ color: "var(--gray-600)" }}>{branch.hours}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a href={branch.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm flex-1 justify-center">
                      <Globe size={13} /> {de ? "Karte" : "Voir"}
                    </a>
                    <Link href="/contact" className="btn btn-primary btn-sm flex-1 justify-center">
                      <Calendar size={13} /> {de ? "Termin" : "RDV"}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES IN-BRANCH */}
      <section className="py-20" style={{ background: "var(--gray-50)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="section-label">{de ? "In der Filiale" : "En agence"}</span>
            <h2 className="text-heading mt-4 mb-2">
              {de ? "Verfügbare " : "Services "}
              <span className="text-gradient">{de ? "Dienste" : "disponibles"}</span>
            </h2>
            <div className="divider-gold" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {services.map((svc, i) => (
              <div key={svc.label} className="card p-4 text-center animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                <div className="text-2xl mb-2">{svc.icon}</div>
                <p className="text-xs font-medium leading-tight" style={{ color: "var(--gray-700)" }}>{svc.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LANGUAGES */}
      <section className="py-20" style={{ background: "white" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="section-label">{de ? "Mehrsprachigkeit" : "Multilinguisme"}</span>
              <h2 className="text-heading mt-4 mb-5">
                {de ? "Ihre Sprache,\n" : "Votre langue,\n"}
                <br /><span className="text-gradient">{de ? "unsere Priorität" : "notre priorité"}</span>
              </h2>
              <p className="text-body-lg mb-8" style={{ color: "var(--gray-600)" }}>
                {de
                  ? "Unsere Berater sprechen Deutsch, Englisch, Türkisch und Arabisch. Denn klare Kommunikation ist das Fundament des Vertrauens."
                  : "Nos conseillers parlent allemand, anglais, turc et arabe. Parce que la communication claire est au cœur de la confiance."}
              </p>
              <Link href="/contact" className="btn btn-primary btn-lg">
                {de ? "Termin vereinbaren" : "Prendre rendez-vous"} <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {languages.map((l, i) => (
                <div key={l.code} className="card p-6 text-center animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="text-4xl mb-3">{l.flag}</div>
                  <div className="font-bold text-sm mb-1" style={{ color: "var(--gray-900)" }}>{l.lang}</div>
                  <div className="badge badge-green">{l.code}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, var(--gold-500), var(--gold-300))" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <MapPin size={36} className="mx-auto mb-5 opacity-80" style={{ color: "white" }} />
          <h2 className="text-heading mb-4" style={{ color: "white" }}>
            {de ? "Besuchen Sie uns" : "Venez nous rencontrer"}
          </h2>
          <p className="text-body-lg mb-8" style={{ color: "rgba(255,255,255,0.85)" }}>
            {de
              ? "Unsere Berater empfangen Sie nach Terminvereinbarung oder eröffnen Sie Ihr Konto online in 10 Minuten."
              : "Nos conseillers vous accueillent sur rendez-vous ou ouvrez votre compte en ligne en 10 minutes."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/client/register" className="btn btn-primary btn-xl">
              {de ? "Online eröffnen" : "Ouvrir en ligne"} <ArrowRight size={18} />
            </Link>
            <Link href="/contact" className="btn btn-outline-white btn-xl">
              {de ? "Termin buchen" : "Prendre RDV"}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
