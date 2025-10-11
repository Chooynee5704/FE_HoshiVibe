"use client"

import { User, Plus, MoreHorizontal, Edit, Check } from "lucide-react"
import { Button } from "antd"

type Props = {
  customerId: string
  onBack?: () => void
}

export default function CustomerDetailPage({ customerId, onBack }: Props) {
  // Mock customer data
  const customer = {
    id: customerId,
    name: "Nguyen Thi Anh",
    email: "nguyenanh@gmail.com",
    phone: "01234567898",
    address: "Lê Văn Chí, Thủ Đức, Thành phố HCM",
    labelType: "MìnhYêhbs_Djdjj",
    createdDate: "20/10/2025 23:11",
    createdDisplay: "20 tháng 10, 11:11 tối",
    description: "",
    taxId: "",
  }

  const purchaseHistory = Array(5).fill(null).map((_, /*i*/) => ({
    id: `Mhe8u_bdy`,
    description: "Mua vòng tay mệnh mộc",
    date: "18/09/2025 13:12:25",
  }))

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 flex flex-col">
        <div className="px-6 py-6 max-w-6xl">
          {/* Back */}
          <button onClick={onBack} className="mb-4 text-sm text-blue-600 hover:underline">
            ← Quay lại danh sách khách hàng
          </button>

          {/* Header */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-xl font-semibold text-gray-800">
                  {customer.name}{" "}
                  <span className="text-gray-600 font-normal">
                    ({" "}
                    <a href={`mailto:${customer.email}`} className="text-blue-600 hover:underline">
                      {customer.email}
                    </a>{" "}
                    )
                  </span>
                </h1>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>KHÁCH HÀNG</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300">
                <Plus className="w-4 h-4 mr-1" />
                Thêm ghi chú
              </Button>
              <Button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-3">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Created info */}
          <div className="bg-gray-100 rounded-lg p-4 mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm font-medium text-gray-800">Khách hàng đã được tạo</p>
              <p className="text-xs text-gray-600">{customer.createdDisplay}</p>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Chi tiết</h2>
              <Button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300">
                <Edit className="w-4 h-4 mr-1" />
                Cập nhật chi tiết
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Account */}
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Thông tin tài khoản</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">NHÃN DẠNG</p>
                    <p className="text-sm text-gray-800">{customer.labelType}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Tạo</p>
                    <p className="text-sm text-gray-800">{customer.createdDate}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Email</p>
                    <a href={`mailto:${customer.email}`} className="text-sm text-blue-600 hover:underline">
                      {customer.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Sự miêu tả</p>
                    <p className="text-sm text-gray-400 italic">{customer.description || "Không có mô tả"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Mã số thuế</p>
                    <p className="text-sm text-gray-400 italic">{customer.taxId || "Không có mã số thuế"}</p>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-4">Thông tin thanh toán</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Gửi email đến</p>
                    <a href={`mailto:${customer.email}`} className="text-sm text-blue-600 hover:underline">
                      {customer.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Địa chỉ</p>
                    <p className="text-sm text-gray-800">{customer.address}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Số điện thoại</p>
                    <a href={`tel:${customer.phone}`} className="text-sm text-blue-600 hover:underline">
                      {customer.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 mt-6 pt-6 border-t border-gray-200">
              <Button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300">Đăn bù</Button>
              <Button type="primary">
                <Check className="w-4 h-4 mr-1" />
                Lưu thay đổi
              </Button>
            </div>
          </div>

          {/* Purchase history */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Nhật ký mua hàng</h2>

            <div className="space-y-3">
              {purchaseHistory.map((purchase, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                      {purchase.id}
                    </span>
                    <span className="text-sm text-gray-800">{purchase.description}</span>
                  </div>
                  <span className="text-sm text-gray-600">{purchase.date}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 text-center">
              <button className="text-sm text-blue-600 hover:underline">Xem thêm nhật ký &gt;</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
