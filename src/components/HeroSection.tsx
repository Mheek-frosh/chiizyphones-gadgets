"use client";

import { CONFIG } from "@/lib/config";
import HeroCarousel from "./HeroCarousel";

export default function HeroSection() {
  return (
    <section className="hero" id="hero">
      <div className="hero-bg-effects">
        <div className="hero-gradient-orb hero-orb-1" />
        <div className="hero-gradient-orb hero-orb-2" />
        <div className="hero-grid-pattern" />
      </div>
      <HeroCarousel />
      <div className="hero-content">
        <span className="hero-badge">✨ Premium Tech • Trusted in Abuja</span>
        <h1 className="hero-title">
          <span className="hero-title-line">Upgrade Your</span>
          <span className="hero-title-line hero-title-accent">Tech Life</span>
        </h1>
        <p className="hero-tagline">{CONFIG.SITE_TAGLINE}</p>
        <p className="hero-subtitle">
          Swap your old device for instant value • Get brand new iPhones, MacBooks & gadgets at the best prices
        </p>
        <div className="hero-buttons">
          <a href="#swap" className="btn btn-primary hero-btn">
            <span>🔄 Swap My Device</span>
          </a>
          <a href="#get-new" className="btn btn-outline hero-btn">
            <span>🛒 Shop New</span>
          </a>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-num">1000+</span>
            <span className="hero-stat-label">Happy Customers</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num">50+</span>
            <span className="hero-stat-label">Premium Brands</span>
          </div>
          <div className="hero-stat">
            <span className="hero-stat-num">Wuse 2</span>
            <span className="hero-stat-label">Abuja Location</span>
          </div>
        </div>
      </div>
    </section>
  );
}
