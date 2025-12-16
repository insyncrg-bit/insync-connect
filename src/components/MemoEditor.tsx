import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Save, 
  Edit2, 
  X, 
  Building2, 
  MapPin, 
  Globe, 
  Briefcase,
  Target,
  Users,
  TrendingUp,
  DollarSign,
  Zap,
  Shield,
  BarChart3,
  Rocket,
  FileText,
  Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MemoEditorProps {
  application: any;
  onUpdate?: () => void;
}

export function MemoEditor({ application, onUpdate }: MemoEditorProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<"condensed" | "full">("condensed");
  const [formData, setFormData] = useState({
    company_name: "",
    vertical: "",
    stage: "",
    location: "",
    website: "",
    business_model: "",
  });

  useEffect(() => {
    if (application) {
      setFormData({
        company_name: application.company_name || "",
        vertical: application.vertical || "",
        stage: application.stage || "",
        location: application.location || "",
        website: application.website || "",
        business_model: application.business_model || "",
      });
    }
  }, [application]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("founder_applications")
        .update({
          company_name: formData.company_name,
          vertical: formData.vertical,
          stage: formData.stage,
          location: formData.location,
          website: formData.website,
          business_model: formData.business_model,
          updated_at: new Date().toISOString(),
        })
        .eq("id", application.id);

      if (error) throw error;

      toast({
        title: "Memo Updated",
        description: "Your company information has been saved.",
      });
      setIsEditing(false);
      onUpdate?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const sections = application?.application_sections || {};
  const teamMembers = application?.team_members || [];

  // Value driver labels
  const valueDriverLabels: Record<string, string> = {
    "scalability": "True Scalability",
    "severity": "Severity & Urgency",
    "unique-tech": "Unique Technology",
    "emotional": "Emotional Value",
    "adaptability": "Adaptability"
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">My Memo</h2>
          <p className="text-white/60">Your investor-ready company memo</p>
        </div>
        <div className="flex items-center gap-3">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "condensed" | "full")}>
            <TabsList className="bg-white/10">
              <TabsTrigger value="condensed" className="data-[state=active]:bg-[hsl(var(--cyan-glow))] data-[state=active]:text-[hsl(var(--navy-deep))]">
                <FileText className="h-4 w-4 mr-2" />
                Condensed
              </TabsTrigger>
              <TabsTrigger value="full" className="data-[state=active]:bg-[hsl(var(--cyan-glow))] data-[state=active]:text-[hsl(var(--navy-deep))]">
                <Eye className="h-4 w-4 mr-2" />
                Full Memo
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-[hsl(var(--cyan-glow))]/20 text-[hsl(var(--cyan-glow))] hover:bg-[hsl(var(--cyan-glow))]/30 border border-[hsl(var(--cyan-glow))]/30"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => setIsEditing(false)}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--cyan-glow))]/90"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Condensed View */}
      {viewMode === "condensed" && (
        <div className="space-y-6">
          {/* Executive Summary Card */}
          <Card className="bg-gradient-to-br from-[hsl(220,60%,15%)] to-[hsl(220,60%,12%)] border-[hsl(var(--cyan-glow))]/30 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[hsl(var(--cyan-glow))]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[hsl(var(--cyan-glow))] to-[hsl(var(--primary))] flex items-center justify-center shadow-lg shadow-[hsl(var(--cyan-glow))]/20">
                    <Building2 className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    {isEditing ? (
                      <Input
                        value={formData.company_name}
                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                        className="bg-white/5 border-white/20 text-white text-2xl font-bold mb-2 h-auto py-1"
                        placeholder="Company Name"
                      />
                    ) : (
                      <h1 className="text-3xl font-bold text-white mb-2">{formData.company_name || "Company Name"}</h1>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-[hsl(var(--cyan-glow))]/20 text-[hsl(var(--cyan-glow))] border-[hsl(var(--cyan-glow))]/30 text-sm">
                        {formData.vertical || "Vertical"}
                      </Badge>
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-sm">
                        {formData.stage || "Stage"}
                      </Badge>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-sm">
                        📍 {formData.location || "Location"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* One-liner */}
              <div className="bg-white/5 rounded-xl p-4 mb-6">
                <p className="text-lg text-white/90 italic">
                  {formData.business_model ? `"${formData.business_model.slice(0, 150)}${formData.business_model.length > 150 ? '...' : ''}"` : "Company description will appear here."}
                </p>
              </div>

              {/* Key Metrics Row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-sm text-white/50 mb-1">TAM</p>
                  <p className="text-2xl font-bold text-white">{sections.section5?.tamValue || "—"}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-sm text-white/50 mb-1">SAM</p>
                  <p className="text-2xl font-bold text-white">{sections.section5?.samValue || "—"}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-sm text-white/50 mb-1">SOM</p>
                  <p className="text-2xl font-bold text-white">{sections.section5?.somValue || "—"}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-[hsl(220,60%,15%)] border-white/10 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white/50 text-xs">Team Size</p>
                  <p className="text-white font-semibold">{teamMembers.length || 1}</p>
                </div>
              </div>
            </Card>
            <Card className="bg-[hsl(220,60%,15%)] border-white/10 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Target className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white/50 text-xs">Customer</p>
                  <p className="text-white font-semibold">{sections.section3?.customerType?.join("/") || "—"}</p>
                </div>
              </div>
            </Card>
            <Card className="bg-[hsl(220,60%,15%)] border-white/10 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-white/50 text-xs">Revenue Model</p>
                  <p className="text-white font-semibold text-sm">{sections.section3?.pricingStrategies?.[0] || "—"}</p>
                </div>
              </div>
            </Card>
            <Card className="bg-[hsl(220,60%,15%)] border-white/10 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-white/50 text-xs">Value Drivers</p>
                  <p className="text-white font-semibold">{sections.section2?.valueDrivers?.length || 0}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Problem & Solution */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-[hsl(220,60%,15%)] border-white/10 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <Target className="h-4 w-4 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">The Problem</h3>
              </div>
              <p className="text-white/80 leading-relaxed">
                {sections.section2?.currentPainPoint || "Problem statement will appear here based on your application."}
              </p>
            </Card>

            <Card className="bg-[hsl(220,60%,15%)] border-white/10 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Rocket className="h-4 w-4 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">The Solution</h3>
              </div>
              <p className="text-white/80 leading-relaxed">
                {formData.business_model || "Your solution description will appear here."}
              </p>
            </Card>
          </div>
        </div>
      )}

      {/* Full Memo View */}
      {viewMode === "full" && (
        <div className="space-y-8">
          {/* Header Section */}
          <Card className="bg-gradient-to-br from-[hsl(220,60%,15%)] to-[hsl(220,60%,12%)] border-[hsl(var(--cyan-glow))]/30 p-8">
            <div className="text-center mb-8">
              <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-[hsl(var(--cyan-glow))] to-[hsl(var(--primary))] flex items-center justify-center shadow-lg shadow-[hsl(var(--cyan-glow))]/20 mb-4">
                <Building2 className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">{formData.company_name || "Company Name"}</h1>
              <p className="text-xl text-white/70 mb-4">{formData.vertical} • {formData.stage}</p>
              <div className="flex justify-center gap-4 text-sm text-white/60">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {formData.location}</span>
                {formData.website && <span className="flex items-center gap-1"><Globe className="h-4 w-4" /> {formData.website}</span>}
              </div>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-sm font-semibold text-[hsl(var(--cyan-glow))] uppercase tracking-wider mb-3">Executive Summary</h3>
                <p className="text-lg text-white/90 leading-relaxed">
                  {formData.business_model || "Company description will appear here."}
                </p>
              </div>
            </div>
          </Card>

          {/* Section 1: Problem & Value Proposition */}
          <Card className="bg-[hsl(220,60%,15%)] border-white/10 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                <Target className="h-5 w-5 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Problem & Value Proposition</h2>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">The Problem</h4>
                <p className="text-white/90 leading-relaxed text-lg">
                  {sections.section2?.currentPainPoint || "No problem statement provided."}
                </p>
              </div>

              <Separator className="bg-white/10" />

              <div>
                <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Value Drivers</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {sections.section2?.valueDrivers?.map((driver: string, i: number) => (
                    <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-[hsl(var(--cyan-glow))]" />
                        <span className="font-semibold text-white">{valueDriverLabels[driver] || driver}</span>
                      </div>
                      <p className="text-white/70 text-sm">
                        {sections.section2?.valueDriverExplanations?.[driver] || "No explanation provided."}
                      </p>
                    </div>
                  )) || <p className="text-white/50">No value drivers specified.</p>}
                </div>
              </div>
            </div>
          </Card>

          {/* Section 2: Business Model */}
          <Card className="bg-[hsl(220,60%,15%)] border-white/10 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Business Model</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">Customer Type</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {sections.section3?.customerType?.map((type: string, i: number) => (
                    <Badge key={i} className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-sm px-3 py-1">
                      {type}
                    </Badge>
                  )) || <span className="text-white/50">Not specified</span>}
                </div>
                {sections.section3?.customerTypeExplanation && (
                  <p className="text-white/70 text-sm">{sections.section3.customerTypeExplanation}</p>
                )}
                {sections.section3?.businessStructure && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-2">Business Structure</h4>
                    <p className="text-white/70 text-sm">{sections.section3.businessStructure}</p>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">Revenue Streams</h4>
                <div className="space-y-2">
                  {sections.section3?.pricingStrategies?.map((strategy: string, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <span className="text-white capitalize">{strategy}</span>
                    </div>
                  )) || <span className="text-white/50">Not specified</span>}
                </div>
              </div>
            </div>
          </Card>

          {/* Section 3: Go-to-Market */}
          <Card className="bg-[hsl(220,60%,15%)] border-white/10 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Rocket className="h-5 w-5 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Go-to-Market Strategy</h2>
            </div>

            <div className="space-y-6">
              {sections.section4?.gtmAcquisition && (
                <div>
                  <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">Customer Acquisition</h4>
                  <p className="text-white/90 leading-relaxed">{sections.section4.gtmAcquisition}</p>
                </div>
              )}
              {sections.section4?.gtmTimeline && (
                <div>
                  <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">Timeline</h4>
                  <p className="text-white/90 leading-relaxed">{sections.section4.gtmTimeline}</p>
                </div>
              )}
              {!sections.section4?.gtmAcquisition && !sections.section4?.gtmTimeline && (
                <p className="text-white/50">No GTM strategy provided.</p>
              )}
            </div>
          </Card>

          {/* Section 4: Market Opportunity */}
          <Card className="bg-[hsl(220,60%,15%)] border-white/10 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-orange-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Market Opportunity</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl p-6 border border-blue-500/20 text-center">
                <p className="text-sm text-blue-400 font-semibold mb-2">Total Addressable Market</p>
                <p className="text-4xl font-bold text-white mb-2">{sections.section5?.tamValue || "—"}</p>
                {sections.section5?.tamBreakdown && (
                  <p className="text-xs text-white/50">{sections.section5.tamBreakdown}</p>
                )}
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-xl p-6 border border-purple-500/20 text-center">
                <p className="text-sm text-purple-400 font-semibold mb-2">Serviceable Addressable Market</p>
                <p className="text-4xl font-bold text-white mb-2">{sections.section5?.samValue || "—"}</p>
                {sections.section5?.samBreakdown && (
                  <p className="text-xs text-white/50">{sections.section5.samBreakdown}</p>
                )}
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl p-6 border border-green-500/20 text-center">
                <p className="text-sm text-green-400 font-semibold mb-2">Serviceable Obtainable Market</p>
                <p className="text-4xl font-bold text-white mb-2">{sections.section5?.somValue || "—"}</p>
                {sections.section5?.somBreakdown && (
                  <p className="text-xs text-white/50">{sections.section5.somBreakdown}</p>
                )}
              </div>
            </div>

            {sections.section5?.targetCustomerDescription && (
              <div>
                <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">Target Customer</h4>
                <p className="text-white/90 leading-relaxed">{sections.section5.targetCustomerDescription}</p>
              </div>
            )}
          </Card>

          {/* Section 5: Competitive Landscape */}
          <Card className="bg-[hsl(220,60%,15%)] border-white/10 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Shield className="h-5 w-5 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Competitive Landscape</h2>
            </div>

            {sections.section6?.competitors && sections.section6.competitors.length > 0 ? (
              <div className="space-y-4 mb-6">
                {sections.section6.competitors.filter((c: any) => c.name).map((competitor: any, i: number) => (
                  <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h4 className="font-semibold text-white mb-2">{competitor.name}</h4>
                    {competitor.description && <p className="text-white/60 text-sm mb-2">{competitor.description}</p>}
                    {competitor.howYouDiffer && (
                      <div className="flex items-start gap-2">
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs shrink-0">Differentiation</Badge>
                        <p className="text-white/70 text-sm">{competitor.howYouDiffer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/50 mb-6">No competitors listed.</p>
            )}

            {sections.section6?.competitiveMoat && (
              <div className="bg-gradient-to-r from-[hsl(var(--cyan-glow))]/10 to-transparent rounded-xl p-6 border-l-4 border-[hsl(var(--cyan-glow))]">
                <h4 className="text-sm font-semibold text-[hsl(var(--cyan-glow))] uppercase tracking-wider mb-2">Competitive Moat</h4>
                <p className="text-white/90 leading-relaxed">{sections.section6.competitiveMoat}</p>
              </div>
            )}
          </Card>

          {/* Section 6: Team */}
          <Card className="bg-[hsl(220,60%,15%)] border-white/10 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-pink-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Founding Team</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamMembers.length > 0 ? teamMembers.map((member: any, i: number) => (
                <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                      <span className="text-white font-bold">{member.name?.charAt(0) || "?"}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">{member.name || "Team Member"}</p>
                      <p className="text-sm text-[hsl(var(--cyan-glow))]">{member.role || "Role"}</p>
                    </div>
                  </div>
                  {member.background && <p className="text-white/60 text-sm">{member.background}</p>}
                </div>
              )) : (
                <p className="text-white/50">No team members listed.</p>
              )}
            </div>
          </Card>

          {/* Footer */}
          <div className="text-center py-8 border-t border-white/10">
            <p className="text-white/40 text-sm">
              Generated by In-Sync • Last updated: {application?.updated_at ? new Date(application.updated_at).toLocaleDateString() : "Never"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
