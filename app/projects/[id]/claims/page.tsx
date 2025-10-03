import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/utils/db"
import { ClaimsPageContent } from "./ClaimsPageContent"

interface ClaimsPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ClaimsPage({ params }: ClaimsPageProps) {
  const resolvedParams = await params

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
    />
  )
}