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

    // Redirect to home page for sign in
    redirect("/")
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

    const response = await fetch(`${extractorApiUrl}/extract-claims`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${extractorApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        document_url: sourceDoc.url,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Extractor API error: ${response.status} ${response.statusText}. ${errorData.message || ''}`)
    }

    const data = await response.json()

    if (!data.claims || !Array.isArray(data.claims)) {
      throw new Error("Invalid response from extractor service: missing or invalid claims array")
    }

    // Trust the extractor service - claims are verified by the external service
    console.log(`Extractor service returned ${data.claims.length} claims - treating as verified`)

    // Create claims in database
    await prisma.claim.createMany({
      data: data.claims.map((claim: { text: string; page: number }) => ({
        text: claim.text,
        page: claim.page,
        projectId,
      })),
    })

    // Auto-link claims to EXISTING reference documents (user-uploaded)
    await autoLinkClaims(projectId)

    // Audit the links
    await auditLinks(projectId)

    // Optionally: Auto-find PubMed references for claims
    let autoFindResult
    if (options.autoFindReferences) {
      console.log('Auto-finding PubMed references enabled...')
      try {
        autoFindResult = await autoFindAllReferences(projectId)
        console.log(`Auto-find complete: ${autoFindResult.totalSuggested} references suggested`)
      } catch (error) {
        console.error('Auto-find references failed:', error)
        // Don't fail the entire operation if auto-find fails
      }
    }

    // Revalidate the project page
    revalidatePath(`/projects/${projectId}`)

    return {
      message: `Extracted ${data.claims.length} verified claims from source document`,
      claimsCount: data.claims.length,
      autoFindResult
    }
  } catch (error) {
    console.error("Error extracting claims:", error)
    throw new Error("Failed to extract claims")
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

  // PMCPA Compliance Validation
  const unlinkedClaims = project.claims.filter(claim => claim.links.length === 0)
  if (unlinkedClaims.length > 0) {
    throw new Error(`Cannot generate pack: ${unlinkedClaims.length} claim(s) are not linked to reference documents. All claims must be substantiated for PMCPA compliance.`)
  }

  if (project.claims.length === 0) {
    throw new Error("Cannot generate pack: No claims have been extracted from the source document.")
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

    // Claims and links
    addText(`Claims and Links:`, 14)
    yPosition -= 10

    project.claims.forEach(claim => {
      addText(`Claim: ${claim.text}`)
      addText(`Page: ${claim.page}`)
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

// Billing / Stripe server action skeletons
export async function createCheckoutSession(projectId: string, priceId: string) {
  const session = await auth()
  if (!session?.user?.email) throw new Error('Unauthorized')
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) throw new Error('User not found')

  // Ownership / access check: ensure user has access to project
  const project = await prisma.project.findFirst({ where: { id: projectId, userId: user.id } })
  if (!project) throw new Error('Project not found or access denied')

  // NOTE: Implement Stripe Checkout creation here (server-side) using STRIPE_SECRET_KEY
  // Example (pseudo):
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2022-11-15' })
  // const session = await stripe.checkout.sessions.create({...})

  // Return a placeholder until Stripe is wired
  return { url: `/billing/checkout?priceId=${priceId}` }
}

export async function createSubscriptionCheckout(priceId: string) {
  const session = await auth()
  if (!session?.user?.email) throw new Error('Unauthorized')
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) throw new Error('User not found')

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  if (!stripeSecretKey) throw new Error('Stripe not configured')

  const stripe = new Stripe(stripeSecretKey, { apiVersion: '2025-08-27.basil' })

  // Create or get user account
  let account = await prisma.account.findFirst({
    where: { users: { some: { id: user.id } } }
  })

  if (!account) {
    account = await prisma.account.create({
      data: {
        name: user.name || user.email || 'Personal Account',
        billingEmail: user.email,
        users: { connect: { id: user.id } }
      }
    })
  }

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3032'

  // Create Stripe checkout session for subscription
  const checkoutSession = await stripe.checkout.sessions.create({
    line_items: [{
      price: priceId,
      quantity: 1,
    }],
    mode: 'subscription',
    success_url: baseUrl + '/account?success=true&session_id={CHECKOUT_SESSION_ID}',
    cancel_url: baseUrl + '/pricing?canceled=true',
    metadata: {
      userId: user.id,
      accountId: account.id,
    },
    customer_email: user.email || undefined,
    allow_promotion_codes: true,
    billing_address_collection: 'required',
  } as Stripe.Checkout.SessionCreateParams)

  return { url: checkoutSession.url }
}

// Webhook handler for Stripe events
export async function handleStripeWebhook(signature: string, payload: Buffer) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) throw new Error('Webhook secret not configured')

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  if (!stripeSecretKey) throw new Error('Stripe not configured')

  const stripe = new Stripe(stripeSecretKey, { apiVersion: '2025-08-27.basil' })

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    throw new Error('Invalid webhook signature')
  }

  console.log('Processing webhook event:', event.type)

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutSessionCompleted(session)
        break
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaymentSucceeded(invoice)
        break
      }
      case 'invoice.finalized': {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoiceFinalized(invoice)
        break
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdated(subscription)
        break
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }
      // case 'product.created':
      // case 'product.updated': {
      //   const product = event.data.object as Stripe.Product
      //   await handleProductUpdated(product)
      //   break
      // }
      // case 'price.created':
      // case 'price.updated': {
      //   const price = event.data.object as Stripe.Price
      //   await handlePriceUpdated(price)
      //   break
      // }
      default:
        console.log('Unhandled event type:', event.type)
    }

    return { handled: true }
  } catch (error) {
    console.error('Error processing webhook:', error)
    throw error
  }
}

// Helper functions for webhook event handling
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  const accountId = session.metadata?.accountId

  if (!userId) {
    console.error('No userId in checkout session metadata')
    return
  }

  // Get subscription details from Stripe
  if (session.subscription) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-08-27.basil' })
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

    const price = subscription.items.data[0]?.price
    if (!price) return

    // Create or update subscription record
    const subscriptionData = {
      accountId: accountId || userId, // Use accountId if available, otherwise userId as account
      stripeId: subscription.id,
      status: subscription.status,
      priceId: price.id,
      interval: price.recurring?.interval || 'month',
      seatCount: 1
    }

    await prisma.subscription.upsert({
      where: { stripeId: subscription.id },
      update: subscriptionData,
      create: subscriptionData
    })

    console.log('Subscription created/updated:', subscription.id)
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  // Update local invoice status
  await prisma.invoice.updateMany({
    where: { stripeId: invoice.id },
    data: { status: 'PAID' }
  })

  // Create payment record
  await prisma.payment.create({
    data: {
      invoiceId: (await prisma.invoice.findFirst({ where: { stripeId: invoice.id } }))?.id,
      stripeId: `invoice_${invoice.id}`,
      amount: invoice.amount_paid,
      status: 'SUCCEEDED',
      paidAt: new Date()
    }
  })

  console.log('Invoice payment recorded:', invoice.id)
}

async function handleInvoiceFinalized(invoice: Stripe.Invoice) {
  // Update local invoice with final details
  await prisma.invoice.updateMany({
    where: { stripeId: invoice.id },
    data: {
      number: invoice.number || undefined,
      pdfUrl: invoice.invoice_pdf || undefined,
      status: 'OPEN'
    }
  })

  console.log('Invoice finalized:', invoice.id)
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  await prisma.subscription.updateMany({
    where: { stripeId: subscription.id },
    data: {
      status: subscription.status,
      seatCount: subscription.items.data[0]?.quantity || 1
    }
  })

  console.log('Subscription updated:', subscription.id)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await prisma.subscription.updateMany({
    where: { stripeId: subscription.id },
    data: {
      status: 'canceled',
      canceledAt: new Date()
    }
  })

  console.log('Subscription canceled:', subscription.id)
}

// async function handleProductUpdated(product: Stripe.Product) {
//   // Sync product data from Stripe to our database
//   await prisma.product.upsert({
//     where: { stripeId: product.id },
//     update: {
//       name: product.name,
//       description: product.description,
//       active: product.active
//     },
//     create: {
//       stripeId: product.id,
//       name: product.name || '',
//       description: product.description,
//       active: product.active
//     }
//   })

//   console.log('Product synced:', product.id)
// }

// async function handlePriceUpdated(price: Stripe.Price) {
//   // Sync price data from Stripe to our database
//   await prisma.price.upsert({
//     where: { stripeId: price.id },
//     update: {
//       amount: price.unit_amount || 0,
//       currency: price.currency,
//       interval: price.recurring?.interval,
//       intervalCount: price.recurring?.interval_count || 1,
//       type: price.type,
//       active: price.active
//     },
//     create: {
//       stripeId: price.id,
//       productId: price.product as string,
//       amount: price.unit_amount || 0,
//       currency: price.currency,
//       interval: price.recurring?.interval,
//       intervalCount: price.recurring?.interval_count || 1,
//       type: price.type,
//       active: price.active
//     }
//   })

//   console.log('Price synced:', price.id)
// }

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

  const claims = project.claims
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

  // Verify project ownership
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
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

    // Extract keywords and search PubMed
    const keywords = extractMedicalKeywords(claim.text)
    console.log(`Extracted keywords: ${keywords}`)

    const articles = await searchPubMed(keywords, {
      maxResults: 5,
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

    // Score articles by relevance
    const scoredArticles = articles.map(article => ({
      ...article,
      relevanceScore: scoreArticleRelevance(article, claim.text)
    }))

    // Sort by relevance
    scoredArticles.sort((a, b) => b.relevanceScore - a.relevanceScore)

    console.log(`Found ${scoredArticles.length} PubMed articles, relevance scores:`,
      scoredArticles.map(a => `${a.pubmedId}: ${a.relevanceScore.toFixed(2)}`))

    // Create suggested documents (not yet accepted)
    const suggestedDocs = []

    for (const article of scoredArticles) {
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