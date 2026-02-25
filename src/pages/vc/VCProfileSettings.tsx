import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential, deleteUser } from "firebase/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Loader2, User, ShieldCheck, Trash2, Camera, X, Linkedin, Plus } from "lucide-react";
import { uploadFile, deleteFile } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface VCProfileSettingsProps {
  userData: any;
  onUpdate: () => void;
}

export const VCProfileSettings = ({ userData, onUpdate }: VCProfileSettingsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loadingUser, setLoadingUser] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [funFact, setFunFact] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [investingSectors, setInvestingSectors] = useState<string[]>([]);
  const [isAddingSector, setIsAddingSector] = useState(false);
  const [newSector, setNewSector] = useState("");
  
  const [savingProfile, setSavingProfile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const FIREBASE_API = import.meta.env.VITE_FIREBASE_API || "";

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user || !userData) {
      setLoadingUser(false);
      return;
    }

    setFullName(userData.fullName || user.displayName || "");
    setEmail(userData.email || user.email || "");
    setTitle(userData.title || "");
    setLinkedinUrl(userData.linkedinUrl || "");
    setFunFact(userData.funFact || "");
    setProfileImage(userData.profileImage || null);
    setInvestingSectors(userData.investingSectors || []);
    setLoadingUser(false);
  }, [userData]);

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
        
        // If there is an existing image, delete it first
        if (profileImage) {
            try {
                await deleteFile(profileImage);
            } catch (error) {
                console.error("Failed to delete old image:", error);
            }
        }

        // Show preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

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

  const handleRemoveSector = (index: number) => {
    setInvestingSectors(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddSector = () => {
    const trimmed = newSector.trim();
    if (trimmed && !investingSectors.includes(trimmed)) {
      setInvestingSectors([...investingSectors, trimmed]);
    }
    setNewSector("");
    setIsAddingSector(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSector();
    } else if (e.key === 'Escape') {
      setIsAddingSector(false);
      setNewSector("");
    }
  };

  const handleSaveProfile = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    setSavingProfile(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`${FIREBASE_API}/api/users/vc-users/${user.uid}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          title: title.trim(),
          linkedinUrl: linkedinUrl.trim(),
          funFact: funFact.trim(),
          profileImage: profileImage,
          investingSectors: investingSectors,
        }),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      // Also update Firebase profile if name changed
      if (fullName.trim() !== user.displayName) {
        await updateProfile(user, { displayName: fullName.trim() });
      }

      toast({
        title: "Profile updated",
        description: "Your information has been saved.",
      });
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Update failed",
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
    if (!user || !email) return;

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
      toast({
        title: "Password change failed",
        description: error?.message || "Please try again.",
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
          description: error?.message || "Failed to delete account.",
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Account Settings</h1>
        <p className="text-white/60">
          Manage your profile information and sign-in details.
        </p>
      </div>

      <Card className="bg-navy-card border-white/10 p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[hsl(var(--cyan-glow))]/20 flex items-center justify-center">
            <User className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Profile</h2>
            <p className="text-sm text-white/60">Update your personal information.</p>
          </div>
        </div>

        <Separator className="bg-white/10" />

        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-2 border-[hsl(var(--cyan-glow))]/30">
                <AvatarImage src={profileImagePreview || profileImage || ""} className="object-cover" />
                <AvatarFallback className="bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))] text-xl">
                  {getInitials(fullName || "VC")}
                </AvatarFallback>
              </Avatar>
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
            <div className="space-y-3 flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="flex items-center gap-2">
                <Input
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
                  className="bg-white/5 border-white/15 text-white hover:bg-white/10"
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Camera className="h-4 w-4 mr-2" />
                  )}
                  {profileImage ? "Change photo" : "Upload photo"}
                </Button>
              </div>
              <p className="text-xs text-white/40">JPG or PNG. Max size 5MB.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white/80">Full Name</Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
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

          {/* Investing Sectors */}
          <div className="space-y-3">
            <Label className="text-white/80">Sectors you personally invest in</Label>
            <div className="flex flex-wrap gap-2 p-3 min-h-[52px] border rounded-md border-white/15 bg-white/5 ring-offset-background">
              {investingSectors.map((sector, index) => (
                <div key={index} className="flex items-center bg-[hsl(var(--cyan-glow))]/10 text-white px-3 py-1 rounded-full text-sm border border-[hsl(var(--cyan-glow))]/20">
                  <span>{sector}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSector(index)}
                    className="ml-2 hover:text-red-400 transition-colors focus:outline-none"
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
                    onBlur={handleAddSector}
                    placeholder="Sector name..."
                    className="h-7 text-sm focus-visible:ring-0 border-none px-2 shadow-none bg-transparent text-white"
                  />
                </div>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddingSector(true)}
                  className="h-7 px-2 text-white/50 hover:text-white hover:bg-white/10"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add sector
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white/80">Fun Fact</Label>
            <Textarea
              value={funFact}
              onChange={(e) => setFunFact(e.target.value)}
              placeholder="Tell us something interesting about yourself..."
              className="bg-white/5 border-white/15 text-white min-h-[100px]"
            />
            <p className="text-xs text-white/40">This helps founders get to know you better!</p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            onClick={handleSaveProfile}
            disabled={savingProfile || isUploading}
            className="bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--cyan-glow))]/90"
          >
            {savingProfile ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Member Profile"
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
