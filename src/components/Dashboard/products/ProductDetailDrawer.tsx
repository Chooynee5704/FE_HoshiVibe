// src/components/Dashboard/products/ProductDetailDrawer.tsx
"use client"

import { useEffect, useState } from "react"
import { Drawer, Tag, Descriptions, Space, Spin, Alert, Button, Popconfirm } from "antd"
import { getProductById, deleteProduct, type ProductApi } from "../../../api/productsAPI"

export type UIProduct = {
  id: string
  name: string
  price: number
  image: string
  status: "in-stock" | "not-available" | "ready-to-publish" | string
  stock: number
  category: string
}

type Props = {
  open: boolean
  product?: UIProduct | null
  onClose?: () => void
  /** callback cho parent xoá item khỏi list */
  onDeleted?: (id: string) => void
}

const statusColor: Record<string, string> = {
  "in-stock": "green",
  "not-available": "red",
  "ready-to-publish": "gold",
}

const formatVND = (n: number) =>
  Number(n || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  })

/** Map dữ liệu từ API chi tiết về shape UI dùng cho Drawer */
function mapDetail(p: ProductApi | null | undefined): UIProduct | null {
  if (!p) return null
  const anyP = p as any
  const id = String(anyP.productId ?? anyP.productID ?? anyP.product_Id ?? anyP.id ?? "")
  return {
    id,
    name: p.name,
    price: Number(p.price) || 0,
    image: p.imageUrl || p.imageURL || "/placeholder.svg",
    status: p.status,
    stock: Number(p.stock) || 0,
    category: p.category,
  }
}

export default function ProductDetailDrawer({ open, product, onClose, onDeleted }: Props) {
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [detail, setDetail] = useState<UIProduct | null>(null)
  const [description, setDescription] = useState<string>("")

  useEffect(() => {
    let mounted = true
    async function fetchDetail() {
      if (!open || !product?.id) {
        setDetail(product ?? null)
        setDescription("")
        setError(null)
        return
      }
      try {
        setLoading(true)
        setError(null)
        // Gọi API chi tiết
        const res: ProductApi = await getProductById(product.id)
        if (!mounted) return
        const mapped = mapDetail(res)
        setDetail(mapped)
        setDescription((res as any)?.description || "")
      } catch (err: any) {
        if (!mounted) return
        const msg =
          err?.response?.data?.message ||
          err?.response?.data ||
          err?.message ||
          "Không tải được chi tiết sản phẩm"
        setError(String(msg))
        // fallback: vẫn hiện thông tin từ list nếu có
        setDetail(product ?? null)
        setDescription("")
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchDetail()
    return () => { mounted = false }
  }, [open, product])

  const color = statusColor[detail?.status ?? ""] ?? "default"

  const handleDelete = async () => {
    if (!detail?.id) return
    try {
      setDeleting(true)
      await deleteProduct(detail.id) // DELETE /api/Product/delete/{id}
      onDeleted?.(detail.id)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Drawer
      title="Chi tiết sản phẩm"
      open={open}
      onClose={onClose}
      width={720}
      destroyOnClose
    >
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Spin />
        </div>
      ) : !detail ? (
        <div className="text-gray-500">Không có dữ liệu sản phẩm.</div>
      ) : (
        <>
          {error && (
            <Alert
              className="mb-4"
              type="warning"
              showIcon
              message="Không tải được đầy đủ chi tiết"
              description={error}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Image */}
            <div className="w-full">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={detail.image || "/placeholder.svg"}
                  alt={detail.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4">
                <Space wrap size="small">
                  <Tag color={color}>{detail.status}</Tag>
                  <Tag>{detail.category || "others"}</Tag>
                  <Tag>Kho: {detail.stock}</Tag>
                </Space>
              </div>
            </div>

            {/* Right: Info */}
            <div className="w-full">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {detail.name}
              </h2>
              <div className="text-2xl font-bold text-blue-600 mb-4">
                {formatVND(detail.price)}
              </div>

              <Descriptions
                column={1}
                bordered
                size="middle"
                labelStyle={{ width: 160 }}
              >
                <Descriptions.Item label="Mã sản phẩm">{detail.id}</Descriptions.Item>
                <Descriptions.Item label="Tình trạng">
                  <Tag color={color}>{detail.status}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Danh mục">{detail.category}</Descriptions.Item>
                <Descriptions.Item label="Tồn kho">{detail.stock}</Descriptions.Item>
                <Descriptions.Item label="Mô tả">
                  {description || <span className="text-gray-500">—</span>}
                </Descriptions.Item>
              </Descriptions>

              {/* ✅ Hàng nút ở GÓC DƯỚI BÊN TRÁI */}
              <div className="mt-6 flex items-center gap-8">
                <Popconfirm
                  title="Xóa sản phẩm?"
                  description={`Bạn chắc chắn muốn xóa "${detail.name}"?`}
                  okText="Xóa"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true, loading: deleting }}
                  onConfirm={handleDelete}
                >
                  <Button danger loading={deleting}>Xóa</Button>
                </Popconfirm>

                <Button onClick={onClose}>Đóng</Button>
              </div>
            </div>
          </div>
        </>
      )}
    </Drawer>
  )
}
