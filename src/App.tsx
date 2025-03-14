import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import Content from "./pages/Content";
import ContactUs from "./pages/ContactUs";
import NotFound from "./pages/NotFound";
import WordPressSettings from "./pages/WordPressSettings";
import Subscription from "./pages/Subscription";
import { AuthProvider, useAuth } from "./context/AuthContext";

const queryClient = new QueryClient();

// ProtectedRoute component to handle authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <Index />
        </ProtectedRoute>
      } />
      <Route path="/account" element={
        <ProtectedRoute>
          <Account />
        </ProtectedRoute>
      } />
      <Route path="/content" element={
        <ProtectedRoute>
          <Content />
        </ProtectedRoute>
      } />
      <Route path="/contact-us" element={
        <ProtectedRoute>
          <ContactUs />
        </ProtectedRoute>
      } />
      <Route path="/wordpress-settings" element={
        <ProtectedRoute>
          <WordPressSettings />
        </ProtectedRoute>
      } />
      <Route path="/subscription" element={
        <ProtectedRoute>
          <Subscription />
        </ProtectedRoute>
      } />
      <Route path="/auth" element={user ? <Navigate to="/" replace /> : <Auth />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
