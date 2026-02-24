import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StartupOnboardingData } from "../../hooks/useStartupOnboardingStorage";
import { CUSTOMER_TYPES, PRICING_STRATEGIES } from "../../constants";

interface BusinessModelStepProps {
  data: StartupOnboardingData;
  onUpdate: (data: Partial<StartupOnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const BusinessModelStep = ({ data, onUpdate, onNext, onBack }: BusinessModelStepProps) => {
  const toggleCustomerType = (value: string) => {
    const updated = data.customerType.includes(value)
      ? data.customerType.filter((v) => v !== value)
      : [...data.customerType, value];
    onUpdate({ customerType: updated });
  };

  const togglePricingStrategy = (value: string) => {
    const updated = data.pricingStrategies.includes(value)
      ? data.pricingStrategies.filter((v) => v !== value)
      : [...data.pricingStrategies, value];
    onUpdate({ pricingStrategies: updated });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Business Model</h2>
        <p className="text-[hsl(var(--navy-deep))]/60">Describe your business model and pricing</p>
      </div>

      <div className="space-y-4">
        <Label className="text-[hsl(var(--navy-deep))]/80">Customer Type * (Select at least one)</Label>
        <div className="flex gap-4">
          {CUSTOMER_TYPES.map((type) => (
            <div
              key={type}
              className="flex items-center gap-2 p-3 bg-white border border-[hsl(var(--navy-deep))]/10 rounded-lg hover:bg-[hsl(var(--navy-deep))]/5 transition-colors cursor-pointer"
              onClick={() => toggleCustomerType(type)}
            >
              <Checkbox
                checked={data.customerType.includes(type)}
                onCheckedChange={() => toggleCustomerType(type)}
              />
              <Label className="text-[hsl(var(--navy-deep))] cursor-pointer">{type}</Label>
            </div>
          ))}
        </div>
        {data.customerType.length > 0 && (
          <Textarea
            value={data.customerTypeExplanation}
            onChange={(e) => onUpdate({ customerTypeExplanation: e.target.value })}
            placeholder="Explain your customer type..."
            className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5 placeholder:text-[hsl(var(--navy-deep))]/50 min-h-[100px]"
            rows={3}
          />
        )}
      </div>

      <div className="space-y-4">
        <Label className="text-[hsl(var(--navy-deep))]/80">Pricing Strategy * (Select at least one)</Label>
        <div className="grid md:grid-cols-2 gap-3">
          {PRICING_STRATEGIES.map((strategy) => (
            <div
              key={strategy.id}
              className="flex items-center gap-2 p-3 bg-white border border-[hsl(var(--navy-deep))]/10 rounded-lg hover:bg-[hsl(var(--navy-deep))]/5 transition-colors cursor-pointer"
              onClick={() => togglePricingStrategy(strategy.id)}
            >
              <Checkbox
                checked={data.pricingStrategies.includes(strategy.id)}
                onCheckedChange={() => togglePricingStrategy(strategy.id)}
              />
              <Label className="text-[hsl(var(--navy-deep))] cursor-pointer">{strategy.label}</Label>
            </div>
          ))}
        </div>
      </div>

      {data.pricingStrategies.includes("subscription") && (
        <div className="space-y-4 p-4 bg-white border border-[hsl(var(--navy-deep))]/10 rounded-lg">
          <Label className="text-[hsl(var(--navy-deep))]/80">Subscription Details</Label>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[hsl(var(--navy-deep))]/60">Type</Label>
              <Input
                value={data.subscriptionType}
                onChange={(e) => onUpdate({ subscriptionType: e.target.value })}
                placeholder="e.g. Monthly, Annual"
                className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[hsl(var(--navy-deep))]/60">Billing Cycle</Label>
              <Input
                value={data.subscriptionBillingCycle}
                onChange={(e) => onUpdate({ subscriptionBillingCycle: e.target.value })}
                placeholder="e.g. Monthly, Quarterly"
                className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[hsl(var(--navy-deep))]/60">Tiers</Label>
            <Textarea
              value={data.subscriptionTiers}
              onChange={(e) => onUpdate({ subscriptionTiers: e.target.value })}
              placeholder="Describe your pricing tiers..."
              className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5 min-h-[80px]"
              rows={3}
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-[hsl(var(--navy-deep))]/80">Business Structure</Label>
        <Textarea
          value={data.businessStructure}
          onChange={(e) => onUpdate({ businessStructure: e.target.value })}
          placeholder="Describe your business structure and operations..."
          className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5 placeholder:text-[hsl(var(--navy-deep))]/50 min-h-[100px]"
          rows={4}
        />
      </div>

      <div className="space-y-4 pt-2 border-t border-[hsl(var(--navy-deep))]/10">
        <h3 className="text-lg font-semibold text-[hsl(var(--navy-deep))]">Funding & Round Details</h3>
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
