import React, { createContext, use, useEffect, useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';

import {
  nhostRefreshSession,
  nhostSignIn,
  nhostSignOut,
  nhostSignUp,
  NhostSession,
  NhostUser,
} from '@/services/nhost';
import { deleteSecureItem, getSecureItem, setSecureItem } from '@/services/secure-storage';

const SESSION_KEY = 'belli_nhost_session';
const BIOMETRICS_KEY = 'belli_biometrics_enabled';

interface AuthContextValue {
  user: NhostUser | null;
  accessToken: string | undefined;
  isHydrated: boolean;
  isAuthenticated: boolean;
  biometricsEnabled: boolean;
  biometricsAvailable: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<{ verificationRequired: boolean }>;
  logout: () => Promise<void>;
  updateAvatar: (uri: string) => Promise<void>;
  toggleBiometrics: (enabled: boolean) => Promise<boolean>;
  authenticateWithBiometrics: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<NhostSession | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);

  useEffect(() => {
    let active = true;

    async function hydrate() {
      try {
        const [rawSession, rawBio, hasHardware, isEnrolled] = await Promise.all([
          getSecureItem(SESSION_KEY),
          getSecureItem(BIOMETRICS_KEY),
          LocalAuthentication.hasHardwareAsync().catch(() => false),
          LocalAuthentication.isEnrolledAsync().catch(() => false),
        ]);

        if (!active) return;
        setBiometricsAvailable(Boolean(hasHardware && isEnrolled));
        setBiometricsEnabled(rawBio === 'true');

        if (rawSession) {
          const parsed = JSON.parse(rawSession) as NhostSession;
          if (parsed?.refreshToken) {
            try {
              const refreshed = await nhostRefreshSession(parsed.refreshToken);
              if (active) {
                setSession(refreshed);
                await setSecureItem(SESSION_KEY, JSON.stringify(refreshed));
              }
            } catch {
              // Fall back to stored session if offline, or clear if invalid
              if (active && parsed.accessToken) {
                setSession(parsed);
              }
            }
          }
        }
      } catch {
        // Ignore corrupted session
      } finally {
        if (active) {
          setIsHydrated(true);
        }
      }
    }

    hydrate();
    return () => {
      active = false;
    };
  }, []);

  const persistSession = async (next: NhostSession) => {
    setSession(next);
    await setSecureItem(SESSION_KEY, JSON.stringify(next));
  };

  const login = async (email: string, password: string) => {
    const nextSession = await nhostSignIn(email, password);
    await persistSession(nextSession);
  };

  const register = async (input: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    const displayName = `${input.firstName.trim()} ${input.lastName.trim()}`.trim();
    const res = await nhostSignUp({
      email: input.email,
      password: input.password,
      displayName,
    });

    if (res.session) {
      await persistSession(res.session);
    }

    return { verificationRequired: res.verificationRequired };
  };

  const logout = async () => {
    const tokenToRevoke = session?.refreshToken;
    setSession(null);
    await deleteSecureItem(SESSION_KEY);
    await nhostSignOut(tokenToRevoke);
  };

  const updateAvatar = async (uri: string) => {
    if (!session) return;
    const updated: NhostSession = {
      ...session,
      user: { ...session.user, avatarUrl: uri },
    };
    await persistSession(updated);
  };

  const authenticateWithBiometrics = async (): Promise<boolean> => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock Belli Boutique',
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use Passcode',
      });
      return result.success;
    } catch {
      return false;
    }
  };

  const toggleBiometrics = async (enabled: boolean): Promise<boolean> => {
    if (enabled) {
      const ok = await authenticateWithBiometrics();
      if (!ok) return false;
    }
    setBiometricsEnabled(enabled);
    await setSecureItem(BIOMETRICS_KEY, enabled ? 'true' : 'false');
    return true;
  };

  return (
    <AuthContext
      value={{
        user: session?.user ?? null,
        accessToken: session?.accessToken,
        isHydrated,
        isAuthenticated: Boolean(session?.accessToken),
        biometricsEnabled,
        biometricsAvailable,
        login,
        register,
        logout,
        updateAvatar,
        toggleBiometrics,
        authenticateWithBiometrics,
      }}>
      {children}
    </AuthContext>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = use(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
