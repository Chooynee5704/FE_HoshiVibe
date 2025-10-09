import { useState, useEffect, useRef } from 'react'

const About = () => {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({})
  const sectionsRef = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = (entry.target as HTMLElement).dataset.section
            if (section) {
              setIsVisible((prev) => ({
                ...prev,
                [section]: true
              }))
            }
          }
        })
      },
      { threshold: 0.1 }
    )

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section)
    })

    return () => {
      sectionsRef.current.forEach((section) => {
        if (section) observer.unobserve(section)
      })
    }
  }, [])

  const introductionParagraphs = [
    "Với hệ thống tùy chỉnh thông minh dựa trên ngày sinh, cung hoàng đạo và mục tiêu cuộc sống, mỗi sản phẩm tại Hoshi Vibe là một lá bùa mang đậm dấu ấn cá nhân – vừa là món phụ kiện thời trang, vừa là vật phẩm hỗ trợ tinh thần và năng lượng tích cực hằng ngày."
  ]

  const coreValueParagraphs = [
    "Với Hoshi Vibe, trang sức không chỉ để đeo mà còn là cách để lắng nghe cơ thể, đồng điệu cảm xúc và gợi mở hành trình chữa lành mỗi ngày. Chúng tôi tự hào mang đến những thiết kế khác biệt – bên ngoài đầy phong cách, bên trong là biểu tượng độc bản, phản ánh điểm mạnh riêng của bạn và đồng thời lan tỏa nguồn năng lượng tích cực tới những người xung quanh."
  ]

  const aboutImages = [
    '/about/z7063692578682_1ee56363e7d07bf130771b21b990cfed.jpg',
    '/about/z7063692578687_5d0b55aef2aa9fdffc80a77644e1ef07.jpg',
    '/about/z7063692578683_97bd9a160bf1590f73aba15b359f3d19.jpg',
    '/about/z7063692578680_8319931265ca33d7d8fe3547e58997c4.jpg'
  ]

  const teamMembers = [
    {
      name: 'Ngô Duy Bảo My',
      role: 'Graphic Design',
      image: '/team/NgoDuyBaoMy.jpg',
      facebook: 'https://www.facebook.com/baomy100403/'
    },
    {
      name: 'Cáp Thu Hằng',
      role: 'Graphic Design',
      image: '/team/CapThuHang.jpg',
      facebook: 'https://www.facebook.com/hangcap136/'
    },
    {
      name: 'Nguyễn Thị Phương Mai',
      role: 'Software Engineering',
      image: '/team/NguyenThiPhuongMai.jpg',
      facebook: 'https://www.facebook.com/imchooyluvu'
    },
    {
      name: 'Nguyễn Nhất Huy',
      role: 'Software Engineering',
      image: '/team/NguyenNhatHuy.jpg',
      facebook: 'https://www.facebook.com/HuyNguyen1st0000/'
    },
    {
      name: 'Bùi Minh Duy',
      role: 'Software Engineering',
      image: '/team/BuiMinhDuy.jpg',
      facebook: 'https://www.facebook.com/minhduy.bui.9417'
    },
    {
      name: 'Đặng Tài',
      role: 'Software Engineering',
      image: '/team/DangTai.jpg',
      facebook: 'https://www.facebook.com/ditii.1908'
    }
  ]

  return (
    <>
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeInScale {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-60px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(60px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          .animate-in {
            animation: fadeInUp 0.8s ease-out forwards;
          }

          .team-card {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .team-card:hover {
            transform: scale(1.05) translateY(-8px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          }

          .team-image {
            transition: transform 0.4s ease;
          }

          .team-card:hover .team-image {
            transform: scale(1.1);
          }

          .social-icons {
            transition: opacity 0.4s ease;
          }

          .social-icon {
            transition: all 0.3s ease;
          }

          .social-icon:hover {
            background: rgba(255, 255, 255, 0.4);
            transform: scale(1.1);
          }

          .image-card {
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
            border-radius: 1.5rem;
          }

          .image-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          }

          .image-card img {
            transition: transform 0.5s ease;
          }

          .image-card:hover img {
            transform: scale(1.1);
          }
        `}
      </style>

      <main style={{
        background: '#ffffff',
        padding: '4rem 1.5rem',
        minHeight: '100vh'
      }}>
        {/* Hero Section */}
        <div
          ref={(el) => { sectionsRef.current[0] = el }}
          data-section="hero"
          style={{
            maxWidth: '1200px',
            margin: '0 auto 5rem',
            textAlign: 'center',
            paddingBottom: '3rem',
            opacity: isVisible.hero ? 1 : 0,
            animation: isVisible.hero ? 'fadeInUp 1s ease-out' : 'none'
          }}
        >
          <h1 style={{
            fontSize: '4rem',
            fontWeight: 900,
            color: '#000000',
            marginBottom: '2rem',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase'
          }}>
            Về chúng tôi
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#404040',
            lineHeight: 1.8,
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            Với hệ thống tùy chỉnh thông minh dựa trên ngày sinh, cung hoàng đạo và mục tiêu cuộc sống, mỗi sản phẩm tại Hoshi Vibe là một lá bùa mang đậm dấu ấn cá nhân – vừa là món phụ kiện thời trang, vừa là vật phẩm hỗ trợ tinh thần và năng lượng tích cực hằng ngày.
          </p>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Undulating Image Grid */}
          <div
            ref={(el) => { sectionsRef.current[1] = el }}
            data-section="images"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1.5rem',
              marginBottom: '5rem',
              opacity: isVisible.images ? 1 : 0,
              animation: isVisible.images ? 'fadeInScale 1s ease-out 0.2s both' : 'none'
            }}
          >
            {aboutImages.map((src, idx) => {
              const isBig = idx % 2 === 0
              return (
                <div
                  key={idx}
                  className="image-card"
                  style={{
                    position: 'relative',
                    borderRadius: '1.5rem',
                    overflow: 'hidden',
                    height: isBig ? '400px' : '280px',
                    marginTop: isBig ? '0' : '60px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                    animationDelay: `${idx * 0.1}s`
                  }}
                >
                  <img
                    src={src}
                    alt={`Hoshi Vibe image ${idx + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              )
            })}
          </div>

          {/* Introduction Section */}
          <section
            ref={(el) => { sectionsRef.current[2] = el }}
            data-section="intro"
            style={{
              background: '#f9fafb',
              padding: '4rem 3rem',
              borderRadius: '2rem',
              textAlign: 'center',
              marginBottom: '4rem',
              border: '1px solid #e5e7eb',
              opacity: isVisible.intro ? 1 : 0,
              animation: isVisible.intro ? 'slideInLeft 1s ease-out' : 'none'
            }}
          >
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: '#000000',
              marginBottom: '2rem',
              letterSpacing: '-0.01em',
              textTransform: 'uppercase'
            }}>
              Giới thiệu về Hoshi Vibe
            </h2>
            <div>
              {introductionParagraphs.map((text, index) => (
                <p key={index} style={{
                  color: '#1a1a1a',
                  fontSize: '1.1rem',
                  lineHeight: 1.9,
                  fontWeight: 400,
                  marginBottom: '1.5rem'
                }}>
                  {text}
                </p>
              ))}
            </div>
          </section>

          {/* Slogan Section */}
          <section
            ref={(el) => { sectionsRef.current[3] = el }}
            data-section="slogan"
            style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
              padding: '5rem 3rem',
              borderRadius: '2rem',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              marginBottom: '4rem',
              opacity: isVisible.slogan ? 1 : 0,
              animation: isVisible.slogan ? 'fadeInScale 1s ease-out' : 'none'
            }}
          >
            <div style={{
              fontSize: '1.8rem',
              fontStyle: 'italic',
              color: '#ffffff',
              marginBottom: '1.5rem',
              fontWeight: 300,
              letterSpacing: '0.02em',
              opacity: 0.9
            }}>
              "Set your vibe, boost your fate."
            </div>
            <div style={{
              fontSize: '2.5rem',
              color: '#ffffff',
              fontWeight: 700,
              letterSpacing: '0.01em',
              lineHeight: 1.4
            }}>
              Cài lại năng lượng, nâng tầm vận mệnh mỗi ngày
            </div>
          </section>

          {/* Core Values Section */}
          <section
            ref={(el) => { sectionsRef.current[4] = el }}
            data-section="values"
            style={{
              background: '#f9fafb',
              padding: '4rem 3rem',
              borderRadius: '2rem',
              textAlign: 'center',
              marginBottom: '5rem',
              border: '1px solid #e5e7eb',
              opacity: isVisible.values ? 1 : 0,
              animation: isVisible.values ? 'slideInRight 1s ease-out' : 'none'
            }}
          >
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: '#000000',
              marginBottom: '2rem',
              letterSpacing: '-0.01em',
              textTransform: 'uppercase'
            }}>
              Giá trị cốt lõi của Hoshi Vibe
            </h2>
            <div>
              {coreValueParagraphs.map((text, index) => (
                <p key={index} style={{
                  color: '#1a1a1a',
                  fontSize: '1.1rem',
                  lineHeight: 1.9,
                  fontWeight: 400,
                  marginBottom: '1.5rem'
                }}>
                  {text}
                </p>
              ))}
            </div>
          </section>

          {/* Team Section */}
          <section
            ref={(el) => { sectionsRef.current[5] = el }}
            data-section="team"
            style={{
              textAlign: 'center',
              opacity: isVisible.team ? 1 : 0,
              animation: isVisible.team ? 'fadeInUp 1s ease-out' : 'none'
            }}
          >
            <h2 style={{
              fontSize: '3rem',
              fontWeight: 900,
              color: '#000000',
              marginBottom: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em'
            }}>
              Thành Viên
            </h2>
            <p style={{
              fontSize: '1.2rem',
              color: '#666666',
              marginBottom: '4rem',
              fontWeight: 400
            }}>
              Đội ngũ đồng sáng lập và điều hành
            </p>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '2rem',
              padding: '1rem'
            }}>
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="team-card"
                  style={{
                    position: 'relative',
                    width: '320px',
                    height: '400px',
                    borderRadius: '1.5rem',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                    animationDelay: `${index * 0.1}s`
                  }}
                  onMouseEnter={() => setHoveredMember(index)}
                  onMouseLeave={() => setHoveredMember(null)}
                >
                  <div style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <img
                      src={member.image}
                      alt={member.name}
                      className="team-image"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)',
                      padding: '2.5rem 1.5rem',
                      color: 'white'
                    }}>
                      <h3 style={{
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        marginBottom: '0.5rem',
                        textAlign: 'left'
                      }}>
                        {member.name}
                      </h3>
                      <p style={{
                        fontSize: '1rem',
                        color: '#ffffff',
                        fontWeight: 400,
                        opacity: 0.9,
                        textAlign: 'left'
                      }}>
                        {member.role}
                      </p>
                    </div>
                    <div
                      className="social-icons"
                      style={{
                        position: 'absolute',
                        right: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                        opacity: hoveredMember === index ? 1 : 0
                      }}
                    >
                      {member.facebook && (
                        <a
                          href={member.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-icon"
                          style={{
                            width: '45px',
                            height: '45px',
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(10px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            fontSize: '1.3rem',
                            textDecoration: 'none',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                          aria-label={`Facebook của ${member.name}`}
                        >
                          f
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

export default About