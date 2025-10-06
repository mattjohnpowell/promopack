/**
 * Analytics and Usage Tracking
 *
 * Functions for calculating usage metrics and analytics
 * for team managers and account administrators.
 */

type Project = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  claims?: Array<{ id: string; needsReview?: boolean }>
  documents?: Array<{ id: string; type: string; isAutoFound?: boolean }>
}

type User = {
  id: string
  name?: string | null
  email?: string | null
  projects?: Project[]
}

export type UsageMetrics = {
  totalProjects: number
  totalClaims: number
  totalDocuments: number
  claimsNeedingReview: number
  autoFoundReferences: number
  avgClaimsPerProject: number
  avgDocumentsPerProject: number
  projectsThisMonth: number
  projectsThisWeek: number
  complianceRate: number
  timeSeriesData: Array<{
    date: string
    projects: number
    claims: number
    documents: number
  }>
}

export type TeamAnalytics = {
  totalUsers: number
  activeUsers: number
  totalProjects: number
  projectsByUser: Array<{
    userId: string
    userName: string
    userEmail: string
    projectCount: number
    claimCount: number
    lastActivity: Date
  }>
  productivityMetrics: {
    avgProjectsPerUser: number
    avgClaimsPerUser: number
    avgTimeToComplete: number
  }
}

/**
 * Calculate usage metrics for a single user or account
 */
export function calculateUsageMetrics(projects: Project[]): UsageMetrics {
  const now = new Date()
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const totalProjects = projects.length
  const totalClaims = projects.reduce((sum, p) => sum + (p.claims?.length || 0), 0)
  const totalDocuments = projects.reduce((sum, p) => sum + (p.documents?.length || 0), 0)
  const claimsNeedingReview = projects.reduce(
    (sum, p) => sum + (p.claims?.filter(c => c.needsReview).length || 0),
    0
  )
  const autoFoundReferences = projects.reduce(
    (sum, p) => sum + (p.documents?.filter(d => d.isAutoFound).length || 0),
    0
  )

  const avgClaimsPerProject = totalProjects > 0 ? totalClaims / totalProjects : 0
  const avgDocumentsPerProject = totalProjects > 0 ? totalDocuments / totalProjects : 0

  const projectsThisMonth = projects.filter(p => new Date(p.createdAt) >= oneMonthAgo).length
  const projectsThisWeek = projects.filter(p => new Date(p.createdAt) >= oneWeekAgo).length

  const complianceRate = totalClaims > 0
    ? ((totalClaims - claimsNeedingReview) / totalClaims) * 100
    : 100

  // Generate time series data (last 30 days)
  const timeSeriesData = generateTimeSeriesData(projects, 30)

  return {
    totalProjects,
    totalClaims,
    totalDocuments,
    claimsNeedingReview,
    autoFoundReferences,
    avgClaimsPerProject,
    avgDocumentsPerProject,
    projectsThisMonth,
    projectsThisWeek,
    complianceRate,
    timeSeriesData
  }
}

/**
 * Calculate team analytics for managers
 */
export function calculateTeamAnalytics(users: User[]): TeamAnalytics {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const totalUsers = users.length
  const activeUsers = users.filter(u =>
    u.projects?.some(p => new Date(p.updatedAt) >= thirtyDaysAgo)
  ).length

  const allProjects = users.flatMap(u => u.projects || [])
  const totalProjects = allProjects.length

  const projectsByUser = users.map(user => {
    const userProjects = user.projects || []
    const claimCount = userProjects.reduce((sum, p) => sum + (p.claims?.length || 0), 0)
    const lastActivity = userProjects.length > 0
      ? new Date(Math.max(...userProjects.map(p => new Date(p.updatedAt).getTime())))
      : new Date(0)

    return {
      userId: user.id,
      userName: user.name || 'Unknown',
      userEmail: user.email || 'N/A',
      projectCount: userProjects.length,
      claimCount,
      lastActivity
    }
  }).sort((a, b) => b.projectCount - a.projectCount)

  const avgProjectsPerUser = totalUsers > 0 ? totalProjects / totalUsers : 0
  const totalClaims = allProjects.reduce((sum, p) => sum + (p.claims?.length || 0), 0)
  const avgClaimsPerUser = totalUsers > 0 ? totalClaims / totalUsers : 0

  // Calculate average time to complete (created to last updated)
  const completedProjects = allProjects.filter(p =>
    p.claims && p.claims.length > 0 && p.claims.every(c => !c.needsReview)
  )
  const avgTimeToComplete = completedProjects.length > 0
    ? completedProjects.reduce((sum, p) => {
        const created = new Date(p.createdAt).getTime()
        const updated = new Date(p.updatedAt).getTime()
        return sum + (updated - created) / (1000 * 60 * 60) // hours
      }, 0) / completedProjects.length
    : 0

  return {
    totalUsers,
    activeUsers,
    totalProjects,
    projectsByUser,
    productivityMetrics: {
      avgProjectsPerUser,
      avgClaimsPerUser,
      avgTimeToComplete
    }
  }
}

/**
 * Generate time series data for charts
 */
function generateTimeSeriesData(
  projects: Project[],
  days: number
): Array<{ date: string; projects: number; claims: number; documents: number }> {
  const data: Array<{ date: string; projects: number; claims: number; documents: number }> = []
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]

    const dayProjects = projects.filter(p => {
      const createdDate = new Date(p.createdAt)
      return createdDate.toISOString().split('T')[0] === dateStr
    })

    data.push({
      date: dateStr,
      projects: dayProjects.length,
      claims: dayProjects.reduce((sum, p) => sum + (p.claims?.length || 0), 0),
      documents: dayProjects.reduce((sum, p) => sum + (p.documents?.length || 0), 0)
    })
  }

  return data
}

/**
 * Calculate ROI metrics for reporting
 */
export function calculateROIMetrics(metrics: UsageMetrics): {
  estimatedTimeSaved: number
  estimatedCostSaved: number
  efficiencyGain: number
} {
  // Assumptions (can be customized)
  const hoursPerManualProject = 20
  const hoursSavedPercentage = 0.4 // 40% time savings
  const hourlyRate = 75 // average pharma professional hourly rate
  const complianceErrorCostAvoidance = metrics.claimsNeedingReview === 0 ? 5000 : 0

  const estimatedTimeSaved = metrics.totalProjects * hoursPerManualProject * hoursSavedPercentage
  const estimatedCostSaved = (estimatedTimeSaved * hourlyRate) + complianceErrorCostAvoidance

  const efficiencyGain = hoursSavedPercentage * 100

  return {
    estimatedTimeSaved,
    estimatedCostSaved,
    efficiencyGain
  }
}

/**
 * Get activity summary for the last N days
 */
export function getActivitySummary(projects: Project[], days: number = 7): {
  newProjects: number
  totalClaims: number
  totalDocuments: number
  reviewRate: number
} {
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  const recentProjects = projects.filter(p => new Date(p.createdAt) >= cutoffDate)

  const newProjects = recentProjects.length
  const totalClaims = recentProjects.reduce((sum, p) => sum + (p.claims?.length || 0), 0)
  const totalDocuments = recentProjects.reduce((sum, p) => sum + (p.documents?.length || 0), 0)
  const claimsReviewed = recentProjects.reduce(
    (sum, p) => sum + (p.claims?.filter(c => !c.needsReview).length || 0),
    0
  )
  const reviewRate = totalClaims > 0 ? (claimsReviewed / totalClaims) * 100 : 0

  return {
    newProjects,
    totalClaims,
    totalDocuments,
    reviewRate
  }
}
