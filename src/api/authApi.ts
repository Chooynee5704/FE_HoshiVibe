// src/api/authApi.ts
import { api } from "./axios";

export type LoginRequest = {
  identifier: string;   // email hoặc account
  password: string;
};

export type LoginResponse = {
  token: string;
  user_Id: string;
  email: string;
  account: string;
  role: 'Admin' | 'Customer';
  message: string;
};

export type HvUser = {
  user_Id: string;
  email: string;
  account: string;
  role: 'Admin' | 'Customer';
};

export async function loginApi(payload: LoginRequest) {
  const { data } = await api.post<LoginResponse>("/Authentication/login", payload);

  localStorage.setItem("hv_token", data.token);
  localStorage.setItem("hv_user", JSON.stringify({
    user_Id: data.user_Id,
    email: data.email,
    account: data.account,
    role: data.role,
  }));
  return data;
}

export function logoutApi() {
  localStorage.removeItem("hv_token");
  localStorage.removeItem("hv_user");
}

export function isAuthenticated() {
  return !!localStorage.getItem("hv_token");
}

export type RegisterRequest = {
  email: string;
  account: string;
  password: string;
};

export type RegisterResponse = {
  message: string;
};

export async function registerApi(payload: RegisterRequest) {
  const { data } = await api.post<RegisterResponse>("/Authentication/register", payload);
  return data;
}

export function getCurrentUser(): HvUser | null {
  try {
    const raw = localStorage.getItem("hv_user");
    if (!raw) return null;

    const user = JSON.parse(raw) as HvUser;

    // Kiểm tra dữ liệu có đủ trường hợp lệ không
    if (!user.user_Id || !user.role) return null;

    return user;
  } catch (err) {
    console.error("Lỗi khi đọc hv_user từ localStorage:", err);
    return null;
  }
}