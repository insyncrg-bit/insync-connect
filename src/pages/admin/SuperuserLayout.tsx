import { Outlet } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { LayoutDashboard, Users } from "lucide-react";
import infinityLogo from "@/landing/assets/infinity-logo.png";

const NAV_ITEMS = [
  { to: "/admin/test", label: "Test dashboards", icon: LayoutDashboard },
  { to: "/admin/set-superuser", label: "Superuser management", icon: Users },
] as const;

export const SuperuserLayout = () => (
  <div className="min-h-screen bg-[#151a24] flex flex-col">
    <header className="h-14 border-b border-white/10 bg-[hsl(var(--navy-header))] backdrop-blur-sm flex items-center px-6 gap-6 shrink-0">
      <NavLink to="/admin/test" className="hover:opacity-80 transition-opacity flex items-center">
        <img src={infinityLogo} alt="Admin home" className="h-14 w-auto" />
      </NavLink>
      <nav className="flex items-center gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors " +
              (isActive
                ? "bg-cyan-glow/20 text-cyan-glow"
                : "text-white/70 hover:text-white hover:bg-white/5")
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="flex-1" />
      <span className="text-sm text-cyan-glow font-medium">Admin</span>
    </header>
    <main className="flex-1 flex flex-col">
      <Outlet />
    </main>
  </div>
);
