/**
 * Startup (Founder) Dashboard – placeholder.
 * Full dashboard (investors, interests, syncs, messages) coming soon.
 */
import { Rocket } from "lucide-react";

export function StartupDashboard() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-navy-card/80 border border-white/10 rounded-2xl p-10 text-center shadow-xl">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-glow/20 text-cyan-glow mb-6">
          <Rocket className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Coming Soon</h1>
        <p className="text-white/70">
          Your startup dashboard is under construction. You’ve completed onboarding — we’ll notify you when the full experience (investor matching, interests, syncs, and messages) is ready.
        </p>
      </div>
    </div>
  );
}
