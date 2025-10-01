import type { CSSProperties } from 'react'
import { useState, useEffect, useRef } from 'react'

const FengShuiConsultation = () => {
  const [hoveredService, setHoveredService] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

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

  const sectionStyle: CSSProperties = {
    backgroundColor: '#ffffff',
    padding: '5rem 2rem',
    position: 'relative'
  }

  const container: CSSProperties = {
    maxWidth: '1400px',
    margin: '0 auto'
  }

  const headerStyle: CSSProperties = {
    textAlign: 'center',
    marginBottom: '4rem'
  }

  const titleStyle: CSSProperties = {
    fontSize: '3rem',
    fontWeight: 900,
    color: '#000000',
    letterSpacing: '-0.02em',
    marginBottom: '1rem',
    textTransform: 'uppercase'
  }

  const subtitleStyle: CSSProperties = {
    fontSize: '1.125rem',
    color: '#666666',
    maxWidth: '700px',
    margin: '0 auto',
    lineHeight: '1.8'
  }

  const servicesGrid: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '2rem',
    marginBottom: '4rem'
  }

  const serviceCard: CSSProperties = {
    background: '#ffffff',
    border: '1px solid #e5e5e5',
    padding: '2.5rem',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden'
  }

  const iconWrapStyle: CSSProperties = {
    width: '80px',
    height: '80px',
    background: '#000000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',
    transition: 'all 0.4s ease'
  }

  const serviceTitleStyle: CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#000000',
    marginBottom: '1rem',
    letterSpacing: '0.02em',
    textTransform: 'uppercase'
  }

  const serviceDescStyle: CSSProperties = {
    fontSize: '0.95rem',
    color: '#666666',
    lineHeight: '1.8',
    marginBottom: '1.5rem'
  }

  const featureList: CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0
  }

  const featureItem: CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    marginBottom: '0.75rem',
    fontSize: '0.9rem',
    color: '#333333'
  }

  const ctaSection: CSSProperties = {
    background: '#000000',
    padding: '4rem 3rem',
    textAlign: 'center',
    position: 'relative'
  }

  const ctaTitleStyle: CSSProperties = {
    fontSize: '2.5rem',
    fontWeight: 900,
    color: '#ffffff',
    marginBottom: '1.5rem',
    letterSpacing: '-0.01em'
  }

  const ctaDescStyle: CSSProperties = {
    fontSize: '1.125rem',
    color: '#cccccc',
    marginBottom: '2.5rem',
    maxWidth: '600px',
    margin: '0 auto 2.5rem'
  }

  const buttonStyle: CSSProperties = {
    background: '#ffffff',
    color: '#000000',
    border: 'none',
    padding: '1rem 3rem',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    letterSpacing: '0.05em',
    textTransform: 'uppercase'
  }

  const services = [
    {
      id: 1,
      icon: '☯',
      title: 'Tư Vấn Mệnh',
      description: 'Phân tích ngũ hành, mệnh số để tìm ra đá phong thủy phù hợp nhất với bạn',
      features: [
        'Xác định ngũ hành cá nhân',
        'Chọn màu sắc đá hợp mệnh',
        'Tư vấn hướng đeo và cách bảo quản',
        'Phân tích năng lượng đá phù hợp'
      ]
    },
    {
      id: 2,
      icon: '🔮',
      title: 'Chọn Đá Theo Tuổi',
      description: 'Tư vấn chuyên sâu về loại đá phù hợp với năm sinh và tuổi của bạn',
      features: [
        'Đá phong thủy theo 12 con giáp',
        'Màu sắc và hình dạng hợp tuổi',
        'Tránh đá xung khắc với tuổi',
        'Tăng cường vận may theo tuổi'
      ]
    },
    {
      id: 3,
      icon: '💎',
      title: 'Thiết Kế Riêng',
      description: 'Thiết kế trang sức đá phong thủy độc đáo theo yêu cầu và mệnh của bạn',
      features: [
        'Tư vấn phối hợp nhiều loại đá',
        'Thiết kế theo phong cách cá nhân',
        'Chọn kim loại hợp mệnh',
        'Tạo sản phẩm độc nhất vô nhị'
      ]
    },
    {
      id: 4,
      icon: '✨',
      title: 'Kích Hoạt Năng Lượng',
      description: 'Hướng dẫn cách kích hoạt và tăng cường năng lượng đá phong thủy',
      features: [
        'Nghi thức kích hoạt đá mới',
        'Làm sạch năng lượng tiêu cực',
        'Sạc năng lượng dương định kỳ',
        'Bảo quản đá đúng cách'
      ]
    }
  ]

  return (
    <section ref={sectionRef} style={sectionStyle}>
      <div style={container}>
        <div className={isVisible ? 'animate-on-scroll animate' : 'animate-on-scroll'} style={headerStyle}>
          <h2 
            className={isVisible ? 'animate-fade-in-up delay-100' : ''}
            style={{
              ...titleStyle,
              opacity: isVisible ? 1 : 0
            }}
          >
            Tư Vấn Phong Thủy
          </h2>
          <p 
            className={isVisible ? 'animate-fade-in-up delay-200' : ''}
            style={{
              ...subtitleStyle,
              opacity: isVisible ? 1 : 0
            }}
          >
            Chúng tôi cung cấp dịch vụ tư vấn phong thủy chuyên sâu, giúp bạn chọn lựa đá phong thủy phù hợp với mệnh, 
            tuổi và mục đích sử dụng. Mỗi viên đá đều mang năng lượng riêng biệt, 
            hãy để chúng tôi giúp bạn tìm ra viên đá định mệnh của mình.
          </p>
        </div>

        <div className={`stagger-animation ${isVisible ? 'animate' : ''}`} style={servicesGrid}>
          {services.map((service) => {
            const isHovered = hoveredService === service.id
            return (
              <div
                key={service.id}
                className="enhanced-card"
                style={{
                  ...serviceCard,
                  borderColor: isHovered ? '#000000' : '#e5e5e5',
                  transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                  boxShadow: isHovered
                    ? '0 20px 40px rgba(0,0,0,0.12)'
                    : '0 4px 12px rgba(0,0,0,0.05)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
              >
                <div
                  style={{
                    ...iconWrapStyle,
                    background: '#f5f5f5',
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                  <span
                    style={{
                      fontSize: '2.5rem'
                    }}
                  >
                    {service.icon}
                  </span>
                </div>

                <h3 style={serviceTitleStyle}>{service.title}</h3>
                <p style={serviceDescStyle}>{service.description}</p>

                <ul style={featureList}>
                  {service.features.map((feature, idx) => (
                    <li key={idx} style={featureItem}>
                      <span style={{ color: '#000000', fontWeight: 700 }}>▸</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        <div className={isVisible ? 'animate-on-scroll animate' : 'animate-on-scroll'} style={ctaSection}>
          <h3 
            className={isVisible ? 'animate-fade-in-up delay-400' : ''}
            style={{
              ...ctaTitleStyle,
              opacity: isVisible ? 1 : 0
            }}
          >
            Đặt Lịch Tư Vấn Miễn Phí
          </h3>
          <p 
            className={isVisible ? 'animate-fade-in-up delay-500' : ''}
            style={{
              ...ctaDescStyle,
              opacity: isVisible ? 1 : 0
            }}
          >
            Nhận tư vấn 1-1 từ chuyên gia phong thủy của chúng tôi. 
            Chúng tôi sẽ giúp bạn tìm ra viên đá hoàn hảo cho riêng mình.
          </p>
          <button
            className={`btn-primary ${isVisible ? 'animate-scale-in delay-600' : ''}`}
            style={{
              ...buttonStyle,
              opacity: isVisible ? 1 : 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f5f5f5'
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ffffff'
              e.currentTarget.style.transform = 'translateY(0) scale(1)'
            }}
          >
            Liên Hệ Ngay
          </button>
        </div>
      </div>
    </section>
  )
}

export default FengShuiConsultation