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

export async function loginWithPassword(email: string, password: string): Promise<LoginResponse> {
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

export async function fetchCurrentUser(token: string) {
  const response = await fetch(`${AUTH_SERVICE_URL}${AUTH_ME_PATH}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Token không hợp lệ");
  }

  return response.json();
}

export function getStoredToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function saveToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
}
