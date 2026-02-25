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
