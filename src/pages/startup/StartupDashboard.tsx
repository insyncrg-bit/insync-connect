import { Rocket, FileText, UserCog, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy load the sub-pages
const StartupMemoPage = lazy(() => import("./StartupMemoPage"));
const StartupSettings = lazy(() => import("./StartupSettings"));

export function StartupDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  // Tab content renderer
  const renderContent = () => {
    switch (tab) {
      case "edit-memo":
        return (
          <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-cyan-glow" /></div>}>
            <StartupMemoPage />
          </Suspense>
        );
      case "edit-profile":
        return (
          <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-cyan-glow" /></div>}>
            <StartupSettings />
          </Suspense>
        );
      default:
        // Main Dashboard View (Placeholder)
        return (
          <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12">
            <div className="max-w-md w-full bg-navy-card/80 border border-white/10 rounded-2xl p-10 text-center shadow-xl space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-glow/20 text-cyan-glow mb-2">
                <Rocket className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">Dashboard Coming Soon</h1>
                <p className="text-white/70">
                  Your startup dashboard is under construction. You’ve completed onboarding — we’ll notify you when the full experience (investor matching, interests, syncs, and messages) is ready.
                </p>
              </div>
              <div className="space-y-3">
                <Button
                  className="w-full bg-cyan-glow text-navy-deep hover:bg-cyan-bright font-semibold"
                  onClick={() => navigate("/startup-dashboard?tab=edit-memo")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Edit My Memo
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-white/70 hover:text-white hover:bg-white/10"
                  onClick={() => navigate("/startup-dashboard?tab=edit-profile")}
                >
                  <UserCog className="h-4 w-4 mr-2" />
                  Profile Settings
                </Button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6">
      {renderContent()}
    </div>
  );
}
