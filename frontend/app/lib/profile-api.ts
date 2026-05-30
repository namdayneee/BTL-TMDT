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

const ADMIN_USERS_PATH = process.env.NEXT_PUBLIC_ADMIN_USERS_PATH;

export async function updateUserProfileAsAdmin(
  userId: number,
  data: Pick<UserProfile, 'fullName' | 'phone' | 'address'>
): Promise<UserProfile> {
  if (!ADMIN_USERS_PATH) {
    throw new Error('NEXT_PUBLIC_ADMIN_USERS_PATH chưa được cấu hình');
  }
  return apiFetch<UserProfile>(`${ADMIN_USERS_PATH}/${userId}/profile`, {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify(data),
  });
}
