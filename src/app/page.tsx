import Link from "next/link";
import { CONFIG } from "@/lib/config";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SwapCards from "@/components/SwapCards";
import GetNewSection from "@/components/GetNewSection";
import ProductsSection from "@/components/ProductsSection";
import productsData from "@/lib/products";

export default async function Home() {
  const { categories, products } = productsData;

  return (
    <>
      <Header />

      <HeroSection />

      <section id="swap">
        <div className="section-header">
          <h2>Swap Your Device</h2>
          <p>Trade in your old phone or gadget for instant value toward your next upgrade</p>
        </div>
        <SwapCards />
      </section>

      <section id="get-new">
        <div className="section-header">
          <h2>Get New</h2>
          <p>Brand new phones, MacBooks, speakers & accessories</p>
        </div>
        <GetNewSection />
      </section>

      <section className="categories" id="products">
        <div className="section-header">
          <h2>Shop by Category</h2>
          <p>Browse our curated selection of premium devices</p>
          <Link href="/catalog" className="btn btn-primary" style={{ marginTop: "1rem" }}>
            📋 View Full Catalog & Cart
          </Link>
        </div>
        <ProductsSection categories={categories} products={products} />
      </section>

      <footer className="footer" id="contact">
        <div className="footer-content">
          <div>
            <img src="/chizzylogo.png" alt={CONFIG.SITE_NAME} className="footer-logo" />
            <p style={{ opacity: 0.9, fontSize: "0.9rem", marginTop: "0.5rem" }}>{CONFIG.SITE_TAGLINE}</p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <Link href="/#swap">Swap</Link>
            <Link href="/#get-new">Get New</Link>
            <Link href="/#products">Products</Link>
            <Link href="/catalog">Catalog</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div>
            <h4>Contact</h4>
            <a href={`https://wa.me/${CONFIG.WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
            <Link href="/contact">Contact Us</Link>
          </div>
        </div>
        <div className="footer-bottom">© {new Date().getFullYear()} {CONFIG.SITE_NAME}. All rights reserved.</div>
      </footer>

    </>
  );
}
