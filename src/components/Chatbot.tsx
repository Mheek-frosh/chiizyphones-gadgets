"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { CONFIG } from "@/lib/config";
import { useCart } from "@/context/CartContext";

function WhatsAppIcon({ className = "chatbot-whatsapp-icon" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function Chatbot() {
  const pathname = usePathname();
  const { cart, cartCount, removeFromCart } = useCart();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! 👋 Type your message or inquiry below and click Send to open WhatsApp directly.", isUser: false },
  ]);
  const [input, setInput] = useState("");
  const [inquirySummary, setInquirySummary] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const openHandler = () => setOpen(true);
    window.addEventListener("chatbot-open", openHandler);
    return () => window.removeEventListener("chatbot-open", openHandler);
  }, []);

  useEffect(() => {
    const handler = (e: CustomEvent<{ name: string; price: string }>) => {
      setOpen(true);
      setMessages((m) => [
        ...m,
        { text: `I'm interested in: ${e.detail.name} (${e.detail.price})`, isUser: true },
        { text: "Great choice! Add to cart or type your message and click Send to open WhatsApp.", isUser: false },
      ]);
      setInquirySummary(`Product: ${e.detail.name} | Price: ${e.detail.price}`);
    };
    window.addEventListener("chatbot-inquire", handler);
    return () => window.removeEventListener("chatbot-inquire", handler);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, cart]);

  const addMessage = (text: string, isUser: boolean) => {
    setMessages((m) => [...m, { text, isUser }]);
  };

  const parsePrice = (priceStr: string) => {
    const num = parseInt(priceStr.replace(/[^\d]/g, ""), 10);
    return isNaN(num) ? 0 : num;
  };

  const formatPrice = (n: number) => "₦" + n.toLocaleString("en-NG");

  const totalPrice = cart.reduce(
    (sum, c) => sum + parsePrice(c.product.price) * c.qty,
    0
  );

  const sendToWhatsApp = (customMessage?: string) => {
    let msg: string;
    if (customMessage) {
      msg = customMessage.trim();
    } else if (cart.length > 0) {
      const lines = cart.map(
        (c) => `• ${c.product.name} x${c.qty} - ${c.product.price}`
      );
      msg = `Hi! I'd like to order:\n\n${lines.join("\n")}\n\nTotal: ${formatPrice(totalPrice)}`;
    } else {
      msg = inquirySummary
        ? `Hi! I'm interested in: ${inquirySummary}`
        : "Hi! I'd like to inquire about your products.";
    }
    window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    addMessage(text, true);
    setInquirySummary((s) => (s ? s + " | " + text : text));
    const msg = text.startsWith("Hi") || text.startsWith("hi") ? text : `Hi! ${text}`;
    sendToWhatsApp(msg);
  };

  const hasCartOrInquiry = cart.length > 0 || inquirySummary;

  return (
    <>
      {!isHome && (
      <button
        className="chatbot-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        <WhatsAppIcon />
        {cartCount > 0 && (
          <span className="chatbot-cart-badge">+{cartCount}</span>
        )}
      </button>
      )}
      <div className={`chatbot-panel ${open ? "open" : ""}`}>
        <div className="chatbot-header">
          <span className="chatbot-header-icon">
            <WhatsAppIcon />
          </span>
          <div>
            <h3>Chat on WhatsApp</h3>
            <small style={{ opacity: 0.9 }}>
              {cartCount > 0 ? `${cartCount} item(s) in cart` : "Type your message & send"}
            </small>
          </div>
          <button
            className="chatbot-close"
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            title="Close"
          >
            ✕
          </button>
        </div>
        <div className="chatbot-messages">
          {messages.map((m, i) => (
            <div key={i} className={`chat-msg ${m.isUser ? "user" : "bot"}`}>
              {m.text}
            </div>
          ))}
          {cart.length > 0 && (
            <div className="chatbot-cart-section">
              <div className="chat-msg bot">
                <strong>Your cart:</strong>
                {cart.map((c) => (
                  <div key={c.product.id} className="chatbot-cart-item">
                    <span>{c.product.name} x{c.qty}</span>
                    <span className="chatbot-cart-price">{c.product.price}</span>
                    <button
                      className="chatbot-cart-remove"
                      onClick={() => removeFromCart(c.product.id)}
                      aria-label="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <div className="chatbot-cart-total">
                  Total: {formatPrice(totalPrice)}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="chatbot-input-area">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message or inquiry..."
          />
          <button onClick={handleSend} className="chatbot-send-btn">
            Send
          </button>
        </div>
        {hasCartOrInquiry && (
          <div className="chatbot-whatsapp-buttons">
            <button className="whatsapp-send" onClick={() => sendToWhatsApp()}>
              <WhatsAppIcon className="chatbot-whatsapp-icon-sm" />
              {cart.length > 0 ? "Send Order" : "Send Inquiry"} to WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
}
