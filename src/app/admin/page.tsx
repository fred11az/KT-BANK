"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    if (email === "admin@ktbank.de" && password === "admin123") {
      router.push("/admin/dashboard");
    } else {
      setError("Accès refusé. Identifiants administrateur incorrects.");
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail("admin@ktbank.de");
    setPassword("admin123");
    setError("");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "#0F172A" }}
    >
      {/* Background decorations */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(201,168,76,0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(0,95,45,0.08) 0%, transparent 40%)`,
      }} />
      <div style={{
        position: "absolute", top: -200, right: -200, width: 500, height: 500,
        borderRadius: "50%", border: "1px solid rgba(201,168,76,0.06)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: -100, right: -100, width: 300, height: 300,
        borderRadius: "50%", border: "1px solid rgba(201,168,76,0.08)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -150, left: -150, width: 400, height: 400,
        borderRadius: "50%", border: "1px solid rgba(0,95,45,0.1)", pointerEvents: "none",
      }} />

      {/* Grid pattern */}
      <svg style={{ position: "absolute", inset: 0, opacity: 0.03, pointerEvents: "none" }} width="100%" height="100%">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#C9A84C" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 relative"
            style={{
              background: "linear-gradient(135deg, #1E293B, #334155)",
              border: "1px solid rgba(201,168,76,0.3)",
              boxShadow: "0 0 40px rgba(201,168,76,0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            <Shield size={36} style={{ color: "#C9A84C" }} />
            <div
              style={{
                position: "absolute", top: -2, right: -2, width: 12, height: 12,
                borderRadius: "50%", background: "#22C55E", border: "2px solid #0F172A",
              }}
            />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Accès Administrateur</h1>
          <p className="text-sm mt-2" style={{ color: "#64748B" }}>KT Bank — Portail d&apos;administration sécurisé</p>
        </div>

        {/* Security badge */}
        <div
          className="flex items-center gap-3 p-3 rounded-xl mb-5"
          style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.15)" }}
        >
          <Shield size={14} style={{ color: "#C9A84C" }} />
          <p className="text-xs" style={{ color: "#94A3B8" }}>
            Connexion chiffrée TLS 1.3 • Authentification à deux facteurs disponible
          </p>
        </div>

        {/* Login card */}
        <div
          className="rounded-2xl p-8 shadow-2xl"
          style={{
            background: "#1E293B",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          <h2 className="text-lg font-bold text-white mb-1">Connexion</h2>
          <p className="text-sm mb-6" style={{ color: "#64748B" }}>Identifiants administrateur requis</p>

          {error && (
            <div
              className="flex items-center gap-2 p-3 rounded-xl mb-4 text-sm"
              style={{ background: "rgba(239,68,68,0.1)", color: "#F87171", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#94A3B8" }}>
                Adresse e-mail
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#475569" }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ktbank.de"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: "#0F172A",
                    border: "1.5px solid #334155",
                    color: "white",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#C9A84C")}
                  onBlur={(e) => (e.target.style.borderColor = "#334155")}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#94A3B8" }}>
                Mot de passe
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#475569" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: "#0F172A",
                    border: "1.5px solid #334155",
                    color: "white",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#C9A84C")}
                  onBlur={(e) => (e.target.style.borderColor = "#334155")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#475569" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 mt-2"
              style={{
                background: loading ? "#334155" : "linear-gradient(135deg, #C9A84C, #E6C97A)",
                color: loading ? "#64748B" : "#003D1F",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 4px 20px rgba(201,168,76,0.3)",
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: 16, height: 16,
                    border: "2px solid #475569",
                    borderTop: "2px solid #64748B",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 0.8s linear infinite",
                  }} />
                  Vérification...
                </>
              ) : (
                <>
                  <Shield size={16} />
                  Accès sécurisé
                </>
              )}
            </button>
          </form>
        </div>

        {/* Demo credentials */}
        <div
          className="mt-4 rounded-xl p-4"
          style={{
            background: "rgba(30,41,59,0.8)",
            border: "1px solid rgba(201,168,76,0.15)",
          }}
        >
          <div className="flex items-start gap-3">
            <CheckCircle size={16} className="mt-0.5 flex-shrink-0" style={{ color: "#C9A84C" }} />
            <div className="flex-1">
              <p className="text-xs font-semibold mb-1" style={{ color: "#C9A84C" }}>Accès démo administrateur</p>
              <p className="text-xs" style={{ color: "#64748B" }}>
                Email: <span className="font-mono" style={{ color: "#94A3B8" }}>admin@ktbank.de</span>
              </p>
              <p className="text-xs" style={{ color: "#64748B" }}>
                Mot de passe: <span className="font-mono" style={{ color: "#94A3B8" }}>admin123</span>
              </p>
              <button
                onClick={fillDemo}
                className="mt-2 text-xs px-3 py-1 rounded-full font-medium transition-all"
                style={{
                  background: "rgba(201,168,76,0.1)",
                  color: "#C9A84C",
                  border: "1px solid rgba(201,168,76,0.25)",
                }}
              >
                Remplir automatiquement
              </button>
            </div>
          </div>
        </div>

        {/* Footer links */}
        <p className="text-center text-xs mt-5" style={{ color: "#334155" }}>
          © 2024 KT Bank Administration • BaFin Reguliert •{" "}
          <span style={{ color: "#475569" }}>Espace Client</span>
        </p>
      </div>

      <style jsx>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
