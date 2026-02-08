import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { VCOnboardingData } from "../../hooks/useVCOnboardingStorage";
import { CONFLICTS_POLICY } from "../../constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PortfolioStepProps {
  data: VCOnboardingData;
  onUpdate: (data: Partial<VCOnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const PortfolioStep = ({
  data,
  onUpdate,
  onNext,
  onBack,
}: PortfolioStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Portfolio</h2>
        <p className="text-white/60 text-sm">
          Share information about your portfolio and conflict policies.
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="portfolioList" className="text-white/80">
            Portfolio List
          </Label>
          <Textarea
            id="portfolioList"
            value={data.portfolioList}
            onChange={(e) => onUpdate({ portfolioList: e.target.value })}
            placeholder="List your portfolio companies or provide a link..."
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[120px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="conflictsPolicy" className="text-white/80">
            Conflicts Policy
          </Label>
          <Select
            value={data.conflictsPolicy}
            onValueChange={(value) => onUpdate({ conflictsPolicy: value })}
          >
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Select conflicts policy" />
            </SelectTrigger>
            <SelectContent>
              {CONFLICTS_POLICY.map((policy) => (
                <SelectItem key={policy} value={policy}>
                  {policy}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
            <div>
              <Label className="text-white/80">Invests in Competitors</Label>
              <p className="text-white/60 text-sm">
                Do you invest in competing companies?
              </p>
            </div>
            <Switch
              checked={data.investsInCompetitors}
              onCheckedChange={(checked) =>
                onUpdate({ investsInCompetitors: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
            <div>
              <Label className="text-white/80">Signs NDAs</Label>
              <p className="text-white/60 text-sm">
                Do you sign NDAs before reviewing companies?
              </p>
            </div>
            <Switch
              checked={data.signsNDAs}
              onCheckedChange={(checked) => onUpdate({ signsNDAs: checked })}
            />
          </div>
        </div>

        {data.signsNDAs && (
          <div className="space-y-2">
            <Label htmlFor="ndaConditions" className="text-white/80">
              NDA Conditions
            </Label>
            <Textarea
              id="ndaConditions"
              value={data.ndaConditions}
              onChange={(e) => onUpdate({ ndaConditions: e.target.value })}
              placeholder="Describe your NDA conditions..."
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[80px]"
            />
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} className="border-white/10 text-white">
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
