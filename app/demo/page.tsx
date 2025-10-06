import { redirect } from "next/navigation"
import { DEMO_PROJECT } from "@/lib/demo-data"

/**
 * Demo Mode Entry Point
 *
 * Redirects users to the demo project to explore PromoPack
 * without requiring authentication.
 */
export default function DemoPage() {
  // Redirect to demo project claims workspace
  redirect(`/projects/${DEMO_PROJECT.id}/claims`)
}
