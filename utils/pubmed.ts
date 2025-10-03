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
export function extractMedicalKeywords(claimText: string, productContext?: string): string {
  // Remove common filler words (but keep medical/statistical terms)
  const stopWords = [
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
    'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'
  ]

  // Extract drug/product names (often capitalized or in specific patterns)
  const drugNames = claimText.match(/\b[A-Z]{2,}[A-Z0-9-]*\b/g) || [] // All caps (e.g., XARELTO, COVID-19)
  const tradenames = claimText.match(/\b[A-Z][a-z]+[A-Z][a-z]+\b/g) || [] // CamelCase trade names

  // Prioritize medical terms (capitalized in original)
  const medicalTerms = claimText
    .match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [] // Capitalized phrases

  // Extract percentages and statistical values
  const percentages = claimText.match(/\d+\.?\d*\s*%/g) || []
  const numbers = claimText.match(/\b\d+\.?\d*\b/g) || []

  // Medical suffixes/patterns (e.g., -mab, -tinib, -pril, etc.)
  const medicalSuffixes = /\b\w+(?:mab|tinib|pril|olol|statin|cycline|cillin|azole|itis|osis|emia|pathy)\b/gi
  const medicalWords = claimText.match(medicalSuffixes) || []

  // Extract key content words (not stop words)
  const words = claimText
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ') // Keep hyphens for medical terms
    .split(/\s+/)
    .filter(word => word.length > 3)
    .filter(word => !stopWords.includes(word))

  // Add product context (e.g., from source document name)
  const contextWords = productContext
    ? productContext
        .replace(/[-_\.]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 3 && !stopWords.includes(w.toLowerCase()))
    : []

  // Combine all keywords with priority order
  const allKeywords = [
    ...new Set([
      ...drugNames, // Highest priority: drug/product names
      ...contextWords.slice(0, 3), // Product context
      ...medicalTerms.map(t => t.toLowerCase()),
      ...medicalWords.map(w => w.toLowerCase()),
      ...words.slice(0, 12), // More keywords for better matching
      ...percentages,
      ...numbers.slice(0, 3)
    ])
  ]

  return allKeywords.join(' ').trim()
}

/**
 * Score article relevance to claim using improved semantic matching
 */
export async function scoreArticleRelevance(
  article: PubMedArticle, 
  claimText: string,
  productContext?: string
): Promise<number> {
  const claimLower = claimText.toLowerCase()
  const titleLower = article.title.toLowerCase()
  
  // Fetch abstract if not present (crucial for good scoring)
  let abstractLower = article.abstract?.toLowerCase() || ''
  if (!abstractLower && article.pubmedId) {
    const fetchedAbstract = await fetchArticleAbstract(article.pubmedId)
    if (fetchedAbstract) {
      article.abstract = fetchedAbstract
      abstractLower = fetchedAbstract.toLowerCase()
    }
  }

  let score = 0

  // Extract key terms from claim (with product context)
  const keywords = extractMedicalKeywords(claimText, productContext)
  const claimWords = keywords
    .toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 2)

  // HIGH PRIORITY: Product/drug name matching
  const drugNames = claimText.match(/\b[A-Z]{2,}[A-Z0-9-]*\b/g) || []
  const productWords = productContext
    ? productContext
        .replace(/[-_\.]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 3)
    : []

  // Check for drug/product names in title (very strong signal)
  for (const drug of [...drugNames, ...productWords]) {
    if (titleLower.includes(drug.toLowerCase())) {
      score += 0.4 // Strong boost for product name in title
    }
    if (abstractLower.includes(drug.toLowerCase())) {
      score += 0.2 // Boost for product name in abstract
    }
  }

  // MEDIUM PRIORITY: Medical terms and statistical values
  const percentages = claimText.match(/\d+\.?\d*\s*%/g) || []
  const statisticalTerms = ['randomized', 'trial', 'rct', 'controlled', 'placebo', 
                             'efficacy', 'safety', 'adverse', 'event', 'outcome']

  for (const pct of percentages) {
    if (titleLower.includes(pct) || abstractLower.includes(pct)) {
      score += 0.15 // Matching specific percentages is a strong signal
    }
  }

  for (const term of statisticalTerms) {
    if (titleLower.includes(term) && claimLower.includes(term)) {
      score += 0.1
    }
  }

  // STANDARD PRIORITY: General keyword matching
  let titleMatches = 0
  let abstractMatches = 0

  for (const word of claimWords) {
    if (titleLower.includes(word)) {
      titleMatches++
      score += 0.15 // Reduced from 0.2, but we count more keywords
    }
    if (abstractLower.includes(word)) {
      abstractMatches++
      score += 0.08 // Slightly reduced from 0.1
    }
  }

  // Boost if many keywords match (indicates strong topical relevance)
  const matchRatio = (titleMatches + abstractMatches) / Math.max(claimWords.length, 1)
  if (matchRatio > 0.5) {
    score += 0.2 // Bonus for high keyword coverage
  } else if (matchRatio > 0.3) {
    score += 0.1
  }

  // Penalize if NO abstract is available (lower confidence)
  if (!abstractLower) {
    score *= 0.7 // 30% penalty for missing abstract
  }

  // Boost for recent publications (within last 10 years)
  if (article.year) {
    const currentYear = new Date().getFullYear()
    const age = currentYear - article.year
    if (age <= 3) score += 0.15      // Very recent
    else if (age <= 5) score += 0.1  // Recent
    else if (age <= 10) score += 0.05 // Moderately recent
    // Older than 10 years: no boost
  }

  // Cap at 1.0
  return Math.min(score, 1.0)
}
