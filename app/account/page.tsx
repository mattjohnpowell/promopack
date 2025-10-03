import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/utils/db"
import { AccountClient } from "./client"

export default async function AccountPage({
  searchParams
}: {
  searchParams: Promise<{ success?: string; session_id?: string }>
}) {
  const params = await searchParams
  const session = await auth()

  if (!session?.user?.email) {
    redirect("/")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      account: {
        include: {
          subscriptions: {
            include: {
              seats: true
            }
          },
          invoices: {
            orderBy: { issuedAt: "desc" },
            take: 5
          }
        }
      }
    }
  })

  if (!user) {
    redirect("/")
  }

  return (
    <AccountClient
      user={user}
      success={params.success === 'true'}
      sessionId={params.session_id}
    />
  )
}