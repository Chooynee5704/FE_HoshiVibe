// src/components/Dashboard/products/ProductManagementPage.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronRight } from "lucide-react"
import { Button, message, Spin } from "antd"
import CategoriesSidebar, { type CategoryItem } from "./CategoriesSidebar"
import { searchProducts, type ProductApi } from "../../../api/productsAPI"
import ProductDetailDrawer from "./ProductDetailDrawer"

type UIProduct = {
  id: string
  name: string
  price: number
  image: string
  status: "in-stock" | "not-available" | "ready-to-publish" | string
  stock: number
  category: string
}

export default function ProductManagementPage({ onCreateNew }: { onCreateNew?: () => void }) {
  const [activeTab, setActiveTab] = useState("best-selling")
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["bracelets", "necklaces", "strings"])
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<UIProduct[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(9) // 3x3 grid

  // Drawer state
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailProduct, setDetailProduct] = useState<UIProduct | null>(null)

  const rm = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()
  const normalizeCategory = (raw?: string, name?: string) => {
    const c = rm(raw || ""); const n = rm(name || "")
    if (/(bracelet|vong tay)/.test(c) || /(bracelet|vong tay)/.test(n)) return "bracelets"
    if (/(ring|nhan)/.test(c) || /(ring|nhan)/.test(n)) return "rings"
    if (/(necklace|vong co)/.test(c) || /(necklace|vong co)/.test(n)) return "necklaces"
    if (/(string|day phong thuy|day)/.test(c) || /(string|day phong thuy|day)/.test(n)) return "strings"
    return "others"
  }

  const pickId = (p: ProductApi) =>
    String((p as any).productId ?? (p as any).productID ?? p.product_Id ?? (p as any).id ?? "")

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await searchProducts()
        const mapped: UIProduct[] = data.map((p: ProductApi) => ({
          id: pickId(p),
          name: p.name,
          price: Number(p.price) || 0,
          image: p.imageUrl || p.imageURL || "/placeholder.svg",
          status: p.status,
          stock: Number(p.stock) || 0,
          category: normalizeCategory(p.category, p.name),
        }))
        setProducts(mapped)
      } catch (err: any) {
        const msg = err?.response?.data?.message || err?.response?.data || err?.message || "Không tải được sản phẩm"
        message.error(String(msg))
        console.error("SEARCH products error:", err?.response?.status, err?.response?.data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const categories: CategoryItem[] = useMemo(() => {
    const count = { bracelets: 0, rings: 0, necklaces: 0, others: 0, strings: 0 }
    for (const p of products) {
      const c = p.category
      if (c.includes("bracelets")) count.bracelets++
      else if (c.includes("rings")) count.rings++
      else if (c.includes("necklaces")) count.necklaces++
      else if (c.includes("strings")) count.strings++
      else count.others++
    }
    return [
      { key: "bracelets", label: "Vòng tay", count: count.bracelets },
      { key: "rings", label: "Nhẫn", count: count.rings },
      { key: "necklaces", label: "Vòng cổ", count: count.necklaces },
      { key: "strings", label: "Dây phong thủy", count: count.strings },
      { key: "others", label: "Khác", count: count.others },
    ]
  }, [products])

  const toggleCategory = (key: string) =>
    setExpandedCategories((prev) => (prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]))

  const statusStyle = (s: UIProduct["status"]) => {
    switch (s) {
      case "in-stock": return "bg-green-50 text-green-700 border-green-200"
      case "not-available": return "bg-red-50 text-red-700 border-red-200"
      case "ready-to-publish": return "bg-amber-50 text-amber-700 border-amber-200"
      default: return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const formatVND = (n: number) =>
    n.toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 })

  // Pagination logic
  const totalPages = Math.ceil(products.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = products.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1)
    }
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: number[] = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i)
        pages.push(-1) // ellipsis
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push(-1)
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push(-1)
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
        pages.push(-1)
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  return (
    <div className="flex min-h-screen bg-white">
      <main className="flex-1 flex flex-col">
        {/* Page Title */}
        <div className="px-8 py-8 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-black">Quản lý sản phẩm</h1>
          <p className="text-sm text-gray-600 mt-1">Quản lý toàn bộ sản phẩm của cửa hàng</p>
        </div>

        {/* Tabs and Actions */}
        <div className="px-8 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {["best-selling", "popular", "newest"].map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-5 py-2 text-sm font-medium rounded transition-all ${
                    activeTab === key 
                      ? "text-white bg-blue-600 hover:bg-blue-700" 
                      : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {key === "best-selling" ? "Bán chạy" : key === "popular" ? "Phổ biến" : "Mới nhất"}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Button 
                type="primary" 
                onClick={onCreateNew}
                className="h-10"
              >
                + Thêm sản phẩm
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 px-8 py-8">
          <div className="flex gap-6">
            <CategoriesSidebar
              categories={categories}
              expandedKeys={expandedCategories}
              onToggle={toggleCategory}
            />

            {/* Product Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Spin size="large" />
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-6">
                  {currentProducts.map((product) => (
                    <div
                      key={product.id}
                      className="relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => { setDetailProduct(product); setDetailOpen(true) }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setDetailProduct(product)
                          setDetailOpen(true)
                        }
                      }}
                    >
                      <div className="aspect-square bg-gray-100">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="p-4">
                        <h3 className="text-sm text-gray-600 mb-2 line-clamp-2 font-medium">{product.name}</h3>
                        <p className="text-xl font-bold text-gray-900 mb-3">{formatVND(product.price)}</p>

                        <div className="flex items-center justify-between">
                          <span className={`px-3 py-1 text-xs border font-semibold uppercase rounded ${statusStyle(product.status)}`}>
                            {product.status}
                          </span>
                          <span className="text-sm text-gray-600">
                            Kho: <span className="font-semibold text-gray-900">{product.stock}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-8">
                  <button 
                    className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600 rotate-180" />
                  </button>
                  
                  {getPageNumbers().map((page, index) => 
                    page === -1 ? (
                      <span key={`ellipsis-${index}`} className="px-2 text-gray-400">...</span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  
                  <button 
                    className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Drawer chi tiết sản phẩm + Delete */}
        <ProductDetailDrawer
          open={detailOpen}
          product={detailProduct}
          onClose={() => setDetailOpen(false)}
          onDeleted={(id) => {
            // Cập nhật list & đóng Drawer
            setProducts(prev => prev.filter(p => p.id === id ? false : true))
            setDetailOpen(false)
            setDetailProduct(null)
            message.success("Xóa sản phẩm thành công.")
          }}
        />
      </main>
    </div>
  )
}
