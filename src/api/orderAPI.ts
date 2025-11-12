import { api } from './axios';

export type OrderStatus = 'Pending' | 'Processing' | 'Completed' | 'Cancelled';

export type OrderDetail = {
  orderDetail_Id?: string;
  orderDetailId?: string; // Backend returns camelCase
  orderId: string;
  productId?: string;
  cProduct_Id?: string;
  customDesignId?: string;
  customDesign_Id?: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  product?: {
    product_Id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    imageURL?: string;
    price: number;
  };
  customDesign?: {
    customDesign_Id: string;
    name: string;
    description?: string;
    aiImageUrl?: string;
    price: number;
  };
};

export type Order = {
  order_Id: string;
  user_Id: string;
  voucher_Id?: string;
  totalPrice: number;
  discountAmount: number;
  finalPrice: number;
  shippingAddress?: string;
  phoneNumber?: number;
  orderDate: string;
  status: OrderStatus;
  shippingStatus?: 'Pending' | 'Shipping' | 'Delivered' | 'PickedUp';
  orderDetails?: OrderDetail[];
};

export type CreateOrderRequest = {
  user_Id: string;
  voucher_Id?: string;
  totalPrice: number;
  discountAmount: number;
  finalPrice: number;
  shippingAddress?: string;
  phoneNumber?: number;
  orderDate?: string;
  status: string;
};

export type CreateOrderDetailRequest = {
  orderId?: string; // Optional - backend will use user's pending order or create new one
  productId?: string;
  cProduct_Id?: string;
  customDesign_Id?: string;
  quantity: number;
  unitPrice: number;
  discount: number;
};

export type UpdateOrderDetailRequest = {
  orderId: string;
  productId?: string;
  cProduct_Id?: string;
  quantity: number;
  unitPrice: number;
  discount: number;
};

function getToken(): string {
  const t1 = localStorage.getItem('hv_token');
  if (t1) return t1;
  try {
    const user = JSON.parse(localStorage.getItem('hv_user') || 'null');
    return user?.token || '';
  } catch {
    return '';
  }
}

/** Get pending order (user's cart) */
export async function getPendingOrder() {
  const token = getToken();
  const res = await api.get<Order>('/Order/pending', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

/** Get user's orders by userId */
export async function getUserOrders(userId: string) {
  const token = getToken();
  const res = await api.get<Order[]>(`/Order/user/order/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

/** Create a new order */
export async function createOrder(body: CreateOrderRequest) {
  const token = getToken();
  const res = await api.post<Order>('/Order/create', body, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

/** Get order details by orderId */
export async function getOrderDetails(orderId: string) {
  const token = getToken();
  const res = await api.get<OrderDetail[]>(`/OrderDetail/order/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

/** Add item to cart (create order detail) */
export async function addOrderDetail(body: CreateOrderDetailRequest) {
  const token = getToken();
  
  console.log('Creating order detail:', body);
  
  const res = await api.post<OrderDetail>('/OrderDetail/create', body, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  console.log('Order detail created:', res.data);
  return res.data;
}

/** Remove item from cart (delete order detail) */
export async function deleteOrderDetail(orderDetailId: string) {
  const token = getToken();
  const res = await api.delete(`/OrderDetail/delete/${orderDetailId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

/** Update order detail quantity (delete and recreate) */
export async function updateOrderDetailQuantity(
  orderDetailId: string,
  orderId: string,
  productId: string,
  quantity: number,
  unitPrice: number,
  discount: number = 0
) {
  const token = getToken();
  
  const body: UpdateOrderDetailRequest = {
    orderId,
    productId,
    quantity,
    unitPrice,
    discount,
  };
  
  console.log('Updating order detail:', orderDetailId, body);
  
  const res = await api.put<OrderDetail>(`/OrderDetail/update/${orderDetailId}`, body, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  console.log('Order detail updated:', res.data);
  return res.data;
}

export type UpdateOrderRequest = {
  user_Id: string;
  voucher_Id?: string;
  totalPrice: number;
  discountAmount: number;
  finalPrice: number;
  shippingAddress?: string;
  phoneNumber?: number;
  orderDate?: string;
  status?: string;
};

export async function updateOrder(orderId: string, request: UpdateOrderRequest) {
  const token = getToken();
  
  console.log('Updating order:', orderId, request);
  
  const res = await api.put(`/Order/update/${orderId}`, request, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  console.log('Order updated:', res.data);
  return res.data;
}

export async function getAllUserOrders(userId: string): Promise<Order[]> {
  const token = getToken();
  
  console.log('Fetching all orders for user:', userId);
  
  const res = await api.get<Order[]>(`/Order/user/orders/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  console.log('Orders fetched:', res.data);
  return res.data;
}

export async function updateShippingStatus(
  orderId: string,
  shippingStatus: 'Pending' | 'Shipping' | 'Delivered' | 'PickedUp'
) {
  const token = getToken();
  
  console.log('Updating shipping status:', orderId, shippingStatus);
  
  const res = await api.put(
    `/Order/update-shipping-status/${orderId}`,
    { shippingStatus },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  
  console.log('Shipping status updated:', res.data);
  return res.data;
}

export async function deleteOrder(orderId: string) {
  const token = getToken();
  
  console.log('Deleting order:', orderId);
  
  const res = await api.delete(`/Order/delete/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  console.log('Order deleted:', res.data);
  return res.data;
}

export async function getOrderById(orderId: string): Promise<Order> {
  const token = getToken();
  
  console.log('Fetching order by ID:', orderId);
  
  const res = await api.get<Order>(`/Order/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  console.log('Order fetched:', res.data);
  return res.data;
}
