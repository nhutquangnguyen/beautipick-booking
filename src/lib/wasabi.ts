import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  endpoint: process.env.WASABI_ENDPOINT,
  region: process.env.WASABI_REGION,
  credentials: {
    accessKeyId: process.env.WASABI_ACCESS_KEY_ID!,
    secretAccessKey: process.env.WASABI_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true, // Required for Wasabi and S3-compatible storage
});

export const WASABI_BUCKET = process.env.WASABI_BUCKET_NAME!;
export const WASABI_ENDPOINT = process.env.WASABI_ENDPOINT!;

export async function uploadToWasabi(
  file: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: WASABI_BUCKET,
    Key: key,
    Body: file,
    ContentType: contentType,
  });

  await s3Client.send(command);

  // Return the key instead of a public URL - we'll generate signed URLs when needed
  return key;
}

export async function getSignedImageUrl(key: string, expiresIn: number = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: WASABI_BUCKET,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

export async function deleteFromWasabi(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: WASABI_BUCKET,
    Key: key,
  });

  await s3Client.send(command);
}

export function isWasabiKey(value: string): boolean {
  // Check if this is a key (not a full URL) - keys don't start with http
  return !value.startsWith("http");
}
