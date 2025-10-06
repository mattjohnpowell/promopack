# Claim Review System - Implementation Guide

## Overview

The claim review system has been completely redesigned to ensure that only **true regulatory claims** are extracted, reviewed, and included in compliance packs. This addresses the core issue where the old system was extracting any text snippet instead of actual pharmaceutical regulatory claims.

---

## What Changed

### Before (Old System)
- ❌ Extracted ANY text from documents as "claims"
- ❌ Included sentence fragments like "increase in AUCinf and a 56%"
- ❌ No way to reject non-claims
- ❌ All extracted items treated as valid claims
- ❌ Auto-linked everything immediately

### After (New System)
- ✅ Extracts **potential** regulatory claims with AI confidence scoring
- ✅ Requires human review and approval
- ✅ Can reject, edit, or approve each item
- ✅ Clear classification system (Efficacy, Safety, Indication, etc.)
- ✅ Only approved claims are linked and included in PDFs

---

## Claim States

Every extracted item now has a **status**:

| Status | Description | Can Link References? | Included in PDF? |
|--------|-------------|---------------------|------------------|
| `PENDING_REVIEW` | Freshly extracted, awaiting review | ❌ No | ❌ No |
| `APPROVED` | User confirmed it's a real claim | ✅ Yes | ✅ Yes |
| `EDITED` | User edited the claim text | ✅ Yes | ✅ Yes |
| `REJECTED` | Not a claim (fragment, background, etc.) | ❌ No | ❌ No |

---

## Claim Types

Approved claims must be classified into one of these types:

1. **EFFICACY** - "XARELTO reduced stroke risk by 21%"
2. **SAFETY** - "Well-tolerated in patients ≥75 years old"
3. **INDICATION** - "Indicated for prophylaxis of DVT"
4. **COMPARATIVE** - "Superior to warfarin in preventing stroke"
5. **PHARMACOKINETIC** - "Peak plasma concentration within 2-4 hours"
6. **DOSING** - "Recommended dose is 20mg once daily"
7. **CONTRAINDICATION** - "Contraindicated in patients with active bleeding"
8. **MECHANISM** - "Direct Factor Xa inhibitor"
9. **DRUG_INTERACTION** - "May increase bleeding risk with aspirin"
10. **OTHER** - Catch-all for other types

---

## Database Schema Changes

### New `Claim` Model Fields

```prisma
model Claim {
  // ... existing fields ...

  // Classification fields
  status          ClaimStatus @default(PENDING_REVIEW)
  claimType       ClaimType?
  rejectionReason String?
  editedText      String?

  // AI extraction metadata
  extractionConfidence Float?
  extractionReasoning  String?
  suggestedType        ClaimType?

  // Review tracking
  reviewedAt DateTime?
  reviewedBy String?
  createdAt  DateTime @default(now())
}
```

### New Enums

```prisma
enum ClaimStatus {
  PENDING_REVIEW
  APPROVED
  REJECTED
  EDITED
}

enum ClaimType {
  EFFICACY
  SAFETY
  INDICATION
  COMPARATIVE
  PHARMACOKINETIC
  DOSING
  CONTRAINDICATION
  MECHANISM
  DRUG_INTERACTION
  OTHER
}
```

---

## User Workflow

### 1. Extraction Phase
When user clicks "Extract Claims":
- Python service analyzes PDF
- Returns potential claims with:
  - Confidence score (0-1)
  - Suggested claim type
  - Reasoning for extraction
- All claims saved with status = `PENDING_REVIEW`
- **No auto-linking happens yet**

### 2. Review Phase (NEW)
User sees a review interface for each extracted claim:

```
┌─────────────────────────────────────────────────┐
│ Page 3 | PENDING REVIEW | AI: High Confidence  │
│ "XARELTO reduced the risk of stroke by 21%"    │
│                                                  │
│ AI Reasoning: Identified as efficacy claim;     │
│ contains quantitative data                      │
│                                                  │
│ Claim Type: [Efficacy ▼]                        │
│                                                  │
│ [ ✅ Approve ] [ ✏️ Edit ] [ ✗ Reject ]        │
└─────────────────────────────────────────────────┘
```

**User Actions:**
- **Approve** - Confirm it's a real claim → Status = APPROVED → Auto-linking triggered
- **Edit** - Fix the text → Status = EDITED → Auto-linking triggered
- **Reject** - Not a claim → Status = REJECTED → Removed from workflow

### 3. Rejection Modal
When user rejects, they must provide a reason:
- Incomplete sentence or fragment
- Background information (not about the drug)
- Study methodology description
- Table header or figure caption
- Section title or boilerplate
- Too trivial or obvious
- Duplicate of another claim
- Other (custom reason)

### 4. Edit Modal
When user edits:
- Shows original extracted text (grayed out)
- Allows editing the claim text
- Must select claim type
- Saves edited version, keeps original for audit trail

### 5. Bulk Actions
For efficiency, users can:
- Select multiple pending claims (checkboxes)
- Bulk approve all selected
- Bulk reject all selected with one reason

---

## Updated Server Actions

### New: `reviewClaim(claimId, action, data)`
- **Actions**: `'approve' | 'reject' | 'edit'`
- **Data**: `{ claimType?, rejectionReason?, editedText? }`
- Marks claim reviewed
- Triggers auto-linking for approved/edited claims

### New: `bulkReviewClaims(claimIds[], action, data)`
- Bulk approve or reject multiple claims
- More efficient than individual reviews

### Updated: `extractClaims(projectId, options)`
- Now marks all claims as `PENDING_REVIEW`
- Does NOT auto-link immediately
- Returns message: "Please review claims to confirm which are true regulatory claims"

### Updated: `autoLinkClaims(projectId)`
- Now filters to only `APPROVED` or `EDITED` claims
- Skips `PENDING_REVIEW` and `REJECTED` claims

### Updated: `generatePack(projectId)`
- Only includes `APPROVED` or `EDITED` claims in PDF
- Throws error if no approved claims exist
- Uses `editedText` if available, otherwise `text`
- Includes `claimType` in PDF output

---

## UI Components

### New: `ClaimReviewCard.tsx`
Displays individual claim with:
- Status badge (Pending/Approved/Rejected/Edited)
- AI confidence badge (High/Medium/Low)
- AI suggested type
- AI reasoning
- Action buttons (Approve/Edit/Reject)
- Claim type selector
- Rejection reason display (if rejected)
- Original + edited text display (if edited)

### Updated: `ClaimsPageContent.tsx`
Complete rewrite with:
- Statistics: X pending, Y approved, Z rejected, W edited
- Filter dropdown: All / Pending / Approved / Rejected / Edited
- Warning banner if pending claims exist
- Bulk selection checkboxes
- Bulk action buttons
- Claims list using `ClaimReviewCard`
- PDF generation disabled until claims approved

---

## Python Extraction Service Specification

### What the AI Should Extract

A **regulatory claim** must pass ALL three tests:

1. **Is it a complete statement?**
   - Has subject, verb, object
   - Can stand alone
   - Not a fragment

2. **Does it make an assertion about the drug?**
   - States an effect, benefit, or characteristic
   - Not study design or background info

3. **Would a regulator ask: "Where's the proof?"**
   - Needs clinical data backing
   - Actionable medical information

### Examples of VALID Claims
✅ "XARELTO reduced the risk of stroke by 21% compared to warfarin"
✅ "Well-tolerated in patients 75 years and older"
✅ "Indicated for the treatment of atrial fibrillation"
✅ "Peak plasma concentration occurs within 2-4 hours"
✅ "Contraindicated in patients with active bleeding"

### Examples of INVALID Claims (Should NOT Extract)
❌ "increase in AUCinf and a 56%" (fragment)
❌ "Atrial fibrillation affects 2.7 million Americans" (disease background)
❌ "Patients were randomized 1:1 to treatment groups" (methodology)
❌ "Table 3: Adverse Events by Treatment Group" (table header)
❌ "See full prescribing information" (boilerplate)

### Expected API Response Format

```json
{
  "claims": [
    {
      "text": "XARELTO reduced the risk of stroke by 21%",
      "page": 3,
      "confidence": 0.92,
      "suggested_type": "EFFICACY",
      "reasoning": "Quantified efficacy outcome with statistical data"
    },
    {
      "text": "increase in AUCinf and a 56%",
      "page": 12,
      "confidence": 0.23,
      "suggested_type": null,
      "reasoning": "Incomplete sentence fragment, missing context"
    }
  ],
  "metadata": {
    "total_claims_extracted": 47,
    "high_confidence_claims": 32,
    "low_confidence_claims": 15
  }
}
```

### Confidence Scoring Algorithm

```python
def calculate_confidence(text, context):
    score = 0.5  # baseline

    # Positive factors
    if is_complete_sentence(text): score += 0.2
    if word_count(text) >= 8: score += 0.1
    if contains_quantitative_data(text): score += 0.15
    if has_subject_and_verb(text): score += 0.1
    if contains_drug_name(text): score += 0.05
    if in_relevant_section(context['section']): score += 0.1

    # Negative factors
    if word_count(text) < 5: score -= 0.3
    if is_table_content(text): score -= 0.4
    if missing_verb(text): score -= 0.3
    if is_header_or_title(text): score -= 0.5

    return max(0.0, min(1.0, score))
```

See `docs/PYTHON_EXTRACTOR_SPEC.md` for full implementation details.

---

## Migration Guide

### Running the Migration

```bash
# Already completed - migration file created
npx prisma migrate dev --name add_claim_classification

# Regenerate Prisma client (if types not updating)
npx prisma generate
```

### Backward Compatibility

**Existing projects with old claims:**
- Old claims have no `status` field → They default to `PENDING_REVIEW`
- Users will need to review and approve them
- This is actually beneficial - forces review of potentially invalid old claims

**Python service compatibility:**
- Old service response: `{ text, page }`
- New service response: `{ text, page, confidence, suggested_type, reasoning }`
- Code handles both formats gracefully (optional fields)

---

## Testing Checklist

### Extraction
- [ ] Extract from a PI document
- [ ] Verify all items have status = PENDING_REVIEW
- [ ] Verify AI confidence and reasoning are stored
- [ ] Verify suggested type is stored

### Review
- [ ] Approve a claim → Status = APPROVED
- [ ] Reject a claim with reason → Status = REJECTED
- [ ] Edit a claim → Status = EDITED, editedText saved
- [ ] Bulk approve multiple claims
- [ ] Bulk reject multiple claims

### Filtering
- [ ] Filter by Pending → Shows only PENDING_REVIEW
- [ ] Filter by Approved → Shows only APPROVED
- [ ] Filter by Rejected → Shows only REJECTED
- [ ] Filter by Edited → Shows only EDITED
- [ ] Search by claim text works
- [ ] Search by rejection reason works

### PDF Generation
- [ ] Try to generate with only pending claims → Error
- [ ] Approve some claims → PDF generates
- [ ] PDF includes only approved/edited claims
- [ ] PDF shows edited text if available
- [ ] PDF shows claim types

### Auto-Linking
- [ ] Pending claims not auto-linked
- [ ] Approved claims trigger auto-linking
- [ ] Edited claims trigger auto-linking
- [ ] Rejected claims never linked

---

## Statistics Dashboard

The claims page now shows:
- **Total claims**: All extracted items
- **Pending**: Need review
- **Approved**: Confirmed as real claims
- **Edited**: User-modified claims
- **Rejected**: Not claims (filtered out)

Example: "47 total | 23 pending | 15 approved | 5 edited | 4 rejected"

---

## Key Improvements

1. **Quality Control**: Human review ensures only real claims proceed
2. **Audit Trail**: Track who reviewed, when, and why rejected
3. **Flexibility**: Edit claims to fix extraction errors
4. **Efficiency**: Bulk actions for large documents
5. **Compliance**: Only approved claims in regulatory submissions
6. **Transparency**: AI confidence and reasoning visible to users

---

## Future Enhancements

- [ ] ML model fine-tuning based on user approve/reject patterns
- [ ] Claim similarity detection (flag duplicates)
- [ ] Claim strength scoring (strong vs weak claims)
- [ ] Reference suggestion based on claim type
- [ ] Export rejected claims report for QA
- [ ] Keyboard shortcuts for fast review
- [ ] Mobile-friendly review interface

---

## Troubleshooting

### TypeScript errors after schema changes
```bash
npx prisma generate
# Restart VS Code / TypeScript server
```

### Claims not showing new fields
- Clear browser cache
- Check migration applied: `npx prisma migrate status`

### PDF generation fails
- Ensure at least 1 claim is APPROVED or EDITED
- Check all approved claims have links

### Auto-linking not working
- Verify OpenAI API key is set
- Check claim status is APPROVED or EDITED
- Look for errors in server logs

---

## Support

For questions or issues, see:
- Full Python spec: `docs/PYTHON_EXTRACTOR_SPEC.md`
- Environment variables: `docs/ENVIRONMENT_VARIABLES.md`
- Database schema: `prisma/schema.prisma`
