import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential, deleteUser } from "firebase/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { sessionManager } from "@/lib/session";
import { Loader2, User, ShieldCheck, Trash2, Linkedin } from "lucide-react";

export const StartupSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loadingUser, setLoadingUser] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        setLoadingUser(false);
        return;
      }

      setEmail(user.email || "");

      try {
        const token = await user.getIdToken();
        const FIREBASE_API = import.meta.env.VITE_FIREBASE_API || "";
        const res = await fetch(`${FIREBASE_API}/api/users/founder-users/${user.uid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setDisplayName(data.user.fullName || user.displayName || "");
            setTitle(data.user.title || "");
            setLinkedinUrl(data.user.linkedinUrl || "");
          }
        } else {
          setDisplayName(user.displayName || "");
        }
      } catch (error) {
        console.error("Error fetching founder profile:", error);
        setDisplayName(user.displayName || "");
      } finally {
        setLoadingUser(false);
      }
    };

    fetchData();
  }, []);

  const handleSaveProfile = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      toast({
        title: "Not signed in",
        description: "Please sign in again to edit your profile.",
        variant: "destructive",
      });
      return;
    }

    setSavingProfile(true);
    try {
      const token = await user.getIdToken();
      const FIREBASE_API = import.meta.env.VITE_FIREBASE_API || "";
      const res = await fetch(`${FIREBASE_API}/api/users/founder-users/${user.uid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: displayName.trim(),
          title: title.trim(),
          linkedinUrl: linkedinUrl.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to update profile in database");

      await updateProfile(user, { displayName: displayName.trim() || undefined });
      toast({
        title: "Profile updated",
        description: "Your information has been saved.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to update profile",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user || !email) {
      toast({
        title: "Not signed in",
        description: "Please sign in again to change your password.",
        variant: "destructive",
      });
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Missing fields",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "New password and confirmation must match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    setSavingPassword(true);
    try {
      const cred = EmailAuthProvider.credential(email, currentPassword);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
    } catch (error: any) {
      let message = error?.message || "Failed to change password. Please try again.";
      if (error?.code === "auth/wrong-password") {
        message = "Current password is incorrect.";
      } else if (error?.code === "auth/weak-password") {
        message = "New password is too weak. Please choose a stronger password.";
      } else if (error?.code === "auth/requires-recent-login") {
        message = "For security, please sign in again and then change your password.";
      }
      toast({
        title: "Password change failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    setIsDeleting(true);
    try {
      await deleteUser(user);
      sessionManager.clear();
      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted.",
      });
      navigate("/landing");
    } catch (error: any) {
      console.error("Error deleting account:", error);
      if (error?.code === "auth/requires-recent-login") {
        toast({
          title: "Re-authentication required",
          description: "Please sign in again before deleting your account.",
          variant: "destructive",
        });
        navigate("/login");
      } else {
        toast({
          title: "Error",
          description: error?.message || "Failed to delete account. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[hsl(var(--cyan-glow))]" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Account Settings</h1>
        <p className="text-white/60">
          Manage your profile information and sign-in details. This does not change your investor-facing memo.
        </p>
      </div>

      <Card className="bg-navy-card border-white/10 p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-full bg-[hsl(var(--cyan-glow))]/20 flex items-center justify-center">
            <User className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Profile</h2>
            <p className="text-sm text-white/60">Update your name and view your login email.</p>
          </div>
        </div>

        <Separator className="bg-white/10" />

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/80">Name</Label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  className="bg-white/5 border-white/15 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Email</Label>
                <Input value={email} disabled className="bg-white/5 border-white/15 text-white/50 cursor-not-allowed" />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Founder / CEO"
                  className="bg-white/5 border-white/15 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">LinkedIn URL</Label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <Input
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="bg-white/5 border-white/15 text-white pl-10"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-white/40">
              Email changes are not yet supported in-app. Contact support if you need to update your login email.
            </p>
          </div>

        <div className="flex justify-end pt-2">
          <Button
            onClick={handleSaveProfile}
            disabled={savingProfile}
            className="bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--cyan-glow))]/90"
          >
            {savingProfile ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Profile"
            )}
          </Button>
        </div>
      </Card>

      <Card className="bg-navy-card border-white/10 p-6 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-full bg-emerald-500/15 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Change Password</h2>
            <p className="text-sm text-white/60">Update the password you use to sign in.</p>
          </div>
        </div>

        <Separator className="bg-white/10" />

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white/80">Current password</Label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="bg-white/5 border-white/15 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white/80">New password</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-white/5 border-white/15 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white/80">Confirm new password</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-white/5 border-white/15 text-white"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            onClick={handleChangePassword}
            disabled={savingPassword}
            className="bg-emerald-500 text-[hsl(var(--navy-deep))] hover:bg-emerald-400"
          >
            {savingPassword ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </div>
      </Card>

      <Card className="bg-navy-card border-white/10 p-6 space-y-4 border-red-500/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-full bg-red-500/15 flex items-center justify-center">
            <Trash2 className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Delete Account</h2>
            <p className="text-sm text-white/60">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
          </div>
        </div>

        <Separator className="bg-white/10" />

        <div className="flex justify-end pt-2">
          <Button
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Account
          </Button>
        </div>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#151a24] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Account</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/20 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StartupSettings;

