"use client"

import { useState } from "react"
import { acceptSuggestedReference, rejectSuggestedReference, rescoreAutoFoundReferences } from "@/app/actions"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

interface SuggestedReference {
  id: string
  name: string
  type: string
  url?: string | null
  createdAt?: Date
  pubmedId?: string | null
  doi?: string | null
  title?: string | null
  authors?: string | null
  journal?: string | null
  year?: number | null
  volume?: string | null
  issue?: string | null
  pages?: string | null
  abstract?: string | null
  pubmedUrl?: string | null
  source?: string
  isAutoFound?: boolean
  autoFoundForClaimId?: string | null
  suggestedAt?: Date | null
  acceptedAt?: Date | null
  confidenceScore?: number | null
}

interface SuggestedReferencesPanelProps {
  projectId: string
  suggestedReferences: SuggestedReference[]
  claimsMap: Map<string, string> // claimId -> claim text
}

export function SuggestedReferencesPanel({
  projectId,
  suggestedReferences,
  claimsMap
}: SuggestedReferencesPanelProps) {
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())
  const [isRescoring, setIsRescoring] = useState(false)
  const router = useRouter()

  if (suggestedReferences.length === 0) {
    return null
  }

  const handleAccept = async (docId: string) => {
    setProcessingIds(prev => new Set(prev).add(docId))
    try {
      await acceptSuggestedReference(docId, projectId)
      toast.success('Reference accepted and linked to claim', { duration: 3000 })
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to accept reference')
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev)
        next.delete(docId)
        return next
      })
    }
  }

  const handleReject = async (docId: string) => {
    setProcessingIds(prev => new Set(prev).add(docId))
    try {
      await rejectSuggestedReference(docId, projectId)
      toast.success('Reference rejected', { duration: 2000 })
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to reject reference')
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev)
        next.delete(docId)
        return next
      })
    }
  }

  const handleRescore = async () => {
    setIsRescoring(true)
    try {
      const result = await rescoreAutoFoundReferences(projectId)
      toast.success(`${result.message}`, { duration: 4000 })
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to re-score references')
    } finally {
      setIsRescoring(false)
    }
  }

  const getConfidenceColor = (score: number | null | undefined) => {
    if (score == null) return 'text-gray-500'
    if (score >= 0.7) return 'text-green-600'
    if (score >= 0.5) return 'text-yellow-600'
    return 'text-orange-600'
  }

  const getConfidenceLabel = (score: number | null | undefined) => {
    if (score == null) return 'Unknown'
    if (score >= 0.7) return 'High'
    if (score >= 0.5) return 'Medium'
    return 'Low'
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Suggested References from PubMed
          </h3>
          <p className="text-sm text-blue-700 mt-1">
            {suggestedReferences.length} reference{suggestedReferences.length !== 1 ? 's' : ''} automatically found.
            Review and accept relevant ones.
          </p>
        </div>
        <button
          onClick={handleRescore}
          disabled={isRescoring}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
          title="Re-score all suggestions with improved algorithm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {isRescoring ? 'Re-scoring...' : 'Re-score with New Algorithm'}
        </button>
      </div>

      <div className="space-y-3">
        {suggestedReferences.map((ref) => {
          const isProcessing = processingIds.has(ref.id)
          const claimText = ref.autoFoundForClaimId ? claimsMap.get(ref.autoFoundForClaimId) : null

          return (
            <div
              key={ref.id}
              className="bg-white border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  {/* Reference title */}
                  <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
                    {ref.title || 'Untitled'}
                  </h4>

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600 mb-2">
                    {ref.journal && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        {ref.journal}
                      </span>
                    )}
                    {ref.year && (
                      <span className="text-gray-500">({ref.year})</span>
                    )}
                    {ref.pubmedId && (
                      <span className="flex items-center gap-1">
                        <span className="text-gray-500">PMID:</span>
                        <a
                          href={ref.pubmedUrl || `https://pubmed.ncbi.nlm.nih.gov/${ref.pubmedId}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {ref.pubmedId}
                        </a>
                      </span>
                    )}
                  </div>

                  {/* Confidence score */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-500">Relevance:</span>
                    <span className={`text-xs font-semibold ${getConfidenceColor(ref.confidenceScore)}`}>
                      {getConfidenceLabel(ref.confidenceScore)}
                      {ref.confidenceScore && ` (${(ref.confidenceScore * 100).toFixed(0)}%)`}
                    </span>
                  </div>

                  {/* Related claim */}
                  {claimText && (
                    <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Suggested for claim:</p>
                      <p className="text-sm text-gray-700 line-clamp-2">&ldquo;{claimText}&rdquo;</p>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleAccept(ref.id)}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {isProcessing ? '...' : '✓ Accept'}
                  </button>
                  <button
                    onClick={() => handleReject(ref.id)}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {isProcessing ? '...' : '✗ Reject'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 p-3 bg-blue-100 rounded-md">
        <p className="text-xs text-blue-800">
          <strong>💡 Tip:</strong> User-uploaded references are always prioritized. These PubMed suggestions are
          additional references you can review and accept if relevant to your claims.
        </p>
      </div>
    </div>
  )
}
