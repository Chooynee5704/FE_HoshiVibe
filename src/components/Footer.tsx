import { 
  PhoneOutlined, 
  MailOutlined, 
  EnvironmentOutlined,
  FacebookOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  TwitterOutlined,
  StarOutlined,
  ShopOutlined,
  CustomerServiceOutlined,
  SafetyOutlined
} from '@ant-design/icons'

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#111827', color: 'white', position: 'relative' }}>
      {/* Decorative top border */}
      <div style={{
        height: '4px',
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #43e97b 100%)'
      }} />
      
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
        {/* Main Footer Content */}
        <div style={{ 
          padding: '3rem 0 2rem 0',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem'
        }}>
          
          {/* Brand Section */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '0.75rem' }}>
              <img src="/images/logo.png" alt="Hoshi Vibe logo" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
              <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>HoshiVibe</span>
            </div>
            <p style={{ 
              color: '#9ca3af', 
              lineHeight: '1.6', 
              marginBottom: '1.5rem',
              fontSize: '0.95rem'
            }}>
              "Set your vibe, boost your fate" - Khám phá thế giới phong thủy hiện đại với những thiết kế độc đáo, 
              mang lại may mắn và năng lượng tích cực cho cuộc sống của bạn.
            </p>
            
            {/* Social Media */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              {[
                { icon: FacebookOutlined, color: '#1877f2' },
                { icon: InstagramOutlined, color: '#e4405f' },
                { icon: YoutubeOutlined, color: '#ff0000' },
                { icon: TwitterOutlined, color: '#1da1f2' }
              ].map(({ icon: Icon, color }, index) => (
                <a 
                  key={index}
                  href="#" 
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    backgroundColor: '#1f2937',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none',
                    border: '1px solid #374151'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = color
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = `0 4px 12px ${color}40`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#1f2937'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <Icon style={{ color: 'white', fontSize: '1.125rem' }} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ 
              color: 'white', 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <ShopOutlined style={{ color: 'white' }} />
              LIÊN KẾT NHANH
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                'Trang Chủ',
                'Sản Phẩm',
                'Tùy Chỉnh Thiết Kế',
                'Gói Thành Viên',
                'Giới Thiệu',
                'Liên Hệ'
              ].map((link, index) => (
                <li key={index} style={{ marginBottom: '0.75rem' }}>
                  <a 
                    href="#" 
                    style={{ 
                      color: '#9ca3af',
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      transition: 'color 0.3s ease',
                      display: 'inline-block',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#fbbf24'
                      e.currentTarget.style.paddingLeft = '0.5rem'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#9ca3af'
                      e.currentTarget.style.paddingLeft = '0'
                    }}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 style={{ 
              color: 'white', 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <StarOutlined style={{ color: 'white' }} />
              DANH MỤC SẢN PHẨM
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                'Vòng Tay Phong Thủy',
                'Dây Chuyền May Mắn',
                'Nhẫn Phong Thủy',
                'Phụ Kiện Khác',
                'Tùy Chỉnh Theo Yêu Cầu',
                'Sản Phẩm Mới'
              ].map((category, index) => (
                <li key={index} style={{ marginBottom: '0.75rem' }}>
                  <a 
                    href="#" 
                    style={{ 
                      color: '#9ca3af',
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      transition: 'color 0.3s ease',
                      display: 'inline-block'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#fbbf24'
                      e.currentTarget.style.paddingLeft = '0.5rem'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#9ca3af'
                      e.currentTarget.style.paddingLeft = '0'
                    }}
                  >
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 style={{ 
              color: 'white', 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <CustomerServiceOutlined style={{ color: 'white' }} />
              THÔNG TIN LIÊN HỆ
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '0.75rem', 
                marginBottom: '1rem',
                padding: '0.75rem',
                backgroundColor: '#1f2937',
                borderRadius: '0.5rem',
                border: '1px solid #374151'
              }}>
                <EnvironmentOutlined style={{ color: 'white', fontSize: '1.125rem', marginTop: '0.125rem' }} />
                <div>
                  <p style={{ color: '#e5e7eb', margin: 0, fontSize: '0.95rem', lineHeight: '1.4' }}>
                    123 Đường Phong Thủy, Quận 1<br />
                    TP. Hồ Chí Minh, Việt Nam
                  </p>
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                marginBottom: '1rem',
                padding: '0.75rem',
                backgroundColor: '#1f2937',
                borderRadius: '0.5rem',
                border: '1px solid #374151'
              }}>
                <PhoneOutlined style={{ color: 'white', fontSize: '1.125rem' }} />
                <a 
                  href="tel:+84123456789" 
                  style={{ 
                    color: '#e5e7eb', 
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fbbf24'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#e5e7eb'}
                >
                  +84 123 456 789
                </a>
              </div>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                padding: '0.75rem',
                backgroundColor: '#1f2937',
                borderRadius: '0.5rem',
                border: '1px solid #374151'
              }}>
                <MailOutlined style={{ color: 'white', fontSize: '1.125rem' }} />
                <a 
                  href="mailto:hoshivibe8386@gmail.com" 
                  style={{ 
                    color: '#e5e7eb', 
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fbbf24'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#e5e7eb'}
                >
                  hoshivibe8386@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div style={{
          padding: '2rem 0',
          borderTop: '1px solid #374151',
          borderBottom: '1px solid #374151'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-around', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            {[
              { icon: SafetyOutlined, text: 'BẢO HÀNH\n1 NĂM' },
              { icon: CustomerServiceOutlined, text: 'HỖ TRỢ 24/7' },
              { icon: ShopOutlined, text: 'GIAO HÀNG\nTOÀN QUỐC' },
              { icon: StarOutlined, text: 'CHẤT LƯỢNG\nCAM KẾT' }
            ].map(({ icon: Icon, text }, index) => (
              <div 
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1f2937'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <Icon style={{ 
                  fontSize: '2rem', 
                  color: 'white', 
                  marginBottom: '0.5rem' 
                }} />
                <span style={{ 
                  color: '#e5e7eb', 
                  fontSize: '0.75rem', 
                  fontWeight: '600',
                  whiteSpace: 'pre-line'
                }}>
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div style={{ 
          padding: '1.5rem 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
            © 2024 HoshiVibe. Tất cả quyền được bảo lưu.
          </div>
          
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {[
              'Chính Sách Bảo Mật',
              'Điều Khoản Dịch Vụ',
              'Chính Sách Đổi Trả'
            ].map((policy, index) => (
              <a 
                key={index}
                href="#" 
                style={{ 
                  color: '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#fbbf24'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
              >
                {policy}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer