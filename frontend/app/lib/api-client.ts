import { getStoredToken } from './auth-client';

const GATEWAY_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

type ApiFetchOptions = RequestInit & {
  auth?: boolean;
};

export async function apiFetch<T = unknown>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  if (!GATEWAY_URL) {
    throw new Error('NEXT_PUBLIC_API_GATEWAY_URL chưa được cấu hình trong .env');
  }

  const { auth = false, headers: customHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(customHeaders as Record<string, string>),
  };

  if (auth) {
    const token = getStoredToken();
    if (!token) {
      throw new Error('Bạn cần đăng nhập để thực hiện thao tác này');
    }
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${GATEWAY_URL}${path}`, {
    ...rest,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      (data as { message?: string })?.message || 'Yêu cầu thất bại'
    );
  }

  return data as T;
}

export { GATEWAY_URL };
