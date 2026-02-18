import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { StartupOnboardingData } from "../../hooks/useStartupOnboardingStorage";
import { VALUE_DRIVERS } from "../../constants";

interface ValuePropositionStepProps {
  data: StartupOnboardingData;
  onUpdate: (data: Partial<StartupOnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

export const ValuePropositionStep = ({ data, onUpdate, onNext, onBack }: ValuePropositionStepProps) => {
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
        <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Value Proposition</h2>
        <p className="text-[hsl(var(--navy-deep))]/60">Describe the problem and your value drivers</p>
      </div>

      <div className="space-y-2">
        <Label className="text-[hsl(var(--navy-deep))]/80">
          Current Pain Point / Problem Statement * (min 20 words)
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

      <div className="space-y-4">
        <Label className="text-[hsl(var(--navy-deep))]/80">Value Drivers * (Select at least one)</Label>
        <div className="space-y-3">
          {VALUE_DRIVERS.map((driver) => (
            <div
              key={driver.value}
              className="flex items-start gap-3 p-4 bg-white border border-[hsl(var(--navy-deep))]/10 rounded-lg hover:bg-[hsl(var(--navy-deep))]/5 transition-colors"
            >
              <Checkbox
                checked={data.valueDrivers.includes(driver.value)}
                onCheckedChange={() => toggleValueDriver(driver.value)}
                className="mt-1"
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
