"use client";
import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  CheckCircle, Clock, Shield, Users, Phone, Euro,
  Lock, ArrowRight, FileText, Building2, AlertCircle, Mail,
} from "lucide-react";

export default function FamilienhilfePage() {
  const { t } = useLanguage();
  const de = t.lang !== "fr";

  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [situation, setSituation] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [apiError, setApiError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setApiError("");
    try {
      const res = await fetch("/api/kt/familienhilfe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prenom, nom, email, telephone, situation }),
      });
      if (res.ok) { setSent(true); }
      else { setApiError(de ? "Fehler beim Senden. Bitte erneut versuchen." : "Erreur lors de l'envoi. Veuillez réessayer."); }
    } catch {
      setApiError(de ? "Netzwerkfehler." : "Erreur réseau.");
    }
    setLoading(false);
  }

  const canSubmit = prenom.trim() && nom.trim() && email.trim() && telephone.trim() && situation.trim();

  return (
    <>
      {/* ── Hero ── */}
      <section style={{
        background: "linear-gradient(150deg, #002d15 0%, #005F2D 55%, #006832 100%)",
        padding: "72px 24px 80px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 20% 80%, rgba(255,255,255,0.04) 0%, transparent 55%), radial-gradient(ellipse at 80% 15%, rgba(255,255,255,0.06) 0%, transparent 50%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 700, margin: "0 auto", position: "relative" }}>
          {/* BaFin badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.22)", borderRadius: 999, padding: "6px 18px", marginBottom: 28 }}>
            <Shield size={13} color="#86efac" />
            <span style={{ color: "#86efac", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {de ? "BaFin-reguliertes Förderprogramm" : "Programme réglementé par la BaFin"}
            </span>
          </div>

          <h1 style={{ color: "white", fontWeight: 900, fontSize: "clamp(1.9rem, 5.5vw, 3.4rem)", lineHeight: 1.1, margin: "0 0 14px" }}>
            {de ? "Familienförderung" : "Aide aux familles"}
            <br />
            <span style={{ color: "#86efac" }}>KT Bank AG</span>
          </h1>

          {/* Amount pill */}
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 20, padding: "20px 48px", margin: "24px 0 28px" }}>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.78rem", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.12em" }}>
              {de ? "Bis zu" : "Jusqu'à"}
            </p>
            <p style={{ color: "white", fontWeight: 900, fontSize: "clamp(2.8rem, 8vw, 4.2rem)", margin: 0, lineHeight: 1, letterSpacing: "-0.03em" }}>
              250.000 €
            </p>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.78rem", margin: "6px 0 0" }}>
              {de ? "finanzielle Unterstützung" : "d'aide financière"}
            </p>
          </div>

          <p style={{ color: "rgba(255,255,255,0.82)", fontSize: "1rem", lineHeight: 1.75, margin: "0 0 32px", maxWidth: 540, marginLeft: "auto", marginRight: "auto" }}>
            {de
              ? "KT Bank AG unterstützt Familien in finanzieller Not im Rahmen ihrer sozialen Hilfsmission – transparent, vertraulich und mit schneller Bearbeitung."
              : "KT Bank AG soutient les familles en difficulté financière dans le cadre de sa mission sociale – de manière transparente, confidentielle et avec un traitement rapide."
            }
          </p>

          {/* KPIs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 36 }}>
            {[
              { Icon: Clock, value: "24 h", label: de ? "Antwortzeit" : "Délai de réponse" },
              { Icon: Shield, value: "100 %", label: de ? "Vertraulich" : "Confidentiel" },
              { Icon: CheckCircle, value: "BaFin", label: de ? "Reguliert" : "Régulé" },
            ].map(({ Icon, value, label }) => (
              <div key={value} style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 12, padding: "12px 20px" }}>
                <Icon size={15} color="#86efac" />
                <div style={{ textAlign: "left" }}>
                  <p style={{ color: "white", fontWeight: 800, fontSize: "0.95rem", margin: 0 }}>{value}</p>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.7rem", margin: 0 }}>{label}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#antrag" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 32px", background: "white", color: "#005F2D", borderRadius: 999, fontWeight: 700, fontSize: "0.98rem", textDecoration: "none" }}>
              {de ? "Jetzt bewerben" : "Faire une demande"}
              <ArrowRight size={17} />
            </a>
            <a href="#programme" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 28px", background: "rgba(255,255,255,0.1)", color: "white", borderRadius: 999, fontWeight: 600, fontSize: "0.98rem", textDecoration: "none", border: "1px solid rgba(255,255,255,0.22)" }}>
              {de ? "Mehr erfahren" : "En savoir plus"}
            </a>
          </div>
        </div>
      </section>

      {/* ── Hero image ── */}
      <div style={{ position: "relative", height: 280, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1400&q=80"
          alt={de ? "Familie" : "Famille"}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 35%" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,95,45,0.25) 0%, rgba(255,255,255,0.1) 100%)" }} />
      </div>

      {/* ── Programme overview ── */}
      <section id="programme" style={{ background: "white", padding: "72px 24px" }}>
        <div style={{ maxWidth: 840, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ color: "#005F2D", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.13em", display: "block", marginBottom: 12 }}>
              {de ? "Über das Programm" : "À propos du programme"}
            </span>
            <h2 style={{ color: "#111827", fontWeight: 800, fontSize: "clamp(1.5rem, 4vw, 2.1rem)", margin: "0 0 16px", lineHeight: 1.2 }}>
              {de ? "Prioritätsfonds für Familien in finanzieller Not" : "Fonds prioritaire pour les familles en difficulté financière"}
            </h2>
            <p style={{ color: "#6b7280", fontSize: "0.97rem", lineHeight: 1.75, maxWidth: 620, margin: "0 auto" }}>
              {de
                ? "Im Rahmen ihrer sozialen Hilfsmission in Deutschland hat die KT Bank AG einen Prioritätsfonds eingerichtet, der Familien in finanzieller Notlage schnell und unkompliziert Unterstützung bietet."
                : "Dans le cadre de sa mission d'aide sociale en Allemagne, KT Bank AG a mis en place un fonds prioritaire qui offre une aide rapide et simple aux familles en difficulté financière."
              }
            </p>
          </div>

          {/* Official letter box */}
          <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderLeft: "4px solid #005F2D", borderRadius: 16, padding: "28px 32px", marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <FileText size={17} color="#005F2D" />
              <p style={{ color: "#005F2D", fontWeight: 700, fontSize: "0.82rem", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {de ? "Offizielles Schreiben · KT Bank AG" : "Courrier officiel · KT Bank AG"}
              </p>
            </div>
            <p style={{ color: "#374151", fontSize: "0.92rem", lineHeight: 1.8, fontWeight: 600, margin: "0 0 12px" }}>
              Betreff: Dringendes Familienförderprogramm — KT Bank AG
            </p>
            <p style={{ color: "#4b5563", fontSize: "0.91rem", lineHeight: 1.8, margin: "0 0 14px" }}>
              {de ? "Hallo," : "Bonjour,"}
            </p>
            <p style={{ color: "#4b5563", fontSize: "0.91rem", lineHeight: 1.8, margin: "0 0 14px" }}>
              {de
                ? "im Rahmen unserer sozialen Hilfsmission in Deutschland hat die KT Bank AG einen Prioritätsfonds für Familien in finanzieller Not eingerichtet."
                : "dans le cadre de notre mission d'aide sociale en Allemagne, KT Bank AG a mis en place un fonds prioritaire pour les familles en difficulté financière."
              }
            </p>
            <p style={{ color: "#4b5563", fontSize: "0.91rem", lineHeight: 1.8, margin: "0 0 14px" }}>
              {de
                ? "Dieses Programm ermöglicht den Zugang zu finanzieller Unterstützung in Höhe von bis zu 250.000 €, vorausgesetzt eine schnelle Überprüfung Ihrer Situation."
                : "Ce programme permet d'accéder à une aide financière allant jusqu'à 250 000 €, sous réserve d'une vérification rapide de votre situation."
              }
            </p>
            <p style={{ color: "#111827", fontWeight: 700, fontSize: "0.91rem", margin: "0 0 8px" }}>
              {de ? "Warum sollten Sie sich melden?" : "Pourquoi nous contacter ?"}
            </p>
            <ul style={{ color: "#4b5563", fontSize: "0.91rem", lineHeight: 2, paddingLeft: 20, margin: "0 0 14px" }}>
              <li>{de ? "Unmittelbare Hilfe für familiäre Bedürfnisse." : "Aide immédiate pour les besoins familiaux."}</li>
              <li>{de ? "Verfügbare Beträge für eine begrenzte Zeit." : "Montants disponibles pour une durée limitée."}</li>
            </ul>
            <p style={{ color: "#6b7280", fontSize: "0.85rem", fontStyle: "italic", margin: 0 }}>
              {de ? "Mit freundlichen Grüßen, Das Sozialhilfeteam der KT Bank AG" : "Cordialement, L'équipe d'aide sociale de KT Bank AG"}
            </p>
          </div>

          {/* Why apply — 3 cards */}
          <h3 style={{ color: "#111827", fontWeight: 800, fontSize: "1.2rem", margin: "0 0 24px" }}>
            {de ? "Warum sich melden?" : "Pourquoi faire une demande ?"}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {[
              {
                Icon: Clock,
                title: de ? "Schnelle Bearbeitung" : "Traitement rapide",
                desc: de ? "Unser Team meldet sich innerhalb von 24 Stunden bei Ihnen, um Ihren Antrag zu besprechen." : "Notre équipe vous contacte dans les 24 heures pour discuter de votre dossier.",
              },
              {
                Icon: Lock,
                title: de ? "100 % Vertraulich" : "100 % Confidentiel",
                desc: de ? "Alle persönlichen Daten werden gemäß DSGVO streng vertraulich behandelt." : "Toutes les données personnelles sont traitées de manière strictement confidentielle conformément au RGPD.",
              },
              {
                Icon: Users,
                title: de ? "Individuell geprüft" : "Étude individuelle",
                desc: de ? "Jeder Antrag wird persönlich und ohne Vorurteile geprüft — unabhängig von Herkunft oder Religion." : "Chaque dossier est étudié personnellement, sans préjugé, quelle que soit l'origine ou la religion.",
              },
            ].map(({ Icon, title, desc }) => (
              <div key={title} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 16, padding: "24px" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(0,95,45,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                  <Icon size={20} color="#005F2D" />
                </div>
                <p style={{ color: "#111827", fontWeight: 700, fontSize: "0.95rem", margin: "0 0 8px" }}>{title}</p>
                <p style={{ color: "#6b7280", fontSize: "0.85rem", lineHeight: 1.65, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Image break ── */}
      <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=1400&q=80"
          alt={de ? "Beratung" : "Conseil"}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 45%" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,95,45,0.5)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <p style={{ color: "white", fontWeight: 700, fontSize: "clamp(1rem, 3vw, 1.5rem)", textAlign: "center", maxWidth: 560, lineHeight: 1.5, margin: 0 }}>
            {de
              ? "„Jede Familie verdient eine zweite Chance. Wir sind hier, um zu helfen.“"
              : "« Chaque famille mérite une seconde chance. Nous sommes là pour aider. »"
            }
          </p>
        </div>
      </div>

      {/* ── Eligibility ── */}
      <section style={{ background: "#F2EDE4", padding: "72px 24px" }}>
        <div style={{ maxWidth: 840, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <span style={{ color: "#005F2D", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.13em", display: "block", marginBottom: 12 }}>
              {de ? "Förderbedingungen" : "Conditions d'éligibilité"}
            </span>
            <h2 style={{ color: "#111827", fontWeight: 800, fontSize: "clamp(1.4rem, 4vw, 2rem)", margin: "0 0 12px" }}>
              {de ? "Wer ist förderberechtigt?" : "Qui peut en bénéficier ?"}
            </h2>
            <p style={{ color: "#6b7280", fontSize: "0.97rem", lineHeight: 1.75 }}>
              {de
                ? "Das Programm steht allen Familien mit Wohnsitz in Deutschland offen, die sich in einer nachgewiesenen finanziellen Notlage befinden."
                : "Le programme est ouvert à toutes les familles résidant en Allemagne qui se trouvent dans une situation de détresse financière avérée."
              }
            </p>
          </div>

          <div style={{ background: "white", borderRadius: 16, border: "1px solid #e5e7eb", overflow: "hidden", marginBottom: 24 }}>
            {[
              de ? "Wohnsitz in Deutschland" : "Résidence en Allemagne",
              de ? "Nachgewiesene finanzielle Notlage (Einkommenssituation, Schulden, Arbeitslosigkeit u.a.)" : "Situation de détresse financière avérée (revenus, dettes, chômage, etc.)",
              de ? "Vollständige Identitätsprüfung (KYC/AML-konform)" : "Vérification d'identité complète (conforme KYC/AML)",
              de ? "Zustimmung zur Datenverarbeitung gemäß DSGVO" : "Consentement au traitement des données conformément au RGPD",
              de ? "Kein laufendes Privatinsolvenzverfahren" : "Aucune procédure de faillite personnelle en cours",
              de ? "Vollständig ausgefüllter Antrag mit klarer Situationsbeschreibung" : "Dossier complet avec description claire de la situation",
            ].map((item, i, arr) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 24px", borderBottom: i < arr.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                <CheckCircle size={17} color="#005F2D" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ color: "#374151", fontSize: "0.92rem", lineHeight: 1.5, margin: 0 }}>{item}</p>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 12, padding: "16px 20px", display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 20 }}>
            <AlertCircle size={18} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ color: "#374151", fontSize: "0.85rem", lineHeight: 1.65, margin: 0 }}>
              {de
                ? "Die Genehmigung eines Antrags hängt von der individuellen Prüfung der Situation ab und ist nicht garantiert. KT Bank AG behält sich das Recht vor, Anträge nach eigener Entscheidung abzulehnen."
                : "L'approbation d'une demande dépend de l'étude individuelle de chaque situation et n'est pas garantie. KT Bank AG se réserve le droit de rejeter des dossiers à sa discrétion."
              }
            </p>
          </div>

          {/* BaFin regulatory notice */}
          <div style={{ background: "rgba(0,95,45,0.06)", border: "1px solid rgba(0,95,45,0.2)", borderRadius: 12, padding: "18px 22px", display: "flex", gap: 14, alignItems: "flex-start" }}>
            <Building2 size={20} color="#005F2D" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <p style={{ color: "#005F2D", fontWeight: 700, fontSize: "0.85rem", margin: "0 0 5px" }}>
                {de ? "Regulatorische Information (BaFin)" : "Information réglementaire (BaFin)"}
              </p>
              <p style={{ color: "#374151", fontSize: "0.83rem", lineHeight: 1.65, margin: 0 }}>
                {de
                  ? "KT Bank AG steht unter der Aufsicht der Bundesanstalt für Finanzdienstleistungsaufsicht (BaFin) und der Deutschen Bundesbank. Alle Förderentscheidungen entsprechen den geltenden Anforderungen des Kreditwesengesetzes (KWG) sowie den DSGVO-Datenschutzvorschriften. Gläubigerrechte und AML-Verpflichtungen werden vollständig eingehalten."
                  : "KT Bank AG est sous la supervision de la Bundesanstalt für Finanzdienstleistungsaufsicht (BaFin) et de la Deutsche Bundesbank. Toutes les décisions respectent les exigences de la loi bancaire allemande (KWG) ainsi que les dispositions de protection des données RGPD. Les droits des créanciers et les obligations AML sont pleinement respectés."
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Application form ── */}
      <section id="antrag" style={{ background: "white", padding: "72px 24px" }}>
        <div style={{ maxWidth: 580, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <span style={{ color: "#005F2D", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.13em", display: "block", marginBottom: 12 }}>
              {de ? "Antrag stellen" : "Déposer un dossier"}
            </span>
            <h2 style={{ color: "#111827", fontWeight: 800, fontSize: "clamp(1.4rem, 4vw, 2rem)", margin: "0 0 12px" }}>
              {de ? "Starten Sie Ihren Antrag" : "Déposez votre demande"}
            </h2>
            <p style={{ color: "#6b7280", fontSize: "0.97rem", lineHeight: 1.75 }}>
              {de
                ? "Füllen Sie das Formular aus. Unser Team nimmt innerhalb von 24 Stunden Kontakt auf, um Ihren Antrag zu besprechen."
                : "Remplissez le formulaire. Notre équipe vous contactera dans les 24 heures pour étudier votre dossier."
              }
            </p>
          </div>

          {sent ? (
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 20, padding: "52px 32px", textAlign: "center" }}>
              <div style={{ width: 68, height: 68, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 22px" }}>
                <CheckCircle size={34} color="#005F2D" />
              </div>
              <h3 style={{ color: "#111827", fontWeight: 800, fontSize: "1.35rem", margin: "0 0 12px" }}>
                {de ? "Antrag erfolgreich eingereicht!" : "Demande envoyée avec succès !"}
              </h3>
              <p style={{ color: "#374151", fontSize: "0.95rem", lineHeight: 1.7, margin: "0 0 8px" }}>
                {de
                  ? `Vielen Dank, ${prenom}. Ihr Antrag wurde an unser Sozialhilfeteam weitergeleitet. Wir melden uns innerhalb von 24 Stunden bei Ihnen.`
                  : `Merci, ${prenom}. Votre demande a été transmise à notre équipe sociale. Nous vous recontacterons dans les 24 heures.`
                }
              </p>
              <p style={{ color: "#6b7280", fontSize: "0.85rem", margin: "0 0 28px" }}>
                {de ? "Kontakt: support@kt-bank-ag.com" : "Contact : support@kt-bank-ag.com"}
              </p>
              <Link href="/client/register" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", background: "#005F2D", color: "white", borderRadius: 999, fontWeight: 700, fontSize: "0.95rem", textDecoration: "none" }}>
                {de ? "Jetzt Konto eröffnen" : "Ouvrir un compte"}
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 20, padding: "36px 32px" }}>
              {/* Name row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                <div>
                  <label style={{ display: "block", color: "#374151", fontSize: "0.82rem", fontWeight: 600, marginBottom: 6 }}>
                    {de ? "Vorname *" : "Prénom *"}
                  </label>
                  <input
                    type="text" required value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder={de ? "Max" : "Jean"}
                    style={{ width: "100%", height: 48, background: "white", border: "1px solid #d1d5db", borderRadius: 10, color: "#111827", fontSize: "0.95rem", padding: "0 14px", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", color: "#374151", fontSize: "0.82rem", fontWeight: 600, marginBottom: 6 }}>
                    {de ? "Nachname *" : "Nom *"}
                  </label>
                  <input
                    type="text" required value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder={de ? "Mustermann" : "Dupont"}
                    style={{ width: "100%", height: 48, background: "white", border: "1px solid #d1d5db", borderRadius: 10, color: "#111827", fontSize: "0.95rem", padding: "0 14px", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", color: "#374151", fontSize: "0.82rem", fontWeight: 600, marginBottom: 6 }}>
                  {de ? "E-Mail-Adresse *" : "Adresse e-mail *"}
                </label>
                <div style={{ position: "relative" }}>
                  <Mail size={15} color="#9ca3af" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  <input
                    type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={de ? "max@beispiel.de" : "jean@exemple.com"}
                    style={{ width: "100%", height: 48, background: "white", border: "1px solid #d1d5db", borderRadius: 10, color: "#111827", fontSize: "0.95rem", paddingLeft: 40, paddingRight: 14, outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              {/* Phone */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", color: "#374151", fontSize: "0.82rem", fontWeight: 600, marginBottom: 6 }}>
                  {de ? "Telefonnummer *" : "Numéro de téléphone *"}
                </label>
                <div style={{ position: "relative" }}>
                  <Phone size={15} color="#9ca3af" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  <input
                    type="tel" required value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    placeholder="+49 xxx xxx xxxx"
                    style={{ width: "100%", height: 48, background: "white", border: "1px solid #d1d5db", borderRadius: 10, color: "#111827", fontSize: "0.95rem", paddingLeft: 40, paddingRight: 14, outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              {/* Financial situation */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", color: "#374151", fontSize: "0.82rem", fontWeight: 600, marginBottom: 6 }}>
                  {de ? "Aktuelle finanzielle Situation *" : "Situation financière actuelle *"}
                </label>
                <textarea
                  required rows={5} value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  placeholder={de
                    ? "Beschreiben Sie kurz Ihre Situation und den Grund Ihres Antrags: Einkommensverlust, familiäre Ausgaben, Schulden, Arbeitslosigkeit…"
                    : "Décrivez brièvement votre situation et la raison de votre demande : perte de revenus, charges familiales, dettes, chômage…"
                  }
                  style={{ width: "100%", background: "white", border: "1px solid #d1d5db", borderRadius: 10, color: "#111827", fontSize: "0.9rem", padding: "14px", outline: "none", boxSizing: "border-box", resize: "vertical", lineHeight: 1.65 }}
                />
              </div>

              {apiError && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", marginBottom: 16 }}>
                  <AlertCircle size={15} color="#dc2626" />
                  <p style={{ color: "#dc2626", fontSize: "0.85rem", margin: 0 }}>{apiError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !canSubmit}
                style={{ width: "100%", height: 52, background: "#005F2D", color: "white", border: "none", borderRadius: 12, fontWeight: 700, fontSize: "1rem", cursor: (loading || !canSubmit) ? "not-allowed" : "pointer", opacity: (loading || !canSubmit) ? 0.55 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              >
                {loading
                  ? (de ? "Wird gesendet…" : "Envoi en cours…")
                  : (de ? "Antrag einreichen" : "Envoyer ma demande")
                }
                {!loading && <ArrowRight size={18} />}
              </button>

              <p style={{ color: "#9ca3af", fontSize: "0.74rem", textAlign: "center", margin: "14px 0 0", lineHeight: 1.6 }}>
                {de
                  ? "Ihre Daten werden gemäß DSGVO streng vertraulich behandelt und ausschließlich zur Bearbeitung Ihres Antrags verwendet. support@kt-bank-ag.com"
                  : "Vos données sont traitées de façon strictement confidentielle conformément au RGPD et utilisées uniquement pour traiter votre demande. support@kt-bank-ag.com"
                }
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── Open account CTA ── */}
      <section style={{ background: "#005F2D", padding: "72px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ width: 62, height: 62, borderRadius: 18, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 22px" }}>
            <Euro size={28} color="white" />
          </div>
          <h2 style={{ color: "white", fontWeight: 800, fontSize: "clamp(1.4rem, 4vw, 2rem)", margin: "0 0 14px", lineHeight: 1.2 }}>
            {de ? "Noch kein KT Bank Konto?" : "Pas encore de compte KT Bank ?"}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1rem", lineHeight: 1.75, margin: "0 0 28px" }}>
            {de
              ? "Eröffnen Sie kostenlos Ihr KT Bank Girokonto – zinsfrei, halal-konform und ohne Monatsgebühren. Mit verifiziertem Konto haben Sie Zugang zu allen Leistungen unseres Förderprogramms."
              : "Ouvrez gratuitement votre compte courant KT Bank – sans intérêts, conforme halal et sans frais mensuels. Avec un compte vérifié, vous accédez à l'ensemble des prestations du programme."
            }
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/client/register" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 32px", background: "white", color: "#005F2D", borderRadius: 999, fontWeight: 700, fontSize: "0.98rem", textDecoration: "none" }}>
              {de ? "Kostenloses Konto eröffnen" : "Ouvrir un compte gratuit"}
              <ArrowRight size={17} />
            </Link>
            <Link href="/products" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 28px", background: "rgba(255,255,255,0.1)", color: "white", borderRadius: 999, fontWeight: 600, fontSize: "0.98rem", textDecoration: "none", border: "1px solid rgba(255,255,255,0.25)" }}>
              {de ? "Unsere Produkte" : "Nos produits"}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Trust strip ── */}
      <section style={{ background: "#f9fafb", borderTop: "1px solid #e5e7eb", padding: "28px 24px" }}>
        <div style={{ maxWidth: 840, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center", alignItems: "center" }}>
          {[
            { Icon: Building2, label: de ? "BaFin-reguliert" : "Régulé BaFin" },
            { Icon: Lock, label: de ? "SSL-verschlüsselt" : "Chiffrement SSL" },
            { Icon: CheckCircle, label: de ? "DSGVO-konform" : "Conforme RGPD" },
            { Icon: Shield, label: de ? "AML-konform" : "Conforme AML" },
          ].map(({ Icon, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 7, color: "#6b7280", fontSize: "0.8rem", fontWeight: 600 }}>
              <Icon size={15} color="#005F2D" />
              {label}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
