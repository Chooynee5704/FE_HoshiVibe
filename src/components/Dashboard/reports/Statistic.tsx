"use client"

import { useState, useEffect } from "react"
import { Package, Users, ShoppingCart, Loader2, DollarSign } from "lucide-react"
import {
  getDashboardStats,
  getTopSellingProducts,
  getMonthlyOrderStats,
  getDailyRevenueStats,
  type TopSellingProduct,
  type MonthlyOrderStat,
  type DailyRevenueStat,
} from "../../../api/dashboardAPI"
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const CURRENT_DATE = new Date()
const DEFAULT_YEAR = CURRENT_DATE.getFullYear()
const DEFAULT_MONTH = CURRENT_DATE.getMonth() + 1
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, idx) => idx + 1)
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, idx) => DEFAULT_YEAR - idx)
const MONTH_SHORT_LABELS = ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"]
const MONTH_FULL_LABELS = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
]
const PIE_COLORS = ["#2563EB", "#7C3AED", "#22C55E", "#F97316", "#E11D48", "#0EA5E9", "#14B8A6", "#F59E0B", "#6366F1", "#C026D3", "#059669", "#F43F5E"]

const buildMonthlySeries = (data: MonthlyOrderStat[], year: number): MonthlyOrderStat[] => {
  const monthMap = new Map(data.map((item) => [item.month, item]))
  return MONTH_OPTIONS.map((month) => {
    const current = monthMap.get(month)
    return {
      month,
      year,
      totalOrders: current?.totalOrders ?? 0,
      totalRevenue: current?.totalRevenue ?? 0,
    }
  })
}

const getDaysInMonth = (month: number, year: number) => new Date(year, month, 0).getDate()

const buildDailySeries = (data: DailyRevenueStat[], month: number, year: number): DailyRevenueStat[] => {
  const dayMap = new Map(data.map((item) => [item.day, item]))
  const days = getDaysInMonth(month, year)
  return Array.from({ length: days }, (_, idx) => {
    const day = idx + 1
    const current = dayMap.get(day)
    return {
      day,
      totalOrders: current?.totalOrders ?? 0,
      totalRevenue: current?.totalRevenue ?? 0,
    }
  })
}

export default function StatisticsPage() {
  const [loading, setLoading] = useState(true)
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)

  const [topProducts, setTopProducts] = useState<TopSellingProduct[]>([])
  const [monthlyStats, setMonthlyStats] = useState<MonthlyOrderStat[]>(() => buildMonthlySeries([], DEFAULT_YEAR))
  const [dailyStats, setDailyStats] = useState<DailyRevenueStat[]>(() => buildDailySeries([], DEFAULT_MONTH, DEFAULT_YEAR))
  const [selectedYear, setSelectedYear] = useState(DEFAULT_YEAR)
  const [selectedMonth, setSelectedMonth] = useState(DEFAULT_MONTH)
  const [monthlyLoading, setMonthlyLoading] = useState(true)
  const [dailyLoading, setDailyLoading] = useState(true)

  const selectedMonthName = MONTH_FULL_LABELS[selectedMonth - 1] ?? `Thang ${selectedMonth}`

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const stats = await getDashboardStats()
      setTotalProducts(stats.totalProducts || 0)
      setTotalOrders(stats.totalOrders || 0)
      setTotalUsers(stats.totalUsers || 0)
      setTotalRevenue(stats.totalRevenue || 0)

      const topSelling = await getTopSellingProducts(10)
      setTopProducts(topSelling || [])
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadMonthlyStats = async (year: number) => {
    setMonthlyLoading(true)
    try {
      const stats = await getMonthlyOrderStats(year)
      setMonthlyStats(buildMonthlySeries(stats || [], year))
    } catch (error) {
      console.error("Error loading monthly stats:", error)
      setMonthlyStats(buildMonthlySeries([], year))
    } finally {
      setMonthlyLoading(false)
    }
  }

  const loadDailyStats = async (month: number, year: number) => {
    setDailyLoading(true)
    try {
      const stats = await getDailyRevenueStats(month, year)
      setDailyStats(buildDailySeries(stats || [], month, year))
    } catch (error) {
      console.error("Error loading daily stats:", error)
      setDailyStats(buildDailySeries([], month, year))
    } finally {
      setDailyLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  useEffect(() => {
    loadMonthlyStats(selectedYear)
  }, [selectedYear])

  useEffect(() => {
    loadDailyStats(selectedMonth, selectedYear)
  }, [selectedMonth, selectedYear])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)
  }

  const formatShortCurrency = (value: number) => {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}tr`
    }
    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(0)}k`
    }
    return value.toString()
  }

  const orderDistributionData = monthlyStats
    .filter((item) => item.totalOrders > 0)
    .map((item) => ({
      name: `Th${item.month}`,
      value: item.totalOrders,
      revenue: item.totalRevenue,
    }))
  const topOrderMonths = [...orderDistributionData].sort((a, b) => b.value - a.value)

  const yearTotalOrders = monthlyStats.reduce((sum, item) => sum + item.totalOrders, 0)
  const selectedMonthTotals = dailyStats.reduce(
    (acc, item) => {
      acc.orders += item.totalOrders
      acc.revenue += item.totalRevenue
      return acc
    },
    { orders: 0, revenue: 0 }
  )

  const busiestMonth =
    monthlyStats.reduce(
      (best, current) => (current.totalOrders > best.totalOrders ? current : best),
      monthlyStats[0] ?? { month: selectedMonth, year: selectedYear, totalOrders: 0, totalRevenue: 0 }
    ) ?? null

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
          <h1 className="text-3xl font-bold text-black">Thống kê và báo cáo</h1>
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

        {/* Order Analytics */}
        <div className="px-8 pb-8 grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg xl:col-span-2 flex flex-col">
            <div className="px-8 py-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-black">Xu hướng đơn hàng & doanh thu</h2>
                <p className="text-sm text-gray-600 mt-1">So sánh số đơn và doanh thu từng tháng</p>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Năm</label>
                <select
                  className="border border-gray-200 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedYear}
                  onChange={(event) => setSelectedYear(Number(event.target.value))}
                >
                  {YEAR_OPTIONS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-6 flex-1">
              <div className="h-80">
                {monthlyLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={monthlyStats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="month"
                        tickFormatter={(value) => MONTH_SHORT_LABELS[value - 1] || value}
                        stroke="#9ca3af"
                        fontSize={12}
                      />
                      <YAxis yAxisId="left" allowDecimals={false} stroke="#9ca3af" fontSize={12} />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#9ca3af"
                        tickFormatter={(value) => formatShortCurrency(Number(value))}
                        fontSize={12}
                      />
                      <Tooltip
                        formatter={(value: number | string, name) => {
                          if (name === "Doanh thu") {
                            return [formatCurrency(Number(value)), name]
                          }
                          return [value, name]
                        }}
                        labelFormatter={(value) => MONTH_FULL_LABELS[value - 1] || `Tháng ${value}`}
                      />
                      <Legend />
                      <Bar yAxisId="left" dataKey="totalOrders" name="Don hang" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="totalRevenue"
                        name="Doanh thu"
                        stroke="#f97316"
                        strokeWidth={3}
                        dot={{ r: 3 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Tổng đơn cả năm</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{yearTotalOrders}</p>
                </div>
                <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Tháng bận rộn</p>
                  <p className="text-lg font-bold text-gray-900 mt-2">
                    {busiestMonth ? MONTH_FULL_LABELS[busiestMonth.month - 1] : "--"}
                  </p>
                  <p className="text-sm text-gray-500">{busiestMonth?.totalOrders || 0} đơn</p>
                </div>
                <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Doanh thu cao nhất</p>
                  <p className="text-lg font-bold text-green-600 mt-2">
                    {busiestMonth ? formatShortCurrency(busiestMonth.totalRevenue) : "--"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg flex flex-col">
            <div className="px-8 py-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-black">Phân bố đơn hàng</h2>
              <p className="text-sm text-gray-600 mt-1">Tỷ trọng đơn hàng theo từng tháng</p>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="h-64">
                {monthlyLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                  </div>
                ) : orderDistributionData.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    Chua co du lieu trong nam {selectedYear}
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={orderDistributionData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={50}
                        outerRadius={90}
                        paddingAngle={2}
                        stroke="transparent"
                      >
                        {orderDistributionData.map((entry, index) => (
                          <Cell key={`cell-${entry.name}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number | string) => [`${Number(value)} don`, "Don hang"]} labelFormatter={(value) => value} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              {orderDistributionData.length > 0 && (
                <div className="mt-6 space-y-3">
                  {topOrderMonths.slice(0, 3).map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                        />
                        <span className="font-semibold text-gray-800">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{item.value} don</p>
                        <p className="text-xs text-gray-500">
                          {((item.value / (yearTotalOrders || 1)) * 100).toFixed(1)}% - {formatShortCurrency(item.revenue)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Daily revenue chart */}
        <div className="px-8 pb-8">
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-8 py-6 border-b border-gray-200 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold text-black">Diễn biến doanh thu {selectedMonthName.toLowerCase()}</h2>
                <p className="text-sm text-gray-600 mt-1">Theo dõi doanh thu từng ngày trong tháng</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Tháng</label>
                  <select
                    className="border border-gray-200 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedMonth}
                    onChange={(event) => setSelectedMonth(Number(event.target.value))}
                  >
                    {MONTH_OPTIONS.map((month) => (
                      <option key={month} value={month}>
                        {MONTH_FULL_LABELS[month - 1]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Năm</label>
                  <select
                    className="border border-gray-200 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedYear}
                    onChange={(event) => setSelectedYear(Number(event.target.value))}
                  >
                    {YEAR_OPTIONS.map((year) => (
                      <option key={`daily-${year}`} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="h-72">
                {dailyLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyStats} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="day"
                        stroke="#9ca3af"
                        fontSize={12}
                        tickFormatter={(value) => `Ngày ${value}`}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        stroke="#9ca3af"
                        fontSize={12}
                        tickFormatter={(value) => formatShortCurrency(Number(value))}
                        allowDecimals={false}
                      />
                      <Tooltip formatter={(value: number | string) => formatCurrency(Number(value))} labelFormatter={(value) => `Ngày ${value}`} />
                      <Area type="monotone" dataKey="totalRevenue" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Tổng đơn tháng này</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{selectedMonthTotals.orders}</p>
                </div>
                <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Tổng doanh thu</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">{formatCurrency(selectedMonthTotals.revenue)}</p>
                </div>
              </div>
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
                        Chua co du lieu san pham ban chay
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
