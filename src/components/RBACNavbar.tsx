import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { signOut, deleteUser } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { sessionManager } from "@/lib/session";
import { useUserClaims } from "@/hooks/useUserClaims";
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
  FileText,
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

// Unified VC Navigation Items (for both Admin and Analyst)
const VC_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/vc-dashboard" },
  { id: "organisation", label: "Organization", icon: Users, path: "/vc-dashboard?tab=organisation" },
  { id: "edit-memo", label: "Edit Memo", icon: FileText, path: "/vc-dashboard?tab=edit-memo" },
];

const STARTUP_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/startup-dashboard" },
  { id: "organisation", label: "Organization", icon: Users, path: "/startup-dashboard?tab=organisation" },
  { id: "edit-memo", label: "Edit Memo", icon: FileText, path: "/startup-dashboard?tab=edit-memo" },
];

/** Routes shown in navbar for superusers to jump between pages (testing). */
const ADMIN_TEST_ROUTES: NavItem[] = [
  { id: "select-role", label: "Select role", icon: UserPlus, path: "/select-role" },
  { id: "vc-onboarding", label: "VC onboarding", icon: Building2, path: "/vc-onboarding" },
  { id: "vc-dashboard", label: "VC dashboard", icon: LayoutDashboard, path: "/vc-dashboard" },
  { id: "startup-onboarding", label: "Startup onboarding", icon: Rocket, path: "/startup-onboarding" },
  { id: "startup", label: "Startup", icon: Rocket, path: "/startup-dashboard" },
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
  const { userType, userEmail, loading } = useUserClaims();

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


  if (loading || !auth.currentUser) {
    return null;
  }
  
  // Determine which nav items to show based on userType
  let navItems: NavItem[] = [];

  if (userType === "superuser") {
    navItems = ADMIN_TEST_ROUTES;
  } else if (userType === "founder-user") {
    navItems = STARTUP_ITEMS;
  } else if (userType === "vc-user") {
    // Unified VC items for both Admins and Analysts
    if (currentPath?.startsWith("/vc-onboarding")) {
      navItems = [];
    } else {
      navItems = VC_ITEMS;
    }
  }
  const currentNavItem = navItems.find((item) => {
    if (item.path.includes('?')) {
      return currentPath === item.path;
    }
    return currentPath === item.path || currentPath === `${item.path}?tab=dashboard` || (item.id === 'dashboard' && currentPath === item.path);
  }) || navItems.find(item => currentPath?.startsWith(item.path.split("?")[0])) || navItems[0];

  return (
    <header className="h-14 border-b border-white/10 bg-[hsl(var(--navy-header))] backdrop-blur-sm flex items-center px-6 gap-4">
      {/* Logo — always goes to landing page from anywhere in the app */}
      <button
        onClick={() => {
          const path = userType === "founder-user" ? "/startup-dashboard" : 
                       (userType === "vc-user" ? "/vc-dashboard" : "/landing");
          handleNavigate(path);
        }}
        className="hover:opacity-80 transition-opacity"
      >
        <img src={infinityLogo} alt="Home" width={100} height={56} className="h-14 w-auto" />
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
              {userType === "superuser" ? (
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
              // Simple active check: path match
              const isActive = currentPath === item.path || (item.id === 'dashboard' && currentPath === item.path);
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
            {userType === "superuser" && (
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
            onClick={() => {
                if (userType === 'vc-user') handleNavigate("/vc-dashboard?tab=profile");
                else if (userType === 'founder-user') handleNavigate("/startup-dashboard?tab=edit-profile");
                else handleNavigate("/profile"); // Fallback
            }}
            className="text-white hover:bg-white/10 cursor-pointer"
          >
            <UserCog className="h-4 w-4 mr-2" />
            Edit profile
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/10" />

          <DropdownMenuItem
            onClick={handleLogout}
            className="text-white hover:bg-white/10 cursor-pointer"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </header>
  );
};
