import { useState, useEffect } from 'react'
import { Header, HeroSection, ProductCategories, ChatWidget, Footer, About, Products, Login, Register, Membership, Search, ProductDetail, Cart } from './components'
import CustomDesign from './components/CustomDesign'
import type { PageKey } from './types/navigation'
import AdminLayout from './components/Dashboard/layout/AdminLayout'
import FengShuiConsultation from './components/FengShuiConsultation'
import CheckoutPage from './components/Payment/CheckoutPage'  


function App() {
  const [currentPage, setCurrentPage] = useState<PageKey>('home')
  const [isPageTransitioning, setIsPageTransitioning] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [cartItems, setCartItems] = useState<{ id:number; name:string; price:number; image:string; quantity:number }[]>([])

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\/+/, '')
      if (path === 'custom-design') {
        setCurrentPage('custom-design')
      } else if (path === 'products') {
        setCurrentPage('products')
      } else if (path === 'membership') {
        setCurrentPage('membership')
      } else if (path === 'about') {
        setCurrentPage('about')
      } else if (path === 'admin') {
        setCurrentPage('admin')
      } else if (path === 'login') {
        setCurrentPage('login')
      } else if (path === 'register') {
        setCurrentPage('register')
      } else if (path === 'search') {
        setCurrentPage('search')
      } else if (path === 'product-detail') {
        setCurrentPage('product-detail')
      } else if (path === 'cart') {
        setCurrentPage('cart')
      } else if (path === 'checkout') {
        setCurrentPage('checkout')
      } else {
        setCurrentPage('home')
      }
    }

    handlePopState()
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleNavigation = (page: PageKey) => {
    setIsPageTransitioning(true)
    
    setTimeout(() => {
      setCurrentPage(page)
      const nextPath = page === 'home' ? '/' : `/${page}`
      window.history.pushState({}, '', nextPath)
      
      setTimeout(() => {
        setIsPageTransitioning(false)
      }, 100)
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
        return <ProductDetail onNavigate={handleNavigation} onAddToCart={(q) => {
          // demo: push a sample item
          const sample = { id: Date.now(), name: 'Vòng tay Hoshi Vibe', price: 150000, image: '/item/Vòng Tay Đá Thô.jpg', quantity: q }
          setCartItems((prev) => [...prev, sample])
          setCartCount((c) => c + q)
        }} />
      case 'cart':
        return (
          <Cart
            onNavigate={handleNavigation}
            items={cartItems}
            onUpdateQty={(id, qty) => {
              setCartItems((prev) => prev.map(i => i.id === id ? { ...i, quantity: qty } : i))
              setCartCount((_) => cartItems.reduce((s,i)=> (i.id===id? s + qty : s + i.quantity), 0))
            }}
            onRemove={(id) => {
              setCartItems((prev) => prev.filter(i => i.id !== id))
              setCartCount((_) => cartItems.filter(i=> i.id !== id).reduce((s,i)=> s + i.quantity, 0))
            }}
            onCheckout={() => alert('Tiến hành thanh toán (demo)')}
          />
        )
      case 'checkout':             
  return (
    <CheckoutPage
      onNavigate={handleNavigation}
      items={cartItems}
      total={cartItems.reduce((s,i)=> s + i.price*i.quantity, 0)}
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
      <div className={`page-transition ${!isPageTransitioning ? 'enter' : ''}`}>
        {renderCurrentPage()}
      </div>
      <Footer />
      <ChatWidget />
    </div>
  )
}

export default App
