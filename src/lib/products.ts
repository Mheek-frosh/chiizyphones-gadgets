// Import products data at build time - works on Vercel (no fs needed)
import productsData from "../../data/products.json";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
  featured?: boolean;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
};

export type ProductsData = {
  categories: Category[];
  products: Product[];
};

export default productsData as ProductsData;
