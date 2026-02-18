import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "vc_onboarding_data";
const STORAGE_STEP_KEY = "vc_onboarding_current_step";

export interface VCOnboardingData {
  // Step 0: Welcome (no data needed)

  // Step 1: Personal Profile
  fullName: string;
  email: string;
  linkedIn: string;
  title: string;
  profileImage?: string | null;
  profileImagePreview?: string | null;
  investingSectors: string[];
  funFact: string;

  // Step 2: Fund Overview (includes Admin & Verification)
  firmName: string;
  website: string;
  companyLinkedIn: string;
  hqLocation: string;
  otherLocationBranches: string[];
  companyLogo?: string | null;
  logoPreview?: string | null;
  publicProfile: boolean;

  // Fund Overview fields
  firmDescription: string;
  aum: string;
  fundVintage: string;
  fundType: string;
  ownershipTarget: string;
  leadFollow: string;
  checkSizes: string[];
  stageFocus: string[];
  sectorTags: string[];
  portfolioCount: string;
  topInvestments: { name: string; website: string }[];
  geographicFocus: "" | "boston" | "other";
  geographicFocusDetail: string;

  // Step 3: Investment Strategy
  thesisStatement: string;
  subThemes: string[];
  subThemesOther: string;
  nonNegotiables: string;
  businessModels: string[];
  keyMetrics: string[];

  // Step 4: Value-Add
  operatingSupport: string[];
  operatingSupportOther: string;
  firmInvolvement: string;

  // Step 5: Portfolio
  portfolioList: string;
  conflictsPolicy: string;
  investsInCompetitors: boolean;
  signsNDAs: boolean;
  ndaConditions: string;

  // Step 6: Deal Mechanics (Optional)
  decisionProcess: string;
  timeToFirstResponse: string;
  timeToDecision: string;
  givesNoWithFeedback: boolean | null;
  feedbackWhen: string;
  followOnReserves: string;
  followOnWhen: string;
  boardInvolvement: string;
}

export const defaultData: VCOnboardingData = {
  // Personal Profile defaults
  fullName: "",
  email: "",
  linkedIn: "",
  title: "",
  profileImage: null,
  profileImagePreview: null,
  investingSectors: [],
  funFact: "",

  // Existing defaults
  firmName: "",
  website: "",
  companyLinkedIn: "",
  hqLocation: "",
  otherLocationBranches: [],
  companyLogo: null,
  logoPreview: null,
  publicProfile: true,
  firmDescription: "",
  aum: "",
  fundVintage: "",
  fundType: "",
  ownershipTarget: "",
  leadFollow: "",
  checkSizes: [],
  stageFocus: [],
  sectorTags: [],
  portfolioCount: "",
  topInvestments: [],
  geographicFocus: "",
  geographicFocusDetail: "",
  thesisStatement: "",
  subThemes: [],
  subThemesOther: "",
  nonNegotiables: "",
  businessModels: [],
  keyMetrics: [],
  operatingSupport: [],
  operatingSupportOther: "",
  firmInvolvement: "",
  portfolioList: "",
  conflictsPolicy: "",
  investsInCompetitors: false,
  signsNDAs: false,
  ndaConditions: "",
  decisionProcess: "",
  timeToFirstResponse: "",
  timeToDecision: "",
  givesNoWithFeedback: null,
  feedbackWhen: "",
  followOnReserves: "",
  followOnWhen: "",
  boardInvolvement: "",
};

export const useVCOnboardingStorage = () => {
  const [data, setData] = useState<VCOnboardingData>(defaultData);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      const savedStep = localStorage.getItem(STORAGE_STEP_KEY);

      if (savedData) {
        const parsed = JSON.parse(savedData);
        // Ensure topInvestments is an array of objects
        if (!Array.isArray(parsed.topInvestments) || (parsed.topInvestments.length > 0 && typeof parsed.topInvestments[0] === 'string')) {
          parsed.topInvestments = [];
        }
        setData({ ...defaultData, ...parsed });
      }

      if (savedStep) {
        setCurrentStep(parseInt(savedStep, 10));
      }
    } catch (error) {
      console.error("Error loading VC onboarding data:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever data changes
  const saveData = useCallback((newData: Partial<VCOnboardingData>) => {
    const updatedData = { ...data, ...newData };
    setData(updatedData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    } catch (error) {
      console.error("Error saving VC onboarding data:", error);
    }
  }, [data]);

  // Save current step
  const saveStep = useCallback((step: number) => {
    setCurrentStep(step);
    try {
      localStorage.setItem(STORAGE_STEP_KEY, step.toString());
    } catch (error) {
      console.error("Error saving VC onboarding step:", error);
    }
  }, []);

  // Clear all data
  const clearData = useCallback(() => {
    setData(defaultData);
    setCurrentStep(0);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_STEP_KEY);
    } catch (error) {
      console.error("Error clearing VC onboarding data:", error);
    }
  }, []);

  return {
    data,
    currentStep,
    isLoaded,
    saveData,
    saveStep,
    clearData,
    setData: saveData,
    setCurrentStep: saveStep,
  };
};
