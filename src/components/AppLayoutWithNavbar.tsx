import { Outlet } from "react-router-dom";
import { RBACNavbar } from "@/components/RBACNavbar";

/**
 * Wraps all non-landing routes with the app navbar.
 * Use for any route that should show the RBAC navbar (all except / and /landing).
 */
export const AppLayoutWithNavbar = () => (
  <div className="min-h-screen flex flex-col bg-[#151a24]">
    <RBACNavbar />
    <main className="flex-1 flex flex-col">
      <Outlet />
    </main>
  </div>
);
