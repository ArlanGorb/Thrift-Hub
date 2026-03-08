'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Profile } from '@/lib/types';
import { isSupabaseConfigured } from '@/lib/utils';

interface AuthContextValue {
  user: Profile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const DEMO_ADMIN: Profile = {
  id: 'admin-demo',
  name: 'Admin User',
  email: 'admin@thrifthub.com',
  role: 'admin',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const DEMO_USER: Profile = {
  id: 'user-demo',
  name: 'Demo User',
  email: 'user@thrifthub.com',
  role: 'customer',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const AUTH_STORAGE_KEY = 'thrift_hub_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persisted session
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    }

    if (isSupabaseConfigured()) {
      // When Supabase is configured, initialize Supabase auth listener
      import('@/lib/supabase').then(({ getSupabaseClient }) => {
        const supabase = getSupabaseClient();
        supabase.auth.getSession().then(async ({ data: { session } }) => {
          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            if (profile) {
              setUser(profile);
              localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
            }
          }
          setLoading(false);
        });

        supabase.auth.onAuthStateChange(async (event, session) => {
          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            if (profile) {
              setUser(profile);
              localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
            }
          } else {
            setUser(null);
            localStorage.removeItem(AUTH_STORAGE_KEY);
          }
        });
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (isSupabaseConfigured()) {
      const { getSupabaseClient } = await import('@/lib/supabase');
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error: error.message };
      return {};
    }

    // Demo mode
    if (email === 'admin@thrifthub.com' && password === 'admin123') {
      setUser(DEMO_ADMIN);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_ADMIN));
      return {};
    }
    if (email === 'user@thrifthub.com' && password === 'user123') {
      setUser(DEMO_USER);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_USER));
      return {};
    }
    // Allow any email/password in demo mode (creates a customer)
    const demoProfile: Profile = {
      id: `demo-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: 'customer',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setUser(demoProfile);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoProfile));
    return {};
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    if (isSupabaseConfigured()) {
      const { getSupabaseClient } = await import('@/lib/supabase');
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) return { error: error.message };
      return {};
    }

    // Demo mode
    const demoProfile: Profile = {
      id: `demo-${Date.now()}`,
      name,
      email,
      role: 'customer',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setUser(demoProfile);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoProfile));
    return {};
  }, []);

  const logout = useCallback(async () => {
    if (isSupabaseConfigured()) {
      const { getSupabaseClient } = await import('@/lib/supabase');
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
