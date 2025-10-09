import { SearchOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'
import type { PageKey } from '../types/navigation'

interface HeaderProps {
  onNavigate?: (page: PageKey) => void;
  currentPage?: PageKey;
  cartCount?: number;
}

const Header = ({ onNavigate, currentPage = 'home', cartCount = 0 }: HeaderProps) => {
  const handleNavigation = (page: PageKey) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)', borderBottom: '1px solid #e5e7eb' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>
          {/* Logo */}
          <div 
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} 
            onClick={() => handleNavigation('home')}
          >
            <img 
              src="/images/logo.png" 
              alt="HoshiVibe Logo" 
              style={{ height: '2.5rem', width: 'auto', marginRight: '0.75rem' }}
              onError={(e) => {
                // Fallback to text logo if image fails to load
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'block';
              }}
            />
            <div style={{ 
              display: 'none', 
              alignItems: 'center'
            }}>
              <div style={{ backgroundColor: '#ccfbf1', borderRadius: '50%', padding: '0.5rem', marginRight: '0.75rem' }}>
                <div style={{ width: '2rem', height: '2rem', backgroundColor: '#14b8a6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.875rem' }}>H</span>
                </div>
              </div>
            </div>
            <span style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>HoshiVibe</span>
          </div>

          {/* Navigation */}
          <nav style={{ display: 'none', gap: '2rem' }} className="md:flex">
            <button 
              onClick={() => handleNavigation('home')}
              style={{ 
                backgroundColor: currentPage === 'home' ? 'black' : 'transparent', 
                color: currentPage === 'home' ? 'white' : '#6b7280', 
                padding: '0.5rem 1rem', 
                borderRadius: '0.25rem', 
                border: 'none', 
                cursor: 'pointer',
                fontWeight: currentPage === 'home' ? '600' : '400',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 'home') {
                  e.currentTarget.style.color = 'black'
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 'home') {
                  e.currentTarget.style.color = '#6b7280'
                }
              }}
            >
              TRANG CHỦ
            </button>
            
            <button 
              onClick={() => handleNavigation('products')}
              className="nav-item" 
              style={{ 
                border: 'none', 
                background: 'none',
                color: currentPage === 'products' ? 'black' : '#6b7280',
                fontWeight: currentPage === 'products' ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: '0.5rem 1rem'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 'products') {
                  e.currentTarget.style.color = 'black'
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 'products') {
                  e.currentTarget.style.color = '#6b7280'
                }
              }}
            >
              SẢN PHẨM
            </button>
            
            <button 
              onClick={() => handleNavigation('custom-design')}
              className="nav-item" 
              style={{ 
                border: 'none', 
                background: 'none',
                color: currentPage === 'custom-design' ? 'black' : '#6b7280',
                fontWeight: currentPage === 'custom-design' ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: '0.5rem 1rem'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 'custom-design') {
                  e.currentTarget.style.color = 'black'
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 'custom-design') {
                  e.currentTarget.style.color = '#6b7280'
                }
              }}
            >
              TÙY CHỈNH THIẾT KẾ
            </button>
            
            <button 
              onClick={() => handleNavigation('membership')}
              className="nav-item" 
              style={{ 
                border: 'none', 
                background: 'none',
                color: currentPage === 'membership' ? 'black' : '#6b7280',
                fontWeight: currentPage === 'membership' ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: '0.5rem 1rem'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 'membership') {
                  e.currentTarget.style.color = 'black'
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 'membership') {
                  e.currentTarget.style.color = '#6b7280'
                }
              }}
            >
              GÓI THÀNH VIÊN
            </button>
            
            <button 
              onClick={() => handleNavigation('about')}
              className="nav-item" 
              style={{ 
                border: 'none', 
                background: 'none',
                color: currentPage === 'about' ? 'black' : '#6b7280',
                fontWeight: currentPage === 'about' ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: '0.5rem 1rem'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 'about') {
                  e.currentTarget.style.color = 'black'
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 'about') {
                  e.currentTarget.style.color = '#6b7280'
                }
              }}
            >
              GIỚI THIỆU
            </button>
          </nav>

          {/* Right side icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
            <UserOutlined 
              onClick={() => handleNavigation('login')}
              style={{ fontSize: '1.25rem', color: '#6b7280', cursor: 'pointer', transition: 'color 0.3s ease' }} 
              onMouseEnter={(e) => e.currentTarget.style.color = 'black'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
            />
            <SearchOutlined 
              style={{ fontSize: '1.25rem', color: '#6b7280', cursor: 'pointer', transition: 'color 0.3s ease' }} 
              onMouseEnter={(e) => e.currentTarget.style.color = 'black'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
            />
            <div id="nav-cart-icon" style={{ position: 'relative' }} onClick={() => handleNavigation('cart')}>
              <ShoppingCartOutlined 
                style={{ fontSize: '1.25rem', color: '#6b7280', cursor: 'pointer', transition: 'color 0.3s ease' }} 
                onMouseEnter={(e) => e.currentTarget.style.color = 'black'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
              />
              {cartCount > 0 && (
                <span
                  aria-label={`Số lượng trong giỏ: ${cartCount}`}
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-10px',
                    minWidth: '18px',
                    height: '18px',
                    backgroundColor: '#000',
                    color: '#fff',
                    borderRadius: '999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '0 4px',
                    lineHeight: 1
                  }}
                >
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header