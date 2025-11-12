// src/App.tsx
import { useState, useEffect, useCallback } from 'react'
import { Modal } from 'antd'
import {
  Header,
  HeroSection,
  ProductCategories,
  ChatWidget,
  Footer,
  About,
  Products,
  Login,
  Register,
  Search,
  ProductDetail,
  Cart,
  Profile,
  Orders,
  OrderDetail as OrderDetailPage,
} from './components'
import CustomDesignPage from './components/CustomDesign'
import type { PageKey } from './types/navigation'
import AdminLayout from './components/Dashboard/layout/AdminLayout'
import FengShuiConsultation from './components/FengShuiConsultation'
import CheckoutPage from './components/Payment/CheckoutPage'
import { getCurrentUser } from './api/authApi'
import {
  getPendingOrder,
  addOrderDetail,
  deleteOrderDetail,
  updateOrderDetailQuantity,
  type Order,
  type OrderDetail,
} from './api/orderAPI'
import customDesignAPI, { type CustomDesign as CustomDesignDTO } from './api/customDesignAPI'

// ✅ Dùng đúng CartItem do Cart export để tránh "Two different types with this name exist"
import type { CartItem as UICartItem } from './components/Cart'

type IdLike = string | number
type NavParams = { id?: IdLike; category?: string }

const PLACEHOLDER_IMAGE = '/placeholder.jpg'

const firstNonEmpty = (...values: Array<string | null | undefined>): string | null => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim()
    }
  }
  return null
}

const normalizeImageSource = (raw?: string | null): string | null => {
  if (!raw) return null
  const trimmed = raw.trim().replace(/^"+|"+$/g, '')
  if (!trimmed) return null
  if (/^(data:image|https?:|blob:)/i.test(trimmed)) {
    return trimmed
  }
  const base64Pattern = /^[A-Za-z0-9+/=]+$/
  if (base64Pattern.test(trimmed) && trimmed.length > 60) {
    return `data:image/jpeg;base64,${trimmed}`
  }
  return trimmed
}

type CustomDesignCache = Map<string, CustomDesignDTO>

const buildCustomDesignCache = async (orderDetails: OrderDetail[] = []): Promise<CustomDesignCache> => {
  const cache: CustomDesignCache = new Map()
  const idsToFetch = new Set<string>()

  for (const detail of orderDetails) {
    const extendedDetail = detail as OrderDetail & Record<string, any>
    const customDesignId =
      detail.customDesignId || detail.customDesign_Id || extendedDetail.CustomDesignId || extendedDetail.CustomDesign_Id
    if (!customDesignId) continue
    const hasEmbeddedDesign = extendedDetail.customDesign || extendedDetail.CustomDesign
    if (!hasEmbeddedDesign) {
      idsToFetch.add(customDesignId)
    }
  }

  await Promise.all(
    Array.from(idsToFetch).map(async (id) => {
      try {
        const design = await customDesignAPI.getCustomDesignById(id)
        cache.set(id, design)
      } catch (error) {
        console.error('Failed to load custom design detail', id, error)
      }
    })
  )

  return cache
}

const mapOrderDetailsToCartItems = (
  orderDetails: OrderDetail[] = [],
  customDesignMap?: CustomDesignCache
): UICartItem[] => {
  return orderDetails.map((detail) => {
    const extendedDetail = detail as OrderDetail & Record<string, any>
    const customDesign = extendedDetail.customDesign || extendedDetail.CustomDesign
    const product = extendedDetail.product || extendedDetail.Product
    const customProduct = extendedDetail.customProduct || extendedDetail.CustomProduct

    const customDesignId =
      detail.customDesignId || detail.customDesign_Id || extendedDetail.CustomDesignId || extendedDetail.CustomDesign_Id
    const productId = detail.productId || detail.cProduct_Id || extendedDetail.ProductId || extendedDetail.CProductId

    const fetchedDesign = customDesignId ? customDesignMap?.get(customDesignId) : undefined

    const resolvedName =
      firstNonEmpty(
        customDesign?.name || fetchedDesign?.name,
        customDesign?.Name,
        fetchedDesign?.name,
        customProduct?.name,
        customProduct?.Name,
        product?.name,
        product?.Name
      ) || 'San pham'

    const resolvedDescription = firstNonEmpty(
      customDesign?.description || fetchedDesign?.description,
      customDesign?.Description,
      fetchedDesign?.description,
      customProduct?.description,
      customProduct?.Description,
      product?.description,
      product?.Description
    )

    const resolvedImage =
      normalizeImageSource(
        firstNonEmpty(
          customDesign?.aiImageUrl || fetchedDesign?.aiImageUrl,
          customDesign?.AiImageUrl,
          fetchedDesign?.aiImageUrl,
          customDesign?.rawImageBase64 || fetchedDesign?.rawImageBase64,
          customDesign?.RawImageBase64,
          fetchedDesign?.rawImageBase64,
          customProduct?.imageUrl,
          customProduct?.imageURL,
          customProduct?.ImageUrl,
          product?.imageUrl,
          product?.imageURL,
          product?.ImageUrl
        )
      ) || PLACEHOLDER_IMAGE

    return {
      id: customDesignId || productId || detail.orderDetailId || detail.orderDetail_Id || '',
      name: resolvedName,
      description: resolvedDescription || undefined,
      price: detail.unitPrice,
      image: resolvedImage,
      quantity: detail.quantity,
      orderDetailId: detail.orderDetailId || detail.orderDetail_Id,
    }
  })
}

function App() {
  const [currentPage, setCurrentPage] = useState<PageKey>('home')
  const [isPageTransitioning, setIsPageTransitioning] = useState(false)

  // ✅ dùng đúng type của Cart
  const [cartItems, setCartItems] = useState<UICartItem[]>([])
  const [cartCount, setCartCount] = useState(0)

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  // Order state
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [isLoadingCart, setIsLoadingCart] = useState(false)

  const loadCart = useCallback(async () => {
    const user = getCurrentUser()
    if (!user) {
      setCartItems([])
      setCartCount(0)
      setCurrentOrder(null)
      setIsLoadingCart(false)
      return
    }

    setIsLoadingCart(true)
    try {
      const order = await getPendingOrder()
      console.log('Pending order loaded:', order)
      setCurrentOrder(order)

      if (order?.orderDetails?.length) {
        const customDesignCache = await buildCustomDesignCache(order.orderDetails)
        const items = mapOrderDetailsToCartItems(order.orderDetails, customDesignCache)
        setCartItems(items)
        setCartCount(items.reduce((sum, item) => sum + item.quantity, 0))
      } else {
        setCartItems([])
        setCartCount(0)
      }
    } catch (err) {
      console.log('No pending order found or error loading cart:', err)
    } finally {
      setIsLoadingCart(false)
    }
  }, [])

  // Check if user is admin and redirect to admin page
  useEffect(() => {
    const user = getCurrentUser()
    if (user && user.role === 'Admin' && currentPage === 'home') {
      // Auto redirect admin to admin page on initial load
      handleNavigation('admin')
    }
  }, []) // Only run once on mount

  // Load user's pending order (cart) on mount
  useEffect(() => {
    loadCart()
  }, [loadCart])

  useEffect(() => {
    const handleAuthChange = () => {
      loadCart()
    }

    window.addEventListener('authChanged', handleAuthChange)
    return () => window.removeEventListener('authChanged', handleAuthChange)
  }, [loadCart])

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

      // /order-detail/<id>
      const orderMatch = path.match(/^order-detail\/(.+)$/)
      if (orderMatch) {
        setCurrentPage('order-detail')
        setSelectedOrderId(orderMatch[1])
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
      else if (path === 'about') setCurrentPage('about')
      else if (path === 'admin') setCurrentPage('admin')
      else if (path === 'login') setCurrentPage('login')
      else if (path === 'register') setCurrentPage('register')
      else if (path === 'cart') setCurrentPage('cart')
      else if (path === 'checkout') setCurrentPage('checkout')
      else if (path === 'profile') setCurrentPage('profile')
      else if (path === 'orders') setCurrentPage('orders')
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

    if (page === 'order-detail' && params?.id != null) {
      setSelectedOrderId(String(params.id))
    }

    if (page === 'search' && params?.category != null) {
      setSelectedCategory(params.category)
    }

    setTimeout(() => {
      setCurrentPage(page)

      const nextPath =
        page === 'product-detail' && params?.id != null
          ? `/product-detail/${params.id}`
          : page === 'order-detail' && params?.id != null
          ? `/order-detail/${params.id}`
          : page === 'search' && params?.category
          ? `/search?category=${encodeURIComponent(params.category)}`
          : page === 'home'
          ? '/'
          : `/${page}`

      window.history.pushState({}, '', nextPath)
      setTimeout(() => setIsPageTransitioning(false), 100)
    }, 200)
  }

  const handleAddToCart = async (
    product: { id: IdLike; name: string; price: number; image: string },
    quantity: number = 1
  ) => {
    const user = getCurrentUser()
    if (!user) {
      Modal.warning({
        title: 'Yêu cầu đăng nhập',
        content: 'Vui lòng đăng nhập để thêm vào giỏ hàng',
        onOk: () => handleNavigation('login'),
      })
      return
    }

    try {
      const productId = String(product.id)
      
      // Backend will automatically handle order creation if needed
      const orderDetailPayload = {
        productId: productId,
        quantity: quantity,
        unitPrice: product.price,
        discount: 0,
      }
      
      console.log('Adding to cart:', orderDetailPayload)

      const createdDetail = await addOrderDetail(orderDetailPayload)
      
      console.log('OrderDetail created:', createdDetail)
      await loadCart()

    } catch (err: any) {
      console.error('Error adding to cart:', err)
      console.error('Error details:', err?.response?.data)
      Modal.error({
        title: 'Lỗi',
        content: 'Không thể thêm vào giỏ hàng. Vui lòng thử lại.',
      })
    }
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'custom-design':
        return <CustomDesignPage onCartUpdated={loadCart} />

      case 'products':
        return <Products onNavigate={handleNavigation} onAddToCart={handleAddToCart} />

      case 'about':
        return <About />

      case 'admin':
        return <AdminLayout />

      case 'login':
        return <Login onNavigate={(page) => {
          handleNavigation(page)
          // Trigger auth change event after navigation
          window.dispatchEvent(new Event('authChanged'))
        }} />

      case 'register':
        return <Register onNavigate={handleNavigation} />

      case 'profile':
        return <Profile onNavigate={handleNavigation} />

      case 'orders':
        return <Orders onNavigate={handleNavigation} />

      case 'order-detail':
        return (
          <OrderDetailPage
            orderId={selectedOrderId || ''}
            onNavigate={handleNavigation}
          />
        )

      case 'search':
        return (
          <Search
            onNavigate={handleNavigation}
            category={selectedCategory}
            onAddToCart={handleAddToCart}
          />
        )

      case 'product-detail':
        return (
          <ProductDetail
            // ✅ truyền string (không còn string|undefined)
            productId={selectedProductId || ''}
            onNavigate={handleNavigation}
            onAddToCart={handleAddToCart}
          />
        )

      case 'cart':
        return (
          <Cart
            onNavigate={handleNavigation}
            items={isLoadingCart ? [] : cartItems}
            onUpdateQty={async (id: string, qty: number) => {
              try {
                console.log('onUpdateQty called with id:', id, 'qty:', qty)
                const item = cartItems.find(i => i.id === id)
                console.log('Found item:', item)
                if (!item || !item.orderDetailId || !currentOrder) {
                  console.error('Missing required data:', { item, orderDetailId: item?.orderDetailId, currentOrder })
                  return
                }

                console.log('Updating OrderDetail:', item.orderDetailId, 'to qty:', qty)
                // Update quantity via API
                await updateOrderDetailQuantity(
                  item.orderDetailId,
                  currentOrder.order_Id,
                  id,
                  qty,
                  item.price,
                  0
                )

                await loadCart()
                console.log('Cart updated successfully')
              } catch (err) {
                console.error('Error updating quantity:', err)
                Modal.error({
                  title: 'Lỗi',
                  content: 'Không thể cập nhật số lượng. Vui lòng thử lại.',
                })
              }
            }}
            onRemove={async (id: string) => {
              try {
                console.log('onRemove called with id:', id)
                const item = cartItems.find(i => i.id === id)
                console.log('Found item:', item)
                if (!item || !item.orderDetailId) {
                  console.error('Missing required data:', { item, orderDetailId: item?.orderDetailId })
                  return
                }

                // Confirm before deleting
                const confirmDelete = window.confirm(`Bạn có chắc muốn xóa "${item.name}" khỏi giỏ hàng?`)
                if (!confirmDelete) {
                  console.log('Delete cancelled by user')
                  return
                }

                console.log('Deleting OrderDetail:', item.orderDetailId)
                // Delete via API
                await deleteOrderDetail(item.orderDetailId)

                console.log('Delete successful, reloading cart...')
                await loadCart()
                console.log('Cart updated after delete')
              } catch (err) {
                console.error('Error removing item:', err)
                Modal.error({
                  title: 'Lỗi',
                  content: 'Không thể xóa sản phẩm. Vui lòng thử lại.',
                })
              }
            }}
            onCheckout={() => {
              Modal.info({
                title: 'Thanh toán',
                content: 'Tiến hành thanh toán (demo)',
              })
            }}
          />
        )

      case 'checkout':
        return (
          <CheckoutPage
            onNavigate={handleNavigation}
            items={cartItems}
            total={cartItems.reduce((s, i) => s + i.price * i.quantity, 0)}
            orderId={currentOrder?.order_Id || ''}
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












