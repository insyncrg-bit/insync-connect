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
  const [role, setRole] = useState<RoleType | null>(null);
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

  // TODO: Re-enable authentication check when backend is implemented
  // useEffect(() => {
  //   const session = sessionManager.get();
  //   if (!session?.email) {
  //     navigate("/signup", { replace: true });
  //   }
  // }, [navigate]);

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

  // Company search function
  const searchCompanies = async (query: string) => {
    if (!query.trim()) {
      setCompanySearchResults([]);
      setShowCompanyNotFound(false);
      setCommittedFirmName("");
      return;
    }

    setIsSearching(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/companies/search?q=${encodeURIComponent(query)}`);
      // const data = await response.json();
      // setCompanySearchResults(data.companies || []);
      
      // Mock data for now - replace with API call
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
      setCompanySearchResults([]); // Empty results to show "not found" message
    } catch (error) {
      console.error("Error searching companies:", error);
      setCompanySearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce company search
  useEffect(() => {
    if (role !== "vc") {
      setCompanySearchQuery("");
      setSelectedCompany("");
      setCompanySearchResults([]);
      setShowCompanyNotFound(false);
      setCommittedFirmName("");
      return;
    }

    const timeoutId = setTimeout(() => {
      if (companySearchQuery.trim()) {
        searchCompanies(companySearchQuery);
      } else {
        setCompanySearchResults([]);
        setShowCompanyNotFound(false);
        setCommittedFirmName("");
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [companySearchQuery, role]);

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

      let claimRole: "startup" | "vc" | "analyst";
      let onboardingType: "startup" | "vc_admin" | "vc_analyst";

      if (role === "startup") {
        claimRole = "startup";
        onboardingType = "startup";
      } else if (role === "vc") {
        if (selectedCompany) {
          claimRole = "analyst";
          onboardingType = "vc_analyst";
        } else {
          claimRole = "vc";
          onboardingType = "vc_admin";
        }
      } else {
        setErrors({ submit: "Please select a role." });
        return;
      }

      if (FIREBASE_API) {
        const token = await user.getIdToken(true);
        const res = await fetch(`${FIREBASE_API}/auth/set-role`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: claimRole }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          setErrors({ submit: (err as { error?: string }).error || "Failed to set role. Please try again." });
          return;
        }
        // Force refresh token result so claims include the newly assigned role (matches SignUp/Login pattern).
        await user.getIdTokenResult(true);
      }

      if (role === "startup") {
        sessionManager.save({
          role: "startup",
          onboardingType: "startup",
          onboardingComplete: false,
        });
        navigate("/startup-onboarding");
      } else if (role === "vc") {
        if (selectedCompany) {
          sessionManager.save({
            role: "analyst",
            onboardingType: "vc_analyst",
            onboardingComplete: false,
          });
          navigate("/request-sent");
        } else {
          sessionManager.save({
            role: "vc",
            onboardingType: "vc_admin",
            onboardingComplete: false,
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
      {/* Background gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-glow/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-glow/5 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Floating Particles */}
      <FloatingParticles />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="block mb-6">
          <div className="relative">
            <div 
              className="absolute inset-0 blur-[60px] animate-pulse"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.4) 0%, rgba(6,182,212,0.2) 40%, transparent 70%)',
              }}
            />
            <img
              src={inSyncLogo}
              alt="InSync"
              className="relative h-20 w-auto max-w-[400px] mx-auto"
              style={{
                filter: "drop-shadow(0 0 30px rgba(6,182,212,0.5)) drop-shadow(0 0 60px rgba(6,182,212,0.3))",
              }}
            />
          </div>
        </Link>

        {/* Card */}
        <div className="bg-navy-card border border-white/10 rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Select Your Role</h1>
            <p className="text-white/60">
              {session?.email && `Signed in as ${session.email}`}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div className="space-y-2">
              <Label className="text-white/80 mb-3 block">I am a... *</Label>
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
            <div className="space-y-2">
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
                <div className="space-y-2">
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
                      <Command className="bg-navy-card">
                        <CommandInput
                          placeholder="Search for your firm..."
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
                                <p className="font-medium mb-1">Firm not found</p>
                                <p className="text-xs text-white/40">Press Enter to create new firm</p>
                              </div>
                            </CommandEmpty>
                          ) : (
                            <div className="py-6 text-center text-sm text-white/60">
                              Start typing to search for your firm...
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
                          Firm not found in database
                        </p>
                        <p className="text-xs text-red-400/90 leading-relaxed">
                          <strong>You are creating a new VC firm admin account.</strong> By continuing, you will become the administrator for this firm and will be responsible for setting up the firm profile and managing team members. You'll be able to invite analysts to join your firm after completing onboarding.
                        </p>
                      </div>
                    </div>
                  )}
                  {errors.companyName && (
                    <p className="text-red-400 text-sm">{errors.companyName}</p>
                  )}
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white/80">
                    Title *
                  </Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      placeholder="e.g. Associate, Analyst, Principal"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-glow focus:ring-cyan-glow/20 pl-10"
                    />
                  </div>
                  {errors.title && (
                    <p className="text-red-400 text-sm">{errors.title}</p>
                  )}
                </div>

                {/* LinkedIn Profile */}
                <div className="space-y-2">
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
              </>
            )}

            {/* Submit Error */}
            {errors.submit && (
              <p className="text-red-400 text-sm text-center">{errors.submit}</p>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !role}
              className="w-full mt-6 bg-cyan-glow text-navy-deep hover:bg-cyan-bright font-semibold py-5 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {isSubmitting ? "Processing..." : "Continue"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SelectRole;
