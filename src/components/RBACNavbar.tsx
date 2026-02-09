import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { signOut, deleteUser } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { sessionManager } from "@/lib/session";
import { useRole } from "@/hooks/useRole";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
import {
  LayoutDashboard,
  Users,
  Settings,
  UserCog,
  LogOut,
  ChevronDown,
  Building2,
  Trash2,
  Rocket,
  UserPlus,
  Send,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import infinityLogo from "@/landing/assets/infinity-logo.png";

type AllowedRole = "startup" | "vc" | "analyst" | "superuser";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

// Role-based navigation items
const ROLE_NAV_ITEMS: Record<AllowedRole, NavItem[]> = {
  vc: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/vc-admin" },
    { id: "organisation", label: "Organisation", icon: Users, path: "/vc-admin?tab=organisation" },
    { id: "settings", label: "Settings", icon: Settings, path: "/vc-admin?tab=settings" },
  ],
  startup: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/startup" },
    { id: "profile", label: "Profile", icon: UserCog, path: "/startup/profile" },
  ],
  analyst: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/analyst" },
    { id: "startups", label: "Startups", icon: Building2, path: "/analyst/startups" },
  ],
  superuser: [],
};

/** Routes shown in navbar for superusers to jump between pages (testing). */
const ADMIN_TEST_ROUTES: NavItem[] = [
  { id: "select-role", label: "Select role", icon: UserPlus, path: "/select-role" },
  { id: "vc-onboarding", label: "VC onboarding", icon: Building2, path: "/vc-onboarding" },
  { id: "vc-admin", label: "VC admin", icon: LayoutDashboard, path: "/vc-admin" },
  { id: "startup-onboarding", label: "Startup onboarding", icon: Rocket, path: "/startup-onboarding" },
  { id: "startup", label: "Startup", icon: Rocket, path: "/startup" },
  { id: "analyst", label: "Analyst", icon: UserCog, path: "/analyst" },
  { id: "request-sent", label: "Request sent", icon: Send, path: "/request-sent" },
  { id: "admin-test", label: "Admin: Test page", icon: LayoutDashboard, path: "/admin/test" },
  { id: "admin-superuser", label: "Admin: Set superuser", icon: Shield, path: "/admin/set-superuser" },
];

interface RBACNavbarProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export const RBACNavbar = ({ currentPath: propCurrentPath, onNavigate }: RBACNavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { role, userEmail, userId, loading } = useRole();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentPath =
    propCurrentPath ?? `${location.pathname}${location.search || ""}`;

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      sessionManager.clear();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
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
      
      if (error.code === "auth/requires-recent-login") {
        toast({
          title: "Re-authentication required",
          description: "Please sign in again before deleting your account.",
          variant: "destructive",
        });
        await signOut(auth);
        navigate("/login");
      } else {
        toast({
          title: "Error",
          description: "Failed to delete account. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (loading || !auth.currentUser) {
    return null;
  }

  const path = currentPath?.split("?")[0] || "";
  const superuserViewingRole =
    role === "superuser" &&
    (path.startsWith("/vc-admin")
      ? "vc"
      : path.startsWith("/startup")
        ? "startup"
        : path.startsWith("/analyst")
          ? "analyst"
          : null);

  const navItems =
    superuserViewingRole
      ? ROLE_NAV_ITEMS[superuserViewingRole]
      : role === "superuser"
        ? ADMIN_TEST_ROUTES
        : role
          ? ROLE_NAV_ITEMS[role] || []
          : [];
  const currentNavItem = navItems.find(
    (item) => currentPath?.startsWith(item.path.split("?")[0])
  ) || navItems[0];

  return (
    <header className="h-14 border-b border-white/10 bg-[hsl(var(--navy-header))] backdrop-blur-sm flex items-center px-6 gap-4">
      {/* Logo */}
      <button
        onClick={() => handleNavigate("/")}
        className="hover:opacity-80 transition-opacity"
      >
        <img src={infinityLogo} alt="Home" className="h-14 w-auto" />
      </button>

      <div className="flex-1" />

      {/* Navigation: role-based dropdown, or for superuser a list of routes to test */}
      {navItems.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              {role === "superuser" && !superuserViewingRole ? (
                <>
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Test routes
                </>
              ) : currentNavItem ? (
                <>
                  <currentNavItem.icon className="h-4 w-4 mr-2" />
                  {currentNavItem.label}
                </>
              ) : (
                <>
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </>
              )}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#151a24] border-white/10">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath?.startsWith(item.path.split("?")[0]);
              return (
                <DropdownMenuItem
                  key={item.id}
                  onClick={() => handleNavigate(item.path)}
                  className={cn(
                    "text-white hover:bg-white/10 cursor-pointer",
                    isActive && "bg-[hsl(var(--cyan-glow))]/20"
                  )}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </DropdownMenuItem>
              );
            })}
            {superuserViewingRole && (
              <>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  onClick={() => handleNavigate("/admin/test")}
                  className="text-white/80 hover:bg-white/10 cursor-pointer"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  All test routes
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* User Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <UserCog className="h-4 w-4 mr-2" />
            {userEmail.split("@")[0] || "User"}
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-[#151a24] border-white/10">
          <DropdownMenuItem
            onClick={() => handleNavigate("/profile")}
            className="text-white hover:bg-white/10 cursor-pointer"
          >
            <UserCog className="h-4 w-4 mr-2" />
            Edit Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-white hover:bg-white/10 cursor-pointer"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem
            onClick={() => setDeleteDialogOpen(true)}
            className="text-red-400 hover:bg-red-400/10 cursor-pointer"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
    </header>
  );
};
