"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToHash() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (!hash) return;

    const scrollToEl = () => {
      const id = hash.slice(1);
      const el = document.getElementById(id);
      if (el) {
        const header = document.querySelector(".header");
        const offset = header ? (header as HTMLElement).offsetHeight : 0;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    };

    // Small delay so DOM is ready after client-side navigation
    const t = setTimeout(scrollToEl, 100);
    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}
