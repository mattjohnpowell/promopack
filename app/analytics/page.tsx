import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/utils/db"
import { AnalyticsContent } from "./AnalyticsContent"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Analytics Dashboard | PromoPack",
  description: "Usage analytics and team productivity metrics for pharmaceutical promotional materials workflow.",
}

export default async function AnalyticsPage() {
  const session = await auth()

  if (!session?.user?.email) {
    redirect("/auth")
  }

  // Find the user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      projects: {
        include: {
          claims: true,
          documents: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  if (!user) {
    redirect("/auth")
  }

  return <AnalyticsContent user={user} />
}
