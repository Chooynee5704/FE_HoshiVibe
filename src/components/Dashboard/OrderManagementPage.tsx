"use client"

import { useState } from "react"
import {
  Plus,
  Filter,
  ChevronRight,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  Loader2,
} from "lucide-react"
import { Button, Checkbox } from "antd"

export default function OrderManagementPage() {
  const [selectedOrders, setSelectedOrders] = useState<number[]>([])

  // mock data
  const orders = Array(6)
    .fill(null)
    .map((_, i) => ({
      id: i + 1,
      orderId: "#00" + (i + 1),
      customerName: "Nguyen Thi Anh",
      customerEmail: "nguyenanh@gmail.com",
      date: "10/10/2025",
      address: "Lê Văn Chí, Linh Trung, Thủ Đức, Thành phố Hồ Chí Minh, Việt Nam",
      note: "Thông qua mức giá cố định",
      status: i % 3 === 0 ? "completed" : i % 3 === 1 ? "pending" : "processing",
      amount: "100.000 VND",
    }))

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm">
            <CheckCircle2 className="w-4 h-4" />
            Hoàn thành
          </span>
        )
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            <Clock className="w-4 h-4" />
            Đang chờ
          </span>
        )
      case "processing":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Xử lý
          </span>
        )
      default:
        return null
    }
  }

  const toggleOrderSelection = (orderId: number) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId],
    )
  }

  const toggleAllOrders = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(orders.map((o) => o.id))
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 flex flex-col">
        {/* Page Title */}
        <div className="px-6 py-6">
          <h1 className="text-2xl font-semibold text-gray-800">Đơn hàng</h1>
        </div>

        {/* Actions */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-end gap-2">
            <Button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300">
              <Plus className="w-4 h-4 mr-1" />
              Mới
            </Button>
            <Button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300">
              <Filter className="w-4 h-4 mr-1" />
              Lọc
            </Button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="px-6 pb-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 w-12">
                      <Checkbox
                        checked={selectedOrders.length === orders.length}
                        onChange={toggleAllOrders}
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Đặt hàng</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Ngày</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Gửi đến</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Trạng thái</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Số tiền</th>
                    <th className="px-4 py-3 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <Checkbox
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => toggleOrderSelection(order.id)}
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-sm font-medium text-blue-600">
                            {order.orderId} của {order.customerName}
                          </p>
                          <p className="text-xs text-gray-500">{order.customerEmail}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-800">{order.date}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="max-w-xs">
                          <p className="text-sm text-gray-800">{order.address}</p>
                          <p className="text-xs text-gray-500 mt-1">{order.note}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">{getStatusBadge(order.status)}</td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-800">{order.amount}</span>
                      </td>
                      <td className="px-4 py-4">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <MoreHorizontal className="w-5 h-5 text-gray-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-center gap-2">
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
