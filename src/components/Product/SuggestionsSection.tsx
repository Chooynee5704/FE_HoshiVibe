"use client";

import { useState, type CSSProperties } from "react";

type UIProduct = { id: number; name: string; image: string; rating: number; sold: string };

const sectionWrap: CSSProperties = { marginTop: "5rem" };
const rowBetween: CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between" };
const sectionTitle: CSSProperties = { fontSize: "1.75rem", fontWeight: 900, letterSpacing: "0.05em", marginBottom: "1.5rem", textTransform: "uppercase", position: "relative", paddingBottom: "1rem" };
const sectionTitleAfter: CSSProperties = { position: "absolute", bottom: 0, left: 0, width: "60px", height: "3px", background: "#000" };
const link: CSSProperties = { color: "#666", fontSize: "0.875rem", textDecoration: "none", letterSpacing: "0.05em", transition: "color 0.3s ease" };

const sliderRow: CSSProperties = { display: "flex", gap: "1.5rem", overflowX: "auto", padding: "1rem 0", scrollBehavior: "smooth" };
const cardWrap: CSSProperties = { width: "260px", borderRadius: "0", overflow: "hidden", background: "#fff", border: "1px solid #e5e5e5", display: "flex", flexDirection: "column", transition: "all 0.3s ease", flexShrink: 0 };
const imageBox: CSSProperties = { height: "180px", background: "#f5f5f5", position: "relative", overflow: "hidden" };
const metaBox: CSSProperties = { padding: "1.25rem", background: "#fff", display: "flex", flexDirection: "column", gap: "12px", flex: 1 };

const formatVND = (v: number) => `${v.toLocaleString("vi-VN")}đ`;

const suggestionProducts: UIProduct[] = [
  { id: 6,  name: "Vòng Tay Chỉ Đỏ Đính Đá Handmade Lu Thống", image: "/item/Vòng Tay Chỉ Đỏ Đính Đá Handmade Lu Thống.jpg", rating: 4.9, sold: "965" },
  { id: 7,  name: "Vòng Tay Đá Mài Giác Cho Nữ",              image: "/item/Vòng Tay Đá Mài Giác Cho Nữ.jpg",              rating: 4.9, sold: "147" },
  { id: 8,  name: "Lắc Tay Bạc Nữ 925 Đính 5 Hạt Đá",          image: "/item/Lắc Tay Bạc Nữ 925 Đính 5 Hạt Đá.jpg",        rating: 4.8, sold: "425" },
  { id: 9,  name: "Vòng Tay Đá Thô Full Of Energy",            image: "/item/Vòng Tay Đá Thô Full Of Energy .jpg",         rating: 4.9, sold: "1k+" },
  { id: 10, name: "Vòng Tay Bạc Nữ Liugems Kết Hợp Hạt Đá…",   image: "/item/Vòng Tay Bạc Nữ Liugems Kết Hợp Hạt Đá Phong Thuỷ Handmade Mix Charm Bi Mini Size.jpg", rating: 5.0, sold: "1k+" },
];

export default function SuggestionsSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section style={sectionWrap}>
      <div style={{ ...rowBetween, marginBottom: "2rem" }}>
        <div style={sectionTitle}>
          GỢI Ý HÔM NAY
          <div style={sectionTitleAfter} />
        </div>
        <a href="#" style={link}>XEM THÊM →</a>
      </div>

      <div style={sliderRow}>
        {suggestionProducts.map((p, idx) => {
          const suggestPrices = [450000, 260000, 210000, 245000, 225000];
          const suggestDiscounts = [25, 35, 40, 30, 10];
          const priceNow = suggestPrices[idx % suggestPrices.length];
          const discount = suggestDiscounts[idx % suggestDiscounts.length];
          const isHovered = hoveredCard === p.id;

          return (
            <div
              key={`s-${p.id}`}
              style={{
                ...cardWrap,
                transform: isHovered ? "translateY(-8px)" : "translateY(0)",
                borderColor: isHovered ? "#000" : "#e5e5e5",
                boxShadow: isHovered ? "0 16px 32px rgba(0,0,0,0.12)" : "0 4px 12px rgba(0,0,0,0.05)",
              }}
              onMouseEnter={() => setHoveredCard(p.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={imageBox}>
                <img
                  src={p.image}
                  alt={p.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "all 0.4s ease", transform: isHovered ? "scale(1.1)" : "scale(1)" }}
                />
                <div style={{ position: "absolute", top: "12px", right: "12px", background: "#000", color: "#fff", fontSize: "11px", padding: "4px 10px", fontWeight: 800, letterSpacing: "0.05em" }}>
                  -{discount}%
                </div>
              </div>

              <div style={metaBox}>
                <div style={{ fontSize: "0.875rem", color: "#333", minHeight: "40px", lineHeight: "1.4", overflow: "hidden", fontWeight: 500 }}>
                  {p.name}
                </div>

                <div style={rowBetween}>
                  <div style={{ fontWeight: 900, color: "#000", fontSize: "1.125rem", letterSpacing: "-0.02em" }}>
                    {formatVND(priceNow)}
                  </div>
                  <button style={{ border: "1px solid #ccc", background: "transparent", cursor: "pointer", padding: "8px", borderRadius: "0", transition: "all 0.3s ease" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="20" r="1.75" />
                      <circle cx="18" cy="20" r="1.75" />
                      <path d="M2.5 4.5h3l2.2 10.2a1.2 1.2 0 0 0 1.18.95H18.5a1.2 1.2 0 0 0 1.13-.8L22 8H6.2" />
                    </svg>
                  </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "auto", paddingTop: "8px", borderTop: "1px solid #e5e5e5" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#666", fontSize: "0.75rem", fontWeight: 600 }}>
                    <span>★</span><span>{p.rating.toFixed(1)}</span>
                  </div>
                  <div style={{ color: "#999", fontSize: "0.75rem" }}>Đã bán {p.sold}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
