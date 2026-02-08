import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";
import RequestSent from "./pages/auth/RequestSent";
import SelectRole from "./pages/auth/SelectRole";
import VCOnboarding from "./pages/vc-onboarding/VCOnboarding";
import StartupOnboarding from "./pages/startup-onboarding/StartupOnboarding";
import VCAdminDashboard from "./pages/vc-admin/VCAdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<Index />} />

          {/* Auth Routes */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/select-role" element={<SelectRole />} />
          <Route path="/request-sent" element={<RequestSent />} />
          
          {/* Onboarding */}
          <Route path="/vc-onboarding" element={<VCOnboarding />} />
          <Route path="/startup-onboarding" element={<StartupOnboarding />} />

          {/* VC Admin Dashboard */}
          <Route path="/vc-admin/*" element={<VCAdminDashboard />} />

          {/* TODO: Add real app routes here when building out the actual app */}
          {/* <Route path="/founder-application" element={<FounderApplication />} /> */}
          {/* <Route path="/founder-dashboard" element={<FounderDashboard />} /> */}
          {/* <Route path="/investor-application" element={<InvestorApplication />} /> */}
          {/* <Route path="/analyst-dashboard" element={<AnalystDashboard />} /> */}

          {/* Catch-all redirect to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
