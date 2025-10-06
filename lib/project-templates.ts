/**
 * Project Templates for Common Pharmaceutical Materials
 *
 * Pre-configured templates to help users get started quickly with
 * common types of pharmaceutical promotional materials.
 */

export type ProjectTemplate = {
  id: string
  name: string
  description: string
  category: "promotional" | "medical" | "regulatory" | "educational"
  icon: string
  targetMarkets: string[]
  estimatedTime: string
  complexity: "beginner" | "intermediate" | "advanced"
  features: string[]
  sampleClaims?: string[]
  recommendedReferences?: string[]
  complianceNotes?: string
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: "sales-aid",
    name: "Sales Aid / Detail Aid",
    description: "Visual presentation materials for sales representatives to detail products to healthcare professionals during office visits.",
    category: "promotional",
    icon: "📊",
    targetMarkets: ["FDA (US)", "EMA (EU)", "MHRA (UK)"],
    estimatedTime: "2-3 hours",
    complexity: "beginner",
    features: [
      "Product efficacy claims",
      "Safety and tolerability data",
      "Comparative effectiveness vs. competitors",
      "Prescribing information summary",
      "Patient selection criteria"
    ],
    sampleClaims: [
      "Demonstrated superior efficacy in reducing [condition] symptoms by X% vs. placebo",
      "Well-tolerated safety profile consistent with drug class",
      "Once-daily dosing improves patient compliance"
    ],
    recommendedReferences: [
      "Phase III pivotal trial publications",
      "Meta-analyses of drug class",
      "Clinical practice guidelines"
    ],
    complianceNotes: "Must include fair balance of risks and benefits. All claims must be substantiated by accepted clinical evidence. Include abbreviated prescribing information."
  },
  {
    id: "journal-ad",
    name: "Journal Advertisement",
    description: "Print or digital advertisements for medical journals targeting healthcare professionals.",
    category: "promotional",
    icon: "📰",
    targetMarkets: ["FDA (US)", "EMA (EU)", "MHRA (UK)", "Health Canada"],
    estimatedTime: "3-4 hours",
    complexity: "intermediate",
    features: [
      "Key efficacy message (headline claim)",
      "Primary endpoint data",
      "Safety profile",
      "Full prescribing information",
      "Indication statement"
    ],
    sampleClaims: [
      "Significant reduction in primary endpoint (p<0.001)",
      "Proven efficacy across diverse patient populations",
      "Demonstrated long-term safety over 2 years"
    ],
    recommendedReferences: [
      "Pivotal clinical trial data",
      "Long-term extension studies",
      "Subgroup analyses"
    ],
    complianceNotes: "FDA requires full prescribing information (PI) in brief summary format. EMA requires abbreviated SmPC. Claims must be from approved labeling or well-controlled studies."
  },
  {
    id: "congress-booth",
    name: "Congress/Conference Booth Materials",
    description: "Promotional materials for medical conferences, symposia, and scientific meetings.",
    category: "promotional",
    icon: "🎪",
    targetMarkets: ["FDA (US)", "EMA (EU)", "MHRA (UK)", "TGA (AU)"],
    estimatedTime: "4-5 hours",
    complexity: "intermediate",
    features: [
      "Clinical data highlights",
      "Mechanism of action",
      "Real-world evidence",
      "Patient case studies",
      "Interactive elements (QR codes, digital displays)"
    ],
    sampleClaims: [
      "Novel mechanism of action targeting [pathway]",
      "Rapid onset of action within [timeframe]",
      "Sustained efficacy demonstrated in real-world setting"
    ],
    recommendedReferences: [
      "Conference abstracts and posters",
      "Real-world evidence studies",
      "Pharmacology publications"
    ],
    complianceNotes: "Materials must comply with local congress regulations. Some congresses prohibit product promotion. Check venue-specific rules."
  },
  {
    id: "disease-awareness",
    name: "Disease Awareness Campaign",
    description: "Educational materials about disease conditions (unbranded, no product promotion).",
    category: "educational",
    icon: "🎓",
    targetMarkets: ["FDA (US)", "EMA (EU)", "MHRA (UK)", "Health Canada", "TGA (AU)"],
    estimatedTime: "2-3 hours",
    complexity: "beginner",
    features: [
      "Disease epidemiology",
      "Signs and symptoms",
      "Diagnostic criteria",
      "Treatment landscape overview",
      "Patient resources"
    ],
    sampleClaims: [
      "[Disease] affects X million people worldwide",
      "Early diagnosis improves patient outcomes",
      "Multiple treatment options are available"
    ],
    recommendedReferences: [
      "Epidemiology studies",
      "Clinical practice guidelines",
      "Patient advocacy organization resources"
    ],
    complianceNotes: "Must be unbranded (no product mentions). Cannot include product-specific efficacy claims. Focus on disease education only."
  },
  {
    id: "leave-piece",
    name: "Leave Piece / Brochure",
    description: "Take-home materials left with healthcare professionals after sales visits.",
    category: "promotional",
    icon: "📄",
    targetMarkets: ["FDA (US)", "EMA (EU)", "MHRA (UK)"],
    estimatedTime: "2-3 hours",
    complexity: "beginner",
    features: [
      "Key product benefits",
      "Clinical trial results summary",
      "Dosing and administration",
      "Safety information",
      "Patient selection guidance"
    ],
    sampleClaims: [
      "Proven efficacy in [indication]",
      "Flexible dosing options for individualized treatment",
      "Established safety profile from clinical trials"
    ],
    recommendedReferences: [
      "Package insert/SmPC",
      "Phase III trial publications",
      "Safety database summaries"
    ],
    complianceNotes: "Must include fair balance and prescribing information. All claims must be substantiated. ABPI Code requires clear referencing."
  },
  {
    id: "msl-deck",
    name: "Medical Science Liaison (MSL) Deck",
    description: "Scientific presentation materials for medical affairs team to discuss clinical data with key opinion leaders.",
    category: "medical",
    icon: "🔬",
    targetMarkets: ["FDA (US)", "EMA (EU)", "MHRA (UK)", "Health Canada"],
    estimatedTime: "5-6 hours",
    complexity: "advanced",
    features: [
      "Deep dive into clinical trial data",
      "Mechanism of action details",
      "Pharmacokinetics/pharmacodynamics",
      "Subgroup analyses",
      "Ongoing clinical trial pipeline",
      "Publication strategy"
    ],
    sampleClaims: [
      "Statistically significant improvement in secondary endpoints",
      "Consistent efficacy across patient subgroups",
      "Favorable PK profile supports once-daily dosing"
    ],
    recommendedReferences: [
      "Clinical trial registry entries",
      "Published trial data",
      "Investigator's brochure",
      "Pharmacology studies"
    ],
    complianceNotes: "MSL materials are generally non-promotional. Can discuss off-label data in response to unsolicited requests. Must maintain scientific rigor."
  },
  {
    id: "payer-dossier",
    name: "Payer/Reimbursement Dossier",
    description: "Health economics and outcomes research materials for payers, formulary committees, and health technology assessment bodies.",
    category: "medical",
    icon: "💰",
    targetMarkets: ["FDA (US)", "NICE (UK)", "HAS (France)", "IQWIG (Germany)"],
    estimatedTime: "6-8 hours",
    complexity: "advanced",
    features: [
      "Cost-effectiveness analysis",
      "Budget impact model",
      "Real-world evidence",
      "Quality of life data",
      "Comparative effectiveness",
      "Clinical and economic value proposition"
    ],
    sampleClaims: [
      "Cost-effective at willingness-to-pay threshold of $X/QALY",
      "Reduces healthcare resource utilization by Y%",
      "Improved quality of life scores vs. standard of care"
    ],
    recommendedReferences: [
      "Health economics publications",
      "QALY/ICER analyses",
      "Budget impact studies",
      "Real-world outcomes data"
    ],
    complianceNotes: "Must follow local HTA submission guidelines (NICE, CADTH, etc.). Include transparent methodology. Declare conflicts of interest and funding sources."
  },
  {
    id: "pi-update",
    name: "Prescribing Information Update",
    description: "Materials communicating updates to product labeling, new indications, or safety information.",
    category: "regulatory",
    icon: "⚕️",
    targetMarkets: ["FDA (US)", "EMA (EU)", "MHRA (UK)", "Health Canada"],
    estimatedTime: "3-4 hours",
    complexity: "intermediate",
    features: [
      "Summary of changes to PI/SmPC",
      "New indication or expanded use",
      "Updated safety warnings",
      "Revised dosing recommendations",
      "Clinical trial supporting changes"
    ],
    sampleClaims: [
      "New indication approved for [condition]",
      "Updated dosing guidance based on recent trial",
      "Important safety information regarding [adverse event]"
    ],
    recommendedReferences: [
      "FDA approval letter",
      "Updated package insert",
      "Supporting clinical trial data",
      "Regulatory submission documents"
    ],
    complianceNotes: "Must accurately reflect approved labeling. Cannot promote off-label uses. Highlight important safety updates prominently."
  },
  {
    id: "patient-brochure",
    name: "Patient Education Brochure",
    description: "Direct-to-patient materials explaining condition and treatment options (where permitted by regulation).",
    category: "educational",
    icon: "👥",
    targetMarkets: ["FDA (US)", "Health Canada"],
    estimatedTime: "3-4 hours",
    complexity: "intermediate",
    features: [
      "Plain language disease description",
      "How the medication works",
      "What to expect from treatment",
      "Side effects and warnings",
      "Lifestyle and adherence tips"
    ],
    sampleClaims: [
      "[Product] helps control [condition] by [mechanism]",
      "Most patients experience improvement within [timeframe]",
      "Common side effects include [list]"
    ],
    recommendedReferences: [
      "Patient package insert",
      "Medication guide",
      "Patient-reported outcomes data"
    ],
    complianceNotes: "FDA: DTC advertising must include fair balance and major side effects. EU: DTC advertising of prescription drugs prohibited. Use plain language (6th-8th grade reading level)."
  },
  {
    id: "symposium-slides",
    name: "Symposium/Speaker Program Slides",
    description: "Slide deck for company-sponsored educational symposia or speaker programs.",
    category: "medical",
    icon: "🎤",
    targetMarkets: ["FDA (US)", "EMA (EU)", "MHRA (UK)"],
    estimatedTime: "5-6 hours",
    complexity: "advanced",
    features: [
      "Clinical data deep dive",
      "Expert commentary and perspectives",
      "Case study discussions",
      "Q&A preparation",
      "Disclosure of sponsorship"
    ],
    sampleClaims: [
      "Clinical trial demonstrated [outcome]",
      "Guidelines recommend [approach]",
      "Real-world data supports [finding]"
    ],
    recommendedReferences: [
      "Primary clinical trial publications",
      "Clinical guidelines",
      "Expert consensus statements",
      "Real-world evidence"
    ],
    complianceNotes: "Must disclose company sponsorship. Speaker must maintain editorial control. Cannot promote off-label uses. FDA/PhRMA Code compliant."
  },
  {
    id: "competitive-grid",
    name: "Competitive Landscape Grid",
    description: "Internal or external comparison of product vs. competitors in the therapeutic area.",
    category: "promotional",
    icon: "⚖️",
    targetMarkets: ["FDA (US)", "EMA (EU)", "MHRA (UK)"],
    estimatedTime: "4-5 hours",
    complexity: "advanced",
    features: [
      "Head-to-head trial data (if available)",
      "Indirect treatment comparisons",
      "Mechanism of action comparison",
      "Safety profile comparison",
      "Dosing and convenience factors"
    ],
    sampleClaims: [
      "Non-inferior efficacy to [competitor] with improved safety profile",
      "Only treatment in class with [unique feature]",
      "Network meta-analysis shows favorable odds ratio vs. competitors"
    ],
    recommendedReferences: [
      "Head-to-head trials",
      "Network meta-analyses",
      "Systematic reviews",
      "Competitor package inserts"
    ],
    complianceNotes: "Comparative claims must be substantiated by head-to-head data or valid indirect comparisons. Cannot make misleading comparisons. Must be fair and balanced."
  }
]

/**
 * Get template by ID
 */
export function getTemplateById(id: string): ProjectTemplate | undefined {
  return PROJECT_TEMPLATES.find(t => t.id === id)
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: ProjectTemplate["category"]): ProjectTemplate[] {
  return PROJECT_TEMPLATES.filter(t => t.category === category)
}

/**
 * Get templates by complexity
 */
export function getTemplatesByComplexity(complexity: ProjectTemplate["complexity"]): ProjectTemplate[] {
  return PROJECT_TEMPLATES.filter(t => t.complexity === complexity)
}

/**
 * Get templates by target market
 */
export function getTemplatesByMarket(market: string): ProjectTemplate[] {
  return PROJECT_TEMPLATES.filter(t => t.targetMarkets.includes(market))
}

/**
 * Search templates
 */
export function searchTemplates(query: string): ProjectTemplate[] {
  const lowerQuery = query.toLowerCase()
  return PROJECT_TEMPLATES.filter(t =>
    t.name.toLowerCase().includes(lowerQuery) ||
    t.description.toLowerCase().includes(lowerQuery) ||
    t.features.some(f => f.toLowerCase().includes(lowerQuery))
  )
}
