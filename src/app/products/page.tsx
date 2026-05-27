"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, ChevronRight, Search, Filter } from "lucide-react";
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
      {/* Hero */}
      <section
        className="relative py-28 text-white overflow-hidden"
        style={{ background: "linear-gradient(135deg, #004020 0%, #005F2D 50%, #007A3D 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cpolygon fill='white' points='50,0 100,25 100,75 50,100 0,75 0,25'/%3E%3C/svg%3E\")",
            backgroundSize: "80px 80px",
          }}
        />
        <div className="absolute top-10 right-20 w-80 h-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #C9A84C, transparent)" }} />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ background: "rgba(201,168,76,0.2)", border: "1px solid rgba(201,168,76,0.4)", color: "#E8C96B" }}
          >
            🌙 Finance Islamique — 100% Halal
          </div>
          <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
            Nos Produits & Services
            <br />
            <span style={{ color: "#E8C96B" }}>Conformes à la Charia</span>
          </h1>
          <p className="text-green-100 text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            Découvrez notre gamme complète de produits financiers islamiques. Comptes, épargne,
            financement, cartes — tout sans intérêts (riba), certifié par notre Shariah Board.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 text-base focus:outline-none focus:ring-2 shadow-xl"
              style={{ focusRingColor: "#C9A84C" }}
            />
          </div>

          {/* Stats band */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            {[
              { val: "10", label: "Produits islamiques" },
              { val: "50K+", label: "Clients satisfaits" },
              { val: "100%", label: "Halal certifié" },
              { val: "BaFin", label: "Réglementé" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-black" style={{ color: "#E8C96B" }}>{s.val}</div>
                <div className="text-green-200 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,60 C360,0 1080,60 1440,20 L1440,60 Z" fill="#F9FAFB" />
          </svg>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-gray-50 sticky top-[104px] z-20 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
            <Filter size={18} className="text-gray-400 flex-shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all"
                style={
                  activeCategory === cat
                    ? { background: "#005F2D", color: "white" }
                    : { background: "white", color: "#374151", border: "1px solid #E5E7EB" }
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-gray-50 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-500 text-sm">
              <span className="font-bold text-gray-900">{filtered.length}</span> produit{filtered.length !== 1 ? "s" : ""} trouvé{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">Aucun produit trouvé</h3>
              <p className="text-gray-500">Essayez un autre terme de recherche ou catégorie.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`} className="group">
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-green-300 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl h-full relative overflow-hidden flex flex-col">
                    <div
                      className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                      style={{ background: `linear-gradient(90deg, ${product.color}, ${product.color}88)` }}
                    />
                    {(product as { isNew?: boolean }).isNew && (
                      <div
                        className="absolute top-4 right-4 px-2 py-0.5 rounded-full text-xs font-bold text-white"
                        style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96B)" }}
                      >
                        Nouveau
                      </div>
                    )}
                    {product.popular && (
                      <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full text-xs font-bold text-white bg-green-600">
                        ⭐ Populaire
                      </div>
                    )}

                    <div className="text-4xl mb-4">{product.icon}</div>
                    <div
                      className="text-xs font-semibold px-3 py-1 rounded-full inline-block mb-3 self-start"
                      style={{ background: `${product.color}15`, color: product.color }}
                    >
                      {product.category}
                    </div>
                    <h3 className="font-black text-lg text-gray-900 mb-2 group-hover:text-green-800 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 leading-relaxed flex-1">{product.tagline}</p>
                    <div className="space-y-1.5 mb-4">
                      {product.features.slice(0, 3).map((feat) => (
                        <div key={feat} className="flex items-center gap-2 text-xs text-gray-600">
                          <CheckCircle size={12} className="text-green-500 flex-shrink-0" />
                          {feat}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                      <span
                        className="text-xs font-bold px-3 py-1 rounded-full"
                        style={{ background: `${product.color}10`, color: product.color }}
                      >
                        {product.badge}
                      </span>
                      <span className="text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: "#005F2D" }}>
                        En savoir plus <ChevronRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20"
        style={{ background: "linear-gradient(135deg, #004020, #005F2D)" }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-white mb-4">
            Vous ne savez pas quel produit choisir ?
          </h2>
          <p className="text-green-200 text-lg mb-8">
            Nos conseillers islamiques sont disponibles pour vous guider vers la solution adaptée.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/client/register"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all hover:-translate-y-1 hover:shadow-2xl"
              style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96B)", boxShadow: "0 8px 30px rgba(201,168,76,0.4)" }}
            >
              Ouvrir un compte gratuit <ArrowRight size={18} />
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all"
              style={{ border: "2px solid rgba(255,255,255,0.5)", color: "white" }}
            >
              Contacter un conseiller
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
