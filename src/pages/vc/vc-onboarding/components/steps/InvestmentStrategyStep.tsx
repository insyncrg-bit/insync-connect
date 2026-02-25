import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";
import { useState } from "react";
import { VCOnboardingData } from "../../hooks/vcMemoTypes";
import { BUSINESS_MODELS } from "../../constants";

interface InvestmentStrategyStepProps {
  data: VCOnboardingData;
  onUpdate: (data: Partial<VCOnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const InvestmentStrategyStep = ({
  data,
  onUpdate,
  onNext,
  onBack,
}: InvestmentStrategyStepProps) => {
  const [newKeyMetric, setNewKeyMetric] = useState("");
  const [isAddingKeyMetric, setIsAddingKeyMetric] = useState(false);
  const [newBusinessModel, setNewBusinessModel] = useState("");
  const [isAddingBusinessModel, setIsAddingBusinessModel] = useState(false);

  const toggleArray = (field: keyof VCOnboardingData, value: string) => {
    const current = (data[field] as string[]) || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onUpdate({ [field]: updated } as Partial<VCOnboardingData>);
  };

  const handleAddKeyMetric = () => {
    if (newKeyMetric.trim()) {
      const updated = [...(data.keyMetrics || []), newKeyMetric.trim()];
      onUpdate({ keyMetrics: updated });
      setNewKeyMetric("");
      setIsAddingKeyMetric(false);
    }
  };

  const handleRemoveKeyMetric = (metricToRemove: string) => {
    const updated = (data.keyMetrics || []).filter((metric) => metric !== metricToRemove);
    onUpdate({ keyMetrics: updated });
  };

  const handleAddBusinessModel = () => {
    if (newBusinessModel.trim()) {
      const updated = [...(data.businessModels || []), newBusinessModel.trim()];
      onUpdate({ businessModels: updated });
      setNewBusinessModel("");
      setIsAddingBusinessModel(false);
    }
  };

  const handleRemoveBusinessModel = (modelToRemove: string) => {
    const updated = (data.businessModels || []).filter((model) => model !== modelToRemove);
    onUpdate({ businessModels: updated });
  };

  const customBusinessModels = (data.businessModels || []).filter(
    (model) => !BUSINESS_MODELS.includes(model)
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[hsl(var(--navy-deep))] mb-2">Investment Strategy</h2>
        <p className="text-[hsl(var(--navy-deep))]/60 text-sm">
          Define your investment thesis and criteria.
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="thesisStatement" className="text-[hsl(var(--navy-deep))]/80">
            Thesis Statement *
          </Label>
          <Textarea
            id="thesisStatement"
            value={data.thesisStatement}
            onChange={(e) => onUpdate({ thesisStatement: e.target.value })}
            placeholder="Describe your investment thesis and what you look for in companies..."
            className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] placeholder:text-[hsl(var(--navy-deep))]/50 min-h-[150px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subThemesOther" className="text-[hsl(var(--navy-deep))]/80">
            Sub-themes
          </Label>
          <Input
            id="subThemesOther"
            value={data.subThemesOther}
            onChange={(e) => onUpdate({ subThemesOther: e.target.value })}
            placeholder="e.g. AI infrastructure, climate tech, etc."
            className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] placeholder:text-[hsl(var(--navy-deep))]/50"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[hsl(var(--navy-deep))]/80">Business Models</Label>
          <div className="flex flex-wrap gap-2">
            {BUSINESS_MODELS.map((model) => (
              <button
                key={model}
                type="button"
                onClick={() => toggleArray("businessModels", model)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  (data.businessModels || []).includes(model)
                    ? "bg-cyan-glow text-navy-deep"
                    : "bg-[hsl(var(--navy-deep))]/5 text-[hsl(var(--navy-deep))]/70 hover:bg-[hsl(var(--navy-deep))]/10 border border-[hsl(var(--navy-deep))]/10"
                }`}
              >
                {model}
              </button>
            ))}

            {customBusinessModels.map((model) => (
              <div
                key={model}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-glow/10 text-cyan-700 text-sm border border-cyan-glow/20"
              >
                <span>{model}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveBusinessModel(model)}
                  className="hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {isAddingBusinessModel ? (
              <div className="flex items-center gap-2">
                <Input
                  value={newBusinessModel}
                  onChange={(e) => setNewBusinessModel(e.target.value)}
                  className="h-8 w-40 text-sm"
                  placeholder="Add model..."
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddBusinessModel();
                    }
                  }}
                />
                <Button 
                  size="sm" 
                  onClick={handleAddBusinessModel}
                  className="h-8 bg-cyan-glow text-navy-deep hover:bg-cyan-bright"
                >
                  Add
                </Button>
                <button 
                  onClick={() => setIsAddingBusinessModel(false)}
                  className="p-1 hover:bg-slate-100 rounded"
                >
                    <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingBusinessModel(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-dashed border-[hsl(var(--navy-deep))]/30 text-[hsl(var(--navy-deep))]/70 hover:text-[hsl(var(--navy-deep))] hover:border-[hsl(var(--navy-deep))]/60 hover:bg-[hsl(var(--navy-deep))]/5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Other
              </button>
            )}
          </div>
        </div>

         <div className="space-y-2">
          <Label className="text-[hsl(var(--navy-deep))]/80">Key Metrics</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {(data.keyMetrics || []).map((metric) => (
              <div
                key={metric}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-glow/10 text-cyan-700 text-sm border border-cyan-glow/20"
              >
                <span>{metric}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveKeyMetric(metric)}
                  className="hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            
            {isAddingKeyMetric ? (
              <div className="flex items-center gap-2">
                <Input
                  value={newKeyMetric}
                  onChange={(e) => setNewKeyMetric(e.target.value)}
                  className="h-8 w-40 text-sm"
                  placeholder="Add metric..."
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddKeyMetric();
                    }
                  }}
                />
                <Button 
                  size="sm" 
                  onClick={handleAddKeyMetric}
                  className="h-8 bg-cyan-glow text-navy-deep hover:bg-cyan-bright"
                >
                  Add
                </Button>
                <button 
                  onClick={() => setIsAddingKeyMetric(false)}
                  className="p-1 hover:bg-slate-100 rounded"
                >
                    <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingKeyMetric(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-dashed border-[hsl(var(--navy-deep))]/30 text-[hsl(var(--navy-deep))]/70 hover:text-[hsl(var(--navy-deep))] hover:border-[hsl(var(--navy-deep))]/60 hover:bg-[hsl(var(--navy-deep))]/5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Metric
              </button>
            )}
          </div>
          <p className="text-xs text-[hsl(var(--navy-deep))]/50">
            Add key metrics you evaluate (e.g., LTV/CAC, NDR, ARR Growth).
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nonNegotiables" className="text-[hsl(var(--navy-deep))]/80">
            Non-Negotiables
          </Label>
          <Textarea
            id="nonNegotiables"
            value={data.nonNegotiables}
            onChange={(e) => onUpdate({ nonNegotiables: e.target.value })}
            placeholder="List any hard requirements or deal breakers..."
            className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] placeholder:text-[hsl(var(--navy-deep))]/50 min-h-[100px]"
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
