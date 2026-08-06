import AuthGuard from "@/components/auth/auth-guard";
import RoleGuard from "@/components/auth/role-guard";
import BottomDock from "@/components/layout/bottom-dock";
import SideRail from "@/components/layout/side-rail";
import AIOrb from "@/components/shared/ai-orb";
import BookingSheet from "@/components/booking/booking-sheet";
import { UserRole } from "@/lib/types/auth.types";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <RoleGuard requiredRole={UserRole.CUSTOMER}>
        <SideRail />
        <main className="lg:pl-[72px]">{children}</main>
        <BottomDock />
        <AIOrb />
        <BookingSheet />
      </RoleGuard>
    </AuthGuard>
  );
}
