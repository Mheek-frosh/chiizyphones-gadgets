"use client";

export default function SwapCards() {
  const openChat = () => window.dispatchEvent(new CustomEvent("chatbot-open"));

  return (
    <div className="cta-cards">
      <a href="#chatbot" className="cta-card swap" onClick={(e) => { e.preventDefault(); openChat(); }}>
        <div className="icon">🔄</div>
        <h3>Swap Phone</h3>
        <p>Get instant value for your used iPhone, Samsung, or any smartphone</p>
      </a>
      <a href="#chatbot" className="cta-card swap" onClick={(e) => { e.preventDefault(); openChat(); }}>
        <div className="icon">💻</div>
        <h3>Swap Laptop</h3>
        <p>Trade in your MacBook or laptop for upgrade credit</p>
      </a>
      <a href="#chatbot" className="cta-card swap" onClick={(e) => { e.preventDefault(); openChat(); }}>
        <div className="icon">📱</div>
        <h3>Swap Gadget</h3>
        <p>Speakers, tablets, watches – we take them all</p>
      </a>
    </div>
  );
}
