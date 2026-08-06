"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthUser, AuthState } from "@/lib/types/auth.types";
import { UserRole } from "@/lib/types/auth.types";
import { AuthService } from "@/services/auth.service";

// ─── Auth Store Actions ───────────────────────────────────────────────────────

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (role?: UserRole) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  setUser: (user: AuthUser) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => Promise<void>;
  setHydrated: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // ── State ──────────────────────────────────────────────────────────────
      user: null,
      role: null,
      isAuthenticated: false,
      loading: false,
      token: null,
      refreshToken: null,
      tokenExpiry: null,
      _hydrated: false,

      // ── Actions ────────────────────────────────────────────────────────────

      login: async (email, password) => {
        set({ loading: true });
        try {
          const { user, token, refreshToken } = await AuthService.login({ email, password });
          set({
            user,
            role: user.role,
            isAuthenticated: true,
            token,
            refreshToken,
            loading: false,
          });
        } catch (err) {
          set({ loading: false });
          throw err;
        }
      },

      loginWithGoogle: async (role) => {
        set({ loading: true });
        try {
          const { user, token, refreshToken } = await AuthService.loginWithGoogle({
            googleToken: "mock_google_token",
            role,
          });
          set({
            user,
            role: user.role,
            isAuthenticated: true,
            token,
            refreshToken,
            loading: false,
          });
        } catch (err) {
          set({ loading: false });
          throw err;
        }
      },

      register: async (name, email, password, role) => {
        set({ loading: true });
        try {
          const { user, token, refreshToken } = await AuthService.register({
            name,
            email,
            password,
            role,
          });
          set({
            user,
            role: user.role,
            isAuthenticated: true,
            token,
            refreshToken,
            loading: false,
          });
        } catch (err) {
          set({ loading: false });
          throw err;
        }
      },

      logout: async () => {
        await AuthService.logout();
        set({
          user: null,
          role: null,
          isAuthenticated: false,
          token: null,
          refreshToken: null,
          tokenExpiry: null,
        });
      },

      refresh: async () => {
        const { token } = get();
        if (!token) return;
        try {
          const { token: newToken, refreshToken } = await AuthService.refreshToken(token);
          set({ token: newToken, refreshToken });
        } catch {
          // Token refresh failed — log out
          await get().logout();
        }
      },

      setUser: (user) => set({ user, role: user.role }),
      setLoading: (loading) => set({ loading }),
      setHydrated: () => set({ _hydrated: true }),

      initialize: async () => {
        set({ loading: true });

        // ── Check Zoho token expiry on every app load ──────────────────────
        const { token, tokenExpiry } = get();
        if (token && tokenExpiry && Date.now() > tokenExpiry) {
          // Token expired — clear session silently
          await AuthService.logout();
          set({
            user: null, role: null, isAuthenticated: false,
            token: null, refreshToken: null, tokenExpiry: null,
            loading: false,
          });
          return;
        }

        const user = await AuthService.getCurrentUser();
        if (user) {
          set({
            user,
            role: user.role,
            isAuthenticated: true,
            token: AuthService.getToken(),
            loading: false,
          });
        } else {
          set({ loading: false });
        }
      },
    }),
    {
      name: "rover_auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user:            state.user,
        role:            state.role,
        isAuthenticated: state.isAuthenticated,
        token:           state.token,
        refreshToken:    state.refreshToken,
        tokenExpiry:     state.tokenExpiry,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.tokenExpiry && Date.now() > state.tokenExpiry) {
          // Token already expired at boot — wipe auth before UI renders
          state.user            = null;
          state.role            = null;
          state.isAuthenticated = false;
          state.token           = null;
          state.refreshToken    = null;
          state.tokenExpiry     = null;
        }
        state?.setHydrated();
      },
    }
  )
);
