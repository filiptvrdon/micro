import { StorageObject, UploadResult } from "../types/storage.js";

export interface StorageRepository {
  uploadFile(key: string, file: Buffer, contentType: string): Promise<UploadResult>;
  getFile(key: string): Promise<StorageObject>;
  deleteFile(key: string): Promise<void>;
  getSignedUrl(key: string, expiresIn: number): Promise<string>;
  listFiles(prefix?: string): Promise<StorageObject[]>;
  downloadFile(key: string, range?: string): Promise<{
    Body?: unknown;
    ContentType?: string;
    ContentLength?: number;
    ContentRange?: string;
    AcceptRanges?: string;
    Status: number;
  }>;
}
