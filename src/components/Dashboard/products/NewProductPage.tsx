// src/components/Dashboard/products/NewProductPage.tsx
"use client"

import { useEffect, useState } from "react"
import { Button, Form, Input, InputNumber, Select, message } from "antd"
import TextArea from "antd/es/input/TextArea"
import { createProduct } from "../../../api/productsAPI" // giữ đúng path bạn đang dùng

type Props = {
  mode?: "create" | "update"
  initialValues?: any
  onCancel?: () => void
  onSubmit?: (values: any) => void
}

export default function NewProductPage({ mode = "create", initialValues, onCancel, onSubmit }: Props) {
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)

  // Prefill nếu có initialValues (chỉ các field có trong swagger)
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        name: initialValues.name,
        description: initialValues.description,
        price: initialValues.price,
        category: initialValues.category,    // nên trùng 1 trong 4 option
        stock: initialValues.stock,
        status: initialValues.status,
        imageUrl: initialValues.imageUrl,
      })
    }
  }, [initialValues, form])

  const handleFinish = async (values: any) => {
    const payload = {
      name: values.name?.trim(),
      description: values.description?.trim() || "",
      price: Number(values.price) || 0,
      category: values.category,   // lấy từ Select
      stock: Number(values.stock) || 0,
      status: values.status,
      imageUrl: values.imageUrl || "",
    }

    try {
      setSubmitting(true)
      await createProduct(payload)
      message.success("Tạo sản phẩm thành công!")
      onSubmit?.(payload)
      form.resetFields()
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data || err?.message || "Lỗi khi tạo sản phẩm"
      message.error(String(msg))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
          {mode === "create" ? "Thêm sản phẩm" : "Cập nhật sản phẩm"}
        </h1>
      </div>

      <div className="flex-1 px-4 sm:px-6 pb-6">
        <Form form={form} layout="vertical" onFinish={handleFinish} className="max-w-3xl">
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
          >
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <TextArea placeholder="Mô tả sản phẩm" className="min-h-[120px]" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá (price)"
            rules={[{ required: true, message: "Vui lòng nhập giá" }]}
          >
            <InputNumber className="w-full" min={0} placeholder="150000" />
          </Form.Item>

          {/* Category → Select với 4 lựa chọn */}
          <Form.Item
            name="category"
            label="Danh mục (category)"
            rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
            initialValue="Necklaces"
          >
            <Select
              options={[
                { value: "Bracelets", label: "Bracelets" },
                { value: "Rings", label: "Rings" },
                { value: "Necklaces", label: "Necklaces" },
                { value: "Others", label: "Others" },
              ]}
              placeholder="Chọn danh mục"
            />
          </Form.Item>

          <Form.Item
            name="stock"
            label="Số lượng tồn (stock)"
            rules={[{ required: true, message: "Vui lòng nhập số lượng tồn" }]}
          >
            <InputNumber className="w-full" min={0} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái (status)"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select
              options={[
                { value: "in-stock", label: "in-stock" },
                { value: "not-available", label: "not-available" },
                { value: "ready-to-publish", label: "ready-to-publish" },
              ]}
              placeholder="Chọn trạng thái"
            />
          </Form.Item>

          <Form.Item name="imageUrl" label="Ảnh (imageUrl)">
            <Input placeholder="https://..." />
          </Form.Item>

          <div className="flex items-center gap-2">
            <Button type="primary" htmlType="submit" loading={submitting}>
              {mode === "create" ? "Hoàn thành sản phẩm" : "Lưu thay đổi"}
            </Button>
            <Button onClick={onCancel} disabled={submitting}>Hủy</Button>
          </div>
        </Form>
      </div>
    </div>
  )
}
