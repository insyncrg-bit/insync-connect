import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { VCOnboardingData } from "../../hooks/useVCOnboardingStorage";
import {
  FUND_TYPES,
  CHECK_SIZES,
  STAGE_FOCUS,
  SECTOR_TAGS,
  LEAD_FOLLOW,
  LOCATION_BRANCHES,
} from "../../constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormField,
  TextInput,
  MultiSelect,
  SwitchField,
  StepNavigation,
  LocationField,
} from "@/components/onboarding";
import { Upload, X, Plus } from "lucide-react";
import { uploadFile, deleteFile } from "@/lib/api";
import { sessionManager } from "@/lib/session";
import { useState } from "react";

interface FundOverviewStepProps {
  data: VCOnboardingData;
  onUpdate: (data: Partial<VCOnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const FundOverviewStep = ({
  data,
  onUpdate,
  onNext,
  onBack,
}: FundOverviewStepProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [newBranch, setNewBranch] = useState("");
  const [isAddingBranch, setIsAddingBranch] = useState(false);
  const [newSector, setNewSector] = useState("");
  const [isAddingSector, setIsAddingSector] = useState(false);
  
  // Top Investments state
  const [newInvName, setNewInvName] = useState("");
  const [newInvWebsite, setNewInvWebsite] = useState("");
  const [isAddingInvestment, setIsAddingInvestment] = useState(false);

  const handleAddInvestment = () => {
    if (newInvName.trim()) {
      const entry = { name: newInvName.trim(), website: newInvWebsite.trim() };
      const updatedInvestments = [...(data.topInvestments || []), entry];
      onUpdate({ topInvestments: updatedInvestments });
      setNewInvName("");
      setNewInvWebsite("");
      setIsAddingInvestment(false);
    }
  };

  const handleRemoveInvestment = (index: number) => {
    const updatedInvestments = (data.topInvestments || []).filter((_, i) => i !== index);
    onUpdate({ topInvestments: updatedInvestments });
  };
  const firmId = sessionManager.get()?.firmId;

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file.");
        return;
      }

      try {
        setIsUploading(true);

        if (data.companyLogo) {
          try {
            await deleteFile(data.companyLogo);
          } catch (error) {
            console.error("Failed to delete old logo:", error);
          }
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          onUpdate({ logoPreview: reader.result as string });
        };
        reader.readAsDataURL(file);

        const publicUrl = await uploadFile(file, "logo", firmId);
        onUpdate({ companyLogo: publicUrl });
      } catch (error) {
        console.error("Failed to upload logo:", error);
        alert("Failed to upload logo. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleAddBranch = () => {
    if (newBranch.trim()) {
      const updatedBranches = [...(data.otherLocationBranches || []), newBranch.trim()];
      onUpdate({ otherLocationBranches: updatedBranches });
      setNewBranch("");
      setIsAddingBranch(false);
    } else {
      setIsAddingBranch(false);
    }
  };

  const handleRemoveBranch = (index: number) => {
    const updatedBranches = (data.otherLocationBranches || []).filter((_, i) => i !== index);
    onUpdate({ otherLocationBranches: updatedBranches });
  };

  const handleBranchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddBranch();
    }
  };

  const handleAddSector = () => {
    if (newSector.trim()) {
      const updatedSectors = [...data.sectorTags, newSector.trim()];
      onUpdate({ sectorTags: updatedSectors });
      setNewSector("");
      setIsAddingSector(false);
    } else {
      setIsAddingSector(false);
    }
  };

  const handleSectorKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSector();
    }
  };

  const toggleArray = (field: keyof VCOnboardingData, value: string) => {
    const current = (data[field] as string[]) || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onUpdate({ [field]: updated } as Partial<VCOnboardingData>);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-[hsl(var(--navy-deep))] mb-2">Fund Overview</h2>
        <p className="text-[hsl(var(--navy-deep))]/60 text-sm">
          Set up your firm details and investment focus.
        </p>
      </div>

      <div className="space-y-6">
        {/* --- Admin & Verification Section --- */}
        <div className="space-y-5 border-b border-[hsl(var(--navy-deep))]/10 pb-6">
          <h3 className="text-sm font-semibold text-[hsl(var(--navy-deep))]/70 uppercase tracking-wider">
            Firm Details
          </h3>
          
          <div className="space-y-2">
            <Label className="text-[hsl(var(--navy-deep))]/80">Company Logo (Optional)</Label>
            <div className="flex items-center gap-4">
              {(data.companyLogo || data.logoPreview) ? (
                <div className="relative group">
                  <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-cyan-glow/30">
                    <img 
                      src={data.companyLogo || data.logoPreview || ""} 
                      alt="Company logo" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      if (data.companyLogo) {
                        try {
                          setIsUploading(true);
                          await deleteFile(data.companyLogo);
                          onUpdate({ companyLogo: null, logoPreview: null });
                        } catch (error) {
                          console.error("Failed to delete logo:", error);
                        } finally {
                          setIsUploading(false);
                        }
                      } else {
                        onUpdate({ logoPreview: null });
                      }
                    }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove logo"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-lg border-2 border-dashed border-[hsl(var(--navy-deep))]/20 flex items-center justify-center bg-[hsl(var(--navy-deep))]/5">
                  <Upload className="w-8 h-8 text-[hsl(var(--navy-deep))]/40" />
                </div>
              )}
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <Label htmlFor="logo-upload" className="cursor-pointer">
                  <Button 
                    type="button" 
                    variant="outline" 
                    asChild={!isUploading}
                    disabled={isUploading}
                    className="border-[hsl(var(--navy-deep))]/20 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5"
                  >
                    <span>{isUploading ? "Processing..." : (data.companyLogo || data.logoPreview) ? "Change Logo" : "Upload Logo"}</span>
                  </Button>
                </Label>
                <p className="text-xs text-[hsl(var(--navy-deep))]/50 mt-1">PNG, JPG up to 5MB</p>
              </div>
            </div>
          </div>

          <FormField label="Firm Name" required>
            <TextInput value={data.firmName} onChange={(v) => onUpdate({ firmName: v })} placeholder="Your VC firm name" />
          </FormField>
          <FormField label="Website">
            <TextInput type="url" value={data.website} onChange={(v) => onUpdate({ website: v })} placeholder="https://yourfirm.com" />
          </FormField>
          <FormField label="Company LinkedIn">
            <TextInput type="url" value={data.companyLinkedIn} onChange={(v) => onUpdate({ companyLinkedIn: v })} placeholder="https://linkedin.com/company/yourfirm" />
          </FormField>
          <FormField label="Headquarters Location" required>
            <LocationField
              value={data.hqLocation}
              onChange={(v) => onUpdate({ hqLocation: v })}
            />
          </FormField>
          
          <div className="space-y-2">
            <Label className="text-[hsl(var(--navy-deep))]/80">Other Location Branches</Label>
            <div className="flex flex-wrap gap-2 mb-2 p-3 min-h-[50px] border rounded-md border-input bg-background ring-offset-background">
              {(data.otherLocationBranches || []).map((branch, index) => (
                <div key={index} className="flex items-center bg-cyan-glow/10 text-[hsl(var(--navy-deep))] px-3 py-1 rounded-full text-sm border border-cyan-glow/20">
                  <span>{branch}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBranch(index)}
                    className="ml-2 hover:text-red-500 transition-colors focus:outline-none"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              
              {isAddingBranch ? (
                <div className="flex items-center min-w-[120px]">
                  <Input
                    autoFocus
                    value={newBranch}
                    onChange={(e) => setNewBranch(e.target.value)}
                    onKeyDown={handleBranchKeyDown}
                    onBlur={handleAddBranch}
                    placeholder="City, State"
                    className="h-8 text-sm focus-visible:ring-0 border-none px-2 shadow-none bg-transparent"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingBranch(true)}
                  className="flex items-center gap-1 text-sm text-[hsl(var(--navy-deep))]/60 hover:text-[hsl(var(--navy-deep))] px-2 py-1 rounded-full border border-dashed border-[hsl(var(--navy-deep))]/30 hover:border-[hsl(var(--navy-deep))]/60 transition-all"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Location</span>
                </button>
              )}
            </div>
            <p className="text-xs text-[hsl(var(--navy-deep))]/50">Press Enter to add a location</p>
          </div>
          
          <SwitchField label="Public Profile" description="Make your firm profile visible to startups" checked={data.publicProfile} onChange={(v) => onUpdate({ publicProfile: v })} />
        </div>

        {/* --- Fund Overview Section --- */}
        <div className="space-y-5">
          <h3 className="text-sm font-semibold text-[hsl(var(--navy-deep))]/70 uppercase tracking-wider">
            Investment Focus
          </h3>

          <div className="space-y-2">
            <Label htmlFor="firmDescription" className="text-[hsl(var(--navy-deep))]/80">
              Firm Description *
            </Label>
            <Textarea
              id="firmDescription"
              value={data.firmDescription}
              onChange={(e) => onUpdate({ firmDescription: e.target.value })}
              placeholder="Describe your firm's mission, history, and approach..."
              className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] placeholder:text-[hsl(var(--navy-deep))]/50 min-h-[120px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="aum" className="text-[hsl(var(--navy-deep))]/80">
                AUM
              </Label>
              <Input
                id="aum"
                value={data.aum}
                onChange={(e) => onUpdate({ aum: e.target.value })}
                placeholder="e.g. $50M"
                className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] placeholder:text-[hsl(var(--navy-deep))]/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fundVintage" className="text-[hsl(var(--navy-deep))]/80">
                Year Founded
              </Label>
              <Input
                id="fundVintage"
                value={data.fundVintage}
                onChange={(e) => onUpdate({ fundVintage: e.target.value })}
                placeholder="e.g. 2024"
                className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] placeholder:text-[hsl(var(--navy-deep))]/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fundType" className="text-[hsl(var(--navy-deep))]/80">
              Fund Type *
            </Label>
            <Select
              value={data.fundType}
              onValueChange={(value) => onUpdate({ fundType: value })}
            >
              <SelectTrigger className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))]">
                <SelectValue placeholder="Select fund type" />
              </SelectTrigger>
              <SelectContent>
                {FUND_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ownershipTarget" className="text-[hsl(var(--navy-deep))]/80">
                Ownership Target
              </Label>
              <Input
                id="ownershipTarget"
                value={data.ownershipTarget}
                onChange={(e) => onUpdate({ ownershipTarget: e.target.value })}
                placeholder="e.g. 5-15%"
                className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] placeholder:text-[hsl(var(--navy-deep))]/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="leadFollow" className="text-[hsl(var(--navy-deep))]/80">
                Lead/Follow
              </Label>
              <Select
                value={data.leadFollow}
                onValueChange={(value) => onUpdate({ leadFollow: value })}
              >
                <SelectTrigger className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))]">
                  <SelectValue placeholder="Select preference" />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_FOLLOW.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[hsl(var(--navy-deep))]/80">Check Sizes *</Label>
            <div className="flex flex-wrap gap-2">
              {CHECK_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleArray("checkSizes", size)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    data.checkSizes.includes(size)
                      ? "bg-cyan-glow text-navy-deep"
                      : "bg-[hsl(var(--navy-deep))]/5 text-[hsl(var(--navy-deep))]/70 hover:bg-[hsl(var(--navy-deep))]/10 border border-[hsl(var(--navy-deep))]/10"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[hsl(var(--navy-deep))]/80">Stage Focus *</Label>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
              {STAGE_FOCUS.map((stage) => (
                <button
                  key={stage}
                  type="button"
                  onClick={() => toggleArray("stageFocus", stage)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    data.stageFocus.includes(stage)
                      ? "bg-cyan-glow text-navy-deep"
                      : "bg-[hsl(var(--navy-deep))]/5 text-[hsl(var(--navy-deep))]/70 hover:bg-[hsl(var(--navy-deep))]/10 border border-[hsl(var(--navy-deep))]/10"
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[hsl(var(--navy-deep))]/80">Sector Tags</Label>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
              {SECTOR_TAGS.filter(s => s !== "Other").map((sector) => (
                <button
                  key={sector}
                  type="button"
                  onClick={() => toggleArray("sectorTags", sector)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    data.sectorTags.includes(sector)
                      ? "bg-cyan-glow text-navy-deep"
                      : "bg-[hsl(var(--navy-deep))]/5 text-[hsl(var(--navy-deep))]/70 hover:bg-[hsl(var(--navy-deep))]/10 border border-[hsl(var(--navy-deep))]/10"
                  }`}
                >
                  {sector}
                </button>
              ))}

              {/* Custom Tags */}
              {data.sectorTags
                .filter(tag => !SECTOR_TAGS.includes(tag))
                .map((tag, index) => (
                  <div key={`custom-${index}`} className="flex items-center bg-cyan-glow text-navy-deep px-3 py-1.5 rounded-lg text-sm transition-all">
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => toggleArray("sectorTags", tag)}
                      className="ml-2 hover:text-red-600 transition-colors focus:outline-none"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

              {/* Add Custom Tag */}
              {isAddingSector ? (
                <div className="flex items-center min-w-[120px]">
                  <Input
                    autoFocus
                    value={newSector}
                    onChange={(e) => setNewSector(e.target.value)}
                    onKeyDown={handleSectorKeyDown}
                    onBlur={handleAddSector}
                    placeholder="Custom sector..."
                    className="h-9 text-sm focus-visible:ring-0 px-2 shadow-none bg-white border border-[hsl(var(--navy-deep))]/20 rounded-lg w-32"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingSector(true)}
                  className="flex items-center gap-1 text-sm text-[hsl(var(--navy-deep))]/60 hover:text-[hsl(var(--navy-deep))] px-3 py-1.5 rounded-lg border border-dashed border-[hsl(var(--navy-deep))]/30 hover:border-[hsl(var(--navy-deep))]/60 transition-all"
                >
                  <Plus className="w-3 h-3" />
                  <span>Other</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="portfolioCount" className="text-[hsl(var(--navy-deep))]/80">
                Portfolio Count
              </Label>
              <Input
                id="portfolioCount"
                value={data.portfolioCount}
                onChange={(e) => onUpdate({ portfolioCount: e.target.value })}
                placeholder="e.g. 50"
                className="bg-white border border-[hsl(var(--navy-deep))]/10 text-[hsl(var(--navy-deep))] placeholder:text-[hsl(var(--navy-deep))]/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[hsl(var(--navy-deep))]/80">Top Investments</Label>
            <div className="space-y-3">
              {/* List of current investments */}
              {(data.topInvestments || []).map((investment, index) => {
                const { name, website } = investment;

                return (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 bg-[hsl(var(--navy-deep))]/5 p-3 rounded-lg border border-[hsl(var(--navy-deep))]/10">
                    <div className="flex-1">
                      <div className="font-medium text-sm text-[hsl(var(--navy-deep))]">{name}</div>
                      {website && (
                        <a href={website.startsWith('http') ? website : `https://${website}`} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-600 hover:underline break-all">
                          {website}
                        </a>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveInvestment(index)}
                      className="self-end sm:self-center text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}

              {/* Add new investment form */}
              {isAddingInvestment ? (
                <div className="bg-white p-4 rounded-lg border border-[hsl(var(--navy-deep))]/20 space-y-3 shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="invName" className="text-xs text-[hsl(var(--navy-deep))]/70">Company Name</Label>
                      <Input
                        id="invName"
                        value={newInvName}
                        onChange={(e) => setNewInvName(e.target.value)}
                        placeholder="e.g. Acme Corp"
                        className="h-9 text-sm"
                        autoFocus
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="invWebsite" className="text-xs text-[hsl(var(--navy-deep))]/70">Website</Label>
                      <Input
                        id="invWebsite"
                        value={newInvWebsite}
                        onChange={(e) => setNewInvWebsite(e.target.value)}
                        placeholder="e.g. acme.com"
                        className="h-9 text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddInvestment();
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsAddingInvestment(false)}
                      className="text-[hsl(var(--navy-deep))]/60 hover:text-[hsl(var(--navy-deep))]"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAddInvestment}
                      disabled={!newInvName.trim()}
                      className="bg-cyan-glow text-navy-deep hover:bg-cyan-bright"
                    >
                      Add Investment
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setNewInvName("");
                    setNewInvWebsite("");
                    setIsAddingInvestment(true);
                  }}
                  className="w-full border-dashed border-[hsl(var(--navy-deep))]/30 text-[hsl(var(--navy-deep))]/70 hover:text-[hsl(var(--navy-deep))] hover:border-[hsl(var(--navy-deep))]/60 hover:bg-[hsl(var(--navy-deep))]/5"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Portfolio Company
                </Button>
              )}
            </div>
            <p className="text-xs text-[hsl(var(--navy-deep))]/50">Add your most notable investments.</p>
          </div>
        </div>
      </div>

      <StepNavigation onBack={onBack} onNext={onNext} isFirstStep={false} isLastStep={false} />
    </div>
  );
};
