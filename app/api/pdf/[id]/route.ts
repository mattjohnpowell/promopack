import { auth } from "@/auth"
import { prisma } from "@/utils/db"
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import { NextRequest } from "next/server"

const s3Client = new S3Client({
  region: "us-east-1",
  endpoint: process.env.SUPABASE_URL,
  credentials: {
    accessKeyId: process.env.SUPABASE_KEY_ID!,
    secretAccessKey: process.env.SUPABASE_KEY_SECRET!,
  },
  forcePathStyle: true,
})

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    console.log('PDF API: Request for document:', params.id)

    // Check authentication
    const session = await auth()
    if (!session?.user?.email) {
      console.error('PDF API: Unauthorized - no session')
      return new Response('Unauthorized', { status: 401 })
    }

    console.log('PDF API: User authenticated:', session.user.email)

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      console.error('PDF API: User not found')
      return new Response('User not found', { status: 404 })
    }

    console.log('PDF API: User found:', user.id)

    // Verify user has access to this document
    const doc = await prisma.document.findFirst({
      where: {
        id: params.id,
        project: {
          userId: user.id,
        },
      },
    })

    if (!doc) {
      console.error('PDF API: Document not found or access denied')
      return new Response('Document not found', { status: 404 })
    }

    if (!doc.url) {
      console.error('PDF API: Document has no URL')
      return new Response('Document has no URL', { status: 404 })
    }

    console.log('PDF API: Document found:', { id: doc.id, name: doc.name, url: doc.url?.substring(0, 50) + '...' })

    // Extract S3 key from the signed URL
    // URL format: https://...supabase.co/storage/v1/s3/bucket-name/uploads/123-file.pdf?X-Amz-...
    const urlObj = new URL(doc.url)
    const pathParts = urlObj.pathname.split('/')

    // Find the bucket name and key
    // Path structure: /storage/v1/s3/{bucket}/{key}
    const s3Index = pathParts.indexOf('s3')
    if (s3Index === -1 || s3Index + 2 >= pathParts.length) {
      return new Response('Invalid document URL', { status: 400 })
    }

    const bucket = pathParts[s3Index + 1]
    const key = pathParts.slice(s3Index + 2).join('/')

    console.log('Fetching PDF from S3:', { bucket, key })

    // Fetch PDF from S3
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })

    const response = await s3Client.send(command)

    if (!response.Body) {
      return new Response('Failed to fetch PDF', { status: 500 })
    }

    // Convert stream to buffer
    const chunks: Uint8Array[] = []
    for await (const chunk of response.Body as any) {
      chunks.push(chunk)
    }
    const buffer = Buffer.concat(chunks)

    // Return PDF with proper CORS headers
    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${doc.name}"`,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': '*',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Error proxying PDF:', error)
    return new Response('Internal server error', { status: 500 })
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  })
}
