import { useState } from 'react'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'

const ProductCategories = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const categories = [
    {
      id: 1,
      name: 'VÒNG TAY',
      description: 'Bảo vệ và mang lại bình an',
      image: '/product_categories/vongtay.png',
      itemCount: '140+ sản phẩm',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    {
      id: 2,
      name: 'DÂY CHUYỀN',
      description: 'Phong cách hiện đại, ý nghĩa sâu sắc',
      image: '/product_categories/daychuyen.jpg',
      itemCount: '95+ sản phẩm',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      id: 3,
      name: 'NHẪN PHONG THỦY',
      description: 'Tăng cường năng lượng tích cực',
      image: '/product_categories/nhanphongthuy.png',
      itemCount: '85+ sản phẩm',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      id: 4,
      name: 'BÔNG TAI',
      description: 'Sắc đẹp toàn vẹnvẹn',
      image: '/product_categories/bongtai.png',
      itemCount: '25+ sản phẩm',
      gradient: 'linear-gradient(135deg,rgb(93, 150, 161) 0%,rgb(63, 146, 230) 100%)'
    },
    {
      id: 5,
      name: 'PHỤ KIỆN KHÁC',
      description: 'Đa dạng phong cách, cá tính riêng',
      image: '/product_categories/phukienkhac.png',
      itemCount: '200+ sản phẩm',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    }
  ]

  const itemsPerView = 4
  const maxSlide = Math.max(0, categories.length - itemsPerView)

  const nextSlide = () => {
    setCurrentSlide(prev => Math.min(prev + 1, maxSlide))
  }

  const prevSlide = () => {
    setCurrentSlide(prev => Math.max(prev - 1, 0))
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(Math.min(index, maxSlide))
  }

  return (
    <section style={{ 
      padding: '4rem 0', 
      backgroundColor: '#fafafa',
      position: 'relative'
    }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              color: '#111827',
              margin: 0
            }}>
              DANH MỤC SẢN PHẨM
            </h2>
          </div>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '1.125rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Khám phá bộ sưu tập đa dạng với thiết kế độc đáo, mang lại may mắn và phong thủy tốt
          </p>
        </div>

        {/* Carousel Container */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Navigation Buttons */}
          <button 
            onClick={prevSlide}
            disabled={currentSlide === 0}
            style={{ 
              position: 'absolute', 
              left: '-1rem', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              width: '3rem', 
              height: '3rem', 
              backgroundColor: 'white', 
              borderRadius: '50%', 
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: 'none',
              cursor: currentSlide === 0 ? 'not-allowed' : 'pointer',
              zIndex: 10,
              opacity: currentSlide === 0 ? 0.5 : 1,
              transition: 'all 0.3s ease'
            }}
          >
            <LeftOutlined style={{ color: '#374151', fontSize: '1.125rem' }} />
          </button>

          <button 
            onClick={nextSlide}
            disabled={currentSlide >= maxSlide}
            style={{ 
              position: 'absolute', 
              right: '-1rem', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              width: '3rem', 
              height: '3rem', 
              backgroundColor: 'white', 
              borderRadius: '50%', 
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: 'none',
              cursor: currentSlide >= maxSlide ? 'not-allowed' : 'pointer',
              zIndex: 10,
              opacity: currentSlide >= maxSlide ? 0.5 : 1,
              transition: 'all 0.3s ease'
            }}
          >
            <RightOutlined style={{ color: '#374151', fontSize: '1.125rem' }} />
          </button>

          {/* Categories Slider */}
          <div style={{
            display: 'flex',
            transform: `translateX(-${currentSlide * (100 / itemsPerView)}%)`,
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            gap: '1.5rem'
          }}>
            {categories.map((category) => (
              <div 
                key={category.id}
                style={{
                  minWidth: `calc((100% - ${(itemsPerView - 1) * 1.5}rem) / ${itemsPerView})`,
                  position: 'relative',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-0.5rem)'
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)'
                }}
              >
                {/* Background Image with Fallback */}
                <div style={{
                  height: '20rem',
                  background: category.gradient,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={category.image}
                    alt={category.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      opacity: 0.8
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to bottom, transparent 0%, transparent 60%, rgba(0, 0, 0, 0.8) 100%)'
                  }} />
                  
                  {/* Content */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '2rem 1.5rem',
                    color: 'white'
                  }}>
                    <h3 style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: 'bold', 
                      marginBottom: '0.5rem',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
                    }}>
                      {category.name}
                    </h3>
                    <p style={{ 
                      fontSize: '0.875rem', 
                      opacity: 0.9,
                      marginBottom: '1rem',
                      lineHeight: '1.4'
                    }}>
                      {category.description}
                    </p>
                    <div style={{
                      display: 'inline-block',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      padding: '0.375rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}>
                      {category.itemCount}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dot Indicators */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '0.75rem', 
          marginTop: '2rem' 
        }}>
          {Array.from({ length: maxSlide + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              style={{
                width: currentSlide === index ? '2rem' : '0.75rem',
                height: '0.75rem',
                borderRadius: '0.375rem',
                border: 'none',
                backgroundColor: currentSlide === index ? '#111827' : '#d1d5db',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button style={{
            backgroundColor: '#111827',
            color: 'white',
            padding: '1rem 2rem',
            borderRadius: '0.5rem',
            border: 'none',
            fontSize: '1.125rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#000000'
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.25)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#111827'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.15)'
          }}
          >
            XEM TẤT CẢ SẢN PHẨM
          </button>
        </div>
      </div>
    </section>
  )
}

export default ProductCategories