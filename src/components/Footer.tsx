"use client";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

const LINKS = {
  Produits: [
    { label: "KT GiroKonto",          href: "/products/giro-konto" },
    { label: "KT GoldKonto",           href: "/products/gold-konto" },
    { label: "KT Jetzz Card",          href: "/products/jetzz-card" },
    { label: "Crédit Personnel",       href: "/products/personal-loans" },
    { label: "Financement Auto",       href: "/products/vehicle-financing" },
    { label: "KT FestgeldKonto",       href: "/products/festgeld-konto" },
    { label: "🤲 Donation & Zakat",    href: "/products/donation" },
    { label: "🏢 Crédit Pro & PME",    href: "/products/corporate-credit" },
    { label: "🌱 KT JugendKonto",      href: "/products/youth-savings" },
    { label: "🏠 Financement Immo.",   href: "/products/real-estate" },
  ],
  "La Banque": [
    { label: "À propos",               href: "/about" },
    { label: "Finance islamique",      href: "/islamic-banking" },
    { label: "Entreprises",            href: "/corporate" },
    { label: "Nos agences",            href: "/branches" },
    { label: "Contact",                href: "/contact" },
    { label: "Carrières",              href: "/careers" },
  ],
};

export default function Footer() {
  return (
    <footer style={{ background: "var(--green-900)" }}>
      {/* Newsletter */}
      <div className="border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Restez informé</h3>
              <p className="text-small" style={{ color: "rgba(255,255,255,0.55)" }}>
                Offres, actualités et conseils en finance islamique.
              </p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input type="email" placeholder="votre@email.com"
                className="input flex-1 md:w-72 text-sm"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "white" }}/>
              <button className="btn btn-gold flex-shrink-0">S'inscrire</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-black"
                style={{ background: "rgba(255,255,255,0.15)" }}>KT</div>
              <div>
                <div className="font-bold text-sm text-white">KT Bank AG</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>Meine Werte, meine Bank.</div>
              </div>
            </Link>
            <p className="text-xs leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.5)" }}>
              Première banque islamique agréée en Allemagne depuis 2015. Filiale de Kuveyt Türk, régulée BaFin.
            </p>
            <div className="flex flex-wrap gap-2">
              {["BaFin", "Halal", "ISO 27001", "AAOIFI"].map(c => (
                <span key={c} className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  ✓ {c}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title} className="col-span-1">
              <h4 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-xs transition-colors"
                      style={{ color: "rgba(255,255,255,0.55)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="mt-0.5 flex-shrink-0" style={{ color: "var(--green-400)" }}/>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
                  Bockenheimer Landstraße 33<br/>60325 Frankfurt am Main
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={14} className="flex-shrink-0" style={{ color: "var(--green-400)" }}/>
                <a href="tel:+4969247517000" className="text-xs transition-colors"
                  style={{ color: "rgba(255,255,255,0.55)" }}>
                  +49 69 2475 1700
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={14} className="flex-shrink-0" style={{ color: "var(--green-400)" }}/>
                <a href="mailto:info@kt-bank.de" className="text-xs transition-colors"
                  style={{ color: "rgba(255,255,255,0.55)" }}>
                  info@kt-bank.de
                </a>
              </li>
            </ul>

            <div className="mt-5 p-3.5 rounded-xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="text-xs font-semibold text-white mb-0.5">Lun–Ven : 9 h – 17 h</div>
              <div className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                Conseil en DE · EN · TR · AR
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
            © 2024 KT Bank AG · Régulée par la BaFin (Bundesanstalt für Finanzdienstleistungsaufsicht).
          </p>
          <div className="flex flex-wrap gap-4">
            {["Mentions légales", "Confidentialité", "CGU", "Cookies", "Imprint"].map(l => (
              <a key={l} href="#" className="text-xs transition-colors"
                style={{ color: "rgba(255,255,255,0.35)" }}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
