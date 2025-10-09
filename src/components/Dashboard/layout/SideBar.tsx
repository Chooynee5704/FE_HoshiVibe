"use client"

export type ItemKey = "products" | "orders" | "customers" | "reports" | "settings"

export default function Sidebar({
  active = "products",
  onNavigate,
}: {
  active?: ItemKey
  onNavigate?: (key: ItemKey) => void
}) {
  const itemBase =
    "relative block w-full text-left px-4 py-3 text-sm transition-all duration-150 outline-none"
  const itemInactive = "text-gray-800 hover:bg-white/40"
  const itemActive =
    "text-gray-900 bg-[#EAF5E8] shadow-sm " +
    "before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 " +
    "before:w-1.5 before:bg-[#A7C98A]"

  const Item = ({ k, label }: { k: ItemKey; label: string }) => (
    <button
      type="button"
      className={`${itemBase} ${active === k ? itemActive : itemInactive}`}
      onClick={() => onNavigate?.(k)}
    >
      {label}
    </button>
  )

  return (
    <aside
      className="hidden md:flex w-64 min-h-screen flex-col bg-[#EBCCCC] border-r border-black/10"
      aria-label="Admin sidebar"
    >
      {/* Logo */}
      <div className="px-6 pt-6 pb-4">
        <img src="../../../public/images/logo.png" alt="Logo hoshi_vibe" />
      </div>

      {/* Group title */}
      <div className="px-6 pb-2 text-[11px] tracking-widest font-semibold uppercase text-gray-800/90">
        Quản lý
      </div>

      {/* Menu */}
      <nav className="flex-1 px-2 space-y-1">
        <Item k="products" label="Quản lý sản phẩm" />
        <Item k="orders" label="Quản lý đơn hàng" />
        <Item k="customers" label="Quản lý khách hàng" />
        <Item k="reports" label="Thống kê" />
      </nav>
    </aside>
  )
}
