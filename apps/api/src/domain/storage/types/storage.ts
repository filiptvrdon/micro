export interface StorageObject {
  key: string;
  url: string;
  size?: number;
  lastModified?: Date;
  contentType?: string;
}

export interface UploadResult {
  key: string;
  url: string;
}
