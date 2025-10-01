import { useState, useEffect, useRef } from 'react'
import { ShoppingCart, Star } from 'lucide-react'
import type { PageKey } from '../types/navigation'

interface SearchProps {
  onNavigate?: (page: PageKey) => void;
  searchQuery?: string;
  category?: string;
}

const Search = ({ onNavigate, searchQuery = '', category = '' }: SearchProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState(category)
  const [sortBy, setSortBy] = useState('default')
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  const allProducts = [
    { id: 1, name: 'Vòng Tay Bạc 925 Nữ Đính 2 Viên Đá', price: 450000, rating: 5, reviews: 4, image: '/item/Vòng Tay Bạc 925 Nữ Đính 2 Viên Đá.jpg', category: 'VÒNG TAY' },
    { id: 2, name: 'Dây Chuyền Bạc Nữ 2 Hạt Đá', price: 380000, rating: 5, reviews: 0, image: '/item/Dây Chuyền Bạc Nữ 2 Hạt Đá.jpg', category: 'VÒNG CỔ' },
    { id: 3, name: 'Vòng Tay Đá Thô', price: 250000, rating: 5, reviews: 1, image: '/item/Vòng Tay Đá Thô.jpg', category: 'ĐÁ' },
    { id: 4, name: 'Dây Chuyền Bạc Nữ 925', price: 320000, rating: 5, reviews: 2, image: '/item/Dây Chuyền Bạc Nữ 925.jpg', category: 'VÒNG CỔ' },
    { id: 5, name: 'Vòng Tay Chuỗi Hạt 108 Đá Phong Thuỷ Tự Nhiên', price: 180000, rating: 5, reviews: 3, image: '/item/Vòng Tay Chuỗi Hạt 108 Đá Phong Thuỷ Tự Nhiên.jpg', category: 'VÒNG TAY', sale: true },
    { id: 6, name: 'Vòng Tay Chỉ Đỏ Đính Đá Handmade Lu Thống', price: 120000, rating: 5, reviews: 1, image: '/item/Vòng Tay Chỉ Đỏ Đính Đá Handmade Lu Thống.jpg', category: 'VÒNG TAY', sale: true },
    { id: 7, name: 'Vòng Tay Đá Mài Giác Cho Nữ', price: 200000, rating: 5, reviews: 0, image: '/item/Vòng Tay Đá Mài Giác Cho Nữ.jpg', category: 'ĐÁ' },
    { id: 8, name: 'Lắc Tay Bạc Nữ 925 Đính 5 Hạt Đá', price: 520000, rating: 5, reviews: 4, image: '/item/Lắc Tay Bạc Nữ 925 Đính 5 Hạt Đá.jpg', category: 'VÒNG TAY' },
    { id: 9, name: 'Vòng Tay Đá Thô Full Of Energy', price: 280000, rating: 5, reviews: 0, image: '/item/Vòng Tay Đá Thô Full Of Energy .jpg', category: 'ĐÁ', sale: true },
    { id: 10, name: 'Vòng Tay Bạc Nữ Liugems Kết Hợp Hạt Đá Phong Thuỷ', price: 650000, rating: 5, reviews: 1, image: '/item/Vòng Tay Bạc Nữ Liugems Kết Hợp Hạt Đá Phong Thuỷ Handmade Mix Charm Bi Mini Size.jpg', category: 'VÒNG TAY' },
    { id: 11, name: 'Vòng Cổ 1 Hạt', price: 150000, rating: 5, reviews: 2, image: '/item/vongco1hat.jpg', category: 'VÒNG CỔ' },
    { id: 12, name: 'Vòng Cổ 3 Hạt', price: 220000, rating: 5, reviews: 3, image: '/item/vongco3hat.jpg', category: 'VÒNG CỔ' },
    { id: 13, name: 'Vòng Tay Ngôi Sao', price: 190000, rating: 5, reviews: 1, image: '/item/vongtayngoisao.jpg', category: 'VÒNG TAY' }
  ]

  const categories = [
    { id: 'ALL', label: 'TẤT CẢ' },
    { id: 'VÒNG TAY', label: 'VÒNG TAY' },
    { id: 'VÒNG CỔ', label: 'VÒNG CỔ' },
    { id: 'ĐÁ', label: 'ĐÁ' },
    { id: 'ƯU ĐÃI', label: 'ƯU ĐÃI' }
  ]

  const sortOptions = ['Mặc định', 'Giá tăng dần', 'Giá giảm dần', 'Đánh giá cao nhất', 'Mới nhất']

  const filteredProducts = selectedCategory === 'ALL' || !selectedCategory
    ? allProducts
    : selectedCategory === 'ƯU ĐÃI'
    ? allProducts.filter(p => p.sale)
    : allProducts.filter(p => p.category === selectedCategory)

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'Giá tăng dần') return a.price - b.price
    if (sortBy === 'Giá giảm dần') return b.price - a.price
    if (sortBy === 'Đánh giá cao nhất') return b.reviews - a.reviews
    return 0
  })

  const handleAddToCart = (productId: number) => {
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
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideInDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .product-card {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
          }

          .product-card:hover {
            transform: translateY(-12px);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
          }

          .product-image {
            transition: transform 0.5s ease;
          }

          .product-card:hover .product-image {
            transform: scale(1.1);
          }

          .add-to-cart-btn {
            transition: all 0.3s ease;
          }

          .add-to-cart-btn:hover {
            background: #000000 !important;
            transform: scale(1.15);
          }

          .category-btn {
            transition: all 0.3s ease;
            position: relative;
          }

          .category-btn::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 50%;
            width: 0;
            height: 3px;
            background: #000000;
            transform: translateX(-50%);
            transition: width 0.3s ease;
          }

          .category-btn.active::after {
            width: 80%;
          }

          .category-btn:hover {
            transform: translateY(-2px);
          }

          .dropdown {
            transition: all 0.3s ease;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
          }

          .dropdown.show {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
          }

          .pagination-btn {
            transition: all 0.3s ease;
          }

          .pagination-btn:hover:not(:disabled) {
            background: #f3f4f6 !important;
            transform: scale(1.1);
          }

          .pagination-btn.active {
            background: #000000 !important;
            color: white !important;
          }

          .sale-badge {
            animation: pulse 2s ease-in-out infinite;
          }

          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }
        `}
      </style>

      <div style={{ 
        minHeight: '100vh',
        backgroundColor: '#ffffff'
      }}>
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
            <div style={{ 
              display: 'flex', 
              gap: '2.5rem', 
              alignItems: 'center',
              flex: 1,
              justifyContent: 'center'
            }}>
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
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f3f4f6'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ffffff'
                }}
              >
                SẮP XẾP
                <span style={{ fontSize: '0.75rem' }}>▼</span>
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
                      onMouseEnter={(e) => {
                        if (sortBy !== option) e.currentTarget.style.background = '#f9fafb'
                      }}
                      onMouseLeave={(e) => {
                        if (sortBy !== option) e.currentTarget.style.background = 'none'
                      }}
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
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '3rem 2rem'
        }}>
          {/* Search Results Header */}
          <div style={{
            marginBottom: '3rem',
            textAlign: 'center',
            animation: 'fadeInUp 0.6s ease-out'
          }}>
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
            <p style={{
              color: '#6b7280',
              fontSize: '1.125rem',
              fontWeight: 400
            }}>
              {sortedProducts.length} sản phẩm
            </p>
          </div>

          {/* Product Grid */}
          <div ref={sectionRef} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem',
            opacity: isVisible ? 1 : 0,
            animation: isVisible ? 'fadeInUp 0.8s ease-out' : 'none'
          }}>
            {sortedProducts.map((product, index) => (
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
                  onClick={() => onNavigate?.('product-detail')}
                >
                {/* Product Image */}
                <div style={{
                  height: '280px',
                  backgroundColor: '#f9fafb',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {product.sale && (
                    <div className="sale-badge" style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: '#000000',
                      color: '#ffffff',
                      padding: '0.5rem 1rem',
                      borderRadius: '2rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      zIndex: 2,
                      letterSpacing: '0.05em'
                    }}>
                      ƯU ĐÃI
                    </div>
                  )}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>

                {/* Product Info */}
                <div style={{
                  padding: '1.75rem',
                  position: 'relative'
                }}>
                  <h3 style={{
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    color: '#000000',
                    marginBottom: '0.75rem',
                    lineHeight: 1.5,
                    minHeight: '3rem'
                  }}>
                    {product.name}
                  </h3>
                  
                  <p style={{
                    fontSize: '1.5rem',
                    fontWeight: 900,
                    color: '#000000',
                    marginBottom: '1rem',
                    letterSpacing: '-0.01em'
                  }}>
                    {product.price.toLocaleString('vi-VN')} VNĐ
                  </p>

                  {/* Rating */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1.25rem'
                  }}>
                    <div style={{ display: 'flex', gap: '0.125rem' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} fill="#000000" stroke="#000000" size={14} />
                      ))}
                    </div>
                    <span style={{
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      fontWeight: 500
                    }}>
                      ({product.reviews})
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product.id)}
                    style={{
                      position: 'absolute',
                      bottom: '1.75rem',
                      right: '1.75rem',
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: '#000000',
                      border: 'none',
                      color: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <ShoppingCart size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.75rem',
            marginTop: '4rem'
          }}>
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              style={{
                width: '45px',
                height: '45px',
                borderRadius: '0.75rem',
                border: '2px solid #000000',
                backgroundColor: 'white',
                color: '#000000',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: currentPage === 1 ? 0.3 : 1,
                fontWeight: 700,
                fontSize: '1.25rem'
              }}
            >
              ‹
            </button>
            
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
                style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '0.75rem',
                  border: '2px solid #000000',
                  backgroundColor: currentPage === page ? '#000000' : 'white',
                  color: currentPage === page ? 'white' : '#000000',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1rem'
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
                width: '45px',
                height: '45px',
                borderRadius: '0.75rem',
                border: '2px solid #000000',
                backgroundColor: 'white',
                color: '#000000',
                cursor: currentPage === 3 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: currentPage === 3 ? 0.3 : 1,
                fontWeight: 700,
                fontSize: '1.25rem'
              }}
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Search