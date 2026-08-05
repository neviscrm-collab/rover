import { crmRequest } from "@/lib/api/crm.client";
import type { AgencyProfile, AgencyStats } from "@/lib/types/agency.types";

class AgencyServiceClass {
  async getProfile(agencyId: string): Promise<AgencyProfile | null> {
    const { data } = await crmRequest<AgencyProfile[]>("/agencies");
    return (data ?? []).find((a) => a.id === agencyId) ?? null;
  }

  async getProfileByUserId(userId: string): Promise<AgencyProfile | null> {
    const { data } = await crmRequest<AgencyProfile[]>("/agencies");
    return (data ?? []).find((a) => a.userId === userId) ?? null;
  }

  async updateProfile(agencyId: string, updates: Partial<AgencyProfile>): Promise<AgencyProfile> {
    // Mock: return merged profile
    const profile = await this.getProfile(agencyId);
    if (!profile) throw new Error("Agency not found");
    return { ...profile, ...updates };
  }

  async getStats(agencyId: string): Promise<AgencyStats> {
    const bookings = (await import("@/mock/bookings.json")).default;
    const payments = (await import("@/mock/payments.json")).default;

    const agencyBookings = bookings.filter((b) => b.agencyId === agencyId);
    const agencyPayments = payments.filter((p) => p.agencyId === agencyId && p.status === "completed");

    const now = new Date();
    const thisMonth = agencyPayments.filter((p) => {
      const d = new Date(p.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    return {
      totalRevenue: agencyPayments.reduce((s, p) => s + p.amount, 0),
      revenueThisMonth: thisMonth.reduce((s, p) => s + p.amount, 0),
      totalBookings: agencyBookings.length,
      bookingsThisMonth: agencyBookings.filter((b) => {
        const d = new Date(b.createdAt);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }).length,
      totalTravelers: new Set(agencyBookings.map((b) => b.travelerId)).size,
      activeExperiences: 3,
      avgRating: 4.8,
      pendingPayouts: agencyPayments
        .filter((p) => p.status === "pending")
        .reduce((s, p) => s + p.amount, 0),
    };
  }

  async getAllAgencies(): Promise<AgencyProfile[]> {
    const { data } = await crmRequest<AgencyProfile[]>("/agencies");
    return data ?? [];
  }
}

export const AgencyService = new AgencyServiceClass();
