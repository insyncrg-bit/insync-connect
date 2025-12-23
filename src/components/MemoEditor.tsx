import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Eye,
  ChevronRight,
  Calculator
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MemoEditorProps {
  application: any;
  onUpdate?: () => void;
}

type MarketMetric = "tam" | "sam" | "som" | null;

export function MemoEditor({ application, onUpdate }: MemoEditorProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<"condensed" | "full">("condensed");
  const [selectedMetric, setSelectedMetric] = useState<MarketMetric>(null);
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
      {/* Back Button */}
      <Button
        onClick={() => navigate("/founder-dashboard")}
        className="bg-[hsl(var(--cyan-glow))] text-[#151a24] hover:bg-[hsl(var(--cyan-bright))] shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all duration-300 font-semibold"
      >
        ← Back to Your Dashboard
      </Button>

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
          <Card className="bg-navy-card border-[hsl(var(--cyan-glow))]/30 p-8 relative overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.08)]">
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
                      <Badge className="bg-white/10 text-white/80 border-white/20 text-sm">
                        {formData.stage || "Stage"}
                      </Badge>
                      <Badge className="bg-[hsl(var(--cyan-bright))]/20 text-[hsl(var(--cyan-bright))] border-[hsl(var(--cyan-bright))]/30 text-sm">
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

              {/* Key Metrics Row - Clickable */}
              <div className="grid grid-cols-3 gap-4">
                <button 
                  onClick={() => setSelectedMetric("tam")}
                  className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all cursor-pointer group border border-transparent hover:border-[hsl(var(--cyan-glow))]/30"
                >
                  <p className="text-sm text-white/50 mb-1 group-hover:text-[hsl(var(--cyan-glow))] transition-colors">TAM</p>
                  <p className="text-2xl font-bold text-white">{sections.section5?.tamValue || "—"}</p>
                  <p className="text-xs text-white/30 mt-1 group-hover:text-white/50 flex items-center justify-center gap-1">
                    View breakdown <ChevronRight className="h-3 w-3" />
                  </p>
                </button>
                <button 
                  onClick={() => setSelectedMetric("sam")}
                  className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all cursor-pointer group border border-transparent hover:border-[hsl(var(--cyan-glow))]/30"
                >
                  <p className="text-sm text-white/50 mb-1 group-hover:text-[hsl(var(--cyan-glow))] transition-colors">SAM</p>
                  <p className="text-2xl font-bold text-white">{sections.section5?.samValue || "—"}</p>
                  <p className="text-xs text-white/30 mt-1 group-hover:text-white/50 flex items-center justify-center gap-1">
                    View breakdown <ChevronRight className="h-3 w-3" />
                  </p>
                </button>
                <button 
                  onClick={() => setSelectedMetric("som")}
                  className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all cursor-pointer group border border-transparent hover:border-[hsl(var(--cyan-glow))]/30"
                >
                  <p className="text-sm text-white/50 mb-1 group-hover:text-[hsl(var(--cyan-glow))] transition-colors">SOM</p>
                  <p className="text-2xl font-bold text-white">{sections.section5?.somValue || "—"}</p>
                  <p className="text-xs text-white/30 mt-1 group-hover:text-white/50 flex items-center justify-center gap-1">
                    View breakdown <ChevronRight className="h-3 w-3" />
                  </p>
                </button>
              </div>
            </div>
          </Card>

          {/* Quick Stats Grid - Colorful */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-[hsl(var(--cyan-glow))]/20 to-[hsl(var(--cyan-glow))]/5 border-[hsl(var(--cyan-glow))]/30 p-4 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[hsl(var(--cyan-glow))]/30 flex items-center justify-center">
                  <Users className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
                </div>
                <div>
                  <p className="text-[hsl(var(--cyan-glow))]/80 text-xs font-medium">Team Size</p>
                  <p className="text-white font-bold text-lg">{teamMembers.length || 1}</p>
                </div>
              </div>
            </Card>
            <Card className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 border-purple-500/30 p-4 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/30 flex items-center justify-center">
                  <Target className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-purple-400/80 text-xs font-medium">Customer</p>
                  <p className="text-white font-bold text-lg">{sections.section3?.customerType?.join("/") || "—"}</p>
                </div>
              </div>
            </Card>
            <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 p-4 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/30 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-emerald-400/80 text-xs font-medium">Revenue Model</p>
                  <p className="text-white font-bold text-sm">{sections.section3?.pricingStrategies?.[0] || "—"}</p>
                </div>
              </div>
            </Card>
            <Card className="bg-gradient-to-br from-amber-500/20 to-amber-500/5 border-amber-500/30 p-4 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/30 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-amber-400/80 text-xs font-medium">Value Drivers</p>
                  <p className="text-white font-bold text-lg">{sections.section2?.valueDrivers?.length || 0}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Problem & Solution - Colorful */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-rose-500/10 to-rose-500/5 border-rose-500/30 p-6 shadow-[0_0_15px_rgba(244,63,94,0.1)]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center">
                  <Target className="h-4 w-4 text-rose-400" />
                </div>
                <h3 className="text-lg font-semibold text-rose-300">The Problem</h3>
              </div>
              <p className="text-white/80 leading-relaxed">
                {sections.section2?.currentPainPoint || "Problem statement will appear here based on your application."}
              </p>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/30 p-6 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Rocket className="h-4 w-4 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-emerald-300">The Solution</h3>
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
          <Card className="bg-navy-card border-[hsl(var(--cyan-glow))]/30 p-8 shadow-[0_0_15px_rgba(6,182,212,0.08)]">
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

          {/* Section 1: Problem & Value Proposition - Rose accent */}
          <Card className="bg-gradient-to-br from-rose-500/10 to-navy-card border-rose-500/20 p-8 shadow-[0_0_20px_rgba(244,63,94,0.1)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                <Target className="h-5 w-5 text-rose-400" />
              </div>
              <h2 className="text-2xl font-bold text-rose-300">Problem & Value Proposition</h2>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-rose-400/70 uppercase tracking-wider mb-3">The Problem</h4>
                <p className="text-white/90 leading-relaxed text-lg">
                  {sections.section2?.currentPainPoint || "No problem statement provided."}
                </p>
              </div>

              <Separator className="bg-rose-500/20" />

              <div>
                <h4 className="text-sm font-semibold text-rose-400/70 uppercase tracking-wider mb-4">Value Drivers</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {sections.section2?.valueDrivers?.map((driver: string, i: number) => (
                    <div key={i} className="bg-white/5 rounded-xl p-4 border border-rose-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-amber-400" />
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

          {/* Section 2: Business Model - Emerald accent */}
          <Card className="bg-gradient-to-br from-emerald-500/10 to-navy-card border-emerald-500/20 p-8 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-emerald-300">Business Model</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-emerald-400/70 uppercase tracking-wider mb-3">Customer Type</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {sections.section3?.customerType?.map((type: string, i: number) => (
                    <Badge key={i} className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-sm px-3 py-1">
                      {type}
                    </Badge>
                  )) || <span className="text-white/50">Not specified</span>}
                </div>
                {sections.section3?.customerTypeExplanation && (
                  <p className="text-white/70 text-sm">{sections.section3.customerTypeExplanation}</p>
                )}
                {sections.section3?.businessStructure && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-emerald-400/70 uppercase tracking-wider mb-2">Business Structure</h4>
                    <p className="text-white/70 text-sm">{sections.section3.businessStructure}</p>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-semibold text-emerald-400/70 uppercase tracking-wider mb-3">Revenue Streams</h4>
                <div className="space-y-2">
                  {sections.section3?.pricingStrategies?.map((strategy: string, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-white capitalize">{strategy}</span>
                    </div>
                  )) || <span className="text-white/50">Not specified</span>}
                </div>
              </div>
            </div>
          </Card>

          {/* Section 3: Go-to-Market - Purple accent */}
          <Card className="bg-gradient-to-br from-purple-500/10 to-navy-card border-purple-500/20 p-8 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Rocket className="h-5 w-5 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-purple-300">Go-to-Market Strategy</h2>
            </div>

            <div className="space-y-6">
              {sections.section4?.gtmAcquisition && (
                <div>
                  <h4 className="text-sm font-semibold text-purple-400/70 uppercase tracking-wider mb-3">Customer Acquisition</h4>
                  <p className="text-white/90 leading-relaxed">{sections.section4.gtmAcquisition}</p>
                </div>
              )}
              {sections.section4?.gtmTimeline && (
                <div>
                  <h4 className="text-sm font-semibold text-purple-400/70 uppercase tracking-wider mb-3">Timeline</h4>
                  <p className="text-white/90 leading-relaxed">{sections.section4.gtmTimeline}</p>
                </div>
              )}
              {!sections.section4?.gtmAcquisition && !sections.section4?.gtmTimeline && (
                <p className="text-white/50">No GTM strategy provided.</p>
              )}
            </div>
          </Card>

          {/* Section 4: Market Opportunity - Amber accent */}
          <Card className="bg-gradient-to-br from-amber-500/10 to-navy-card border-amber-500/20 p-8 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold text-amber-300">Market Opportunity</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <button 
                onClick={() => setSelectedMetric("tam")}
                className="bg-gradient-to-br from-amber-500/20 to-amber-500/5 rounded-xl p-6 border border-amber-500/30 text-center hover:border-amber-500/60 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all cursor-pointer group"
              >
                <p className="text-sm text-amber-400 font-semibold mb-2">Total Addressable Market</p>
                <p className="text-4xl font-bold text-white mb-2">{sections.section5?.tamValue || "—"}</p>
                <p className="text-xs text-amber-400/50 group-hover:text-amber-400/80 flex items-center justify-center gap-1">
                  <Calculator className="h-3 w-3" /> View calculation method
                </p>
              </button>
              <button 
                onClick={() => setSelectedMetric("sam")}
                className="bg-gradient-to-br from-[hsl(var(--cyan-glow))]/20 to-[hsl(var(--cyan-glow))]/5 rounded-xl p-6 border border-[hsl(var(--cyan-glow))]/30 text-center hover:border-[hsl(var(--cyan-glow))]/60 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all cursor-pointer group"
              >
                <p className="text-sm text-[hsl(var(--cyan-glow))] font-semibold mb-2">Serviceable Addressable Market</p>
                <p className="text-4xl font-bold text-white mb-2">{sections.section5?.samValue || "—"}</p>
                <p className="text-xs text-[hsl(var(--cyan-glow))]/50 group-hover:text-[hsl(var(--cyan-glow))]/80 flex items-center justify-center gap-1">
                  <Calculator className="h-3 w-3" /> View calculation method
                </p>
              </button>
              <button 
                onClick={() => setSelectedMetric("som")}
                className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 rounded-xl p-6 border border-emerald-500/30 text-center hover:border-emerald-500/60 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all cursor-pointer group"
              >
                <p className="text-sm text-emerald-400 font-semibold mb-2">Serviceable Obtainable Market</p>
                <p className="text-4xl font-bold text-white mb-2">{sections.section5?.somValue || "—"}</p>
                <p className="text-xs text-emerald-400/50 group-hover:text-emerald-400/80 flex items-center justify-center gap-1">
                  <Calculator className="h-3 w-3" /> View calculation method
                </p>
              </button>
            </div>

            {sections.section5?.targetCustomerDescription && (
              <div>
                <h4 className="text-sm font-semibold text-amber-400/70 uppercase tracking-wider mb-3">Target Customer</h4>
                <p className="text-white/90 leading-relaxed">{sections.section5.targetCustomerDescription}</p>
              </div>
            )}
          </Card>

          {/* Section 5: Competitive Landscape - Cyan accent */}
          <Card className="bg-gradient-to-br from-cyan-500/10 to-navy-card border-cyan-500/20 p-8 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Shield className="h-5 w-5 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-cyan-300">Competitive Landscape</h2>
            </div>

            {sections.section6?.competitors && sections.section6.competitors.length > 0 ? (
              <div className="space-y-4 mb-6">
                {sections.section6.competitors.filter((c: any) => c.name).map((competitor: any, i: number) => (
                  <div key={i} className="bg-white/5 rounded-xl p-4 border border-cyan-500/20">
                    <h4 className="font-semibold text-white mb-2">{competitor.name}</h4>
                    {competitor.description && <p className="text-white/60 text-sm mb-2">{competitor.description}</p>}
                    {competitor.howYouDiffer && (
                      <div className="flex items-start gap-2">
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs shrink-0">Differentiation</Badge>
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
              <div className="bg-gradient-to-r from-cyan-500/20 to-transparent rounded-xl p-6 border-l-4 border-cyan-400">
                <h4 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider mb-2">Competitive Moat</h4>
                <p className="text-white/90 leading-relaxed">{sections.section6.competitiveMoat}</p>
              </div>
            )}
          </Card>

          {/* Section 6: Team - Pink accent */}
          <Card className="bg-gradient-to-br from-pink-500/10 to-navy-card border-pink-500/20 p-8 shadow-[0_0_20px_rgba(236,72,153,0.1)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-pink-400" />
              </div>
              <h2 className="text-2xl font-bold text-pink-300">Founding Team</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamMembers.length > 0 ? teamMembers.map((member: any, i: number) => (
                <div key={i} className="bg-white/5 rounded-xl p-4 border border-pink-500/20 hover:border-pink-500/40 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-lg shadow-pink-500/20">
                      <span className="text-white font-bold">{member.name?.charAt(0) || "?"}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">{member.name || "Team Member"}</p>
                      <p className="text-sm text-pink-400">{member.role || "Role"}</p>
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

      {/* Market Sizing Dialog */}
      <Dialog open={selectedMetric !== null} onOpenChange={() => setSelectedMetric(null)}>
        <DialogContent className="bg-navy-card border-white/20 text-white max-w-2xl shadow-[0_0_30px_rgba(6,182,212,0.15)]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                selectedMetric === "tam" ? "bg-blue-500/20" :
                selectedMetric === "sam" ? "bg-purple-500/20" : "bg-green-500/20"
              }`}>
                <BarChart3 className={`h-5 w-5 ${
                  selectedMetric === "tam" ? "text-blue-400" :
                  selectedMetric === "sam" ? "text-purple-400" : "text-green-400"
                }`} />
              </div>
              {selectedMetric === "tam" && "Total Addressable Market (TAM)"}
              {selectedMetric === "sam" && "Serviceable Addressable Market (SAM)"}
              {selectedMetric === "som" && "Serviceable Obtainable Market (SOM)"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            {/* Value Display */}
            <div className={`rounded-xl p-6 text-center border ${
              selectedMetric === "tam" ? "bg-blue-500/10 border-blue-500/30" :
              selectedMetric === "sam" ? "bg-purple-500/10 border-purple-500/30" : "bg-green-500/10 border-green-500/30"
            }`}>
              <p className="text-sm text-white/50 mb-1">Market Value</p>
              <p className="text-5xl font-bold text-white">
                {selectedMetric === "tam" && (sections.section5?.tamValue || "—")}
                {selectedMetric === "sam" && (sections.section5?.samValue || "—")}
                {selectedMetric === "som" && (sections.section5?.somValue || "—")}
              </p>
            </div>

            {/* Definition */}
            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" /> Definition
              </h4>
              <p className="text-white/80 leading-relaxed">
                {selectedMetric === "tam" && "The total market demand for a product or service, representing the maximum potential revenue opportunity if 100% market share were achieved."}
                {selectedMetric === "sam" && "The segment of the TAM targeted by your products/services that is within your geographical reach and target demographics."}
                {selectedMetric === "som" && "The realistic portion of SAM that you can capture, considering competition, resources, and current capabilities."}
              </p>
            </div>

            {/* Calculation Method */}
            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Calculator className="h-4 w-4" /> Calculation Breakdown
              </h4>
              <div className="text-white/80 leading-relaxed">
                {selectedMetric === "tam" && (
                  sections.section5?.tamBreakdown ? (
                    <p>{sections.section5.tamBreakdown}</p>
                  ) : (
                    <p className="text-white/50 italic">No calculation breakdown provided in the application.</p>
                  )
                )}
                {selectedMetric === "sam" && (
                  sections.section5?.samBreakdown ? (
                    <p>{sections.section5.samBreakdown}</p>
                  ) : (
                    <p className="text-white/50 italic">No calculation breakdown provided in the application.</p>
                  )
                )}
                {selectedMetric === "som" && (
                  sections.section5?.somBreakdown ? (
                    <p>{sections.section5.somBreakdown}</p>
                  ) : (
                    <p className="text-white/50 italic">No calculation breakdown provided in the application.</p>
                  )
                )}
              </div>
            </div>

            {/* Market Relationship Visual */}
            <div className="bg-white/5 rounded-xl p-5 border border-white/10">
              <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Market Hierarchy</h4>
              <div className="flex items-center justify-center gap-2">
                <div className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedMetric === "tam" 
                    ? "bg-blue-500/30 text-blue-300 ring-2 ring-blue-400" 
                    : "bg-blue-500/10 text-blue-400/70"
                }`}>
                  TAM: {sections.section5?.tamValue || "—"}
                </div>
                <ChevronRight className="h-4 w-4 text-white/30" />
                <div className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedMetric === "sam" 
                    ? "bg-purple-500/30 text-purple-300 ring-2 ring-purple-400" 
                    : "bg-purple-500/10 text-purple-400/70"
                }`}>
                  SAM: {sections.section5?.samValue || "—"}
                </div>
                <ChevronRight className="h-4 w-4 text-white/30" />
                <div className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedMetric === "som" 
                    ? "bg-green-500/30 text-green-300 ring-2 ring-green-400" 
                    : "bg-green-500/10 text-green-400/70"
                }`}>
                  SOM: {sections.section5?.somValue || "—"}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
