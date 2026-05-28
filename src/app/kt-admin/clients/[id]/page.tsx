"use client";
import { useEffect, useState } from "react";
import { useAdmin } from "../../layout";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, User, Briefcase, Home, Heart, Shield, CreditCard, Building } from "lucide-react";

type Profile = Record<string, unknown>;
type Account = { id: string; iban: string; type: string; currency: string; balance: number; status: string; kt_cards: { last4: string; expiry_month: number; expiry_year: number; type: string; status: string }[] };

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div style={{ background: "#1A1D27", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Icon size={16} color="#4CAF82" />
        <p style={{ color: "white", fontWeight: 600, fontSize: "0.9rem", margin: 0 }}>{title}</p>
      </div>
      <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px 24px" }}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: unknown }) {
  const display = value === null || value === undefined || value === "" ? "—"
    : typeof value === "boolean" ? (value ? "Oui" : "Non")
    : typeof value === "object" ? JSON.stringify(value, null, 2)
    : String(value);
  return (
    <div>
      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 3px" }}>{label}</p>
      <p style={{ color: "white", fontSize: "0.88rem", margin: 0, fontWeight: 500, wordBreak: "break-all" }}>{display}</p>
    </div>
  );
}

export default function ClientDetailPage() {
  const { token } = useAdmin();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    fetch(`/api/kt/admin/clients/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { setProfile(d.profile ?? null); setAccounts(d.accounts ?? []); setNewStatus(String(d.profile?.status ?? "")); setLoading(false); });
  }, [id, token]);

  async function updateStatus() {
    setSaving(true);
    await fetch(`/api/kt/admin/clients/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setSaving(false);
    setProfile((p) => p ? { ...p, status: newStatus } : p);
  }

  if (loading) return <div style={{ padding: 32, color: "rgba(255,255,255,0.4)" }}>Chargement…</div>;
  if (!profile) return <div style={{ padding: 32, color: "#FF6B6B" }}>Client introuvable</div>;

  const ayants = (profile.ayants_droit as unknown[]) ?? [];

  return (
    <div style={{ padding: 32, maxWidth: 900 }}>
      <button onClick={() => router.back()} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "0.85rem", marginBottom: 20, padding: 0 }}>
        <ChevronLeft size={16} /> Retour
      </button>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ color: "white", fontWeight: 800, fontSize: "1.5rem", margin: 0 }}>{String(profile.prenom ?? "—")} {String(profile.nom ?? "")}</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.88rem", margin: "4px 0 0" }}>{String(profile.email ?? "")}</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}
            style={{ height: 38, background: "#252836", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "white", fontSize: "0.85rem", padding: "0 12px", outline: "none" }}>
            <option value="active">Actif</option>
            <option value="suspended">Suspendu</option>
            <option value="pending">En attente</option>
          </select>
          <button onClick={updateStatus} disabled={saving}
            style={{ height: 38, padding: "0 16px", background: "#005F2D", color: "white", border: "none", borderRadius: 8, fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>
            {saving ? "…" : "Sauvegarder"}
          </button>
        </div>
      </div>

      <Section title="Identité personnelle" icon={User}>
        <Field label="Prénom" value={profile.prenom} />
        <Field label="Nom" value={profile.nom} />
        <Field label="Sexe" value={profile.sexe} />
        <Field label="Date de naissance" value={profile.date_naissance} />
        <Field label="Pays de naissance" value={profile.pays_naissance} />
        <Field label="Ville de naissance" value={profile.ville_naissance} />
        <Field label="Nationalité" value={profile.nationalite} />
        <Field label="Situation familiale" value={profile.situation_familiale} />
        <Field label="Type de document" value={profile.type_document} />
        <Field label="Autorité de délivrance" value={profile.autorite_document} />
      </Section>

      <Section title="Coordonnées" icon={Home}>
        <Field label="E-mail" value={profile.email} />
        <Field label="Téléphone" value={profile.telephone} />
        <Field label="Adresse" value={profile.adresse} />
        <Field label="Code postal" value={profile.code_postal} />
        <Field label="Ville" value={profile.ville} />
        <Field label="Pays de résidence" value={profile.pays_residence} />
      </Section>

      <Section title="Situation professionnelle" icon={Briefcase}>
        <Field label="Situation" value={profile.situation_professionnelle} />
        <Field label="Employeur / Entreprise" value={profile.nom_employeur} />
        <Field label="Revenu mensuel net" value={profile.revenu_mensuel} />
        <Field label="Source de revenus" value={profile.source_revenus} />
      </Section>

      <Section title="Situation familiale" icon={Heart}>
        <Field label="Nombre d'enfants" value={profile.nombre_enfants} />
        <Field label="Personnes à charge" value={profile.personnes_a_charge} />
      </Section>

      {ayants.length > 0 && (
        <div style={{ background: "#1A1D27", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <Shield size={16} color="#4CAF82" />
            <p style={{ color: "white", fontWeight: 600, fontSize: "0.9rem", margin: 0 }}>Ayants droit ({ayants.length})</p>
          </div>
          <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
            {ayants.map((ad: unknown, i: number) => {
              const a = ad as Record<string, string>;
              return (
                <div key={i} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "12px 16px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "8px 20px" }}>
                  <Field label="Prénom" value={a.prenom} />
                  <Field label="Nom" value={a.nom} />
                  <Field label="Lien" value={a.lien} />
                  <Field label="Date de naissance" value={a.date_naissance} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Section title="Conformité" icon={Shield}>
        <Field label="FATCA" value={profile.is_fatca} />
        <Field label="Code promo" value={profile.code_promo} />
        <Field label="KYC" value={profile.kyc_status} />
        <Field label="Étape d'inscription" value={`${profile.registration_step} / 7`} />
        <Field label="Email vérifié" value={profile.email_verified} />
        <Field label="Téléphone vérifié" value={profile.phone_verified} />
      </Section>

      {accounts.map((acc) => (
        <div key={acc.id} style={{ background: "#1A1D27", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <Building size={16} color="#4CAF82" />
            <p style={{ color: "white", fontWeight: 600, fontSize: "0.9rem", margin: 0 }}>Compte {acc.type} — {acc.currency}</p>
          </div>
          <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px 24px" }}>
            <Field label="IBAN" value={acc.iban} />
            <Field label="BIC" value="KTAGDEFF" />
            <Field label="Solde" value={`${Number(acc.balance).toFixed(2)} ${acc.currency}`} />
            <Field label="Statut" value={acc.status} />
          </div>
          {acc.kt_cards?.map((card, ci) => (
            <div key={ci} style={{ margin: "0 20px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 16 }}>
              <CreditCard size={20} color="#C9921A" />
              <div>
                <p style={{ color: "white", fontSize: "0.88rem", margin: 0, fontWeight: 600 }}>Carte {card.type} •••• {card.last4}</p>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem", margin: "2px 0 0" }}>Expire {String(card.expiry_month).padStart(2, "0")}/{card.expiry_year} — {card.status}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
