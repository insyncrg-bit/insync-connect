import { VCOnboardingData } from "../../hooks/useVCOnboardingStorage";
import { LOCATION_BRANCHES } from "../../constants";
import {
  FormField,
  TextInput,
  MultiSelect,
  ContactList,
  SwitchField,
  StepNavigation,
} from "@/components/onboarding";

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
}: AdminVerificationStepProps) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-bold text-white mb-2">Admin & Verification</h2>
      <p className="text-white/60 text-sm">Set up your firm's basic information and admin details.</p>
    </div>

    <div className="space-y-5">
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
      <ContactList contacts={data.contacts} onChange={(v) => onUpdate({ contacts: v })} />
      <SwitchField label="Public Profile" description="Make your firm profile visible to startups" checked={data.publicProfile} onChange={(v) => onUpdate({ publicProfile: v })} />
    </div>

    <StepNavigation onBack={onBack} onNext={onNext} isFirstStep={false} isLastStep={false} />
  </div>
);
