"use client"

import { Package, ShoppingCart, Users, BarChart3, Palette, Layers } from "lucide-react"

export type ItemKey =
  | "products"
  | "orders"
  | "customers"
  | "design-room"
  | "custom-products"
  | "reports"
  | "settings"

export default function Sidebar({
  active = "products",
  onNavigate,
}: {
  active?: ItemKey
  onNavigate?: (key: ItemKey) => void
}) {
  const itemBase =
    "relative flex items-center gap-3 w-full text-left px-6 py-4 text-sm font-medium transition-all duration-200 outline-none group"
  const itemInactive = "text-gray-700 hover:bg-gray-100"
  const itemActive =
    "text-white bg-black font-bold"

  const icons: Record<ItemKey, any> = {
    products: Package,
    orders: ShoppingCart,
    customers: Users,
    "design-room": Palette,
    "custom-products": Layers,
    reports: BarChart3,
    settings: BarChart3,
  }

  const Item = ({ k, label }: { k: ItemKey; label: string }) => {
    const Icon = icons[k]
    return (
      <button
        type="button"
        className={`${itemBase} ${active === k ? itemActive : itemInactive}`}
        onClick={() => onNavigate?.(k)}
      >
        {Icon && <Icon className="w-5 h-5" />}
        <span>{label}</span>
      </button>
    )
  }

  return (
    <aside
      className="hidden md:flex w-72 min-h-screen flex-col bg-white border-r border-gray-200"
      aria-label="Admin sidebar"
    >
      {/* Logo */}
      <div className="px-6 pt-8 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-black flex items-center justify-center rounded">
            <span className="text-white font-bold text-xl">H</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-black">HoshiVibe</h1>
            <p className="text-xs text-gray-600">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Group title */}
      <div className="px-6 pt-6 pb-3 text-xs tracking-widest font-bold uppercase text-gray-500">
        Quản lý
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 space-y-1">
        <Item k="products" label="Quản lý sản phẩm" />
        <Item k="orders" label="Quản lý đơn hàng" />
        <Item k="customers" label="Quản lý khách hàng" />
        <Item k="design-room" label="Phòng thiết kế" />
        <Item k="custom-products" label="Custom Product" />
        <Item k="reports" label="Thống kê & Báo cáo" />
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">© 2025 HoshiVibe</p>
      </div>
    </aside>
  )
}
