"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { autoFindAllReferences } from "@/app/actions"
import toast from "react-hot-toast"

interface FindReferencesButtonProps {
  projectId: string
  hasClaims: boolean
}

export function FindReferencesButton({ projectId, hasClaims }: FindReferencesButtonProps) {
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  const handleFindReferences = async () => {
    setIsSearching(true)
    try {
      const result = await autoFindAllReferences(projectId)

      if (result.totalSuggested > 0) {
        toast.success(
          `Found ${result.totalSuggested} suggested references for ${result.totalClaims} claims!`,
          { duration: 5000 }
        )
        // Refresh to show suggested references
        router.refresh()
      } else {
        toast('No relevant PubMed references found. Try uploading your own reference documents.', {
          duration: 5000
        })
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to find references")
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <button
      onClick={handleFindReferences}
      disabled={!hasClaims || isSearching}
      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSearching ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Searching PubMed...
        </>
      ) : (
        <>
          <svg className="-ml-1 mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Find References Automatically
        </>
      )}
    </button>
  )
}
