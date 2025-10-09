import { useState, useEffect, useRef } from 'react'
import { ShoppingCart, Star, Heart, Share2, Minus, Plus, ArrowLeft, ArrowRight, ShieldCheck, RefreshCw, Truck } from 'lucide-react'
import type { PageKey } from '../types/navigation'

interface ProductDetailProps {
  onNavigate?: (page: PageKey) => void;
  onAddToCart?: (quantity: number) => void;
  productId?: number;
}

const formatVND = (n: number) =>
  n.toLocaleString('vi-VN', { maximumFractionDigits: 0 }) + ' VNĐ'

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max)

const ProductDetail = ({ onNavigate, onAddToCart, productId = 1 }: ProductDetailProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState('Đá ngũ sắc')
  const [selectedCharm, setSelectedCharm] = useState('Charm')
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [activeTab, setActiveTab] = useState<'desc' | 'feature' | 'care' | 'ship'>('desc')
  const [toast, setToast] = useState<string | null>(null)

  const sectionRef = useRef<HTMLElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 1800)
    return () => clearTimeout(t)
  }, [toast])

  const product = {
    id: 1,
    name: 'VÒNG TAY HẠNH PHÚC',
    price: 150000,
    originalPrice: 200000,
    rating: 5,
    reviews: 4,
    images: [
      '/item/Vòng Tay Bạc 925 Nữ Đính 2 Viên Đá.jpg',
      '/item/Vòng Tay Đá Thô.jpg',
      '/item/Vòng Tay Chỉ Đỏ Đính Đá Handmade Lu Thống.jpg',
      '/item/Vòng Tay Đá Mài Giác Cho Nữ.jpg'
    ],
    description:
      'Vòng tay phong thủy tối giản tông đen–trắng, chế tác từ đá tự nhiên cao cấp. Thiết kế tập trung vào sự cân bằng năng lượng, phù hợp mix mọi outfit hằng ngày.',
    features: [
      'Đá tự nhiên tuyển chọn – cắt mài chuẩn',
      'Thiết kế tối giản, nhấn mạnh hình khối & texture',
      'Dây đàn hồi cao cấp, bền & thoải mái',
      'Bảo hành trọn đời – thay dây miễn phí'
    ],
    careInstructions: [
      'Tránh nước biển, hoá chất mạnh & mồ hôi muối lâu ngày',
      'Cất khô trong túi vải khi không dùng',
      'Vệ sinh bằng khăn mềm ẩm mỗi 2–3 tháng'
    ]
  }

  const relatedProducts = [
    { id: 2, name: 'Vòng Tay May Mắn', price: 180000, image: '/item/Dây Chuyền Bạc Nữ 2 Hạt Đá.jpg' },
    { id: 3, name: 'Vòng Tay Thịnh Vượng', price: 200000, image: '/item/Vòng Tay Đá Thô.jpg' },
    { id: 4, name: 'Vòng Tay Bình An', price: 160000, image: '/item/Dây Chuyền Bạc Nữ 925.jpg' },
    { id: 5, name: 'Vòng Tay Tài Lộc', price: 190000, image: '/item/Vòng Tay Chuỗi Hạt 108 Đá Phong Thuỷ Tự Nhiên.jpg' }
  ]

  const reviews = [
    {
      id: 1,
      name: 'MyLinh',
      rating: 5,
      comment: 'Form tối giản đeo rất “chic”. Đá bóng đẹp, đóng gói chỉn chu.',
      date: '2 ngày trước',
      avatar: '/team/NguyenThiPhuongMai.jpg'
    },
    {
      id: 2,
      name: 'MinhDuy',
      rating: 5,
      comment: 'Giao nhanh, đúng mô tả. Dây chắc, lên tay ôm vừa.',
      date: '1 tuần trước',
      avatar: '/team/BuiMinhDuy.jpg'
    },
    {
      id: 3,
      name: 'BaoMy',
      rating: 5,
      comment: 'Mix đồ đen–trắng quá hợp vibe. Sẽ mua thêm cho bạn.',
      date: '2 tuần trước',
      avatar: '/team/NgoDuyBaoMy.jpg'
    }
  ]

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0

  const handleAddToCart = () => {
    // Fly to cart animation
    try {
      const cartEl = document.getElementById('nav-cart-icon')
      const stage = document.querySelector('.pd__stage') as HTMLElement | null
      if (cartEl && stage) {
        const imgEl = stage.querySelector('img') as HTMLImageElement | null
        const rectStart = (imgEl || stage).getBoundingClientRect()
        const rectEnd = cartEl.getBoundingClientRect()
        const ghost = document.createElement('img')
        ghost.src = imgEl?.src || ''
        ghost.className = 'fly-img'
        ghost.style.left = rectStart.left + 'px'
        ghost.style.top = rectStart.top + 'px'
        ghost.style.width = rectStart.width * 0.4 + 'px'
        ghost.style.height = rectStart.height * 0.4 + 'px'
        document.body.appendChild(ghost)

        const deltaX = rectEnd.left + rectEnd.width / 2 - (rectStart.left + rectStart.width * 0.2)
        const deltaY = rectEnd.top + rectEnd.height / 2 - (rectStart.top + rectStart.height * 0.2)

        ghost.animate([
          { transform: 'translate(0,0) scale(1)', opacity: 1 },
          { transform: `translate(${deltaX * 0.6}px, ${deltaY * 0.6}px) scale(0.6)`, opacity: 0.9 },
          { transform: `translate(${deltaX}px, ${deltaY}px) scale(0.2)`, opacity: 0.1 }
        ], { duration: 700, easing: 'cubic-bezier(.22,.61,.36,1)' }).onfinish = () => {
          ghost.remove()
          cartEl.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(1.25)' },
            { transform: 'scale(1)' }
          ], { duration: 250 })
        }
      }
    } catch {}

    setToast('Đã thêm vào giỏ hàng')
    onAddToCart?.(quantity)
    console.log('Added to cart:', { productId, quantity, selectedStyle, selectedCharm })
  }

  const handleBuyNow = () => {
    setToast('Đi tới thanh toán…')
    // hook checkout here
    console.log('Buy now:', { productId, quantity, selectedStyle, selectedCharm })
  }

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change))
  }

  const handleImageChange = (index: number) => {
    setCurrentImageIndex(index)
    galleryRef.current?.querySelectorAll<HTMLDivElement>('.pd__thumb').forEach((el, i) => {
      if (i === index) el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    })
  }

  const handlePreviousImage = () => {
    setCurrentImageIndex(prev => (prev === 0 ? product.images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setCurrentImageIndex(prev => (prev === product.images.length - 1 ? 0 : prev + 1))
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    setToast(!isWishlisted ? 'Đã thêm Yêu thích' : 'Đã bỏ Yêu thích')
  }

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url })
      } else {
        await navigator.clipboard.writeText(url)
        setToast('Đã copy link')
      }
    } catch {
      setToast('Không thể chia sẻ')
    }
  }

  return (
    <>
      <style>{`
        :root {
          --bg: #ffffff;
          --fg: #0a0a0a;
          --muted: #6b7280;
          --line: #e5e7eb;
          --card: #f8f9fa;
          --ink: #000000;
          --shadow: 0 10px 30px rgba(0,0,0,0.08);
          --radius: 16px;
        }
        .pd { background: var(--bg); color: var(--fg); }
        .pd__container { max-width: 1200px; margin: 0 auto; padding: 32px 24px; }
        .pd__breadcrumb { font-size: 14px; color: var(--muted); display:flex; gap:8px; align-items:center; }
        .pd__crumb { cursor:pointer; transition:color .2s ease; }
        .pd__crumb:hover { color: var(--ink); }
        .pd__grid { display:grid; grid-template-columns: 1.1fr .9fr; gap:48px; margin-top:24px; }
        .pd__gallery { position: sticky; top: 24px; display:flex; flex-direction:column; gap:12px; }
        .pd__stage { position:relative; height:560px; background:#f6f6f6; border:1px solid var(--line); border-radius: var(--radius); overflow:hidden; box-shadow: var(--shadow); }
        .pd__img { width:100%; height:100%; object-fit:cover; transition: transform .35s ease; }
        .pd__stage:hover .pd__img { transform: scale(1.03); }
        .pd__navbtn { position:absolute; top:50%; transform:translateY(-50%); width:44px; height:44px; border-radius:999px; border:none; background:rgba(0,0,0,.7); color:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; transition: all .2s; }
        .pd__navbtn:hover { background:rgba(0,0,0,.9); transform:translateY(-50%) scale(1.05); }
        .pd__navbtn--l { left:12px; } .pd__navbtn--r { right:12px; }

        .pd__thumbs { display:flex; gap:10px; overflow:auto; padding:6px; }
        .pd__thumb { min-width:84px; height:84px; border:2px solid var(--line); border-radius:12px; overflow:hidden; cursor:pointer; transition: all .2s; background:#f6f6f6; }
        .pd__thumb img { width:100%; height:100%; object-fit:cover; }
        .pd__thumb:hover { transform: scale(1.03); border-color:#000; }
        .pd__thumb--active { border-color:#000; transform: scale(1.03); }

        .pd__info { display:flex; flex-direction:column; gap:20px; }
        .pd__title { font-size: 40px; font-weight: 900; letter-spacing:.04em; text-transform:uppercase; line-height:1.1; }
        .pd__price { display:flex; align-items:baseline; gap:12px; }
        .pd__price-now { font-size: 28px; font-weight: 900; }
        .pd__price-old { font-size:16px; color:var(--muted); text-decoration: line-through; }
        .pd__badge { display:inline-flex; align-items:center; gap:6px; font-size:12px; font-weight:700; letter-spacing:.06em; padding:6px 10px; border:1px solid var(--ink); border-radius:999px; text-transform:uppercase; }

        .pd__rating { display:flex; align-items:center; gap:8px; color:var(--muted); }
        .pd__stars { display:flex; gap:2px; }

        .pd__opt { margin-top:10px; }
        .pd__label { font-size:14px; font-weight:700; margin-bottom:10px; }
        .pd__opts { display:flex; gap:10px; flex-wrap:wrap; }
        .pd__chip { padding:10px 14px; border:1.5px solid var(--line); border-radius:12px; background:#fff; cursor:pointer; font-weight:600; transition: all .2s; }
        .pd__chip:hover { transform: translateY(-2px); box-shadow: var(--shadow); }
        .pd__chip--active { background:#000; color:#fff; border-color:#000; transform: translateY(-2px); }

        .pd__qty { display:flex; align-items:center; gap:12px; }
        .pd__qtybtn { width:40px; height:40px; border-radius:10px; border:1.5px solid var(--line); background:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; transition: all .15s; }
        .pd__qtybtn:hover { background:#f3f4f6; transform: scale(1.05); }
        .pd__qtyinput { width:84px; height:40px; text-align:center; border:1.5px solid var(--line); border-radius:10px; font-weight:700; outline:none; }

        .pd__cta { display:flex; flex-direction:column; gap:10px; }
        .pd__btn { width:100%; padding:16px; border-radius:14px; border:2px solid #000; font-weight:800; letter-spacing:.06em; cursor:pointer; transition: transform .15s, box-shadow .2s, background .2s, color .2s; text-transform:uppercase; }
        .pd__btn--primary { background:#000; color:#fff; border-color:#000; }
        .pd__btn--primary:hover { transform: translateY(-2px); box-shadow: var(--shadow); }
        .pd__btn--ghost { background:#fff; color:#000; }
        .pd__btn--ghost:hover { transform: translateY(-2px); box-shadow: var(--shadow); background:#f3f4f6; }

        .pd__inline { display:flex; gap:10px; }
        .pd__wish { display:flex; align-items:center; gap:8px; padding:10px 14px; border:1.5px solid var(--line); border-radius:12px; cursor:pointer; background:#fff; color:${isWishlisted ? '#ef4444' : 'var(--muted)'}; }
        .pd__meta { display:flex; gap:18px; color:var(--muted); font-size:13px; align-items:center; flex-wrap:wrap; }

        .pd__note, .pd__reviews, .pd__related, .pd__tabs { background: var(--card); border:1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow); }
        .pd__note { padding:20px; }
        .pd__note h3 { margin:0 0 8px 0; font-size:18px; }
        .pd__list { margin:0; padding-left:18px; line-height:1.8; color:#374151; }

        .pd__tabs { margin-top:6px; }
        .pd__tabbar { display:flex; gap:8px; padding:8px; border-bottom:1px solid var(--line); }
        .pd__tab { padding:10px 14px; border-radius:10px; border:1px solid transparent; cursor:pointer; font-weight:700; font-size:13px; color:var(--muted); }
        .pd__tab--active { color:#000; border-color:#000; }
        .pd__tabpanel { padding:18px; color:#374151; line-height:1.7; }

        .pd__reviews { padding:24px; }
        .pd__rv { background:#fff; border:1px solid var(--line); border-radius:14px; padding:16px; transition: transform .2s, box-shadow .2s; }
        .pd__rv:hover { transform: translateY(-3px); box-shadow: var(--shadow); }
        .pd__rvh { display:flex; align-items:center; gap:12px; margin-bottom:8px; }
        .pd__avatar { width:40px; height:40px; border-radius:999px; overflow:hidden; background:#eee; display:flex; align-items:center; justify-content:center; font-weight:800; color:var(--muted); }

        .pd__related { padding:24px; }
        .pd__relgrid { display:grid; grid-template-columns: repeat(4, 1fr); gap:18px; }
        .pd__card { border:1px solid var(--line); border-radius:16px; overflow:hidden; background:#fff; box-shadow: var(--shadow); cursor:pointer; transition: transform .2s, box-shadow .2s; }
        .pd__card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.12); }
        .pd__cardimg { height:200px; background:#f6f6f6; }
        .pd__cardimg img { width:100%; height:100%; object-fit:cover; }
        .pd__cardbody { padding:16px; }
        .pd__relname { font-weight:700; margin:0 0 6px 0; }
        .pd__relrow { display:flex; align-items:center; justify-content:space-between; }

        .pd__toast { position: fixed; left: 50%; bottom: 24px; transform: translateX(-50%); background:#000; color:#fff; padding:12px 16px; border-radius:12px; box-shadow: var(--shadow); font-weight:700; letter-spacing:.02em; }

        /* Mobile sticky bar */
        .pd__sticky { position: sticky; bottom: 0; background: rgba(255,255,255,.9); backdrop-filter: blur(6px); border-top:1px solid var(--line); padding:10px; display:none; gap:10px; }

        /* Animations / entrance */
        .pd__fadeUp { opacity: ${isVisible ? 1 : 0}; transform: translateY(${isVisible ? 0 : '20px'}); transition: all .6s ease; }

        /* Responsive */
        @media (max-width: 1024px) {
          .pd__grid { grid-template-columns: 1fr; gap:28px; }
          .pd__stage { height: 56vw; max-height: 540px; }
          .pd__title { font-size: 32px; }
          .pd__relgrid { grid-template-columns: repeat(2, 1fr); }
          .pd__sticky { display:flex; }
        }
        @media (max-width: 560px) {
          .pd__container { padding: 20px 16px; }
          .pd__title { font-size: 28px; }
          .pd__badge { display:none; }
          .pd__relgrid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="pd" aria-live="polite">
        <style>{`.fly-img{position:fixed;z-index:9999;width:120px;height:120px;border-radius:8px;object-fit:cover;pointer-events:none;box-shadow:0 10px 30px rgba(0,0,0,.2);}`}</style>
        {/* Breadcrumb */}
        <div style={{ borderBottom: '1px solid var(--line)', background: '#fafafa' }}>
          <div className="pd__container" style={{ paddingTop: 16, paddingBottom: 16 }}>
            <div className="pd__breadcrumb">
              <span className="pd__crumb" onClick={() => onNavigate?.('home')}>TRANG CHỦ</span>
              <span>›</span>
              <span className="pd__crumb" onClick={() => onNavigate?.('search')}>VÒNG TAY</span>
              <span>›</span>
              <span style={{ color: '#000', fontWeight: 700 }}>{product.name}</span>
            </div>
          </div>
        </div>

        {/* Main */}
        <section ref={sectionRef} className="pd__container pd__fadeUp">
          <div className="pd__grid">
            {/* Gallery */}
            <div className="pd__gallery" aria-label="Bộ sưu tập hình ảnh sản phẩm">
              <div className="pd__stage" role="region" aria-roledescription="carousel" aria-label="Hình sản phẩm">
                {discount > 0 && (
                  <div style={{
                    position:'absolute', top:12, left:12,
                    background:'#fff', border:'1px solid #000', borderRadius:999, padding:'6px 10px',
                    fontSize:12, fontWeight:900, letterSpacing:'.06em'
                  }}>
                    -{discount}%
                  </div>
                )}
                <img
                  src={product.images[currentImageIndex]}
                  alt={`${product.name} – ảnh ${currentImageIndex + 1}`}
                  className="pd__img"
                />
                <button aria-label="Ảnh trước" className="pd__navbtn pd__navbtn--l" onClick={handlePreviousImage}>
                  <ArrowLeft size={18}/>
                </button>
                <button aria-label="Ảnh sau" className="pd__navbtn pd__navbtn--r" onClick={handleNextImage}>
                  <ArrowRight size={18}/>
                </button>
              </div>

              <div ref={galleryRef} className="pd__thumbs" role="tablist" aria-label="Ảnh nhỏ">
                {product.images.map((img, i) => (
                  <div
                    key={i}
                    className={`pd__thumb ${currentImageIndex === i ? 'pd__thumb--active' : ''}`}
                    onClick={() => handleImageChange(i)}
                    role="tab"
                    aria-selected={currentImageIndex === i}
                    aria-controls={`image-${i}`}
                  >
                    <img src={img} alt={`Xem ảnh ${i + 1}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="pd__info">
              <div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-start', gap:12, marginBottom:8 }}>
                  <h1 className="pd__title">{product.name}</h1>
                </div>

                <div className="pd__price">
                  <span className="pd__price-now">{formatVND(product.price)}</span>
                  {product.originalPrice && (
                    <span className="pd__price-old">{formatVND(product.originalPrice)}</span>
                  )}
                </div>

                <div className="pd__rating" aria-label={`Đánh giá ${product.rating} sao từ ${product.reviews} lượt`}>
                  <div className="pd__stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={18} fill="#000000" stroke="#000000" />
                    ))}
                  </div>
                  <span>({product.reviews} đánh giá)</span>
                </div>
              </div>

              {/* Options */}
              <div className="pd__opt">
                <div style={{ marginBottom:18 }}>
                  <div className="pd__label">Kiểu</div>
                  <div className="pd__opts">
                    {['Đá ngũ sắc', 'Đá đỏ', 'Đá xanh', 'Đá vàng'].map(style => (
                      <button
                        key={style}
                        className={`pd__chip ${selectedStyle === style ? 'pd__chip--active' : ''}`}
                        onClick={() => setSelectedStyle(style)}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom:18 }}>
                  <div className="pd__label">Charm</div>
                  <div className="pd__opts">
                    {['Charm', 'Không charm'].map(charm => (
                      <button
                        key={charm}
                        className={`pd__chip ${selectedCharm === charm ? 'pd__chip--active' : ''}`}
                        onClick={() => setSelectedCharm(charm)}
                      >
                        {charm}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom:6 }}>
                  <div className="pd__label">Số lượng</div>
                  <div className="pd__qty">
                    <button className="pd__qtybtn" onClick={() => handleQuantityChange(-1)} aria-label="Giảm">
                      <Minus size={16}/>
                    </button>
                    <input
                      className="pd__qtyinput"
                      type="number"
                      value={quantity}
                      min={1}
                      onChange={(e) => setQuantity(clamp(parseInt(e.target.value) || 1, 1, 999))}
                    />
                    <button className="pd__qtybtn" onClick={() => handleQuantityChange(1)} aria-label="Tăng">
                      <Plus size={16}/>
                    </button>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="pd__cta">
                <button className="pd__btn pd__btn--primary" onClick={handleAddToCart}>
                  <ShoppingCart size={18} style={{ marginRight:8 }}/> THÊM VÀO GIỎ HÀNG
                </button>
                <button className="pd__btn pd__btn--ghost" onClick={handleBuyNow}>
                  THANH TOÁN VỚI INTERNET BANKING
                </button>

                <div className="pd__inline">
                  <button className="pd__wish" onClick={handleWishlist} aria-pressed={isWishlisted}>
                    <Heart size={16} fill={isWishlisted ? '#ef4444' : 'none'}/>
                    {isWishlisted ? 'Đã thích' : 'Thêm vào yêu thích'}
                  </button>
                  <button className="pd__wish" onClick={handleShare}>
                    <Share2 size={16}/> Chia sẻ
                  </button>
                </div>

                <div className="pd__meta">
                  <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
                    <ShieldCheck size={16}/> Bảo hành trọn đời
                  </span>
                  <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
                    <RefreshCw size={16}/> Đổi 1–1 trong 7 ngày
                  </span>
                  <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
                    <Truck size={16}/> Giao nhanh 24–48h
                  </span>
                </div>
              </div>

              {/* Tabs moved below to align horizontally with CHÚ Ý */}
            </div>
          </div>

          {/* Row: Note (left) and Tabs (right) */}
          <div style={{ display:'grid', gridTemplateColumns:'1.1fr .9fr', gap:48, marginTop:32 }}>
            {/* Note */}
            <div className="pd__note">
              <h3>CHÚ Ý</h3>
              <ul className="pd__list">
                {product.careInstructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </div>

            {/* Tabs */}
            <div className="pd__tabs">
              <div className="pd__tabbar" role="tablist" aria-label="Thông tin sản phẩm">
                <button className={`pd__tab ${activeTab==='desc' ? 'pd__tab--active' : ''}`} onClick={() => setActiveTab('desc')} role="tab" aria-selected={activeTab==='desc'}>Mô tả</button>
                <button className={`pd__tab ${activeTab==='feature' ? 'pd__tab--active' : ''}`} onClick={() => setActiveTab('feature')} role="tab" aria-selected={activeTab==='feature'}>Điểm nổi bật</button>
                <button className={`pd__tab ${activeTab==='care' ? 'pd__tab--active' : ''}`} onClick={() => setActiveTab('care')} role="tab" aria-selected={activeTab==='care'}>Bảo quản</button>
                <button className={`pd__tab ${activeTab==='ship' ? 'pd__tab--active' : ''}`} onClick={() => setActiveTab('ship')} role="tab" aria-selected={activeTab==='ship'}>Vận chuyển</button>
              </div>
              <div className="pd__tabpanel">
                {activeTab === 'desc' && <p>{product.description}</p>}
                {activeTab === 'feature' && (
                  <ul className="pd__list">
                    {product.features.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                )}
                {activeTab === 'care' && (
                  <ul className="pd__list">
                    {product.careInstructions.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                )}
                {activeTab === 'ship' && (
                  <p>Freeship đơn từ 300k nội thành TP.HCM. Tỉnh thành khác: 2–4 ngày làm việc.</p>
                )}
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="pd__reviews" style={{ marginTop: 32 }}>
            <h2 style={{ textAlign:'center', marginTop:0, marginBottom:18, fontSize:24 }}> {reviews.length} nhận xét </h2>
            <div style={{ display:'grid', gap:14 }}>
              {reviews.map(rv => (
                <div key={rv.id} className="pd__rv">
                  <div className="pd__rvh">
                    <div className="pd__avatar" aria-hidden>
                      {rv.avatar ? <img src={rv.avatar} alt={rv.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : rv.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight:700 }}>{rv.name}</div>
                      <div className="pd__stars">
                        {[...Array(rv.rating)].map((_, i) => <Star key={i} size={14} fill="#000" stroke="#000"/>)}
                      </div>
                    </div>
                    <div style={{ marginLeft:'auto', color:'var(--muted)', fontSize:12 }}>{rv.date}</div>
                  </div>
                  <p style={{ margin:0, color:'#374151' }}>{rv.comment}</p>
                </div>
              ))}
            </div>
            <div style={{ textAlign:'center', marginTop:18 }}>
              <button className="pd__btn pd__btn--primary" style={{ width:'auto', padding:'10px 18px' }}>Xem thêm bình luận</button>
            </div>
          </div>

          {/* Related */}
          <div className="pd__related" style={{ marginTop: 32 }}>
            <h2 style={{ textAlign:'center', textTransform:'uppercase', letterSpacing:'.06em', marginTop:0, marginBottom:16 }}>Sản phẩm liên quan</h2>
            <div className="pd__relgrid">
              {relatedProducts.map(rp => (
                <div key={rp.id} className="pd__card" onClick={() => onNavigate?.('product-detail')}>
                  <div className="pd__cardimg">
                    <img src={rp.image} alt={rp.name}/>
                  </div>
                  <div className="pd__cardbody">
                    <h3 className="pd__relname">{rp.name}</h3>
                    <div className="pd__relrow">
                      <div style={{ fontWeight:900 }}>{formatVND(rp.price)}</div>
                      <button
                        aria-label="Thêm nhanh"
                        style={{
                          width:36, height:36, borderRadius:999,
                          background:'#f0fdf4', border:'1px solid #bbf7d0',
                          display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer'
                        }}
                        onClick={(e) => { e.stopPropagation(); setToast('Đã thêm nhanh'); }}
                      >
                        <ShoppingCart size={16}/>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Sticky actions */}
          <div className="pd__sticky" aria-hidden>
            <div style={{ display:'flex', alignItems:'center', gap:10, flex:1 }}>
              <div style={{ fontWeight:900 }}>{formatVND(product.price)}</div>
            </div>
            <button className="pd__btn pd__btn--ghost" onClick={handleAddToCart} style={{ padding:12 }}>Thêm</button>
            <button className="pd__btn pd__btn--primary" onClick={handleBuyNow} style={{ padding:12 }}>Mua ngay</button>
          </div>
        </section>

        {toast && <div className="pd__toast" role="status">{toast}</div>}
      </div>
    </>
  )
}

export default ProductDetail
