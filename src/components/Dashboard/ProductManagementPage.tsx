"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, ShoppingCart } from "lucide-react"
import { Button } from "antd"

export default function ProductManagementPage() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["bracelets", "necklaces", "strings"])
  const [activeTab, setActiveTab] = useState("best-selling")

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const products = Array(6)
    .fill(null)
    .map((_, i) => ({
      id: i + 1,
      name: "Vòng cổ Hạnh Phúc",
      price: "150.000 VNĐ",
      rating: 5,
      reviews: 0,
      image: `/placeholder.svg?height=200&width=200&query=vietnamese+jewelry+necklace`,
    }))

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 flex flex-col">
        {/* Page Title */}
        <div className="px-6 py-6">
          <h1 className="text-2xl font-semibold text-gray-800">Sản phẩm</h1>
        </div>

        {/* Tabs and Actions */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("best-selling")}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  activeTab === "best-selling" ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Bán chạy
              </button>
              <button
                onClick={() => setActiveTab("popular")}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  activeTab === "popular" ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Phổ biến
              </button>
              <button
                onClick={() => setActiveTab("newest")}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  activeTab === "newest" ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Mới nhất
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Button type="primary">Tìm kiếm sản phẩm</Button>
              <Button danger>Xóa sản phẩm</Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 px-6 pb-6">
          <div className="flex gap-6">
            {/* Categories Sidebar */}
            <div className="w-64 bg-white rounded-lg border border-gray-200 p-4 h-fit">
              <h2 className="font-semibold text-gray-800 mb-4">Danh mục sản phẩm</h2>
              <div className="space-y-2">
                <button
                  onClick={() => toggleCategory("bracelets")}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {expandedCategories.includes("bracelets") ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                    <span className="text-sm text-gray-700">Vòng tay</span>
                  </div>
                  <span className="text-sm text-gray-500">25</span>
                </button>
                <button
                  onClick={() => toggleCategory("necklaces")}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {expandedCategories.includes("necklaces") ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                    <span className="text-sm text-gray-700">Vòng cổ</span>
                  </div>
                  <span className="text-sm text-gray-500">25</span>
                </button>
                <button
                  onClick={() => toggleCategory("strings")}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {expandedCategories.includes("strings") ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                    <span className="text-sm text-gray-700">Dây phong thủy</span>
                  </div>
                  <span className="text-sm text-gray-500">25</span>
                </button>
              </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-3 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-square bg-gray-100 relative">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm text-gray-600 mb-2">{product.name}</h3>
                      <p className="text-lg font-semibold text-gray-800 mb-3">{product.price}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {Array(product.rating)
                            .fill(null)
                            .map((_, i) => (
                              <svg key={i} className="w-4 h-4 fill-yellow-400" viewBox="0 0 20 20">
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                              </svg>
                            ))}
                          <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                        </div>
                        <button className="w-8 h-8 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors">
                          <ShoppingCart className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2 mt-8">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <ChevronRight className="w-5 h-5 text-gray-600 rotate-180" />
                </button>
                <button className="w-10 h-10 bg-blue-600 text-white rounded-lg font-medium">1</button>
                <button className="w-10 h-10 hover:bg-gray-100 text-gray-600 rounded-lg font-medium">2</button>
                <button className="w-10 h-10 hover:bg-gray-100 text-gray-600 rounded-lg font-medium">3</button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
