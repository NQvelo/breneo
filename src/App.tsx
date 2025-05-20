
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import InterestsPage from "./pages/InterestsPage";
import Dashboard from "./pages/Dashboard";
import JobsPage from "./pages/JobsPage";
import CoursesPage from "./pages/CoursesPage";
import SkillTestPage from "./pages/SkillTestPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/interests" element={<InterestsPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/skill-test" element={<SkillTestPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
