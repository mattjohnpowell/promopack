"use client"

import { useState, useRef } from "react"
import { generateUploadUrl, createDocument } from "@/app/actions"
import { PubMedReferenceForm } from "./PubMedReferenceForm"
import toast from "react-hot-toast"

interface FileUploadProps {
  projectId: string
}

export function FileUpload({ projectId }: FileUploadProps) {
  const [activeTab, setActiveTab] = useState<'pdf' | 'pubmed'>('pdf')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [docType, setDocType] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile || !docType) return

    setUploading(true)
    setUploadProgress(0)

    try {
      console.log("Starting upload process for file:", selectedFile.name, "type:", selectedFile.type, "projectId:", projectId)

      // Generate upload URL
      console.log("Calling generateUploadUrl...")
      setUploadProgress(10)
      const { uploadUrl, downloadUrl } = await generateUploadUrl(
        selectedFile.name,
        selectedFile.type,
        projectId
      )
      console.log("Generated URLs successfully:", { uploadUrl: uploadUrl.substring(0, 100) + "...", downloadUrl: downloadUrl.substring(0, 100) + "..." })

      // Upload file to storage
      console.log("Uploading file to storage...")
      setUploadProgress(20)
      console.log("Upload URL:", uploadUrl)
      console.log("File details:", {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type
      })

      // Use XMLHttpRequest for progress tracking
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = 20 + (event.loaded / event.total) * 60 // 20-80% for upload
            setUploadProgress(Math.round(percentComplete))
          }
        })

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve()
          } else {
            reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`))
          }
        })

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'))
        })

        xhr.open('PUT', uploadUrl)
        xhr.setRequestHeader('Content-Type', selectedFile.type)
        xhr.send(selectedFile)
      })

      console.log("File uploaded successfully, creating document record...")
      setUploadProgress(90)
      // Create document record
      console.log("Calling createDocument with:", { projectId, fileName: selectedFile.name, downloadUrl: downloadUrl.substring(0, 100) + "...", docType })
      await createDocument(projectId, selectedFile.name, downloadUrl, docType)

      console.log("Document record created successfully")
      setUploadProgress(100)
      toast.success("Document uploaded successfully!")

      // Reset form
      setSelectedFile(null)
      setDocType("")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (err) {
      console.error("Upload error:", err)
      console.error("Error details:", {
        message: err instanceof Error ? err.message : "Unknown error",
        stack: err instanceof Error ? err.stack : undefined,
        name: err instanceof Error ? err.name : undefined
      })
      toast.error(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type === "application/pdf") {
        setSelectedFile(file)
      } else {
        toast.error("Only PDF files are allowed")
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Upload Documents</h2>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('pdf')}
            className={`flex-1 py-2 px-4 text-center border-b-2 font-medium text-sm ${
              activeTab === 'pdf'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Upload PDF
          </button>
          <button
            onClick={() => setActiveTab('pubmed')}
            className={`flex-1 py-2 px-4 text-center border-b-2 font-medium text-sm ${
              activeTab === 'pubmed'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Add PubMed Reference
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'pdf' ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="hidden"
            name="projectId"
            value={projectId}
          />

          {/* Document Type Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Document Type</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select type</option>
              <option value="SOURCE">Source Document</option>
              <option value="REFERENCE">Reference Document</option>
            </select>
          </div>

          {/* Drag and Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver
                ? "border-blue-400 bg-blue-50"
                : selectedFile
                ? "border-green-400 bg-green-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            {selectedFile ? (
              <div>
                <div className="text-green-600 text-lg mb-2">✓</div>
                <p className="text-sm text-gray-600">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null)
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ""
                    }
                  }}
                  className="mt-2 text-sm text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <div className="text-gray-400 text-4xl mb-4">📄</div>
                <p className="text-gray-600 mb-2">
                  Drag and drop your PDF here, or{" "}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    browse
                  </button>
                </p>
                <p className="text-sm text-gray-500">Only PDF files are supported</p>
              </div>
            )}
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
          />

          <button
            type="submit"
            disabled={uploading || !selectedFile || !docType}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? `Uploading... ${uploadProgress}%` : "Upload Document"}
          </button>

          {uploading && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1 text-center">
                {uploadProgress < 20 ? "Preparing upload..." :
                 uploadProgress < 80 ? "Uploading file..." :
                 uploadProgress < 90 ? "Processing..." : "Finalizing..."}
              </p>
            </div>
          )}
        </form>
      ) : (
        <PubMedReferenceForm projectId={projectId} />
      )}
    </div>
  )
}