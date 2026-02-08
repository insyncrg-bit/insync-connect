import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";

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

          {/* TODO: Add real app routes here when building out the actual app */}
          {/* <Route path="/auth" element={<Auth />} /> */}
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
