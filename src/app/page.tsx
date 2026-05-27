"use client";
import Link from "next/link";
import { ArrowRight, CheckCircle, Star, TrendingUp, Shield, Globe, Zap, Heart, Play, ChevronRight } from "lucide-react";
import { products, stats, testimonials } from "@/lib/utils";

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: "linear-gradient(135deg, #004020 0%, #005F2D 40%, #007A3D 80%, #009447 100%)" }}>
    <div className="absolute inset-0 opacity-10"
      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cpolygon fill='white' fill-opacity='1' points='50,0 100,25 100,75 50,100 0,75 0,25'/%3E%3C/svg%3E\")", backgroundSize: "80px 80px" }}>
    </div>
    <div className="absolute top-20 right-10 w-64 h-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #C9A84C, transparent)" }}></div>
    <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #C9A84C, transparent)" }}></div>

    <div className="relative z-10 max-w-7xl mx-auto px-4 py-32 grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
          style={{ background: "rgba(201,168,76,0.2)", border: "1px solid rgba(201,168,76,0.4)", color: "#E8C96B" }}>
          <span>🌙</span> La première banque islamique d'Allemagne
        </div>

        <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
          Mes Valeurs,{" "}
          <span style={{ color: "#E8C96B" }}>Ma Banque.</span>
          <br/>
          <span className="text-3xl lg:text-4xl font-light text-green-200">
            Meine Werte, meine Bank.
          </span>
        </h1>

        <p className="text-green-100 text-lg leading-relaxed mb-8 max-w-xl">
          KT Bank AG offre des services bancaires complets conformes à la charia islamique.
          Comptes, épargne, financement, investissement — tout en respectant vos valeurs.
        </p>

        <div className="flex flex-wrap gap-3 mb-8">
          {["✅ 100% Halal certifié", "🏛️ BaFin régulé", "💰 Dépôts garantis jusqu'à 100K€"].map((item) => (
            <span key={item} className="px-4 py-2 rounded-full text-sm font-medium"
              style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}>
              {item}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-4">
          <Link href="/client/register"
            className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all hover:-translate-y-1 hover:shadow-2xl"
            style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96B)", boxShadow: "0 8px 30px rgba(201,168,76,0.4)" }}>
            Ouvrir un compte gratuit
            <ArrowRight size={18}/>
          </Link>
          <Link href="/products"
            className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all hover:bg-white/20"
            style={{ border: "2px solid rgba(255,255,255,0.5)", color: "white" }}>
            <Play size={18}/> Découvrir nos produits
          </Link>
        </div>
      </div>

      <div className="relative flex justify-center lg:justify-end">
        <div className="relative w-full max-w-md">
          <div className="rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.3)" }}>
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="text-sm text-green-200">KT GiroKonto</div>
                <div className="text-2xl font-bold mt-1">€ 24 850,00</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-yellow-400/20 flex items-center justify-center text-2xl font-bold text-yellow-300">
                KT
              </div>
            </div>
            <div className="text-sm text-green-200 mb-2 font-mono">•••• •••• •••• 8492</div>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-xs text-green-300">Titulaire</div>
                <div className="font-semibold">Ahmed Al-Rashid</div>
              </div>
              <div>
                <div className="text-xs text-green-300">Expire</div>
                <div className="font-semibold">12/28</div>
              </div>
              <div className="text-3xl">💳</div>
            </div>
          </div>

          <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 min-w-36">
            <div className="text-xs text-gray-500 mb-1">Rendement GoldKonto</div>
            <div className="text-2xl font-bold" style={{ color: "#C9A84C" }}>+4.2%</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp size={12}/> +0.3% ce mois
            </div>
          </div>

          <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4">
            <div className="text-xs text-gray-500 mb-1">Votre Zakat 2024</div>
            <div className="text-xl font-bold text-green-700">€ 620</div>
            <div className="text-xs text-gray-500">Calculé automatiquement</div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {stats.slice(0, 3).map((stat) => (
              <div key={stat.label} className="rounded-2xl p-4 text-center"
                style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)" }}>
                <div className="text-2xl">{stat.icon}</div>
                <div className="text-white font-bold text-lg">{stat.value}</div>
                <div className="text-green-200 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    <div className="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,80 C360,0 1080,80 1440,20 L1440,80 Z" fill="#FAFAFA"/>
      </svg>
    </div>
  </section>
);

const TrustBanner = () => (
  <section className="py-10 bg-white border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-wrap justify-center items-center gap-8">
        {[
          { label: "BaFin Régulée", icon: "🏛️" },
          { label: "Dépôts garantis 100K€", icon: "🛡️" },
          { label: "Certifié Shariah Board", icon: "☪️" },
          { label: "SSL 256-bit", icon: "🔐" },
          { label: "App Store 4.8★", icon: "📱" },
          { label: "50 000+ clients", icon: "👥" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <span className="text-xl">{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ProductsSection = () => (
  <section className="py-24 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
          style={{ background: "#D1FAE5", color: "#005F2D" }}>
          Nos Produits
        </div>
        <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
          Des solutions pour{" "}
          <span style={{ color: "#005F2D" }}>chaque besoin</span>
        </h2>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Découvrez notre gamme complète de produits financiers islamiques.
        </p>
        <div className="w-20 h-1 mx-auto mt-6 rounded-full" style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96B)" }}></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-green-300 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer h-full relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: `linear-gradient(90deg, ${product.color}, ${product.color}88)` }}></div>
              {(product as { isNew?: boolean }).isNew && (
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96B)" }}>
                  Nouveau
                </div>
              )}
              {product.popular && (
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold text-white bg-green-600">
                  ⭐ Populaire
                </div>
              )}
              <div className="text-4xl mb-4">{product.icon}</div>
              <div className="text-xs font-medium px-2 py-1 rounded-full inline-block mb-3"
                style={{ background: `${product.color}15`, color: product.color }}>
                {product.category}
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-green-800 transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">{product.tagline}</p>
              <div className="space-y-1 mb-4">
                {product.features.slice(0, 3).map((feat) => (
                  <div key={feat} className="flex items-center gap-2 text-xs text-gray-600">
                    <CheckCircle size={12} className="text-green-500 flex-shrink-0"/>
                    {feat}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                <span className="text-xs font-bold px-2 py-1 rounded-full"
                  style={{ background: `${product.color}10`, color: product.color }}>
                  {product.badge}
                </span>
                <span className="text-xs font-medium flex items-center gap-1 text-green-700 group-hover:gap-2 transition-all">
                  En savoir plus <ChevronRight size={12}/>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

const IslamicBankingSection = () => (
  <section className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
      <div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
          style={{ background: "#D1FAE5", color: "#005F2D" }}>
          ☪️ Finance Islamique
        </div>
        <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6">
          La banque qui respecte{" "}
          <span style={{ color: "#005F2D" }}>vos valeurs</span>
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          Fondée sur les principes de la charia islamique, KT Bank AG interdit absolument
          les intérêts (riba), la spéculation (gharar) et n'investit que dans des secteurs éthiques et licites.
        </p>
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { icon: "🚫", title: "Sans Riba", desc: "Zéro intérêt sur tous nos produits" },
            { icon: "✅", title: "Halal certifié", desc: "Validé par notre Shariah Board" },
            { icon: "🌿", title: "Éthique", desc: "Investissements responsables uniquement" },
            { icon: "🤝", title: "Partage des profits", desc: "Musharaka & Mudaraba" },
          ].map((item) => (
            <div key={item.title} className="p-4 rounded-2xl border border-gray-100 hover:border-green-200 transition-all">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="font-bold text-gray-900 text-sm">{item.title}</div>
              <div className="text-gray-500 text-xs mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
        <Link href="/islamic-banking"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all border-2 hover:bg-green-50"
          style={{ borderColor: "#005F2D", color: "#005F2D" }}>
          En savoir plus <ArrowRight size={16}/>
        </Link>
      </div>
      <div className="relative">
        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80"
            alt="Finance islamique"
            className="w-full h-80 object-cover"
          />
          <div className="p-6" style={{ background: "linear-gradient(135deg, #005F2D, #007A3D)" }}>
            <div className="text-white font-bold text-xl mb-2">Shariah Board Certifié</div>
            <div className="text-green-200 text-sm">Notre conseil garantit que tous nos produits respectent les principes de la charia.</div>
          </div>
        </div>
        <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-2xl p-5 max-w-52">
          <div className="text-3xl mb-2">☪️</div>
          <div className="font-bold text-gray-900 text-sm">100% Halal</div>
          <div className="text-gray-500 text-xs mt-1">Certifié par l'Académie Islamique Fiqh</div>
          <div className="flex mt-2">
            {[1,2,3,4,5].map((i) => <Star key={i} size={12} className="text-yellow-400 fill-yellow-400"/>)}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const NewProductsHighlight = () => (
  <section className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #004020 0%, #005F2D 100%)" }}>
    <div className="absolute inset-0 opacity-5"
      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cpolygon fill='white' points='50,0 100,25 100,75 50,100 0,75 0,25'/%3E%3C/svg%3E\")", backgroundSize: "80px 80px" }}>
    </div>
    <div className="relative max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
          style={{ background: "rgba(201,168,76,0.2)", border: "1px solid rgba(201,168,76,0.4)", color: "#E8C96B" }}>
          ✨ Nouvelles Offres Exclusives
        </div>
        <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
          Des produits qui n'existaient pas.{" "}
          <span style={{ color: "#E8C96B" }}>Maintenant oui.</span>
        </h2>
        <p className="text-green-200 text-lg max-w-2xl mx-auto">
          Nous avons développé des produits islamiques innovants pour répondre à vos besoins.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: "🤲", title: "KT Donation & Zakat", desc: "Calculateur Zakat intégré, dons certifiés, suivi transparent.", href: "/products/donation", color: "#D97706" },
          { icon: "🏢", title: "Crédit Pro & PME", desc: "Musharaka, Mudaraba, Ijara. Financements pour entrepreneurs.", href: "/products/corporate-credit", color: "#E8C96B" },
          { icon: "🌱", title: "KT JugendKonto", desc: "Compte jeunesse halal dès 0 an. Bonus de bienvenue 50€.", href: "/products/youth-savings", color: "#10B981" },
          { icon: "🏠", title: "Financement Immobilier", desc: "Achetez via Murabaha ou Diminishing Musharaka. Sans intérêts.", href: "/products/real-estate", color: "#C9A84C" },
        ].map((item) => (
          <Link key={item.href} href={item.href}>
            <div className="rounded-2xl p-6 h-full transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="font-bold text-xl text-white mb-3">{item.title}</h3>
              <p className="text-green-200 text-sm leading-relaxed mb-4">{item.desc}</p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold" style={{ color: item.color }}>
                Découvrir <ArrowRight size={14}/>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

const StatsSection = () => (
  <section className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { value: "50 000+", label: "Clients satisfaits", icon: "👥", color: "#005F2D" },
          { value: "€2.5B", label: "Actifs gérés", icon: "💰", color: "#C9A84C" },
          { value: "4", label: "Agences en Allemagne", icon: "🏦", color: "#005F2D" },
          { value: "9+", label: "Années d'excellence", icon: "⭐", color: "#C9A84C" },
        ].map((stat) => (
          <div key={stat.label} className="text-center p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all">
            <div className="text-4xl mb-3">{stat.icon}</div>
            <div className="text-4xl font-black mb-2" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-gray-500 text-sm font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const TestimonialsSection = () => (
  <section className="py-24 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
          style={{ background: "#D1FAE5", color: "#005F2D" }}>
          <Heart size={14}/> Témoignages
        </div>
        <h2 className="text-4xl font-black text-gray-900 mb-4">
          Ce que disent nos <span style={{ color: "#005F2D" }}>clients</span>
        </h2>
        <div className="w-20 h-1 mx-auto rounded-full" style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96B)" }}></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {testimonials.map((t) => (
          <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-100">
            <div className="flex gap-1 mb-4">
              {[...Array(t.rating)].map((_, i) => (
                <Star key={i} size={14} className="fill-yellow-400 text-yellow-400"/>
              ))}
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ background: "linear-gradient(135deg, #005F2D, #007A3D)" }}>
                {t.avatar}
              </div>
              <div>
                <div className="font-bold text-sm text-gray-900">{t.name}</div>
                <div className="text-xs text-gray-500">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const WhyUsSection = () => (
  <section className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
          Pourquoi choisir <span style={{ color: "#005F2D" }}>KT Bank ?</span>
        </h2>
        <div className="w-20 h-1 mx-auto rounded-full" style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96B)" }}></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: <Shield className="w-8 h-8" style={{ color: "#005F2D" }}/>, title: "Sécurité maximale", desc: "Régulée par la BaFin, dépôts garantis jusqu'à 100 000€ par l'EDB (Entschädigungseinrichtung deutscher Banken)." },
          { icon: <Globe className="w-8 h-8" style={{ color: "#005F2D" }}/>, title: "100% islamique", desc: "Premier établissement bancaire islamique complet en Allemagne, certifié par un Shariah Board indépendant." },
          { icon: <Zap className="w-8 h-8" style={{ color: "#005F2D" }}/>, title: "Digital & Moderne", desc: "Application mobile intuitive, virements instantanés, onboarding 100% en ligne en moins de 10 minutes." },
        ].map((item) => (
          <div key={item.title} className="text-center p-8 rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all group">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center transition-all group-hover:scale-110"
              style={{ background: "linear-gradient(135deg, #D1FAE5, #A7F3D0)" }}>
              {item.icon}
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-3">{item.title}</h3>
            <p className="text-gray-500 leading-relaxed text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CTASection = () => (
  <section className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #C9A84C 0%, #E8C96B 50%, #C9A84C 100%)" }}>
    <div className="relative max-w-4xl mx-auto px-4 text-center">
      <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
        Prêt à rejoindre KT Bank ?
      </h2>
      <p className="text-yellow-100 text-xl mb-10 leading-relaxed">
        Ouvrez votre compte en 10 minutes. 100% en ligne, 100% halal, 100% gratuit.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link href="/client/register"
          className="flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-white transition-all hover:-translate-y-1 hover:shadow-2xl"
          style={{ background: "linear-gradient(135deg, #005F2D, #007A3D)" }}>
          Créer mon compte <ArrowRight size={18}/>
        </Link>
        <Link href="/contact"
          className="flex items-center gap-2 px-10 py-4 rounded-xl font-bold transition-all hover:-translate-y-1"
          style={{ background: "rgba(255,255,255,0.9)", color: "#005F2D" }}>
          Parler à un conseiller
        </Link>
      </div>
    </div>
  </section>
);

export default function HomePage() {
  return (
    <>
      <HeroSection/>
      <TrustBanner/>
      <ProductsSection/>
      <IslamicBankingSection/>
      <NewProductsHighlight/>
      <StatsSection/>
      <TestimonialsSection/>
      <WhyUsSection/>
      <CTASection/>
    </>
  );
}
