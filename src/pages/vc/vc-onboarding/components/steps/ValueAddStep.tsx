import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";
import { useState } from "react";
import { VCOnboardingData } from "../../hooks/useVCOnboardingStorage";
import { OPERATING_SUPPORT } from "../../constants";

interface ValueAddStepProps {
  data: VCOnboardingData;
  onUpdate: (data: Partial<VCOnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ValueAddStep = ({
  data,
  onUpdate,
  onNext,
  onBack,
}: ValueAddStepProps) => {
  const [newSupport, setNewSupport] = useState("");
  const [isAddingSupport, setIsAddingSupport] = useState(false);

  const toggleArray = (field: keyof VCOnboardingData, value: string) => {
    const current = (data[field] as string[]) || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onUpdate({ [field]: updated } as Partial<VCOnboardingData>);
  };

  const handleAddSupport = () => {
    if (newSupport.trim()) {
      const updated = [...(data.operatingSupport || []), newSupport.trim()];
      onUpdate({ operatingSupport: updated });
      setNewSupport("");
      setIsAddingSupport(false);
    }
  };

  const handleRemoveSupport = (supportToRemove: string) => {
    const updated = (data.operatingSupport || []).filter((s) => s !== supportToRemove);
    onUpdate({ operatingSupport: updated });
  };

  // Separate predefined and custom supports for rendering
  const customSupports = (data.operatingSupport || []).filter(
    (s) => !OPERATING_SUPPORT.includes(s)
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[hsl(var(--navy-deep))] mb-2">Value-Add</h2>
        <p className="text-[hsl(var(--navy-deep))]/60 text-sm">
          Describe how your firm supports portfolio companies.
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label className="text-[hsl(var(--navy-deep))]/80">Operating Support *</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {/* Predefined Options */}
            {OPERATING_SUPPORT.map((support) => (
              <button
                key={support}
                type="button"
                onClick={() => toggleArray("operatingSupport", support)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  (data.operatingSupport || []).includes(support)
                    ? "bg-cyan-glow text-navy-deep"
                    : "bg-[hsl(var(--navy-deep))]/5 text-[hsl(var(--navy-deep))]/70 hover:bg-[hsl(var(--navy-deep))]/10 border border-[hsl(var(--navy-deep))]/10"
                }`}
              >
                {support}
              </button>
            ))}

            {/* Custom Options */}
            {customSupports.map((support) => (
              <div
                key={support}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-glow/10 text-cyan-700 text-sm border border-cyan-glow/20"
              >
                <span>{support}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSupport(support)}
                  className="hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {/* Add Custom Button/Input */}
            {isAddingSupport ? (
              <div className="flex items-center gap-2">
                <Input
                  value={newSupport}
                  onChange={(e) => setNewSupport(e.target.value)}
                  className="h-8 w-40 text-sm"
                  placeholder="Add custom..."
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSupport();
                    }
                  }}
                />
                <Button 
                  size="sm" 
                  onClick={handleAddSupport}
                  className="h-8 bg-cyan-glow text-navy-deep hover:bg-cyan-bright"
                >
                  Add
                </Button>
                <button 
                  onClick={() => setIsAddingSupport(false)}
                  className="p-1 hover:bg-slate-100 rounded"
                >
                    <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingSupport(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-dashed border-[hsl(var(--navy-deep))]/30 text-[hsl(var(--navy-deep))]/70 hover:text-[hsl(var(--navy-deep))] hover:border-[hsl(var(--navy-deep))]/60 hover:bg-[hsl(var(--navy-deep))]/5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Other
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="operatingSupportOther" className="text-[hsl(var(--navy-deep))]/80">
            Additional Support Details
          </Label>
          <Textarea
            id="operatingSupportOther"
            value={data.operatingSupportOther}
            onChange={(e) => onUpdate({ operatingSupportOther: e.target.value })}
            placeholder="Describe any additional support you provide..."
            className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] placeholder:text-[hsl(var(--navy-deep))]/50 min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="firmInvolvement" className="text-[hsl(var(--navy-deep))]/80">
            Firm Involvement *
          </Label>
          <Textarea
            id="firmInvolvement"
            value={data.firmInvolvement}
            onChange={(e) => onUpdate({ firmInvolvement: e.target.value })}
            placeholder="Describe how your firm typically gets involved with portfolio companies..."
            className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] placeholder:text-[hsl(var(--navy-deep))]/50 min-h-[120px]"
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
