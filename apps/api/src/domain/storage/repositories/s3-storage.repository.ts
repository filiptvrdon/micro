import { S3Client, PutObjectCommand, HeadObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command, ListObjectsV2CommandOutput } from "@aws-sdk/client-s3";
import { getSignedUrl as presign } from "@aws-sdk/s3-request-presigner";
import { StorageRepository } from "./storage-repository.interface.js";
import { StorageObject, UploadResult } from "../types/storage.js";

export class S3StorageRepository implements StorageRepository {
  private bucket: string;
  private endpoint: string;
  private region: string;
  private client: S3Client;

  constructor() {
    const bucket = process.env.S3_BUCKET;
    const endpoint = process.env.S3_ENDPOINT;
    const region = process.env.S3_REGION;
    const accessKeyId = process.env.S3_ACCESS_KEY_ID;
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

    if (!bucket) throw new Error("S3_BUCKET environment variable is not defined");
    if (!endpoint) throw new Error("S3_ENDPOINT environment variable is not defined");
    if (!region) throw new Error("S3_REGION environment variable is not defined");
    if (!accessKeyId) throw new Error("S3_ACCESS_KEY_ID environment variable is not defined");
    if (!secretAccessKey) throw new Error("S3_SECRET_ACCESS_KEY environment variable is not defined");

    this.bucket = bucket;
    this.endpoint = endpoint.replace(/\/+$/, "");
    this.region = region;

    this.client = new S3Client({
      region: this.region,
      endpoint: this.endpoint,
      forcePathStyle: true, // Backblaze B2 prefers path-style addressing
      credentials: { accessKeyId, secretAccessKey },
    });
  }

  private objectUrl(key: string): string {
    return `${this.endpoint}/${this.bucket}/${encodeURI(key)}`;
  }

  async uploadFile(key: string, file: Buffer, contentType: string): Promise<UploadResult> {
    try {
      await this.client.send(new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file,
        ContentType: contentType,
      }));
      console.log(`[S3] Successfully uploaded: ${key}`);
    } catch (error) {
      console.error("S3 upload error details:", error);
      throw error;
    }

    return { key, url: this.objectUrl(key) };
  }

  async getFile(key: string): Promise<StorageObject> {
    const head = await this.client.send(new HeadObjectCommand({
      Bucket: this.bucket,
      Key: key,
    }));

    return {
      key,
      url: this.objectUrl(key),
      size: typeof head.ContentLength === "number" ? head.ContentLength : undefined,
      lastModified: head.LastModified ?? undefined,
      contentType: head.ContentType ?? undefined,
    };
  }

  async deleteFile(key: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    }));
  }

  async getSignedUrl(key: string, expiresIn: number): Promise<string> {
    const url = await presign(
      this.client,
      new GetObjectCommand({ Bucket: this.bucket, Key: key }),
      { expiresIn }
    );
    return url;
  }

  async listFiles(prefix?: string): Promise<StorageObject[]> {
    const results: StorageObject[] = [];
    let ContinuationToken: string | undefined = undefined;

    do {
      const res: ListObjectsV2CommandOutput = await this.client.send(new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: prefix,
        ContinuationToken,
      }));

      const contents = res.Contents ?? [];
      for (const obj of contents) {
        if (!obj.Key) continue;
        results.push({
          key: obj.Key,
          url: this.objectUrl(obj.Key),
          size: typeof obj.Size === "number" ? obj.Size : undefined,
          lastModified: obj.LastModified ?? undefined,
        });
      }

      ContinuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
    } while (ContinuationToken);

    return results;
  }
  async downloadFile(key: string, range?: string): Promise<{
    Body?: unknown;
    ContentType?: string;
    ContentLength?: number;
    ContentRange?: string;
    AcceptRanges?: string;
    Status: number;
  }> {
    const res = await this.client.send(new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Range: range,
    }));

    return {
      Body: res.Body,
      ContentType: res.ContentType,
      ContentLength: res.ContentLength,
      ContentRange: res.ContentRange,
      AcceptRanges: res.AcceptRanges,
      Status: res.$metadata.httpStatusCode || (range ? 206 : 200),
    };
  }
}
