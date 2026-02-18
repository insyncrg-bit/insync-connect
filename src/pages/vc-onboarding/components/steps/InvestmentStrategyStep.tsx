import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VCOnboardingData } from "../../hooks/useVCOnboardingStorage";
import { FAST_SIGNALS, HARD_NOS } from "../../constants";

interface InvestmentStrategyStepProps {
  data: VCOnboardingData;
  onUpdate: (data: Partial<VCOnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const InvestmentStrategyStep = ({
  data,
  onUpdate,
  onNext,
  onBack,
}: InvestmentStrategyStepProps) => {
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
        <h2 className="text-xl font-bold text-[hsl(var(--navy-deep))] mb-2">Investment Strategy</h2>
        <p className="text-[hsl(var(--navy-deep))]/60 text-sm">
          Define your investment thesis and criteria.
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="thesisStatement" className="text-[hsl(var(--navy-deep))]/80">
            Thesis Statement *
          </Label>
          <Textarea
            id="thesisStatement"
            value={data.thesisStatement}
            onChange={(e) => onUpdate({ thesisStatement: e.target.value })}
            placeholder="Describe your investment thesis and what you look for in companies..."
            className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] placeholder:text-[hsl(var(--navy-deep))]/50 min-h-[150px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subThemesOther" className="text-[hsl(var(--navy-deep))]/80">
            Sub-themes
          </Label>
          <Input
            id="subThemesOther"
            value={data.subThemesOther}
            onChange={(e) => onUpdate({ subThemesOther: e.target.value })}
            placeholder="e.g. AI infrastructure, climate tech, etc."
            className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] placeholder:text-[hsl(var(--navy-deep))]/50"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[hsl(var(--navy-deep))]/80">Fast Signals</Label>
          <div className="flex flex-wrap gap-2">
            {FAST_SIGNALS.map((signal) => (
              <button
                key={signal}
                type="button"
                onClick={() => toggleArray("fastSignals", signal)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  data.fastSignals.includes(signal)
                    ? "bg-cyan-glow text-navy-deep"
                    : "bg-[hsl(var(--navy-deep))]/5 text-[hsl(var(--navy-deep))]/70 hover:bg-[hsl(var(--navy-deep))]/10 border border-[hsl(var(--navy-deep))]/10"
                }`}
              >
                {signal}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[hsl(var(--navy-deep))]/80">Hard Nos</Label>
          <div className="flex flex-wrap gap-2">
            {HARD_NOS.map((no) => (
              <button
                key={no}
                type="button"
                onClick={() => toggleArray("hardNos", no)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  data.hardNos.includes(no)
                    ? "bg-cyan-glow text-navy-deep"
                    : "bg-[hsl(var(--navy-deep))]/5 text-[hsl(var(--navy-deep))]/70 hover:bg-[hsl(var(--navy-deep))]/10 border border-[hsl(var(--navy-deep))]/10"
                }`}
              >
                {no}
              </button>
            ))}
          </div>
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
