"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { LogIn, CheckCircle } from "lucide-react";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "16px 20px",
  borderRadius: 16,
  background: "#2A2A35",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "white",
  fontSize: "1rem",
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  color: "rgba(255,255,255,0.8)",
  fontSize: "0.875rem",
  fontWeight: 500,
  marginBottom: 8,
  display: "block",
};

const primaryBtn: React.CSSProperties = {
  width: "100%",
  padding: "18px",
  borderRadius: 9999,
  background: "#005F2D",
  color: "white",
  fontWeight: 700,
  fontSize: "1rem",
  border: "none",
  cursor: "pointer",
};

const disabledBtn: React.CSSProperties = {
  ...primaryBtn,
  background: "#2A2A35",
  color: "rgba(255,255,255,0.4)",
  cursor: "not-allowed",
};

const backBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "rgba(255,255,255,0.5)",
  fontSize: "0.9rem",
  cursor: "pointer",
  marginTop: 12,
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: "none" as const,
};

const PROGRESS = [0, 10, 20, 35, 55, 70];

function formatTimer(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  // Step 0
  const [email, setEmail] = useState("");

  // Step 1
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(120);
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Step 2
  const [residence, setResidence] = useState("Allemagne");
  const [dob, setDob] = useState("");
  const [howKnown, setHowKnown] = useState("");
  const [promoToggle, setPromoToggle] = useState(false);
  const [fatca, setFatca] = useState("non");

  // Step 3
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [birthCountry, setBirthCountry] = useState("");
  const [birthPlace, setBirthPlace] = useState("");

  // Step 4
  const [nationality, setNationality] = useState("France");
  const [docType, setDocType] = useState("Carte d'identité");
  const [docAuthority, setDocAuthority] = useState("");
  const [docError, setDocError] = useState(false);

  // Step 5
  const [phone, setPhone] = useState("");

  // OTP timer
  useEffect(() => {
    if (step !== 1) return;
    setTimer(120);
    const id = setInterval(() => setTimer((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [step]);

  const progress = done ? 100 : PROGRESS[step] ?? 0;

  const handleOtpChange = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 3) {
      otpRefs[idx + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs[idx - 1].current?.focus();
    }
  };

  const goNext = () => setStep((s) => s + 1);
  const goBack = () => setStep((s) => Math.max(0, s - 1));

  const handleStep4Next = () => {
    if (!docAuthority.trim()) {
      setDocError(true);
      return;
    }
    setDocError(false);
    goNext();
  };

  const handleFinish = () => setDone(true);

  // ── Shared header above step 1+
  const renderProgressHeader = () => (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ color: "#005F2D", fontSize: "0.8rem", fontWeight: 600, letterSpacing: 1 }}>
          DÉBUT
        </span>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>
          {progress}%
        </span>
      </div>
      <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 9999, overflow: "hidden" }}>
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "#005F2D",
            borderRadius: 9999,
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );

  // ── DONE screen
  if (done) {
    return (
      <div style={{ minHeight: "100vh", background: "#1C1C1E", display: "flex", flexDirection: "column", padding: "0 24px", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#005F2D", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <CheckCircle size={40} color="white" />
          </div>
          <h1 style={{ color: "white", fontSize: "1.75rem", fontWeight: 700, marginBottom: 16 }}>Demande soumise !</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1rem", lineHeight: 1.6, marginBottom: 40 }}>
            Un conseiller vous contactera sous 24h pour finaliser l&apos;ouverture de votre compte.
          </p>
          <Link href="/client" style={{ display: "block", width: "100%", padding: "18px", borderRadius: 9999, background: "#005F2D", color: "white", fontWeight: 700, fontSize: "1rem", textAlign: "center", textDecoration: "none" }}>
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#1C1C1E", display: "flex", flexDirection: "column", padding: "0 24px" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", width: "100%", paddingTop: 40, paddingBottom: 60 }}>

        {/* ── STEP 0: Email verification ── */}
        {step === 0 && (
          <div>
            {/* Icon */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#005F2D", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <LogIn size={36} color="white" />
              </div>
            </div>

            <h1 style={{ color: "white", fontSize: "2rem", fontWeight: 700, textAlign: "center", marginBottom: 12 }}>
              Bienvenue !
            </h1>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.95rem", textAlign: "center", lineHeight: 1.6, marginBottom: 40 }}>
              Nous allons vous guider à travers un processus simple d&apos;inscription. Cela prendra quelques minutes.
            </p>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Adresse e-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.de"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#005F2D")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
              />
            </div>

            <button
              onClick={goNext}
              disabled={!email.includes("@")}
              style={!email.includes("@") ? disabledBtn : primaryBtn}
            >
              Vérifier mon email
            </button>

            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem", textAlign: "center", marginTop: 20, lineHeight: 1.6 }}>
              En vous inscrivant, vous acceptez nos{" "}
              <span style={{ color: "#005F2D", cursor: "pointer" }}>Conditions d&apos;utilisation</span>
              {" "}et notre{" "}
              <span style={{ color: "#005F2D", cursor: "pointer" }}>Politique de confidentialité</span>.
            </p>

            <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
              <button style={{ background: "none", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 9999, padding: "8px 18px", color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", cursor: "pointer" }}>
                🌐 Français ∨
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 1: OTP ── */}
        {step === 1 && (
          <div>
            {renderProgressHeader()}
            <h1 style={{ color: "white", fontSize: "1.75rem", fontWeight: 700, textAlign: "center", marginBottom: 12 }}>
              Vérifiez votre boîte mail
            </h1>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.95rem", textAlign: "center", lineHeight: 1.6, marginBottom: 40 }}>
              Entrez le code de vérification envoyé à{" "}
              <span style={{ color: "white", fontWeight: 600 }}>{email}</span>
            </p>

            {/* OTP boxes */}
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 32 }}>
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={otpRefs[idx]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  style={{
                    width: 56,
                    height: 64,
                    borderRadius: 12,
                    background: "#2A2A35",
                    border: idx === 0 && !digit ? "1px solid #005F2D" : "1px solid rgba(255,255,255,0.12)",
                    color: "white",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    textAlign: "center",
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#005F2D")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = e.currentTarget.value ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.12)")}
                />
              ))}
            </div>

            {/* Timer */}
            <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", fontSize: "0.9rem", marginBottom: 32 }}>
              {timer > 0
                ? <>Code valide pendant <span style={{ color: "white", fontWeight: 600 }}>{formatTimer(timer)}</span></>
                : <span style={{ color: "#005F2D", cursor: "pointer" }}>Renvoyer le code</span>
              }
            </p>

            <button
              onClick={goNext}
              disabled={otp.some((d) => !d)}
              style={otp.some((d) => !d) ? disabledBtn : primaryBtn}
            >
              Continuer
            </button>

            <div style={{ textAlign: "center" }}>
              <button onClick={goBack} style={backBtnStyle}>Retour</button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Informations importantes ── */}
        {step === 2 && (
          <div>
            {renderProgressHeader()}
            <h1 style={{ color: "white", fontSize: "1.75rem", fontWeight: 700, textAlign: "center", marginBottom: 12 }}>
              Informations importantes
            </h1>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", textAlign: "center", lineHeight: 1.6, marginBottom: 36 }}>
              Donnez-nous d&apos;abord quelques informations importantes sur votre personne et votre lieu de résidence.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
              <div>
                <label style={labelStyle}>Pays de résidence</label>
                <select value={residence} onChange={(e) => setResidence(e.target.value)} style={selectStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#005F2D")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}>
                  <option value="Allemagne">Allemagne</option>
                  <option value="France">France</option>
                  <option value="Suisse">Suisse</option>
                  <option value="Autriche">Autriche</option>
                  <option value="Belgique">Belgique</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Date de naissance</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  style={{ ...inputStyle, colorScheme: "dark" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#005F2D")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                />
              </div>

              <div>
                <label style={labelStyle}>Comment nous avez-vous connus ?</label>
                <select value={howKnown} onChange={(e) => setHowKnown(e.target.value)} style={selectStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#005F2D")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}>
                  <option value="">Sélectionner...</option>
                  <option value="recommandation">Recommandation</option>
                  <option value="reseaux">Réseaux sociaux</option>
                  <option value="publicite">Publicité</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              {/* Promo toggle */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderRadius: 16, background: "#2A2A35", border: "1px solid rgba(255,255,255,0.12)" }}>
                <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.95rem" }}>Avez-vous un code promo ?</span>
                <button
                  onClick={() => setPromoToggle(!promoToggle)}
                  style={{
                    width: 44,
                    height: 24,
                    borderRadius: 9999,
                    background: promoToggle ? "#005F2D" : "rgba(255,255,255,0.15)",
                    border: "none",
                    cursor: "pointer",
                    position: "relative",
                    transition: "background 0.2s",
                  }}
                >
                  <span style={{
                    position: "absolute",
                    top: 2,
                    left: promoToggle ? 22 : 2,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "white",
                    transition: "left 0.2s",
                  }} />
                </button>
              </div>

              {/* FATCA radio */}
              <div style={{ padding: "16px 20px", borderRadius: 16, background: "#2A2A35", border: "1px solid rgba(255,255,255,0.12)" }}>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.875rem", fontWeight: 500, marginBottom: 12 }}>
                  Statut fiscal américain (FATCA)
                </p>
                <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="fatca"
                    value="non"
                    checked={fatca === "non"}
                    onChange={() => setFatca("non")}
                    style={{ accentColor: "#005F2D", width: 16, height: 16 }}
                  />
                  <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.9rem" }}>Non</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="fatca"
                    value="oui"
                    checked={fatca === "oui"}
                    onChange={() => setFatca("oui")}
                    style={{ accentColor: "#005F2D", width: 16, height: 16 }}
                  />
                  <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.9rem" }}>Oui, je suis résident fiscal aux USA</span>
                </label>
              </div>
            </div>

            <button onClick={goNext} style={primaryBtn}>Continuer</button>
            <div style={{ textAlign: "center" }}>
              <button onClick={goBack} style={backBtnStyle}>Retour</button>
            </div>
          </div>
        )}

        {/* ── STEP 3: À votre sujet ── */}
        {step === 3 && (
          <div>
            {renderProgressHeader()}
            <h1 style={{ color: "white", fontSize: "1.75rem", fontWeight: 700, textAlign: "center", marginBottom: 12 }}>
              À votre sujet
            </h1>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", textAlign: "center", lineHeight: 1.6, marginBottom: 36 }}>
              Veuillez saisir vos données personnelles avec précision, car elles seront vérifiées ultérieurement.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
              <div>
                <label style={labelStyle}>Prénom</label>
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Mohammed" style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#005F2D")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
              </div>
              <div>
                <label style={labelStyle}>Nom</label>
                <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Yilmaz" style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#005F2D")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
              </div>
              <div>
                <label style={labelStyle}>Sexe</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} style={selectStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#005F2D")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}>
                  <option value="">Sélectionner...</option>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Situation familiale</label>
                <select value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)} style={selectStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#005F2D")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}>
                  <option value="">Sélectionner...</option>
                  <option value="celibataire">Célibataire</option>
                  <option value="marie">Marié(e)</option>
                  <option value="divorce">Divorcé(e)</option>
                  <option value="veuf">Veuf/Veuve</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Pays de naissance</label>
                <select value={birthCountry} onChange={(e) => setBirthCountry(e.target.value)} style={selectStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#005F2D")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}>
                  <option value="">Sélectionner...</option>
                  <option value="france">France</option>
                  <option value="allemagne">Allemagne</option>
                  <option value="maroc">Maroc</option>
                  <option value="algerie">Algérie</option>
                  <option value="tunisie">Tunisie</option>
                  <option value="turquie">Turquie</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Lieu de naissance</label>
                <input value={birthPlace} onChange={(e) => setBirthPlace(e.target.value)} placeholder="Paris" style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#005F2D")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")} />
              </div>
            </div>

            <button onClick={goNext} style={primaryBtn}>Continuer</button>
            <div style={{ textAlign: "center" }}>
              <button onClick={goBack} style={backBtnStyle}>Retour</button>
            </div>
          </div>
        )}

        {/* ── STEP 4: Vos documents ── */}
        {step === 4 && (
          <div>
            {renderProgressHeader()}
            <h1 style={{ color: "white", fontSize: "1.75rem", fontWeight: 700, textAlign: "center", marginBottom: 12 }}>
              Au propos de vous
            </h1>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", textAlign: "center", lineHeight: 1.6, marginBottom: 36 }}>
              Renseignez-vous sur votre situation.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
              <div>
                <label style={labelStyle}>Nationalité</label>
                <select value={nationality} onChange={(e) => setNationality(e.target.value)} style={selectStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#005F2D")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}>
                  <option value="France">France</option>
                  <option value="Allemagne">Allemagne</option>
                  <option value="Maroc">Maroc</option>
                  <option value="Algérie">Algérie</option>
                  <option value="Tunisie">Tunisie</option>
                  <option value="Turquie">Turquie</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Type de document</label>
                <select value={docType} onChange={(e) => setDocType(e.target.value)} style={selectStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#005F2D")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}>
                  <option value="Carte d'identité">Carte d&apos;identité</option>
                  <option value="Passeport">Passeport</option>
                  <option value="Titre de séjour">Titre de séjour</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Autorité de délivrance</label>
                <input
                  value={docAuthority}
                  onChange={(e) => { setDocAuthority(e.target.value); if (e.target.value) setDocError(false); }}
                  placeholder="ex: Préfecture de Paris"
                  style={{
                    ...inputStyle,
                    borderColor: docError ? "#DC2626" : "rgba(255,255,255,0.12)",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = docError ? "#DC2626" : "#005F2D")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = docError ? "#DC2626" : "rgba(255,255,255,0.12)")}
                />
                {docError && (
                  <p style={{ color: "#DC2626", fontSize: "0.8rem", marginTop: 6 }}>
                    Ce champ est obligatoire.
                  </p>
                )}
              </div>
            </div>

            <button onClick={handleStep4Next} style={primaryBtn}>Continuer</button>
            <div style={{ textAlign: "center" }}>
              <button onClick={goBack} style={backBtnStyle}>Retour</button>
            </div>
          </div>
        )}

        {/* ── STEP 5: Coordonnées ── */}
        {step === 5 && (
          <div>
            {renderProgressHeader()}
            <h1 style={{ color: "white", fontSize: "1.75rem", fontWeight: 700, textAlign: "center", marginBottom: 12 }}>
              Veuillez vérifier vos coordonnées
            </h1>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", textAlign: "center", lineHeight: 1.6, marginBottom: 36 }}>
              Confirmez vos informations de contact pour finaliser votre inscription.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
              {/* Phone with flag selector */}
              <div>
                <label style={labelStyle}>Numéro de portable</label>
                <div style={{ display: "flex", alignItems: "center", borderRadius: 16, background: "#2A2A35", border: "1px solid rgba(255,255,255,0.12)", overflow: "hidden", height: 56 }}>
                  <div style={{ padding: "0 14px", borderRight: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 6, cursor: "pointer", flexShrink: 0, height: "100%" }}>
                    <span style={{ fontSize: "1.1rem" }}>🇩🇪</span>
                    <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem" }}>∨</span>
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.5)", padding: "0 10px", fontSize: "0.95rem", flexShrink: 0 }}>+49</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="170 1234567"
                    style={{ flex: 1, background: "transparent", border: "none", color: "white", fontSize: "0.95rem", outline: "none", fontFamily: "inherit", padding: "0 12px 0 0" }}
                  />
                  <button style={{ padding: "8px 14px", margin: "0 8px", borderRadius: 9999, background: "rgba(255,255,255,0.1)", border: "none", color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", cursor: "pointer", flexShrink: 0 }}>
                    Vérifier
                  </button>
                </div>
              </div>

              {/* reCAPTCHA placeholder */}
              <div style={{ padding: "16px 20px", borderRadius: 16, background: "#2A2A35", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 24, height: 24, borderRadius: 4, border: "2px solid rgba(255,255,255,0.3)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)" }}>✓</span>
                </div>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem" }}>Ich bin kein Roboter</span>
                <div style={{ marginLeft: "auto", textAlign: "center" }}>
                  <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", lineHeight: 1.3 }}>
                    <div>reCAPTCHA</div>
                    <div>Privacy · Terms</div>
                  </div>
                </div>
              </div>

              {/* Email (pre-filled, read-only) */}
              <div>
                <label style={labelStyle}>Adresse e-mail</label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  style={{ ...inputStyle, color: "rgba(255,255,255,0.4)", cursor: "not-allowed" }}
                />
              </div>
            </div>

            <button
              onClick={handleFinish}
              disabled={!phone.trim()}
              style={!phone.trim() ? disabledBtn : primaryBtn}
            >
              Continuer
            </button>
            <div style={{ textAlign: "center" }}>
              <button onClick={goBack} style={backBtnStyle}>Retour</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
