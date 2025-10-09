"use client"

import { useState } from "react"
import Sidebar, { type ItemKey } from "./SideBar"
import ProductManagementPage from "../products/ProductManagementPage"
import OrderManagementPage from "../orders/OrderManagementPage"
import CustomerManagementPage from "../customers/CustomerManagemenntPage"
import CustomerDetailPage from "../customers/CustomerDetailPage"
import Statistic from "../reports/Statistic"
import NewProductPage from "../products/NewProductPage"
import OrderDetailPage from "../orders/OrderDetailPage"

export default function AdminLayout() {
  const [active, setActive] = useState<ItemKey>("products")

  // Sub-view cho module Products
  const [productView, setProductView] = useState<"list" | "new" | "edit">("list")
  const [editingProduct, setEditingProduct] = useState<any>(null)

  // Sub-view cho module Orders
  const [orderView, setOrderView] = useState<"list" | "detail">("list")
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

    // Customers
  const [customerView, setCustomerView] = useState<"list" | "detail">("list")
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)

  const renderProducts = () => {
    if (productView === "new") {
      return (
        <NewProductPage
          mode="create"
          onCancel={() => setProductView("list")}
          onSubmit={(payload) => {
            console.log("Create payload:", payload)
            setProductView("list")
          }}
        />
      )
    }
    if (productView === "edit") {
      return (
        <NewProductPage
          mode="update"
          initialValues={editingProduct}
          onCancel={() => setProductView("list")}
          onSubmit={(payload) => {
            console.log("Update payload:", payload)
            setProductView("list")
          }}
        />
      )
    }
    return (
      <ProductManagementPage
        onCreateNew={() => setProductView("new")}
        // onEdit={(product) => { setEditingProduct(product); setProductView("edit") }}
      />
    )
  }

  const renderOrders = () => {
    if (orderView === "detail" && selectedOrderId) {
      return (
        <OrderDetailPage
          orderId={selectedOrderId}
          onBack={() => {
            setOrderView("list")
            setSelectedOrderId(null)
          }}
        />
      )
    }
    return (
      <OrderManagementPage
        onOpenDetail={(id) => {
          setSelectedOrderId(id)
          setOrderView("detail")
        }}
      />
    )
  }

    const renderCustomers = () => {
    if (customerView === "detail" && selectedCustomerId) {
      return (
        <CustomerDetailPage
          customerId={selectedCustomerId}
          onBack={() => {
            setCustomerView("list")
            setSelectedCustomerId(null)
          }}
        />
      )
    }
    return (
      <CustomerManagementPage
        onOpenDetail={(cid) => {
          setSelectedCustomerId(cid)
          setCustomerView("detail")
        }}
      />
    )
  }

  const renderPage = () => {
    switch (active) {
      case "products":
        return renderProducts()
      case "orders":
        return renderOrders()
      case "customers":
        return renderCustomers()
      case "reports":
        return <Statistic />
      default:
        return <div className="p-6">Chọn mục từ sidebar</div>
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        active={active}
        onNavigate={(k) => {
          setActive(k)
          // reset các sub-view khi đổi module
          if (k !== "products") setProductView("list")
          if (k !== "orders") { setOrderView("list"); setSelectedOrderId(null) }
          if (k !== "customers") { setCustomerView("list"); setSelectedCustomerId(null) }
        }}
      />
      <main className="flex-1 flex flex-col">{renderPage()}</main>
    </div>
  )
}
