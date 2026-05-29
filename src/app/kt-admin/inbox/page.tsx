"use client";
import { useEffect, useState, useRef } from "react";
import { useAdmin } from "../layout";
import { Send, RefreshCw, Edit3, X, ArrowLeft, MessageSquare } from "lucide-react";

type Message = {
  id: string;
  direction: "inbound" | "outbound";
  from_email: string;
  to_email: string;
  subject: string;
  body_text: string;
  created_at: string;
};
type Thread = {
  id: string;
  subject: string;
  client_email: string;
  client_name: string;
  status: string;
  unread: boolean;
  message_count: number;
  last_message_at: string;
  kt_email_messages: Message[];
};

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
  const [isMobile, setIsMobile] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function check() { setIsMobile(window.innerWidth < 768); }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selected?.id, showChat]);

  function selectThread(t: Thread) {
    setSelected(t);
    if (isMobile) setShowChat(true);

    if (t.unread) {
      fetch("/api/kt/admin/inbox", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ thread_id: t.id }),
      });
      setThreads((prev) => prev.map((th) => th.id === t.id ? { ...th, unread: false } : th));
      setSelected({ ...t, unread: false });
    }
  }

  function backToList() {
    setShowChat(false);
    setSelected(null);
  }

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

  const selectedMsgs = (selected?.kt_email_messages ?? [])
    .slice()
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  const unreadCount = threads.filter((t) => t.unread).length;

  /* On mobile: show either the list panel OR the chat panel */
  const showListPanel = !isMobile || !showChat;
  const showChatPanel = !isMobile || showChat;

  /* Container height: account for the 52px mobile topbar added by layout */
  const containerH = isMobile ? "calc(100dvh - 52px)" : "100dvh";

  return (
    <div style={{ display: "flex", height: containerH, overflow: "hidden" }}>

      {/* ── Thread list panel ── */}
      {showListPanel && (
        <div style={{
          width: isMobile ? "100%" : 320,
          borderRight: isMobile ? "none" : "1px solid rgba(255,255,255,0.07)",
          display: "flex", flexDirection: "column", flexShrink: 0,
        }}>
          {/* Header */}
          <div style={{ padding: "14px 16px 12px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h2 style={{ color: "white", fontWeight: 700, fontSize: "1rem", margin: 0 }}>Messagerie</h2>
              {unreadCount > 0 && (
                <span style={{ background: "#005F2D", color: "white", fontSize: "0.7rem", fontWeight: 700, borderRadius: 20, padding: "2px 8px", lineHeight: 1.6 }}>
                  {unreadCount}
                </span>
              )}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => load()} title="Actualiser"
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: 6, borderRadius: 8, display: "flex" }}>
                <RefreshCw size={15} />
              </button>
              <button onClick={() => setComposing(true)}
                style={{ display: "flex", alignItems: "center", gap: 6, background: "#005F2D", border: "none", color: "white", borderRadius: 8, padding: "7px 12px", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}>
                <Edit3 size={13} /> Composer
              </button>
            </div>
          </div>

          {/* Thread rows */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {loading ? (
              <p style={{ padding: 24, color: "rgba(255,255,255,0.3)", fontSize: "0.85rem", textAlign: "center" }}>Chargement…</p>
            ) : threads.length === 0 ? (
              <div style={{ padding: 48, textAlign: "center" }}>
                <MessageSquare size={36} color="rgba(255,255,255,0.1)" style={{ marginBottom: 12 }} />
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.85rem", margin: 0 }}>Aucun message</p>
              </div>
            ) : threads.map((t) => {
              const msgCount = t.kt_email_messages?.length ?? t.message_count ?? 0;
              const isActive = selected?.id === t.id && !isMobile;
              return (
                <button key={t.id} onClick={() => selectThread(t)}
                  style={{
                    width: "100%", textAlign: "left",
                    background: isActive ? "rgba(0,95,45,0.18)" : "transparent",
                    border: "none", borderBottom: "1px solid rgba(255,255,255,0.05)",
                    padding: "13px 16px", cursor: "pointer",
                    borderLeft: t.unread ? "3px solid #4CAF82" : "3px solid transparent",
                  }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: "white", fontWeight: t.unread ? 700 : 500, fontSize: "0.85rem", margin: "0 0 3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {t.client_name || t.client_email}
                      </p>
                      <p style={{ color: t.unread ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.4)", fontSize: "0.78rem", margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {t.subject}
                      </p>
                      <p style={{ color: "rgba(255,255,255,0.22)", fontSize: "0.7rem", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {t.client_email}
                      </p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5, flexShrink: 0 }}>
                      <p style={{ color: "rgba(255,255,255,0.28)", fontSize: "0.68rem", margin: 0 }}>
                        {new Date(t.last_message_at).toLocaleDateString("fr-FR")}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        {msgCount > 0 && (
                          <span style={{ color: "rgba(255,255,255,0.28)", fontSize: "0.68rem" }}>
                            {msgCount}
                          </span>
                        )}
                        {t.unread ? (
                          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4CAF82", display: "block", flexShrink: 0 }} />
                        ) : (
                          <span style={{ width: 8, height: 8, display: "block", flexShrink: 0 }} />
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Chat panel ── */}
      {showChatPanel && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
          {!selected ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 14 }}>
              <MessageSquare size={44} color="rgba(255,255,255,0.07)" />
              <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.9rem", margin: 0 }}>Sélectionnez une conversation</p>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div style={{ padding: "12px 18px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                {isMobile && (
                  <button onClick={backToList}
                    style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", padding: "4px 2px", flexShrink: 0, display: "flex" }}>
                    <ArrowLeft size={20} />
                  </button>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: "white", fontWeight: 700, fontSize: "0.92rem", margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {selected.client_name || selected.client_email}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "0.75rem", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {selected.subject}
                  </p>
                </div>
                <span style={{
                  padding: "3px 9px", borderRadius: 6, fontSize: "0.7rem", fontWeight: 600, flexShrink: 0,
                  background: selected.status === "open" ? "rgba(0,95,45,0.25)" : "rgba(255,255,255,0.07)",
                  color: selected.status === "open" ? "#4CAF82" : "rgba(255,255,255,0.35)",
                }}>
                  {selected.status === "open" ? "Ouvert" : "Fermé"}
                </span>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
                {selectedMsgs.length === 0 ? (
                  <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.85rem", textAlign: "center", marginTop: 32 }}>Aucun message dans cette conversation</p>
                ) : selectedMsgs.map((msg) => {
                  const isOut = msg.direction === "outbound";
                  return (
                    <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: isOut ? "flex-end" : "flex-start" }}>
                      <div style={{
                        maxWidth: isMobile ? "88%" : "72%",
                        background: isOut ? "#005F2D" : "#252836",
                        borderRadius: isOut ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                        padding: "10px 14px",
                      }}>
                        <p style={{ color: "white", fontSize: "0.87rem", margin: 0, lineHeight: 1.65, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                          {msg.body_text}
                        </p>
                      </div>
                      <p style={{ color: "rgba(255,255,255,0.22)", fontSize: "0.67rem", margin: "4px 4px 0" }}>
                        {isOut ? "Vous" : (selected.client_name || selected.client_email)}
                        {" · "}
                        {new Date(msg.created_at).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply box */}
              <div style={{ padding: "10px 16px 14px", borderTop: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                  <textarea
                    placeholder={`Répondre à ${selected.client_name || selected.client_email}…`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) sendReply(); }}
                    rows={isMobile ? 2 : 3}
                    style={{ flex: 1, background: "#252836", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "white", fontSize: "0.9rem", padding: "10px 12px", outline: "none", resize: "none", fontFamily: "inherit" }}
                  />
                  <button onClick={sendReply} disabled={sending || !replyText.trim()}
                    style={{ height: 42, width: 42, background: "#005F2D", border: "none", borderRadius: 10, color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: (!replyText.trim() || sending) ? 0.45 : 1, flexShrink: 0 }}>
                    <Send size={17} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Compose modal ── */}
      {composing && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: 16 }}>
          <div style={{ background: "#1A1D27", borderRadius: 16, padding: 24, width: "100%", maxWidth: 480, border: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
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
