import { useMemo, useState } from 'react'
import type { PageKey } from '../types/navigation'
import { Trash2, Minus, Plus, ArrowLeft } from 'lucide-react'

export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
}

interface CartProps {
  onNavigate?: (page: PageKey) => void
  items: CartItem[]
  onUpdateQty: (id: number, qty: number) => void
  onRemove: (id: number) => void
  onCheckout?: () => void
}

const formatVND = (n: number) => n.toLocaleString('vi-VN', { maximumFractionDigits: 0 }) + ' VNĐ'

const Cart = ({ onNavigate, items, onUpdateQty, onRemove, /*onCheckout*/ }: CartProps) => {
  const [note, setNote] = useState('')
  // const [payment, setPayment] = useState<'vietqr' | 'zalopay' | 'momo' | 'cod'>('vietqr')

  const { subtotal, total, itemCount } = useMemo(() => {
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
    const itemCount = items.reduce((s, i) => s + i.quantity, 0)
    const shipping = subtotal > 0 && subtotal < 300000 ? 30000 : 0
    const total = subtotal + shipping
    return { subtotal, total, itemCount }
  }, [items])

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh' }}>
      <style>{`
        .cart__container{max-width:1200px;margin:0 auto;padding:32px 24px}
        .cart__title{font-size:32px;font-weight:900;letter-spacing:.04em;text-transform:uppercase}
        .cart__grid{display:grid;grid-template-columns:2fr 1fr;gap:24px;margin-top:18px}
        .cart__card{background:#f8f9fa;border:1px solid #e5e7eb;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,.06)}
        .cart__row{display:grid;grid-template-columns:82px 1fr 110px 120px 32px;gap:12px;align-items:center;padding:14px 16px;border-bottom:1px solid #e5e7eb}
        .cart__img{width:82px;height:82px;border-radius:12px;object-fit:cover;background:#f3f4f6}
        .cart__name{font-weight:700}
        .cart__qty{display:flex;align-items:center;gap:8px}
        .cart__btn{width:32px;height:32px;border-radius:8px;border:1px solid #e5e7eb;background:#fff;cursor:pointer}
        .cart__sum{padding:16px}
        .cart__aside{background:#f8f9fa;border:1px solid #e5e7eb;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,.06);padding:18px}
        .cart__line{display:flex;justify-content:space-between;margin:8px 0;color:#6b7280}
        .cart__total{display:flex;justify-content:space-between;margin-top:10px;font-weight:900}
        .pay__title{font-weight:700;margin:10px 0 8px 0}
        .pay__opt{display:flex;align-items:center;gap:10px;border:1px solid #e5e7eb;background:#fff;border-radius:12px;padding:10px 12px;margin-bottom:10px;cursor:pointer;transition:all .2s}
        .pay__opt:hover{box-shadow:0 6px 20px rgba(0,0,0,.06)}
        .pay__opt--active{border-color:#000;background:#fefefe}
        .pay__radio{margin-left:auto;width:18px;height:18px}
        .pay__icon{width:28px;height:18px;border-radius:4px;display:inline-flex;align-items:center;justify-content:center;color:#fff;font-weight:800}
        .pay__vietqr{background:#e11d48}
        .pay__zalo{background:#0ea5e9}
        .pay__momo{background:#a21caf}
        .pay__cod{background:#10b981}
        .pay__grand{display:flex;align-items:center;justify-content:space-between;margin-top:12px}
        .pay__grand-amount{color:#f59e0b;font-weight:900;font-size:20px}
        @media(max-width: 960px){.cart__grid{grid-template-columns:1fr}.cart__row{grid-template-columns:72px 1fr 100px 100px 28px}}
      `}</style>

      <div className="cart__container">
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <button onClick={() => onNavigate?.('search')} style={{ border:'1px solid #e5e7eb', background:'#fff', borderRadius:10, padding:'6px 10px', cursor:'pointer' }}>
              <ArrowLeft size={16}/> Quay lại mua sắm
            </button>
          </div>
          <div className="cart__title">Giỏ hàng</div>
          <div style={{ color:'#6b7280' }}>{itemCount} món</div>
        </div>

        <div className="cart__grid">
          {/* Items */}
          <div className="cart__card">
            {items.length === 0 && (
              <div style={{ padding:24, textAlign:'center', color:'#6b7280' }}>Giỏ hàng trống</div>
            )}
            {items.map(item => (
              <div key={item.id} className="cart__row">
                <img src={item.image} alt={item.name} className="cart__img"/>
                <div>
                  <div className="cart__name">{item.name}</div>
                  <div style={{ color:'#6b7280', fontSize:13 }}>Mã SP: HV-{item.id.toString().padStart(4,'0')}</div>
                </div>
                <div style={{ fontWeight:700 }}>{formatVND(item.price)}</div>
                <div className="cart__qty">
                  <button className="cart__btn" onClick={() => onUpdateQty(item.id, Math.max(1, item.quantity - 1))}><Minus size={14}/></button>
                  <input value={item.quantity} onChange={(e)=> onUpdateQty(item.id, Math.max(1, parseInt(e.target.value)||1))} style={{ width:48, height:32, textAlign:'center', border:'1px solid #e5e7eb', borderRadius:8 }}/>
                  <button className="cart__btn" onClick={() => onUpdateQty(item.id, item.quantity + 1)}><Plus size={14}/></button>
                </div>
                <button className="cart__btn" onClick={() => onRemove(item.id)} aria-label="Xoá"><Trash2 size={16}/></button>
              </div>
            ))}
            {items.length > 0 && (
              <div className="cart__sum">
                <textarea placeholder="Ghi chú cho cửa hàng (tuỳ chọn)" value={note} onChange={(e)=> setNote(e.target.value)} style={{ width:'100%', minHeight:76, border:'1px solid #e5e7eb', borderRadius:12, padding:10 }}/>
              </div>
            )}
          </div>

          {/* Summary */}
          <aside className="cart__aside">

            {/* Payment methods */}
            <div className="pay__title">Phương thức thanh toán</div>
            {/* <div onClick={()=> setPayment('vietqr')} className={`pay__opt ${payment==='vietqr' ? 'pay__opt--active' : ''}`}>
              <span className="pay__icon pay__vietqr">QR</span>
              <span>VietQR</span>
              <input className="pay__radio" type="radio" checked={payment==='vietqr'} readOnly />
            </div>
            <div onClick={()=> setPayment('zalopay')} className={`pay__opt ${payment==='zalopay' ? 'pay__opt--active' : ''}`}>
              <span className="pay__icon pay__zalo">ZL</span>
              <span>ZaloPay</span>
              <input className="pay__radio" type="radio" checked={payment==='zalopay'} readOnly />
            </div>
            <div onClick={()=> setPayment('momo')} className={`pay__opt ${payment==='momo' ? 'pay__opt--active' : ''}`}>
              <span className="pay__icon pay__momo">MO</span>
              <span>MoMo</span>
              <input className="pay__radio" type="radio" checked={payment==='momo'} readOnly />
            </div>
            <div onClick={()=> setPayment('cod')} className={`pay__opt ${payment==='cod' ? 'pay__opt--active' : ''}`}>
              <span className="pay__icon pay__cod">$</span>
              <span>Thanh toán tiền mặt</span>
              <input className="pay__radio" type="radio" checked={payment==='cod'} readOnly />
            </div> */}

            {/* Price breakdown */}
            <div className="cart__line" style={{ marginTop:10 }}><span>Tạm tính</span><span>{formatVND(subtotal)}</span></div>
            <div className="cart__line"><span>Giảm giá</span><span>0 VNĐ</span></div>
            <div className="pay__grand"><span>Tổng thanh toán</span><span className="pay__grand-amount">{formatVND(total)}</span></div>

            <button   onClick={() => onNavigate?.('checkout')}   // 👈 thay vì onCheckout()
  style={{ width:'100%', marginTop:14, padding:'16px 14px', background:'#000', color:'#fff',
           border:'none', borderRadius:12, cursor:'pointer', fontWeight:900, letterSpacing:'.06em',
           textTransform:'uppercase' }}>
  Thanh toán ngay
</button>
            <div style={{ color:'#6b7280', fontSize:12, marginTop:8 }}>Freeship đơn từ 300.000 VNĐ (nội thành).</div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Cart


