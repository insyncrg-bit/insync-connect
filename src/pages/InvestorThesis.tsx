import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Target, Zap, XCircle, Users, DollarSign, Briefcase, Handshake } from "lucide-react";

interface InvestorApplication {
  id: string;
  firm_name: string;
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
}

export default function InvestorThesis() {
  const navigate = useNavigate();
  const [application, setApplication] = useState<InvestorApplication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThesis();
  }, []);

  const fetchThesis = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/investor-application");
        return;
      }

      const { data, error } = await supabase
        .from("investor_applications")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        navigate("/investor-application");
        return;
      }

      setApplication({
        ...data,
        sub_themes: (data.sub_themes as string[]) || [],
        fast_signals: (data.fast_signals as string[]) || [],
        hard_nos: (data.hard_nos as string[]) || [],
        check_sizes: (data.check_sizes as string[]) || [],
        stage_focus: (data.stage_focus as string[]) || [],
        sector_tags: (data.sector_tags as string[]) || [],
        customer_types: (data.customer_types as string[]) || [],
        operating_support: (data.operating_support as string[]) || [],
      });
    } catch (error) {
      console.error("Error fetching thesis:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gradient-hero)' }}>
        <div className="text-white">Loading your thesis...</div>
      </div>
    );
  }

  if (!application) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
      <div className="max-w-4xl mx-auto p-6 md:p-12">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/investor-dashboard")}
            className="text-white/70 hover:text-white hover:bg-white/10 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-4xl font-bold text-white mb-2">Your Investment Thesis</h1>
          <p className="text-white/60">{application.firm_name}</p>
        </div>

        {/* Core Thesis */}
        <Card className="bg-navy-card border-[hsl(var(--cyan-glow))]/30 p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[hsl(var(--cyan-glow))]/20 flex items-center justify-center">
              <Target className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
            </div>
            <h2 className="text-xl font-semibold text-white">Core Thesis</h2>
          </div>
          <p className="text-white/80 text-lg leading-relaxed">
            {application.thesis_statement || "No thesis statement provided."}
          </p>
          
          {application.sub_themes.length > 0 && (
            <div className="mt-6">
              <p className="text-white/50 text-sm mb-3">Sub-themes & Focus Areas</p>
              <div className="flex flex-wrap gap-2">
                {application.sub_themes.map((theme, i) => (
                  <Badge key={i} variant="outline" className="bg-[hsl(var(--cyan-glow))]/10 border-[hsl(var(--cyan-glow))]/30 text-[hsl(var(--cyan-glow))]">
                    {theme}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Investment Focus */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* What Excites You */}
          <Card className="bg-navy-card border-green-500/30 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Zap className="h-5 w-5 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Fast Signals</h3>
            </div>
            <p className="text-white/50 text-sm mb-3">What makes you move quickly</p>
            <div className="space-y-2">
              {application.fast_signals.length > 0 ? (
                application.fast_signals.map((signal, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    {signal}
                  </div>
                ))
              ) : (
                <p className="text-white/50 italic">Not specified</p>
              )}
            </div>
          </Card>

          {/* Hard Nos */}
          <Card className="bg-navy-card border-red-500/30 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Hard Nos</h3>
            </div>
            <p className="text-white/50 text-sm mb-3">Dealbreakers</p>
            <div className="space-y-2">
              {application.hard_nos.length > 0 ? (
                application.hard_nos.map((no, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    {no}
                  </div>
                ))
              ) : (
                <p className="text-white/50 italic">Not specified</p>
              )}
            </div>
          </Card>
        </div>

        {/* Investment Parameters */}
        <Card className="bg-navy-card border-white/10 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-white/80" />
            </div>
            <h3 className="text-lg font-semibold text-white">Investment Parameters</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <p className="text-white/50 text-sm mb-2">Check Size</p>
              <div className="flex flex-wrap gap-2">
                {application.check_sizes.length > 0 ? (
                  application.check_sizes.map((size, i) => (
                    <Badge key={i} variant="outline" className="bg-white/5 border-white/20 text-white">
                      {size}
                    </Badge>
                  ))
                ) : (
                  <span className="text-white/50 italic">Not specified</span>
                )}
              </div>
            </div>
            
            <div>
              <p className="text-white/50 text-sm mb-2">Stage Focus</p>
              <div className="flex flex-wrap gap-2">
                {application.stage_focus.length > 0 ? (
                  application.stage_focus.map((stage, i) => (
                    <Badge key={i} variant="outline" className="bg-white/5 border-white/20 text-white">
                      {stage}
                    </Badge>
                  ))
                ) : (
                  <span className="text-white/50 italic">Not specified</span>
                )}
              </div>
            </div>
            
            <div>
              <p className="text-white/50 text-sm mb-2">Lead / Follow</p>
              <span className="text-white/80">{application.lead_follow || "Not specified"}</span>
            </div>
          </div>
        </Card>

        {/* Sectors & Customers */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card className="bg-navy-card border-white/10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Sectors</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {application.sector_tags.length > 0 ? (
                application.sector_tags.map((sector, i) => (
                  <Badge key={i} variant="outline" className="bg-purple-500/10 border-purple-500/30 text-purple-400">
                    {sector}
                  </Badge>
                ))
              ) : (
                <span className="text-white/50 italic">Not specified</span>
              )}
            </div>
          </Card>

          <Card className="bg-navy-card border-white/10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Target Customers</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {application.customer_types.length > 0 ? (
                application.customer_types.map((type, i) => (
                  <Badge key={i} variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-400">
                    {type}
                  </Badge>
                ))
              ) : (
                <span className="text-white/50 italic">Not specified</span>
              )}
            </div>
          </Card>
        </div>

        {/* Value-Add */}
        <Card className="bg-navy-card border-white/10 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Handshake className="h-5 w-5 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">How You Add Value</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-white/50 text-sm mb-2">Operating Support</p>
              <div className="flex flex-wrap gap-2">
                {application.operating_support.length > 0 ? (
                  application.operating_support.map((support, i) => (
                    <Badge key={i} variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-400">
                      {support}
                    </Badge>
                  ))
                ) : (
                  <span className="text-white/50 italic">Not specified</span>
                )}
              </div>
            </div>
            
            <div>
              <p className="text-white/50 text-sm mb-2">Support Style</p>
              <span className="text-white/80">{application.support_style || "Not specified"}</span>
            </div>
          </div>
        </Card>

        {/* Edit Button */}
        <div className="mt-8 text-center">
          <Button 
            variant="outline"
            onClick={() => navigate("/investor-application")}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Edit Your Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
