import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { VCOnboardingData } from "../../hooks/useVCOnboardingStorage";
import {
  FUND_TYPES,
  CHECK_SIZES,
  STAGE_FOCUS,
  SECTOR_TAGS,
  LEAD_FOLLOW,
} from "../../constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FundOverviewStepProps {
  data: VCOnboardingData;
  onUpdate: (data: Partial<VCOnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const FundOverviewStep = ({
  data,
  onUpdate,
  onNext,
  onBack,
}: FundOverviewStepProps) => {
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
        <h2 className="text-xl font-bold text-[hsl(var(--navy-deep))] mb-2">Fund Overview</h2>
        <p className="text-[hsl(var(--navy-deep))]/60 text-sm">
          Tell us about your fund structure and investment focus.
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="firmDescription" className="text-[hsl(var(--navy-deep))]/80">
            Firm Description *
          </Label>
          <Textarea
            id="firmDescription"
            value={data.firmDescription}
            onChange={(e) => onUpdate({ firmDescription: e.target.value })}
            placeholder="Describe your firm's mission, history, and approach..."
            className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] placeholder:text-[hsl(var(--navy-deep))]/50 min-h-[120px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="aum" className="text-[hsl(var(--navy-deep))]/80">
              AUM
            </Label>
            <Input
              id="aum"
              value={data.aum}
              onChange={(e) => onUpdate({ aum: e.target.value })}
              placeholder="e.g. $50M"
              className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] placeholder:text-[hsl(var(--navy-deep))]/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fundVintage" className="text-[hsl(var(--navy-deep))]/80">
              Fund Vintage
            </Label>
            <Input
              id="fundVintage"
              value={data.fundVintage}
              onChange={(e) => onUpdate({ fundVintage: e.target.value })}
              placeholder="e.g. 2024"
              className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] placeholder:text-[hsl(var(--navy-deep))]/50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fundType" className="text-[hsl(var(--navy-deep))]/80">
            Fund Type *
          </Label>
          <Select
            value={data.fundType}
            onValueChange={(value) => onUpdate({ fundType: value })}
          >
            <SelectTrigger className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))]">
              <SelectValue placeholder="Select fund type" />
            </SelectTrigger>
            <SelectContent>
              {FUND_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ownershipTarget" className="text-[hsl(var(--navy-deep))]/80">
              Ownership Target
            </Label>
            <Input
              id="ownershipTarget"
              value={data.ownershipTarget}
              onChange={(e) => onUpdate({ ownershipTarget: e.target.value })}
              placeholder="e.g. 5-15%"
              className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] placeholder:text-[hsl(var(--navy-deep))]/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="leadFollow" className="text-[hsl(var(--navy-deep))]/80">
              Lead/Follow
            </Label>
            <Select
              value={data.leadFollow}
              onValueChange={(value) => onUpdate({ leadFollow: value })}
            >
              <SelectTrigger className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))]">
                <SelectValue placeholder="Select preference" />
              </SelectTrigger>
              <SelectContent>
                {LEAD_FOLLOW.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[hsl(var(--navy-deep))]/80">Check Sizes *</Label>
          <div className="flex flex-wrap gap-2">
            {CHECK_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleArray("checkSizes", size)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  data.checkSizes.includes(size)
                    ? "bg-cyan-glow text-navy-deep"
                    : "bg-[hsl(var(--navy-deep))]/5 text-[hsl(var(--navy-deep))]/70 hover:bg-[hsl(var(--navy-deep))]/10 border border-[hsl(var(--navy-deep))]/10"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[hsl(var(--navy-deep))]/80">Stage Focus *</Label>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
            {STAGE_FOCUS.map((stage) => (
              <button
                key={stage}
                type="button"
                onClick={() => toggleArray("stageFocus", stage)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  data.stageFocus.includes(stage)
                    ? "bg-cyan-glow text-navy-deep"
                    : "bg-[hsl(var(--navy-deep))]/5 text-[hsl(var(--navy-deep))]/70 hover:bg-[hsl(var(--navy-deep))]/10 border border-[hsl(var(--navy-deep))]/10"
                }`}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[hsl(var(--navy-deep))]/80">Sector Tags</Label>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
            {SECTOR_TAGS.map((sector) => (
              <button
                key={sector}
                type="button"
                onClick={() => toggleArray("sectorTags", sector)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  data.sectorTags.includes(sector)
                    ? "bg-cyan-glow text-navy-deep"
                    : "bg-[hsl(var(--navy-deep))]/5 text-[hsl(var(--navy-deep))]/70 hover:bg-[hsl(var(--navy-deep))]/10 border border-[hsl(var(--navy-deep))]/10"
                }`}
              >
                {sector}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="portfolioCount" className="text-[hsl(var(--navy-deep))]/80">
              Portfolio Count
            </Label>
            <Input
              id="portfolioCount"
              value={data.portfolioCount}
              onChange={(e) => onUpdate({ portfolioCount: e.target.value })}
              placeholder="e.g. 50"
              className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] placeholder:text-[hsl(var(--navy-deep))]/50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="topInvestments" className="text-[hsl(var(--navy-deep))]/80">
            Top Investments
          </Label>
          <Textarea
            id="topInvestments"
            value={data.topInvestments}
            onChange={(e) => onUpdate({ topInvestments: e.target.value })}
            placeholder="List notable portfolio companies..."
            className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] placeholder:text-[hsl(var(--navy-deep))]/50 min-h-[80px]"
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
