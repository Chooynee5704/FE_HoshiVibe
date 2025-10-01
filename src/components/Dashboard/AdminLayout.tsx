"use client"

import { useState } from "react"
import Sidebar, { type ItemKey } from "./SideBar"
import ProductManagementPage from "./ProductManagementPage"
import OrderManagementPage from "./OrderManagementPage"
import CustomerManagementPage from "./CustomerManagemenntPage"
import Statistic from "./Statistic"


// Placeholder pages (bạn có thể code chi tiết sau)

export default function AdminLayout() {
  const [active, setActive] = useState<ItemKey>("products")

  const renderPage = () => {
    switch (active) {
      case "products":
        return <ProductManagementPage />
      case "orders":
        return <OrderManagementPage />
      case "customers":
        return <CustomerManagementPage />
      case "reports":
        return <Statistic />
      default:
        return <div className="p-6">Chọn mục từ sidebar</div>
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar active={active} onNavigate={setActive} />
      <main className="flex-1 flex flex-col">{renderPage()}</main>
    </div>
  )
}
