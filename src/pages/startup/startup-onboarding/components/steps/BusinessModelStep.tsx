import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StartupOnboardingData } from "../../hooks/startupMemoTypes";
import { CUSTOMER_TYPES, PRICING_STRATEGIES, VALUE_DRIVERS } from "../../constants";

const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

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

  const toggleValueDriver = (value: string) => {
    const updated = data.valueDrivers.includes(value)
      ? data.valueDrivers.filter((v) => v !== value)
      : [...data.valueDrivers, value];
    onUpdate({ valueDrivers: updated });
  };

  const wordCount = countWords(data.currentPainPoint);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Business Model & Value</h2>
        <p className="text-[hsl(var(--navy-deep))]/60">Describe your business model, pricing, and value proposition</p>
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
                onClick={(e) => e.stopPropagation()}
              />
              <Label className="text-[hsl(var(--navy-deep))] cursor-pointer">{type}</Label>
            </div>
          ))}
        </div>
        {data.customerType.length > 0 && (
          <Textarea
            value={data.customerTypeExplanation}
            onChange={(e) => onUpdate({ customerTypeExplanation: e.target.value })}
            onClick={(e) => e.stopPropagation()}
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
                onClick={(e) => e.stopPropagation()}
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

      <div className="space-y-4 pt-4 border-t border-[hsl(var(--navy-deep))]/10">
        <h3 className="text-lg font-semibold text-[hsl(var(--navy-deep))]">Value Proposition</h3>
        
        <div className="space-y-2">
          <Label className="text-[hsl(var(--navy-deep))]/80">
            Problem Statement * (min 20 words)
          </Label>
          <Textarea
            value={data.currentPainPoint}
            onChange={(e) => onUpdate({ currentPainPoint: e.target.value })}
            placeholder="Describe the problem your customers face and why it's urgent..."
            className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5 placeholder:text-[hsl(var(--navy-deep))]/50 focus:border-cyan-glow min-h-[150px]"
            rows={6}
          />
          <p className={`text-xs ${wordCount >= 20 ? "text-cyan-glow" : "text-[hsl(var(--navy-deep))]/50"}`}>
            {wordCount} / 20 words
          </p>
        </div>

        <div className="space-y-4 pt-2">
          <Label className="text-[hsl(var(--navy-deep))]/80">Value Drivers * (Select at least one)</Label>
          <div className="space-y-3">
            {VALUE_DRIVERS.map((driver) => (
              <div
                key={driver.value}
                className="flex items-start gap-3 p-4 bg-white border border-[hsl(var(--navy-deep))]/10 rounded-lg hover:bg-[hsl(var(--navy-deep))]/5 transition-colors cursor-pointer"
                onClick={() => toggleValueDriver(driver.value)}
              >
                <Checkbox
                  checked={data.valueDrivers.includes(driver.value)}
                  onCheckedChange={() => toggleValueDriver(driver.value)}
                  className="mt-1"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex-1">
                  <Label className="text-[hsl(var(--navy-deep))] font-medium cursor-pointer">
                    {driver.label}
                  </Label>
                  <p className="text-sm text-[hsl(var(--navy-deep))]/60 mt-1">{driver.description}</p>
                  {data.valueDrivers.includes(driver.value) && (
                      <Textarea
                        value={data.valueDriverExplanations[driver.value] || ""}
                        onChange={(e) =>
                          onUpdate({
                            valueDriverExplanations: {
                              ...data.valueDriverExplanations,
                              [driver.value]: e.target.value,
                            },
                          })
                        }
                        onClick={(e) => e.stopPropagation()}
                        placeholder={`Explain ${driver.label.toLowerCase()}...`}
                        className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5 placeholder:text-[hsl(var(--navy-deep))]/50 mt-2 min-h-[80px]"
                        rows={3}
                      />
                  )}
                </div>
              </div>
            ))}
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
