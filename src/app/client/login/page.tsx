"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft } from "lucide-react";

type LoginStep = "email" | "otp";

export default function LoginPage() {
  const [step, setStep] = useState<LoginStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["","","",""]);
  const [timer, setTimer] = useState(120);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const otpRefs = [useRef<HTMLInputElement>(null),useRef<HTMLInputElement>(null),useRef<HTMLInputElement>(null),useRef<HTMLInputElement>(null)];

  useEffect(() => {
    if (step !== "otp") return;
    setTimer(120);
    const id = setInterval(() => setTimer((t) => t > 0 ? t-1 : 0), 1000);
    return () => clearInterval(id);
  }, [step]);

  function handleOtp(idx: number, val: string) {
    const digit = val.replace(/\D/,"").slice(-1);
    const next = [...otp]; next[idx] = digit; setOtp(next);
    if (digit && idx < 3) otpRefs[idx+1].current?.focus();
    if (!digit && idx > 0) otpRefs[idx-1].current?.focus();
  }

  async function requestOtp() {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Adresse e-mail invalide"); return; }
    setLoading(true); setError("");
    const res = await fetch("/api/kt/login", { method:"POST", body:JSON.stringify({ email }), headers:{"Content-Type":"application/json"} });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || "Erreur"); return; }
    setStep("otp");
  }

  async function verifyLogin() {
    const code = otp.join("");
    if (code.length < 4) { setError("Saisissez les 4 chiffres"); return; }
    setLoading(true); setError("");

    // Reuse otp-verify endpoint with type kt_login
    const { createClient } = await import("@supabase/supabase-js");
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

    const { data: row, error: dbErr } = await sb
      .from("otp_tokens")
      .select("id")
      .eq("email", email)
      .eq("token", code)
      .eq("type", "kt_login")
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending:false })
      .limit(1)
      .single();

    if (dbErr || !row) { setLoading(false); setError("Code invalide ou expiré"); return; }

    await sb.from("otp_tokens").update({ used:true }).eq("id", row.id);

    // Store session in localStorage
    localStorage.setItem("kt_session", JSON.stringify({ email, loginAt: Date.now() }));
    setLoading(false);
    window.location.href = "/client/dashboard";
  }

  const wrap: React.CSSProperties = {
    minHeight:"100vh", background:"#1C1C1E", display:"flex",
    flexDirection:"column", padding:"0 24px 48px", boxSizing:"border-box",
  };

  function Header({ onBack }: { onBack?: () => void }) {
    return (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 0 8px" }}>
        {onBack
          ? <button onClick={onBack} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.6)", cursor:"pointer", padding:4 }}><ChevronLeft size={24}/></button>
          : <div style={{ width:32 }}/>}
        <span style={{ color:"white", fontWeight:800, fontSize:"1.1rem" }}>KT Bank</span>
        <div style={{ width:32 }}/>
      </div>
    );
  }

  if (step === "email") return (
    <div style={wrap}>
      <Header/>
      <div style={{ flex:1, display:"flex", flexDirection:"column", paddingTop:48 }}>
        {/* KT Bank brand mark */}
        <div style={{ width:64, height:64, borderRadius:20, background:"#005F2D", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:32 }}>
          <span style={{ color:"white", fontWeight:900, fontSize:"1.2rem" }}>KT</span>
        </div>
        <h1 style={{ color:"white", fontWeight:800, fontSize:"2rem", marginBottom:8, lineHeight:1.2 }}>
          Bienvenue<br/>sur KT Bank
        </h1>
        <p style={{ color:"rgba(255,255,255,0.45)", fontSize:"0.95rem", marginBottom:40, lineHeight:1.6 }}>
          Connectez-vous à votre espace client.
        </p>

        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            <label style={{ color:"rgba(255,255,255,0.6)", fontSize:"0.8rem", fontWeight:500 }}>Adresse e-mail</label>
            <input type="email" placeholder="vous@exemple.com" value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => { if(e.key==="Enter") requestOtp(); }}
              style={{ width:"100%", height:56, background:"#2A2A35", border:"1px solid rgba(255,255,255,0.1)", borderRadius:16,
                color:"white", fontSize:"1rem", padding:"0 16px", boxSizing:"border-box", outline:"none" }}/>
          </div>
          {error && <p style={{ color:"#FF6B6B", fontSize:"0.85rem" }}>{error}</p>}
          <button onClick={requestOtp} disabled={loading}
            style={{ width:"100%", height:56, borderRadius:999, background:"white", color:"#005F2D", fontWeight:700,
              fontSize:"1rem", border:"none", cursor:loading?"not-allowed":"pointer", display:"flex",
              alignItems:"center", justifyContent:"center", gap:8, opacity:loading?0.7:1 }}>
            {loading ? "Veuillez patienter…" : <><span>Recevoir un code</span><ArrowRight size={18}/></>}
          </button>
        </div>

        <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.85rem", marginTop:"auto", textAlign:"center", paddingTop:32 }}>
          Pas encore de compte ?{" "}
          <Link href="/client/register" style={{ color:"white", fontWeight:600, textDecoration:"none" }}>S&apos;inscrire</Link>
        </p>
      </div>
    </div>
  );

  return (
    <div style={wrap}>
      <Header onBack={() => { setStep("email"); setOtp(["","","",""]); setError(""); }}/>
      <div style={{ flex:1, display:"flex", flexDirection:"column", paddingTop:32 }}>
        <h1 style={{ color:"white", fontWeight:800, fontSize:"1.75rem", marginBottom:8 }}>Code de connexion</h1>
        <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"0.95rem", marginBottom:4, lineHeight:1.6 }}>Code envoyé à</p>
        <p style={{ color:"white", fontWeight:600, marginBottom:32 }}>{email}</p>

        <div style={{ display:"flex", gap:12, justifyContent:"center", marginBottom:32 }}>
          {otp.map((d,i) => (
            <input key={i} ref={otpRefs[i]} value={d}
              onChange={(e) => handleOtp(i, e.target.value)}
              onKeyDown={(e) => { if(e.key==="Backspace"&&!d&&i>0) otpRefs[i-1].current?.focus(); }}
              maxLength={1} inputMode="numeric"
              style={{ width:64, height:72, textAlign:"center", fontSize:"1.75rem", fontWeight:700,
                background:"#2A2A35", border:`2px solid ${d?"#005F2D":"rgba(255,255,255,0.1)"}`,
                borderRadius:16, color:"white", outline:"none", transition:"border-color 0.2s" }}/>
          ))}
        </div>

        {error && <p style={{ color:"#FF6B6B", fontSize:"0.85rem", marginBottom:16, textAlign:"center" }}>{error}</p>}

        <button onClick={verifyLogin} disabled={loading}
          style={{ width:"100%", height:56, borderRadius:999, background:"white", color:"#005F2D", fontWeight:700,
            fontSize:"1rem", border:"none", cursor:loading?"not-allowed":"pointer", display:"flex",
            alignItems:"center", justifyContent:"center", gap:8, opacity:loading?0.7:1, marginBottom:24 }}>
          {loading ? "Vérification…" : "Se connecter"}
        </button>

        <div style={{ textAlign:"center" }}>
          {timer > 0
            ? <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.85rem" }}>Renvoyer dans {Math.floor(timer/60)}:{String(timer%60).padStart(2,"0")}</p>
            : <button onClick={requestOtp} style={{ background:"none", border:"none", color:"#005F2D", fontWeight:600, cursor:"pointer", fontSize:"0.9rem" }}>Renvoyer le code</button>}
        </div>
      </div>
    </div>
  );
}
