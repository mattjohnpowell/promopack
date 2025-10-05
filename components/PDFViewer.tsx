"use client"

import { useState, useEffect } from "react"
import { Document, Page, pdfjs } from "react-pdf"

// Configure PDF.js worker - use version bundled with react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PDFViewerProps {
  url: string
  className?: string
  highlightPage?: number | null // Page to highlight/jump to
}

export function PDFViewer({ url, className = "", highlightPage }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Jump to highlighted page when it changes
  useEffect(() => {
    if (highlightPage && highlightPage >= 1 && (!numPages || highlightPage <= numPages)) {
      setPageNumber(highlightPage)
    }
  }, [highlightPage, numPages])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setLoading(false)
    setError(null)
  }

  function onDocumentLoadError(error: Error) {
    console.error("PDF load error:", error)

    // Provide more specific error messages
    let errorMessage = "Failed to load PDF"
    if (error.message.includes("CORS")) {
      errorMessage = "PDF blocked by CORS policy"
    } else if (error.message.includes("404")) {
      errorMessage = "PDF not found or URL expired"
    } else if (error.message.includes("403")) {
      errorMessage = "Access denied to PDF"
    }

    setError(errorMessage)
    setLoading(false)
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-96 border rounded ${className}`}>
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-red-600">{error}</p>
          <p className="text-sm text-gray-500 mt-2">
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Open in browser
            </a>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`border rounded ${className}`}>
      {loading && (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading PDF...</p>
          </div>
        </div>
      )}

      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading=""
        className="flex flex-col items-center"
      >
        <div className={`relative ${pageNumber === highlightPage ? 'ring-4 ring-pharma-blue ring-offset-4 rounded-lg animate-pulse-slow' : ''}`}>
          <Page
            pageNumber={pageNumber}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="shadow-lg"
          />
          {pageNumber === highlightPage && (
            <div className="absolute top-2 right-2 bg-pharma-blue text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              Claim on this page
            </div>
          )}
        </div>
      </Document>

      {numPages && numPages > 1 && (
        <div className="flex items-center justify-between p-4 bg-gray-50 border-t">
          <button
            onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
            disabled={pageNumber <= 1}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {pageNumber} of {numPages}
          </span>

          <button
            onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
            disabled={pageNumber >= numPages}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}