import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Target, User, Loader2, Camera, X } from "lucide-react";

interface AnalystProfile {
  id: string;
  user_id: string;
  firm_id: string | null;
  name: string;
  title: string;
  firm_name: string;
  email: string;
  location: string | null;
  vertical: string | null;
  one_liner: string | null;
  profile_completed: boolean;
  profile_picture_url?: string | null;
}

interface AnalystProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: AnalystProfile | null;
  onProfileUpdate: (profile: AnalystProfile) => void;
  isMandatory?: boolean;
}

export function AnalystProfileModal({
  open,
  onOpenChange,
  profile,
  onProfileUpdate,
  isMandatory = false,
}: AnalystProfileModalProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [location, setLocation] = useState(profile?.location || "");
  const [vertical, setVertical] = useState(profile?.vertical || "");
  const [oneLiner, setOneLiner] = useState(profile?.one_liner || "");
  const [profilePictureUrl, setProfilePictureUrl] = useState(profile?.profile_picture_url || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (profile) {
      setLocation(profile.location || "");
      setVertical(profile.vertical || "");
      setOneLiner(profile.one_liner || "");
      setProfilePictureUrl(profile.profile_picture_url || "");
    }
  }, [profile]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (PNG, JPG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.user_id}/${Date.now()}.${fileExt}`;

      // Delete old avatar if exists
      if (profilePictureUrl) {
        const oldPath = profilePictureUrl.split('/analyst-avatars/')[1];
        if (oldPath) {
          await supabase.storage.from('analyst-avatars').remove([oldPath]);
        }
      }

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('analyst-avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('analyst-avatars')
        .getPublicUrl(fileName);

      setProfilePictureUrl(publicUrl);
      toast({
        title: "Photo uploaded!",
        description: "Your profile picture has been updated.",
      });
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePhoto = async () => {
    if (!profile || !profilePictureUrl) return;

    setIsUploading(true);
    try {
      const oldPath = profilePictureUrl.split('/analyst-avatars/')[1];
      if (oldPath) {
        await supabase.storage.from('analyst-avatars').remove([oldPath]);
      }
      setProfilePictureUrl("");
      toast({
        title: "Photo removed",
        description: "Your profile picture has been removed.",
      });
    } catch (error) {
      console.error("Error removing photo:", error);
      toast({
        title: "Error",
        description: "Failed to remove profile picture.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    if (!location.trim() || !vertical.trim() || !oneLiner.trim()) {
      toast({
        title: "All fields required",
        description: "Please fill in your location, vertical, and one-liner.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("analyst_profiles")
        .update({
          location: location.trim(),
          vertical: vertical.trim(),
          one_liner: oneLiner.trim(),
          profile_picture_url: profilePictureUrl || null,
          profile_completed: true,
        })
        .eq("id", profile.id);

      if (error) throw error;

      const updatedProfile: AnalystProfile = {
        ...profile,
        location: location.trim(),
        vertical: vertical.trim(),
        one_liner: oneLiner.trim(),
        profile_picture_url: profilePictureUrl || null,
        profile_completed: true,
      };

      onProfileUpdate(updatedProfile);
      toast({
        title: "Profile updated!",
        description: "Your analyst profile has been saved.",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={isMandatory ? undefined : onOpenChange}>
      <DialogContent className="max-w-md bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[hsl(var(--navy-deep))]">
            {isMandatory ? "Complete Your Profile" : "Edit My Profile"}
          </DialogTitle>
          <DialogDescription>
            {isMandatory
              ? "Please complete your profile to continue. This helps founders understand your sourcing focus."
              : "Update your analyst profile details."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <Avatar className="h-24 w-24 border-2 border-[hsl(var(--cyan-glow))]/30">
                {profilePictureUrl ? (
                  <AvatarImage src={profilePictureUrl} alt={profile?.name || "Profile"} />
                ) : null}
                <AvatarFallback className="bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--navy-deep))] text-xl">
                  {profile?.name ? getInitials(profile.name) : "?"}
                </AvatarFallback>
              </Avatar>
              {profilePictureUrl && (
                <button
                  onClick={handleRemovePhoto}
                  disabled={isUploading}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="text-xs"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  Uploading...
                </>
              ) : (
                <>
                  <Camera className="h-3 w-3 mr-1" />
                  {profilePictureUrl ? "Change Photo" : "Upload Photo"}
                </>
              )}
            </Button>
          </div>

          {/* Read-only fields */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground">Name</p>
              <p className="font-medium text-[hsl(var(--navy-deep))]">{profile?.name || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Title</p>
              <p className="font-medium text-[hsl(var(--navy-deep))]">{profile?.title || "—"}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-muted-foreground">Firm</p>
              <p className="font-medium text-[hsl(var(--navy-deep))]">{profile?.firm_name || "—"}</p>
            </div>
          </div>

          {/* Editable fields */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2 text-[hsl(var(--navy-deep))]">
              <MapPin className="h-4 w-4" />
              Location you're sourcing at
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Boston, MA"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vertical" className="flex items-center gap-2 text-[hsl(var(--navy-deep))]">
              <Target className="h-4 w-4" />
              Vertical you're sourcing in
            </Label>
            <Input
              id="vertical"
              value={vertical}
              onChange={(e) => setVertical(e.target.value)}
              placeholder="e.g. AI/ML, FinTech, HealthTech"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="oneLiner" className="flex items-center gap-2 text-[hsl(var(--navy-deep))]">
              <User className="h-4 w-4" />
              One-liner about yourself
            </Label>
            <Textarea
              id="oneLiner"
              value={oneLiner}
              onChange={(e) => setOneLiner(e.target.value)}
              placeholder="e.g. Former founder, now helping the next generation scale."
              rows={2}
              required
            />
            <p className="text-xs text-muted-foreground">
              A brief description that helps founders understand who you are.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          {!isMandatory && (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          )}
          <Button
            onClick={handleSave}
            disabled={isSaving || isUploading}
            className="bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--cyan-bright))]"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              "Save Profile"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
