"use client";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const f = t.footer;

  return (
    <footer style={{ background: "#003D1C" }}>
      <div className="max-w-2xl mx-auto px-6 py-16 flex flex-col items-center text-center gap-8">

        <div className="space-y-3">
          <h2 className="font-bold leading-snug" style={{ color: "white", fontSize: "clamp(1.15rem, 3vw, 1.4rem)" }}>
            {f.appHeading}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
            {f.appDesc}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          <a href="#" className="flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm transition-opacity hover:opacity-80"
            style={{ background: "#000", color: "white", border: "1px solid rgba(255,255,255,0.15)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.19 1.28-2.17 3.81.02 3.02 2.65 4.03 2.68 4.04l-.06.23zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            {f.appStore}
          </a>
          <a href="#" className="flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm transition-opacity hover:opacity-80"
            style={{ background: "#000", color: "white", border: "1px solid rgba(255,255,255,0.15)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
              <path d="M3.18 23.76c.31.18.67.19 1.02.04l11.63-6.71-2.49-2.49-10.16 9.16zM.5 1.1A1 1 0 0 0 .33 1.7v20.6c0 .23.06.44.17.62l.06.06 11.54-11.54v-.27L.56 1.04l-.06.06zM20.33 10.3l-2.47-1.43-2.77 2.77 2.77 2.77 2.48-1.43c.71-.41.71-1.28-.01-1.68zm-16.47 12l10.16-9.16-2.49-2.49-9.18 8.44 1.51 3.21z"/>
            </svg>
            {f.googlePlay}
          </a>
        </div>

        <div className="flex items-center gap-3">
          {[
            { label: "Facebook", symbol: "f" },
            { label: "Instagram", symbol: "📷" },
            { label: "LinkedIn", symbol: "in" },
            { label: "YouTube", symbol: "▶" },
          ].map(({ label, symbol }) => (
            <button key={label} aria-label={label}
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-opacity hover:opacity-80"
              style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.15)" }}>
              {symbol}
            </button>
          ))}
        </div>

        <div className="flex flex-col w-full max-w-xs gap-3">
          <Link href="/client/register"
            className="block w-full text-center py-3.5 rounded-full font-bold text-sm transition-opacity hover:opacity-90"
            style={{ border: "2px solid rgba(255,255,255,0.6)", color: "white" }}>
            {t.nav.openAccount}
          </Link>
          <a href="tel:+4969255102000"
            className="block w-full text-center py-3.5 rounded-full font-bold text-sm transition-opacity hover:opacity-90"
            style={{ border: "2px solid rgba(255,255,255,0.6)", color: "white" }}>
            +49 69 255 10 200
          </a>
        </div>

        <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{f.bic}</p>

        <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
          {f.subsidiary.split("KuveytTürk")[0]}
          <span style={{ fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>KuveytTürk</span>
        </p>

        <div className="w-full h-px" style={{ background: "rgba(255,255,255,0.1)" }}/>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          {[
            { label: f.privacy, href: "#" },
            { label: f.dataProtection, href: "#" },
            { label: f.legalNotice, href: "#" },
          ].map(({ label, href }, i, arr) => (
            <span key={label} className="flex items-center gap-4">
              <a href={href} className="text-xs transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.45)" }}>
                {label}
              </a>
              {i < arr.length - 1 && <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>}
            </span>
          ))}
        </div>

        <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          © {new Date().getFullYear()} KT Bank AG · BaFin-reguliert
        </p>
      </div>
    </footer>
  );
}
