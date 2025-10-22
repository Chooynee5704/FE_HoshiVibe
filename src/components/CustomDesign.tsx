import { useState, useRef } from 'react'
import { SearchOutlined, FilterOutlined, ShoppingCartOutlined, RobotOutlined, LoadingOutlined, ReloadOutlined, DownloadOutlined } from '@ant-design/icons'

type Accessory = {
  id: number
  name: string
  image: string
}

type PlacedAccessory = Accessory & {
  x: number
  y: number
}

type MessageImage = string | {
  image_url?: { url?: string }
  image?: string
  type?: string
  b64?: string
  image_base64?: string
}

type MessageContentBlock = {
  type?: string
  image_url?: { url?: string }
  image?: string
  b64?: string
  image_base64?: string
  [key: string]: unknown
}

type MessageLike = {
  images?: MessageImage[]
  content?: MessageContentBlock[] | string
  [key: string]: unknown
}

const CustomDesign = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState<Accessory | null>(null)
  const [draggedItem, setDraggedItem] = useState<Accessory | null>(null)
  const [placedAccessories, setPlacedAccessories] = useState<PlacedAccessory[]>([])
  const [apiKey, setApiKey] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [enhancedImageUrl, setEnhancedImageUrl] = useState<string | null>(null)
  const [error, setError] = useState('')
  const canvasRef = useRef<HTMLDivElement | null>(null)

  // Mock data for accessories grid with image paths
  const accessories: Accessory[] = [
    { id: 1, name: 'Accessory 1', image: '/accessories/phukien1.jpg' },
    { id: 2, name: 'Accessory 2', image: '/accessories/phukien2.jpg' },
    { id: 3, name: 'Accessory 3', image: '/accessories/phukien3.jpg' },
    { id: 4, name: 'Accessory 4', image: '/accessories/phukien4.jpg' },
    { id: 5, name: 'Accessory 5', image: '/accessories/phukien5.jpg' },
    { id: 6, name: 'Accessory 6', image: '/accessories/phukien6.jpg' },
  ]

  const resetDesign = () => {
    setEnhancedImageUrl(null)
    setPlacedAccessories([])
    setSelectedItem(null)
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
      bgImg.src = '/accessories/mauthietke.jpg'

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
            150 * scale, 
            150 * scale
          )
          finalize()
        }
        img.onerror = finalize
        img.src = accessory.image
      })

      // If no accessories, completion is handled by background onload
    })
  }

  // Try to be robust to different image return shapes from providers
  const extractImageUrlFromMessage = (message: unknown): string | null => {
    if (typeof message !== 'object' || message === null) {
      return null
    }

    const msg = message as MessageLike

    if (Array.isArray(msg.images)) {
      for (const imageData of msg.images) {
        if (typeof imageData === 'string' && (imageData.startsWith('data:image/') || imageData.startsWith('http'))) {
          return imageData
        }

        if (typeof imageData === 'object' && imageData !== null) {
          const structured = imageData as { image_url?: { url?: string } }
          if (structured.image_url?.url) {
            return structured.image_url.url
          }
        }
      }
    }

    const content = msg.content

    if (Array.isArray(content)) {
      for (const block of content as MessageContentBlock[]) {
        if (block?.type === 'output_image' && block?.image_url?.url) return block.image_url.url
        if (block?.type === 'image_url' && typeof block.image_url?.url === 'string') return block.image_url.url
        if (block?.type === 'image' && typeof block.image === 'string' && block.image.startsWith('data:image/')) return block.image

        if (block?.type === 'image') {
          const base64Candidate = typeof block.b64 === 'string' ? block.b64 : typeof block.image_base64 === 'string' ? block.image_base64 : undefined
          if (base64Candidate) {
            return 'data:image/png;base64,' + base64Candidate
          }
        }
      }
    }

    if (typeof content === 'string' && content.startsWith('data:image/')) {
      return content
    }

    return null
  }

  const enhanceDesign = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your OpenRouter API key')
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      const base64Image = await captureCanvas()
      if (!base64Image) {
        throw new Error('Failed to capture design canvas')
      }

      const requestBody = {
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Make all accessories craft on the necklace style and color scheme. Enhance the overall design to be more cohesive and elegant.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      }

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Custom Jewelry Design'
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const message = data?.choices?.[0]?.message
      if (!message) throw new Error('No response message received')

      // Prefer robust content scan first
      const extracted = extractImageUrlFromMessage(message)
      if (extracted) {
        setEnhancedImageUrl(extracted)
        return
      }

      // Fallback to legacy shape already in your code
      if (message.images && Array.isArray(message.images) && message.images.length > 0) {
        const imageData = message.images[0]
        let imageUrl: string | null = null
        
        if (typeof imageData === 'string') {
          imageUrl = imageData
        } else if (typeof imageData === 'object' && imageData !== null) {
          if (imageData.image_url && imageData.image_url.url) {
            imageUrl = imageData.image_url.url
          }
        }
        
        if (imageUrl && typeof imageUrl === 'string' && (imageUrl.startsWith('data:image/') || imageUrl.startsWith('http'))) {
          setEnhancedImageUrl(imageUrl)
          return
        }
      }

      throw new Error('No enhanced image received from AI')

    } catch (err) {
      console.error('Enhancement error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred while enhancing the design')
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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white', paddingTop: '2rem' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
        {/* Header */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '2rem'
        }}>
          <h1
            style={{
              color: 'black',
              fontSize: '1.75rem',
              fontWeight: '700',
              margin: 0,
              letterSpacing: '0.5px'
            }}
          >
            CUSTOMIZE YOUR JEWELRY
          </h1>
        </div>

        {/* API Key Input */}
        <div style={{ 
          maxWidth: '600px', 
          margin: '0 auto 2rem auto',
          backgroundColor: '#f9fafb',
          padding: '1.5rem',
          borderRadius: '1rem',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
        }}>
          <label style={{ 
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '0.5rem'
          }}>
            OpenRouter API Key (for AI Enhancement)
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your OpenRouter API key"
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid #d1d5db',
              fontSize: '0.875rem',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />
        </div>

        {/* Error Display */}
        {error && (
          <div style={{
            maxWidth: '600px',
            margin: '0 auto 2rem auto',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '1rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '2rem', minHeight: '70vh' }}>
          {/* Left Panel - Accessories */}
          <div style={{ 
            width: '400px',
            backgroundColor: 'black',
            borderRadius: '2rem',
            padding: '2rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ 
              color: 'white', 
              fontSize: '1.75rem', 
              fontWeight: '700', 
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              Accessories
            </h2>

            {/* Search Bar */}
            <div style={{ 
              position: 'relative', 
              marginBottom: '2rem' 
            }}>
              <input
                type="text"
                placeholder="Search accessories"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1rem 1.25rem 1rem 3rem',
                  borderRadius: '1rem',
                  border: 'none',
                  backgroundColor: 'white',
                  fontSize: '1rem',
                  outline: 'none',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                  fontFamily: 'inherit'
                }}
              />
              <SearchOutlined style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6b7280',
                fontSize: '1.25rem'
              }} />
              <FilterOutlined style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6b7280',
                fontSize: '1.25rem',
                cursor: 'pointer',
                transition: 'color 0.3s ease'
              }} />
            </div>

            {/* Accessories Grid */}
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1.5rem'
            }}>
              {accessories
                .filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((accessory) => (
                <div 
                  key={accessory.id}
                  draggable={!enhancedImageUrl}
                  onDragStart={(e) => {
                    if (enhancedImageUrl) return
                    setDraggedItem(accessory)
                    e.dataTransfer.effectAllowed = 'copy'
                  }}
                  onDragEnd={() => setDraggedItem(null)}
                  onClick={() => setSelectedItem(accessory)}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '1rem',
                    aspectRatio: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: enhancedImageUrl ? 'not-allowed' : 'grab',
                    transition: 'all 0.3s ease',
                    border: selectedItem?.id === accessory.id ? '3px solid #d4b896' : '3px solid transparent',
                    boxShadow: selectedItem?.id === accessory.id ? '0 8px 25px rgba(212, 184, 150, 0.3)' : '0 4px 15px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                    padding: '0.5rem',
                    opacity: draggedItem?.id === accessory.id ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (selectedItem?.id !== accessory.id) {
                      e.currentTarget.style.transform = 'translateY(-5px)'
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedItem?.id !== accessory.id) {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                >
                  <img
                    src={accessory.image}
                    alt={accessory.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '0.5rem'
                    }}
                    onError={(e) => {
                      const el = e.target as HTMLImageElement
                      if (!el) return
                      el.style.display = 'none'
                      const parent = el.parentNode as HTMLElement
                      if (parent) {
                        parent.innerHTML = `
                          <div style="
                            width: 70%;
                            height: 70%;
                            background-color: #f3f4f6;
                            border-radius: 0.75rem;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 0.875rem;
                            color: #6b7280;
                            font-weight: 500;
                          ">
                            ${accessory.name}
                          </div>
                        `
                      }
                    }}
                  />
                </div>
              ))}
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
              backgroundColor: '#f5f3f0',
              borderRadius: '2rem',
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              minHeight: '400px'
            }}>
              <h2 style={{ 
                color: 'black', 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                marginBottom: '2rem',
                position: 'absolute',
                top: '1.5rem',
                left: '2.5rem',
                zIndex: 10
              }}>
                {enhancedImageUrl ? 'Design enhanced by AI. Download or reset to continue editing.' : 'Original Design'}
              </h2>

              {/* Design Canvas / Stage */}
              <div 
                data-design-canvas
                ref={canvasRef}
                style={{ 
                  width: '800px',
                  height: '800px',
                  backgroundColor: 'white',
                  borderRadius: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                  marginTop: '2rem',
                  position: 'relative',
                  border: '1px solid #e5e7eb',
                  overflow: 'hidden',
                  padding: '1rem'
                }}
                onDragOver={(e) => {
                  if (enhancedImageUrl) return // locked after enhance
                  e.preventDefault()
                  e.dataTransfer.dropEffect = 'copy'
                }}
                onDrop={(e) => {
                  if (enhancedImageUrl) return // locked after enhance
                  e.preventDefault()
                  if (draggedItem) {
                    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                    const x = e.clientX - rect.left - 50
                    const y = e.clientY - rect.top - 50
                    
                    const newAccessory: PlacedAccessory = {
                      ...draggedItem,
                      id: Date.now(),
                      x: Math.max(0, Math.min(x, rect.width - 100)),
                      y: Math.max(0, Math.min(y, rect.height - 100))
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
                    alt="Enhanced Design"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      borderRadius: '0.75rem',
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
                      src="/accessories/mauthietke.jpg"
                      alt="Design Template"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        borderRadius: '0.75rem',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1
                      }}
                      onError={(e) => {
                        const el = e.target as HTMLImageElement
                        if (!el) return
                        el.style.display = 'none'
                        const parent = el.parentNode as HTMLElement
                        if (parent) {
                          parent.innerHTML = `
                            <div style="
                              font-size: 2rem;
                              color: #9ca3af;
                              font-weight: 700;
                              text-align: center;
                              letter-spacing: 2px;
                              position: absolute;
                              top: 50%;
                              left: 50%;
                              transform: translate(-50%, -50%);
                              z-index: 1;
                            ">
                              DESIGN TEMPLATE
                            </div>
                          `
                        }
                      }}
                    />
                    
                    {/* Placed accessories */}
                    {placedAccessories.map((accessory) => (
                      <div
                        key={accessory.id}
                        style={{
                          position: 'absolute',
                          left: `${accessory.x}px`,
                          top: `${accessory.y}px`,
                          width: '200px',
                          height: '200px',
                          zIndex: 2,
                          cursor: 'move',
                          borderRadius: '0.5rem',
                          overflow: 'hidden',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                        }}
                        onDoubleClick={() => {
                          setPlacedAccessories(prev => 
                            prev.filter(item => item.id !== accessory.id)
                          )
                        }}
                      >
                        <img
                          src={accessory.image}
                          alt={accessory.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            pointerEvents: 'none'
                          }}
                        />
                      </div>
                    ))}
                    
                    {/* Drop zone indicator when dragging */}
                    {draggedItem && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(212, 184, 150, 0.1)',
                        border: '2px dashed #d4b896',
                        borderRadius: '0.75rem',
                        zIndex: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'none'
                      }}>
                        <div style={{
                          color: '#d4b896',
                          fontSize: '1rem',
                          fontWeight: '600',
                          textAlign: 'center'
                        }}>
                          Drop accessories here
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '0.75rem',
                marginTop: '1.5rem',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
                {!enhancedImageUrl && (
                  <button 
                    onClick={enhanceDesign}
                    disabled={isProcessing || !apiKey.trim() || placedAccessories.length === 0}
                    style={{
                      backgroundColor: '#7c3aed',
                      color: 'white',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '1.5rem',
                      border: 'none',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)',
                      opacity: (isProcessing || !apiKey.trim() || placedAccessories.length === 0) ? 0.6 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (!isProcessing && apiKey.trim() && placedAccessories.length > 0) {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#6d28d9'
                        ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isProcessing) {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#7c3aed'
                        ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
                      }
                    }}
                  >
                    {isProcessing ? (
                      <>
                        <LoadingOutlined style={{ fontSize: '1rem' }} />
                        ang x l...
                      </>
                    ) : (
                      <>
                        <RobotOutlined style={{ fontSize: '1rem' }} />
                        Enhance with AI
                      </>
                    )}
                  </button>
                )}

                {enhancedImageUrl && (
                  <>
                    <button
                      onClick={downloadEnhancedImage}
                      style={{
                        backgroundColor: '#0ea5e9',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '1.5rem',
                        border: 'none',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)'
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#0284c7'
                        ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#0ea5e9'
                        ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
                      }}
                    >
                      <DownloadOutlined style={{ fontSize: '1rem' }} />
                      Download
                    </button>

                    <button
                      onClick={resetDesign}
                      style={{
                        backgroundColor: '#111827',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '1.5rem',
                        border: 'none',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#000000'
                        ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#111827'
                        ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
                      }}
                    >
                      <ReloadOutlined style={{ fontSize: '1rem' }} />
                      Reset
                    </button>
                  </>
                )}

                {/* Cart Button  always visible */}
                <button style={{
                  backgroundColor: '#111827',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '1.5rem',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#000000'
                  ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#111827'
                  ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
                }}
                >
                  <ShoppingCartOutlined style={{ fontSize: '1rem' }} />
                  CHECKOUT
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Item Info */}
        {selectedItem && !enhancedImageUrl && (
          <div style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '0.75rem 1.5rem',
            borderRadius: '1rem',
            fontSize: '0.95rem',
            color: '#374151',
            backdropFilter: 'blur(15px)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            fontWeight: '500',
            zIndex: 1000
          }}>
            Selected: {selectedItem.name}
          </div>
        )}

        {/* Instructions */}
        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          color: '#6b7280',
          fontSize: '0.95rem'
        }}>
          {!enhancedImageUrl ? (
            <>
              <p>Drag accessories from the left panel onto your design, then press "Enhance with AI".</p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                Tip: Double-click an accessory on the canvas to remove it.
              </p>
            </>
          ) : (
            <p>Design enhanced by AI. Download or reset to continue editing.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CustomDesign

