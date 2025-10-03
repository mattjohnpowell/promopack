"use client"

import { useState } from "react"
import { generatePack } from "@/app/actions"
import toast from "react-hot-toast"

type Claim = {
  id: string
  text: string
  page: number
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
}

export function ClaimsPageContent({ projectId, claims, projectName }: ClaimsPageContentProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownloadPDF = async () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Claims for {projectName}</h1>
              <p className="text-lg text-gray-600">
                {claims.length} claims extracted
              </p>
            </div>
            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating PDF...
                </>
              ) : (
                <>
                  <svg className="-ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF Pack
                </>
              )}
            </button>
          </div>
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
          ) : (
            claims.map((claim, index) => {
              const confidenceScore = claim.confidenceScore
              const needsReview = claim.needsReview
              const hasLinks = claim.links.length > 0

              // Determine confidence badge color and text
              const getConfidenceBadge = () => {
                if (!hasLinks || confidenceScore === null || confidenceScore === undefined) {
                  return null
                }

                let bgColor, textColor, label
                if (confidenceScore >= 0.7) {
                  bgColor = 'bg-green-100'
                  textColor = 'text-green-800'
                  label = '✓ High Confidence'
                } else if (confidenceScore >= 0.5) {
                  bgColor = 'bg-yellow-100'
                  textColor = 'text-yellow-800'
                  label = '⚠ Medium Confidence'
                } else {
                  bgColor = 'bg-orange-100'
                  textColor = 'text-orange-800'
                  label = '⚠ Low Confidence'
                }

                return (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
                    {label} ({(confidenceScore * 100).toFixed(0)}%)
                  </span>
                )
              }

              return (
                <div key={claim.id} className={`bg-white rounded-lg shadow-sm border p-6 ${needsReview ? 'border-orange-300 bg-orange-50/30' : 'border-gray-200'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center flex-wrap gap-2 mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Page {claim.page}
                        </span>
                        <span className="text-sm text-gray-500">
                          Claim #{index + 1}
                        </span>
                        {getConfidenceBadge()}
                        {needsReview && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Needs Review
                          </span>
                        )}
                      </div>
                      <p className="text-gray-900 text-lg leading-relaxed mb-4">
                        {claim.text}
                      </p>

                      {/* Confidence reasoning */}
                      {claim.auditReasoning && hasLinks && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                          <p className="text-xs font-medium text-blue-900 mb-1">Link Quality Assessment:</p>
                          <p className="text-sm text-blue-800">{claim.auditReasoning}</p>
                        </div>
                      )}

                      {/* Linked references */}
                      {hasLinks ? (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Linked References:</h4>
                          <div className="flex flex-wrap gap-2">
                            {claim.links.map((link) => (
                              <span
                                key={link.id}
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                              >
                                {link.document.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-sm font-medium text-red-800 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            No references linked - PMCPA compliance requires substantiation
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}