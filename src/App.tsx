import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, lazy, Suspense } from "react";
import { auth } from "@/lib/firebase";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LandingOrRedirect } from "./components/LandingOrRedirect";
import { RequireAuth } from "./components/RequireAuth";
import { RequireRole } from "./components/RequireRole";
import { RequireNoAuth } from "./components/RequireNoAuth";
import { RequireUserType } from "./components/RequireUserType";
import { RequireRequestStatus } from "./components/RequireRequestStatus";
import { RequireNoUserType } from "./components/RequireNoUserType";
import { RequireOnboarding } from "./components/RequireOnboarding";
import { AppLayoutWithNavbar } from "./components/AppLayoutWithNavbar";
import { SimpleLayout } from "./components/SimpleLayout";
import { NotFoundPage, ForbiddenPage, ErrorPage, RejectedPage } from "./pages/errors";
import Landing from "./landing";

const SignUp = lazy(() => import("./pages/auth/SignUp"));
const Login = lazy(() => import("./pages/auth/Login"));
const VerifyEmail = lazy(() =>
  import("./pages/auth/VerifyEmail").then((m) => ({ default: m.VerifyEmail }))
);
const ForgotPassword = lazy(() =>
  import("./pages/auth/ForgotPassword").then((m) => ({ default: m.ForgotPassword }))
);
const ResetPasswordSuccess = lazy(() =>
  import("./pages/auth/ResetPasswordSuccess").then((m) => ({ default: m.ResetPasswordSuccess }))
);
const ResetPassword = lazy(() =>
  import("./pages/auth/ResetPassword").then((m) => ({ default: m.ResetPassword }))
);
const RequestSent = lazy(() => import("./pages/auth/RequestSent"));
const SelectRole = lazy(() => import("./pages/auth/SelectRole"));
const VerifyPending = lazy(() => import("./pages/auth/VerifyPending"));

const VCOnboarding = lazy(() => import("./pages/vc/vc-onboarding/VCOnboarding"));
const StartupOnboarding = lazy(
  () => import("./pages/startup/startup-onboarding/StartupOnboarding")
);

const VCDashboard = lazy(() =>
  import("./pages/vc/VCDashboard").then((m) => ({ default: m.VCDashboard }))
);
const AnalystDashboard = lazy(() =>
  import("./pages/analyst/AnalystDashboard").then((m) => ({ default: m.AnalystDashboard }))
);
const StartupDashboard = lazy(() =>
  import("./pages/startup/StartupDashboard").then((m) => ({ default: m.StartupDashboard }))
);

const StartupProfilePage = lazy(() =>
  import("./pages/startup/StartupProfilePage").then((m) => ({ default: m.StartupProfilePage }))
);

const SuperuserLayout = lazy(() =>
  import("./pages/admin/SuperuserLayout").then((m) => ({ default: m.SuperuserLayout }))
);
const SuperuserConfig = lazy(() => import("./pages/admin/SuperuserConfig"));
const SuperuserTestPage = lazy(() =>
  import("./pages/admin/SuperuserTestPage").then((m) => ({ default: m.SuperuserTestPage }))
);

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
        <Suspense fallback={null}>
          <Routes>
            {/* No navbar: landing, signup, login */}
            <Route path="/" element={<LandingOrRedirect />} />
            <Route path="/landing" element={<Landing />} />
            <Route element={<RequireNoAuth />}>
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
            </Route>


            {/* Other Public/Auth Pages (Simple Navbar) */}
            <Route element={<SimpleLayout />}>
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/verify-pending" element={<VerifyPending />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/reset-password-success" element={<ResetPasswordSuccess />} />
            </Route>

            <Route element={<RequireAuth />}>
              <Route element={<RequireNoUserType />}>
                <Route element={<SimpleLayout />}>
                  <Route path="/select-role" element={<SelectRole />} />
                </Route>
              </Route>
              
              {/* Common Shared Routes */}
              <Route element={<RequireUserType allowedTypes={["vc-user", "founder-user"]} />}>
                <Route element={<SimpleLayout />}>
                  <Route path="/request-sent" element={<RequestSent />} />
                </Route>
              </Route>

              {/* VC User Routes */}
              <Route element={<RequireUserType allowedTypes={["vc-user"]} />}>
                {/* Only accessible if accepted (Admin or Analyst) */}
                <Route element={<RequireRequestStatus allowedStatuses={["accepted"]} />}>
                  <Route element={<RequireOnboarding mode="incomplete" />}>
                    <Route element={<SimpleLayout />}>
                      <Route path="/vc-onboarding" element={<VCOnboarding />} />
                    </Route>
                  </Route>
                  
                  <Route element={<RequireOnboarding mode="complete" />}>
                    <Route element={<AppLayoutWithNavbar />}>
                      <Route path="/vc-dashboard/*" element={<VCDashboard />} />
                    </Route>
                  </Route>
                </Route>
              </Route>

              {/* Startup/Founder Routes */}
              <Route element={<RequireUserType allowedTypes={["founder-user"]} />}>
                {/* Only accessible if accepted */}
                <Route element={<RequireRequestStatus allowedStatuses={["accepted"]} />}>
                  <Route element={<RequireOnboarding mode="incomplete" />}>
                    <Route element={<SimpleLayout />}>
                      <Route path="/startup-onboarding" element={<StartupOnboarding />} />
                    </Route>
                  </Route>
                  
                  <Route element={<RequireOnboarding mode="complete" />}>
                    <Route element={<AppLayoutWithNavbar />}>
                      <Route path="/startup-dashboard/*" element={<StartupDashboard />} />
                      <Route path="/startup-profile" element={<StartupProfilePage />} />
                    </Route>
                  </Route>
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
            <Route path="/request-rejected" element={<RejectedPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="/500" element={<ErrorPage statusCode={500} />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
};

export default App;
