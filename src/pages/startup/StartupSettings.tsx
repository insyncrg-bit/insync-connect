import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
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
import { Loader2, User, ShieldCheck, Trash2, Linkedin, Camera, X } from "lucide-react";
import { useRef } from "react";

interface StartupSettingsProps {
  onUpdate?: () => void;
}

export const StartupSettings = ({ onUpdate }: StartupSettingsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loadingUser, setLoadingUser] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [onlyAdminDialogOpen, setOnlyAdminDialogOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [funFact, setFunFact] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [education, setEducation] = useState<{ degree: string; university: string }>({ degree: "", university: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
            setFunFact(data.user.funFact || "");
            setProfileImage(data.user.profileImage || null);
            setEducation(data.user.education || { degree: "", university: "" });
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

    // Validation
    if (!displayName.trim()) {
      toast({ title: "Name required", description: "Please enter your full name.", variant: "destructive" });
      return;
    }
    if (!title.trim()) {
      toast({ title: "Title required", description: "Please enter your professional title (e.g. Founder & CEO).", variant: "destructive" });
      return;
    }

    // LinkedIn URL validation
    if (linkedinUrl.trim()) {
      const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[\w-]+\/?$/;
      if (!linkedinRegex.test(linkedinUrl.trim())) {
        toast({ 
          title: "Invalid LinkedIn URL", 
          description: "Please enter a valid LinkedIn profile URL (e.g., https://www.linkedin.com/in/username).", 
          variant: "destructive" 
        });
        return;
      }
    }

    // Check for profile completion
    const isProfileComplete = !!(
      linkedinUrl.trim() && 
      education.degree && 
      education.university.trim() && 
      funFact.trim()
    );

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
          funFact: funFact.trim(),
          profileImage: profileImage,
          education: education,
          profileComplete: isProfileComplete,
        }),
      });

      if (!res.ok) throw new Error("Failed to update profile in database");

      await updateProfile(user, { displayName: displayName.trim() || undefined });
      toast({
        title: "Profile updated",
        description: isProfileComplete 
          ? "Your profile is now complete!" 
          : "Your information has been saved.",
      });
      
      // Navigate or refresh to update dashboard banner if needed
      if (onUpdate) onUpdate();
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
      const token = await user.getIdToken();
      const FIREBASE_API = import.meta.env.VITE_FIREBASE_API || "";
      
      const res = await fetch(`${FIREBASE_API}/api/users/me`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (errorData.code === "ONLY_ADMIN") {
          // Close the first dialog, open the cascade-warning dialog
          setDeleteDialogOpen(false);
          setOnlyAdminDialogOpen(true);
          return;
        }
        throw new Error(errorData.error || "Failed to delete account");
      }

      sessionManager.clear();
      toast({
        title: "Account deleted",
        description: "Your account and all associated data have been permanently deleted.",
      });
      navigate("/landing");
    } catch (error: any) {
      console.error("Error deleting account:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleForceDeleteAccount = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    setIsDeleting(true);
    try {
      const token = await user.getIdToken();
      const FIREBASE_API = import.meta.env.VITE_FIREBASE_API || "";
      
      const res = await fetch(`${FIREBASE_API}/api/users/me?force=true`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete account");
      }

      sessionManager.clear();
      toast({
        title: "Account deleted",
        description: "Your account, organization, and all associated data have been permanently deleted.",
      });
      navigate("/landing");
    } catch (error: any) {
      console.error("Error deleting account:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setOnlyAdminDialogOpen(false);
    }
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file.",
          variant: "destructive",
        });
        return;
      }

      try {
        setIsUploading(true);
        if (profileImage) {
          try {
            const { deleteFile } = await import("@/lib/api");
            await deleteFile(profileImage);
          } catch (error) {
            console.error("Failed to delete old image:", error);
          }
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        const { uploadFile } = await import("@/lib/api");
        const publicUrl = await uploadFile(file, "profile_pic");
        setProfileImage(publicUrl);
        setProfileImagePreview(null);
        
        toast({
          title: "Photo uploaded",
          description: "Your profile picture has been updated.",
        });
      } catch (error) {
        console.error("Failed to upload image:", error);
        toast({
          title: "Upload failed",
          description: "Failed to upload profile picture. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleRemovePhoto = async () => {
    if (!profileImage) return;
    setIsUploading(true);
    try {
      const { deleteFile } = await import("@/lib/api");
      await deleteFile(profileImage);
      setProfileImage(null);
      setProfileImagePreview(null);
      toast({
        title: "Photo removed",
        description: "Your profile picture has been removed.",
      });
    } catch (error) {
      console.error("Failed to remove photo:", error);
      toast({
        title: "Error",
        description: "Failed to remove profile picture.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
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

      <Card className="bg-navy-card border-white/10 p-6 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-full bg-[hsl(var(--cyan-glow))]/20 flex items-center justify-center">
            <User className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Profile</h2>
            <p className="text-sm text-white/60">Update your name and personal details.</p>
          </div>
        </div>

        <Separator className="bg-white/10" />

        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center py-2">
            <div className="relative group">
              <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-[hsl(var(--cyan-glow))]/30 flex items-center justify-center bg-[hsl(var(--cyan-glow))]/10">
                {(profileImagePreview || profileImage) ? (
                  <img src={profileImagePreview || profileImage || ""} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[hsl(var(--cyan-glow))] text-xl font-bold">
                    {getInitials(displayName || "U")}
                  </span>
                )}
              </div>
              {(profileImage || profileImagePreview) && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <div className="space-y-2 flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                  className="hidden"
                  id="profile-pic-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="bg-white/5 border-white/15 text-white hover:bg-white/10 h-8"
                >
                  {isUploading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
                  ) : (
                    <Camera className="h-3.5 w-3.5 mr-2" />
                  )}
                  {profileImage ? "Change photo" : "Upload photo"}
                </Button>
              </div>
              <p className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">JPG or PNG. Max size 5MB.</p>
            </div>
          </div>

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/80">Highest Level of Education</Label>
                <select
                  value={education.degree}
                  onChange={(e) => setEducation({ ...education, degree: e.target.value })}
                  className="w-full bg-white/5 border border-white/15 text-white rounded-md h-10 px-3 outline-none focus:ring-1 focus:ring-[hsl(var(--cyan-glow))]"
                >
                  <option value="" className="bg-navy-deep">Select degree</option>
                  <option value="BA" className="bg-navy-deep">Bachelor of Arts (BA)</option>
                  <option value="BS" className="bg-navy-deep">Bachelor of Science (BS)</option>
                  <option value="MA" className="bg-navy-deep">Master of Arts (MA)</option>
                  <option value="MS" className="bg-navy-deep">Master of Science (MS)</option>
                  <option value="MBA" className="bg-navy-deep">Master of Business Administration (MBA)</option>
                  <option value="PhD" className="bg-navy-deep">Doctor of Philosophy (PhD)</option>
                  <option value="Other" className="bg-navy-deep">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">University</Label>
                <Input
                  value={education.university}
                  onChange={(e) => setEducation({ ...education, university: e.target.value })}
                  placeholder="e.g. Stanford University"
                  className="bg-white/5 border-white/15 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white/80">Fun Fact</Label>
              <Input
                value={funFact}
                onChange={(e) => setFunFact(e.target.value)}
                placeholder="e.g. I’ve climbed Mt. Kilimanjaro"
                className="bg-white/5 border-white/15 text-white"
              />
              <p className="text-xs text-white/40">This helps investors get to know you better!</p>
            </div>
          </div>
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

      {/* Second dialog: only-admin cascade warning */}
      <AlertDialog open={onlyAdminDialogOpen} onOpenChange={setOnlyAdminDialogOpen}>
        <AlertDialogContent className="bg-[#151a24] border-red-500/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-400">⚠️ You are the only admin</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70 space-y-2">
              <p>
                Since you are the only administrator of this startup, deleting your account will also <strong className="text-white">permanently delete the entire organization</strong>, including:
              </p>
              <ul className="list-disc list-inside text-white/60 space-y-1 ml-2">
                <li>The startup profile and all company data</li>
                <li>The startup memo</li>
                <li>All uploaded assets (logo, pitch deck, etc.)</li>
                <li>Your personal profile and account</li>
              </ul>
              <p className="text-red-400/80 font-medium pt-1">
                This action is irreversible. Are you absolutely sure?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/20 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleForceDeleteAccount}
              disabled={isDeleting}
              className="bg-red-700 hover:bg-red-800 text-white"
            >
              {isDeleting ? "Deleting everything..." : "Delete Account & Organization"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StartupSettings;

