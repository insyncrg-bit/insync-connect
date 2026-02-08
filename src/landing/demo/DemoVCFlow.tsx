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
  Target,
  DollarSign,
  TrendingUp,
  Sparkles,
  SkipForward,
  MapPin,
  Eye,
  Heart,
  MessageSquare,
  FileText,
  Globe,
  Users,
} from "lucide-react";

// Demo steps for VC application
const steps = [
  { id: "welcome", title: "Welcome", icon: Sparkles },
  { id: "firm", title: "Firm Info", icon: Building2 },
  { id: "thesis", title: "Investment Thesis", icon: Target },
  { id: "criteria", title: "Investment Criteria", icon: DollarSign },
  { id: "focus", title: "Stage & Sector", icon: TrendingUp },
  { id: "support", title: "Portfolio Support", icon: Users },
];

// Mock startups for dashboard
const mockStartups = [
  {
    id: "startup-1",
    company_name: "NeuralFlow AI",
    founder_name: "Sarah Chen",
    location: "San Francisco, CA",
    stage: "Seed",
    vertical: "AI/ML Infrastructure",
    funding_goal: "$3M",
    description: "B2B SaaS platform enabling enterprises to deploy and manage ML models at scale with automated MLOps pipelines.",
    traction: "15 enterprise customers, $800K ARR",
  },
  {
    id: "startup-2",
    company_name: "ClimateLedger",
    founder_name: "Marcus Johnson",
    location: "Austin, TX",
    stage: "Pre-seed",
    vertical: "Climate Tech",
    funding_goal: "$1.5M",
    description: "Carbon credit verification platform using blockchain for transparent ESG reporting and compliance.",
    traction: "Pilot with 3 Fortune 500 companies",
  },
  {
    id: "startup-3",
    company_name: "MedSync Health",
    founder_name: "Priya Patel",
    location: "Boston, MA",
    stage: "Seed",
    vertical: "Digital Health",
    funding_goal: "$4M",
    description: "AI-powered clinical workflow automation reducing administrative burden for healthcare providers by 60%.",
    traction: "20 clinic partnerships, $500K ARR",
  },
  {
    id: "startup-4",
    company_name: "FinanceOS",
    founder_name: "David Kim",
    location: "New York, NY",
    stage: "Series A",
    vertical: "Fintech",
    funding_goal: "$10M",
    description: "Unified treasury management platform for mid-market companies with real-time cash flow visibility.",
    traction: "50+ customers, $2M ARR",
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

interface DemoVCFlowProps {
  onClose: () => void;
}

export const DemoVCFlow = ({ onClose }: DemoVCFlowProps) => {
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
              <span className="text-purple-400 text-sm font-medium px-2 py-1 bg-purple-500/10 rounded">VC Demo</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white/60 hover:text-white">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Demo VC Dashboard</h1>
            <p className="text-white/50">See how VCs discover and connect with startups</p>
          </div>

          {/* Thesis Card */}
          <Card className="bg-navy-card border border-white/10 p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Demo Ventures</h3>
                <p className="text-sm text-white/50">Pre-seed to Series A • B2B SaaS, AI/ML</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-purple-400">
              <FileText className="w-4 h-4 mr-2" />
              View Thesis
            </Button>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <Card className="bg-navy-card border border-white/10 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-4 h-4 text-purple-400" />
                <span className="text-2xl font-semibold text-white">2</span>
              </div>
              <p className="text-xs text-white/50">Interests</p>
            </Card>
            <Card className="bg-navy-card border border-white/10 p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-purple-400" />
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
                <span className="text-2xl font-semibold text-white">1</span>
              </div>
              <p className="text-xs text-white/50">Messages</p>
            </Card>
          </div>

          {/* Curated Startups */}
          <h2 className="text-xl font-semibold text-white mb-4">Curated Startups For You</h2>
          <div className="grid grid-cols-2 gap-4">
            {mockStartups.map((startup) => (
              <Card key={startup.id} className="bg-navy-card border border-white/10 p-5 hover:border-purple-500/30 transition-all cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{startup.company_name}</h4>
                    <p className="text-xs text-white/50 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {startup.location}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${getStageColor(startup.stage)}`}>
                    {startup.stage}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    {startup.vertical}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70 border border-white/10">
                    {startup.funding_goal}
                  </span>
                </div>
                <p className="text-sm text-white/60 mb-2 line-clamp-2">{startup.description}</p>
                <p className="text-xs text-cyan-glow mb-4">{startup.traction}</p>
                <div className="pt-3 border-t border-white/10 flex gap-2">
                  <Button size="sm" className="flex-1 bg-purple-500 text-white hover:bg-purple-600">
                    <Heart className="w-3 h-3 mr-1" />
                    Interest
                  </Button>
                  <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <FileText className="w-3 h-3 mr-1" />
                    Memo
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Exit Demo CTA */}
          <div className="mt-12 text-center">
            <p className="text-white/50 mb-4">Ready to discover your next portfolio company?</p>
            <Button onClick={onClose} className="bg-purple-500 text-white hover:bg-purple-600 font-semibold px-8">
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
            <span className="text-purple-400 text-sm font-medium px-2 py-1 bg-purple-500/10 rounded">VC Demo</span>
          </div>
          <Button onClick={skipToDashboard} variant="outline" size="sm" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
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
                      ? "bg-purple-500 text-white"
                      : isCompleted
                      ? "bg-purple-500/20 text-purple-400"
                      : "bg-white/10 text-white/40"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-1 ${isCompleted ? "bg-purple-500/50" : "bg-white/10"}`} />
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
              <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl text-white mb-4">Welcome to InSync!</h3>
              <p className="text-white/60 max-w-md mx-auto mb-6">
                This demo will walk you through our VC application process.
                Define your thesis to get matched with the right startups.
              </p>
              <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto text-left">
                <div className="p-3 bg-white/5 rounded-lg border border-purple-500/20">
                  <span className="text-purple-400 font-bold">THESIS</span>
                  <p className="text-xs text-white/50">Investment focus</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-purple-500/20">
                  <span className="text-purple-400 font-bold">CRITERIA</span>
                  <p className="text-xs text-white/50">Stage & check size</p>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-purple-500/20">
                  <span className="text-purple-400 font-bold">SUPPORT</span>
                  <p className="text-xs text-white/50">Portfolio value-add</p>
                </div>
              </div>
            </div>
          )}

          {/* Firm Info Step */}
          {currentStep === 1 && (
            <div className="space-y-4 max-w-md mx-auto">
              <div>
                <Label className="text-white/70">Firm Name</Label>
                <Input placeholder="Acme Ventures" className="bg-white/5 border-white/10 text-white mt-1" defaultValue="Demo Ventures" />
              </div>
              <div>
                <Label className="text-white/70">Website</Label>
                <Input placeholder="https://acmevc.com" className="bg-white/5 border-white/10 text-white mt-1" defaultValue="https://demoventures.vc" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/70">Fund Type</Label>
                  <Input placeholder="VC, Angel, etc." className="bg-white/5 border-white/10 text-white mt-1" defaultValue="Venture Capital" />
                </div>
                <div>
                  <Label className="text-white/70">HQ Location</Label>
                  <Input placeholder="San Francisco" className="bg-white/5 border-white/10 text-white mt-1" defaultValue="San Francisco, CA" />
                </div>
              </div>
              <div>
                <Label className="text-white/70">AUM (Assets Under Management)</Label>
                <Input placeholder="$50M" className="bg-white/5 border-white/10 text-white mt-1" defaultValue="$150M" />
              </div>
            </div>
          )}

          {/* Investment Thesis Step */}
          {currentStep === 2 && (
            <div className="space-y-4 max-w-md mx-auto">
              <div>
                <Label className="text-white/70">Investment Thesis</Label>
                <Textarea placeholder="Describe your investment focus..." className="bg-white/5 border-white/10 text-white mt-1 min-h-[100px]" defaultValue="We invest in technical founders building B2B software that becomes critical infrastructure. We focus on AI/ML, developer tools, and enterprise SaaS." />
              </div>
              <div>
                <Label className="text-white/70">Sub-themes (comma separated)</Label>
                <Input placeholder="AI, DevTools, SaaS" className="bg-white/5 border-white/10 text-white mt-1" defaultValue="MLOps, Developer Experience, Data Infrastructure" />
              </div>
              <div>
                <Label className="text-white/70">What signals get you excited?</Label>
                <Textarea placeholder="Strong technical team, early traction..." className="bg-white/5 border-white/10 text-white mt-1" defaultValue="Technical founders with deep domain expertise, early product-market fit signals, strong developer adoption" />
              </div>
            </div>
          )}

          {/* Investment Criteria Step */}
          {currentStep === 3 && (
            <div className="space-y-4 max-w-md mx-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/70">Minimum Check Size</Label>
                  <Input placeholder="$500K" className="bg-white/5 border-white/10 text-white mt-1" defaultValue="$500K" />
                </div>
                <div>
                  <Label className="text-white/70">Maximum Check Size</Label>
                  <Input placeholder="$3M" className="bg-white/5 border-white/10 text-white mt-1" defaultValue="$3M" />
                </div>
              </div>
              <div>
                <Label className="text-white/70">Lead or Follow?</Label>
                <Input placeholder="Lead, Follow, Both" className="bg-white/5 border-white/10 text-white mt-1" defaultValue="Lead or Co-lead preferred" />
              </div>
              <div>
                <Label className="text-white/70">Geographic Focus</Label>
                <Input placeholder="US, Global, etc." className="bg-white/5 border-white/10 text-white mt-1" defaultValue="US & Canada" />
              </div>
              <div>
                <Label className="text-white/70">Decision Timeline</Label>
                <Input placeholder="2-4 weeks" className="bg-white/5 border-white/10 text-white mt-1" defaultValue="2-3 weeks from first meeting" />
              </div>
            </div>
          )}

          {/* Stage & Sector Step */}
          {currentStep === 4 && (
            <div className="space-y-4 max-w-md mx-auto">
              <div>
                <Label className="text-white/70">Stage Focus</Label>
                <Input placeholder="Pre-seed, Seed, Series A" className="bg-white/5 border-white/10 text-white mt-1" defaultValue="Pre-seed, Seed" />
              </div>
              <div>
                <Label className="text-white/70">Sector Focus</Label>
                <Input placeholder="B2B SaaS, AI/ML, etc." className="bg-white/5 border-white/10 text-white mt-1" defaultValue="B2B SaaS, AI/ML, Developer Tools" />
              </div>
              <div>
                <Label className="text-white/70">Business Model Preference</Label>
                <Input placeholder="SaaS, Marketplace, etc." className="bg-white/5 border-white/10 text-white mt-1" defaultValue="SaaS, Usage-based" />
              </div>
              <div>
                <Label className="text-white/70">Hard No's (what you won't invest in)</Label>
                <Textarea placeholder="Industries or models you avoid" className="bg-white/5 border-white/10 text-white mt-1" defaultValue="Consumer apps, hardware-first, crypto/web3" />
              </div>
            </div>
          )}

          {/* Portfolio Support Step */}
          {currentStep === 5 && (
            <div className="space-y-4 max-w-md mx-auto">
              <div>
                <Label className="text-white/70">Operating Support Offered</Label>
                <Textarea placeholder="Recruiting, GTM, etc." className="bg-white/5 border-white/10 text-white mt-1 min-h-[80px]" defaultValue="Executive recruiting, GTM strategy, technical hiring, customer introductions, board participation" />
              </div>
              <div>
                <Label className="text-white/70">Support Style</Label>
                <Input placeholder="Hands-on, Available, etc." className="bg-white/5 border-white/10 text-white mt-1" defaultValue="Hands-on in first 12 months, then available as needed" />
              </div>
              <div>
                <Label className="text-white/70">Board Involvement</Label>
                <Input placeholder="Board seat, Observer, etc." className="bg-white/5 border-white/10 text-white mt-1" defaultValue="Board seat for leads, observer otherwise" />
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
            <Button onClick={goNext} className="bg-purple-500 text-white hover:bg-purple-600">
              {currentStep === steps.length - 1 ? "View Dashboard" : "Next"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
