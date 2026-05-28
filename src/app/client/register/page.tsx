"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { LogIn, ArrowRight, ChevronLeft, Eye, EyeOff, Check } from "lucide-react";

/* ─── Types ─── */
type Step = 0 | 1 | 2 | 3 | 4 | 5 | "done";

const PAYS = ["Allemagne","France","Belgique","Suisse","Autriche","Pays-Bas","Turquie","Maroc","Algérie","Tunisie","Sénégal","Côte d'Ivoire","Autre"];
const SOURCES = ["Salaire / Emploi","Freelance / Auto-entrepreneur","Business / Commerce","Pension / Retraite","Épargne personnelle","Autre"];
const DOCS = ["Passeport","Carte d'identité nationale","Titre de séjour"];

/* ─── Sub-components ─── */
function FInput({ label, type="text", placeholder, value, onChange, max }: {
  label: string; type?: string; placeholder?: string; value: string;
  onChange: (v: string) => void; max?: string;
}) {
  const [show, setShow] = useState(false);
  const isPass = type === "password";
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      <label style={{ color:"rgba(255,255,255,0.6)", fontSize:"0.8rem", fontWeight:500 }}>{label}</label>
      <div style={{ position:"relative" }}>
        <input type={isPass && show ? "text" : type} placeholder={placeholder} value={value} max={max}
          onChange={(e) => onChange(e.target.value)}
          style={{ width:"100%", height:56, background:"#2A2A35", border:"1px solid rgba(255,255,255,0.1)", borderRadius:16,
            color:"white", fontSize:"1rem", padding:"0 16px", paddingRight: isPass ? 48 : 16, boxSizing:"border-box", outline:"none" }} />
        {isPass && (
          <button type="button" onClick={() => setShow(!show)}
            style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"rgba(255,255,255,0.4)", cursor:"pointer" }}>
            {show ? <EyeOff size={18}/> : <Eye size={18}/>}
          </button>
        )}
      </div>
    </div>
  );
}

function FSelect({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      <label style={{ color:"rgba(255,255,255,0.6)", fontSize:"0.8rem", fontWeight:500 }}>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        style={{ width:"100%", height:56, background:"#2A2A35", border:"1px solid rgba(255,255,255,0.1)", borderRadius:16,
          color: value ? "white" : "rgba(255,255,255,0.35)", fontSize:"1rem", padding:"0 16px",
          boxSizing:"border-box", outline:"none", appearance:"none" }}>
        <option value="" disabled>Sélectionner…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Btn({ children, onClick, loading, type="button", white }: {
  children: React.ReactNode; onClick?: () => void; loading?: boolean;
  type?: "button"|"submit"; white?: boolean;
}) {
  return (
    <button type={type} onClick={onClick} disabled={loading}
      style={{ width:"100%", height:56, borderRadius:999,
        background: white ? "white" : "#005F2D",
        color: white ? "#005F2D" : "white",
        fontWeight:700, fontSize:"1rem", border:"none", cursor:loading?"not-allowed":"pointer",
        display:"flex", alignItems:"center", justifyContent:"center", gap:8,
        opacity: loading ? 0.7 : 1 }}>
      {loading ? "Veuillez patienter…" : children}
    </button>
  );
}

/* ─── Page ─── */
export default function RegisterPage() {
  const [step, setStep] = useState<Step>(0);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["","","",""]);
  const [timer, setTimer] = useState(120);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [iban, setIban] = useState("");

  // Step 2
  const [pays, setPays] = useState("");
  const [dob, setDob] = useState("");
  const [source, setSource] = useState("");
  const [promo, setPromo] = useState("");
  const [fatca, setFatca] = useState(false);

  // Step 3
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [sexe, setSexe] = useState("");
  const [situation, setSituation] = useState("");
  const [paysNaissance, setPaysNaissance] = useState("");
  const [villeNaissance, setVilleNaissance] = useState("");

  // Step 4
  const [nationalite, setNationalite] = useState("");
  const [typeDoc, setTypeDoc] = useState("");
  const [autorite, setAutorite] = useState("");

  // Step 5
  const [phone, setPhone] = useState("");

  const otpRefs = [useRef<HTMLInputElement>(null),useRef<HTMLInputElement>(null),useRef<HTMLInputElement>(null),useRef<HTMLInputElement>(null)];

  useEffect(() => {
    if (step !== 1) return;
    setTimer(120);
    const id = setInterval(() => setTimer((t) => t > 0 ? t-1 : 0), 1000);
    return () => clearInterval(id);
  }, [step]);

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
        <span style={{ color:"white", fontWeight:800, fontSize:"1.1rem", letterSpacing:"0.02em" }}>KT Bank</span>
        <div style={{ width:32 }}/>
      </div>
    );
  }

  function ProgressBar() {
    if (step === 0 || step === "done") return null;
    const pct = Math.round(((step as number)/5)*100);
    return (
      <div style={{ height:3, background:"rgba(255,255,255,0.1)", borderRadius:99, margin:"8px 0 0" }}>
        <div style={{ height:"100%", width:`${pct}%`, background:"#005F2D", borderRadius:99, transition:"width 0.4s ease" }}/>
      </div>
    );
  }

  async function sendOtp() {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Adresse e-mail invalide"); return; }
    setLoading(true); setError("");
    const res = await fetch("/api/kt/otp-send", { method:"POST", body:JSON.stringify({ email }), headers:{"Content-Type":"application/json"} });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || "Erreur"); return; }
    setStep(1);
  }

  async function verifyOtp() {
    const code = otp.join("");
    if (code.length < 4) { setError("Saisissez les 4 chiffres"); return; }
    setLoading(true); setError("");
    const res = await fetch("/api/kt/otp-verify", { method:"POST", body:JSON.stringify({ email, code }), headers:{"Content-Type":"application/json"} });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || "Code invalide"); return; }
    setStep(2);
  }

  async function save(s: 2|3|4|5) {
    setLoading(true); setError("");
    const bodies: Record<number, object> = {
      2: { step:2, email, pays_residence:pays, date_naissance:dob, source_revenus:source, code_promo:promo, is_fatca:fatca },
      3: { step:3, email, prenom, nom, sexe, situation_familiale:situation, pays_naissance:paysNaissance, ville_naissance:villeNaissance },
      4: { step:4, email, nationalite, type_document:typeDoc, autorite_document:autorite },
      5: { step:5, email, telephone:phone },
    };
    const res = await fetch("/api/kt/register", { method:"POST", body:JSON.stringify(bodies[s]), headers:{"Content-Type":"application/json"} });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || "Erreur serveur"); return; }
    if (s === 5) { setIban(data.iban || ""); setStep("done"); }
    else setStep((s+1) as Step);
  }

  function handleOtp(idx: number, val: string) {
    const digit = val.replace(/\D/,"").slice(-1);
    const next = [...otp]; next[idx] = digit; setOtp(next);
    if (digit && idx < 3) otpRefs[idx+1].current?.focus();
    if (!digit && idx > 0) otpRefs[idx-1].current?.focus();
  }

  /* ── Step 0 ── */
  if (step === 0) return (
    <div style={wrap}>
      <Header/>
      <div style={{ flex:1, display:"flex", flexDirection:"column", paddingTop:32 }}>
        <div style={{ width:56, height:56, borderRadius:16, background:"rgba(0,95,45,0.2)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:24 }}>
          <LogIn size={24} color="#005F2D"/>
        </div>
        <h1 style={{ color:"white", fontWeight:800, fontSize:"1.75rem", marginBottom:8 }}>Créer un compte</h1>
        <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"0.95rem", marginBottom:32, lineHeight:1.6 }}>
          Saisissez votre adresse e-mail pour commencer votre inscription KT Bank.
        </p>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <FInput label="Adresse e-mail" type="email" placeholder="vous@exemple.com" value={email} onChange={setEmail}/>
          {error && <p style={{ color:"#FF6B6B", fontSize:"0.85rem" }}>{error}</p>}
          <Btn onClick={sendOtp} loading={loading} white>Continuer <ArrowRight size={18}/></Btn>
        </div>
        <p style={{ color:"rgba(255,255,255,0.3)", fontSize:"0.78rem", marginTop:24, lineHeight:1.6, textAlign:"center" }}>
          En continuant, vous acceptez nos{" "}
          <Link href="/legal" style={{ color:"rgba(255,255,255,0.55)", textDecoration:"underline" }}>Conditions générales</Link>{" "}
          et notre{" "}
          <Link href="/legal" style={{ color:"rgba(255,255,255,0.55)", textDecoration:"underline" }}>Politique de confidentialité</Link>.
        </p>
        <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.85rem", marginTop:"auto", textAlign:"center", paddingTop:24 }}>
          Déjà un compte ?{" "}
          <Link href="/client/login" style={{ color:"white", fontWeight:600, textDecoration:"none" }}>Se connecter</Link>
        </p>
      </div>
    </div>
  );

  /* ── Step 1 – OTP ── */
  if (step === 1) return (
    <div style={wrap}>
      <Header onBack={() => setStep(0)}/>
      <ProgressBar/>
      <div style={{ flex:1, display:"flex", flexDirection:"column", paddingTop:32 }}>
        <h1 style={{ color:"white", fontWeight:800, fontSize:"1.75rem", marginBottom:8 }}>Vérification e-mail</h1>
        <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"0.95rem", marginBottom:4, lineHeight:1.6 }}>Code envoyé à</p>
        <p style={{ color:"white", fontWeight:600, marginBottom:32 }}>{email}</p>
        <div style={{ display:"flex", gap:12, justifyContent:"center", marginBottom:32 }}>
          {otp.map((d,i) => (
            <input key={i} ref={otpRefs[i]} value={d}
              onChange={(e) => handleOtp(i, e.target.value)}
              onKeyDown={(e) => { if (e.key==="Backspace" && !d && i>0) otpRefs[i-1].current?.focus(); }}
              maxLength={1} inputMode="numeric"
              style={{ width:64, height:72, textAlign:"center", fontSize:"1.75rem", fontWeight:700,
                background:"#2A2A35", border:`2px solid ${d?"#005F2D":"rgba(255,255,255,0.1)"}`,
                borderRadius:16, color:"white", outline:"none", transition:"border-color 0.2s" }}/>
          ))}
        </div>
        {error && <p style={{ color:"#FF6B6B", fontSize:"0.85rem", marginBottom:16, textAlign:"center" }}>{error}</p>}
        <Btn onClick={verifyOtp} loading={loading} white>Vérifier le code</Btn>
        <div style={{ textAlign:"center", marginTop:24 }}>
          {timer > 0
            ? <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.85rem" }}>Renvoyer dans {Math.floor(timer/60)}:{String(timer%60).padStart(2,"0")}</p>
            : <button onClick={sendOtp} style={{ background:"none", border:"none", color:"#005F2D", fontWeight:600, cursor:"pointer", fontSize:"0.9rem" }}>Renvoyer le code</button>}
        </div>
      </div>
    </div>
  );

  /* ── Step 2 ── */
  if (step === 2) return (
    <div style={wrap}>
      <Header onBack={() => setStep(1)}/><ProgressBar/>
      <div style={{ flex:1, paddingTop:24, display:"flex", flexDirection:"column" }}>
        <h1 style={{ color:"white", fontWeight:800, fontSize:"1.5rem", marginBottom:4 }}>Informations personnelles</h1>
        <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.82rem", marginBottom:24 }}>Étape 1 sur 4</p>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <FSelect label="Pays de résidence" value={pays} onChange={setPays} options={PAYS}/>
          <FInput label="Date de naissance" type="date" value={dob} onChange={setDob}
            max={new Date(Date.now()-18*365.25*86400000).toISOString().split("T")[0]}/>
          <FSelect label="Source de revenus" value={source} onChange={setSource} options={SOURCES}/>
          <FInput label="Code promo (optionnel)" placeholder="KT2024" value={promo} onChange={setPromo}/>
          <label style={{ display:"flex", gap:12, alignItems:"flex-start", background:"#2A2A35", borderRadius:16, padding:16, cursor:"pointer" }}>
            <input type="checkbox" checked={fatca} onChange={(e) => setFatca(e.target.checked)}
              style={{ width:20, height:20, marginTop:2, accentColor:"#005F2D", flexShrink:0 }}/>
            <span style={{ color:"rgba(255,255,255,0.7)", fontSize:"0.82rem", lineHeight:1.5 }}>
              Je confirme ne pas être soumis(e) aux obligations fiscales américaines (FATCA).
            </span>
          </label>
          {error && <p style={{ color:"#FF6B6B", fontSize:"0.85rem" }}>{error}</p>}
          <Btn onClick={() => { if(!pays||!dob||!source){setError("Champs requis");return;} save(2); }} loading={loading} white>
            Continuer <ArrowRight size={18}/>
          </Btn>
        </div>
      </div>
    </div>
  );

  /* ── Step 3 ── */
  if (step === 3) return (
    <div style={wrap}>
      <Header onBack={() => setStep(2)}/><ProgressBar/>
      <div style={{ flex:1, paddingTop:24, display:"flex", flexDirection:"column" }}>
        <h1 style={{ color:"white", fontWeight:800, fontSize:"1.5rem", marginBottom:4 }}>Votre identité</h1>
        <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.82rem", marginBottom:24 }}>Étape 2 sur 4</p>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <FInput label="Prénom" placeholder="Mohammed" value={prenom} onChange={setPrenom}/>
            <FInput label="Nom" placeholder="Al-Rashid" value={nom} onChange={setNom}/>
          </div>
          <FSelect label="Sexe" value={sexe} onChange={setSexe} options={["Homme","Femme"]}/>
          <FSelect label="Situation familiale" value={situation} onChange={setSituation}
            options={["Célibataire","Marié(e)","Divorcé(e)","Veuf/Veuve"]}/>
          <FSelect label="Pays de naissance" value={paysNaissance} onChange={setPaysNaissance} options={PAYS}/>
          <FInput label="Ville de naissance" placeholder="Berlin" value={villeNaissance} onChange={setVilleNaissance}/>
          {error && <p style={{ color:"#FF6B6B", fontSize:"0.85rem" }}>{error}</p>}
          <Btn onClick={() => { if(!prenom||!nom||!sexe||!situation||!paysNaissance||!villeNaissance){setError("Tous les champs sont requis");return;} save(3); }} loading={loading} white>
            Continuer <ArrowRight size={18}/>
          </Btn>
        </div>
      </div>
    </div>
  );

  /* ── Step 4 ── */
  if (step === 4) return (
    <div style={wrap}>
      <Header onBack={() => setStep(3)}/><ProgressBar/>
      <div style={{ flex:1, paddingTop:24, display:"flex", flexDirection:"column" }}>
        <h1 style={{ color:"white", fontWeight:800, fontSize:"1.5rem", marginBottom:4 }}>Nationalité & Document</h1>
        <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.82rem", marginBottom:24 }}>Étape 3 sur 4</p>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <FSelect label="Nationalité" value={nationalite} onChange={setNationalite} options={PAYS}/>
          <FSelect label="Type de document d'identité" value={typeDoc} onChange={setTypeDoc} options={DOCS}/>
          <FInput label="Autorité de délivrance" placeholder="Ministère de l'Intérieur" value={autorite} onChange={setAutorite}/>
          {error && <p style={{ color:"#FF6B6B", fontSize:"0.85rem" }}>{error}</p>}
          <Btn onClick={() => { if(!nationalite||!typeDoc||!autorite){setError("Tous les champs sont requis");return;} save(4); }} loading={loading} white>
            Continuer <ArrowRight size={18}/>
          </Btn>
        </div>
      </div>
    </div>
  );

  /* ── Step 5 ── */
  if (step === 5) return (
    <div style={wrap}>
      <Header onBack={() => setStep(4)}/><ProgressBar/>
      <div style={{ flex:1, paddingTop:24, display:"flex", flexDirection:"column" }}>
        <h1 style={{ color:"white", fontWeight:800, fontSize:"1.5rem", marginBottom:4 }}>Coordonnées</h1>
        <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.82rem", marginBottom:24 }}>Étape 4 sur 4</p>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            <label style={{ color:"rgba(255,255,255,0.6)", fontSize:"0.8rem", fontWeight:500 }}>E-mail</label>
            <div style={{ height:56, background:"#1E1E28", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, color:"rgba(255,255,255,0.4)", fontSize:"1rem", padding:"0 16px", display:"flex", alignItems:"center" }}>
              {email}
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            <label style={{ color:"rgba(255,255,255,0.6)", fontSize:"0.8rem", fontWeight:500 }}>Numéro de téléphone</label>
            <div style={{ display:"flex", gap:8 }}>
              <div style={{ height:56, minWidth:72, background:"#2A2A35", border:"1px solid rgba(255,255,255,0.1)", borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:"0.9rem", fontWeight:600 }}>
                🇩🇪 +49
              </div>
              <input type="tel" placeholder="152 345 678" value={phone} onChange={(e) => setPhone(e.target.value)}
                style={{ flex:1, height:56, background:"#2A2A35", border:"1px solid rgba(255,255,255,0.1)", borderRadius:16, color:"white", fontSize:"1rem", padding:"0 16px", boxSizing:"border-box", outline:"none" }}/>
            </div>
          </div>
          {error && <p style={{ color:"#FF6B6B", fontSize:"0.85rem" }}>{error}</p>}
          <Btn onClick={() => { if(!phone){setError("Téléphone requis");return;} save(5); }} loading={loading} white>
            Finaliser mon inscription <ArrowRight size={18}/>
          </Btn>
        </div>
      </div>
    </div>
  );

  /* ── Done ── */
  return (
    <div style={wrap}>
      <Header/>
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", gap:20 }}>
        <div style={{ width:80, height:80, borderRadius:"50%", background:"rgba(0,95,45,0.2)", border:"2px solid #005F2D", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Check size={36} color="#005F2D"/>
        </div>
        <div>
          <h1 style={{ color:"white", fontWeight:800, fontSize:"1.75rem", marginBottom:10 }}>Bienvenue chez KT Bank !</h1>
          <p style={{ color:"rgba(255,255,255,0.55)", fontSize:"0.95rem", lineHeight:1.7 }}>
            Votre compte a été créé avec succès.
          </p>
          {iban && (
            <div style={{ background:"#2A2A35", borderRadius:16, padding:"16px 20px", marginTop:16, textAlign:"left" }}>
              <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"0.75rem", marginBottom:4 }}>Votre IBAN</p>
              <p style={{ color:"white", fontFamily:"monospace", fontSize:"0.9rem", letterSpacing:"0.05em" }}>{iban}</p>
              <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.75rem", marginTop:4 }}>BIC: KTAGDEFF</p>
            </div>
          )}
        </div>
        <Link href="/client/dashboard"
          style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, width:"100%", maxWidth:340, height:56, borderRadius:999, background:"#005F2D", color:"white", fontWeight:700, textDecoration:"none" }}>
          Accéder à mon espace <ArrowRight size={18}/>
        </Link>
        <Link href="/" style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.85rem", textDecoration:"none" }}>
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
