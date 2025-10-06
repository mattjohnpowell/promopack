"use client"

import { useState } from "react"
import { deleteDocument } from "@/app/actions"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

interface DeleteDocumentButtonProps {
  documentId: string
  documentName: string
  documentType: "SOURCE" | "REFERENCE"
  isDemo?: boolean
}

export function DeleteDocumentButton({ documentId, documentName, documentType, isDemo = false }: DeleteDocumentButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isDemo) {
      toast.error("Delete is disabled in demo mode. Sign up to manage documents!")
      return
    }

    const isSourceDoc = documentType === "SOURCE"
    const confirmMessage = isSourceDoc
      ? `Delete "${documentName}"? This will also delete all extracted claims from this project.`
      : `Delete "${documentName}"?`

    if (!confirm(confirmMessage)) {
      return
    }

    setIsDeleting(true)
    try {
      const result = await deleteDocument(documentId)

      if (result.deletedClaims) {
        toast.success("Document and all claims deleted successfully")
      } else {
        toast.success("Document deleted successfully")
      }

      // Refresh the page data
      router.refresh()
    } catch (error) {
      console.error("Error deleting document:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete document")
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
      title={documentType === "SOURCE" ? "Delete document (will delete all claims)" : "Delete document"}
    >
      {isDeleting ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      )}
    </button>
  )
}
