'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getStoredToken } from '../lib/auth-client';
import { fetchMyProfile, updateMyProfile } from '../lib/profile-api';
import type { UserProfile } from '../lib/types';

type ProfileContextValue = {
  profile: UserProfile;
  loading: boolean;
  displayName: string;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<UserProfile>;
  setProfileLocal: (data: Partial<UserProfile>) => void;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>({});
  const [loading, setLoading] = useState(false);

  const refreshProfile = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setProfile({});
      return;
    }
    setLoading(true);
    try {
      const data = await fetchMyProfile();
      setProfile(data);
    } catch {
      setProfile({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshProfile();
  }, [refreshProfile]);

  useEffect(() => {
    const onAuthChange = () => void refreshProfile();
    const onFocus = () => void refreshProfile();
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'auth_token') void refreshProfile();
    };
    window.addEventListener('vault-auth-changed', onAuthChange);
    window.addEventListener('focus', onFocus);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('vault-auth-changed', onAuthChange);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('storage', onStorage);
    };
  }, [refreshProfile]);

  const setProfileLocal = useCallback((data: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...data }));
  }, []);

  const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
    const updated = await updateMyProfile(data);
    setProfile(updated);
    return updated;
  }, []);

  const displayName = useMemo(() => {
    if (profile.fullName?.trim()) return profile.fullName.trim();
    return '';
  }, [profile.fullName]);

  const value = useMemo(
    () => ({
      profile,
      loading,
      displayName,
      refreshProfile,
      updateProfile,
      setProfileLocal,
    }),
    [profile, loading, displayName, refreshProfile, updateProfile, setProfileLocal]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return ctx;
}

export function useProfileOptional() {
  return useContext(ProfileContext);
}
