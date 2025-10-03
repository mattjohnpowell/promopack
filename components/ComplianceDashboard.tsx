"use client"

import { useState } from "react"
import { runComplianceCheck } from "@/app/actions"
import toast from "react-hot-toast"

interface ComplianceIssue {
  type: 'error' | 'warning' | 'info'
  category: string
  message: string
  matched: string
  suggestion?: string
}

interface ComplianceResult {
  claimId: string
  claimText: string
  issues: ComplianceIssue[]
  riskLevel: 'high' | 'medium' | 'low' | 'compliant'
  complianceScore: number
}

interface ComplianceSummary {
  totalClaims: number
  compliantClaims: number
  highRiskClaims: number
  mediumRiskClaims: number
  lowRiskClaims: number
  averageComplianceScore: number
  totalIssues: number
  criticalIssues: number
}

interface ComplianceDashboardProps {
  projectId: string
  hasClaims: boolean
}

export function ComplianceDashboard({ projectId, hasClaims }: ComplianceDashboardProps) {
  const [isChecking, setIsChecking] = useState(false)
  const [results, setResults] = useState<ComplianceResult[] | null>(null)
  const [summary, setSummary] = useState<ComplianceSummary | null>(null)
  const [expandedClaim, setExpandedClaim] = useState<string | null>(null)

  const handleRunCheck = async () => {
    setIsChecking(true)
    try {
      const response = await runComplianceCheck(projectId)
      setResults(response.results)
      setSummary(response.summary)
      toast.success(`Compliance check complete: ${response.summary.averageComplianceScore}% average score`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to run compliance check")
    } finally {
      setIsChecking(false)
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'compliant': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error':
        return (
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )
      case 'warning':
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Regulatory Compliance Check</h3>
          <p className="text-sm text-gray-600 mt-1">
            Scan claims for PMCPA/FDA red flags and risky language
          </p>
        </div>
        <button
          onClick={handleRunCheck}
          disabled={!hasClaims || isChecking}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isChecking ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Checking...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Run Compliance Check
            </>
          )}
        </button>
      </div>

      {/* Summary */}
      {summary && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(summary.averageComplianceScore)}`}>
                {summary.averageComplianceScore}%
              </div>
              <div className="text-sm text-gray-600 mt-1">Average Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{summary.compliantClaims}</div>
              <div className="text-sm text-gray-600 mt-1">Compliant</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{summary.highRiskClaims}</div>
              <div className="text-sm text-gray-600 mt-1">High Risk</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{summary.criticalIssues}</div>
              <div className="text-sm text-gray-600 mt-1">Critical Issues</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {summary.totalClaims} total claims • {summary.totalIssues} total issues found
            </div>
            {summary.highRiskClaims > 0 && (
              <div className="text-sm font-medium text-red-600">
                ⚠ {summary.highRiskClaims} claim{summary.highRiskClaims !== 1 ? 's' : ''} require immediate attention
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results */}
      {results && results.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Detailed Results</h4>

          {results.map((result, index) => (
            <div
              key={result.claimId}
              className={`border rounded-lg overflow-hidden ${getRiskColor(result.riskLevel)}`}
            >
              <button
                onClick={() => setExpandedClaim(expandedClaim === result.claimId ? null : result.claimId)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-black/5"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium">Claim #{index + 1}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-white/50">
                      {result.riskLevel.toUpperCase()}
                    </span>
                    <span className={`text-sm font-semibold ${getScoreColor(result.complianceScore)}`}>
                      {result.complianceScore}%
                    </span>
                    {result.issues.length > 0 && (
                      <span className="text-sm">
                        {result.issues.filter(i => i.type === 'error').length} errors,{' '}
                        {result.issues.filter(i => i.type === 'warning').length} warnings
                      </span>
                    )}
                  </div>
                  <p className="text-sm line-clamp-2">{result.claimText}</p>
                </div>
                <svg
                  className={`w-5 h-5 transition-transform ${expandedClaim === result.claimId ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {expandedClaim === result.claimId && (
                <div className="p-4 bg-white border-t border-current/20">
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Full Claim:</p>
                    <p className="text-sm text-gray-900">{result.claimText}</p>
                  </div>

                  {result.issues.length > 0 ? (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-gray-700">Issues Found:</p>
                      {result.issues.map((issue, idx) => (
                        <div key={idx} className="flex gap-3 p-3 bg-gray-50 rounded-md">
                          {getIssueIcon(issue.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-gray-900">{issue.category}</span>
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-700">
                                {issue.type}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mb-1">
                              Matched: <code className="bg-gray-200 px-1 rounded">{issue.matched}</code>
                            </p>
                            <p className="text-sm text-gray-600">{issue.message}</p>
                            {issue.suggestion && (
                              <p className="text-sm text-blue-600 mt-2">
                                💡 {issue.suggestion}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 bg-green-50 rounded-md text-center">
                      <p className="text-sm text-green-800 font-medium">✓ No compliance issues detected</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!hasClaims && (
        <div className="text-center py-8 text-gray-500">
          <p>Extract claims from your source document first</p>
        </div>
      )}
    </div>
  )
}
