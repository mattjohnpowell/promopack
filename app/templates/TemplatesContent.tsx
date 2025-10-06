"use client"

import { useState, useMemo } from "react"
import { PROJECT_TEMPLATES, ProjectTemplate } from "@/lib/project-templates"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export function TemplatesContent() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedComplexity, setSelectedComplexity] = useState<string>("all")
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null)

  // Filter templates
  const filteredTemplates = useMemo(() => {
    let filtered = PROJECT_TEMPLATES

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.features.some(f => f.toLowerCase().includes(query))
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(t => t.category === selectedCategory)
    }

    // Complexity filter
    if (selectedComplexity !== "all") {
      filtered = filtered.filter(t => t.complexity === selectedComplexity)
    }

    return filtered
  }, [searchQuery, selectedCategory, selectedComplexity])

  const handleUseTemplate = (template: ProjectTemplate) => {
    // In a real app, this would create a new project with the template
    // For now, we'll show a toast and redirect to create project
    toast.success(`Using template: ${template.name}`)
    router.push(`/dashboard?template=${template.id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Project Templates
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Get started quickly with pre-configured templates for common pharmaceutical materials
          </p>
          <p className="text-gray-500">
            Each template includes compliance guidance, sample claims, and recommended reference types
          </p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Templates
                </label>
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
                    placeholder="Search..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Categories</option>
                  <option value="promotional">Promotional</option>
                  <option value="medical">Medical Affairs</option>
                  <option value="regulatory">Regulatory</option>
                  <option value="educational">Educational</option>
                </select>
              </div>

              {/* Complexity Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complexity
                </label>
                <select
                  value={selectedComplexity}
                  onChange={(e) => setSelectedComplexity(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-gray-500">
              Showing {filteredTemplates.length} of {PROJECT_TEMPLATES.length} templates
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="max-w-6xl mx-auto">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No templates found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer"
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="p-6">
                    {/* Icon and Category */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-4xl">{template.icon}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        template.category === "promotional" ? "bg-blue-100 text-blue-800" :
                        template.category === "medical" ? "bg-purple-100 text-purple-800" :
                        template.category === "regulatory" ? "bg-red-100 text-red-800" :
                        "bg-green-100 text-green-800"
                      }`}>
                        {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {template.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {template.description}
                    </p>

                    {/* Metadata */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-xs text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {template.estimatedTime}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        {template.complexity.charAt(0).toUpperCase() + template.complexity.slice(1)}
                      </div>
                    </div>

                    {/* Markets */}
                    <div className="flex flex-wrap gap-1">
                      {template.targetMarkets.slice(0, 3).map((market, idx) => (
                        <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                          {market}
                        </span>
                      ))}
                      {template.targetMarkets.length > 3 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                          +{template.targetMarkets.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-lg">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleUseTemplate(template)
                      }}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Template Detail Modal */}
        {selectedTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedTemplate(null)}>
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-5xl">{selectedTemplate.icon}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedTemplate.name}</h2>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                        selectedTemplate.category === "promotional" ? "bg-blue-100 text-blue-800" :
                        selectedTemplate.category === "medical" ? "bg-purple-100 text-purple-800" :
                        selectedTemplate.category === "regulatory" ? "bg-red-100 text-red-800" :
                        "bg-green-100 text-green-800"
                      }`}>
                        {selectedTemplate.category.charAt(0).toUpperCase() + selectedTemplate.category.slice(1)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-6">{selectedTemplate.description}</p>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Estimated Time</h3>
                    <p className="text-gray-900">{selectedTemplate.estimatedTime}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Complexity</h3>
                    <p className="text-gray-900 capitalize">{selectedTemplate.complexity}</p>
                  </div>
                </div>

                {/* Target Markets */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Target Markets</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.targetMarkets.map((market, idx) => (
                      <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {market}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Key Features</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedTemplate.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-700">{feature}</li>
                    ))}
                  </ul>
                </div>

                {/* Sample Claims */}
                {selectedTemplate.sampleClaims && selectedTemplate.sampleClaims.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Sample Claims</h3>
                    <div className="space-y-2">
                      {selectedTemplate.sampleClaims.map((claim, idx) => (
                        <div key={idx} className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-gray-700">
                          {claim}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended References */}
                {selectedTemplate.recommendedReferences && selectedTemplate.recommendedReferences.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Recommended References</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedTemplate.recommendedReferences.map((ref, idx) => (
                        <li key={idx} className="text-sm text-gray-700">{ref}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Compliance Notes */}
                {selectedTemplate.complianceNotes && (
                  <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Compliance Guidance
                    </h3>
                    <p className="text-sm text-gray-700">{selectedTemplate.complianceNotes}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleUseTemplate(selectedTemplate)}
                    className="flex-1 inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Use This Template
                  </button>
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
