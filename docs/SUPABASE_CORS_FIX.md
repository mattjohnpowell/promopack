# Fix: "Failed to load PDF" Error

## ✅ SOLUTION IMPLEMENTED

A PDF proxy API route has been created at `/api/pdf/[id]` that:
- ✅ Authenticates the user
- ✅ Verifies they have access to the document
- ✅ Fetches the PDF from S3 storage
- ✅ Returns it with proper CORS headers

**Files changed:**
- `app/api/pdf/[id]/route.ts` - New API proxy route
- `components/ClaimLinkingWorkspace.tsx` - Updated to use `/api/pdf/${documentId}`
- `components/PDFViewer.tsx` - Improved error handling and CDN configuration

**How it works:** Instead of loading PDFs directly from Supabase S3 (which requires CORS), the browser now requests PDFs from your own API at `/api/pdf/[documentId]`, which fetches from S3 server-side and returns with proper headers.

---

## Problem
PDFs stored in Supabase S3 storage fail to load in the PDF viewer with a CORS error.

## Root Cause
The Supabase storage bucket doesn't have CORS headers configured to allow the PDF.js library to fetch PDF files from the browser.

## Alternative Solutions (Not Needed - Already Fixed)

### Solution 1: Configure CORS in Supabase

### Via Supabase Dashboard:
1. Go to **Storage** in your Supabase dashboard
2. Click on your bucket (e.g., "uploads" or "promo-pack-uploads")
3. Go to **Configuration** or **Policies**
4. Add a CORS policy with these settings:
   - **Allowed Origins**: `*` (or your specific domain, e.g., `https://yourdomain.com`)
   - **Allowed Methods**: `GET`, `HEAD`
   - **Allowed Headers**: `*`
   - **Max Age**: `3600`

### Example CORS Configuration:
```json
{
  "AllowedOrigins": ["*"],
  "AllowedMethods": ["GET", "HEAD"],
  "AllowedHeaders": ["*"],
  "MaxAgeSeconds": 3600
}
```

## Solution 2: Use Public URLs (If appropriate)

If your PDFs should be publicly accessible, you can make the bucket public:

1. Go to **Storage** → Your bucket → **Policies**
2. Add a policy to allow public read access:
   ```sql
   CREATE POLICY "Public Access"
   ON storage.objects FOR SELECT
   USING ( bucket_id = 'your-bucket-name' );
   ```

Then update your `storage.ts` to return public URLs instead of signed URLs.

## Solution 3: Proxy PDFs Through Your API (Most Secure)

Create an API route to proxy PDF requests:

```typescript
// app/api/pdf/[id]/route.ts
import { auth } from "@/auth"
import { prisma } from "@/utils/db"
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user?.email) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Verify user has access to this document
  const doc = await prisma.document.findFirst({
    where: {
      id: params.id,
      project: {
        userId: session.user.id
      }
    }
  })

  if (!doc || !doc.url) {
    return new Response('Not found', { status: 404 })
  }

  // Fetch PDF from S3
  const s3Client = new S3Client({
    region: "us-east-1",
    endpoint: process.env.SUPABASE_URL,
    credentials: {
      accessKeyId: process.env.SUPABASE_KEY_ID!,
      secretAccessKey: process.env.SUPABASE_KEY_SECRET!,
    },
    forcePathStyle: true,
  })

  const key = new URL(doc.url).pathname.slice(1) // Extract key from URL
  const command = new GetObjectCommand({
    Bucket: process.env.SUPABASE_BUCKET,
    Key: key,
  })

  const response = await s3Client.send(command)

  return new Response(response.Body, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${doc.name}"`,
      'Access-Control-Allow-Origin': '*',
    }
  })
}
```

Then update your components to use `/api/pdf/[documentId]` instead of the S3 URL.

## Verification

After applying the fix, check the browser console:
- No CORS errors
- PDFs should load successfully in the viewer
- Network tab should show successful PDF downloads

## Related Files
- `components/PDFViewer.tsx` - PDF viewer component
- `utils/storage.ts` - Storage URL generation
- `components/ClaimLinkingWorkspace.tsx` - Uses PDFViewer for source documents
