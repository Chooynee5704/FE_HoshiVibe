import type { CSSProperties } from 'react'
import { useState } from 'react'

const pageStyle: CSSProperties = {
  background: '#ffffff',
  padding: '4rem 1.5rem',
  minHeight: '100vh'
}

const heroSection: CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto 4rem',
  textAlign: 'center',
  paddingBottom: '3rem'
}

const mainTitle: CSSProperties = {
  fontSize: '3.5rem',
  fontWeight: 800,
  color: '#000000',
  marginBottom: '1.5rem',
  letterSpacing: '-0.02em',
  textAlign: 'center'
}

const subtitle: CSSProperties = {
  fontSize: '1.25rem',
  color: '#404040',
  lineHeight: 1.8,
  maxWidth: '900px',
  margin: '0 auto',
  textAlign: 'center'
}

const containerStyle: CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '4rem'
}

const imageGrid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '1.5rem',
  marginBottom: '3rem'
}

const imageCard: CSSProperties = {
  position: 'relative',
  borderRadius: '1rem',
  overflow: 'hidden',
  aspectRatio: '4/3',
  background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)'
}

// removed placeholder style after replacing with real images

const sectionCard: CSSProperties = {
  background: '#ffffff',
  padding: '3rem',
  borderRadius: '1.5rem',
  textAlign: 'center'
}

const headingStyle: CSSProperties = {
  fontSize: '2rem',
  fontWeight: 700,
  color: '#000000',
  marginBottom: '2rem',
  letterSpacing: '-0.01em',
  textAlign: 'center'
}

const paragraphStyle: CSSProperties = {
  color: '#1a1a1a',
  fontSize: '1.1rem',
  lineHeight: 1.9,
  fontWeight: 400,
  marginBottom: '1.5rem',
  textAlign: 'center'
}

const sloganSection: CSSProperties = {
  background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
  padding: '4rem 3rem',
  borderRadius: '2rem',
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
}

const sloganEnglish: CSSProperties = {
  fontSize: '1.5rem',
  fontStyle: 'italic',
  color: '#ffffff',
  marginBottom: '1rem',
  fontWeight: 300,
  letterSpacing: '0.02em',
  opacity: 0.9
}

const sloganVietnamese: CSSProperties = {
  fontSize: '2rem',
  color: '#ffffff',
  fontWeight: 700,
  letterSpacing: '0.01em',
  lineHeight: 1.4
}

const teamSection: CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  textAlign: 'center'
}

const teamTitle: CSSProperties = {
  fontSize: '2.5rem',
  fontWeight: 700,
  color: '#000000',
  marginBottom: '1rem',
  textAlign: 'center'
}

const teamSubtitle: CSSProperties = {
  fontSize: '1.1rem',
  color: '#666666',
  marginBottom: '4rem',
  textAlign: 'center'
}

const teamGrid: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '2rem',
  padding: '1rem'
}

const teamCard: CSSProperties = {
  position: 'relative',
  width: '320px',
  height: '400px',
  borderRadius: '1.5rem',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'all 0.4s ease'
}

const teamImageWrapper: CSSProperties = {
  width: '100%',
  height: '100%',
  position: 'relative',
  overflow: 'hidden'
}

const teamImage: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.4s ease'
}

const teamOverlay: CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)',
  padding: '2rem 1.5rem',
  color: 'white',
  transition: 'all 0.4s ease'
}

const teamName: CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 700,
  color: '#ffffff',
  marginBottom: '0.5rem',
  textAlign: 'left'
}

const teamRole: CSSProperties = {
  fontSize: '1rem',
  color: '#ffffff',
  fontWeight: 400,
  opacity: 0.9,
  textAlign: 'left'
}

const socialIcons: CSSProperties = {
  position: 'absolute',
  right: '1rem',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  opacity: 0,
  transition: 'opacity 0.4s ease'
}

const socialIcon: CSSProperties = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#ffffff',
  fontSize: '1.2rem',
  transition: 'all 0.3s ease',
  cursor: 'pointer'
}

const introductionParagraphs: string[] = [
  "Với hệ thống tùy chỉnh thông minh dựa trên ngày sinh, cung hoàng đạo và mục tiêu cuộc sống, mỗi sản phẩm tại Hoshi Vibe là một lá bùa mang đậm dấu ấn cá nhân – vừa là món phụ kiện thời trang, vừa là vật phẩm hỗ trợ tinh thần và năng lượng tích cực hằng ngày."
]

const coreValueParagraphs: string[] = [
  "Với Hoshi Vibe, trang sức không chỉ để đeo mà còn là cách để lắng nghe cơ thể, đồng điệu cảm xúc và gợi mở hành trình chữa lành mỗi ngày. Chúng tôi tự hào mang đến những thiết kế khác biệt – bên ngoài đầy phong cách, bên trong là biểu tượng độc bản, phản ánh điểm mạnh riêng của bạn và đồng thời lan tỏa nguồn năng lượng tích cực tới những người xung quanh."
]

const aboutImages: string[] = [
  '/about/z7063692578682_1ee56363e7d07bf130771b21b990cfed.jpg',
  '/about/z7063692578687_5d0b55aef2aa9fdffc80a77644e1ef07.jpg',
  '/about/z7063692578683_97bd9a160bf1590f73aba15b359f3d19.jpg',
  '/about/z7063692578680_8319931265ca33d7d8fe3547e58997c4.jpg'
]

type TeamMember = {
  name: string
  role: string
  image: string
  facebook?: string
}

const teamMembers: TeamMember[] = [
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

const About = () => {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null)

  return (
    <main style={pageStyle}>
      <div style={heroSection}>
        <h1 style={mainTitle}>Về chúng tôi</h1>
        <p style={subtitle}>
          Với hệ thống tùy chỉnh thông minh dựa trên ngày sinh, cung hoàng đạo và mục tiêu cuộc sống, mỗi sản phẩm tại Hoshi Vibe là một lá bùa mang đậm dấu ấn cá nhân – vừa là món phụ kiện thời trang, vừa là vật phẩm hỗ trợ tinh thần và năng lượng tích cực hằng ngày.
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={imageGrid}>
          {aboutImages.map((src, idx) => (
            <div key={idx} style={imageCard}>
              <img
                src={src}
                alt={`Hoshi Vibe image ${idx + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>

        <div style={containerStyle}>
          <section style={sectionCard}>
            <h2 style={headingStyle}>Giới thiệu về Hoshi Vibe</h2>
            <div>
              {introductionParagraphs.map((text, index) => (
                <p key={index} style={paragraphStyle}>{text}</p>
              ))}
            </div>
          </section>

          <section style={sloganSection}>
            <div style={sloganEnglish}>
              "Set your vibe, boost your fate."
            </div>
            <div style={sloganVietnamese}>
              Cài lại năng lượng, nâng tầm vận mệnh mỗi ngày
            </div>
          </section>

          <section style={sectionCard}>
            <h2 style={headingStyle}>Giá trị cốt lõi của Hoshi Vibe</h2>
            <div>
              {coreValueParagraphs.map((text, index) => (
                <p key={index} style={paragraphStyle}>{text}</p>
              ))}
            </div>
          </section>

          <section style={teamSection}>
            <h2 style={teamTitle}>Thành Viên</h2>
            <p style={teamSubtitle}>Đội ngũ đồng sáng lập và điều hành</p>
            <div style={teamGrid}>
              {teamMembers.map((member, index) => (
                <div 
                  key={index} 
                  style={{
                    ...teamCard,
                    transform: hoveredMember === index ? 'scale(1.05)' : 'scale(1)'
                  }}
                  onMouseEnter={() => setHoveredMember(index)}
                  onMouseLeave={() => setHoveredMember(null)}
                >
                  <div style={teamImageWrapper}>
                    <img 
                      src={member.image} 
                      alt={member.name}
                      style={{
                        ...teamImage,
                        transform: hoveredMember === index ? 'scale(1.1)' : 'scale(1)'
                      }}
                    />
                    <div style={teamOverlay}>
                      <h3 style={teamName}>{member.name}</h3>
                      <p style={teamRole}>{member.role}</p>
                    </div>
                    <div style={{
                      ...socialIcons,
                      opacity: hoveredMember === index ? 1 : 0
                    }}>
                      {member.facebook && (
                        <a
                          href={member.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ ...socialIcon, textDecoration: 'none' }}
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
      </div>
    </main>
  )
}

export default About