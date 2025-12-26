import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import AnalystAuth from "./pages/AnalystAuth";
import FounderApplication from "./pages/FounderApplication";
import InvestorApplication from "./pages/InvestorApplication";
import FounderDashboard from "./pages/FounderDashboard";
import AnalystDashboard from "./pages/AnalystDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/analyst-auth" element={<AnalystAuth />} />
          <Route path="/founder-application" element={<FounderApplication />} />
          <Route path="/founder-dashboard" element={<FounderDashboard />} />
          <Route path="/investor-application" element={<InvestorApplication />} />
          <Route path="/analyst-dashboard" element={<AnalystDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
