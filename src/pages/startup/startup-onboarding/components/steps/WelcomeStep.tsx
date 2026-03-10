import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2, CheckCircle2, AlertCircle, FileText, ArrowRight, Sparkles } from "lucide-react";
import { StartupOnboardingData } from "../../hooks/startupMemoTypes";
import { uploadFile, inferMemo } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { cn } from "@/lib/utils";

interface WelcomeStepProps {
  data: StartupOnboardingData;
  onUpdate: (data: Partial<StartupOnboardingData>) => void;
  onNext: () => void;
}

interface InferenceSummary {
  fieldsExtracted: number;
  avgConfidence: number;
  totalSeconds: number;
}

export const WelcomeStep = ({ data, onUpdate, onNext }: WelcomeStepProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState<"uploading" | "inferring" | "idle">("idle");
  const [summary, setSummary] = useState<InferenceSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isSkippedRef = useRef(false);

  const handlePitchdeckUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({ 
        title: "Invalid file format", 
        description: "Please upload a PDF document.", 
        variant: "destructive" 
      });
      e.target.value = ''; // Reset input
      return;
    }
    
    if (file.size > 20 * 1024 * 1024) {
      toast({ 
        title: "File too large", 
        description: "Please upload a PDF under 20MB.", 
        variant: "destructive" 
      });
      e.target.value = ''; // Reset input
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      toast({ title: "Session Expired", description: "Please log in to continue.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSummary(null);
    isSkippedRef.current = false;
    
    try {
      setProcessStep("uploading");
      const url = await uploadFile(file, "pitchdeck", user.uid);
      
      if (isSkippedRef.current) return;

      onUpdate({ 
        pitchdeck: file, 
        pitchdeckName: file.name,
        pitchdeckUrl: url 
      });

      setProcessStep("inferring");
      const result = await inferMemo(url);

      if (isSkippedRef.current) return;

      if (result.success && result.data) {
        const inferredData = result.data;
        
        let parsedConfidence: Record<string, number> = {};
        try {
           if (typeof inferredData.confidence === 'string') {
             const parsed = JSON.parse(inferredData.confidence);
             if (typeof parsed === 'object') parsedConfidence = parsed;
             else if (typeof parsed === 'number') {
                Object.keys(inferredData).forEach(k => parsedConfidence[k] = parsed);
             }
           } else if (typeof inferredData.confidence === 'object') {
             parsedConfidence = inferredData.confidence;
           }
        } catch (e) {
           console.warn("Failed to parse confidence scores", e);
        }

        const fieldCount = Object.keys(inferredData).filter(k => k !== 'confidence' && inferredData[k]).length;
        const confValues = Object.values(parsedConfidence).filter(v => typeof v === 'number');
        const avgConf = confValues.length > 0 ? (confValues.reduce((a, b) => a + b, 0) / confValues.length) * 100 : 95;

        setSummary({
           fieldsExtracted: fieldCount,
           avgConfidence: Math.round(avgConf),
           totalSeconds: result.timing?.total_seconds || 0
        });

        const { confidence, ...onboardingUpdates } = inferredData;
        
        if (typeof onboardingUpdates.valueDriverExplanations === 'string') {
          try {
            onboardingUpdates.valueDriverExplanations = JSON.parse(onboardingUpdates.valueDriverExplanations);
          } catch (e) {
            onboardingUpdates.valueDriverExplanations = {};
          }
        }

        onUpdate(onboardingUpdates);
        toast({ title: "Analysis Complete", description: `We extracted ${fieldCount} fields for you.` });
      } else {
        throw new Error("We couldn't parse this deck. Please try another one.");
      }
    } catch (err: any) {
      if (isSkippedRef.current) return;
      console.error("Autofill error:", err);
      setError(err.message || "Something went wrong during analysis.");
    } finally {
      if (!isSkippedRef.current) {
        setIsProcessing(false);
        setProcessStep("idle");
      }
    }
  };

  const handleSkip = () => {
    isSkippedRef.current = true;
    onNext();
  };

  const handleReset = () => {
    onUpdate({ pitchdeck: null, pitchdeckName: null, pitchdeckUrl: null });
    setSummary(null);
    setError(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold tracking-tight text-[hsl(var(--navy-deep))] mb-4">
          Welcome to In Sync
        </h2>
        <p className="text-[hsl(var(--navy-deep))]/60">
          Let's get you set up! You can save your progress and come back anytime.
        </p>
      </div>

      <div className={cn(
        "relative overflow-hidden p-10 rounded-[2rem] border transition-all duration-500",
        summary 
          ? "bg-emerald-50/30 border-emerald-100 shadow-2xl shadow-emerald-500/5" 
          : "bg-[hsl(var(--navy-deep))]/[0.1] border-[hsl(var(--navy-deep))]/10 shadow-2xl shadow-[hsl(var(--navy-deep))]/5"
      )}>
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-cyan-glow/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

        {!summary ? (
          <div className="relative z-10 space-y-8">
            <div className="flex flex-col items-center gap-6">
              <div className="relative group">
                <div className={cn(
                  "w-32 h-32 rounded-3xl bg-white border-2 border-dashed flex items-center justify-center transition-all duration-500",
                  isProcessing ? "border-cyan-glow scale-110 shadow-lg shadow-cyan-glow/10" : "border-[hsl(var(--navy-deep))]/10 group-hover:border-[hsl(var(--navy-deep))]/20"
                )}>
                  {isProcessing ? (
                    <div className="relative">
                       <Loader2 className="w-12 h-12 text-cyan-glow animate-spin" />
                       <div className="absolute inset-0 w-12 h-12 text-cyan-glow animate-ping opacity-20" />
                    </div>
                  ) : data.pitchdeckName ? (
                    <div className="flex flex-col items-center gap-2 p-4 animate-in zoom-in-50 duration-300">
                      <div className="w-10 h-10 rounded-lg bg-[hsl(var(--navy-deep))]/5 flex items-center justify-center text-[hsl(var(--navy-deep))] font-bold text-xs uppercase">PDF</div>
                      <p className="text-[10px] text-[hsl(var(--navy-deep))]/60 font-medium truncate max-w-[90px]">{data.pitchdeckName}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                       <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[hsl(var(--navy-deep))]/30 transition-transform group-hover:scale-110">
                          <Upload className="w-6 h-6" />
                       </div>
                    </div>
                  )}
                </div>
                
                {(data.pitchdeckName || error) && !isProcessing && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="absolute -top-3 -right-3 bg-white text-[hsl(var(--navy-deep))]/40 rounded-full p-2 shadow-sm border border-[hsl(var(--navy-deep))]/5 hover:text-red-500 hover:shadow-md transition-all active:scale-90"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="text-center space-y-4">
                {isProcessing ? (
                  <div className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex items-center justify-center gap-2 px-6 py-2 rounded-full bg-cyan-glow/5 border border-cyan-glow/10 text-cyan-glow font-medium text-sm">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      {processStep === "uploading" ? "Syncing to Cloud..." : "Analysing Pitch Deck..."}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <h3 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Autofill with Pitch Deck</h3>
                       {!error && (
                         <p className="text-[hsl(var(--navy-deep))]/60 text-sm font-light">
                           Upload your latest deck to pre-fill your startup profile in seconds.
                         </p>
                       )}
                    </div>

                    {error && (
                      <div className="flex items-center gap-3 text-red-500 text-xs bg-red-50/50 px-5 py-3 rounded-2xl border border-red-100/50 animate-in shake duration-500">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span className="leading-tight">{error}</span>
                      </div>
                    )}

                    <div className="flex flex-col items-center gap-4">
                      <Input
                        type="file"
                        accept="application/pdf"
                        onChange={handlePitchdeckUpload}
                        className="hidden"
                        id="pitchdeck-upload-v2"
                      />
                      <Label htmlFor="pitchdeck-upload-v2" className="cursor-pointer">
                        <span className="h-14 px-10 rounded-2xl bg-[hsl(var(--navy-deep))] text-white font-bold text-lg shadow-xl shadow-[hsl(var(--navy-deep))]/10 hover:bg-[hsl(var(--navy-deep))]/90 hover:-translate-y-0.5 active:translate-y-0 transition-all inline-flex items-center gap-3">
                           Select PDF
                           <FileText className="w-5 h-5 opacity-50" />
                        </span>
                      </Label>
                      <p className="text-[10px] uppercase tracking-widest text-[hsl(var(--navy-deep))]/30 font-bold">MAX 20MB</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="relative z-10 space-y-8 animate-in zoom-in-95 duration-500">
            <div className="flex flex-col items-center gap-4">
               <div className="w-20 h-20 bg-emerald-500 text-white rounded-[2rem] flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-10 h-10" />
               </div>
               <div className="space-y-1 text-center">
                  <h3 className="text-3xl font-extrabold text-[hsl(var(--navy-deep))] uppercase tracking-tight">Analysis Ready</h3>
                  <p className="text-[hsl(var(--navy-deep))]/50 font-light">We've pre-filled <b> {summary.fieldsExtracted} data points</b> from your deck</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white/50 border border-emerald-100/50 p-6 rounded-3xl text-center space-y-1">
                  <p className="text-3xl font-black text-emerald-600 tracking-tighter">{summary.avgConfidence}%</p>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-emerald-700/50">Confidence</p>
               </div>
               <div className="bg-white/50 border border-emerald-100/50 p-6 rounded-3xl text-center space-y-1">
                  <p className="text-3xl font-black text-emerald-600 tracking-tighter">{Math.round(summary.totalSeconds)}s</p>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-emerald-700/50">Processing Time</p>
               </div>
            </div>

            <div className="pt-4 space-y-4">
               <Button 
                  onClick={onNext} 
                  className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-lg font-bold rounded-2xl shadow-xl shadow-emerald-600/10 transition-all flex items-center gap-3"
               >
                  Review and Edit Memo
                  <ArrowRight className="w-5 h-5" />
               </Button>
               
               <button 
                 onClick={handleReset}
                 className="w-full text-center text-xs text-[hsl(var(--navy-deep))]/30 hover:text-[hsl(var(--navy-deep))]/60 transition-colors uppercase tracking-widest font-bold"
               >
                  Use a different file
               </button>
            </div>
          </div>
        )}
      </div>

      {!summary && (
        <div className="flex flex-col items-center gap-4 opacity-50 hover:opacity-100 transition-opacity">
          <button 
            onClick={handleSkip} 
            disabled={isProcessing}
            className={cn(
              "text-sm font-semibold text-[hsl(var(--navy-deep))]/60 tracking-wider flex items-center gap-2 hover:gap-3 transition-all",
              isProcessing && "pointer-events-none opacity-50"
            )}
          >
            SKIP AND FILL MANUALLY
            <ArrowRight className="w-4 h-4" />
          </button>
          {isProcessing && (
            <p className="text-[10px] text-[hsl(var(--navy-deep))]/30 uppercase tracking-[0.2em] animate-pulse">
              AI will continue in background
            </p>
          )}
        </div>
      )}
    </div>
  );
};
