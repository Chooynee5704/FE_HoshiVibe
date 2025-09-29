import type { CSSProperties } from 'react'

const pageStyle: CSSProperties = {
  backgroundColor: '#ffffff',
  minHeight: '100vh'
}

const container: CSSProperties = {
  maxWidth: '80rem',
  margin: '0 auto',
  padding: '2rem 1rem 4rem'
}

const titleWrap: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '1.5rem'
}

const titleStyle: CSSProperties = {
  fontSize: '1.375rem',
  fontWeight: 700,
  letterSpacing: '0.02em'
}

const grid: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1.5rem',
  marginTop: '1rem',
  justifyContent: 'center'
}

const card: CSSProperties = {
  height: '320px',
  borderRadius: '1rem',
  overflow: 'hidden',
  background: 'linear-gradient(180deg, #f7f7f7 0%, #bdbdbd 100%)',
  position: 'relative',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  boxShadow: '0 10px 24px rgba(0,0,0,0.08)'
}

const imageStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  opacity: 0.9
}

const overlay: CSSProperties = {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  padding: '1.25rem 1rem',
  background:
    'linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)',
  color: '#fff'
}

const nameStyle: CSSProperties = {
  margin: 0,
  fontSize: '1.125rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  textAlign: 'center'
}

const categories = [
  { id: 1, name: 'VÒNG TAY', image: '/product_categories/vongtay.png', accent: '#22c55e' },
  { id: 2, name: 'DÂY CHUYỀN', image: '/product_categories/daychuyen.jpg', accent: '#38bdf8' },
  { id: 3, name: 'NHẪN', image: '/product_categories/nhanphongthuy.png', accent: '#f59e0b' },
  { id: 4, name: 'PHỤ KIỆN KHÁC', image: '/product_categories/phukienkhac.png', accent: '#a78bfa' },
  { id: 5, name: 'SẢN PHẨM MỚI', image: '/accessories/mauthietke.jpg', accent: '#ef4444' },
  { id: 6, name: 'TÙY CHỈNH', image: '/images/home_banner.png', accent: '#3b82f6' }
]

const Products = () => {
  const flashProducts = [
    { id: 1, name: 'Vòng Tay Bạc 925 Nữ Đính 2 Viên Đá', image: '/item/Vòng Tay Bạc 925 Nữ Đính 2 Viên Đá.jpg' },
    { id: 2, name: 'Dây Chuyền Bạc Nữ 2 Hạt Đá', image: '/item/Dây Chuyền Bạc Nữ 2 Hạt Đá.jpg' },
    { id: 3, name: 'Vòng Tay Đá Thô', image: '/item/Vòng Tay Đá Thô.jpg' },
    { id: 4, name: 'Dây Chuyền Bạc Nữ 925', image: '/item/Dây Chuyền Bạc Nữ 925.jpg' },
    { id: 5, name: 'Vòng Tay Chuỗi Hạt 108 Đá Phong Thuỷ Tự Nhiên', image: '/item/Vòng Tay Chuỗi Hạt 108 Đá Phong Thuỷ Tự Nhiên.jpg' }
  ].map((p, i) => ({
    ...p,
    price: '150.000 VND',
    rating: [4.9, 4.8, 5.0, 4.9, 5.0][i % 5],
    sold: ['2k+','425','20k+','965','3k+'][i % 5]
  }))

  const suggestionProducts = [
    { id: 6, name: 'Vòng Tay Chỉ Đỏ Đính Đá Handmade Lu Thống', image: '/item/Vòng Tay Chỉ Đỏ Đính Đá Handmade Lu Thống.jpg' },
    { id: 7, name: 'Vòng Tay Đá Mài Giác Cho Nữ', image: '/item/Vòng Tay Đá Mài Giác Cho Nữ.jpg' },
    { id: 8, name: 'Lắc Tay Bạc Nữ 925 Đính 5 Hạt Đá', image: '/item/Lắc Tay Bạc Nữ 925 Đính 5 Hạt Đá.jpg' },
    { id: 9, name: 'Vòng Tay Đá Thô Full Of Energy', image: '/item/Vòng Tay Đá Thô Full Of Energy .jpg' },
    { id: 10, name: 'Vòng Tay Bạc Nữ Liugems Kết Hợp Hạt Đá Phong Thuỷ', image: '/item/Vòng Tay Bạc Nữ Liugems Kết Hợp Hạt Đá Phong Thuỷ Handmade Mix Charm Bi Mini Size.jpg' }
  ].map((p, i) => ({
    ...p,
    price: '150.000 VND',
    rating: [4.9, 4.9, 4.8, 4.9, 5.0][i % 5],
    sold: ['965','147','425','1k+','1k+'][i % 5]
  }))

  const cardWrap: CSSProperties = {
    width: '220px',
    borderRadius: '12px',
    overflow: 'hidden',
    background: '#fff',
    boxShadow: '0 10px 24px rgba(0,0,0,0.08)',
    border: '1px solid #eee',
    display: 'flex',
    flexDirection: 'column'
  }

  const imageBox: CSSProperties = {
    height: '140px',
    background: 'linear-gradient(180deg,#f2f2f2 0%, #e5e5e5 100%)'
  }

  const metaBox: CSSProperties = {
    padding: '12px 12px 12px',
    background: 'linear-gradient(180deg,#f7faf7 0%, #e7efe7 100%)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  }

  const rowBetween: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }

  const sliderRow: CSSProperties = {
    display: 'flex',
    gap: '1rem',
    overflowX: 'auto',
    padding: '0.25rem',
    scrollBehavior: 'smooth'
  }

  const formatVND = (value: number) => `${value.toLocaleString('vi-VN')}đ`

  return (
    <main style={pageStyle}>
      <div style={container}>
        <div style={titleWrap}>
          <h1 style={titleStyle}>DANH MỤC</h1>
        </div>

        <div style={grid}>
          {categories.map((c, index) => (
            <div
              key={c.id}
              style={{
                ...card,
                flex: '0 0 calc(25% - 1.125rem)',
                maxWidth: 'calc(25% - 1.125rem)',
                border: `3px solid ${index === 0 ? '#22c55e' : index === categories.length - 1 ? '#3b82f6' : 'transparent'}`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 18px 36px rgba(0,0,0,0.12)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 10px 24px rgba(0,0,0,0.08)'
              }}
            >
              <img src={c.image} alt={c.name} style={imageStyle} />
              <div style={overlay}>
                <h3 style={nameStyle}>{c.name}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Flash Sale */}
        <div style={{ marginTop: '2.5rem' }}>
          <div style={{ ...rowBetween, marginBottom: '12px', background: '#f6f6f6', padding: '10px 0 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#cf2e0e', fontWeight: 800, letterSpacing: '0.02em' }}>FLASH SALE</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['01','01','01'].map((t, idx) => (
                  <div key={idx} style={{ background: '#111111', color: '#ffffff', fontSize: '12px', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>{t}</div>
                ))}
              </div>
            </div>
            <a href="#" style={{ color: '#111827', fontSize: '12px', textDecoration: 'none' }}>XEM THÊM ›</a>
          </div>
          <div style={sliderRow}>
            {flashProducts.map((p, idx) => {
              const flashPrices = [165000, 139300, 187500, 216000, 231000]
              const flashDiscounts = [25, 30, 25, 28, 23]
              const priceNow = flashPrices[idx % flashPrices.length]
              const discount = flashDiscounts[idx % flashDiscounts.length]
              return (
              <div key={p.id} style={cardWrap}>
                <div style={imageBox}>
                  <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.85 }} />
                </div>
                <div style={metaBox}>
                  <div style={{ fontSize: '12px', color: '#374151', minHeight: '36px', maxHeight: '36px', lineHeight: '1.2', overflow: 'hidden' }}>{p.name}</div>
                  <div style={rowBetween}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ fontWeight: 800, color: '#cf2e0e', fontSize: '16px' }}>{formatVND(priceNow)}</div>
                      <span style={{ background: '#ffe4e0', color: '#cf2e0e', fontSize: '12px', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>{`-${discount}%`}</span>
                    </div>
                    <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <circle cx="9" cy="20" r="1.75" />
                        <circle cx="18" cy="20" r="1.75" />
                        <path d="M2.5 4.5h3l2.2 10.2a1.2 1.2 0 0 0 1.18.95H18.5a1.2 1.2 0 0 0 1.13-.8L22 8H6.2" />
                      </svg>
                    </button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 'auto' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '2px 6px', border: '1px solid #facc15', background: '#fff7db', color: '#92400e', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}>
                      <span>⭐</span>
                      <span>{p.rating.toFixed(1)}</span>
                    </div>
                    <div style={{ color: '#111827', fontSize: '12px' }}>Đã bán {p.sold}</div>
                  </div>
                </div>
              </div>
              )})}
          </div>
        </div>

        {/* Suggestions */}
        <div style={{ marginTop: '2.25rem' }}>
          <div style={{ background: '#f6f6f6', padding: '10px 0 12px', textAlign: 'center', marginBottom: '12px', position: 'relative' }}>
            <span style={{ color: '#cf2e0e', fontWeight: 800, letterSpacing: '0.02em' }}>GỢI Ý SẢN PHẨM MAY MẮN HÔM NAY</span>
            <div style={{ height: '4px', background: '#cf2e0e', marginTop: '6px' }} />
            <a href="#" style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', color: '#6b7280', fontSize: '12px', textDecoration: 'none', paddingRight: '8px' }}>XEM THÊM ›</a>
          </div>
          <div style={sliderRow}>
            {suggestionProducts.map((p, idx) => {
              const suggestPrices = [450000, 260000, 210000, 245000, 225000]
              const suggestDiscounts = [25, 35, 40, 30, 10]
              const priceNow = suggestPrices[idx % suggestPrices.length]
              const discount = suggestDiscounts[idx % suggestDiscounts.length]
              return (
                <div key={`s-${p.id}`} style={cardWrap}>
                  <div style={imageBox}>
                    <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.85 }} />
                  </div>
                  <div style={metaBox}>
                    <div style={{ fontSize: '12px', color: '#374151', minHeight: '36px', maxHeight: '36px', lineHeight: '1.2', overflow: 'hidden' }}>{p.name}</div>
                    <div style={rowBetween}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ fontWeight: 800, color: '#cf2e0e', fontSize: '16px' }}>{formatVND(priceNow)}</div>
                        <span style={{ background: '#ffe4e0', color: '#cf2e0e', fontSize: '12px', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>{`-${discount}%`}</span>
                      </div>
                      <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                          <circle cx="9" cy="20" r="1.75" />
                          <circle cx="18" cy="20" r="1.75" />
                          <path d="M2.5 4.5h3l2.2 10.2a1.2 1.2 0 0 0 1.18.95H18.5a1.2 1.2 0 0 0 1.13-.8L22 8H6.2" />
                        </svg>
                      </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 'auto' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '2px 6px', border: '1px solid #facc15', background: '#fff7db', color: '#92400e', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}>
                        <span>⭐</span>
                        <span>{p.rating.toFixed(1)}</span>
                      </div>
                      <div style={{ color: '#111827', fontSize: '12px' }}>Đã bán {p.sold}</div>
                    </div>
                  </div>
                </div>
              )})}
          </div>
        </div>
      </div>
    </main>
  )
}

export default Products


