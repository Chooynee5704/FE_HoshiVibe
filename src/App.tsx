// src/App.tsx
import { useState, useEffect } from 'react'
import {
  Header, HeroSection, ProductCategories, ChatWidget, Footer,
  About, Products, Login, Register, Membership, Search, ProductDetail, Cart
} from './components'
import CustomDesign from './components/CustomDesign'
import type { PageKey } from './types/navigation'
import AdminLayout from './components/Dashboard/layout/AdminLayout'
import FengShuiConsultation from './components/FengShuiConsultation'
import CheckoutPage from './components/Payment/CheckoutPage'

// ✅ Dùng đúng CartItem do Cart export để tránh “Two different types with this name exist”
import type { CartItem as UICartItem } from './components/Cart'

type IdLike = string | number
type NavParams = { id?: IdLike; category?: string }

function App() {
  const [currentPage, setCurrentPage] = useState<PageKey>('home')
  const [isPageTransitioning, setIsPageTransitioning] = useState(false)

  // ✅ dùng đúng type của Cart
  const [cartItems, setCartItems] = useState<UICartItem[]>([])
  const [cartCount, setCartCount] = useState(0)

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\/+/, '')

      // /product-detail/<id>
      const productMatch = path.match(/^product-detail\/(.+)$/)
      if (productMatch) {
        setCurrentPage('product-detail')
        setSelectedProductId(productMatch[1])
        return
      }

      // /search?category=<category>
      const searchMatch = path.match(/^search/)
      if (searchMatch) {
        setCurrentPage('search')
        const urlParams = new URLSearchParams(window.location.search)
        const category = urlParams.get('category') || ''
        setSelectedCategory(category)
        return
      }

      if (path === 'custom-design') setCurrentPage('custom-design')
      else if (path === 'products') setCurrentPage('products')
      else if (path === 'membership') setCurrentPage('membership')
      else if (path === 'about') setCurrentPage('about')
      else if (path === 'admin') setCurrentPage('admin')
      else if (path === 'login') setCurrentPage('login')
      else if (path === 'register') setCurrentPage('register')
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

    if (page === 'product-detail' && params?.id != null) {
      setSelectedProductId(String(params.id)) // ✅ luôn là string trong state
    }

    if (page === 'search' && params?.category != null) {
      setSelectedCategory(params.category)
    }

    setTimeout(() => {
      setCurrentPage(page)

      const nextPath =
        page === 'product-detail' && params?.id != null
          ? `/product-detail/${params.id}`
          : page === 'search' && params?.category
          ? `/search?category=${encodeURIComponent(params.category)}`
          : page === 'home'
          ? '/'
          : `/${page}`

      window.history.pushState({}, '', nextPath)
      setTimeout(() => setIsPageTransitioning(false), 100)
    }, 200)
  }

  const calcCount = (items: UICartItem[]) => items.reduce((s, i) => s + i.quantity, 0)

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
        return <Search onNavigate={handleNavigation} category={selectedCategory} />

      case 'product-detail':
        return (
          <ProductDetail
            // ✅ truyền string (không còn string|undefined)
            productId={selectedProductId || ''}
            onNavigate={handleNavigation}
            onAddToCart={(
              product: { id: IdLike; name: string; price: number; image: string },
              quantity: number
            ) => {
              const pid = Number(product.id) // ✅ chuẩn hoá về number cho Cart
              setCartItems(prev => {
                const idx = prev.findIndex(i => i.id === pid)
                const next =
                  idx >= 0
                    ? prev.map((i, k) => (k === idx ? { ...i, quantity: i.quantity + quantity } : i))
                    : [...prev, { id: pid, name: product.name, price: product.price, image: product.image, quantity }]
                setCartCount(calcCount(next))
                return next
              })
            }}
          />
        )

      case 'cart':
        return (
          <Cart
            onNavigate={handleNavigation}
            items={cartItems}
            onUpdateQty={(id: number, qty: number) => {
              setCartItems(prev => {
                const next = prev.map(i => (i.id === id ? { ...i, quantity: qty } : i))
                setCartCount(calcCount(next))
                return next
              })
            }}
            onRemove={(id: number) => {
              setCartItems(prev => {
                const next = prev.filter(i => i.id !== id)
                setCartCount(calcCount(next))
                return next
              })
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
            <ProductCategories onNavigate={handleNavigation} />
          </main>
        )
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Header onNavigate={handleNavigation} currentPage={currentPage} cartCount={cartCount} />
      <div className={`page-transition ${!isPageTransitioning ? 'enter' : ''}`}>
        {renderCurrentPage()}
      </div>
      <Footer />
      <ChatWidget />
    </div>
  )
}

export default App
