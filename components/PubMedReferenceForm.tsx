"use client"

import { useState } from "react"
import { createPubMedReference } from "@/app/actions"
import toast from "react-hot-toast"

interface PubMedReferenceFormProps {
  projectId: string
  onSuccess?: () => void
}

export function PubMedReferenceForm({ projectId, onSuccess }: PubMedReferenceFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    pubmedId: "",
    doi: "",
    title: "",
    authors: "",
    journal: "",
    year: "",
    volume: "",
    issue: "",
    pages: "",
    abstract: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Parse authors from comma-separated string
      const authors = formData.authors
        .split(",")
        .map(author => author.trim())
        .filter(author => author.length > 0)

      await createPubMedReference(projectId, {
        pubmedId: formData.pubmedId || undefined,
        doi: formData.doi || undefined,
        title: formData.title,
        authors: authors.length > 0 ? authors : undefined,
        journal: formData.journal || undefined,
        year: formData.year ? parseInt(formData.year) : undefined,
        volume: formData.volume || undefined,
        issue: formData.issue || undefined,
        pages: formData.pages || undefined,
        abstract: formData.abstract || undefined,
      })

      toast.success("PubMed reference added successfully!")
      setFormData({
        pubmedId: "",
        doi: "",
        title: "",
        authors: "",
        journal: "",
        year: "",
        volume: "",
        issue: "",
        pages: "",
        abstract: "",
      })
      setIsOpen(false)
      onSuccess?.()
    } catch (error) {
      console.error("Error creating PubMed reference:", error)
      toast.error(error instanceof Error ? error.message : "Failed to add PubMed reference")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
      >
        Add PubMed Reference
      </button>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Add PubMed Reference</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Required fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">PMID *</label>
            <input
              type="text"
              value={formData.pubmedId}
              onChange={(e) => handleInputChange("pubmedId", e.target.value)}
              placeholder="e.g., 12345678"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">DOI</label>
            <input
              type="text"
              value={formData.doi}
              onChange={(e) => handleInputChange("doi", e.target.value)}
              placeholder="e.g., 10.1000/j.journal.2023.01.001"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Authors</label>
          <input
            type="text"
            value={formData.authors}
            onChange={(e) => handleInputChange("authors", e.target.value)}
            placeholder="Smith J, Johnson A, Brown M"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Publication details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Journal</label>
            <input
              type="text"
              value={formData.journal}
              onChange={(e) => handleInputChange("journal", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Year</label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => handleInputChange("year", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Volume</label>
            <input
              type="text"
              value={formData.volume}
              onChange={(e) => handleInputChange("volume", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Issue</label>
            <input
              type="text"
              value={formData.issue}
              onChange={(e) => handleInputChange("issue", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Pages</label>
            <input
              type="text"
              value={formData.pages}
              onChange={(e) => handleInputChange("pages", e.target.value)}
              placeholder="e.g., 123-456"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Abstract</label>
          <textarea
            value={formData.abstract}
            onChange={(e) => handleInputChange("abstract", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || !formData.title || (!formData.pubmedId && !formData.doi)}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Reference"}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}