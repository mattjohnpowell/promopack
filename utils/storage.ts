import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: "us-east-1", // Supabase uses us-east-1 region
  endpoint: process.env.SUPABASE_URL,
  credentials: {
    accessKeyId: process.env.SUPABASE_KEY_ID!,
    secretAccessKey: process.env.SUPABASE_KEY_SECRET!,
  },
  forcePathStyle: true, // Required for Supabase S3-compatible API
});

export async function generateUploadUrl(fileName: string, fileType: string): Promise<{ uploadUrl: string; downloadUrl: string }> {
  const key = `uploads/${Date.now()}-${fileName}`;

  console.log("Generating upload URL for:", { key, fileType, bucket: process.env.SUPABASE_BUCKET });

  const command = new PutObjectCommand({
    Bucket: process.env.SUPABASE_BUCKET,
    Key: key,
    ContentType: fileType,
  });

  console.log("Creating signed upload URL...")
  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour
  console.log("Upload URL created successfully")

  // Generate download URL (also signed for private buckets)
  const downloadCommand = new GetObjectCommand({
    Bucket: process.env.SUPABASE_BUCKET,
    Key: key,
  });

  console.log("Creating signed download URL...")
  const downloadUrl = await getSignedUrl(s3Client, downloadCommand, { expiresIn: 3600 * 24 * 7 }); // 7 days
  console.log("Download URL created successfully")

  console.log("Generated URLs:", { uploadUrl: uploadUrl.substring(0, 100) + "...", downloadUrl: downloadUrl.substring(0, 100) + "..." });

  return { uploadUrl, downloadUrl };
}