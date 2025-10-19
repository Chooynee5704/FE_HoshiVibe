// src/components/Product/ProductDetail.tsx
"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react"
import type { PageKey } from "../../../types/navigation"
import { getProductById, type ProductApi } from "../../../api/productsAPI"

type MiniProduct = { id: string; name: string; price: number; image: string }

interface ProductDetailProps {
  productId: string
  onNavigate?: (page: PageKey, params?: { id?: string }) => void
  onAddToCart?: (product: MiniProduct, quantity: number) => void
}

const formatVND = (n: number) =>
  n.toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + " VNĐ"

export default function ProductDetail({
  productId,
  onNavigate,
  onAddToCart
}: ProductDetailProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<ProductApi | null>(null)
  const [qty, setQty] = useState(1)
  const [toast, setToast] = useState<string | null>(null) // ✅ thêm state toast

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await getProductById(productId)
        if (alive) setData(res)
      } catch (e: any) {
        setError(e?.message || "Không tải được chi tiết sản phẩm")
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [productId])

  // ✅ Tự động ẩn toast sau 1.5s
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 1500)
    return () => clearTimeout(t)
  }, [toast])

  if (loading) {
    return (
      <div style={{ maxWidth: 1200, margin: "40px auto", padding: "0 20px" }}>
        <button
          onClick={() => onNavigate?.("search")}
          style={{ border: "none", background: "none", cursor: "pointer", marginBottom: 16 }}
        >
          <ArrowLeft style={{ verticalAlign: "middle" }} /> <span>Quay lại</span>
        </button>
        <p>Đang tải…</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div style={{ maxWidth: 1200, margin: "40px auto", padding: "0 20px" }}>
        <button
          onClick={() => onNavigate?.("search")}
          style={{ border: "none", background: "none", cursor: "pointer", marginBottom: 16 }}
        >
          <ArrowLeft style={{ verticalAlign: "middle" }} /> <span>Quay lại</span>
        </button>
        <p style={{ color: "red" }}>{error || "Không tìm thấy sản phẩm."}</p>
      </div>
    )
  }

  const mini: MiniProduct = {
    id: data.product_Id,
    name: data.name,
    price: data.price,
    image: data.imageUrl || data.imageURL || "/placeholder.png"
  }

  return (
    <div style={{ maxWidth: 1200, margin: "40px auto", padding: "0 20px", position: "relative" }}>
      <button
        onClick={() => onNavigate?.("search")}
        style={{ border: "none", background: "none", cursor: "pointer", marginBottom: 24 }}
      >
        <ArrowLeft style={{ verticalAlign: "middle" }} /> <span>Quay lại</span>
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 32,
          alignItems: "start"
        }}
      >
        {/* Hình ảnh */}
        <div
          style={{
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid #eee",
            background: "#f9fafb",
            height: 520,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <img
            src={mini.image}
            alt={mini.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Thông tin */}
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{mini.name}</h1>
          <p style={{ color: "#6b7280", marginBottom: 16 }}>
            {data.description || "Sản phẩm HoshiVibe"}
          </p>

          <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 24 }}>
            {formatVND(mini.price)}
          </div>

          {/* Số lượng */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <button
              onClick={() => setQty(q => Math.max(1, q - 1))}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                border: "1px solid #000",
                background: "#fff",
                cursor: "pointer"
              }}
            >
              <Minus size={16} />
            </button>
            <span style={{ minWidth: 24, textAlign: "center", fontWeight: 700 }}>{qty}</span>
            <button
              onClick={() => setQty(q => q + 1)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                border: "1px solid #000",
                background: "#fff",
                cursor: "pointer"
              }}
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Thêm vào giỏ */}
          <button
            onClick={() => {
              onAddToCart?.(mini, qty)
              setToast("Đã thêm vào giỏ hàng")
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#000",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "12px 18px",
              cursor: "pointer",
              fontWeight: 700
            }}
          >
            <ShoppingCart size={18} />
            Thêm vào giỏ
          </button>

          {/* Meta nhỏ */}
          <div style={{ marginTop: 24, color: "#6b7280", fontSize: 14 }}>
            <div>Danh mục: {data.category || "—"}</div>
            <div>Tồn kho: {data.stock ?? "—"}</div>
            <div>Trạng thái: {data.status || "—"}</div>
          </div>
        </div>
      </div>

      {/* ✅ Toast hiển thị */}
      {toast && (
        <div
          style={{
            position: "fixed",
            left: "50%",
            bottom: 24,
            transform: "translateX(-50%)",
            background: "#000",
            color: "#fff",
            padding: "10px 16px",
            borderRadius: 12,
            fontWeight: 700
          }}
        >
          {toast}
        </div>
      )}
    </div>
  )
}
