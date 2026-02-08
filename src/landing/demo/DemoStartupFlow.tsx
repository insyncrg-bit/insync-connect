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
  Check,
  DollarSign,
  Globe,
  FileText,
  Upload,
  Plus,
  Trash2,
  CheckCircle,
  Map,
  Swords,
} from "lucide-react";
import syncsLogo from "@/landing/assets/infinity-logo-transparent.png";

// Demo steps for startup application - matches actual FounderApplication exactly
const STEPS = [
  { id: 0, title: "Welcome", icon: Sparkles },
  { id: 1, title: "Company Info", icon: Building2 },
  { id: 2, title: "Team & Overview", icon: Users },
  { id: 3, title: "Value Proposition", icon: Target },
  { id: 4, title: "Business Model", icon: Briefcase },
  { id: 5, title: "Go-to-Market", icon: TrendingUp },
  { id: 6, title: "Customer & Market", icon: Map },
  { id: 7, title: "Competitors", icon: Swords },
];

// Mock investors for dashboard - matches InvestorApplication interface
const mockInvestors = [
  {
    id: "inv-1",
    firm_name: "Horizon Ventures",
    firm_description: "Early-stage VC focused on B2B SaaS and developer tools.",
    hq_location: "San Francisco, CA",
    aum: "$150M",
    fund_type: "Early Stage VC",
    stage_focus: ["Pre-seed", "Seed"],
    sector_tags: ["Enterprise SaaS", "AI/ML"],
    check_sizes: ["$500K - $2M"],
    thesis_statement: "We invest in technical founders building software that becomes critical infrastructure for enterprises.",
    sub_themes: ["MLOps", "Developer Experience", "Data Infrastructure"],
    hard_nos: ["Consumer apps", "Hardware-only", "Pre-product companies"],
    operating_support: ["Executive hiring", "Sales strategy", "Fundraising prep"],
    lead_follow: "Lead",
  },
  {
    id: "inv-2",
    firm_name: "Climate Capital",
    firm_description: "Impact-focused fund investing in climate solutions.",
    hq_location: "New York, NY",
    aum: "$300M",
    fund_type: "Impact VC",
    stage_focus: ["Seed", "Series A"],
    sector_tags: ["Climate Tech", "Sustainability"],
    check_sizes: ["$1M - $5M"],
    thesis_statement: "We back founders building solutions to the climate crisis. Focus on carbon reduction and clean energy.",
    sub_themes: ["Carbon Capture", "Clean Energy", "Sustainable Supply Chain"],
    hard_nos: ["Fossil fuel adjacent", "Greenwashing"],
    operating_support: ["Policy & regulatory", "Impact measurement", "Strategic partnerships"],
    lead_follow: "Lead or Follow",
  },
  {
    id: "inv-3",
    firm_name: "HealthTech Partners",
    firm_description: "Healthcare-focused venture fund with deep clinical expertise.",
    hq_location: "Boston, MA",
    aum: "$200M",
    fund_type: "Sector-Focused VC",
    stage_focus: ["Seed"],
    sector_tags: ["Digital Health", "HealthTech"],
    check_sizes: ["$2M - $5M"],
    thesis_statement: "Investing in the future of healthcare. We partner with founders reimagining patient care.",
    sub_themes: ["Clinical Workflow", "Patient Engagement", "Health Data"],
    hard_nos: ["Consumer wellness", "No regulatory pathway"],
    operating_support: ["Clinical validation", "FDA strategy", "Health system intros"],
    lead_follow: "Lead",
  },
  {
    id: "inv-4",
    firm_name: "Fintech Foundry",
    firm_description: "Fintech-focused fund backing financial infrastructure.",
    hq_location: "Austin, TX",
    aum: "$80M",
    fund_type: "Early Stage VC",
    stage_focus: ["Pre-seed", "Seed"],
    sector_tags: ["Fintech", "Payments"],
    check_sizes: ["$500K - $1.5M"],
    thesis_statement: "We believe in democratizing financial services. Looking for founders building next-gen financial infrastructure.",
    sub_themes: ["Embedded Finance", "Banking Infrastructure", "B2B Payments"],
    hard_nos: ["Crypto speculation", "Consumer lending"],
    operating_support: ["Compliance guidance", "Bank partnerships", "Product strategy"],
    lead_follow: "Lead or Follow",
  },
];

// Demo data for interests (investors who want to sync with this startup)
const demoInterests = [
  {
    id: "int-1",
    firm_name: "Horizon Ventures",
    analyst_name: "Sarah Kim",
    analyst_title: "Associate",
    sync_note: "Your AI infrastructure approach is exactly what we look for. Would love to learn more about your technical roadmap.",
    created_at: "2 days ago",
  },
  {
    id: "int-2",
    firm_name: "Climate Capital",
    analyst_name: "Michael Chen",
    analyst_title: "Principal",
    sync_note: null,
    created_at: "5 days ago",
  },
];

// Demo data for syncs (mutual connections) - matches FounderDashboard structure
const demoSyncs = [
  {
    id: "sync-1",
    other_user_id: "demo-inv-3",
    firm_name: "HealthTech Partners",
    analyst_name: "Emily Wang",
    analyst_title: "Senior Associate",
    hq_location: "Boston, MA",
    stage_focus: ["Seed", "Series A"],
    sector_tags: ["Digital Health", "HealthTech"],
    synced_at: "1 week ago",
  },
  {
    id: "sync-2",
    other_user_id: "demo-inv-4",
    firm_name: "Enterprise Fund",
    analyst_name: "James Rodriguez",
    analyst_title: "Analyst",
    hq_location: "New York, NY",
    stage_focus: ["Pre-seed", "Seed"],
    sector_tags: ["Enterprise SaaS", "B2B"],
    synced_at: "2 weeks ago",
  },
];

// Demo data for pending requests (outgoing) - matches FounderDashboard structure
const demoPending = [
  {
    id: "pend-1",
    target_user_id: "demo-inv-5",
    firm_name: "DeepTech Ventures",
    hq_location: "Palo Alto, CA",
    stage_focus: ["Seed", "Series A"],
    sector_tags: ["AI/ML", "Developer Tools"],
    sync_note: "Impressed by your portfolio in AI infrastructure. Would love to discuss how our platform fits your thesis.",
    sent_at: "1 day ago",
  },
];

// Demo messages - matches FounderDashboard structure with message history
const demoMessages = [
  {
    id: "msg-1",
    other_user_id: "demo-inv-3",
    other_user_name: "Emily Wang",
    other_user_company: "HealthTech Partners",
    last_message: "Looking forward to our call next week!",
    last_message_time: "2 hours ago",
    unread_count: 2,
    messages: [
      { id: "m1", sender: "other" as const, content: "Hi! Thanks for connecting. I reviewed your deck and have some questions.", timestamp: "2 days ago" },
      { id: "m2", sender: "self" as const, content: "Great to hear from you! Happy to answer any questions.", timestamp: "1 day ago" },
      { id: "m3", sender: "other" as const, content: "Would you be available for a 30-min call next Tuesday?", timestamp: "4 hours ago" },
      { id: "m4", sender: "self" as const, content: "Tuesday works! How about 2pm PT?", timestamp: "3 hours ago" },
      { id: "m5", sender: "other" as const, content: "Looking forward to our call next week!", timestamp: "2 hours ago" },
    ],
  },
  {
    id: "msg-2",
    other_user_id: "demo-inv-4",
    other_user_name: "James Rodriguez",
    other_user_company: "Enterprise Fund",
    last_message: "Sent over the term sheet. Let me know your thoughts.",
    last_message_time: "1 day ago",
    unread_count: 1,
    messages: [
      { id: "m1", sender: "other" as const, content: "Sent over the term sheet. Let me know your thoughts.", timestamp: "1 day ago" },
    ],
  },
  {
    id: "msg-3",
    other_user_id: "demo-inv-5",
    other_user_name: "Lisa Park",
    other_user_company: "Fintech Foundry",
    last_message: "Thanks for the intro!",
    last_message_time: "3 days ago",
    unread_count: 0,
    messages: [
      { id: "m1", sender: "self" as const, content: "Hi Lisa, great connecting with you at the conference!", timestamp: "4 days ago" },
      { id: "m2", sender: "other" as const, content: "Thanks for the intro!", timestamp: "3 days ago" },
    ],
  },
];

// Demo startup memo data
// Demo startup memo data - matches FounderApplication structure
const demoMemo = {
  company_name: "Demo Startup",
  vertical: "AI/ML Infrastructure",
  stage: "Seed",
  location: "San Francisco, CA",
  funding_goal: "$3M",
  website: "https://demostartup.com",
  description: "We're building an ML deployment platform for enterprise teams to solve the complexity of taking models from prototype to production.",
  problem: "90% of ML models never make it to production due to infrastructure complexity.",
  solution: "One-click deployment with automated scaling, monitoring, and rollback capabilities.",
  business_model: "B2B SaaS with usage-based pricing. Average contract value of $40K/year with 120% net revenue retention.",
  traction: "$50K MRR, 15 enterprise customers, 3x growth QoQ",
  team: [
    { name: "Demo Founder", role: "CEO", background: "Ex-Google ML Engineer" },
    { name: "Jane Smith", role: "CTO", background: "Ex-AWS, 10 years ML infra" },
  ],
};

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

  // Modal states
  const [showMemoModal, setShowMemoModal] = useState(false);
  const [showInterestsModal, setShowInterestsModal] = useState(false);
  const [showSyncsModal, setShowSyncsModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [showInvestorModal, setShowInvestorModal] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState<typeof mockInvestors[0] | null>(null);

  const goNext = () => {
    if (currentStep < 7) {
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

        <div className="container mx-auto px-4 py-8 max-w-6xl space-y-10">
          {/* Welcome Section - Prominent (matches FounderDashboard) */}
          <div>
            <h1 className="text-4xl font-bold text-white">
              Welcome, {demoMemo.company_name}!
            </h1>
          </div>

          {/* Memo Quick Access - Larger (matches FounderDashboard) */}
          <Card
            className="bg-navy-card border-white/10 p-6 shadow-[0_0_20px_rgba(6,182,212,0.12)] hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:border-[hsl(var(--cyan-glow))]/50 transition-all duration-300 cursor-pointer"
            onClick={() => setShowMemoModal(true)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                  <Building2 className="h-7 w-7 text-[hsl(var(--cyan-glow))]" />
                </div>
                <div>
                  <p className="text-xl font-semibold text-white">{demoMemo.company_name}'s Memo</p>
                  <p className="text-sm text-white/60">{demoMemo.vertical} • {demoMemo.stage}</p>
                </div>
              </div>
              <ArrowRight className="h-6 w-6 text-white/60" />
            </div>
          </Card>

          {/* Stats - Larger with horizontal layout (matches FounderDashboard exactly) */}
          <div className="grid grid-cols-4 gap-4">
            <Card
              className="bg-navy-card border-white/10 p-6 shadow-[0_0_20px_rgba(6,182,212,0.12)] hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:border-[hsl(var(--cyan-glow))]/50 transition-all duration-300 cursor-pointer"
              onClick={() => setShowInterestsModal(true)}
            >
              <div className="flex items-center gap-4">
                <Heart className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
                <p className="text-3xl font-bold text-white">{demoInterests.length}</p>
                <p className="text-base text-white/60">Interests</p>
              </div>
            </Card>
            <Card
              className="bg-navy-card border-white/10 p-6 shadow-[0_0_20px_rgba(6,182,212,0.12)] hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:border-[hsl(var(--cyan-glow))]/50 transition-all duration-300 cursor-pointer"
              onClick={() => setShowSyncsModal(true)}
            >
              <div className="flex items-center gap-4">
                <img src={syncsLogo} alt="Syncs" className="h-12 w-20 object-contain" />
                <p className="text-3xl font-bold text-white">{demoSyncs.length}</p>
                <p className="text-base text-white/60">Syncs</p>
              </div>
            </Card>
            <Card
              className="bg-navy-card border-white/10 p-6 shadow-[0_0_20px_rgba(6,182,212,0.12)] hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:border-[hsl(var(--cyan-glow))]/50 transition-all duration-300 cursor-pointer"
              onClick={() => setShowPendingModal(true)}
            >
              <div className="flex items-center gap-4">
                <Eye className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
                <p className="text-3xl font-bold text-white">{demoPending.length}</p>
                <p className="text-base text-white/60">Pending</p>
              </div>
            </Card>
            <Card
              className="bg-navy-card border-white/10 p-6 shadow-[0_0_20px_rgba(6,182,212,0.12)] hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:border-[hsl(var(--cyan-glow))]/50 transition-all duration-300 cursor-pointer"
              onClick={() => setShowMessagesModal(true)}
            >
              <div className="flex items-center gap-4">
                <MessageSquare className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
                <p className="text-3xl font-bold text-white">{demoMessages.reduce((acc, m) => acc + m.unread_count, 0)}</p>
                <p className="text-base text-white/60">Messages</p>
              </div>
            </Card>
          </div>

          {/* Curated Investors - Clean section (matches FounderDashboard exactly) */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-white">Curated Investors</h2>
              <button className="text-sm text-[hsl(var(--cyan-glow))] hover:underline flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockInvestors.slice(0, 3).map((investor) => (
                <Card key={investor.id} className="bg-navy-card border-white/10 p-5 shadow-[0_0_15px_rgba(6,182,212,0.08)] hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] hover:border-[hsl(var(--cyan-glow))]/40 transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white group-hover:text-[hsl(var(--cyan-glow))] transition-colors">
                          {investor.firm_name}
                        </h4>
                        <p className="text-xs text-white/60 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {investor.hq_location}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {investor.stage_focus.slice(0, 1).map((stage, i) => (
                      <span key={i} className={`text-xs px-2 py-0.5 rounded-full ${getStageColor(stage)}`}>
                        {stage}
                      </span>
                    ))}
                    {investor.sector_tags.slice(0, 1).map((sector, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))]">
                        {sector}
                      </span>
                    ))}
                    {investor.check_sizes.length > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                        {investor.check_sizes[0]}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-white/60 mb-4 line-clamp-2">
                    {investor.thesis_statement || investor.firm_description || "Investment thesis available"}
                  </p>

                  <div className="pt-3 border-t border-white/10">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-[hsl(var(--cyan-glow))] hover:bg-[hsl(var(--cyan-glow))]/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInvestor(investor);
                        setShowInvestorModal(true);
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Profile
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Exit Demo CTA */}
          <div className="mt-12 text-center">
            <p className="text-white/50 mb-4">Ready to find your perfect investor match?</p>
            <Button onClick={onClose} className="bg-[hsl(var(--cyan-glow))] text-navy-deep hover:bg-cyan-bright font-semibold px-8">
              Exit Demo
            </Button>
          </div>
        </div>

        {/* ========== MODALS (All matching FounderDashboard patterns) ========== */}

        {/* Memo Modal - matches MemoEditor component style */}
        {showMemoModal && (
          <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4" onClick={() => setShowMemoModal(false)}>
            <Card className="bg-navy-card border-white/10 w-full max-w-2xl max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">{demoMemo.company_name}'s Memo</h2>
                    <p className="text-sm text-white/60">{demoMemo.vertical} • {demoMemo.stage}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowMemoModal(false)} className="text-white/60 hover:text-white">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-xs text-white/50 mb-1">Location</p>
                    <p className="text-sm text-white flex items-center gap-1"><MapPin className="h-3 w-3" /> {demoMemo.location}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-xs text-white/50 mb-1">Raising</p>
                    <p className="text-sm text-white flex items-center gap-1"><DollarSign className="h-3 w-3" /> {demoMemo.funding_goal}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-xs text-white/50 mb-1">Website</p>
                    <p className="text-sm text-[hsl(var(--cyan-glow))] flex items-center gap-1"><Globe className="h-3 w-3" /> {demoMemo.website}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white/70 mb-2">Overview</h3>
                  <p className="text-white/80">{demoMemo.description}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white/70 mb-2">Problem</h3>
                  <p className="text-white/80">{demoMemo.problem}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white/70 mb-2">Solution</h3>
                  <p className="text-white/80">{demoMemo.solution}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white/70 mb-2">Business Model</h3>
                  <p className="text-white/80">{demoMemo.business_model}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white/70 mb-2">Traction</h3>
                  <p className="text-white/80">{demoMemo.traction}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white/70 mb-2">Team</h3>
                  <div className="space-y-2">
                    {demoMemo.team.map((member, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-[hsl(var(--cyan-glow))]/20 flex items-center justify-center">
                          <Users className="h-4 w-4 text-[hsl(var(--cyan-glow))]" />
                        </div>
                        <div>
                          <p className="text-sm text-white">{member.name} • {member.role}</p>
                          <p className="text-xs text-white/50">{member.background}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Interests Modal - matches InterestsModal component from FounderDashboard */}
        {showInterestsModal && (
          <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4" onClick={() => setShowInterestsModal(false)}>
            <Card className="bg-navy-card border-white/10 w-full max-w-lg max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Incoming Interests</h2>
                    <p className="text-sm text-white/60">Investors who want to connect with you</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowInterestsModal(false)} className="text-white/60 hover:text-white">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="p-4 space-y-3">
                {demoInterests.length === 0 ? (
                  <div className="text-center py-8 text-white/50">
                    <Heart className="h-8 w-8 mx-auto mb-3 opacity-50" />
                    <p>No incoming interests yet</p>
                  </div>
                ) : (
                  demoInterests.map((interest) => (
                    <div key={interest.id} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-[hsl(var(--cyan-glow))]/30 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{interest.firm_name}</p>
                            <p className="text-xs text-white/50">{interest.analyst_name} • {interest.analyst_title}</p>
                          </div>
                        </div>
                        <span className="text-xs text-white/40">{interest.created_at}</span>
                      </div>
                      {interest.sync_note && (
                        <div className="mb-3 p-3 bg-white/5 rounded-lg">
                          <p className="text-sm text-white/70 italic">"{interest.sync_note}"</p>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 bg-[hsl(var(--cyan-glow))] text-navy-deep hover:bg-cyan-bright">
                          <Check className="h-4 w-4 mr-1" /> Accept
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">
                          Decline
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Syncs Modal - matches SyncsModal from FounderDashboard */}
        {showSyncsModal && (
          <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4" onClick={() => setShowSyncsModal(false)}>
            <Card className="bg-navy-card border-white/10 w-full max-w-lg max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                    <img src={syncsLogo} alt="Syncs" className="h-6 w-10 object-contain" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Active Syncs</h2>
                    <p className="text-sm text-white/60">Your mutual connections</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowSyncsModal(false)} className="text-white/60 hover:text-white">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="p-4 space-y-3">
                {demoSyncs.map((sync) => (
                  <div key={sync.id} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-[hsl(var(--cyan-glow))]/30 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{sync.firm_name}</p>
                          <p className="text-xs text-white/50">{sync.analyst_name} • {sync.analyst_title}</p>
                        </div>
                      </div>
                      <span className="text-xs text-white/40">Synced {sync.synced_at}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/50 mb-3">
                      <MapPin className="h-3 w-3" />
                      {sync.hq_location}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {sync.stage_focus.map((stage, i) => (
                        <span key={i} className={`text-xs px-2 py-0.5 rounded-full ${getStageColor(stage)}`}>
                          {stage}
                        </span>
                      ))}
                      {sync.sector_tags.map((tag, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))]">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 border-[hsl(var(--cyan-glow))]/30 text-[hsl(var(--cyan-glow))] hover:bg-[hsl(var(--cyan-glow))]/10">
                        <Eye className="h-4 w-4 mr-1" /> View Profile
                      </Button>
                      <Button size="sm" className="flex-1 bg-[hsl(var(--cyan-glow))] text-navy-deep hover:bg-cyan-bright">
                        <MessageSquare className="h-4 w-4 mr-1" /> Message
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Pending Modal - matches PendingModal from FounderDashboard */}
        {showPendingModal && (
          <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4" onClick={() => setShowPendingModal(false)}>
            <Card className="bg-navy-card border-white/10 w-full max-w-lg max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                    <Eye className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Pending Requests</h2>
                    <p className="text-sm text-white/60">Your outgoing sync requests</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowPendingModal(false)} className="text-white/60 hover:text-white">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="p-4 space-y-3">
                {demoPending.map((pending) => (
                  <div key={pending.id} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-[hsl(var(--cyan-glow))]/30 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{pending.firm_name}</p>
                          <p className="text-xs text-white/50 flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {pending.hq_location}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-white/40">Sent {pending.sent_at}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {pending.stage_focus.map((stage, i) => (
                        <span key={i} className={`text-xs px-2 py-0.5 rounded-full ${getStageColor(stage)}`}>
                          {stage}
                        </span>
                      ))}
                      {pending.sector_tags.map((tag, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))]">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {pending.sync_note && (
                      <div className="mb-3 p-3 bg-white/5 rounded-lg">
                        <p className="text-sm text-white/70 italic">"{pending.sync_note}"</p>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 border-[hsl(var(--cyan-glow))]/30 text-[hsl(var(--cyan-glow))] hover:bg-[hsl(var(--cyan-glow))]/10">
                        <Eye className="h-4 w-4 mr-1" /> View Profile
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 border-white/20 text-white/60 hover:bg-white/10">
                        Cancel Request
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Messages Modal - matches MessagesModal from FounderDashboard */}
        {showMessagesModal && (
          <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4" onClick={() => setShowMessagesModal(false)}>
            <Card className="bg-navy-card border-white/10 w-full max-w-lg max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Messages</h2>
                    <p className="text-sm text-white/60">Your conversations</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowMessagesModal(false)} className="text-white/60 hover:text-white">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="divide-y divide-white/10">
                {demoMessages.map((msg) => (
                  <div key={msg.id} className={`p-4 hover:bg-white/5 cursor-pointer transition-colors ${msg.unread_count > 0 ? 'bg-[hsl(var(--cyan-glow))]/5' : ''}`}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-white">{msg.other_user_company}</p>
                          <span className="text-xs text-white/40">{msg.last_message_time}</span>
                        </div>
                        <p className="text-xs text-white/50 mb-1">{msg.other_user_name}</p>
                        <p className="text-sm text-white/70 truncate">{msg.last_message}</p>
                        {msg.unread_count > 0 && (
                          <div className="mt-2 flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-[hsl(var(--cyan-glow))]" />
                            <span className="text-xs text-[hsl(var(--cyan-glow))]">{msg.unread_count} new</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Investor Profile Modal - matches InvestorProfileModal from FounderDashboard */}
        {showInvestorModal && selectedInvestor && (
          <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4" onClick={() => setShowInvestorModal(false)}>
            <Card className="bg-navy-card border-white/10 w-full max-w-2xl max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">{selectedInvestor.firm_name}</h2>
                    <p className="text-sm text-white/60 flex items-center gap-1"><MapPin className="h-3 w-3" /> {selectedInvestor.hq_location}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowInvestorModal(false)} className="text-white/60 hover:text-white">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="p-6 space-y-6">
                {/* Fund Info */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-xs text-white/50 mb-1">AUM</p>
                    <p className="text-sm text-white flex items-center gap-1"><DollarSign className="h-3 w-3" /> {selectedInvestor.aum}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-xs text-white/50 mb-1">Fund Type</p>
                    <p className="text-sm text-white">{selectedInvestor.fund_type}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg">
                    <p className="text-xs text-white/50 mb-1">Check Size</p>
                    <p className="text-sm text-white">{selectedInvestor.check_sizes[0]}</p>
                  </div>
                </div>

                {/* Stage & Sector Tags */}
                <div className="flex flex-wrap gap-2">
                  {selectedInvestor.stage_focus.map((stage, i) => (
                    <span key={i} className={`text-xs px-3 py-1 rounded-full ${getStageColor(stage)}`}>{stage}</span>
                  ))}
                  {selectedInvestor.sector_tags.map((tag, i) => (
                    <span key={i} className="text-xs px-3 py-1 rounded-full bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))]">{tag}</span>
                  ))}
                </div>

                {/* Investment Thesis */}
                <div>
                  <h3 className="text-sm font-medium text-white/70 mb-2">Investment Thesis</h3>
                  <p className="text-white/80">{selectedInvestor.thesis_statement}</p>
                </div>

                {/* Sub-themes */}
                {selectedInvestor.sub_themes && selectedInvestor.sub_themes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-white/70 mb-2">Sub-themes We're Prioritizing</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedInvestor.sub_themes.map((theme, i) => (
                        <span key={i} className="px-3 py-1 bg-[hsl(var(--cyan-glow))]/20 text-[hsl(var(--cyan-glow))] rounded-full text-sm">{theme}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hard No's */}
                {selectedInvestor.hard_nos && selectedInvestor.hard_nos.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-white/70 mb-2">Hard No's</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedInvestor.hard_nos.map((no, i) => (
                        <span key={i} className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-sm">{no}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Operating Support */}
                {selectedInvestor.operating_support && selectedInvestor.operating_support.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-white/70 mb-2">Operating Support</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedInvestor.operating_support.map((support, i) => (
                        <span key={i} className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm">{support}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lead/Follow */}
                {selectedInvestor.lead_follow && (
                  <div className="p-3 bg-white/5 rounded-lg inline-block">
                    <p className="text-xs text-white/50 mb-1">Investment Style</p>
                    <p className="text-sm text-white">{selectedInvestor.lead_follow}</p>
                  </div>
                )}

                <div className="pt-4 border-t border-white/10">
                  <Button className="w-full bg-[hsl(var(--cyan-glow))] text-navy-deep hover:bg-cyan-bright">
                    <Heart className="h-4 w-4 mr-2" />
                    Request to Sync
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    );
  }

  // Application Flow View - matches FounderApplication.tsx exactly
  return (
    <div className="fixed inset-0 z-50 overflow-auto" style={{ background: "var(--gradient-navy-teal)" }}>
      {/* Decorative Elements - matching FounderApplication */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] border border-[hsl(var(--cyan-glow))]/30 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] border border-[hsl(var(--cyan-glow))]/20 rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Header with demo controls */}
      <div className="sticky top-0 z-10 bg-[hsl(var(--navy-deep))]/80 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white/60 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Exit Demo
            </Button>
            <div className="h-6 w-px bg-white/20" />
            <span className="text-[hsl(var(--cyan-glow))] text-sm font-medium px-2 py-1 bg-[hsl(var(--cyan-glow))]/10 rounded">Startup Demo</span>
          </div>
          <Button onClick={skipToDashboard} variant="outline" size="sm" className="border-[hsl(var(--cyan-glow))]/30 text-[hsl(var(--cyan-glow))] hover:bg-[hsl(var(--cyan-glow))]/10">
            <SkipForward className="w-4 h-4 mr-2" />
            Skip to Dashboard
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-8 pb-16 relative z-10">
        <div className="container max-w-4xl mx-auto px-4 md:px-6">
          <div className="space-y-8">
            {/* Header Section - matching FounderApplication */}
            <div className="text-center space-y-4">
              <div className="inline-block px-6 py-2 bg-white/10 backdrop-blur-sm border border-[hsl(var(--cyan-glow))]/30 rounded-full text-sm font-medium text-[hsl(var(--cyan-glow))]">
                IN-SYNC | FOUNDER APPLICATION
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Startup Memo
              </h1>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                Help us understand the what, why, and how of your company so we can match you with the right investors.
              </p>
            </div>

            {/* Progress Steps - Desktop - matching FounderApplication */}
            <div className="hidden md:flex items-center justify-between bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
              {STEPS.map((step) => {
                const Icon = step.icon;
                const isCompleted = step.id < currentStep;
                const isCurrent = currentStep === step.id;

                return (
                  <button
                    key={step.id}
                    className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all ${
                      isCurrent ? "bg-white/20" :
                      step.id <= currentStep ? "hover:bg-white/10 cursor-pointer" : "cursor-not-allowed opacity-50"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isCompleted ? "bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))]" :
                      isCurrent ? "bg-white text-[hsl(var(--navy-deep))]" :
                      "bg-white/20 text-white/60"
                    }`}>
                      {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <span className={`text-xs font-medium ${isCurrent ? "text-white" : "text-white/60"}`}>
                      {step.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Progress - matching FounderApplication */}
            <div className="md:hidden flex items-center justify-between bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
              <span className="text-white font-medium">Step {currentStep + 1} of 8</span>
              <span className="text-white/70 text-sm">{STEPS[currentStep].title}</span>
            </div>

            {/* Form Card - matching FounderApplication */}
            <div className="bg-white/95 backdrop-blur-sm border-2 border-[hsl(var(--cyan-glow))]/20 rounded-2xl p-8 md:p-10 shadow-2xl">
              {/* Welcome Step - matching FounderApplication case 0 */}
              {currentStep === 0 && (
                <div className="space-y-8">
                  <div className="text-center space-y-6">
                    <h2 className="text-3xl font-bold text-[hsl(var(--navy-deep))]">Welcome</h2>
                    <p className="text-lg text-[hsl(var(--navy-deep))]/80 max-w-2xl mx-auto">
                      Help us understand the <strong>what</strong>, <strong>why</strong>, and <strong>how</strong> of your company so we can match you with the right investors.
                    </p>
                  </div>

                  <div className="bg-[hsl(var(--cyan-glow))]/10 border border-[hsl(var(--cyan-glow))]/30 rounded-xl p-6 space-y-4">
                    <p className="text-[hsl(var(--navy-deep))]/80">
                      This application is structured so that, by the end, you will have effectively written an <strong>investor-ready memo</strong>.
                    </p>
                    <p className="text-[hsl(var(--navy-deep))]/70">Every question helps us understand:</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-5 bg-white border border-[hsl(var(--cyan-glow))]/20 rounded-xl">
                      <div className="text-2xl font-bold text-[hsl(var(--cyan-glow))] mb-2">WHAT</div>
                      <p className="text-[hsl(var(--navy-deep))]/70">The problem you're solving</p>
                    </div>
                    <div className="p-5 bg-white border border-[hsl(var(--cyan-glow))]/20 rounded-xl">
                      <div className="text-2xl font-bold text-[hsl(var(--cyan-glow))] mb-2">WHY</div>
                      <p className="text-[hsl(var(--navy-deep))]/70">Motivation, urgency, vision</p>
                    </div>
                    <div className="p-5 bg-white border border-[hsl(var(--cyan-glow))]/20 rounded-xl">
                      <div className="text-2xl font-bold text-[hsl(var(--cyan-glow))] mb-2">HOW</div>
                      <p className="text-[hsl(var(--navy-deep))]/70">Solution & business model</p>
                    </div>
                    <div className="p-5 bg-white border border-[hsl(var(--cyan-glow))]/20 rounded-xl">
                      <div className="text-2xl font-bold text-[hsl(var(--cyan-glow))] mb-2">METRIC</div>
                      <p className="text-[hsl(var(--navy-deep))]/70">Proof, behavior, traction</p>
                    </div>
                  </div>

                  <p className="text-sm text-[hsl(var(--navy-deep))]/60 text-center italic">
                    Your answers will be kept confidential and only shared with approved investors.
                  </p>
                </div>
              )}

          {/* Company Info Step */}
          {currentStep === 1 && (
            <div className="space-y-6 max-w-lg mx-auto">
              {/* Logo Upload */}
              <div className="space-y-2">
                <Label className="font-medium">Company Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg border-2 border-dashed border-[hsl(var(--navy-deep))]/20 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-[hsl(var(--navy-deep))]/40" />
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      Upload Logo
                    </Button>
                    <p className="text-xs text-[hsl(var(--navy-deep))]/50 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              </div>

              {/* Pitch Deck Upload */}
              <div className="space-y-2">
                <Label className="font-medium">Pitch Deck (Optional)</Label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg border-2 border-dashed border-[hsl(var(--navy-deep))]/20 flex items-center justify-center">
                    <div className="text-center">
                      <CheckCircle className="w-5 h-5 text-[hsl(var(--cyan-glow))] mx-auto mb-1" />
                      <p className="text-[10px] text-[hsl(var(--navy-deep))]/70 truncate max-w-[70px]">pitch.pdf</p>
                    </div>
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      Replace Pitch Deck
                    </Button>
                    <p className="text-xs text-[hsl(var(--navy-deep))]/50 mt-1">PDF up to 20MB</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Company Name *</Label>
                  <Input placeholder="Acme Inc." className="mt-1" defaultValue="Demo Startup" />
                </div>
                <div>
                  <Label>Website</Label>
                  <Input placeholder="https://example.com" className="mt-1" defaultValue="https://demostartup.com" />
                </div>
              </div>

              <div>
                <Label>LinkedIn</Label>
                <Input placeholder="Company LinkedIn URL" className="mt-1" defaultValue="https://linkedin.com/company/demostartup" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Vertical *</Label>
                  <div className="mt-1 p-2.5 bg-white border border-[hsl(var(--navy-deep))]/10 rounded-md text-[hsl(var(--navy-deep))] text-sm cursor-pointer hover:border-[hsl(var(--cyan-glow))]/50 transition-colors">
                    AI / Machine Learning
                  </div>
                </div>
                <div>
                  <Label>Stage *</Label>
                  <div className="mt-1 p-2.5 bg-white border border-[hsl(var(--navy-deep))]/10 rounded-md text-[hsl(var(--navy-deep))] text-sm cursor-pointer hover:border-[hsl(var(--cyan-glow))]/50 transition-colors">
                    Seed
                  </div>
                </div>
              </div>

              <div>
                <Label>Headquarters *</Label>
                <Input placeholder="City, State/Country" className="mt-1" defaultValue="San Francisco, CA" />
              </div>

              {/* Your Information Section */}
              <div className="pt-4 border-t border-[hsl(var(--navy-deep))]/10 space-y-4">
                <div>
                  <Label className="text-base font-semibold">1.2 Your Information</Label>
                  <p className="text-xs text-[hsl(var(--navy-deep))]/60">Primary contact for this application</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Your Name *</Label>
                    <Input placeholder="Full name" className="mt-1" defaultValue="Demo Founder" />
                  </div>
                  <div>
                    <Label>Your Email *</Label>
                    <Input type="email" placeholder="you@company.com" className="mt-1" defaultValue="founder@demostartup.com" />
                    <p className="text-xs text-[hsl(var(--cyan-glow))] mt-1 italic">This email will be used to log in and access your dashboard.</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Create Password *</Label>
                    <Input type="password" placeholder="••••••••" className="mt-1" defaultValue="password123" />
                    <div className="text-xs text-[hsl(var(--navy-deep))]/60 mt-1 space-y-0.5">
                      <p>Password must contain:</p>
                      <ul className="list-disc list-inside text-[hsl(var(--cyan-glow))]">
                        <li>At least 8 characters</li>
                        <li>One uppercase letter</li>
                        <li>One lowercase letter</li>
                        <li>One number</li>
                      </ul>
                    </div>
                  </div>
                  <div>
                    <Label>Confirm Password *</Label>
                    <Input type="password" placeholder="••••••••" className="mt-1" defaultValue="password123" />
                    <p className="text-xs text-[hsl(var(--cyan-glow))] mt-1">✓ Passwords match</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Team & Overview Step */}
          {currentStep === 2 && (
            <div className="space-y-6 max-w-lg mx-auto">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-[hsl(var(--navy-deep))]">Section 1 — Your Team & Company Overview</h3>
                <p className="text-[hsl(var(--navy-deep))]/70 text-sm">Who's building this and what does the company do?</p>
              </div>

              {/* 1.1 Company Overview */}
              <div className="space-y-3">
                <div>
                  <Label className="text-base font-semibold">1.1 Tell us about your company</Label>
                  <p className="text-xs text-[hsl(var(--navy-deep))]/60 mt-1">One paragraph that clearly explains what your company does, the problem it solves, and who it's for. This is your pitch.</p>
                </div>
                <Textarea
                  placeholder="We're building [what] for [who] to solve [problem]. Currently, [pain point]. Our solution [how it works] which results in [outcome]..."
                  className="min-h-[120px]"
                  defaultValue="We're building an ML deployment platform for enterprise teams to solve the complexity of taking models from prototype to production. Currently, 90% of ML models never make it to production due to infrastructure complexity. Our solution provides one-click deployment with automated scaling, monitoring, and rollback capabilities, resulting in 10x faster time-to-production."
                />
                <p className="text-xs text-[hsl(var(--cyan-glow))]">52 / 30-100 words</p>
              </div>

              {/* 1.2 Team Members */}
              <div className="space-y-3">
                <div>
                  <Label className="text-base font-semibold">1.2 Team Members</Label>
                  <p className="text-xs text-[hsl(var(--navy-deep))]/60 mt-1">Add your founding team and key hires</p>
                </div>

                {/* Team Member 1 */}
                <div className="p-4 border border-[hsl(var(--navy-deep))]/10 rounded-lg bg-white space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="font-medium">Team Member 1</Label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Name</Label>
                      <Input placeholder="Full name" className="mt-1" defaultValue="Demo Founder" />
                    </div>
                    <div>
                      <Label className="text-xs">Role *</Label>
                      <Input placeholder="e.g., CEO, CTO" className="mt-1" defaultValue="CEO" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">LinkedIn</Label>
                      <Input placeholder="LinkedIn URL" className="mt-1" defaultValue="linkedin.com/in/demofounder" />
                    </div>
                    <div>
                      <Label className="text-xs">Background</Label>
                      <Input placeholder="Previous experience" className="mt-1" defaultValue="Ex-Google ML Engineer" />
                    </div>
                  </div>
                </div>

                {/* Team Member 2 */}
                <div className="p-4 border border-[hsl(var(--navy-deep))]/10 rounded-lg bg-white space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="font-medium">Team Member 2</Label>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-[hsl(var(--navy-deep))] hover:bg-muted h-8 w-8 p-0">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Name</Label>
                      <Input placeholder="Full name" className="mt-1" defaultValue="Jane Smith" />
                    </div>
                    <div>
                      <Label className="text-xs">Role *</Label>
                      <Input placeholder="e.g., CEO, CTO" className="mt-1" defaultValue="CTO" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">LinkedIn</Label>
                      <Input placeholder="LinkedIn URL" className="mt-1" defaultValue="linkedin.com/in/janesmith" />
                    </div>
                    <div>
                      <Label className="text-xs">Background</Label>
                      <Input placeholder="Previous experience" className="mt-1" defaultValue="Ex-AWS, 10 years ML infra" />
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full border-dashed">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
              </div>
            </div>
          )}

          {/* Value Proposition Step */}
          {currentStep === 3 && (
            <div className="space-y-6 max-w-lg mx-auto">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-[hsl(var(--navy-deep))]">Section 2 — Value Proposition</h3>
                <p className="text-[hsl(var(--navy-deep))]/70 text-sm">What value do you deliver and why does it matter?</p>
              </div>

              {/* 2.1 Current Pain Point */}
              <div className="space-y-3">
                <div>
                  <Label className="text-base font-semibold">2.1 What problem are you solving?</Label>
                  <p className="text-xs text-[hsl(var(--navy-deep))]/60 mt-1">Describe the core pain point your target customer faces. Be specific — vague problems lead to vague solutions.</p>
                </div>
                <Textarea
                  placeholder="Today, [target customer] struggles with [specific problem]. This happens because [root cause]. The impact is [consequence]..."
                  className="min-h-[100px]"
                  defaultValue="Today, enterprise ML teams struggle with deploying models to production. This happens because existing infrastructure requires extensive DevOps knowledge and manual configuration. The impact is 90% of models never make it past prototype, costing companies millions in unrealized value."
                />
                <p className="text-xs text-[hsl(var(--cyan-glow))]">42 / 20-100 words</p>
              </div>

              {/* 2.2 Value Drivers */}
              <div className="space-y-3">
                <div>
                  <Label className="text-base font-semibold">2.2 How do you deliver value?</Label>
                  <p className="text-xs text-[hsl(var(--navy-deep))]/60 mt-1">Select all the ways your solution delivers value to customers. For each selection, you'll explain how.</p>
                </div>

                {/* Value Driver - True Scalability (Expanded) */}
                <div className="p-4 border border-[hsl(var(--cyan-glow))] bg-[hsl(var(--cyan-glow))]/10 rounded-lg cursor-pointer transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded border-2 border-[hsl(var(--cyan-glow))] bg-[hsl(var(--cyan-glow))] flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-[hsl(var(--navy-deep))]" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-[hsl(var(--navy-deep))]">True Scalability</div>
                      <div className="text-sm text-[hsl(var(--navy-deep))]/60">Making life easier, more efficient, or intuitive</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[hsl(var(--navy-deep))]/10">
                    <Textarea
                      placeholder="Explain how your solution makes life easier, more efficient, or more intuitive..."
                      className="min-h-[80px]"
                      defaultValue="Our platform reduces deployment time from weeks to minutes. Teams can scale their ML infrastructure automatically without needing dedicated DevOps expertise."
                    />
                  </div>
                </div>

                {/* Value Driver - Severity & Urgency (Expanded) */}
                <div className="p-4 border border-[hsl(var(--cyan-glow))] bg-[hsl(var(--cyan-glow))]/10 rounded-lg cursor-pointer transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded border-2 border-[hsl(var(--cyan-glow))] bg-[hsl(var(--cyan-glow))] flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-[hsl(var(--navy-deep))]" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-[hsl(var(--navy-deep))]">Severity & Urgency</div>
                      <div className="text-sm text-[hsl(var(--navy-deep))]/60">How urgent or costly is the problem (impact analysis)</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[hsl(var(--navy-deep))]/10">
                    <Textarea
                      placeholder="Explain how urgent or costly this problem is..."
                      className="min-h-[80px]"
                      defaultValue="Companies lose an average of $1.2M annually on failed ML initiatives. The urgency is increasing as competitors deploy AI faster."
                    />
                  </div>
                </div>

                {/* Value Driver - Not Selected */}
                <div className="p-4 border border-[hsl(var(--navy-deep))]/20 hover:border-[hsl(var(--cyan-glow))]/50 rounded-lg cursor-pointer transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded border-2 border-[hsl(var(--navy-deep))]/30 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-[hsl(var(--navy-deep))]">Unique Technology Value</div>
                      <div className="text-sm text-[hsl(var(--navy-deep))]/60">What makes your uniqueness attractive to customers daily life</div>
                    </div>
                  </div>
                </div>

                {/* Value Driver - Not Selected */}
                <div className="p-4 border border-[hsl(var(--navy-deep))]/20 hover:border-[hsl(var(--cyan-glow))]/50 rounded-lg cursor-pointer transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded border-2 border-[hsl(var(--navy-deep))]/30 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-[hsl(var(--navy-deep))]">Emotional & Social Value</div>
                      <div className="text-sm text-[hsl(var(--navy-deep))]/60">Does it create status, trust, or peace of mind</div>
                    </div>
                  </div>
                </div>

                {/* Value Driver - Not Selected */}
                <div className="p-4 border border-[hsl(var(--navy-deep))]/20 hover:border-[hsl(var(--cyan-glow))]/50 rounded-lg cursor-pointer transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded border-2 border-[hsl(var(--navy-deep))]/30 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-[hsl(var(--navy-deep))]">Adaptability</div>
                      <div className="text-sm text-[hsl(var(--navy-deep))]/60">Across regions, geographies, groups of people</div>
                    </div>
                  </div>
                </div>

                {/* Value Driver - Other - Not Selected */}
                <div className="p-4 border border-[hsl(var(--navy-deep))]/20 hover:border-[hsl(var(--cyan-glow))]/50 rounded-lg cursor-pointer transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded border-2 border-[hsl(var(--navy-deep))]/30 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-[hsl(var(--navy-deep))]">Other</div>
                      <div className="text-sm text-[hsl(var(--navy-deep))]/60">A value proposition that doesn't fit the categories above</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Business Model Step */}
          {currentStep === 4 && (
            <div className="space-y-6 max-w-lg mx-auto">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-[hsl(var(--navy-deep))]">Section 3 — Business Model</h3>
                <p className="text-[hsl(var(--navy-deep))]/70 text-sm">How do you make money?</p>
              </div>

              {/* 3.1 Customer Type */}
              <div className="space-y-3">
                <div>
                  <Label className="text-base font-semibold">3.1 Who is your customer?</Label>
                  <p className="text-xs text-[hsl(var(--navy-deep))]/60 mt-1">Select all that apply</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {["B2B", "B2C", "Both"].map((type) => (
                    <button key={type} className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${type === "B2B" ? "bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))]" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                      {type}
                    </button>
                  ))}
                </div>
                <div>
                  <Label className="text-xs">Explain your customer type choice</Label>
                  <Textarea
                    placeholder="Why did you choose this customer type?"
                    className="mt-1"
                    defaultValue="We focus exclusively on B2B enterprise customers because our solution requires integration with existing ML infrastructure and benefits from longer sales cycles and higher contract values."
                  />
                </div>
              </div>

              {/* 3.2 Business Structure */}
              <div className="space-y-3">
                <div>
                  <Label className="text-base font-semibold">3.2 Business Structure</Label>
                  <p className="text-xs text-[hsl(var(--navy-deep))]/60 mt-1">How is your business structured?</p>
                </div>
                <Textarea
                  placeholder="Describe your business structure..."
                  className="min-h-[80px]"
                  defaultValue="Platform-as-a-Service model with tiered pricing based on usage. Revenue comes from monthly subscriptions plus overage fees for compute usage above tier limits."
                />
              </div>

              {/* 3.3 Pricing Strategy */}
              <div className="space-y-3">
                <div>
                  <Label className="text-base font-semibold">3.3 Pricing Strategy</Label>
                  <p className="text-xs text-[hsl(var(--navy-deep))]/60 mt-1">How do you charge customers? Select all that apply.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {/* Subscription - Selected with sub-fields */}
                  <div className="p-4 rounded-lg border border-[hsl(var(--cyan-glow))] bg-[hsl(var(--cyan-glow))]/10 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border-2 border-[hsl(var(--cyan-glow))] bg-[hsl(var(--cyan-glow))] flex items-center justify-center">
                        <Check className="w-3 h-3 text-[hsl(var(--navy-deep))]" />
                      </div>
                      <span className="font-medium text-[hsl(var(--navy-deep))]">Subscription</span>
                    </div>
                  </div>
                  {/* Transaction-based - Not selected */}
                  <div className="p-4 rounded-lg border border-[hsl(var(--navy-deep))]/20 hover:border-[hsl(var(--cyan-glow))]/50 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border-2 border-[hsl(var(--navy-deep))]/30" />
                      <span className="font-medium text-[hsl(var(--navy-deep))]/70">Transaction-based</span>
                    </div>
                  </div>
                  {/* Licensing - Not selected */}
                  <div className="p-4 rounded-lg border border-[hsl(var(--navy-deep))]/20 hover:border-[hsl(var(--cyan-glow))]/50 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border-2 border-[hsl(var(--navy-deep))]/30" />
                      <span className="font-medium text-[hsl(var(--navy-deep))]/70">One-time / Licensing</span>
                    </div>
                  </div>
                  {/* Advertising-driven - Not selected */}
                  <div className="p-4 rounded-lg border border-[hsl(var(--navy-deep))]/20 hover:border-[hsl(var(--cyan-glow))]/50 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border-2 border-[hsl(var(--navy-deep))]/30" />
                      <span className="font-medium text-[hsl(var(--navy-deep))]/70">Advertising-driven</span>
                    </div>
                  </div>
                  {/* Services - Not selected */}
                  <div className="p-4 rounded-lg border border-[hsl(var(--navy-deep))]/20 hover:border-[hsl(var(--cyan-glow))]/50 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border-2 border-[hsl(var(--navy-deep))]/30" />
                      <span className="font-medium text-[hsl(var(--navy-deep))]/70">Services</span>
                    </div>
                  </div>
                  {/* Other - Not selected */}
                  <div className="p-4 rounded-lg border border-[hsl(var(--navy-deep))]/20 hover:border-[hsl(var(--cyan-glow))]/50 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border-2 border-[hsl(var(--navy-deep))]/30" />
                      <span className="font-medium text-[hsl(var(--navy-deep))]/70">Other</span>
                    </div>
                  </div>
                </div>

                {/* Subscription Details Sub-field */}
                <div className="p-4 bg-[hsl(var(--cyan-glow))]/5 border border-[hsl(var(--cyan-glow))]/20 rounded-lg space-y-4">
                  <Label className="font-medium">Subscription Details</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs">Type</Label>
                      <div className="mt-1 p-2.5 bg-white border border-[hsl(var(--navy-deep))]/10 rounded-md text-[hsl(var(--navy-deep))] text-sm">
                        Tiered
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Billing Cycle</Label>
                      <div className="mt-1 p-2.5 bg-white border border-[hsl(var(--navy-deep))]/10 rounded-md text-[hsl(var(--navy-deep))] text-sm">
                        Both (Monthly & Annual)
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Pricing Tiers</Label>
                    <Input
                      placeholder="e.g., Free, Pro ($29/mo), Enterprise (custom)"
                      className="mt-1"
                      defaultValue="Free tier, Growth ($499/mo), Enterprise (custom)"
                    />
                  </div>
                </div>
              </div>

              {/* 3.4 Key Metrics */}
              <div className="space-y-3">
                <div>
                  <Label className="text-base font-semibold">3.4 Key Metrics</Label>
                  <p className="text-xs text-[hsl(var(--navy-deep))]/60 mt-1">Select the metrics you track</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["MRR", "ARR", "LTV", "CAC", "Churn Rate", "Net Revenue Retention"].map((metric, i) => (
                    <button key={metric} className={`px-3 py-1.5 rounded-full text-sm transition-all ${i < 4 ? "bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))]" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                      {metric}
                    </button>
                  ))}
                </div>
                <div>
                  <Label className="text-xs">Current Values (optional)</Label>
                  <Textarea
                    placeholder="Share your current metrics..."
                    className="mt-1"
                    defaultValue="MRR: $42K, ARR: $500K, LTV: $18K, CAC: $2.1K"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Go-to-Market Step */}
          {currentStep === 5 && (
            <div className="space-y-6 max-w-lg mx-auto">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-[hsl(var(--navy-deep))]">Section 4 — Go-to-Market Strategy</h3>
                <p className="text-[hsl(var(--navy-deep))]/70 text-sm">How do you acquire and retain customers?</p>
              </div>

              {/* 4.1 Customer Acquisition */}
              <div className="space-y-3">
                <div>
                  <Label className="text-base font-semibold">4.1 How do you acquire customers?</Label>
                  <p className="text-xs text-[hsl(var(--navy-deep))]/60 mt-1">Describe your primary customer acquisition channels and strategy.</p>
                </div>
                <Textarea
                  placeholder="We acquire customers through [channels]. Our primary strategy is [approach]. Our customer journey looks like [description]..."
                  className="min-h-[100px]"
                  defaultValue="Product-led growth with a free self-serve tier to build awareness and let developers experience the platform. Enterprise sales motion for companies with 500+ employees, targeting VP Engineering and ML leads through content marketing, webinars, and industry conferences. Developer community engagement through open-source contributions and technical blog posts."
                />
              </div>

              {/* 4.2 GTM Timeline */}
              <div className="space-y-3">
                <div>
                  <Label className="text-base font-semibold">4.2 GTM Timeline</Label>
                  <p className="text-xs text-[hsl(var(--navy-deep))]/60 mt-1">What are your near-term milestones?</p>
                </div>
                <Textarea
                  placeholder="In the next 6-12 months, we plan to [milestones]. Key targets include [goals]..."
                  className="min-h-[80px]"
                  defaultValue="In the next 6-12 months: Launch enterprise tier with premium support, reach 50 paying customers, hit $500K ARR milestone. Q3: SOC2 certification completion. Q4: First international expansion to UK/Germany."
                />
              </div>
            </div>
          )}

          {/* Customer & Market Step */}
          {currentStep === 6 && (
            <div className="space-y-6 max-w-lg mx-auto">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-[hsl(var(--navy-deep))]">Section 5 — Target Customer & Market Sizing</h3>
                <p className="text-[hsl(var(--navy-deep))]/70 text-sm">Who do you serve and how big is the opportunity?</p>
              </div>

              {/* 5.1 Target Geography */}
              <div className="space-y-3">
                <div>
                  <Label className="text-base font-semibold">5.1 Target Geography</Label>
                  <p className="text-xs text-[hsl(var(--navy-deep))]/60 mt-1">Where do you sell?</p>
                </div>
                <Input
                  placeholder="e.g., US, North America, Global, Boston Metro Area"
                  defaultValue="North America, expanding to Europe in 2025"
                />
              </div>

              {/* 5.2 Ideal Customer Profile */}
              <div className="space-y-3">
                <div>
                  <Label className="text-base font-semibold">5.2 Ideal Customer Profile</Label>
                  <p className="text-xs text-[hsl(var(--navy-deep))]/60 mt-1">Describe your ideal customer in detail.</p>
                </div>
                <Textarea
                  placeholder="Our ideal customer is [description]. They typically have [characteristics]. The decision maker is usually [role]..."
                  className="min-h-[100px]"
                  defaultValue="Our ideal customer is an enterprise company with 500+ employees running ML workloads in production. They typically have a dedicated ML/AI team of 5+ engineers who struggle with deployment complexity. The decision maker is usually VP of Engineering or Head of ML Infrastructure."
                />
                <p className="text-xs text-[hsl(var(--cyan-glow))]">48 / 20-150 words</p>
              </div>

              {/* 5.3 TAM */}
              <div className="space-y-3 p-4 bg-muted/30 border border-[hsl(var(--navy-deep))]/10 rounded-lg">
                <div>
                  <Label className="text-base font-semibold">5.3 Total Addressable Market (TAM)</Label>
                  <p className="text-xs text-[hsl(var(--navy-deep))]/60 mt-1">The total market demand for your product/service.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs">TAM Value *</Label>
                    <Input placeholder="e.g., $50B" className="mt-1" defaultValue="$50B" />
                  </div>
                  <div>
                    <Label className="text-xs">Calculation Method</Label>
                    <div className="mt-1 p-2.5 bg-white border border-[hsl(var(--navy-deep))]/10 rounded-md text-[hsl(var(--navy-deep))] text-sm cursor-pointer hover:border-[hsl(var(--cyan-glow))]/50 transition-colors">
                      Top-Down
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-xs">TAM Breakdown</Label>
                  <Textarea
                    placeholder="Explain how you arrived at this number..."
                    className="mt-1"
                    defaultValue="Global MLOps market ($50B by 2027) based on Gartner/IDC reports. Includes ML deployment, monitoring, and management tools."
                  />
                </div>
              </div>

              {/* 5.4 SAM */}
              <div className="space-y-3 p-4 bg-muted/30 border border-[hsl(var(--navy-deep))]/10 rounded-lg">
                <div>
                  <Label className="text-base font-semibold">5.4 Serviceable Addressable Market (SAM)</Label>
                  <p className="text-xs text-[hsl(var(--navy-deep))]/60 mt-1">The portion of TAM you can realistically target.</p>
                </div>
                <div>
                  <Label className="text-xs">SAM Value *</Label>
                  <Input placeholder="e.g., $5B" className="mt-1" defaultValue="$5B" />
                </div>
                <div>
                  <Label className="text-xs">SAM Breakdown</Label>
                  <Textarea
                    placeholder="Explain your SAM calculation..."
                    className="mt-1"
                    defaultValue="North American enterprise segment (companies 500+ employees) with existing ML initiatives. ~10% of TAM based on geographic and company size focus."
                  />
                </div>
              </div>

              {/* 5.5 SOM */}
              <div className="space-y-3 p-4 bg-muted/30 border border-[hsl(var(--navy-deep))]/10 rounded-lg">
                <div>
                  <Label className="text-base font-semibold">5.5 Serviceable Obtainable Market (SOM)</Label>
                  <p className="text-xs text-[hsl(var(--navy-deep))]/60 mt-1">The realistic market share you can capture.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs">SOM Value *</Label>
                    <Input placeholder="e.g., $100M" className="mt-1" defaultValue="$100M" />
                  </div>
                  <div>
                    <Label className="text-xs">Timeframe</Label>
                    <Input placeholder="e.g., 5 years" className="mt-1" defaultValue="5 years" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs">SOM Breakdown</Label>
                  <Textarea
                    placeholder="Explain how you plan to capture this market share..."
                    className="mt-1"
                    defaultValue="2% of SAM over 5 years. Based on capturing 500 enterprise customers at $200K ACV. Achievable through product-led growth and enterprise sales."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Competitors Step */}
          {currentStep === 7 && (
            <div className="space-y-6 max-w-lg mx-auto">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-[hsl(var(--navy-deep))]">Section 6 — Competitive Landscape</h3>
                <p className="text-[hsl(var(--navy-deep))]/70 text-sm">Who else is solving this problem?</p>
              </div>

              {/* 6.1 Key Competitors */}
              <div className="space-y-3">
                <div>
                  <Label className="text-base font-semibold">6.1 Key Competitors</Label>
                  <p className="text-xs text-[hsl(var(--navy-deep))]/60 mt-1">List 3-5 competitors and explain how you differ.</p>
                </div>

                {/* Competitor 1 */}
                <div className="p-4 border border-[hsl(var(--navy-deep))]/10 rounded-lg bg-white space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="font-medium">Competitor 1</Label>
                  </div>
                  <div>
                    <Label className="text-xs">Name</Label>
                    <Input placeholder="Competitor name" className="mt-1" defaultValue="AWS SageMaker" />
                  </div>
                  <div>
                    <Label className="text-xs">What they do</Label>
                    <Input placeholder="Brief description" className="mt-1" defaultValue="Full ML lifecycle platform from AWS" />
                  </div>
                  <div>
                    <Label className="text-xs">How you differ</Label>
                    <Textarea
                      placeholder="Your competitive advantage against them..."
                      className="mt-1"
                      defaultValue="We're 10x simpler to use, cloud-agnostic, and focused specifically on deployment rather than the full ML lifecycle."
                    />
                  </div>
                </div>

                {/* Competitor 2 */}
                <div className="p-4 border border-[hsl(var(--navy-deep))]/10 rounded-lg bg-white space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="font-medium">Competitor 2</Label>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-[hsl(var(--navy-deep))] hover:bg-muted h-8 w-8 p-0">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <Label className="text-xs">Name</Label>
                    <Input placeholder="Competitor name" className="mt-1" defaultValue="Kubeflow" />
                  </div>
                  <div>
                    <Label className="text-xs">What they do</Label>
                    <Input placeholder="Brief description" className="mt-1" defaultValue="Open-source ML toolkit for Kubernetes" />
                  </div>
                  <div>
                    <Label className="text-xs">How you differ</Label>
                    <Textarea
                      placeholder="Your competitive advantage against them..."
                      className="mt-1"
                      defaultValue="No Kubernetes expertise required. Fully managed service vs. DIY infrastructure."
                    />
                  </div>
                </div>

                {/* Competitor 3 */}
                <div className="p-4 border border-[hsl(var(--navy-deep))]/10 rounded-lg bg-white space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="font-medium">Competitor 3</Label>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-[hsl(var(--navy-deep))] hover:bg-muted h-8 w-8 p-0">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <Label className="text-xs">Name</Label>
                    <Input placeholder="Competitor name" className="mt-1" defaultValue="MLflow" />
                  </div>
                  <div>
                    <Label className="text-xs">What they do</Label>
                    <Input placeholder="Brief description" className="mt-1" defaultValue="Open-source ML experiment tracking" />
                  </div>
                  <div>
                    <Label className="text-xs">How you differ</Label>
                    <Textarea
                      placeholder="Your competitive advantage against them..."
                      className="mt-1"
                      defaultValue="We focus on production deployment, not experiment tracking. Complementary rather than competitive."
                    />
                  </div>
                </div>

                <Button variant="outline" className="w-full border-dashed">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Competitor
                </Button>
              </div>

              {/* 6.2 Competitive Moat */}
              <div className="space-y-3">
                <div>
                  <Label className="text-base font-semibold">6.2 Your Moat</Label>
                  <p className="text-xs text-[hsl(var(--navy-deep))]/60 mt-1">What is your defensible advantage over competitors?</p>
                </div>
                <Textarea
                  placeholder="Technology, data, switching costs, brand, regulatory, network effects..."
                  className="min-h-[100px]"
                  defaultValue="Proprietary ML optimization algorithms that automatically tune deployment configurations. High switching costs due to deep integration with customer workflows. Growing data moat from deployment patterns across 500+ models. First-mover advantage in the enterprise segment with SOC2 and HIPAA compliance."
                />
                <p className="text-xs text-[hsl(var(--cyan-glow))]">42 / 75-100 words</p>
              </div>

              {/* Final Note */}
              <div className="p-6 bg-[hsl(var(--cyan-glow))]/10 border border-[hsl(var(--cyan-glow))]/30 rounded-xl">
                <p className="text-[hsl(var(--navy-deep))] font-medium text-center italic">
                  "This is not a test — it's a tool. If you can answer these questions clearly, you are already thinking like an investor."
                </p>
              </div>
            </div>
          )}

              {/* Navigation Buttons - matching FounderApplication */}
              <div className="flex gap-4 pt-8 mt-8 border-t">
                {currentStep > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goBack}
                    className="gap-2 border-[hsl(var(--navy-deep))]/20"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>
                )}

                <div className="flex-1" />

                {currentStep < 7 ? (
                  <Button
                    type="button"
                    onClick={goNext}
                    className="gap-2 bg-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--navy-deep))]/90"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={goNext}
                    className="gap-2 bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--cyan-glow))]/90 font-semibold"
                  >
                    View Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
