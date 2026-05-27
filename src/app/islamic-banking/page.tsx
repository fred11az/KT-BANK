"use client";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function IslamicBankingPage() {
  const principles = [
    { arabic: "ربا", title: "Prohibition du Riba (Intérêts)", icon: "🚫", desc: "L'islam interdit strictement les intérêts (riba) sous toutes leurs formes. Chez KT Bank, aucun produit ne génère ou ne requiert d'intérêts." },
    { arabic: "غرر", title: "Prohibition du Gharar (Incertitude)", icon: "⚖️", desc: "Les contrats ambigus ou spéculatifs sont prohibés. Nos produits sont clairs, transparents et sans clauses cachées." },
    { arabic: "مضاربة", title: "Mudaraba — Partage des profits", icon: "🤝", desc: "Contrat de partenariat où KT Bank apporte les fonds et le client apporte l'expertise. Les profits sont partagés selon un ratio convenu." },
    { arabic: "مشاركة", title: "Musharaka — Participation conjointe", icon: "🏦", desc: "Les deux parties contribuent en capital. Les profits et pertes sont partagés proportionnellement à la participation de chacun." },
    { arabic: "مرابحة", title: "Murabaha — Vente à marge", icon: "💱", desc: "KT Bank achète un bien et le revend au client avec une marge bénéficiaire fixe et transparente. Utilisé pour l'auto et l'immobilier." },
    { arabic: "إجارة", title: "Ijara — Crédit-bail islamique", icon: "🏗️", desc: "Contrat de location avec option d'achat. La banque achète l'actif et le loue au client, qui peut ensuite en devenir propriétaire." },
  ];

  const prohibited = [
    { icon: "🍺", label: "Alcool & Tabac" },
    { icon: "🎰", label: "Jeux de hasard" },
    { icon: "🐷", label: "Produits porcins" },
    { icon: "⚔️", label: "Armement" },
    { icon: "🏦", label: "Banques conventionnelles" },
    { icon: "🎭", label: "Divertissement illicite" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative py-28 text-white overflow-hidden"
        style={{ background: "linear-gradient(135deg, #004020 0%, #005F2D 60%, #007A3D 100%)" }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cpolygon fill='white' points='50,0 100,25 100,75 50,100 0,75 0,25'/%3E%3C/svg%3E\")", backgroundSize: "80px" }}></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="text-6xl mb-6">☪️</div>
          <h1 className="text-5xl lg:text-6xl font-black mb-6">
            Finance Islamique :{" "}
            <span style={{ color: "#E8C96B" }}>La Voie Éthique</span>
          </h1>
          <p className="text-green-200 text-xl max-w-3xl mx-auto leading-relaxed">
            Comprendre les principes fondamentaux de la finance islamique et comment
            KT Bank AG les applique dans chacun de ses produits.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
            style={{ background: "rgba(201,168,76,0.2)", border: "1px solid rgba(201,168,76,0.4)", color: "#E8C96B" }}>
            Certifié AAOIFI · Shariah Board indépendant · Validé BaFin
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none"><path d="M0,60 C360,0 1080,60 1440,15 L1440,60 Z" fill="#FAFAFA"/></svg>
        </div>
      </section>

      {/* What is Islamic Banking */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Qu'est-ce que la{" "}
              <span style={{ color: "#005F2D" }}>Finance Islamique ?</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6 text-lg">
              La finance islamique est un système financier fondé sur les principes de la loi islamique (charia).
              Elle repose sur l'interdiction de l'intérêt (riba), le partage équitable des risques et des profits,
              et l'investissement uniquement dans des activités licites.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Contrairement à la banque conventionnelle qui prête de l'argent contre intérêts,
              la banque islamique crée une relation de partenariat réel entre la banque et ses clients.
              Les gains sont légitimes car ils découlent d'un commerce réel ou d'un service effectif.
            </p>
            <div className="space-y-3">
              {["Aucun intérêt sur les prêts ni sur les dépôts", "Partage équitable des profits ET des pertes", "Investissements uniquement dans secteurs éthiques", "Transparence totale des contrats", "Supervision d'un Shariah Board indépendant"].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle size={18} style={{ color: "#005F2D" }}/>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <img src="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&q=80" alt="Finance islamique" className="w-full h-96 object-cover"/>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Les Principes Fondamentaux
            </h2>
            <div className="w-20 h-1 mx-auto rounded-full" style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96B)" }}></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {principles.map((p) => (
              <div key={p.title} className="p-6 rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">{p.icon}</div>
                  <div className="text-2xl font-bold" style={{ color: "#C9A84C", fontFamily: "serif" }}>{p.arabic}</div>
                </div>
                <h3 className="font-bold text-gray-900 mb-3">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prohibited sectors */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #004020, #005F2D)" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-white mb-4">Secteurs Exclus de nos Investissements</h2>
            <p className="text-green-200 text-lg">KT Bank n'investit jamais dans ces secteurs contraires à l'éthique islamique</p>
          </div>
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
            {prohibited.map((item) => (
              <div key={item.label} className="text-center p-4 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
                <div className="text-4xl mb-2">{item.icon}</div>
                <div className="text-white text-sm font-medium">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shariah Board */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-5xl mb-6">⚖️</div>
          <h2 className="text-4xl font-black text-gray-900 mb-6">Notre Shariah Board</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            Notre conseil de conformité islamique est composé de 5 érudits islamiques indépendants,
            experts en fiqh muamalat (jurisprudence des transactions commerciales). Ils examinent
            et certifient chaque produit avant son lancement.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { title: "Révision annuelle", desc: "Tous nos produits sont révisés annuellement pour garantir leur conformité" },
              { title: "Certification AAOIFI", desc: "Conformité aux normes de l'Accounting and Auditing Organization for Islamic Financial Institutions" },
              { title: "Fatwa documentée", desc: "Chaque produit dispose d'une fatwa écrite et publiée pour la transparence" },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="font-bold text-gray-900 mb-2">{item.title}</div>
                <div className="text-gray-500 text-sm">{item.desc}</div>
              </div>
            ))}
          </div>
          <Link href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all hover:-translate-y-1"
            style={{ background: "linear-gradient(135deg, #005F2D, #007A3D)" }}>
            Découvrir nos produits halal <ArrowRight size={18}/>
          </Link>
        </div>
      </section>
    </>
  );
}
