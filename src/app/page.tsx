"use client";
import Link from "next/link";

/* ─────────── DATA ─────────── */
const PRODUCTS_GRID = [
  { icon: "/icons/compte-courant.svg",       label: "Compte courant",          href: "/products/giro-konto" },
  { icon: "/icons/compte-participation.svg", label: "Compte de participation", href: "/products/festgeld-konto" },
  { icon: "/icons/mastercard.svg",           label: "Mastercard",              href: "/products/jetzz-card" },
  { icon: "/icons/compte-devises.svg",       label: "Compte de devises",       href: "/products/devises" },
];

/* ─────────── HELPERS ─────────── */
function SectionImage({ src, alt, height = 260 }: { src: string; alt: string; height?: number }) {
  return (
    <img
      src={src}
      alt={alt}
      style={{ width: "100%", height: height, objectFit: "cover", display: "block" }}
    />
  );
}

function GreenPillButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        padding: "18px 24px",
        borderRadius: 999,
        background: "#005F2D",
        color: "white",
        fontWeight: 700,
        fontSize: "1rem",
        textDecoration: "none",
        boxSizing: "border-box",
      }}
    >
      {children}
    </Link>
  );
}

function GoldPillButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        padding: "18px 24px",
        borderRadius: 999,
        background: "#C9921A",
        color: "#1A1A1A",
        fontWeight: 700,
        fontSize: "1rem",
        textDecoration: "none",
        boxSizing: "border-box",
      }}
    >
      {children}
    </Link>
  );
}

/* ─────────── PAGE ─────────── */
export default function HomePage() {
  return (
    <>
      {/* ── Section 1: Hero ── */}
      <section>
        {/* Phone + debit card hero image */}
        <SectionImage
          src="https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80"
          alt="KT Bank mobile app et carte de débit"
          height={300}
        />
        {/* Dark green content area */}
        <div style={{ background: "#005F2D", padding: "32px 24px" }}>
          <h1
            style={{
              color: "white",
              fontWeight: 800,
              fontSize: "2.2rem",
              lineHeight: 1.2,
              margin: 0,
              marginBottom: 16,
            }}
          >
            Un compte courant gratuit pour tous. Avec des valeurs.
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: "1rem",
              lineHeight: 1.7,
              margin: 0,
              marginBottom: 24,
            }}
          >
            Le compte courant KT n&apos;est pas soumis à des frais mensuels de tenue de compte.
            Vous maîtrisez vos finances – sans facilité de découvert ni agios.
          </p>
          <Link
            href="/client/register"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              padding: "18px 24px",
              borderRadius: 999,
              background: "white",
              color: "#005F2D",
              fontWeight: 700,
              fontSize: "1rem",
              textDecoration: "none",
              boxSizing: "border-box",
            }}
          >
            Ouvrir un compte
          </Link>
        </div>
      </section>

      {/* ── Section 2: Products 2×2 grid ── */}
      <section style={{ background: "white", padding: "48px 0" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px" }}>
          {/* Label */}
          <div
            style={{
              textAlign: "center",
              color: "#005F2D",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: 24,
            }}
          >
            Nos Produits
          </div>

          {/* 2×2 grid with cross dividers */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              border: "1px solid #E5E7EB",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            {PRODUCTS_GRID.map((p, i) => (
              <Link
                key={p.href}
                href={p.href}
                style={{
                  padding: "32px 16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  borderRight: i % 2 === 0 ? "1px solid #E5E7EB" : "none",
                  borderBottom: i < 2 ? "1px solid #E5E7EB" : "none",
                  background: "white",
                  textDecoration: "none",
                }}
              >
                <img src={p.icon} alt="" width={52} height={52} />
                <span
                  style={{
                    color: "#005F2D",
                    fontSize: "0.875rem",
                    textAlign: "center",
                    fontWeight: 500,
                    lineHeight: 1.3,
                  }}
                >
                  {p.label}
                </span>
              </Link>
            ))}
          </div>

          {/* "See all" link */}
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Link
              href="/products"
              style={{
                color: "#005F2D",
                fontSize: "0.95rem",
                fontWeight: 600,
                textDecoration: "underline",
              }}
            >
              Voir tous les produits →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 3: Des convictions solides — père et enfant ── */}
      <section>
        <SectionImage
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80"
          alt="Famille heureuse – valeurs et convictions"
        />
        <div style={{ background: "white", padding: "32px 24px" }}>
          <h2
            style={{
              color: "#005F2D",
              fontWeight: 800,
              fontSize: "1.75rem",
              lineHeight: 1.25,
              margin: 0,
              marginBottom: 16,
            }}
          >
            Des convictions solides, des avantages convaincants.
          </h2>
          <p
            style={{
              color: "#374151",
              fontSize: "1rem",
              lineHeight: 1.7,
              margin: 0,
              marginBottom: 16,
            }}
          >
            Nos produits et services sont conformes à l&apos;islam et ne portent pas d&apos;intérêts.
            Cela signifie qu&apos;ils sont axés sur les principes de la foi islamique. En même temps,
            ils correspondent à des principes éthiques universellement valables, ce qui rend notre
            offre attrayante pour toute personne consciente de ses valeurs.
          </p>
          <p
            style={{
              color: "#374151",
              fontSize: "1rem",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Forte de cette conviction, KT Bank AG est ouverte aux clients de toutes les convictions
            et souhaite être la banque principale et durable de la communauté musulmane et de tous
            ceux qui souhaitent investir de manière socialement responsable.
          </p>
        </div>
      </section>

      {/* ── Section 4: Compte courant KT — appli mobile + carte ── */}
      <section>
        <SectionImage
          src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80"
          alt="Application KT Bank et carte de débit"
        />
        <div style={{ background: "#F2EDE4", padding: "32px 24px" }}>
          <h2
            style={{
              color: "#005F2D",
              fontWeight: 800,
              fontSize: "1.75rem",
              lineHeight: 1.25,
              margin: 0,
              marginBottom: 16,
            }}
          >
            Compte courant KT gratuit
          </h2>
          <p
            style={{
              color: "#374151",
              fontSize: "1rem",
              lineHeight: 1.7,
              margin: 0,
              marginBottom: 24,
            }}
          >
            Le compte courant KT vous offre tous les services d&apos;un compte courant et ce, sans frais.
            Ouvrez facilement et confortablement votre compte courant KT en ligne et profitez
            directement de tous les avantages. Pas de frais de tenue de compte et pas de versement
            minimum, y compris un accès direct à vos services bancaires en ligne et mobiles.
          </p>
          <GreenPillButton href="/client/register">Ouvrir un compte maintenant</GreenPillButton>
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Link
              href="/products/giro-konto"
              style={{
                color: "#005F2D",
                fontSize: "0.9rem",
                textDecoration: "underline",
              }}
            >
              Plus d&apos;informations
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 5: Compte de dépôt à terme — bocal de pièces ── */}
      <section>
        <SectionImage
          src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80"
          alt="Épargne – pièces de monnaie"
        />
        <div style={{ background: "#F2EDE4", padding: "32px 24px" }}>
          <h2
            style={{
              color: "#005F2D",
              fontWeight: 800,
              fontSize: "1.75rem",
              lineHeight: 1.25,
              margin: 0,
              marginBottom: 16,
            }}
          >
            Compte de dépôt à terme KT
          </h2>
          <p
            style={{
              color: "#374151",
              fontSize: "1rem",
              lineHeight: 1.7,
              margin: 0,
              marginBottom: 24,
            }}
          >
            D&apos;excellentes conditions en toute sécurité&nbsp;: placez votre argent de façon sûre et
            rentable sur le compte de dépôt à terme KT. Des gains garantis avec un rendement
            supérieur à la moyenne – sans aucun coût ni frais.
          </p>
          <GreenPillButton href="/client/register">Ouvrir un compte maintenant</GreenPillButton>
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Link
              href="/products/festgeld-konto"
              style={{
                color: "#005F2D",
                fontSize: "0.9rem",
                textDecoration: "underline",
              }}
            >
              Plus d&apos;informations
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 6: Blog — palmier numérique & laptop ── */}
      <section>
        <SectionImage
          src="https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80"
          alt="Finance islamique numérique"
        />
        <div style={{ background: "#F2EDE4", padding: "32px 24px" }}>
          <h2
            style={{
              color: "#005F2D",
              fontWeight: 800,
              fontSize: "1.75rem",
              lineHeight: 1.25,
              margin: 0,
              marginBottom: 16,
            }}
          >
            Blog
          </h2>
          <p
            style={{
              color: "#374151",
              fontSize: "1rem",
              lineHeight: 1.7,
              margin: 0,
              marginBottom: 24,
            }}
          >
            En tant que première banque de la zone euro à proposer des produits et des services
            financiers selon les principes de la banque islamique, transparente et axée sur les
            valeurs, nous sommes ici, sur place, les pionniers d&apos;un secteur d&apos;activité en pleine
            expansion dans le monde entier.
          </p>
          <GoldPillButton href="/about">Découvre les nouveautés</GoldPillButton>
        </div>
      </section>

      {/* ── Section 7: Magasins / Agences — intérieur KT Bank ── */}
      <section>
        <SectionImage
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
          alt="Agence KT Bank"
        />
        <div
          style={{
            background: "#F2EDE4",
            padding: "32px 24px",
            borderRadius: "16px 16px 0 0",
          }}
        >
          <h2
            style={{
              color: "#005F2D",
              fontWeight: 800,
              fontSize: "1.75rem",
              lineHeight: 1.25,
              margin: 0,
              marginBottom: 16,
            }}
          >
            Magasins
          </h2>
          <p
            style={{
              color: "#374151",
              fontSize: "1rem",
              lineHeight: 1.7,
              margin: 0,
              marginBottom: 24,
            }}
          >
            En tant que première banque de la zone euro à proposer des produits et des services
            financiers selon les principes de la banque islamique transparente et respectueuse des
            valeurs, nous sommes ici, sur place, les pionniers d&apos;un secteur d&apos;activité en pleine
            expansion dans le monde entier.
          </p>
          <GoldPillButton href="/branches">Nos magasins</GoldPillButton>
        </div>
      </section>
    </>
  );
}
