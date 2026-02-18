import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { auth } from "@/lib/firebase";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LandingOrRedirect } from "./components/LandingOrRedirect";
import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";
import { VerifyEmail } from "./pages/auth/VerifyEmail";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { ResetPasswordSuccess } from "./pages/auth/ResetPasswordSuccess";
import { ResetPassword } from "./pages/auth/ResetPassword";
import RequestSent from "./pages/auth/RequestSent";
import SelectRole from "./pages/auth/SelectRole";
import VCOnboarding from "./pages/vc/vc-onboarding/VCOnboarding";
import StartupOnboarding from "./pages/startup/startup-onboarding/StartupOnboarding";
import { VCDashboard } from "./pages/vc/VCDashboard";
import { AnalystDashboard } from "./pages/analyst/AnalystDashboard";
import { StartupDashboard } from "./pages/startup/StartupDashboard";
import { SuperuserLayout } from "./pages/admin/SuperuserLayout";
import SuperuserConfig from "./pages/admin/SuperuserConfig";
import { SuperuserTestPage } from "./pages/admin/SuperuserTestPage";
import { RequireAuth } from "./components/RequireAuth";
import { RequireRole } from "./components/RequireRole";
import { RequireNoAuth } from "./components/RequireNoAuth";
import { RequireUserType } from "./components/RequireUserType";
import { RequireRequestStatus } from "./components/RequireRequestStatus";
import { RequireNoUserType } from "./components/RequireNoUserType";
import { AppLayoutWithNavbar } from "./components/AppLayoutWithNavbar";
import { NotFoundPage, ForbiddenPage, ErrorPage } from "./pages/errors";
import Landing from "./landing";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const logClaims = async () => {
      const user = auth.currentUser;
      if (user) {
        const tokenResult = await user.getIdTokenResult();
        console.log("Custom Claims (Mount):", tokenResult.claims);
      }
    };
    
    // Log on mount
    logClaims();

    // Also listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
            const tokenResult = await user.getIdTokenResult();
            console.log("Auth State Changed - Claims:", tokenResult.claims);
        }
    });

    return () => unsubscribe();
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* No navbar: landing, signup, login */}
          <Route path="/" element={<LandingOrRedirect />} />
          <Route path="/landing" element={<Landing />} />
          <Route element={<RequireNoAuth />}>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Other Public/Auth Pages (No Navbar) */}
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset-password-success" element={<ResetPasswordSuccess />} />

          <Route element={<RequireAuth />}>
            <Route element={<RequireNoUserType />}>
              <Route path="/select-role" element={<SelectRole />} />
            </Route>
            
            {/* VC User Routes */}
            <Route element={<RequireUserType allowedTypes={["vc-user"]} />}>
              <Route path="/request-sent" element={<RequestSent />} />
              
              {/* Only accessible if accepted (Admin or Analyst) */}
              <Route element={<RequireRequestStatus allowedStatuses={["accepted"]} />}>
                <Route path="/vc-onboarding" element={<VCOnboarding />} />
                
                <Route element={<AppLayoutWithNavbar />}>
                  <Route path="/vc-dashboard/*" element={<VCDashboard />} />
                </Route>
              </Route>
            </Route>

            {/* Startup/Founder Routes */}
            <Route element={<RequireUserType allowedTypes={["founder-user"]} />}>
              <Route path="/startup-onboarding" element={<StartupOnboarding />} />
              
              <Route element={<AppLayoutWithNavbar />}>
                <Route path="/startup-dashboard/*" element={<StartupDashboard />} />
              </Route>
            </Route>

            <Route element={<RequireRole allowedRoles={["superuser"]} />}>
              <Route element={<AppLayoutWithNavbar />}>
                <Route path="/admin" element={<SuperuserLayout />}>
                  <Route index element={<Navigate to="/admin/test" replace />} />
                  <Route path="set-superuser" element={<SuperuserConfig />} />
                  <Route path="test" element={<SuperuserTestPage />} />
                </Route>
              </Route>
            </Route>
          </Route>

          <Route path="/403" element={<ForbiddenPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="/500" element={<ErrorPage statusCode={500} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
};

export default App;
