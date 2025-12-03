"use client"

import React from "react"
import type { PageKey } from "../../types/navigation"
import InfoStep from "./InfoStep"
import type { PaymentMethod } from "./InfoStep"
import PaymentStep from "./PaymentStep"

type CartItem = { id: string; name: string; price: number; image: string; quantity: number }

type Props = {
  onNavigate?: (p: PageKey) => void
  items: CartItem[]
  paymentMethod?: PaymentMethod
  total?: number
  orderId: string
}

export default function CheckoutPage({
  onNavigate,
  items,
  paymentMethod = "payos",
  total,
  orderId,
}: Props) {
  const [step, setStep] = React.useState<"info" | "payment">("info")
  const [pay, setPay] = React.useState<PaymentMethod>(paymentMethod)
  const [receiver, setReceiver] = React.useState<{ name: string; phone: string; address: string; note?: string } | null>(null)

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const shipping = subtotal > 0 && subtotal < 300000 ? 30000 : 0
  const grandTotal = typeof total === "number" ? total : subtotal + shipping

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#f9fafb,#f3f4f6)", padding: 24 }}>
      {step === "info" ? (
        <InfoStep
          items={items}
          defaultPay={pay}
          overrideTotal={total}
          onBackToCart={() => onNavigate?.("cart")}
          onNext={({ values, pay: chosen }) => {
            setReceiver(values)
            setPay(chosen)
            setStep("payment")
          }}
        />
      ) : (
        <PaymentStep
          amount={grandTotal}
          pay={pay}
          receiver={{
            name: receiver?.name ?? "",
            phone: receiver?.phone ?? "",
            address: receiver?.address ?? "",
          }}
          orderId={orderId}
          onBack={() => setStep("info")}
          onNavigateOrders={() => onNavigate?.("orders" as PageKey)}
          onNavigateProducts={() => onNavigate?.("products")}
        />
      )}
    </div>
  )
}

