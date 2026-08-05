/**
 * Storage Service
 *
 * Handles file upload/download/delete.
 * Will eventually use Zoho CRM Attachments or WorkDrive.
 * Currently uses a mock implementation with object URLs.
 */

interface UploadResult {
  id: string;
  url: string;
  name: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

class StorageServiceClass {
  /**
   * Upload a file.
   * Replace with Zoho WorkDrive / CRM Attachments API call.
   */
  async upload(file: File, folder?: string): Promise<UploadResult> {
    await delay(600);
    const id = `file_${Math.random().toString(36).slice(2, 10)}`;
    return {
      id,
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      mimeType: file.type,
      uploadedAt: new Date().toISOString(),
    };
  }

  /**
   * Download a file by ID.
   */
  async download(fileId: string): Promise<Blob> {
    await delay(400);
    // Mock: return empty blob
    return new Blob(["[Mock file content]"], { type: "application/pdf" });
  }

  /**
   * Delete a file by ID.
   */
  async delete(fileId: string): Promise<void> {
    await delay(300);
    console.log(`[Mock] Deleted file ${fileId}`);
  }

  /**
   * Get a public-accessible URL for a file.
   */
  async getPublicUrl(fileId: string): Promise<string> {
    return `https://files.rover.app/public/${fileId}`;
  }
}

export const StorageService = new StorageServiceClass();

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
