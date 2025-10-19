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

const TOKEN_KEY = "hv_token";
const USER_KEY = "hv_user";

/** Storage Helpers **/
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function saveAuth(data: LoginResponse) {
  localStorage.setItem(TOKEN_KEY, data.token);
  const user: HvUser = {
    user_Id: data.user_Id,
    email: data.email,
    account: data.account,
    role: data.role,
}
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

export function saveUser(user: HvUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/** ================== Public APIs ================== */

export async function loginApi(payload: LoginRequest) {
  const { data } = await api.post<LoginResponse>("Authentication/login", payload);
  const user = saveAuth(data);
  return {...data, user };
}

export function logoutApi() {
  clearAuth();
}

export function isAuthenticated() {
  return !!getToken();
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

/** 
 * checkLogin: trả về user nếu đã đăng nhập, ngược lại null
 * (Dùng trong Header hoặc nơi nào cần)
 */

export function checkLogin(): HvUser | null {
  return getCurrentUser();
}

/**
 * Đăng ký listener để biết khi nào hv_user/hv_token thay đổi
 * (hữu ích khi nhiều tab cùng mở)
 */

export function onAuthChange(callback: () => void) {
  const handler = (event: StorageEvent) => {
    if (event.key === TOKEN_KEY || event.key === USER_KEY) {
      callback();
    } 
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("storage", handler);
    };
  }
}