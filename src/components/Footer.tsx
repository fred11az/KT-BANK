import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="text-white" style={{ background: "linear-gradient(180deg, #004020 0%, #002010 100%)" }}>
      {/* Newsletter */}
      <div style={{ background: "linear-gradient(135deg, #005F2D, #007A3D)" }} className="py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-white">Restez informé</h3>
            <p className="text-green-200 mt-1">Recevez nos dernières offres et actualités islamiques</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 md:w-72 px-4 py-3 rounded-xl text-gray-800 text-sm outline-none focus:ring-2 ring-yellow-400"
            />
            <button className="px-6 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #C9A84C, #E8C96B)" }}>
              S'inscrire
            </button>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl bg-white/20">
                KT
              </div>
              <div>
                <div className="font-bold text-xl">KT Bank AG</div>
                <div className="text-green-300 text-sm">Meine Werte, meine Bank.</div>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              KT Bank AG est la première banque islamique d'Allemagne, filiale de Kuveyt Türk.
              Nous offrons des produits financiers conformes à la charia depuis 2015, régulés par la BaFin.
            </p>
            <div className="flex gap-3">
              {["f", "t", "ig", "in", "yt"].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all hover:-translate-y-1 text-white text-xs font-bold">
                  {Icon.toUpperCase()}
                </a>
              ))}
            </div>

            {/* Certifications */}
            <div className="mt-6 flex flex-wrap gap-2">
              {["BaFin Régulée", "Dépôts Garantis", "Certifié Halal", "ISO 27001"].map((cert) => (
                <span key={cert} className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-green-200 border border-white/10">
                  ✓ {cert}
                </span>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Produits</h4>
            <ul className="space-y-2">
              {[
                { label: "KT GiroKonto", href: "/products/giro-konto" },
                { label: "KT GoldKonto", href: "/products/gold-konto" },
                { label: "KT Jetzz Card", href: "/products/jetzz-card" },
                { label: "Financement Auto", href: "/products/vehicle-financing" },
                { label: "Crédit Personnel", href: "/products/personal-loans" },
                { label: "KT FestgeldKonto", href: "/products/festgeld-konto" },
                { label: "🤲 Donation & Zakat", href: "/products/donation" },
                { label: "🏢 Crédit Pro & PME", href: "/products/corporate-credit" },
                { label: "🌱 KT JugendKonto", href: "/products/youth-savings" },
                { label: "🏠 Financement Immobilier", href: "/products/real-estate" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-gray-300 hover:text-white text-sm transition-colors hover:translate-x-1 inline-block">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">La Banque</h4>
            <ul className="space-y-2">
              {[
                { label: "À propos de nous", href: "/about" },
                { label: "Finance islamique", href: "/islamic-banking" },
                { label: "Entreprises", href: "/corporate" },
                { label: "Nos agences", href: "/branches" },
                { label: "Carrières", href: "/careers" },
                { label: "Presse", href: "/press" },
                { label: "Blog & Actualités", href: "/blog" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-gray-300 hover:text-white text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-gray-300 text-sm">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-green-400"/>
                <span>Bockenheimer Landstraße 33<br/>60325 Frankfurt am Main</span>
              </li>
              <li className="flex items-center gap-2 text-gray-300 text-sm">
                <Phone size={16} className="text-green-400"/>
                <a href="tel:+4969247517000" className="hover:text-white transition">+49 69 2475 1700</a>
              </li>
              <li className="flex items-center gap-2 text-gray-300 text-sm">
                <Mail size={16} className="text-green-400"/>
                <a href="mailto:info@kt-bank.de" className="hover:text-white transition">info@kt-bank.de</a>
              </li>
            </ul>

            <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xs text-green-300 font-medium mb-1">Service client</div>
              <div className="text-white font-bold">Lun–Ven: 9h–17h</div>
              <div className="text-gray-300 text-xs mt-1">Assistance disponible en DE, EN, TR, AR</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-400 text-xs">
            © 2024 KT Bank AG. Tous droits réservés. Régulée par la BaFin (Bundesanstalt für Finanzdienstleistungsaufsicht).
          </div>
          <div className="flex flex-wrap gap-4">
            {["Mentions légales", "Politique de confidentialité", "CGU", "Cookies", "Imprint"].map((link) => (
              <a key={link} href="#" className="text-gray-400 hover:text-white text-xs transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
