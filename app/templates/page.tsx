import { Metadata } from "next"
import { TemplatesContent } from "./TemplatesContent"

export const metadata: Metadata = {
  title: "Project Templates | PromoPack",
  description: "Pre-configured templates for common pharmaceutical promotional materials. Get started quickly with sales aids, journal ads, MSL decks, and more.",
  openGraph: {
    title: "Project Templates | PromoPack",
    description: "Pre-configured templates for common pharmaceutical promotional materials.",
  },
}

export default function TemplatesPage() {
  return <TemplatesContent />
}
