"use client";

import { useState, useRef, useEffect } from "react";
import { CONFIG } from "@/lib/config";
import { useCart } from "@/context/CartContext";

export default function Chatbot() {
  const { cart, cartCount, removeFromCart } = useCart();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! 👋 What kind of device are you looking for? Add items to cart and send your order to WhatsApp!", isUser: false },
  ]);
  const [input, setInput] = useState("");
  const [inquirySummary, setInquirySummary] = useState("");
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: CustomEvent<{ name: string; price: string }>) => {
      setOpen(true);
      setMessages((m) => [
        ...m,
        { text: `I'm interested in: ${e.detail.name} (${e.detail.price})`, isUser: true },
        { text: "Great choice! Ready to send this to WhatsApp? Check your cart below.", isUser: false },
      ]);
      setInquirySummary(`Product: ${e.detail.name} | Price: ${e.detail.price}`);
      setShowWhatsApp(true);
    };
    window.addEventListener("chatbot-inquire" as any, handler);
    return () => window.removeEventListener("chatbot-inquire" as any, handler);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, cart]);

  const addMessage = (text: string, isUser: boolean) => {
    setMessages((m) => [...m, { text, isUser }]);
  };

  const sendChat = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    addMessage(text, true);
    setInquirySummary((s) => (s ? s + " | " + text : text));
    addMessage("Thanks! When you're ready, send your cart to WhatsApp below.", false);
    setShowWhatsApp(true);
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

  const sendToWhatsApp = () => {
    let msg: string;
    if (cart.length > 0) {
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

  const hasCartOrInquiry = cart.length > 0 || inquirySummary;

  return (
    <>
      <button
        className="chatbot-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Chat with us"
        title="Chat & Cart"
      >
        💬
        {cartCount > 0 && (
          <span className="chatbot-cart-badge">+{cartCount}</span>
        )}
      </button>
      <div className={`chatbot-panel ${open ? "open" : ""}`}>
        <div className="chatbot-header">
          <span style={{ fontSize: "1.5rem" }}>💬</span>
          <div>
            <h3>Chat & Cart</h3>
            <small style={{ opacity: 0.9 }}>
              {cartCount > 0 ? `${cartCount} item(s) in cart` : "Add items & send to WhatsApp"}
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
            onKeyPress={(e) => e.key === "Enter" && sendChat()}
            placeholder="Type your message..."
          />
          <button onClick={sendChat}>Send</button>
        </div>
        {hasCartOrInquiry && (
          <div style={{ padding: "0 1rem 1rem" }}>
            <button className="whatsapp-send" onClick={sendToWhatsApp}>
              📱 {cart.length > 0 ? "Send Order" : "Send"} to WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
}
