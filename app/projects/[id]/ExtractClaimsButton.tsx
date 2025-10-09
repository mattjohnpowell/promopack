"use client"

import { useState } from "react"
import { extractClaims } from "@/app/actions"
import toast from "react-hot-toast"

interface ExtractClaimsButtonProps {
  projectId: string
  hasSourceDocument: boolean
  onExtractionComplete?: () => void
}

export function ExtractClaimsButton({ projectId, hasSourceDocument, onExtractionComplete }: ExtractClaimsButtonProps) {
  const [isExtracting, setIsExtracting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [autoFindRefs, setAutoFindRefs] = useState(true) // Default to enabled

  const handleExtract = async () => {
    setIsExtracting(true)
    setProgress(0)

    // Simulate progress for claim extraction
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev
        return prev + Math.random() * 10
      })
    }, 500)

    try {
      const result = await extractClaims(projectId, { autoFindReferences: autoFindRefs })
      setProgress(100)
      clearInterval(progressInterval)

      toast.success(result.message, { duration: 5000 })

      // Trigger callback to refresh data and show claims
      if (onExtractionComplete) {
        onExtractionComplete()
      }
    } catch (error) {
      clearInterval(progressInterval)
      toast.error(error instanceof Error ? error.message : "Failed to extract claims")
    } finally {
      setIsExtracting(false)
      setProgress(0)
    }
  }

  return (
    <div className="flex flex-col items-end space-y-3" data-onboarding="extract-claims">
      {/* Auto-find references checkbox */}
      <div className="flex items-center gap-2 mr-2">
        <input
          type="checkbox"
          id="auto-find-refs"
          checked={autoFindRefs}
          onChange={(e) => setAutoFindRefs(e.target.checked)}
          disabled={isExtracting}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="auto-find-refs" className="text-sm text-gray-700 cursor-pointer select-none">
          Auto-find PubMed references
          <span className="block text-xs text-gray-500 mt-0.5">
            Automatically search for relevant references after extracting claims
          </span>
        </label>
      </div>

      <button
        onClick={handleExtract}
        disabled={!hasSourceDocument || isExtracting}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExtracting ? `Processing... ${Math.round(progress)}%` : "Extract Claims"}
      </button>

      {!hasSourceDocument && (
        <div className="w-full max-w-xs text-center">
          <p className="text-xs text-gray-500">
            Upload a source document first
          </p>
        </div>
      )}

      {isExtracting && (
        <div className="w-full max-w-xs">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 mt-1 text-right">
            {autoFindRefs ? 'Analyzing document & finding references...' : 'Analyzing document...'}
          </p>
        </div>
      )}
    </div>
  )
}