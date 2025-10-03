# PubMed Reference Relevance Scoring Improvements

## Problem Summary

The PubMed automatic reference suggestions were showing very low relevance scores (10-60%) for XARELTO claims, with many irrelevant papers being suggested.

## Root Causes Identified

### 1. **Poor Keyword Extraction**
The original `extractMedicalKeywords()` function:
- Stripped out too many important medical terms
- Didn't preserve drug/product names (e.g., "XARELTO")
- Missed medical terminology patterns (suffixes like -mab, -tinib, etc.)
- Ignored the product context from the source document name

### 2. **Overly Simple Scoring Algorithm**
The original `scoreArticleRelevance()` function:
- Only gave 0.2 points per keyword match in title
- Only gave 0.1 points per keyword match in abstract
- **Never fetched abstracts** during initial scoring (abstracts were `undefined`)
- Didn't weight drug/product names more heavily
- Didn't account for statistical data matching (percentages, trial data)
- Maximum score was capped by limited keyword matches

### 3. **Incomplete Claims**
The claims being matched were fragments:
- "increase in AUCinf and a 56%" (missing drug name and context)
- "patients randomized to XARELTO experienced" (missing outcome)
- "subjects maintained with chronic and stable hemodialysis; reported" (incomplete sentence)

These fragments lacked enough context for good matching without the product name.

### 4. **No Product Context**
The search wasn't using the source document name (e.g., "XARELTO-pi.pdf") to extract the product name for better PubMed queries.

## Improvements Made

### 1. **Enhanced Keyword Extraction** (`extractMedicalKeywords`)

Now extracts:
- **Drug names** (all-caps patterns like "XARELTO", "COVID-19")
- **Trade names** (CamelCase patterns)
- **Medical terminology** (words with medical suffixes: -mab, -tinib, -pril, -itis, -osis, etc.)
- **Product context** from source document names
- **Statistical data** (percentages, key numbers)
- **More keywords** (12 instead of 10) for better coverage

### 2. **Improved Scoring Algorithm** (`scoreArticleRelevance`)

Now includes:

#### **High Priority Matches** (0.2-0.4 points each)
- Product/drug name in title: **+0.4**
- Product/drug name in abstract: **+0.2**
- Specific percentages matching: **+0.15**

#### **Medium Priority Matches** (0.08-0.15 points each)
- Statistical terms (randomized, trial, RCT, etc.): **+0.1**
- Keyword in title: **+0.15** (increased from 0.2 but applies to more keywords)
- Keyword in abstract: **+0.08**

#### **Coverage Bonus** (0.1-0.2 points)
- >50% of keywords match: **+0.2**
- >30% of keywords match: **+0.1**

#### **Recency Bonus** (0.05-0.15 points)
- ≤3 years old: **+0.15**
- ≤5 years old: **+0.1**
- ≤10 years old: **+0.05**

#### **Penalties**
- Missing abstract: **-30%** (multiply final score by 0.7)

### 3. **Async Abstract Fetching**
The scoring function now:
- Fetches abstracts **during scoring** (not just during display)
- Uses abstract content for more accurate relevance matching
- Applies a penalty if abstract is unavailable

### 4. **Product Context Integration**
The `searchPubMedForClaim` function now:
- Fetches the source document (e.g., "XARELTO-pi.pdf")
- Extracts product context from the document name
- Passes product context to keyword extraction and scoring
- Searches for more articles initially (10 instead of 5)
- Filters down to top 5 after scoring

## Expected Results

After these improvements:

1. **Higher relevance scores** for truly relevant papers (50-90% range)
2. **Better product-specific matching** (XARELTO papers for XARELTO claims)
3. **More accurate statistical matching** (papers with similar trial data)
4. **Fewer irrelevant suggestions** (better filtering through improved scoring)
5. **Clearer differentiation** between high/medium/low relevance papers

## Example Improvements

### Before
- Claim: "increase in AUCinf and a 56%"
- Keywords: "increase aucinf"
- Results: Generic pharmacokinetic papers (20% relevance)

### After
- Claim: "increase in AUCinf and a 56%"
- Product Context: "XARELTO" (from "XARELTO-pi.pdf")
- Keywords: "XARELTO increase aucinf 56%"
- Results: XARELTO-specific pharmacokinetic studies (60-80% relevance)

## Testing Recommendations

1. **Re-run auto-find** for the existing Xylo project
2. **Check new relevance scores** in the UI
3. **Verify abstracts** are being fetched and displayed
4. **Confirm XARELTO-specific papers** are now being suggested
5. **Monitor PubMed API rate limits** (now fetching abstracts more frequently)

## Future Enhancements

Consider adding:
1. **Full claim extraction** before PubMed search (complete sentences, not fragments)
2. **Semantic similarity** using embeddings/vector search
3. **User feedback loop** (accept/reject patterns to improve scoring)
4. **Caching** of PubMed results to reduce API calls
5. **Manual product name override** in project settings
