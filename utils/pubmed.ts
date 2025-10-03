/**
 * PubMed E-utilities API integration
 * Docs: https://www.ncbi.nlm.nih.gov/books/NBK25501/
 */

export interface PubMedArticle {
  pubmedId: string
  doi?: string
  title: string
  authors: string[]
  journal?: string
  year?: number
  volume?: string
  issue?: string
  pages?: string
  abstract?: string
  pubmedUrl: string
}

export interface PubMedSearchOptions {
  maxResults?: number
  minYear?: number
  studyTypes?: string[] // e.g., ['Randomized Controlled Trial', 'Meta-Analysis']
}

/**
 * Search PubMed for articles related to a claim
 */
export async function searchPubMed(
  query: string,
  options: PubMedSearchOptions = {}
): Promise<PubMedArticle[]> {
  const { maxResults = 5, minYear, studyTypes } = options

  try {
    // Step 1: Search for PMIDs
    const searchUrl = buildSearchUrl(query, maxResults, minYear, studyTypes)
    const searchResponse = await fetch(searchUrl)

    if (!searchResponse.ok) {
      throw new Error(`PubMed search failed: ${searchResponse.status}`)
    }

    const searchData = await searchResponse.json()
    const pmids = searchData.esearchresult?.idlist || []

    if (pmids.length === 0) {
      console.log('No PubMed results found for query:', query)
      return []
    }

    console.log(`Found ${pmids.length} PubMed articles for query: "${query}"`)

    // Step 2: Fetch article details
    const articles = await fetchArticleDetails(pmids)
    return articles

  } catch (error) {
    console.error('PubMed search error:', error)
    throw new Error('Failed to search PubMed')
  }
}

/**
 * Build PubMed search URL with filters
 */
function buildSearchUrl(
  query: string,
  maxResults: number,
  minYear?: number,
  studyTypes?: string[]
): string {
  const baseUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi'

  // Build search term with filters
  let searchTerm = query

  if (minYear) {
    searchTerm += ` AND ${minYear}:3000[pdat]` // Publication date filter
  }

  if (studyTypes && studyTypes.length > 0) {
    const typeFilters = studyTypes.map(type => `"${type}"[Publication Type]`).join(' OR ')
    searchTerm += ` AND (${typeFilters})`
  }

  const params = new URLSearchParams({
    db: 'pubmed',
    term: searchTerm,
    retmax: maxResults.toString(),
    retmode: 'json',
    sort: 'relevance',
    usehistory: 'n'
  })

  return `${baseUrl}?${params.toString()}`
}

/**
 * Fetch detailed article information from PubMed
 */
async function fetchArticleDetails(pmids: string[]): Promise<PubMedArticle[]> {
  const baseUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi'

  const params = new URLSearchParams({
    db: 'pubmed',
    id: pmids.join(','),
    retmode: 'json'
  })

  const response = await fetch(`${baseUrl}?${params.toString()}`)

  if (!response.ok) {
    throw new Error(`PubMed fetch failed: ${response.status}`)
  }

  const data = await response.json()
  const articles: PubMedArticle[] = []

  for (const pmid of pmids) {
    const article = data.result?.[pmid]
    if (!article) continue

    // Parse authors
    const authors = article.authors?.map((a: any) => a.name) || []

    // Parse publication date
    const pubDate = article.pubdate || ''
    const yearMatch = pubDate.match(/(\d{4})/)
    const year = yearMatch ? parseInt(yearMatch[1]) : undefined

    // Parse DOI from article IDs
    const doi = article.articleids?.find((id: any) => id.idtype === 'doi')?.value

    articles.push({
      pubmedId: pmid,
      doi,
      title: article.title || 'Untitled',
      authors,
      journal: article.fulljournalname || article.source,
      year,
      volume: article.volume,
      issue: article.issue,
      pages: article.pages,
      abstract: undefined, // eSummary doesn't include abstract
      pubmedUrl: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`
    })
  }

  return articles
}

/**
 * Fetch full article details including abstract
 */
export async function fetchArticleAbstract(pmid: string): Promise<string | undefined> {
  try {
    const baseUrl = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi'

    const params = new URLSearchParams({
      db: 'pubmed',
      id: pmid,
      retmode: 'xml',
      rettype: 'abstract'
    })

    const response = await fetch(`${baseUrl}?${params.toString()}`)

    if (!response.ok) {
      return undefined
    }

    const xmlText = await response.text()

    // Simple XML parsing to extract abstract text
    const abstractMatch = xmlText.match(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/i)
    if (abstractMatch) {
      // Remove XML tags and decode entities
      const abstract = abstractMatch[1]
        .replace(/<[^>]+>/g, '')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .trim()

      return abstract
    }

    return undefined
  } catch (error) {
    console.error('Error fetching abstract for PMID', pmid, error)
    return undefined
  }
}

/**
 * Extract medical/scientific keywords from claim text for better search
 */
export function extractMedicalKeywords(claimText: string): string {
  // Remove common filler words
  const stopWords = [
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
    'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'
  ]

  const words = claimText
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ') // Keep hyphens for medical terms
    .split(/\s+/)
    .filter(word => word.length > 3)
    .filter(word => !stopWords.includes(word))

  // Prioritize medical terms (capitalized in original, numbers/percentages, medical suffixes)
  const medicalTerms = claimText
    .match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [] // Capitalized phrases

  const percentages = claimText.match(/\d+\.?\d*\s*%/g) || []
  const numbers = claimText.match(/\b\d+\.?\d*\b/g) || []

  // Combine all keywords
  const allKeywords = [
    ...new Set([
      ...medicalTerms.map(t => t.toLowerCase()),
      ...words.slice(0, 10), // Top 10 keywords
      ...percentages,
      ...numbers.slice(0, 3) // Max 3 numbers
    ])
  ]

  return allKeywords.join(' ').trim()
}

/**
 * Score article relevance to claim using simple text matching
 */
export function scoreArticleRelevance(article: PubMedArticle, claimText: string): number {
  const claimLower = claimText.toLowerCase()
  const titleLower = article.title.toLowerCase()
  const abstractLower = article.abstract?.toLowerCase() || ''

  let score = 0

  // Extract key terms from claim
  const claimWords = extractMedicalKeywords(claimText)
    .toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 3)

  // Check title matches
  for (const word of claimWords) {
    if (titleLower.includes(word)) {
      score += 0.2 // Each keyword in title = +0.2
    }
  }

  // Check abstract matches (if available)
  for (const word of claimWords) {
    if (abstractLower.includes(word)) {
      score += 0.1 // Each keyword in abstract = +0.1
    }
  }

  // Boost for recent publications
  if (article.year) {
    const currentYear = new Date().getFullYear()
    const age = currentYear - article.year
    if (age <= 5) score += 0.2
    else if (age <= 10) score += 0.1
  }

  // Cap at 1.0
  return Math.min(score, 1.0)
}
