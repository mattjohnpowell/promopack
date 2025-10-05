"use server"

import { auth } from "@/auth"
import { prisma } from "@/utils/db"
import { revalidatePath } from "next/cache"

export async function createProject(formData: FormData) {
  const session = await auth()
  if (!session?.user?.email) {
    throw new Error("Unauthorized")
  }

  // Find the user by email to get the ID
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user?.id) {
    throw new Error("User ID not found")
  }

  // Check usage limits before creating project
  const { checkUsageLimit } = await import('@/utils/subscription')
  const usageCheck = await checkUsageLimit(user.id, 'projects')
  
  if (!usageCheck.allowed) {
    throw new Error(usageCheck.message || 'Project limit reached. Please upgrade your plan.')
  }

  const name = formData.get("name") as string
  if (!name) {
    throw new Error("Project name is required")
  }

  const templateId = formData.get("templateId") as string | null
  const templateData = formData.get("templateData") as string | null

  // Create the project
  await prisma.project.create({
    data: {
      name,
      userId: user.id,
      // Store template metadata if provided
      ...(templateId && {
        metadata: {
          templateId,
          templateData: templateData ? JSON.parse(templateData) : null,
          createdFromTemplate: true
        }
      }),
    },
  })

  revalidatePath("/dashboard")
}