"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, Search } from "lucide-react";
import { products } from "@/lib/utils";

const categories = ["Tous", "Comptes", "Investissement", "Financement", "Épargne", "Cartes", "Solidarité", "Entreprise", "Jeunesse", "Immobilier"];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === "Tous" || p.category === activeCategory;
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      {/* HERO */}
      <section
        className="relative py-24 lg:py-32 text-white overflow-hidden hero-grid"
        style={{ background: "linear-gradient(160deg, var(--green-900) 0%, var(--green-700) 100%)" }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none opacity-10"
          style={{ background: "radial-gradient(circle, var(--gold-300), transparent)", transform: "translate(30%, -30%)" }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="animate-fade-up">
            <span className="section-label" style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", color: "#E8C96B" }}>
              ☪️ Finance islamique — 100% Halal
            </span>
          </div>
          <h1 className="text-display mt-4 mb-4 animate-fade-up delay-100">
            Tous nos produits<br />
            <span className="text-gradient-gold">& services</span>
          </h1>
          <p className="text-body-lg mb-8 animate-fade-up delay-200" style={{ color: "rgba(255,255,255,0.78)" }}>
            Comptes, épargne, financement, cartes — tout sans intérêts (riba), certifié par notre Shariah Board.
          </p>

          {/* SEARCH */}
          <div className="max-w-xl mx-auto relative animate-fade-up delay-300">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--gray-400)" }} />
            <input
              type="text"
              placeholder="Rechercher un produit…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-11 shadow-xl"
              style={{ borderColor: "transparent" }}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-8 mt-10 animate-fade-up delay-400">
            {[{ val: "10", label: "Produits islamiques" }, { val: "50K+", label: "Clients" }, { val: "100%", label: "Halal certifié" }, { val: "BaFin", label: "Agréée" }].map((s) => (
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

      {/* FILTER + GRID */}
      <section className="py-16 lg:py-24" style={{ background: "white" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`btn btn-sm ${activeCategory === cat ? "btn-primary" : "btn-outline"}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-small" style={{ color: "var(--gray-500)" }}>
              {filtered.length} produit{filtered.length !== 1 ? "s" : ""} trouvé{filtered.length !== 1 ? "s" : ""}
            </p>
            {(activeCategory !== "Tous" || searchQuery) && (
              <button onClick={() => { setActiveCategory("Tous"); setSearchQuery(""); }} className="text-small font-medium"
                style={{ color: "var(--green-700)" }}>
                Réinitialiser les filtres
              </button>
            )}
          </div>

          {/* Product grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-subheading mb-2" style={{ color: "var(--gray-700)" }}>Aucun résultat</h3>
              <p className="text-body" style={{ color: "var(--gray-500)" }}>Essayez un autre terme ou réinitialisez les filtres.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((product, i) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="card card-interactive flex flex-col overflow-hidden animate-fade-up"
                  style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}
                >
                  {/* Accent top bar */}
                  <div className="h-1 w-full" style={{ background: product.color }} />

                  <div className="p-5 flex flex-col flex-1">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                        style={{ background: `${product.color}15` }}>
                        {product.icon}
                      </div>
                      <div className="flex gap-1.5">
                        {product.popular && <span className="badge badge-green">Populaire</span>}
                        {(product as any).isNew && <span className="badge badge-new">Nouveau</span>}
                        {!product.popular && !(product as any).isNew && product.badge && (
                          <span className="badge badge-gold">{product.badge}</span>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="mb-3">
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--gray-400)" }}>
                        {product.category}
                      </span>
                      <h3 className="font-black text-base mt-0.5 mb-1" style={{ color: "var(--gray-900)" }}>{product.name}</h3>
                      <p className="text-small" style={{ color: "var(--gray-500)" }}>{product.tagline}</p>
                    </div>

                    {/* Features */}
                    <div className="flex flex-col gap-1.5 flex-1 mb-5">
                      {product.features.map((f) => (
                        <div key={f} className="flex items-center gap-2">
                          <CheckCircle size={12} style={{ color: product.color, flexShrink: 0 }} />
                          <span className="text-xs" style={{ color: "var(--gray-600)" }}>{f}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid var(--gray-100)" }}>
                      <span className="text-small font-semibold" style={{ color: product.color }}>
                        {product.cta}
                      </span>
                      <ArrowRight size={15} style={{ color: product.color }} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="py-14" style={{ background: "var(--gray-50)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { icon: "🛡️", title: "BaFin agréée", sub: "Réglementée en Allemagne" },
              { icon: "☪️", title: "Shariah Board", sub: "Certification indépendante" },
              { icon: "✅", title: "AAOIFI", sub: "Standards internationaux" },
              { icon: "🔒", title: "Dépôts garantis", sub: "Jusqu'à 100 000€" },
            ].map((item) => (
              <div key={item.title} className="card p-5">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-sm mb-1" style={{ color: "var(--gray-900)" }}>{item.title}</h3>
                <p className="text-xs" style={{ color: "var(--gray-500)" }}>{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, var(--gold-500), var(--gold-300))" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-heading mb-4" style={{ color: "white" }}>
            Pas sûr de quel produit choisir ?
          </h2>
          <p className="text-body-lg mb-8" style={{ color: "rgba(255,255,255,0.85)" }}>
            Nos conseillers vous orientent gratuitement. Ouvrez votre compte en 10 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/client/register" className="btn btn-primary btn-xl">
              Ouvrir un compte <ArrowRight size={18} />
            </Link>
            <Link href="/contact" className="btn btn-outline-white btn-xl">
              Parler à un conseiller
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
