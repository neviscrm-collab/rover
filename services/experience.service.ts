import { crmRequest } from "@/lib/api/crm.client";
import type { AgencyExperience } from "@/lib/types/agency.types";

class ExperienceServiceClass {
  async list(agencyId?: string): Promise<AgencyExperience[]> {
    const { data } = await crmRequest<AgencyExperience[]>("/experiences");
    const all = data ?? [];
    return agencyId ? all.filter((e) => e.agencyId === agencyId) : all;
  }

  async getById(id: string): Promise<AgencyExperience | null> {
    const all = await this.list();
    return all.find((e) => e.id === id) ?? null;
  }

  async create(data: Omit<AgencyExperience, "id" | "createdAt">): Promise<AgencyExperience> {
    await delay(500);
    return {
      ...data,
      id: `exp_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
    };
  }

  async update(id: string, updates: Partial<AgencyExperience>): Promise<AgencyExperience> {
    const exp = await this.getById(id);
    if (!exp) throw new Error("Experience not found");
    return { ...exp, ...updates };
  }

  async delete(id: string): Promise<void> {
    await delay(300);
    // Mock: no-op
    console.log(`[Mock] Deleted experience ${id}`);
  }
}

export const ExperienceService = new ExperienceServiceClass();

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
