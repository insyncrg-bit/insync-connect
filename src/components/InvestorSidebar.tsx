import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Search, 
  Heart, 
  Calendar, 
  User,
  LogOut
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, tab: "dashboard" },
  { title: "Browse Startups", icon: Search, tab: "startups" },
  { title: "Saved", icon: Heart, tab: "saved" },
  { title: "Events", icon: Calendar, tab: "events" },
  { title: "Profile", icon: User, tab: "profile" },
];

export function InvestorSidebar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const currentTab = searchParams.get("tab") || "dashboard";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged out successfully" });
    navigate("/");
  };

  return (
    <Sidebar className="border-r border-white/10 bg-navy-deep">
      <SidebarHeader className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(var(--cyan-glow))] to-[hsl(var(--primary))] flex items-center justify-center">
            <span className="text-white font-bold text-lg">IS</span>
          </div>
          <div>
            <h2 className="font-semibold text-white">In-Sync</h2>
            <p className="text-xs text-white/50">Investor Portal</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.tab}>
                  <SidebarMenuButton
                    onClick={() => navigate(`/investor-dashboard?tab=${item.tab}`)}
                    className={`w-full justify-start gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      currentTab === item.tab
                        ? "bg-[hsl(var(--cyan-glow))]/20 text-[hsl(var(--cyan-glow))]"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="w-full justify-start gap-3 px-3 py-2.5 rounded-lg text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
