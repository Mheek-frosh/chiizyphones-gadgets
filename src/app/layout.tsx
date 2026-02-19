import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Chatbot from "@/components/Chatbot";
import ScrollToHash from "@/components/ScrollToHash";

export const metadata: Metadata = {
  title: "Chizzy Phones & Gadgets - Swap • Upgrade • Get New",
  description: "Swap your old device for upgrade value. Get brand new phones, MacBooks & gadgets.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Suspense fallback={null}>
            <ScrollToHash />
          </Suspense>
          {children}
          <Chatbot />
        </CartProvider>
      </body>
    </html>
  );
}
