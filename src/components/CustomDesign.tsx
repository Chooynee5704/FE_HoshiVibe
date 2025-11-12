import { useState, useRef, useEffect } from 'react'
import { ShoppingCartOutlined, RobotOutlined, LoadingOutlined, ReloadOutlined, DownloadOutlined, CloseOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons'
import { message } from 'antd'
import { getAllCharms, type Charm } from '../api/charmAPI'
import customDesignAPI from '../api/customDesignAPI'
import { addOrderDetail } from '../api/orderAPI'

type Accessory = {
  id: number
  name: string
  image: string
  price?: number
}

type PlacedAccessory = Accessory & {
  x: number
  y: number
  width: number
  height: number
}

const WEBHOOK_ENDPOINT = 'https://d3ucnn9kcaw68r.cloudfront.net/n8n/webhook/nano-banana'
const AI_PROMPT = 'This image shows a necklace on white background with accessory images (charms) placed on it. The accessories also have white backgrounds. Please Seamlessly blend/integrate the accessories onto the necklace so they look naturally crafted together.'

const base64ToBlob = (base64: string, mimeType = 'image/jpeg') => {
  const sanitized = base64.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, '').replace(/\s/g, '')
  const byteCharacters = atob(sanitized)
  const byteNumbers = new Array(byteCharacters.length)

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }

  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: mimeType })
}

const normalizeImageString = (value: string): string | null => {
  if (typeof value !== 'string') return null
  const trimmed = value.trim().replace(/^"+|"+$/g, '')
  if (!trimmed) return null

  if (trimmed.startsWith('http') || trimmed.startsWith('blob:') || trimmed.startsWith('data:image/')) {
    return trimmed
  }

  const compact = trimmed.replace(/\s/g, '')
  const base64Pattern = /^[A-Za-z0-9+/=]+$/

  if (compact.length > 100 && base64Pattern.test(compact)) {
    return `data:image/jpeg;base64,${compact}`
  }

  return null
}

const findImageInPayload = (payload: unknown, depth = 0): string | null => {
  if (depth > 6 || payload == null) return null

  if (typeof payload === 'string') {
    return normalizeImageString(payload)
  }

  if (Array.isArray(payload)) {
    for (const item of payload) {
      const found = findImageInPayload(item, depth + 1)
      if (found) return found
    }
    return null
  }

  if (typeof payload === 'object') {
    for (const value of Object.values(payload as Record<string, unknown>)) {
      const found = findImageInPayload(value, depth + 1)
      if (found) return found
    }
  }

  return null
}

const blobToDataUrl = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Không thể đọc dữ liệu ảnh từ AI'))
      }
    }
    reader.onerror = () => reject(new Error('Không thể đọc dữ liệu ảnh từ AI'))
    reader.readAsDataURL(blob)
  })
}

const CustomDesign = () => {
  const [selectedItem, setSelectedItem] = useState<Accessory | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('/accessories/mauthietke.jpg')
  const [draggedItem, setDraggedItem] = useState<Accessory | null>(null)
  const [placedAccessories, setPlacedAccessories] = useState<PlacedAccessory[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [enhancedImageUrl, setEnhancedImageUrl] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'accessories' | 'jewelry'>('accessories')
  const [selectedPlacedId, setSelectedPlacedId] = useState<number | null>(null)
  const [_isResizing, setIsResizing] = useState(false)
  const [isDraggingPlaced, setIsDraggingPlaced] = useState(false)
  const canvasRef = useRef<HTMLDivElement | null>(null)

  // State for loaded charms and templates
  const [charms, setCharms] = useState<Accessory[]>([])
  const [templates, setTemplates] = useState<Accessory[]>([])
  const [loading, setLoading] = useState(true)
  
  // Store full charm data from API (with IDs)
  const [allCharmsData, setAllCharmsData] = useState<Charm[]>([])

  // Pagination state
  const [charmPage, setCharmPage] = useState(1)
  const [templatePage, setTemplatePage] = useState(1)
  const charmsPerPage = 6
  const templatesPerPage = 2

  // Load charms and templates from API
  useEffect(() => {
    const loadCharms = async () => {
      setLoading(true)
      try {
        const data = await getAllCharms()
        
        // Store full charm data (with IDs from backend)
        setAllCharmsData(data)
        
        // Filter charms (category = 'charm') and templates (category = 'template')
        const charmList = data
          .filter(item => item.category === 'charm')
          .map((item, index) => ({
            id: index + 1,
            name: item.name,
            image: item.imageUrl || '/placeholder.svg',
            price: item.price
          }))
        
        const templateList = data
          .filter(item => item.category === 'template')
          .map((item, index) => ({
            id: 100 + index + 1,
            name: item.name,
            image: item.imageUrl || '/placeholder.svg',
            price: item.price
          }))
        
        setCharms(charmList)
        setTemplates(templateList)
        
        // Set first template as default if available
        if (templateList.length > 0) {
          setSelectedTemplate(templateList[0].image)
        }
      } catch (err: any) {
        message.error(err?.response?.data?.message || 'Không tải được danh sách charm')
        console.error('Load charms error:', err)
      } finally {
        setLoading(false)
      }
    }
    
    loadCharms()
  }, [])

  const resetDesign = () => {
    setEnhancedImageUrl(null)
    setPlacedAccessories([])
    setSelectedItem(null)
    setSelectedPlacedId(null)
    setError('')
  }

  const captureCanvas = async (): Promise<string | null> => {
    return new Promise<string | null>((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const designCanvas = document.querySelector('[data-design-canvas]')
      
      if (!(designCanvas instanceof HTMLElement) || !ctx) {
        resolve(null)
        return
      }

      const rect = designCanvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height

      // Create a white background
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      let imagesLoaded = 0
      const totalImages = 1 + placedAccessories.length // background + accessories

      const finalize = () => {
        imagesLoaded++
        if (imagesLoaded === totalImages) {
          canvas.toBlob((blob) => {
            if (!blob) {
              resolve(null)
              return
            }
            const reader = new FileReader()
            reader.onload = () => {
              const { result } = reader
              if (typeof result === 'string') {
                const parts = result.split(',')
                resolve(parts.length > 1 ? parts[1] : null)
              } else {
                resolve(null)
              }
            }
            reader.onerror = () => resolve(null)
            reader.readAsDataURL(blob)
          }, 'image/jpeg', 0.9)
        }
      }

      // Draw background image
      const bgImg = new Image()
      bgImg.crossOrigin = 'anonymous'
      bgImg.onload = () => {
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height)
        finalize()
      }
      bgImg.onerror = finalize
      bgImg.src = selectedTemplate

      // Draw placed accessories
      placedAccessories.forEach((accessory) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          const scale = canvas.width / rect.width
          ctx.drawImage(
            img, 
            accessory.x * scale, 
            accessory.y * scale, 
            accessory.width * scale, 
            accessory.height * scale
          )
          finalize()
        }
        img.onerror = finalize
        img.src = accessory.image
      })

      // If no accessories, completion is handled by background onload
    })
  }

  const enhanceDesign = async () => {
    if (placedAccessories.length === 0) {
      setError('Vui lòng kéo ít nhất một phụ kiện vào mẫu trước khi nhờ AI.')
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      const base64Image = await captureCanvas()
      if (!base64Image) {
        throw new Error('Không thể chụp lại vùng thiết kế. Vui lòng thử lại.')
      }

      const imageBlob = base64ToBlob(base64Image)
      const formData = new FormData()
      formData.append('File', imageBlob, `hoshivibe-design-${Date.now()}.jpg`)
      formData.append('Prompt', AI_PROMPT)

      const response = await fetch(WEBHOOK_ENDPOINT, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const rawError = await response.text().catch(() => '')
        throw new Error(rawError || `Máy chủ AI trả về lỗi ${response.status}`)
      }

      const contentType = response.headers.get('content-type')?.toLowerCase() || ''
      let finalImageUrl: string | null = null

      if (!contentType.includes('image')) {
        try {
          const textClone = response.clone()
          const rawText = await textClone.text()
          const quickCandidate = normalizeImageString(rawText)
          if (quickCandidate) {
            finalImageUrl = quickCandidate
          }

          if (!finalImageUrl && rawText) {
            try {
              const jsonData = JSON.parse(rawText)
              const extracted = findImageInPayload(jsonData)
              if (extracted) {
                finalImageUrl = extracted
              }
            } catch {
              // Không phải JSON, bỏ qua
            }
          }
        } catch {
          // Không đọc được text, bỏ qua
        }
      }

      if (!finalImageUrl) {
        const blob = await response.blob()

        if (!blob.size) {
          throw new Error('Máy chủ AI không trả về dữ liệu hình ảnh')
        }

        if (!contentType.includes('image')) {
        try {
          const possibleText = await blob.text()
          const normalized = normalizeImageString(possibleText)
          if (normalized) {
            finalImageUrl = normalized
          }

          if (!finalImageUrl && possibleText) {
            try {
              const jsonData = JSON.parse(possibleText)
              const extracted = findImageInPayload(jsonData)
              if (extracted) {
                finalImageUrl = extracted
              }
            } catch {
              // Không phải JSON, bỏ qua
            }
          }
        } catch {
          // Không đọc được text, bỏ qua
        }
        }

        if (!finalImageUrl) {
          finalImageUrl = await blobToDataUrl(blob)
        }
      }

      if (!finalImageUrl) {
        throw new Error('Không tìm thấy ảnh kết quả từ AI')
      }

      setEnhancedImageUrl(finalImageUrl)

    } catch (err) {
      console.error('Lỗi AI:', err)
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi nhờ AI hoàn thiện thiết kế')
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadEnhancedImage = () => {
    if (!enhancedImageUrl) return

    const link = document.createElement('a')
    link.href = enhancedImageUrl
    link.download = `enhanced-design-${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePlaceOrder = async () => {
    if (!enhancedImageUrl) {
      message.warning('Vui lòng hoàn thiện thiết kế bằng AI trước khi đặt hàng')
      return
    }

    if (placedAccessories.length === 0) {
      message.warning('Vui lòng thêm ít nhất một phụ kiện vào thiết kế')
      return
    }

    try {
      // Get user data
      const userStr = localStorage.getItem('hv_user')
      if (!userStr) {
        message.error('Vui lòng đăng nhập để đặt hàng')
        return
      }
      
      const user = JSON.parse(userStr)
      const userId = user.user_Id || user.userId
      
      if (!userId) {
        message.error('Không tìm thấy thông tin người dùng')
        return
      }

      message.loading({ content: 'Đang lưu thiết kế...', key: 'saveDesign', duration: 0 })

      // Get raw image base64 (before AI enhancement)
      const rawImageBase64 = await captureCanvas()
      if (!rawImageBase64) {
        message.error({ content: 'Không thể lưu hình ảnh thiết kế', key: 'saveDesign' })
        return
      }

      // Map placed accessories to charm IDs from backend
      const charmIds: string[] = []
      for (const placedAcc of placedAccessories) {
        // Find matching charm by image URL
        const matchingCharm = allCharmsData.find(c => c.imageUrl === placedAcc.image)
        if (matchingCharm && matchingCharm.cProduct_Id) {
          charmIds.push(matchingCharm.cProduct_Id)
        }
      }

      // Add template ID if selected template exists
      const selectedTemplateCharm = allCharmsData.find(c => c.imageUrl === selectedTemplate)
      if (selectedTemplateCharm && selectedTemplateCharm.cProduct_Id) {
        charmIds.push(selectedTemplateCharm.cProduct_Id)
      }

      if (charmIds.length === 0) {
        message.error({ content: 'Không tìm thấy thông tin charm trong thiết kế', key: 'saveDesign' })
        return
      }

      // Create custom design
      const customDesignData = {
        user_Id: userId,
        name: `Thiết kế tùy chỉnh ${new Date().toLocaleDateString('vi-VN')}`,
        description: `Thiết kế với ${placedAccessories.length} phụ kiện`,
        rawImageBase64: rawImageBase64,
        aiImageUrl: enhancedImageUrl,
        charmIds: charmIds
      }

      console.log('Creating custom design:', customDesignData)
      const createdDesign = await customDesignAPI.createCustomDesign(customDesignData)
      console.log('Custom design created:', createdDesign)

      message.success({ content: 'Lưu thiết kế thành công!', key: 'saveDesign' })
      message.loading({ content: 'Đang thêm vào giỏ hàng...', key: 'addToCart', duration: 0 })

      // Add to cart (create order detail)
      const orderDetailData = {
        customDesign_Id: createdDesign.customDesign_Id,
        quantity: 1,
        unitPrice: createdDesign.price,
        discount: 0
      }

      console.log('Adding to cart:', orderDetailData)
      await addOrderDetail(orderDetailData)

      message.success({ content: 'Đã thêm vào giỏ hàng!', key: 'addToCart' })
      
      // Reset design after successful order
      setTimeout(() => {
        resetDesign()
        message.info('Bạn có thể tạo thiết kế mới hoặc xem giỏ hàng để thanh toán')
      }, 1500)

    } catch (err: any) {
      console.error('Place order error:', err)
      message.destroy()
      
      const errorMsg = err?.response?.data?.message || err?.message || 'Không thể đặt hàng. Vui lòng thử lại.'
      message.error(errorMsg)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#ffffff',
      paddingTop: '4rem',
      paddingBottom: '4rem'
    }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 3rem' }}>
        {/* Header */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '4rem',
          borderBottom: '1px solid #e0e0e0',
          paddingBottom: '2.5rem'
        }}>
          <h1
            style={{
              color: '#000000',
              fontSize: '3.5rem',
              fontWeight: '200',
              margin: 0,
              letterSpacing: '12px',
              textTransform: 'uppercase',
              marginBottom: '1rem'
            }}
          >
            Phòng Thiết Kế
          </h1>
          <p style={{
            color: '#666',
            fontSize: '1rem',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            margin: 0,
            fontWeight: '300'
          }}>
            Trang Sức Tùy Chỉnh Hoshi Vibe
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div style={{
            maxWidth: '600px',
            margin: '0 auto 2rem auto',
            backgroundColor: '#fff5f5',
            border: '1px solid #ffcccc',
            color: '#cc0000',
            padding: '1rem 1.5rem',
            borderRadius: '0',
            fontSize: '0.875rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '3rem', minHeight: '70vh' }}>
          {/* Left Panel - Accessories */}
          <div style={{ 
            width: '400px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            padding: '0',
            border: '1px solid #e0e0e0',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)'
          }}>
            {/* Tab Navigation */}
            <div style={{ 
              display: 'flex',
              borderBottom: '1px solid #e0e0e0',
              backgroundColor: '#ffffff'
            }}>
              <button
                onClick={() => setActiveTab('accessories')}
                style={{
                  flex: 1,
                  padding: '1.5rem',
                  backgroundColor: activeTab === 'accessories' ? '#000000' : 'transparent',
                  color: activeTab === 'accessories' ? '#ffffff' : '#666',
                  border: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'accessories') {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f5f5f5'
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'accessories') {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
                  }
                }}
              >
                Phụ Kiện
              </button>
              <button
                onClick={() => setActiveTab('jewelry')}
                style={{
                  flex: 1,
                  padding: '1.5rem',
                  backgroundColor: activeTab === 'jewelry' ? '#000000' : 'transparent',
                  color: activeTab === 'jewelry' ? '#ffffff' : '#666',
                  border: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== 'jewelry') {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f5f5f5'
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== 'jewelry') {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
                  }
                }}
              >
                Trang Sức
              </button>
            </div>

            {/* Tab Content */}
            <div style={{ 
              padding: '2.5rem',
              flex: 1,
              overflowY: 'auto',
              backgroundColor: '#fafafa'
            }}>
              {loading ? (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  minHeight: '300px'
                }}>
                  <LoadingOutlined style={{ fontSize: '2rem', color: '#000' }} />
                </div>
              ) : activeTab === 'accessories' ? (
                <div>
              {/* Charms Grid */}
              {charms.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '3rem 1rem',
                  color: '#999',
                  fontSize: '0.875rem'
                }}>
                  Chưa có phụ kiện nào
                </div>
              ) : (
                <>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem',
                marginBottom: '2rem'
              }}>
                {charms
                  .slice((charmPage - 1) * charmsPerPage, charmPage * charmsPerPage)
                  .map((charm) => (
                  <div 
                    key={charm.id}
                    draggable={!enhancedImageUrl}
                    onDragStart={(e) => {
                      if (enhancedImageUrl) return
                      setDraggedItem(charm)
                      e.dataTransfer.effectAllowed = 'copy'
                    }}
                    onDragEnd={() => setDraggedItem(null)}
                    onClick={() => setSelectedItem(charm)}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: enhancedImageUrl ? 'not-allowed' : 'grab',
                      transition: 'all 0.3s ease',
                      border: selectedItem?.id === charm.id ? '2px solid #666' : '1px solid #e0e0e0',
                      overflow: 'hidden',
                      opacity: draggedItem?.id === charm.id ? 0.5 : 1,
                      position: 'relative',
                      boxShadow: selectedItem?.id === charm.id ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!enhancedImageUrl) {
                        e.currentTarget.style.borderColor = '#999'
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)'
                        e.currentTarget.style.transform = 'translateY(-2px)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedItem?.id !== charm.id && !enhancedImageUrl) {
                        e.currentTarget.style.borderColor = '#e0e0e0'
                        e.currentTarget.style.boxShadow = 'none'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }
                    }}
                  >
                    <div style={{ 
                      aspectRatio: '1', 
                      overflow: 'hidden',
                      padding: '0.5rem'
                    }}>
                      <img
                        src={charm.image}
                        alt={charm.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          const el = e.target as HTMLImageElement
                          if (!el) return
                          el.style.display = 'none'
                          const parent = el.parentNode as HTMLElement
                          if (parent) {
                            parent.innerHTML = `
                              <div style="
                                width: 100%;
                                height: 100%;
                                background-color: #f5f5f5;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 0.75rem;
                                color: #999;
                                font-weight: 300;
                                letter-spacing: 1px;
                              ">
                                No Image
                              </div>
                            `
                          }
                        }}
                      />
                    </div>
                    {charm.price !== undefined && (
                      <div style={{
                        padding: '0.75rem',
                        borderTop: '1px solid #e0e0e0',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#000'
                      }}>
                        {charm.price.toLocaleString('vi-VN')} ₫
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Charm Pagination */}
              {Math.ceil(charms.length / charmsPerPage) > 1 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: '1.5rem'
                }}>
                  <button
                    onClick={() => setCharmPage(p => Math.max(1, p - 1))}
                    disabled={charmPage === 1}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: charmPage === 1 ? '#f5f5f5' : '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                      cursor: charmPage === 1 ? 'not-allowed' : 'pointer',
                      opacity: charmPage === 1 ? 0.5 : 1
                    }}
                  >
                    <LeftOutlined style={{ fontSize: '0.75rem' }} />
                  </button>
                  
                  {Array.from({ length: Math.ceil(charms.length / charmsPerPage) }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCharmPage(page)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        backgroundColor: charmPage === page ? '#000' : '#fff',
                        color: charmPage === page ? '#fff' : '#000',
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: charmPage === page ? '600' : '400',
                        minWidth: '2rem'
                      }}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCharmPage(p => Math.min(Math.ceil(charms.length / charmsPerPage), p + 1))}
                    disabled={charmPage === Math.ceil(charms.length / charmsPerPage)}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: charmPage === Math.ceil(charms.length / charmsPerPage) ? '#f5f5f5' : '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                      cursor: charmPage === Math.ceil(charms.length / charmsPerPage) ? 'not-allowed' : 'pointer',
                      opacity: charmPage === Math.ceil(charms.length / charmsPerPage) ? 0.5 : 1
                    }}
                  >
                    <RightOutlined style={{ fontSize: '0.75rem' }} />
                  </button>
                </div>
              )}
              </>
              )}
                </div>
              ) : (
                <div>
              {/* Templates Grid */}
              {templates.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '3rem 1rem',
                  color: '#999',
                  fontSize: '0.875rem'
                }}>
                  Chưa có mẫu trang sức nào
                </div>
              ) : (
                <>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '1rem',
                marginBottom: '2rem'
              }}>
                {templates
                  .slice((templatePage - 1) * templatesPerPage, templatePage * templatesPerPage)
                  .map((template) => (
                  <div 
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.image)}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      border: selectedTemplate === template.image ? '2px solid #666' : '1px solid #e0e0e0',
                      overflow: 'hidden',
                      boxShadow: selectedTemplate === template.image ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#999'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      if (selectedTemplate !== template.image) {
                        e.currentTarget.style.borderColor = '#e0e0e0'
                        e.currentTarget.style.boxShadow = 'none'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }
                    }}
                  >
                    <div style={{ 
                      aspectRatio: '1', 
                      overflow: 'hidden',
                      padding: '0.5rem'
                    }}>
                      <img
                        src={template.image}
                        alt={template.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          const el = e.target as HTMLImageElement
                          if (!el) return
                          el.style.display = 'none'
                          const parent = el.parentNode as HTMLElement
                          if (parent) {
                            parent.innerHTML = `
                              <div style="
                                width: 100%;
                                height: 100%;
                                background-color: #f5f5f5;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 0.75rem;
                                color: #999;
                                font-weight: 300;
                                letter-spacing: 1px;
                              ">
                                No Image
                              </div>
                            `
                          }
                        }}
                      />
                    </div>
                    {template.price !== undefined && (
                      <div style={{
                        padding: '0.75rem',
                        borderTop: '1px solid #e0e0e0',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#000'
                      }}>
                        {template.price.toLocaleString('vi-VN')} ₫
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Template Pagination */}
              {Math.ceil(templates.length / templatesPerPage) > 1 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: '1.5rem'
                }}>
                  <button
                    onClick={() => setTemplatePage(p => Math.max(1, p - 1))}
                    disabled={templatePage === 1}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: templatePage === 1 ? '#f5f5f5' : '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                      cursor: templatePage === 1 ? 'not-allowed' : 'pointer',
                      opacity: templatePage === 1 ? 0.5 : 1
                    }}
                  >
                    <LeftOutlined style={{ fontSize: '0.75rem' }} />
                  </button>
                  
                  {Array.from({ length: Math.ceil(templates.length / templatesPerPage) }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setTemplatePage(page)}
                      style={{
                        padding: '0.5rem 0.75rem',
                        backgroundColor: templatePage === page ? '#000' : '#fff',
                        color: templatePage === page ? '#fff' : '#000',
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: templatePage === page ? '600' : '400',
                        minWidth: '2rem'
                      }}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setTemplatePage(p => Math.min(Math.ceil(templates.length / templatesPerPage), p + 1))}
                    disabled={templatePage === Math.ceil(templates.length / templatesPerPage)}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: templatePage === Math.ceil(templates.length / templatesPerPage) ? '#f5f5f5' : '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                      cursor: templatePage === Math.ceil(templates.length / templatesPerPage) ? 'not-allowed' : 'pointer',
                      opacity: templatePage === Math.ceil(templates.length / templatesPerPage) ? 0.5 : 1
                    }}
                  >
                    <RightOutlined style={{ fontSize: '0.75rem' }} />
                  </button>
                </div>
              )}
              </>
              )}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Design Preview */}
          <div style={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
          }}>
            {/* Original / Main Design Stage */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              padding: '3rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              border: '1px solid #e0e0e0',
              minHeight: '500px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)'
            }}>
              {enhancedImageUrl && (
                <h2 style={{ 
                  color: '#000000', 
                  fontSize: '1rem', 
                  fontWeight: '300', 
                  marginBottom: '2.5rem',
                  position: 'absolute',
                  top: '2rem',
                  left: '3rem',
                  zIndex: 10,
                  letterSpacing: '2px',
                  textTransform: 'uppercase'
                }}>
                  Thiết Kế Đã Hoàn Thiện
                </h2>
              )}

              {/* Design Canvas / Stage */}
              <div 
                data-design-canvas
                ref={canvasRef}
                style={{ 
                  width: '750px',
                  height: '750px',
                  backgroundColor: '#fafafa',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '2rem',
                  position: 'relative',
                  border: '1px solid #e0e0e0',
                  overflow: 'hidden',
                  padding: '1rem',
                  boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.03)'
                }}
                onClick={(e) => {
                  // Deselect when clicking on empty canvas area
                  if (e.target === e.currentTarget) {
                    setSelectedPlacedId(null)
                  }
                }}
                onDragOver={(e) => {
                  if (enhancedImageUrl) return
                  e.preventDefault()
                  e.dataTransfer.dropEffect = 'copy'
                }}
                onDrop={(e) => {
                  if (enhancedImageUrl || isDraggingPlaced) return
                  e.preventDefault()
                  if (draggedItem) {
                    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                    const defaultSize = 150
                    const x = e.clientX - rect.left - defaultSize / 2
                    const y = e.clientY - rect.top - defaultSize / 2
                    
                    const newAccessory: PlacedAccessory = {
                      ...draggedItem,
                      id: Date.now(),
                      x: Math.max(0, Math.min(x, rect.width - defaultSize)),
                      y: Math.max(0, Math.min(y, rect.height - defaultSize)),
                      width: defaultSize,
                      height: defaultSize
                    }
                    
                    setPlacedAccessories(prev => [...prev, newAccessory])
                    setDraggedItem(null)
                  }
                }}
              >
                {/* If enhanced -> show enhanced image covering the stage */}
                {enhancedImageUrl ? (
                  <img
                    src={enhancedImageUrl}
                    alt="Thiết kế đã hoàn thiện"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      borderRadius: '0',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      zIndex: 3
                    }}
                  />
                ) : (
                  <>
                    {/* Background template image */}
                    <img
                      src={selectedTemplate}
                      alt="Trang sức"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        borderRadius: '0',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1
                      }}
                      onError={(e) => {
                        const el = e.target as HTMLImageElement
                        if (!el) return
                        el.style.display = 'none'
                      }}
                    />
                    
                    {/* Placed accessories */}
                    {placedAccessories.map((accessory) => {
                      const isSelected = selectedPlacedId === accessory.id
                      return (
                      <div
                        key={accessory.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedPlacedId(accessory.id)
                        }}
                        onMouseDown={(e) => {
                          if (enhancedImageUrl) return
                          
                          const target = e.target as HTMLElement
                          const isResizeHandle = target.classList.contains('resize-handle')
                          
                          if (isResizeHandle) {
                            setIsResizing(true)
                            setSelectedPlacedId(accessory.id)
                            
                            const startX = e.clientX
                            const startY = e.clientY
                            const startWidth = accessory.width
                            
                            const handleMouseMove = (moveEvent: MouseEvent) => {
                              const deltaX = moveEvent.clientX - startX
                              const deltaY = moveEvent.clientY - startY
                              const delta = Math.max(deltaX, deltaY)
                              
                              const newSize = Math.max(50, startWidth + delta)
                              
                              setPlacedAccessories(prev =>
                                prev.map(item =>
                                  item.id === accessory.id
                                    ? { ...item, width: newSize, height: newSize }
                                    : item
                                )
                              )
                            }
                            
                            const handleMouseUp = () => {
                              setIsResizing(false)
                              document.removeEventListener('mousemove', handleMouseMove)
                              document.removeEventListener('mouseup', handleMouseUp)
                            }
                            
                            document.addEventListener('mousemove', handleMouseMove)
                            document.addEventListener('mouseup', handleMouseUp)
                          } else {
                            // Start dragging
                            setIsDraggingPlaced(true)
                            setSelectedPlacedId(accessory.id)
                            
                            const canvas = canvasRef.current
                            if (!canvas) return
                            
                            const canvasRect = canvas.getBoundingClientRect()
                            const startX = e.clientX
                            const startY = e.clientY
                            const startPosX = accessory.x
                            const startPosY = accessory.y
                            
                            const handleMouseMove = (moveEvent: MouseEvent) => {
                              const deltaX = moveEvent.clientX - startX
                              const deltaY = moveEvent.clientY - startY
                              
                              const newX = Math.max(0, Math.min(startPosX + deltaX, canvasRect.width - accessory.width))
                              const newY = Math.max(0, Math.min(startPosY + deltaY, canvasRect.height - accessory.height))
                              
                              setPlacedAccessories(prev =>
                                prev.map(item =>
                                  item.id === accessory.id
                                    ? { ...item, x: newX, y: newY }
                                    : item
                                )
                              )
                            }
                            
                            const handleMouseUp = () => {
                              setIsDraggingPlaced(false)
                              document.removeEventListener('mousemove', handleMouseMove)
                              document.removeEventListener('mouseup', handleMouseUp)
                            }
                            
                            document.addEventListener('mousemove', handleMouseMove)
                            document.addEventListener('mouseup', handleMouseUp)
                          }
                          
                          e.preventDefault()
                        }}
                        style={{
                          position: 'absolute',
                          left: `${accessory.x}px`,
                          top: `${accessory.y}px`,
                          width: `${accessory.width}px`,
                          height: `${accessory.height}px`,
                          zIndex: isSelected ? 10 : 2,
                          cursor: 'move',
                          borderRadius: '4px',
                          overflow: 'visible',
                          border: isSelected ? '2px solid #4A90E2' : '2px solid transparent',
                          boxShadow: isSelected ? '0 0 0 1px rgba(74, 144, 226, 0.3)' : 'none',
                          transition: 'border 0.2s ease'
                        }}
                      >
                        <img
                          src={accessory.image}
                          alt={accessory.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            pointerEvents: 'none',
                            borderRadius: '4px'
                          }}
                        />
                        
                        {/* Delete button - top left corner */}
                        {isSelected && !enhancedImageUrl && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation()
                              setPlacedAccessories(prev => 
                                prev.filter(item => item.id !== accessory.id)
                              )
                              setSelectedPlacedId(null)
                            }}
                            style={{
                              position: 'absolute',
                              left: '-8px',
                              top: '-8px',
                              width: '24px',
                              height: '24px',
                              backgroundColor: '#FF4444',
                              border: '2px solid #ffffff',
                              borderRadius: '50%',
                              cursor: 'pointer',
                              zIndex: 11,
                              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLDivElement).style.backgroundColor = '#CC0000'
                              ;(e.currentTarget as HTMLDivElement).style.transform = 'scale(1.1)'
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLDivElement).style.backgroundColor = '#FF4444'
                              ;(e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'
                            }}
                          >
                            <CloseOutlined style={{ 
                              fontSize: '12px', 
                              color: '#ffffff',
                              pointerEvents: 'none'
                            }} />
                          </div>
                        )}
                        
                        {/* Resize handle - bottom right corner */}
                        {isSelected && !enhancedImageUrl && (
                          <div
                            className="resize-handle"
                            style={{
                              position: 'absolute',
                              right: '-6px',
                              bottom: '-6px',
                              width: '16px',
                              height: '16px',
                              backgroundColor: '#4A90E2',
                              border: '2px solid #ffffff',
                              borderRadius: '50%',
                              cursor: 'nwse-resize',
                              zIndex: 11,
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                            }}
                          />
                        )}
                      </div>
                    )})}
                    
                    {/* Drop zone indicator when dragging */}
                    {draggedItem && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.03)',
                        border: '2px dashed #ccc',
                        borderRadius: '0',
                        zIndex: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none'
                      }}>
                        <div style={{
                          color: '#999',
                          fontSize: '0.9rem',
                          fontWeight: '300',
                          textAlign: 'center',
                          letterSpacing: '2px',
                          textTransform: 'uppercase'
                        }}>
                          Thả vào đây
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                marginTop: '2rem',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
                {!enhancedImageUrl && (
                  <button 
                    onClick={enhanceDesign}
                    disabled={isProcessing || placedAccessories.length === 0}
                    style={{
                      backgroundColor: '#000000',
                      color: '#ffffff',
                      padding: '1rem 2.5rem',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      transition: 'all 0.3s ease',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      opacity: (isProcessing || placedAccessories.length === 0) ? 0.4 : 1,
                      boxShadow: (isProcessing || placedAccessories.length === 0) ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isProcessing && placedAccessories.length > 0) {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#333'
                        ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
                        ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isProcessing) {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#000000'
                        ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
                        ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
                      }
                    }}
                  >
                    {isProcessing ? (
                      <>
                        <LoadingOutlined style={{ fontSize: '0.9rem' }} />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <RobotOutlined style={{ fontSize: '0.9rem' }} />
                        Nhờ AI Hoàn Thiện
                      </>
                    )}
                  </button>
                )}

                {enhancedImageUrl && (
                  <>
                    <button
                      onClick={downloadEnhancedImage}
                      style={{
                        backgroundColor: '#000000',
                        color: '#ffffff',
                        padding: '1rem 2.5rem',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        transition: 'all 0.3s ease',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#333'
                        ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
                        ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)'
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#000000'
                        ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
                        ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
                      }}
                    >
                      <DownloadOutlined style={{ fontSize: '0.9rem' }} />
                      Tải Xuống
                    </button>

                    <button
                      onClick={resetDesign}
                      style={{
                        backgroundColor: '#ffffff',
                        color: '#000000',
                        padding: '1rem 2.5rem',
                        borderRadius: '8px',
                        border: '1px solid #e0e0e0',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        transition: 'all 0.3s ease',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f5f5f5'
                        ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
                        ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.12)'
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#ffffff'
                        ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
                        ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)'
                      }}
                      >
                      <ReloadOutlined style={{ fontSize: '0.9rem' }} />
                      Làm Lại
                    </button>
                  </>
                )}

                {/* Cart Button always visible */}
                <button 
                  onClick={handlePlaceOrder}
                  style={{
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  padding: '1rem 2.5rem',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.3s ease',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f5f5f5'
                  ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
                  ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.12)'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#ffffff'
                  ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
                  ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)'
                }}
                >
                  <ShoppingCartOutlined style={{ fontSize: '0.9rem' }} />
                  Đặt Hàng
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Item Info */}
        {selectedItem && !enhancedImageUrl && (
          <div style={{
            position: 'fixed',
            bottom: '3rem',
            right: '3rem',
            backgroundColor: '#fafafa',
            padding: '1rem 1.75rem',
            borderRadius: '0',
            fontSize: '0.85rem',
            color: '#000000',
            border: '1px solid #e0e0e0',
            fontWeight: '300',
            zIndex: 1000,
            letterSpacing: '1px'
          }}>
            Đã chọn: {selectedItem.name}
          </div>
        )}

      </div>
    </div>
  )
}

export default CustomDesign

