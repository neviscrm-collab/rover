import AuthGuard from "@/components/auth/auth-guard";
import RoleGuard from "@/components/auth/role-guard";
import StudioSidebar from "@/components/agency/studio-sidebar";
import { UserRole } from "@/lib/types/auth.types";

export default function AgencyLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <RoleGuard requiredRole={UserRole.AGENCY}>
        <div className="flex min-h-screen">
          <StudioSidebar />
          {/* lg: offset for 240px sidebar; mobile: full width with bottom nav padding */}
          <main className="flex-1 lg:ml-60 pb-20 lg:pb-0 min-h-screen">
            {children}
          </main>
        </div>
      </RoleGuard>
    </AuthGuard>
  );
}
