"use client"

import { useState } from "react"
import { generatePack } from "@/app/actions"
import toast from "react-hot-toast"

interface GeneratePackProps {
  projectId: string
  hasLinks: boolean
  claims: Array<{ id: string; links: Array<unknown> }>
}

export function GeneratePack({ projectId, hasLinks, claims }: GeneratePackProps) {
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleGenerate = async () => {
    setGenerating(true)
    setProgress(0)

    // Simulate progress for pack generation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev
        return prev + Math.random() * 15
      })
    }, 600)

    try {
      const result = await generatePack(projectId)
      setProgress(100)
      clearInterval(progressInterval)

      // Create and download the PDF
      const pdfBlob = new Blob([Uint8Array.from(atob(result.pdfBytes), c => c.charCodeAt(0))], { type: 'application/pdf' })
      const url = URL.createObjectURL(pdfBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = result.fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success("Reference pack generated successfully!")
    } catch (err) {
      clearInterval(progressInterval)
      toast.error(err instanceof Error ? err.message : "Failed to generate pack")
    } finally {
      setGenerating(false)
      setProgress(0)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Generate PMCPA Reference Pack</h2>
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-blue-800">PMCPA Compliance Check</h3>
              <p className="text-sm text-blue-700 mt-1">
                All {claims.length} claims must be linked to reference documents before generating your pack.
                This ensures regulatory compliance and prevents submission rejections.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-900">Claims</p>
                <p className="text-lg font-semibold text-gray-700">{claims.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-900">Linked</p>
                <p className="text-lg font-semibold text-gray-700">{claims.filter(c => c.links.length > 0).length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleGenerate}
            disabled={generating || !hasLinks}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {generating ? `Generating... ${Math.round(progress)}%` : "Generate PMCPA Pack"}
          </button>
          {!hasLinks && (
            <div className="flex items-center text-sm text-red-600">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              All claims must be linked to references for compliance
            </div>
          )}
        </div>

        {generating && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1 text-center">
              {progress < 30 ? "Preparing documents..." :
               progress < 70 ? "Generating PDF..." :
               progress < 90 ? "Creating table of contents..." : "Finalizing pack..."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}