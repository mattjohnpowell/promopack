"use client"

import { useState } from "react"
import { reviewClaim } from "@/app/actions"
import toast from "react-hot-toast"

const CLAIM_TYPES = [
  { value: "EFFICACY", label: "Efficacy", description: "Effectiveness outcomes" },
  { value: "SAFETY", label: "Safety", description: "Adverse events, tolerability" },
  { value: "INDICATION", label: "Indication", description: "Approved uses" },
  { value: "COMPARATIVE", label: "Comparative", description: "vs other treatments" },
  { value: "PHARMACOKINETIC", label: "Pharmacokinetic", description: "PK/PD properties" },
  { value: "DOSING", label: "Dosing", description: "Dosage recommendations" },
  { value: "CONTRAINDICATION", label: "Contraindication", description: "Restrictions" },
  { value: "MECHANISM", label: "Mechanism", description: "How it works" },
  { value: "DRUG_INTERACTION", label: "Drug Interaction", description: "Interactions" },
  { value: "OTHER", label: "Other", description: "Other claim types" },
]

const REJECTION_REASONS = [
  "Incomplete sentence or fragment",
  "Background information (not about the drug)",
  "Study methodology description",
  "Table header or figure caption",
  "Section title or boilerplate",
  "Too trivial or obvious",
  "Duplicate of another claim",
  "Other",
]

type ClaimReviewCardProps = {
  claim: {
    id: string
    text: string
    page: number
    status: string
    claimType?: string | null
    rejectionReason?: string | null
    editedText?: string | null
    extractionConfidence?: number | null
    extractionReasoning?: string | null
    suggestedType?: string | null
    isComparative?: boolean | null
    containsStatistics?: boolean | null
    citationPresent?: boolean | null
    warnings?: string | null  // JSON string
  }
  onUpdate: () => void
}

export function ClaimReviewCard({ claim, onUpdate }: ClaimReviewCardProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedType, setSelectedType] = useState(claim.suggestedType || claim.claimType || "")
  const [rejectionReason, setRejectionReason] = useState("")
  const [customReason, setCustomReason] = useState("")
  const [editedText, setEditedText] = useState(claim.text)

  const handleApprove = async () => {
    setIsProcessing(true)
    try {
      await reviewClaim(claim.id, "approve", {
        claimType: selectedType || undefined,
      })
      toast.success("Claim approved!")
      onUpdate()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to approve claim")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async () => {
    const reason = rejectionReason === "Other" ? customReason : rejectionReason
    if (!reason) {
      toast.error("Please provide a rejection reason")
      return
    }

    setIsProcessing(true)
    try {
      await reviewClaim(claim.id, "reject", {
        rejectionReason: reason,
      })
      toast.success("Claim rejected")
      setShowRejectModal(false)
      onUpdate()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to reject claim")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleEdit = async () => {
    if (!editedText.trim()) {
      toast.error("Edited text cannot be empty")
      return
    }

    setIsProcessing(true)
    try {
      await reviewClaim(claim.id, "edit", {
        editedText: editedText.trim(),
        claimType: selectedType || undefined,
      })
      toast.success("Claim updated!")
      setShowEditModal(false)
      onUpdate()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to edit claim")
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusBadge = () => {
    switch (claim.status) {
      case "PENDING_REVIEW":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending Review</span>
      case "APPROVED":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">✓ Approved</span>
      case "REJECTED":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">✗ Rejected</span>
      case "EDITED":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">✏ Edited</span>
      default:
        return null
    }
  }

  const getConfidenceBadge = () => {
    const confidence = claim.extractionConfidence
    if (confidence === null || confidence === undefined) return null

    let bgColor, textColor, label
    if (confidence >= 0.7) {
      bgColor = "bg-green-100"
      textColor = "text-green-800"
      label = "High Confidence"
    } else if (confidence >= 0.5) {
      bgColor = "bg-yellow-100"
      textColor = "text-yellow-800"
      label = "Medium Confidence"
    } else {
      bgColor = "bg-orange-100"
      textColor = "text-orange-800"
      label = "Low Confidence"
    }

    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        AI: {label} ({Math.round(confidence * 100)}%)
      </span>
    )
  }

  const isPending = claim.status === "PENDING_REVIEW"
  const isRejected = claim.status === "REJECTED"

  // Parse warnings if available
  const warnings = claim.warnings ? JSON.parse(claim.warnings) : []
  const hasWarnings = warnings.length > 0

  return (
    <>
      <div
        className={`bg-white rounded-lg shadow-sm border p-6 ${
          isRejected ? "border-red-200 bg-red-50/30 opacity-75" : isPending ? "border-yellow-300 bg-yellow-50/20" : "border-gray-200"
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center flex-wrap gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Page {claim.page}</span>
            {getStatusBadge()}
            {getConfidenceBadge()}
            {claim.suggestedType && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                AI suggests: {claim.suggestedType}
              </span>
            )}
            {claim.isComparative && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                ⚖️ Comparative
              </span>
            )}
            {claim.containsStatistics && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
                📊 Has Statistics
              </span>
            )}
            {hasWarnings && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                ⚠️ {warnings.length} Warning{warnings.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Display text */}
        <div className="mb-4">
          {claim.editedText ? (
            <>
              <p className="text-gray-500 text-sm line-through mb-2">{claim.text}</p>
              <p className="text-gray-900 text-lg leading-relaxed font-medium">{claim.editedText}</p>
              <p className="text-xs text-blue-600 mt-1">Edited version shown above</p>
            </>
          ) : (
            <p className="text-gray-900 text-lg leading-relaxed">{claim.text}</p>
          )}
        </div>

        {/* AI Reasoning */}
        {claim.extractionReasoning && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-xs font-medium text-blue-900 mb-1">AI Extraction Reasoning:</p>
            <p className="text-sm text-blue-800">{claim.extractionReasoning}</p>
          </div>
        )}

        {/* Warnings */}
        {hasWarnings && (
          <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
            <p className="text-xs font-medium text-orange-900 mb-2">⚠️ Quality Warnings:</p>
            <ul className="list-disc list-inside space-y-1">
              {warnings.map((warning: string, idx: number) => (
                <li key={idx} className="text-sm text-orange-800">
                  {warning.replace(/_/g, ' ').toLowerCase()}
                </li>
              ))}
            </ul>
            <p className="text-xs text-orange-700 mt-2">
              These warnings suggest this may not be a valid regulatory claim. Review carefully before approving.
            </p>
          </div>
        )}

        {/* Rejection reason */}
        {claim.rejectionReason && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-xs font-medium text-red-900 mb-1">Rejection Reason:</p>
            <p className="text-sm text-red-800">{claim.rejectionReason}</p>
          </div>
        )}

        {/* Action buttons (only for pending) */}
        {isPending && (
          <div className="space-y-3">
            {/* Claim type selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Claim Type:</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select type...</option>
                {CLAIM_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label} - {type.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleApprove}
                disabled={isProcessing || !selectedType}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✓ Approve as {selectedType ? CLAIM_TYPES.find((t) => t.value === selectedType)?.label : "Claim"}
              </button>
              <button
                onClick={() => setShowEditModal(true)}
                disabled={isProcessing}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✏ Edit Text
              </button>
              <button
                onClick={() => setShowRejectModal(true)}
                disabled={isProcessing}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✗ Reject
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Why is this not a claim?</h3>
            <div className="space-y-2 mb-4">
              {REJECTION_REASONS.map((reason) => (
                <label key={reason} className="flex items-center">
                  <input
                    type="radio"
                    name="rejection-reason"
                    value={reason}
                    checked={rejectionReason === reason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">{reason}</span>
                </label>
              ))}
            </div>
            {rejectionReason === "Other" && (
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Enter custom reason..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 mb-4"
              />
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {isProcessing ? "Rejecting..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Claim Text</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Original extracted text:</label>
              <p className="text-sm text-gray-500 p-3 bg-gray-50 rounded border border-gray-200">{claim.text}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Edited claim:</label>
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Claim Type:</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select type...</option>
                {CLAIM_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label} - {type.description}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={isProcessing || !selectedType}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {isProcessing ? "Saving..." : "Save & Approve"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
