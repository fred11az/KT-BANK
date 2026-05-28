"use client";
import { useEffect, useState, useRef } from "react";
import { useAdmin } from "../layout";
import { Send, RefreshCw, Edit3, X, ChevronRight } from "lucide-react";

type Message = { id: string; direction: "inbound" | "outbound"; from_email: string; to_email: string; subject: string; body_text: string; created_at: string };
type Thread = { id: string; subject: string; client_email: string; client_name: string; status: string; unread: boolean; last_message_at: string; kt_email_messages: Message[] };

export default function InboxPage() {
  const { token } = useAdmin();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selected, setSelected] = useState<Thread | null>(null);
  const [replyText, setReplyText] = useState("");
  const [composing, setComposing] = useState(false);
  const [compTo, setCompTo] = useState("");
  const [compSubject, setCompSubject] = useState("");
  const [compBody, setCompBody] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  function load(keepSelected = false) {
    setLoading(true);
    fetch("/api/kt/admin/inbox", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        const fetched: Thread[] = d.threads ?? [];
        setThreads(fetched);
        setLoading(false);
        if (keepSelected) {
          setSelected((prev) => prev ? (fetched.find((t) => t.id === prev.id) ?? prev) : null);
        }
      });
  }

  useEffect(() => { load(); }, []);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [selected]);

  async function sendReply() {
    if (!selected || !replyText.trim()) return;
    setSending(true);
    const subject = selected.subject.startsWith("Re:") ? selected.subject : `Re: ${selected.subject}`;
    await fetch("/api/kt/admin/inbox", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ to: selected.client_email, subject, body: replyText, thread_id: selected.id }),
    });
    setSending(false);
    setReplyText("");
    load(true);
  }

  async function sendCompose() {
    if (!compTo || !compSubject || !compBody) return;
    setSending(true);
    await fetch("/api/kt/admin/inbox", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ to: compTo, subject: compSubject, body: compBody }),
    });
    setSending(false);
    setComposing(false); setCompTo(""); setCompSubject(""); setCompBody("");
    load(true);
  }

  const selectedMsgs = selected?.kt_email_messages?.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) ?? [];

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>

      {/* Thread list */}
      <div style={{ width: 320, borderRight: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ color: "white", fontWeight: 700, fontSize: "1rem", margin: 0 }}>Messagerie</h2>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={load} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: 4 }}><RefreshCw size={15} /></button>
            <button onClick={() => setComposing(true)} style={{ display: "flex", alignItems: "center", gap: 6, background: "#005F2D", border: "none", color: "white", borderRadius: 8, padding: "6px 12px", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}>
              <Edit3 size={13} /> Composer
            </button>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {loading ? (
            <p style={{ padding: 20, color: "rgba(255,255,255,0.3)", fontSize: "0.85rem" }}>Chargement…</p>
          ) : threads.length === 0 ? (
            <p style={{ padding: 20, color: "rgba(255,255,255,0.3)", fontSize: "0.85rem", textAlign: "center" }}>Aucun message</p>
          ) : threads.map((t) => (
            <button key={t.id} onClick={() => setSelected(t)}
              style={{ width: "100%", textAlign: "left", background: selected?.id === t.id ? "rgba(0,95,45,0.15)" : "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "14px 16px", cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: "white", fontWeight: t.unread ? 700 : 500, fontSize: "0.85rem", margin: "0 0 3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {t.client_name || t.client_email}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", margin: "0 0 3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.subject}</p>
                  <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.72rem", margin: 0 }}>{t.client_email}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", margin: 0 }}>{new Date(t.last_message_at).toLocaleDateString("fr-FR")}</p>
                  {t.unread && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#005F2D", display: "block" }} />}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Message view */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {!selected ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
            <ChevronRight size={32} color="rgba(255,255,255,0.1)" />
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.9rem" }}>Sélectionnez une conversation</p>
          </div>
        ) : (
          <>
            <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <p style={{ color: "white", fontWeight: 700, fontSize: "0.95rem", margin: "0 0 2px" }}>{selected.subject}</p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem", margin: 0 }}>{selected.client_email}</p>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
              {selectedMsgs.map((msg) => {
                const isOut = msg.direction === "outbound";
                return (
                  <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: isOut ? "flex-end" : "flex-start" }}>
                    <div style={{ maxWidth: "75%", background: isOut ? "#005F2D" : "#252836", borderRadius: isOut ? "14px 14px 4px 14px" : "14px 14px 14px 4px", padding: "12px 16px" }}>
                      <p style={{ color: "white", fontSize: "0.88rem", margin: 0, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{msg.body_text}</p>
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.7rem", margin: "4px 4px 0" }}>
                      {isOut ? "Vous" : selected.client_name || selected.client_email} · {new Date(msg.created_at).toLocaleString("fr-FR")}
                    </p>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            <div style={{ padding: "12px 24px 20px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                <textarea
                  placeholder={`Répondre à ${selected.client_name || selected.client_email}…`}
                  value={replyText} onChange={(e) => setReplyText(e.target.value)}
                  rows={3}
                  style={{ flex: 1, background: "#252836", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "white", fontSize: "0.9rem", padding: 12, outline: "none", resize: "none", fontFamily: "inherit" }}
                />
                <button onClick={sendReply} disabled={sending || !replyText.trim()}
                  style={{ height: 44, width: 44, background: "#005F2D", border: "none", borderRadius: 10, color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: (!replyText.trim() || sending) ? 0.5 : 1, flexShrink: 0 }}>
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Compose modal */}
      {composing && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ background: "#1A1D27", borderRadius: 16, padding: 28, width: "100%", maxWidth: 500, border: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <p style={{ color: "white", fontWeight: 700, fontSize: "1rem", margin: 0 }}>Nouveau message</p>
              <button onClick={() => setComposing(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}><X size={20} /></button>
            </div>
            {[
              { label: "À", value: compTo, set: setCompTo, placeholder: "client@email.com" },
              { label: "Objet", value: compSubject, set: setCompSubject, placeholder: "Sujet du message" },
            ].map(({ label, value, set, placeholder }) => (
              <div key={label} style={{ marginBottom: 12 }}>
                <label style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", display: "block", marginBottom: 4 }}>{label}</label>
                <input value={value} onChange={(e) => set(e.target.value)} placeholder={placeholder}
                  style={{ width: "100%", height: 40, background: "#252836", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "white", fontSize: "0.9rem", padding: "0 12px", outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.78rem", display: "block", marginBottom: 4 }}>Message</label>
              <textarea value={compBody} onChange={(e) => setCompBody(e.target.value)} rows={5} placeholder="Votre message…"
                style={{ width: "100%", background: "#252836", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "white", fontSize: "0.9rem", padding: 12, outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />
            </div>
            <button onClick={sendCompose} disabled={sending}
              style={{ width: "100%", height: 44, background: "#005F2D", color: "white", border: "none", borderRadius: 10, fontWeight: 700, fontSize: "0.9rem", cursor: "pointer", opacity: sending ? 0.7 : 1 }}>
              {sending ? "Envoi…" : "Envoyer"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
