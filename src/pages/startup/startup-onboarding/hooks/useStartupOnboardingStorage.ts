import { useOnboardingStorage } from "@/components/onboarding";

export interface TeamMember {
  name: string;
  role: string;
  linkedin: string;
  background: string;
}

export interface Competitor {
  name: string;
  description: string;
  howYouDiffer: string;
}

export interface StartupOnboardingData {
  // Step 0: Welcome (no data needed)

  // Step 1: Company Info
  companyName: string;
  website: string;
  linkedIn: string;
  vertical: string;
  stage: string;
  location: string;
  companyLogo?: File | null;
  logoPreview?: string | null;
  startupLogoUrl?: string | null;
  pitchdeck?: File | null;
  pitchdeckName?: string | null;
  pitchdeckUrl?: string | null;

  // Step 2: Team & Overview
  companyOverview: string;
  teamMembers: TeamMember[];

  // Step 3: Value Proposition
  currentPainPoint: string;
  valueDrivers: string[];
  valueDriverExplanations: Record<string, string>;

  // Step 4: Business Model
  customerType: string[];
  customerTypeExplanation: string;
  businessStructure: string;

  // Step 5: Funding & Round add-ons
  previousInvestors: string;
  leadInvestor: string;
  roundDetails: string;
  fundingUse: string;
  pricingStrategies: string[];
  subscriptionType: string;
  subscriptionBillingCycle: string;
  subscriptionTiers: string;
  transactionFeeType: string;
  transactionFeePercentage: string;
  licensingModel: string;
  adRevenueModel: string;
  serviceType: string;
  revenueMetrics: string[];
  revenueMetricsValues: string;

  // Step 5: Go-to-Market
  gtmAcquisition: string;
  gtmTimeline: string;

  // Step 6: Customer & Market
  targetGeography: string;
  targetCustomerDescription: string;
  tamValue: string;
  tamCalculationMethod: string;
  tamBreakdown: string;
  samValue: string;
  samBreakdown: string;
  somValue: string;
  somTimeframe: string;
  somBreakdown: string;

  // Step 7: Competitors
  competitors: Competitor[];
  competitiveMoat: string;
}

export const defaultData: StartupOnboardingData = {
  companyName: "",
  website: "",
  linkedIn: "",
  vertical: "",
  stage: "",
  location: "",
  companyLogo: null,
  logoPreview: null,
  startupLogoUrl: null,
  pitchdeck: null,
  pitchdeckName: null,
  pitchdeckUrl: null,
  companyOverview: "",
  teamMembers: [{ name: "", role: "", linkedin: "", background: "" }],
  currentPainPoint: "",
  valueDrivers: [],
  valueDriverExplanations: {},
  customerType: [],
  customerTypeExplanation: "",
  businessStructure: "",
  previousInvestors: "",
  leadInvestor: "",
  roundDetails: "",
  fundingUse: "",
  pricingStrategies: [],
  subscriptionType: "",
  subscriptionBillingCycle: "",
  subscriptionTiers: "",
  transactionFeeType: "",
  transactionFeePercentage: "",
  licensingModel: "",
  adRevenueModel: "",
  serviceType: "",
  revenueMetrics: [],
  revenueMetricsValues: "",
  gtmAcquisition: "",
  gtmTimeline: "",
  targetGeography: "",
  targetCustomerDescription: "",
  tamValue: "",
  tamCalculationMethod: "",
  tamBreakdown: "",
  samValue: "",
  samBreakdown: "",
  somValue: "",
  somTimeframe: "",
  somBreakdown: "",
  competitors: [
    { name: "", description: "", howYouDiffer: "" },
    { name: "", description: "", howYouDiffer: "" },
    { name: "", description: "", howYouDiffer: "" },
  ],
  competitiveMoat: "",
};

// Note: This is exported for type usage, but the actual storage is handled by OnboardingPage
// The defaultData is used as the initial state
