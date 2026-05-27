"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle } from "lucide-react";

export default function ClientLoginPage() {
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

    if (email === "client@ktbank.de" && password === "demo123") {
      router.push("/client/dashboard");
    } else {
      setError("Identifiants incorrects. Veuillez réessayer.");
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail("client@ktbank.de");
    setPassword("demo123");
    setError("");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #003D1F 0%, #005F2D 40%, #007A3D 70%, #004D25 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(201,168,76,0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(201,168,76,0.06) 0%, transparent 40%),
            radial-gradient(circle at 60% 80%, rgba(0,95,45,0.4) 0%, transparent 50%)`,
          pointerEvents: "none",
        }}
      />
      {/* Geometric SVG pattern */}
      <svg
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.04, pointerEvents: "none" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="islamic" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <polygon points="30,0 60,15 60,45 30,60 0,45 0,15" fill="none" stroke="#C9A84C" strokeWidth="1" />
            <polygon points="30,10 50,20 50,40 30,50 10,40 10,20" fill="none" stroke="#C9A84C" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic)" />
      </svg>

      <div className="w-full max-w-md relative z-10">
        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
            style={{ background: "linear-gradient(135deg, #C9A84C, #E6C97A)", boxShadow: "0 8px 32px rgba(201,168,76,0.4)" }}
          >
            <span className="text-3xl font-bold" style={{ color: "#003D1F" }}>KT</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-wide">KT Bank</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(201,168,76,0.9)" }}>
            Banque Islamique Certifiée • Deutsche Islamische Bank
          </p>
        </div>

        {/* Login Card */}
        <div
          className="rounded-2xl p-8 shadow-2xl"
          style={{
            background: "rgba(255,255,255,0.97)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(201,168,76,0.2)",
          }}
        >
          <h2 className="text-2xl font-bold mb-1" style={{ color: "#005F2D" }}>Connexion</h2>
          <p className="text-sm text-gray-500 mb-6">Accédez à votre espace client sécurisé</p>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg mb-4 text-sm" style={{ background: "#FEF2F2", color: "#DC2626", border: "1px solid #FCA5A5" }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>
                Adresse e-mail
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.de"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-sm outline-none transition-all"
                  style={{
                    border: "1.5px solid #E5E7EB",
                    background: "#F9FAFB",
                    color: "#111827",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#005F2D")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium" style={{ color: "#374151" }}>
                  Mot de passe
                </label>
                <Link href="/client/forgot-password" className="text-xs" style={{ color: "#005F2D" }}>
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-lg text-sm outline-none transition-all"
                  style={{
                    border: "1.5px solid #E5E7EB",
                    background: "#F9FAFB",
                    color: "#111827",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#005F2D")}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="rounded" style={{ accentColor: "#005F2D" }} />
              <label htmlFor="remember" className="text-sm text-gray-600">Se souvenir de moi</label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2"
              style={{
                background: loading ? "#9CA3AF" : "linear-gradient(135deg, #005F2D, #007A3D)",
                color: "white",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 4px 16px rgba(0,95,45,0.35)",
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTop: "2px solid white",
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  Connexion en cours...
                </>
              ) : (
                "Connexion"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">ou</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Create account */}
          <p className="text-center text-sm text-gray-600">
            Vous n&apos;avez pas de compte ?{" "}
            <Link href="/client/register" className="font-semibold" style={{ color: "#005F2D" }}>
              Créer un compte
            </Link>
          </p>
        </div>

        {/* Demo credentials card */}
        <div
          className="mt-4 rounded-xl p-4"
          style={{
            background: "rgba(201,168,76,0.15)",
            border: "1px solid rgba(201,168,76,0.35)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="flex items-start gap-3">
            <CheckCircle size={16} className="mt-0.5 flex-shrink-0" style={{ color: "#C9A84C" }} />
            <div className="flex-1">
              <p className="text-xs font-semibold mb-1" style={{ color: "#C9A84C" }}>Accès démo</p>
              <p className="text-xs text-white/80">Email: <span className="font-mono font-semibold text-white">client@ktbank.de</span></p>
              <p className="text-xs text-white/80">Mot de passe: <span className="font-mono font-semibold text-white">demo123</span></p>
              <button
                onClick={fillDemo}
                className="mt-2 text-xs px-3 py-1 rounded-full font-medium transition-all"
                style={{ background: "rgba(201,168,76,0.3)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.5)" }}
              >
                Remplir automatiquement
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs mt-6" style={{ color: "rgba(255,255,255,0.4)" }}>
          © 2024 KT Bank • Banque Islamique Certifiée • BaFin Reguliert
        </p>
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
