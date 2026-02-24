import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { StartupOnboardingData, Competitor } from "../../hooks/useStartupOnboardingStorage";

interface CompetitorsStepProps {
  data: StartupOnboardingData;
  onUpdate: (data: Partial<StartupOnboardingData>) => void;
  onSubmit: () => void;
  onBack: () => void;
  submitLabel?: string;
}

export const CompetitorsStep = ({ data, onUpdate, onSubmit, onBack, submitLabel }: CompetitorsStepProps) => {
  const updateCompetitor = (index: number, field: keyof Competitor, value: string) => {
    const updated = [...data.competitors];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate({ competitors: updated });
  };

  const addCompetitor = () => {
    if (data.competitors.length < 5) {
      onUpdate({
        competitors: [...data.competitors, { name: "", description: "", howYouDiffer: "" }],
      });
    }
  };

  const removeCompetitor = (index: number) => {
    if (data.competitors.length > 3) {
      onUpdate({
        competitors: data.competitors.filter((_, i) => i !== index),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Competitors</h2>
        <p className="text-[hsl(var(--navy-deep))]/60">Tell us about your competitive landscape (Optional)</p>
      </div>

      {data.competitors.map((competitor, index) => (
        <div key={index} className="bg-white border border-[hsl(var(--navy-deep))]/10 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-[hsl(var(--navy-deep))]/80 font-medium">Competitor {index + 1}</Label>
            {data.competitors.length > 3 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeCompetitor(index)}
                className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[hsl(var(--navy-deep))]/60">Name</Label>
              <Input
                value={competitor.name}
                onChange={(e) => updateCompetitor(index, "name", e.target.value)}
                placeholder="Competitor name"
                className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[hsl(var(--navy-deep))]/60">Description</Label>
              <Textarea
                value={competitor.description}
                onChange={(e) => updateCompetitor(index, "description", e.target.value)}
                placeholder="What do they do?"
                className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] min-h-[80px]"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[hsl(var(--navy-deep))]/60">How You Differ</Label>
              <Textarea
                value={competitor.howYouDiffer}
                onChange={(e) => updateCompetitor(index, "howYouDiffer", e.target.value)}
                placeholder="What makes you different?"
                className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] min-h-[80px]"
                rows={3}
              />
            </div>
          </div>
        </div>
      ))}

      {data.competitors.length < 5 && (
        <Button
          type="button"
          variant="outline"
          onClick={addCompetitor}
          className="border-[hsl(var(--navy-deep))]/20 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5"
        >
          Add Competitor
        </Button>
      )}

      <div className="space-y-2">
        <Label className="text-[hsl(var(--navy-deep))]/80">Competitive Moat</Label>
        <Textarea
          value={data.competitiveMoat}
          onChange={(e) => onUpdate({ competitiveMoat: e.target.value })}
          placeholder="What is your competitive advantage? What prevents others from copying you?"
          className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] placeholder:text-[hsl(var(--navy-deep))]/50 min-h-[120px]"
          rows={5}
        />
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack} className="border-[hsl(var(--navy-deep))]/20 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5">
          Back
        </Button>
        <Button onClick={onSubmit} className="bg-cyan-glow text-navy-deep hover:bg-cyan-bright">
          {submitLabel ?? "Submit Application"}
        </Button>
      </div>
    </div>
  );
};
