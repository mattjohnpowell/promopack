"use client"

import { useMemo } from "react"
import { calculateUsageMetrics, calculateROIMetrics, getActivitySummary } from "@/lib/analytics"

type User = {
  id: string
  name?: string | null
  email?: string | null
  projects: Array<{
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
    claims: Array<{
      id: string
      needsReview?: boolean
    }>
    documents: Array<{
      id: string
      type: string
      isAutoFound?: boolean
    }>
  }>
}

interface AnalyticsContentProps {
  user: User
}

export function AnalyticsContent({ user }: AnalyticsContentProps) {
  const metrics = useMemo(() => calculateUsageMetrics(user.projects), [user.projects])
  const roiMetrics = useMemo(() => calculateROIMetrics(metrics), [metrics])
  const weeklyActivity = useMemo(() => getActivitySummary(user.projects, 7), [user.projects])
  const monthlyActivity = useMemo(() => getActivitySummary(user.projects, 30), [user.projects])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-lg text-gray-600">
            Track your usage, productivity, and ROI metrics
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Projects */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Projects</span>
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900">{metrics.totalProjects}</div>
            <div className="text-xs text-gray-500 mt-1">
              {metrics.projectsThisMonth} this month
            </div>
          </div>

          {/* Total Claims */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Claims</span>
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900">{metrics.totalClaims}</div>
            <div className="text-xs text-gray-500 mt-1">
              {metrics.avgClaimsPerProject.toFixed(1)} avg per project
            </div>
          </div>

          {/* Total References */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">References</span>
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900">{metrics.totalDocuments}</div>
            <div className="text-xs text-gray-500 mt-1">
              {metrics.autoFoundReferences} auto-found
            </div>
          </div>

          {/* Compliance Rate */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Compliance Rate</span>
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900">{metrics.complianceRate.toFixed(1)}%</div>
            <div className="text-xs text-gray-500 mt-1">
              {metrics.claimsNeedingReview} need review
            </div>
          </div>
        </div>

        {/* ROI Metrics */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg shadow-lg p-8 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-6">Return on Investment</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm opacity-90 mb-1">Time Saved</div>
              <div className="text-3xl font-bold">{roiMetrics.estimatedTimeSaved.toFixed(0)} hrs</div>
              <div className="text-xs opacity-75 mt-1">Across all projects</div>
            </div>
            <div>
              <div className="text-sm opacity-90 mb-1">Cost Savings</div>
              <div className="text-3xl font-bold">${roiMetrics.estimatedCostSaved.toLocaleString()}</div>
              <div className="text-xs opacity-75 mt-1">Based on $75/hr rate</div>
            </div>
            <div>
              <div className="text-sm opacity-90 mb-1">Efficiency Gain</div>
              <div className="text-3xl font-bold">{roiMetrics.efficiencyGain.toFixed(0)}%</div>
              <div className="text-xs opacity-75 mt-1">Faster than manual process</div>
            </div>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* This Week */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New Projects</span>
                <span className="text-2xl font-bold text-gray-900">{weeklyActivity.newProjects}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Claims Extracted</span>
                <span className="text-2xl font-bold text-gray-900">{weeklyActivity.totalClaims}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">References Added</span>
                <span className="text-2xl font-bold text-gray-900">{weeklyActivity.totalDocuments}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Review Rate</span>
                <span className="text-2xl font-bold text-green-600">{weeklyActivity.reviewRate.toFixed(0)}%</span>
              </div>
            </div>
          </div>

          {/* This Month */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New Projects</span>
                <span className="text-2xl font-bold text-gray-900">{monthlyActivity.newProjects}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Claims Extracted</span>
                <span className="text-2xl font-bold text-gray-900">{monthlyActivity.totalClaims}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">References Added</span>
                <span className="text-2xl font-bold text-gray-900">{monthlyActivity.totalDocuments}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Review Rate</span>
                <span className="text-2xl font-bold text-green-600">{monthlyActivity.reviewRate.toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Chart (Simple Bar Chart) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Over Time (Last 30 Days)</h3>
          <div className="space-y-3">
            {metrics.timeSeriesData.slice(-14).map((day, idx) => {
              const maxProjects = Math.max(...metrics.timeSeriesData.map(d => d.projects), 1)
              const percentage = (day.projects / maxProjects) * 100
              const date = new Date(day.date)
              const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

              return (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-xs text-gray-600 w-16">{dateStr}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                    {day.projects > 0 && (
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                        {day.projects} {day.projects === 1 ? 'project' : 'projects'}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {metrics.avgClaimsPerProject.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Average Claims per Project</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {metrics.avgDocumentsPerProject.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Average References per Project</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {metrics.autoFoundReferences > 0
                  ? ((metrics.autoFoundReferences / metrics.totalDocuments) * 100).toFixed(0)
                  : 0}%
              </div>
              <div className="text-sm text-gray-600">Auto-Found References</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
