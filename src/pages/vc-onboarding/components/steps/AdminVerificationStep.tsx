import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VCOnboardingData } from "../../hooks/useVCOnboardingStorage";
import { LOCATION_BRANCHES } from "../../constants";
import {
  FormField,
  TextInput,
  MultiSelect,
  SwitchField,
  StepNavigation,
} from "@/components/onboarding";
import { Upload } from "lucide-react";

interface AdminVerificationStepProps {
  data: VCOnboardingData;
  onUpdate: (data: Partial<VCOnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const AdminVerificationStep = ({
  data,
  onUpdate,
  onNext,
  onBack,
}: AdminVerificationStepProps) => {
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[hsl(var(--navy-deep))] mb-2">Admin & Verification</h2>
        <p className="text-[hsl(var(--navy-deep))]/60 text-sm">Set up your firm's basic information and admin details.</p>
      </div>

      <div className="space-y-5">
        {/* Company Logo Upload */}
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
                <Button type="button" variant="outline" asChild className="border-[hsl(var(--navy-deep))]/20 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5">
                  <span>Upload Logo</span>
                </Button>
              </Label>
              <p className="text-xs text-[hsl(var(--navy-deep))]/50 mt-1">PNG, JPG up to 5MB</p>
            </div>
          </div>
        </div>

        <FormField label="Firm Name" required>
          <TextInput value={data.firmName} onChange={(v) => onUpdate({ firmName: v })} placeholder="Your VC firm name" />
        </FormField>
        <FormField label="Website">
          <TextInput type="url" value={data.website} onChange={(v) => onUpdate({ website: v })} placeholder="https://yourfirm.com" />
        </FormField>
        <FormField label="Company LinkedIn">
          <TextInput type="url" value={data.companyLinkedIn} onChange={(v) => onUpdate({ companyLinkedIn: v })} placeholder="https://linkedin.com/company/yourfirm" />
        </FormField>
        <FormField label="Headquarters Location" required>
          <TextInput value={data.hqLocation} onChange={(v) => onUpdate({ hqLocation: v })} placeholder="City, State/Country" />
        </FormField>
        <FormField label="Other Location Branches">
          <MultiSelect options={LOCATION_BRANCHES} selected={data.otherLocationBranches} onChange={(v) => onUpdate({ otherLocationBranches: v })} />
        </FormField>
        <SwitchField label="Public Profile" description="Make your firm profile visible to startups" checked={data.publicProfile} onChange={(v) => onUpdate({ publicProfile: v })} />
      </div>

      <StepNavigation onBack={onBack} onNext={onNext} isFirstStep={false} isLastStep={false} />
    </div>
  );
};
