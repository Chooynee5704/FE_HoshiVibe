"use client";

import { useState, type CSSProperties } from "react";
import type { PageKey } from "../../types/navigation";

type Category = { id: number; name: string; image: string };

const pageStyle: CSSProperties = { backgroundColor: "#fff", color: "#000" };
const titleWrap: CSSProperties = { marginBottom: "3rem", textAlign: "center" };
const titleStyle: CSSProperties = { fontSize: "3rem", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: "0.5rem" };
const subtitle: CSSProperties = { fontSize: "1rem", color: "#999", letterSpacing: "0.1em", textTransform: "uppercase" };
const grid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "2rem",
  marginTop: "2rem",
};
const card: CSSProperties = {
  height: "400px",
  borderRadius: "0",
  overflow: "hidden",
  background: "#f5f5f5",
  position: "relative",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  border: "1px solid #e5e5e5",
  cursor: "pointer",
};
const imageStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
};
const overlay: CSSProperties = {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  padding: "2rem",
  background: "linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%)",
  color: "#fff",
  transition: "all 0.4s ease",
};
const nameStyle: CSSProperties = { margin: 0, fontSize: "1.25rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.15em" };

const categories: Category[] = [
  { id: 1, name: "VÒNG TAY", image: "/product_categories/vongtay.png" },
  { id: 2, name: "DÂY CHUYỀN", image: "/product_categories/daychuyen.jpg" },
  { id: 3, name: "NHẪN", image: "/product_categories/nhanphongthuy.png" },
  { id: 4, name: "PHỤ KIỆN KHÁC", image: "/product_categories/phukienkhac.png" },
  { id: 5, name: "SẢN PHẨM MỚI", image: "/accessories/mauthietke.jpg" },
  { id: 6, name: "TÙY CHỈNH", image: "/images/home_banner.png" },
];

export default function CategoriesSection({ onNavigate }: { onNavigate?: (page: PageKey) => void }) {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);

  return (
    <section style={pageStyle}>
      <div style={titleWrap}>
        <div style={subtitle}>Explore Our Collection</div>
        <h1 style={titleStyle}>DANH MỤC</h1>
      </div>

      <div style={grid}>
        {categories.map((c) => (
          <div
            key={c.id}
            style={{
              ...card,
              transform: hoveredCategory === c.id ? "scale(1.02)" : "scale(1)",
              borderColor: hoveredCategory === c.id ? "#000" : "#e5e5e5",
              boxShadow: hoveredCategory === c.id ? "0 20px 40px rgba(0,0,0,0.15)" : "0 4px 12px rgba(0,0,0,0.05)",
            }}
            onMouseEnter={() => setHoveredCategory(c.id)}
            onMouseLeave={() => setHoveredCategory(null)}
            onClick={() => onNavigate?.("search")}
          >
            <img
              src={c.image}
              alt={c.name}
              style={{ ...imageStyle, transform: hoveredCategory === c.id ? "scale(1.1)" : "scale(1)" }}
            />
            <div
              style={{
                ...overlay,
                background:
                  hoveredCategory === c.id
                    ? "linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)"
                    : overlay.background as string,
              }}
            >
              <h3 style={nameStyle}>{c.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
