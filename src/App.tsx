import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
import VCOnboarding from "./pages/vc-onboarding/VCOnboarding";
import StartupOnboarding from "./pages/startup-onboarding/StartupOnboarding";
import { VCAdminDashboard } from "./pages/vc-admin/VCAdminDashboard";
import { AnalystDashboard } from "./pages/analyst/AnalystDashboard";
import { StartupDashboard } from "./pages/startup/StartupDashboard";
import { SuperuserLayout } from "./pages/admin/SuperuserLayout";
import SuperuserConfig from "./pages/admin/SuperuserConfig";
import { SuperuserTestPage } from "./pages/admin/SuperuserTestPage";
import { RequireAuth } from "./components/RequireAuth";
import { RequireRole } from "./components/RequireRole";
import { RequireNoAuth } from "./components/RequireNoAuth";
import { RequireNoRole } from "./components/RequireNoRole";
import { NotFoundPage, ForbiddenPage, ErrorPage } from "./pages/errors";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* / = landing only when not logged in; when logged in redirects to app home */}
          <Route path="/" element={<LandingOrRedirect />} />
          {/* /landing = canonical landing URL; signed-in users are redirected to app home */}
          <Route path="/landing" element={<LandingOrRedirect />} />

          {/* Auth Routes - redirect authenticated users away */}
          <Route element={<RequireNoAuth />}>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
          </Route>
          
          {/* Public auth routes (no redirect needed) */}
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset-password-success" element={<ResetPasswordSuccess />} />


          {/* Protected routes: require valid session (auth token with timeout) */}
          <Route element={<RequireAuth />}>
            {/* Select role - only for users WITHOUT a role */}
            <Route element={<RequireNoRole />}>
              <Route path="/select-role" element={<SelectRole />} />
            </Route>
            
            <Route path="/request-sent" element={<RequestSent />} />
            
            {/* VC Onboarding - only for VCs */}
            <Route element={<RequireRole allowedRoles={["vc"]} />}>
              <Route path="/vc-onboarding" element={<VCOnboarding />} />
              <Route path="/vc-admin/*" element={<VCAdminDashboard />} />
            </Route>
            
            {/* Startup Onboarding - only for startups */}
            <Route element={<RequireRole allowedRoles={["startup"]} />}>
              <Route path="/startup-onboarding" element={<StartupOnboarding />} />
              <Route path="/startup/*" element={<StartupDashboard />} />
            </Route>
            
            {/* Analyst routes */}
            <Route element={<RequireRole allowedRoles={["analyst"]} />}>
              <Route path="/analyst/*" element={<AnalystDashboard />} />
            </Route>
            
            {/* Admin / superuser: all routes require superuser role */}
            <Route element={<RequireRole allowedRoles={["superuser"]} />}>
              <Route path="/admin" element={<SuperuserLayout />}>
                <Route index element={<Navigate to="/admin/test" replace />} />
                <Route path="set-superuser" element={<SuperuserConfig />} />
                <Route path="test" element={<SuperuserTestPage />} />
              </Route>
            </Route>
          </Route>

          {/* Error pages */}
          <Route path="/403" element={<ForbiddenPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="/500" element={<ErrorPage statusCode={500} />} />

          {/* Catch-all: 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
