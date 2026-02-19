import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import productsData from "@/lib/products";

const DATA_PATH = path.join(process.cwd(), "data", "products.json");

export async function GET() {
  try {
    return NextResponse.json(productsData);
  } catch (e) {
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // Vercel serverless has read-only filesystem - admin edits won't persist in production
  if (process.env.VERCEL) {
    return NextResponse.json(
      { error: "Product edits are not saved on Vercel. Run locally to manage products." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const file = await fs.readFile(DATA_PATH, "utf-8");
    const data = JSON.parse(file);

    if (body.action === "add_product") {
      const newProduct = {
        id: "prod_" + Date.now(),
        name: body.name ?? "",
        category: body.category ?? "phones",
        price: body.price ?? "",
        image: body.image ?? "https://via.placeholder.com/400",
        description: body.description ?? "",
        featured: !!body.featured,
      };
      data.products.push(newProduct);
    } else if (body.action === "delete_product" && body.id) {
      data.products = data.products.filter((p: { id: string }) => p.id !== body.id);
    } else if (body.action === "update_product" && body.id) {
      const idx = data.products.findIndex((p: { id: string }) => p.id === body.id);
      if (idx >= 0) {
        data.products[idx] = {
          ...data.products[idx],
          name: body.name ?? data.products[idx].name,
          category: body.category ?? data.products[idx].category,
          price: body.price ?? data.products[idx].price,
          image: body.image ?? data.products[idx].image,
          description: body.description ?? data.products[idx].description,
          featured: body.featured ?? data.products[idx].featured,
        };
      }
    }

    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to update products" }, { status: 500 });
  }
}
