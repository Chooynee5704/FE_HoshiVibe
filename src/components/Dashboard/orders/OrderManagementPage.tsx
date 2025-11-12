                      <th className="px-6 py-4 w-12"></th>
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
  Edit,
  Trash2,
  Truck,
  Package,
} from "lucide-react"
import { Button, Checkbox, message, Modal, Dropdown } from "antd"
import type { MenuProps } from "antd"
import { api } from "../../../api/axios"
import { deleteOrder } from "../../../api/orderAPI"

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
  onOpenEdit,
}: {
  onOpenDetail?: (orderId: string) => void
  onOpenEdit?: (orderId: string) => void
}) {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [orders, setOrders] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [deleteModalOrder, setDeleteModalOrder] = useState<OrderItem | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

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


  const normalizeStatus = (value?: string) => value?.trim().toLowerCase() || ""

  const getStatusBadge = (status: string) => {
    const s = normalizeStatus(status)
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
    if (s === "cancelled" || s === "canceled") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm border border-red-200">
          <Clock className="w-4 h-4" />
          Đã hủy
        </span>
      )
    }
    return <span className="text-sm text-gray-600">{status}</span>
  }

  const getShippingBadge = (status?: string) => {
    if (!status) {
      return <span className="text-sm text-gray-500">Chưa cập nhật</span>
    }

    const s = normalizeStatus(status)
    if (s === "pending") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm border border-gray-300">
          <Clock className="w-4 h-4" />
          Chờ xử lý
        </span>
      )
    }
    if (s === "shipping") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200">
          <Truck className="w-4 h-4" />
          Đang giao
        </span>
      )
    }
    if (s === "delivered") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm border border-emerald-200">
          <CheckCircle2 className="w-4 h-4" />
          Đã giao
        </span>
      )
    }
    if (s === "pickedup") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm border border-purple-200">
          <Package className="w-4 h-4" />
          Đã lấy
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

  const handleDeleteOrder = (orderId: string) => {
    const target = orders.find(o => o.order_Id === orderId)
    if (!target) {
      message.error('Không tìm thấy đơn hàng cần xóa')
      return
    }
    setDeleteModalOrder(target)
  }

  const confirmDeleteOrder = async () => {
    if (!deleteModalOrder) return
    const orderId = deleteModalOrder.order_Id
    setDeleting(orderId)
    try {
      await deleteOrder(orderId)
      message.success('Đã xóa đơn hàng thành công!')
      await loadOrders()
      setDeleteModalOrder(null)
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Không thể xóa đơn hàng')
      console.error('Delete order error:', err)
    } finally {
      setDeleting(null)
    }
  }

  const handleEditOrder = (orderId: string) => {
    if (onOpenEdit) {
      onOpenEdit(orderId)
    } else {
      message.info('Chức năng chỉnh sửa đang được phát triển')
    }
  }

  const getActionsMenu = (orderId: string): MenuProps => ({
    items: [
      {
        key: 'view',
        label: 'Xem chi tiết',
        icon: <ChevronRight className="w-4 h-4" />,
      },
      {
        key: 'edit',
        label: 'Chỉnh sửa',
        icon: <Edit className="w-4 h-4" />,
      },
      {
        type: 'divider',
      },
      {
        key: 'delete',
        label: deleting === orderId ? '??ang xA3a...' : 'Xóa',
        icon: <Trash2 className="w-4 h-4" />,
        danger: true,
        disabled: deleting === orderId,
      },
    ],
    onClick: ({ key }) => {
      if (key === 'view') {
        onOpenDetail?.(orderId)
      } else if (key === 'edit') {
        handleEditOrder(orderId)
      } else if (key === 'delete') {
        handleDeleteOrder(orderId)
      }
    },
  })



  // Pagination logic
  const totalPages = Math.ceil(orders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentOrders = orders.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1)
    }
  }

  const getPageNumbers = () => {
    const pages: number[] = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i)
        pages.push(-1)
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push(-1)
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push(-1)
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
        pages.push(-1)
        pages.push(totalPages)
      }
    }
    
    return pages
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
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Tr?ng th�i giao h�ng</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-700">Tổng tiền</th>
                      <th className="px-6 py-4 w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                          Chưa có đơn hàng nào
                        </td>
                      </tr>
                    ) : (
                      currentOrders.map((order) => (
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
                          <td className="px-6 py-4">{getShippingBadge(order.shippingStatus)}</td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-sm font-bold text-black">{formatCurrency(order.finalPrice)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <Dropdown menu={getActionsMenu(order.order_Id)} trigger={['click']}>
                              <button
                                className="p-2 hover:bg-gray-100 rounded border border-gray-300"
                                title="Hành động"
                              >
                                <MoreHorizontal className="w-5 h-5 text-black" />
                              </button>
                            </Dropdown>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600 rotate-180" />
                    </button>
                    
                    {getPageNumbers().map((page, index) => 
                      page === -1 ? (
                        <span key={`ellipsis-${index}`} className="px-2 text-gray-400">...</span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                    
                    <button 
                      className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Modal
        title="Xác nhận xóa đơn hàng"
        open={!!deleteModalOrder}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{
          danger: true,
          loading: deleting === deleteModalOrder?.order_Id,
        }}
        onOk={confirmDeleteOrder}
        onCancel={() => setDeleteModalOrder(null)}
      >
        {deleteModalOrder && (
          <p>
            Bạn có chắc chắn muốn xóa đơn hàng #
            {deleteModalOrder.order_Id.substring(0, 8).toUpperCase()}?
          </p>
        )}
      </Modal>
    </div>
  )
}
