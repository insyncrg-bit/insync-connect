import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRole } from "@/hooks/useRole";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Users,
  Settings,
  UserCog,
  LogOut,
  ChevronDown,
  Building2,
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
  superuser: [
    { id: "test", label: "Test dashboards", icon: LayoutDashboard, path: "/admin/test" },
    { id: "superuser", label: "Superuser management", icon: Users, path: "/admin/set-superuser" },
  ],
};

interface RBACNavbarProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export const RBACNavbar = ({ currentPath, onNavigate }: RBACNavbarProps) => {
  const navigate = useNavigate();
  const { role, userEmail, loading } = useRole();

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
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Don't render if loading, not authenticated, or no role
  if (loading || !role) {
    return null;
  }

  const navItems = ROLE_NAV_ITEMS[role] || [];
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

      {/* Navigation Dropdown */}
      {navItems.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              {currentNavItem && (
                <>
                  <currentNavItem.icon className="h-4 w-4 mr-2" />
                  {currentNavItem.label}
                </>
              )}
              {!currentNavItem && (
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
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
