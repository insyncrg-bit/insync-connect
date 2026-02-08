import { Link } from "react-router-dom";
import { CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingParticles } from "@/components/FloatingParticles";
import inSyncLogo from "@/landing/assets/in-sync-logo.png";

export const RequestSent = () => {
  return (
    <div className="min-h-screen bg-navy-deep flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-glow/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-glow/5 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Floating Particles */}
      <FloatingParticles />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link to="/landing" className="block mb-8">
          <div className="relative">
            <div 
              className="absolute inset-0 blur-[60px] animate-pulse"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(6,182,212,0.4) 0%, rgba(6,182,212,0.2) 40%, transparent 70%)',
              }}
            />
            <img
              src={inSyncLogo}
              alt="InSync"
              className="relative h-40 w-auto max-w-[500px] mx-auto"
              style={{
                filter: "drop-shadow(0 0 30px rgba(6,182,212,0.5)) drop-shadow(0 0 60px rgba(6,182,212,0.3))",
              }}
            />
          </div>
        </Link>

        {/* Card */}
        <div className="bg-navy-card border border-white/10 rounded-2xl p-8 shadow-xl text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-glow/30 rounded-full blur-xl animate-pulse" />
              <div className="absolute inset-0 bg-cyan-glow/20 rounded-full blur-2xl" />
              <CheckCircle2 className="relative h-16 w-16 text-cyan-glow" style={{
                filter: "drop-shadow(0 0 20px rgba(6,182,212,0.6))",
              }} />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-3">
            Request Sent
          </h1>

          {/* Message */}
          <div className="space-y-4 mb-8">
            <p className="text-white/80 text-lg">
              Your request to join has been sent successfully.
            </p>
            <div className="flex items-start justify-center gap-3 p-4 bg-white/5 border border-white/10 rounded-lg">
              <Mail className="h-5 w-5 text-cyan-glow mt-0.5 shrink-0" />
              <p className="text-white/60 text-sm text-left">
                Check with your administrator to become an approved user. You'll receive an email notification once your request is approved.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Link to="/login" className="w-full">
              <Button
                className="w-full bg-cyan-glow text-navy-deep hover:bg-cyan-bright font-semibold py-5 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]"
              >
                Back to Login
              </Button>
            </Link>
            <Link
              to="/landing"
              className="text-center text-white/60 hover:text-cyan-glow transition-colors text-sm"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestSent;
