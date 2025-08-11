// src/components/ChatWidget.jsx
import React, { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

export default function ChatWidget({
  title = "AI Assistant",
  subtitle = "Ask me anything about Bhaskar.AI",
  welcomeText = "Hi! How can I help you today? 😊",

  // NEW: control where the widget is positioned
  position = "fixed",                           // "fixed" | "absolute"
  offset = { bottom: 24, right: 24 },           // button offset
  panelOffset = null,                           // popup offset (optional)
}) {
  const [open, setOpen] = useState(() => {
    try { return JSON.parse(localStorage.getItem("chat.open") || "false"); }
    catch { return false; }
  });

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
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("chat.open", JSON.stringify(open));
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  useEffect(() => {
    localStorage.setItem("chat.messages", JSON.stringify(messages));
    listRef.current?.scrollTo({ top: 999999, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const send = (msg) => {
    const m = (msg ?? text).trim();
    if (!m) return;
    setMessages((old) => [...old, { from: "user", text: m, t: Date.now() }]);
    setText("");
    setTimeout(() => {
      const reply = getBotReply(m);
      setMessages((old) => [...old, { from: "bot", text: reply, t: Date.now() }]);
    }, 600);
  };

  const getBotReply = (m) => {
    const q = m.toLowerCase();
    if (q.includes("meet") || q.includes("call"))
      return "Sure — share a time window and your email. I’ll send a calendar invite 📅";
    if (q.includes("price") || q.includes("pricing"))
      return "Pricing depends on scope. Send some details of your project and I’ll estimate ranges.";
    if (q.includes("resume") || q.includes("cv"))
      return "You can download the latest CV from the About section. Want me to paste the link?";
    return "Got it! I’ll note this. Anything else you’d like to discuss?";
  };

  const Quick = ({ label }) => (
    <button
      onClick={() => send(label)}
      className="text-xs px-3 py-1 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/15"
    >
      {label}
    </button>
  );

  // ---- positioning (works for fixed OR absolute) ----
  const btnStyle = {
    position,                      // "fixed" or "absolute"
    bottom: offset?.bottom ?? 24,
    right: offset?.right ?? 24,
  };

  const popupStyle = {
    position,
    right: (panelOffset?.right ?? offset?.right ?? 24),
    // place panel a bit above the button (button ~56px tall => +64)
    bottom: (panelOffset?.bottom ?? ((offset?.bottom ?? 24) + 64)),
  };

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

      {/* Overlay only when we use viewport-fixed */}
      {open && position === "fixed" && (
        <div
          className="fixed inset-0 z-[55] bg-black/20 backdrop-blur-[1px]"
          onClick={() => setOpen(false)}
        />
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

          <div className="flex flex-wrap gap-2 pt-2">
            <Quick label="Book a meeting" />
            <Quick label="Career question" />
            <Quick label="Pricing" />
          </div>
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => { e.preventDefault(); send(); }}
          className="flex items-center gap-2 p-3 border-t bg-white"
        >
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message…"
            className="flex-1 text-sm px-3 py-2 rounded-lg border border-gray-300 outline-none focus:border-orange-400"
          />
          <button type="submit" className="h-10 w-10 rounded-lg bg-black text-white flex items-center justify-center hover:bg-gray-800" aria-label="Send">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </>
  );
}
