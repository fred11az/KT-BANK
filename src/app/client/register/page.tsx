"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  ChevronLeft,
  User,
  Mail,
  Phone,
  Globe,
  Calendar,
  CheckCircle,
  Upload,
  Shield,
  Star,
  TrendingUp,
  Award,
} from "lucide-react";

const ACCOUNT_TYPES = [
  {
    id: "giro",
    name: "GiroKonto",
    icon: <Star size={28} />,
    desc: "Compte courant halal sans intérêts",
    features: ["Aucun intérêt ribawi", "Carte Jetzz gratuite", "Virements SEPA illimités", "Application mobile"],
    color: "#005F2D",
    badge: "Populaire",
  },
  {
    id: "gold",
    name: "GoldKonto",
    icon: <Award size={28} />,
    desc: "Épargne adossée à l'or physique",
    features: ["Or physique certifié", "Rendement halal", "Stockage sécurisé", "Certificat de propriété"],
    color: "#C9A84C",
    badge: "Premium",
  },
  {
    id: "festgeld",
    name: "FestgeldKonto",
    icon: <TrendingUp size={28} />,
    desc: "Épargne à terme selon Mourabaha",
    features: ["Contrat Mourabaha", "Terme 6-36 mois", "Profit prévisible", "Capital garanti"],
    color: "#1D4ED8",
    badge: "Rentable",
  },
];

const NATIONALITIES = [
  "Allemande", "Française", "Turque", "Marocaine", "Algérienne", "Tunisienne",
  "Libanaise", "Égyptienne", "Saoudienne", "Pakistanaise", "Indonésienne", "Autre",
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nationality: "",
    dob: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const step1Valid =
    form.firstName && form.lastName && form.email && form.phone && form.nationality && form.dob;

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setUploaded(true);
    }, 1800);
  };

  const handleSubmit = () => {
    setTimeout(() => router.push("/client/dashboard"), 1000);
  };

  const steps = ["Informations personnelles", "Type de compte", "Vérification"];

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #003D1F 0%, #005F2D 40%, #007A3D 70%, #004D25 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background pattern */}
      <svg
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.04, pointerEvents: "none" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="islamic-reg" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <polygon points="30,0 60,15 60,45 30,60 0,45 0,15" fill="none" stroke="#C9A84C" strokeWidth="1" />
            <polygon points="30,10 50,20 50,40 30,50 10,40 10,20" fill="none" stroke="#C9A84C" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-reg)" />
      </svg>

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <Link href="/client" className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-3" style={{ background: "linear-gradient(135deg, #C9A84C, #E6C97A)" }}>
            <span className="text-xl font-bold" style={{ color: "#003D1F" }}>KT</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Ouvrir un compte</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(201,168,76,0.85)" }}>100% Halal • BaFin Régulé • Certifié Islamique</p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            {steps.map((label, i) => {
              const idx = i + 1;
              const active = idx === step;
              const done = idx < step;
              return (
                <div key={idx} className="flex items-center" style={{ flex: idx < steps.length ? 1 : "initial" }}>
                  <div className="flex flex-col items-center">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                      style={{
                        background: done ? "#C9A84C" : active ? "white" : "rgba(255,255,255,0.2)",
                        color: done ? "white" : active ? "#005F2D" : "rgba(255,255,255,0.6)",
                      }}
                    >
                      {done ? <CheckCircle size={16} /> : idx}
                    </div>
                    <span className="text-xs mt-1 text-center hidden sm:block" style={{ color: active ? "white" : "rgba(255,255,255,0.5)", maxWidth: 80 }}>
                      {label}
                    </span>
                  </div>
                  {idx < steps.length && (
                    <div className="flex-1 h-0.5 mx-2 mb-5 sm:mb-4" style={{ background: done ? "#C9A84C" : "rgba(255,255,255,0.2)" }} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${((step - 1) / 2) * 100}%`, background: "linear-gradient(90deg, #C9A84C, #E6C97A)" }}
            />
          </div>
          <p className="text-right text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>Étape {step} sur 3</p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-6 sm:p-8 shadow-2xl"
          style={{ background: "rgba(255,255,255,0.97)", border: "1px solid rgba(201,168,76,0.2)" }}
        >
          {/* STEP 1 */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold mb-1" style={{ color: "#005F2D" }}>Informations personnelles</h2>
              <p className="text-sm text-gray-500 mb-6">Veuillez renseigner vos informations d&apos;identité</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Prénom *</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="Mohammed"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none"
                      style={{ border: "1.5px solid #E5E7EB", color: "#111827" }}
                      onFocus={(e) => (e.target.style.borderColor = "#005F2D")}
                      onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Nom de famille *</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Yilmaz"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none"
                      style={{ border: "1.5px solid #E5E7EB", color: "#111827" }}
                      onFocus={(e) => (e.target.style.borderColor = "#005F2D")}
                      onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Adresse e-mail *</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="email@exemple.de"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none"
                      style={{ border: "1.5px solid #E5E7EB", color: "#111827" }}
                      onFocus={(e) => (e.target.style.borderColor = "#005F2D")}
                      onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Téléphone *</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+49 170 1234567"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none"
                      style={{ border: "1.5px solid #E5E7EB", color: "#111827" }}
                      onFocus={(e) => (e.target.style.borderColor = "#005F2D")}
                      onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Nationalité *</label>
                  <div className="relative">
                    <Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      name="nationality"
                      value={form.nationality}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none appearance-none"
                      style={{ border: "1.5px solid #E5E7EB", color: form.nationality ? "#111827" : "#9CA3AF" }}
                      onFocus={(e) => (e.target.style.borderColor = "#005F2D")}
                      onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                    >
                      <option value="">Sélectionner...</option>
                      {NATIONALITIES.map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">Date de naissance *</label>
                  <div className="relative">
                    <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      name="dob"
                      type="date"
                      value={form.dob}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm outline-none"
                      style={{ border: "1.5px solid #E5E7EB", color: "#111827" }}
                      onFocus={(e) => (e.target.style.borderColor = "#005F2D")}
                      onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                    />
                  </div>
                </div>
              </div>

              {/* Islamic certification badge */}
              <div className="mt-6 flex items-center gap-3 p-3 rounded-xl" style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                <Shield size={20} style={{ color: "#005F2D" }} />
                <div>
                  <p className="text-xs font-semibold" style={{ color: "#005F2D" }}>Certification Islamique</p>
                  <p className="text-xs text-gray-500">Toutes nos opérations sont certifiées conformes à la Charia par notre Conseil de surveillance islamique</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold mb-1" style={{ color: "#005F2D" }}>Choisir un type de compte</h2>
              <p className="text-sm text-gray-500 mb-6">Sélectionnez le produit bancaire halal adapté à vos besoins</p>

              <div className="space-y-4">
                {ACCOUNT_TYPES.map((acc) => (
                  <div
                    key={acc.id}
                    onClick={() => setSelectedAccount(acc.id)}
                    className="rounded-xl p-4 cursor-pointer transition-all"
                    style={{
                      border: `2px solid ${selectedAccount === acc.id ? acc.color : "#E5E7EB"}`,
                      background: selectedAccount === acc.id ? `${acc.color}08` : "white",
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${acc.color}15`, color: acc.color }}
                      >
                        {acc.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-900">{acc.name}</span>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ background: `${acc.color}15`, color: acc.color }}
                          >
                            {acc.badge}
                          </span>
                          {selectedAccount === acc.id && (
                            <CheckCircle size={16} className="ml-auto" style={{ color: acc.color }} />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{acc.desc}</p>
                        <div className="flex flex-wrap gap-2">
                          {acc.features.map((f) => (
                            <span key={f} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                              ✓ {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold mb-1" style={{ color: "#005F2D" }}>Vérification d&apos;identité</h2>
              <p className="text-sm text-gray-500 mb-6">Téléchargez votre pièce d&apos;identité pour finaliser l&apos;ouverture de compte</p>

              {/* Upload zone */}
              <div
                className="rounded-xl p-8 text-center mb-4 transition-all cursor-pointer"
                style={{
                  border: `2px dashed ${uploaded ? "#005F2D" : "#D1D5DB"}`,
                  background: uploaded ? "#F0FDF4" : "#F9FAFB",
                }}
                onClick={!uploading && !uploaded ? handleUpload : undefined}
              >
                {uploaded ? (
                  <div>
                    <CheckCircle size={40} className="mx-auto mb-2" style={{ color: "#005F2D" }} />
                    <p className="font-semibold" style={{ color: "#005F2D" }}>Document téléchargé avec succès</p>
                    <p className="text-sm text-gray-500 mt-1">carte_identite.jpg • 2.4 MB</p>
                  </div>
                ) : uploading ? (
                  <div>
                    <div
                      className="mx-auto mb-3"
                      style={{
                        width: 40, height: 40,
                        border: "3px solid #E5E7EB",
                        borderTop: "3px solid #005F2D",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                      }}
                    />
                    <p className="text-sm text-gray-600">Téléchargement en cours...</p>
                  </div>
                ) : (
                  <div>
                    <Upload size={40} className="mx-auto mb-2 text-gray-400" />
                    <p className="font-medium text-gray-700">Cliquez pour télécharger</p>
                    <p className="text-sm text-gray-400 mt-1">Carte d&apos;identité, Passeport ou Titre de séjour</p>
                    <p className="text-xs text-gray-400 mt-2">PNG, JPG, PDF • Max 10 MB</p>
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="rounded-xl p-4 mb-4" style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
                <p className="text-sm font-semibold text-gray-700 mb-3">Récapitulatif de la demande</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-500">Nom complet</span>
                  <span className="font-medium text-gray-900">{form.firstName || "—"} {form.lastName || "—"}</span>
                  <span className="text-gray-500">E-mail</span>
                  <span className="font-medium text-gray-900 truncate">{form.email || "—"}</span>
                  <span className="text-gray-500">Compte choisi</span>
                  <span className="font-medium" style={{ color: "#005F2D" }}>
                    {ACCOUNT_TYPES.find((a) => a.id === selectedAccount)?.name || "—"}
                  </span>
                </div>
              </div>

              {/* Confirmation checkbox */}
              <div className="flex items-start gap-3 p-3 rounded-xl mb-4" style={{ background: "#FFF9E6", border: "1px solid #F5E6A3" }}>
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  style={{ accentColor: "#005F2D", marginTop: 2 }}
                />
                <label htmlFor="agree" className="text-xs text-gray-700 cursor-pointer">
                  Je certifie que les informations fournies sont exactes et j&apos;accepte les{" "}
                  <span style={{ color: "#005F2D" }} className="font-semibold">Conditions Générales</span> et la{" "}
                  <span style={{ color: "#005F2D" }} className="font-semibold">Politique de Confidentialité</span> de KT Bank.
                </label>
              </div>

              {/* Islamic certification */}
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                <Shield size={18} style={{ color: "#005F2D" }} />
                <p className="text-xs" style={{ color: "#166534" }}>
                  <span className="font-semibold">Certifié Halal</span> — Aucun intérêt (riba) n&apos;est appliqué. Conforme à la Charia islamique.
                </p>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={step === 1 ? () => router.push("/client") : handleBack}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{ border: "1.5px solid #E5E7EB", color: "#6B7280", background: "white" }}
            >
              <ChevronLeft size={16} />
              {step === 1 ? "Retour à la connexion" : "Précédent"}
            </button>

            {step < 3 ? (
              <button
                onClick={handleNext}
                disabled={step === 1 ? !step1Valid : step === 2 ? !selectedAccount : false}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: (step === 1 ? !step1Valid : !selectedAccount) ? "#9CA3AF" : "linear-gradient(135deg, #005F2D, #007A3D)",
                  color: "white",
                  cursor: (step === 1 ? !step1Valid : !selectedAccount) ? "not-allowed" : "pointer",
                }}
              >
                Suivant
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!agreed || !uploaded}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: !agreed || !uploaded ? "#9CA3AF" : "linear-gradient(135deg, #005F2D, #007A3D)",
                  color: "white",
                  cursor: !agreed || !uploaded ? "not-allowed" : "pointer",
                  boxShadow: agreed && uploaded ? "0 4px 16px rgba(0,95,45,0.35)" : "none",
                }}
              >
                <CheckCircle size={16} />
                Soumettre la demande
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: "rgba(255,255,255,0.4)" }}>
          © 2024 KT Bank • BaFin Reguliert • Datenschutz
        </p>
      </div>

      <style jsx>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
