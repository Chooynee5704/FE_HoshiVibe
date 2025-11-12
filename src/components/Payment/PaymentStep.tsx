"use client"

import { Button, Card, Typography, Modal } from "antd"
import { CreditCard } from "lucide-react"
import { useState } from "react"
import { createVNPayPayment } from "../../api/paymentAPI"
import { updateOrder } from "../../api/orderAPI"
import { getCurrentUser } from "../../api/authApi"
const { Title, Text } = Typography

export type PaymentMethod = "vnpay"

export default function PaymentStep({
  amount,
  pay,
  receiver,
  orderId,
  voucherCode,
  onBack,
  onNavigateOrders,
  onNavigateProducts,
}: {
  amount: number
  pay: PaymentMethod
  receiver: { name:string; phone:string; address:string }
  orderId: string
  voucherCode?: string
  onBack: () => void
  onNavigateOrders: () => void
  onNavigateProducts: () => void
}) {
  const [isProcessing, setIsProcessing] = useState(false)
  const formatVND = (n:number) => n.toLocaleString("vi-VN") + " VNĐ"

  const handleVNPayPayment = async () => {
    try {
      setIsProcessing(true)
      console.log('Updating order before payment:', orderId)
      
      // Get current user
      const user = getCurrentUser()
      
      if (!user || !user.user_Id) {
        Modal.error({
          title: 'Lỗi xác thực',
          content: 'Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.',
        })
        setIsProcessing(false)
        return
      }

      // Parse phone number (remove spaces and convert to number)
      const phoneNumber = parseInt(receiver.phone.replace(/\s/g, ''))
      
      // Update order with shipping info and final price
      await updateOrder(orderId, {
        user_Id: user.user_Id,
        totalPrice: amount,
        discountAmount: 0,
        finalPrice: amount,
        shippingAddress: receiver.address,
        phoneNumber: phoneNumber,
        status: 'Pending',
      })
      
      console.log('Order updated successfully')
      console.log('Creating VNPay payment for order:', orderId, 'with voucher:', voucherCode)
      
      const response = await createVNPayPayment({
        orderId: orderId,
        bankCode: '', // Empty for default VNPay gateway
        voucherCode: voucherCode, // Include voucher code if provided
      })
      
      console.log('VNPay payment URL:', response.paymentUrl)
      
      // Redirect to VNPay payment page
      window.location.href = response.paymentUrl
    } catch (error) {
      console.error('Error creating VNPay payment:', error)
      Modal.error({
        title: 'Lỗi thanh toán',
        content: 'Không thể tạo thanh toán VNPay. Vui lòng thử lại.',
      })
      setIsProcessing(false)
    }
  }

  const getPaymentBadge = () => (
    <div
      style={{
        width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontWeight: 800,
        background: "#0066cc",
      }}
    >
      VN
    </div>
  )

  return (
    <div style={{ maxWidth: 880, margin: "0 auto" }}>
      <Button onClick={onBack} style={{ marginBottom: 16 }}>Quay lại</Button>
      <Title level={2} style={{ marginBottom: 16 }}>Thanh toán VNPay</Title>

      <Card style={{ borderRadius: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          {getPaymentBadge()}
          <Title level={4} style={{ margin: 0 }}>VNPay</Title>
        </div>

        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <Text type="secondary">Số tiền thanh toán</Text>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#f59e0b" }}>{formatVND(amount)}</div>
        </div>

        <Card size="small" style={{ background: "#eff6ff", borderColor: "#bfdbfe", marginBottom: 16 }}>
          <Title level={5} style={{ marginTop: 0, display: "flex", alignItems: "center", gap: 8 }}>
            <CreditCard size={16} /> Thông tin giao hàng
          </Title>
          <div style={{ display: "grid", gap: 6 }}>
            <div><Text strong>Người nhận:</Text> {receiver.name}</div>
            <div><Text strong>SĐT:</Text> {receiver.phone}</div>
            <div><Text strong>Địa chỉ:</Text> {receiver.address}</div>
          </div>
        </Card>

        <Button 
          type="primary" 
          size="large"
          block 
          onClick={handleVNPayPayment}
          loading={isProcessing}
          style={{ background: "#0066cc", height: 48, fontWeight: 800 }}
        >
          {isProcessing ? 'Đang chuyển hướng...' : 'Tiếp tục thanh toán VNPay'}
        </Button>

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <Button block onClick={onNavigateProducts}>Tiếp tục mua sắm</Button>
          <Button block onClick={onNavigateOrders}>Xem đơn hàng</Button>
        </div>
      </Card>
    </div>
  )
}
