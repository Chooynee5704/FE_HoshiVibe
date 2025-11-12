"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Loader2, Search } from "lucide-react"
import { Button, message, Modal, Input, Select, Popconfirm } from "antd"
import { getAllCharms, createCharm, updateCharm, deleteCharm, type Charm, type CharmType } from "../../../api/charmAPI"

export default function DesignRoomPage() {
  const [charms, setCharms] = useState<Charm[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<CharmType | 'all'>('all')
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editingCharm, setEditingCharm] = useState<Charm | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: 0,
    imageUrl: '',
    charmType: 'charm' as CharmType
  })

  useEffect(() => {
    loadCharms()
  }, [])

  const loadCharms = async () => {
    setLoading(true)
    try {
      const data = await getAllCharms()
      setCharms(data)
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Không tải được danh sách charm")
      console.error("Load charms error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenCreateModal = () => {
    setModalMode('create')
    setEditingCharm(null)
    setFormData({
      name: '',
      category: '',
      price: 0,
      imageUrl: '',
      charmType: 'charm'
    })
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (charm: Charm) => {
    setModalMode('edit')
    setEditingCharm(charm)
    setFormData({
      name: charm.name,
      category: charm.category || '',
      price: charm.price,
      imageUrl: charm.imageUrl || '',
      charmType: charm.charmType || 'charm'
    })
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCharm(null)
    setFormData({
      name: '',
      category: '',
      price: 0,
      imageUrl: '',
      charmType: 'charm'
    })
  }

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      message.error('Vui lòng nhập tên charm')
      return
    }
    if (formData.price <= 0) {
      message.error('Giá phải lớn hơn 0')
      return
    }

    setSubmitting(true)
    try {
      if (modalMode === 'create') {
        await createCharm({
          name: formData.name,
          category: formData.charmType, // Use charmType as category
          price: formData.price,
          imageUrl: formData.imageUrl
        })
        message.success('Tạo charm thành công!')
      } else if (editingCharm) {
        await updateCharm(editingCharm.cProduct_Id, {
          name: formData.name,
          category: formData.charmType,
          price: formData.price,
          imageUrl: formData.imageUrl
        })
        message.success('Cập nhật charm thành công!')
      }
      handleCloseModal()
      loadCharms()
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Có lỗi xảy ra')
      console.error('Submit charm error:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (charm: Charm) => {
    if (!charm?.cProduct_Id) {
      message.error('ID charm khong hop le, khong the xoa')
      console.error('Attempted to delete charm without cProduct_Id', charm)
      return
    }

    setDeletingId(charm.cProduct_Id)
    console.log('Deleting charm with id:', charm.cProduct_Id)
    try {
      await deleteCharm(charm.cProduct_Id)
      console.log('Delete API responded (success).')
      message.success('Xoa charm thanh cong!')
      await loadCharms()
    } catch (err: any) {
      const status = err?.response?.status
      const data = err?.response?.data
      console.error('Delete charm failed. status:', status, 'data:', data, 'error:', err)
      if (status === 401 || status === 403) {
        message.error('Ban can dang nhap voi tai khoan quan tri de xoa charm.')
      } else if (status === 404) {
        message.error('Charm khong ton tai (404). Co the da bi xoa truoc do.')
      } else {
        message.error(data?.message || 'Khong the xoa charm')
      }
    } finally {
      setDeletingId(null)
    }
  }

  // Filter charms
  const filteredCharms = charms.filter(charm => {
    const matchesSearch = charm.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || charm.category === filterType
    return matchesSearch && matchesType
  })

  const formatVND = (amount: number) =>
    amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })

  return (
    <div className="flex min-h-screen bg-white">
      <main className="flex-1 flex flex-col">
        {/* Page Title */}
        <div className="px-8 py-8 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-black">Phòng Thiết Kế</h1>
          <p className="text-sm text-gray-600 mt-1">Quản lý charm và mẫu thiết kế</p>
        </div>

        {/* Actions & Filters */}
        <div className="px-8 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Input
                prefix={<Search className="w-4 h-4 text-gray-400" />}
                placeholder="Tìm kiếm charm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
                allowClear
              />
              <Select
                value={filterType}
                onChange={setFilterType}
                className="w-48"
                options={[
                  { label: 'Tất cả', value: 'all' },
                  { label: 'Charm', value: 'charm' },
                  { label: 'Template', value: 'template' },
                ]}
              />
            </div>
            <Button
              type="primary"
              icon={<Plus className="w-4 h-4" />}
              onClick={handleOpenCreateModal}
            >
              Thêm Charm
            </Button>
          </div>
        </div>

        {/* Charms Grid */}
        <div className="px-8 py-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-black" />
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-6">
              {filteredCharms.length === 0 ? (
                <div className="col-span-4 text-center py-12 text-gray-400">
                  Chưa có charm nào
                </div>
              ) : (
                filteredCharms.map((charm) => {
                  console.log('Charm in grid:', JSON.stringify(charm))
                  return (
                  <div
                    key={charm.cProduct_Id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
                  >
                    {/* Image */}
                    <div className="aspect-square bg-gray-100 relative">
                      <img
                        src={charm.imageUrl || '/placeholder.svg'}
                        alt={charm.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 text-xs font-bold rounded ${
                          charm.category === 'template' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {charm.category === 'template' ? 'TEMPLATE' : 'CHARM'}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                        {charm.name}
                      </h3>
                      <p className="text-lg font-bold text-gray-900 mb-3">
                        {formatVND(charm.price)}
                      </p>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(charm)}
                          className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors flex items-center justify-center gap-1 text-sm font-medium"
                        >
                          <Edit className="w-4 h-4" />
                          Sửa
                        </button>
                        <Popconfirm
                          title="Xac nhan xoa"
                          description={`Ban co chac chan muon xoa charm "${charm.name}"?`}
                          okText="Xoa"
                          cancelText="Huy"
                          okButtonProps={{
                            danger: true,
                            loading: deletingId === charm.cProduct_Id,
                          }}
                          onConfirm={() => handleDelete(charm)}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            disabled={deletingId === charm.cProduct_Id}
                            className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors flex items-center justify-center gap-1 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {deletingId === charm.cProduct_Id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Trash2 className="w-4 h-4" />
                                Xóa
                              </>
                            )}
                          </button>
                        </Popconfirm>

                      </div>
                    </div>
                  </div>
                  )
                })
              )}
            </div>
          )}
        </div>

        {/* Create/Edit Modal */}
        <Modal
          title={modalMode === 'create' ? 'Thêm Charm Mới' : 'Chỉnh Sửa Charm'}
          open={isModalOpen}
          onCancel={handleCloseModal}
          footer={[
            <Button key="cancel" onClick={handleCloseModal}>
              Hủy
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={submitting}
              onClick={handleSubmit}
            >
              {modalMode === 'create' ? 'Tạo' : 'Cập nhật'}
            </Button>,
          ]}
          width={600}
        >
          <div className="space-y-4 pt-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên Charm <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nhập tên charm"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.charmType}
                onChange={(value) => setFormData({ ...formData, charmType: value })}
                className="w-full"
                options={[
                  { label: 'Charm', value: 'charm' },
                  { label: 'Template', value: 'template' },
                ]}
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                placeholder="Nhập giá"
                min={0}
                suffix="VNĐ"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Hình Ảnh
              </label>
              <Input
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
              {formData.imageUrl && (
                <div className="mt-2">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded border"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg'
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </Modal>
      </main>
    </div>
  )
}
