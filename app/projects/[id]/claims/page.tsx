import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/utils/db"
import { ClaimsPageContent } from "./ClaimsPageContent"
import { isDemoMode, getDemoProject } from "@/lib/demo-data"

interface ClaimsPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ClaimsPage({ params }: ClaimsPageProps) {
  const resolvedParams = await params

  // Check if this is demo mode
  if (isDemoMode(resolvedParams.id)) {
    const demoProject = getDemoProject()
    return (
      <ClaimsPageContent
        projectId={demoProject.id}
        claims={demoProject.claims}
        projectName={demoProject.name}
        isDemo={true}
      />
    )
  }

  // Regular authenticated flow
  const session = await auth()

  if (!session?.user?.email) {
    redirect("/")
  }

  // Find the user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    redirect("/")
  }

  // Get project with claims
  const project = await prisma.project.findFirst({
    where: {
      id: resolvedParams.id,
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
    redirect("/dashboard")
  }

  return (
    <ClaimsPageContent
      projectId={project.id}
      claims={project.claims}
      projectName={project.name}
      isDemo={false}
    />
  )
}