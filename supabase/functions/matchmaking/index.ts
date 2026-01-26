import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Canonical Taxonomy & Normalization

const CANONICAL_SECTORS = [
  'AI/ML', 'FinTech', 'Health', 'Climate', 'DevTools',
  'Consumer', 'Marketplace', 'SaaS', 'Biotech', 'Other'
];

const CANONICAL_STAGES = ['Pre-seed', 'Seed', 'Series A', 'Series B+'];

const SECTOR_MAPPING: Record<string, string[]> = {
  'artificial intelligence': ['AI/ML'],
  'machine learning': ['AI/ML'],
  'ai': ['AI/ML'],
  'fintech': ['FinTech'],
  'financial': ['FinTech'],
  'banking': ['FinTech'],
  'payments': ['FinTech'],
  'health': ['Health'],
  'healthcare': ['Health'],
  'medical': ['Health', 'Biotech'],
  'biotech': ['Biotech'],
  'climate': ['Climate'],
  'cleantech': ['Climate'],
  'sustainability': ['Climate'],
  'developer': ['DevTools'],
  'devtools': ['DevTools'],
  'infrastructure': ['DevTools', 'SaaS'],
  'consumer': ['Consumer'],
  'd2c': ['Consumer'],
  'marketplace': ['Marketplace'],
  'saas': ['SaaS'],
  'software': ['SaaS'],
  'enterprise': ['SaaS'],
  'b2b': ['SaaS'],
};

const STAGE_MAPPING: Record<string, string> = {
  'pre-seed': 'Pre-seed',
  'preseed': 'Pre-seed',
  'idea': 'Pre-seed',
  'seed': 'Seed',
  'series a': 'Series A',
  'series-a': 'Series A',
  'a': 'Series A',
  'series b': 'Series B+',
  'series-b': 'Series B+',
  'b': 'Series B+',
  'series c': 'Series B+',
  'growth': 'Series B+',
};

const GEO_TOKENS: Record<string, string[]> = {
  'boston': ['Boston', 'Northeast', 'US', 'North America'],
  'new york': ['Northeast', 'US', 'North America'],
  'nyc': ['Northeast', 'US', 'North America'],
  'san francisco': ['Bay Area', 'US', 'North America'],
  'sf': ['Bay Area', 'US', 'North America'],
  'silicon valley': ['Bay Area', 'US', 'North America'],
  'california': ['US', 'North America'],
  'northeast': ['Northeast', 'US', 'North America'],
  'usa': ['US', 'North America'],
  'us': ['US', 'North America'],
  'united states': ['US', 'North America'],
  'north america': ['North America'],
  'europe': ['Europe', 'Global'],
  'uk': ['Europe', 'Global'],
  'india': ['India', 'Asia', 'Global'],
  'asia': ['Asia', 'Global'],
  'global': ['Global'],
  'worldwide': ['Global'],
};

// Scoring Weights

const WEIGHTS = {
  sector_fit: 20,
  stage_fit: 18,
  geography_fit: 12,
  business_model_fit: 12,
  thesis_similarity: 18,
  why_yes_alignment: 10,
  value_add_fit: 10,
};

// Normalization Functions

function normalizeFounder(founder: any): NormalizedFounder {
  const applicationSections = founder.application_sections || {};
  
  // Extract data from application sections
  const companyInfo = applicationSections.company_information || {};
  const teamOverview = applicationSections.your_team_company_overview || {};
  const valueProposition = applicationSections.value_proposition || {};
  const businessModelSection = applicationSections.business_model || {};
  const goToMarket = applicationSections.go_to_market || {};
  const marketSizing = applicationSections.market_sizing || {};
  
  // Build text blob for thesis matching
  const textParts = [
    teamOverview.company_pitch || '',
    valueProposition.problem_statement || '',
    businessModelSection.business_structure || '',
    goToMarket.acquisition_strategy || '',
    marketSizing.ideal_customer_profile || '',
    goToMarket.gtm_timeline || '',
    founder.traction || '',
    founder.current_ask || '',
  ].filter(Boolean);
  
  const textBlob = textParts.join(' ');
  
  // Map vertical to canonical sectors
  const sectorTags = mapToSectors(founder.vertical || '');
  
  // Map stage to canonical
  const normalizedStage = mapToStage(founder.stage || '');
  
  // Extract geo tokens
  const geoTokens = extractGeoTokens([
    founder.location || '',
    marketSizing.target_geography || '',
  ].join(' '));
  
  // Extract business model info
  const customerType = businessModelSection.customer_type || founder.business_model || '';
  const pricingStrategies = businessModelSection.pricing_strategy || [];
  
  // Value delivery types for "why yes" matching
  const valueDeliveryTypes = valueProposition.value_delivery_types || [];
  
  return {
    id: founder.id,
    user_id: founder.user_id,
    company_name: founder.company_name,
    founder_name: founder.founder_name,
    website: founder.website,
    vertical: founder.vertical,
    stage: founder.stage,
    normalized_stage: normalizedStage,
    location: founder.location,
    funding_goal: founder.funding_goal,
    sector_tags: sectorTags,
    geo_tokens: geoTokens,
    text_blob: textBlob,
    customer_type: customerType,
    pricing_strategies: Array.isArray(pricingStrategies) ? pricingStrategies : [pricingStrategies],
    value_delivery_types: valueDeliveryTypes,
    traction: founder.traction,
    business_model: founder.business_model,
    // Additional fields for display
    company_pitch: teamOverview.company_pitch || '',
    problem_statement: valueProposition.problem_statement || '',
    acquisition_strategy: goToMarket.acquisition_strategy || '',
    ideal_customer_profile: marketSizing.ideal_customer_profile || '',
    tam_value: marketSizing.tam_value || '',
    sam_value: marketSizing.sam_value || '',
    som_value: marketSizing.som_value || '',
    team_members: founder.team_members || [],
  };
}

function normalizeInvestor(investor: any): NormalizedInvestor {
  // Build text blob for thesis matching
  const textParts = [
    investor.firm_description || '',
    investor.thesis_statement || '',
    investor.sub_themes || '',
    investor.sub_themes_other || '',
    Array.isArray(investor.fast_signals) ? investor.fast_signals.join(' ') : '',
  ].filter(Boolean);
  
  const textBlob = textParts.join(' ');
  
  // Extract canonical sector tags
  const sectorTags = Array.isArray(investor.sector_tags) 
    ? investor.sector_tags.filter((s: string) => CANONICAL_SECTORS.includes(s))
    : [];
  
  // Extract stage focus
  const stageFocus = Array.isArray(investor.stage_focus)
    ? investor.stage_focus.map((s: string) => mapToStage(s)).filter(Boolean)
    : [];
  
  // Extract geo tokens
  const geoText = [
    investor.hq_location || '',
    investor.geographic_focus || '',
    investor.geographic_focus_detail || '',
    Array.isArray(investor.geographies_covered) ? investor.geographies_covered.join(' ') : '',
  ].join(' ');
  
  const geoTokens = extractGeoTokens(geoText);
  
  // Parse exclusions from hard_nos
  const exclusions = parseExclusions(investor.hard_nos || []);
  
  // Extract non-negotiables
  const nonNegotiables = investor.non_negotiables || {};
  
  return {
    id: investor.id,
    user_id: investor.user_id,
    firm_name: investor.firm_name,
    website: investor.website,
    hq_location: investor.hq_location,
    firm_description: investor.firm_description,
    aum: investor.aum,
    fund_vintage: investor.fund_vintage,
    fund_type: investor.fund_type,
    ownership_target: investor.ownership_target,
    lead_follow: investor.lead_follow,
    portfolio_count: investor.portfolio_count,
    top_investments: investor.top_investments,
    sector_tags: sectorTags,
    stage_focus: stageFocus,
    check_sizes: investor.check_sizes || [],
    geo_tokens: geoTokens,
    geographic_focus: investor.geographic_focus,
    thesis_statement: investor.thesis_statement,
    sub_themes: investor.sub_themes,
    text_blob: textBlob,
    // Exclusions
    excluded_sectors: exclusions.sectors,
    excluded_geos: exclusions.geos,
    excluded_biz_models: exclusions.bizModels,
    // Preferences
    b2b_b2c_preference: investor.b2b_b2c,
    revenue_model_preferences: investor.revenue_models || [],
    customer_type_preference: investor.customer_types || [],
    minimum_traction: investor.minimum_traction || [],
    ranked_metrics: investor.ranked_metrics || [],
    pain_severity_preference: investor.pain_severity,
    fast_signals: investor.fast_signals || [],
    non_negotiables: nonNegotiables,
    // Process info
    time_to_first_response: investor.time_to_first_response,
    time_to_decision: investor.time_to_decision,
    gives_feedback: investor.gives_no_with_feedback,
    // Value add
    operating_support: investor.operating_support || [],
    customer_verticals: investor.customer_verticals,
    partner_categories: investor.partner_categories,
    talent_networks: investor.talent_networks || [],
    support_style: investor.support_style,
    // Other
    public_profile: investor.public_profile,
    contacts: investor.contacts || [],
  };
}

function mapToSectors(vertical: string): string[] {
  const lowerVertical = vertical.toLowerCase();
  
  // Check direct mapping first
  for (const [key, sectors] of Object.entries(SECTOR_MAPPING)) {
    if (lowerVertical.includes(key)) {
      return sectors;
    }
  }
  
  // Check if it's already a canonical sector
  const matchedCanonical = CANONICAL_SECTORS.find(
    s => s.toLowerCase() === lowerVertical
  );
  if (matchedCanonical) {
    return [matchedCanonical];
  }
  
  return ['Other'];
}

function mapToStage(stage: string): string {
  const lowerStage = stage.toLowerCase().trim();
  
  // Check direct mapping
  if (STAGE_MAPPING[lowerStage]) {
    return STAGE_MAPPING[lowerStage];
  }
  
  // Check if it's already canonical
  const matchedCanonical = CANONICAL_STAGES.find(
    s => s.toLowerCase() === lowerStage
  );
  if (matchedCanonical) {
    return matchedCanonical;
  }
  
  // Default to Pre-seed for unknown
  return 'Pre-seed';
}

function extractGeoTokens(text: string): string[] {
  const tokens = new Set<string>();
  const lowerText = text.toLowerCase();
  
  for (const [key, geoSet] of Object.entries(GEO_TOKENS)) {
    if (lowerText.includes(key)) {
      geoSet.forEach(t => tokens.add(t));
    }
  }
  
  // If no tokens found, assume Global
  if (tokens.size === 0) {
    tokens.add('Global');
  }
  
  return Array.from(tokens);
}

function parseExclusions(hardNos: any[]): { sectors: string[], geos: string[], bizModels: string[] } {
  const sectors: string[] = [];
  const geos: string[] = [];
  const bizModels: string[] = [];
  
  if (!Array.isArray(hardNos)) {
    return { sectors, geos, bizModels };
  }
  
  for (const item of hardNos) {
    const lowerItem = (typeof item === 'string' ? item : '').toLowerCase();
    
    // Check for sector exclusions
    for (const sector of CANONICAL_SECTORS) {
      if (lowerItem.includes(sector.toLowerCase())) {
        sectors.push(sector);
      }
    }
    
    // Check for geo exclusions
    for (const [key, geoSet] of Object.entries(GEO_TOKENS)) {
      if (lowerItem.includes(key)) {
        geoSet.forEach(g => geos.push(g));
      }
    }
    
    // Check for business model exclusions
    if (lowerItem.includes('b2c')) bizModels.push('B2C');
    if (lowerItem.includes('b2b')) bizModels.push('B2B');
    if (lowerItem.includes('subscription')) bizModels.push('Subscription');
    if (lowerItem.includes('advertising')) bizModels.push('Advertising');
  }
  
  return { sectors, geos, bizModels };
}

// Hard Filter Layer

interface FilterResult {
  blocked: boolean;
  blockReason?: string;
  softWarnings: string[];
}

function applyHardFilters(founder: NormalizedFounder, investor: NormalizedInvestor): FilterResult {
  const softWarnings: string[] = [];
  
  // 3.1 Hard blocks
  
  // Sector exclusion
  const sectorOverlap = founder.sector_tags.some(s => investor.excluded_sectors.includes(s));
  if (sectorOverlap) {
    return {
      blocked: true,
      blockReason: 'Sector is in investor exclusion list',
      softWarnings: [],
    };
  }
  
  // Geography exclusion
  const geoConflict = founder.geo_tokens.some(g => investor.excluded_geos.includes(g));
  if (geoConflict && !founder.geo_tokens.includes('Global') && !investor.geo_tokens.includes('Global')) {
    return {
      blocked: true,
      blockReason: 'Geography conflict with investor restrictions',
      softWarnings: [],
    };
  }
  
  // Business model exclusion
  const bizModelConflict = investor.excluded_biz_models.some(bm => {
    const founderBizLower = (founder.customer_type || '').toLowerCase();
    return founderBizLower.includes(bm.toLowerCase());
  });
  if (bizModelConflict) {
    return {
      blocked: true,
      blockReason: 'Business model is in investor exclusion list',
      softWarnings: [],
    };
  }
  
  // 3.2 Soft warnings (do not block)
  
  // Stage mismatch
  if (investor.stage_focus.length > 0 && !investor.stage_focus.includes(founder.normalized_stage)) {
    softWarnings.push(`Stage focus mismatch: investor focuses on ${investor.stage_focus.join(', ')}, you are ${founder.normalized_stage}`);
  }
  
  // Customer type mismatch
  if (investor.b2b_b2c_preference) {
    const founderType = (founder.customer_type || '').toLowerCase();
    const investorPref = investor.b2b_b2c_preference.toLowerCase();
    if (investorPref !== 'both' && !founderType.includes(investorPref) && founderType !== 'both') {
      softWarnings.push(`Customer type preference: investor prefers ${investor.b2b_b2c_preference}`);
    }
  }
  
  // Revenue model mismatch
  if (investor.revenue_model_preferences.length > 0 && founder.pricing_strategies.length > 0) {
    const hasOverlap = founder.pricing_strategies.some(ps => 
      investor.revenue_model_preferences.some((rm: string) => 
        rm.toLowerCase().includes(ps.toLowerCase()) || ps.toLowerCase().includes(rm.toLowerCase())
      )
    );
    if (!hasOverlap) {
      softWarnings.push(`Revenue model preference mismatch: investor prefers ${investor.revenue_model_preferences.slice(0, 2).join(', ')}`);
    }
  }
  
  return {
    blocked: false,
    softWarnings,
  };
}

// Compatibility Scoring

interface ScoreBreakdown {
  sector_fit: number;
  stage_fit: number;
  geography_fit: number;
  business_model_fit: number;
  thesis_similarity: number;
  why_yes_alignment: number;
  value_add_fit: number;
  total: number;
}

function calculateCompatibilityScore(
  founder: NormalizedFounder, 
  investor: NormalizedInvestor,
  thesisSimilarity: number = 0
): ScoreBreakdown {
  // A) Sector fit (0-1)
  let sectorScore = 0;
  if (investor.sector_tags.length === 0) {
    sectorScore = 0.7; // No preference = decent fit
  } else {
    const overlap = founder.sector_tags.filter(s => investor.sector_tags.includes(s));
    if (overlap.length > 0) {
      sectorScore = 1;
    } else {
      // Check for adjacent sectors (simplified)
      sectorScore = 0.3;
    }
  }
  
  // B) Stage fit (0-1)
  let stageScore = 0;
  if (investor.stage_focus.length === 0) {
    stageScore = 0.7;
  } else if (investor.stage_focus.includes(founder.normalized_stage)) {
    stageScore = 1;
  } else {
    // Check if 1 stage away
    const founderIdx = CANONICAL_STAGES.indexOf(founder.normalized_stage);
    const closestDist = Math.min(
      ...investor.stage_focus.map(s => Math.abs(CANONICAL_STAGES.indexOf(s) - founderIdx))
    );
    stageScore = closestDist === 1 ? 0.6 : 0.2;
  }
  
  // C) Geography fit (0-1)
  let geoScore = 0.5; // Default to partial
  const geoOverlap = founder.geo_tokens.filter(g => investor.geo_tokens.includes(g));
  if (geoOverlap.length > 0) {
    geoScore = 1;
  } else if (investor.geo_tokens.includes('Global') || founder.geo_tokens.includes('Global')) {
    geoScore = 0.8;
  }
  
  // D) Business model fit (0-1)
  let bizModelScore = 0.5;
  // Customer type match
  const founderType = (founder.customer_type || '').toLowerCase();
  const investorPref = (investor.b2b_b2c_preference || '').toLowerCase();
  if (!investorPref || investorPref === 'both') {
    bizModelScore = 0.7;
  } else if (founderType.includes(investorPref) || founderType === 'both') {
    bizModelScore = 1;
  } else {
    bizModelScore = 0.3;
  }
  
  // Revenue model adjustment
  if (investor.revenue_model_preferences.length > 0 && founder.pricing_strategies.length > 0) {
    const hasOverlap = founder.pricing_strategies.some(ps => 
      investor.revenue_model_preferences.some((rm: string) => 
        rm.toLowerCase().includes(ps.toLowerCase())
      )
    );
    bizModelScore = hasOverlap ? Math.min(bizModelScore + 0.2, 1) : bizModelScore * 0.8;
  }
  
  // E) Thesis similarity (0-1) - provided externally via AI
  const thesisScore = thesisSimilarity;
  
  // F) "Why yes" alignment (0-1)
  let whyYesScore = 0.5;
  if (investor.fast_signals.length > 0 && founder.value_delivery_types.length > 0) {
    // Simple keyword matching
    const founderKeywords = founder.value_delivery_types.map((v: string) => v.toLowerCase());
    const investorSignals = investor.fast_signals.map((s: string) => s.toLowerCase());
    
    // Check for alignment
    const aligned = founderKeywords.some(fk => 
      investorSignals.some(is => is.includes(fk) || fk.includes(is))
    );
    whyYesScore = aligned ? 0.8 : 0.4;
  }
  
  // Pain severity alignment
  if (investor.pain_severity_preference) {
    const founderHasUrgency = founder.value_delivery_types.some((v: string) => 
      v.toLowerCase().includes('urgency') || v.toLowerCase().includes('severity')
    );
    if (investor.pain_severity_preference.toLowerCase().includes('high') && founderHasUrgency) {
      whyYesScore = Math.min(whyYesScore + 0.2, 1);
    }
  }
  
  // G) Value-add fit (0-1)
  let valueAddScore = 0.5;
  const founderGTM = (founder.acquisition_strategy || '').toLowerCase();
  const founderICP = (founder.ideal_customer_profile || '').toLowerCase();
  
  // Check operating support alignment
  if (investor.operating_support.length > 0) {
    const supportKeywords = investor.operating_support.map((s: string) => s.toLowerCase());
    const hasRelevantSupport = supportKeywords.some(sk => 
      founderGTM.includes(sk) || founderICP.includes(sk) ||
      sk.includes('gtm') || sk.includes('sales') || sk.includes('marketing')
    );
    valueAddScore = hasRelevantSupport ? 0.8 : 0.5;
  }
  
  // Customer vertical intros alignment
  if (investor.customer_verticals) {
    const verticals = investor.customer_verticals.toLowerCase();
    if (founderICP && (verticals.includes(founder.vertical?.toLowerCase() || '') || 
        founder.sector_tags.some(s => verticals.includes(s.toLowerCase())))) {
      valueAddScore = Math.min(valueAddScore + 0.2, 1);
    }
  }
  
  // Calculate weighted total
  const total = 
    sectorScore * WEIGHTS.sector_fit +
    stageScore * WEIGHTS.stage_fit +
    geoScore * WEIGHTS.geography_fit +
    bizModelScore * WEIGHTS.business_model_fit +
    thesisScore * WEIGHTS.thesis_similarity +
    whyYesScore * WEIGHTS.why_yes_alignment +
    valueAddScore * WEIGHTS.value_add_fit;
  
  return {
    sector_fit: Math.round(sectorScore * 100),
    stage_fit: Math.round(stageScore * 100),
    geography_fit: Math.round(geoScore * 100),
    business_model_fit: Math.round(bizModelScore * 100),
    thesis_similarity: Math.round(thesisScore * 100),
    why_yes_alignment: Math.round(whyYesScore * 100),
    value_add_fit: Math.round(valueAddScore * 100),
    total: Math.round(total),
  };
}

// Explainability

interface Explanation {
  why_this_match: string[];
  potential_concerns: string[];
  improvement_suggestions: string[];
}

function generateExplanation(
  founder: NormalizedFounder,
  investor: NormalizedInvestor,
  scores: ScoreBreakdown,
  filterResult: FilterResult
): Explanation {
  const whyThisMatch: string[] = [];
  const potentialConcerns: string[] = [];
  const improvements: string[] = [];
  
  // Generate "Why this match" - top 3 reasons
  const scoreComponents = [
    { key: 'sector_fit', score: scores.sector_fit, reason: generateSectorReason(founder, investor) },
    { key: 'stage_fit', score: scores.stage_fit, reason: generateStageReason(founder, investor) },
    { key: 'geography_fit', score: scores.geography_fit, reason: generateGeoReason(founder, investor) },
    { key: 'business_model_fit', score: scores.business_model_fit, reason: generateBizModelReason(founder, investor) },
    { key: 'thesis_similarity', score: scores.thesis_similarity, reason: generateThesisReason(founder, investor) },
    { key: 'value_add_fit', score: scores.value_add_fit, reason: generateValueAddReason(founder, investor) },
  ];
  
  // Sort by score and take top 3
  scoreComponents.sort((a, b) => b.score - a.score);
  whyThisMatch.push(...scoreComponents.slice(0, 3).map(c => c.reason).filter(Boolean));
  
  // Add soft warnings as potential concerns
  potentialConcerns.push(...filterResult.softWarnings.slice(0, 2));
  
  // Add concerns for low scores
  if (scores.stage_fit < 50 && !filterResult.softWarnings.some(w => w.includes('Stage'))) {
    potentialConcerns.push(`Their stage focus may not fully align with your current stage`);
  }
  if (scores.geography_fit < 50) {
    potentialConcerns.push(`Geographic focus may be limited for your target markets`);
  }
  
  // Generate improvement suggestions for founder
  if (founder.text_blob.length < 100) {
    improvements.push('Add more detail to your company pitch and problem statement to improve thesis matching');
  }
  if (!founder.ideal_customer_profile || founder.ideal_customer_profile.length < 30) {
    improvements.push('Clarify your ideal customer profile to match with investors focused on specific verticals');
  }
  if (founder.geo_tokens.length === 1 && founder.geo_tokens.includes('Global')) {
    improvements.push('Specify your primary target geography for better regional investor matching');
  }
  if (founder.pricing_strategies.length === 0) {
    improvements.push('Add your pricing/revenue model to match with investors who prefer specific business models');
  }
  
  return {
    why_this_match: whyThisMatch.slice(0, 3),
    potential_concerns: potentialConcerns.slice(0, 2),
    improvement_suggestions: improvements.slice(0, 3),
  };
}

function generateSectorReason(founder: NormalizedFounder, investor: NormalizedInvestor): string {
  const overlap = founder.sector_tags.filter(s => investor.sector_tags.includes(s));
  if (overlap.length > 0) {
    return `Sector alignment: invests in ${overlap.join(', ')} which matches your ${founder.vertical} focus`;
  }
  return `Invests across sectors including ${investor.sector_tags.slice(0, 2).join(', ')}`;
}

function generateStageReason(founder: NormalizedFounder, investor: NormalizedInvestor): string {
  if (investor.stage_focus.includes(founder.normalized_stage)) {
    return `Stage match: actively invests at ${founder.normalized_stage} stage`;
  }
  return `Invests from ${investor.stage_focus[0] || 'early'} stage`;
}

function generateGeoReason(founder: NormalizedFounder, investor: NormalizedInvestor): string {
  const overlap = founder.geo_tokens.filter(g => investor.geo_tokens.includes(g));
  if (overlap.length > 0) {
    return `Geographic fit: covers ${overlap[0]} where you're based/targeting`;
  }
  return `Geographic coverage includes ${investor.geo_tokens.slice(0, 2).join(', ')}`;
}

function generateBizModelReason(founder: NormalizedFounder, investor: NormalizedInvestor): string {
  if (investor.b2b_b2c_preference) {
    return `Business model alignment: invests in ${investor.b2b_b2c_preference} companies`;
  }
  return 'Flexible on business model types';
}

function generateThesisReason(founder: NormalizedFounder, investor: NormalizedInvestor): string {
  if (investor.thesis_statement) {
    const thesisPreview = investor.thesis_statement.slice(0, 80);
    return `Thesis alignment: "${thesisPreview}..."`;
  }
  if (investor.sub_themes) {
    return `Investment themes include: ${investor.sub_themes.slice(0, 60)}...`;
  }
  return 'General investment thesis aligns with your space';
}

function generateValueAddReason(founder: NormalizedFounder, investor: NormalizedInvestor): string {
  if (investor.operating_support.length > 0) {
    return `Value-add: provides ${investor.operating_support.slice(0, 2).join(', ')} support`;
  }
  if (investor.customer_verticals) {
    return `Can provide customer intros in ${investor.customer_verticals.slice(0, 40)}...`;
  }
  return 'Active portfolio support and networks';
}

// Ranking & Diversity

interface MatchResult {
  investor: NormalizedInvestor;
  match_score: number;
  match_label: string;
  fit_breakdown: ScoreBreakdown;
  explanation: Explanation;
}

function getMatchLabel(score: number): string {
  if (score >= 85) return 'Strong fit';
  if (score >= 70) return 'Good fit';
  if (score >= 55) return 'Potential fit';
  return 'Low fit';
}

function applyDiversityAndRanking(matches: MatchResult[]): MatchResult[] {
  // Sort by score first
  matches.sort((a, b) => b.match_score - a.match_score);
  
  // Apply responsiveness boost
  matches.forEach(m => {
    // Boost for fast response time
    if (m.investor.time_to_first_response?.toLowerCase().includes('24') || 
        m.investor.time_to_first_response?.toLowerCase().includes('48')) {
      m.match_score = Math.min(m.match_score + 3, 100);
    }
    
    // Boost for giving feedback
    if (m.investor.gives_feedback) {
      m.match_score = Math.min(m.match_score + 2, 100);
    }
  });
  
  // Re-sort after boosts
  matches.sort((a, b) => b.match_score - a.match_score);
  
  // Apply diversity constraints to top 10
  const diversified: MatchResult[] = [];
  const seenSectors = new Map<string, number>();
  const seenCheckSizes = new Map<string, number>();
  
  for (const match of matches) {
    // Check sector diversity
    const primarySector = match.investor.sector_tags[0] || 'Other';
    const sectorCount = seenSectors.get(primarySector) || 0;
    
    // Allow max 3 of same primary sector in top 10
    if (diversified.length < 10 && sectorCount >= 3) {
      // Push to later in the list
      diversified.push(match);
      continue;
    }
    
    diversified.push(match);
    seenSectors.set(primarySector, sectorCount + 1);
  }
  
  return diversified;
}

// AI-Powered Thesis Similarity

async function calculateThesisSimilarities(
  founder: NormalizedFounder,
  investors: NormalizedInvestor[]
): Promise<Map<string, number>> {
  const similarities = new Map<string, number>();
  
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY || investors.length === 0) {
    // Return default scores if no API key
    investors.forEach(inv => similarities.set(inv.id, 0.5));
    return similarities;
  }
  
  // Batch process for efficiency (max 5 at a time)
  const batches = [];
  for (let i = 0; i < investors.length; i += 5) {
    batches.push(investors.slice(i, i + 5));
  }
  
  for (const batch of batches) {
    try {
      const prompt = `You are analyzing startup-investor fit. Score the thesis alignment between this startup and each investor on a scale of 0 to 1.

STARTUP PROFILE:
Company: ${founder.company_name}
Vertical: ${founder.vertical}
Stage: ${founder.stage}
Description: ${founder.text_blob.slice(0, 500)}

INVESTORS TO SCORE:
${batch.map((inv, idx) => `
${idx + 1}. ${inv.firm_name}
Thesis: ${inv.thesis_statement || 'Not specified'}
Focus: ${inv.sector_tags.join(', ')}
Themes: ${inv.sub_themes || 'Not specified'}
`).join('\n')}

Return ONLY a JSON object with investor IDs and scores, nothing else:
{"scores": {"${batch.map(inv => inv.id).join('": 0.0, "')}": 0.0}}`;
      
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-lite",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        const content = result.choices?.[0]?.message?.content || '';
        
        // Parse JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.scores) {
            for (const [id, score] of Object.entries(parsed.scores)) {
              similarities.set(id, Math.max(0, Math.min(1, Number(score) || 0.5)));
            }
          }
        }
      }
    } catch (error) {
      console.error('Thesis similarity error:', error);
      // Default scores for failed batch
      batch.forEach(inv => {
        if (!similarities.has(inv.id)) {
          similarities.set(inv.id, 0.5);
        }
      });
    }
  }
  
  // Ensure all investors have a score
  investors.forEach(inv => {
    if (!similarities.has(inv.id)) {
      similarities.set(inv.id, 0.5);
    }
  });
  
  return similarities;
}

// Types

interface NormalizedFounder {
  id: string;
  user_id: string;
  company_name: string;
  founder_name: string;
  website: string;
  vertical: string;
  stage: string;
  normalized_stage: string;
  location: string;
  funding_goal: string;
  sector_tags: string[];
  geo_tokens: string[];
  text_blob: string;
  customer_type: string;
  pricing_strategies: string[];
  value_delivery_types: string[];
  traction: string;
  business_model: string;
  company_pitch: string;
  problem_statement: string;
  acquisition_strategy: string;
  ideal_customer_profile: string;
  tam_value: string;
  sam_value: string;
  som_value: string;
  team_members: any[];
}

interface NormalizedInvestor {
  id: string;
  user_id: string;
  firm_name: string;
  website: string;
  hq_location: string;
  firm_description: string;
  aum: string;
  fund_vintage: string;
  fund_type: string;
  ownership_target: string;
  lead_follow: string;
  portfolio_count: string;
  top_investments: string;
  sector_tags: string[];
  stage_focus: string[];
  check_sizes: string[];
  geo_tokens: string[];
  geographic_focus: string;
  thesis_statement: string;
  sub_themes: string;
  text_blob: string;
  excluded_sectors: string[];
  excluded_geos: string[];
  excluded_biz_models: string[];
  b2b_b2c_preference: string;
  revenue_model_preferences: string[];
  customer_type_preference: string[];
  minimum_traction: string[];
  ranked_metrics: string[];
  pain_severity_preference: string;
  fast_signals: string[];
  non_negotiables: any;
  time_to_first_response: string;
  time_to_decision: string;
  gives_feedback: boolean;
  operating_support: string[];
  customer_verticals: string;
  partner_categories: string;
  talent_networks: string[];
  support_style: string;
  public_profile: boolean;
  contacts: any[];
}

// Main Handler

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { user_id, match_type, limit = 20 } = await req.json();
    
    if (!user_id || !match_type) {
      return new Response(
        JSON.stringify({ error: 'user_id and match_type are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Validate limit parameter
    const validatedLimit = Math.max(1, Math.min(100, Math.floor(Number(limit))));
    if (isNaN(validatedLimit) || limit < 0) {
      return new Response(
        JSON.stringify({ error: 'limit must be a positive number between 1 and 100' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log(`Matchmaking request: user=${user_id}, type=${match_type}`);
    
    if (match_type === 'founder_to_investors') {
      // Founder looking for investors
      
      // Get founder application
      const { data: founderData, error: founderError } = await supabase
        .from('founder_applications')
        .select('*')
        .eq('user_id', user_id)
        .single();
      
      if (founderError || !founderData) {
        console.error('Founder not found:', founderError);
        return new Response(
          JSON.stringify({ error: 'Founder application not found', matches: [] }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Get all active investors
      const { data: investorsData, error: investorsError } = await supabase
        .from('investor_applications')
        .select('*')
        .eq('status', 'active');
      
      if (investorsError) {
        console.error('Error fetching investors:', investorsError);
        return new Response(
          JSON.stringify({ error: 'Error fetching investors' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const investors = investorsData || [];
      console.log(`Found ${investors.length} active investors`);
      
      // Normalize data
      const normalizedFounder = normalizeFounder(founderData);
      const normalizedInvestors = investors.map(normalizeInvestor);
      
      // Calculate thesis similarities using AI
      const thesisSimilarities = await calculateThesisSimilarities(normalizedFounder, normalizedInvestors);
      
      // Process each investor
      const matches: MatchResult[] = [];
      
      for (const investor of normalizedInvestors) {
        // Apply hard filters
        const filterResult = applyHardFilters(normalizedFounder, investor);
        
        if (filterResult.blocked) {
          console.log(`Blocked: ${investor.firm_name} - ${filterResult.blockReason}`);
          continue;
        }
        
        // Calculate compatibility score
        const thesisSim = thesisSimilarities.get(investor.id) || 0.5;
        const scores = calculateCompatibilityScore(normalizedFounder, investor, thesisSim);
        
        // Generate explanation
        const explanation = generateExplanation(normalizedFounder, investor, scores, filterResult);
        
        matches.push({
          investor,
          match_score: scores.total,
          match_label: getMatchLabel(scores.total),
          fit_breakdown: scores,
          explanation,
        });
      }
      
      // Apply diversity and ranking
      const rankedMatches = applyDiversityAndRanking(matches);
      
      // Format output
      const output = rankedMatches.slice(0, validatedLimit).map(m => ({
        investor_id: m.investor.id,
        user_id: m.investor.user_id,
        firm_name: m.investor.firm_name,
        firm_description: m.investor.firm_description,
        website: m.investor.website,
        hq_location: m.investor.hq_location,
        sector_tags: m.investor.sector_tags,
        stage_focus: m.investor.stage_focus,
        check_sizes: m.investor.check_sizes,
        lead_follow: m.investor.lead_follow,
        top_investments: m.investor.top_investments,
        geographic_focus: m.investor.geographic_focus,
        thesis_statement: m.investor.thesis_statement,
        operating_support: m.investor.operating_support,
        time_to_first_response: m.investor.time_to_first_response,
        time_to_decision: m.investor.time_to_decision,
        gives_feedback: m.investor.gives_feedback,
        public_profile: m.investor.public_profile,
        match_score: m.match_score,
        match_label: m.match_label,
        why_this_match: m.explanation.why_this_match,
        potential_concerns: m.explanation.potential_concerns,
        fit_breakdown: m.fit_breakdown,
      }));
      
      // Also return improvement suggestions (Part 5.3)
      const improvements = matches.length > 0 
        ? matches[0].explanation.improvement_suggestions 
        : ['Complete your company profile to get better matches'];
      
      console.log(`Returning ${output.length} matches for founder`);
      
      return new Response(
        JSON.stringify({ 
          matches: output,
          improvement_suggestions: improvements,
          total_investors: investors.length,
          matches_found: matches.length,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
      
    } else if (match_type === 'investor_to_founders') {
      // Investor looking for founders
      
      // Get investor application
      const { data: investorData, error: investorError } = await supabase
        .from('investor_applications')
        .select('*')
        .eq('user_id', user_id)
        .single();
      
      if (investorError || !investorData) {
        console.error('Investor not found:', investorError);
        return new Response(
          JSON.stringify({ error: 'Investor application not found', matches: [] }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Get all founders with active/approved status
      const { data: foundersData, error: foundersError } = await supabase
        .from('founder_applications')
        .select('*')
        .in('status', ['approved', 'pending', 'active']);
      
      if (foundersError) {
        console.error('Error fetching founders:', foundersError);
        return new Response(
          JSON.stringify({ error: 'Error fetching founders' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const founders = foundersData || [];
      console.log(`Found ${founders.length} founders`);
      
      // Normalize data
      const normalizedInvestor = normalizeInvestor(investorData);
      const normalizedFounders = founders.map(normalizeFounder);
      
      // Process each founder (flip the matching logic)
      const matches: any[] = [];
      
      for (const founder of normalizedFounders) {
        // Apply hard filters (from investor perspective)
        const filterResult = applyHardFilters(founder, normalizedInvestor);
        
        if (filterResult.blocked) {
          console.log(`Blocked: ${founder.company_name} - ${filterResult.blockReason}`);
          continue;
        }
        
        // Calculate compatibility score (no AI for investor-side to keep it fast)
        const scores = calculateCompatibilityScore(founder, normalizedInvestor, 0.5);
        
        // Generate explanation (flipped perspective)
        const whyThisMatch = [
          founder.sector_tags.some(s => normalizedInvestor.sector_tags.includes(s))
            ? `Vertical matches your focus: ${founder.vertical}`
            : `Vertical: ${founder.vertical}`,
          normalizedInvestor.stage_focus.includes(founder.normalized_stage)
            ? `Stage aligns with your focus: ${founder.stage}`
            : `Stage: ${founder.stage}`,
          scores.business_model_fit > 60
            ? `Business model aligns: ${founder.customer_type || founder.business_model}`
            : `Business model: ${founder.business_model}`,
        ].filter(Boolean);
        
        matches.push({
          founder,
          match_score: scores.total,
          match_label: getMatchLabel(scores.total),
          fit_breakdown: scores,
          why_this_match: whyThisMatch.slice(0, 3),
          potential_concerns: filterResult.softWarnings.slice(0, 2),
        });
      }
      
      // Sort by score
      matches.sort((a, b) => b.match_score - a.match_score);
      
      // Format output
      const output = matches.slice(0, validatedLimit).map(m => ({
        founder_id: m.founder.id,
        user_id: m.founder.user_id,
        company_name: m.founder.company_name,
        founder_name: m.founder.founder_name,
        website: m.founder.website,
        vertical: m.founder.vertical,
        stage: m.founder.stage,
        location: m.founder.location,
        funding_goal: m.founder.funding_goal,
        business_model: m.founder.business_model,
        traction: m.founder.traction,
        company_pitch: m.founder.company_pitch,
        problem_statement: m.founder.problem_statement,
        ideal_customer_profile: m.founder.ideal_customer_profile,
        tam_value: m.founder.tam_value,
        sam_value: m.founder.sam_value,
        som_value: m.founder.som_value,
        team_members: m.founder.team_members,
        match_score: m.match_score,
        match_label: m.match_label,
        why_this_match: m.why_this_match,
        potential_concerns: m.potential_concerns,
        fit_breakdown: m.fit_breakdown,
      }));
      
      console.log(`Returning ${output.length} matches for investor`);
      
      return new Response(
        JSON.stringify({ 
          matches: output,
          total_founders: founders.length,
          matches_found: matches.length,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
      
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid match_type. Use "founder_to_investors" or "investor_to_founders"' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
  } catch (error) {
    console.error('Matchmaking error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
