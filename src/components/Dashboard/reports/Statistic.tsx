"use client"

import { useState } from "react"
import { Package, Users, TrendingUp, ChevronDown, MoreHorizontal } from "lucide-react"
import { Button } from "antd"

export default function StatisticsPage() {
  const [selectedMonth] = useState("Tháng Một")

  const chartData = [
    { month: 1, value: 60 },
    { month: 2, value: 80 },
    { month: 3, value: 70 },
    { month: 4, value: 110 },
    { month: 5, value: 95 },
    { month: 6, value: 60 },
    { month: 7, value: 110 },
    { month: 8, value: 50 },
    { month: 9, value: 70 },
    { month: 10, value: 60 },
    { month: 11, value: 40 },
    { month: 12, value: 80 },
  ]

  const maxValue = Math.max(...chartData.map((d) => d.value))

  const topProducts = Array(4)
    .fill(null)
    .map((_, i) => ({
      id: i + 1,
      name: "Vòng cổ mềnh Mộc",
      revenue: "2.000.000 VND",
      percentage: 30,
      image: `/placeholder.svg?height=80&width=80&query=vietnamese+wooden+necklace`,
    }))

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 flex flex-col">
        {/* Page Title */}
        <div className="px-6 py-6">
          <h1 className="text-2xl font-semibold text-gray-800">Thống kê</h1>
        </div>

        {/* Stats Cards */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Total Orders */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Tổng số đơn hàng</p>
                  <p className="text-3xl font-semibold text-gray-800 mb-1">5.000 đơn</p>
                  <div className="flex items-center gap-1 text-emerald-500">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">+10.24%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>

            {/* Total Customers */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Tổng số khách hàng</p>
                  <p className="text-3xl font-semibold text-gray-800 mb-1">3.000 người</p>
                  <div className="flex items-center gap-1 text-emerald-500">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">+0.05%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="px-6 pb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-semibold text-gray-800">Tổng doanh số từng tháng</h2>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <span className="text-sm text-gray-700">{selectedMonth}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MoreHorizontal className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Chart */}
            <div className="relative h-64">
              {/* Y-axis */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 pr-4">
                <span>120</span>
                <span>90</span>
                <span>60</span>
                <span>30</span>
                <span>0</span>
              </div>

              {/* Chart area */}
              <div className="ml-8 h-full border-l border-b border-gray-200 relative">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="border-t border-gray-100" />
                  ))}
                </div>

                {/* Polyline */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  <polyline
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    points={chartData
                      .map((d, i) => {
                        const x = (i / (chartData.length - 1)) * 100
                        const y = 100 - (d.value / maxValue) * 100
                        return `${x}%,${y}%`
                      })
                      .join(" ")}
                  />
                  {chartData.map((d, i) => {
                    const x = (i / (chartData.length - 1)) * 100
                    const y = 100 - (d.value / maxValue) * 100
                    return <circle key={i} cx={`${x}%`} cy={`${y}%`} r="4" fill="#3B82F6" />
                  })}
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products Table */}
        <div className="px-6 pb-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Sản phẩm bán chạy nhất</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Doanh thu</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Tỉ lệ (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-sm text-gray-800">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-800">{product.revenue}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 max-w-xs">
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-600 rounded-full"
                                style={{ width: `${product.percentage}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-sm text-gray-800 w-12">{product.percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <span className="text-sm text-gray-700">7 ngày qua</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
              <Button>Xem tất cả</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
