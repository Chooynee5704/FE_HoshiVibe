import { useState, useEffect } from 'react'
import { Card, Table, Tag, Button, Modal, Spin, Empty } from 'antd'
import { EyeOutlined, ShoppingOutlined } from '@ant-design/icons'
import { getCurrentUser } from '../api/authApi'
import { getAllUserOrders, type Order } from '../api/orderAPI'
import type { PageKey } from '../types/navigation'

interface OrdersProps {
  onNavigate?: (page: PageKey, params?: { id?: string }) => void
}

const Orders = ({ onNavigate }: OrdersProps) => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const user = getCurrentUser()
      
      if (!user) {
        Modal.warning({
          title: 'Yêu cầu đăng nhập',
          content: 'Vui lòng đăng nhập để xem đơn hàng',
          onOk: () => onNavigate?.('login'),
        })
        return
      }

      const ordersData = await getAllUserOrders(user.user_Id)
      setOrders(ordersData)
    } catch (error) {
      console.error('Error loading orders:', error)
      Modal.error({
        title: 'Lỗi',
        content: 'Không thể tải danh sách đơn hàng. Vui lòng thử lại.',
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'orange'
      case 'paid':
        return 'green'
      case 'processing':
        return 'blue'
      case 'completed':
        return 'green'
      case 'cancelled':
        return 'red'
      case 'failed':
        return 'red'
      default:
        return 'default'
    }
  }

  const getStatusText = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'Chờ thanh toán'
      case 'paid':
        return 'Đã thanh toán'
      case 'processing':
        return 'Đang xử lý'
      case 'completed':
        return 'Hoàn thành'
      case 'cancelled':
        return 'Đã hủy'
      case 'failed':
        return 'Thất bại'
      default:
        return status || 'Không xác định'
    }
  }

  const getShippingStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'default'
      case 'shipping':
        return 'blue'
      case 'delivered':
        return 'cyan'
      case 'pickedup':
        return 'green'
      default:
        return 'default'
    }
  }

  const getShippingStatusText = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'Đang chờ'
      case 'shipping':
        return 'Đang ship'
      case 'delivered':
        return 'Đã tới nơi'
      case 'pickedup':
        return 'Đã nhận hàng'
      default:
        return status || 'Chưa xác định'
    }
  }

  const formatVND = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' VNĐ'
  }

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'order_Id',
      key: 'order_Id',
      render: (id: string) => <strong>{id}</strong>,
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price: number) => formatVND(price),
    },
    {
      title: 'Giảm giá',
      dataIndex: 'discountAmount',
      key: 'discountAmount',
      render: (discount: number) => formatVND(discount),
    },
    {
      title: 'Thành tiền',
      dataIndex: 'finalPrice',
      key: 'finalPrice',
      render: (price: number) => <strong style={{ color: '#f59e0b' }}>{formatVND(price)}</strong>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: 'Vận chuyển',
      dataIndex: 'shippingStatus',
      key: 'shippingStatus',
      render: (status: string) => (
        <Tag color={getShippingStatusColor(status)}>{getShippingStatusText(status)}</Tag>
      ),
    },
    {
      title: 'Số sản phẩm',
      key: 'itemCount',
      render: (record: Order) => record.orderDetails?.length || 0,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (record: Order) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => onNavigate?.('order-detail' as PageKey, { id: record.order_Id })}
        >
          Chi tiết
        </Button>
      ),
    },
  ]

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f9fafb, #f3f4f6)'
      }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f9fafb, #f3f4f6)',
      padding: '40px 24px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShoppingOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
                Đơn hàng của tôi
              </h2>
            </div>
          }
          extra={
            <Button onClick={() => onNavigate?.('home')}>
              Quay về trang chủ
            </Button>
          }
          style={{ borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
        >
          {orders.length === 0 ? (
            <Empty
              description="Bạn chưa có đơn hàng nào"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button type="primary" onClick={() => onNavigate?.('products')}>
                Mua sắm ngay
              </Button>
            </Empty>
          ) : (
            <Table
              dataSource={orders}
              columns={columns}
              rowKey="order_Id"
              pagination={{ pageSize: 10 }}
            />
          )}
        </Card>
      </div>
    </div>
  )
}

export default Orders
