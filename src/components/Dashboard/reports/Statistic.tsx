"use client"

import { useState, useEffect } from "react"
import { Package, Users, ShoppingCart, Loader2, DollarSign } from "lucide-react"
import { getDashboardStats, getTopSellingProducts, getDailyRevenueStats, type TopSellingProduct, type DailyRevenueStat } from "../../../api/dashboardAPI"

type DailyPoint = {
  date: string
  label: string
  totalOrders: number
  totalRevenue: number
}

export default function StatisticsPage() {
  const [loading, setLoading] = useState(true)
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)
  
  const [dailyData, setDailyData] = useState<DailyPoint[]>([])
  const [topProducts, setTopProducts] = useState<TopSellingProduct[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const stats = await getDashboardStats()
      setTotalProducts(stats.totalProducts || 0)
      setTotalOrders(stats.totalOrders || 0)
      setTotalUsers(stats.totalUsers || 0)
      setTotalRevenue(stats.totalRevenue || 0)

      const dailySeries = await buildLast30DaysRevenue()
      setDailyData(dailySeries)

      const topSelling = await getTopSellingProducts(10)
      setTopProducts(topSelling || [])
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const buildLast30DaysRevenue = async (): Promise<DailyPoint[]> => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const startDate = new Date(today)
    startDate.setDate(startDate.getDate() - 29)

    const formatKey = (date: Date) => {
      const y = date.getFullYear()
      const m = String(date.getMonth() + 1).padStart(2, '0')
      const d = String(date.getDate()).padStart(2, '0')
      return `${y}-${m}-${d}`
    }

    const monthSet = new Set<string>()
    const iterator = new Date(startDate)
    while (iterator <= today) {
      monthSet.add(`${iterator.getFullYear()}-${iterator.getMonth() + 1}`)
      iterator.setDate(iterator.getDate() + 1)
    }

    const monthPairs = Array.from(monthSet).map(key => {
      const [yearStr, monthStr] = key.split('-')
      return { year: Number(yearStr), month: Number(monthStr) }
    })

    const responses = await Promise.all(
      monthPairs.map(({ month, year }) =>
        getDailyRevenueStats(month, year).then(data => ({
          month,
          year,
          data: data || [],
        }))
      )
    )

    const statsMap = new Map<string, { totalRevenue: number; totalOrders: number }>()

    responses.forEach(({ month, year, data }) => {
      data.forEach((stat: DailyRevenueStat) => {
        const statDate = new Date(year, month - 1, stat.day)
        statDate.setHours(0, 0, 0, 0)
        if (statDate < startDate || statDate > today) return
        const key = formatKey(statDate)
        const existing = statsMap.get(key) || { totalRevenue: 0, totalOrders: 0 }
        statsMap.set(key, {
          totalRevenue: existing.totalRevenue + (stat.totalRevenue || 0),
          totalOrders: existing.totalOrders + (stat.totalOrders || 0),
        })
      })
    })

    const points: DailyPoint[] = []
    const dayCursor = new Date(startDate)
    while (dayCursor <= today) {
      const key = formatKey(dayCursor)
      const stat = statsMap.get(key)
      points.push({
        date: key,
        label: dayCursor.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        totalOrders: stat?.totalOrders || 0,
        totalRevenue: stat?.totalRevenue || 0,
      })
      dayCursor.setDate(dayCursor.getDate() + 1)
    }

    return points
  }

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



        {/* Daily Revenue Line Chart */}
        <div className="px-8 pb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-black">Biểu đồ đường doanh thu theo ngày</h2>
                <p className="text-sm text-gray-600 mt-1">30 ngày gần nhất</p>
              </div>
            </div>

            <div className="relative h-80">
              {dailyData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Không có dữ liệu trong 30 ngày gần đây
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
                        if (!d.totalOrders && !d.totalRevenue) {
                          return null
                        }
                        const x = ((i + 0.5) / dailyData.length) * 100
                        const y = 100 - (maxDailyValue > 0 ? ((d.totalRevenue || 0) / maxDailyValue) * 100 : 0)
                        return (
                          <g key={d.date}>
                            <circle
                              cx={`${x}%`}
                              cy={`${y}%`}
                              r="4"
                              fill="#10b981"
                              className="hover:r-6 cursor-pointer"
                            >
                              <title>{`Ngày ${d.label}: ${formatCurrency(d.totalRevenue || 0)} (${d.totalOrders} đơn)`}</title>
                            </circle>
                          </g>
                        )
                      })}
                    </svg>

                    <div className="absolute bottom-0 left-0 right-0 flex justify-between">
                      {dailyData.map((d, i) => (
                        <div
                          key={d.date}
                          className={`flex-1 text-center text-xs font-medium text-gray-600 ${i % 5 === 0 ? 'opacity-100' : 'opacity-30'}`}
                        >
                          {i % 5 === 0 ? d.label : ''}
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
