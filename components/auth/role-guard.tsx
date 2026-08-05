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
export default function RoleGuard({ children, requiredRole }: RoleGuardProps) {
  const { role, isAuthenticated, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (loading || !isAuthenticated) return;
    if (role !== requiredRole) {
      // Send to the correct portal
      router.replace(role === UserRole.AGENCY ? "/studio" : "/app");
    }
  }, [role, requiredRole, isAuthenticated, loading, router]);

  if (loading || role !== requiredRole) return null;

  return <>{children}</>;
}
