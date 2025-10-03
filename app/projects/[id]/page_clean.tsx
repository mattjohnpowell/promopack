import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/utils/db"
import { getDemoProject } from "@/utils/demo"
import { ProjectContent } from "./ProjectContent"

interface ProjectPageProps {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{ demo?: string }>
}

export default async function ProjectPage({ params, searchParams }: ProjectPageProps) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const isDemo = resolvedSearchParams.demo === "true"

  if (isDemo) {
    // Show demo project data
    const project = getDemoProject(resolvedParams.id)
    if (!project) {
      redirect("/dashboard?demo=true")
    }
    return <ProjectContent project={project} isDemo={true} />
  }

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

  // Get project with documents and claims
  const project = await prisma.project.findFirst({
    where: {
      id: resolvedParams.id,
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
    redirect("/dashboard")
  }

  return <ProjectContent project={project} isDemo={false} />
}