import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Building2, Briefcase, Linkedin, User, Mail, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { sessionManager } from "@/lib/session";
import { auth } from "@/lib/firebase";
import { FloatingParticles } from "@/components/FloatingParticles";
import inSyncLogo from "@/landing/assets/in-sync-logo.png";

const FIREBASE_API = import.meta.env.VITE_FIREBASE_API || "";

type RoleType = "startup" | "vc";

export const SelectRole = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<RoleType | null>("vc");
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    title: "",
    linkedinProfile: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Company search state
  const [companySearchOpen, setCompanySearchOpen] = useState(false);
  const [companySearchQuery, setCompanySearchQuery] = useState("");
  const [companySearchResults, setCompanySearchResults] = useState<string[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [committedFirmName, setCommittedFirmName] = useState<string>(""); // Firm name user has committed to
  const [showCompanyNotFound, setShowCompanyNotFound] = useState(false);

  // Firms loaded from Firestore via GET /firms
  const [firmsFromDb, setFirmsFromDb] = useState<{ id: string; name: string }[]>([]);
  const [selectedFirmId, setSelectedFirmId] = useState<string>(""); // Firestore id of selected firm
  const [firmsLoading, setFirmsLoading] = useState(false);

  // Fetch all firms when user is available
  useEffect(() => {
    if (!FIREBASE_API) return;

    const fetchFirmsWithRetry = async (user: any, attempt = 1) => {
      setFirmsLoading(true);
      try {
        console.log(`Fetching firms (attempt ${attempt}/3)...`);
        const token = await user.getIdToken(true);
        const res = await fetch(`${FIREBASE_API}/firms`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (res.ok) {
          const data = await res.json();
          const firms = data.firms || [];
          setFirmsFromDb(firms);
          
          // If firms list is empty and we have attempts left, retry
          if (firms.length === 0 && attempt < 3) {
            console.log("No firms found, retrying in 2 seconds...");
            setTimeout(() => fetchFirmsWithRetry(user, attempt + 1), 2000);
            return; // Don't set loading false yet
          }
        } else {
          console.error("Firms fetch failed:", res.status);
        }
      } catch (error) {
        console.error("Error fetching firms:", error);
      } finally {
        // Only set loading false if we're not retrying or we've hit the limit
        setFirmsLoading(false);
      }
    };

    // Use onAuthStateChanged to wait for user to be available
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchFirmsWithRetry(user);
        // We can unsubscribe once we have the user if we only want to fetch once
        unsubscribe();
      }
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    // Clear company not found message when typing
    if (name === "companyName" && showCompanyNotFound) {
      setShowCompanyNotFound(false);
    }
  };

  // Client-side filtering of firms from DB
  useEffect(() => {
    if (role !== "vc") {
      setCompanySearchQuery("");
      setSelectedCompany("");
      setSelectedFirmId("");
      setCompanySearchResults([]);
      setShowCompanyNotFound(false);
      setCommittedFirmName("");
      return;
    }

    // Filter firms client-side based on search query
    if (companySearchQuery.trim()) {
      const query = companySearchQuery.trim().toLowerCase();
      const filtered = firmsFromDb
        .filter((f) => f.name.toLowerCase().includes(query))
        .map((f) => f.name);
      setCompanySearchResults(filtered);
    } else {
      setCompanySearchResults([]);
      setShowCompanyNotFound(false);
      setCommittedFirmName("");
    }
  }, [companySearchQuery, role, firmsFromDb]);

  // Show warning only when user has committed to a firm name (on blur or after selection)
  useEffect(() => {
    if (role === "vc" && !selectedCompany && committedFirmName.trim() && companySearchQuery.trim() === committedFirmName.trim()) {
      // Check if this firm exists (in real implementation, this would be an API call)
      // For now, if no results were found and user has committed, show the warning
      if (companySearchResults.length === 0 && !isSearching) {
        setShowCompanyNotFound(true);
      } else {
        setShowCompanyNotFound(false);
      }
    } else {
      setShowCompanyNotFound(false);
    }
  }, [committedFirmName, selectedCompany, companySearchQuery, companySearchResults, isSearching, role]);

  const handleCompanySelect = (company: string) => {
    setSelectedCompany(company);
    // Look up the firm ID from our DB list
    const firm = firmsFromDb.find((f) => f.name === company);
    setSelectedFirmId(firm?.id || "");
    setFormData((prev) => ({ ...prev, companyName: company }));
    setCompanySearchOpen(false);
    setCompanySearchQuery(company);
    setCommittedFirmName(company);
    setShowCompanyNotFound(false);
  };

  // Handle when user commits to a firm name (on blur or Enter key)
  const handleFirmNameCommit = () => {
    if (companySearchQuery.trim() && !selectedCompany) {
      setCommittedFirmName(companySearchQuery.trim());
      setFormData((prev) => ({ ...prev, companyName: companySearchQuery.trim() }));
    }
  };

  // Handle clearing the selected/entered firm
  const handleClearFirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCompany("");
    setSelectedFirmId("");
    setCompanySearchQuery("");
    setCommittedFirmName("");
    setShowCompanyNotFound(false);
    setFormData((prev) => ({ ...prev, companyName: "" }));
    setCompanySearchOpen(false);
  };

  // Clear committed name when user starts typing again
  useEffect(() => {
    if (role === "vc" && companySearchQuery.trim() !== committedFirmName && committedFirmName) {
      setCommittedFirmName("");
      setShowCompanyNotFound(false);
    }
  }, [companySearchQuery, committedFirmName, role]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (role === "vc") {
      if (!formData.companyName.trim()) {
        newErrors.companyName = "Firm name is required";
      }
      if (!formData.title.trim()) {
        newErrors.title = "Title is required";
      }
    }

    if (role === "startup") {
      if (!formData.title.trim()) {
        newErrors.title = "Title is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      setErrors({ role: "Please select a role" });
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        setErrors({ submit: "You must be signed in to select a role." });
        return;
      }

      // Determine the Firebase Auth custom-claim user_type
      const isExistingFirm = !!(selectedCompany && selectedFirmId);
      let userType: "vc-user" | "founder-user";

      if (role === "startup") {
        userType = "founder-user";
      } else if (role === "vc") {
        userType = "vc-user";
      } else {
        setErrors({ submit: "Please select a role." });
        return;
      }

      if (!FIREBASE_API) {
        setErrors({ submit: "API endpoint not configured." });
        return;
      }

      const token = await user.getIdToken(true);
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // 1. Set the Firebase Auth custom claim (user_type)
      const sanitizedApi = FIREBASE_API.replace(/\/$/, "");
      const setRoleUrl = `${sanitizedApi}/auth/set-user-type`;
      console.log("Calling set-user-type:", setRoleUrl, { userType });

      const roleRes = await fetch(setRoleUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({ user_type: userType }),
      });
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/5ce772b9-3080-4ec6-94ac-b8b4c43f9b0e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'3d819f'},body:JSON.stringify({sessionId:'3d819f',location:'SelectRole.tsx:set-role',message:'after set-role',data:{ok:roleRes.ok,status:roleRes.status},hypothesisId:'H1',timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      if (!roleRes.ok) {
        const err = await roleRes.json().catch(() => ({}));
        console.error("set-user-type failed:", roleRes.status, err);
        setErrors({ submit: `Set User Type failed: ${(err as { error?: string }).error || roleRes.statusText || "Unknown error"}` });
        return;
      }
      // Refresh token so new claims are available
      await user.getIdTokenResult(true);
      // Re-grab fresh token for subsequent calls
      const freshToken = await user.getIdToken(true);
      const freshHeaders = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${freshToken}`,
      };

      // 2. Create or join firm (VC path only)
      let firmId = "";
      if (role === "vc") {
        if (isExistingFirm) {
          // Join existing firm as analyst
          const joinRes = await fetch(`${FIREBASE_API}/firms/join`, {
            method: "POST",
            headers: freshHeaders,
            body: JSON.stringify({
              firmId: selectedFirmId,
              fullName: formData.fullName.trim(),
              title: formData.title.trim(),
              linkedinUrl: formData.linkedinProfile.trim() || undefined,
            }),
          });
          if (!joinRes.ok) {
            const err = await joinRes.json().catch(() => ({}));
            setErrors({ submit: (err as { error?: string }).error || "Failed to join firm. Please try again." });
            return;
          }
          const joinData = await joinRes.json();
          firmId = joinData.firmId;
        } else {
          // Create new firm as admin
          const sanitizedApi = FIREBASE_API.replace(/\/$/, "");
          const createFirmUrl = `${sanitizedApi}/firms`; 
          console.log("Calling create firm:", createFirmUrl);

          const createRes = await fetch(createFirmUrl, {
            method: "POST",
            headers: freshHeaders,
            body: JSON.stringify({
              firmName: formData.companyName.trim(),
              fullName: formData.fullName.trim(),
              title: formData.title.trim(),
              linkedinUrl: formData.linkedinProfile.trim() || undefined,
            }),
          });
          if (!createRes.ok) {
            const err = await createRes.json().catch(() => ({}));
            console.error("create firm failed:", createRes.status, err);
            setErrors({ submit: `Create Firm failed: ${(err as { error?: string }).error || createRes.statusText || "Unknown error"}` });
            return;
          }
          const createData = await createRes.json();
          firmId = createData.firmId;
        }
      }

      // 3. Explicitly wait for the claim to propagate
      // We loop briefly to ensure the claim is actually on the token result object before navigating.
      // This prevents race conditions where the backend set it, but the token refresh didn't catch it yet 
      // or the local state hasn't updated.
      let attempts = 0;
      let hasClaim = false;
      while (attempts < 10 && !hasClaim) {
        const tokenResult = await user.getIdTokenResult(true);
        if (tokenResult.claims.user_type === userType) {
            hasClaim = true;
        } else {
            // Wait 1 second before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
            attempts++;
        }
      }

      if (!hasClaim) {
          // If after retries we still don't see it, it might be a genuine error or just slow.
          // We'll proceed but log a warning. The route guard might bounce them back if it's strictly checking.
          console.warn("User type claim not detected after polling. Navigation might fail.");
      }

      // 4. Save session and navigate
      if (role === "startup") {
        // Call POST /startups/init to create startup + founder-user entities
        const sanitizedApi = FIREBASE_API.replace(/\/$/, "");
        const initRes = await fetch(`${sanitizedApi}/startups/init`, {
          method: "POST",
          headers: freshHeaders,
          body: JSON.stringify({
            fullName: formData.fullName.trim(),
            title: formData.title.trim(),
            linkedinUrl: formData.linkedinProfile.trim() || undefined,
          }),
        });
        if (!initRes.ok) {
          const err = await initRes.json().catch(() => ({}));
          console.error("startup init failed:", initRes.status, err);
          setErrors({ submit: `Startup init failed: ${(err as { error?: string }).error || initRes.statusText || "Unknown error"}` });
          return;
        }

        // Pre-fill startup onboarding localStorage with teamMembers from role data
        try {
          const prefill = {
            teamMembers: [
              {
                name: formData.fullName.trim(),
                role: formData.title.trim(),
                linkedin: formData.linkedinProfile.trim() || "",
                background: "",
              },
            ],
          };
          const existing = localStorage.getItem("startup_onboarding_data");
          let merged = prefill;
          if (existing) {
            try {
              const parsed = JSON.parse(existing);
              merged = { ...parsed, ...prefill };
            } catch (e) {
              console.warn("Could not parse existing startup onboarding data, overwriting.");
            }
          }
          localStorage.setItem("startup_onboarding_data", JSON.stringify(merged));
        } catch (e) {
          console.error("Failed to save startup prefill data to local storage", e);
        }

        sessionManager.save({
          role: "startup",
          onboardingType: "startup",
          onboardingComplete: false,
        });
        navigate("/startup-onboarding");
      } else if (role === "vc") {
        if (isExistingFirm) {
          sessionManager.save({
            role: "analyst",
            onboardingType: "vc_analyst",
            onboardingComplete: false,
            firmId,
          });
          navigate("/request-sent");
        } else {
          // Save preliminary data to VC onboarding storage so it's pre-filled
          // We use the same key as vcMemoTypes: "vc_onboarding_data"
          const prefillData = {
              fullName: formData.fullName.trim(),
              title: formData.title.trim(),
              linkedIn: formData.linkedinProfile.trim() || "",
              email: session?.email || user.email || "", // effective prefill of email too
              firmName: formData.companyName.trim(), // Might as well prefill firm name if we have it in the target data structure
          };
          try {
             // We need to be careful not to overwrite existing full data if the user is coming back, 
             // but usually this is a fresh start. 
             // To be safe, we can read, merge, and write.
             const existing = localStorage.getItem("vc_onboarding_data");
             let merged = prefillData;
             if (existing) {
                 try {
                     const parsed = JSON.parse(existing);
                     merged = { ...parsed, ...prefillData };
                 } catch (e) {
                     console.warn("Could not parse existing onboarding data, overwriting.");
                 }
             }
             localStorage.setItem("vc_onboarding_data", JSON.stringify(merged));
          } catch (e) {
              console.error("Failed to save prefill data to local storage", e);
          }

          sessionManager.save({
            role: "vc",
            onboardingType: "vc_admin",
            onboardingComplete: false,
            firmId,
          });
          navigate("/vc-onboarding");
        }
      }
    } catch (error) {
      console.error("Error submitting role selection:", error);
      setErrors({ submit: "An error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const session = sessionManager.get();

  return (
    <div className="min-h-screen bg-navy-deep flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background gradient orbs — soft breathing glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-glow/20 blur-[120px] animate-glow-soft opacity-30"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-glow/20 blur-[100px] animate-glow-soft opacity-30"
          style={{ animationDelay: "1.2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-glow/10 blur-[80px] animate-glow-soft opacity-40"
          style={{ animationDelay: "2.5s" }}
        />
      </div>

      {/* Floating Particles */}
      <FloatingParticles />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo — first impression with soft breathing glow */}
        <Link
          to="/landing"
          className="block mb-6 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0ms" }}
        >
          <div className="relative">
            <div
              className="absolute inset-0 blur-[60px] animate-glow-breathe rounded-full scale-150"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(6,182,212,0.45) 0%, rgba(6,182,212,0.2) 40%, transparent 70%)",
              }}
            />
            <img
              src={inSyncLogo}
              alt="InSync"
              className="relative h-40 w-auto max-w-[500px] mx-auto animate-glow-breathe"
              style={{
                filter: "drop-shadow(0 0 28px rgba(6,182,212,0.45)) drop-shadow(0 0 56px rgba(6,182,212,0.25))",
              }}
            />
          </div>
        </Link>

        {/* Card — subtle cyan halo, staggered entrance */}
        <div
          className="bg-navy-card border border-white/10 rounded-2xl p-8 shadow-xl opacity-0 animate-fade-in-up shadow-[0_0_0_1px_rgba(6,182,212,0.06),0_0_40px_-8px_rgba(6,182,212,0.15)]"
          style={{ animationDelay: "120ms" }}
        >
          <div
            className="text-center mb-8 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "220ms" }}
          >
            <h1 className="text-2xl font-bold text-white mb-2">Select Your Role</h1>
            <p className="text-white/60">
              {session?.email && `Signed in as ${session.email}`}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div
              className="space-y-2 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "320ms" }}
            >
              <Label className="text-white/80 mb-3 block">I am a... </Label>
              <div className="flex bg-white/5 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => {
                    setRole("startup");
                    setFormData((prev) => ({ 
                      ...prev, 
                      companyName: "",
                      title: "",
                      linkedinProfile: ""
                    }));
                    setSelectedCompany("");
                    setCompanySearchQuery("");
                    setShowCompanyNotFound(false);
                    setErrors({});
                  }}
                  className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                    role === "startup"
                      ? "bg-cyan-glow text-navy-deep"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  Startup Founder
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRole("vc");
                    setErrors({});
                  }}
                  className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                    role === "vc"
                      ? "bg-cyan-glow text-navy-deep"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  Investor / VC
                </button>
              </div>
              {errors.role && (
                <p className="text-red-400 text-sm">{errors.role}</p>
              )}
            </div>

            {/* Full Name - Always shown */}
            <div
              className="space-y-2 opacity-0 animate-fade-in-up"
              style={{ animationDelay: "420ms" }}
            >
              <Label htmlFor="fullName" className="text-white/80">
                Full Name *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-glow focus:ring-cyan-glow/20 pl-10"
                />
              </div>
              {errors.fullName && (
                <p className="text-red-400 text-sm">{errors.fullName}</p>
              )}
            </div>

            {/* VC-specific fields */}
            {role === "vc" && (
              <>
                {/* Firm */}
                <div
                  className="space-y-2 opacity-0 animate-fade-in-up"
                  style={{ animationDelay: "80ms" }}
                >
                  <Label className="text-white/80">Firm *</Label>
                  <Popover open={companySearchOpen} onOpenChange={(open) => {
                    setCompanySearchOpen(open);
                    if (!open && companySearchQuery.trim() && !selectedCompany) {
                      handleFirmNameCommit();
                    }
                  }}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={companySearchOpen}
                        className="w-full justify-between bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-cyan-glow/50 min-h-[40px]"
                        onClick={() => setCompanySearchOpen(true)}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Building2 className="h-4 w-4 text-white/60 shrink-0" />
                          {selectedCompany || companySearchQuery ? (
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-white/10 border border-white/20 rounded-md">
                              <span className="text-sm text-white truncate max-w-[200px]">
                                {selectedCompany || companySearchQuery}
                              </span>
                              <button
                                type="button"
                                onClick={handleClearFirm}
                                className="p-0.5 rounded hover:bg-white/20 transition-colors shrink-0"
                                aria-label="Clear firm selection"
                              >
                                <X className="h-3 w-3 text-white/70 hover:text-white" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-white/30">
                              Search or enter your VC firm name
                            </span>
                          )}
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-white/60" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 bg-navy-card border-white/10" align="start">
                      <Command className="bg-navy-card w-full">
                        <CommandInput
                          placeholder="Start typing.."
                          value={companySearchQuery}
                          onValueChange={(value) => {
                            setCompanySearchQuery(value);
                            if (selectedCompany && value !== selectedCompany) {
                              setSelectedCompany("");
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && companySearchQuery.trim() && !selectedCompany) {
                              e.preventDefault();
                              handleFirmNameCommit();
                              setCompanySearchOpen(false);
                            }
                          }}
                          className="text-white placeholder:text-white/30"
                        />
                        <CommandList>
                          {isSearching ? (
                            <div className="py-6 text-center text-sm text-white/60">
                              Searching...
                            </div>
                          ) : companySearchResults.length > 0 ? (
                            companySearchResults.map((company) => (
                              <CommandItem
                                key={company}
                                value={company}
                                onSelect={() => handleCompanySelect(company)}
                                className="text-white hover:bg-white/10 cursor-pointer"
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedCompany === company ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {company}
                              </CommandItem>
                            ))
                          ) : companySearchQuery.trim() && !isSearching ? (
                            <CommandEmpty className="py-6 text-center text-sm">
                              <div className="text-white/60">
                                <p className="font-medium mb-1">Not found</p>
                                <p className="text-xs text-white/40">Enter to create new firm</p>
                              </div>
                            </CommandEmpty>
                          ) : (
                            <div className="py-6 px-9 text-center text-sm text-white/60">
                            </div>
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {/* Explicit validation message - only show when user has committed to a new firm */}
                  {showCompanyNotFound && !selectedCompany && committedFirmName.trim() && (
                    <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-red-400 font-medium mb-1">
                          You are creating a new firm
                        </p>
                        <p className="text-xs text-red-400/90 leading-relaxed">
                          By continuing, you will become the administrator for this firm and will be responsible for setting up the firm profile and managing team members. You'll be able to invite analysts to join your firm after onboarding.
                        </p>
                      </div>
                    </div>
                  )}
                  {errors.companyName && (
                    <p className="text-red-400 text-sm">{errors.companyName}</p>
                  )}
                </div>
              </>
            )}

            {/* Title — shown for both roles */}
            {role && (
              <div
                className="space-y-2 opacity-0 animate-fade-in-up"
                style={{ animationDelay: "160ms" }}
              >
                <Label htmlFor="title" className="text-white/80">
                  Title *
                </Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    placeholder={role === "startup" ? "e.g. CEO, CTO, Co-Founder" : "e.g. Associate, Analyst, Principal"}
                    value={formData.title}
                    onChange={handleInputChange}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-glow focus:ring-cyan-glow/20 pl-10"
                  />
                </div>
                {errors.title && (
                  <p className="text-red-400 text-sm">{errors.title}</p>
                )}
              </div>
            )}

            {/* LinkedIn Profile — shown for both roles */}
            {role && (
              <div
                className="space-y-2 opacity-0 animate-fade-in-up"
                style={{ animationDelay: "240ms" }}
              >
                <Label htmlFor="linkedinProfile" className="text-white/80">
                  LinkedIn Profile
                </Label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    id="linkedinProfile"
                    name="linkedinProfile"
                    type="url"
                    placeholder="https://linkedin.com/in/yourprofile"
                    value={formData.linkedinProfile}
                    onChange={handleInputChange}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-glow focus:ring-cyan-glow/20 pl-10"
                  />
                </div>
              </div>
            )}
            {errors.submit && (
              <p className="text-red-400 text-sm text-center">{errors.submit}</p>
            )}

            {/* Submit Button */}
            <div
              className="opacity-0 animate-fade-in-up mt-6"
              style={{ animationDelay: "520ms" }}
            >
              <Button
                type="submit"
                disabled={isSubmitting || !role}
                className="w-full bg-cyan-glow text-navy-deep hover:bg-cyan-bright font-semibold py-5 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                {isSubmitting ? "Processing..." : "Continue"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SelectRole;
