import { useState, useEffect } from 'react'
import { Card, Button, Input, Form, Modal, Spin, Avatar, Descriptions } from 'antd'
import { UserOutlined, EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons'
import { getCurrentUser } from '../api/authApi'
import { getUserProfile, updateUserProfile, type UserProfile } from '../api/userAPI'
import type { PageKey } from '../types/navigation'

interface ProfileProps {
  onNavigate?: (page: PageKey) => void
}

const Profile = ({ onNavigate }: ProfileProps) => {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const user = getCurrentUser()
      
      if (!user) {
        Modal.warning({
          title: 'Yêu cầu đăng nhập',
          content: 'Vui lòng đăng nhập để xem thông tin cá nhân',
          onOk: () => onNavigate?.('login'),
        })
        return
      }

      const profileData = await getUserProfile(user.user_Id)
      setProfile(profileData)
      
      // Set form values
      form.setFieldsValue({
        fullName: profileData.profile?.fullName || '',
        phoneNumber: profileData.profile?.phoneNumber || '',
        address: profileData.profile?.address || '',
        dateOfBirth: profileData.profile?.dateOfBirth || '',
        gender: profileData.profile?.gender || '',
      })
    } catch (error) {
      console.error('Error loading profile:', error)
      Modal.error({
        title: 'Lỗi',
        content: 'Không thể tải thông tin cá nhân. Vui lòng thử lại.',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      const user = getCurrentUser()
      
      if (!user) return

      setLoading(true)
      const updatedProfile = await updateUserProfile(user.user_Id, values)
      setProfile(updatedProfile)
      setEditMode(false)
      
      Modal.success({
        title: 'Thành công',
        content: 'Cập nhật thông tin cá nhân thành công',
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      Modal.error({
        title: 'Lỗi',
        content: 'Không thể cập nhật thông tin. Vui lòng thử lại.',
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f9fafb, #f3f4f6)'
      }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f9fafb, #f3f4f6)',
      padding: '40px 24px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Avatar size={64} icon={<UserOutlined />} src={profile.profile?.avatarUrl} />
              <div>
                <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
                  Thông tin cá nhân
                </h2>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                  {profile.email}
                </p>
              </div>
            </div>
          }
          extra={
            editMode ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                  icon={<SaveOutlined />}
                  type="primary"
                  onClick={handleSave}
                  loading={loading}
                >
                  Lưu
                </Button>
                <Button
                  icon={<CloseOutlined />}
                  onClick={() => {
                    setEditMode(false)
                    form.resetFields()
                  }}
                >
                  Hủy
                </Button>
              </div>
            ) : (
              <Button
                icon={<EditOutlined />}
                type="primary"
                onClick={() => setEditMode(true)}
              >
                Chỉnh sửa
              </Button>
            )
          }
          style={{ borderRadius: '16px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
        >
          {editMode ? (
            <Form
              form={form}
              layout="vertical"
              style={{ marginTop: '24px' }}
            >
              <Form.Item
                label="Họ và tên"
                name="fullName"
              >
                <Input size="large" placeholder="Nhập họ và tên" />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="phoneNumber"
              >
                <Input size="large" placeholder="Nhập số điện thoại" />
              </Form.Item>

              <Form.Item
                label="Địa chỉ"
                name="address"
              >
                <Input.TextArea rows={3} placeholder="Nhập địa chỉ" />
              </Form.Item>

              <Form.Item
                label="Ngày sinh"
                name="dateOfBirth"
              >
                <Input size="large" type="date" />
              </Form.Item>

              <Form.Item
                label="Giới tính"
                name="gender"
              >
                <Input size="large" placeholder="Nam/Nữ/Khác" />
              </Form.Item>
            </Form>
          ) : (
            <Descriptions
              bordered
              column={1}
              style={{ marginTop: '24px' }}
            >
              <Descriptions.Item label="Tài khoản">
                {profile.account}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {profile.email}
              </Descriptions.Item>
              <Descriptions.Item label="Vai trò">
                <span style={{ 
                  padding: '4px 12px', 
                  borderRadius: '12px', 
                  background: profile.role === 'Admin' ? '#fef3c7' : '#dbeafe',
                  color: profile.role === 'Admin' ? '#92400e' : '#1e40af',
                  fontWeight: '600'
                }}>
                  {profile.role === 'Admin' ? 'Quản trị viên' : 'Khách hàng'}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Họ và tên">
                {profile.profile?.fullName || 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {profile.profile?.phoneNumber || 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">
                {profile.profile?.address || 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">
                {profile.profile?.dateOfBirth ? new Date(profile.profile.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item label="Giới tính">
                {profile.profile?.gender || 'Chưa cập nhật'}
              </Descriptions.Item>
            </Descriptions>
          )}

          <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
            <Button
              size="large"
              onClick={() => onNavigate?.('home')}
              style={{ flex: 1 }}
            >
              Quay về trang chủ
            </Button>
            <Button
              size="large"
              onClick={() => onNavigate?.('orders' as PageKey)}
              type="default"
              style={{ flex: 1 }}
            >
              Đơn hàng của tôi
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Profile
