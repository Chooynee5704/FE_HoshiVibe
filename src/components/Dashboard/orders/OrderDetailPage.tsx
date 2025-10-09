"use client"

import { CheckCircle2 } from "lucide-react"

type Props = {
  orderId: string
  onBack?: () => void
}

export default function OrderDetailPage({ orderId, onBack }: Props) {
  // Mock order data - sau này bạn fetch theo orderId
  const order = {
    id: orderId,
    orderNumber: orderId, // hiển thị đúng mã nhận vào
    date: "Ngày 20 tháng 10 năm 2025, 13:23 chiều",
    status: "completed",
    billingAddress: {
      city: "Thành phố HCM, VN",
      building: "Block C, Chung cư ACB",
      street: "Lê Văn Chí, Thủ Đức, Linh Chung",
      email: "nguyenanh@gmail.com",
      phone: "0325864556698",
    },
    shippingAddress: {
      city: "Thành phố HCM, VN",
      building: "Block C, Chung cư ACB",
      street: "Lê Văn Chí, Thủ Đức, Linh Chung",
      freeShipping: true,
    },
    paymentMethod: {
      bank: "SACOMBANK",
      accountNumber: "0123456789669587",
    },
    products: [
      { id: 1, name: "Vòng cổ", quantity: 2, price: 100000, total: 200000 },
      { id: 2, name: "Vòng tay mệnh mộc", quantity: 2, price: 100000, total: 200000 },
      { id: 3, name: "Đá mệnh mộc", quantity: 2, price: 100000, total: 200000 },
    ],
    subtotal: 600000,
    tax: 30000,
    total: 630000,
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN").format(amount) + " VND"

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 flex flex-col">
        <div className="px-6 py-6 max-w-5xl">
          {/* Back */}
          <button
            onClick={onBack}
            className="mb-4 text-sm text-blue-600 hover:underline"
          >
            ← Quay lại danh sách đơn hàng
          </button>

          {/* Header */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              Chi tiết đơn hàng: {order.orderNumber}
            </h1>
            <p className="text-sm text-gray-600 mb-4">{order.date}</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Trạng thái:</span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded text-sm font-medium">
                Hoàn thành <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Address & Payment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Billing */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-4">Địa chỉ thanh toán</h2>
              <div className="space-y-2 text-sm text-gray-700">
                <p>{order.billingAddress.city}</p>
                <p>{order.billingAddress.building}</p>
                <p>{order.billingAddress.street}</p>
                <p className="pt-2">
                  <span className="text-gray-600">Email: </span>
                  <a href={`mailto:${order.billingAddress.email}`} className="text-blue-600 hover:underline">
                    {order.billingAddress.email}
                  </a>
                </p>
                <p>
                  <span className="text-gray-600">Điện thoại: </span>
                  <a href={`tel:${order.billingAddress.phone}`} className="text-blue-600 hover:underline">
                    {order.billingAddress.phone}
                  </a>
                </p>
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-4">Địa chỉ giao hàng</h2>
              <div className="space-y-2 text-sm text-gray-700">
                <p>{order.shippingAddress.city}</p>
                <p>{order.shippingAddress.building}</p>
                <p>{order.shippingAddress.street}</p>
                {order.shippingAddress.freeShipping && (
                  <p className="text-gray-500 italic pt-2">(Miễn phí vận chuyển)</p>
                )}
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-4">Phương thức thanh toán</h2>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0" />
                <div className="text-sm text-gray-700">
                  <p className="font-medium">{order.paymentMethod.bank}</p>
                  <p className="text-gray-600">{order.paymentMethod.accountNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Các sản phẩm</th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Số lượng</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Giá gốc</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">Tổng số tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.products.map(p => (
                    <tr key={p.id}>
                      <td className="px-6 py-4"><span className="text-sm text-gray-800">{p.name}</span></td>
                      <td className="px-6 py-4 text-center"><span className="text-sm text-gray-800">{p.quantity}</span></td>
                      <td className="px-6 py-4 text-right"><span className="text-sm text-gray-800">{formatCurrency(p.price)}</span></td>
                      <td className="px-6 py-4 text-right"><span className="text-sm text-gray-800">{formatCurrency(p.total)}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex flex-col items-end space-y-2">
                <div className="flex items-center justify-between w-64">
                  <span className="text-sm text-gray-700">Tổng phụ thu:</span>
                  <span className="text-sm text-gray-800">{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between w-64">
                  <span className="text-sm text-gray-700">Thuế 5%:</span>
                  <span className="text-sm text-gray-800">{formatCurrency(order.tax)}</span>
                </div>
                <div className="flex items-center justify-between w-64 pt-2 border-t border-gray-200">
                  <span className="text-sm font-semibold text-gray-800">Tổng cộng:</span>
                  <span className="text-sm font-semibold text-gray-800">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
