import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { VCOnboardingData } from "../../hooks/useVCOnboardingStorage";
import { OPERATING_SUPPORT } from "../../constants";

interface ValueAddStepProps {
  data: VCOnboardingData;
  onUpdate: (data: Partial<VCOnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ValueAddStep = ({
  data,
  onUpdate,
  onNext,
  onBack,
}: ValueAddStepProps) => {
  const toggleArray = (field: keyof VCOnboardingData, value: string) => {
    const current = (data[field] as string[]) || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onUpdate({ [field]: updated } as Partial<VCOnboardingData>);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[hsl(var(--navy-deep))] mb-2">Value-Add</h2>
        <p className="text-[hsl(var(--navy-deep))]/60 text-sm">
          Describe how your firm supports portfolio companies.
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label className="text-[hsl(var(--navy-deep))]/80">Operating Support *</Label>
          <div className="flex flex-wrap gap-2">
            {OPERATING_SUPPORT.map((support) => (
              <button
                key={support}
                type="button"
                onClick={() => toggleArray("operatingSupport", support)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  data.operatingSupport.includes(support)
                    ? "bg-cyan-glow text-navy-deep"
                    : "bg-[hsl(var(--navy-deep))]/5 text-[hsl(var(--navy-deep))]/70 hover:bg-[hsl(var(--navy-deep))]/10 border border-[hsl(var(--navy-deep))]/10"
                }`}
              >
                {support}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="operatingSupportOther" className="text-[hsl(var(--navy-deep))]/80">
            Additional Support Details
          </Label>
          <Textarea
            id="operatingSupportOther"
            value={data.operatingSupportOther}
            onChange={(e) => onUpdate({ operatingSupportOther: e.target.value })}
            placeholder="Describe any additional support you provide..."
            className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] placeholder:text-[hsl(var(--navy-deep))]/50 min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="firmInvolvement" className="text-[hsl(var(--navy-deep))]/80">
            Firm Involvement *
          </Label>
          <Textarea
            id="firmInvolvement"
            value={data.firmInvolvement}
            onChange={(e) => onUpdate({ firmInvolvement: e.target.value })}
            placeholder="Describe how your firm typically gets involved with portfolio companies..."
            className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] placeholder:text-[hsl(var(--navy-deep))]/50 min-h-[120px]"
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} className="border-[hsl(var(--navy-deep))]/20 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5">
          Back
        </Button>
        <Button
          onClick={onNext}
          className="bg-cyan-glow text-navy-deep hover:bg-cyan-bright"
        >
          Next
        </Button>
      </div>
    </div>
  );
};
