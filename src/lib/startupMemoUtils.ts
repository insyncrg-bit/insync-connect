import type { StartupOnboardingData } from "@/pages/startup/startup-onboarding/hooks/startupMemoTypes";

export type StartupMemoLike = Record<string, unknown>;

/**
 * Converts StartupOnboardingData to the memo payload format expected by the API and MemoEditor.
 * Optionally include logo_url and pitchdeck_url (from uploads).
 */
export function onboardingToMemoPayload(
    data: StartupOnboardingData,
    opts?: { logo_url?: string; pitchdeck_url?: string; pitchdeck_name?: string }
): StartupMemoLike {
    const teamMembers = data.teamMembers.filter((m) => m.name || m.role || m.linkedin || m.background);
    const competitors = data.competitors.filter((c) => c.name || c.description || c.howYouDiffer);

    const applicationSections = {
        section2: {
            currentPainPoint: data.currentPainPoint,
            valueDrivers: data.valueDrivers,
            valueDriverExplanations: data.valueDriverExplanations,
        },
        section3: {
            customerType: data.customerType,
            customerTypeExplanation: data.customerTypeExplanation,
            businessStructure: data.businessStructure,
            pricingStrategies: data.pricingStrategies,

            previousInvestors: data.previousInvestors,
            leadInvestor: data.leadInvestor,
            roundDetails: data.roundDetails,
            fundingUse: data.fundingUse,

            subscriptionType: data.subscriptionType,
            subscriptionBillingCycle: data.subscriptionBillingCycle,
            subscriptionTiers: data.subscriptionTiers,
            transactionFeeType: data.transactionFeeType,
            transactionFeePercentage: data.transactionFeePercentage,
            licensingModel: data.licensingModel,
            adRevenueModel: data.adRevenueModel,
            serviceType: data.serviceType,
            revenueMetrics: data.revenueMetrics,
            revenueMetricsValues: data.revenueMetricsValues,
        },
        section4: {
            gtmAcquisition: data.gtmAcquisition,
            gtmTimeline: data.gtmTimeline,
        },
        section5: {
            targetGeography: data.targetGeography,
            targetCustomerDescription: data.targetCustomerDescription,
            tamValue: data.tamValue,
            tamCalculationMethod: data.tamCalculationMethod,
            tamBreakdown: data.tamBreakdown,
            samValue: data.samValue,
            samBreakdown: data.samBreakdown,
            somValue: data.somValue,
            somTimeframe: data.somTimeframe,
            somBreakdown: data.somBreakdown,
        },
        section6: {
            competitors,
            competitiveMoat: data.competitiveMoat,
        },
    };

    const memo: StartupMemoLike = {
        company_name: data.companyName,
        vertical: data.vertical,
        stage: data.stage,
        location: data.location,
        website: data.website,
        linkedIn: data.linkedIn ?? "",
        business_model: data.companyOverview,
        team_members: teamMembers,
        application_sections: applicationSections,
    };
    if (opts?.logo_url) memo.logo_url = opts.logo_url;
    if (opts?.pitchdeck_url) memo.pitchdeck_url = opts.pitchdeck_url;
    if (opts?.pitchdeck_name) memo.pitchdeck_name = opts.pitchdeck_name;
    return memo;
}
