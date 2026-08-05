import { crmRequest } from "@/lib/api/crm.client";
import type { AgencyDocument } from "@/lib/types/agency.types";

class DocumentServiceClass {
  async list(agencyId: string): Promise<AgencyDocument[]> {
    const { data } = await crmRequest<AgencyDocument[]>("/documents");
    return (data ?? []).filter((d) => d.agencyId === agencyId);
  }

  async upload(
    agencyId: string,
    file: File,
    type: AgencyDocument["type"],
    bookingId?: string
  ): Promise<AgencyDocument> {
    await delay(800);
    return {
      id: `doc_${Math.random().toString(36).slice(2, 8)}`,
      agencyId,
      bookingId,
      name: file.name,
      type,
      url: URL.createObjectURL(file),
      size: file.size,
      uploadedAt: new Date().toISOString(),
    };
  }

  async delete(id: string): Promise<void> {
    await delay(300);
    console.log(`[Mock] Deleted document ${id}`);
  }

  async getPublicUrl(id: string): Promise<string> {
    return `/mock-files/${id}.pdf`;
  }
}

export const DocumentService = new DocumentServiceClass();

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
