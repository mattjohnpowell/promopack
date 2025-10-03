// Project templates for common pharmaceutical promotional content
export interface ProjectTemplate {
  id: string
  name: string
  description: string
  category: string
  estimatedClaims: number
  recommendedDocuments: string[]
  color: string
  icon: string
}

export const projectTemplates: ProjectTemplate[] = [
  {
    id: "oncology-brochure",
    name: "Oncology Product Brochure",
    description: "Complete template for oncology drug promotional materials with clinical data validation",
    category: "Oncology",
    estimatedClaims: 15,
    recommendedDocuments: [
      "Product prescribing information",
      "Key clinical trial publications",
      "NCCN guidelines",
      "FDA approval documents"
    ],
    color: "bg-red-100 text-red-800",
    icon: "🩺"
  },
  {
    id: "cardiovascular-guidelines",
    name: "Cardiovascular Treatment Guidelines",
    description: "Template for cardiovascular disease management and treatment guidelines",
    category: "Cardiology",
    estimatedClaims: 12,
    recommendedDocuments: [
      "ACC/AHA guidelines",
      "Major clinical outcome trials",
      "Meta-analyses and reviews",
      "Regulatory approvals"
    ],
    color: "bg-blue-100 text-blue-800",
    icon: "❤️"
  },
  {
    id: "diabetes-management",
    name: "Diabetes Management Protocol",
    description: "Comprehensive template for diabetes treatment and management materials",
    category: "Endocrinology",
    estimatedClaims: 18,
    recommendedDocuments: [
      "ADA treatment guidelines",
      "AACE/ACE algorithms",
      "Key clinical trials (DPP-4, SGLT2, GLP-1)",
      "Comparative effectiveness studies"
    ],
    color: "bg-green-100 text-green-800",
    icon: "🩸"
  },
  {
    id: "neurology-therapy",
    name: "Neurology Therapy Overview",
    description: "Template for neurological disorder treatments and clinical evidence",
    category: "Neurology",
    estimatedClaims: 14,
    recommendedDocuments: [
      "AAN practice guidelines",
      "Phase III clinical trials",
      "Real-world evidence studies",
      "Comparative safety data"
    ],
    color: "bg-purple-100 text-purple-800",
    icon: "🧠"
  },
  {
    id: "infectious-disease",
    name: "Infectious Disease Treatment",
    description: "Template for antibiotic and antiviral treatment promotional materials",
    category: "Infectious Disease",
    estimatedClaims: 16,
    recommendedDocuments: [
      "IDSA treatment guidelines",
      "Antimicrobial susceptibility data",
      "Clinical trial results",
      "Resistance pattern studies"
    ],
    color: "bg-yellow-100 text-yellow-800",
    icon: "🦠"
  },
  {
    id: "respiratory-care",
    name: "Respiratory Care Solutions",
    description: "Template for asthma, COPD, and other respiratory condition treatments",
    category: "Pulmonology",
    estimatedClaims: 13,
    recommendedDocuments: [
      "GINA guidelines",
      "GOLD criteria",
      "Pivotal clinical trials",
      "Real-world effectiveness data"
    ],
    color: "bg-cyan-100 text-cyan-800",
    icon: "🫁"
  }
]

export function getTemplateById(id: string) {
  return projectTemplates.find(template => template.id === id)
}

export function getTemplatesByCategory(category: string) {
  return projectTemplates.filter(template => template.category === category)
}

export function getAllCategories() {
  return [...new Set(projectTemplates.map(template => template.category))]
}