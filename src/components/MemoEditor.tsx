import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
  TrendingUp
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">My Memo</h2>
          <p className="text-white/60">View and edit your company information</p>
        </div>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-[hsl(var(--cyan-glow))]/20 text-[hsl(var(--cyan-glow))] hover:bg-[hsl(var(--cyan-glow))]/30 border border-[hsl(var(--cyan-glow))]/30"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Memo
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
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      {/* Company Overview Card */}
      <Card className="bg-[hsl(220,60%,15%)] border-white/10 p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[hsl(var(--cyan-glow))] to-[hsl(var(--primary))] flex items-center justify-center">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            {isEditing ? (
              <Input
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="bg-white/5 border-white/20 text-white text-xl font-bold mb-2"
                placeholder="Company Name"
              />
            ) : (
              <h3 className="text-xl font-bold text-white mb-1">{formData.company_name || "Your Company"}</h3>
            )}
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-[hsl(var(--cyan-glow))]/20 text-[hsl(var(--cyan-glow))] border-[hsl(var(--cyan-glow))]/30">
                {formData.vertical || "Vertical"}
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                {formData.stage || "Stage"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-white/60 flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Location
            </Label>
            {isEditing ? (
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="bg-white/5 border-white/20 text-white"
                placeholder="City, Country"
              />
            ) : (
              <p className="text-white">{formData.location || "Not specified"}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-white/60 flex items-center gap-2">
              <Globe className="h-4 w-4" /> Website
            </Label>
            {isEditing ? (
              <Input
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="bg-white/5 border-white/20 text-white"
                placeholder="https://..."
              />
            ) : (
              <p className="text-white">{formData.website || "Not specified"}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-white/60 flex items-center gap-2">
              <Briefcase className="h-4 w-4" /> Vertical
            </Label>
            {isEditing ? (
              <Input
                value={formData.vertical}
                onChange={(e) => setFormData({ ...formData, vertical: e.target.value })}
                className="bg-white/5 border-white/20 text-white"
                placeholder="e.g., FinTech, HealthTech"
              />
            ) : (
              <p className="text-white">{formData.vertical || "Not specified"}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-white/60 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Stage
            </Label>
            {isEditing ? (
              <Input
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                className="bg-white/5 border-white/20 text-white"
                placeholder="e.g., Pre-seed, Seed, Series A"
              />
            ) : (
              <p className="text-white">{formData.stage || "Not specified"}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Business Overview */}
      <Card className="bg-[hsl(220,60%,15%)] border-white/10 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Target className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
          <h4 className="text-lg font-semibold text-white">Business Overview</h4>
        </div>
        {isEditing ? (
          <Textarea
            value={formData.business_model}
            onChange={(e) => setFormData({ ...formData, business_model: e.target.value })}
            className="bg-white/5 border-white/20 text-white min-h-[150px]"
            placeholder="Describe your business model and what problem you're solving..."
          />
        ) : (
          <p className="text-white/80 leading-relaxed">
            {formData.business_model || "No business overview provided."}
          </p>
        )}
      </Card>

      {/* Value Proposition */}
      {sections.section2 && (
        <Card className="bg-[hsl(220,60%,15%)] border-white/10 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
            <h4 className="text-lg font-semibold text-white">Value Proposition</h4>
          </div>
          <div className="space-y-4">
            {sections.section2.currentPainPoint && (
              <div>
                <Label className="text-white/60 text-sm">Problem Being Solved</Label>
                <p className="text-white/80 mt-1">{sections.section2.currentPainPoint}</p>
              </div>
            )}
            {sections.section2.valueDrivers && sections.section2.valueDrivers.length > 0 && (
              <div>
                <Label className="text-white/60 text-sm">Value Drivers</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {sections.section2.valueDrivers.map((driver: string, i: number) => (
                    <Badge key={i} className="bg-green-500/20 text-green-400 border-green-500/30">
                      {driver}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Market Sizing */}
      {sections.section5 && (
        <Card className="bg-[hsl(220,60%,15%)] border-white/10 p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Market Sizing</h4>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <p className="text-white/60 text-sm">TAM</p>
              <p className="text-xl font-bold text-white">{sections.section5.tamValue || "N/A"}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <p className="text-white/60 text-sm">SAM</p>
              <p className="text-xl font-bold text-white">{sections.section5.samValue || "N/A"}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <p className="text-white/60 text-sm">SOM</p>
              <p className="text-xl font-bold text-white">{sections.section5.somValue || "N/A"}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Last Updated */}
      <p className="text-white/40 text-sm text-center">
        Last updated: {application?.updated_at ? new Date(application.updated_at).toLocaleDateString() : "Never"}
      </p>
    </div>
  );
}
