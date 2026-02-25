import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileQuestion, Lock, AlertTriangle, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { sessionManager } from "@/lib/session";

/**
 * 404 – Not Found
 */
export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-navy-deep flex flex-col items-center justify-center p-6">
      <FileQuestion className="h-16 w-16 text-white/30 mb-6" />
      <h1 className="text-4xl font-bold text-white mb-2">404</h1>
      <p className="text-white/70 mb-6 text-center max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild className="bg-cyan-glow/20 text-cyan-glow border border-cyan-glow/50 hover:bg-cyan-glow/30">
        <Link to="/landing">Go home</Link>
      </Button>
    </div>
  );
}

/**
 * 403 – Forbidden
 */
export function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-navy-deep flex flex-col items-center justify-center p-6">
      <Lock className="h-16 w-16 text-white/30 mb-6" />
      <h1 className="text-4xl font-bold text-white mb-2">403</h1>
      <p className="text-white/70 mb-6 text-center max-w-md">
        You don't have permission to access this page.
      </p>
      <Button asChild className="bg-cyan-glow/20 text-cyan-glow border border-cyan-glow/50 hover:bg-cyan-glow/30">
        <Link to="/landing">Go home</Link>
      </Button>
    </div>
  );
}

/**
 * Request Rejected
 */
export function RejectedPage() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      sessionManager.clear();
      localStorage.clear();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error signing out:", error);
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-navy-deep flex flex-col items-center justify-center p-6">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl" />
        <Lock className="relative h-16 w-16 text-red-500/50" />
      </div>
      <h1 className="text-4xl font-bold text-white mb-2">Access Denied</h1>
      <p className="text-white/70 mb-8 text-center max-w-md text-lg">
        Your request to join has been rejected by the administrator.
      </p>
      
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button 
          onClick={handleSignOut}
          className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all duration-300"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
        <Button asChild variant="ghost" className="text-white/40 hover:text-white/60">
          <Link to="/landing">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
}

/**
 * Generic error page (e.g. 500)
 */
export function ErrorPage({ statusCode = 500 }: { statusCode?: number }) {
  return (
    <div className="min-h-screen bg-navy-deep flex flex-col items-center justify-center p-6">
      <AlertTriangle className="h-16 w-16 text-white/30 mb-6" />
      <h1 className="text-4xl font-bold text-white mb-2">{statusCode}</h1>
      <p className="text-white/70 mb-6 text-center max-w-md">
        Something went wrong. Please try again later.
      </p>
      <Button asChild className="bg-cyan-glow/20 text-cyan-glow border border-cyan-glow/50 hover:bg-cyan-glow/30">
        <Link to="/landing">Go home</Link>
      </Button>
    </div>
  );
}
