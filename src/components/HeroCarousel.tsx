"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const CAROUSEL_IMAGES = [
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=1200&h=800&fit=crop",
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % CAROUSEL_IMAGES.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <div className="hero-carousel-wrap">
        <div className="hero-carousel">
          <div className="hero-carousel-track">
            {CAROUSEL_IMAGES.map((src, i) => (
              <div
                key={i}
                className={`hero-carousel-slide ${i === index ? "active" : ""}`}
              >
                <Image
                  src={src}
                  alt="Premium phones and gadgets"
                  fill
                  sizes="100vw"
                  style={{ objectFit: "cover" }}
                  priority={i === 0}
                />
                <div className="hero-carousel-overlay" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="hero-carousel-dots">
        {CAROUSEL_IMAGES.map((_, i) => (
          <button
            key={i}
            className={`hero-carousel-dot ${i === index ? "active" : ""}`}
            onClick={() => setIndex(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </>
  );
}
