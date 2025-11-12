import { api } from './axios';

export type DashboardStats = {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
};

export type OrderSummary = {
  productId: string;
  totalQuantitySold: number;
  totalRevenue: number;
};

export type MostAddedProduct = {
  product_Id: string;
  name: string;
  category: string;
  timesAdded: number;
  imageUrl?: string;
};

export type MonthlyOrderStat = {
  month: number;
  year: number;
  totalOrders: number;
  totalRevenue: number;
};

export type DailyRevenueStat = {
  day: number;
  totalOrders: number;
  totalRevenue: number;
};

export type TopSellingProduct = {
  product_Id: string;
  name: string;
  category: string;
  totalQuantitySold: number;
  totalRevenue: number;
  imageUrl?: string;
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

/** Get dashboard statistics */
export async function getDashboardStats(): Promise<DashboardStats> {
  const token = getToken();
  const res = await api.get('/DashBoard/stats', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.summary || res.data;
}

/** Get order summary by product ID */
export async function getOrderSummaryByProduct(productId: string): Promise<OrderSummary> {
  const token = getToken();
  const res = await api.get(`/DashBoard/get-summary-order${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

/** Get most added to cart products */
export async function getMostAddedProducts(topN: number = 5): Promise<MostAddedProduct[]> {
  const token = getToken();
  const res = await api.get('/DashBoard/most-added-products', {
    params: { topN },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

/** Get total orders by month */
export async function getTotalOrdersByMonth(month: number, year: number): Promise<{ totalOrders: number }> {
  const token = getToken();
  const res = await api.get('/DashBoard/orders-by-month', {
    params: { month, year },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

/** Get monthly order statistics */
export async function getMonthlyOrderStats(year: number): Promise<MonthlyOrderStat[]> {
  const token = getToken();
  const res = await api.get('/DashBoard/monthly-order-stats', {
    params: { year },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data || res.data;
}

/** Get top selling products */
export async function getTopSellingProducts(top: number = 5): Promise<TopSellingProduct[]> {
  const token = getToken();
  const res = await api.get(`/DashBoard/get-top-selling-product${top}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

/** Get daily revenue statistics */
export async function getDailyRevenueStats(month: number, year: number): Promise<DailyRevenueStat[]> {
  const token = getToken();
  const res = await api.get('/DashBoard/daily-revenue-stats', {
    params: { month, year },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data || res.data;
}
