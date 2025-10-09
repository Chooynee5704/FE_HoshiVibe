import { useState, useEffect, useRef } from 'react'
import { Check } from 'lucide-react'

const Membership = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')
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

  const handleSelectPlan = (planType: 'free' | 'pro') => {
    console.log(`Selected ${planType} plan`)
  }

  return (
    <>
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          @keyframes shimmer {
            0% {
              background-position: -1000px 0;
            }
            100% {
              background-position: 1000px 0;
            }
          }

          .membership-card {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
          }

          .membership-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.75) 100%);
            z-index: 1;
            transition: opacity 0.4s ease;
          }

          .membership-card:hover::before {
            opacity: 0.7;
          }

          .membership-card:hover {
            transform: translateY(-12px) scale(1.02);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          }

          .card-content {
            position: relative;
            z-index: 2;
          }

          .membership-button {
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            font-weight: 700;
          }

          .membership-button::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(0,0,0,0.1);
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
          }

          .membership-button:hover::before {
            width: 300px;
            height: 300px;
          }

          .membership-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          }

          .membership-button:active {
            transform: translateY(-1px);
          }

          .tab-button {
            transition: all 0.3s ease;
            position: relative;
          }

          .tab-button::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            width: 0;
            height: 2px;
            background: #000000;
            transform: translateX(-50%);
            transition: width 0.3s ease;
          }

          .tab-button.active::after {
            width: 80%;
          }

          .tab-button:hover:not(.active) {
            background: rgba(0, 0, 0, 0.05);
          }

          .feature-item {
            transition: all 0.3s ease;
            position: relative;
            padding-left: 0;
          }

          .feature-item:hover {
            transform: translateX(8px);
            padding-left: 5px;
          }

          .special-feature {
            background: linear-gradient(90deg, #000000, #374151);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .special-feature:hover {
            filter: brightness(0.7);
          }

          .popular-badge {
            animation: float 3s ease-in-out infinite;
            box-shadow: 0 5px 15px rgba(251, 191, 36, 0.4);
          }

          .gradient-text {
            background: linear-gradient(135deg, #000000 0%, #374151 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .card-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            z-index: 0;
          }

          .price-highlight {
            position: relative;
            display: inline-block;
          }

          .price-highlight::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 100%;
            height: 3px;
            background: linear-gradient(90deg, transparent, #000000, transparent);
            animation: shimmer 2s infinite;
          }

          @media (max-width: 768px) {
            .membership-card {
              margin-bottom: 2rem;
            }
          }
        `}
      </style>

      <div style={{ 
        minHeight: '100vh',
        background: '#ffffff',
        position: 'relative'
      }}>
        {/* Animated Background Elements */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          zIndex: 0,
          opacity: 0.05
        }}>
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,0,0,0.1) 0%, transparent 70%)',
            filter: 'blur(40px)',
            animation: 'float 8s ease-in-out infinite'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '10%',
            right: '10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,0,0,0.1) 0%, transparent 70%)',
            filter: 'blur(40px)',
            animation: 'float 10s ease-in-out infinite reverse'
          }} />
        </div>

        {/* Main Content */}
        <div style={{
          padding: '4rem 2rem',
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Header Section */}
          <div style={{
            textAlign: 'center',
            marginBottom: '4rem',
            opacity: isVisible ? 1 : 0,
            animation: isVisible ? 'fadeInUp 1s ease-out' : 'none'
          }}>
            <h1 className="gradient-text" style={{
              fontSize: '3.5rem',
              fontWeight: 900,
              marginBottom: '1rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              NÂNG CẤP GÓI THÀNH VIÊN
            </h1>
            
            <p style={{
              fontSize: '1.125rem',
              color: '#6b7280',
              marginBottom: '2rem',
              fontWeight: 300
            }}>
              Chọn gói phù hợp với nhu cầu của bạn
            </p>

            {/* Tab Button */}
            <button
              className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveTab('personal')}
              style={{
                padding: '0.75rem 2rem',
                borderRadius: '2rem',
                border: '2px solid #000000',
                backgroundColor: activeTab === 'personal' ? '#000000' : 'transparent',
                color: activeTab === 'personal' ? '#ffffff' : '#000000',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}
            >
              Cá nhân
            </button>
          </div>

          {/* Membership Cards */}
          <div ref={sectionRef} style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '2.5rem',
            maxWidth: '1000px',
            margin: '0 auto',
            justifyContent: 'center',
            alignItems: 'stretch'
          }}>
            {/* Free Plan Card */}
            <div 
              className={`membership-card ${isVisible ? 'animate' : ''}`}
              style={{
                background: '#000000',
                borderRadius: '1.5rem',
                padding: '0',
                border: '2px solid #e5e7eb',
                animation: isVisible ? 'slideInLeft 0.8s ease-out' : 'none',
                animationDelay: '0.2s',
                animationFillMode: 'both',
                minHeight: '550px',
                flex: '0 0 400px'
              }}
            >
              <img 
                src="/service/mienphi.jpg" 
                alt="Free Plan"
                className="card-image"
              />
              
              <div className="card-content" style={{ padding: '2.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Plan Title */}
                <h3 style={{
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  marginBottom: '1rem',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Miễn phí
                </h3>

                {/* Price */}
                <div style={{
                  textAlign: 'center',
                  marginBottom: '2.5rem'
                }}>
                  <span className="price-highlight" style={{
                    fontSize: '3.5rem',
                    fontWeight: 900,
                    color: '#ffffff'
                  }}>
                    0 VNĐ
                  </span>
                </div>

                {/* Features */}
                <div style={{ marginBottom: '2.5rem', flex: 1 }}>
                  <div className="feature-item" style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    marginBottom: '1.25rem',
                    padding: '0.5rem 0'
                  }}>
                    <Check style={{
                      color: '#10b981',
                      width: '24px',
                      height: '24px',
                      marginRight: '1rem',
                      flexShrink: 0,
                      marginTop: '2px'
                    }} />
                    <span style={{
                      fontSize: '1rem',
                      color: '#e5e7eb',
                      lineHeight: '1.6'
                    }}>
                      Tùy chỉnh vòng cơ bản
                    </span>
                  </div>

                  <div className="feature-item" style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    marginBottom: '1.25rem',
                    padding: '0.5rem 0'
                  }}>
                    <Check style={{
                      color: '#10b981',
                      width: '24px',
                      height: '24px',
                      marginRight: '1rem',
                      flexShrink: 0,
                      marginTop: '2px'
                    }} />
                    <span style={{
                      fontSize: '1rem',
                      color: '#e5e7eb',
                      lineHeight: '1.6'
                    }}>
                      Cá nhân hóa theo ngày sinh, mệnh, mục tiêu
                    </span>
                  </div>
                </div>

                {/* Button */}
                <button
                  onClick={() => handleSelectPlan('free')}
                  className="membership-button"
                  style={{
                    width: '100%',
                    padding: '1.25rem',
                    borderRadius: '0.75rem',
                    border: '2px solid #000000',
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                  }}
                >
                  DÙNG MIỄN PHÍ
                </button>
              </div>
            </div>

            {/* Pro Plan Card */}
            <div 
              className={`membership-card ${isVisible ? 'animate' : ''}`}
              style={{
                background: '#000000',
                borderRadius: '1.5rem',
                padding: '0',
                border: '2px solid #fbbf24',
                animation: isVisible ? 'slideInRight 0.8s ease-out' : 'none',
                animationDelay: '0.4s',
                animationFillMode: 'both',
                position: 'relative',
                minHeight: '550px',
                flex: '0 0 400px'
              }}
            >
              <img 
                src="/service/pro.jpg" 
                alt="Pro Plan"
                className="card-image"
              />

              {/* Popular Badge */}
              <div className="popular-badge" style={{
                position: 'absolute',
                top: '1rem',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                color: '#000000',
                padding: '0.5rem 1.5rem',
                borderRadius: '2rem',
                fontSize: '0.75rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                zIndex: 3
              }}>
                ⭐ Phổ biến
              </div>

              <div className="card-content" style={{ padding: '2.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Plan Title */}
                <h3 style={{
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  marginBottom: '1rem',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginTop: '2rem'
                }}>
                  Pro
                </h3>

                {/* Price */}
                <div style={{
                  textAlign: 'center',
                  marginBottom: '2.5rem'
                }}>
                  <span className="price-highlight" style={{
                    fontSize: '3.5rem',
                    fontWeight: 900,
                    color: '#ffffff'
                  }}>
                    200K VNĐ
                  </span>
                </div>

                {/* Features */}
                <div style={{ marginBottom: '2.5rem', flex: 1 }}>
                  <div className="feature-item" style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    marginBottom: '1.25rem',
                    padding: '0.5rem 0'
                  }}>
                    <Check style={{
                      color: '#fbbf24',
                      width: '24px',
                      height: '24px',
                      marginRight: '1rem',
                      flexShrink: 0,
                      marginTop: '2px'
                    }} />
                    <span style={{
                      fontSize: '1rem',
                      color: '#e5e7eb',
                      lineHeight: '1.6'
                    }}>
                      Tùy chỉnh vòng cơ bản
                    </span>
                  </div>

                  <div className="feature-item" style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    marginBottom: '1.25rem',
                    padding: '0.5rem 0'
                  }}>
                    <Check style={{
                      color: '#fbbf24',
                      width: '24px',
                      height: '24px',
                      marginRight: '1rem',
                      flexShrink: 0,
                      marginTop: '2px'
                    }} />
                    <span style={{
                      fontSize: '1rem',
                      color: '#e5e7eb',
                      lineHeight: '1.6'
                    }}>
                      Cá nhân hóa theo ngày sinh, mệnh, mục tiêu
                    </span>
                  </div>

                  <div className="feature-item" style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    marginBottom: '1.25rem',
                    padding: '0.5rem 0'
                  }}>
                    <Check style={{
                      color: '#fbbf24',
                      width: '24px',
                      height: '24px',
                      marginRight: '1rem',
                      flexShrink: 0,
                      marginTop: '2px'
                    }} />
                    <span 
                      className="special-feature"
                      style={{
                        fontSize: '1rem',
                        lineHeight: '1.6',
                        background: 'linear-gradient(90deg, #fbbf24, #ffffff)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}
                      onClick={() => console.log('Special feature clicked')}
                    >
                      Mở khóa charm riêng
                    </span>
                  </div>

                  <div className="feature-item" style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    marginBottom: '1.25rem',
                    padding: '0.5rem 0'
                  }}>
                    <Check style={{
                      color: '#fbbf24',
                      width: '24px',
                      height: '24px',
                      marginRight: '1rem',
                      flexShrink: 0,
                      marginTop: '2px'
                    }} />
                    <span style={{
                      fontSize: '1rem',
                      color: '#e5e7eb',
                      lineHeight: '1.6'
                    }}>
                      Thông điệp năng lượng mỗi ngày
                    </span>
                  </div>

                  <div className="feature-item" style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    marginBottom: '1.25rem',
                    padding: '0.5rem 0'
                  }}>
                    <Check style={{
                      color: '#fbbf24',
                      width: '24px',
                      height: '24px',
                      marginRight: '1rem',
                      flexShrink: 0,
                      marginTop: '2px'
                    }} />
                    <span style={{
                      fontSize: '1rem',
                      color: '#e5e7eb',
                      lineHeight: '1.6'
                    }}>
                      Ưu đãi giảm giá đặc biệt
                    </span>
                  </div>
                </div>

                {/* Button */}
                <button
                  onClick={() => handleSelectPlan('pro')}
                  className="membership-button"
                  style={{
                    width: '100%',
                    padding: '1.25rem',
                    borderRadius: '0.75rem',
                    border: 'none',
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    color: '#000000',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                  }}
                >
                  NÂNG CẤP PRO
                </button>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div style={{
            textAlign: 'center',
            marginTop: '4rem',
            padding: '2.5rem',
            background: '#f9fafb',
            borderRadius: '1.5rem',
            border: '1px solid #e5e7eb',
            opacity: isVisible ? 1 : 0,
            animation: isVisible ? 'fadeInUp 1s ease-out 0.6s both' : 'none'
          }}>
            <p style={{
              fontSize: '1.125rem',
              color: '#6b7280',
              lineHeight: '1.8',
              maxWidth: '700px',
              margin: '0 auto',
              fontWeight: 300
            }}>
              Tất cả các gói đều bao gồm hỗ trợ khách hàng 24/7 và bảo hành trọn đời. 
              Bạn có thể nâng cấp hoặc hạ cấp gói bất kỳ lúc nào.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Membership