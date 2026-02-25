import { useState, useEffect, useRef } from "react";
import { uploadFile, deleteFile } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VCOnboardingData } from "../../hooks/vcMemoTypes";
import { StepNavigation } from "@/components/onboarding";
import { Upload, X, Plus } from "lucide-react";
import { auth } from "@/lib/firebase";

interface PersonalProfileStepProps {
  data: VCOnboardingData;
  onUpdate: (data: Partial<VCOnboardingData>) => void;
  onNext: () => void;
}

export const PersonalProfileStep = ({
  data,
  onUpdate,
  onNext,
}: PersonalProfileStepProps) => {
  const [newSector, setNewSector] = useState("");
  const [isAddingSector, setIsAddingSector] = useState(false);
  const onUpdateRef = useRef(onUpdate);
  const FIREBASE_API = import.meta.env.VITE_FIREBASE_API || "";


  // Keep onUpdateRef current
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    if (!FIREBASE_API) return;
    const fetchUserPrefillData = async () => {
      console.log("Fetching user prefill data")
      try {
        const user = auth.currentUser;
        if (!user) return;
        const token = await user.getIdToken();
        const res = await fetch(`${FIREBASE_API}/users/vc-users/${user.uid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          console.log("User prefill data", data)
        }
      } catch (error) {
        console.error("Error fetching firms:", error);
      } finally {
      }
    };
    fetchUserPrefillData();
  }, []);

  const [isUploading, setIsUploading] = useState(false);

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Uploading image")
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file.");
        return;
      }

      try {
        setIsUploading(true);
        
        // If there is an existing image, delete it first
        if (data.profileImage) {
            try {
                await deleteFile(data.profileImage);
            } catch (error) {
                console.error("Failed to delete old image:", error);
                // Continue with upload even if delete fails
            }
        }

        // Show preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
          onUpdate({ profileImagePreview: reader.result as string });
        };
        reader.readAsDataURL(file);

        const publicUrl = await uploadFile(file, "profile_pic");
        console.log("Uploaded image", publicUrl)
        onUpdate({ profileImage: publicUrl });
      } catch (error) {
        console.error("Failed to upload image:", error);
        alert("Failed to upload image. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleAddSector = () => {
    if (newSector.trim()) {
      const updatedSectors = [...data.investingSectors, newSector.trim()];
      onUpdate({ investingSectors: updatedSectors });
      setNewSector("");
      setIsAddingSector(false);
    }
  };

  const handleRemoveSector = (index: number) => {
    const updatedSectors = data.investingSectors.filter((_, i) => i !== index);
    onUpdate({ investingSectors: updatedSectors });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSector();
    }
  };

  // Render log using warn to ensure visibility
  console.warn("PersonalProfileStep: RENDERED at", new Date().toISOString());

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[hsl(var(--navy-deep))] mb-2">Personal Profile</h2>
        <p className="text-[hsl(var(--navy-deep))]/60 text-sm">Tell us about yourself.</p>
      </div>

      <div className="space-y-5">
        {/* Profile Picture Upload */}
        <div className="space-y-2">
          <Label className="text-[hsl(var(--navy-deep))]/80">Profile Picture</Label>
          <div className="flex items-center gap-4">
            {(data.profileImage || data.profileImagePreview) ? (
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-cyan-glow/30">
                  <img 
                    src={data.profileImage || data.profileImagePreview || ""} 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    if (data.profileImage) {
                      try {
                        setIsUploading(true);
                        await deleteFile(data.profileImage);
                        onUpdate({ profileImage: null, profileImagePreview: null });
                      } catch (error) {
                        console.error("Failed to delete image:", error);
                        // Optionally clear state anyway if we want to force reset
                        // onUpdate({ profileImage: null, profileImagePreview: null }); 
                      } finally {
                        setIsUploading(false);
                      }
                    } else {
                      // Just a preview, clear it
                      onUpdate({ profileImagePreview: null });
                    }
                  }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-[hsl(var(--navy-deep))]/20 flex items-center justify-center bg-[hsl(var(--navy-deep))]/5">
                <Upload className="w-8 h-8 text-[hsl(var(--navy-deep))]/40" />
              </div>
            )}
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleProfileImageUpload}
                className="hidden"
                id="profile-upload"
              />
              <Label htmlFor="profile-upload" className="cursor-pointer">
                <Button 
                  type="button" 
                  variant="outline" 
                  asChild={!isUploading} 
                  disabled={isUploading}
                  // Removed explicit onClick to prevent double triggering with Label
                  className="border-[hsl(var(--navy-deep))]/20 text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/5"
                >
                  {isUploading ? <span>Processing...</span> : <span>{(data.profileImage || data.profileImagePreview) ? "Change Photo" : "Upload Photo"}</span>}
                </Button>
              </Label>
              <p className="text-xs text-[hsl(var(--navy-deep))]/50 mt-1">PNG, JPG up to 5MB</p>
            </div>
          </div>
        </div>

        {/* Read-only Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[hsl(var(--navy-deep))]/80">Full Name</Label>
            <Input value={data.fullName} disabled className="bg-gray-50 text-[hsl(var(--navy-deep))]/60 cursor-not-allowed" />
          </div>
          <div className="space-y-2">
            <Label className="text-[hsl(var(--navy-deep))]/80">Email</Label>
            <Input value={data.email} disabled className="bg-gray-50 text-[hsl(var(--navy-deep))]/60 cursor-not-allowed" />
          </div>
          <div className="space-y-2">
            <Label className="text-[hsl(var(--navy-deep))]/80">LinkedIn</Label>
            <Input value={data.linkedIn} disabled className="bg-gray-50 text-[hsl(var(--navy-deep))]/60 cursor-not-allowed" />
          </div>
          <div className="space-y-2">
            <Label className="text-[hsl(var(--navy-deep))]/80">Title</Label>
            <Input value={data.title} disabled className="bg-gray-50 text-[hsl(var(--navy-deep))]/60 cursor-not-allowed" />
          </div>
        </div>

        {/* Investing Sectors */}
        <div className="space-y-2">
          <Label className="text-[hsl(var(--navy-deep))]/80">What sectors do you personally invest in?</Label>
          <div className="flex flex-wrap gap-2 mb-2 p-3 min-h-[50px] border rounded-md border-input bg-background ring-offset-background">
            {data.investingSectors.map((sector, index) => (
              <div key={index} className="flex items-center bg-cyan-glow/10 text-[hsl(var(--navy-deep))] px-3 py-1 rounded-full text-sm border border-cyan-glow/20">
                <span>{sector}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSector(index)}
                  className="ml-2 hover:text-red-500 transition-colors focus:outline-none"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            
            {isAddingSector ? (
              <div className="flex items-center min-w-[120px]">
                <Input
                  autoFocus
                  value={newSector}
                  onChange={(e) => setNewSector(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleAddSector} // Save on blur as well
                  placeholder="Type sector..."
                  className="h-8 text-sm focus-visible:ring-0 border-none px-2 shadow-none bg-transparent"
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingSector(true)}
                className="flex items-center gap-1 text-sm text-[hsl(var(--navy-deep))]/60 hover:text-[hsl(var(--navy-deep))] px-2 py-1 rounded-full border border-dashed border-[hsl(var(--navy-deep))]/30 hover:border-[hsl(var(--navy-deep))]/60 transition-all"
              >
                <Plus className="w-3 h-3" />
                <span>Add Sector</span>
              </button>
            )}
          </div>
          <p className="text-xs text-[hsl(var(--navy-deep))]/50">Press Enter to add a sector</p>
        </div>

        {/* Fun Fact */}
        <div className="space-y-2">
          <Label className="text-[hsl(var(--navy-deep))]/80">Fun Fact (max 50 words)</Label>
          <Textarea
            value={data.funFact}
            onChange={(e) => {
              const words = e.target.value.trim().split(/\s+/);
              if (words.length <= 50 || e.target.value.length < data.funFact.length) {
                onUpdate({ funFact: e.target.value });
              }
            }}
            placeholder="Share something interesting about yourself..."
            className="min-h-[100px] resize-none"
          />
          <div className="flex justify-end">
            <span className={`text-xs ${data.funFact.trim().split(/\s+/)[0] === "" ? 0 : data.funFact.trim().split(/\s+/).length > 50 ? "text-red-500" : "text-[hsl(var(--navy-deep))]/50"}`}>
              {data.funFact.trim() ? data.funFact.trim().split(/\s+/).length : 0}/50 words
            </span>
          </div>
        </div>
      </div>

      <StepNavigation onBack={() => {}} onNext={onNext} isFirstStep={true} isLastStep={false} />
    </div>
  );
};
