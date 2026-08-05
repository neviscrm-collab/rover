import BottomDock from "@/components/layout/bottom-dock";
import SideRail from "@/components/layout/side-rail";
import AIOrb from "@/components/shared/ai-orb";
import BookingSheet from "@/components/booking/booking-sheet";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SideRail />
      <main>{children}</main>
      <BottomDock />
      <AIOrb />
      <BookingSheet />
    </>
  );
}
