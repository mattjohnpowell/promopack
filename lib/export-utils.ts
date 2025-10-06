/**
 * Export Utilities
 *
 * Functions for exporting project data to various formats (CSV, PDF reports)
 */

type Claim = {
  id: string
  text: string
  page: number
  confidenceScore?: number | null
  auditReasoning?: string | null
  needsReview?: boolean
  links?: Array<{
    document: {
      name: string
      title?: string | null
      authors?: string | null
      journal?: string | null
      year?: number | null
    }
  }>
}

type Document = {
  id: string
  name: string
  type: string
  title?: string | null
  authors?: string | null
  journal?: string | null
  year?: number | null
  volume?: string | null
  issue?: string | null
  pages?: string | null
  doi?: string | null
  pubmedId?: string | null
  source?: string
  confidenceScore?: number | null
  isAutoFound?: boolean
}

/**
 * Export claims to CSV format
 */
export function exportClaimsToCSV(claims: Claim[], projectName: string): void {
  // CSV headers
  const headers = [
    'Claim Text',
    'Page',
    'Confidence Score',
    'Needs Review',
    'Linked References',
    'Audit Reasoning'
  ]

  // Convert claims to CSV rows
  const rows = claims.map(claim => {
    const linkedRefs = claim.links?.map(link =>
      link.document.title || link.document.name
    ).join('; ') || 'None'

    return [
      escapeCSV(claim.text),
      claim.page.toString(),
      claim.confidenceScore ? (claim.confidenceScore * 100).toFixed(1) + '%' : 'N/A',
      claim.needsReview ? 'Yes' : 'No',
      escapeCSV(linkedRefs),
      escapeCSV(claim.auditReasoning || 'N/A')
    ]
  })

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')

  // Download CSV file
  downloadFile(csvContent, `${sanitizeFilename(projectName)}_claims.csv`, 'text/csv')
}

/**
 * Export documents/references to CSV format
 */
export function exportDocumentsToCSV(documents: Document[], projectName: string): void {
  // CSV headers
  const headers = [
    'Document Name',
    'Type',
    'Title',
    'Authors',
    'Journal',
    'Year',
    'Volume',
    'Issue',
    'Pages',
    'DOI',
    'PubMed ID',
    'Source',
    'Auto-Found',
    'Confidence Score'
  ]

  // Convert documents to CSV rows
  const rows = documents.map(doc => [
    escapeCSV(doc.name),
    doc.type,
    escapeCSV(doc.title || 'N/A'),
    escapeCSV(doc.authors || 'N/A'),
    escapeCSV(doc.journal || 'N/A'),
    doc.year?.toString() || 'N/A',
    doc.volume || 'N/A',
    doc.issue || 'N/A',
    doc.pages || 'N/A',
    doc.doi || 'N/A',
    doc.pubmedId || 'N/A',
    doc.source || 'N/A',
    doc.isAutoFound ? 'Yes' : 'No',
    doc.confidenceScore ? (doc.confidenceScore * 100).toFixed(1) + '%' : 'N/A'
  ])

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')

  // Download CSV file
  downloadFile(csvContent, `${sanitizeFilename(projectName)}_references.csv`, 'text/csv')
}

/**
 * Export project summary report to CSV
 */
export function exportProjectSummaryToCSV(
  projectName: string,
  claims: Claim[],
  documents: Document[]
): void {
  const totalClaims = claims.length
  const claimsNeedingReview = claims.filter(c => c.needsReview).length
  const totalReferences = documents.length
  const autoFoundRefs = documents.filter(d => d.isAutoFound).length
  const sourceDocuments = documents.filter(d => d.type === 'SOURCE').length
  const referenceDocuments = documents.filter(d => d.type === 'REFERENCE').length

  const avgConfidence = claims.reduce((sum, c) => sum + (c.confidenceScore || 0), 0) / totalClaims

  const summaryContent = [
    'Project Summary Report',
    `Project Name,${escapeCSV(projectName)}`,
    `Generated,${new Date().toLocaleString()}`,
    '',
    'Claims Statistics',
    `Total Claims,${totalClaims}`,
    `Claims Needing Review,${claimsNeedingReview}`,
    `Average Confidence Score,${(avgConfidence * 100).toFixed(1)}%`,
    '',
    'Document Statistics',
    `Total Documents,${totalReferences}`,
    `Source Documents,${sourceDocuments}`,
    `Reference Documents,${referenceDocuments}`,
    `Auto-Found References,${autoFoundRefs}`,
    `Manually Added References,${totalReferences - autoFoundRefs}`,
  ].join('\n')

  downloadFile(summaryContent, `${sanitizeFilename(projectName)}_summary.csv`, 'text/csv')
}

/**
 * Escape CSV values (handle commas, quotes, newlines)
 */
function escapeCSV(value: string): string {
  if (!value) return ''

  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }

  return value
}

/**
 * Sanitize filename for download
 */
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9_\-]/gi, '_')
    .replace(/_+/g, '_')
    .substring(0, 100)
}

/**
 * Download file to user's device
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export all project data (combined CSV)
 */
export function exportAllProjectData(
  projectName: string,
  claims: Claim[],
  documents: Document[]
): void {
  const sections = [
    '=== PROJECT SUMMARY ===',
    `Project: ${projectName}`,
    `Generated: ${new Date().toLocaleString()}`,
    `Total Claims: ${claims.length}`,
    `Total Documents: ${documents.length}`,
    '',
    '=== CLAIMS ===',
    'Claim Text,Page,Confidence Score,Needs Review,Linked References,Audit Reasoning',
    ...claims.map(claim => {
      const linkedRefs = claim.links?.map(link =>
        link.document.title || link.document.name
      ).join('; ') || 'None'

      return [
        escapeCSV(claim.text),
        claim.page.toString(),
        claim.confidenceScore ? (claim.confidenceScore * 100).toFixed(1) + '%' : 'N/A',
        claim.needsReview ? 'Yes' : 'No',
        escapeCSV(linkedRefs),
        escapeCSV(claim.auditReasoning || 'N/A')
      ].join(',')
    }),
    '',
    '=== REFERENCES ===',
    'Document Name,Type,Title,Authors,Journal,Year,Volume,Issue,Pages,DOI,PubMed ID',
    ...documents.map(doc => [
      escapeCSV(doc.name),
      doc.type,
      escapeCSV(doc.title || 'N/A'),
      escapeCSV(doc.authors || 'N/A'),
      escapeCSV(doc.journal || 'N/A'),
      doc.year?.toString() || 'N/A',
      doc.volume || 'N/A',
      doc.issue || 'N/A',
      doc.pages || 'N/A',
      doc.doi || 'N/A',
      doc.pubmedId || 'N/A'
    ].join(','))
  ].join('\n')

  downloadFile(sections, `${sanitizeFilename(projectName)}_complete_export.csv`, 'text/csv')
}
