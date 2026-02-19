"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { CONFIG } from "@/lib/config";
import { useCart } from "@/context/CartContext";

type Product = { id: string; name: string; category: string; price: string; image: string; description: string };

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const { cart, addToCart, removeFromCart, cartCount } = useCart();

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => setProducts(Array.isArray(d?.products) ? d.products : []))
      .catch(() => setProducts([]));
  }, []);

  const inCart = (id: string) => cart.some((c) => c.product.id === id);

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
    const lines = cart.map(
      (c) => `• ${c.product.name} x${c.qty} - ${c.product.price}`
    );
    const msg = encodeURIComponent(
      `Hi! I'd like to order:\n\n${lines.join("\n")}\n\nTotal: ${formatPrice(totalPrice)}`
    );
    window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  return (
    <div className="catalog-page">
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

      <main className="catalog-main">
        <div className="catalog-container">
          <div className="catalog-header">
            <h1>Product Catalog</h1>
            <button
              className="catalog-cart-btn"
              onClick={() => setCartOpen(true)}
            >
              🛒 Cart <span className="catalog-cart-count">{cartCount}</span>
            </button>
          </div>

          <div className="catalog-grid">
            {products.map((p) => (
              <div
                key={p.id}
                className={`catalog-product-card ${inCart(p.id) ? "in-cart" : ""}`}
              >
                <Image
                  src={p.image}
                  alt={p.name}
                  width={400}
                  height={200}
                  style={{ width: "100%", height: 200, objectFit: "cover" }}
                />
                <div className="product-info">
                  <div className="category-badge">{p.category}</div>
                  <h3>{p.name}</h3>
                  <div className="price">{p.price}</div>
                  <p>{p.description}</p>
                  <button
                    className={`add-btn ${inCart(p.id) ? "added" : ""}`}
                    onClick={() => addToCart({ id: p.id, name: p.name, price: p.price, image: p.image, category: p.category })}
                  >
                    {inCart(p.id) ? "✓ In Cart" : "+ Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {cartOpen && (
        <>
          <div
            className="cart-overlay"
            onClick={() => setCartOpen(false)}
          />
          <div className="cart-sidebar">
            <div className="cart-sidebar-header">
              <h2>Your Selection ({cartCount} items)</h2>
              <button
                className="cart-sidebar-close"
                onClick={() => setCartOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="cart-sidebar-body">
              {cart.length === 0 ? (
                <div className="cart-empty">No items yet. Add products from the catalog!</div>
              ) : (
                cart.map((c) => (
                  <div key={c.product.id} className="cart-item">
                    <Image
                      src={c.product.image}
                      alt={c.product.name}
                      width={60}
                      height={60}
                      style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }}
                    />
                    <div className="cart-item-info">
                      <div className="cart-item-name">{c.product.name}</div>
                      <div className="cart-item-price">
                        {c.product.price} {c.qty > 1 && `× ${c.qty}`}
                      </div>
                    </div>
                    <button
                      className="cart-item-remove"
                      onClick={() => removeFromCart(c.product.id)}
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="cart-sidebar-footer">
                <div className="cart-total">
                  Total: <span>{formatPrice(totalPrice)}</span>
                </div>
                <button
                  className="cart-send-whatsapp"
                  onClick={sendToWhatsApp}
                >
                  📱 Send Order via WhatsApp
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
