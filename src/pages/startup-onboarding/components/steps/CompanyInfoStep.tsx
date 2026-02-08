import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Building2, Globe, Linkedin, MapPin, User, Mail } from "lucide-react";
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
        <h2 className="text-2xl font-bold text-white">Company Information</h2>
        <p className="text-white/60">Tell us about your company</p>
      </div>

      {/* Logo Upload */}
      <div className="space-y-2">
        <Label className="text-white/80">Company Logo (Optional)</Label>
        <div className="flex items-center gap-4">
          {data.logoPreview ? (
            <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-cyan-glow/30">
              <img src={data.logoPreview} alt="Company logo" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center">
              <Upload className="w-8 h-8 text-white/40" />
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
              <Button type="button" variant="outline" asChild className="border-white/10 text-white hover:bg-white/10">
                <span>Upload Logo</span>
              </Button>
            </Label>
            <p className="text-xs text-white/50 mt-1">PNG, JPG up to 5MB</p>
          </div>
        </div>
      </div>

      {/* Pitchdeck Upload */}
      <div className="space-y-2">
        <Label className="text-white/80">Pitch Deck (Optional)</Label>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center">
            {data.pitchdeckName ? (
              <div className="text-center p-2">
                <p className="text-[10px] text-white/70 truncate max-w-[80px]">{data.pitchdeckName}</p>
              </div>
            ) : (
              <Upload className="w-8 h-8 text-white/40" />
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
              <Button type="button" variant="outline" asChild className="border-white/10 text-white hover:bg-white/10">
                <span>{data.pitchdeckName ? 'Replace Pitch Deck' : 'Upload Pitch Deck'}</span>
              </Button>
            </Label>
            <p className="text-xs text-white/50 mt-1">PDF up to 20MB</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-white/80">Company Name *</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
            <Input
              value={data.companyName}
              onChange={(e) => onUpdate({ companyName: e.target.value })}
              placeholder="Your company name"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-glow focus:ring-cyan-glow/20 pl-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-white/80">Website</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
            <Input
              value={data.website}
              onChange={(e) => onUpdate({ website: e.target.value })}
              placeholder="https://yourcompany.com"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-glow focus:ring-cyan-glow/20 pl-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-white/80">LinkedIn</Label>
          <div className="relative">
            <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
            <Input
              value={data.linkedIn}
              onChange={(e) => onUpdate({ linkedIn: e.target.value })}
              placeholder="Company LinkedIn URL"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-glow focus:ring-cyan-glow/20 pl-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-white/80">Vertical *</Label>
          <Select value={data.vertical} onValueChange={(v) => onUpdate({ vertical: v })}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Select vertical" />
            </SelectTrigger>
            <SelectContent className="bg-navy-card border-white/10">
              {VERTICALS.map((vertical) => (
                <SelectItem key={vertical} value={vertical} className="text-white">
                  {vertical}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-white/80">Stage *</Label>
          <Select value={data.stage} onValueChange={(v) => onUpdate({ stage: v })}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent className="bg-navy-card border-white/10">
              {STAGES.map((stage) => (
                <SelectItem key={stage} value={stage} className="text-white">
                  {stage}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-white/80">Headquarters *</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
            <Input
              value={data.location}
              onChange={(e) => onUpdate({ location: e.target.value })}
              placeholder="City, State/Country"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-glow focus:ring-cyan-glow/20 pl-10"
            />
          </div>
        </div>
      </div>

      {/* Founder Information */}
      <div className="space-y-4 pt-6 border-t border-white/10">
        <div className="space-y-2">
          <Label className="text-base font-semibold text-white">Your Information</Label>
          <p className="text-sm text-white/60">Primary contact for this application</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-white/80">Your Name *</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
              <Input
                value={data.founderName}
                onChange={(e) => onUpdate({ founderName: e.target.value })}
                placeholder="Full name"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-glow focus:ring-cyan-glow/20 pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-white/80">Your Email *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
              <Input
                type="email"
                value={data.founderEmail}
                onChange={(e) => onUpdate({ founderEmail: e.target.value })}
                placeholder="you@company.com"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-glow focus:ring-cyan-glow/20 pl-10"
              />
            </div>
            <p className="text-xs text-cyan-glow/80 italic">
              This email will be used to log in and access your dashboard.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} className="border-white/10 text-white">
          Back
        </Button>
        <Button onClick={onNext} className="bg-cyan-glow text-navy-deep hover:bg-cyan-bright">
          Next
        </Button>
      </div>
    </div>
  );
};
