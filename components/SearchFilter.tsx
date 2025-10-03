"use client"

import { useState } from 'react'

interface SearchFilterProps {
  onSearch: (query: string) => void
  onFilter: (filters: FilterOptions) => void
  placeholder?: string
  showFilters?: boolean
}

export interface FilterOptions {
  type?: string
  status?: string
  dateRange?: {
    start: Date
    end: Date
  }
}

export function SearchFilter({
  onSearch,
  onFilter,
  placeholder = "Search...",
  showFilters = true
}: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterOptions>({})
  const [showFilterPanel, setShowFilterPanel] = useState(false)

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onSearch(value)
  }

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFilter(updatedFilters)
  }

  const clearFilters = () => {
    setFilters({})
    onFilter({})
  }

  const hasActiveFilters = Object.keys(filters).length > 0

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center space-x-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-pharma-gray-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={placeholder}
            className="form-professional pl-10 pr-4 py-2 w-full"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg className="h-4 w-4 text-pharma-gray-light hover:text-pharma-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {showFilters && (
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`flex items-center px-3 py-2 rounded-lg border transition-colors ${
              showFilterPanel || hasActiveFilters
                ? 'border-pharma-blue bg-pharma-blue/5 text-pharma-blue'
                : 'border-pharma-gray-light hover:border-pharma-blue text-pharma-gray'
            }`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
            {hasActiveFilters && (
              <span className="ml-2 bg-pharma-blue text-white text-xs rounded-full px-2 py-0.5">
                {Object.keys(filters).length}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilterPanel && showFilters && (
        <div className="card-professional p-4 animate-fade-in-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Type
              </label>
              <select
                value={filters.type || ''}
                onChange={(e) => handleFilterChange({ type: e.target.value || undefined })}
                className="form-professional w-full"
              >
                <option value="">All Types</option>
                <option value="SOURCE">Source Documents</option>
                <option value="REFERENCE">Reference Documents</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange({ status: e.target.value || undefined })}
                className="form-professional w-full"
              >
                <option value="">All Status</option>
                <option value="linked">Linked</option>
                <option value="unlinked">Unlinked</option>
                <option value="verified">Verified</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={filters.dateRange?.start?.toISOString().split('T')[0] || ''}
                  onChange={(e) => {
                    const start = e.target.value ? new Date(e.target.value) : undefined
                    handleFilterChange({
                      dateRange: {
                        start: start || new Date(),
                        end: filters.dateRange?.end || new Date()
                      }
                    })
                  }}
                  className="form-professional flex-1"
                />
                <input
                  type="date"
                  value={filters.dateRange?.end?.toISOString().split('T')[0] || ''}
                  onChange={(e) => {
                    const end = e.target.value ? new Date(e.target.value) : undefined
                    handleFilterChange({
                      dateRange: {
                        start: filters.dateRange?.start || new Date(),
                        end: end || new Date()
                      }
                    })
                  }}
                  className="form-professional flex-1"
                />
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="text-pharma-gray hover:text-pharma-blue transition-colors text-sm font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}