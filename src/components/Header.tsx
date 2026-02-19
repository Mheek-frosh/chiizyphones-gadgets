"use client";

import Link from "next/link";
import { CONFIG } from "@/lib/config";
import { useEffect } from "react";

export default function Header() {
  useEffect(() => {
    const onScroll = () => {
      document.querySelector(".header")?.classList.toggle("scrolled", window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="header">
      <nav className="nav">
        <Link href="/" className="logo-link">
          <img src="/chizzylogo.png" alt={CONFIG.SITE_NAME} className="logo" loading="eager" width={180} height={44} />
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
  );
}
