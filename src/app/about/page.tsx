"use client";
import Link from "next/link";
import { ArrowRight, Award, Globe, Users, TrendingUp, Shield, Heart } from "lucide-react";

export default function AboutPage() {
  const timeline = [
    { year: "2004", event: "Kuveyt Türk dépose une demande de licence bancaire en Allemagne" },
    { year: "2010", event: "Début des négociations avec la BaFin pour un agrément islamique" },
    { year: "2015", event: "KT Bank AG obtient sa licence bancaire complète — première banque islamique d'Allemagne" },
    { year: "2016", event: "Ouverture des agences de Frankfurt, Berlin et Cologne" },
    { year: "2018", event: "Lancement de l'application mobile et du GoldKonto" },
    { year: "2020", event: "50 000 clients dépassés, ouverture de l'agence de Munich" },
    { year: "2022", event: "Lancement du Crédit Personnel en ligne — 100% digital" },
    { year: "2024", event: "Nouveaux produits : Donation/Zakat, Crédit Pro, JugendKonto, Financement Immobilier" },
  ];

  const team = [
    { name: "Dr. Kemal Yildirim", role: "Directeur Général (CEO)", initials: "KY" },
    { name: "Ayse Kaya", role: "Directrice Financière (CFO)", initials: "AK" },
    { name: "Mehmet Demir", role: "Directeur des Opérations (COO)", initials: "MD" },
    { name: "Prof. Dr. Hassan Al-Amin", role: "Président du Shariah Board", initials: "HA" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative py-28 text-white overflow-hidden"
        style={{ background: "linear-gradient(135deg, #004020 0%, #005F2D 60%, #007A3D 100%)" }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cpolygon fill='white' points='50,0 100,25 100,75 50,100 0,75 0,25'/%3E%3C/svg%3E\")", backgroundSize: "80px" }}></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ background: "rgba(201,168,76,0.2)", border: "1px solid rgba(201,168,76,0.4)", color: "#E8C96B" }}>
            À propos de KT Bank AG
          </div>
          <h1 className="text-5xl lg:text-6xl font-black mb-6">
            Notre Histoire,<br/>
            <span style={{ color: "#E8C96B" }}>Votre Confiance</span>
          </h1>
          <p className="text-green-200 text-xl max-w-3xl mx-auto leading-relaxed">
            Depuis 2015, KT Bank AG est la première et unique banque islamique agréée en Allemagne,
            offrant des services financiers conformes à la charia à plus de 50 000 clients.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none"><path d="M0,60 C360,0 1080,60 1440,15 L1440,60 Z" fill="#FAFAFA"/></svg>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{ background: "#D1FAE5", color: "#005F2D" }}>
              Notre Mission
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Rendre la finance islamique{" "}
              <span style={{ color: "#005F2D" }}>accessible à tous</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6 text-lg">
              KT Bank AG est née d'une conviction profonde : chaque musulman en Allemagne
              devrait pouvoir gérer ses finances en accord avec ses valeurs religieuses, sans
              compromettre la qualité ou la modernité des services.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Filiale de Kuveyt Türk Participation Bank, fondée en 1989 à Istanbul,
              nous bénéficions d'une expertise de plus de 30 ans en finance islamique,
              combinée avec les standards rigoureux de la régulation bancaire allemande (BaFin).
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "🎯", label: "Mission", desc: "Finance islamique accessible" },
                { icon: "👁️", label: "Vision", desc: "Leader européen de l'Islamic banking" },
                { icon: "💎", label: "Valeurs", desc: "Intégrité, transparence, foi" },
                { icon: "🌍", label: "Impact", desc: "50 000+ familles servies" },
              ].map((item) => (
                <div key={item.label} className="p-4 bg-white rounded-2xl border border-gray-100">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="font-bold text-gray-900 text-sm">{item.label}</div>
                  <div className="text-gray-500 text-xs">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&q=80"
              alt="KT Bank équipe"
              className="rounded-3xl shadow-2xl w-full h-80 object-cover"
            />
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { value: "9+", label: "Années" },
                { value: "150+", label: "Employés" },
                { value: "4", label: "Agences" },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
                  <div className="text-3xl font-black" style={{ color: "#005F2D" }}>{s.value}</div>
                  <div className="text-gray-500 text-sm">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Notre Parcours</h2>
            <div className="w-20 h-1 mx-auto rounded-full" style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96B)" }}></div>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5" style={{ background: "linear-gradient(180deg, #005F2D, #C9A84C)" }}></div>
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <div key={item.year} className="flex gap-6 items-start">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 z-10"
                    style={{ background: i % 2 === 0 ? "linear-gradient(135deg, #005F2D, #007A3D)" : "linear-gradient(135deg, #C9A84C, #E8C96B)" }}>
                    {item.year.slice(2)}
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-2xl p-5 border border-gray-100">
                    <div className="font-bold text-lg mb-1" style={{ color: "#005F2D" }}>{item.year}</div>
                    <div className="text-gray-600">{item.event}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Management board */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Notre Direction</h2>
            <div className="w-20 h-1 mx-auto rounded-full" style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96B)" }}></div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl p-6 text-center border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold"
                  style={{ background: "linear-gradient(135deg, #005F2D, #007A3D)" }}>
                  {member.initials}
                </div>
                <div className="font-bold text-gray-900">{member.name}</div>
                <div className="text-sm text-gray-500 mt-1">{member.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-4">Reconnaissances & Certifications</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Award/>, title: "Best Islamic Bank Germany 2023", org: "Global Finance Magazine" },
              { icon: <Shield/>, title: "BaFin Full License", org: "Since 2015" },
              { icon: <Globe/>, title: "AAOIFI Compliant", org: "Islamic Finance Standards" },
              { icon: <Heart/>, title: "Halal Certified", org: "Islamic Finance Council" },
            ].map((award) => (
              <div key={award.title} className="p-6 rounded-2xl border border-gray-100 text-center hover:shadow-lg transition-all">
                <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-xl"
                  style={{ background: "#D1FAE5", color: "#005F2D" }}>
                  {award.icon}
                </div>
                <div className="font-bold text-sm text-gray-900">{award.title}</div>
                <div className="text-xs text-gray-500 mt-1">{award.org}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96B)" }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-white mb-4">Rejoignez la famille KT Bank</h2>
          <p className="text-yellow-100 text-lg mb-8">Plus de 50 000 clients nous font déjà confiance.</p>
          <Link href="/client/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all hover:-translate-y-1"
            style={{ background: "linear-gradient(135deg, #005F2D, #007A3D)" }}>
            Ouvrir mon compte <ArrowRight size={18}/>
          </Link>
        </div>
      </section>
    </>
  );
}
