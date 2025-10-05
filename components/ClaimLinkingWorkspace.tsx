"use client"

import { useState } from "react"
import { createLink, deleteLink, updateClaim } from "@/app/actions"
import { PDFViewer } from "./PDFViewer"
import toast from "react-hot-toast"

interface Claim {
  id: string
  text: string
  page: number
  links: Link[]
}

interface Document {
  id: string
  name: string
  url?: string | null | undefined
  type: string
}

interface Link {
  id: string
  claimId: string
  documentId: string
  document: Document
}

interface ClaimLinkingWorkspaceProps {
  claims: Claim[]
  documents: Document[]
  sourceDocument?: Document
}

export function ClaimLinkingWorkspace({
  claims,
  documents,
  sourceDocument
}: ClaimLinkingWorkspaceProps) {
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null)
  const [draggedClaim, setDraggedClaim] = useState<Claim | null>(null)
  const [linking, setLinking] = useState(false)
  const [draggedOverDoc, setDraggedOverDoc] = useState<string | null>(null)
  const [editingClaim, setEditingClaim] = useState<Claim | null>(null)
  const [editText, setEditText] = useState("")
  const [editPage, setEditPage] = useState(1)

  const referenceDocuments = documents.filter(doc => doc.type === "REFERENCE")

  const handleLink = async (claimId: string, documentId: string) => {
    setLinking(true)
    try {
      await createLink(claimId, documentId)
      toast.success("Claim linked successfully!")
      // The page will revalidate automatically
    } catch {
      toast.error("Failed to link claim")
    } finally {
      setLinking(false)
    }
  }

  const handleUnlink = async (linkId: string) => {
    setLinking(true)
    try {
      await deleteLink(linkId)
      toast.success("Link removed successfully!")
      // The page will revalidate automatically
    } catch {
      toast.error("Failed to remove link")
    } finally {
      setLinking(false)
    }
  }

  const handleEditClaim = (claim: Claim) => {
    setEditingClaim(claim)
    setEditText(claim.text)
    setEditPage(claim.page)
  }

  const handleSaveClaim = async () => {
    if (!editingClaim) return

    setLinking(true)
    try {
      await updateClaim(editingClaim.id, editText, editPage)
      toast.success("Claim updated successfully!")
      setEditingClaim(null)
      setEditText("")
      setEditPage(1)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update claim")
    } finally {
      setLinking(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingClaim(null)
    setEditText("")
    setEditPage(1)
  }

  const handleDrop = (e: React.DragEvent, documentId: string) => {
    e.preventDefault()
    setDraggedOverDoc(null)
    if (draggedClaim) {
      handleLink(draggedClaim.id, documentId)
      setDraggedClaim(null)
    }
  }

  const handleDragStart = (claim: Claim) => {
    setDraggedClaim(claim)
  }

  const handleDragEnd = () => {
    setDraggedClaim(null)
    setDraggedOverDoc(null)
  }

  const handleDragOver = (e: React.DragEvent, documentId: string) => {
    e.preventDefault()
    setDraggedOverDoc(documentId)
  }

  const handleDragLeave = () => {
    setDraggedOverDoc(null)
  }

  return (
    <div className="relative animate-fade-in-up">
      {linking && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl border border-gray-200">
          <div className="text-center bg-white rounded-lg p-6 shadow-lg border border-gray-200">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-pharma-blue mx-auto mb-3"></div>
            <p className="text-sm font-medium text-gray-700">Updating links...</p>
            <p className="text-xs text-gray-500 mt-1">Please wait while we process your changes</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Claims List */}
        <div className="card-professional p-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-pharma-blue to-pharma-blue-dark rounded-xl flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Medical Claims</h3>
              <p className="text-sm text-gray-600">{claims.length} claims extracted</p>
            </div>
          </div>

          {draggedClaim && (
            <div className="mb-4 p-3 bg-gradient-to-r from-pharma-blue/10 to-pharma-blue-light/10 border border-pharma-blue/20 rounded-lg animate-pulse-slow">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-pharma-blue mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                <span className="text-sm font-medium text-pharma-blue">Dragging:</span>
              </div>
              <p className="text-sm text-gray-700 mt-1 line-clamp-2">&ldquo;{draggedClaim.text.slice(0, 60)}...&rdquo;</p>
            </div>
          )}

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {claims.map((claim, index) => (
              <div
                key={claim.id}
                draggable={editingClaim?.id !== claim.id}
                onDragStart={() => editingClaim?.id !== claim.id && handleDragStart(claim)}
                onDragEnd={handleDragEnd}
                onClick={() => editingClaim?.id !== claim.id && setSelectedClaim(claim)}
                className={`group p-4 border-2 rounded-xl transition-all duration-300 ${
                  editingClaim?.id === claim.id
                    ? "border-pharma-blue bg-gradient-to-r from-pharma-blue/5 to-pharma-blue-light/5 shadow-md"
                    : selectedClaim?.id === claim.id
                    ? "border-pharma-blue bg-gradient-to-r from-pharma-blue/5 to-pharma-blue-light/5 shadow-md"
                    : draggedClaim?.id === claim.id
                    ? "border-pharma-blue/50 bg-pharma-blue/5 opacity-60 scale-95 shadow-lg"
                    : "border-gray-200 hover:border-pharma-blue/60 hover:bg-gradient-to-r hover:from-pharma-blue/5 hover:to-transparent"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {editingClaim?.id === claim.id ? (
                  // Edit mode
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Claim Text</label>
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-pharma-blue focus:border-pharma-blue"
                        rows={3}
                        placeholder="Enter claim text..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Page Number</label>
                      <input
                        type="number"
                        value={editPage}
                        onChange={(e) => setEditPage(parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-pharma-blue focus:border-pharma-blue"
                        min="1"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveClaim}
                        disabled={linking || !editText.trim()}
                        className="px-3 py-1 text-xs font-medium text-white bg-pharma-blue hover:bg-pharma-blue-dark rounded-md transition-colors disabled:opacity-50"
                      >
                        {linking ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <>
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium text-gray-900 flex-1 leading-relaxed">{claim.text}</p>
                      <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          claim.links.length > 0
                            ? 'bg-pharma-green/10 text-pharma-green border border-pharma-green/20'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {claim.links.length > 0 ? '✓' : ''} {claim.links.length}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditClaim(claim)
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-pharma-blue transition-all duration-200"
                          title="Edit claim"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Page {claim.page}
                      </span>

                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <svg className="w-4 h-4 text-pharma-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                      </div>
                    </div>

                    {claim.links.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-gray-100">
                        <p className="text-xs text-pharma-green font-medium">
                          Linked to {claim.links.length} reference{claim.links.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* PDF Viewer / Source Document */}
        <div className="card-professional p-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-pharma-green to-pharma-green-dark rounded-xl flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Source Document</h3>
              <p className="text-sm text-gray-600">Review your promotional material</p>
            </div>
          </div>

          {sourceDocument && sourceDocument.url ? (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <PDFViewer
                url={`/api/pdf/${sourceDocument.id}`}
                highlightPage={selectedClaim?.page || null}
                className="max-h-80 overflow-auto rounded border border-gray-200"
              />
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 font-medium">No source document available</p>
              <p className="text-sm text-gray-500 mt-1">Upload a document to get started</p>
            </div>
          )}
        </div>

        {/* Reference Documents */}
        <div className="card-professional p-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-pharma-slate to-pharma-slate-light rounded-xl flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Reference Documents</h3>
              <p className="text-sm text-gray-600">{referenceDocuments.length} documents available</p>
            </div>
          </div>

          {draggedClaim ? (
            <div className="mb-4 p-4 bg-gradient-to-r from-pharma-blue/10 to-pharma-blue-light/10 border-2 border-dashed border-pharma-blue/40 rounded-xl">
              <div className="flex items-center justify-center">
                <svg className="w-6 h-6 text-pharma-blue mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-pharma-blue">Drop to Link Claim</p>
                  <p className="text-xs text-pharma-blue/70">Release to create reference link</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-gray-600">Click a claim to select it, or drag and drop to link</p>
              </div>
            </div>
          )}

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {referenceDocuments.map((doc, index) => (
              <div
                key={doc.id}
                onDrop={(e) => handleDrop(e, doc.id)}
                onDragOver={(e) => handleDragOver(e, doc.id)}
                onDragLeave={handleDragLeave}
                className={`group p-4 border-2 border-dashed rounded-xl transition-all duration-300 ${
                  draggedOverDoc === doc.id
                    ? "border-pharma-green bg-gradient-to-r from-pharma-green/10 to-pharma-green-light/10 scale-105 shadow-lg"
                    : draggedClaim
                    ? "border-pharma-blue/60 bg-gradient-to-r from-pharma-blue/5 to-transparent hover:scale-102 hover:shadow-md"
                    : "border-gray-300 hover:border-pharma-blue/40 hover:bg-gradient-to-r hover:from-pharma-blue/5 hover:to-transparent"
                }`}
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm leading-relaxed">{doc.name}</p>
                    <div className="flex items-center mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pharma-green/10 text-pharma-green border border-pharma-green/20">
                        REFERENCE
                      </span>
                    </div>
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-3">
                    <svg className="w-5 h-5 text-pharma-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  {selectedClaim && (
                    <button
                      onClick={() => handleLink(selectedClaim.id, doc.id)}
                      className="text-xs bg-pharma-blue text-white px-3 py-1.5 rounded-lg hover:bg-pharma-blue-dark transition-colors duration-200 font-medium"
                    >
                      Link Claim
                    </button>
                  )}

                  {/* Show linked claims */}
                  {claims
                    .filter(claim => claim.links.some(link => link.documentId === doc.id))
                    .map(claim => (
                      <div key={claim.id} className="flex-1 ml-2">
                        <div className="bg-pharma-green/10 border border-pharma-green/20 rounded-lg p-2">
                          <p className="text-xs text-pharma-green font-medium line-clamp-2">&ldquo;{claim.text.slice(0, 40)}...&rdquo;</p>
                          <button
                            onClick={() => {
                              const link = claim.links.find(l => l.documentId === doc.id)
                              if (link) handleUnlink(link.id)
                            }}
                            className="text-xs text-red-600 hover:text-red-800 mt-1 font-medium transition-colors"
                          >
                            Remove link
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
