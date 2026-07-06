"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useAdmin } from "../layout";
import {
  ShieldEllipsis,
  Lock,
  Image as ImageIcon,
  Paperclip,
  Mic,
  StopCircle,
  Send,
  Trash2,
  FileText,
  X,
  Phone,
} from "lucide-react";

type Kind = "text" | "image" | "file" | "voice";

type Msg = {
  id: string;
  code_name: string;
  kind: Kind;
  body: string | null;
  media_url: string | null;
  media_name: string | null;
  media_mime: string | null;
  duration_ms: number | null;
  created_at: string;
};

const BG = "#0F1117";
const CARD = "#1A1D27";
const INPUT = "#252836";
const GREEN = "#005F2D";
const GOLD = "#C9A84C";
const BORDER = "1px solid rgba(255,255,255,0.08)";

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}
function fmtDur(ms: number | null | undefined) {
  const total = Math.max(0, Math.round((ms ?? 0) / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function StrategyRoom() {
  const { token } = useAdmin();

  const [myName, setMyName] = useState<string | null>(null);
  const [gateCustom, setGateCustom] = useState("");

  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Recording state
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0); // ms
  const recRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cancelledRef = useRef(false);

  const imgInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const lastCountRef = useRef(0);

  const authHeaders = useCallback(
    (json = false): Record<string, string> => {
      const h: Record<string, string> = { Authorization: `Bearer ${token}` };
      if (json) h["Content-Type"] = "application/json";
      return h;
    },
    [token]
  );

  // ---- code name gate ----
  useEffect(() => {
    try {
      const stored = localStorage.getItem("kt_admin_codename");
      if (stored) setMyName(stored);
    } catch {
      /* ignore */
    }
  }, []);

  function chooseName(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    try {
      localStorage.setItem("kt_admin_codename", trimmed);
    } catch {
      /* ignore */
    }
    setMyName(trimmed);
  }
  function changeName() {
    try {
      localStorage.removeItem("kt_admin_codename");
    } catch {
      /* ignore */
    }
    setMyName(null);
  }

  // ---- fetch messages ----
  const fetchMessages = useCallback(async () => {
    if (!myName) return;
    try {
      const res = await fetch("/api/kt/admin/strategy", { headers: authHeaders() });
      if (!res.ok) return; // keep last-known state
      const data = await res.json();
      if (Array.isArray(data?.messages)) setMessages(data.messages as Msg[]);
    } catch {
      /* keep last-known state on network error */
    }
  }, [myName, authHeaders]);

  useEffect(() => {
    if (!myName) return;
    fetchMessages();
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") fetchMessages();
    }, 4000);
    function onVis() {
      if (document.visibilityState === "visible") fetchMessages();
    }
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [myName, fetchMessages]);

  // ---- auto-scroll when new messages arrive ----
  useEffect(() => {
    if (messages.length > lastCountRef.current) {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    }
    lastCountRef.current = messages.length;
  }, [messages]);

  // ---- send text ----
  async function sendText() {
    const body = text.trim();
    if (!body || !myName) return;
    setText("");
    try {
      await fetch("/api/kt/admin/strategy", {
        method: "POST",
        headers: authHeaders(true),
        body: JSON.stringify({ code_name: myName, kind: "text", body }),
      });
      await fetchMessages();
    } catch {
      setError("Envoi impossible. Réessayez.");
    }
  }

  // ---- upload + send media ----
  async function uploadAndSend(file: File, opts?: { duration_ms?: number; forceVoice?: boolean }) {
    if (!myName) return;
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const up = await fetch("/api/kt/admin/strategy/upload", {
        method: "POST",
        headers: authHeaders(),
        body: fd,
      });
      if (!up.ok) throw new Error("upload");
      const { path, name, mime } = await up.json();

      const kind: Kind = opts?.forceVoice
        ? "voice"
        : typeof mime === "string" && mime.startsWith("image/")
        ? "image"
        : "file";

      const payload: Record<string, unknown> = {
        code_name: myName,
        kind,
        media_path: path,
        media_name: name,
        media_mime: mime,
      };
      if (opts?.duration_ms != null) payload.duration_ms = opts.duration_ms;

      await fetch("/api/kt/admin/strategy", {
        method: "POST",
        headers: authHeaders(true),
        body: JSON.stringify(payload),
      });
      await fetchMessages();
    } catch {
      setError("Échec de l'envoi du fichier.");
    } finally {
      setUploading(false);
    }
  }

  function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (f) uploadAndSend(f);
  }
  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (f) uploadAndSend(f);
  }

  // ---- delete ----
  async function deleteMessage(id: string) {
    if (!window.confirm("Supprimer ce message ?")) return;
    setMessages((prev) => prev.filter((m) => m.id !== id));
    try {
      await fetch(`/api/kt/admin/strategy?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
    } catch {
      /* ignore */
    }
    await fetchMessages();
  }

  // ---- voice recording ----
  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }
  function releaseStream() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }

  async function startRecording() {
    setError("");
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Micro non autorisé");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      cancelledRef.current = false;
      const rec = new MediaRecorder(stream);
      recRef.current = rec;
      rec.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) chunksRef.current.push(ev.data);
      };
      rec.onstop = () => {
        stopTimer();
        const duration = Date.now() - startRef.current;
        const wasCancelled = cancelledRef.current;
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        releaseStream();
        setRecording(false);
        setElapsed(0);
        if (wasCancelled || blob.size === 0) return;
        const audioFile = new File([blob], "note-vocale.webm", { type: blob.type });
        uploadAndSend(audioFile, { duration_ms: duration, forceVoice: true });
      };
      startRef.current = Date.now();
      setElapsed(0);
      setRecording(true);
      rec.start();
      timerRef.current = setInterval(() => {
        setElapsed(Date.now() - startRef.current);
      }, 200);
    } catch {
      releaseStream();
      setRecording(false);
      setError("Micro non autorisé");
    }
  }

  function stopRecording() {
    cancelledRef.current = false;
    if (recRef.current && recRef.current.state !== "inactive") {
      recRef.current.stop();
    }
  }
  function cancelRecording() {
    cancelledRef.current = true;
    if (recRef.current && recRef.current.state !== "inactive") {
      recRef.current.stop();
    } else {
      stopTimer();
      releaseStream();
      setRecording(false);
      setElapsed(0);
    }
  }

  useEffect(() => {
    return () => {
      stopTimer();
      releaseStream();
    };
  }, []);

  // ================= GATE =================
  if (!myName) {
    return (
      <div
        style={{
          minHeight: "100%",
          background: BG,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            background: CARD,
            borderRadius: 16,
            padding: 32,
            border: BORDER,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: GREEN,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Lock size={18} color="white" />
            </div>
            <div>
              <p style={{ color: "white", fontWeight: 700, fontSize: "1rem", margin: 0 }}>
                Salon Stratégie — confidentiel
              </p>
              <p style={{ color: GOLD, fontSize: "0.72rem", margin: 0 }}>Accès réservé</p>
            </div>
          </div>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.85rem", lineHeight: 1.5, margin: "0 0 22px" }}>
            Choisissez un nom de code pour entrer. Votre identité réelle n&apos;est pas affichée dans le
            salon — seul votre nom de code apparaît à côté de vos messages.
          </p>

          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <button
              onClick={() => chooseName("Ali BABA")}
              style={{
                flex: 1,
                height: 48,
                background: GREEN,
                color: "white",
                fontWeight: 700,
                fontSize: "0.9rem",
                border: "none",
                borderRadius: 10,
                cursor: "pointer",
              }}
            >
              Ali BABA
            </button>
            <button
              onClick={() => chooseName("OkRAN")}
              style={{
                flex: 1,
                height: 48,
                background: INPUT,
                color: "white",
                fontWeight: 700,
                fontSize: "0.9rem",
                border: `1px solid ${GOLD}`,
                borderRadius: 10,
                cursor: "pointer",
              }}
            >
              OkRAN
            </button>
          </div>

          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.72rem", margin: "0 0 8px" }}>Autre…</p>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={gateCustom}
              onChange={(e) => setGateCustom(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && chooseName(gateCustom)}
              placeholder="Nom de code personnalisé"
              style={{
                flex: 1,
                height: 46,
                background: INPUT,
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                color: "white",
                fontSize: "0.9rem",
                padding: "0 14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <button
              onClick={() => chooseName(gateCustom)}
              style={{
                height: 46,
                padding: "0 18px",
                background: "transparent",
                color: "white",
                fontWeight: 600,
                fontSize: "0.88rem",
                border: BORDER,
                borderRadius: 10,
                cursor: "pointer",
              }}
            >
              Entrer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ================= ROOM =================
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: BG, minWidth: 0 }}>
      {/* Header */}
      <div
        style={{
          background: CARD,
          borderBottom: BORDER,
          padding: "12px 16px",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: GREEN,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ShieldEllipsis size={18} color="white" />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ color: "white", fontWeight: 700, fontSize: "0.95rem", margin: 0 }}>
              Salon Stratégie
            </p>
          </div>
          <span
            style={{
              fontSize: "0.62rem",
              fontWeight: 700,
              letterSpacing: 0.5,
              color: GOLD,
              border: `1px solid ${GOLD}`,
              borderRadius: 6,
              padding: "2px 6px",
              textTransform: "uppercase",
            }}
          >
            Confidentiel
          </span>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <button
              disabled
              title="Bientôt disponible"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                background: "transparent",
                color: "rgba(255,255,255,0.3)",
                border: BORDER,
                borderRadius: 8,
                padding: "6px 10px",
                fontSize: "0.72rem",
                cursor: "not-allowed",
              }}
            >
              <Phone size={13} /> Appel (bientôt)
            </button>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: "white", fontSize: "0.82rem", fontWeight: 600, margin: 0 }}>{myName}</p>
              <button
                onClick={changeName}
                style={{
                  background: "none",
                  border: "none",
                  color: GOLD,
                  fontSize: "0.72rem",
                  cursor: "pointer",
                  padding: 0,
                  textDecoration: "underline",
                }}
              >
                changer
              </button>
            </div>
          </div>
        </div>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.72rem", margin: "8px 0 0" }}>
          Espace privé chiffré au niveau accès — réservé aux administrateurs.
        </p>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          minHeight: 0,
        }}
      >
        {messages.length === 0 && (
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.85rem", textAlign: "center", marginTop: 30 }}>
            Aucun message. Démarrez la conversation.
          </p>
        )}
        {messages.map((m) => {
          const mine = m.code_name === myName;
          return (
            <div
              key={m.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: mine ? "flex-end" : "flex-start",
                maxWidth: "100%",
              }}
            >
              {!mine && (
                <span style={{ color: GOLD, fontSize: "0.72rem", fontWeight: 600, margin: "0 6px 3px" }}>
                  {m.code_name}
                </span>
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 6,
                  flexDirection: mine ? "row-reverse" : "row",
                  maxWidth: "min(88%, 460px)",
                }}
              >
                <div
                  style={{
                    background: mine ? GREEN : INPUT,
                    color: "white",
                    borderRadius: 12,
                    padding: "9px 12px",
                    fontSize: "0.9rem",
                    lineHeight: 1.45,
                    minWidth: 0,
                    maxWidth: "100%",
                  }}
                >
                  {m.kind === "text" && (
                    <span style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{m.body}</span>
                  )}

                  {m.kind === "image" && (
                    <div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m.media_url!}
                        style={{ maxWidth: 260, borderRadius: 10, display: "block", cursor: "pointer" }}
                        onClick={() => window.open(m.media_url!, "_blank")}
                        alt={m.media_name || "image"}
                      />
                      {m.body && (
                        <p
                          style={{
                            margin: "6px 0 0",
                            fontSize: "0.85rem",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                          }}
                        >
                          {m.body}
                        </p>
                      )}
                    </div>
                  )}

                  {m.kind === "file" && (
                    <a
                      href={m.media_url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        background: "rgba(255,255,255,0.1)",
                        color: "white",
                        textDecoration: "none",
                        borderRadius: 8,
                        padding: "8px 10px",
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        wordBreak: "break-all",
                      }}
                    >
                      <FileText size={16} style={{ flexShrink: 0 }} />
                      <span>{m.media_name || "fichier"}</span>
                    </a>
                  )}

                  {m.kind === "voice" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <audio controls src={m.media_url!} style={{ maxWidth: 240 }} />
                      <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.6)" }}>
                        {fmtDur(m.duration_ms)}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => deleteMessage(m.id)}
                  title="Supprimer"
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.3)",
                    cursor: "pointer",
                    padding: 2,
                    flexShrink: 0,
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.66rem", margin: "3px 6px 0" }}>
                {fmtTime(m.created_at)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Error line */}
      {error && (
        <div
          style={{
            padding: "6px 14px",
            background: "rgba(255,107,107,0.12)",
            color: "#FF9B9B",
            fontSize: "0.78rem",
            flexShrink: 0,
          }}
        >
          {error}
        </div>
      )}

      {/* Recording indicator */}
      {recording && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 14px",
            background: "rgba(255,0,0,0.08)",
            borderTop: BORDER,
            flexShrink: 0,
          }}
        >
          <span style={{ color: "#FF5B5B", fontSize: "0.85rem", fontWeight: 600 }}>
            ● Enregistrement {fmtDur(elapsed)}
          </span>
          <button
            onClick={cancelRecording}
            title="Annuler"
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "none",
              border: BORDER,
              color: "rgba(255,255,255,0.7)",
              borderRadius: 8,
              padding: "4px 8px",
              fontSize: "0.75rem",
              cursor: "pointer",
            }}
          >
            <X size={13} /> Annuler
          </button>
        </div>
      )}

      {/* Composer */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          background: CARD,
          borderTop: BORDER,
          padding: "10px 12px",
          display: "flex",
          alignItems: "center",
          gap: 6,
          flexShrink: 0,
        }}
      >
        {/* hidden inputs */}
        <input ref={imgInputRef} type="file" accept="image/*" onChange={onPickImage} style={{ display: "none" }} />
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/plain"
          onChange={onPickFile}
          style={{ display: "none" }}
        />

        <button
          onClick={() => imgInputRef.current?.click()}
          disabled={uploading || recording}
          title="Photo"
          style={iconBtn(uploading || recording)}
        >
          <ImageIcon size={19} />
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || recording}
          title="Document"
          style={iconBtn(uploading || recording)}
        >
          <Paperclip size={19} />
        </button>
        <button
          onClick={recording ? stopRecording : startRecording}
          disabled={uploading}
          title={recording ? "Arrêter" : "Note vocale"}
          style={iconBtn(uploading, recording ? "#FF5B5B" : undefined)}
        >
          {recording ? <StopCircle size={20} /> : <Mic size={19} />}
        </button>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !uploading && sendText()}
          placeholder={uploading ? "Envoi…" : "Message…"}
          disabled={uploading}
          style={{
            flex: 1,
            minWidth: 0,
            height: 42,
            background: INPUT,
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 21,
            color: "white",
            fontSize: "0.9rem",
            padding: "0 16px",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        <button
          onClick={sendText}
          disabled={uploading || !text.trim()}
          title="Envoyer"
          style={{
            width: 42,
            height: 42,
            borderRadius: 21,
            background: text.trim() && !uploading ? GREEN : INPUT,
            border: "none",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: uploading || !text.trim() ? "default" : "pointer",
            flexShrink: 0,
          }}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

function iconBtn(disabled: boolean, color?: string): React.CSSProperties {
  return {
    width: 40,
    height: 40,
    borderRadius: 20,
    background: "transparent",
    border: BORDER,
    color: color || "rgba(255,255,255,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    flexShrink: 0,
  };
}
