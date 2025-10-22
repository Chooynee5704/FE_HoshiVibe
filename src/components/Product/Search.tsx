"use client"

import { useState, useEffect, useRef } from 'react'
import { ShoppingCart, Star } from 'lucide-react'
import type { PageKey } from '../../types/navigation'
import { searchProducts, type ProductApi } from '../../api/productsAPI'

interface SearchProps {
  onNavigate?: (page: PageKey, params?: { id?: string | number }) => void;
  searchQuery?: string;
  category?: string;
}

const Search = ({ onNavigate, searchQuery = '', category = '' }: SearchProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState(category || 'ALL')
  const [sortBy, setSortBy] = useState('default')
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<ProductApi[]>([])
  const sectionRef = useRef<HTMLDivElement | null>(null)

  // Hiệu ứng hiển thị
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current) }
  }, [])

  // Chuẩn hoá category BE -> label UI
  const normalizeCategory = (raw?: string) => {
    const t = (raw || '').toLowerCase()
    if (t.includes('bracelet') || t.includes('vòng tay')) return 'VÒNG TAY'
    if (t.includes('necklace') || t.includes('dây chuyền') || t.includes('neck')) return 'DÂY CHUYỀN'
    if (t.includes('ring') || t.includes('nhẫn')) return 'NHẪN'
    if (t.includes('accessory') || t.includes('phụ kiện') || t.includes('stone') || t.includes('đá')) return 'PHỤ KIỆN KHÁC'
    if (t.includes('new') || t.includes('mới') || t.includes('latest')) return 'SẢN PHẨM MỚI'
    return 'PHỤ KIỆN KHÁC' // Default fallback
  }

  // Cập nhật selectedCategory khi category prop thay đổi
  useEffect(() => {
    setSelectedCategory(category || 'ALL')
  }, [category])

  // Tải danh sách sản phẩm (tất cả)
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

  // Map BE -> UI
  const uiProducts = (products || []).map(p => ({
    id: p.product_Id, // BE trả product_Id (string)
    name: p.name,
    price: p.price,
    rating: 5,
    reviews: 0,
    image: p.imageUrl || p.imageURL || '/placeholder.png',
    category: normalizeCategory(p.category),
    sale: p.status === 'ready-to-publish', // tuỳ business rule
  }))

  const categories = [
    { id: 'VÒNG TAY', label: 'VÒNG TAY' },
    { id: 'DÂY CHUYỀN', label: 'DÂY CHUYỀN' },
    { id: 'NHẪN', label: 'NHẪN' },
    { id: 'PHỤ KIỆN KHÁC', label: 'PHỤ KIỆN KHÁC' },
    { id: 'SẢN PHẨM MỚI', label: 'SẢN PHẨM MỚI' },
    { id: 'ALL', label: 'TẤT CẢ' }
  ]

  const sortOptions = ['Mặc định', 'Giá tăng dần', 'Giá giảm dần', 'Đánh giá cao nhất', 'Mới nhất']

  // Lọc theo danh mục + từ khoá
  const filteredProducts = uiProducts.filter(p => {
    const byCategory =
      !selectedCategory || selectedCategory === 'ALL'
        ? true
        : selectedCategory === 'SẢN PHẨM MỚI'
          ? p.status === 'Active' // Giả sử sản phẩm mới có status Active
          : p.category === selectedCategory

    const byKeyword = searchQuery
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
      : true

    return byCategory && byKeyword
  })

  // Sắp xếp
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'Giá tăng dần') return a.price - b.price
    if (sortBy === 'Giá giảm dần') return b.price - a.price
    if (sortBy === 'Đánh giá cao nhất') return (b.reviews ?? 0) - (a.reviews ?? 0)
    return 0
  })

  const handleAddToCart = (productId: string) => {
    console.log(`Added product ${productId} to cart`)
  }

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setCurrentPage(1)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
    setShowSortDropdown(false)
  }

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .product-card { transition: all .4s cubic-bezier(.4,0,.2,1); position: relative; overflow: hidden; }
        .product-card:hover { transform: translateY(-12px); box-shadow: 0 25px 50px rgba(0,0,0,.2); }
        .product-image { transition: transform .5s ease; }
        .product-card:hover .product-image { transform: scale(1.1); }
        .add-to-cart-btn { transition: all .3s ease; }
        .add-to-cart-btn:hover { background: #000 !important; transform: scale(1.15); }
        .category-btn { transition: all .3s ease; position: relative; }
        .category-btn::after { content:''; position:absolute; bottom:-2px; left:50%; width:0; height:3px; background:#000; transform:translateX(-50%); transition:width .3s ease; }
        .category-btn.active::after { width:80%; }
        .category-btn:hover { transform: translateY(-2px); }
        .dropdown { transition: all .3s ease; opacity:0; visibility:hidden; transform: translateY(-10px); }
        .dropdown.show { opacity:1; visibility:visible; transform: translateY(0); }
        .pagination-btn { transition: all .3s ease; }
        .pagination-btn:hover:not(:disabled) { background:#f3f4f6 !important; transform: scale(1.1); }
        .pagination-btn.active { background:#000 !important; color:#fff !important; }
        .sale-badge { animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{ transform:scale(1);} 50%{ transform:scale(1.05);} }
      `}</style>

      <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
        {/* Category Bar */}
        <div style={{
          backgroundColor: '#000000',
          padding: '1.5rem 2rem',
          borderBottom: '1px solid #e5e7eb',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '2rem'
          }}>
            {/* Category Buttons */}
            <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`category-btn ${selectedCategory === cat.id || (!selectedCategory && cat.id === 'ALL') ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(cat.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: selectedCategory === cat.id || (!selectedCategory && cat.id === 'ALL') ? '#ffffff' : '#a0a0a0',
                    fontSize: '0.95rem',
                    fontWeight: selectedCategory === cat.id || (!selectedCategory && cat.id === 'ALL') ? 700 : 500,
                    cursor: 'pointer',
                    padding: '0.5rem 0',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sort Button */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  border: '2px solid #ffffff',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  letterSpacing: '0.05em',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#f3f4f6' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff' }}
              >
                SẮP XẾP <span style={{ fontSize: '0.75rem' }}>▼</span>
              </button>

              {showSortDropdown && (
                <div className="dropdown show" style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '0.5rem',
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                  padding: '0.5rem 0',
                  minWidth: '220px',
                  zIndex: 1000
                }}>
                  {sortOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleSortChange(option)}
                      style={{
                        width: '100%',
                        padding: '0.875rem 1.25rem',
                        border: 'none',
                        background: sortBy === option ? '#f9fafb' : 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        color: sortBy === option ? '#000000' : '#374151',
                        fontWeight: sortBy === option ? 600 : 400,
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => { if (sortBy !== option) e.currentTarget.style.background = '#f9fafb' }}
                      onMouseLeave={(e) => { if (sortBy !== option) e.currentTarget.style.background = 'none' }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 2rem' }}>
          {/* Header */}
          <div style={{ marginBottom: '3rem', textAlign: 'center', animation: 'fadeInUp 0.6s ease-out' }}>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: 900,
              color: '#000000',
              marginBottom: '1rem',
              letterSpacing: '-0.02em',
              textTransform: 'uppercase'
            }}>
              {searchQuery ? `"${searchQuery}"` : selectedCategory === 'ALL' || !selectedCategory ? 'TẤT CẢ SẢN PHẨM' : selectedCategory}
            </h1>
            <p style={{ color: '#6b7280', fontSize: '1.125rem', fontWeight: 400 }}>
              {loading ? 'Đang tải…' : `${sortedProducts.length} sản phẩm`}
            </p>
          </div>

          {/* Grid */}
          <div
  ref={sectionRef}
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 400px))',
    justifyContent: 'center', // 👈 căn giữa nếu ít phần tử
    gap: '2rem',
    marginBottom: '4rem',
    opacity: isVisible ? 1 : 0,
    animation: isVisible ? 'fadeInUp 0.8s ease-out' : 'none'
  }}
>
            {!loading && sortedProducts.map((product, index) => (
              <div
                key={product.id}
                className="product-card"
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '1.5rem',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #f3f4f6',
                  animationDelay: `${index * 0.1}s`,
                  cursor: 'pointer'
                }}
               onClick={() => onNavigate?.('product-detail', { id: String(product.id) })}
              >
                {/* Image */}
                <div style={{ height: '280px', backgroundColor: '#f9fafb', position: 'relative', overflow: 'hidden' }}>
                  {product.sale && (
                    <div className="sale-badge" style={{
                      position: 'absolute', top: '1rem', right: '1rem',
                      background: '#000000', color: '#ffffff',
                      padding: '0.5rem 1rem', borderRadius: '2rem',
                      fontSize: '0.75rem', fontWeight: 700, zIndex: 2, letterSpacing: '0.05em'
                    }}>
                      ƯU ĐÃI
                    </div>
                  )}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Info */}
                <div style={{ padding: '1.75rem', position: 'relative' }}>
                  <h3 style={{
                    fontSize: '1.05rem', fontWeight: 600, color: '#000000',
                    marginBottom: '0.75rem', lineHeight: 1.5, minHeight: '3rem'
                  }}>
                    {product.name}
                  </h3>

                  <p style={{
                    fontSize: '1.5rem', fontWeight: 900, color: '#000000',
                    marginBottom: '1rem', letterSpacing: '-0.01em'
                  }}>
                    {product.price.toLocaleString('vi-VN')} VNĐ
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', gap: '0.125rem' }}>
                      {[...Array(5)].map((_, i) => (<Star key={i} fill="#000000" stroke="#000000" size={14} />))}
                    </div>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>
                      ({product.reviews})
                    </span>
                  </div>

                  <button
                    className="add-to-cart-btn"
                    onClick={(e) => { e.stopPropagation(); handleAddToCart(product.id) }}
                    style={{
                      position: 'absolute', bottom: '1.75rem', right: '1.75rem',
                      width: '48px', height: '48px', borderRadius: '50%',
                      backgroundColor: '#000000', border: 'none', color: '#ffffff',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <ShoppingCart size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination (client-side mẫu) */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginTop: '4rem' }}>
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              style={{
                width: '45px', height: '45px', borderRadius: '0.75rem',
                border: '2px solid #000000', backgroundColor: 'white', color: '#000000',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: currentPage === 1 ? 0.3 : 1, fontWeight: 700, fontSize: '1.25rem'
              }}
            >‹</button>

            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
                style={{
                  width: '45px', height: '45px', borderRadius: '0.75rem',
                  border: '2px solid #000000',
                  backgroundColor: currentPage === page ? '#000000' : 'white',
                  color: currentPage === page ? 'white' : '#000000',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '1rem'
                }}
              >
                {page}
              </button>
            ))}

            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(Math.min(3, currentPage + 1))}
              disabled={currentPage === 3}
              style={{
                width: '45px', height: '45px', borderRadius: '0.75rem',
                border: '2px solid #000000', backgroundColor: 'white', color: '#000000',
                cursor: currentPage === 3 ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: currentPage === 3 ? 0.3 : 1, fontWeight: 700, fontSize: '1.25rem'
              }}
            >›</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Search
