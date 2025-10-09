// NewProductPage.tsx
"use client"

import { useEffect, useState } from "react"
import { Button, Form, Input, InputNumber, Select, Radio, Upload, DatePicker, message } from "antd"
import TextArea from "antd/es/input/TextArea"
import { UploadOutlined, MoreOutlined } from "@ant-design/icons"

type InventoryStatus = "in-stock" | "not-available" | "ready-to-publish"

type Props = {
  mode?: "create" | "update"
  initialValues?: any
  onCancel?: () => void
  onSubmit?: (values: any) => void
}

export default function NewProductPage({ mode = "create", initialValues, onCancel, onSubmit }: Props) {
  const [form] = Form.useForm()
  const [inventoryStatus, setInventoryStatus] = useState<InventoryStatus>("in-stock")

  // Prefill khi update
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        name: initialValues.name,
        sku: initialValues.sku,
        shortDescription: initialValues.shortDescription,
        assetName: initialValues.assetName,
        description: initialValues.description,
        source: initialValues.source,
        origin: initialValues.origin,
        releaseDate: initialValues.releaseDate, // nếu là dayjs, truyền đúng kiểu
        warrantyPeriod: initialValues.warrantyPeriod,
        warrantyPolicy: initialValues.warrantyPolicy,
        category: initialValues.category ?? "necklace",
        subCategory: initialValues.subCategory ?? "wood",
        keywords: initialValues.keywords,
        basePrice: initialValues.basePrice,
        currency: initialValues.currency ?? "VND",
        percentPrice: initialValues.percentPrice,
        exportPrice: initialValues.exportPrice,
      })
      if (initialValues.inventoryStatus) {
        setInventoryStatus(initialValues.inventoryStatus as InventoryStatus)
      }
    }
  }, [initialValues, form])

  const handleFinish = (values: any) => {
    const payload = { ...values, inventoryStatus, mode }
    message.success(mode === "create" ? "Đã thêm sản phẩm (mock)" : "Đã cập nhật sản phẩm (mock)")
    onSubmit?.(payload)
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Page Title */}
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          {mode === "create" ? "Thêm sản phẩm" : "Cập nhật sản phẩm"}
        </h1>
      </div>

      {/* Form Content */}
      <div className="flex-1 px-4 sm:px-6 pb-6">
        <Form form={form} layout="vertical" onFinish={handleFinish} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Main form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-4">Thông tin cơ bản</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="name"
                  label={<span className="text-sm text-gray-700">Tên sản phẩm</span>}
                  rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
                >
                  <Input placeholder="Nhập tên sản phẩm" />
                </Form.Item>

                <Form.Item name="sku" label={<span className="text-sm text-gray-700">Mã sản xuất</span>}>
                  <Input placeholder="VD: HOSHI-001" />
                </Form.Item>

                <Form.Item name="shortDescription" label={<span className="text-sm text-gray-700">Mô tả ngắn</span>}>
                  <Input placeholder="Mô tả ngắn gọn" />
                </Form.Item>

                <Form.Item name="assetName" label={<span className="text-sm text-gray-700">Tên tài sản phẩm</span>}>
                  <Input placeholder="" />
                </Form.Item>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-4">Hình ảnh</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center hover:border-gray-400 transition-colors">
                <Upload beforeUpload={() => false} multiple listType="picture-card">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <UploadOutlined />
                    <div className="text-sm text-gray-700">Chọn hoặc kéo ảnh vào đây</div>
                  </div>
                </Upload>
              </div>
            </div>

            {/* Details */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-4">Chi tiết</h2>
              <div className="grid grid-cols-1 gap-4">
                <Form.Item name="description" label={<span className="text-sm text-gray-700">Mô tả sản phẩm</span>}>
                  <TextArea placeholder="" className="min-h-[120px]" />
                </Form.Item>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item name="source" label={<span className="text-sm text-gray-700">Nguồn tác</span>}>
                    <Input placeholder="" />
                  </Form.Item>
                  <Form.Item name="origin" label={<span className="text-sm text-gray-700">Xuất xứ</span>}>
                    <Input placeholder="" />
                  </Form.Item>
                </div>

                <Form.Item name="releaseDate" label={<span className="text-sm text-gray-700">Ngày phát hành</span>}>
                  <DatePicker className="w-full" format="DD/MM/YYYY" />
                </Form.Item>

                <Form.Item name="warrantyPeriod" label={<span className="text-sm text-gray-700">Thời hạn bảo hành</span>}>
                  <Input placeholder="VD: 12 tháng" />
                </Form.Item>

                <Form.Item name="warrantyPolicy" label={<span className="text-sm text-gray-700">Chính sách bảo hành</span>}>
                  <TextArea placeholder="" className="min-h-[100px]" />
                </Form.Item>
              </div>
            </div>
          </div>

          {/* RIGHT: Sidebar form */}
          <div className="space-y-6">
            {/* Category */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-800">Phân loại</h2>
                <Button type="text" icon={<MoreOutlined />} />
              </div>

              <div className="space-y-4">
                <Form.Item
                  name="category"
                  label={<span className="text-sm text-gray-700">Danh mục</span>}
                  initialValue="necklace"
                >
                  <Select
                    options={[
                      { value: "necklace", label: "Vòng cổ" },
                      { value: "bracelet", label: "Vòng tay" },
                      { value: "string", label: "Dây phong thủy" },
                    ]}
                  />
                </Form.Item>

                <Form.Item
                  name="subCategory"
                  label={<span className="text-sm text-gray-700">Danh mục phụ</span>}
                  initialValue="wood"
                >
                  <Select
                    options={[
                      { value: "wood", label: "Mộc" },
                      { value: "metal", label: "Kim" },
                      { value: "water", label: "Thủy" },
                      { value: "fire", label: "Hỏa" },
                      { value: "earth", label: "Thổ" },
                    ]}
                  />
                </Form.Item>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-4">Thẻ</h2>
              <Form.Item name="keywords" label={<span className="text-sm text-gray-700">Từ khóa</span>}>
                <Input placeholder="Ngăn cách bởi dấu phẩy" />
              </Form.Item>
            </div>

            {/* Price */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-4">Giá</h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item
                    name="basePrice"
                    label={<span className="text-sm text-gray-700">Giá cơ bản</span>}
                    rules={[{ required: mode === "create", message: "Vui lòng nhập giá" }]}
                  >
                    <InputNumber className="w-full" min={0} placeholder="150000" />
                  </Form.Item>
                  <Form.Item name="currency" label={<span className="text-sm text-gray-700">Tiền tệ</span>} initialValue="VND">
                    <Input placeholder="VND" />
                  </Form.Item>
                </div>

                <Form.Item name="percentPrice" label={<span className="text-sm text-gray-700">Đơn giá theo %</span>}>
                  <InputNumber className="w-full" min={0} max={100} addonAfter="%" />
                </Form.Item>

                <Form.Item name="exportPrice" label={<span className="text-sm text-gray-700">Giá xuất</span>}>
                  <InputNumber className="w-full" min={0} />
                </Form.Item>
              </div>
            </div>

            {/* Inventory Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-4">Tình trạng kho</h2>
              <Radio.Group
                value={inventoryStatus}
                onChange={(e) => setInventoryStatus(e.target.value)}
                className="flex flex-col gap-2"
              >
                <Radio value="in-stock">Còn hàng</Radio>
                <Radio value="not-available">Không có sẵn</Radio>
                <Radio value="ready-to-publish">Sẵn sàng công bố</Radio>
              </Radio.Group>
            </div>
          </div>

          {/* BOTTOM actions */}
          <div className="lg:col-span-3 flex items-center justify-between mt-2 pt-6 border-t border-gray-200">
            <Button htmlType="submit" type="primary">
              {mode === "create" ? "Hoàn thành sản phẩm" : "Cập nhật sản phẩm"}
            </Button>
            <div className="flex items-center gap-2">
              <Button onClick={onCancel}>Hủy</Button>
              <Button type="primary" onClick={() => form.submit()}>
                Lưu
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  )
}
