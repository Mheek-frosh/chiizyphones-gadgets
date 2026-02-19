"use client";

import { useState } from "react";
import Link from "next/link";
import { CONFIG } from "@/lib/config";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Open WhatsApp with pre-filled message
    const text = encodeURIComponent(
      `Hi! My name is ${name}${email ? ` (${email})` : ""}.\n\n${message}`
    );
    window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${text}`, "_blank");
    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  const whatsappNum = CONFIG.WHATSAPP_NUMBER.length >= 13
    ? `+${CONFIG.WHATSAPP_NUMBER.slice(0, 3)} ${CONFIG.WHATSAPP_NUMBER.slice(3, 6)} ${CONFIG.WHATSAPP_NUMBER.slice(6, 9)} ${CONFIG.WHATSAPP_NUMBER.slice(9)}`
    : `+${CONFIG.WHATSAPP_NUMBER}`;

  return (
    <div className="contact-page">
      <header className="header">
        <nav className="nav">
          <Link href="/" className="logo-link">
            <img src="/chizzylogo.png" alt={CONFIG.SITE_NAME} className="logo" />
          </Link>
          <button
            className="menu-toggle"
            aria-label="Menu"
            onClick={() => document.querySelector(".nav-links")?.classList.toggle("open")}
          >
            ☰
          </button>
          <ul className="nav-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/#swap">Swap</Link></li>
            <li><Link href="/#get-new">Get New</Link></li>
            <li><Link href="/#products">Products</Link></li>
            <li><Link href="/catalog">Catalog</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </nav>
      </header>

      <main className="contact-main">
        <div className="contact-container">
          <h1>Contact Us</h1>
          <p className="contact-intro">Get in touch with us. We&apos;re here to help!</p>

          <div className="contact-grid">
            <div className="contact-form-section">
              <h2>Send us a message</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email (optional)</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Your Message</label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                    placeholder="What would you like to ask or order?"
                    rows={4}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Send via WhatsApp
                </button>
                {submitted && (
                  <p className="form-success">Opening WhatsApp... Complete your message there!</p>
                )}
              </form>
            </div>

            <div className="contact-info-section">
              <h2>Find us</h2>
              <div className="contact-details">
                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <div>
                    <strong>Location</strong>
                    <p>{CONFIG.ADDRESS}</p>
                  </div>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📱</span>
                  <div>
                    <strong>WhatsApp</strong>
                    <a href={`https://wa.me/${CONFIG.WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
                      {whatsappNum}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-map-section">
            <h2>Our Location</h2>
            <div className="contact-map">
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(CONFIG.ADDRESS)}&z=15&output=embed`}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Chizzy Phones & Gadgets Location"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
