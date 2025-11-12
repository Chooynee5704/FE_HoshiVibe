import { SearchOutlined, ShoppingCartOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import { Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import type { PageKey } from '../types/navigation'
import { getCurrentUser } from '../api/authApi'

interface HeaderProps {
  onNavigate?: (page: PageKey) => void;
  currentPage?: PageKey;
  cartCount?: number;
}

const Header = ({ onNavigate, currentPage = 'home', cartCount = 0 }: HeaderProps) => {
  const [cartAnimation, setCartAnimation] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Listen for cart animation events
  useEffect(() => {
    const handleCartAnimation = () => {
      setCartAnimation(true)
      setTimeout(() => setCartAnimation(false), 600)
    }

    window.addEventListener('cartItemAdded', handleCartAnimation)
    return () => window.removeEventListener('cartItemAdded', handleCartAnimation)
  }, [])

  // Check login status
  useEffect(() => {
    const checkAuth = () => {
      const user = getCurrentUser()
      setIsLoggedIn(!!user)
    }
    
    checkAuth()
    
    // Listen for auth changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'hv_user' || e.key === 'hv_token') {
        checkAuth()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Also check on custom auth events
    const handleAuthChange = () => checkAuth()
    window.addEventListener('authChanged', handleAuthChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('authChanged', handleAuthChange)
    }
  }, [])

  const handleNavigation = (page: PageKey) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Thông tin cá nhân',
      icon: <UserOutlined />,
    },
    {
      key: 'orders',
      label: 'Đơn hàng của tôi',
      icon: <ShoppingCartOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      danger: true,
    },
  ]

  const handleUserMenuClick: MenuProps['onClick'] = ({ key, domEvent }) => {
    if (domEvent) {
      domEvent.preventDefault()
      domEvent.stopPropagation()
    }

    if (key === 'profile') {
      handleNavigation('profile')
      return
    }

    if (key === 'orders') {
      handleNavigation('orders' as PageKey)
      return
    }

    if (key === 'logout') {
      handleLogout(domEvent)
    }
  }

  const handleLogout = (e?: any) => {
    // Prevent event bubbling
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    console.log('🔴 LOGOUT CLICKED - Starting logout process...')
    console.log('🔴 BEFORE LOGOUT - Token:', localStorage.getItem('hv_token'))
    console.log('🔴 BEFORE LOGOUT - User:', localStorage.getItem('hv_user'))
    
    // Remove specific auth items
    localStorage.removeItem('hv_token')
    localStorage.removeItem('hv_user')
    
    console.log('🟢 AFTER REMOVE - Token:', localStorage.getItem('hv_token'))
    console.log('🟢 AFTER REMOVE - User:', localStorage.getItem('hv_user'))
    
    // Clear ALL localStorage
    localStorage.clear()
    window.dispatchEvent(new Event('authChanged'))
    
    console.log('✅ AFTER CLEAR - localStorage length:', localStorage.length)
    console.log('✅ Redirecting to login page...')
    
    // Force reload with redirect to login page
    setTimeout(() => {
      window.location.replace('/login')
    }, 100)
  }

  return (
    <header style={{ 
      backgroundColor: 'white', 
      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)', 
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      width: '100%'
    }}>
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
            {isLoggedIn ? (
              <Dropdown
                menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
                trigger={['click']}
                placement="bottomRight"
              >
                <UserOutlined 
                  style={{ fontSize: '1.25rem', color: '#6b7280', cursor: 'pointer', transition: 'color 0.3s ease' }} 
                  onMouseEnter={(e) => e.currentTarget.style.color = 'black'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
                />
              </Dropdown>
            ) : (
              <UserOutlined 
                onClick={() => handleNavigation('login')}
                style={{ fontSize: '1.25rem', color: '#6b7280', cursor: 'pointer', transition: 'color 0.3s ease' }} 
                onMouseEnter={(e) => e.currentTarget.style.color = 'black'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
              />
            )}
            <SearchOutlined 
              style={{ fontSize: '1.25rem', color: '#6b7280', cursor: 'pointer', transition: 'color 0.3s ease' }} 
              onMouseEnter={(e) => e.currentTarget.style.color = 'black'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}
            />
            <div id="nav-cart-icon" style={{ position: 'relative' }} onClick={() => handleNavigation('cart')}>
              <ShoppingCartOutlined 
                style={{ 
                  fontSize: '1.25rem', 
                  color: '#6b7280', 
                  cursor: 'pointer', 
                  transition: 'color 0.3s ease',
                  transform: cartAnimation ? 'scale(1.2)' : 'scale(1)',
                }} 
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
                    lineHeight: 1,
                    transform: cartAnimation ? 'scale(1.3)' : 'scale(1)',
                    transition: 'all 0.3s ease'
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
