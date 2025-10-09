import { useState, useEffect } from 'react'
import { Header, HeroSection, ProductCategories, ChatWidget, Footer, About, Products } from './components'
import CustomDesign from './components/CustomDesign'
import type { PageKey } from './types/navigation'
import AdminLayout from './components/Dashboard/layout/AdminLayout'

const ComingSoon = ({ title, description }: { title: string; description: string }) => (
  <div style={{ padding: '4rem 2rem', textAlign: 'center', minHeight: '60vh', backgroundColor: '#fff' }}>
    <h1 style={{ fontSize: '2rem', color: '#111827', marginBottom: '1rem' }}>{title}</h1>
    <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>{description}</p>
  </div>
)

function App() {
  const [currentPage, setCurrentPage] = useState<PageKey>('home')

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
      } else {
        setCurrentPage('home')
      }
    }

    handlePopState()
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleNavigation = (page: PageKey) => {
    setCurrentPage(page)
    const nextPath = page === 'home' ? '/' : `/${page}`
    window.history.pushState({}, '', nextPath)
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'custom-design':
        return <CustomDesign />
      case 'products':
        return <Products />
      case 'membership':
        return (
          <ComingSoon
            title="G\u00f3i th\u00e0nh vi\u00ean"
            description="Trang g\u00f3i th\u00e0nh vi\u00ean \u0111ang \u0111\u01b0\u1ee3c ho\u00e0n thi\u1ec7n \u0111\u1ec3 ph\u1ee5c v\u1ee5 b\u1ea1n t\u1ed1t h\u01a1n."
          />
        )
      case 'about':
        return <About />
      case 'admin':
        return <AdminLayout />
      case 'home':
      default:
        return (
          <main>
            <HeroSection />
            <ProductCategories />
          </main>
        )
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Header onNavigate={handleNavigation} currentPage={currentPage} />
      {renderCurrentPage()}
      <Footer />
      <ChatWidget />
    </div>
  )
}

export default App
