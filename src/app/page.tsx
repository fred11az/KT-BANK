"use client";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

const PRODUCT_ICONS = [
  "/icons/compte-courant.svg",
  "/icons/compte-participation.svg",
  "/icons/mastercard.svg",
  "/icons/compte-devises.svg",
];
const PRODUCT_HREFS = [
  "/products/giro-konto",
  "/products/festgeld-konto",
  "/products/jetzz-card",
  "/products/devises",
];

function SectionImage({ src, alt, height = 260 }: { src: string; alt: string; height?: number }) {
  return <img src={src} alt={alt} style={{ width:"100%", height, objectFit:"cover", display:"block" }}/>;
}

export default function HomePage() {
  const { t } = useLanguage();
  const h = t.home;

  const PRODUCT_LABELS = [h.products.giro, h.products.festgeld, h.products.mastercard, h.products.devises];

  return (
    <>
      {/* ── Section 1: Hero ── */}
      <section>
        <SectionImage
          src="https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80"
          alt="KT Bank mobile app"
          height={300}
        />
        <div style={{ background:"#005F2D", padding:"32px 24px" }}>
          <h1 style={{ color:"white", fontWeight:800, fontSize:"2.2rem", lineHeight:1.2, margin:0, marginBottom:16 }}>
            {h.hero.title}
          </h1>
          <p style={{ color:"rgba(255,255,255,0.85)", fontSize:"1rem", lineHeight:1.7, margin:0, marginBottom:24 }}>
            {h.hero.desc}
          </p>
          <Link href="/client/register" style={{ display:"flex", justifyContent:"center", alignItems:"center", width:"100%", padding:"18px 24px", borderRadius:999, background:"white", color:"#005F2D", fontWeight:700, fontSize:"1rem", textDecoration:"none", boxSizing:"border-box" }}>
            {h.hero.cta}
          </Link>
        </div>
      </section>

      {/* ── Section 2: Products 2×2 grid ── */}
      <section style={{ background:"white", padding:"48px 0" }}>
        <div style={{ maxWidth:640, margin:"0 auto", padding:"0 24px" }}>
          <div style={{ textAlign:"center", color:"#005F2D", fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:24 }}>
            {h.products.label}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", border:"1px solid #E5E7EB", borderRadius:16, overflow:"hidden" }}>
            {PRODUCT_ICONS.map((icon, i) => (
              <Link key={PRODUCT_HREFS[i]} href={PRODUCT_HREFS[i]}
                style={{ padding:"32px 16px", display:"flex", flexDirection:"column", alignItems:"center", gap:12,
                  borderRight: i % 2 === 0 ? "1px solid #E5E7EB" : "none",
                  borderBottom: i < 2 ? "1px solid #E5E7EB" : "none",
                  background:"white", textDecoration:"none" }}>
                <img src={icon} alt="" width={52} height={52}/>
                <span style={{ color:"#005F2D", fontSize:"0.875rem", textAlign:"center", fontWeight:500, lineHeight:1.3 }}>
                  {PRODUCT_LABELS[i]}
                </span>
              </Link>
            ))}
          </div>
          <div style={{ textAlign:"center", marginTop:24 }}>
            <Link href="/products" style={{ color:"#005F2D", fontSize:"0.95rem", fontWeight:600, textDecoration:"underline" }}>
              {h.products.seeAll}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 3: Convictions — père & enfant ── */}
      <section>
        <SectionImage src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80" alt="Familie"/>
        <div style={{ background:"white", padding:"32px 24px", textAlign:"center" }}>
          <h2 style={{ color:"#005F2D", fontWeight:800, fontSize:"1.75rem", lineHeight:1.25, margin:0, marginBottom:16 }}>
            {h.convictions.heading}
          </h2>
          <p style={{ color:"#374151", fontSize:"1rem", lineHeight:1.7, margin:0, marginBottom:16 }}>
            {h.convictions.p1}
          </p>
          <p style={{ color:"#374151", fontSize:"1rem", lineHeight:1.7, margin:0 }}>
            {h.convictions.p2}
          </p>
        </div>
      </section>

      {/* ── Section 4: Compte courant — app + carte ── */}
      <section>
        <SectionImage src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80" alt="KT Bank App und Karte"/>
        <div style={{ background:"#F2EDE4", padding:"32px 24px", textAlign:"center" }}>
          <h2 style={{ color:"#005F2D", fontWeight:800, fontSize:"1.75rem", lineHeight:1.25, margin:0, marginBottom:16 }}>
            {h.giro.heading}
          </h2>
          <p style={{ color:"#374151", fontSize:"1rem", lineHeight:1.7, margin:0, marginBottom:24 }}>
            {h.giro.desc}
          </p>
          <Link href="/client/register" style={{ display:"flex", justifyContent:"center", alignItems:"center", width:"100%", padding:"18px 24px", borderRadius:999, background:"#005F2D", color:"white", fontWeight:700, fontSize:"1rem", textDecoration:"none", boxSizing:"border-box" }}>
            {h.giro.cta}
          </Link>
          <div style={{ marginTop:16 }}>
            <Link href="/products/giro-konto" style={{ color:"#005F2D", fontSize:"0.9rem", textDecoration:"underline" }}>
              {h.giro.more}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 5: Festgeld — bocal de pièces ── */}
      <section>
        <SectionImage src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80" alt="Sparen"/>
        <div style={{ background:"#F2EDE4", padding:"32px 24px", textAlign:"center" }}>
          <h2 style={{ color:"#005F2D", fontWeight:800, fontSize:"1.75rem", lineHeight:1.25, margin:0, marginBottom:16 }}>
            {h.festgeld.heading}
          </h2>
          <p style={{ color:"#374151", fontSize:"1rem", lineHeight:1.7, margin:0, marginBottom:24 }}>
            {h.festgeld.desc}
          </p>
          <Link href="/client/register" style={{ display:"flex", justifyContent:"center", alignItems:"center", width:"100%", padding:"18px 24px", borderRadius:999, background:"#005F2D", color:"white", fontWeight:700, fontSize:"1rem", textDecoration:"none", boxSizing:"border-box" }}>
            {h.festgeld.cta}
          </Link>
          <div style={{ marginTop:16 }}>
            <Link href="/products/festgeld-konto" style={{ color:"#005F2D", fontSize:"0.9rem", textDecoration:"underline" }}>
              {h.festgeld.more}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 6: Blog — palmier numérique ── */}
      <section>
        <SectionImage src="https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80" alt="Blog"/>
        <div style={{ background:"#F2EDE4", padding:"32px 24px", textAlign:"center" }}>
          <h2 style={{ color:"#005F2D", fontWeight:800, fontSize:"1.75rem", lineHeight:1.25, margin:0, marginBottom:16 }}>
            {h.blog.heading}
          </h2>
          <p style={{ color:"#374151", fontSize:"1rem", lineHeight:1.7, margin:0, marginBottom:24 }}>
            {h.blog.desc}
          </p>
          <Link href="/about" style={{ display:"flex", justifyContent:"center", alignItems:"center", width:"100%", padding:"18px 24px", borderRadius:999, background:"#C9921A", color:"#1A1A1A", fontWeight:700, fontSize:"1rem", textDecoration:"none", boxSizing:"border-box" }}>
            {h.blog.cta}
          </Link>
        </div>
      </section>

      {/* ── Section 7: Filialen / Magasins ── */}
      <section>
        <SectionImage src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" alt="KT Bank Filiale"/>
        <div style={{ background:"#F2EDE4", padding:"32px 24px", textAlign:"center", borderRadius:"16px 16px 0 0" }}>
          <h2 style={{ color:"#005F2D", fontWeight:800, fontSize:"1.75rem", lineHeight:1.25, margin:0, marginBottom:16 }}>
            {h.branches.heading}
          </h2>
          <p style={{ color:"#374151", fontSize:"1rem", lineHeight:1.7, margin:0, marginBottom:24 }}>
            {h.branches.desc}
          </p>
          <Link href="/branches" style={{ display:"flex", justifyContent:"center", alignItems:"center", width:"100%", padding:"18px 24px", borderRadius:999, background:"#C9921A", color:"#1A1A1A", fontWeight:700, fontSize:"1rem", textDecoration:"none", boxSizing:"border-box" }}>
            {h.branches.cta}
          </Link>
        </div>
      </section>
    </>
  );
}
