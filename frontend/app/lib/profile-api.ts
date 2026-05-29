import { apiFetch } from './api-client';
import type { UserProfile } from './types';

const PROFILE_PATH = process.env.NEXT_PUBLIC_AUTH_PROFILE_PATH;

function assertPath(path: string | undefined, name: string): asserts path is string {
  if (!path) throw new Error(`${name} chưa được cấu hình trong .env`);
}

export async function fetchMyProfile(): Promise<UserProfile> {
  assertPath(PROFILE_PATH, 'NEXT_PUBLIC_AUTH_PROFILE_PATH');
  return apiFetch<UserProfile>(PROFILE_PATH, { auth: true });
}

export async function updateMyProfile(data: Partial<UserProfile>): Promise<UserProfile> {
  assertPath(PROFILE_PATH, 'NEXT_PUBLIC_AUTH_PROFILE_PATH');
  return apiFetch<UserProfile>(PROFILE_PATH, {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify(data),
  });
}
