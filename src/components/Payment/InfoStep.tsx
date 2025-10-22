"use client"

import { useState, type KeyboardEvent } from "react"
import { Button, Card, Divider, Form, Input, Typography } from "antd"
const { Title, Text } = Typography

export type PaymentMethod = "vietqr" | "zalopay" | "momo" | "cod"
type CartItem = { id:string; name:string; price:number; image:string; quantity:number }

/** Payment options with proper a11y (radiogroup) + Tailwind UI */
function PaymentOptionsTailwind({
  payment,
  onChange,
}: {
  payment: PaymentMethod
  onChange: (m: PaymentMethod) => void
}) {
  const opts: { key: PaymentMethod; label: string; icon: string; color: string }[] = [
    { key: "vietqr",  label: "VietQR",              icon: "QR", color: "bg-rose-600"    },
    { key: "zalopay", label: "ZaloPay",             icon: "ZL", color: "bg-sky-500"     },
    { key: "momo",    label: "MoMo",                icon: "MO", color: "bg-fuchsia-700" },
    { key: "cod",     label: "Thanh toán tiền mặt", icon: "$",  color: "bg-emerald-500" },
  ]

  const handleKey = (e: KeyboardEvent<HTMLButtonElement>, current: PaymentMethod) => {
    const idx = opts.findIndex(o => o.key === current)
    if (e.key === "ArrowRight") {
      e.preventDefault()
      onChange(opts[(idx + 1) % opts.length].key)
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      onChange(opts[(idx - 1 + opts.length) % opts.length].key)
    } else if (e.key === " " || e.key === "Enter") {
      e.preventDefault()
      onChange(current)
    }
  }

  return (
    <div role="radiogroup" aria-label="Phương thức thanh toán" className="grid grid-cols-2 gap-3">
      {opts.map(opt => {
        const active = payment === opt.key
        return (
          <button
            key={opt.key}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onKeyDown={(e) => handleKey(e, opt.key)}
            onClick={() => onChange(opt.key)}
            className={[
              "flex items-center gap-3 px-4 py-3 border rounded-xl cursor-pointer transition-all outline-none",
              active
                ? "border-gray-900 shadow-md"
                : "border-gray-200 hover:border-gray-300",
              "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            ].join(" ")}
          >
            <span
              className={`flex items-center justify-center w-10 h-10 text-white font-bold rounded-lg ${opt.color}`}
            >
              {opt.icon}
            </span>
            <span className="text-[15px] font-medium">{opt.label}</span>
            {/* radio ẩn để hỗ trợ SR nếu cần */}
            <input type="radio" className="hidden" checked={active} readOnly aria-hidden />
          </button>
        )
      })}
    </div>
  )
}

export default function InfoStep({
  items,
  defaultPay = "vietqr",
  overrideTotal,
  onNext,
  onBackToCart,
}: {
  items: CartItem[]
  defaultPay?: PaymentMethod
  overrideTotal?: number
  onNext: (args: {
    values: { name:string; phone:string; address:string; note?:string }
    pay: PaymentMethod
  }) => void
  onBackToCart: () => void
}) {
  const [form] = Form.useForm<{name:string; phone:string; address:string; note?:string}>()
  const [pay, setPay] = useState<PaymentMethod>(defaultPay)

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const shipping = subtotal > 0 && subtotal < 300000 ? 30000 : 0
  const grandTotal = typeof overrideTotal === "number" ? overrideTotal : subtotal + shipping
  const formatVND = (n:number) => n.toLocaleString("vi-VN") + " VNĐ"

  const submit = async () => {
    const values = await form.validateFields()
    onNext({ values, pay })
  }

  return (
    <div className="max-w-[1100px] mx-auto">
      <Button onClick={onBackToCart} className="mb-4">
        Quay lại giỏ hàng
      </Button>

      <Title level={2} className="mb-2">Thanh toán</Title>
      <Text type="secondary">Vui lòng điền thông tin giao hàng</Text>

      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 mt-4">
        {/* Form */}
        <Card className="rounded-2xl">
          <Title level={4}>Thông tin giao hàng</Title>
          <Form form={form} layout="vertical" requiredMark="optional" onFinish={submit}>
            <Form.Item
              label="Họ và tên"
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập họ tên" },
                { pattern: /^[A-Za-zÀ-ỹ]+(\s+[A-Za-zÀ-ỹ]+)+$/, message: "Vui lòng nhập họ tên đầy đủ, gồm ít nhất 2 từ" },
              ]}
            >
              <Input placeholder="Nguyễn Văn A" />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập SĐT" },
                { pattern: /^0\d{9,10}$/, message: "Số điện thoại không hợp lệ" },
              ]}
            >
              <Input placeholder="0123456789" type="tel" />
            </Form.Item>

            <Form.Item
              label="Địa chỉ giao hàng"
              name="address"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
            >
              <Input.TextArea rows={3} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành" />
            </Form.Item>

            <Form.Item label="Ghi chú (tuỳ chọn)" name="note">
              <Input.TextArea rows={2} placeholder="Ghi chú cho người giao hàng…" />
            </Form.Item>

            <Divider />

            {/* === Phương thức thanh toán (Tailwind + a11y) === */}
            <Form.Item label="Phương thức thanh toán">
              <PaymentOptionsTailwind payment={pay} onChange={setPay} />
            </Form.Item>

            <Button type="primary" htmlType="submit" block style={{ height: 44, fontWeight: 800, background: "#000" }}>
              Tiếp tục thanh toán
            </Button>
          </Form>
        </Card>

        {/* Tóm tắt đơn */}
        <Card className="rounded-2xl sticky top-4">
          <Title level={4}>Đơn hàng</Title>
          {items.map(i => (
            <div key={i.id} className="flex gap-3 mb-3">
              <img
                src={i.image}
                alt={i.name}
                className="w-[72px] h-[72px] rounded-lg object-cover bg-gray-100"
              />
              <div className="flex-1">
                <div className="font-semibold">{i.name}</div>
                <Text type="secondary">Số lượng: {i.quantity}</Text>
                <div className="font-bold">{formatVND(i.price)}</div>
              </div>
            </div>
          ))}
          <Divider />
          <div className="flex justify-between">
            <Text type="secondary">Tạm tính</Text>
            <Text>{formatVND(subtotal)}</Text>
          </div>
          <div className="flex justify-between">
            <Text type="secondary">Phí vận chuyển</Text>
            <Text>{formatVND(shipping)}</Text>
          </div>
          <div className="flex justify-between mt-2 font-bold">
            <Text strong>Tổng cộng</Text>
            <Text strong className="text-amber-500 text-lg">{formatVND(grandTotal)}</Text>
          </div>
        </Card>
      </div>
    </div>
  )
}

