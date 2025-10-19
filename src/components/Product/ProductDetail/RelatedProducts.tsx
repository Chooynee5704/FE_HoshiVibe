// src/components/common/RelatedProducts.tsx
import { ShoppingCart } from "lucide-react"
import { memo } from "react"

export type RelatedProduct = {
  id: string | number
  name: string
  price: number
  image: string
}

type Props = {
  /** Nếu không truyền, component sẽ dùng mockdata mặc định bên trong */
  items?: RelatedProduct[]
  title?: string
  showQuickAdd?: boolean
  onProductClick?: (id: string | number) => void
  onQuickAdd?: (item: RelatedProduct) => void
  currencyFormatter?: (n: number) => string
  columns?: 2 | 3 | 4
  className?: string
}

/** ---- MOCK DATA mặc định (đã nhúng vào component) ---- */
const DEFAULT_ITEMS: RelatedProduct[] = [
  { id: 2, name: "Vòng Tay May Mắn", price: 180000, image: "/item/Dây Chuyền Bạc Nữ 2 Hạt Đá.jpg" },
  { id: 3, name: "Vòng Tay Thịnh Vượng", price: 200000, image: "/item/Vòng Tay Đá Thô.jpg" },
  { id: 4, name: "Vòng Tay Bình An", price: 160000, image: "/item/Dây Chuyền Bạc Nữ 925.jpg" },
  { id: 5, name: "Vòng Tay Tài Lộc", price: 190000, image: "/item/Vòng Tay Chuỗi Hạt 108 Đá Phong Thuỷ Tự Nhiên.jpg" },
]

const defaultFormatVND = (n: number) =>
  n.toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + " VNĐ"

function RelatedProducts({
  items,
  title = "Sản phẩm liên quan",
  showQuickAdd = true,
  onProductClick,
  onQuickAdd,
  currencyFormatter = defaultFormatVND,
  columns = 4,
  className = "",
}: Props) {
  const data = (items && items.length > 0) ? items : DEFAULT_ITEMS

  return (
    <section className={`rel ${className}`}>
      <style>{`
        .rel { background:#fff; border:1px solid #e5e7eb; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,.06); padding:24px; }
        .rel__title { text-align:center; text-transform:uppercase; letter-spacing:.06em; margin:0 0 16px 0; font-weight:900; }
        .rel__grid { display:grid; grid-template-columns: repeat(${columns}, 1fr); gap:18px; }
        .rel__card { border:1px solid #e5e7eb; border-radius:16px; overflow:hidden; background:#fff; box-shadow:0 6px 24px rgba(0,0,0,.06); cursor:pointer; transition: transform .2s, box-shadow .2s; }
        .rel__card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.12); }
        .rel__img { height:200px; background:#f6f6f6; }
        .rel__img img { width:100%; height:100%; object-fit:cover; }
        .rel__body { padding:16px; }
        .rel__name { font-weight:700; margin:0 0 6px 0; line-height:1.3; }
        .rel__row { display:flex; align-items:center; justify-content:space-between; }
        .rel__price { font-weight:900; }
        .rel__add { width:36px; height:36px; border-radius:999px; background:#f0fdf4; border:1px solid #bbf7d0; display:flex; align-items:center; justify-content:center; cursor:pointer; }
        @media (max-width: 1024px) { .rel__grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .rel__grid { grid-template-columns: 1fr; } .rel { padding:16px; } }
      `}</style>

      {!!title && <h2 className="rel__title">{title}</h2>}

      <div className="rel__grid">
        {data.map((p) => (
          <article
            key={p.id}
            className="rel__card"
            onClick={() => onProductClick?.(p.id)}
            role="button"
            aria-label={`Xem ${p.name}`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onProductClick?.(p.id)
            }}
          >
            <div className="rel__img">
              <img src={p.image} alt={p.name} />
            </div>
            <div className="rel__body">
              <h3 className="rel__name">{p.name}</h3>
              <div className="rel__row">
                <div className="rel__price">{currencyFormatter(p.price)}</div>
                {showQuickAdd && (
                  <button
                    aria-label={`Thêm nhanh ${p.name}`}
                    className="rel__add"
                    onClick={(e) => {
                      e.stopPropagation()
                      onQuickAdd?.(p)
                    }}
                  >
                    <ShoppingCart size={16} />
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default memo(RelatedProducts)
