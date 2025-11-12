"use client"

import { useState, useEffect } from "react"
import { Package, Users, ShoppingCart, Loader2, DollarSign } from "lucide-react"
import { getDashboardStats, getMonthlyOrderStats, getTopSellingProducts, getDailyRevenueStats, type MonthlyOrderStat, type TopSellingProduct, type DailyRevenueStat } from "../../../api/dashboardAPI"

export default function StatisticsPage() {
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)
  
  const [monthlyData, setMonthlyData] = useState<MonthlyOrderStat[]>([])
  const [dailyData, setDailyData] = useState<DailyRevenueStat[]>([])
  const [topProducts, setTopProducts] = useState<TopSellingProduct[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [selectedYear, selectedMonth])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const stats = await getDashboardStats()
      setTotalProducts(stats.totalProducts || 0)
      setTotalOrders(stats.totalOrders || 0)
      setTotalUsers(stats.totalUsers || 0)
      setTotalRevenue(stats.totalRevenue || 0)

      const monthlyStats = await getMonthlyOrderStats(selectedYear)
      setMonthlyData(monthlyStats || [])

      const dailyStats = await getDailyRevenueStats(selectedMonth, selectedYear)
      setDailyData(dailyStats || [])

      const topSelling = await getTopSellingProducts(10)
      setTopProducts(topSelling || [])
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const maxMonthlyValue = monthlyData.length > 0 
    ? Math.max(...monthlyData.map((d) => d.totalRevenue || 0)) 
    : 100

  const maxDailyValue = dailyData.length > 0 
    ? Math.max(...dailyData.map((d) => d.totalRevenue || 0)) 
    : 100

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)
  }

  const formatShortCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}tr`
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`
    }
    return value.toString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-white">
      <main className="flex-1 flex flex-col">
        <div className="px-8 py-8 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-black">Bảng điều khiển</h1>
          <p className="text-sm text-gray-600 mt-1">Tổng quan hoạt động kinh doanh</p>
        </div>

        {/* Stats Cards */}
        <div className="px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Tổng sản phẩm</p>
                  <p className="text-4xl font-bold text-gray-900 mb-1">{totalProducts}</p>
                  <p className="text-xs text-gray-500">Sản phẩm đang bán</p>
                </div>
                <div className="w-14 h-14 bg-blue-100 flex items-center justify-center rounded-lg">
                  <Package className="w-7 h-7 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Tổng đơn hàng</p>
                  <p className="text-4xl font-bold text-gray-900 mb-1">{totalOrders}</p>
                  <p className="text-xs text-gray-500">Đơn hàng đã tạo</p>
                </div>
                <div className="w-14 h-14 bg-green-100 flex items-center justify-center rounded-lg">
                  <ShoppingCart className="w-7 h-7 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Tổng khách hàng</p>
                  <p className="text-4xl font-bold text-gray-900 mb-1">{totalUsers}</p>
                  <p className="text-xs text-gray-500">Người dùng đã đăng ký</p>
                </div>
                <div className="w-14 h-14 bg-purple-100 flex items-center justify-center rounded-lg">
                  <Users className="w-7 h-7 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Tổng doanh thu</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{formatShortCurrency(totalRevenue)}</p>
                  <p className="text-xs text-gray-500">Doanh thu đã thanh toán</p>
                </div>
                <div className="w-14 h-14 bg-amber-100 flex items-center justify-center rounded-lg">
                  <DollarSign className="w-7 h-7 text-amber-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Revenue Chart */}
        <div className="px-8 pb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-black">Biểu đồ doanh thu theo tháng</h2>
                <p className="text-sm text-gray-600 mt-1">Năm {selectedYear}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedYear(selectedYear - 1)}
                  className="px-4 py-2 border border-gray-300 rounded font-medium hover:bg-gray-50 transition-colors"
                >
                  {selectedYear - 1}
                </button>
                <span className="px-4 py-2 bg-blue-600 text-white font-bold rounded">{selectedYear}</span>
                <button
                  onClick={() => setSelectedYear(selectedYear + 1)}
                  disabled={selectedYear >= new Date().getFullYear()}
                  className="px-4 py-2 border border-gray-300 rounded font-medium hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {selectedYear + 1}
                </button>
              </div>
            </div>

            <div className="relative h-80">
              {monthlyData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Không có dữ liệu cho năm {selectedYear}
                </div>
              ) : (
                <>
                  <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs font-medium text-gray-600 pr-4">
                    <span>{formatCurrency(maxMonthlyValue)}</span>
                    <span>{formatCurrency(maxMonthlyValue * 0.75)}</span>
                    <span>{formatCurrency(maxMonthlyValue * 0.5)}</span>
                    <span>{formatCurrency(maxMonthlyValue * 0.25)}</span>
                    <span>0đ</span>
                  </div>

                  <div className="ml-24 h-full border-l border-b border-gray-300 relative pb-8">
                    <div className="absolute inset-0 flex flex-col justify-between mb-8">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className="border-t border-gray-200" />
                      ))}
                    </div>

                    <div className="absolute inset-0 flex items-end justify-around px-2 mb-8">
                      {Array.from({ length: 12 }, (_, i) => {
                        const monthData = monthlyData.find((d) => d.month === i + 1)
                        const value = monthData?.totalRevenue || 0
                        const height = maxMonthlyValue > 0 ? (value / maxMonthlyValue) * 100 : 0
                        return (
                          <div
                            key={i}
                            className="flex-1 mx-1 group relative"
                            style={{ maxWidth: "60px" }}
                          >
                            <div
                              className="bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer relative rounded-t"
                              style={{ height: `${height}%` }}
                            >
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs px-3 py-2 rounded whitespace-nowrap z-10">
                                <div className="font-bold">Tháng {i + 1}</div>
                                <div>{formatCurrency(value)}</div>
                                <div className="text-gray-300">{monthData?.totalOrders || 0} đơn</div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 flex justify-around px-2">
                      {Array.from({ length: 12 }, (_, i) => (
                        <div key={i} className="flex-1 text-center text-xs font-medium text-gray-600" style={{ maxWidth: "60px" }}>
                          T{i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Daily Revenue Line Chart */}
        <div className="px-8 pb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-black">Biểu đồ đường doanh thu theo ngày</h2>
                <p className="text-sm text-gray-600 mt-1">Tháng {selectedMonth}/{selectedYear}</p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="px-4 py-2 border border-gray-300 rounded font-medium hover:bg-gray-50 transition-colors"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Tháng {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="relative h-80">
              {dailyData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Không có dữ liệu cho tháng {selectedMonth}/{selectedYear}
                </div>
              ) : (
                <>
                  <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs font-medium text-gray-600 pr-4">
                    <span>{formatShortCurrency(maxDailyValue)}</span>
                    <span>{formatShortCurrency(maxDailyValue * 0.75)}</span>
                    <span>{formatShortCurrency(maxDailyValue * 0.5)}</span>
                    <span>{formatShortCurrency(maxDailyValue * 0.25)}</span>
                    <span>0</span>
                  </div>

                  <div className="ml-16 h-full border-l border-b border-gray-300 relative pb-8">
                    <div className="absolute inset-0 flex flex-col justify-between mb-8">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className="border-t border-gray-200" />
                      ))}
                    </div>

                    <svg className="absolute inset-0 mb-8" style={{ overflow: 'visible' }}>
                      <polyline
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3"
                        points={dailyData.map((d, i) => {
                          const x = ((i + 0.5) / dailyData.length) * 100
                          const y = 100 - (maxDailyValue > 0 ? ((d.totalRevenue || 0) / maxDailyValue) * 100 : 0)
                          return `${x}%,${y}%`
                        }).join(' ')}
                      />
                      {dailyData.map((d, i) => {
                        const x = ((i + 0.5) / dailyData.length) * 100
                        const y = 100 - (maxDailyValue > 0 ? ((d.totalRevenue || 0) / maxDailyValue) * 100 : 0)
                        return (
                          <g key={i}>
                            <circle
                              cx={`${x}%`}
                              cy={`${y}%`}
                              r="4"
                              fill="#10b981"
                              className="hover:r-6 cursor-pointer"
                            >
                              <title>{`Ngày ${d.day}: ${formatCurrency(d.totalRevenue || 0)} (${d.totalOrders} đơn)`}</title>
                            </circle>
                          </g>
                        )
                      })}
                    </svg>

                    <div className="absolute bottom-0 left-0 right-0 flex justify-around">
                      {dailyData.map((d) => (
                        <div key={d.day} className="text-center text-xs font-medium text-gray-600">
                          {d.day}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Top Selling Products Table */}
        <div className="px-8 pb-8">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-bold text-black">Sản phẩm bán chạy nhất</h2>
              <p className="text-sm text-gray-600 mt-1">Top {topProducts.length} sản phẩm có doanh thu cao nhất</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-8 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Hạng</th>
                    <th className="px-8 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Sản phẩm</th>
                    <th className="px-8 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Danh mục</th>
                    <th className="px-8 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-700">Đã bán</th>
                    <th className="px-8 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-700">Doanh thu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topProducts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-12 text-center text-gray-400">
                        Chưa có dữ liệu sản phẩm bán chạy
                      </td>
                    </tr>
                  ) : (
                    topProducts.map((product, index) => (
                      <tr key={product.product_Id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                            #{index + 1}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded overflow-hidden">
                              <img
                                src={product.imageUrl || "/placeholder.svg"}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="font-bold text-gray-900">{product.name}</div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold uppercase rounded">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <span className="text-lg font-bold text-gray-900">{product.totalQuantitySold}</span>
                          <span className="text-xs text-gray-500 ml-1">sản phẩm</span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <span className="text-lg font-bold text-green-600">{formatCurrency(product.totalRevenue)}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
