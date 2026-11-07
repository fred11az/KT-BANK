"use client";
import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { CheckCircle, Gift, Clock, ArrowRight, Mail } from "lucide-react";

export default function OffreFinancementPage() {
  const { t } = useLanguage();
  const fr = t.lang !== "de"; // same fr-or-other vs de convention used elsewhere (e.g. Familienhilfe)

  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [apiError, setApiError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setApiError("");
    try {
      const res = await fetch("/api/kt/offers/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offer: "financing", prenom, nom, email, telephone, message, lang: t.lang }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setApiError(fr ? "Une erreur est survenue. Réessayez ou écrivez-nous directement." : "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section
        className="relative pt-28 pb-24 text-white overflow-hidden hero-grid"
        style={{ background: "linear-gradient(135deg, var(--green-900) 0%, var(--green-700) 60%, #007A3D 100%)" }}
      >
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <span className="section-label" style={{ background: "rgba(201,146,26,0.2)", border: "1px solid rgba(201,146,26,0.4)", color: "var(--gold-200)" }}>
            <Gift size={14} className="inline mr-1" /> {fr ? "Offre de fin d'année 2026 / début 2027" : "Jahresend-Angebot 2026 / Anfang 2027"}
          </span>
          <h1 className="text-display text-white mt-4 mb-6">
            {fr ? "Financement sans intérêt" : "Zinsfreie Finanzierung"}
          </h1>
          <p className="text-body-lg mb-8" style={{ color: "rgba(255,255,255,0.85)" }}>
            {fr
              ? "Une offre spéciale pour bien terminer l'année et démarrer 2027 sereinement. Les conditions détaillées seront communiquées très prochainement."
              : "Ein besonderes Angebot, um das Jahr gut abzuschließen und entspannt in 2027 zu starten. Die genauen Konditionen werden in Kürze bekannt gegeben."}
          </p>
          <div className="flex items-center justify-center gap-2 text-sm font-semibold" style={{ color: "var(--gold-200)" }}>
            <Clock size={16} /> {fr ? "Détails à venir — inscrivez-vous pour être recontacté en priorité" : "Details folgen — tragen Sie sich ein, um vorrangig kontaktiert zu werden"}
          </div>
        </div>
      </section>

      <section className="py-20" style={{ background: "var(--gray-50)" }}>
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          {sent ? (
            <div className="card p-10 text-center">
              <CheckCircle size={48} style={{ color: "var(--green-600)" }} className="mx-auto mb-4" />
              <h2 className="font-bold text-xl mb-2" style={{ color: "var(--gray-900)" }}>
                {fr ? "Demande envoyée !" : "Anfrage gesendet!"}
              </h2>
              <p className="text-body" style={{ color: "var(--gray-500)" }}>
                {fr
                  ? "Nous vous recontacterons dès que les conditions détaillées de l'offre seront disponibles."
                  : "Wir melden uns, sobald die genauen Konditionen des Angebots verfügbar sind."}
              </p>
              <Link href="/products" className="btn btn-outline btn-lg mt-8 inline-flex items-center gap-2">
                {fr ? "Voir tous nos produits" : "Alle Produkte ansehen"} <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card p-8 space-y-4">
              <h2 className="font-bold text-lg mb-2" style={{ color: "var(--gray-900)" }}>
                {fr ? "Être recontacté en priorité" : "Vorrangig kontaktiert werden"}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <input required placeholder={fr ? "Prénom" : "Vorname"} value={prenom} onChange={(e) => setPrenom(e.target.value)} className="input" />
                <input required placeholder={fr ? "Nom" : "Nachname"} value={nom} onChange={(e) => setNom(e.target.value)} className="input" />
              </div>
              <input required type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
              <input type="tel" placeholder={fr ? "Téléphone (optionnel)" : "Telefon (optional)"} value={telephone} onChange={(e) => setTelephone(e.target.value)} className="input" />
              <textarea placeholder={fr ? "Votre message (optionnel)" : "Ihre Nachricht (optional)"} value={message} onChange={(e) => setMessage(e.target.value)} className="input" rows={3} />
              {apiError && <p className="text-small" style={{ color: "#DC2626" }}>{apiError}</p>}
              <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full flex items-center justify-center gap-2">
                <Mail size={16} /> {loading ? (fr ? "Envoi…" : "Senden…") : fr ? "Envoyer ma demande" : "Anfrage senden"}
              </button>
              <p className="text-small text-center" style={{ color: "var(--gray-400)" }}>
                {fr ? "Aucun engagement. Vos données ne servent qu'à vous recontacter." : "Unverbindlich. Ihre Daten dienen nur zur Kontaktaufnahme."}
              </p>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
