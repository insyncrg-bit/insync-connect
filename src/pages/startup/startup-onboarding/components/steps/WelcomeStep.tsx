import { WelcomeStep as SharedWelcomeStep } from "@/components/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { StartupOnboardingData } from "../../hooks/startupMemoTypes";

interface WelcomeStepProps {
  data: StartupOnboardingData;
  onUpdate: (data: Partial<StartupOnboardingData>) => void;
  onNext: () => void;
}

export const WelcomeStep = ({ data, onUpdate, onNext }: WelcomeStepProps) => {
  const handlePitchdeckUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        return;
      }
      onUpdate({ pitchdeck: file, pitchdeckName: file.name });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold tracking-tight text-[hsl(var(--navy-deep))] mb-4">
          InSync's startup memo
        </h2>
        <p className="text-[hsl(var(--navy-deep))]/60">
          This will help us match you with the right investors. You can save your progress and come back anytime.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-[hsl(var(--navy-deep))]/5 border border-[hsl(var(--navy-deep))]/10 max-w-2xl mx-auto text-center space-y-6">
        <div className="space-y-2">
            <h3 className="text-xl font-semibold text-[hsl(var(--navy-deep))]">Autofill with Pitch Deck</h3>
            <p className="text-[hsl(var(--navy-deep))]/60 text-sm">
                Upload your pitch deck (PDF) to automatically pre-fill your startup memo.<br />
                <span className="block mt-1 font-medium italic">(Autofill is coming soon—currently just stores the deck!)</span> 
            </p>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <div className="relative group">
            <div className="w-24 h-24 rounded-xl bg-white border-2 border-dashed border-[hsl(var(--navy-deep))]/20 flex items-center justify-center shadow-sm">
              {data.pitchdeckName ? (
                <div className="text-center p-2">
                  <p className="text-xs text-[hsl(var(--navy-deep))] font-medium break-words max-w-[80px]">{data.pitchdeckName}</p>
                </div>
              ) : (
                <Upload className="w-8 h-8 text-[hsl(var(--navy-deep))]/40" />
              )}
            </div>
            {data.pitchdeckName && (
              <button
                type="button"
                onClick={() => onUpdate({ pitchdeck: null, pitchdeckName: null, pitchdeckUrl: null })}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {!data.pitchdeckName && (
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept=".pdf"
                onChange={handlePitchdeckUpload}
                className="hidden"
                id="pitchdeck-upload"
              />
              <Label htmlFor="pitchdeck-upload" className="cursor-pointer">
                <span className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-[hsl(var(--navy-deep))]/20 bg-white shadow-sm hover:bg-[hsl(var(--navy-deep))]/5 text-[hsl(var(--navy-deep))] h-9 px-4 py-2">
                  Upload Pitch Deck
                </span>
              </Label>
            </div>
          )}
          <p className="text-xs text-[hsl(var(--navy-deep))]/40 mt-2">PDF up to 20MB</p>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <Button onClick={onNext} className="bg-cyan-glow text-navy-deep hover:bg-cyan-bright px-8">
          Get Started
        </Button>
      </div>
    </div>
  );
};
