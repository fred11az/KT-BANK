"use client";
import { MapPin, Phone, Clock, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { branches } from "@/lib/utils";

export default function BranchesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-24 text-white overflow-hidden"
        style={{ background: "linear-gradient(135deg, #004020 0%, #005F2D 60%, #007A3D 100%)" }}>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="text-5xl mb-6">🏦</div>
          <h1 className="text-5xl font-black mb-4">
            Nos <span style={{ color: "#E8C96B" }}>Agences</span>
          </h1>
          <p className="text-green-200 text-xl max-w-2xl mx-auto">
            4 agences en Allemagne pour vous accueillir. Des conseillers dédiés parlant
            l'allemand, l'anglais, le turc et l'arabe.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none"><path d="M0,60 C360,0 1080,60 1440,15 L1440,60 Z" fill="#FAFAFA"/></svg>
        </div>
      </section>

      {/* Branches Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {branches.map((branch) => (
              <div key={branch.city} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
                <img src={branch.image} alt={branch.city} className="w-full h-52 object-cover"/>
                <div className="p-6">
                  <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                    🏦 {branch.city}
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 text-gray-600">
                      <MapPin size={16} style={{ color: "#005F2D" }} className="mt-0.5 flex-shrink-0"/>
                      <span className="text-sm">{branch.address}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Phone size={16} style={{ color: "#005F2D" }}/>
                      <a href={`tel:${branch.phone.replace(/\s/g, "")}`} className="text-sm hover:text-green-700 transition">{branch.phone}</a>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Clock size={16} style={{ color: "#005F2D" }}/>
                      <span className="text-sm">{branch.hours}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Mail size={16} style={{ color: "#005F2D" }}/>
                      <a href={`mailto:${branch.city.toLowerCase()}@kt-bank.de`}
                        className="text-sm hover:text-green-700 transition">
                        {branch.city.toLowerCase()}@kt-bank.de
                      </a>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100 flex gap-3">
                    <a href={`https://maps.google.com/?q=${encodeURIComponent(branch.address)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex-1 text-center py-2 px-4 rounded-xl text-sm font-medium border-2 transition-all hover:bg-green-50"
                      style={{ borderColor: "#005F2D", color: "#005F2D" }}>
                      📍 Voir sur Maps
                    </a>
                    <Link href="/contact"
                      className="flex-1 text-center py-2 px-4 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
                      style={{ background: "linear-gradient(135deg, #005F2D, #007A3D)" }}>
                      Prendre RDV
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services in branch */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-4">Services disponibles en agence</h2>
            <div className="w-20 h-1 mx-auto rounded-full" style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96B)" }}></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "💳", label: "Ouverture de compte" },
              { icon: "🏠", label: "Conseil immobilier" },
              { icon: "🚗", label: "Financement auto" },
              { icon: "📈", label: "Conseil investissement" },
              { icon: "🤲", label: "Conseil Zakat" },
              { icon: "🏢", label: "Crédit entreprise" },
              { icon: "📱", label: "Assistance app mobile" },
              { icon: "🌱", label: "Compte jeunesse" },
            ].map((s) => (
              <div key={s.label} className="p-5 rounded-2xl border border-gray-100 text-center hover:border-green-200 hover:shadow-md transition-all">
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-sm font-medium text-gray-700">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages */}
      <section className="py-16" style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96B)" }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-white mb-4">Nous parlons votre langue</h2>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {[
              { flag: "🇩🇪", lang: "Deutsch" },
              { flag: "🇬🇧", lang: "English" },
              { flag: "🇹🇷", lang: "Türkçe" },
              { flag: "🇸🇦", lang: "العربية" },
            ].map((l) => (
              <div key={l.lang} className="px-6 py-3 rounded-full bg-white/20 text-white font-semibold flex items-center gap-2">
                <span className="text-2xl">{l.flag}</span> {l.lang}
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all hover:-translate-y-1"
              style={{ background: "linear-gradient(135deg, #005F2D, #007A3D)" }}>
              Prendre rendez-vous <ArrowRight size={18}/>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
