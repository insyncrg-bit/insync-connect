import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Target, User, Loader2 } from "lucide-react";

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
  const [location, setLocation] = useState(profile?.location || "");
  const [vertical, setVertical] = useState(profile?.vertical || "");
  const [oneLiner, setOneLiner] = useState(profile?.one_liner || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setLocation(profile.location || "");
      setVertical(profile.vertical || "");
      setOneLiner(profile.one_liner || "");
    }
  }, [profile]);

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
          profile_completed: true,
        })
        .eq("id", profile.id);

      if (error) throw error;

      const updatedProfile: AnalystProfile = {
        ...profile,
        location: location.trim(),
        vertical: vertical.trim(),
        one_liner: oneLiner.trim(),
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

  return (
    <Dialog open={open} onOpenChange={isMandatory ? undefined : onOpenChange}>
      <DialogContent className="max-w-md bg-white">
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
            disabled={isSaving}
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
