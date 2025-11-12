import { api } from './axios';

export type VNPayCreateRequest = {
  orderId: string;
  bankCode?: string;
  voucherCode?: string;
};

export type VNPayCreateResponse = {
  paymentUrl: string;
  voucherApplied?: boolean;
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

/** Create VNPay payment URL */
export async function createVNPayPayment(body: VNPayCreateRequest) {
  const token = getToken();
  const res = await api.post<VNPayCreateResponse>('/Payments/vnpay-create', body, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
