import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StartupOnboardingData } from "../../hooks/startupMemoTypes";
import {
  CUSTOMER_TYPES,
  PRICING_STRATEGIES,
  VALUE_DRIVERS,
  SAAS_METRICS,
  TRANSACTION_METRICS,
  LICENSING_METRICS,
  AD_METRICS,
  SERVICES_METRICS,
} from "../../constants";

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

  const toggleRevenueMetric = (value: string) => {
    const updated = data.revenueMetrics.includes(value)
      ? data.revenueMetrics.filter((v) => v !== value)
      : [...data.revenueMetrics, value];
    onUpdate({ revenueMetrics: updated });
  };

  // Build available revenue metrics based on selected pricing strategies
  const availableMetrics: string[] = [];
  if (data.pricingStrategies.includes("subscription")) availableMetrics.push(...SAAS_METRICS);
  if (data.pricingStrategies.includes("transaction")) availableMetrics.push(...TRANSACTION_METRICS);
  if (data.pricingStrategies.includes("licensing")) availableMetrics.push(...LICENSING_METRICS);
  if (data.pricingStrategies.includes("advertising")) availableMetrics.push(...AD_METRICS);
  if (data.pricingStrategies.includes("services")) availableMetrics.push(...SERVICES_METRICS);
  const uniqueMetrics = [...new Set(availableMetrics)];

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
        <div className="ml-6 space-y-4 p-4 bg-white border border-[hsl(var(--navy-deep))]/10 rounded-lg">
          <Label className="text-[hsl(var(--navy-deep))]/80">Subscription Details</Label>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[hsl(var(--navy-deep))]/60">Type</Label>
              <Input
                value={data.subscriptionType}
                onChange={(e) => onUpdate({ subscriptionType: e.target.value })}
                placeholder="e.g. Per-seat, Flat-rate, Freemium, Usage-based"
                className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[hsl(var(--navy-deep))]/60">Billing Cycle</Label>
              <Input
                value={data.subscriptionBillingCycle}
                onChange={(e) => onUpdate({ subscriptionBillingCycle: e.target.value })}
                placeholder="e.g. Monthly, Quarterly, Annual"
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

      {data.pricingStrategies.includes("transaction") && (
        <div className="ml-6 space-y-4 p-4 bg-white border border-[hsl(var(--navy-deep))]/10 rounded-lg">
          <Label className="text-[hsl(var(--navy-deep))]/80">Transaction Details</Label>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[hsl(var(--navy-deep))]/60">Fee Type</Label>
              <Input
                value={data.transactionFeeType}
                onChange={(e) => onUpdate({ transactionFeeType: e.target.value })}
                placeholder="e.g. Percentage, Flat fee, Tiered take rate"
                className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[hsl(var(--navy-deep))]/60">Fee Amount / Percentage</Label>
              <Input
                value={data.transactionFeePercentage}
                onChange={(e) => onUpdate({ transactionFeePercentage: e.target.value })}
                placeholder="e.g. 2.9% + $0.30, 15% take rate"
                className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5"
              />
            </div>
          </div>
        </div>
      )}

      {data.pricingStrategies.includes("licensing") && (
        <div className="ml-6 space-y-4 p-4 bg-white border border-[hsl(var(--navy-deep))]/10 rounded-lg">
          <Label className="text-[hsl(var(--navy-deep))]/80">Licensing Details</Label>
          <div className="space-y-2">
            <Label className="text-[hsl(var(--navy-deep))]/60">Licensing Model</Label>
            <Textarea
              value={data.licensingModel}
              onChange={(e) => onUpdate({ licensingModel: e.target.value })}
              placeholder="e.g. Per-seat perpetual license, Enterprise site license, Lifetime license with tiers..."
              className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5 min-h-[80px]"
              rows={3}
            />
          </div>
        </div>
      )}

      {data.pricingStrategies.includes("advertising") && (
        <div className="ml-6 space-y-4 p-4 bg-white border border-[hsl(var(--navy-deep))]/10 rounded-lg">
          <Label className="text-[hsl(var(--navy-deep))]/80">Advertising Details</Label>
          <div className="space-y-2">
            <Label className="text-[hsl(var(--navy-deep))]/60">Ad Revenue Model</Label>
            <Textarea
              value={data.adRevenueModel}
              onChange={(e) => onUpdate({ adRevenueModel: e.target.value })}
              placeholder="e.g. CPM display ads, Sponsored content, Programmatic advertising..."
              className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5 min-h-[80px]"
              rows={3}
            />
          </div>
        </div>
      )}

      {data.pricingStrategies.includes("services") && (
        <div className="ml-6 space-y-4 p-4 bg-white border border-[hsl(var(--navy-deep))]/10 rounded-lg">
          <Label className="text-[hsl(var(--navy-deep))]/80">Services Details</Label>
          <div className="space-y-2">
            <Label className="text-[hsl(var(--navy-deep))]/60">Service Type</Label>
            <Textarea
              value={data.serviceType}
              onChange={(e) => onUpdate({ serviceType: e.target.value })}
              placeholder="e.g. Consulting engagements, Managed services + SLA-based support, Custom implementation & onboarding..."
              className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5 min-h-[80px]"
              rows={3}
            />
          </div>
        </div>
      )}

      {data.pricingStrategies.includes("other") && (
        <div className="ml-6 space-y-4 p-4 bg-white border border-[hsl(var(--navy-deep))]/10 rounded-lg">
          <Label className="text-[hsl(var(--navy-deep))]/80">Other Pricing Details</Label>
          <div className="space-y-2">
            <Label className="text-[hsl(var(--navy-deep))]/60">Describe your pricing model</Label>
            <Textarea
              value={data.otherPricingDetail}
              onChange={(e) => onUpdate({ otherPricingDetail: e.target.value })}
              placeholder="Describe your pricing model and how you generate revenue..."
              className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5 min-h-[80px]"
              rows={3}
            />
          </div>
        </div>
      )}

      {uniqueMetrics.length > 0 && (
        <div className="ml-6 space-y-4 p-4 bg-white border border-[hsl(var(--navy-deep))]/10 rounded-lg">
          <Label className="text-[hsl(var(--navy-deep))]/80">Revenue Metrics (Optional)</Label>
          <p className="text-sm text-[hsl(var(--navy-deep))]/50">Select the metrics you track, then provide current values below.</p>
          <div className="grid md:grid-cols-3 gap-2">
            {uniqueMetrics.map((metric) => (
              <div
                key={metric}
                className="flex items-center gap-2 p-2 bg-[hsl(var(--navy-deep))]/[0.02] border border-[hsl(var(--navy-deep))]/10 rounded-lg hover:bg-[hsl(var(--navy-deep))]/5 transition-colors cursor-pointer"
                onClick={() => toggleRevenueMetric(metric)}
              >
                <Checkbox
                  checked={data.revenueMetrics.includes(metric)}
                  onCheckedChange={() => toggleRevenueMetric(metric)}
                  onClick={(e) => e.stopPropagation()}
                />
                <Label className="text-sm text-[hsl(var(--navy-deep))] cursor-pointer">{metric}</Label>
              </div>
            ))}
          </div>
          {data.revenueMetrics.length > 0 && (
            <div className="space-y-2">
              <Label className="text-[hsl(var(--navy-deep))]/60">Metric Values</Label>
              <Textarea
                value={data.revenueMetricsValues}
                onChange={(e) => onUpdate({ revenueMetricsValues: e.target.value })}
                placeholder={`e.g. ${data.revenueMetrics.slice(0, 3).join(": ..., ")}: ...`}
                className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5 min-h-[80px]"
                rows={3}
              />
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-[hsl(var(--navy-deep))]/80">Business Structure</Label>
        <Textarea
          value={data.businessStructure}
          onChange={(e) => onUpdate({ businessStructure: e.target.value })}
          placeholder="e.g. Asset-light marketplace connecting buyers and sellers — we don't hold inventory. Revenue via 12% commission per transaction. Direct sales team for enterprise, self-serve for SMBs."
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
