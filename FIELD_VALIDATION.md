# Frontend Field Storage & Retrieval Validation

## Data Model

| Collection | Purpose | Fields |
|------------|---------|--------|
| **startups** (profile) | Lean index for search/filtering | companyName, vertical, stage, location, website, linkedIn |
| **startup-memos** (memo) | Full memo for display | All fields below |

---

## Field Validation Matrix

### Company Info (Step 0/1)

| Frontend Field | Profile | Memo Key | Stored By | Retrieved By | Status |
|----------------|---------|----------|-----------|--------------|--------|
| companyName | ✓ companyName | company_name | Onboarding, MemoPage, ProfilePage, MemoEditor | buildPrefill, buildPrefillFromProfile | ✓ |
| website | ✓ website | website | All | Both | ✓ |
| linkedIn | ✓ linkedIn | linkedIn | All | Both | ✓ |
| vertical | ✓ vertical | vertical | All | Both | ✓ |
| stage | ✓ stage | stage | All | Both | ✓ |
| location | ✓ location | location | All | Both | ✓ |
| startupLogoUrl | — | logo_url | Onboarding, MemoPage, ProfilePage | buildPrefill (logo_url) | ✓ |
| pitchdeckUrl | — | pitchdeck_url | All | buildPrefill | ✓ |
| pitchdeckName | — | pitchdeck_name | All | buildPrefill | ✓ |

### Team & Overview (Step 2)

| Frontend Field | Memo Key | Stored By | Retrieved By | Status |
|----------------|----------|-----------|--------------|--------|
| companyOverview | business_model | Onboarding, MemoPage, ProfilePage, MemoEditor | buildPrefill | ✓ |
| teamMembers | team_members | All | toTeamMembers() | ✓ |

### Value Proposition (Step 3) – application_sections.section2

| Frontend Field | Memo Key | Stored By | Retrieved By | Status |
|----------------|----------|-----------|--------------|--------|
| currentPainPoint | section2.currentPainPoint | Onboarding, MemoPage | buildPrefill (section2) | ✓ |
| valueDrivers | section2.valueDrivers | Onboarding, MemoPage | buildPrefill | ✓ |
| valueDriverExplanations | section2.valueDriverExplanations | Onboarding, MemoPage | buildPrefill | ✓ |

### Business Model (Step 4) – application_sections.section3

| Frontend Field | Memo Key | Stored By | Retrieved By | Status |
|----------------|----------|-----------|--------------|--------|
| customerType | section3.customerType | Onboarding, MemoPage | buildPrefill | ✓ |
| customerTypeExplanation | section3.customerTypeExplanation | Onboarding, MemoPage | buildPrefill | ✓ |
| businessStructure | section3.businessStructure | Onboarding, MemoPage | buildPrefill | ✓ |
| pricingStrategies | section3.pricingStrategies | Onboarding, MemoPage | buildPrefill | ✓ |
| previousInvestors | section3.previousInvestors | Onboarding, MemoPage | buildPrefill | ✓ |
| leadInvestor | section3.leadInvestor | Onboarding, MemoPage | buildPrefill | ✓ |
| roundDetails | section3.roundDetails | Onboarding, MemoPage | buildPrefill | ✓ |
| fundingUse | section3.fundingUse | Onboarding, MemoPage | buildPrefill | ✓ |
| subscriptionType | section3.subscriptionType | Onboarding, MemoPage | buildPrefill | ✓ |
| subscriptionBillingCycle | section3.subscriptionBillingCycle | Onboarding, MemoPage | buildPrefill | ✓ |
| subscriptionTiers | section3.subscriptionTiers | Onboarding, MemoPage | buildPrefill | ✓ |
| transactionFeeType | section3.transactionFeeType | Onboarding, MemoPage | buildPrefill | ✓ |
| transactionFeePercentage | section3.transactionFeePercentage | Onboarding, MemoPage | buildPrefill | ✓ |
| licensingModel | section3.licensingModel | Onboarding, MemoPage | buildPrefill | ✓ |
| adRevenueModel | section3.adRevenueModel | Onboarding, MemoPage | buildPrefill | ✓ |
| serviceType | section3.serviceType | Onboarding, MemoPage | buildPrefill | ✓ |
| revenueMetrics | section3.revenueMetrics | Onboarding, MemoPage | buildPrefill | ✓ |
| revenueMetricsValues | section3.revenueMetricsValues | Onboarding, MemoPage | buildPrefill | ✓ |

### Go-to-Market (Step 5) – application_sections.section4

| Frontend Field | Memo Key | Stored By | Retrieved By | Status |
|----------------|----------|-----------|--------------|--------|
| gtmAcquisition | section4.gtmAcquisition | Onboarding, MemoPage | buildPrefill | ✓ |
| gtmTimeline | section4.gtmTimeline | Onboarding, MemoPage | buildPrefill | ✓ |

### Customer & Market (Step 6) – application_sections.section5

| Frontend Field | Memo Key | Stored By | Retrieved By | Status |
|----------------|----------|-----------|--------------|--------|
| targetGeography | section5.targetGeography | Onboarding, MemoPage | buildPrefill | ✓ |
| targetCustomerDescription | section5.targetCustomerDescription | Onboarding, MemoPage | buildPrefill | ✓ |
| tamValue | section5.tamValue | Onboarding, MemoPage | buildPrefill | ✓ |
| tamCalculationMethod | section5.tamCalculationMethod | Onboarding, MemoPage | buildPrefill | ✓ |
| tamBreakdown | section5.tamBreakdown | Onboarding, MemoPage | buildPrefill | ✓ |
| samValue | section5.samValue | Onboarding, MemoPage | buildPrefill | ✓ |
| samBreakdown | section5.samBreakdown | Onboarding, MemoPage | buildPrefill | ✓ |
| somValue | section5.somValue | Onboarding, MemoPage | buildPrefill | ✓ |
| somTimeframe | section5.somTimeframe | Onboarding, MemoPage | buildPrefill | ✓ |
| somBreakdown | section5.somBreakdown | Onboarding, MemoPage | buildPrefill | ✓ |

### Competitors (Step 7) – application_sections.section6

| Frontend Field | Memo Key | Stored By | Retrieved By | Status |
|----------------|----------|-----------|--------------|--------|
| competitors | section6.competitors | Onboarding, MemoPage | toCompetitors() | ✓ |
| competitiveMoat | section6.competitiveMoat | Onboarding, MemoPage | buildPrefill | ✓ |

### MemoEditor-only

| Frontend Field | Memo Key | Stored By | Retrieved By | Status |
|----------------|----------|-----------|--------------|--------|
| traction | traction | MemoEditor | application.traction | ✓ |

---

## Save Paths Summary

| Flow | Profile Payload | Memo Payload |
|------|-----------------|--------------|
| **StartupOnboarding** | Lean (6 fields) | Full via onboardingToMemoPayload + logo/pitchdeck |
| **StartupMemoPage** | Lean (6 fields) | Full via onboardingToMemoPayload + logo/pitchdeck |
| **StartupProfilePage** | Lean (6 fields) | Identifiers + overview + team + logo + pitch deck |
| **MemoEditor** | Lean (6 fields) | formData + draftSections + draftTeamMembers + traction |

---

## Load Paths Summary

| Page | Source | Mapper |
|------|--------|-------|
| **StartupMemoPage** | profile + memo (merged) | buildPrefill |
| **StartupProfilePage** | profile + memo (merged) | buildPrefillFromProfile |
| **MemoEditor** | existingMemo (enrichedForPreview) | Direct (application prop) |

---

## Fix Applied

- **enrichedForPreview** now explicitly includes `linkedIn` in the fallback chain so it is preserved when merging profile + memo.
