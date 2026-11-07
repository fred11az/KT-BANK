"use client";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Lang } from "@/lib/translations";

const DARK_GREEN = "#063A20";
const GREEN = "#005F2D";
const MINT = "#E9F2EC";
const BEIGE = "#F2EDE4";
const BORDER = "#E5E7EB";

const APPLE_URL = "https://apps.apple.com/de/app/kt-bank-mobile-banking/id1345993618";
const PLAY_URL = "https://play.google.com/store/apps/details?id=de.kuveytturk.mobil";

const LANGUAGES: { code: Lang; label: string }[] = [
  { code: "de", label: "Deutsch" },
  { code: "tr", label: "Türkçe" },
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
];

const CURRENCIES = ["TL", "USD", "GBP", "CHF"];

function pillPrimary(bg: string, color: string): React.CSSProperties {
  return {
    display: "flex", justifyContent: "center", alignItems: "center", width: "100%",
    padding: "18px 24px", borderRadius: 999, background: bg, color, fontWeight: 700,
    fontSize: "1rem", textDecoration: "none", boxSizing: "border-box", border: "none",
  };
}

function pillSecondary(): React.CSSProperties {
  return {
    display: "flex", justifyContent: "center", alignItems: "center", width: "100%",
    padding: "18px 24px", borderRadius: 999, background: "rgba(0,0,0,0.06)", color: "#1A1A1A",
    fontWeight: 700, fontSize: "0.95rem", textDecoration: "none", boxSizing: "border-box",
  };
}

function ProductSection({
  image, imageAlt, bg, heading, headingColor, desc, descColor, ctaHref, ctaLabel, ctaStyle,
  moreHref, moreLabel, moreColor,
}: {
  image: string; imageAlt: string; bg: string;
  heading: string; headingColor: string; desc: string; descColor: string;
  ctaHref: string; ctaLabel: string; ctaStyle: React.CSSProperties;
  moreHref: string; moreLabel: string; moreColor: string;
}) {
  return (
    <section>
      <div style={{ background: bg, padding: "40px 24px 32px", textAlign: "center" }}>
        <h2 style={{ color: headingColor, fontWeight: 800, fontSize: "2rem", lineHeight: 1.2, margin: "0 0 12px" }}>
          {heading}
        </h2>
        <p style={{ color: descColor, fontSize: "1.05rem", lineHeight: 1.6, margin: "0 0 28px" }}>
          {desc}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 360, margin: "0 auto" }}>
          <Link href={ctaHref} style={ctaStyle}>{ctaLabel}</Link>
          <Link href={moreHref} style={{ ...pillSecondary(), color: moreColor }}>{moreLabel}</Link>
        </div>
      </div>
      <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 3" }}>
        <Image src={image} alt={imageAlt} fill style={{ objectFit: "cover" }} sizes="100vw" />
      </div>
    </section>
  );
}

export default function HomePage() {
  const { t, lang, setLang } = useLanguage();
  const h = t.home;

  return (
    <>
      {/* ── Hero ── */}
      <section style={{ position: "relative" }}>
        <div style={{ position: "relative", width: "100%", aspectRatio: "3 / 4" }}>
          <Image src="/images/home/hero.jpg" alt="KT Bank" fill priority style={{ objectFit: "cover" }} sizes="100vw" />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.15) 55%, rgba(0,0,0,0.55) 100%)",
          }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "0 24px 24px" }}>
            <h1 style={{ color: "white", fontWeight: 800, fontSize: "2rem", lineHeight: 1.25, margin: "0 0 14px", textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
              {h.hero.title}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.92)", fontSize: "0.98rem", lineHeight: 1.6, margin: 0, textShadow: "0 1px 8px rgba(0,0,0,0.3)" }}>
              {h.hero.desc}
            </p>
          </div>
        </div>
        <div style={{ padding: "0 24px", transform: "translateY(-28px)" }}>
          <Link href="/client/register" style={pillPrimary("white", GREEN)}>
            {h.hero.cta}
          </Link>
        </div>
      </section>

      {/* ── KT GiroKonto ── */}
      <ProductSection
        image="/images/home/girokonto.jpg" imageAlt={h.giro.heading}
        bg={DARK_GREEN} heading={h.giro.heading} headingColor="white"
        desc={h.giro.desc} descColor="rgba(255,255,255,0.85)"
        ctaHref="/client/register" ctaLabel={h.giro.cta} ctaStyle={pillPrimary("white", GREEN)}
        moreHref="/products/giro-konto" moreLabel={h.giro.more} moreColor="white"
      />

      {/* ── Jetzz Card ── */}
      <ProductSection
        image="/images/home/jetzzcard.jpg" imageAlt={h.jetzzcard.heading}
        bg={MINT} heading={h.jetzzcard.heading} headingColor="#1A1A1A"
        desc={h.jetzzcard.desc} descColor="#4B5563"
        ctaHref="/products/jetzz-card" ctaLabel={h.jetzzcard.cta} ctaStyle={pillPrimary(GREEN, "white")}
        moreHref="/products/jetzz-card" moreLabel={h.jetzzcard.more} moreColor="#1A1A1A"
      />

      {/* ── Compte Or / GoldKonto ── */}
      <ProductSection
        image="/images/home/goldkonto.jpg" imageAlt={h.goldkonto.heading}
        bg={BEIGE} heading={h.goldkonto.heading} headingColor="#1A1A1A"
        desc={h.goldkonto.desc} descColor="#4B5563"
        ctaHref="/products/gold-konto" ctaLabel={h.goldkonto.cta} ctaStyle={pillPrimary(GREEN, "white")}
        moreHref="/products/gold-konto" moreLabel={h.goldkonto.more} moreColor="#1A1A1A"
      />

      {/* ── Compte à terme / Festgeld ── */}
      <section>
        <div style={{ margin: "24px 16px 0", border: `1px solid ${BORDER}`, borderRadius: 24, overflow: "hidden" }}>
          <div style={{ padding: "32px 24px 28px", textAlign: "center" }}>
            <h2 style={{ color: "#1A1A1A", fontWeight: 800, fontSize: "1.8rem", lineHeight: 1.2, margin: "0 0 12px" }}>
              {h.festgeld.heading}
            </h2>
            <p style={{ color: "#4B5563", fontSize: "1rem", lineHeight: 1.6, margin: "0 0 24px" }}>
              {h.festgeld.desc}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 360, margin: "0 auto" }}>
              <Link href="/products/festgeld-konto" style={pillPrimary(GREEN, "white")}>{h.festgeld.cta}</Link>
              <Link href="/products/festgeld-konto" style={pillSecondary()}>{h.festgeld.more}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Financement ── */}
      <ProductSection
        image="/images/home/immobilienfinanzierung.jpg" imageAlt={h.financing.heading}
        bg={DARK_GREEN} heading={h.financing.heading} headingColor="white"
        desc={h.financing.desc} descColor="rgba(255,255,255,0.85)"
        ctaHref="/products/real-estate" ctaLabel={h.financing.cta} ctaStyle={pillPrimary("white", GREEN)}
        moreHref="/products/real-estate" moreLabel={h.financing.more} moreColor="white"
      />

      {/* ── Devises & or ── */}
      <section style={{ padding: "24px 16px 0" }}>
        <div style={{ border: `1px solid ${BORDER}`, borderRadius: 24, padding: "32px 24px", textAlign: "center" }}>
          <h2 style={{ color: "#1A1A1A", fontWeight: 800, fontSize: "1.6rem", lineHeight: 1.2, margin: "0 0 10px" }}>
            {h.devises.heading}
          </h2>
          <p style={{ color: "#4B5563", fontSize: "0.97rem", lineHeight: 1.6, margin: "0 0 20px" }}>
            {h.devises.desc}
          </p>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8, marginBottom: 16 }}>
            {CURRENCIES.map((c) => (
              <div key={c} style={{ flex: "0 0 auto", background: MINT, borderRadius: 14, padding: "14px 20px", minWidth: 96 }}>
                <p style={{ color: GREEN, fontWeight: 800, fontSize: "1.1rem", margin: 0 }}>{c}</p>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 360, margin: "0 auto" }}>
            <Link href="/client/register" style={pillPrimary(GREEN, "white")}>{h.devises.cta}</Link>
            <Link href="/products" style={pillSecondary()}>{h.devises.more}</Link>
          </div>
        </div>
      </section>

      {/* ── Une banque fidèle à vos valeurs ── */}
      <section style={{ padding: "20px 16px 0" }}>
        <div style={{ border: `1px solid ${BORDER}`, borderRadius: 24, padding: "36px 24px", textAlign: "center" }}>
          <h2 style={{ color: "#1A1A1A", fontWeight: 800, fontSize: "1.75rem", lineHeight: 1.25, margin: "0 0 14px" }}>
            {h.values.heading}
          </h2>
          <p style={{ color: "#4B5563", fontSize: "1rem", lineHeight: 1.6, margin: "0 0 24px" }}>
            {h.values.desc}
          </p>
          <Link href="/islamic-banking" style={pillPrimary(GREEN, "white")}>{h.values.cta}</Link>
        </div>
      </section>

      {/* ── Votre langue. Votre banque. ── */}
      <section style={{ padding: "20px 0 0" }}>
        <div style={{ background: MINT, padding: "36px 24px 32px", textAlign: "center" }}>
          <h2 style={{ color: "#1A1A1A", fontWeight: 800, fontSize: "1.75rem", lineHeight: 1.25, margin: "0 0 12px" }}>
            {h.language.heading}
          </h2>
          <p style={{ color: "#4B5563", fontSize: "1rem", lineHeight: 1.6, margin: "0 0 24px" }}>
            {h.language.desc}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, maxWidth: 360, margin: "0 auto 24px" }}>
            {LANGUAGES.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                style={{
                  padding: "14px 10px", borderRadius: 999, border: "none", cursor: "pointer",
                  background: lang === code ? GREEN : "white",
                  color: lang === code ? "white" : GREEN,
                  fontWeight: 700, fontSize: "0.95rem",
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div style={{ maxWidth: 360, margin: "0 auto" }}>
            <Link href="/branches" style={pillPrimary(GREEN, "white")}>{h.language.findBranch}</Link>
          </div>
        </div>
        <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 3" }}>
          <Image src="/images/home/agence.jpg" alt={h.language.heading} fill style={{ objectFit: "cover" }} sizes="100vw" />
        </div>
      </section>

      {/* ── Application KT Banking ── */}
      <section>
        <div style={{ background: DARK_GREEN, padding: "36px 24px 32px", textAlign: "center" }}>
          <h2 style={{ color: "white", fontWeight: 800, fontSize: "1.75rem", lineHeight: 1.25, margin: "0 0 10px" }}>
            {h.app.heading}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1.05rem", margin: "0 0 24px" }}>
            {h.app.desc}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 360, margin: "0 auto" }}>
            <a href={APPLE_URL} target="_blank" rel="noopener noreferrer" style={pillPrimary("white", "#1A1A1A")}>
              {h.app.appStore}
            </a>
            <a href={PLAY_URL} target="_blank" rel="noopener noreferrer" style={pillPrimary("white", "#1A1A1A")}>
              {h.app.googlePlay}
            </a>
          </div>
        </div>
        <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 3" }}>
          <Image src="/images/home/app-girokonto.jpg" alt={h.app.heading} fill style={{ objectFit: "cover" }} sizes="100vw" />
        </div>
      </section>

      {/* ── Programme aide familiale (bonus KT Bank, hors maquette officielle) ── */}
      <section style={{ background: "#005F2D", padding: "0" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ position: "relative", width: "100%", height: 220 }}>
            <Image
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80"
              alt={t.lang !== "fr" ? "Familie" : "Famille"}
              fill
              style={{ objectFit: "cover", objectPosition: "center 30%" }}
              sizes="100vw"
            />
          </div>
          <div style={{ padding: "32px 24px", background: "linear-gradient(135deg, #002d15 0%, #005F2D 100%)" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: "5px 14px", marginBottom: 18 }}>
              <span style={{ color: "#86efac", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {t.lang !== "fr" ? "BaFin-reguliert" : "Réglementé BaFin"}
              </span>
            </div>
            <h2 style={{ color: "white", fontWeight: 800, fontSize: "1.7rem", lineHeight: 1.2, margin: "0 0 8px" }}>
              {t.lang !== "fr" ? "Bis zu 250.000 € Familienhilfe" : "Jusqu'à 250 000 € d'aide familiale"}
            </h2>
            <p style={{ color: "#86efac", fontWeight: 700, fontSize: "1.2rem", margin: "0 0 14px" }}>
              250.000 €
            </p>
            <p style={{ color: "rgba(255,255,255,0.82)", fontSize: "0.97rem", lineHeight: 1.7, margin: "0 0 24px" }}>
              {t.lang !== "fr"
                ? "KT Bank AG hat einen Prioritätsfonds für Familien in finanzieller Not eingerichtet. Schnelle, vertrauliche Bearbeitung innerhalb von 24 Stunden."
                : "KT Bank AG a mis en place un fonds prioritaire pour les familles en difficulté financière. Traitement rapide et confidentiel dans les 24 heures."
              }
            </p>
            <Link
              href="/familienhilfe"
              style={pillPrimary("white", GREEN)}
            >
              {t.lang !== "fr" ? "Jetzt Antrag stellen →" : "Faire une demande →"}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
