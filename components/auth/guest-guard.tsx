"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { UserRole } from "@/lib/types/auth.types";

interface GuestGuardProps {
  children: React.ReactNode;
}

/**
 * Redirects already-authenticated users away from auth pages.
 * e.g. /login → /app (customer) or /studio (agency)
 */
export default function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, role, loading, initialize } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace(role === UserRole.AGENCY ? "/studio" : "/app");
    }
  }, [isAuthenticated, role, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) return null;

  return <>{children}</>;
}
