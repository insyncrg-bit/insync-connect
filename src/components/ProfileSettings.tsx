import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// TODO: Integrate with backend API
import { useToast } from "@/hooks/use-toast";
import { Video, ExternalLink, Save, Loader2 } from "lucide-react";

interface ProfileSettingsProps {
  userType: "founder" | "investor";
  userId: string | null;
}

export function ProfileSettings({ userType, userId }: ProfileSettingsProps) {
  const [calendlyLink, setCalendlyLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId, userType]);

  const fetchProfile = async () => {
    if (!userId) return;
    setLoading(true);
    
    try {
      // TODO: Integrate with backend API to fetch profile
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Placeholder data
      setCalendlyLink("");
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!userId) {
      toast({
        title: "Not logged in",
        description: "Please log in to save your settings",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      // TODO: Integrate with backend API to save settings
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast({
        title: "Settings saved",
        description: "Your profile has been updated",
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--cyan-glow))]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Profile Settings</h2>
        <p className="text-white/60">Manage your account and scheduling preferences</p>
      </div>

      <Card className="bg-navy-card border-white/10 p-6 space-y-6">
        {/* Scheduling Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Video className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
            <h3 className="text-lg font-semibold text-white">Meeting Scheduling</h3>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="calendly" className="text-white/80">
              Calendly / Cal.com Link
            </Label>
            <Input
              id="calendly"
              type="url"
              placeholder="https://calendly.com/your-username"
              value={calendlyLink}
              onChange={(e) => setCalendlyLink(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
            <p className="text-xs text-white/50">
              Add your scheduling link so synced {userType === "founder" ? "investors" : "founders"} can book meetings with you directly.
            </p>
          </div>

          {calendlyLink && (
            <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <Video className="h-4 w-4 text-green-400" />
              <span className="text-sm text-green-400">Scheduling link active</span>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto text-green-400 hover:text-green-300"
                onClick={() => window.open(calendlyLink, '_blank')}
              >
                Preview <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-white/10">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--cyan-bright))]"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </Card>

      {!userId && (
        <Card className="bg-amber-500/10 border-amber-500/20 p-4">
          <p className="text-amber-400 text-sm">
            You're viewing in preview mode. Log in to save your settings.
          </p>
        </Card>
      )}
    </div>
  );
}
