"use server"

import { prisma } from "@/utils/db"
import { signUpSchema } from "@/lib/zod"
import { saltAndHashPassword } from "@/utils/password"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import Stripe from "stripe"
import OpenAI from "openai"
import { PDFDocument, rgb } from "pdf-lib"
import { searchPubMed, extractMedicalKeywords, scoreArticleRelevance, fetchArticleAbstract } from "@/utils/pubmed"
import { checkProjectCompliance, getComplianceSummary } from "@/utils/compliance"

export async function signUp(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    // Validate input
    const validatedData = signUpSchema.parse({ name, email, password })

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      throw new Error("User with this email already exists")
    }

    // Hash password
    const hashedPassword = saltAndHashPassword(validatedData.password)

    // Create user
    await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
      },
    })

    // Redirect to auth page for sign in
    redirect("/auth")
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to create account")
  }
}

export async function generateUploadUrl(fileName: string, fileType: string, projectId: string) {
  console.log("Server action: generateUploadUrl called with:", { fileName, fileType, projectId })

  const session = await auth()
  console.log("Server action: auth session:", { userEmail: session?.user?.email, hasSession: !!session })

  if (!session?.user?.email) {
    console.error("Server action: No authenticated user")
    throw new Error("Unauthorized")
  }

  if (!fileName || !fileType) {
    console.error("Server action: Missing fileName or fileType")
    throw new Error("File name and type are required")
  }

  // Only allow PDF files
  if (!fileType.startsWith("application/pdf")) {
    console.error("Server action: Invalid file type:", fileType)
    throw new Error("Only PDF files are allowed")
  }

  console.log("Server action: Looking up user...")
  // Find the user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    console.error("Server action: User not found for email:", session.user.email)
    throw new Error("User not found")
  }

  console.log("Server action: Verifying project access...")
  // Verify project belongs to user
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId: user.id,
    },
  })

  if (!project) {
    console.error("Server action: Project not found or access denied:", { projectId, userId: user.id })
    throw new Error("Project not found or access denied")
  }

  console.log("Server action: Calling storage.generateUploadUrl...")
  try {
    const storage = await import("@/utils/storage")
    const { uploadUrl, downloadUrl } = await storage.generateUploadUrl(fileName, fileType)

    console.log("Server action: URLs generated successfully")
    return { uploadUrl, downloadUrl }
  } catch (error) {
    console.error("Server action: Error generating upload URL:", error)
    throw new Error("Failed to generate upload URL")
  }
}

export async function createDocument(projectId: string, name: string, url: string, type: string) {
  console.log("Server action: createDocument called with:", { projectId, name, url: url.substring(0, 100) + "...", type })

  const session = await auth()
  console.log("Server action: createDocument auth session:", { userEmail: session?.user?.email, hasSession: !!session })

  if (!session?.user?.email) {
    console.error("Server action: createDocument - Unauthorized")
    throw new Error("Unauthorized")
  }

  if (!projectId || !name || !url || !type) {
    console.error("Server action: createDocument - Missing required fields")
    throw new Error("All fields are required")
  }

  // Validate type
  if (!["SOURCE", "REFERENCE"].includes(type)) {
    console.error("Server action: createDocument - Invalid document type:", type)
    throw new Error("Invalid document type")
  }

  console.log("Server action: createDocument - Looking up user...")
  // Find the user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    console.error("Server action: createDocument - User not found")
    throw new Error("User not found")
  }

  console.log("Server action: createDocument - Verifying project access...")
  // Verify project belongs to user
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId: user.id,
    },
  })

  if (!project) {
    console.error("Server action: createDocument - Project not found or access denied")
    throw new Error("Project not found or access denied")
  }

  console.log("Server action: createDocument - Creating document record...")
  try {
    const document = await prisma.document.create({
      data: {
        name,
        url,
        type: type as "SOURCE" | "REFERENCE",
        projectId,
      },
    })

    console.log("Server action: createDocument - Document created successfully:", document.id)
    // Revalidate the project page
    revalidatePath(`/projects/${projectId}`)

    return document
  } catch (error) {
    console.error("Server action: createDocument - Error creating document:", error)
    throw new Error("Failed to create document")
  }
}

export async function deleteDocument(documentId: string) {
  console.log("Server action: deleteDocument called with:", { documentId })

  const session = await auth()
  if (!session?.user?.email) {
    console.error("Server action: deleteDocument - Unauthorized")
    throw new Error("Unauthorized")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    console.error("Server action: deleteDocument - User not found")
    throw new Error("User not found")
  }

  // Get the document with project to verify ownership and check type
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    include: {
      project: true,
    },
  })

  if (!document) {
    console.error("Server action: deleteDocument - Document not found")
    throw new Error("Document not found")
  }

  // Verify user owns the project
  if (document.project.userId !== user.id) {
    console.error("Server action: deleteDocument - Access denied")
    throw new Error("Access denied")
  }

  const projectId = document.projectId
  const isSourceDocument = document.type === "SOURCE"

  console.log("Server action: deleteDocument - Deleting document and related data...")

  try {
    // If it's a source document, delete all claims for this project
    // (since claims are extracted from source documents)
    if (isSourceDocument) {
      console.log("Server action: deleteDocument - Source document detected, deleting all claims...")
      await prisma.claim.deleteMany({
        where: { projectId },
      })
      console.log("Server action: deleteDocument - All claims deleted")
    }

    // Delete the document (links will be cascaded automatically due to schema)
    await prisma.document.delete({
      where: { id: documentId },
    })

    console.log("Server action: deleteDocument - Document deleted successfully")

    // Revalidate the project page
    revalidatePath(`/projects/${projectId}`)

    return { success: true, deletedClaims: isSourceDocument }
  } catch (error) {
    console.error("Server action: deleteDocument - Error deleting document:", error)
    throw new Error("Failed to delete document")
  }
}

export async function createPubMedReference(
  projectId: string,
  pubmedData: {
    pubmedId?: string
    doi?: string
    title: string
    authors?: string[]
    journal?: string
    year?: number
    volume?: string
    issue?: string
    pages?: string
    abstract?: string
  }
) {
  console.log("Server action: createPubMedReference called with:", { projectId, pubmedData })

  const session = await auth()
  console.log("Server action: createPubMedReference auth session:", { userEmail: session?.user?.email, hasSession: !!session })

  if (!session?.user?.email) {
    console.error("Server action: createPubMedReference - Unauthorized")
    throw new Error("Unauthorized")
  }

  if (!projectId || !pubmedData.title) {
    console.error("Server action: createPubMedReference - Missing required fields")
    throw new Error("Project ID and title are required")
  }

  // Validate that at least one identifier is provided
  if (!pubmedData.pubmedId && !pubmedData.doi) {
    console.error("Server action: createPubMedReference - Missing identifier")
    throw new Error("Either PMID or DOI must be provided")
  }

  console.log("Server action: createPubMedReference - Looking up user...")
  // Find the user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    console.error("Server action: createPubMedReference - User not found")
    throw new Error("User not found")
  }

  console.log("Server action: createPubMedReference - Verifying project access...")
  // Verify project belongs to user
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId: user.id,
    },
  })

  if (!project) {
    console.error("Server action: createPubMedReference - Project not found or access denied")
    throw new Error("Project not found or access denied")
  }

  console.log("Server action: createPubMedReference - Creating PubMed reference record...")
  try {
    const document = await prisma.document.create({
      data: {
        name: pubmedData.title,
        type: "REFERENCE",
        projectId,
        pubmedId: pubmedData.pubmedId,
        doi: pubmedData.doi,
        title: pubmedData.title,
        authors: pubmedData.authors ? JSON.stringify(pubmedData.authors) : null,
        journal: pubmedData.journal,
        year: pubmedData.year,
        volume: pubmedData.volume,
        issue: pubmedData.issue,
        pages: pubmedData.pages,
        abstract: pubmedData.abstract,
        pubmedUrl: pubmedData.pubmedId ? `https://pubmed.ncbi.nlm.nih.gov/${pubmedData.pubmedId}/` : null,
      },
    })

    console.log("Server action: createPubMedReference - PubMed reference created successfully:", document.id)
    // Revalidate the project page
    revalidatePath(`/projects/${projectId}`)

    return document
  } catch (error) {
    console.error("Server action: createPubMedReference - Error creating PubMed reference:", error)
    throw new Error("Failed to create PubMed reference")
  }
}

export async function extractClaims(projectId: string, options: { autoFindReferences?: boolean } = {}) {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error("Unauthorized")
  }

  // Find the user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    throw new Error("User not found")
  }

  // Verify project belongs to user
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId: user.id,
    },
  })

  if (!project) {
    throw new Error("Project not found or access denied")
  }

  // Find the SOURCE document
  const sourceDoc = await prisma.document.findFirst({
    where: {
      projectId,
      type: "SOURCE",
    },
  })

  if (!sourceDoc) {
    throw new Error("No source document found. Please upload a source document first.")
  }

  try {
    // Call the Python claim extraction service
    const extractorApiUrl = process.env.EXTRACTOR_API_URL
    const extractorApiKey = process.env.EXTRACTOR_API_KEY

    if (!extractorApiUrl || !extractorApiKey) {
      throw new Error("Extractor service configuration missing. Please set EXTRACTOR_API_URL and EXTRACTOR_API_KEY environment variables.")
    }

    // Retry logic for transient errors (502, 503, 504)
    let lastError: Error | null = null
    const maxRetries = 3
    const retryDelay = 2000 // 2 seconds

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Calling extractor service (attempt ${attempt}/${maxRetries})...`)
        
        const response = await fetch(`${extractorApiUrl}/extract-claims`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${extractorApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            document_url: sourceDoc.url,
            prompt_version: 'v4_regulatory', // Use new strict regulatory validation
          }),
          signal: AbortSignal.timeout(60000), // 60 second timeout
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          
          // Retry on 502, 503, 504 (gateway/service errors)
          if ([502, 503, 504].includes(response.status) && attempt < maxRetries) {
            console.warn(`Extractor service returned ${response.status}, retrying in ${retryDelay}ms...`)
            await new Promise(resolve => setTimeout(resolve, retryDelay))
            continue
          }
          
          // Provide user-friendly error messages
          if (response.status === 502) {
            throw new Error(`The claim extraction service is temporarily unavailable (502 Bad Gateway). Please try again in a few minutes or contact support if the issue persists.`)
          } else if (response.status === 503) {
            throw new Error(`The claim extraction service is currently overloaded (503 Service Unavailable). Please try again shortly.`)
          } else if (response.status === 504) {
            throw new Error(`The claim extraction service timed out (504 Gateway Timeout). Your document may be too large. Please try a smaller document or contact support.`)
          }
          
          throw new Error(`Extractor API error: ${response.status} ${response.statusText}. ${errorData.message || ''}`)
        }

        // Success - break out of retry loop
        const data = await response.json()

        if (!data.claims || !Array.isArray(data.claims)) {
          throw new Error("Invalid response from extractor service: missing or invalid claims array")
        }

        console.log(`Extractor service returned ${data.claims.length} potential claims for review`)

        // Log metadata if available
        if (data.metadata) {
          console.log(`Extraction metadata:`, {
            total: data.metadata.total_claims_extracted,
            high_confidence: data.metadata.high_confidence_claims,
            medium_confidence: data.metadata.medium_confidence_claims,
            low_confidence: data.metadata.low_confidence_claims,
            processing_time: data.metadata.processing_time_ms,
            model: data.metadata.model_version,
            prompt: data.metadata.prompt_version
          })
        }

        // Create claims in database with PENDING_REVIEW status
        // Enhanced v4_regulatory API response fields
        await prisma.claim.createMany({
          data: data.claims.map((claim: {
            text: string;
            page: number;
            confidence?: number;
            suggested_type?: string;
            reasoning?: string;
            is_comparative?: boolean;
            contains_statistics?: boolean;
            citation_present?: boolean;
            warnings?: string[] | null;
          }) => ({
            text: claim.text,
            page: claim.page,
            projectId,
            status: 'PENDING_REVIEW',

            // AI extraction metadata (v4_regulatory fields)
            extractionConfidence: claim.confidence,
            extractionReasoning: claim.reasoning,
            suggestedType: claim.suggested_type as any,
            isComparative: claim.is_comparative,
            containsStatistics: claim.contains_statistics,
            citationPresent: claim.citation_present,
            warnings: claim.warnings ? JSON.stringify(claim.warnings) : null,
          })),
        })

        // DO NOT auto-link or audit yet - user needs to review claims first
        // These will happen after user approves claims

        // Revalidate the project page
        revalidatePath(`/projects/${projectId}`)

        return {
          message: `Extracted ${data.claims.length} potential claims. Please review them to confirm which are true regulatory claims.`,
          claimsCount: data.claims.length,
          needsReview: true,
        }
      } catch (error) {
        lastError = error as Error
        // If this was the last attempt, throw
        if (attempt === maxRetries) {
          throw error
        }
        // Otherwise, continue to next retry
      }
    }

    // If we get here, all retries failed
    throw lastError || new Error("Failed to extract claims after multiple attempts")
  } catch (error) {
    console.error("Error extracting claims:", error)
    // Re-throw the error with the original message if it's already user-friendly
    if (error instanceof Error && error.message.includes('temporarily unavailable')) {
      throw error
    }
    throw new Error(`Failed to extract claims: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// NEW: Claim review actions
export async function reviewClaim(
  claimId: string,
  action: 'approve' | 'reject' | 'edit',
  data?: {
    claimType?: string
    rejectionReason?: string
    editedText?: string
  }
) {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error("Unauthorized")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    throw new Error("User not found")
  }

  // Verify claim belongs to user's project
  const claim = await prisma.claim.findFirst({
    where: {
      id: claimId,
      project: {
        userId: user.id,
      },
    },
  })

  if (!claim) {
    throw new Error("Claim not found or access denied")
  }

  try {
    const updateData: any = {
      reviewedAt: new Date(),
      reviewedBy: user.id,
    }

    switch (action) {
      case 'approve':
        updateData.status = 'APPROVED'
        if (data?.claimType) {
          updateData.claimType = data.claimType
        }
        break

      case 'reject':
        updateData.status = 'REJECTED'
        updateData.rejectionReason = data?.rejectionReason || 'Not a regulatory claim'
        break

      case 'edit':
        updateData.status = 'EDITED'
        updateData.editedText = data?.editedText
        if (data?.claimType) {
          updateData.claimType = data.claimType
        }
        break
    }

    const updatedClaim = await prisma.claim.update({
      where: { id: claimId },
      data: updateData,
    })

    // If approved or edited, trigger auto-linking for this specific claim
    if (action === 'approve' || action === 'edit') {
      await autoLinkSingleClaim(claimId)
    }

    revalidatePath(`/projects/${claim.projectId}/claims`)

    return { success: true, claim: updatedClaim }
  } catch (error) {
    console.error("Error reviewing claim:", error)
    throw new Error("Failed to review claim")
  }
}

// NEW: Bulk review claims
export async function bulkReviewClaims(
  claimIds: string[],
  action: 'approve' | 'reject',
  data?: {
    rejectionReason?: string
  }
) {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error("Unauthorized")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    throw new Error("User not found")
  }

  try {
    const updateData: any = {
      reviewedAt: new Date(),
      reviewedBy: user.id,
    }

    if (action === 'approve') {
      updateData.status = 'APPROVED'
    } else if (action === 'reject') {
      updateData.status = 'REJECTED'
      updateData.rejectionReason = data?.rejectionReason || 'Not a regulatory claim'
    }

    // Update all claims
    const result = await prisma.claim.updateMany({
      where: {
        id: { in: claimIds },
        project: {
          userId: user.id,
        },
      },
      data: updateData,
    })

    // If approved, trigger auto-linking for approved claims
    if (action === 'approve') {
      for (const claimId of claimIds) {
        await autoLinkSingleClaim(claimId)
      }
    }

    // Get the project ID to revalidate
    const firstClaim = await prisma.claim.findFirst({
      where: { id: claimIds[0] },
    })

    if (firstClaim) {
      revalidatePath(`/projects/${firstClaim.projectId}/claims`)
    }

    return { success: true, count: result.count }
  } catch (error) {
    console.error("Error bulk reviewing claims:", error)
    throw new Error("Failed to bulk review claims")
  }
}

// NEW: Auto-link a single claim (called after approval)
async function autoLinkSingleClaim(claimId: string) {
  const claim = await prisma.claim.findUnique({
    where: { id: claimId },
    include: {
      project: {
        include: {
          documents: {
            where: { type: 'REFERENCE' },
          },
        },
      },
    },
  })

  if (!claim || claim.project.documents.length === 0) {
    return
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  try {
    const claimText = claim.editedText || claim.text

    // Use OpenAI to find best matching document
    for (const doc of claim.project.documents) {
      const docInfo = `${doc.title || doc.name}\n${doc.abstract || ''}`

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a medical evidence expert. Determine if the reference document supports the claim. Respond with only a number from 0.0 to 1.0 representing relevance (0=not relevant, 1=highly relevant)."
          },
          {
            role: "user",
            content: `Claim: "${claimText}"\n\nReference: ${docInfo}\n\nRelevance score:`
          }
        ],
        temperature: 0.3,
      })

      const scoreText = response.choices[0]?.message?.content?.trim() || "0"
      const score = parseFloat(scoreText)

      // Link if relevance is above threshold
      if (score >= 0.6) {
        await prisma.link.create({
          data: {
            claimId: claim.id,
            documentId: doc.id,
          },
        }).catch(() => {}) // Ignore if link already exists
      }
    }
  } catch (error) {
    console.error("Error auto-linking single claim:", error)
  }
}

export async function createLink(claimId: string, documentId: string) {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error("Unauthorized")
  }

  // Find the user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    throw new Error("User not found")
  }

  // Verify the claim belongs to a project owned by the user
  const claim = await prisma.claim.findFirst({
    where: {
      id: claimId,
      project: {
        userId: user.id,
      },
    },
  })

  if (!claim) {
    throw new Error("Claim not found or access denied")
  }

  // Verify the document belongs to the same project
  const document = await prisma.document.findFirst({
    where: {
      id: documentId,
      projectId: claim.projectId,
      type: "REFERENCE",
    },
  })

  if (!document) {
    throw new Error("Reference document not found or access denied")
  }

  try {
    const link = await prisma.link.create({
      data: {
        claimId,
        documentId,
      },
    })

    // Revalidate the project page
    revalidatePath(`/projects/${claim.projectId}`)

    return link
  } catch (error) {
    console.error("Error creating link:", error)
    throw new Error("Failed to create link")
  }
}

export async function deleteLink(linkId: string) {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error("Unauthorized")
  }

  // Find the user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    throw new Error("User not found")
  }

  // Find the link and verify ownership
  const link = await prisma.link.findFirst({
    where: {
      id: linkId,
      claim: {
        project: {
          userId: user.id,
        },
      },
    },
    include: {
      claim: {
        include: {
          project: true,
        },
      },
    },
  })

  if (!link) {
    throw new Error("Link not found or access denied")
  }

  try {
    await prisma.link.delete({
      where: { id: linkId },
    })

    // Revalidate the project page
    revalidatePath(`/projects/${link.claim.projectId}`)

    return { message: "Link deleted successfully" }
  } catch (error) {
    console.error("Error deleting link:", error)
    throw new Error("Failed to delete link")
  }
}

export async function updateClaim(claimId: string, text: string, page: number) {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error("Unauthorized")
  }

  // Find the user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    throw new Error("User not found")
  }

  // Verify the claim belongs to a project owned by the user
  const claim = await prisma.claim.findFirst({
    where: {
      id: claimId,
      project: {
        userId: user.id,
      },
    },
    include: {
      project: true,
    },
  })

  if (!claim) {
    throw new Error("Claim not found or access denied")
  }

  try {
    const updatedClaim = await prisma.claim.update({
      where: { id: claimId },
      data: {
        text: text.trim(),
        page,
      },
    })

    // Revalidate the project page
    revalidatePath(`/projects/${claim.projectId}`)

    return updatedClaim
  } catch (error) {
    console.error("Error updating claim:", error)
    throw new Error("Failed to update claim")
  }
}

export async function generatePack(projectId: string) {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error("Unauthorized")
  }

  // Find the user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    throw new Error("User not found")
  }

  // Check subscription access (pack generation requires active subscription)
  const { hasActiveSubscription } = await import('@/utils/subscription')
  const hasSubscription = await hasActiveSubscription(user.id)
  if (!hasSubscription) {
    throw new Error("Active subscription required to generate reference packs. Please upgrade your plan.")
  }

  // Get project with all data
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId: user.id,
    },
    include: {
      documents: true,
      claims: {
        include: {
          links: {
            include: {
              document: true,
            },
          },
        },
      },
    },
  })

  if (!project) {
    throw new Error("Project not found or access denied")
  }

  // UPDATED: Only include APPROVED and EDITED claims in PDF
  const approvedClaims = project.claims.filter(c => c.status === 'APPROVED' || c.status === 'EDITED')

  if (approvedClaims.length === 0) {
    throw new Error("Cannot generate pack: No approved claims found. Please review and approve claims before generating the pack.")
  }

  // PMCPA Compliance Validation - check only approved claims
  const unlinkedClaims = approvedClaims.filter(claim => claim.links.length === 0)
  if (unlinkedClaims.length > 0) {
    throw new Error(`Cannot generate pack: ${unlinkedClaims.length} approved claim(s) are not linked to reference documents. All approved claims must be substantiated for PMCPA compliance.`)
  }

  const sourceDoc = project.documents.find(d => d.type === "SOURCE")
  if (!sourceDoc) {
    throw new Error("Cannot generate pack: No source document found.")
  }

  try {
    // Create PDF document
    const pdfDoc = await PDFDocument.create()
    let page = pdfDoc.addPage()
    const { height } = page.getSize()
    let yPosition = height - 50

    const fontSize = 12
    const titleFontSize = 18

    // Helper to add text and handle page breaks
    const addText = (text: string, size = fontSize, color = rgb(0, 0, 0)) => {
      if (yPosition < 50) {
        page = pdfDoc.addPage()
        yPosition = height - 50
      }
      page.drawText(text, {
        x: 50,
        y: yPosition,
        size,
        color,
      })
      yPosition -= size + 5
    }

    // Title
    addText(`PromoPack Reference Pack Report`, titleFontSize, rgb(0, 0.5, 0))
    yPosition -= 20

    // Project info
    addText(`Project: ${project.name}`)
    addText(`Generated: ${new Date().toISOString()}`)
    yPosition -= 20

    // Source document
    const sourceDoc = project.documents.find(d => d.type === "SOURCE")
    addText(`Source Document: ${sourceDoc?.name || "None"}`)
    yPosition -= 20

    // Reference documents
    addText(`Reference Documents:`, 14)
    project.documents.filter(d => d.type === "REFERENCE").forEach(doc => {
      addText(`- ${doc.name}`)
    })
    yPosition -= 20

    // Claims and links (only approved/edited claims)
    addText(`Claims and Links:`, 14)
    yPosition -= 10

    approvedClaims.forEach(claim => {
      const claimText = claim.editedText || claim.text
      addText(`Claim: ${claimText}`)
      addText(`Page: ${claim.page}`)
      if (claim.claimType) {
        addText(`Type: ${claim.claimType}`)
      }
      const linkedRefs = claim.links.map(link => link.document.name).join(', ') || 'None'
      addText(`Linked References: ${linkedRefs}`)
      yPosition -= 10
    })

    // Footer
    yPosition -= 20
    addText(`Generated by PromoPack`, 10, rgb(0.5, 0.5, 0.5))

    // Serialize PDF
    const pdfBytes = await pdfDoc.save()

    // Return PDF as base64 or buffer
    return {
      pdfBytes: Buffer.from(pdfBytes).toString('base64'),
      fileName: `reference-pack-${project.name.replace(/\s+/g, '-').toLowerCase()}.pdf`
    }
  } catch (error) {
    console.error("Error generating pack:", error)
    throw new Error("Failed to generate reference pack")
  }
}

export async function autoLinkClaims(projectId: string) {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error("Unauthorized")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    throw new Error("User not found")
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId: user.id,
    },
    include: {
      claims: true,
      documents: true,
    },
  })

  if (!project) {
    throw new Error("Project not found or access denied")
  }

  // UPDATED: Only process APPROVED or EDITED claims
  const claims = project.claims.filter(c => c.status === 'APPROVED' || c.status === 'EDITED')
  const referenceDocs = project.documents.filter(d => d.type === "REFERENCE")

  if (claims.length === 0 || referenceDocs.length === 0) {
    return // Nothing to link
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  // For each claim, find best matching document
  for (const claim of claims) {
    let bestDocId: string | null = null

    // First, try rule-based matching (keyword overlap)
    const claimWords = claim.text.toLowerCase().split(/\s+/).filter(word => word.length > 3)
    let bestScore = 0

    for (const doc of referenceDocs) {
      const docWords = doc.name.toLowerCase().split(/\s+/)
      const matchingWords = claimWords.filter(word => docWords.some(docWord => docWord.includes(word) || word.includes(docWord)))
      const score = matchingWords.length / Math.max(claimWords.length, docWords.length)

      if (score > bestScore && score >= 0.3) { // At least 30% overlap
        bestScore = score
        bestDocId = doc.id
      }
    }

    // If rule-based matching didn't find a good match, use AI
    if (!bestDocId) {
      const prompt = `Given the claim: "${claim.text}"

And the following reference documents:

${referenceDocs.map(doc => `${doc.id}: ${doc.name}`).join('\n')}

Which document ID is most relevant to support or validate this claim? If none, respond with "none". Respond only with the document ID or "none".`

      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 10,
        })

        const aiBestDocId = completion.choices[0]?.message?.content?.trim()
        if (aiBestDocId && aiBestDocId !== "none" && referenceDocs.some(d => d.id === aiBestDocId)) {
          bestDocId = aiBestDocId
        }
      } catch (error) {
        console.error(`AI linking failed for claim ${claim.id}:`, error)
      }
    }

    // Create link if we found a match
    if (bestDocId) {
      // Check if link already exists
      const existingLink = await prisma.link.findUnique({
        where: {
          claimId_documentId: {
            claimId: claim.id,
            documentId: bestDocId,
          },
        },
      })
      if (!existingLink) {
        await prisma.link.create({
          data: {
            claimId: claim.id,
            documentId: bestDocId,
          },
        })
      }
    }
  }

  revalidatePath(`/projects/${projectId}`)
}

export async function auditLinks(projectId: string) {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error("Unauthorized")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    throw new Error("User not found")
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId: user.id,
    },
    include: {
      claims: {
        include: {
          links: {
            include: {
              document: true,
            },
          },
        },
      },
    },
  })

  if (!project) {
    throw new Error("Project not found or access denied")
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const audits: { claimId: string; confidence: number; reasoning: string }[] = []

  for (const claim of project.claims) {
    if (claim.links.length === 0) continue

    const docNames: { [key: string]: string } = {}
    for (const link of claim.links) {
      docNames[link.documentId] = link.document.name
    }

    // First, try rule-based scoring
    let ruleBasedScore = 0
    const claimWords = claim.text.toLowerCase().split(/\s+/).filter(word => word.length > 3)

    for (const link of claim.links) {
      const docWords = link.document.name.toLowerCase().split(/\s+/)
      const matchingWords = claimWords.filter(word => docWords.some(docWord => docWord.includes(word) || word.includes(docWord)))
      const linkScore = matchingWords.length / Math.max(claimWords.length, docWords.length)
      ruleBasedScore = Math.max(ruleBasedScore, linkScore)
    }

    let finalConfidence = ruleBasedScore
    let reasoning = `Rule-based matching score: ${(ruleBasedScore * 10).toFixed(1)}/10`

    // Use AI for additional scoring if rule-based is uncertain
    if (ruleBasedScore < 0.7) {
      const prompt = `Claim: "${claim.text}"

Linked documents:
${claim.links.map(link => `${link.document.name}`).join('\n')}

On a scale of 1-10, how well do these documents support or validate this claim? Consider:
- Direct relevance to the claim
- Scientific/medical credibility
- Recency and authority

Provide a score and brief reasoning. Format: Score: X/10\nReasoning: ...`

      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.1,
        })

        const response = completion.choices[0]?.message?.content || ""
        const scoreMatch = response.match(/Score:\s*(\d+)/)
        const reasoningMatch = response.match(/Reasoning:\s*(.+)/)

        if (scoreMatch) {
          const aiScore = parseInt(scoreMatch[1]) / 10
          // Weighted average: 70% rule-based, 30% AI
          finalConfidence = (ruleBasedScore * 0.7) + (aiScore * 0.3)
          reasoning = `Combined score: ${(finalConfidence * 10).toFixed(1)}/10 (Rule-based: ${(ruleBasedScore * 10).toFixed(1)}, AI: ${scoreMatch[1]})`
          if (reasoningMatch) {
            reasoning += ` - ${reasoningMatch[1]}`
          }
        }
      } catch (error) {
        console.error(`AI audit failed for claim ${claim.id}, using rule-based only:`, error)
        finalConfidence = ruleBasedScore
      }
    }

    audits.push({
      claimId: claim.id,
      confidence: Math.min(finalConfidence, 1.0), // Cap at 1.0
      reasoning,
    })
  }

  // Store audit results in claim records
  for (const audit of audits) {
    await prisma.claim.update({
      where: { id: audit.claimId },
      data: {
        confidenceScore: audit.confidence,
        auditReasoning: audit.reasoning,
        needsReview: audit.confidence < 0.6
      }
    })
  }

  console.log("Audit results stored in database")

  // Flag low-confidence links for manual review
  const lowConfidenceAudits = audits.filter(audit => audit.confidence < 0.6)
  if (lowConfidenceAudits.length > 0) {
    console.warn(`⚠️ ${lowConfidenceAudits.length} claims have low-confidence links and may need manual review:`, lowConfidenceAudits)
  }

  revalidatePath(`/projects/${projectId}`)
  return audits
}

/**
 * Auto-find PubMed references for a single claim
 */
export async function searchPubMedForClaim(claimId: string, projectId: string) {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error("Unauthorized")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    throw new Error("User not found")
  }

  // Verify project ownership and get source document for context
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
    include: {
      documents: {
        where: { type: 'SOURCE' },
        take: 1 // Get first source document for product context
      }
    }
  })

  if (!project) {
    throw new Error("Project not found or access denied")
  }

  // Get the claim
  const claim = await prisma.claim.findFirst({
    where: { id: claimId, projectId },
  })

  if (!claim) {
    throw new Error("Claim not found")
  }

  try {
    console.log(`Searching PubMed for claim: "${claim.text.substring(0, 100)}..."`)

    // Extract product context from source document name (e.g., "XARELTO-pi.pdf" -> "XARELTO")
    const productContext = project.documents[0]?.name || ''
    console.log(`Product context: ${productContext}`)

    // Extract keywords and search PubMed (now includes product context)
    const keywords = extractMedicalKeywords(claim.text, productContext)
    console.log(`Extracted keywords: ${keywords}`)

    const articles = await searchPubMed(keywords, {
      maxResults: 10, // Increased from 5 to get more candidates before filtering
      minYear: 2010, // Last ~15 years of research
      studyTypes: [
        'Randomized Controlled Trial',
        'Meta-Analysis',
        'Systematic Review',
        'Clinical Trial'
      ]
    })

    if (articles.length === 0) {
      console.log('No PubMed articles found for claim')
      return { articles: [], claimId }
    }

    // Score articles by relevance (now async and includes product context)
    const scoredArticles = await Promise.all(
      articles.map(async (article) => ({
        ...article,
        relevanceScore: await scoreArticleRelevance(article, claim.text, productContext)
      }))
    )

    // Filter by minimum relevance threshold (50% minimum to avoid bad suggestions)
    const MINIMUM_RELEVANCE_THRESHOLD = 0.5
    const relevantArticles = scoredArticles.filter(a => a.relevanceScore >= MINIMUM_RELEVANCE_THRESHOLD)

    // Sort by relevance and take top 5
    relevantArticles.sort((a, b) => b.relevanceScore - a.relevanceScore)
    const topArticles = relevantArticles.slice(0, 5)

    console.log(`Found ${topArticles.length} relevant PubMed articles (${scoredArticles.length - relevantArticles.length} filtered out for low relevance), scores:`,
      topArticles.map(a => `${a.pubmedId}: ${a.relevanceScore.toFixed(2)}`))

    // Create suggested documents (not yet accepted)
    const suggestedDocs = []

    for (const article of topArticles) {
      // Check if this PMID already exists in project
      const existing = await prisma.document.findFirst({
        where: {
          pubmedId: article.pubmedId,
          projectId
        }
      })

      if (existing) {
        console.log(`Article ${article.pubmedId} already in project, skipping`)
        continue
      }

      // Fetch abstract if not already present
      if (!article.abstract) {
        article.abstract = await fetchArticleAbstract(article.pubmedId)
      }

      // Create suggested document
      const doc = await prisma.document.create({
        data: {
          name: article.title,
          type: 'REFERENCE',
          projectId,
          source: 'PUBMED_AUTO',
          isAutoFound: true,
          autoFoundForClaimId: claimId,
          suggestedAt: new Date(),
          confidenceScore: article.relevanceScore,
          pubmedId: article.pubmedId,
          doi: article.doi,
          title: article.title,
          authors: JSON.stringify(article.authors),
          journal: article.journal,
          year: article.year,
          volume: article.volume,
          issue: article.issue,
          pages: article.pages,
          abstract: article.abstract,
          pubmedUrl: article.pubmedUrl,
        }
      })

      suggestedDocs.push(doc)
    }

    console.log(`Created ${suggestedDocs.length} suggested documents`)

    revalidatePath(`/projects/${projectId}`)

    return {
      claimId,
      articles: suggestedDocs.map(doc => ({
        id: doc.id,
        pubmedId: doc.pubmedId,
        title: doc.title,
        journal: doc.journal,
        year: doc.year,
        relevanceScore: doc.confidenceScore,
        pubmedUrl: doc.pubmedUrl
      }))
    }
  } catch (error) {
    console.error('Error searching PubMed for claim:', error)
    throw new Error('Failed to search PubMed for references')
  }
}

/**
 * Auto-find PubMed references for ALL claims in a project
 */
export async function autoFindAllReferences(projectId: string) {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error("Unauthorized")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    throw new Error("User not found")
  }

  // Verify project ownership
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
    include: { claims: true }
  })

  if (!project) {
    throw new Error("Project not found or access denied")
  }

  if (project.claims.length === 0) {
    throw new Error("No claims found. Please extract claims first.")
  }

  console.log(`Auto-finding references for ${project.claims.length} claims`)

  const results = []

  for (const claim of project.claims) {
    try {
      const result = await searchPubMedForClaim(claim.id, projectId)
      results.push(result)

      // Rate limiting: wait 0.5s between requests to be nice to PubMed
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      console.error(`Failed to find references for claim ${claim.id}:`, error)
      results.push({ claimId: claim.id, articles: [], error: String(error) })
    }
  }

  const totalSuggested = results.reduce((sum, r) => sum + r.articles.length, 0)
  console.log(`Auto-find complete: ${totalSuggested} total references suggested`)

  revalidatePath(`/projects/${projectId}`)

  return {
    projectId,
    totalClaims: project.claims.length,
    totalSuggested,
    results
  }
}

/**
 * Accept a suggested PubMed reference (mark it as accepted and auto-link to claim)
 */
export async function acceptSuggestedReference(documentId: string, projectId: string) {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error("Unauthorized")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    throw new Error("User not found")
  }

  // Verify project ownership
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
  })

  if (!project) {
    throw new Error("Project not found or access denied")
  }

  // Get the suggested document
  const doc = await prisma.document.findFirst({
    where: {
      id: documentId,
      projectId,
      isAutoFound: true,
      acceptedAt: null // Only accept pending suggestions
    },
    select: {
      id: true,
      name: true,
      type: true,
      url: true,
      projectId: true,
      autoFoundForClaimId: true,
      pubmedId: true,
      title: true,
      journal: true,
      year: true,
      confidenceScore: true,
      pubmedUrl: true,
    }
  })

  if (!doc) {
    throw new Error("Suggested reference not found or already accepted")
  }

  // Mark as accepted
  await prisma.document.update({
    where: { id: documentId },
    data: { acceptedAt: new Date() }
  })

  // Auto-link to the claim that triggered the suggestion
  if (doc.autoFoundForClaimId) {
    // Check if link already exists
    const existingLink = await prisma.link.findUnique({
      where: {
        claimId_documentId: {
          claimId: doc.autoFoundForClaimId,
          documentId: doc.id
        }
      }
    })

    if (!existingLink) {
      await prisma.link.create({
        data: {
          claimId: doc.autoFoundForClaimId,
          documentId: doc.id
        }
      })
      console.log(`Auto-linked accepted reference ${doc.id} to claim ${doc.autoFoundForClaimId}`)
    }
  }

  revalidatePath(`/projects/${projectId}`)

  return { success: true, documentId, linkedToClaim: doc.autoFoundForClaimId }
}

/**
 * Reject a suggested PubMed reference (delete it)
 */
export async function rejectSuggestedReference(documentId: string, projectId: string) {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error("Unauthorized")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    throw new Error("User not found")
  }

  // Verify project ownership
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
  })

  if (!project) {
    throw new Error("Project not found or access denied")
  }

  // Get the suggested document
  const doc = await prisma.document.findFirst({
    where: {
      id: documentId,
      projectId,
      isAutoFound: true,
      acceptedAt: null // Only reject pending suggestions
    }
  })

  if (!doc) {
    throw new Error("Suggested reference not found or already accepted")
  }

  // Delete the suggestion
  await prisma.document.delete({
    where: { id: documentId }
  })

  console.log(`Rejected suggested reference ${documentId}`)

  revalidatePath(`/projects/${projectId}`)

  return { success: true, documentId }
}

/**
 * Re-score existing auto-found PubMed references with improved algorithm
 */
export async function rescoreAutoFoundReferences(projectId: string) {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error("Unauthorized")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    throw new Error("User not found")
  }

  // Verify project ownership and get source document for context
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
    include: {
      documents: {
        where: { 
          OR: [
            { type: 'SOURCE' },
            { isAutoFound: true, acceptedAt: null } // Unaccepted suggestions only
          ]
        }
      },
      claims: true
    }
  })

  if (!project) {
    throw new Error("Project not found or access denied")
  }

  // Extract product context from source document
  const sourceDoc = project.documents.find(d => d.type === 'SOURCE')
  const productContext = sourceDoc?.name || ''

  // Get auto-found documents that haven't been accepted yet
  const autoFoundDocs = project.documents.filter(d => d.isAutoFound && !d.acceptedAt)

  if (autoFoundDocs.length === 0) {
    return {
      projectId,
      message: 'No auto-found references to re-score',
      updated: 0
    }
  }

  console.log(`Re-scoring ${autoFoundDocs.length} auto-found references with product context: ${productContext}`)

  let updated = 0

  for (const doc of autoFoundDocs) {
    // Find the claim this was suggested for
    const claim = project.claims.find(c => c.id === doc.autoFoundForClaimId)
    if (!claim) {
      console.log(`Claim not found for document ${doc.id}, skipping`)
      continue
    }

    // Re-score with improved algorithm
    const article = {
      pubmedId: doc.pubmedId || '',
      doi: doc.doi || undefined,
      title: doc.title || doc.name,
      authors: doc.authors ? JSON.parse(doc.authors as string) : [],
      journal: doc.journal || undefined,
      year: doc.year || undefined,
      volume: doc.volume || undefined,
      issue: doc.issue || undefined,
      pages: doc.pages || undefined,
      abstract: doc.abstract || undefined,
      pubmedUrl: doc.pubmedUrl || `https://pubmed.ncbi.nlm.nih.gov/${doc.pubmedId}/`
    }

    const newScore = await scoreArticleRelevance(article, claim.text, productContext)

    console.log(`Document ${doc.id} (${doc.pubmedId}): old score ${doc.confidenceScore?.toFixed(2)} -> new score ${newScore.toFixed(2)}`)

    // Update the confidence score and abstract if fetched
    await prisma.document.update({
      where: { id: doc.id },
      data: {
        confidenceScore: newScore,
        abstract: article.abstract || doc.abstract // Update abstract if we fetched it
      }
    })

    updated++

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 300))
  }

  console.log(`Re-scored ${updated} auto-found references`)

  revalidatePath(`/projects/${projectId}`)

  return {
    projectId,
    message: `Successfully re-scored ${updated} auto-found references`,
    updated,
    productContext
  }
}

/**
 * Run regulatory compliance check on all claims in a project
 */
export async function runComplianceCheck(projectId: string) {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error("Unauthorized")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    throw new Error("User not found")
  }

  // Verify project ownership
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
    include: { claims: true }
  })

  if (!project) {
    throw new Error("Project not found or access denied")
  }

  if (project.claims.length === 0) {
    throw new Error("No claims to check. Please extract claims first.")
  }

  console.log(`Running compliance check on ${project.claims.length} claims`)

  // Run compliance check
  const complianceResults = checkProjectCompliance(
    project.claims.map(c => ({ id: c.id, text: c.text }))
  )

  // Get summary
  const summary = getComplianceSummary(complianceResults)

  console.log('Compliance check summary:', summary)

  // Store results in database (could add a ComplianceCheck model in future)
  // For now, we'll return the results to the client

  revalidatePath(`/projects/${projectId}`)

  return {
    projectId,
    results: complianceResults,
    summary
  }
}

/**
 * Create a Stripe checkout session for a subscription.
 * Returns the checkout URL to redirect the user to.
 */
export async function createCheckoutSession(priceId: string, successUrl?: string, cancelUrl?: string) {
  const session = await auth()
  
  if (!session?.user?.email) {
    throw new Error('Unauthorized')
  }

  // Find or create user and their account
  let user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { account: true },
  })

  if (!user) {
    throw new Error('User not found')
  }

  // Create account if user doesn't have one
  if (!user.account) {
    const account = await prisma.account.create({
      data: {
        name: user.name || user.email || 'Account',
        billingEmail: user.email || '',
      },
    })

    user = await prisma.user.update({
      where: { id: user.id },
      data: { accountId: account.id },
      include: { account: true },
    })
  }

  // Import Stripe utilities
  const { stripe, getOrCreateStripeCustomer } = await import('@/utils/stripe')

  // Get or create Stripe customer
  const customerId = await getOrCreateStripeCustomer({
    accountId: user.account!.id,
    email: user.email!,
    name: user.name || undefined,
  })

  // Create checkout session
  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl || `${process.env.NEXTAUTH_URL}/account/billing?success=true`,
    cancel_url: cancelUrl || `${process.env.NEXTAUTH_URL}/pricing?canceled=true`,
    metadata: {
      accountId: user.account!.id,
      userId: user.id,
    },
    subscription_data: {
      metadata: {
        accountId: user.account!.id,
      },
    },
  })

  if (!checkoutSession.url) {
    throw new Error('Failed to create checkout session')
  }

  return { url: checkoutSession.url }
}

/**
 * Create a billing portal session for managing subscriptions.
 * Returns the portal URL to redirect the user to.
 */
export async function createBillingPortalSession(returnUrl?: string) {
  const session = await auth()
  
  if (!session?.user?.email) {
    throw new Error('Unauthorized')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { account: true },
  })

  if (!user?.account?.companyId) {
    throw new Error('No billing account found')
  }

  const { stripe } = await import('@/utils/stripe')

  // Create billing portal session
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.account.companyId,
    return_url: returnUrl || `${process.env.NEXTAUTH_URL}/account/billing`,
  })

  return { url: portalSession.url }
}

/**
 * Get the current user's subscription status and details.
 */
export async function getSubscriptionStatus() {
  const session = await auth()
  
  if (!session?.user?.email) {
    throw new Error('Unauthorized')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      account: {
        include: {
          subscriptions: {
            where: {
              status: { in: ['active', 'trialing', 'past_due'] },
            },
            orderBy: {
              startedAt: 'desc',
            },
            take: 1,
          },
        },
      },
    },
  })

  if (!user?.account) {
    return {
      hasActiveSubscription: false,
      subscription: null,
    }
  }

  const subscription = user.account.subscriptions[0] || null

  return {
    hasActiveSubscription: !!subscription,
    subscription: subscription ? {
      id: subscription.id,
      status: subscription.status,
      priceId: subscription.priceId,
      interval: subscription.interval,
      seatCount: subscription.seatCount,
      startedAt: subscription.startedAt,
      canceledAt: subscription.canceledAt,
    } : null,
  }
}
