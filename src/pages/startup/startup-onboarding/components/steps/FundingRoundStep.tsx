import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StartupOnboardingData } from "../../hooks/useStartupOnboardingStorage";

interface FundingRoundStepProps {
  data: StartupOnboardingData;
  onUpdate: (data: Partial<StartupOnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const FundingRoundStep = ({ data, onUpdate, onNext, onBack }: FundingRoundStepProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Funding & Round Details</h2>
        <p className="text-[hsl(var(--navy-deep))]/60">
          Share context on your current fundraising round and prior investors.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[hsl(var(--navy-deep))]/80">Previous Investors</Label>
          <Textarea
            value={data.previousInvestors}
            onChange={(e) => onUpdate({ previousInvestors: e.target.value })}
            placeholder="List any previous investors, angels, or funds (if any)..."
            className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5 placeholder:text-[hsl(var(--navy-deep))]/50 min-h-[80px]"
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[hsl(var(--navy-deep))]/80">Lead Investor</Label>
          <Input
            value={data.leadInvestor}
            onChange={(e) => onUpdate({ leadInvestor: e.target.value })}
            placeholder="If applicable, who is / will be the lead?"
            className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[hsl(var(--navy-deep))]/80">Round Details</Label>
          <Textarea
            value={data.roundDetails}
            onChange={(e) => onUpdate({ roundDetails: e.target.value })}
            placeholder="Describe current or recent round (stage, amount, valuation, status)..."
            className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5 placeholder:text-[hsl(var(--navy-deep))]/50 min-h-[80px]"
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-[hsl(var(--navy-deep))]/80">What is funding being used for?</Label>
          <Textarea
            value={data.fundingUse}
            onChange={(e) => onUpdate({ fundingUse: e.target.value })}
            placeholder="Breakdown of how you plan to deploy this capital (team, product, GTM, etc.)..."
            className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5 placeholder:text-[hsl(var(--navy-deep))]/50 min-h-[80px]"
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="border-[hsl(var(--navy-deep))]/20 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5"
        >
          Back
        </Button>
        <Button onClick={onNext} className="bg-cyan-glow text-navy-deep hover:bg-cyan-bright">
          Next
        </Button>
      </div>
    </div>
  );
};

