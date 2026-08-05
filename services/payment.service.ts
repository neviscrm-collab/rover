import { crmRequest } from "@/lib/api/crm.client";
import type { Payment } from "@/lib/types/agency.types";

class PaymentServiceClass {
  async list(agencyId: string): Promise<Payment[]> {
    const { data } = await crmRequest<Payment[]>("/payments");
    return (data ?? []).filter((p) => p.agencyId === agencyId);
  }

  async getById(id: string): Promise<Payment | null> {
    const { data } = await crmRequest<Payment[]>("/payments");
    return (data ?? []).find((p) => p.id === id) ?? null;
  }

  async getTotalRevenue(agencyId: string): Promise<number> {
    const payments = await this.list(agencyId);
    return payments
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0);
  }

  async requestPayout(agencyId: string, amount: number): Promise<{ success: boolean }> {
    await delay(600);
    console.log(`[Mock] Payout request: ₹${amount} for agency ${agencyId}`);
    return { success: true };
  }
}

export const PaymentService = new PaymentServiceClass();

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
