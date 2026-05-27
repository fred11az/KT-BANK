"use client";
import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      {/* Hero */}
      <section className="relative py-24 text-white overflow-hidden"
        style={{ background: "linear-gradient(135deg, #004020 0%, #005F2D 60%, #007A3D 100%)" }}>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-black mb-4">
            Contactez-<span style={{ color: "#E8C96B" }}>nous</span>
          </h1>
          <p className="text-green-200 text-xl max-w-2xl mx-auto">
            Notre équipe est disponible pour répondre à toutes vos questions,
            en allemand, anglais, turc ou arabe.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none"><path d="M0,60 C360,0 1080,60 1440,15 L1440,60 Z" fill="#FAFAFA"/></svg>
        </div>
      </section>

      {/* Contact section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-3 gap-12">
          {/* Info cards */}
          <div className="space-y-6">
            {[
              { icon: <Phone size={22}/>, title: "Téléphone", info: "+49 69 2475 1700", sub: "Lun–Ven: 9h–17h", href: "tel:+4969247517000" },
              { icon: <Mail size={22}/>, title: "Email", info: "info@kt-bank.de", sub: "Réponse sous 24h", href: "mailto:info@kt-bank.de" },
              { icon: <MapPin size={22}/>, title: "Siège Social", info: "Bockenheimer Landstraße 33", sub: "60325 Frankfurt am Main", href: "#" },
              { icon: <Clock size={22}/>, title: "Horaires", info: "Lun–Ven: 9h–17h", sub: "Ven: fermeture à 12h30 (prière)", href: "#" },
            ].map((item) => (
              <a key={item.title} href={item.href}
                className="flex items-start gap-4 bg-white p-5 rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-md transition-all block">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #005F2D, #007A3D)" }}>
                  {item.icon}
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">{item.title}</div>
                  <div className="text-gray-700 font-medium text-sm mt-0.5">{item.info}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{item.sub}</div>
                </div>
              </a>
            ))}

            {/* Social */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100">
              <div className="font-bold text-gray-900 text-sm mb-3">Suivez-nous</div>
              <div className="flex gap-3">
                {["Facebook", "Twitter", "Instagram", "LinkedIn"].map((s) => (
                  <a key={s} href="#"
                    className="px-3 py-1.5 rounded-xl text-xs font-medium border transition-all hover:bg-green-50 hover:border-green-300"
                    style={{ borderColor: "#E5E7EB", color: "#005F2D" }}>
                    {s}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            {sent ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                  style={{ background: "#D1FAE5" }}>
                  <CheckCircle size={40} style={{ color: "#005F2D" }}/>
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Message envoyé !</h2>
                <p className="text-gray-500">Notre équipe vous répondra dans les 24 heures ouvrables.</p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-black text-gray-900 mb-6">Envoyez-nous un message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Nom complet *</label>
                      <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                        placeholder="Ahmed Al-Rashid"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none text-sm focus:border-green-500 transition"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Email *</label>
                      <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                        placeholder="ahmed@email.com"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none text-sm focus:border-green-500 transition"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Téléphone</label>
                      <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                        placeholder="+49 ..."
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none text-sm focus:border-green-500 transition"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Sujet *</label>
                      <select required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none text-sm focus:border-green-500 transition bg-white">
                        <option value="">Choisir...</option>
                        <option>Ouvrir un compte</option>
                        <option>Renseignement produit</option>
                        <option>Problème technique</option>
                        <option>Crédit / Financement</option>
                        <option>Zakat / Donation</option>
                        <option>Réclamation</option>
                        <option>Autre</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Message *</label>
                    <textarea required rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                      placeholder="Comment pouvons-nous vous aider ?"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 outline-none text-sm focus:border-green-500 transition resize-none"
                    />
                  </div>
                  <div className="flex items-start gap-2">
                    <input type="checkbox" required id="gdpr" className="mt-1 w-4 h-4 accent-green-700"/>
                    <label htmlFor="gdpr" className="text-xs text-gray-500 leading-relaxed">
                      J'accepte que mes données soient traitées conformément à la politique de confidentialité de KT Bank AG
                      pour traiter ma demande.
                    </label>
                  </div>
                  <button type="submit"
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
                    style={{ background: "linear-gradient(135deg, #005F2D, #007A3D)" }}>
                    <Send size={18}/> Envoyer mon message
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Quick */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Questions fréquentes</h2>
          <div className="space-y-4">
            {[
              { q: "Comment ouvrir un compte KT Bank ?", a: "Rendez-vous sur notre site, cliquez 'Ouvrir un compte' et suivez les étapes en ligne. L'ouverture prend moins de 10 minutes avec votre carte d'identité." },
              { q: "Les produits KT Bank sont-ils vraiment halal ?", a: "Oui, 100%. Chaque produit est certifié par notre Shariah Board indépendant et est conforme aux normes AAOIFI. Aucun intérêt n'est jamais appliqué." },
              { q: "Mes dépôts sont-ils garantis ?", a: "Oui, vos dépôts sont garantis jusqu'à 100 000€ par client par l'Entschädigungseinrichtung deutscher Banken (EDB), conformément à la loi allemande." },
              { q: "Dans quelle langue puis-je être conseillé ?", a: "Nos conseillers parlent l'allemand, l'anglais, le turc et l'arabe. Contactez-nous dans la langue qui vous convient le mieux." },
            ].map((faq, i) => (
              <details key={i} className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                <summary className="px-6 py-4 font-semibold text-gray-900 cursor-pointer hover:bg-green-50 transition-all">
                  {faq.q}
                </summary>
                <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
