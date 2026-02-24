/**
 * Startup (Founder) Dashboard – placeholder.
 * Full dashboard (investors, interests, syncs, messages) coming soon.
 */
import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function StartupDashboard() {
  const navigate = useNavigate();

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
            onClick={() => navigate("/startup-memo")}
          >
            View &amp; Edit Your Memo
          </Button>
          <Button
            variant="ghost"
            className="w-full text-white/70 hover:text-white hover:bg-white/10"
            onClick={() => navigate("/startup-settings")}
          >
            Account Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
