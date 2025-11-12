import { api } from './axios';

export type CharmType = 'charm' | 'template';

export type Charm = {
  cProduct_Id: string;
  user_Id?: string;
  name: string;
  category?: string;
  price: number;
  imageUrl?: string;
  charmType?: CharmType; // Custom field to distinguish between charm and template
};

export type CreateCharmRequest = {
  user_Id?: string;
  name: string;
  category?: string;
  price: number;
  imageUrl?: string;
};

export type UpdateCharmRequest = {
  user_Id?: string;
  name?: string;
  category?: string;
  price: number;
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

/** Get all charms */
export async function getAllCharms(query?: string): Promise<Charm[]> {
  const token = getToken();
  const url = query ? `/Charms?q=${encodeURIComponent(query)}` : '/Charms';
  const res = await api.get<Charm[]>(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

/** Get charm by ID */
export async function getCharmById(id: string): Promise<Charm> {
  const token = getToken();
  const res = await api.get<Charm>(`/Charms/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

/** Create a new charm */
export async function createCharm(data: CreateCharmRequest): Promise<Charm> {
  const token = getToken();
  const res = await api.post<Charm>('/Charms', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

/** Update an existing charm */
export async function updateCharm(id: string, data: UpdateCharmRequest): Promise<void> {
  const token = getToken();
  await api.put(`/Charms/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** Delete a charm */
export async function deleteCharm(id: string): Promise<void> {
  const token = getToken();
  await api.delete(`/Charms/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
