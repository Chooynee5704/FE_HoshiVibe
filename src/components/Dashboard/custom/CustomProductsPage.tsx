"use client"

import { useEffect, useMemo, useState } from "react"
import { Button, Table, Tag, Modal, Form, Input, InputNumber, message, Space, Divider } from "antd"
import { Eye, Plus, Edit3, Trash2, RefreshCw } from "lucide-react"
import customDesignAPI, { type CustomDesign } from "../../../api/customDesignAPI"

type FormMode = "create" | "edit"

type FormValues = {
  user_Id?: string
  name: string
  description?: string
  price?: number
  rawImageBase64?: string
  aiImageUrl?: string
  charmIdsText?: string
}

const emptyForm: FormValues = {
  user_Id: "",
  name: "",
  description: "",
  price: undefined,
  rawImageBase64: "",
  aiImageUrl: "",
  charmIdsText: "",
}

export default function CustomProductsPage() {
  const [designs, setDesigns] = useState<CustomDesign[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [detailDesign, setDetailDesign] = useState<CustomDesign | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [formMode, setFormMode] = useState<FormMode>("create")
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [editingDesign, setEditingDesign] = useState<CustomDesign | null>(null)
  const [form] = Form.useForm<FormValues>()

  useEffect(() => {
    loadDesigns()
  }, [])

  const loadDesigns = async () => {
    setLoading(true)
    try {
      const data = await customDesignAPI.getAllCustomDesigns()
      setDesigns(data || [])
    } catch (err: any) {
      console.error("Failed to load custom designs", err)
      message.error(err?.response?.data?.message || "Không thể tải danh sách custom product")
    } finally {
      setLoading(false)
    }
  }

  const filteredDesigns = useMemo(() => {
    if (!searchTerm.trim()) return designs
    const q = searchTerm.toLowerCase()
    return designs.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.user_Id?.toLowerCase().includes(q)
    )
  }, [designs, searchTerm])

  const openCreateModal = () => {
    setFormMode("create")
    setEditingDesign(null)
    form.setFieldsValue(emptyForm)
    setIsFormModalOpen(true)
  }

  const openEditModal = (design: CustomDesign) => {
    setFormMode("edit")
    setEditingDesign(design)
    form.setFieldsValue({
      user_Id: design.user_Id || "",
      name: design.name,
      description: design.description || "",
      price: design.price,
      rawImageBase64: design.rawImageBase64 || "",
      aiImageUrl: design.aiImageUrl || "",
      charmIdsText: design.charmIds?.join(", ") || "",
    })
    setIsFormModalOpen(true)
  }

  const closeFormModal = () => {
    setIsFormModalOpen(false)
    setEditingDesign(null)
    form.resetFields()
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setFormSubmitting(true)

      const charmIds =
        values.charmIdsText
          ?.split(",")
          .map((id) => id.trim())
          .filter((id) => id.length > 0) || []

      const payload = {
        user_Id: values.user_Id?.trim() || undefined,
        name: values.name.trim(),
        description: values.description?.trim() || undefined,
        price: values.price,
        rawImageBase64: values.rawImageBase64?.trim() || undefined,
        aiImageUrl: values.aiImageUrl?.trim() || undefined,
        charmIds: charmIds.length > 0 ? charmIds : undefined,
      }

      if (formMode === "create") {
        await customDesignAPI.createCustomDesign(payload)
        message.success("Đã tạo custom product mới")
      } else if (editingDesign) {
        await customDesignAPI.updateCustomDesign(editingDesign.customDesign_Id, payload)
        message.success("Đã cập nhật custom product")
      }

      closeFormModal()
      loadDesigns()
    } catch (err: any) {
      if (err?.errorFields) {
        message.error("Vui lòng kiểm tra lại các trường bắt buộc")
      } else {
        console.error("Custom design submit error", err)
        message.error(err?.response?.data?.message || "Không thể lưu custom product")
      }
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleDelete = async (design: CustomDesign) => {
    Modal.confirm({
      title: `Xóa custom product "${design.name}"?`,
      content: "Hành động này không thể hoàn tác.",
      okType: "danger",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await customDesignAPI.deleteCustomDesign(design.customDesign_Id)
          message.success("Đã xóa custom product")
          loadDesigns()
        } catch (err: any) {
          console.error("Delete custom design error", err)
          message.error(err?.response?.data?.message || "Không thể xóa custom product")
        }
      },
    })
  }

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "aiImageUrl",
      key: "image",
      width: 120,
      render: (_: string, record: CustomDesign) => (
        <div className="w-20 h-20 rounded border overflow-hidden bg-gray-100">
          <img
            src={record.aiImageUrl || record.rawImageBase64 || "/placeholder.svg"}
            alt={record.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg"
            }}
          />
        </div>
      ),
    },
    {
      title: "Tên thiết kế",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: CustomDesign) => (
        <div>
          <p className="font-semibold text-gray-900">{name}</p>
          {record.description && <p className="text-xs text-gray-500 line-clamp-2">{record.description}</p>}
        </div>
      ),
    },
    {
      title: "Người dùng",
      dataIndex: "user_Id",
      key: "user",
      width: 200,
      render: (user_Id?: string) => (user_Id ? <Tag color="blue">{user_Id}</Tag> : <Tag>Mặc định</Tag>),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (price: number) => (
        <span className="font-semibold text-black">
          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)}
        </span>
      ),
    },
    {
      title: "Charm",
      dataIndex: "charmIds",
      key: "charmIds",
      width: 120,
      render: (charmIds?: string[]) => <Tag>{charmIds?.length || 0} items</Tag>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      width: 160,
      render: (date: string) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 200,
      render: (_: any, record: CustomDesign) => (
        <Space>
          <Button
            icon={<Eye className="w-4 h-4" />}
            onClick={() => {
              setDetailDesign(record)
              setIsDetailModalOpen(true)
            }}
          >
            Chi tiết
          </Button>
          <Button icon={<Edit3 className="w-4 h-4" />} onClick={() => openEditModal(record)}>
            Sửa
          </Button>
          <Button danger icon={<Trash2 className="w-4 h-4" />} onClick={() => handleDelete(record)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="flex min-h-screen bg-white">
      <main className="flex-1 flex flex-col">
        <div className="px-8 py-8 border-b border-gray-200 flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-black">Custom Product của người dùng</h1>
          <p className="text-sm text-gray-600">Quản lý, xem chi tiết và chỉnh sửa các thiết kế tùy chỉnh</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="primary" icon={<Plus className="w-4 h-4" />} onClick={openCreateModal}>
              Thêm custom product
            </Button>
            <Button icon={<RefreshCw className="w-4 h-4" />} onClick={loadDesigns} loading={loading}>
              Tải lại
            </Button>
            <Input
              placeholder="Tìm theo tên, mô tả, user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 280 }}
            />
          </div>
        </div>

        <div className="px-8 py-8">
          <Table
            dataSource={filteredDesigns}
            columns={columns}
            rowKey="customDesign_Id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </div>
      </main>

      <Modal
        title="Chi tiết custom product"
        open={isDetailModalOpen && !!detailDesign}
        onCancel={() => {
          setIsDetailModalOpen(false)
          setDetailDesign(null)
        }}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalOpen(false)}>
            Đóng
          </Button>,
        ]}
        width={720}
      >
        {detailDesign && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <img
                src={detailDesign.aiImageUrl || detailDesign.rawImageBase64 || "/placeholder.svg"}
                alt={detailDesign.name}
                className="w-48 h-48 object-cover rounded border"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold">{detailDesign.name}</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{detailDesign.description || "Không có mô tả"}</p>
                <Divider />
                <p>
                  <strong>User ID:</strong> {detailDesign.user_Id || "Mặc định"}
                </p>
                <p>
                  <strong>Giá:</strong>{" "}
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(detailDesign.price)}
                </p>
                <p>
                  <strong>Số charm:</strong> {detailDesign.charmIds?.length || 0}
                </p>
                <p>
                  <strong>Ngày tạo:</strong> {new Date(detailDesign.createdDate).toLocaleString("vi-VN")}
                </p>
              </div>
            </div>
            {detailDesign.rawImageBase64 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Ảnh raw</h4>
                <img
                  src={detailDesign.rawImageBase64}
                  alt="Raw design"
                  className="w-full max-h-80 object-contain rounded border"
                />
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        title={formMode === "create" ? "Thêm custom product" : "Chỉnh sửa custom product"}
        open={isFormModalOpen}
        onCancel={closeFormModal}
        onOk={handleSubmit}
        confirmLoading={formSubmitting}
        okText={formMode === "create" ? "Tạo mới" : "Cập nhật"}
        cancelText="Hủy"
        width={640}
      >
        <Form form={form} layout="vertical" initialValues={emptyForm}>
          <Form.Item label="User ID" name="user_Id">
            <Input placeholder="Nhập ID người dùng (optional)" />
          </Form.Item>
          <Form.Item
            label="Tên thiết kế"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên thiết kế" }]}
          >
            <Input placeholder="Nhập tên custom product" />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} placeholder="Nhập mô tả" />
          </Form.Item>
          <Form.Item label="Giá" name="price">
            <InputNumber
              className="w-full"
              min={0}
              placeholder="Giá tùy chỉnh (nếu bỏ trống sẽ sử dụng giá tính từ charm)"
            />
          </Form.Item>
          <Form.Item label="Ảnh AI (URL)" name="aiImageUrl">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item label="Ảnh raw (Base64 hoặc URL)" name="rawImageBase64">
            <Input placeholder="data:image/jpeg;base64,... hoặc https://..." />
          </Form.Item>
          <Form.Item label="Danh sách charm ID" name="charmIdsText">
            <Input placeholder="Nhập danh sách charm ID, phân tách bởi dấu phẩy" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

