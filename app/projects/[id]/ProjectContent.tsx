"use client"

import { useMemo, useState } from "react"
import dynamic from "next/dynamic"
import { FileUpload } from "@/components/FileUpload"
import { WorkflowProgress } from "@/components/WorkflowProgress"

// Dynamically import ClaimLinkingWorkspace to avoid SSR issues with PDF.js
const ClaimLinkingWorkspace = dynamic(
  () => import("@/components/ClaimLinkingWorkspace").then(mod => ({ default: mod.ClaimLinkingWorkspace })),
  { ssr: false, loading: () => <div className="flex justify-center p-8">Loading workspace...</div> }
)

// Dynamically import GeneratePack to avoid SSR issues with document API
const GeneratePack = dynamic(
  () => import("@/components/GeneratePack").then(mod => ({ default: mod.GeneratePack })),
  { ssr: false, loading: () => <div className="flex justify-center p-4">Loading...</div> }
)

// Dynamically import ExtractClaimsButton to avoid SSR issues with document API
const ExtractClaimsButton = dynamic(
  () => import("./ExtractClaimsButton").then(mod => ({ default: mod.ExtractClaimsButton })),
  { ssr: false, loading: () => <div className="flex justify-center p-4">Loading...</div> }
)

// Dynamically import SuggestedReferencesPanel
const SuggestedReferencesPanel = dynamic(
  () => import("./SuggestedReferencesPanel").then(mod => ({ default: mod.SuggestedReferencesPanel })),
  { ssr: false, loading: () => <div className="flex justify-center p-4">Loading suggestions...</div> }
)

// Dynamically import ComplianceDashboard
const ComplianceDashboard = dynamic(
  () => import("@/components/ComplianceDashboard").then(mod => ({ default: mod.ComplianceDashboard })),
  { ssr: false, loading: () => <div className="flex justify-center p-4">Loading...</div> }
)

// Dynamically import FindReferencesButton
const FindReferencesButton = dynamic(
  () => import("./FindReferencesButton").then(mod => ({ default: mod.FindReferencesButton })),
  { ssr: false, loading: () => <div className="flex justify-center p-4">Loading...</div> }
)

// Dynamically import DeleteDocumentButton
const DeleteDocumentButton = dynamic(
  () => import("@/components/DeleteDocumentButton").then(mod => ({ default: mod.DeleteDocumentButton })),
  { ssr: false, loading: () => null }
)

type ProjectData = {
  id: string
  name: string
  createdAt: Date
  documents: Array<{
    id: string
    name: string
    type: string
    url?: string | null
    createdAt?: Date
    // PubMed fields
    pubmedId?: string | null
    doi?: string | null
    title?: string | null
    authors?: string | null
    journal?: string | null
    year?: number | null
    volume?: string | null
    issue?: string | null
    pages?: string | null
    abstract?: string | null
    pubmedUrl?: string | null
    // Auto-find tracking
    source?: string
    isAutoFound?: boolean
    autoFoundForClaimId?: string | null
    suggestedAt?: Date | null
    acceptedAt?: Date | null
    confidenceScore?: number | null
  }>
  claims: Array<{
    id: string
    text: string
    page: number
    confidenceScore?: number | null
    auditReasoning?: string | null
    needsReview?: boolean
    links: Array<{
      id: string
      claimId: string
      documentId: string
      document: {
        id: string
        name: string
        type: string
        url: string | null
      }
    }>
  }>
}

interface ProjectContentProps {
  project: ProjectData
  isDemo: boolean
}

export function ProjectContent({ project, isDemo }: ProjectContentProps) {
  // Separate suggested and accepted references
  const suggestedReferences = useMemo(() => {
    return project.documents.filter(
      doc => doc.type === 'REFERENCE' && doc.isAutoFound && !doc.acceptedAt
    )
  }, [project.documents])

  const acceptedReferences = useMemo(() => {
    return project.documents.filter(
      doc => doc.type === 'REFERENCE' && (!doc.isAutoFound || doc.acceptedAt)
    )
  }, [project.documents])

  // Create a map of claim IDs to claim text for the suggested references panel
  const claimsMap = useMemo(() => {
    const map = new Map<string, string>()
    project.claims.forEach(claim => {
      map.set(claim.id, claim.text)
    })
    return map
  }, [project.claims])

  // Determine workflow step statuses
  const workflowSteps = useMemo(() => {
    const hasSourceDocument = project.documents.some(doc => doc.type === 'SOURCE')
    const hasClaims = project.claims.length > 0

    return [
      {
        id: 'upload',
        title: 'Upload Source',
        description: 'Upload your promotional material document',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        ),
        status: hasSourceDocument ? 'completed' as const : 'active' as const
      },
      {
        id: 'extract',
        title: 'Extract Claims',
        description: 'AI extracts claims and auto-finds PubMed references',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        ),
        status: hasClaims ? 'completed' as const : hasSourceDocument ? 'active' as const : 'pending' as const
      },
      {
        id: 'link',
        title: 'Link Claims to References',
        description: 'Connect each claim to substantiating reference documents for PMCPA compliance',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        ),
        status: hasClaims ? (project.claims.every(claim => claim.links.length > 0) ? 'completed' as const : 'active' as const) : 'pending' as const
      },
      {
        id: 'generate',
        title: 'Generate PMCPA Pack',
        description: 'Create compliant reference pack with all claims properly substantiated',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        status: hasClaims && project.claims.every(claim => claim.links.length > 0) ? 'completed' as const : 'pending' as const
      }
    ]
  }, [project.documents, project.claims])

  // Tab state
  const [activeTab, setActiveTab] = useState<'documents' | 'linking' | 'compliance' | 'generate'>('documents')

  // Determine which tabs are enabled
  const tabStates = useMemo(() => {
    const hasSourceDocument = project.documents.some(doc => doc.type === 'SOURCE')
    const hasClaims = project.claims.length > 0
    const allClaimsLinked = hasClaims && project.claims.every(claim => claim.links.length > 0)

    return {
      documents: true, // Always enabled
      linking: hasClaims,
      compliance: hasClaims, // Requires claims to be extracted
      generate: allClaimsLinked
    }
  }, [project.documents, project.claims])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Workflow Progress */}
        <WorkflowProgress steps={workflowSteps} />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{project.name}</h1>
              <p className="text-lg text-gray-600">
                Created {new Date(project.createdAt).toLocaleDateString()}
                {isDemo && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Demo Mode
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Workflow Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('documents')}
                className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'documents'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Documents
              </button>
              <button
                onClick={() => tabStates.linking && setActiveTab('linking')}
                disabled={!tabStates.linking}
                title={!tabStates.linking ? "Extract claims first" : ""}
                className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'linking'
                    ? 'border-blue-500 text-blue-600'
                    : tabStates.linking
                    ? 'border-transparent text-gray-500 hover:text-gray-700'
                    : 'border-transparent text-gray-300 cursor-not-allowed'
                }`}
              >
                Link Claims
                {!tabStates.linking && (
                  <svg className="inline-block w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => tabStates.compliance && setActiveTab('compliance')}
                disabled={!tabStates.compliance}
                title={!tabStates.compliance ? "Extract claims first" : ""}
                className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'compliance'
                    ? 'border-blue-500 text-blue-600'
                    : tabStates.compliance
                    ? 'border-transparent text-gray-500 hover:text-gray-700'
                    : 'border-transparent text-gray-300 cursor-not-allowed'
                }`}
              >
                Compliance
                {!tabStates.compliance && (
                  <svg className="inline-block w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => tabStates.generate && setActiveTab('generate')}
                disabled={!tabStates.generate}
                title={!tabStates.generate ? "Link all claims to references first" : ""}
                className={`flex-1 py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'generate'
                    ? 'border-blue-500 text-blue-600'
                    : tabStates.generate
                    ? 'border-transparent text-gray-500 hover:text-gray-700'
                    : 'border-transparent text-gray-300 cursor-not-allowed'
                }`}
              >
                Generate Pack
                {!tabStates.generate && (
                  <svg className="inline-block w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'documents' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents & Claims</h3>
                <p className="text-gray-600 mb-6">
                  Upload your promotional material as a SOURCE document, then extract claims. You can also add reference documents manually or let AI auto-find them from PubMed.
                </p>
                
                {/* Display uploaded documents */}
                {project.documents.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Uploaded Documents</h4>
                    
                    {/* Source Documents */}
                    {project.documents.some(doc => doc.type === 'SOURCE') && (
                      <div className="mb-6">
                        <h5 className="text-sm font-medium text-blue-700 mb-3 flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Source Document
                        </h5>
                        <div className="space-y-2">
                          {project.documents.filter(doc => doc.type === 'SOURCE').map(doc => (
                            <div key={doc.id} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <div className="flex items-center">
                                <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <div>
                                  <p className="text-sm font-medium text-blue-900">{doc.name}</p>
                                  <p className="text-xs text-blue-600">
                                    Uploaded {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'Recently'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {doc.url && (
                                  <a
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                  >
                                    View
                                  </a>
                                )}
                                {!isDemo && (
                                  <DeleteDocumentButton
                                    documentId={doc.id}
                                    documentName={doc.name}
                                    documentType="SOURCE"
                                    isDemo={isDemo}
                                  />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Reference Documents (User-uploaded & Accepted) */}
                    {acceptedReferences.length > 0 && (
                      <div className="mb-6">
                        <h5 className="text-sm font-medium text-green-700 mb-3 flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          Reference Documents ({acceptedReferences.length})
                        </h5>
                        <div className="space-y-2">
                          {acceptedReferences.map(doc => (
                            <div key={doc.id} className="flex items-start justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex-1 min-w-0">
                                {doc.pubmedId || doc.doi ? (
                                  // PubMed reference display
                                  <div>
                                    <div className="flex items-start">
                                      <svg className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                                      </svg>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-green-900 line-clamp-2">{doc.title || doc.name}</p>
                                        {doc.authors && (
                                          <p className="text-xs text-green-700 mt-1">
                                            {Array.isArray(JSON.parse(doc.authors)) ? JSON.parse(doc.authors).join(", ") : doc.authors}
                                          </p>
                                        )}
                                        {(doc.journal || doc.year) && (
                                          <p className="text-xs text-green-600 mt-1">
                                            {doc.journal && `${doc.journal}`}
                                            {doc.journal && doc.year && ", "}
                                            {doc.year}
                                            {(doc.volume || doc.issue || doc.pages) && ` ${doc.volume || ""}${doc.issue ? `(${doc.issue})` : ""}${doc.pages ? `:${doc.pages}` : ""}`}
                                          </p>
                                        )}
                                        <div className="flex items-center gap-2 mt-2">
                                          {doc.pubmedId && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                              PMID: {doc.pubmedId}
                                            </span>
                                          )}
                                          {doc.doi && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                              DOI: {doc.doi}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  // Regular PDF reference display
                                  <div className="flex items-center">
                                    <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    <div>
                                      <p className="text-sm font-medium text-green-900">{doc.name}</p>
                                      <p className="text-xs text-green-600">
                                        Uploaded {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'Recently'}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2 ml-3">
                                {doc.pubmedUrl && (
                                  <a
                                    href={doc.pubmedUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                                  >
                                    PubMed
                                  </a>
                                )}
                                {doc.url && !doc.pubmedId && (
                                  <a
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                                  >
                                    View
                                  </a>
                                )}
                                {!isDemo && (
                                  <DeleteDocumentButton
                                    documentId={doc.id}
                                    documentName={doc.title || doc.name}
                                    documentType="REFERENCE"
                                    isDemo={isDemo}
                                  />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Find References Button */}
                {!isDemo && project.claims.length > 0 && suggestedReferences.length === 0 && (
                  <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          Automatically Find References
                        </h4>
                        <p className="text-sm text-blue-800 mb-4">
                          We can automatically search PubMed for relevant references for your {project.claims.length} extracted claim{project.claims.length !== 1 ? 's' : ''}.
                          Click below to search for clinical trials, meta-analyses, and peer-reviewed studies.
                        </p>
                        <FindReferencesButton
                          projectId={project.id}
                          hasClaims={project.claims.length > 0}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Extract Claims Section */}
                {project.documents.some(doc => doc.type === 'SOURCE') && (
                  <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          {project.claims.length > 0 ? 'Claims Extracted' : 'Ready to Extract Claims'}
                        </h4>
                        {project.claims.length > 0 ? (
                          <p className="text-sm text-gray-700 mb-4">
                            {project.claims.length} claim{project.claims.length !== 1 ? 's' : ''} extracted from your source document.
                            You can re-extract if you've updated the document.
                          </p>
                        ) : (
                          <p className="text-sm text-gray-700 mb-4">
                            Use AI to automatically identify and extract claims from your source document.
                            Enable "Auto-find PubMed references" to automatically search for relevant clinical studies.
                          </p>
                        )}
                      </div>
                      <div className="ml-4">
                        <ExtractClaimsButton
                          projectId={project.id}
                          hasSourceDocument={project.documents.some(doc => doc.type === 'SOURCE')}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Suggested References Panel */}
                {!isDemo && suggestedReferences.length > 0 && (
                  <SuggestedReferencesPanel
                    projectId={project.id}
                    suggestedReferences={suggestedReferences}
                    claimsMap={claimsMap}
                  />
                )}

                <FileUpload projectId={project.id} />
              </div>
            )}

            {activeTab === 'linking' && tabStates.linking && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Link Claims to References</h3>
                <p className="text-gray-600 mb-6">
                  Connect claims to reference documents by dragging and dropping, or clicking to select and link.
                </p>
                <ClaimLinkingWorkspace
                  claims={project.claims}
                  documents={project.documents.filter(doc => doc.url) as any}
                  sourceDocument={project.documents.find(doc => doc.type === 'SOURCE' && doc.url) as any}
                />
              </div>
            )}

            {activeTab === 'compliance' && tabStates.compliance && (
              <div>
                <ComplianceDashboard
                  projectId={project.id}
                  hasClaims={project.claims.length > 0}
                />
              </div>
            )}

            {activeTab === 'generate' && tabStates.generate && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Your Pack</h3>
                <p className="text-gray-600 mb-6">
                  Create your compliant promotional material pack with all claims properly linked to references.
                </p>
                <div className="flex justify-center">
                  <GeneratePack
                    projectId={project.id}
                    hasLinks={project.claims.every(claim => claim.links.length > 0)}
                    claims={project.claims}
                  />
                </div>
              </div>
            )}

            {/* Show helpful message when tab is disabled */}
            {activeTab === 'linking' && !tabStates.linking && (
              <div className="text-center py-12">
                <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Extract Claims First</h3>
                <p className="text-gray-600 mb-4">
                  Before linking, you need to extract claims from your source document.
                </p>
                <button
                  onClick={() => setActiveTab('documents')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Go to Documents Tab
                </button>
              </div>
            )}

            {activeTab === 'compliance' && !tabStates.compliance && (
              <div className="text-center py-12">
                <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Extract Claims First</h3>
                <p className="text-gray-600 mb-4">
                  Compliance checking requires extracted claims to analyze.
                </p>
                <button
                  onClick={() => setActiveTab('documents')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Go to Documents Tab
                </button>
              </div>
            )}

            {activeTab === 'generate' && !tabStates.generate && (
              <div className="text-center py-12">
                <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Link All Claims to References</h3>
                <p className="text-gray-600 mb-4">
                  {project.claims.length === 0 ? (
                    <>You need to extract claims first before generating the pack.</>
                  ) : (
                    <>
                      {project.claims.filter(c => c.links.length === 0).length} of {project.claims.length} claims still need to be linked to reference documents for compliance.
                    </>
                  )}
                </p>
                <div className="flex flex-col items-center gap-3">
                  {project.claims.length === 0 ? (
                    <button
                      onClick={() => setActiveTab('documents')}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Go to Documents Tab
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setActiveTab('linking')}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Go to Link Claims Tab
                      </button>
                      <p className="text-sm text-gray-500">
                        All claims must be linked to substantiating references before pack generation
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>


      </div>
    </div>
  )
}





