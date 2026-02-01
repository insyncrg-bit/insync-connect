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
    application_sections: any;
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
    // DISCONNECTED: API calls disabled - using demo mode only
    setLoading(true);
    setError(null);

    // Simulate API delay
    setTimeout(() => {
      setMatches([]);
      setLoading(false);
    }, 500);

    /* ORIGINAL API CALLS - DISCONNECTED
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

      const { data, error: fnError } = await supabase.functions.invoke('matchmaking', {
        body: {
          user_type: userType,
          user_id: effectiveUserId
        }
      });

      if (fnError) {
        throw new Error(fnError.message || 'Failed to fetch matches');
      }

      if (data?.matches) {
        setMatches(data.matches);
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
    */
  }, []);

  return { matches, loading, error, fetchMatches };
}
