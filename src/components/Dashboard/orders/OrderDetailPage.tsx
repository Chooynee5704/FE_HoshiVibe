"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Clock, Loader2, Truck, Package } from "lucide-react"
import { message, Spin, Steps, Button as AntButton } from "antd"
import { api } from "../../../api/axios"
import { getOrderDetails, type OrderDetail, updateShippingStatus } from "../../../api/orderAPI"

type OrderData = {
  order_Id: string
  user_Id: string
  totalPrice: number
  finalPrice: number
  discountAmount: number
  shippingAddress?: string
  phoneNumber?: number
  orderDate: string
  status: string
  shippingStatus?: string
}

type Props = {
  orderId: string
  onBack?: () => void
}

export default function OrderDetailPage({ orderId, onBack }: Props) {
  const [order, setOrder] = useState<OrderData | null>(null)
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([])
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    loadOrderData()
  }, [orderId])

  const loadOrderData = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('hv_token') || JSON.parse(localStorage.getItem('hv_user') || '{}').token
      
      // Load order info
      const orderRes = await api.get(`/Order/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setOrder(orderRes.data)

      // Load order details
      const details = await getOrderDetails(orderId)
      setOrderDetails(details || [])
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Không tải được chi tiết đơn hàng")
      console.error("Load order detail error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateShippingStatus = async (newStatus: 'Pending' | 'Shipping' | 'Delivered' | 'PickedUp') => {
    if (!order) return
    
    setUpdating(true)
    try {
      await updateShippingStatus(order.order_Id, newStatus)
      message.success("Cập nhật trạng thái vận chuyển thành công")
      // Reload order data
      await loadOrderData()
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Không thể cập nhật trạng thái")
      console.error("Update shipping status error:", err)
    } finally {
      setUpdating(false)
    }
  }

  const getShippingStep = (status?: string) => {
    const s = status?.toLowerCase()
    if (s === 'shipping') return 1
    if (s === 'delivered') return 2
    if (s === 'pickedup') return 3
    return 0 // pending
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    if (isNaN(d.getTime())) return iso
    return d.toLocaleString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase()
    if (s === "completed") {
      return (
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded text-sm font-bold border-2 border-emerald-600">
          <CheckCircle2 className="w-5 h-5" />
          Hoàn thành
        </span>
      )
    }
    if (s === "pending") {
      return (
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded text-sm font-bold border-2 border-gray-400">
          <Clock className="w-5 h-5" />
          Đang chờ
        </span>
      )
    }
    if (s === "processing") {
      return (
        <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded text-sm font-bold border-2 border-blue-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          Đang xử lý
        </span>
      )
    }
    return <span className="text-sm font-bold">{status}</span>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Spin size="large" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-gray-500">Không tìm thấy đơn hàng</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-white">
      <main className="flex-1 flex flex-col p-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition-colors"
        >
          ← Quay lại danh sách đơn hàng
        </button>

        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-black mb-2">
            Chi tiết đơn hàng: #{order.order_Id.substring(0, 8).toUpperCase()}
          </h1>
          <p className="text-sm text-gray-600 mb-4">{formatDate(order.orderDate)}</p>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">Trạng thái thanh toán:</span>
            {getStatusBadge(order.status)}
          </div>
        </div>

        {/* Shipping Status Timeline */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-black flex items-center gap-2">
              <Truck className="w-6 h-6" />
              Trạng thái vận chuyển
            </h2>
          </div>
          
          <Steps
            current={getShippingStep(order.shippingStatus)}
            items={[
              {
                title: 'Đang chờ',
                description: 'Đơn hàng đang được xử lý',
                icon: <Clock className="w-5 h-5" />,
              },
              {
                title: 'Đang ship',
                description: 'Đơn hàng đang được vận chuyển',
                icon: <Truck className="w-5 h-5" />,
              },
              {
                title: 'Đã tới nơi',
                description: 'Đơn hàng đã đến địa chỉ giao hàng',
                icon: <Package className="w-5 h-5" />,
              },
              {
                title: 'Đã nhận hàng',
                description: 'Khách hàng đã nhận được hàng',
                icon: <CheckCircle2 className="w-5 h-5" />,
              },
            ]}
          />

          {/* Status Update Controls */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Cập nhật trạng thái vận chuyển:</h3>
            <div className="flex flex-wrap gap-3">
              <AntButton
                type={order.shippingStatus?.toLowerCase() === 'pending' ? 'primary' : 'default'}
                loading={updating}
                disabled={order.shippingStatus?.toLowerCase() === 'pending'}
                onClick={() => handleUpdateShippingStatus('Pending')}
                icon={<Clock className="w-4 h-4" />}
              >
                Đang chờ
              </AntButton>
              
              <AntButton
                type={order.shippingStatus?.toLowerCase() === 'shipping' ? 'primary' : 'default'}
                loading={updating}
                disabled={order.shippingStatus?.toLowerCase() === 'shipping'}
                onClick={() => handleUpdateShippingStatus('Shipping')}
                icon={<Truck className="w-4 h-4" />}
              >
                Đang ship
              </AntButton>
              
              <AntButton
                type={order.shippingStatus?.toLowerCase() === 'delivered' ? 'primary' : 'default'}
                loading={updating}
                disabled={order.shippingStatus?.toLowerCase() === 'delivered'}
                onClick={() => handleUpdateShippingStatus('Delivered')}
                icon={<Package className="w-4 h-4" />}
              >
                Đã tới nơi
              </AntButton>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              💡 Click vào trạng thái mong muốn để cập nhật. Trạng thái hiện tại được đánh dấu màu xanh.
            </p>
            <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
              <span>⚠️</span> Trạng thái "Đã nhận hàng" chỉ có thể được cập nhật bởi khách hàng.
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Shipping Address */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-bold text-black mb-4 pb-3 border-b border-gray-200">Địa chỉ giao hàng</h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p className="font-medium">{order.shippingAddress || "Chưa có địa chỉ"}</p>
              {order.phoneNumber && (
                <p>
                  <span className="text-gray-600">Điện thoại: </span>
                  <a href={`tel:${order.phoneNumber}`} className="text-blue-600 font-medium hover:underline">
                    {order.phoneNumber}
                  </a>
                </p>
              )}
            </div>
          </div>

          {/* Order Summary Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-bold text-black mb-4 pb-3 border-b border-gray-200">Thông tin đơn hàng</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Trạng thái vận chuyển:</span>
                <span className="font-semibold text-black">{order.shippingStatus || "Chưa cập nhật"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Số sản phẩm:</span>
                <span className="font-semibold text-black">{orderDetails.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
          <div className="bg-gray-50 border-b border-gray-200 px-8 py-4">
            <h2 className="text-xl font-bold text-black">Sản phẩm</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Sản phẩm</th>
                  <th className="px-8 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-700">Số lượng</th>
                  <th className="px-8 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-700">Đơn giá</th>
                  <th className="px-8 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-700">Giảm giá</th>
                  <th className="px-8 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-700">Tổng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orderDetails.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-gray-400">
                      Không có sản phẩm
                    </td>
                  </tr>
                ) : (
                  orderDetails.map((item) => {
                    const detailId = item.orderDetail_Id || item.orderDetailId || ''
                    return (
                      <tr key={detailId} className="hover:bg-gray-50">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 border border-gray-200 rounded overflow-hidden flex-shrink-0">
                              <img
                                src={item.product?.imageUrl || item.product?.imageURL || "/placeholder.svg"}
                                alt={item.product?.name || "Product"}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="font-semibold text-gray-900">{item.product?.name || "Sản phẩm"}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className="text-sm font-semibold text-gray-900">{item.quantity}</span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <span className="text-sm text-gray-700">{formatCurrency(item.unitPrice)}</span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <span className="text-sm text-gray-700">{formatCurrency(item.discount)}</span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <span className="text-sm font-semibold text-gray-900">
                            {formatCurrency(item.quantity * item.unitPrice - item.discount)}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="border-t border-gray-200 bg-gray-50 px-8 py-6">
            <div className="flex flex-col items-end space-y-3">
              <div className="flex items-center justify-between w-80">
                <span className="text-sm font-medium text-gray-700">Tổng giá trị:</span>
                <span className="text-sm font-semibold text-gray-900">{formatCurrency(order.totalPrice)}</span>
              </div>
              <div className="flex items-center justify-between w-80">
                <span className="text-sm font-medium text-gray-700">Giảm giá:</span>
                <span className="text-sm font-semibold text-red-600">-{formatCurrency(order.discountAmount)}</span>
              </div>
              <div className="flex items-center justify-between w-80 pt-3 border-t border-gray-300">
                <span className="text-lg font-bold text-gray-900">TỔNG CỘNG:</span>
                <span className="text-2xl font-bold text-blue-600">{formatCurrency(order.finalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
