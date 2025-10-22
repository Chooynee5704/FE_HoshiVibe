import type { CSSProperties } from 'react'
import { useState, useEffect } from 'react'
import type { PageKey } from '../../types/navigation'
import { searchProducts, type ProductApi } from '../../api/productsAPI'

const pageStyle: CSSProperties = {
  backgroundColor: '#ffffff',
  minHeight: '100vh',
  color: '#000000'
}

const container: CSSProperties = {
  maxWidth: '1400px',
  margin: '0 auto',
  padding: '3rem 2rem 5rem'
}

const titleWrap: CSSProperties = {
  marginBottom: '3rem',
  textAlign: 'center'
}

const titleStyle: CSSProperties = {
  fontSize: '3rem',
  fontWeight: 900,
  letterSpacing: '-0.02em',
  color: '#000000',
  marginBottom: '0.5rem'
}

const subtitle: CSSProperties = {
  fontSize: '1rem',
  color: '#999999',
  letterSpacing: '0.1em',
  textTransform: 'uppercase'
}

const grid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '2rem',
  marginTop: '2rem'
}

const categories = [
  { id: 1, name: 'VÒNG TAY', image: '/product_categories/vongtay.png', category: 'VÒNG TAY' },
  { id: 2, name: 'DÂY CHUYỀN', image: '/product_categories/daychuyen.jpg', category: 'DÂY CHUYỀN' },
  { id: 3, name: 'NHẪN', image: '/product_categories/nhanphongthuy.png', category: 'NHẪN' },
  { id: 4, name: 'PHỤ KIỆN KHÁC', image: '/product_categories/phukienkhac.png', category: 'PHỤ KIỆN KHÁC' },
  { id: 5, name: 'SẢN PHẨM MỚI', image: '/accessories/mauthietke.jpg', category: 'SẢN PHẨM MỚI' },
  { id: 6, name: 'TẤT CẢ', image: '/images/home_banner.png', category: 'ALL' }
]

interface ProductsProps {
  onNavigate?: (page: PageKey, params?: { category?: string; id?: string | number }) => void;
}

const Products = ({ onNavigate }: ProductsProps) => {
  const [hoveredCard, setHoveredCard] = useState<string | number | null>(null)
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null)
  const [products, setProducts] = useState<ProductApi[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch products from API
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        const data = await searchProducts() // GET /api/Product/search
        if (mounted) setProducts(data || [])
      } catch (err) {
        console.error('Load products failed:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  // Map API products to UI format
  const apiProducts = (products || []).map(p => ({
    id: p.product_Id,
    name: p.name,
    price: p.price,
    image: p.imageUrl || p.imageURL || '/placeholder.png',
    category: p.category,
    status: p.status,
    stock: p.stock,
    description: p.description
  }))

  // Split products for different sections
  const flashProducts = apiProducts.slice(0, 5).map((p, i) => ({
    ...p,
    rating: [4.9, 4.8, 5.0, 4.9, 5.0][i % 5],
    sold: ['2k+','425','20k+','965','3k+'][i % 5]
  }))

  const suggestionProducts = apiProducts.slice(5, 10).map((p, i) => ({
    ...p,
    rating: [4.9, 4.9, 4.8, 4.9, 5.0][i % 5],
    sold: ['965','147','425','1k+','1k+'][i % 5]
  }))

  // Use API products or fallback to hardcoded data
  const finalFlashProducts = flashProducts.length > 0 ? flashProducts : [
    { id: 1, name: 'Vòng Tay Bạc 925 Nữ Đính 2 Viên Đá', image: '/item/Vòng Tay Bạc 925 Nữ Đính 2 Viên Đá.jpg', price: 165000, rating: 4.9, sold: '2k+' },
    { id: 2, name: 'Dây Chuyền Bạc Nữ 2 Hạt Đá', image: '/item/Dây Chuyền Bạc Nữ 2 Hạt Đá.jpg', price: 139300, rating: 4.8, sold: '425' },
    { id: 3, name: 'Vòng Tay Đá Thô', image: '/item/Vòng Tay Đá Thô.jpg', price: 187500, rating: 5.0, sold: '20k+' },
    { id: 4, name: 'Dây Chuyền Bạc Nữ 925', image: '/item/Dây Chuyền Bạc Nữ 925.jpg', price: 216000, rating: 4.9, sold: '965' },
    { id: 5, name: 'Vòng Tay Chuỗi Hạt 108 Đá Phong Thuỷ Tự Nhiên', image: '/item/Vòng Tay Chuỗi Hạt 108 Đá Phong Thuỷ Tự Nhiên.jpg', price: 231000, rating: 5.0, sold: '3k+' }
  ]

  const finalSuggestionProducts = suggestionProducts.length > 0 ? suggestionProducts : [
    { id: 6, name: 'Vòng Tay Chỉ Đỏ Đính Đá Handmade Lu Thống', image: '/item/Vòng Tay Chỉ Đỏ Đính Đá Handmade Lu Thống.jpg', price: 450000, rating: 4.9, sold: '965' },
    { id: 7, name: 'Vòng Tay Đá Mài Giác Cho Nữ', image: '/item/Vòng Tay Đá Mài Giác Cho Nữ.jpg', price: 260000, rating: 4.9, sold: '147' },
    { id: 8, name: 'Lắc Tay Bạc Nữ 925 Đính 5 Hạt Đá', image: '/item/Lắc Tay Bạc Nữ 925 Đính 5 Hạt Đá.jpg', price: 210000, rating: 4.8, sold: '425' },
    { id: 9, name: 'Vòng Tay Đá Thô Full Of Energy', image: '/item/Vòng Tay Đá Thô Full Of Energy .jpg', price: 245000, rating: 4.9, sold: '1k+' },
    { id: 10, name: 'Vòng Tay Bạc Nữ Liugems Kết Hợp Hạt Đá Phong Thuỷ', image: '/item/Vòng Tay Bạc Nữ Liugems Kết Hợp Hạt Đá Phong Thuỷ Handmade Mix Charm Bi Mini Size.jpg', price: 225000, rating: 5.0, sold: '1k+' }
  ]

  const card: CSSProperties = {
    height: '400px',
    borderRadius: '0',
    overflow: 'hidden',
    background: '#f5f5f5',
    position: 'relative',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid #e5e5e5',
    cursor: 'pointer'
  }

  const imageStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
  }

  const overlay: CSSProperties = {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: '2rem',
    background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%)',
    color: '#fff',
    transition: 'all 0.4s ease'
  }

  const nameStyle: CSSProperties = {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.15em'
  }

  const cardWrap: CSSProperties = {
    width: '260px',
    borderRadius: '0',
    overflow: 'hidden',
    background: '#ffffff',
    border: '1px solid #e5e5e5',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease',
    flexShrink: 0
  }

  const imageBox: CSSProperties = {
    height: '180px',
    background: '#f5f5f5',
    position: 'relative',
    overflow: 'hidden'
  }

  const metaBox: CSSProperties = {
    padding: '1.25rem',
    background: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flex: 1
  }

  const rowBetween: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }

  const sliderRow: CSSProperties = {
    display: 'flex',
    gap: '1.5rem',
    overflowX: 'auto',
    padding: '1rem 0',
    scrollBehavior: 'smooth'
  }

  const formatVND = (value: number) => `${value.toLocaleString('vi-VN')}đ`

  const sectionTitle: CSSProperties = {
    fontSize: '1.75rem',
    fontWeight: 900,
    letterSpacing: '0.05em',
    marginBottom: '1.5rem',
    textTransform: 'uppercase',
    position: 'relative',
    paddingBottom: '1rem'
  }

  const sectionTitleAfter: CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '60px',
    height: '3px',
    background: '#000000'
  }

  return (
    <main style={pageStyle}>
      <div style={container}>
        <div style={titleWrap}>
          <div style={subtitle}>Explore Our Collection</div>
          <h1 style={titleStyle}>DANH MỤC</h1>
        </div>

        <div style={grid}>
          {categories.map((c) => (
            <div
              key={c.id}
              style={{
                ...card,
                transform: hoveredCategory === c.id ? 'scale(1.02)' : 'scale(1)',
                borderColor: hoveredCategory === c.id ? '#000000' : '#e5e5e5',
                boxShadow: hoveredCategory === c.id ? '0 20px 40px rgba(0,0,0,0.15)' : '0 4px 12px rgba(0,0,0,0.05)'
              }}
              onMouseEnter={() => setHoveredCategory(c.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              onClick={() => onNavigate?.('search', { category: c.category })}
            >
              <img 
                src={c.image} 
                alt={c.name} 
                style={{
                  ...imageStyle,
                  transform: hoveredCategory === c.id ? 'scale(1.1)' : 'scale(1)'
                }} 
              />
              <div style={{
                ...overlay,
                background: hoveredCategory === c.id 
                  ? 'linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%)'
                  : 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%)'
              }}>
                <h3 style={nameStyle}>{c.name}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Flash Sale */}
        <div style={{ marginTop: '5rem' }}>
          <div style={{ ...rowBetween, marginBottom: '2rem' }}>
            <div style={sectionTitle}>
              FLASH SALE
              <div style={sectionTitleAfter} />
            </div>
            <button 
              onClick={() => onNavigate?.('search', { category: 'ALL' })}
              style={{ 
                color: '#666666', 
                fontSize: '0.875rem', 
                textDecoration: 'none',
                letterSpacing: '0.05em',
                transition: 'color 0.3s ease',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#000000'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#666666'
              }}
            >
              XEM THÊM →
            </button>
          </div>
          <div style={sliderRow}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '200px' }}>
                <div style={{ fontSize: '1.125rem', color: '#666666' }}>Đang tải sản phẩm...</div>
              </div>
            ) : (
              finalFlashProducts.map((p, idx) => {
                const flashDiscounts = [25, 30, 25, 28, 23]
                const discount = flashDiscounts[idx % flashDiscounts.length]
                const priceNow = p.price || 0
                const isHovered = hoveredCard === p.id
              
                return (
                <div 
                  key={p.id} 
                  style={{
                    ...cardWrap,
                    transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                    borderColor: isHovered ? '#000000' : '#e5e5e5',
                    boxShadow: isHovered ? '0 16px 32px rgba(0,0,0,0.12)' : '0 4px 12px rgba(0,0,0,0.05)',
                    cursor: 'pointer'
                  }}
                  onClick={() => onNavigate?.('product-detail', { id: p.id })}
                  onMouseEnter={() => setHoveredCard(p.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div style={imageBox}>
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover', 
                        display: 'block',
                        transition: 'all 0.4s ease',
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                      }} 
                    />
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: '#000000',
                      color: '#ffffff',
                      fontSize: '11px',
                      padding: '4px 10px',
                      fontWeight: 800,
                      letterSpacing: '0.05em'
                    }}>
                      -{discount}%
                    </div>
                  </div>
                  <div style={metaBox}>
                    <div style={{ 
                      fontSize: '0.875rem', 
                      color: '#333333', 
                      minHeight: '40px',
                      lineHeight: '1.4',
                      overflow: 'hidden',
                      fontWeight: 500
                    }}>
                      {p.name}
                    </div>
                    <div style={rowBetween}>
                      <div style={{ fontWeight: 900, color: '#000000', fontSize: '1.125rem', letterSpacing: '-0.02em' }}>
                        {formatVND(priceNow)}
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          // Handle add to cart logic here
                          console.log('Added to cart:', p.name)
                        }}
                        style={{ 
                        border: '1px solid #cccccc', 
                        background: 'transparent', 
                        cursor: 'pointer', 
                        padding: '8px',
                        borderRadius: '0',
                        transition: 'all 0.3s ease'
                      }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="9" cy="20" r="1.75" />
                          <circle cx="18" cy="20" r="1.75" />
                          <path d="M2.5 4.5h3l2.2 10.2a1.2 1.2 0 0 0 1.18.95H18.5a1.2 1.2 0 0 0 1.13-.8L22 8H6.2" />
                        </svg>
                      </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid #e5e5e5' }}>
                      <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '4px',
                        color: '#666666',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        <span>★</span>
                        <span>{p.rating.toFixed(1)}</span>
                      </div>
                      <div style={{ color: '#999999', fontSize: '0.75rem' }}>Đã bán {p.sold}</div>
                    </div>
                  </div>
                </div>
              )
              })
            )}
          </div>
        </div>

        {/* Suggestions */}
        <div style={{ marginTop: '5rem' }}>
          <div style={{ ...rowBetween, marginBottom: '2rem' }}>
            <div style={sectionTitle}>
              GỢI Ý HÔM NAY
              <div style={sectionTitleAfter} />
            </div>
            <button 
              onClick={() => onNavigate?.('search', { category: 'ALL' })}
              style={{ 
                color: '#666666', 
                fontSize: '0.875rem', 
                textDecoration: 'none',
                letterSpacing: '0.05em',
                transition: 'color 0.3s ease',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#000000'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#666666'
              }}
            >
              XEM THÊM →
            </button>
          </div>
          <div style={sliderRow}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '200px' }}>
                <div style={{ fontSize: '1.125rem', color: '#666666' }}>Đang tải sản phẩm...</div>
              </div>
            ) : (
              finalSuggestionProducts.map((p, idx) => {
                const suggestDiscounts = [25, 35, 40, 30, 10]
                const discount = suggestDiscounts[idx % suggestDiscounts.length]
                const priceNow = p.price || 0
                const isHovered = hoveredCard === p.id
              
              return (
                <div 
                  key={`s-${p.id}`} 
                  style={{
                    ...cardWrap,
                    transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                    borderColor: isHovered ? '#000000' : '#e5e5e5',
                    boxShadow: isHovered ? '0 16px 32px rgba(0,0,0,0.12)' : '0 4px 12px rgba(0,0,0,0.05)',
                    cursor: 'pointer'
                  }}
                  onClick={() => onNavigate?.('product-detail', { id: p.id })}
                  onMouseEnter={() => setHoveredCard(p.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div style={imageBox}>
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover', 
                        display: 'block',
                        transition: 'all 0.4s ease',
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                      }} 
                    />
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: '#000000',
                      color: '#ffffff',
                      fontSize: '11px',
                      padding: '4px 10px',
                      fontWeight: 800,
                      letterSpacing: '0.05em'
                    }}>
                      -{discount}%
                    </div>
                  </div>
                  <div style={metaBox}>
                    <div style={{ 
                      fontSize: '0.875rem', 
                      color: '#333333', 
                      minHeight: '40px',
                      lineHeight: '1.4',
                      overflow: 'hidden',
                      fontWeight: 500
                    }}>
                      {p.name}
                    </div>
                    <div style={rowBetween}>
                      <div style={{ fontWeight: 900, color: '#000000', fontSize: '1.125rem', letterSpacing: '-0.02em' }}>
                        {formatVND(priceNow)}
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          // Handle add to cart logic here
                          console.log('Added to cart:', p.name)
                        }}
                        style={{ 
                        border: '1px solid #cccccc', 
                        background: 'transparent', 
                        cursor: 'pointer', 
                        padding: '8px',
                        borderRadius: '0',
                        transition: 'all 0.3s ease'
                      }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="9" cy="20" r="1.75" />
                          <circle cx="18" cy="20" r="1.75" />
                          <path d="M2.5 4.5h3l2.2 10.2a1.2 1.2 0 0 0 1.18.95H18.5a1.2 1.2 0 0 0 1.13-.8L22 8H6.2" />
                        </svg>
                      </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid #e5e5e5' }}>
                      <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '4px',
                        color: '#666666',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        <span>★</span>
                        <span>{p.rating.toFixed(1)}</span>
                      </div>
                      <div style={{ color: '#999999', fontSize: '0.75rem' }}>Đã bán {p.sold}</div>
                    </div>
                  </div>
                </div>
              )
              })
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default Products