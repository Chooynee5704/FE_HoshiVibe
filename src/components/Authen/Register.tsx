import { useState } from 'react'
import {
  MailOutlined,
  LockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  UserOutlined
} from '@ant-design/icons'
import type { PageKey } from '../../types/navigation'
import { registerApi } from '../../api/authApi' // ✅ import hàm gọi API

interface RegisterProps {
  onNavigate?: (page: PageKey) => void;
}

const Register = ({ onNavigate }: RegisterProps) => {
  const [account, setAccount] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [message, setMessage] = useState<string>('')

  // ✅ kiểm tra form hợp lệ
  const isFormValid = account.trim() !== '' && email.trim() !== '' && password.trim() !== ''

  // ✅ Gọi API bằng axios
  const handleRegister = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isFormValid || isLoading) return

    setLoading(true)
    setMessage('')

    try {
      const res = await registerApi({ account, email, password })
      console.log('✅ Register success:', res)
      setMessage('🎉 Đăng ký thành công! Chuyển đến đăng nhập...')
      setTimeout(() => onNavigate?.('login'), 1500)
    } catch (error: any) {
      console.error('❌ Register error:', error)

      if (error.response?.status === 409) {
        setMessage('⚠️ Tài khoản đã tồn tại.')
      } else if (error.response?.data) {
        setMessage(error.response.data)
      } else {
        setMessage('❌ Đăng ký thất bại. Vui lòng thử lại.')
        console.error(error)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(30px); }
            to { opacity: 1; transform: translateX(0); }
          }
          .register-input { transition: all 0.3s ease; }
          .register-input:focus {
            border-color: #000000 !important;
            background-color: #ffffff !important;
            box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05) !important;
          }
          .register-button { transition: all 0.3s ease; }
          .register-button:not(:disabled):hover {
            background: #8FBC8F !important;
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(143, 188, 143, 0.3);
          }
          .link-hover { transition: color 0.3s ease; }
          .link-hover:hover { color: #000000 !important; }
        `}
      </style>

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '-5%',
          width: '500px',
          height: '500px',
          background: 'linear-gradient(135deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.01) 100%)',
          borderRadius: '50%',
          animation: 'fadeIn 1.5s ease-out'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-5%',
          width: '400px',
          height: '400px',
          background: 'linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.01) 100%)',
          borderRadius: '50%',
          animation: 'fadeIn 1.5s ease-out 0.3s backwards'
        }} />

        {/* Left Side - Brand Section */}
        <div style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem',
          background: 'url("/images/dangki.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)',
            zIndex: 1
          }} />

          <div style={{
            position: 'relative', zIndex: 2, textAlign: 'center',
            animation: 'slideIn 1s ease-out',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', height: '100%'
          }}>
            <div
              style={{ padding: '2rem 3rem', marginBottom: '2rem', transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)' }}
            >
              <h1 style={{
                fontSize: '4rem', fontWeight: 900, margin: 0, letterSpacing: '0.05em',
                textTransform: 'uppercase', textShadow: '2px 2px 4px rgba(0,0,0,0.8)', color: '#ffffff'
              }}>
                HOSHIVIBE
              </h1>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                transform: 'translateX(-100%)', transition: 'transform 0.8s ease'
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(100%)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(-100%)' }}
              />
            </div>

            <div style={{
              width: '100px', height: '4px',
              background: 'linear-gradient(90deg, transparent, #ffffff, transparent)',
              margin: '0 auto 2rem', borderRadius: '2px'
            }} />

            <p style={{
              fontSize: '1.25rem', color: '#ffffff', maxWidth: '400px',
              lineHeight: '1.8', fontWeight: 300, textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
            }}>
              Tạo tài khoản để khám phá thế giới đá phong thủy 
              và nhận những sản phẩm độc đáo dành riêng cho bạn
            </p>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div style={{
          flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '3rem 2rem', position: 'relative', zIndex: 1
        }}>
          <div style={{
            maxWidth: '480px', width: '100%', background: '#ffffff', padding: '3rem',
            borderRadius: '0', border: '1px solid #e5e5e5',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)', animation: 'fadeInUp 0.8s ease-out'
          }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{
                fontSize: '2rem', fontWeight: 900, color: '#000000',
                marginBottom: '0.75rem', letterSpacing: '0.02em', textTransform: 'uppercase'
              }}>
                Tạo Tài Khoản
              </h2>
              <p style={{ color: '#666666', fontSize: '0.95rem' }}>
                Đã có tài khoản?{' '}
                <span
                  className="link-hover"
                  style={{ color: '#000000', fontWeight: 600, cursor: 'pointer', borderBottom: '2px solid #000000' }}
                  onClick={() => onNavigate?.('login')}
                >
                  Đăng nhập tại đây
                </span>
              </p>
            </div>

            {/* Register Form */}
            <div>
              {/* Account Field */}
              <div style={{ marginBottom: '1.75rem' }}>
                <label style={{
                  display: 'block', fontSize: '0.875rem', fontWeight: 700,
                  color: '#000000', marginBottom: '0.75rem', letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}>
                  Account
                </label>
                <div style={{ position: 'relative' }}>
                  <UserOutlined style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999999', fontSize: '1.125rem' }} />
                  <input
                    type="text"
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    placeholder="Nhập tên tài khoản"
                    required
                    className="register-input"
                    style={{
                      width: '100%',
                      padding: '1rem 1rem 1rem 3rem',
                      border: '2px solid #e5e5e5',
                      borderRadius: '0',
                      fontSize: '1rem',
                      backgroundColor: '#ffffff',
                      color: '#000000',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontWeight: 500
                    }}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div style={{ marginBottom: '1.75rem' }}>
                <label style={{
                  display: 'block', fontSize: '0.875rem', fontWeight: 700,
                  color: '#000000', marginBottom: '0.75rem', letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}>
                  Email
                </label>
                <div style={{ position: 'relative' }}>
                  <MailOutlined style={{
                    position: 'absolute', left: '1rem', top: '50%',
                    transform: 'translateY(-50%)', color: '#999999',
                    fontSize: '1.125rem'
                  }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email"
                    required
                    className="register-input"
                    style={{
                      width: '100%',
                      padding: '1rem 1rem 1rem 3rem',
                      border: '2px solid #e5e5e5',
                      borderRadius: '0',
                      fontSize: '1rem',
                      backgroundColor: '#ffffff',
                      color: '#000000',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontWeight: 500
                    }}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block', fontSize: '0.875rem', fontWeight: 700,
                  color: '#000000', marginBottom: '0.75rem', letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}>
                  Mật Khẩu
                </label>
                <div style={{ position: 'relative' }}>
                  <LockOutlined style={{
                    position: 'absolute', left: '1rem', top: '50%',
                    transform: 'translateY(-50%)', color: '#999999', fontSize: '1.125rem'
                  }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    required
                    className="register-input"
                    style={{
                      width: '100%',
                      padding: '1rem 3rem 1rem 3rem',
                      border: '2px solid #e5e5e5',
                      borderRadius: '0',
                      fontSize: '1rem',
                      backgroundColor: '#ffffff',
                      color: '#000000',
                      outline: 'none',
                      boxSizing: 'border-box',
                      fontWeight: 500
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#999999',
                      fontSize: '1.125rem',
                      padding: 0
                    }}
                  >
                    {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                  </button>
                </div>
              </div>

              {/* ✅ Thông báo kết quả */}
              {message && (
                <p style={{
                  textAlign: 'center',
                  color: message.includes('thành công') ? 'green' : 'red',
                  fontWeight: 500,
                  marginBottom: '1rem'
                }}>
                  {message}
                </p>
              )}

              {/* Register Button */}
              <button
                onClick={handleRegister}
                disabled={!isFormValid || isLoading}
                className="register-button"
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: isFormValid && !isLoading ? 'pointer' : 'not-allowed',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  background: isFormValid ? '#8FBC8F' : '#e5e5e5',
                  color: isFormValid ? '#000000' : '#999999',
                  opacity: isFormValid ? 1 : 0.6
                }}
              >
                {isLoading ? 'Đang đăng ký...' : 'Đăng Ký'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register
