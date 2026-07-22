"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useAdmin } from "../layout";
import {
  Send, RefreshCw, Edit3, X, ArrowLeft, MessageSquare,
  Bold, Italic, Underline, Strikethrough, List, ListOrdered,
  Heading1, Heading2, Heading3, Link2, Image, MousePointerClick,
  Palette, Highlighter, Upload, FileText, Paperclip, ChevronDown, Code2, Trash2,
} from "lucide-react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UnderlineExt from "@tiptap/extension-underline";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import ImageExt from "@tiptap/extension-image";
import { Node, mergeAttributes } from "@tiptap/core";
import { COMPOSER_PRESETS } from "@/lib/email/composer-presets";

/* ── Attachment type ── */
type EmailAttachment = {
  filename: string;
  mimeType: string;
  cid?: string;
  data: string;   // base64
  size: number;   // approximate bytes
  tooLarge?: boolean;
};

/* ── Parse file attachments embedded in body_text by the webhook ── */
function parseAttachments(bodyText: string): EmailAttachment[] {
  const marker = "###KT_ATTACHMENTS###";
  const idx = bodyText.indexOf(marker);
  if (idx === -1) return [];
  try {
    return JSON.parse(bodyText.slice(idx + marker.length));
  } catch { return []; }
}

/* ── DOMPurify (client-side only) ── */
function sanitize(html: string): string {
  if (typeof window === "undefined" || !html) return "";
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const DOMPurify = require("dompurify");
  // DO NOT strip cid: — the worker now replaces them with data URIs before storing
  const result = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p","br","b","strong","i","em","u","s","del","h1","h2","h3","h4",
      "ul","ol","li","a","img","span","div","blockquote","pre","code","hr","table","tbody","tr","td","th","thead",
    ],
    ALLOWED_ATTR: ["href","src","alt","style","target","rel","class","width","height","border","cellpadding","cellspacing"],
    ALLOW_DATA_ATTR: false,
    ADD_DATA_URI_TAGS: ["img"],
    FORCE_BODY: false,
  });
  return result;
}

/* ── Download a base64 attachment in the browser ── */
function downloadAttachment(att: EmailAttachment) {
  if (!att.data) return;
  try {
    const bytes = atob(att.data);
    const arr = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
    const blob = new Blob([arr], { type: att.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = att.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (e) { console.error("Download error:", e); }
}

/* ── Format file size ── */
function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

/* ── File icon by MIME type ── */
function fileIcon(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "🖼";
  if (mimeType === "application/pdf") return "📄";
  if (mimeType.includes("word") || mimeType.includes("document")) return "📝";
  if (mimeType.includes("sheet") || mimeType.includes("excel")) return "📊";
  if (mimeType.includes("zip") || mimeType.includes("rar") || mimeType.includes("7z")) return "🗜";
  return "📎";
}

/* ── Custom TipTap CTA Button Node ── */
const CTAButton = Node.create({
  name: "ctaButton",
  group: "block",
  atom: true,
  addAttributes() {
    return {
      label: { default: "Cliquez ici" },
      href: { default: "#" },
    };
  },
  parseHTML() {
    return [{ tag: "a[data-cta]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "a",
      mergeAttributes({
        "data-cta": "1",
        href: HTMLAttributes.href,
        target: "_blank",
        rel: "noopener noreferrer",
        style:
          "display:inline-block;padding:12px 28px;background:#005F2D;color:#ffffff;" +
          "border-radius:8px;font-weight:700;font-size:14px;text-decoration:none;" +
          "letter-spacing:0.02em;",
      }),
      HTMLAttributes.label,
    ];
  },
});

/* ── Types ── */
type Message = {
  id: string;
  direction: "inbound" | "outbound";
  from_email: string;
  to_email: string;
  subject: string;
  body_text: string;
  body_html?: string | null;
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
  system_email?: string | null;    // which KT system address this thread is on
  kt_email_messages?: Message[];   // present only for the fully-loaded open thread
};
type Sender = { id: string; email: string; label: string; active: boolean };

/* ── Message HTML renderer ── */
function MessageContent({ msg }: { msg: Message }) {
  const html = msg.body_html || "";
  const [safe, setSafe] = useState("");

  useEffect(() => {
    if (html) setSafe(sanitize(html));
    else setSafe("");
  }, [html]);

  // Extract file attachments encoded in body_text by the webhook
  const attachments = parseAttachments(msg.body_text || "");
  // Display text without the attachment marker
  const displayText = (msg.body_text || "").split("###KT_ATTACHMENTS###")[0];

  const isOut = msg.direction === "outbound";
  const baseStyle: React.CSSProperties = {
    fontSize: "0.87rem",
    lineHeight: 1.65,
    color: "white",
    wordBreak: "break-word",
  };

  return (
    <>
      {/* ── Main message body ── */}
      {safe ? (
        <>
          <style>{`
            .msg-rich a { color:${isOut ? "#86EFAC" : "#4CAF82"}; text-decoration:underline; }
            .msg-rich a[data-cta] {
              display:inline-block; padding:10px 22px; background:${isOut ? "rgba(255,255,255,0.15)" : "#005F2D"};
              color:white; border-radius:6px; font-weight:700; font-size:13px;
              text-decoration:none; border:1px solid rgba(255,255,255,0.3);
            }
            .msg-rich h1,.msg-rich h2,.msg-rich h3 { color:white; margin:10px 0 6px; }
            .msg-rich h1 { font-size:1.2rem; } .msg-rich h2 { font-size:1.05rem; } .msg-rich h3 { font-size:0.95rem; }
            .msg-rich p { margin:0 0 6px; }
            .msg-rich ul,.msg-rich ol { margin:4px 0; padding-left:20px; }
            .msg-rich li { margin-bottom:2px; }
            .msg-rich img { max-width:100%; border-radius:6px; display:block; margin:6px 0; cursor:pointer; }
            .msg-rich strong { font-weight:700; }
            .msg-rich em { font-style:italic; }
            .msg-rich u { text-decoration:underline; }
            .msg-rich s { text-decoration:line-through; }
            .msg-rich mark { background:rgba(255,235,59,0.35); padding:0 3px; border-radius:2px; }
            .msg-rich blockquote { border-left:3px solid rgba(255,255,255,0.2); margin:6px 0; padding:4px 12px; opacity:0.8; }
          `}</style>
          <div
            className="msg-rich"
            style={baseStyle}
            dangerouslySetInnerHTML={{ __html: safe }}
          />
        </>
      ) : (
        <p style={{ ...baseStyle, whiteSpace: "pre-wrap", margin: 0 }}>
          {displayText}
        </p>
      )}

      {/* ── File attachments ── */}
      {attachments.length > 0 && (
        <div style={{ marginTop: 10, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Pièces jointes ({attachments.length})
          </p>
          {attachments.map((att, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "rgba(255,255,255,0.06)", borderRadius: 10,
              padding: "8px 12px",
            }}>
              <span style={{ fontSize: "1.1rem" }}>{fileIcon(att.mimeType)}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: "white", fontSize: "0.8rem", fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {att.filename}
                </p>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.7rem", margin: 0 }}>
                  {att.tooLarge ? "Fichier trop volumineux (> 4 Mo)" : fmtSize(att.size)}
                </p>
              </div>
              {att.data && !att.tooLarge && (
                <button
                  type="button"
                  onClick={() => downloadAttachment(att)}
                  style={{
                    background: "#005F2D", border: "none", borderRadius: 8,
                    color: "white", fontSize: "0.72rem", fontWeight: 700,
                    padding: "5px 10px", cursor: "pointer", flexShrink: 0,
                  }}
                >
                  ↓ Télécharger
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* ── Toolbar button helper ── */
function TB({
  onClick, onMD, active = false, title, children, disabled = false,
}: {
  onClick?: () => void;
  onMD?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  active?: boolean; title?: string;
  children: React.ReactNode; disabled?: boolean;
}) {
  return (
    <button
      type="button" title={title}
      onMouseDown={onMD ?? ((e) => { e.preventDefault(); onClick?.(); })}
      disabled={disabled}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 34, height: 32, borderRadius: 6, border: "none",
        background: active ? "rgba(0,95,45,0.4)" : "transparent",
        color: active ? "#4CAF82" : "rgba(255,255,255,0.65)",
        cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.35 : 1,
        transition: "all 0.1s", flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

const COLORS = [
  ["#ffffff", "Blanc"], ["#f87171", "Rouge"], ["#fb923c", "Orange"],
  ["#facc15", "Jaune"], ["#4ade80", "Vert"], ["#60a5fa", "Bleu"],
  ["#c084fc", "Violet"], ["#f9a8d4", "Rose"],
];
const HIGHLIGHTS = [
  ["#fef08a", "Jaune"], ["#bbf7d0", "Vert"], ["#bfdbfe", "Bleu"],
  ["#fecaca", "Rouge"], ["#e9d5ff", "Violet"],
];

/* ── Rich Toolbar ── */
function Toolbar({
  editor, token, onImageUploaded,
}: {
  editor: Editor;
  token: string;
  onImageUploaded: (url: string) => void;
}) {
  const [showColors, setShowColors] = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showCTA, setShowCTA] = useState(false);
  const [ctaText, setCtaText] = useState("En savoir plus");
  const [ctaUrl, setCtaUrl] = useState("https://");
  const [showPasteHtml, setShowPasteHtml] = useState(false);
  const [rawHtml, setRawHtml] = useState("");
  const [uploading, setUploading] = useState(false);
  /* position: fixed coordinates for the active dropdown */
  const [ddPos, setDdPos] = useState({ top: 0, left: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  /* Close all dropdowns when clicking/touching outside the toolbar */
  useEffect(() => {
    function close(e: MouseEvent | TouchEvent) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as any)) {
        setShowColors(false); setShowHighlights(false);
        setShowLink(false); setShowCTA(false); setShowPasteHtml(false);
      }
    }
    document.addEventListener("mousedown", close);
    document.addEventListener("touchstart", close);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("touchstart", close); };
  }, []);

  /* Calculate position: fixed coords from a button element */
  function pos(e: React.MouseEvent) {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const vw = window.innerWidth;
    /* Clamp so the dropdown never overflows the viewport horizontally */
    setDdPos({ top: r.bottom + 6, left: Math.min(r.left, vw - 300) });
  }

  function closeAll() {
    setShowColors(false); setShowHighlights(false);
    setShowLink(false); setShowCTA(false); setShowPasteHtml(false);
  }

  function insertRawHtml() {
    if (!rawHtml.trim()) return;
    const safe = sanitize(rawHtml);
    editor.chain().focus().insertContent(safe, { parseOptions: { preserveWhitespace: false } }).run();
    setRawHtml(""); setShowPasteHtml(false);
  }

  function applyLink() {
    if (linkUrl) editor.chain().focus().setLink({ href: linkUrl, target: "_blank" }).run();
    else editor.chain().focus().unsetLink().run();
    setShowLink(false); setLinkUrl("");
  }

  function insertCTA() {
    editor.chain().focus().insertContent({ type: "ctaButton", attrs: { label: ctaText, href: ctaUrl } }).run();
    setShowCTA(false);
  }

  async function uploadImage(file: File) {
    setUploading(true);
    const fd = new FormData(); fd.append("file", file);
    try {
      const res = await fetch("/api/kt/admin/inbox/upload", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
      if (res.ok) { const { url } = await res.json(); editor.chain().focus().setImage({ src: url }).run(); onImageUploaded(url); }
    } finally { setUploading(false); }
  }

  const sep: React.CSSProperties = { width: 1, height: 18, background: "rgba(255,255,255,0.12)", margin: "0 3px", flexShrink: 0 };

  /* Base style for all position:fixed dropdowns — escapes every overflow container */
  const dd: React.CSSProperties = {
    position: "fixed", top: ddPos.top, left: ddPos.left, zIndex: 9999,
    background: "#1A1D27", border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
  };

  return (
    <div ref={toolbarRef} style={{ position: "relative" }}>
      {/* ── Scrollable button strip ── */}
      <div className="rich-toolbar" style={{
        display: "flex", flexWrap: "nowrap", alignItems: "center", gap: 1,
        padding: "5px 8px", background: "#14161F",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "10px 10px 0 0",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch" as React.CSSProperties["WebkitOverflowScrolling"],
        scrollbarWidth: "none" as React.CSSProperties["scrollbarWidth"],
      }}>
        <TB onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Gras"><Bold size={14} /></TB>
        <TB onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italique"><Italic size={14} /></TB>
        <TB onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Souligné"><Underline size={14} /></TB>
        <TB onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Barré"><Strikethrough size={14} /></TB>
        <div style={sep} />
        <TB onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="H1"><Heading1 size={14} /></TB>
        <TB onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="H2"><Heading2 size={14} /></TB>
        <TB onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="H3"><Heading3 size={14} /></TB>
        <div style={sep} />
        <TB onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Liste"><List size={14} /></TB>
        <TB onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numérotée"><ListOrdered size={14} /></TB>
        <div style={sep} />
        {/* Color */}
        <TB onMD={(e) => { e.preventDefault(); pos(e); setShowColors(v => !v); setShowHighlights(false); setShowLink(false); setShowCTA(false); setShowPasteHtml(false); }} active={showColors} title="Couleur"><Palette size={14} /></TB>
        {/* Highlight */}
        <TB onMD={(e) => { e.preventDefault(); pos(e); setShowHighlights(v => !v); setShowColors(false); setShowLink(false); setShowCTA(false); setShowPasteHtml(false); }} active={showHighlights} title="Surlignage"><Highlighter size={14} /></TB>
        <div style={sep} />
        {/* Link */}
        <TB onMD={(e) => { e.preventDefault(); pos(e); const was = showLink; closeAll(); if (!was) { setShowLink(true); setLinkUrl(editor.getAttributes("link").href ?? ""); } }} active={editor.isActive("link") || showLink} title="Lien"><Link2 size={14} /></TB>
        {/* Image */}
        <TB onClick={() => fileInputRef.current?.click()} title="Image" disabled={uploading}>
          {uploading ? <Upload size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Image size={14} />}
        </TB>
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp"
          style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) { uploadImage(f); e.target.value = ""; } }} />
        <TB onClick={() => fileInputRef.current?.click()} title="Pièce jointe"><Paperclip size={14} /></TB>
        <div style={sep} />
        {/* Paste HTML */}
        <TB onMD={(e) => { e.preventDefault(); pos(e); setShowPasteHtml(v => !v); setShowCTA(false); setShowColors(false); setShowHighlights(false); setShowLink(false); }} active={showPasteHtml} title="HTML brut"><Code2 size={14} /></TB>
        {/* CTA */}
        <TB onMD={(e) => { e.preventDefault(); pos(e); setShowCTA(v => !v); setShowPasteHtml(false); setShowColors(false); setShowHighlights(false); setShowLink(false); }} active={showCTA} title="Bouton CTA"><MousePointerClick size={14} /></TB>
      </div>

      {/* ── Dropdowns — position:fixed escapes all overflow/clip parents ── */}

      {showColors && (
        <div style={{ ...dd, padding: 10, display: "flex", gap: 6, flexWrap: "wrap", width: 156 }}>
          {COLORS.map(([color, label]) => (
            <button key={color} title={label} type="button"
              onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().setColor(color).run(); setShowColors(false); }}
              style={{ width: 28, height: 28, borderRadius: 6, background: color, border: "2px solid rgba(255,255,255,0.2)", cursor: "pointer" }} />
          ))}
          <button type="button" title="Aucune couleur"
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().unsetColor().run(); setShowColors(false); }}
            style={{ width: 28, height: 28, borderRadius: 6, background: "transparent", border: "2px dashed rgba(255,255,255,0.35)", cursor: "pointer", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>✕</button>
        </div>
      )}

      {showHighlights && (
        <div style={{ ...dd, padding: 10, display: "flex", gap: 6, flexWrap: "wrap", width: 142 }}>
          {HIGHLIGHTS.map(([color, label]) => (
            <button key={color} title={label} type="button"
              onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleHighlight({ color }).run(); setShowHighlights(false); }}
              style={{ width: 28, height: 28, borderRadius: 6, background: color, border: "2px solid rgba(0,0,0,0.2)", cursor: "pointer" }} />
          ))}
          <button type="button" title="Supprimer"
            onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().unsetHighlight().run(); setShowHighlights(false); }}
            style={{ width: 28, height: 28, borderRadius: 6, background: "transparent", border: "2px dashed rgba(255,255,255,0.35)", cursor: "pointer", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>✕</button>
        </div>
      )}

      {showLink && (
        <div style={{ ...dd, padding: 14, width: 280 }}>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.7rem", margin: "0 0 8px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Lien URL</p>
          <input type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://…"
            onKeyDown={(e) => e.key === "Enter" && applyLink()} autoFocus
            style={{ width: "100%", height: 40, background: "#252836", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "white", fontSize: "0.9rem", padding: "0 12px", outline: "none", boxSizing: "border-box" }} />
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); applyLink(); }}
              style={{ flex: 1, height: 36, background: "#005F2D", border: "none", borderRadius: 8, color: "white", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer" }}>
              Appliquer
            </button>
            {editor.isActive("link") && (
              <button type="button" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().unsetLink().run(); setShowLink(false); }}
                style={{ height: 36, padding: "0 12px", background: "rgba(248,113,113,0.15)", border: "none", borderRadius: 8, color: "#F87171", fontSize: "0.82rem", cursor: "pointer" }}>
                Supprimer
              </button>
            )}
          </div>
        </div>
      )}

      {showPasteHtml && (
        <div style={{ ...dd, padding: 14, width: Math.min(320, window.innerWidth - 16) }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.7rem", margin: 0, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>HTML brut</p>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); setShowPasteHtml(false); setRawHtml(""); }}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: 4 }}><X size={15} /></button>
          </div>
          <textarea value={rawHtml} onChange={(e) => setRawHtml(e.target.value)}
            placeholder={"<h1>Titre</h1>\n<p>Contenu…</p>"} autoFocus rows={6}
            style={{ width: "100%", background: "#0F1117", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#4CAF82", fontSize: "0.75rem", fontFamily: "monospace", padding: "10px 12px", outline: "none", resize: "vertical", lineHeight: 1.6, boxSizing: "border-box" }} />
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); insertRawHtml(); }} disabled={!rawHtml.trim()}
              style={{ flex: 1, height: 36, background: rawHtml.trim() ? "#005F2D" : "rgba(0,95,45,0.3)", border: "none", borderRadius: 8, color: "white", fontSize: "0.82rem", fontWeight: 700, cursor: rawHtml.trim() ? "pointer" : "not-allowed" }}>
              Insérer
            </button>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); setRawHtml(""); }}
              style={{ height: 36, padding: "0 12px", background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, color: "rgba(255,255,255,0.4)", fontSize: "0.82rem", cursor: "pointer" }}>
              Effacer
            </button>
          </div>
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.67rem", margin: "8px 0 0", lineHeight: 1.4 }}>Sanitisé automatiquement.</p>
        </div>
      )}

      {showCTA && (
        <div style={{ ...dd, padding: 14, width: Math.min(284, window.innerWidth - 16) }}>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.7rem", margin: "0 0 12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Bouton CTA</p>
          <label style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem", display: "block", marginBottom: 4 }}>Texte</label>
          <input type="text" value={ctaText} onChange={(e) => setCtaText(e.target.value)} placeholder="En savoir plus"
            style={{ width: "100%", height: 38, background: "#252836", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "white", fontSize: "0.88rem", padding: "0 10px", outline: "none", boxSizing: "border-box", marginBottom: 10 }} />
          <label style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem", display: "block", marginBottom: 4 }}>URL</label>
          <input type="url" value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} placeholder="https://…"
            style={{ width: "100%", height: 38, background: "#252836", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "white", fontSize: "0.88rem", padding: "0 10px", outline: "none", boxSizing: "border-box", marginBottom: 10 }} />
          <div style={{ marginBottom: 10, padding: "8px 12px", background: "#0F1117", borderRadius: 8, textAlign: "center" }}>
            <span style={{ display: "inline-block", padding: "8px 20px", background: "#005F2D", color: "white", borderRadius: 6, fontWeight: 700, fontSize: "12px" }}>{ctaText || "Bouton"}</span>
          </div>
          <button type="button" onMouseDown={(e) => { e.preventDefault(); insertCTA(); }} disabled={!ctaText || !ctaUrl}
            style={{ width: "100%", height: 36, background: "#005F2D", border: "none", borderRadius: 8, color: "white", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer", opacity: (!ctaText || !ctaUrl) ? 0.5 : 1 }}>
            Insérer le bouton
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        .rich-toolbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

/* ── Rich Editor component ── */
function RichEditor({
  token, onHtmlChange, placeholder, minHeight = 120,
}: {
  token: string;
  onHtmlChange: (html: string, text: string) => void;
  placeholder?: string;
  minHeight?: number;
}) {
  const editor = useEditor({
    immediatelyRender: true,
    extensions: [
      StarterKit.configure({ codeBlock: false, code: false }),
      UnderlineExt,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({ openOnClick: false, HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" } }),
      ImageExt.configure({ allowBase64: false }),
      CTAButton,
    ],
    content: "",
    editorProps: {
      attributes: { class: "rich-editor-content" },
    },
    onUpdate({ editor }) {
      const html = editor.getHTML();
      const text = editor.getText();
      onHtmlChange(html === "<p></p>" ? "" : html, text);
    },
  });

  if (!editor) {
    return (
      <div style={{ minHeight: minHeight, padding: "12px 14px", background: "#1A1D27", color: "rgba(255,255,255,0.2)", fontSize: "0.9rem" }}>
        {placeholder}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      <style>{`
        .rich-editor-content {
          outline: none;
          min-height: ${minHeight}px;
          padding: 12px 14px;
          color: white;
          font-size: 0.9rem;
          line-height: 1.7;
          font-family: inherit;
        }
        .rich-editor-content p { margin: 0 0 6px; }
        .rich-editor-content p:last-child { margin-bottom: 0; }
        .rich-editor-content h1 { font-size: 1.3rem; font-weight: 800; margin: 12px 0 6px; color: white; }
        .rich-editor-content h2 { font-size: 1.1rem; font-weight: 700; margin: 10px 0 5px; color: white; }
        .rich-editor-content h3 { font-size: 0.95rem; font-weight: 700; margin: 8px 0 4px; color: rgba(255,255,255,0.9); }
        .rich-editor-content ul, .rich-editor-content ol { padding-left: 20px; margin: 4px 0 6px; }
        .rich-editor-content li { margin-bottom: 3px; }
        .rich-editor-content strong { font-weight: 700; }
        .rich-editor-content em { font-style: italic; }
        .rich-editor-content u { text-decoration: underline; }
        .rich-editor-content s { text-decoration: line-through; }
        .rich-editor-content mark { background: rgba(255, 235, 59, 0.35); padding: 0 3px; border-radius: 2px; }
        .rich-editor-content a { color: #4CAF82; text-decoration: underline; }
        .rich-editor-content a[data-cta] {
          display: inline-block; padding: 10px 22px; background: #005F2D; color: white;
          border-radius: 6px; font-weight: 700; font-size: 13px; text-decoration: none;
          margin: 8px 0; cursor: default;
        }
        .rich-editor-content img { max-width: 100%; border-radius: 6px; display: block; margin: 6px 0; }
        .rich-editor-content blockquote {
          border-left: 3px solid rgba(0,95,45,0.6); margin: 8px 0;
          padding: 4px 12px; color: rgba(255,255,255,0.65);
        }
        .rich-editor-content.ProseMirror-focused { outline: none; }
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: rgba(255,255,255,0.22);
          pointer-events: none;
          height: 0;
          float: left;
        }
      `}</style>
      <Toolbar editor={editor} token={token} onImageUploaded={() => {}} />
      <div style={{ flex: 1, overflowY: "auto", background: "#1A1D27" }}>
        <EditorContent editor={editor} placeholder={placeholder} />
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function InboxPage() {
  const { token } = useAdmin();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selected, setSelected] = useState<Thread | null>(null);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [composing, setComposing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Reply editor state
  const [replyHtml, setReplyHtml] = useState("");
  const [replyText, setReplyText] = useState("");
  const replyEditorKey = useRef(0); // force remount after send

  // Compose fields
  const [senders, setSenders] = useState<Sender[]>([]);
  const [mailboxFilter, setMailboxFilter] = useState<string>("");   // "" = toutes
  const [compFrom, setCompFrom] = useState("support@kt-bank-ag.com");
  const [replyFrom, setReplyFrom] = useState("support@kt-bank-ag.com");
  const [compRole, setCompRole] = useState("");   // free-text title shown after the name
  const [replyRole, setReplyRole] = useState("");
  const ROLE_PRESETS = ["Account manager", "Gestionnaire de compte", "Kontobetreuer", "Conseiller clientèle", "Kundenberater"];
  const [compTo, setCompTo] = useState("");
  const [compSubject, setCompSubject] = useState("");
  const [compHtml, setCompHtml] = useState("");
  const [compText, setCompText] = useState("");
  const compEditorKey = useRef(0);
  // Raw-HTML compose mode: paste a full HTML email and send it verbatim.
  const [compRawMode, setCompRawMode] = useState(false);
  const [compRawHtml, setCompRawHtml] = useState("");
  const compReady = !!compTo && !!compSubject && (compRawMode ? !!compRawHtml.trim() : (!!compHtml && compHtml !== "<p></p>"));

  // Attachments
  type AttachFile = { url: string; name: string; type: string };
  const [compAttachments, setCompAttachments] = useState<AttachFile[]>([]);
  const [replyAttachments, setReplyAttachments] = useState<AttachFile[]>([]);
  const [uploadingAttach, setUploadingAttach] = useState(false);
  const compDocFileRef = useRef<HTMLInputElement>(null);
  const compImgFileRef = useRef<HTMLInputElement>(null);
  const replyDocFileRef = useRef<HTMLInputElement>(null);
  const replyImgFileRef = useRef<HTMLInputElement>(null);

  async function uploadAttachment(file: File, setter: React.Dispatch<React.SetStateAction<AttachFile[]>>) {
    setUploadingAttach(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/kt/admin/inbox/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (data.url) setter((prev) => [...prev, { url: data.url, name: data.name, type: data.type }]);
    } catch (e) {
      console.error("upload failed", e);
    }
    setUploadingAttach(false);
  }

  useEffect(() => {
    function check() { setIsMobile(window.innerWidth < 768); }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Keep the currently open thread id available to the pollers without
  // re-creating callbacks/intervals on every selection.
  const selectedIdRef = useRef<string | null>(null);
  useEffect(() => { selectedIdRef.current = selected?.id ?? null; }, [selected?.id]);

  // Fetch the full messages of a single thread (only the open one is loaded fully).
  const loadThreadMessages = useCallback((threadId: string) => {
    fetch(`/api/kt/admin/inbox?thread_id=${threadId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.thread) setSelected((prev) => (prev && prev.id === threadId ? { ...prev, ...d.thread, unread: false } : prev));
      })
      .catch(() => {});
  }, [token]);

  // Lightweight thread list (no message bodies). keepSelected → also refresh the open thread's messages.
  const load = useCallback((keepSelected = false) => {
    setLoading(true);
    fetch("/api/kt/admin/inbox", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        setThreads(d.threads ?? []);
        setLoading(false);
        if (keepSelected && selectedIdRef.current) loadThreadMessages(selectedIdRef.current);
      });
  }, [token, loadThreadMessages]);

  useEffect(() => { load(); }, [load]);

  // Load the system sender identities (for the "De" selector + filter tabs).
  useEffect(() => {
    if (!token) return;
    fetch("/api/kt/admin/senders", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (Array.isArray(d?.senders)) setSenders(d.senders); })
      .catch(() => {});
  }, [token]);

  // When a thread opens, reply from the mailbox it belongs to by default.
  useEffect(() => {
    if (selected?.system_email) setReplyFrom(selected.system_email);
  }, [selected?.id, selected?.system_email]);

  // Silent background refresh — light list poll + refresh the open thread only.
  const silentRefresh = useCallback(() => {
    fetch("/api/kt/admin/inbox", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d?.threads) return;
        const fetched: Thread[] = d.threads;
        const openId = selectedIdRef.current;
        // Don't show the open thread as unread while it's being viewed.
        setThreads(fetched.map((t) => (t.id === openId ? { ...t, unread: false } : t)));
        if (openId) {
          const fresh = fetched.find((t) => t.id === openId);
          // A new inbound message arrived in the open thread → mark read + pull its messages.
          if (fresh?.unread) {
            fetch("/api/kt/admin/inbox", {
              method: "PATCH",
              headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
              body: JSON.stringify({ thread_id: openId }),
            }).catch(() => {});
          }
          loadThreadMessages(openId);
        }
      })
      .catch(() => { /* keep last-known state on transient errors */ });
  }, [token, loadThreadMessages]);

  // Poll only while the tab is visible (skip background tabs), and refresh
  // immediately when the tab regains focus.
  useEffect(() => {
    if (!token) return;
    const id = setInterval(() => {
      if (document.visibilityState === "visible") silentRefresh();
    }, 20000);
    const onVis = () => { if (document.visibilityState === "visible") silentRefresh(); };
    document.addEventListener("visibilitychange", onVis);
    return () => { clearInterval(id); document.removeEventListener("visibilitychange", onVis); };
  }, [token, silentRefresh]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selected?.id, showChat, selected?.kt_email_messages?.length]);

  function selectThread(t: Thread) {
    // The list is lightweight (no bodies) — show it immediately, then pull the messages.
    setSelected({ ...t, unread: false, kt_email_messages: t.kt_email_messages ?? [] });
    if (isMobile) setShowChat(true);
    loadThreadMessages(t.id);
    if (t.unread) {
      fetch("/api/kt/admin/inbox", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ thread_id: t.id }),
      });
      setThreads((prev) => prev.map((th) => th.id === t.id ? { ...th, unread: false } : th));
    }
  }

  async function toggleThreadStatus() {
    if (!selected) return;
    const newStatus = selected.status === "open" ? "closed" : "open";
    await fetch("/api/kt/admin/inbox", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ thread_id: selected.id, status: newStatus }),
    });
    setSelected({ ...selected, status: newStatus });
    setThreads((prev) => prev.map((t) => t.id === selected.id ? { ...t, status: newStatus } : t));
  }

  async function sendReply() {
    if (!selected || !replyHtml || replyHtml === "<p></p>") return;
    setSending(true);
    const subject = selected.subject.startsWith("Re:") ? selected.subject : `Re: ${selected.subject}`;
    await fetch("/api/kt/admin/inbox", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        to: selected.client_email, subject,
        body: replyText, body_html: replyHtml,
        thread_id: selected.id,
        attachments: replyAttachments,
        from_email: replyFrom,
        from_role: replyRole,
      }),
    });
    setSending(false);
    setReplyHtml("");
    setReplyText("");
    setReplyRole("");
    setReplyAttachments([]);
    replyEditorKey.current += 1;
    load(true);
  }

  async function sendCompose() {
    if (!compReady) return;
    const htmlToSend = compRawMode ? compRawHtml : compHtml;
    setSending(true);
    await fetch("/api/kt/admin/inbox", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        to: compTo, subject: compSubject,
        body: compRawMode ? "" : compText,
        body_html: htmlToSend,
        attachments: compAttachments,
        raw: compRawMode,
        from_email: compFrom,
        from_role: compRole,
      }),
    });
    setSending(false);
    setComposing(false);
    setCompTo(""); setCompSubject(""); setCompHtml(""); setCompText("");
    setCompRawMode(false); setCompRawHtml(""); setCompRole("");
    setCompAttachments([]);
    compEditorKey.current += 1;
    load(true);
  }

  async function deleteThread(threadId: string) {
    if (!window.confirm("Supprimer toute cette conversation ? Cette action est irréversible.")) return;
    setThreads((prev) => prev.filter((t) => t.id !== threadId));
    setSelected((prev) => (prev?.id === threadId ? null : prev));
    if (isMobile) setShowChat(false);
    await fetch(`/api/kt/admin/inbox?thread_id=${threadId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
    silentRefresh();
  }

  async function deleteMessage(messageId: string) {
    if (!window.confirm("Supprimer ce message ? (l'e-mail déjà envoyé ne sera pas rappelé)")) return;
    // Optimistic local removal
    setSelected((prev) => prev ? { ...prev, kt_email_messages: (prev.kt_email_messages ?? []).filter((m) => m.id !== messageId) } : prev);
    setThreads((prev) => prev.map((t) => ({ ...t, kt_email_messages: (t.kt_email_messages ?? []).filter((m) => m.id !== messageId) })));
    await fetch(`/api/kt/admin/inbox?message_id=${messageId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
    silentRefresh();
  }

  const selectedMsgs = (selected?.kt_email_messages ?? [])
    .slice()
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  const normMbx = (e?: string | null) => (e || "support@kt-bank-ag.com").toLowerCase();
  const visibleThreads = mailboxFilter ? threads.filter((t) => normMbx(t.system_email) === mailboxFilter) : threads;
  const senderLabel = (email?: string | null) => senders.find((s) => s.email.toLowerCase() === normMbx(email))?.label ?? (email || "support");

  const unreadCount = threads.filter((t) => t.unread).length;
  const showListPanel = !isMobile || !showChat;
  const showChatPanel = !isMobile || showChat;
  const containerH = isMobile ? "calc(100dvh - 52px)" : "100dvh";
  const hasReplyContent = replyHtml && replyHtml !== "<p></p>";

  return (
    <div style={{ display: "flex", height: containerH, overflow: "hidden" }}>

      {/* ── Thread list ── */}
      {showListPanel && (
        <div style={{
          width: isMobile ? "100%" : 300,
          borderRight: isMobile ? "none" : "1px solid rgba(255,255,255,0.07)",
          display: "flex", flexDirection: "column", flexShrink: 0,
        }}>
          <div style={{ padding: "14px 16px 12px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h2 style={{ color: "white", fontWeight: 700, fontSize: "1rem", margin: 0 }}>Messagerie</h2>
              {unreadCount > 0 && (
                <span style={{ background: "#005F2D", color: "white", fontSize: "0.7rem", fontWeight: 700, borderRadius: 20, padding: "2px 8px" }}>
                  {unreadCount}
                </span>
              )}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => load()} title="Actualiser"
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: 6, borderRadius: 8, display: "flex" }}>
                <RefreshCw size={15} />
              </button>
              <button onClick={() => setComposing(true)}
                style={{ display: "flex", alignItems: "center", gap: 5, background: "#005F2D", border: "none", color: "white", borderRadius: 8, padding: "7px 11px", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}>
                <Edit3 size={12} /> Nouveau
              </button>
            </div>
          </div>

          {/* Mailbox filter tabs (by system address) */}
          {senders.filter((s) => s.active).length > 1 && (
            <div style={{ display: "flex", gap: 6, padding: "8px 12px", overflowX: "auto", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
              {[{ email: "", label: "Toutes" }, ...senders.filter((s) => s.active).map((s) => ({ email: s.email, label: s.label.split(" — ")[0].split(" ")[0] }))].map((tab) => {
                const on = mailboxFilter === tab.email;
                return (
                  <button key={tab.email || "all"} onClick={() => setMailboxFilter(tab.email)}
                    style={{ flexShrink: 0, background: on ? "#005F2D" : "rgba(255,255,255,0.06)", border: "none", borderRadius: 20, color: on ? "white" : "rgba(255,255,255,0.5)", fontSize: "0.72rem", fontWeight: 600, padding: "5px 12px", cursor: "pointer", whiteSpace: "nowrap" }}>
                    {tab.label}
                  </button>
                );
              })}
            </div>
          )}

          <div style={{ flex: 1, overflowY: "auto" }}>
            {loading ? (
              <p style={{ padding: 24, color: "rgba(255,255,255,0.3)", fontSize: "0.85rem", textAlign: "center" }}>Chargement…</p>
            ) : visibleThreads.length === 0 ? (
              <div style={{ padding: 48, textAlign: "center" }}>
                <MessageSquare size={36} color="rgba(255,255,255,0.1)" style={{ display: "block", margin: "0 auto 12px" }} />
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.85rem", margin: 0 }}>Aucun message</p>
              </div>
            ) : visibleThreads.map((t) => {
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
                      <p style={{ color: "white", fontWeight: t.unread ? 700 : 500, fontSize: "0.85rem", margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {t.client_name || t.client_email}
                      </p>
                      <p style={{ color: t.unread ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.38)", fontSize: "0.76rem", margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {t.subject}
                      </p>
                      {senders.filter((s) => s.active).length > 1 && !mailboxFilter && (
                        <span style={{ display: "inline-block", background: "rgba(201,168,76,0.14)", color: "#C9A84C", fontSize: "0.62rem", fontWeight: 600, padding: "1px 7px", borderRadius: 10 }}>
                          {senderLabel(t.system_email).split(" — ")[0].split(" ")[0]}
                        </span>
                      )}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                      <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.65rem", margin: 0 }}>
                        {new Date(t.last_message_at).toLocaleDateString("fr-FR")}
                      </p>
                      {t.unread && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4CAF82", display: "block" }} />}
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
              <MessageSquare size={48} color="rgba(255,255,255,0.06)" />
              <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.9rem", margin: 0 }}>Sélectionnez une conversation</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div style={{ padding: "12px 18px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                {isMobile && (
                  <button onClick={() => { setShowChat(false); setSelected(null); }}
                    style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", padding: "4px 2px", flexShrink: 0, display: "flex" }}>
                    <ArrowLeft size={20} />
                  </button>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: "white", fontWeight: 700, fontSize: "0.92rem", margin: "0 0 2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {selected.client_name || selected.client_email}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.72rem", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {selected.subject}
                  </p>
                </div>
                <button onClick={toggleThreadStatus}
                  style={{
                    padding: "3px 10px", borderRadius: 6, fontSize: "0.7rem", fontWeight: 600, cursor: "pointer", border: "none", flexShrink: 0,
                    background: selected.status === "open" ? "rgba(0,95,45,0.25)" : "rgba(255,255,255,0.07)",
                    color: selected.status === "open" ? "#4CAF82" : "rgba(255,255,255,0.35)",
                  }}>
                  {selected.status === "open" ? "Ouvert" : "Fermé"}
                </button>
                <button onClick={() => deleteThread(selected.id)} title="Supprimer la conversation"
                  style={{ background: "rgba(248,113,113,0.12)", border: "none", borderRadius: 6, padding: "5px 8px", cursor: "pointer", color: "#F87171", flexShrink: 0, display: "flex" }}>
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
                {selectedMsgs.length === 0 ? (
                  <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.85rem", textAlign: "center", marginTop: 32 }}>Aucun message</p>
                ) : selectedMsgs.map((msg) => {
                  const isOut = msg.direction === "outbound";
                  return (
                    <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: isOut ? "flex-end" : "flex-start" }}>
                      <div style={{
                        maxWidth: isMobile ? "90%" : "75%",
                        background: isOut ? "#005F2D" : "#252836",
                        borderRadius: isOut ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                        padding: "10px 14px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                      }}>
                        <MessageContent msg={msg} />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "4px 4px 0" }}>
                        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.65rem", margin: 0 }}>
                          {isOut ? "Vous" : (selected.client_name || selected.client_email)}
                          {" · "}
                          {new Date(msg.created_at).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                        </p>
                        <button onClick={() => deleteMessage(msg.id)} title="Supprimer ce message"
                          style={{ background: "none", border: "none", color: "rgba(248,113,113,0.55)", cursor: "pointer", padding: 0, display: "flex", lineHeight: 1 }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply editor */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", flexShrink: 0, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "8px 14px 0", flexWrap: "wrap" }}>
                  {senders.filter((s) => s.active).length > 1 && (
                    <>
                      <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.72rem", flexShrink: 0 }}>En tant que</span>
                      <select value={replyFrom} onChange={(e) => setReplyFrom(e.target.value)}
                        style={{ height: 32, background: "#252836", border: "1px solid rgba(0,95,45,0.4)", borderRadius: 8, color: "white", fontSize: "0.76rem", padding: "0 8px", outline: "none", maxWidth: 150 }}>
                        {senders.filter((s) => s.active).map((s) => (
                          <option key={s.id} value={s.email}>{s.label.split(" — ")[0]}</option>
                        ))}
                      </select>
                    </>
                  )}
                  <input value={replyRole} onChange={(e) => setReplyRole(e.target.value)} placeholder="Rôle affiché (optionnel)"
                    style={{ flex: 1, minWidth: 120, height: 32, background: "#252836", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "white", fontSize: "0.76rem", padding: "0 10px", outline: "none" }} />
                </div>
                <div style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, margin: "10px 14px 6px", overflow: "hidden", background: "#1A1D27" }}>
                  <RichEditor
                    key={replyEditorKey.current}
                    token={token}
                    placeholder={`Répondre à ${selected.client_name || selected.client_email}…`}
                    onHtmlChange={(html, text) => { setReplyHtml(html); setReplyText(text); }}
                    minHeight={isMobile ? 120 : 110}
                  />
                </div>
                {/* Attachment bar — reply */}
                <div style={{ padding: "4px 14px 6px" }}>
                  <input ref={replyDocFileRef} type="file" hidden
                    accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/plain"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadAttachment(f, setReplyAttachments); e.target.value = ""; }} />
                  <input ref={replyImgFileRef} type="file" hidden
                    accept="image/*"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadAttachment(f, setReplyAttachments); e.target.value = ""; }} />
                  {replyAttachments.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 6 }}>
                      {replyAttachments.map((a, i) => (
                        <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(0,95,45,0.15)", border: "1px solid rgba(0,95,45,0.35)", borderRadius: 7, padding: "3px 8px", fontSize: "0.73rem", color: "#4CAF82" }}>
                          <FileText size={10} />
                          <span style={{ maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.name}</span>
                          <button type="button" onClick={() => setReplyAttachments((prev) => prev.filter((_, j) => j !== i))}
                            style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer", padding: 0, display: "flex", lineHeight: 1 }}>
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8, padding: "0 14px 10px" }}>
                  <button type="button" onClick={() => replyDocFileRef.current?.click()} disabled={uploadingAttach} title="PDF / Document"
                    style={{ display: "flex", alignItems: "center", gap: 4, height: 38, padding: "0 10px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", cursor: uploadingAttach ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
                    <Paperclip size={13} /> Doc
                  </button>
                  <button type="button" onClick={() => replyImgFileRef.current?.click()} disabled={uploadingAttach} title="Photo / Image"
                    style={{ display: "flex", alignItems: "center", gap: 4, height: 38, padding: "0 10px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", cursor: uploadingAttach ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
                    <Image size={13} /> Photo
                  </button>
                  <button onClick={sendReply} disabled={sending || !hasReplyContent}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      height: 38, padding: "0 16px", background: hasReplyContent ? "#005F2D" : "rgba(0,95,45,0.3)",
                      border: "none", borderRadius: 9, color: "white", fontWeight: 700, fontSize: "0.85rem",
                      cursor: (sending || !hasReplyContent) ? "not-allowed" : "pointer",
                      opacity: (sending || !hasReplyContent) ? 0.55 : 1, transition: "all 0.15s",
                    }}>
                    <Send size={14} /> {sending ? "Envoi…" : "Envoyer"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Compose modal ── */}
      {composing && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: isMobile ? "stretch" : "flex-end", justifyContent: "center", zIndex: 60, padding: isMobile ? 0 : "16px" }}>
          <div style={{
            background: "#1A1D27", borderRadius: isMobile ? 0 : 16,
            width: "100%", maxWidth: isMobile ? "100%" : 620,
            border: isMobile ? "none" : "1px solid rgba(255,255,255,0.1)",
            display: "flex", flexDirection: "column",
            height: isMobile ? "100dvh" : undefined,
            maxHeight: isMobile ? undefined : "85dvh",
            overflow: "hidden",
          }}>
            {/* Modal header */}
            <div style={{ padding: "16px 20px 14px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <p style={{ color: "white", fontWeight: 700, fontSize: "1rem", margin: 0 }}>Nouveau message</p>
              <button onClick={() => setComposing(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            {/* Scrollable body so no field is pushed off-screen on mobile */}
            <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>

            {/* From + To + Subject */}
            <div style={{ padding: "14px 20px 0", flexShrink: 0 }}>
              <div style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem", width: 36, flexShrink: 0 }}>De</span>
                <select value={compFrom} onChange={(e) => setCompFrom(e.target.value)}
                  style={{ flex: 1, height: 38, background: "#252836", border: "1px solid rgba(0,95,45,0.4)", borderRadius: 8, color: "white", fontSize: "0.85rem", padding: "0 10px", outline: "none" }}>
                  {(senders.filter((s) => s.active).length ? senders.filter((s) => s.active) : [{ id: "d", email: "support@kt-bank-ag.com", label: "Support KT Bank", active: true }]).map((s) => (
                    <option key={s.id} value={s.email}>{s.label} — {s.email}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem", width: 36, flexShrink: 0 }}>Rôle</span>
                <input value={compRole} onChange={(e) => setCompRole(e.target.value)} placeholder="Intitulé affiché au client (ex: Account manager, Kontobetreuer…)"
                  style={{ flex: 1, height: 38, background: "#252836", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "white", fontSize: "0.85rem", padding: "0 12px", outline: "none" }} />
              </div>
              <div style={{ display: "flex", flexWrap: "nowrap", gap: 5, margin: "0 0 8px 44px", overflowX: "auto", paddingBottom: 2 }}>
                {ROLE_PRESETS.map((r) => (
                  <button key={r} type="button" onClick={() => setCompRole(r)}
                    style={{ flexShrink: 0, whiteSpace: "nowrap", background: compRole === r ? "rgba(0,95,45,0.35)" : "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, color: "rgba(255,255,255,0.7)", fontSize: "0.7rem", padding: "3px 10px", cursor: "pointer" }}>
                    {r}
                  </button>
                ))}
              </div>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", margin: "0 0 10px 44px" }}>
                Le client verra : <span style={{ color: "#4CAF82" }}>
                  {(senders.find((s) => s.email.toLowerCase() === compFrom.toLowerCase())?.label ?? compFrom)}{compRole.trim() ? ` - ${compRole.trim()}` : ""}
                </span>
              </p>
              {[
                { label: "À", value: compTo, set: setCompTo, placeholder: "client@example.com", type: "email" },
                { label: "Objet", value: compSubject, set: setCompSubject, placeholder: "Sujet du message", type: "text" },
              ].map(({ label, value, set, placeholder, type }) => (
                <div key={label} style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem", width: 36, flexShrink: 0 }}>{label}</span>
                  <input type={type} value={value} onChange={(e) => set(e.target.value)} placeholder={placeholder}
                    style={{ flex: 1, height: 38, background: "#252836", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "white", fontSize: "0.88rem", padding: "0 12px", outline: "none" }} />
                </div>
              ))}
            </div>

            {/* Mode toggle: rich editor vs paste a formatted HTML email */}
            <div style={{ display: "flex", gap: 6, margin: "8px 20px 0" }}>
              <button type="button" onClick={() => setCompRawMode(false)}
                style={{ flex: 1, height: 32, borderRadius: 8, border: "none", cursor: "pointer", fontSize: "0.76rem", fontWeight: 600, background: !compRawMode ? "#005F2D" : "#252836", color: !compRawMode ? "white" : "rgba(255,255,255,0.5)" }}>
                Éditeur
              </button>
              <button type="button" onClick={() => setCompRawMode(true)}
                style={{ flex: 1, height: 32, borderRadius: 8, border: "none", cursor: "pointer", fontSize: "0.76rem", fontWeight: 600, background: compRawMode ? "#005F2D" : "#252836", color: compRawMode ? "white" : "rgba(255,255,255,0.5)", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                <Code2 size={12} /> Coller un email HTML
              </button>
            </div>
            {/* Ready-made branded templates */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 20px 0" }}>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem", flexShrink: 0 }}>Modèle brandé</span>
              <select value=""
                onChange={(e) => {
                  const p = COMPOSER_PRESETS.find((x) => x.id === e.target.value);
                  if (!p) return;
                  setCompRawMode(true);
                  setCompRawHtml(p.html);
                  if (!compSubject.trim()) setCompSubject(p.subject);
                }}
                style={{ flex: 1, height: 32, background: "#252836", border: "1px solid rgba(201,168,76,0.4)", borderRadius: 8, color: "white", fontSize: "0.76rem", padding: "0 8px", outline: "none" }}>
                <option value="">— Choisir un modèle (avec logo) —</option>
                {COMPOSER_PRESETS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>

            {!compRawMode ? (
              /* Rich editor */
              <div style={{ overflow: "hidden", margin: "8px 20px 0", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, display: "flex", flexDirection: "column" }}>
                <RichEditor
                  key={compEditorKey.current}
                  token={token}
                  placeholder="Rédigez votre message…"
                  onHtmlChange={(html, text) => { setCompHtml(html); setCompText(text); }}
                  minHeight={isMobile ? 120 : 200}
                />
              </div>
            ) : (
              /* Paste a full HTML email → the client receives it rendered (not the code) */
              <div style={{ margin: "8px 20px 0", display: "flex", flexDirection: "column", gap: 8 }}>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem", margin: 0, lineHeight: 1.5 }}>
                  Collez le code HTML de votre email. Le client le recevra <strong style={{ color: "#4CAF82" }}>mis en forme</strong> (il ne verra pas le code) — voir l&apos;aperçu en dessous.
                </p>
                <textarea value={compRawHtml} onChange={(e) => setCompRawHtml(e.target.value)}
                  placeholder="<!DOCTYPE html> …"
                  style={{ width: "100%", minHeight: isMobile ? 120 : 150, background: "#0F1117", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "rgba(255,255,255,0.85)", fontSize: "0.76rem", fontFamily: "monospace", padding: 10, boxSizing: "border-box", outline: "none", resize: "vertical" }} />
                {compRawHtml.trim() && (
                  <div>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem", margin: "0 0 5px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Aperçu (ce que verra le client)</p>
                    <iframe srcDoc={compRawHtml} title="Aperçu email"
                      style={{ width: "100%", height: isMobile ? 260 : 320, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, background: "white" }} />
                  </div>
                )}
              </div>
            )}

            {/* Attachment bar — compose */}
            <div style={{ padding: "8px 20px 0", flexShrink: 0 }}>
              <input ref={compDocFileRef} type="file" hidden
                accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/plain"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadAttachment(f, setCompAttachments); e.target.value = ""; }} />
              <input ref={compImgFileRef} type="file" hidden
                accept="image/*"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadAttachment(f, setCompAttachments); e.target.value = ""; }} />
              <div style={{ display: "flex", gap: 6 }}>
                <button type="button" onClick={() => compDocFileRef.current?.click()} disabled={uploadingAttach}
                  style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "rgba(255,255,255,0.55)", padding: "6px 11px", fontSize: "0.78rem", cursor: uploadingAttach ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
                  <Paperclip size={13} /> {uploadingAttach ? "Upload…" : "PDF / Doc"}
                </button>
                <button type="button" onClick={() => compImgFileRef.current?.click()} disabled={uploadingAttach}
                  style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "rgba(255,255,255,0.55)", padding: "6px 11px", fontSize: "0.78rem", cursor: uploadingAttach ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
                  <Image size={13} /> Photo
                </button>
              </div>
              {compAttachments.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                  {compAttachments.map((a, i) => (
                    <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(0,95,45,0.15)", border: "1px solid rgba(0,95,45,0.4)", borderRadius: 8, padding: "3px 8px", fontSize: "0.75rem", color: "#4CAF82" }}>
                      <FileText size={11} />
                      <span style={{ maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.name}</span>
                      <button type="button" onClick={() => setCompAttachments((prev) => prev.filter((_, j) => j !== i))}
                        style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer", padding: 0, display: "flex", lineHeight: 1 }}>
                        <X size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* end scrollable body */}
            </div>

            {/* Send button */}
            <div style={{ padding: "12px 20px 16px", flexShrink: 0 }}>
              <button onClick={sendCompose}
                disabled={sending || !compReady}
                style={{
                  width: "100%", height: 44, background: "#005F2D", color: "white",
                  border: "none", borderRadius: 10, fontWeight: 700, fontSize: "0.9rem",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  opacity: (sending || !compReady) ? 0.6 : 1,
                }}>
                <Send size={15} /> {sending ? "Envoi…" : "Envoyer le message"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
