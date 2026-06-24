"use client";
import { useEffect, useState, useCallback } from "react";
import { useAdmin } from "../layout";
import { FileText, Send, Trash2, Check, X, Eye, RefreshCw, ChevronDown, User, Plus, Download, ArrowLeft } from "lucide-react";
import { DOC_TYPES, SUBMISSION_TYPES } from "@/lib/document-templates";

type Client = { id: string; prenom: string; nom: string; email: string; created_at: string };
type KtDoc = { id: string; client_id: string; type: string; title: string; description?: string; content_html?: string; file_url?: string; status: string; created_at: string };
type Submission = { id: string; client_id: string; type: string; title: string; file_url: string; file_name?: string; file_size?: number; status: string; notes?: string; created_at: string };

const STATUS_COLORS: Record<string, [string, string]> = {
  pending:  ["#FFF7ED", "#D97706"],
  approved: ["#F0FDF4", "#16A34A"],
  rejected: ["#FEF2F2", "#DC2626"],
  active:   ["#F0FDF4", "#005F2D"],
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" });
}
function fmtSize(bytes?: number) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function AdminDocumentsPage() {
  const { token } = useAdmin();
  const [clients, setClients] = useState<Client[]>([]);
  const [docs, setDocs] = useState<KtDoc[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"send" | "sent" | "received">("send");
  const [isMobile, setIsMobile] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  // Send form
  const [docType, setDocType] = useState<string>("");
  const [docTitle, setDocTitle] = useState("");
  const [docDesc, setDocDesc] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [loanType, setLoanType] = useState<"islamic" | "standard">("islamic");
  const [loanAmount, setLoanAmount] = useState("");
  const [loanDur, setLoanDur] = useState("24");
  const [loanPurpose, setLoanPurpose] = useState("");
  const [sending, setSending] = useState(false);
  const [presignedByBank, setPresignedByBank] = useState(false);
  const [clientSignatureSpace, setClientSignatureSpace] = useState(false);
  const [clientSearch, setClientSearch] = useState("");

  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  useEffect(() => {
    function check() { setIsMobile(window.innerWidth < 768); }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const load = useCallback((cid?: string) => {
    setLoading(true);
    const url = cid ? `/api/kt/admin/documents?client_id=${cid}` : "/api/kt/admin/documents";
    fetch(url, { headers })
      .then((r) => r.json())
      .then((d) => {
        if (d.clients) setClients(d.clients);
        setDocs(d.documents ?? []);
        setSubmissions(d.submissions ?? []);
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => { load(); }, [load]);

  function selectClient(c: Client) {
    setSelectedClient(c);
    load(c.id);
    setTab("send");
    if (isMobile) setShowDetail(true);
  }

  function goBack() {
    setShowDetail(false);
    setSelectedClient(null);
  }

  const selectedDocType = DOC_TYPES.find((d) => d.value === docType);
  const amt = Number(loanAmount) || 0;
  const dur = Number(loanDur) || 1;
  const rate = loanType === "islamic" ? 0 : 0.02 / 12;
  const monthly = loanType === "islamic"
    ? amt / dur
    : rate > 0 ? amt * rate * Math.pow(1 + rate, dur) / (Math.pow(1 + rate, dur) - 1) : amt / dur;
  const totalRepayment = monthly * dur;

  async function sendDoc() {
    if (!selectedClient || !docType || !docTitle) return;
    setSending(true);
    const body: Record<string, unknown> = { client_id: selectedClient.id, type: docType, title: docTitle, description: docDesc };
    if (selectedDocType?.needsLoan) {
      body.loan = { type: loanType, amount: amt, duration_months: dur, monthly_payment: monthly, total_repayment: totalRepayment, interest_rate: loanType === "islamic" ? 0 : 0.02, purpose: loanPurpose || undefined };
    }
    if (selectedDocType?.needsBody) body.body_html = bodyHtml;
    body.signature_options = { presignedByBank, clientSignatureSpace };

    const res = await fetch("/api/kt/admin/documents", { method: "POST", headers, body: JSON.stringify(body) });
    setSending(false);
    if (res.ok) {
      load(selectedClient.id);
      setTab("sent");
      setDocType(""); setDocTitle(""); setDocDesc(""); setBodyHtml(""); setLoanAmount(""); setLoanPurpose("");
      setPresignedByBank(false); setClientSignatureSpace(false);
    }
  }

  async function deleteDoc(id: string) {
    if (!confirm("Dokument löschen?")) return;
    await fetch("/api/kt/admin/documents", { method: "DELETE", headers, body: JSON.stringify({ id }) });
    load(selectedClient?.id);
  }

  async function updateSubmission(id: string, status: string, notes?: string) {
    await fetch(`/api/kt/admin/documents/${id}`, {
      method: "PATCH", headers,
      body: JSON.stringify({ status, notes, table: "submission" }),
    });
    load(selectedClient?.id);
  }

  function openDocBlob(html: string) {
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }

  function downloadDoc(html: string, _title: string) {
    openDocBlob(html);
  }

  const openDoc = openDocBlob;

  const filteredClients = clients.filter((c) => {
    const q = clientSearch.toLowerCase();
    return !q || `${c.prenom} ${c.nom} ${c.email}`.toLowerCase().includes(q);
  });

  const inp: React.CSSProperties = { width: "100%", height: 42, background: "#252836", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, color: "white", fontSize: "0.9rem", padding: "0 12px", outline: "none", boxSizing: "border-box" };
  const lbl: React.CSSProperties = { color: "rgba(255,255,255,0.4)", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, display: "block" };
  const card: React.CSSProperties = { background: "#1A1D27", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)", padding: "16px 18px", marginBottom: 10 };

  const showList = !isMobile || !showDetail;
  const showRight = !isMobile || showDetail;

  return (
    <div style={{ display: "flex", height: "100dvh", overflow: "hidden" }}>

      {/* ── Client list panel ── */}
      {showList && (
        <div style={{
          width: isMobile ? "100%" : 260,
          borderRight: isMobile ? "none" : "1px solid rgba(255,255,255,0.07)",
          display: "flex", flexDirection: "column", flexShrink: 0,
        }}>
          <div style={{ padding: "16px 14px 12px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <h2 style={{ color: "white", fontWeight: 700, fontSize: "0.95rem", margin: "0 0 10px" }}>Dokumente</h2>
            <input type="text" placeholder="Kunden suchen…" value={clientSearch} onChange={(e) => setClientSearch(e.target.value)}
              style={{ ...inp, height: 38, fontSize: "0.82rem" }} />
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {filteredClients.length === 0 && (
              <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.82rem", textAlign: "center", padding: 32 }}>Kein Kunde gefunden</p>
            )}
            {filteredClients.map((c) => (
              <button key={c.id} onClick={() => selectClient(c)}
                style={{
                  width: "100%", textAlign: "left",
                  background: selectedClient?.id === c.id && !isMobile ? "rgba(0,95,45,0.2)" : "transparent",
                  border: "none", borderBottom: "1px solid rgba(255,255,255,0.05)",
                  padding: "13px 14px", cursor: "pointer",
                  borderLeft: selectedClient?.id === c.id && !isMobile ? "3px solid #4CAF82" : "3px solid transparent",
                }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(0,95,45,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#4CAF82", fontSize: "0.72rem", fontWeight: 700 }}>
                    {c.prenom?.[0]}{c.nom?.[0]}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ color: "white", fontSize: "0.85rem", fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.prenom} {c.nom}</p>
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.email}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Detail panel ── */}
      {showRight && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", width: isMobile ? "100%" : undefined }}>
          {!selectedClient ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
              <User size={48} color="rgba(255,255,255,0.06)" />
              <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.9rem" }}>Wählen Sie einen Kunden</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div style={{ padding: "12px 18px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                {isMobile && (
                  <button onClick={goBack} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", padding: "4px 2px", display: "flex", flexShrink: 0 }}>
                    <ArrowLeft size={20} />
                  </button>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: "white", fontWeight: 700, fontSize: "0.92rem", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selectedClient.prenom} {selectedClient.nom}</p>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selectedClient.email}</p>
                </div>
                <button onClick={() => load(selectedClient.id)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: 6, flexShrink: 0 }}>
                  <RefreshCw size={15} />
                </button>
              </div>

              {/* Tabs */}
              <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0, overflowX: "auto" }}>
                {([
                  ["send",     "Senden"],
                  ["sent",     `Gesendet (${docs.length})`],
                  ["received", `Eingereicht (${submissions.length})`],
                ] as [typeof tab, string][]).map(([id, label]) => (
                  <button key={id} onClick={() => setTab(id)}
                    style={{
                      padding: isMobile ? "10px 14px" : "11px 20px",
                      background: "none", border: "none",
                      borderBottom: tab === id ? "2px solid #4CAF82" : "2px solid transparent",
                      color: tab === id ? "#4CAF82" : "rgba(255,255,255,0.4)",
                      fontWeight: 600, fontSize: isMobile ? "0.78rem" : "0.82rem",
                      cursor: "pointer", whiteSpace: "nowrap",
                    }}>
                    {label}
                  </button>
                ))}
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "14px 16px" : "20px 24px" }}>

                {/* ── SEND TAB ── */}
                {tab === "send" && (
                  <div style={{ maxWidth: 640 }}>
                    <div style={card}>
                      <p style={{ color: "white", fontWeight: 700, fontSize: "0.9rem", margin: "0 0 16px" }}>Neues Dokument senden</p>

                      <div style={{ marginBottom: 14 }}>
                        <label style={lbl}>Dokumenttyp</label>
                        <div style={{ position: "relative" }}>
                          <select value={docType} onChange={(e) => {
                            setDocType(e.target.value);
                            const t = DOC_TYPES.find((d) => d.value === e.target.value);
                            if (t) setDocTitle(t.label);
                          }} style={{ ...inp, appearance: "none", paddingRight: 36 }}>
                            <option value="">Typ auswählen…</option>
                            {DOC_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                          </select>
                          <ChevronDown size={14} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)", pointerEvents: "none" }} />
                        </div>
                        {selectedDocType && <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.72rem", marginTop: 5 }}>{selectedDocType.description}</p>}
                      </div>

                      <div style={{ marginBottom: 14 }}>
                        <label style={lbl}>Titel</label>
                        <input type="text" value={docTitle} onChange={(e) => setDocTitle(e.target.value)} placeholder="Dokumenttitel…" style={inp} />
                      </div>

                      <div style={{ marginBottom: 14 }}>
                        <label style={lbl}>Beschreibung (optional)</label>
                        <input type="text" value={docDesc} onChange={(e) => setDocDesc(e.target.value)} placeholder="Kurzbeschreibung…" style={inp} />
                      </div>

                      {/* Signature options */}
                      <div style={{ background: "#14161F", borderRadius: 10, padding: "14px 16px", marginBottom: 14, border: "1px solid rgba(255,255,255,0.07)" }}>
                        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.07em", marginBottom: 12 }}>Options de signature</p>
                        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginBottom: 10 }}>
                          <input type="checkbox" checked={presignedByBank} onChange={(e) => setPresignedByBank(e.target.checked)}
                            style={{ width: 16, height: 16, accentColor: "#4CAF82", cursor: "pointer" }} />
                          <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.83rem" }}>Pré-signé par KT Bank AG</span>
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                          <input type="checkbox" checked={clientSignatureSpace} onChange={(e) => setClientSignatureSpace(e.target.checked)}
                            style={{ width: 16, height: 16, accentColor: "#4CAF82", cursor: "pointer" }} />
                          <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.83rem" }}>Espace de signature pour le client</span>
                        </label>
                      </div>

                      {selectedDocType?.needsLoan && (
                        <div style={{ background: "#14161F", borderRadius: 10, padding: "14px 16px", marginBottom: 14, border: "1px solid rgba(255,255,255,0.07)" }}>
                          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 12 }}>Kreditparameter</p>
                          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10, marginBottom: 10 }}>
                            <div>
                              <label style={lbl}>Kreditart</label>
                              <select value={loanType} onChange={(e) => setLoanType(e.target.value as "islamic" | "standard")} style={{ ...inp, appearance: "none" }}>
                                <option value="islamic">Islamisch (0% — Mourabaha)</option>
                                <option value="standard">Standard (2% p. a.)</option>
                              </select>
                            </div>
                            <div>
                              <label style={lbl}>Betrag (€)</label>
                              <input type="number" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} placeholder="10000" style={inp} />
                            </div>
                            <div>
                              <label style={lbl}>Laufzeit (Monate)</label>
                              <select value={loanDur} onChange={(e) => setLoanDur(e.target.value)} style={{ ...inp, appearance: "none" }}>
                                {[6, 12, 18, 24, 36, 48, 60, 72, 84, 96, 108, 120, 144, 168, 180, 192, 216, 240, 264, 300, 320].map((m) => <option key={m} value={m}>{m} Monate</option>)}
                              </select>
                            </div>
                            <div>
                              <label style={lbl}>Kreditzweck</label>
                              <input type="text" value={loanPurpose} onChange={(e) => setLoanPurpose(e.target.value)} placeholder="z. B. Immobilien…" style={inp} />
                            </div>
                          </div>
                          {amt > 0 && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, background: "rgba(0,95,45,0.15)", borderRadius: 8, padding: "10px 14px" }}>
                              <span style={{ color: "#4CAF82", fontSize: "0.8rem" }}>Rate: <strong>{monthly.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €/Monat</strong></span>
                              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem" }}>Gesamt: <strong style={{ color: "white" }}>{totalRepayment.toLocaleString("de-DE", { minimumFractionDigits: 2 })} €</strong></span>
                            </div>
                          )}
                        </div>
                      )}

                      {selectedDocType?.needsBody && (
                        <div style={{ marginBottom: 14 }}>
                          <label style={lbl}>Inhalt (HTML)</label>
                          <textarea value={bodyHtml} onChange={(e) => setBodyHtml(e.target.value)} rows={8} placeholder="<p>Inhalt…</p>"
                            style={{ ...inp, height: "auto", padding: "10px 12px", fontFamily: "monospace", fontSize: "0.78rem", resize: "vertical", lineHeight: 1.6 }} />
                        </div>
                      )}

                      <button onClick={sendDoc} disabled={sending || !docType || !docTitle}
                        style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 22px", background: docType && docTitle ? "#005F2D" : "rgba(0,95,45,0.3)", border: "none", borderRadius: 10, color: "white", fontWeight: 700, fontSize: "0.9rem", cursor: docType && docTitle ? "pointer" : "not-allowed", width: isMobile ? "100%" : "auto", justifyContent: "center" }}>
                        <Send size={15} /> {sending ? "Senden…" : "Dokument senden"}
                      </button>
                    </div>
                  </div>
                )}

                {/* ── SENT DOCS TAB ── */}
                {tab === "sent" && (
                  <div>
                    {loading ? (
                      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.85rem", textAlign: "center", padding: 32 }}>Laden…</p>
                    ) : docs.length === 0 ? (
                      <div style={{ textAlign: "center", padding: 48 }}>
                        <FileText size={36} color="rgba(255,255,255,0.1)" style={{ display: "block", margin: "0 auto 12px" }} />
                        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.85rem" }}>Noch keine gesendeten Dokumente</p>
                      </div>
                    ) : docs.map((doc) => (
                      <div key={doc.id} style={card}>
                        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                          <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(0,95,45,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <FileText size={16} color="#4CAF82" />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ color: "white", fontWeight: 700, fontSize: "0.88rem", margin: "0 0 3px" }}>{doc.title}</p>
                            {doc.description && <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.74rem", margin: "0 0 8px" }}>{doc.description}</p>}
                            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.68rem", margin: "0 0 10px" }}>{fmtDate(doc.created_at)}</p>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                              {doc.content_html && (
                                <button onClick={() => openDoc(doc.content_html!)}
                                  style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", background: "rgba(0,95,45,0.2)", border: "1px solid rgba(0,95,45,0.4)", borderRadius: 8, color: "#4CAF82", fontSize: "0.78rem", cursor: "pointer" }}>
                                  <Eye size={12} /> Anzeigen
                                </button>
                              )}
                              {doc.content_html && (
                                <button onClick={() => downloadDoc(doc.content_html!, doc.title)}
                                  style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", background: "rgba(0,95,45,0.15)", border: "1px solid rgba(0,95,45,0.3)", borderRadius: 8, color: "#4CAF82", fontSize: "0.78rem", cursor: "pointer" }}>
                                  <Download size={12} /> Herunterladen
                                </button>
                              )}
                              {doc.file_url && (
                                <a href={doc.file_url} target="_blank" rel="noopener noreferrer"
                                  style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", background: "rgba(0,95,45,0.2)", border: "1px solid rgba(0,95,45,0.4)", borderRadius: 8, color: "#4CAF82", fontSize: "0.78rem", textDecoration: "none" }}>
                                  <Download size={12} /> Datei
                                </a>
                              )}
                              <button onClick={() => deleteDoc(doc.id)}
                                style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 8, color: "#F87171", cursor: "pointer", fontSize: "0.78rem" }}>
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ── SUBMISSIONS TAB ── */}
                {tab === "received" && (
                  <div>
                    {loading ? (
                      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.85rem", textAlign: "center", padding: 32 }}>Laden…</p>
                    ) : submissions.length === 0 ? (
                      <div style={{ textAlign: "center", padding: 48 }}>
                        <Plus size={36} color="rgba(255,255,255,0.1)" style={{ display: "block", margin: "0 auto 12px" }} />
                        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.85rem" }}>Keine eingereichten Dokumente</p>
                      </div>
                    ) : submissions.map((sub) => {
                      const subType = SUBMISSION_TYPES.find((t) => t.value === sub.type);
                      const [bg, color] = STATUS_COLORS[sub.status] ?? ["#F1F5F9", "#64748B"];
                      return (
                        <div key={sub.id} style={card}>
                          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                            <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <FileText size={16} color="rgba(255,255,255,0.4)" />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ color: "white", fontWeight: 700, fontSize: "0.88rem", margin: "0 0 2px" }}>{sub.title}</p>
                              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.72rem", margin: "0 0 6px" }}>{subType?.label ?? sub.type}</p>
                              <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                                <span style={{ background: bg, color, fontSize: "0.68rem", fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>
                                  {sub.status === "pending" ? "Ausstehend" : sub.status === "approved" ? "Genehmigt" : "Abgelehnt"}
                                </span>
                                <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.68rem" }}>{fmtDate(sub.created_at)}</span>
                                {sub.file_size && <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.68rem" }}>{fmtSize(sub.file_size)}</span>}
                              </div>
                              {sub.notes && <p style={{ color: "#F87171", fontSize: "0.72rem", margin: "0 0 8px" }}>{sub.notes}</p>}
                              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                <a href={sub.file_url} target="_blank" rel="noopener noreferrer"
                                  style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "white", fontSize: "0.78rem", textDecoration: "none" }}>
                                  <Eye size={12} /> Ansehen
                                </a>
                                {sub.status === "pending" && (
                                  <>
                                    <button onClick={() => updateSubmission(sub.id, "approved")}
                                      style={{ display: "flex", alignItems: "center", gap: 4, padding: "7px 12px", background: "rgba(0,95,45,0.2)", border: "1px solid rgba(0,95,45,0.4)", borderRadius: 8, color: "#4CAF82", fontSize: "0.78rem", cursor: "pointer" }}>
                                      <Check size={12} /> Genehmigen
                                    </button>
                                    <button onClick={() => {
                                      const notes = prompt("Ablehnungsgrund (optional):");
                                      updateSubmission(sub.id, "rejected", notes ?? undefined);
                                    }}
                                      style={{ display: "flex", alignItems: "center", gap: 4, padding: "7px 12px", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: 8, color: "#F87171", fontSize: "0.78rem", cursor: "pointer" }}>
                                      <X size={12} /> Ablehnen
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
