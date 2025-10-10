import { auth } from "@/auth"
import { redirect } from "next/navigation"
import DataManagementClient from "./client"

export const metadata = {
  title: "Data Management | PromoPack",
  description: "Export or delete your personal data",
}

export default async function DataManagementPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth")
  }

  return <DataManagementClient userEmail={session.user.email || ""} />
}
