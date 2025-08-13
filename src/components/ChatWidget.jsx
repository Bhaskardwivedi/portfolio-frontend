// src/components/ChatWidget.jsx
import React, { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2, Calendar } from "lucide-react";

/* ===== API BASE: Take only from env or props ===== */
const pickBase = (propBase) => {
  const envBase = (import.meta.env?.VITE_API_URL || "").trim();
  const chosen = propBase?.trim() || envBase;
  if (!chosen) {
    console.error("❌ No API base URL provided");
    return "";
  }
  return chosen.replace(/\/+$/, "");
};

export default function ChatWidget({
  title = "AI Assistant",
  subtitle = "Ask anything about my work",
  welcomeText = "Hi! I’m Bhaskar’s AI assistant. How can I help you today? 😊",
  position = "fixed",
  offset = { bottom: 24, right: 24 },
  panelOffset = null,
  apiBaseUrl = "" // ✅ Pass dynamically if you want
}) {
  const BASE = pickBase(apiBaseUrl);

  const [open, setOpen] = useState(() => {
    try { return JSON.parse(localStorage.getItem("chat.open") || "false"); }
    catch { return false; }
  });

  const [identity, setIdentity] = useState(() => {
    try { return JSON.parse(localStorage.getItem("chat.identity") || '{"name":"","email":""}'); }
    catch { return { name: "", email: "" }; }
  });
  const identified = Boolean(identity?.email);

  const [messages, setMessages] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("chat.messages") || "[]");
      return Array.isArray(saved) && saved.length
        ? saved
        : [{ from: "bot", text: welcomeText, t: Date.now() }];
    } catch {
      return [{ from: "bot", text: welcomeText, t: Date.now() }];
    }
  });

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [meta, setMeta] = useState(null);

  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("chat.open", JSON.stringify(open));
    if (open && identified) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open, identified]);

  useEffect(() => {
    localStorage.setItem("chat.messages", JSON.stringify(messages));
    listRef.current?.scrollTo({ top: 9e9, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("chat.identity", JSON.stringify(identity));
  }, [identity]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const btnStyle = { position, bottom: offset?.bottom ?? 24, right: offset?.right ?? 24 };
  const popupStyle = {
    position,
    right: (panelOffset?.right ?? offset?.right ?? 24),
    bottom: (panelOffset?.bottom ?? ((offset?.bottom ?? 24) + 64)),
  };

  /* ---------- API call ---------- */
  const send = async (msg) => {
    const m = (msg ?? text).trim();
    if (!m) return;

    if (!identified) {
      setApiError("Please enter your name & email to start.");
      return;
    }
    setApiError("");

    setMessages((old) => [...old, { from: "user", text: m, t: Date.now() }]);
    setText("");

    try {
      setLoading(true);

      if (!BASE) throw new Error("API base URL is missing");

      const url = `${BASE}/chat/`;
      console.log("Chat POST =>", url);

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        body: JSON.stringify({
          name: identity.name || "Guest",
          email: identity.email,
          message: m,
        }),
      });

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        console.warn("Chat RESP <", res.status, ">", body.slice(0, 200));
        setApiError(`API ${res.status}`);
        setMessages((old) => [
          ...old,
          { from: "bot", text: "Sorry, I’m having trouble right now.", t: Date.now() },
        ]);
        return;
      }

      const data = await res.json();
      const reply = data?.bot_reply || "(No reply)";
      setMessages((old) => [...old, { from: "bot", text: reply, t: Date.now() }]);

      setMeta({
        trigger_contact: data?.trigger_contact,
        trigger_meeting: data?.trigger_meeting,
        meeting_link: data?.meeting_link,
        calendar_link: data?.calendar_link,
        nlp_tags: data?.nlp_tags,
      });
    } catch (e) {
      setApiError(e?.message || "Network error");
      setMessages((old) => [
        ...old,
        { from: "bot", text: "Network error. Please try again.", t: Date.now() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const Quick = ({ label }) => (
    <button
      onClick={() => send(label)}
      className="text-xs px-3 py-1 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/15"
    >
      {label}
    </button>
  );

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open chat"
        style={btnStyle}
        className="z-[60] h-14 w-14 rounded-full shadow-xl
                   bg-gradient-to-tr from-orange-500 to-pink-500 text-white
                   flex items-center justify-center
                   hover:scale-[1.03] active:scale-95 transition"
      >
        <MessageCircle className="w-7 h-7" />
      </button>

      {open && position === "fixed" && (
        <div className="fixed inset-0 z-[55] bg-black/20 backdrop-blur-[1px]" onClick={() => setOpen(false)} />
      )}

      {/* Popup */}
      <div
        style={popupStyle}
        className={`z-[65] w-[92vw] max-w-[380px]
                    bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-black/5
                    overflow-hidden transform transition-all
                    ${open ? "translate-y-0 opacity-100"
                           : "pointer-events-none translate-y-4 opacity-0"}`}
        role="dialog"
        aria-modal={open ? "true" : "false"}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white">
          <div>
            <div className="text-sm font-semibold">{title}</div>
            <div className="text-[11px] opacity-90">{subtitle}</div>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close chat" className="p-1 rounded hover:bg-white/20">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div ref={listRef} className="max-h-[55vh] overflow-y-auto p-4 space-y-3 bg-white">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`px-3 py-2 rounded-2xl text-sm leading-relaxed shadow-sm max-w-[85%] ${
                  m.from === "user"
                    ? "bg-orange-100 text-gray-900 rounded-br-sm"
                    : "bg-gray-100 text-gray-900 rounded-bl-sm"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {meta?.meeting_link && (
            <div className="flex items-start gap-2 text-sm bg-green-50 border border-green-200 text-gray-800 rounded-lg p-3">
              <Calendar className="w-4 h-4 mt-0.5" />
              <div>
                Meeting ready:{" "}
                <a className="underline" href={meta.meeting_link} target="_blank" rel="noreferrer">Join link</a>
                {meta?.calendar_link && (
                  <>
                    {" "} | <a className="underline" href={meta.calendar_link} target="_blank" rel="noreferrer">Add to Calendar</a>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <Quick label="Website development" />
            <Quick label="Data engineering" />
            <Quick label="Automation" />
            <Quick label="Book a meeting" />
          </div>

          {loading && (
            <div className="flex items-center gap-2 text-gray-500 text-sm pt-1">
              <Loader2 className="w-4 h-4 animate-spin" /> thinking…
            </div>
          )}
          {apiError && <div className="text-xs text-red-600 pt-1">{apiError}</div>}
        </div>

        {/* Identity gate OR chat input */}
        {!identified ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!identity.email) return;
              localStorage.setItem("chat.identity", JSON.stringify(identity));
            }}
            className="grid grid-cols-1 gap-2 p-3 border-t bg-white"
          >
            <input
              value={identity.name}
              onChange={(e) => setIdentity((s) => ({ ...s, name: e.target.value }))}
              placeholder="Your name"
              autoComplete="name"
              className="text-sm px-3 py-2 rounded-lg border border-gray-300 outline-none focus:border-orange-400 bg-white text-gray-900 placeholder-gray-500"
            />
            <input
              value={identity.email}
              onChange={(e) => setIdentity((s) => ({ ...s, email: e.target.value }))}
              placeholder="Your email"
              type="email"
              autoComplete="email"
              className="text-sm px-3 py-2 rounded-lg border border-gray-300 outline-none focus:border-orange-400 bg-white text-gray-900 placeholder-gray-500"
            />
            <button type="submit" className="h-10 rounded-lg bg-black text-white hover:bg-gray-800 text-sm">
              Start chat
            </button>
            <p className="text-[11px] text-gray-500">We use your email only to send meeting invites.</p>
          </form>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex items-center gap-2 p-3 border-t bg-white">
            <input
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your message…"
              className="flex-1 text-sm px-3 py-2 rounded-lg border border-gray-300 outline-none focus:border-orange-400 bg-white text-gray-900 placeholder-gray-500"
            />
            <button
              type="submit"
              disabled={loading || !text.trim()}
              className="h-10 w-10 rounded-lg bg-black text-white flex items-center justify-center hover:bg-gray-800 disabled:opacity-60"
              aria-label="Send"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
