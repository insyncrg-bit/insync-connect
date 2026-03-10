import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload, Building2, Globe, Linkedin, X, Sparkles } from "lucide-react";
import { LocationField } from "@/components/onboarding";
import { StartupOnboardingData } from "../../hooks/startupMemoTypes";
import { VERTICALS, STAGES } from "../../constants";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

interface CompanyInfoStepProps {
  data: StartupOnboardingData;
  onUpdate: (data: Partial<StartupOnboardingData>) => void;
  onLogoUpload?: (file: File) => Promise<string>;
  onNext: () => void;
  onBack: () => void;
  isEditMode?: boolean;
}

export const CompanyInfoStep = ({ data, onUpdate, onLogoUpload, onNext, onBack, isEditMode }: CompanyInfoStepProps) => {
  const { toast } = useToast();
  const [logoUploading, setLogoUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState<"uploading" | "inferring" | "idle">("idle");

  const handlePitchdeckUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({ title: "Invalid file", description: "Only PDF files are supported.", variant: "destructive" });
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast({ title: "File too large", description: "PDF must be under 20MB.", variant: "destructive" });
      return;
    }

    const { getAuth } = await import("firebase/auth");
    const user = getAuth().currentUser;
    if (!user) {
      toast({ title: "Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    setProcessStep("uploading");
    
    try {
      const { uploadFile } = await import("@/lib/api");
      const url = await uploadFile(file, "pitchdeck", user.uid);
      onUpdate({ pitchdeck: file, pitchdeckName: file.name, pitchdeckUrl: url });
      
      await runInference(url);
    } catch (err: any) {
      toast({ title: "Upload Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsProcessing(false);
      setProcessStep("idle");
    }
  };

  const runInference = async (url: string) => {
    setIsProcessing(true);
    setProcessStep("inferring");
    
    try {
      const { inferMemo } = await import("@/lib/api");
      const result = await inferMemo(url);

      if (result.success && result.data) {
        const inferredData = result.data;
        
        // Handle valueDriverExplanations parsing if it's a string
        const updates: any = { ...inferredData };
        delete updates.confidence;

        if (typeof updates.valueDriverExplanations === 'string') {
          try {
            updates.valueDriverExplanations = JSON.parse(updates.valueDriverExplanations);
          } catch (e) {
            updates.valueDriverExplanations = {};
          }
        }

        onUpdate(updates);
        toast({ title: "Autofill Complete", description: "Your startup profile has been updated with data from the deck." });
      }
    } catch (err: any) {
      toast({ title: "Autofill Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsProcessing(false);
      setProcessStep("idle");
    }
  };


  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!onLogoUpload) {
      onUpdate({ companyLogo: file });
      const reader = new FileReader();
      reader.onloadend = () => onUpdate({ logoPreview: reader.result as string });
      reader.readAsDataURL(file);
      return;
    }
    setLogoUploading(true);
    try {
      const url = await onLogoUpload(file);
      onUpdate({ startupLogoUrl: url, logoPreview: url, companyLogo: null });
    } catch (err: any) {
      console.error("Logo upload failed:", err);
      toast({
        title: "Upload failed",
        description: err?.message || "Could not upload logo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLogoUploading(false);
    }
    e.target.value = "";
  };



  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Company Overview</h2>
        <p className="text-[hsl(var(--navy-deep))]/60">Tell us about your company</p>
      </div>

      {/* Logo Upload */}
      <div className="space-y-2">
        <Label className="text-[hsl(var(--navy-deep))]/80">Company Logo (Optional)</Label>
        <div className="flex items-center gap-4">
          <div className="relative group">
            {data.logoPreview ? (
              <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-cyan-glow/30">
                <img src={data.logoPreview} alt="Company logo" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-lg border-2 border-dashed border-[hsl(var(--navy-deep))]/20 flex items-center justify-center">
                {logoUploading ? (
                  <Loader2 className="w-8 h-8 text-[hsl(var(--navy-deep))]/40 animate-spin" />
                ) : (
                  <Upload className="w-8 h-8 text-[hsl(var(--navy-deep))]/40" />
                )}
              </div>
            )}
            {data.logoPreview && !logoUploading && (
              <button
                type="button"
                onClick={() => onUpdate({ companyLogo: null, logoPreview: null, startupLogoUrl: null })}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {!data.logoPreview && (
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={logoUploading}
                className="hidden"
                id="logo-upload"
              />
              <Label htmlFor="logo-upload" className={logoUploading ? "pointer-events-none opacity-60" : "cursor-pointer"}>
                <Button type="button" variant="outline" disabled={logoUploading} asChild className="border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5">
                  <span>{logoUploading ? "Uploading..." : "Upload Logo"}</span>
                </Button>
              </Label>
              <p className="text-xs text-[hsl(var(--navy-deep))]/50 mt-1">PNG, JPG up to 5MB</p>
            </div>
          )}
        </div>
      </div>

      {/* Pitch Deck Upload (Edit Mode Only) */}
      {isEditMode && (
        <div className="space-y-4 pt-4 border-t border-[hsl(var(--navy-deep))]/10">
          <div className="space-y-2">
            <Label className="text-[hsl(var(--navy-deep))]/80">Pitch Deck (PDF)</Label>
            <p className="text-[hsl(var(--navy-deep))]/60 text-sm">Update your pitch deck to refresh your profile.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className={cn(
                "w-24 h-24 rounded-lg bg-[hsl(var(--navy-deep))]/5 border-2 border-dashed flex items-center justify-center p-2 text-center text-xs text-[hsl(var(--navy-deep))]/80 break-all overflow-hidden transition-all",
                isProcessing ? "border-cyan-glow animate-pulse" : "border-[hsl(var(--navy-deep))]/20"
              )}>
                {isProcessing ? (
                   <Loader2 className="w-6 h-6 text-cyan-glow animate-spin" />
                ) : data.pitchdeckName ? data.pitchdeckName : "No File"}
              </div>
              {data.pitchdeckName && !isProcessing && (
                <button
                  type="button"
                  onClick={() => onUpdate({ pitchdeck: null, pitchdeckName: null, pitchdeckUrl: null })}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="space-y-3">
              {!data.pitchdeckName && !isProcessing && (
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={handlePitchdeckUpload}
                    className="hidden"
                    id="pitchdeck-upload-edit"
                  />
                  <Label htmlFor="pitchdeck-upload-edit" className="cursor-pointer">
                    <Button type="button" variant="outline" asChild className="border-[hsl(var(--navy-deep))]/20 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5">
                      <span>Upload Pitch Deck</span>
                    </Button>
                  </Label>
                </div>
              )}
              {!data.pitchdeckName && !isProcessing && <p className="text-xs text-[hsl(var(--navy-deep))]/50 mt-1">PDF up to 20MB</p>}
              
              {data.pitchdeckName && (
                <div className="flex flex-col gap-2">
                   <Button 
                    type="button" 
                    variant="default"
                    className="bg-[hsl(var(--navy-deep))] text-white hover:bg-[hsl(var(--navy-deep))]/90"
                    onClick={() => {
                      if (window.confirm("This will overwrite all of your current memo data. Are you sure?")) {
                        data.pitchdeckUrl && runInference(data.pitchdeckUrl);
                      }
                    }}
                    disabled={isProcessing || !data.pitchdeckUrl}
                  >
                    {isProcessing ? (
                       <span className="flex items-center gap-2">
                          {processStep === "uploading" ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Sparkles className="w-4 h-4 animate-pulse text-cyan-glow" />
                          )}
                          {processStep === "uploading" ? "Syncing to Cloud..." : "Analysing Pitch Deck..."}
                       </span>
                    ) : "Rerun Autofill"}
                  </Button>
                  {isProcessing && processStep === "inferring" && (
                    <p className="text-[10px] text-cyan-700 italic">This usually takes ~60s</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}




      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-[hsl(var(--navy-deep))]/80">Company Name *</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--navy-deep))]/60" />
            <Input
              value={data.companyName}
              onChange={(e) => onUpdate({ companyName: e.target.value })}
              placeholder="Your company name"
              className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] placeholder:text-[hsl(var(--navy-deep))]/50 focus:border-cyan-glow focus:ring-cyan-glow/20 pl-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-[hsl(var(--navy-deep))]/80">Website</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--navy-deep))]/60" />
            <Input
              value={data.website}
              onChange={(e) => onUpdate({ website: e.target.value })}
              placeholder="https://yourcompany.com"
              className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] placeholder:text-[hsl(var(--navy-deep))]/50 focus:border-cyan-glow focus:ring-cyan-glow/20 pl-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-[hsl(var(--navy-deep))]/80">LinkedIn</Label>
          <div className="relative">
            <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--navy-deep))]/60" />
            <Input
              value={data.linkedIn}
              onChange={(e) => onUpdate({ linkedIn: e.target.value })}
              placeholder="Company LinkedIn URL"
              className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] placeholder:text-[hsl(var(--navy-deep))]/50 focus:border-cyan-glow focus:ring-cyan-glow/20 pl-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-[hsl(var(--navy-deep))]/80">Vertical *</Label>
          <Select value={data.vertical} onValueChange={(v) => onUpdate({ vertical: v })}>
            <SelectTrigger className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))]">
              <SelectValue placeholder="Select vertical" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-[hsl(var(--navy-deep))]/10">
              {VERTICALS.map((vertical) => (
                <SelectItem key={vertical} value={vertical} className="text-[hsl(var(--navy-deep))]">
                  {vertical}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-[hsl(var(--navy-deep))]/80">Stage *</Label>
          <Select value={data.stage} onValueChange={(v) => onUpdate({ stage: v })}>
            <SelectTrigger className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))]">
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-[hsl(var(--navy-deep))]/10">
              {STAGES.map((stage) => (
                <SelectItem key={stage} value={stage} className="text-[hsl(var(--navy-deep))]">
                  {stage}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-[hsl(var(--navy-deep))]/80">Headquarters *</Label>
          <LocationField
            value={data.location}
            onChange={(location) => onUpdate({ location })}
          />
        </div>
      </div>

      <div className="space-y-2 pt-6 border-t border-[hsl(var(--navy-deep))]/10">
        <Label className="text-[hsl(var(--navy-deep))]/80">
          Company Overview * (min 30 words)
        </Label>
        <Textarea
          value={data.companyOverview}
          onChange={(e) => onUpdate({ companyOverview: e.target.value })}
          placeholder="Describe your company, the problem you're solving, and your solution..."
          className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] placeholder:text-[hsl(var(--navy-deep))]/50 focus:border-cyan-glow min-h-[150px]"
          rows={6}
        />
        <p className={`text-xs ${countWords(data.companyOverview) >= 30 ? "text-cyan-glow" : "text-[hsl(var(--navy-deep))]/50"}`}>
          {countWords(data.companyOverview)} / 30 words
        </p>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} className="border-[hsl(var(--navy-deep))]/20 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5">
          Back
        </Button>
        <Button onClick={onNext} className="bg-cyan-glow text-navy-deep hover:bg-cyan-bright">
          Next
        </Button>
      </div>
    </div>
  );
};
