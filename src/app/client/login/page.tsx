"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft } from "lucide-react";

type LoginStep = "email" | "otp";

export default function LoginPage() {
  const [step, setStep] = useState<LoginStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(120);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (step !== "otp") return;
    setTimer(120);
    const id = setInterval(() => setTimer((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [step]);

  function handleOtp(idx: number, val: string) {
    const digit = val.replace(/\D/, "").slice(-1);
    const next = [...otp];
    next[idx] = digit;
    setOtp(next);
    if (digit && idx < 3) otpRefs[idx + 1].current?.focus();
    if (!digit && idx > 0) otpRefs[idx - 1].current?.focus();
  }

  async function requestOtp() {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Ungültige E-Mail-Adresse");
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch("/api/kt/login", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || "Fehler"); return; }
    setStep("otp");
  }

  async function verifyLogin() {
    const code = otp.join("");
    if (code.length < 4) { setError("Bitte alle 4 Ziffern eingeben"); return; }
    setLoading(true);
    setError("");
    const res = await fetch("/api/kt/client/login-verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || "Ungültiger Code"); return; }
    sessionStorage.setItem("kt_token", data.token);
    sessionStorage.setItem("kt_email", email);
    window.location.href = "/client/dashboard";
  }

  const wrap: React.CSSProperties = {
    minHeight: "100vh",
    background: "#111318",
    display: "flex",
    flexDirection: "column",
    padding: "0 24px 48px",
    boxSizing: "border-box",
  };

  function Header({ onBack }: { onBack?: () => void }) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0 8px" }}>
        {onBack
          ? <button onClick={onBack} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", padding: 4 }}><ChevronLeft size={24} /></button>
          : <div style={{ width: 32 }} />}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: "#005F2D", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontWeight: 800, fontSize: "0.75rem" }}>KT</span>
          </div>
          <span style={{ color: "white", fontWeight: 700, fontSize: "1rem" }}>KT Bank</span>
        </div>
        <div style={{ width: 32 }} />
      </div>
    );
  }

  if (step === "email") return (
    <div style={wrap}>
      <Header />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingTop: 48 }}>
        <div style={{ width: 60, height: 60, borderRadius: 18, background: "linear-gradient(135deg,#003D1F,#005F2D)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28, boxShadow: "0 8px 24px rgba(0,95,45,0.4)" }}>
          <span style={{ color: "#C9A84C", fontWeight: 900, fontSize: "1.15rem" }}>KT</span>
        </div>
        <h1 style={{ color: "white", fontWeight: 800, fontSize: "1.9rem", marginBottom: 8, lineHeight: 1.2 }}>
          Willkommen<br />bei KT Bank
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem", marginBottom: 40, lineHeight: 1.6 }}>
          Melden Sie sich in Ihrem sicheren Kundenbereich an.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>E-Mail-Adresse</label>
            <input
              type="email"
              placeholder="sie@beispiel.de"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") requestOtp(); }}
              style={{ width: "100%", height: 54, background: "#1E2128", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, color: "white", fontSize: "1rem", padding: "0 16px", boxSizing: "border-box", outline: "none" }}
            />
          </div>
          {error && <p style={{ color: "#FF6B6B", fontSize: "0.85rem" }}>{error}</p>}
          <button
            onClick={requestOtp}
            disabled={loading}
            style={{ width: "100%", height: 54, borderRadius: 14, background: "#005F2D", color: "white", fontWeight: 700, fontSize: "1rem", border: "none", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? 0.7 : 1, boxShadow: "0 4px 16px rgba(0,95,45,0.4)" }}
          >
            {loading ? "Bitte warten…" : <><span>Code anfordern</span><ArrowRight size={18} /></>}
          </button>
        </div>

        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem", marginTop: "auto", textAlign: "center", paddingTop: 32 }}>
          Noch kein Konto?{" "}
          <Link href="/client/register" style={{ color: "#C9A84C", fontWeight: 600, textDecoration: "none" }}>Registrieren</Link>
        </p>
      </div>
    </div>
  );

  return (
    <div style={wrap}>
      <Header onBack={() => { setStep("email"); setOtp(["", "", "", ""]); setError(""); }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingTop: 32 }}>
        <h1 style={{ color: "white", fontWeight: 800, fontSize: "1.75rem", marginBottom: 8 }}>Anmeldecode</h1>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem", marginBottom: 4, lineHeight: 1.6 }}>
          Code gesendet an
        </p>
        <p style={{ color: "white", fontWeight: 600, marginBottom: 36 }}>{email}</p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 32 }}>
          {otp.map((d, i) => (
            <input
              key={i}
              ref={otpRefs[i]}
              value={d}
              onChange={(e) => handleOtp(i, e.target.value)}
              onKeyDown={(e) => { if (e.key === "Backspace" && !d && i > 0) otpRefs[i - 1].current?.focus(); }}
              maxLength={1}
              inputMode="numeric"
              style={{ width: 64, height: 72, textAlign: "center", fontSize: "1.75rem", fontWeight: 700, background: "#1E2128", border: `2px solid ${d ? "#005F2D" : "rgba(255,255,255,0.1)"}`, borderRadius: 14, color: "white", outline: "none", transition: "border-color 0.2s" }}
            />
          ))}
        </div>

        {error && <p style={{ color: "#FF6B6B", fontSize: "0.85rem", marginBottom: 16, textAlign: "center" }}>{error}</p>}

        <button
          onClick={verifyLogin}
          disabled={loading}
          style={{ width: "100%", height: 54, borderRadius: 14, background: "#005F2D", color: "white", fontWeight: 700, fontSize: "1rem", border: "none", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? 0.7 : 1, marginBottom: 24, boxShadow: "0 4px 16px rgba(0,95,45,0.4)" }}
        >
          {loading ? "Überprüfung…" : "Anmelden"}
        </button>

        <div style={{ textAlign: "center" }}>
          {timer > 0
            ? <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem" }}>Erneut senden in {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}</p>
            : <button onClick={requestOtp} style={{ background: "none", border: "none", color: "#C9A84C", fontWeight: 600, cursor: "pointer", fontSize: "0.9rem" }}>Code erneut senden</button>}
        </div>
      </div>
    </div>
  );
}
