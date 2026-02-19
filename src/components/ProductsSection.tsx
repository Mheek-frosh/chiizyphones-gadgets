"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

type Category = { id: string; name: string; icon: string };
type Product = { id: string; name: string; category: string; price: string; image: string; description: string };

export default function ProductsSection({ categories, products }: { categories: Category[]; products: Product[] }) {
  const { addToCart, cart } = useCart();
  const inCart = (id: string) => cart.some((c) => c.product.id === id);
  useEffect(() => {
    const cards = document.querySelectorAll(".category-card");
    const productCards = document.querySelectorAll(".product-card");
    const filter = (cat: string) => {
      cards.forEach((c) => {
        c.classList.toggle("active", (c as HTMLElement).dataset.category === cat);
      });
      productCards.forEach((p) => {
        const el = p as HTMLElement;
        el.style.display = cat === "all" || el.dataset.category === cat ? "block" : "none";
      });
    };
    cards.forEach((c) => {
      c.addEventListener("click", () => filter((c as HTMLElement).dataset.category || "all"));
    });
    cards.forEach((c) => {
      if ((c as HTMLElement).dataset.category === "all") c.classList.add("active");
    });
  }, [categories, products]);

  return (
    <>
      <div className="category-grid">
        {categories.map((c) => (
          <div key={c.id} className="category-card" data-category={c.id}>
            <div className="icon">{c.icon}</div>
            <span>{c.name}</span>
          </div>
        ))}
      </div>
      <div className="products-grid" style={{ marginTop: "2rem" }}>
        {products.map((p) => (
          <div key={p.id} className={`product-card ${inCart(p.id) ? "in-cart" : ""}`} data-category={p.category}>
            <Image src={p.image} alt={p.name} width={400} height={200} style={{ width: "100%", height: 200, objectFit: "cover" }} />
            <div className="product-info">
              <div className="category-badge">{p.category}</div>
              <h3>{p.name}</h3>
              <div className="price">{p.price}</div>
              <p>{p.description}</p>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1, justifyContent: "center", padding: "0.6rem", fontSize: "0.9rem" }}
                  onClick={() => addToCart({ id: p.id, name: p.name, price: p.price, image: p.image, category: p.category })}
                >
                  {inCart(p.id) ? "✓ In Cart" : "+ Add to Cart"}
                </button>
                <button
                  className="btn"
                  style={{ padding: "0.6rem", fontSize: "0.9rem", background: "var(--gray-100)", color: "var(--dark)" }}
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent("chatbot-inquire", { detail: { name: p.name, price: p.price } }));
                  }}
                >
                  💬
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
