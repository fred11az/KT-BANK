"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type LoginStep = "email" | "otp";

const LOGIN_UI = {
  de: {
    welcomeTitle: "Willkommen\nbei KT Bank",
    welcomeSubtitle: "Melden Sie sich in Ihrem sicheren Kundenbereich an.",
    emailLabel: "E-Mail-Adresse",
    emailPlaceholder: "sie@beispiel.de",
    requestCode: "Code anfordern",
    loading: "Bitte warten…",
    noAccount: "Noch kein Konto?",
    registerLink: "Registrieren",
    otpTitle: "Anmeldecode",
    codeSentTo: "Code gesendet an",
    verifyBtn: "Anmelden",
    verifying: "Überprüfung…",
    resendIn: "Erneut senden in",
    resendBtn: "Code erneut senden",
    errorInvalidEmail: "Ungültige E-Mail-Adresse",
    errorDigits: "Bitte alle 4 Ziffern eingeben",
    errorGeneric: "Fehler",
    errorInvalidCode: "Ungültiger Code",
  },
  fr: {
    welcomeTitle: "Bienvenue\nchez KT Bank",
    welcomeSubtitle: "Connectez-vous à votre espace client sécurisé.",
    emailLabel: "Adresse e-mail",
    emailPlaceholder: "vous@exemple.fr",
    requestCode: "Demander un code",
    loading: "Veuillez patienter…",
    noAccount: "Pas encore de compte ?",
    registerLink: "S'inscrire",
    otpTitle: "Code de connexion",
    codeSentTo: "Code envoyé à",
    verifyBtn: "Se connecter",
    verifying: "Vérification…",
    resendIn: "Renvoyer dans",
    resendBtn: "Renvoyer le code",
    errorInvalidEmail: "Adresse e-mail invalide",
    errorDigits: "Veuillez saisir les 4 chiffres",
    errorGeneric: "Erreur",
    errorInvalidCode: "Code invalide",
  },
  en: {
    welcomeTitle: "Welcome\nto KT Bank",
    welcomeSubtitle: "Sign in to your secure client area.",
    emailLabel: "Email address",
    emailPlaceholder: "you@example.com",
    requestCode: "Request code",
    loading: "Please wait…",
    noAccount: "Don't have an account?",
    registerLink: "Register",
    otpTitle: "Login code",
    codeSentTo: "Code sent to",
    verifyBtn: "Sign in",
    verifying: "Verifying…",
    resendIn: "Resend in",
    resendBtn: "Resend code",
    errorInvalidEmail: "Invalid email address",
    errorDigits: "Please enter all 4 digits",
    errorGeneric: "Error",
    errorInvalidCode: "Invalid code",
  },
  ar: {
    welcomeTitle: "مرحباً بك\nفي KT Bank",
    welcomeSubtitle: "سجّل الدخول إلى منطقتك الآمنة.",
    emailLabel: "البريد الإلكتروني",
    emailPlaceholder: "you@example.com",
    requestCode: "طلب رمز",
    loading: "يرجى الانتظار…",
    noAccount: "ليس لديك حساب؟",
    registerLink: "التسجيل",
    otpTitle: "رمز تسجيل الدخول",
    codeSentTo: "تم إرسال الرمز إلى",
    verifyBtn: "تسجيل الدخول",
    verifying: "جارٍ التحقق…",
    resendIn: "إعادة الإرسال خلال",
    resendBtn: "إعادة إرسال الرمز",
    errorInvalidEmail: "بريد إلكتروني غير صالح",
    errorDigits: "يرجى إدخال الأرقام الأربعة",
    errorGeneric: "خطأ",
    errorInvalidCode: "رمز غير صالح",
  },
  tr: {
    welcomeTitle: "KT Bank'a\nhoş geldiniz",
    welcomeSubtitle: "Güvenli müşteri alanınıza giriş yapın.",
    emailLabel: "E-posta adresi",
    emailPlaceholder: "siz@ornek.com",
    requestCode: "Kod iste",
    loading: "Lütfen bekleyin…",
    noAccount: "Hesabınız yok mu?",
    registerLink: "Kaydol",
    otpTitle: "Giriş kodu",
    codeSentTo: "Kod gönderildi:",
    verifyBtn: "Giriş yap",
    verifying: "Doğrulanıyor…",
    resendIn: "Yeniden gönder:",
    resendBtn: "Kodu yeniden gönder",
    errorInvalidEmail: "Geçersiz e-posta adresi",
    errorDigits: "Lütfen 4 rakamı girin",
    errorGeneric: "Hata",
    errorInvalidCode: "Geçersiz kod",
  },
  es: {
    welcomeTitle: "Bienvenido\na KT Bank",
    welcomeSubtitle: "Inicia sesión en tu área de cliente segura.",
    emailLabel: "Correo electrónico",
    emailPlaceholder: "tu@ejemplo.com",
    requestCode: "Solicitar código",
    loading: "Por favor espera…",
    noAccount: "¿No tienes cuenta?",
    registerLink: "Registrarse",
    otpTitle: "Código de acceso",
    codeSentTo: "Código enviado a",
    verifyBtn: "Iniciar sesión",
    verifying: "Verificando…",
    resendIn: "Reenviar en",
    resendBtn: "Reenviar código",
    errorInvalidEmail: "Dirección de correo inválida",
    errorDigits: "Por favor ingresa los 4 dígitos",
    errorGeneric: "Error",
    errorInvalidCode: "Código inválido",
  },
  it: {
    welcomeTitle: "Benvenuto\nin KT Bank",
    welcomeSubtitle: "Accedi alla tua area clienti sicura.",
    emailLabel: "Indirizzo e-mail",
    emailPlaceholder: "tu@esempio.it",
    requestCode: "Richiedi codice",
    loading: "Attendere prego…",
    noAccount: "Non hai un account?",
    registerLink: "Registrati",
    otpTitle: "Codice di accesso",
    codeSentTo: "Codice inviato a",
    verifyBtn: "Accedi",
    verifying: "Verifica in corso…",
    resendIn: "Reinvia tra",
    resendBtn: "Reinvia codice",
    errorInvalidEmail: "Indirizzo e-mail non valido",
    errorDigits: "Inserisci tutte e 4 le cifre",
    errorGeneric: "Errore",
    errorInvalidCode: "Codice non valido",
  },
  pt: {
    welcomeTitle: "Bem-vindo\nao KT Bank",
    welcomeSubtitle: "Inicie sessão na sua área de cliente segura.",
    emailLabel: "Endereço de e-mail",
    emailPlaceholder: "voce@exemplo.pt",
    requestCode: "Solicitar código",
    loading: "Por favor aguarde…",
    noAccount: "Não tem uma conta?",
    registerLink: "Registar",
    otpTitle: "Código de acesso",
    codeSentTo: "Código enviado para",
    verifyBtn: "Entrar",
    verifying: "A verificar…",
    resendIn: "Reenviar em",
    resendBtn: "Reenviar código",
    errorInvalidEmail: "Endereço de e-mail inválido",
    errorDigits: "Por favor insira os 4 dígitos",
    errorGeneric: "Erro",
    errorInvalidCode: "Código inválido",
  },
  nl: {
    welcomeTitle: "Welkom\nbij KT Bank",
    welcomeSubtitle: "Log in op uw beveiligde klantenomgeving.",
    emailLabel: "E-mailadres",
    emailPlaceholder: "u@voorbeeld.nl",
    requestCode: "Code aanvragen",
    loading: "Even geduld…",
    noAccount: "Nog geen account?",
    registerLink: "Registreren",
    otpTitle: "Inlogcode",
    codeSentTo: "Code verzonden naar",
    verifyBtn: "Inloggen",
    verifying: "Verifiëren…",
    resendIn: "Opnieuw verzenden over",
    resendBtn: "Code opnieuw verzenden",
    errorInvalidEmail: "Ongeldig e-mailadres",
    errorDigits: "Voer alle 4 cijfers in",
    errorGeneric: "Fout",
    errorInvalidCode: "Ongeldige code",
  },
} as const;

type LUILang = keyof typeof LOGIN_UI;

function getLUI(lang: string) {
  if (lang in LOGIN_UI) return LOGIN_UI[lang as LUILang];
  if ("en" in LOGIN_UI) return LOGIN_UI["en"];
  return LOGIN_UI["de"];
}

export default function LoginPage() {
  const { lang } = useLanguage();
  const ui = getLUI(lang);

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
      setError(ui.errorInvalidEmail);
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch("/api/kt/login", {
      method: "POST",
      body: JSON.stringify({ email, lang }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || ui.errorGeneric); return; }
    setStep("otp");
  }

  async function verifyLogin() {
    const code = otp.join("");
    if (code.length < 4) { setError(ui.errorDigits); return; }
    setLoading(true);
    setError("");
    const res = await fetch("/api/kt/client/login-verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error || ui.errorInvalidCode); return; }
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
          {ui.welcomeTitle.split("\n").map((line, i, arr) => (
            <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
          ))}
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9rem", marginBottom: 40, lineHeight: 1.6 }}>
          {ui.welcomeSubtitle}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>{ui.emailLabel}</label>
            <input
              type="email"
              placeholder={ui.emailPlaceholder}
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
            {loading ? ui.loading : <><span>{ui.requestCode}</span><ArrowRight size={18} /></>}
          </button>
        </div>

        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem", marginTop: "auto", textAlign: "center", paddingTop: 32 }}>
          {ui.noAccount}{" "}
          <Link href="/client/register" style={{ color: "#C9A84C", fontWeight: 600, textDecoration: "none" }}>{ui.registerLink}</Link>
        </p>
      </div>
    </div>
  );

  return (
    <div style={wrap}>
      <Header onBack={() => { setStep("email"); setOtp(["", "", "", ""]); setError(""); }} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingTop: 32 }}>
        <h1 style={{ color: "white", fontWeight: 800, fontSize: "1.75rem", marginBottom: 8 }}>{ui.otpTitle}</h1>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem", marginBottom: 4, lineHeight: 1.6 }}>
          {ui.codeSentTo}
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
          {loading ? ui.verifying : ui.verifyBtn}
        </button>

        <div style={{ textAlign: "center" }}>
          {timer > 0
            ? <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem" }}>{ui.resendIn} {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}</p>
            : <button onClick={requestOtp} style={{ background: "none", border: "none", color: "#C9A84C", fontWeight: 600, cursor: "pointer", fontSize: "0.9rem" }}>{ui.resendBtn}</button>}
        </div>
      </div>
    </div>
  );
}
