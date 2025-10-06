"use client"

import { useState, useMemo } from "react"
import { exportDocumentsToCSV } from "@/lib/export-utils"
import { deleteDocument } from "@/app/actions"
import toast from "react-hot-toast"

type Document = {
  id: string
  name: string
  type: string
  title?: string | null
  authors?: string | null
  journal?: string | null
  year?: number | null
  volume?: string | null
  issue?: string | null
  pages?: string | null
  doi?: string | null
  pubmedId?: string | null
  source?: string
  confidenceScore?: number | null
  isAutoFound?: boolean
}

interface DocumentListProps {
  documents: Document[]
  projectName: string
  onDocumentClick?: (doc: Document) => void
  onDocumentDeleted?: () => void
  showSearch?: boolean
  showExport?: boolean
  isDemo?: boolean
  allowDelete?: boolean
}

export function DocumentList({
  documents,
  projectName,
  onDocumentClick,
  onDocumentDeleted,
  showSearch = true,
  showExport = true,
  isDemo = false,
  allowDelete = true
}: DocumentListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "source" | "reference">("all")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Filter and search documents
  const filteredDocuments = useMemo(() => {
    let filtered = documents

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(query) ||
        doc.title?.toLowerCase().includes(query) ||
        doc.authors?.toLowerCase().includes(query) ||
        doc.journal?.toLowerCase().includes(query)
      )
    }

    // Apply type filter
    if (filterType === "source") {
      filtered = filtered.filter(doc => doc.type === "SOURCE")
    } else if (filterType === "reference") {
      filtered = filtered.filter(doc => doc.type === "REFERENCE")
    }

    return filtered
  }, [documents, searchQuery, filterType])

  const handleExport = () => {
    if (isDemo) {
      toast.error("Export is disabled in demo mode. Sign up to export data!")
      return
    }
    exportDocumentsToCSV(filteredDocuments, projectName)
    toast.success("Documents exported to CSV!")
  }

  const handleDelete = async (doc: Document, e: React.MouseEvent) => {
    e.stopPropagation()

    if (isDemo) {
      toast.error("Delete is disabled in demo mode. Sign up to manage documents!")
      return
    }

    const isSourceDoc = doc.type === "SOURCE"
    const confirmMessage = isSourceDoc
      ? `Delete "${doc.title || doc.name}"? This will also delete all extracted claims from this project.`
      : `Delete "${doc.title || doc.name}"?`

    if (!confirm(confirmMessage)) {
      return
    }

    setDeletingId(doc.id)
    try {
      const result = await deleteDocument(doc.id)

      if (result.deletedClaims) {
        toast.success("Document and all claims deleted successfully")
      } else {
        toast.success("Document deleted successfully")
      }

      onDocumentDeleted?.()
    } catch (error) {
      console.error("Error deleting document:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete document")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      {showSearch && documents.length > 0 && (
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
                placeholder="Search documents..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Filter */}
          <div className="sm:w-48">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as "all" | "source" | "reference")}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">All Documents</option>
              <option value="source">Source Documents</option>
              <option value="reference">References</option>
            </select>
          </div>

          {/* Export Button */}
          {showExport && (
            <button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </button>
          )}
        </div>
      )}

      {/* Results Count */}
      {showSearch && documents.length > 0 && (
        <div className="text-sm text-gray-500">
          Showing {filteredDocuments.length} of {documents.length} documents
          {searchQuery || filterType !== "all" ? " (filtered)" : ""}
        </div>
      )}

      {/* Document List */}
      {filteredDocuments.length === 0 ? (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {documents.length === 0 ? "No documents" : "No documents match your search"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {documents.length === 0 ? "Upload documents to get started." : "Try adjusting your search or filter criteria."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onDocumentClick?.(doc)}
              className={`bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition ${
                onDocumentClick ? "cursor-pointer" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      doc.type === "SOURCE" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                    }`}>
                      {doc.type === "SOURCE" ? "Source" : "Reference"}
                    </span>
                    {doc.isAutoFound && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        Auto-found
                      </span>
                    )}
                    {doc.confidenceScore && (
                      <span className="text-xs text-gray-500">
                        {(doc.confidenceScore * 100).toFixed(0)}% match
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {doc.title || doc.name}
                  </h3>
                  {doc.authors && (
                    <p className="text-xs text-gray-600 mt-1">{doc.authors}</p>
                  )}
                  {doc.journal && (
                    <p className="text-xs text-gray-500 mt-1">
                      {doc.journal}
                      {doc.year && ` (${doc.year})`}
                      {doc.volume && `, Vol. ${doc.volume}`}
                      {doc.issue && `, Issue ${doc.issue}`}
                      {doc.pages && `, pp. ${doc.pages}`}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    {doc.pubmedId && (
                      <a
                        href={`https://pubmed.ncbi.nlm.nih.gov/${doc.pubmedId}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        PubMed
                      </a>
                    )}
                    {doc.doi && (
                      <a
                        href={`https://doi.org/${doc.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        DOI
                      </a>
                    )}
                  </div>
                </div>
                {/* Delete button */}
                {allowDelete && !isDemo && (
                  <button
                    onClick={(e) => handleDelete(doc, e)}
                    disabled={deletingId === doc.id}
                    className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                    title={doc.type === "SOURCE" ? "Delete document (will delete all claims)" : "Delete document"}
                  >
                    {deletingId === doc.id ? (
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
