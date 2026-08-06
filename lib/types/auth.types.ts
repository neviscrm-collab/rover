// ─── User Role ────────────────────────────────────────────────────────────────

export enum UserRole {
  CUSTOMER = "CUSTOMER",
  AGENCY = "AGENCY",
}

// ─── Authenticated User ───────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  profileCompletion: number; // 0–100
  createdAt: string;         // ISO date
}

// ─── Auth Payloads ────────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface GoogleAuthPayload {
  googleToken: string; // ID token from Google
  role?: UserRole;     // required on first sign-up
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyEmailPayload {
  email: string;
  code: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface CompleteProfilePayload {
  userId: string;
  // customer-specific
  nationality?: string;
  passportNumber?: string;
  emergencyContact?: string;
  travelInterests?: string[];
  // agency-specific
  agencyName?: string;
  gstNumber?: string;
  country?: string;
  city?: string;
  address?: string;
  description?: string;
}

// ─── Auth Response ────────────────────────────────────────────────────────────

export interface AuthResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
}

// ─── Token Payload ────────────────────────────────────────────────────────────

export interface TokenPayload {
  userId: string;
  role: UserRole;
  exp: number;
}

// ─── Auth Store State ─────────────────────────────────────────────────────────

export interface AuthState {
  user: AuthUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  loading: boolean;
  token: string | null;
  refreshToken: string | null;
  tokenExpiry: number | null;  // ms timestamp — null = no expiry (mock/Google auth)
  _hydrated: boolean;
}
