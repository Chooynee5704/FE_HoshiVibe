import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section 
      className="hero-section" 
      style={{ 
        position: 'relative', 
        minHeight: '60vh', 
        display: 'flex', 
        alignItems: 'center',
        backgroundImage: 'url(/images/home_banner.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden'
      }}
    >
      {/* Vintage black vignette effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0, 0, 0, 0.3) 70%, rgba(0, 0, 0, 0.7) 100%)',
        zIndex: 1,
        animation: isVisible ? 'fadeInUp 1.2s ease-out' : 'none'
      }} />
      
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem', width: '100%', position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center' }}>
          <p 
            className={isVisible ? 'animate-fade-in-up delay-200' : ''}
            style={{ 
              color: 'black', 
              marginBottom: '1.5rem', 
              fontSize: '1.125rem',
              textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)',
              opacity: isVisible ? 1 : 0
            }}
          >
            Chào mừng quý khách đến với Hoshi Vibe
          </p>
          <h1 
            className={isVisible ? 'animate-fade-in-up delay-300' : ''}
            style={{ 
              fontSize: 'clamp(2rem, 5vw, 4rem)', 
              fontWeight: 'bold', 
              color: 'black', 
              marginBottom: '2.5rem', 
              lineHeight: '1.2',
              textShadow: '2px 2px 4px rgba(255, 255, 255, 0.9)',
              opacity: isVisible ? 1 : 0
            }}
          >
            &ldquo;Set your vibe, boost your fate&rdquo;
          </h1>
          <button 
            className={`btn-primary ${isVisible ? 'animate-scale-in delay-500' : ''}`}
            style={{ 
              fontSize: '1.125rem', 
              padding: '1rem 2.5rem',
              color: 'white',
              backgroundColor: 'black',
              fontWeight: '600',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
              opacity: isVisible ? 1 : 0
            }}
          >
            KHÁM PHÁ NGAY
          </button>
        </div>
      </div>
      
      {/* Navigation arrows */}
      <button 
        className={`${isVisible ? 'animate-fade-in-left delay-400' : ''} enhanced-card`}
        style={{ 
          position: 'absolute', 
          left: '1rem', 
          top: '50%', 
          transform: 'translateY(-50%)', 
          width: '3rem', 
          height: '3rem', 
          backgroundColor: 'white', 
          borderRadius: '50%', 
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          border: 'none',
          cursor: 'pointer',
          zIndex: 3,
          opacity: isVisible ? 1 : 0,
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)'
        }}
      >
        <LeftOutlined style={{ color: '#6b7280' }} />
      </button>
      <button 
        className={`${isVisible ? 'animate-fade-in-right delay-400' : ''} enhanced-card`}
        style={{ 
          position: 'absolute', 
          right: '1rem', 
          top: '50%', 
          transform: 'translateY(-50%)', 
          width: '3rem', 
          height: '3rem', 
          backgroundColor: 'white', 
          borderRadius: '50%', 
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          border: 'none',
          cursor: 'pointer',
          zIndex: 3,
          opacity: isVisible ? 1 : 0,
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)'
        }}
      >
        <RightOutlined style={{ color: '#6b7280' }} />
      </button>
    </section>
  )
}

export default HeroSection
