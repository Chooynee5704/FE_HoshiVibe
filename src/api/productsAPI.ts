import { api } from './axios';

export type ProductCreateRequest = {
    name: string;
    description?: string;
    price: number;
    category: string;
    stock: number;
    status: string;
    imageUrl?: string;
}

export type ProductApi = {
  product_Id: string;
  name: string;
  description?: string;
  price: number;
  category: string;     // ví dụ: "necklace" | "Necklaces" ...
  stock: number;
  imageUrl?: string;    // BE có thể trả imageUrl hoặc imageURL
  imageURL?: string;
  status: "in-stock" | "not-available" | "ready-to-publish" | string;
};

export type ProductUpdateRequest = Partial<ProductCreateRequest> & { id?: number; }

function getToken(): string {
    const t1 = localStorage.getItem('hw_token');
    if (t1) return t1;
    try {
        const user = JSON.parse(localStorage.getItem('hw_user') || 'null');
        return user?.acessToken || user?.Token || '';
    } catch {
        return '';
    }
}

/**  Create **/
export async function createProduct(body: ProductCreateRequest, token?: string){
    const tk = token || getToken();
    const res = await api.post('/Product/create', body, {
        headers: {
            Authorization: `Bearer ${tk}`,
        },
    });
    return res.data;
}

/** GET /api/Product/search */
export async function searchProducts(params?: Record<string, any>) {
  const token = getToken();
  const res = await api.get<ProductApi[]>("/Product/search", {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function getProductById(productId: string) {
  try  {
  const token = getToken?.(); // dùng lại hàm getToken sẵn có
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const res = await api.get(`/Product/${productId}`, config);
  return res.data;
} catch (err) {
  console.error("Error fetching product detail:", err);
  throw err;
}
}



export async function deleteProduct(productId: string) {
  const token = getToken()

  console.log("🟡 Gửi yêu cầu DELETE:", productId)
  console.log("🟢 Token tồn tại:", !!token)

  try {
    const res = await api.delete(`/Product/delete/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    console.log("✅ Phản hồi DELETE:", res.status, res.data)
    return res.data // ví dụ: { message: "Xóa sản phẩm thành công." }
  } catch (err: any) {
    console.error("❌ Lỗi DELETE:", {
      status: err?.response?.status,
      data: err?.response?.data,
      message: err?.message,
    })
    throw err
  }
}