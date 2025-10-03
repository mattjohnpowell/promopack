"use client"

import { useState } from "react"
import { projectTemplates, getAllCategories, ProjectTemplate } from "@/utils/templates"

interface ProjectTemplatesProps {
  onSelectTemplate: (template: ProjectTemplate) => void
  isCreating?: boolean
}

export function ProjectTemplates({ onSelectTemplate, isCreating = false }: ProjectTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const categories = ["All", ...getAllCategories()]

  const filteredTemplates = selectedCategory === "All"
    ? projectTemplates
    : projectTemplates.filter(template => template.category === selectedCategory)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Project Templates</h3>
          <p className="text-sm text-gray-600">Start with a pre-configured template for your therapeutic area</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="card-professional p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
            onClick={() => !isCreating && onSelectTemplate(template)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{template.icon}</span>
                <div>
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {template.name}
                  </h4>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${template.color} mt-1`}>
                    {template.category}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {template.description}
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Estimated Claims:</span>
                <span className="font-medium text-gray-900">{template.estimatedClaims}</span>
              </div>

              <div className="border-t pt-3">
                <p className="text-xs font-medium text-gray-700 mb-2">Recommended Documents:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  {template.recommendedDocuments.slice(0, 3).map((doc, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {doc}
                    </li>
                  ))}
                  {template.recommendedDocuments.length > 3 && (
                    <li className="text-gray-500">
                      +{template.recommendedDocuments.length - 3} more...
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <button
              className="btn-primary w-full mt-4 group-hover:bg-blue-700 transition-colors"
              disabled={isCreating}
              onClick={(e) => {
                e.stopPropagation()
                onSelectTemplate(template)
              }}
            >
              {isCreating ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </div>
              ) : (
                "Use This Template"
              )}
            </button>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <p className="text-gray-600">No templates found for this category</p>
        </div>
      )}
    </div>
  )
}