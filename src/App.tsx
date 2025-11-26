import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FounderApplication from "./pages/FounderApplication";
import InvestorApplication from "./pages/InvestorApplication";
import FounderDashboard from "./pages/FounderDashboard";
import Platform from "./pages/Platform";
import Intro from "./pages/Intro";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/intro" element={<Intro />} />
          <Route path="/platform" element={<Platform />} />
          <Route path="/founder-application" element={<FounderApplication />} />
          <Route path="/founder-dashboard" element={<FounderDashboard />} />
          <Route path="/investor-application" element={<InvestorApplication />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
