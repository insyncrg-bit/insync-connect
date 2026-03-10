import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StartupOnboardingData } from "../../hooks/startupMemoTypes";

interface CustomerMarketStepProps {
  data: StartupOnboardingData;
  onUpdate: (data: Partial<StartupOnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

export const CustomerMarketStep = ({ data, onUpdate, onNext, onBack }: CustomerMarketStepProps) => {
  const wordCount = countWords(data.targetCustomerDescription);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Consumer & Market</h2>
        <p className="text-[hsl(var(--navy-deep))]/60">Define your target customer, market size, and go-to-market strategy</p>
      </div>

      <div className="space-y-2">
        <Label className="text-[hsl(var(--navy-deep))]/80">Target Geography *</Label>
        <Input
          value={data.targetGeography}
          onChange={(e) => onUpdate({ targetGeography: e.target.value })}
          placeholder="e.g. United States, Global, Europe"
          className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] placeholder:text-[hsl(var(--navy-deep))]/50"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-[hsl(var(--navy-deep))]/80">
          Target Customer Description * (min 20 words)
        </Label>
        <Textarea
          value={data.targetCustomerDescription}
          onChange={(e) => onUpdate({ targetCustomerDescription: e.target.value })}
          placeholder="Describe your ideal customer: demographics, psychographics, pain points, buying behavior..."
          className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] placeholder:text-[hsl(var(--navy-deep))]/50 focus:border-cyan-glow min-h-[150px]"
          rows={6}
        />
        <p className={`text-xs ${wordCount >= 20 ? "text-cyan-glow" : "text-[hsl(var(--navy-deep))]/50"}`}>
          {wordCount} / 20 words
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[hsl(var(--navy-deep))]">Market Sizing</h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-[hsl(var(--navy-deep))]/80">TAM (Total Addressable Market) *</Label>
            <Input
              value={data.tamValue}
              onChange={(e) => onUpdate({ tamValue: e.target.value })}
              placeholder="e.g. $10B"
              className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))]"
            />
            <Textarea
              value={data.tamBreakdown}
              onChange={(e) => onUpdate({ tamBreakdown: e.target.value })}
              placeholder="Breakdown..."
              className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] min-h-[80px] text-sm"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[hsl(var(--navy-deep))]/80">SAM (Serviceable Addressable Market) *</Label>
            <Input
              value={data.samValue}
              onChange={(e) => onUpdate({ samValue: e.target.value })}
              placeholder="e.g. $1B"
              className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))]"
            />
            <Textarea
              value={data.samBreakdown}
              onChange={(e) => onUpdate({ samBreakdown: e.target.value })}
              placeholder="Breakdown..."
              className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] min-h-[80px] text-sm"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[hsl(var(--navy-deep))]/80">SOM (Serviceable Obtainable Market) *</Label>
            <Input
              value={data.somValue}
              onChange={(e) => onUpdate({ somValue: e.target.value })}
              placeholder="e.g. $100M"
              className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))]"
            />
            <div className="space-y-2">
              <Input
                value={data.somTimeframe}
                onChange={(e) => onUpdate({ somTimeframe: e.target.value })}
                placeholder="Timeframe (e.g. 3 years)"
                className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] text-sm"
              />
              <Textarea
                value={data.somBreakdown}
                onChange={(e) => onUpdate({ somBreakdown: e.target.value })}
                placeholder="Breakdown..."
                className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] min-h-[60px] text-sm"
                rows={2}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-[hsl(var(--navy-deep))]/10">
        <h3 className="text-lg font-semibold text-[hsl(var(--navy-deep))]">Go-to-Market Strategy</h3>
        <div className="space-y-6">
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
