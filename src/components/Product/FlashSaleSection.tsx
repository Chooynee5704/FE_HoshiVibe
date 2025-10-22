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

const flashProducts: UIProduct[] = [
  { id: 1, name: "Vòng Tay Bạc 925 Nữ Đính 2 Viên Đá", image: "/item/Vòng Tay Bạc 925 Nữ Đính 2 Viên Đá.jpg", rating: 4.9, sold: "2k+" },
  { id: 2, name: "Dây Chuyền Bạc Nữ 2 Hạt Đá", image: "/item/Dây Chuyền Bạc Nữ 2 Hạt Đá.jpg", rating: 4.8, sold: "425" },
  { id: 3, name: "Vòng Tay Đá Thô", image: "/item/Vòng Tay Đá Thô.jpg", rating: 5.0, sold: "20k+" },
  { id: 4, name: "Dây Chuyền Bạc Nữ 925", image: "/item/Dây Chuyền Bạc Nữ 925.jpg", rating: 4.9, sold: "965" },
  { id: 5, name: "Vòng Tay Chuỗi Hạt 108 Đá Phong Thuỷ Tự Nhiên", image: "/item/Vòng Tay Chuỗi Hạt 108 Đá Phong Thuỷ Tự Nhiên.jpg", rating: 5.0, sold: "3k+" },
];

export default function FlashSaleSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section style={sectionWrap}>
      <div style={{ ...rowBetween, marginBottom: "2rem" }}>
        <div style={sectionTitle}>
          FLASH SALE
          <div style={sectionTitleAfter} />
        </div>
        <a href="#" style={link}>XEM THÊM →</a>
      </div>

      <div style={sliderRow}>
        {flashProducts.map((p, idx) => {
          const flashPrices = [165000, 139300, 187500, 216000, 231000];
          const flashDiscounts = [25, 30, 25, 28, 23];
          const priceNow = flashPrices[idx % flashPrices.length];
          const discount = flashDiscounts[idx % flashDiscounts.length];
          const isHovered = hoveredCard === p.id;

          return (
            <div
              key={p.id}
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
                  <button 
                    onClick={(e) => {
                      // Add click animation
                      e.currentTarget.style.transform = 'scale(0.8)'
                      e.currentTarget.style.backgroundColor = '#f0f0f0'
                      setTimeout(() => {
                        e.currentTarget.style.transform = 'scale(1.1)'
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }, 100)
                      setTimeout(() => {
                        e.currentTarget.style.transform = 'scale(1)'
                      }, 200)
                      console.log('Added to cart:', p.name)
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8f8f8'
                      e.currentTarget.style.transform = 'scale(1.05)'
                      e.currentTarget.style.borderColor = '#000000'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.transform = 'scale(1)'
                      e.currentTarget.style.borderColor = '#ccc'
                    }}
                    style={{ 
                      border: "1px solid #ccc", 
                      background: "transparent", 
                      cursor: "pointer", 
                      padding: "8px", 
                      borderRadius: "0", 
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" 
                    }}
                  >
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
