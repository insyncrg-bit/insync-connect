import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StartupOnboardingData } from "../../hooks/useStartupOnboardingStorage";

interface GoToMarketStepProps {
  data: StartupOnboardingData;
  onUpdate: (data: Partial<StartupOnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const GoToMarketStep = ({ data, onUpdate, onNext, onBack }: GoToMarketStepProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Go-to-Market Strategy</h2>
        <p className="text-[hsl(var(--navy-deep))]/60">Describe your customer acquisition strategy</p>
      </div>

      <div className="space-y-2">
        <Label className="text-[hsl(var(--navy-deep))]/80">Customer Acquisition Strategy *</Label>
        <Textarea
          value={data.gtmAcquisition}
          onChange={(e) => onUpdate({ gtmAcquisition: e.target.value })}
          placeholder="How will you acquire customers? Describe your channels, partnerships, marketing strategy..."
          className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] placeholder:text-[hsl(var(--navy-deep))]/50 focus:border-cyan-glow min-h-[150px]"
          rows={6}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[hsl(var(--navy-deep))]/80">Go-to-Market Timeline</Label>
        <Textarea
          value={data.gtmTimeline}
          onChange={(e) => onUpdate({ gtmTimeline: e.target.value })}
          placeholder="What is your timeline for launching and scaling? Key milestones..."
          className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] placeholder:text-[hsl(var(--navy-deep))]/50 min-h-[100px]"
          rows={4}
        />
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
