/**
 * Regulatory Compliance Checker
 * Scans claims for PMCPA/FDA red flags and risky language
 */

export interface ComplianceIssue {
  type: 'error' | 'warning' | 'info'
  category: string
  message: string
  matched: string
  suggestion?: string
}

export interface ComplianceResult {
  claimId: string
  claimText: string
  issues: ComplianceIssue[]
  riskLevel: 'high' | 'medium' | 'low' | 'compliant'
  complianceScore: number // 0-100
}

/**
 * PMCPA/FDA Compliance Rules
 */
const COMPLIANCE_RULES = {
  // Absolute claims (high risk)
  absoluteClaims: {
    patterns: [
      /\b(always|never|completely|totally|absolutely|guaranteed?|100%|perfect|cure[ds]?|eliminates?)\b/gi,
      /\b(all patients?|every patient|everyone)\b/gi,
      /\b(no (side effects?|risks?|adverse events?))\b/gi,
    ],
    category: 'Absolute Claims',
    type: 'error' as const,
    message: 'Absolute claims are prohibited - use qualified language (e.g., "may help", "in clinical studies")',
  },

  // Superlatives without substantiation
  superlatives: {
    patterns: [
      /\b(best|greatest|most effective|superior|fastest|strongest|safest)\b/gi,
      /\b(better than|more effective than|safer than)\b/gi,
      /\b(number one|#1|leading)\b/gi,
    ],
    category: 'Superlative Claims',
    type: 'error' as const,
    message: 'Superlative claims require head-to-head comparative data',
  },

  // Off-label promotion indicators
  offLabel: {
    patterns: [
      /\b(unapproved use|off-label|investigational|not (yet )?approved)\b/gi,
      /\b(indication not established)\b/gi,
    ],
    category: 'Off-Label Promotion',
    type: 'error' as const,
    message: 'Possible off-label promotion - ensure claim aligns with approved indications',
  },

  // Missing qualifiers
  missingQualifiers: {
    patterns: [
      /\b(reduces?|improves?|increases?|decreases?|prevents?|treats?|helps?)\b(?!.*\b(may|can|might|in clinical (studies?|trials?))\b)/gi,
    ],
    category: 'Missing Qualifiers',
    type: 'warning' as const,
    message: 'Consider adding qualifiers like "may", "can", or "in clinical studies"',
  },

  // Outcome promises
  outcomePromises: {
    patterns: [
      /\b(you will|patients? will|guaranteed to|ensures?|promises?)\b/gi,
      /\b(no more|get rid of|solve)\b/gi,
    ],
    category: 'Outcome Promises',
    type: 'error' as const,
    message: 'Cannot promise specific outcomes - use evidence-based language',
  },

  // Emotional/fear-based appeals
  emotionalAppeals: {
    patterns: [
      /\b(breakthrough|revolutionary|miracle|life-changing)\b/gi,
      /\b(don't (wait|delay)|act now|limited time)\b/gi,
    ],
    category: 'Emotional Appeals',
    type: 'warning' as const,
    message: 'Avoid overly emotional or urgent language in promotional materials',
  },

  // Missing safety balance
  safetyBalance: {
    patterns: [
      /\b(no (risks?|side effects?)|perfectly safe|harmless)\b/gi,
    ],
    category: 'Safety Balance',
    type: 'error' as const,
    message: 'All claims must include balanced risk information',
  },

  // Percentages without context
  percentagesWithoutContext: {
    patterns: [
      /\b(\d+\.?\d*%)\b(?!.*\b(of patients?|in (the )?(study|trial|clinical trial)|vs\.?|compared to)\b)/gi,
    ],
    category: 'Statistics Without Context',
    type: 'warning' as const,
    message: 'Provide context for statistical claims (study population, comparator, etc.)',
  },

  // Missing reference indicators
  missingReferences: {
    patterns: [
      /\b(studies? (show|demonstrate|prove)|research (shows?|indicates?)|clinical (data|evidence))\b/gi,
    ],
    category: 'Missing Reference',
    type: 'info' as const,
    message: 'Ensure this claim has a clear reference citation',
  },
}

/**
 * Check a single claim for compliance issues
 */
export function checkClaimCompliance(claimText: string, claimId: string): ComplianceResult {
  const issues: ComplianceIssue[] = []

  // Run all compliance rules
  for (const [ruleName, rule] of Object.entries(COMPLIANCE_RULES)) {
    for (const pattern of rule.patterns) {
      const matches = claimText.match(pattern)
      if (matches) {
        // Deduplicate matches
        const uniqueMatches = [...new Set(matches)]

        for (const match of uniqueMatches) {
          issues.push({
            type: rule.type,
            category: rule.category,
            message: rule.message,
            matched: match,
            suggestion: getSuggestion(match, rule.category),
          })
        }
      }
    }
  }

  // Calculate risk level
  const errorCount = issues.filter(i => i.type === 'error').length
  const warningCount = issues.filter(i => i.type === 'warning').length

  let riskLevel: 'high' | 'medium' | 'low' | 'compliant'
  let complianceScore: number

  if (errorCount >= 2) {
    riskLevel = 'high'
    complianceScore = Math.max(0, 40 - (errorCount * 10))
  } else if (errorCount === 1) {
    riskLevel = 'medium'
    complianceScore = 60 - (warningCount * 5)
  } else if (warningCount >= 2) {
    riskLevel = 'medium'
    complianceScore = 75 - (warningCount * 5)
  } else if (warningCount === 1) {
    riskLevel = 'low'
    complianceScore = 85
  } else {
    riskLevel = 'compliant'
    complianceScore = 95 + (issues.length === 0 ? 5 : 0) // Perfect score if no issues
  }

  return {
    claimId,
    claimText,
    issues,
    riskLevel,
    complianceScore: Math.max(0, Math.min(100, complianceScore)),
  }
}

/**
 * Get suggestion for fixing a compliance issue
 */
function getSuggestion(matched: string, category: string): string | undefined {
  const suggestions: Record<string, string> = {
    'Absolute Claims': `Replace "${matched}" with qualified language like "may help" or "in clinical studies"`,
    'Superlative Claims': `Replace "${matched}" with evidence-based language supported by comparative data`,
    'Outcome Promises': `Replace "${matched}" with "may" or "can help" to avoid promising outcomes`,
    'Missing Qualifiers': `Add qualifiers like "may", "can", or "in clinical studies" before the claim`,
    'Safety Balance': `Include balanced risk information and avoid suggesting zero risk`,
  }

  return suggestions[category]
}

/**
 * Check all claims in a project
 */
export function checkProjectCompliance(claims: Array<{ id: string; text: string }>): ComplianceResult[] {
  return claims.map(claim => checkClaimCompliance(claim.text, claim.id))
}

/**
 * Get summary statistics for compliance results
 */
export function getComplianceSummary(results: ComplianceResult[]): {
  totalClaims: number
  compliantClaims: number
  highRiskClaims: number
  mediumRiskClaims: number
  lowRiskClaims: number
  averageComplianceScore: number
  totalIssues: number
  criticalIssues: number
} {
  const totalClaims = results.length
  const compliantClaims = results.filter(r => r.riskLevel === 'compliant').length
  const highRiskClaims = results.filter(r => r.riskLevel === 'high').length
  const mediumRiskClaims = results.filter(r => r.riskLevel === 'medium').length
  const lowRiskClaims = results.filter(r => r.riskLevel === 'low').length
  const averageComplianceScore = results.reduce((sum, r) => sum + r.complianceScore, 0) / (totalClaims || 1)
  const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0)
  const criticalIssues = results.reduce((sum, r) => sum + r.issues.filter(i => i.type === 'error').length, 0)

  return {
    totalClaims,
    compliantClaims,
    highRiskClaims,
    mediumRiskClaims,
    lowRiskClaims,
    averageComplianceScore: Math.round(averageComplianceScore),
    totalIssues,
    criticalIssues,
  }
}
