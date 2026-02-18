import { Outlet } from "react-router-dom";
import { SimpleNavbar } from "./SimpleNavbar";

/**
 * A simplified layout featuring the SimpleNavbar.
 * Used for onboarding and auth-related routes.
 */
export const SimpleLayout = () => (
  <div className="min-h-screen flex flex-col bg-[#151a24]">
    <SimpleNavbar />
    <main className="flex-1 flex flex-col">
      <Outlet />
    </main>
  </div>
);
