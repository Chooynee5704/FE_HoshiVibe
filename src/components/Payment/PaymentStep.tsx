"use client"

import { Button, Card, Typography } from "antd"
import { CheckCircle, CreditCard, Package } from "lucide-react"
const { Title, Text } = Typography

export type PaymentMethod = "vietqr" | "zalopay" | "momo" | "cod"

export default function PaymentStep({
  amount,
  pay,
  receiver,             // {name, phone, address}
  onBack,
  onNavigateOrders,      // () => void
  onNavigateProducts,    // () => void
}: {
  amount: number
  pay: PaymentMethod
  receiver: { name:string; phone:string; address:string }
  onBack: () => void
  onNavigateOrders: () => void
  onNavigateProducts: () => void
}) {
  const showQR = pay !== "cod"
  const formatVND = (n:number) => n.toLocaleString("vi-VN") + " VNĐ"

  const getPaymentName = (m: PaymentMethod) =>
    m === "vietqr" ? "VietQR" : m === "zalopay" ? "ZaloPay" : m === "momo" ? "MoMo" : "Thanh toán tiền mặt"

  const getPaymentBadge = (m: PaymentMethod) => (
    <div
      style={{
        width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontWeight: 800,
        background: m === "vietqr" ? "#e11d48" : m === "zalopay" ? "#0ea5e9" : m === "momo" ? "#a21caf" : "#10b981",
      }}
    >
      {m === "cod" ? "$" : m === "vietqr" ? "QR" : m === "zalopay" ? "ZL" : "MO"}
    </div>
  )

  return (
    <div style={{ maxWidth: 880, margin: "0 auto" }}>
      <Button onClick={onBack} style={{ marginBottom: 16 }}>Quay lại</Button>
      <Title level={2} style={{ marginBottom: 16 }}>Thanh toán</Title>

      <Card style={{ borderRadius: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          {getPaymentBadge(pay)}
          <Title level={4} style={{ margin: 0 }}>{getPaymentName(pay)}</Title>
        </div>

        {showQR ? (
          <>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ display: "inline-block", padding: 12, borderRadius: 16, border: "4px solid #e5e7eb" }}>
                <img src="/qr-code-payment.png" alt="QR Code" style={{ width: 256, height: 256, objectFit: "contain", borderRadius: 12 }} />
              </div>
            </div>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <Text type="secondary">Số tiền thanh toán</Text>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#f59e0b" }}>{formatVND(amount)}</div>
            </div>
            <Card size="small" style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}>
              <Title level={5} style={{ marginTop: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <CreditCard size={16} /> Hướng dẫn thanh toán
              </Title>
              <ol style={{ paddingLeft: 18, margin: 0 }}>
                <li>Mở ứng dụng {getPaymentName(pay)} trên điện thoại</li>
                <li>Quét mã QR ở trên</li>
                <li>Xác nhận thông tin và hoàn tất thanh toán</li>
                <li>Chờ xác nhận từ hệ thống</li>
              </ol>
            </Card>
          </>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ width: 80, height: 80, background: "#d1fae5", borderRadius: 999, margin: "0 auto 12px",
                display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckCircle size={40} color="#059669" />
              </div>
              <Title level={3} style={{ marginBottom: 0 }}>Đặt hàng thành công!</Title>
              <Text type="secondary">Đơn hàng đã được xác nhận</Text>
            </div>

            <Card size="small" style={{ marginBottom: 16, background: "#f9fafb" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text type="secondary">Mã đơn hàng</Text><Text strong>#001</Text>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                <Text type="secondary">Tổng tiền</Text>
                <Text strong style={{ color: "#f59e0b", fontSize: 18 }}>{formatVND(amount)}</Text>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                <Text type="secondary">Phương thức</Text>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  {getPaymentBadge(pay)} <Text strong>{getPaymentName(pay)}</Text>
                </span>
              </div>
            </Card>

            <Card size="small" style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}>
              <Title level={5} style={{ marginTop: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <Package size={16} /> Thông tin giao hàng
              </Title>
              <div style={{ display: "grid", gap: 6 }}>
                <div><Text strong>Người nhận:</Text> {receiver.name}</div>
                <div><Text strong>SĐT:</Text> {receiver.phone}</div>
                <div><Text strong>Địa chỉ:</Text> {receiver.address}</div>
              </div>
            </Card>

            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <Button block onClick={onNavigateProducts}>Tiếp tục mua sắm</Button>
              <Button type="primary" style={{ background: "#000" }} block onClick={onNavigateOrders}>
                Xem đơn hàng
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
