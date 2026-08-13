import { promises as fs } from "fs";
import path from "path";
import { mediaRepository } from "@/lib/repositories/content.repository";

export interface UploadOptions {
  filename: string;
  mimeType: string;
  buffer: Buffer;
  altText?: string;
}

export interface StorageResult {
  url: string;
  storageKey: string;
}

export interface StorageProvider {
  upload(options: UploadOptions): Promise<StorageResult>;
  delete(storageKey: string): Promise<void>;
  getUrl(storageKey: string): string;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];
const MAX_SIZE = 5 * 1024 * 1024;

function validateUpload(mimeType: string, size: number) {
  if (!ALLOWED_TYPES.includes(mimeType)) {
    throw new Error("File type not allowed");
  }
  if (size > MAX_SIZE) {
    throw new Error("File exceeds 5MB limit");
  }
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9.-]/g, "_").toLowerCase();
}

class LocalStorageProvider implements StorageProvider {
  private basePath: string;

  constructor() {
    this.basePath = process.env.STORAGE_LOCAL_PATH ?? "./public/uploads";
  }

  async upload(options: UploadOptions): Promise<StorageResult> {
    validateUpload(options.mimeType, options.buffer.length);
    const safeName = `${Date.now()}-${sanitizeFilename(options.filename)}`;
    const storageKey = `uploads/${safeName}`;
    const fullPath = path.join(process.cwd(), "public", storageKey);

    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, options.buffer);

    return { url: `/${storageKey}`, storageKey };
  }

  async delete(storageKey: string): Promise<void> {
    const fullPath = path.join(process.cwd(), "public", storageKey);
    await fs.unlink(fullPath).catch(() => undefined);
  }

  getUrl(storageKey: string): string {
    return `/${storageKey}`;
  }
}

class S3StorageProvider implements StorageProvider {
  async upload(options: UploadOptions): Promise<StorageResult> {
    validateUpload(options.mimeType, options.buffer.length);
    const safeName = `${Date.now()}-${sanitizeFilename(options.filename)}`;
    const storageKey = `media/${safeName}`;
    // S3 upload would use @aws-sdk/client-s3 when credentials are configured
    throw new Error("S3 storage not configured. Set STORAGE_PROVIDER=local or configure S3 credentials.");
  }

  async delete(_storageKey: string): Promise<void> {
    throw new Error("S3 storage not configured");
  }

  getUrl(storageKey: string): string {
    const endpoint = process.env.STORAGE_ENDPOINT ?? "";
    const bucket = process.env.STORAGE_BUCKET ?? "";
    return `${endpoint}/${bucket}/${storageKey}`;
  }
}

export function getStorageProvider(): StorageProvider {
  const provider = process.env.STORAGE_PROVIDER ?? "local";
  if (provider === "s3") return new S3StorageProvider();
  return new LocalStorageProvider();
}

export const storageService = {
  async uploadFile(options: UploadOptions) {
    const provider = getStorageProvider();
    const result = await provider.upload(options);
    return mediaRepository.create({
      filename: sanitizeFilename(options.filename),
      originalName: options.filename,
      mimeType: options.mimeType,
      size: options.buffer.length,
      altText: options.altText,
      url: result.url,
      storageKey: result.storageKey,
    });
  },

  async deleteFile(id: string) {
    const media = await mediaRepository.findAll(1, 1000);
    const item = media.items.find((m) => m.id === id);
    if (!item) throw new Error("Media not found");
    const provider = getStorageProvider();
    await provider.delete(item.storageKey);
    return mediaRepository.delete(id);
  },
};
