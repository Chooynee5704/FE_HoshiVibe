"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Filter,
  ChevronRight,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  Loader2,
} from "lucide-react"
import { Button, Checkbox, message } from "antd"
import { api } from "../../../api/axios"

type OrderItem = {
  order_Id: string
  user_Id: string
  totalPrice: number
  finalPrice: number
  shippingAddress?: string
  phoneNumber?: number
  orderDate: string
  status: string
  shippingStatus?: string
}

export default function OrderManagementPage({
  onOpenDetail,
}: {
  onOpenDetail?: (orderId: string) => void
}) {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [orders, setOrders] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('hv_token') || JSON.parse(localStorage.getItem('hv_user') || '{}').token
      const res = await api.get('/Order/all', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setOrders(res.data || [])
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Không tải được danh sách đơn hàng")
      console.error("Load orders error:", err)
    } finally {
      setLoading(false)
    }
  }


  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase()
    if (s === "completed") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm border border-emerald-200">
          <CheckCircle2 className="w-4 h-4" />
          Hoàn thành
        </span>
      )
    }
    if (s === "paid") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm border border-green-200">
          <CheckCircle2 className="w-4 h-4" />
          Đã thanh toán
        </span>
      )
    }
    if (s === "pending") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm border border-gray-300">
          <Clock className="w-4 h-4" />
          Đang chờ
        </span>
      )
    }
    if (s === "processing") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200">
          <Loader2 className="w-4 h-4 animate-spin" />
          Xử lý
        </span>
      )
    }
    return <span className="text-sm text-gray-600">{status}</span>
  }

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId],
    )
  }

  const toggleAllOrders = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(orders.map((o) => o.order_Id))
    }
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    if (isNaN(d.getTime())) return iso
    return d.toLocaleDateString("vi-VN")
  }

  return (
    <div className="flex min-h-screen bg-white">
      <main className="flex-1 flex flex-col">
        {/* Page Title */}
        <div className="px-8 py-8 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-black">Quản lý đơn hàng</h1>
          <p className="text-sm text-gray-600 mt-1">Quản lý và theo dõi tất cả đơn hàng</p>
        </div>

        {/* Actions */}
        <div className="px-8 py-4 border-b border-gray-200">
          <div className="flex items-center justify-end gap-3">
            <Button className="bg-white hover:bg-gray-50 text-black border border-gray-300 font-medium">
              <Plus className="w-4 h-4 mr-1" />
              Thêm mới
            </Button>
            <Button className="bg-white hover:bg-gray-50 text-black border border-gray-300 font-medium">
              <Filter className="w-4 h-4 mr-1" />
              Lọc
            </Button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="px-8 py-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-black" />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 w-12">
                        <Checkbox
                          checked={selectedOrders.length === orders.length && orders.length > 0}
                          onChange={toggleAllOrders}
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Mã đơn hàng</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Ngày đặt</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Địa chỉ giao hàng</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Trạng thái</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-700">Tổng tiền</th>
                      <th className="px-6 py-4 w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                          Chưa có đơn hàng nào
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order.order_Id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <Checkbox
                              checked={selectedOrders.includes(order.order_Id)}
                              onChange={() => toggleOrderSelection(order.order_Id)}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <button
                              className="text-sm font-bold text-black hover:underline"
                              onClick={() => onOpenDetail?.(order.order_Id)}
                              title="Xem chi tiết đơn hàng"
                            >
                              #{order.order_Id.substring(0, 8).toUpperCase()}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-800">{formatDate(order.orderDate)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="max-w-xs">
                              <p className="text-sm text-gray-800">{order.shippingAddress || "Chưa có địa chỉ"}</p>
                              {order.phoneNumber && (
                                <p className="text-xs text-gray-500 mt-1">SĐT: {order.phoneNumber}</p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-sm font-bold text-black">{formatCurrency(order.finalPrice)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              className="p-2 hover:bg-gray-100 rounded border border-gray-300"
                              onClick={() => onOpenDetail?.(order.order_Id)}
                              title="Xem chi tiết"
                            >
                              <MoreHorizontal className="w-5 h-5 text-black" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <ChevronRight className="w-5 h-5 text-gray-600 rotate-180" />
                  </button>
                  <button className="w-10 h-10 bg-blue-600 text-white rounded-lg font-medium">1</button>
                  <button className="w-10 h-10 hover:bg-gray-100 text-gray-700 rounded-lg font-medium">2</button>
                  <button className="w-10 h-10 hover:bg-gray-100 text-gray-700 rounded-lg font-medium">3</button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
