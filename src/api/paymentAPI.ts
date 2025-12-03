import { api } from './axios';

export type PayOSCreateRequest = {
  orderId: string;
};

export type PayOSCreateResponse = {
  checkoutUrl: string;
  orderCode: number;
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

/** Create PayOS payment URL */
export async function createPayOSPayment(body: PayOSCreateRequest) {
  const token = getToken();
  const res = await api.post<PayOSCreateResponse>('/PayOS/create-payment-link', body, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
