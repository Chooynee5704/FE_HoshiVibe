"use client"

import { useState } from "react"
import { Plus, Filter, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button, Checkbox } from "antd"

export default function CustomerManagementPage() {
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([])

  const customers = Array(6)
    .fill(null)
    .map((_, i) => ({
      id: i + 1,
      name: "Nguyen Thi Anh",
      email: "nguyenanh@gmail.com",
      phone: "0123456789019",
      address: "Lê Văn Chí, Linh Trung, Thủ Đức, TP.HCM, VN",
      joinedDate: "20/10/2025",
      avatar: `/placeholder.svg?height=40&width=40&query=vietnamese+woman+avatar`,
    }))

  const toggleCustomerSelection = (customerId: number) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId) ? prev.filter((id) => id !== customerId) : [...prev, customerId],
    )
  }

  const toggleAllCustomers = () => {
    if (selectedCustomers.length === customers.length) {
      setSelectedCustomers([])
    } else {
      setSelectedCustomers(customers.map((c) => c.id))
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 flex flex-col">
        {/* Page Title */}
        <div className="px-6 py-6">
          <h1 className="text-2xl font-semibold text-gray-800">Khách hàng</h1>
        </div>

        {/* Actions */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-end gap-2">
            <Button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 flex items-center gap-1">
              <Plus className="w-4 h-4" />
              Mới
            </Button>
            <Button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 flex items-center gap-1">
              <Filter className="w-4 h-4" />
              Lọc
            </Button>
          </div>
        </div>

        {/* Customers Table */}
        <div className="px-6 pb-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 w-12">
                      <Checkbox
                        checked={selectedCustomers.length === customers.length}
                        onChange={toggleAllCustomers}
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tên</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Điện thoại</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Địa chỉ</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Đã tham gia</th>
                    <th className="px-4 py-3 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <Checkbox
                          checked={selectedCustomers.includes(customer.id)}
                          onChange={() => toggleCustomerSelection(customer.id)}
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                            <img
                              src={customer.avatar || "/placeholder.svg"}
                              alt={customer.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-sm font-medium text-blue-600">{customer.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-800">{customer.email}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-800">{customer.phone}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-800">{customer.address}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-800">{customer.joinedDate}</span>
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
