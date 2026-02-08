import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  ArrowRight,
  X,
  Building2,
  Users,
  Target,
  Briefcase,
  TrendingUp,
  Sparkles,
  SkipForward,
  MapPin,
  Eye,
  Heart,
  MessageSquare,
  DollarSign,
  FileText,
} from "lucide-react";

// Demo steps for startup application
const steps = [
  { id: "welcome", title: "Welcome", icon: Sparkles },
  { id: "company", title: "Company Info", icon: Building2 },
  { id: "team", title: "Team", icon: Users },
  { id: "problem", title: "Problem & Solution", icon: Target },
  { id: "business", title: "Business Model", icon: Briefcase },
  { id: "traction", title: "Traction & Goals", icon: TrendingUp },
];

// Mock investors for dashboard
const mockInvestors = [
  {
    id: "inv-1",
    firm_name: "Horizon Ventures",
    hq_location: "San Francisco, CA",
    stage_focus: ["Pre-seed", "Seed"],
    sector_tags: ["Enterprise SaaS", "AI/ML"],
    check_sizes: ["$500K - $2M"],
    thesis_statement: "We invest in technical founders building software that becomes critical infrastructure for enterprises.",
  },
  {
    id: "inv-2",
    firm_name: "Climate Capital",
    hq_location: "New York, NY",
    stage_focus: ["Seed", "Series A"],
    sector_tags: ["Climate Tech", "Sustainability"],
    check_sizes: ["$1M - $5M"],
    thesis_statement: "We back founders building solutions to the climate crisis. Focus on carbon reduction and clean energy.",
  },
  {
    id: "inv-3",
    firm_name: "HealthTech Partners",
    hq_location: "Boston, MA",
    stage_focus: ["Seed"],
    sector_tags: ["Digital Health", "HealthTech"],
    check_sizes: ["$2M - $5M"],
    thesis_statement: "Investing in the future of healthcare. We partner with founders reimagining patient care.",
  },
  {
    id: "inv-4",
    firm_name: "Fintech Foundry",
    hq_location: "Austin, TX",
    stage_focus: ["Pre-seed", "Seed"],
    sector_tags: ["Fintech", "Payments"],
    check_sizes: ["$500K - $1.5M"],
    thesis_statement: "We believe in democratizing financial services. Looking for founders building next-gen financial infrastructure.",
  },
];

const getStageColor = (stage: string) => {
  const colors: Record<string, string> = {
    "Pre-seed": "bg-purple-500/20 text-purple-400 border-purple-500/30",
    "Seed": "bg-green-500/20 text-green-400 border-green-500/30",
    "Series A": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };
  return colors[stage] || "bg-white/10 text-white/80 border-white/20";
};

interface DemoStartupFlowProps {
  onClose: () => void;
}

export const DemoStartupFlow = ({ onClose }: DemoStartupFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showDashboard, setShowDashboard] = useState(false);

  const goNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowDashboard(true);
    }
  };

  const goBack = () => {
    if (showDashboard) {
      setShowDashboard(false);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipToDashboard = () => {
    setShowDashboard(true);
  };

  // Dashboard View
  if (showDashboard) {
    return (
      <div className="fixed inset-0 z-50 bg-navy-deep overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-navy-deep/95 backdrop-blur-lg border-b border-white/10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={goBack} className="text-white/60 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Application
              </Button>
              <div className="h-6 w-px bg-white/20" />
              <span className="text-cyan-glow text-sm font-medium px-2 py-1 bg-cyan-glow/10 rounded">Startup Demo</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white/60 hover:text-white">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Demo Startup Dashboard</h1>
            <p className="text-white/50">See how founders discover and connect with investors</p>
          </div>

          {/* Company Card */}
          <Card className="bg-navy-card border border-white/10 p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-cyan-glow/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-cyan-glow" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Your Demo Startup</h3>
                <p className="text-sm text-white/50">AI/ML Infrastructure • Seed Stage</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-cyan-glow">
              <FileText className="w-4 h-4 mr-2" />
              View Memo
            </Button>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <Card className="bg-navy-card border border-white/10 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-4 h-4 text-cyan-glow" />
                <span className="text-2xl font-semibold text-white">2</span>
              </div>
              <p className="text-xs text-white/50">Interests</p>
            </Card>
            <Card className="bg-navy-card border border-white/10 p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-cyan-glow" />
                <span className="text-2xl font-semibold text-white">2</span>
              </div>
              <p className="text-xs text-white/50">Syncs</p>
            </Card>
            <Card className="bg-navy-card border border-white/10 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Eye className="w-4 h-4 text-white/60" />
                <span className="text-2xl font-semibold text-white">1</span>
              </div>
              <p className="text-xs text-white/50">Pending</p>
            </Card>
            <Card className="bg-navy-card border border-white/10 p-4">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="w-4 h-4 text-white/60" />
                <span className="text-2xl font-semibold text-white">3</span>
              </div>
              <p className="text-xs text-white/50">Messages</p>
            </Card>
          </div>

          {/* Curated Investors */}
          <h2 className="text-xl font-semibold text-white mb-4">Curated Investors For You</h2>
          <div className="grid grid-cols-2 gap-4">
            {mockInvestors.map((investor) => (
              <Card key={investor.id} className="bg-navy-card border border-white/10 p-5 hover:border-cyan-glow/30 transition-all cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-glow/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-cyan-glow" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{investor.firm_name}</h4>
                    <p className="text-xs text-white/50 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {investor.hq_location}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${getStageColor(investor.stage_focus[0])}`}>
                    {investor.stage_focus[0]}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/20">
                    {investor.sector_tags[0]}
                  </span>
                </div>
                <p className="text-sm text-white/60 mb-4 line-clamp-2">{investor.thesis_statement}</p>
                <div className="pt-3 border-t border-white/10 flex gap-2">
                  <Button size="sm" className="flex-1 bg-cyan-glow text-navy-deep hover:bg-cyan-bright">
                    <Heart className="w-3 h-3 mr-1" />
                    Interest
                  </Button>
                  <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Exit Demo CTA */}
          <div className="mt-12 text-center">
            <p className="text-white/50 mb-4">Ready to find your perfect investor match?</p>
            <Button onClick={onClose} className="bg-cyan-glow text-navy-deep hover:bg-cyan-bright font-semibold px-8">
              Exit Demo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Application Flow View
  return (
    <div className="fixed inset-0 z-50 bg-navy-deep overflow-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-navy-deep/95 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white/60 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Exit Demo
            </Button>
            <div className="h-6 w-px bg-white/20" />
            <span className="text-cyan-glow text-sm font-medium px-2 py-1 bg-cyan-glow/10 rounded">Startup Demo</span>
          </div>
          <Button onClick={skipToDashboard} variant="outline" size="sm" className="border-cyan-glow/30 text-cyan-glow hover:bg-cyan-glow/10">
            <SkipForward className="w-4 h-4 mr-2" />
            Skip to Dashboard
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isActive
                      ? "bg-cyan-glow text-navy-deep"
                      : isCompleted
                      ? "bg-cyan-glow/20 text-cyan-glow"
                      : "bg-white/10 text-white/40"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-1 ${isCompleted ? "bg-cyan-glow/50" : "bg-white/10"}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <Card className="bg-navy-card border border-white/10 p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">{steps[currentStep].title}</h2>
            <p className="text-white/50 text-sm">Step {currentStep + 1} of {steps.length}</p>
          </div>

          {/* Welcome Step */}
          {currentStep === 0 && (
            <div className="text-center py-8">
              <Sparkles className="w-16 h-16 text-cyan-glow mx-auto mb-4" />
              <h3 className="text-xl text-white mb-4">Welcome to InSync!</h3>
              <p className="text-white/60 max-w-md mx-auto mb-6">
                This demo will walk you through our startup application process.
                Fill out your memo to get matched with the right investors.
              </p>
              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto text-left">
                <div className="p-3 bg-white/5 rounded-lg border border-cyan-glow/20">
                  <span className="text-cyan-glow font-bold">WHAT</span>
                  <p className="text-xs text-white/50">Problem you solve</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-cyan-glow/20">
                  <span className="text-cyan-glow font-bold">WHY</span>
                  <p className="text-xs text-white/50">Why now & why you</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-cyan-glow/20">
                  <span className="text-cyan-glow font-bold">HOW</span>
                  <p className="text-xs text-white/50">Your solution</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-cyan-glow/20">
                  <span className="text-cyan-glow font-bold">PROOF</span>
                  <p className="text-xs text-white/50">Traction & metrics</p>
                </div>
              </div>
            </div>
          )}

          {/* Company Info Step */}
          {currentStep === 1 && (
            <div className="space-y-4 max-w-md mx-auto">
              <div>
                <Label className="text-white/70">Company Name</Label>
                <Input placeholder="Acme Inc." className="bg-white/5 border-white/10 text-white mt-1" defaultValue="Demo Startup" />
              </div>
              <div>
                <Label className="text-white/70">Website</Label>
                <Input placeholder="https://example.com" className="bg-white/5 border-white/10 text-white mt-1" defaultValue="https://demostartup.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/70">Stage</Label>
                  <Input placeholder="Seed" className="bg-white/5 border-white/10 text-white mt-1" defaultValue="Seed" />
                </div>
                <div>
                  <Label className="text-white/70">Location</Label>
                  <Input placeholder="San Francisco, CA" className="bg-white/5 border-white/10 text-white mt-1" defaultValue="San Francisco, CA" />
                </div>
              </div>
              <div>
                <Label className="text-white/70">Vertical</Label>
                <Input placeholder="AI/ML, SaaS, etc." className="bg-white/5 border-white/10 text-white mt-1" defaultValue="AI/ML Infrastructure" />
              </div>
            </div>
          )}

          {/* Team Step */}
          {currentStep === 2 && (
            <div className="space-y-4 max-w-md mx-auto">
              <div>
                <Label className="text-white/70">Founder Name</Label>
                <Input placeholder="Jane Doe" className="bg-white/5 border-white/10 text-white mt-1" defaultValue="Demo Founder" />
              </div>
              <div>
                <Label className="text-white/70">Founder Email</Label>
                <Input placeholder="jane@company.com" className="bg-white/5 border-white/10 text-white mt-1" defaultValue="founder@demostartup.com" />
              </div>
              <div>
                <Label className="text-white/70">Team Size</Label>
                <Input placeholder="5" className="bg-white/5 border-white/10 text-white mt-1" defaultValue="8" />
              </div>
              <div>
                <Label className="text-white/70">Founder Background</Label>
                <Textarea placeholder="Previous experience..." className="bg-white/5 border-white/10 text-white mt-1" defaultValue="Ex-Google ML engineer, Stanford CS PhD. Previously built and sold an AI startup." />
              </div>
            </div>
          )}

          {/* Problem & Solution Step */}
          {currentStep === 3 && (
            <div className="space-y-4 max-w-md mx-auto">
              <div>
                <Label className="text-white/70">Problem Statement</Label>
                <Textarea placeholder="What problem are you solving?" className="bg-white/5 border-white/10 text-white mt-1 min-h-[80px]" defaultValue="Enterprises struggle to deploy ML models to production. 90% of models never make it past the prototype stage due to infrastructure complexity." />
              </div>
              <div>
                <Label className="text-white/70">Your Solution</Label>
                <Textarea placeholder="How do you solve it?" className="bg-white/5 border-white/10 text-white mt-1 min-h-[80px]" defaultValue="One-click ML deployment platform that automates infrastructure, monitoring, and scaling. Reduces deployment time from months to minutes." />
              </div>
              <div>
                <Label className="text-white/70">Why Now?</Label>
                <Textarea placeholder="Why is now the right time?" className="bg-white/5 border-white/10 text-white mt-1" defaultValue="AI adoption is accelerating but infrastructure hasn't kept pace. Companies are desperate for solutions." />
              </div>
            </div>
          )}

          {/* Business Model Step */}
          {currentStep === 4 && (
            <div className="space-y-4 max-w-md mx-auto">
              <div>
                <Label className="text-white/70">Business Model</Label>
                <Input placeholder="SaaS, Marketplace, etc." className="bg-white/5 border-white/10 text-white mt-1" defaultValue="B2B SaaS - Usage-based pricing" />
              </div>
              <div>
                <Label className="text-white/70">Target Customer</Label>
                <Textarea placeholder="Who are your customers?" className="bg-white/5 border-white/10 text-white mt-1" defaultValue="Enterprise ML teams at companies with 500+ employees. Primary buyers are VP of Engineering and Head of ML." />
              </div>
              <div>
                <Label className="text-white/70">Go-to-Market Strategy</Label>
                <Textarea placeholder="How will you acquire customers?" className="bg-white/5 border-white/10 text-white mt-1" defaultValue="Product-led growth with self-serve tier. Enterprise sales for larger contracts. Developer community and content marketing." />
              </div>
            </div>
          )}

          {/* Traction & Goals Step */}
          {currentStep === 5 && (
            <div className="space-y-4 max-w-md mx-auto">
              <div>
                <Label className="text-white/70">Current Traction</Label>
                <Textarea placeholder="Revenue, users, growth..." className="bg-white/5 border-white/10 text-white mt-1" defaultValue="$50K MRR, 15 paying customers, 3x growth QoQ. 500+ developers on waitlist." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/70">Funding Goal</Label>
                  <Input placeholder="$2M" className="bg-white/5 border-white/10 text-white mt-1" defaultValue="$3M" />
                </div>
                <div>
                  <Label className="text-white/70">Use of Funds</Label>
                  <Input placeholder="Hiring, growth..." className="bg-white/5 border-white/10 text-white mt-1" defaultValue="Engineering & Sales" />
                </div>
              </div>
              <div>
                <Label className="text-white/70">12-Month Goals</Label>
                <Textarea placeholder="Where will you be in a year?" className="bg-white/5 border-white/10 text-white mt-1" defaultValue="$500K ARR, 50 enterprise customers, Series A ready." />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
            <Button
              variant="ghost"
              onClick={goBack}
              disabled={currentStep === 0}
              className="text-white/60 hover:text-white disabled:opacity-30"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={goNext} className="bg-cyan-glow text-navy-deep hover:bg-cyan-bright">
              {currentStep === steps.length - 1 ? "View Dashboard" : "Next"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
