import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
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
  LogOut,
  ChevronDown,
  UserCog,
} from "lucide-react";
import infinityLogo from "@/landing/assets/infinity-logo.png";

export const SimpleNavbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userEmail, loading } = useUserClaims();

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

  return (
    <header className="h-14 border-b border-white/10 bg-[hsl(var(--navy-header))] backdrop-blur-sm flex items-center px-6 gap-4">
      {/* Logo */}
      <button
        onClick={() => navigate("/landing")}
        className="hover:opacity-80 transition-opacity"
      >
        <img src={infinityLogo} alt="Home" width={100} height={56} className="h-14 w-auto" />
      </button>

      <div className="flex-1" />

      {/* User Actions - only show if user is logged in */}
      {!loading && auth.currentUser && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <UserCog className="h-4 w-4 mr-2" />
              {userEmail || "User"}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#151a24] border-white/10">
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-white hover:bg-white/10 cursor-pointer"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
};
