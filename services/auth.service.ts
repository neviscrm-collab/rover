/**
 * Auth Service
 *
 * All authentication flows go through this service.
 * Business logic in pages/components must never call mock APIs directly.
 * Swap the mock implementation for Zoho CRM / OAuth here only.
 */

import type {
  AuthResponse,
  AuthUser,
  ForgotPasswordPayload,
  GoogleAuthPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
  CompleteProfilePayload,
} from "@/lib/types/auth.types";
import { UserRole } from "@/lib/types/auth.types";
import { generateId } from "@/lib/api/crm.client";

// ─── Mock Store (localStorage-backed) ────────────────────────────────────────

const TOKEN_KEY = "rover_auth_token";
const USER_KEY = "rover_auth_user";

function saveSession(token: string, user: AuthUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function generateMockToken(userId: string): string {
  return `mock_token_${userId}_${Date.now()}`;
}

// ─── Auth Service ─────────────────────────────────────────────────────────────

class AuthServiceClass {
  /**
   * Sign in with email and password.
   * Replace with Zoho OAuth token exchange when integrating.
   */
  async login(payload: LoginPayload): Promise<AuthResponse> {
    await delay(600);

    // Load mock users
    const users = (await import("@/mock/users.json")).default;
    const found = users.find(
      (u) => u.email === payload.email && u.password === payload.password
    );

    if (!found) {
      throw new Error("Invalid email or password.");
    }

    const user: AuthUser = {
      id: found.id,
      name: found.name,
      email: found.email,
      avatar: found.avatar,
      role: found.role as UserRole,
      profileCompletion: found.profileCompletion,
      createdAt: found.createdAt,
    };

    const token = generateMockToken(user.id);
    const refreshToken = generateMockToken(`refresh_${user.id}`);

    saveSession(token, user);

    return { user, token, refreshToken };
  }

  /**
   * Register a new user with email.
   */
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    await delay(800);

    // Check uniqueness in mock data
    const users = (await import("@/mock/users.json")).default;
    const exists = users.find((u) => u.email === payload.email);
    if (exists) {
      throw new Error("An account with this email already exists.");
    }

    const user: AuthUser = {
      id: generateId("usr"),
      name: payload.name,
      email: payload.email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(payload.name)}&background=7C3AED&color=fff`,
      role: payload.role,
      profileCompletion: 20,
      createdAt: new Date().toISOString(),
    };

    const token = generateMockToken(user.id);
    const refreshToken = generateMockToken(`refresh_${user.id}`);

    saveSession(token, user);

    return { user, token, refreshToken };
  }

  /**
   * Sign in / up via Google OAuth.
   * In production: exchange Google ID token for a Zoho CRM session.
   */
  async loginWithGoogle(payload: GoogleAuthPayload): Promise<AuthResponse> {
    await delay(700);

    // Mock: simulate Google returning a user profile
    const googleUser: AuthUser = {
      id: generateId("usr"),
      name: "Google User",
      email: `google_${Date.now()}@gmail.com`,
      avatar: "https://ui-avatars.com/api/?name=G&background=4285F4&color=fff",
      role: payload.role ?? UserRole.CUSTOMER,
      profileCompletion: 30,
      createdAt: new Date().toISOString(),
    };

    const token = generateMockToken(googleUser.id);
    const refreshToken = generateMockToken(`refresh_${googleUser.id}`);

    saveSession(token, googleUser);

    return { user: googleUser, token, refreshToken };
  }

  /**
   * Sign out the current user and clear the session.
   */
  async logout(): Promise<void> {
    await delay(200);
    clearSession();
  }

  /**
   * Send a password reset email.
   */
  async forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string }> {
    await delay(600);

    const users = (await import("@/mock/users.json")).default;
    const found = users.find((u) => u.email === payload.email);

    // Always return success to avoid email enumeration
    if (!found) {
      return { message: "If this email exists, a reset link has been sent." };
    }

    return { message: "Password reset link sent to your email." };
  }

  /**
   * Verify email with a 6-digit OTP code.
   */
  async verifyEmail(payload: VerifyEmailPayload): Promise<{ verified: boolean }> {
    await delay(500);
    // Mock: any 6-digit code starting with '1' is valid
    const valid = /^1\d{5}$/.test(payload.code) || payload.code === "123456";
    if (!valid) throw new Error("Invalid or expired verification code.");
    return { verified: true };
  }

  /**
   * Reset password using the token from the reset email.
   */
  async resetPassword(payload: ResetPasswordPayload): Promise<{ success: boolean }> {
    await delay(600);
    if (!payload.token.startsWith("mock_reset_") && payload.token !== "test_token") {
      throw new Error("Invalid or expired reset token.");
    }
    return { success: true };
  }

  /**
   * Complete user profile after initial sign-up.
   */
  async completeProfile(payload: CompleteProfilePayload): Promise<AuthUser> {
    await delay(700);

    const stored = typeof window !== "undefined"
      ? localStorage.getItem(USER_KEY)
      : null;

    if (!stored) throw new Error("No active session.");

    const user: AuthUser = {
      ...(JSON.parse(stored) as AuthUser),
      profileCompletion: 90,
    };

    saveSession(localStorage.getItem(TOKEN_KEY) ?? "", user);
    return user;
  }

  /**
   * Refresh the auth token.
   * In production: call Zoho's token refresh endpoint.
   */
  async refreshToken(token: string): Promise<{ token: string; refreshToken: string }> {
    await delay(300);
    const newToken = `${token}_refreshed_${Date.now()}`;
    return { token: newToken, refreshToken: `refresh_${newToken}` };
  }

  /**
   * Get the currently authenticated user from the local session.
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    if (!stored || !token) return null;
    try {
      return JSON.parse(stored) as AuthUser;
    } catch {
      return null;
    }
  }

  /**
   * Get the current session token.
   */
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  }
}

export const AuthService = new AuthServiceClass();

// ─── Utility ──────────────────────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
