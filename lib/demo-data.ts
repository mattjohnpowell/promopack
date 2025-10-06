/**
 * Demo Mode Data
 *
 * Sample data for demo/trial users to explore PromoPack without signing up.
 * This simulates a realistic pharmaceutical promotional material workflow.
 */

export const DEMO_USER = {
  id: "demo-user-id",
  email: "demo@promopack.app",
  name: "Demo User",
}

export const DEMO_PROJECT = {
  id: "demo-project-id",
  name: "Cardio-Plus Launch Campaign Q1 2025",
  description: "New cardiovascular drug promotional materials for medical affairs review",
  createdAt: new Date("2025-01-15"),
}

export const DEMO_DOCUMENTS = [
  {
    id: "demo-doc-1",
    name: "Phase III Clinical Trial Results",
    type: "SOURCE" as const,
    url: "/demo/source-document.pdf",
    projectId: DEMO_PROJECT.id,
    title: "Efficacy and Safety of Cardio-Plus in Patients with Heart Failure: A Phase III Randomized Controlled Trial",
    authors: "Johnson ME, Smith RK, Williams TL, et al.",
    journal: "New England Journal of Medicine",
    year: 2024,
    volume: "390",
    issue: "12",
    pages: "1123-1134",
    pubmedId: "38234567",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/38234567/",
    doi: "10.1056/NEJMoa2312345",
    source: "USER_UPLOADED" as const,
    isAutoFound: false,
  },
  {
    id: "demo-doc-2",
    name: "Cardiovascular Outcomes Study",
    type: "REFERENCE" as const,
    projectId: DEMO_PROJECT.id,
    title: "Cardiovascular outcomes in patients treated with ACE inhibitors: A meta-analysis",
    authors: "Chen L, Rodriguez M, Anderson K",
    journal: "Journal of the American College of Cardiology",
    year: 2023,
    volume: "81",
    issue: "8",
    pages: "765-778",
    pubmedId: "36789012",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/36789012/",
    doi: "10.1016/j.jacc.2023.01.015",
    source: "PUBMED" as const,
    isAutoFound: true,
    confidenceScore: 0.92,
    suggestedAt: new Date("2025-01-16"),
  },
  {
    id: "demo-doc-3",
    name: "Heart Failure Guidelines 2024",
    type: "REFERENCE" as const,
    projectId: DEMO_PROJECT.id,
    title: "2024 ACC/AHA/HFSA Guideline for the Management of Heart Failure",
    authors: "Heidenreich PA, Bozkurt B, Aguilar D, et al.",
    journal: "Circulation",
    year: 2024,
    volume: "149",
    issue: "15",
    pages: "e1063-e1430",
    pubmedId: "38456789",
    pubmedUrl: "https://pubmed.ncbi.nlm.nih.gov/38456789/",
    doi: "10.1161/CIR.0000000000001209",
    source: "PUBMED" as const,
    isAutoFound: true,
    confidenceScore: 0.88,
    suggestedAt: new Date("2025-01-16"),
  },
]

export const DEMO_CLAIMS = [
  {
    id: "demo-claim-1",
    text: "Cardio-Plus reduced cardiovascular mortality by 28% compared to placebo (p<0.001)",
    page: 1,
    projectId: DEMO_PROJECT.id,
    status: "APPROVED",
    confidenceScore: 0.95,
    needsReview: false,
    auditReasoning: "Strong claim with clear statistical significance and comparison to placebo. Meets FDA substantiation requirements.",
  },
  {
    id: "demo-claim-2",
    text: "Patients experienced significant improvement in quality of life scores after 12 weeks of treatment",
    page: 2,
    projectId: DEMO_PROJECT.id,
    status: "PENDING_REVIEW",
    confidenceScore: 0.78,
    needsReview: true,
    auditReasoning: "Claim lacks specific numerical data. Recommend adding QoL score values and statistical significance for FDA compliance.",
  },
  {
    id: "demo-claim-3",
    text: "The safety profile was consistent with the known ACE inhibitor class effects",
    page: 3,
    projectId: DEMO_PROJECT.id,
    status: "APPROVED",
    confidenceScore: 0.92,
    needsReview: false,
    auditReasoning: "Acceptable safety claim that appropriately references drug class. Complies with fair balance requirements.",
  },
  {
    id: "demo-claim-4",
    text: "Cardio-Plus is the most effective treatment for heart failure available today",
    page: 4,
    projectId: DEMO_PROJECT.id,
    status: "PENDING_REVIEW",
    confidenceScore: 0.45,
    needsReview: true,
    auditReasoning: "REGULATORY RISK: Superlative claim without head-to-head comparison data. Not permitted by FDA OPDP guidelines. Requires substantiation or removal.",
  },
]

export const DEMO_LINKS = [
  {
    id: "demo-link-1",
    claimId: "demo-claim-1",
    documentId: "demo-doc-1",
  },
  {
    id: "demo-link-2",
    claimId: "demo-claim-1",
    documentId: "demo-doc-2",
  },
  {
    id: "demo-link-3",
    claimId: "demo-claim-3",
    documentId: "demo-doc-2",
  },
  {
    id: "demo-link-4",
    claimId: "demo-claim-3",
    documentId: "demo-doc-3",
  },
]

/**
 * Get all demo data
 */
export function getDemoData() {
  return {
    user: DEMO_USER,
    project: DEMO_PROJECT,
    documents: DEMO_DOCUMENTS,
    claims: DEMO_CLAIMS,
    links: DEMO_LINKS,
  }
}

/**
 * Check if a user/project ID is a demo entity
 */
export function isDemoMode(id: string): boolean {
  return id.startsWith("demo-")
}

/**
 * Get demo project with all related data
 */
export function getDemoProject() {
  return {
    ...DEMO_PROJECT,
    documents: DEMO_DOCUMENTS,
    claims: DEMO_CLAIMS.map(claim => ({
      ...claim,
      links: DEMO_LINKS.filter(link => link.claimId === claim.id).map(link => ({
        ...link,
        document: DEMO_DOCUMENTS.find(doc => doc.id === link.documentId)!,
      })),
    })),
  }
}
