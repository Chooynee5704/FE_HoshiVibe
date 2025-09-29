import { LeftOutlined, RightOutlined } from '@ant-design/icons'

const HeroSection = () => {
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
        backgroundRepeat: 'no-repeat'
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
        zIndex: 1
      }} />
      
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem', width: '100%', position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ 
            color: 'black', 
            marginBottom: '1.5rem', 
            fontSize: '1.125rem',
            textShadow: '1px 1px 2px rgba(255, 255, 255, 0.8)'
          }}>
            Chào mừng quý khách đến với Hoshi Vibe
          </p>
          <h1 style={{ 
            fontSize: 'clamp(2rem, 5vw, 4rem)', 
            fontWeight: 'bold', 
            color: 'black', 
            marginBottom: '2.5rem', 
            lineHeight: '1.2',
            textShadow: '2px 2px 4px rgba(255, 255, 255, 0.9)'
          }}>
&ldquo;Set your vibe, boost your fate&rdquo;
          </h1>
          <button className="btn-primary" style={{ 
            fontSize: '1.125rem', 
            padding: '1rem 2.5rem',
            color: 'white',
            backgroundColor: 'black',
            fontWeight: '600',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
          }}>
            KHÁM PHÁ NGAY
          </button>
        </div>
      </div>
      
      {/* Navigation arrows */}
      <button style={{ 
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
        zIndex: 3
      }}>
        <LeftOutlined style={{ color: '#6b7280' }} />
      </button>
      <button style={{ 
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
        zIndex: 3
      }}>
        <RightOutlined style={{ color: '#6b7280' }} />
      </button>
    </section>
  )
}

export default HeroSection
