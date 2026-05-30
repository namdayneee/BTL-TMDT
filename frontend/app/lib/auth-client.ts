const AUTH_TOKEN_KEY = "auth_token";
const AUTH_SERVICE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL;
const AUTH_LOGIN_PATH = process.env.NEXT_PUBLIC_AUTH_LOGIN_PATH;
const AUTH_REGISTER_PATH = process.env.NEXT_PUBLIC_AUTH_REGISTER_PATH;
const AUTH_ME_PATH = process.env.NEXT_PUBLIC_AUTH_ME_PATH;

type LoginResponse = {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
};

type RegisterResponse = {
  message: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
};

export type AuthUser = {
  id: number;
  email: string;
  role: string;
  createdAt: string;
};

function assertAuthEnv() {
  if (!AUTH_SERVICE_URL || !AUTH_LOGIN_PATH || !AUTH_REGISTER_PATH || !AUTH_ME_PATH) {
    throw new Error('Biến auth chưa được cấu hình đầy đủ trong .env');
  }
}

export async function loginWithPassword(email: string, password: string): Promise<LoginResponse> {
  assertAuthEnv();
  const response = await fetch(`${AUTH_SERVICE_URL}${AUTH_LOGIN_PATH}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Đăng nhập thất bại");
  }

  return data as LoginResponse;
}

export async function registerWithPassword(email: string, password: string): Promise<RegisterResponse> {
  assertAuthEnv();
  const response = await fetch(`${AUTH_SERVICE_URL}${AUTH_REGISTER_PATH}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Đăng ký thất bại");
  }

  return data as RegisterResponse;
}

export async function fetchCurrentUser(token: string): Promise<AuthUser> {
  assertAuthEnv();
  const response = await fetch(`${AUTH_SERVICE_URL}${AUTH_ME_PATH}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Token không hợp lệ");
  }

  return response.json() as Promise<AuthUser>;
}

export async function fetchMe(): Promise<AuthUser> {
  const token = getStoredToken();
  if (!token) {
    throw new Error("Unauthorized");
  }
  return fetchCurrentUser(token);
}

export function displayNameFromProfile(
  email: string,
  fullName?: string | null
): string {
  if (fullName?.trim()) return fullName.trim();
  return displayNameFromEmail(email);
}

export function displayNameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? email;
  return local.replace(/[._-]/g, " ").trim().toUpperCase();
}

export function roleBadgeLabel(role: string): string {
  if (role === "admin") return "QUẢN TRỊ VIÊN";
  return "THÀNH VIÊN HẠNG BLACK";
}

export function isAdminRole(role: string): boolean {
  return role === "admin";
}

export function getStoredToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function saveToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  window.dispatchEvent(new Event("vault-auth-changed"));
}

export function clearToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.dispatchEvent(new Event("vault-auth-changed"));
}
