"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { generatePack, bulkReviewClaims } from "@/app/actions"
import toast from "react-hot-toast"
import { exportClaimsToCSV, exportAllProjectData } from "@/lib/export-utils"
import { ClaimReviewCard } from "@/components/ClaimReviewCard"

type Claim = {
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
  warnings?: string | null
  confidenceScore?: number | null
  auditReasoning?: string | null
  needsReview?: boolean
  links: Array<{
    id: string
    document: {
      id: string
      name: string
      type: string
      url: string | null
    }
  }>
}

interface ClaimsPageContentProps {
  projectId: string
  claims: Claim[]
  projectName: string
  isDemo?: boolean
}

export function ClaimsPageContent({ projectId, claims, projectName, isDemo = false }: ClaimsPageContentProps) {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected" | "edited">("all")
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [selectedClaims, setSelectedClaims] = useState<Set<string>>(new Set())
  const [isBulkProcessing, setIsBulkProcessing] = useState(false)

  // Calculate stats
  const stats = useMemo(() => {
    const pending = claims.filter(c => c.status === 'PENDING_REVIEW').length
    const approved = claims.filter(c => c.status === 'APPROVED').length
    const rejected = claims.filter(c => c.status === 'REJECTED').length
    const edited = claims.filter(c => c.status === 'EDITED').length
    return { pending, approved, rejected, edited, total: claims.length }
  }, [claims])

  // Filter and search claims
  const filteredClaims = useMemo(() => {
    let filtered = claims

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(claim =>
        claim.text.toLowerCase().includes(query) ||
        claim.editedText?.toLowerCase().includes(query) ||
        claim.extractionReasoning?.toLowerCase().includes(query) ||
        claim.rejectionReason?.toLowerCase().includes(query)
      )
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(claim => {
        if (filterStatus === "pending") return claim.status === "PENDING_REVIEW"
        if (filterStatus === "approved") return claim.status === "APPROVED"
        if (filterStatus === "rejected") return claim.status === "REJECTED"
        if (filterStatus === "edited") return claim.status === "EDITED"
        return true
      })
    }

    return filtered
  }, [claims, searchQuery, filterStatus])

  const handleDownloadPDF = async () => {
    if (isDemo) {
      toast.error("PDF generation is disabled in demo mode. Sign up to generate PDFs!")
      return
    }

    // Check if there are approved claims
    const approvedCount = claims.filter(c => c.status === 'APPROVED' || c.status === 'EDITED').length
    if (approvedCount === 0) {
      toast.error("No approved claims to include in PDF. Please review and approve claims first.")
      return
    }

    setIsGenerating(true)
    try {
      const result = await generatePack(projectId)
      const pdfBlob = new Blob([Uint8Array.from(atob(result.pdfBytes), c => c.charCodeAt(0))], { type: 'application/pdf' })
      const url = URL.createObjectURL(pdfBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = result.fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success("PDF downloaded successfully!")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate PDF")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleExportCSV = () => {
    if (isDemo) {
      toast.error("Export is disabled in demo mode. Sign up to export data!")
      return
    }
    exportClaimsToCSV(filteredClaims, projectName)
    toast.success("Claims exported to CSV!")
    setShowExportMenu(false)
  }

  const handleExportAll = () => {
    if (isDemo) {
      toast.error("Export is disabled in demo mode. Sign up to export data!")
      return
    }
    const documents = claims.flatMap(claim =>
      claim.links.map(link => link.document)
    ).filter((doc, index, self) =>
      index === self.findIndex(d => d.id === doc.id)
    )
    exportAllProjectData(projectName, filteredClaims, documents as any)
    toast.success("Complete project data exported!")
    setShowExportMenu(false)
  }

  const handleBulkApprove = async () => {
    if (selectedClaims.size === 0) {
      toast.error("No claims selected")
      return
    }

    setIsBulkProcessing(true)
    try {
      await bulkReviewClaims(Array.from(selectedClaims), 'approve')
      toast.success(`${selectedClaims.size} claims approved!`)
      setSelectedClaims(new Set())
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to bulk approve")
    } finally {
      setIsBulkProcessing(false)
    }
  }

  const handleBulkReject = async () => {
    if (selectedClaims.size === 0) {
      toast.error("No claims selected")
      return
    }

    const reason = prompt("Rejection reason:")
    if (!reason) return

    setIsBulkProcessing(true)
    try {
      await bulkReviewClaims(Array.from(selectedClaims), 'reject', { rejectionReason: reason })
      toast.success(`${selectedClaims.size} claims rejected`)
      setSelectedClaims(new Set())
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to bulk reject")
    } finally {
      setIsBulkProcessing(false)
    }
  }

  const toggleClaimSelection = (claimId: string) => {
    const newSelection = new Set(selectedClaims)
    if (newSelection.has(claimId)) {
      newSelection.delete(claimId)
    } else {
      newSelection.add(claimId)
    }
    setSelectedClaims(newSelection)
  }

  const handleClaimUpdate = () => {
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Demo Mode Banner */}
        {isDemo && (
          <div className="mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-lg shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Demo Mode - Explore PromoPack</h3>
                  <p className="text-purple-100 text-sm mb-3">
                    You&apos;re viewing a sample pharmaceutical campaign project. This demonstrates claim extraction,
                    reference linking, and compliance validation features.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="/auth"
                      className="inline-flex items-center px-4 py-2 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition text-sm"
                    >
                      Sign Up to Create Projects
                    </a>
                    <a
                      href="/pricing"
                      className="inline-flex items-center px-4 py-2 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-800 transition text-sm"
                    >
                      View Pricing
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Claims Review - {projectName}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span><strong>{stats.total}</strong> total</span>
                <span className="text-yellow-600"><strong>{stats.pending}</strong> pending</span>
                <span className="text-green-600"><strong>{stats.approved}</strong> approved</span>
                <span className="text-blue-600"><strong>{stats.edited}</strong> edited</span>
                <span className="text-red-600"><strong>{stats.rejected}</strong> rejected</span>
              </div>
            </div>
            <div className="flex gap-3">
              {/* Export Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export
                </button>
                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1">
                      <button
                        onClick={handleExportCSV}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Export Claims (CSV)
                      </button>
                      <button
                        onClick={handleExportAll}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Export All Data (CSV)
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleDownloadPDF}
                disabled={isGenerating || stats.approved === 0}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? "Generating..." : "Download PDF Pack"}
              </button>
            </div>
          </div>

          {/* Warning banner if pending claims */}
          {stats.pending > 0 && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Action Required:</strong> You have {stats.pending} claim{stats.pending > 1 ? 's' : ''} pending review.
                Review and approve claims below to include them in your PDF pack and ensure regulatory compliance.
              </p>
            </div>
          )}

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search claims..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Filter */}
            <div className="sm:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Claims ({stats.total})</option>
                <option value="pending">Pending Review ({stats.pending})</option>
                <option value="approved">Approved ({stats.approved})</option>
                <option value="edited">Edited ({stats.edited})</option>
                <option value="rejected">Rejected ({stats.rejected})</option>
              </select>
            </div>
          </div>

          {/* Bulk actions */}
          {selectedClaims.size > 0 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <span className="text-sm text-blue-800">
                <strong>{selectedClaims.size}</strong> claim{selectedClaims.size > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleBulkApprove}
                  disabled={isBulkProcessing}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  Approve All
                </button>
                <button
                  onClick={handleBulkReject}
                  disabled={isBulkProcessing}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  Reject All
                </button>
                <button
                  onClick={() => setSelectedClaims(new Set())}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Claims List */}
        <div className="space-y-6">
          {claims.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No claims extracted</h3>
              <p className="mt-1 text-sm text-gray-500">Claims will appear here after extraction.</p>
            </div>
          ) : filteredClaims.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No claims match your search</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            filteredClaims.map((claim) => (
              <div key={claim.id} className="relative">
                {/* Checkbox for bulk selection (only for pending) */}
                {claim.status === 'PENDING_REVIEW' && (
                  <div className="absolute -left-10 top-6">
                    <input
                      type="checkbox"
                      checked={selectedClaims.has(claim.id)}
                      onChange={() => toggleClaimSelection(claim.id)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                )}
                <ClaimReviewCard claim={claim} onUpdate={handleClaimUpdate} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
