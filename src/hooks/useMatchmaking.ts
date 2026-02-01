import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface MatchResult {
  id: string;
  match_score: number;
  match_label: string;
  why_this_match: string[];
  potential_concerns: string[];
  improvement_suggestions?: string[];
  fit_breakdown: {
    sector_fit: number;
    stage_fit: number;
    geo_fit: number;
    business_model_fit: number;
    thesis_fit: number;
    why_yes_fit: number;
    valueadd_fit: number;
  };
  // For investors (shown to founders)
  investor?: {
    id: string;
    user_id: string;
    firm_name: string;
    firm_description: string | null;
    thesis_statement: string | null;
    sub_themes: string[];
    fast_signals: string[];
    hard_nos: string[];
    check_sizes: string[];
    stage_focus: string[];
    sector_tags: string[];
    customer_types: string[];
    lead_follow: string | null;
    operating_support: string[];
    support_style: string | null;
    hq_location: string | null;
    aum: string | null;
    fund_type: string | null;
    geographic_focus: string | null;
    b2b_b2c: string | null;
    revenue_models: string[];
    minimum_traction: string[];
    board_involvement: string | null;
    decision_process: string | null;
    time_to_decision: string | null;
  };
  // For founders (shown to investors)
  founder?: {
    id: string;
    user_id: string;
    founder_name: string;
    company_name: string;
    vertical: string;
    stage: string;
    location: string;
    website: string | null;
    business_model: string;
    funding_goal: string;
    traction: string;
    email: string;
    current_ask: string;
    application_sections: Record<string, unknown>;
  };
}

interface UseMatchmakingResult {
  matches: MatchResult[];
  loading: boolean;
  error: string | null;
  fetchMatches: (userType: 'founder' | 'investor', userId?: string) => Promise<void>;
}

export function useMatchmaking(): UseMatchmakingResult {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = useCallback(async (userType: 'founder' | 'investor', userId?: string) => {
    setLoading(true);
    setError(null);

    try {
      let effectiveUserId = userId;
      
      if (!effectiveUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        effectiveUserId = user?.id;
      }

      if (!effectiveUserId) {
        // Return empty matches for demo/unauthenticated users
        setMatches([]);
        setLoading(false);
        return;
      }

      // Map userType to match_type expected by the API
      const matchType = userType === 'founder' 
        ? 'founder_to_investors' 
        : 'investor_to_founders';

      const { data, error: fnError } = await supabase.functions.invoke('matchmaking', {
        body: { 
          user_id: effectiveUserId,
          match_type: matchType
        }
      });

      if (fnError) {
        throw new Error(fnError.message || 'Failed to fetch matches');
      }

      if (data?.matches) {
        // Transform flat API response into nested structure expected by frontend
        const transformedMatches: MatchResult[] = data.matches.map((match: Record<string, unknown>) => {
          if (userType === 'founder') {
            // For founder-to-investor matches, nest investor properties
            return {
              id: match.investor_id || match.user_id,
              match_score: match.match_score,
              match_label: match.match_label,
              why_this_match: match.why_this_match || [],
              potential_concerns: match.potential_concerns || [],
              improvement_suggestions: data.improvement_suggestions,
              fit_breakdown: {
                sector_fit: match.fit_breakdown?.sector_fit || 0,
                stage_fit: match.fit_breakdown?.stage_fit || 0,
                geo_fit: match.fit_breakdown?.geography_fit || 0,
                business_model_fit: match.fit_breakdown?.business_model_fit || 0,
                thesis_fit: match.fit_breakdown?.thesis_similarity || 0,
                why_yes_fit: match.fit_breakdown?.why_yes_alignment || 0,
                valueadd_fit: match.fit_breakdown?.value_add_fit || 0,
              },
              investor: {
                id: match.investor_id,
                user_id: match.user_id,
                firm_name: match.firm_name,
                firm_description: match.firm_description || null,
                thesis_statement: match.thesis_statement || null,
                sub_themes: [],
                fast_signals: [],
                hard_nos: [],
                check_sizes: match.check_sizes || [],
                stage_focus: match.stage_focus || [],
                sector_tags: match.sector_tags || [],
                customer_types: [],
                lead_follow: match.lead_follow || null,
                operating_support: match.operating_support || [],
                support_style: null,
                hq_location: match.hq_location || null,
                aum: null,
                fund_type: null,
                geographic_focus: match.geographic_focus || null,
                b2b_b2c: null,
                revenue_models: [],
                minimum_traction: [],
                board_involvement: null,
                decision_process: null,
                time_to_decision: match.time_to_decision || null,
              },
            };
          } else {
            // For investor-to-founder matches, nest founder properties
            return {
              id: match.founder_id || match.user_id,
              match_score: match.match_score,
              match_label: match.match_label,
              why_this_match: match.why_this_match || [],
              potential_concerns: match.potential_concerns || [],
              fit_breakdown: {
                sector_fit: match.fit_breakdown?.sector_fit || 0,
                stage_fit: match.fit_breakdown?.stage_fit || 0,
                geo_fit: match.fit_breakdown?.geography_fit || 0,
                business_model_fit: match.fit_breakdown?.business_model_fit || 0,
                thesis_fit: match.fit_breakdown?.thesis_similarity || 0,
                why_yes_fit: match.fit_breakdown?.why_yes_alignment || 0,
                valueadd_fit: match.fit_breakdown?.value_add_fit || 0,
              },
              founder: {
                id: match.founder_id,
                user_id: match.user_id,
                founder_name: match.founder_name,
                company_name: match.company_name,
                vertical: match.vertical,
                stage: match.stage,
                location: match.location,
                website: match.website || null,
                business_model: match.business_model,
                funding_goal: match.funding_goal,
                traction: match.traction,
                email: '',
                current_ask: '',
                application_sections: {
                  company_pitch: match.company_pitch,
                  problem_statement: match.problem_statement,
                  ideal_customer_profile: match.ideal_customer_profile,
                  tam_value: match.tam_value,
                  sam_value: match.sam_value,
                  som_value: match.som_value,
                  team_members: match.team_members,
                },
              },
            };
          }
        });
        setMatches(transformedMatches);
      } else if (data?.error) {
        throw new Error(data.error);
      } else {
        setMatches([]);
      }
    } catch (err) {
      console.error('Matchmaking error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch matches');
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { matches, loading, error, fetchMatches };
}
