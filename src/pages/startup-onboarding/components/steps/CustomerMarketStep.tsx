import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StartupOnboardingData } from "../../hooks/useStartupOnboardingStorage";

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
        <h2 className="text-2xl font-bold text-white">Customer & Market</h2>
        <p className="text-white/60">Define your target customer and market size</p>
      </div>

      <div className="space-y-2">
        <Label className="text-white/80">Target Geography *</Label>
        <Input
          value={data.targetGeography}
          onChange={(e) => onUpdate({ targetGeography: e.target.value })}
          placeholder="e.g. United States, Global, Europe"
          className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-white/80">
          Target Customer Description * (min 20 words)
        </Label>
        <Textarea
          value={data.targetCustomerDescription}
          onChange={(e) => onUpdate({ targetCustomerDescription: e.target.value })}
          placeholder="Describe your ideal customer: demographics, psychographics, pain points, buying behavior..."
          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-glow min-h-[150px]"
          rows={6}
        />
        <p className={`text-xs ${wordCount >= 20 ? "text-cyan-glow" : "text-white/50"}`}>
          {wordCount} / 20 words
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Market Sizing</h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-white/80">TAM (Total Addressable Market) *</Label>
            <Input
              value={data.tamValue}
              onChange={(e) => onUpdate({ tamValue: e.target.value })}
              placeholder="e.g. $10B"
              className="bg-white/5 border-white/10 text-white"
            />
            <Textarea
              value={data.tamBreakdown}
              onChange={(e) => onUpdate({ tamBreakdown: e.target.value })}
              placeholder="Breakdown..."
              className="bg-white/5 border-white/10 text-white min-h-[80px] text-sm"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white/80">SAM (Serviceable Addressable Market) *</Label>
            <Input
              value={data.samValue}
              onChange={(e) => onUpdate({ samValue: e.target.value })}
              placeholder="e.g. $1B"
              className="bg-white/5 border-white/10 text-white"
            />
            <Textarea
              value={data.samBreakdown}
              onChange={(e) => onUpdate({ samBreakdown: e.target.value })}
              placeholder="Breakdown..."
              className="bg-white/5 border-white/10 text-white min-h-[80px] text-sm"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white/80">SOM (Serviceable Obtainable Market) *</Label>
            <Input
              value={data.somValue}
              onChange={(e) => onUpdate({ somValue: e.target.value })}
              placeholder="e.g. $100M"
              className="bg-white/5 border-white/10 text-white"
            />
            <div className="space-y-2">
              <Input
                value={data.somTimeframe}
                onChange={(e) => onUpdate({ somTimeframe: e.target.value })}
                placeholder="Timeframe (e.g. 3 years)"
                className="bg-white/5 border-white/10 text-white text-sm"
              />
              <Textarea
                value={data.somBreakdown}
                onChange={(e) => onUpdate({ somBreakdown: e.target.value })}
                placeholder="Breakdown..."
                className="bg-white/5 border-white/10 text-white min-h-[60px] text-sm"
                rows={2}
              />
            </div>
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
