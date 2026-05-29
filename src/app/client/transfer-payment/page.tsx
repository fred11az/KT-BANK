"use client";
import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Copy, FileText, ArrowLeft, AlertCircle, Building2, Clock, Printer } from "lucide-react";

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

function TransferPaymentInner() {
  const params = useSearchParams();
  const transferId = params.get("id");

  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<{ prenom: string; nom: string; email: string } | null>(null);
  const [transfer, setTransfer] = useState<Transfer | null>(null);
  const [feePayment, setFeePayment] = useState<FeePayment | null>(null);
  const [loading, setLoading] = useState(true);
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

  return (
    <div style={{ minHeight: "100vh", background: "#14161F", fontFamily: "'Inter',sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#1A1D27", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "14px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => window.history.back()} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontSize: "0.82rem" }}>
          <ArrowLeft size={16} /> Zurück
        </button>
        <span style={{ color: "rgba(201,168,76,0.8)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", marginLeft: "auto" }}>KT BANK</span>
      </div>

      <div style={{ maxWidth: 540, margin: "0 auto", padding: "24px 20px 80px" }}>
        {loading ? (
          <div style={{ textAlign: "center", paddingTop: 80, color: "rgba(255,255,255,0.3)", fontSize: "0.85rem" }}>Wird geladen…</div>
        ) : error ? (
          <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 14, padding: "16px 20px", display: "flex", gap: 10, alignItems: "flex-start", marginTop: 24 }}>
            <AlertCircle size={18} color="#F87171" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ color: "#F87171", fontSize: "0.85rem", margin: 0 }}>{error}</p>
          </div>
        ) : transfer && feePayment ? (
          <>
            {/* Title */}
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ color: "white", fontWeight: 800, fontSize: "1.25rem", margin: "0 0 6px" }}>Gebühren bezahlen</h1>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.82rem", margin: 0, lineHeight: 1.6 }}>
                Übertragen Sie die Bearbeitungsgebühren auf das unten angegebene Konto, dann laden Sie Ihren Beleg hoch.
              </p>
            </div>

            {/* Amount to pay banner */}
            <div style={{ background: "rgba(217,119,6,0.12)", border: "1px solid rgba(217,119,6,0.3)", borderRadius: 14, padding: "14px 18px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 3px" }}>Zu zahlende Gebühr</p>
                <p style={{ color: "#FCD34D", fontWeight: 800, fontSize: "1.4rem", margin: 0 }}>{Number(transfer.fee_amount).toLocaleString("de-DE", { minimumFractionDigits: 2 })} EUR</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", margin: "0 0 2px" }}>Überweisungsbetrag</p>
                <p style={{ color: "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: "0.88rem", margin: 0 }}>{Number(transfer.amount).toLocaleString("de-DE", { minimumFractionDigits: 2 })} EUR → {transfer.to_name}</p>
              </div>
            </div>

            {/* Bank coordinates — all copyable */}
            <div style={{ background: "#1A1D27", borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)", padding: "18px 20px", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <Building2 size={14} color="#4CAF82" />
                <p style={{ color: "white", fontWeight: 700, fontSize: "0.88rem", margin: 0 }}>Bankverbindung für die Gebühren</p>
              </div>
              {feePayment.name && <CopyField label="Begünstigter" value={feePayment.name} />}
              {feePayment.iban && <CopyField label="IBAN" value={feePayment.iban} mono />}
              {feePayment.bic && <CopyField label="BIC / SWIFT" value={feePayment.bic} mono />}
              {feePayment.bank && <CopyField label="Bank" value={feePayment.bank} />}
              {feePayment.reference && <CopyField label="Verwendungszweck" value={feePayment.reference} />}
              <CopyField label="Betrag" value={`${Number(transfer.fee_amount).toFixed(2)} EUR`} />
            </div>

            {/* Proof upload */}
            <div style={{ background: "#1A1D27", borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)", padding: "18px 20px", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <FileText size={14} color="#4CAF82" />
                <p style={{ color: "white", fontWeight: 700, fontSize: "0.88rem", margin: 0 }}>Zahlungsnachweis</p>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>
                  Überweisungsreferenz <span style={{ color: "rgba(255,255,255,0.2)", fontWeight: 400, textTransform: "none" }}>(facultatif)</span>
                </label>
                <input type="text" placeholder="z.B. Überweisungsreferenz-2025"
                  value={paymentRef} onChange={(e) => setPaymentRef(e.target.value)}
                  style={{ width: "100%", height: 44, background: "#252836", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "white", fontSize: "0.88rem", padding: "0 14px", boxSizing: "border-box", outline: "none" }} />
              </div>

              <div>
                <label style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>
                  Zahlungsbeleg hochladen <span style={{ color: "#D97706", fontWeight: 700, textTransform: "none" }}>*</span>
                </label>
                <label style={{
                  display: "flex", alignItems: "center", gap: 10, minHeight: 52,
                  background: proofFile ? "rgba(0,95,45,0.1)" : "#252836",
                  border: `1px dashed ${proofFile ? "#4CAF82" : "rgba(255,255,255,0.12)"}`,
                  borderRadius: 10, padding: "12px 16px", cursor: "pointer", boxSizing: "border-box",
                }}>
                  <input type="file" accept="image/*,application/pdf" style={{ display: "none" }}
                    onChange={(e) => setProofFile(e.target.files?.[0] ?? null)} />
                  {proofFile
                    ? <><Check size={15} color="#4CAF82" /><span style={{ color: "#4CAF82", fontSize: "0.82rem", fontWeight: 600, wordBreak: "break-all" }}>{proofFile.name}</span></>
                    : <><FileText size={15} color="rgba(255,255,255,0.3)" /><span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.82rem" }}>Datei auswählen (JPG, PNG, PDF · max. 5 MB)</span></>
                  }
                </label>
              </div>
            </div>

            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", lineHeight: 1.6, marginBottom: 16, textAlign: "center" }}>
              Nach dem Einreichen prüft unser Team Ihre Zahlung. Ihr Virement wird innerhalb von 48 Stunden bearbeitet.
            </p>

            {!proofFile && (
              <p style={{ color: "#D97706", fontSize: "0.78rem", textAlign: "center", marginBottom: 10, margin: "0 0 10px" }}>
                ⚠ Ein Zahlungsbeleg ist erforderlich, bevor Sie einreichen können.
              </p>
            )}
            <button onClick={submit} disabled={submitting || !proofFile}
              style={{ width: "100%", height: 52, background: "#005F2D", border: "none", borderRadius: 14, color: "white", fontWeight: 700, fontSize: "0.95rem", cursor: (submitting || !proofFile) ? "not-allowed" : "pointer", opacity: (submitting || !proofFile) ? 0.5 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {submitting ? "Wird gesendet…" : <><Check size={17} /> Zahlungsbeleg einreichen</>}
            </button>
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
