"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

type Product = { id: string; name: string; category: string; price: string; image: string; description: string; featured?: boolean };
type Category = { id: string; name: string };
type Data = { categories: Category[]; products: Product[] };

export default function AdminPage() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [updated, setUpdated] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: "", category: "phones", price: "", image: "", description: "", featured: false });

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => setData(d.categories && d.products ? d : { categories: [], products: [] }))
      .catch(() => setData({ categories: [], products: [] }))
      .finally(() => setLoading(false));
  }, [updated]);

  const save = async (action: string, payload: Record<string, unknown>) => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...payload }),
    });
    if (res.ok) {
      setUpdated(!updated);
      setEditing(null);
      setForm({ name: "", category: "phones", price: "", image: "", description: "", featured: false });
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err.error || "Failed to save. Product edits may not persist on Vercel.");
    }
  };

  const deleteProduct = (id: string) => {
    if (confirm("Delete this product?")) save("delete_product", { id });
  };

  if (loading || !data) return <div className="p-8">Loading...</div>;

  return (
    <div>
      <div style={{ background: "#0a1628", color: "white", padding: "1rem 2rem" }}>
        <h1>📦 Product Management</h1>
        <p>Add, edit, or remove products</p>
        <Link href="/" style={{ color: "#38bdf8", marginTop: "0.5rem", display: "inline-block" }}>← Back to site</Link>
      </div>
      <div style={{ padding: "2rem" }}>
        <button
          onClick={() => {
            setEditing({} as Product);
            setForm({ name: "", category: "phones", price: "", image: "", description: "", featured: false });
          }}
          style={{ padding: "0.5rem 1rem", background: "#2563eb", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}
        >
          + Add Product
        </button>

        {editing && (
          <div style={{ marginTop: "1.5rem", padding: "1.5rem", background: "#f1f5f9", borderRadius: 12, maxWidth: 500 }}>
            <h3>{editing.id ? "Edit Product" : "Add Product"}</h3>
            <div style={{ marginTop: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>Name</label>
              <input value={form.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })} style={{ width: "100%", padding: "0.5rem" }} />
            </div>
            <div style={{ marginTop: "0.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>Category</label>
              <select value={form.category} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm({ ...form, category: e.target.value })} style={{ width: "100%", padding: "0.5rem" }}>
                {data.categories.filter((c) => c.id !== "all").map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div style={{ marginTop: "0.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>Price</label>
              <input value={form.price} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, price: e.target.value })} placeholder="₦1,250,000" style={{ width: "100%", padding: "0.5rem" }} />
            </div>
            <div style={{ marginTop: "0.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>Image URL</label>
              <input value={form.image} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, image: e.target.value })} style={{ width: "100%", padding: "0.5rem" }} />
            </div>
            <div style={{ marginTop: "0.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>Description</label>
              <textarea value={form.description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, description: e.target.value })} rows={2} style={{ width: "100%", padding: "0.5rem" }} />
            </div>
            <div style={{ marginTop: "0.5rem" }}>
              <label><input type="checkbox" checked={form.featured} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
            </div>
            <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => {
                  if (editing.id) save("update_product", { id: editing.id, ...form });
                  else save("add_product", form);
                }}
                style={{ padding: "0.5rem 1rem", background: "#2563eb", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}
              >
                Save
              </button>
              <button onClick={() => setEditing(null)} style={{ padding: "0.5rem 1rem", background: "#64748b", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <table style={{ width: "100%", marginTop: "1.5rem", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#1e3a5f", color: "white" }}>
              <th style={{ padding: "0.75rem", textAlign: "left" }}>Image</th>
              <th style={{ padding: "0.75rem", textAlign: "left" }}>Name</th>
              <th style={{ padding: "0.75rem", textAlign: "left" }}>Category</th>
              <th style={{ padding: "0.75rem", textAlign: "left" }}>Price</th>
              <th style={{ padding: "0.75rem", textAlign: "left" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.products.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "0.75rem" }}>
                  <Image src={p.image} alt="" width={50} height={50} style={{ objectFit: "cover", borderRadius: 4 }} unoptimized />
                </td>
                <td style={{ padding: "0.75rem" }}>{p.name}</td>
                <td style={{ padding: "0.75rem" }}>{p.category}</td>
                <td style={{ padding: "0.75rem" }}>{p.price}</td>
                <td style={{ padding: "0.75rem" }}>
                  <button
                    onClick={() => {
                      setEditing(p);
                      setForm({ name: p.name, category: p.category, price: p.price, image: p.image, description: p.description, featured: !!p.featured });
                    }}
                    style={{ padding: "0.25rem 0.5rem", background: "#2563eb", color: "white", border: "none", borderRadius: 4, cursor: "pointer", marginRight: "0.5rem" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    style={{ padding: "0.25rem 0.5rem", background: "#dc2626", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
