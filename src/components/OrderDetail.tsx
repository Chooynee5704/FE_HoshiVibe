import { useState, useEffect } from 'react'
import { Card, Table, Tag, Button, Spin, Descriptions, Steps, message } from 'antd'
import { ArrowLeftOutlined, ShoppingOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { getCurrentUser } from '../api/authApi'
import { getAllUserOrders, updateShippingStatus, type Order } from '../api/orderAPI'
import type { PageKey } from '../types/navigation'

interface OrderDetailProps {
  orderId: string
  onNavigate?: (page: PageKey) => void
}

const OrderDetail = ({ orderId, onNavigate }: OrderDetailProps) => {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    loadOrderDetail()
  }, [orderId])

  const loadOrderDetail = async () => {
    try {
      setLoading(true)
      const user = getCurrentUser()
      
      if (!user) {
        onNavigate?.('login')
        return
      }

      const orders = await getAllUserOrders(user.user_Id)
      const foundOrder = orders.find(o => o.order_Id === orderId)
      
      if (foundOrder) {
        setOrder(foundOrder)
      }
    } catch (error) {
      console.error('Error loading order detail:', error)
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

  const getShippingStep = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 0
      case 'shipping':
        return 1
      case 'delivered':
        return 2
      case 'pickedup':
        return 3
      default:
        return 0
    }
  }

  const formatVND = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' VNĐ'
  }

  const handleConfirmReceived = async () => {
    if (!order) return
    
    try {
      setUpdating(true)
      await updateShippingStatus(order.order_Id, 'PickedUp')
      message.success('Đã xác nhận nhận hàng thành công!')
      
      // Reload order detail
      await loadOrderDetail()
    } catch (error) {
      console.error('Error updating shipping status:', error)
      message.error('Có lỗi xảy ra khi xác nhận nhận hàng. Vui lòng thử lại!')
    } finally {
      setUpdating(false)
    }
  }

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

  if (!order) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #f9fafb, #f3f4f6)',
        padding: '40px 24px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Card>
            <p>Không tìm thấy đơn hàng</p>
            <Button onClick={() => onNavigate?.('orders' as PageKey)}>
              Quay lại danh sách đơn hàng
            </Button>
          </Card>
        </div>
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
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <Button 
            icon={<ArrowLeftOutlined />}
            onClick={() => onNavigate?.('orders' as PageKey)}
            style={{ marginBottom: '16px' }}
          >
            Quay lại danh sách đơn hàng
          </Button>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
            Chi tiết đơn hàng #{order.order_Id}
          </h1>
        </div>

        {/* Shipping Progress */}
        <Card 
          title="Trạng thái vận chuyển"
          style={{ marginBottom: '24px', borderRadius: '16px' }}
          extra={
            order.shippingStatus?.toLowerCase() === 'delivered' && (
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                loading={updating}
                onClick={handleConfirmReceived}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  borderColor: '#10b981',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)'
                }}
              >
                Xác nhận đã nhận hàng
              </Button>
            )
          }
        >
          <Steps
            current={getShippingStep(order.shippingStatus)}
            items={[
              {
                title: 'Đang chờ',
                description: 'Đơn hàng đang được xử lý',
              },
              {
                title: 'Đang ship',
                description: 'Đơn hàng đang được vận chuyển',
              },
              {
                title: 'Đã tới nơi',
                description: 'Đơn hàng đã đến địa chỉ giao hàng',
              },
              {
                title: 'Đã nhận hàng',
                description: 'Khách hàng đã nhận được hàng',
              },
            ]}
          />
        </Card>

        {/* Order Information */}
        <Card 
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShoppingOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
              <span>Thông tin đơn hàng</span>
            </div>
          }
          style={{ marginBottom: '24px', borderRadius: '16px' }}
        >
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Mã đơn hàng" span={2}>
              <strong>{order.order_Id}</strong>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày đặt hàng">
              {new Date(order.orderDate).toLocaleString('vi-VN')}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái thanh toán">
              <Tag color={getStatusColor(order.status)}>{getStatusText(order.status)}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái vận chuyển" span={2}>
              <Tag color={getShippingStatusColor(order.shippingStatus)}>
                {getShippingStatusText(order.shippingStatus)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ giao hàng" span={2}>
              {order.shippingAddress || 'Chưa cập nhật'}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {order.phoneNumber || 'Chưa cập nhật'}
            </Descriptions.Item>
            <Descriptions.Item label="Số sản phẩm">
              {order.orderDetails?.length || 0} sản phẩm
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Products */}
        <Card 
          title="Sản phẩm trong đơn hàng"
          style={{ marginBottom: '24px', borderRadius: '16px' }}
        >
          <Table
            dataSource={order.orderDetails}
            pagination={false}
            rowKey="orderDetailId"
            columns={[
              {
                title: 'Sản phẩm',
                key: 'product',
                render: (record) => (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img 
                      src={record.product?.imageUrl || record.product?.imageURL || '/placeholder.jpg'} 
                      alt={record.product?.name}
                      style={{ 
                        width: '80px', 
                        height: '80px', 
                        objectFit: 'cover', 
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                        {record.product?.name}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                        {record.product?.description}
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                title: 'Đơn giá',
                dataIndex: 'unitPrice',
                key: 'unitPrice',
                width: 150,
                render: (price: number) => formatVND(price),
              },
              {
                title: 'Số lượng',
                dataIndex: 'quantity',
                key: 'quantity',
                width: 100,
                align: 'center',
              },
              {
                title: 'Giảm giá',
                dataIndex: 'discount',
                key: 'discount',
                width: 100,
                align: 'center',
                render: (discount: number) => `${(discount * 100).toFixed(0)}%`,
              },
              {
                title: 'Thành tiền',
                key: 'total',
                width: 150,
                align: 'right',
                render: (record) => {
                  const total = record.unitPrice * record.quantity * (1 - record.discount)
                  return <strong style={{ fontSize: '16px' }}>{formatVND(total)}</strong>
                },
              },
            ]}
          />
        </Card>

        {/* Order Summary */}
        <Card style={{ borderRadius: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '12px 0',
              fontSize: '16px'
            }}>
              <span>Tổng tiền hàng:</span>
              <span>{formatVND(order.totalPrice)}</span>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '12px 0',
              fontSize: '16px',
              color: '#ef4444'
            }}>
              <span>Giảm giá:</span>
              <span>-{formatVND(order.discountAmount)}</span>
            </div>
            <div style={{ 
              borderTop: '2px solid #e5e7eb', 
              marginTop: '12px', 
              paddingTop: '12px' 
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#f59e0b'
              }}>
                <span>Tổng thanh toán:</span>
                <span>{formatVND(order.finalPrice)}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Button size="large" onClick={() => onNavigate?.('orders' as PageKey)}>
            Quay lại danh sách đơn hàng
          </Button>
          <Button size="large" type="primary" onClick={() => onNavigate?.('products')}>
            Tiếp tục mua sắm
          </Button>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail
