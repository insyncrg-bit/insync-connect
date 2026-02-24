import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Building2, Globe, Linkedin } from "lucide-react";
import { LocationField } from "@/components/onboarding";
import { StartupOnboardingData } from "../../hooks/useStartupOnboardingStorage";
import { VERTICALS, STAGES } from "../../constants";

interface CompanyInfoStepProps {
  data: StartupOnboardingData;
  onUpdate: (data: Partial<StartupOnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const CompanyInfoStep = ({ data, onUpdate, onNext, onBack }: CompanyInfoStepProps) => {
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpdate({ companyLogo: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ logoPreview: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePitchdeckUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        return;
      }
      onUpdate({ pitchdeck: file, pitchdeckName: file.name });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Company Information</h2>
        <p className="text-[hsl(var(--navy-deep))]/60">Tell us about your company</p>
      </div>

      {/* Logo Upload */}
      <div className="space-y-2">
        <Label className="text-[hsl(var(--navy-deep))]/80">Company Logo (Optional)</Label>
        <div className="flex items-center gap-4">
          {data.logoPreview ? (
            <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-cyan-glow/30">
              <img src={data.logoPreview} alt="Company logo" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-lg border-2 border-dashed border-[hsl(var(--navy-deep))]/20 flex items-center justify-center">
              <Upload className="w-8 h-8 text-[hsl(var(--navy-deep))]/40" />
            </div>
          )}
          <div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
              id="logo-upload"
            />
            <Label htmlFor="logo-upload" className="cursor-pointer">
              <Button type="button" variant="outline" asChild className="border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5">
                <span>Upload Logo</span>
              </Button>
            </Label>
            <p className="text-xs text-[hsl(var(--navy-deep))]/50 mt-1">PNG, JPG up to 5MB</p>
          </div>
        </div>
      </div>

      {/* Pitchdeck Upload */}
      <div className="space-y-2">
        <Label className="text-[hsl(var(--navy-deep))]/80">Pitch Deck (Optional)</Label>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-lg border-2 border-dashed border-[hsl(var(--navy-deep))]/20 flex items-center justify-center">
            {data.pitchdeckName ? (
              <div className="text-center p-2">
                <p className="text-[10px] text-[hsl(var(--navy-deep))]/70 truncate max-w-[80px]">{data.pitchdeckName}</p>
              </div>
            ) : (
              <Upload className="w-8 h-8 text-[hsl(var(--navy-deep))]/40" />
            )}
          </div>
          <div>
            <Input
              type="file"
              accept=".pdf"
              onChange={handlePitchdeckUpload}
              className="hidden"
              id="pitchdeck-upload"
            />
            <Label htmlFor="pitchdeck-upload" className="cursor-pointer">
              <Button type="button" variant="outline" asChild className="border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5">
                <span>{data.pitchdeckName ? 'Replace Pitch Deck' : 'Upload Pitch Deck'}</span>
              </Button>
            </Label>
            <p className="text-xs text-[hsl(var(--navy-deep))]/50 mt-1">PDF up to 20MB</p>
          </div>
        </div>
      </div>

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
