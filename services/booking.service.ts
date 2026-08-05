import { crmRequest } from "@/lib/api/crm.client";
import type { Booking } from "@/lib/types/agency.types";

class BookingServiceClass {
  async list(agencyId?: string, travelerId?: string): Promise<Booking[]> {
    const { data } = await crmRequest<Booking[]>("/bookings");
    let all = data ?? [];
    if (agencyId) all = all.filter((b) => b.agencyId === agencyId);
    if (travelerId) all = all.filter((b) => b.travelerId === travelerId);
    return all;
  }

  async getById(id: string): Promise<Booking | null> {
    const all = await this.list();
    return all.find((b) => b.id === id) ?? null;
  }

  async updateStatus(id: string, status: Booking["status"]): Promise<Booking> {
    const booking = await this.getById(id);
    if (!booking) throw new Error("Booking not found");
    await delay(400);
    return { ...booking, status };
  }

  async cancel(id: string): Promise<void> {
    await delay(400);
    console.log(`[Mock] Cancelled booking ${id}`);
  }
}

export const BookingService = new BookingServiceClass();

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
