import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileQuestion, Lock, AlertTriangle } from "lucide-react";

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
