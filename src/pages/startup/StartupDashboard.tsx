import { Rocket, FileText, UserCog, Loader2, Users, Sparkles, MapPin, Globe, Linkedin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { lazy, Suspense, useEffect, useState, useCallback } from "react";
import { auth } from "@/lib/firebase";
import { useUserClaims } from "@/hooks/useUserClaims";

// Lazy load the sub-pages
const StartupMemoPage = lazy(() => import("./StartupMemoPage"));
const StartupSettings = lazy(() => import("./StartupSettings"));
const StartupOrganisation = lazy(() => import("@/components/dashboards/StartupOrganisation").then(m => ({ default: m.StartupOrganisation })));
import { DashboardQuickAccessCard } from "@/components/dashboards/DashboardQuickAccessCard";
import { MemoModal } from "@/components/MemoModal";

export function StartupDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const { userType, isAdmin } = useUserClaims();
  const [startupData, setStartupData] = useState<any>(null);
  const [memoData, setMemoData] = useState<any>(null);
  const [founderUserData, setFounderUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [memoModalOpen, setMemoModalOpen] = useState(false);

  const fetchStartupDetails = useCallback(async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }
      const token = await user.getIdToken();
      const apiUrl = import.meta.env.VITE_FIREBASE_API;
      
      // Fetch as separate promises to update state as they arrive
      fetch(`${apiUrl}/api/startups/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.ok ? res.json() : null)
        .then(data => data && setStartupData(data.startup))
        .catch(err => console.error("Error fetching startup:", err));

      fetch(`${apiUrl}/api/startups/me/memo`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.ok ? res.json() : null)
        .then(data => data && setMemoData(data.memo))
        .catch(err => console.error("Error fetching memo:", err));

      fetch(`${apiUrl}/api/users/founder-users/${user.uid}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data?.user) setFounderUserData(data.user);
        })
        .catch(err => console.error("Error fetching founder user:", err))
        .finally(() => setLoading(false));

    } catch (err) {
      console.error("Failed to fetch startup details", err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStartupDetails();
  }, [fetchStartupDetails]);

  // Tab content renderer
  const renderContent = () => {
    // Use profileComplete flag if it exists, otherwise fall back to manual check
    const isProfileIncomplete = founderUserData && (
      founderUserData.profileComplete === false || 
      (founderUserData.profileComplete === undefined && (
        !founderUserData.education?.degree || 
        !founderUserData.education?.university || 
        !founderUserData.funFact || 
        !founderUserData.linkedinUrl
      ))
    );

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
            <StartupSettings onUpdate={() => {
              setLoading(true);
              fetchStartupDetails();
            }} />
          </Suspense>
        );
      case "organisation":
        return (
          <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-cyan-glow" /></div>}>
             {loading ? <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-cyan-glow" /></div> 
               : <StartupOrganisation 
                   startupId={startupData?.id} 
                   isAdmin={isAdmin}
                   companyName={memoData?.company_name || startupData?.companyName}
                   companyLogo={memoData?.logo_url}
                   adminUids={startupData?.adminUids || []}
                 />
             }
          </Suspense>
        );
      default:
        // Main Dashboard View
        return (
          <div className="max-w-6xl mx-auto space-y-10">
            {isProfileIncomplete && (
              <div 
                className="bg-gradient-to-r from-[hsl(var(--cyan-glow))]/20 to-transparent border border-[hsl(var(--cyan-glow))]/30 rounded-xl p-4 flex items-center justify-between gap-20 group cursor-pointer hover:bg-[hsl(var(--cyan-glow))]/30 transition-all duration-300" 
                onClick={() => navigate("/startup-dashboard?tab=edit-profile")}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[hsl(var(--cyan-glow))]/20 flex items-center justify-center shrink-0">
                    <Sparkles className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-medium">Complete your founder profile</p>
                    <p className="text-white/60 text-sm truncate">Help investors understand your background better!</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[hsl(var(--cyan-glow))] group-hover:gap-3 transition-all shrink-0">
                  <span className="text-sm font-semibold uppercase tracking-wider hidden sm:inline">Complete Profile</span>
                  <FileText className="h-4 w-4" />
                </div>
              </div>
            )}

            <div>
              <h1 className="text-4xl font-bold text-white">
                Welcome {founderUserData?.fullName?.split(" ")[0] || "Founders"} from {memoData?.company_name || startupData?.companyName || "Rev"}!
              </h1>
              <p className="text-white/60 mt-2">{founderUserData?.title || "Co-Founder"}</p>
            </div>

            <DashboardQuickAccessCard
              icon={FileText}
              title={`${memoData?.company_name || startupData?.companyName || "Rev"}'s Memo`}
              subtitle={
                <div className="flex flex-wrap items-center gap-4 mt-1" onClick={(e) => e.stopPropagation()}>
                  {memoData?.vertical && (
                    <span className="flex items-center gap-1 text-white/60">
                      <Sparkles className="h-4 w-4 text-[hsl(var(--cyan-glow))]" />
                      {memoData.vertical}
                    </span>
                  )}
                  {startupData?.location && (
                    <span className="flex items-center gap-1 text-white/60">
                      <MapPin className="h-4 w-4 text-[hsl(var(--cyan-glow))]" />
                      {startupData.location}
                    </span>
                  )}
                  {memoData?.website && (
                    <a
                      href={memoData.website.startsWith('http') ? memoData.website : `https://${memoData.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-white/40 hover:text-[hsl(var(--cyan-glow))] transition-colors"
                    >
                      <Globe className="h-4 w-4" />
                      Website
                    </a>
                  )}
                  {memoData?.linkedIn && (
                    <a
                      href={memoData.linkedIn.startsWith('http') ? memoData.linkedIn : `https://${memoData.linkedIn}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-white/40 hover:text-[hsl(var(--cyan-glow))] transition-colors"
                    >
                      <Linkedin className="h-4 w-4" />
                      LinkedIn
                    </a>
                  )}
                </div>
              }
              onClick={() => setMemoModalOpen(true)}
              logoUrl={memoData?.logo_url || memoData?.startupLogoUrl || memoData?.companyLogoUrl}
            />

            <div className="flex flex-col sm:flex-row items-stretch gap-6 pt-2">
              <div className="flex-1 bg-navy-card/40 border border-white/5 rounded-2xl p-8 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-cyan-glow/10 text-cyan-glow/60">
                  <Rocket className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white/80 mb-1">Dashboard Coming Soon</h3>
                  <p className="text-white/50 text-sm">
                    Investor matching, interests, syncs, and messages are currently under construction.
                  </p>
                </div>
              </div>

              <div 
                className="flex-1 bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-4 group cursor-pointer hover:bg-purple-500/15 transition-all duration-300"
                onClick={() => navigate("/startup-dashboard?tab=organisation")}
              >
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white/90 mb-1">Enroll your Co-founders</h3>
                  <p className="text-white/40 text-sm mb-2">
                    In the mean time have your co founders join your org!
                  </p>
                  <div className="flex items-center justify-center gap-1 text-purple-400 text-sm font-semibold group-hover:gap-2 transition-all">
                    Manage Team <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>

            {memoData && (
              <MemoModal
                open={memoModalOpen}
                onOpenChange={setMemoModalOpen}
                startup={{
                  id: memoData.id || startupData?.id,
                  user_id: auth.currentUser?.uid,
                  founder_name: founderUserData?.fullName || "",
                  company_name: memoData.company_name || startupData?.companyName || "",
                  vertical: memoData.vertical || "",
                  stage: memoData.stage || "",
                  location: startupData?.location || "",
                  website: memoData.website || null,
                  business_model: memoData.business_model || memoData.companyOverview || "",
                  funding_goal: memoData.funding_goal || "",
                  traction: memoData.traction || "",
                  logo_url: memoData.logo_url || memoData.startupLogoUrl || memoData.companyLogoUrl,
                  pitchdeck_url: memoData.pitchdeck_url || memoData.pitchdeckUrl,
                  pitchdeck_name: memoData.pitchdeck_name || memoData.pitchdeckName,
                  application_sections: memoData.application_sections || memoData,
                  updated_at: memoData.updated_at
                }}
                onEdit={() => {
                  setMemoModalOpen(false);
                  navigate("/startup-dashboard?tab=edit-memo");
                }}
              />
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#151a24]">
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        {loading ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--cyan-glow))]" />
          </div>
        ) : (
          renderContent()
        )}
      </main>
    </div>
  );
}
