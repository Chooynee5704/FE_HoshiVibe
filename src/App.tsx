// src/App.tsx
import { useState, useEffect } from 'react'
import { Header, HeroSection, ProductCategories, ChatWidget, Footer, About, Products, Login, Register, Membership, Search, ProductDetail, Cart } from './components'
import CustomDesign from './components/CustomDesign'
import type { PageKey } from './types/navigation'
import AdminLayout from './components/Dashboard/layout/AdminLayout'
import FengShuiConsultation from './components/FengShuiConsultation'
import CheckoutPage from './components/Payment/CheckoutPage'

type NavParams = { id?: string }

function App() {
  const [currentPage, setCurrentPage] = useState<PageKey>('home')
  const [isPageTransitioning, setIsPageTransitioning] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [cartItems, setCartItems] = useState<
    { id: string; name: string; price: number; image: string; quantity: number }[]
  >([])
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\/+/, '')

      // URL dạng: /product-detail/<id>
      const productMatch = path.match(/^product-detail\/(.+)$/)
      if (productMatch) {
        setCurrentPage('product-detail')
        setSelectedProductId(productMatch[1])
        return
      }

      if (path === 'custom-design') setCurrentPage('custom-design')
      else if (path === 'products') setCurrentPage('products')
      else if (path === 'membership') setCurrentPage('membership')
      else if (path === 'about') setCurrentPage('about')
      else if (path === 'admin') setCurrentPage('admin')
      else if (path === 'login') setCurrentPage('login')
      else if (path === 'register') setCurrentPage('register')
      else if (path === 'search') setCurrentPage('search')
      else if (path === 'cart') setCurrentPage('cart')
      else if (path === 'checkout') setCurrentPage('checkout')
      else setCurrentPage('home')
    }

    handlePopState()
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleNavigation = (page: PageKey, params?: NavParams) => {
    setIsPageTransitioning(true)
    if (page === 'product-detail' && params?.id) {
      setSelectedProductId(params.id)
    }

    setTimeout(() => {
      setCurrentPage(page)

      // ✅ THỐNG NHẤT URL với popstate ở trên
      const nextPath =
        page === 'product-detail' && params?.id
          ? `/product-detail/${params.id}`
          : page === 'home'
          ? '/'
          : `/${page}`

      window.history.pushState({}, '', nextPath)

      setTimeout(() => setIsPageTransitioning(false), 100)
    }, 200)
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'custom-design':
        return <CustomDesign />
      case 'products':
        return <Products onNavigate={handleNavigation} />
      case 'membership':
        return <Membership />
      case 'about':
        return <About />
      case 'admin':
        return <AdminLayout />
      case 'login':
        return <Login onNavigate={handleNavigation} />
      case 'register':
        return <Register onNavigate={handleNavigation} />
      case 'search':
        return <Search onNavigate={handleNavigation} />
      case 'product-detail':
        return (
          <ProductDetail
            productId={selectedProductId || ''}
            onNavigate={handleNavigation}
            onAddToCart={(product, quantity) => {
              setCartItems(prev => [...prev, { ...product, quantity }])
              setCartCount(c => c + quantity)
            }}
          />
        )
      case 'cart':
        return (
          <Cart
            onNavigate={handleNavigation}
            items={cartItems}
            onUpdateQty={(id, qty) => {
              setCartItems(prev => prev.map(i => (i.id === id ? { ...i, quantity: qty } : i)))
              setCartCount(
                _ => cartItems.reduce((s, i) => (i.id === id ? s + qty : s + i.quantity), 0)
              )
            }}
            onRemove={id => {
              setCartItems(prev => prev.filter(i => i.id !== id))
              setCartCount(_ => cartItems.filter(i => i.id !== id).reduce((s, i) => s + i.quantity, 0))
            }}
            onCheckout={() => alert('Tiến hành thanh toán (demo)')}
          />
        )
      case 'checkout':
        return (
          <CheckoutPage
            onNavigate={handleNavigation}
            items={cartItems}
            total={cartItems.reduce((s, i) => s + i.price * i.quantity, 0)}
          />
        )
      case 'home':
      default:
        return (
          <main>
            <HeroSection />
            <FengShuiConsultation />
            <ProductCategories />
          </main>
        )
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Header onNavigate={handleNavigation} currentPage={currentPage} cartCount={cartCount} />
      <div className={`page-transition ${!isPageTransitioning ? 'enter' : ''}`}>{renderCurrentPage()}</div>
      <Footer />
      <ChatWidget />
    </div>
  )
}

export default App
