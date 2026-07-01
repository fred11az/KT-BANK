"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, Check, X } from "lucide-react";

type Notification = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
};

type NotificationsResponse = {
  notifications: Notification[];
  unread: number;
};

type NotificationsBellProps = {
  token: string;
  lang: string;
  onNavigate?: (link: string) => void;
};

const LOCALE_MAP: Record<string, string> = {
  de: "de-DE",
  fr: "fr-FR",
  en: "en-GB",
  ar: "ar-SA",
  tr: "tr-TR",
  es: "es-ES",
  it: "it-IT",
  pt: "pt-PT",
  nl: "nl-NL",
};

type Dict = {
  notifications: string;
  markAllRead: string;
  empty: string;
  now: string;
  minutes: string;
  hours: string;
  days: string;
};

const STRINGS: Record<string, Dict> = {
  de: {
    notifications: "Benachrichtigungen",
    markAllRead: "Alle als gelesen markieren",
    empty: "Keine Benachrichtigungen",
    now: "gerade eben",
    minutes: "Min.",
    hours: "Std.",
    days: "T",
  },
  fr: {
    notifications: "Notifications",
    markAllRead: "Tout marquer comme lu",
    empty: "Aucune notification",
    now: "à l'instant",
    minutes: "min",
    hours: "h",
    days: "j",
  },
  en: {
    notifications: "Notifications",
    markAllRead: "Mark all as read",
    empty: "No notifications",
    now: "just now",
    minutes: "m",
    hours: "h",
    days: "d",
  },
  ar: {
    notifications: "الإشعارات",
    markAllRead: "تحديد الكل كمقروء",
    empty: "لا توجد إشعارات",
    now: "الآن",
    minutes: "د",
    hours: "س",
    days: "ي",
  },
  tr: {
    notifications: "Bildirimler",
    markAllRead: "Tümünü okundu olarak işaretle",
    empty: "Bildirim yok",
    now: "az önce",
    minutes: "dk",
    hours: "sa",
    days: "g",
  },
  es: {
    notifications: "Notificaciones",
    markAllRead: "Marcar todo como leído",
    empty: "Sin notificaciones",
    now: "ahora mismo",
    minutes: "min",
    hours: "h",
    days: "d",
  },
  it: {
    notifications: "Notifiche",
    markAllRead: "Segna tutto come letto",
    empty: "Nessuna notifica",
    now: "proprio ora",
    minutes: "min",
    hours: "h",
    days: "g",
  },
  pt: {
    notifications: "Notificações",
    markAllRead: "Marcar tudo como lido",
    empty: "Sem notificações",
    now: "agora mesmo",
    minutes: "min",
    hours: "h",
    days: "d",
  },
  nl: {
    notifications: "Meldingen",
    markAllRead: "Alles als gelezen markeren",
    empty: "Geen meldingen",
    now: "zojuist",
    minutes: "min",
    hours: "u",
    days: "d",
  },
};

function tr(lang: string, table: Record<string, Dict>): Dict {
  return table[lang] ?? table.de;
}

function relativeTime(lang: string, createdAt: string): string {
  const d = tr(lang, STRINGS);
  const locale = LOCALE_MAP[lang] ?? LOCALE_MAP.de;
  const then = new Date(createdAt).getTime();
  if (Number.isNaN(then)) return "";
  const now = Date.now();
  const diffMs = now - then;
  if (diffMs < 0) return d.now;
  const sec = Math.floor(diffMs / 1000);
  if (sec < 60) return d.now;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}${d.minutes}`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `${hrs}${d.hours}`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}${d.days}`;
  try {
    return new Date(createdAt).toLocaleDateString(locale);
  } catch {
    return new Date(createdAt).toLocaleDateString();
  }
}

export default function NotificationsBell({ token, lang, onNavigate }: NotificationsBellProps) {
  const d = tr(lang, STRINGS);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/kt/client/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = (await res.json()) as NotificationsResponse;
      if (Array.isArray(data?.notifications)) {
        setItems(data.notifications);
      }
      setUnread(typeof data?.unread === "number" ? data.unread : 0);
    } catch {
      /* ignore network errors, keep last known state */
    }
  }, [token]);

  useEffect(() => {
    fetchNotifications();
    // Only poll while the tab is visible — avoids wasted requests in background tabs.
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") fetchNotifications();
    }, 45000);
    const onVis = () => { if (document.visibilityState === "visible") fetchNotifications(); };
    document.addEventListener("visibilitychange", onVis);
    return () => { clearInterval(interval); document.removeEventListener("visibilitychange", onVis); };
  }, [fetchNotifications]);

  useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  const markRead = useCallback(
    async (id: string) => {
      try {
        await fetch("/api/kt/client/notifications", {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });
      } catch {
        /* ignore */
      }
      await fetchNotifications();
    },
    [token, fetchNotifications]
  );

  const markAllRead = useCallback(async () => {
    try {
      await fetch("/api/kt/client/notifications", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ all: true }),
      });
    } catch {
      /* ignore */
    }
    await fetchNotifications();
  }, [token, fetchNotifications]);

  const handleItemClick = useCallback(
    async (n: Notification) => {
      if (!n.read) {
        await markRead(n.id);
      }
      if (n.link) {
        onNavigate?.(n.link);
        setOpen(false);
      }
    },
    [markRead, onNavigate]
  );

  const badgeText = unread > 9 ? "9+" : String(unread);

  return (
    <div ref={containerRef} style={{ position: "relative", display: "inline-flex" }}>
      <button
        type="button"
        aria-label={d.notifications}
        onClick={() => setOpen((v) => !v)}
        style={{
          background: "#F5F7FA",
          border: "none",
          borderRadius: 10,
          padding: 8,
          cursor: "pointer",
          position: "relative",
          display: "flex",
        }}
      >
        <Bell size={17} color="#64748B" />
        {unread > 0 && (
          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              minWidth: 16,
              height: 16,
              padding: "0 4px",
              borderRadius: 999,
              background: "#EF4444",
              color: "#FFFFFF",
              fontSize: 10,
              fontWeight: 700,
              lineHeight: "16px",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box",
            }}
          >
            {badgeText}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={d.notifications}
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: 320,
            maxHeight: 420,
            overflowY: "auto",
            background: "#FFFFFF",
            borderRadius: 12,
            boxShadow: "0 12px 32px rgba(15, 23, 42, 0.16)",
            zIndex: 60,
            border: "1px solid #E2E8F0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 14px",
              borderBottom: "1px solid #E2E8F0",
              position: "sticky",
              top: 0,
              background: "#FFFFFF",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 14, color: "#0F172A" }}>{d.notifications}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                type="button"
                onClick={markAllRead}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#005F2D",
                  fontSize: 12,
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: 0,
                }}
              >
                <Check size={13} color="#005F2D" />
                {d.markAllRead}
              </button>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "inline-flex",
                  padding: 0,
                }}
              >
                <X size={15} color="#64748B" />
              </button>
            </div>
          </div>

          {items.length === 0 ? (
            <div
              style={{
                padding: "32px 14px",
                textAlign: "center",
                color: "#64748B",
                fontSize: 13,
              }}
            >
              {d.empty}
            </div>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {items.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => handleItemClick(n)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      border: "none",
                      borderBottom: "1px solid #F1F5F9",
                      cursor: "pointer",
                      background: n.read ? "#FFFFFF" : "rgba(0, 95, 45, 0.06)",
                      padding: "12px 14px",
                      display: "flex",
                      gap: 8,
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        width: 8,
                        height: 8,
                        marginTop: 5,
                        borderRadius: 999,
                        background: n.read ? "transparent" : "#005F2D",
                      }}
                    />
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          display: "block",
                          fontWeight: 700,
                          fontSize: 13,
                          color: "#0F172A",
                        }}
                      >
                        {n.title}
                      </span>
                      {n.body && (
                        <span
                          style={{
                            display: "block",
                            fontSize: 12,
                            color: "#64748B",
                            marginTop: 2,
                          }}
                        >
                          {n.body}
                        </span>
                      )}
                      <span
                        style={{
                          display: "block",
                          fontSize: 11,
                          color: "#94A3B8",
                          marginTop: 4,
                        }}
                      >
                        {relativeTime(lang, n.created_at)}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
