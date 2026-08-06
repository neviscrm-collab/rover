import AuthGuard from "@/components/auth/auth-guard";
import RoleGuard from "@/components/auth/role-guard";
import BottomDock from "@/components/layout/bottom-dock";
import DesktopSidebar from "@/components/layout/desktop-sidebar";
import AIOrb from "@/components/shared/ai-orb";
import BookingSheet from "@/components/booking/booking-sheet";
import { UserRole } from "@/lib/types/auth.types";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <RoleGuard requiredRole={UserRole.CUSTOMER}>
        <DesktopSidebar />
        <main className="lg:ml-60">{children}</main>
        <BottomDock />
        <AIOrb />
        <BookingSheet />
      </RoleGuard>
    </AuthGuard>
  );
}
