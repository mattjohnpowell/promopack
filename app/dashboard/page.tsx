import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/utils/db"
import { DashboardClient } from "./client"
import { demoData } from "@/utils/demo"

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ demo?: string }> }) {
  const params = await searchParams
  const isDemo = params.demo === 'true'

  if (isDemo) {
    // Show demo data without authentication
    return <DashboardClient projects={demoData.projects} userEmail={demoData.user.email} isDemo={true} />
  }

  const session = await auth()

  if (!session?.user?.email) {
    redirect("/")
  }

  // Find the user by email to get the ID
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    redirect("/")
  }

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  })

  return <DashboardClient projects={projects} userEmail={session.user.email} isDemo={false} />
}