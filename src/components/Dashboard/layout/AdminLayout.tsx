"use client"

import { useEffect, useState } from "react"
import Sidebar, { type ItemKey } from "./SideBar"
import ProductManagementPage from "../products/ProductManagementPage"
import OrderManagementPage from "../orders/OrderManagementPage"
import CustomerManagementPage from "../customers/CustomerManagemenntPage"
import CustomerDetailPage from "../customers/CustomerDetailPage"
import Statistic from "../reports/Statistic"
import NewProductPage from "../products/NewProductPage"
import OrderDetailPage from "../orders/OrderDetailPage"
import { getCurrentUser } from "../../../api/authApi"

export default function AdminLayout() {
  // 1) KHAI BÁO TOÀN BỘ HOOK NGAY TỪ ĐẦU
  const [allowed, setAllowed] = useState<boolean | null>(null)

  const [active, setActive] = useState<ItemKey>("products")

  // Products
  const [productView, setProductView] = useState<"list" | "new" | "edit">("list")
  const [editingProduct] = useState<any>(null)

  // Orders
  const [orderView, setOrderView] = useState<"list" | "detail">("list")
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  // Customers
  const [customerView, setCustomerView] = useState<"list" | "detail">("list")
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)

  // 2) CHECK QUYỀN TRONG useEffect (OK)
  useEffect(() => {
    const u = getCurrentUser()
    if (!u) {
      alert("Vui lòng đăng nhập.")
      window.location.replace("/login")
      return
    }
    if (u.role !== "Admin") {
      alert("Bạn không có quyền truy cập trang này.")
      window.location.replace("/")
      return
    }
    setAllowed(true)
  }, [])

  // 3) HÀM RENDER PHỤ
  const renderProducts = () => {
    if (productView === "new") {
      return (
        <NewProductPage
          mode="create"
          onCancel={() => setProductView("list")}
          onSubmit={(payload) => { console.log("Create payload:", payload); setProductView("list") }}
        />
      )
    }
    if (productView === "edit") {
      return (
        <NewProductPage
          mode="update"
          initialValues={editingProduct}
          onCancel={() => setProductView("list")}
          onSubmit={(payload) => { console.log("Update payload:", payload); setProductView("list") }}
        />
      )
    }
    return <ProductManagementPage onCreateNew={() => setProductView("new")} />
  }

  const renderOrders = () => {
    if (orderView === "detail" && selectedOrderId) {
      return (
        <OrderDetailPage
          orderId={selectedOrderId}
          onBack={() => { setOrderView("list"); setSelectedOrderId(null) }}
        />
      )
    }
    return (
      <OrderManagementPage
        onOpenDetail={(id) => { setSelectedOrderId(id); setOrderView("detail") }}
      />
    )
  }

  const renderCustomers = () => {
    if (customerView === "detail" && selectedCustomerId) {
      return (
        <CustomerDetailPage
          customerId={selectedCustomerId}
          onBack={() => { setCustomerView("list"); setSelectedCustomerId(null) }}
        />
      )
    }
    return (
      <CustomerManagementPage
        onOpenDetail={(cid) => { setSelectedCustomerId(cid); setCustomerView("detail") }}
      />
    )
  }

  const renderPage = () => {
    switch (active) {
      case "products":  return renderProducts()
      case "orders":    return renderOrders()
      case "customers": return renderCustomers()
      case "reports":   return <Statistic />
      default:          return <div className="p-6">Chọn mục từ sidebar</div>
    }
  }

  // 4) RENDER CÓ ĐIỀU KIỆN, KHÔNG RETURN SỚM TRƯỚC KHI KHAI BÁO HOOK
  return (
    <div className="flex min-h-screen bg-gray-50">
      {allowed === null ? (
        <div className="p-6">Đang kiểm tra quyền truy cập…</div>
      ) : (
        <>
          <Sidebar
            active={active}
            onNavigate={(k) => {
              setActive(k)
              if (k !== "products")  setProductView("list")
              if (k !== "orders")   { setOrderView("list"); setSelectedOrderId(null) }
              if (k !== "customers"){ setCustomerView("list"); setSelectedCustomerId(null) }
            }}
          />
          <main className="flex-1 flex flex-col">{renderPage()}</main>
        </>
      )}
    </div>
  )
}
