"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { UserRole } from "@/lib/types/auth.types";

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole: UserRole;
}

/**
 * Ensures the authenticated user has the required role.
 * Redirects to the correct portal if the role doesn't match.
 */
const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
    <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
  </div>
);

export default function RoleGuard({ children, requiredRole }: RoleGuardProps) {
  const { role, isAuthenticated, loading, _hydrated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Only redirect after the store has fully hydrated — prevents false redirects on first render
    if (!_hydrated || loading || !isAuthenticated) return;
    if (role !== requiredRole) {
      router.replace(role === UserRole.AGENCY ? "/studio" : "/app");
    }
  }, [_hydrated, role, requiredRole, isAuthenticated, loading, router]);

  // Show spinner while store is hydrating or loading
  if (!_hydrated || loading) return <Spinner />;

  // After hydration: wrong role → spinner (redirect is already fired above)
  if (role !== requiredRole) return <Spinner />;

  return <>{children}</>;
}
