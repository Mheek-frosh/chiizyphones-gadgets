import Image from "next/image";
import Link from "next/link";

const CATEGORIES = [
  {
    id: "phones",
    title: "Phones",
    desc: "iPhone, Samsung, Google Pixel & more",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop",
  },
  {
    id: "macbooks",
    title: "MacBooks",
    desc: "MacBook Pro, Air & more",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
  },
  {
    id: "speakers",
    title: "Speakers & Audio",
    desc: "JBL, AirPods, premium audio",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop",
  },
  {
    id: "accessories",
    title: "Accessories",
    desc: "Apple Watch, cases, chargers",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=300&fit=crop",
  },
];

export default function GetNewSection() {
  return (
    <div className="cta-cards">
      {CATEGORIES.map((c) => (
        <Link key={c.id} href="#products" className="cta-card get-new">
          <Image
            src={c.image}
            alt={c.title}
            width={400}
            height={140}
            className="cta-card-img"
          />
          <h3>{c.title}</h3>
          <p>{c.desc}</p>
        </Link>
      ))}
    </div>
  );
}
