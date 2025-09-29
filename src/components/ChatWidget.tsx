import { MessageOutlined } from '@ant-design/icons'

const ChatWidget = () => {
  return (
    <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 50 }}>
      <button style={{
        backgroundColor: 'black',
        color: 'white',
        borderRadius: '9999px',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        border: 'none',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s'
      }}>
        <MessageOutlined style={{ fontSize: '1.125rem' }} />
        <span style={{ fontWeight: '500' }}>TƯ VẤN</span>
      </button>
    </div>
  )
}

export default ChatWidget
