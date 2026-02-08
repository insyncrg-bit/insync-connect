import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
  Maximize2,
  Minimize2,
  Zap,
  XCircle,
  Handshake,
  ChevronRight,
  Clock,
  Calendar,
  Video,
  ExternalLink,
  Send,
  Rocket,
  BarChart3,
  Shield,
  Calculator,
  Linkedin,
} from "lucide-react";
import syncsLogo from "@/landing/assets/infinity-logo-transparent.png";
import insyncInfinity from "@/landing/assets/infinity-logo-transparent.png";

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

  // Modal view states (matching production modals)
  const [investorViewMode, setInvestorViewMode] = useState<"condensed" | "full">("condensed");
  const [investorIsFullscreen, setInvestorIsFullscreen] = useState(false);
  const [interestsIsFullscreen, setInterestsIsFullscreen] = useState(false);
  const [syncsIsFullscreen, setSyncsIsFullscreen] = useState(false);
  const [pendingIsFullscreen, setPendingIsFullscreen] = useState(false);
  const [messagesIsFullscreen, setMessagesIsFullscreen] = useState(false);
  const [memoViewMode, setMemoViewMode] = useState<"condensed" | "full">("condensed");
  const [memoIsFullscreen, setMemoIsFullscreen] = useState(false);
  const [selectedMessageThread, setSelectedMessageThread] = useState<typeof demoMessages[0] | null>(null);
  const [newMessage, setNewMessage] = useState("");

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
      <div className={`fixed inset-0 z-50 bg-navy-deep ${showMemoModal || showInterestsModal || showSyncsModal || showPendingModal || showMessagesModal || showInvestorModal ? 'overflow-hidden' : 'overflow-auto'}`}>
        {/* Header */}
        <div className="sticky top-0 z-20 bg-navy-deep/95 backdrop-blur-lg border-b border-white/10">
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

        {/* Memo Modal - EXACTLY matches MemoModal.tsx structure */}
        {showMemoModal && (
          <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4" onClick={() => { setShowMemoModal(false); setMemoViewMode("condensed"); setMemoIsFullscreen(false); }}>
            <div
              className={`bg-[hsl(var(--navy-deep))] border-[hsl(var(--cyan-glow))]/20 border rounded-lg overflow-hidden transition-all duration-300 ${
                memoIsFullscreen
                  ? 'max-w-[100vw] w-[100vw] h-[100vh] max-h-[100vh] rounded-none'
                  : 'max-w-5xl max-h-[95vh] w-full'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <ScrollArea className={memoIsFullscreen ? "h-[100vh]" : "max-h-[95vh]"}>
                <div className="p-6 space-y-6">
                  {/* Back Button */}
                  <Button
                    onClick={() => { setShowMemoModal(false); setMemoViewMode("condensed"); setMemoIsFullscreen(false); }}
                    className="bg-[hsl(var(--cyan-glow))] text-[#151a24] hover:bg-[hsl(var(--cyan-bright))] shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all duration-300 font-semibold"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>

                  {/* Header */}
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Startup Memo</h2>
                      <p className="text-white/60">Investor-ready company memo</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Tabs value={memoViewMode} onValueChange={(v) => setMemoViewMode(v as "condensed" | "full")}>
                        <TabsList className="bg-white/10">
                          <TabsTrigger value="condensed" className="data-[state=active]:bg-[hsl(var(--cyan-glow))] data-[state=active]:text-[hsl(var(--navy-deep))]">
                            <FileText className="h-4 w-4 mr-2" />
                            Condensed
                          </TabsTrigger>
                          <TabsTrigger value="full" className="data-[state=active]:bg-[hsl(var(--cyan-glow))] data-[state=active]:text-[hsl(var(--navy-deep))]">
                            <Eye className="h-4 w-4 mr-2" />
                            Full Memo
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMemoIsFullscreen(!memoIsFullscreen)}
                        className="border-white/20 text-white/70 hover:text-white hover:bg-white/10"
                      >
                        {memoIsFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Condensed View */}
                  {memoViewMode === "condensed" && (
                    <div className="space-y-6">
                      {/* Executive Summary Card */}
                      <Card className="bg-navy-card border-[hsl(var(--cyan-glow))]/30 p-8 relative overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.08)]">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[hsl(var(--cyan-glow))]/5 rounded-full -translate-y-1/2 translate-x-1/2" />

                        <div className="relative z-10">
                          <div className="flex items-start justify-between gap-6 mb-6">
                            <div className="flex items-center gap-4">
                              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[hsl(var(--cyan-glow))] to-[hsl(var(--primary))] flex items-center justify-center shadow-lg shadow-[hsl(var(--cyan-glow))]/20">
                                <Building2 className="h-10 w-10 text-white" />
                              </div>
                              <div>
                                <h1 className="text-3xl font-bold text-white mb-2">{demoMemo.company_name}</h1>
                                <div className="flex flex-wrap gap-2">
                                  <Badge className="bg-[hsl(var(--cyan-glow))]/20 text-[hsl(var(--cyan-glow))] border-[hsl(var(--cyan-glow))]/30 text-sm">
                                    {demoMemo.vertical}
                                  </Badge>
                                  <Badge className="bg-white/10 text-white/80 border-white/20 text-sm">
                                    {demoMemo.stage}
                                  </Badge>
                                  <Badge className="bg-[hsl(var(--cyan-bright))]/20 text-[hsl(var(--cyan-bright))] border-[hsl(var(--cyan-bright))]/30 text-sm">
                                    <MapPin className="h-3 w-3 mr-1" /> {demoMemo.location}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* One-liner */}
                          <div className="bg-white/5 rounded-xl p-4 mb-6">
                            <p className="text-lg text-white/90 italic">
                              "{demoMemo.description.slice(0, 150)}{demoMemo.description.length > 150 ? '...' : ''}"
                            </p>
                          </div>

                          {/* Key Metrics Row - TAM/SAM/SOM */}
                          <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all cursor-pointer group border border-transparent hover:border-[hsl(var(--cyan-glow))]/30">
                              <p className="text-sm text-white/50 mb-1 group-hover:text-[hsl(var(--cyan-glow))] transition-colors">TAM</p>
                              <p className="text-2xl font-bold text-white">$50B</p>
                              <p className="text-xs text-white/30 mt-1 group-hover:text-white/50 flex items-center justify-center gap-1">
                                View breakdown <ChevronRight className="h-3 w-3" />
                              </p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all cursor-pointer group border border-transparent hover:border-[hsl(var(--cyan-glow))]/30">
                              <p className="text-sm text-white/50 mb-1 group-hover:text-[hsl(var(--cyan-glow))] transition-colors">SAM</p>
                              <p className="text-2xl font-bold text-white">$5B</p>
                              <p className="text-xs text-white/30 mt-1 group-hover:text-white/50 flex items-center justify-center gap-1">
                                View breakdown <ChevronRight className="h-3 w-3" />
                              </p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all cursor-pointer group border border-transparent hover:border-[hsl(var(--cyan-glow))]/30">
                              <p className="text-sm text-white/50 mb-1 group-hover:text-[hsl(var(--cyan-glow))] transition-colors">SOM</p>
                              <p className="text-2xl font-bold text-white">$100M</p>
                              <p className="text-xs text-white/30 mt-1 group-hover:text-white/50 flex items-center justify-center gap-1">
                                View breakdown <ChevronRight className="h-3 w-3" />
                              </p>
                            </div>
                          </div>
                        </div>
                      </Card>

                      {/* Quick Stats Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="bg-navy-card border-white/10 p-4 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                              <Users className="h-5 w-5 text-[hsl(var(--cyan-glow))]/70" />
                            </div>
                            <div>
                              <p className="text-white/40 text-xs font-medium">Team Size</p>
                              <p className="text-white font-semibold">{demoMemo.team.length}</p>
                            </div>
                          </div>
                        </Card>
                        <Card className="bg-navy-card border-white/10 p-4 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                              <Target className="h-5 w-5 text-purple-400/70" />
                            </div>
                            <div>
                              <p className="text-white/40 text-xs font-medium">Customer</p>
                              <p className="text-white font-semibold">B2B</p>
                            </div>
                          </div>
                        </Card>
                        <Card className="bg-navy-card border-white/10 p-4 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                              <DollarSign className="h-5 w-5 text-emerald-400/70" />
                            </div>
                            <div>
                              <p className="text-white/40 text-xs font-medium">Revenue Model</p>
                              <p className="text-white font-semibold text-sm">Subscription</p>
                            </div>
                          </div>
                        </Card>
                        <Card className="bg-navy-card border-white/10 p-4 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                              <Zap className="h-5 w-5 text-amber-400/70" />
                            </div>
                            <div>
                              <p className="text-white/40 text-xs font-medium">Value Drivers</p>
                              <p className="text-white font-semibold">2</p>
                            </div>
                          </div>
                        </Card>
                      </div>

                      {/* Problem & Solution */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <Card className="bg-navy-card border-white/10 p-6 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                              <Target className="h-4 w-4 text-rose-400/70" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">The Problem</h3>
                          </div>
                          <p className="text-white/70 leading-relaxed">
                            {demoMemo.problem}
                          </p>
                        </Card>

                        <Card className="bg-navy-card border-white/10 p-6 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                              <Rocket className="h-4 w-4 text-emerald-400/70" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">The Solution</h3>
                          </div>
                          <p className="text-white/70 leading-relaxed">
                            {demoMemo.solution}
                          </p>
                        </Card>
                      </div>
                    </div>
                  )}

                  {/* Full Memo View */}
                  {memoViewMode === "full" && (
                    <div className="space-y-8">
                      {/* Header Section */}
                      <Card className="bg-navy-card border-[hsl(var(--cyan-glow))]/30 p-8 shadow-[0_0_15px_rgba(6,182,212,0.08)]">
                        <div className="text-center mb-8">
                          <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-[hsl(var(--cyan-glow))] to-[hsl(var(--primary))] flex items-center justify-center shadow-lg shadow-[hsl(var(--cyan-glow))]/20 mb-4">
                            <Building2 className="h-12 w-12 text-white" />
                          </div>
                          <h1 className="text-4xl font-bold text-white mb-2">{demoMemo.company_name}</h1>
                          <p className="text-xl text-white/70 mb-4">{demoMemo.vertical} • {demoMemo.stage}</p>
                          <div className="flex flex-wrap justify-center gap-4 text-sm text-white/60">
                            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {demoMemo.location}</span>
                            <a href={demoMemo.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[hsl(var(--cyan-glow))] transition-colors">
                              <Globe className="h-4 w-4" /> {demoMemo.website}
                            </a>
                          </div>
                        </div>

                        <div className="max-w-3xl mx-auto">
                          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                            <h3 className="text-sm font-semibold text-[hsl(var(--cyan-glow))] uppercase tracking-wider mb-3">Executive Summary</h3>
                            <p className="text-lg text-white/90 leading-relaxed">
                              {demoMemo.description}
                            </p>
                          </div>
                        </div>
                      </Card>

                      {/* Section 1: Problem & Value Proposition */}
                      <Card className="bg-navy-card border-white/10 p-8 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                            <Target className="h-5 w-5 text-rose-400/70" />
                          </div>
                          <h2 className="text-2xl font-bold text-white">Problem & Value Proposition</h2>
                        </div>

                        <div className="space-y-6">
                          <div>
                            <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">The Problem</h4>
                            <p className="text-white/80 leading-relaxed text-lg">
                              {demoMemo.problem}
                            </p>
                          </div>

                          <Separator className="bg-white/10" />

                          <div>
                            <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Value Drivers</h4>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <div className="flex items-center gap-2 mb-2">
                                  <Zap className="h-4 w-4 text-amber-400/70" />
                                  <span className="font-semibold text-white">True Scalability</span>
                                </div>
                                <p className="text-white/60 text-sm">
                                  Our platform reduces deployment time from weeks to minutes.
                                </p>
                              </div>
                              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <div className="flex items-center gap-2 mb-2">
                                  <Zap className="h-4 w-4 text-amber-400/70" />
                                  <span className="font-semibold text-white">Severity & Urgency</span>
                                </div>
                                <p className="text-white/60 text-sm">
                                  Companies lose an average of $1.2M annually on failed ML initiatives.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>

                      {/* Section 2: Business Model */}
                      <Card className="bg-navy-card border-white/10 p-8 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-emerald-400/70" />
                          </div>
                          <h2 className="text-2xl font-bold text-white">Business Model</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">Customer Type</h4>
                            <div className="flex flex-wrap gap-2 mb-4">
                              <Badge className="bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))]/80 border-[hsl(var(--cyan-glow))]/20 text-sm px-3 py-1">
                                B2B
                              </Badge>
                            </div>
                            <p className="text-white/60 text-sm">Enterprise focus with 500+ employee companies.</p>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">Revenue Streams</h4>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[hsl(var(--cyan-glow))]/60" />
                                <span className="text-white/80">Subscription</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="text-white/70 mt-6 leading-relaxed">
                          {demoMemo.business_model}
                        </p>
                      </Card>

                      {/* Section 3: Market Opportunity */}
                      <Card className="bg-navy-card border-white/10 p-8 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                            <BarChart3 className="h-5 w-5 text-amber-400/70" />
                          </div>
                          <h2 className="text-2xl font-bold text-white">Market Opportunity</h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 mb-6">
                          <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center hover:border-[hsl(var(--cyan-glow))]/30 transition-all cursor-pointer group">
                            <p className="text-sm text-white/50 font-semibold mb-2">Total Addressable Market</p>
                            <p className="text-3xl font-bold text-white mb-2">$50B</p>
                            <p className="text-xs text-white/30 group-hover:text-[hsl(var(--cyan-glow))]/60 flex items-center justify-center gap-1">
                              <Calculator className="h-3 w-3" /> View calculation
                            </p>
                          </div>
                          <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center hover:border-[hsl(var(--cyan-glow))]/30 transition-all cursor-pointer group">
                            <p className="text-sm text-white/50 font-semibold mb-2">Serviceable Addressable Market</p>
                            <p className="text-3xl font-bold text-white mb-2">$5B</p>
                            <p className="text-xs text-white/30 group-hover:text-[hsl(var(--cyan-glow))]/60 flex items-center justify-center gap-1">
                              <Calculator className="h-3 w-3" /> View calculation
                            </p>
                          </div>
                          <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center hover:border-[hsl(var(--cyan-glow))]/30 transition-all cursor-pointer group">
                            <p className="text-sm text-white/50 font-semibold mb-2">Serviceable Obtainable Market</p>
                            <p className="text-3xl font-bold text-white mb-2">$100M</p>
                            <p className="text-xs text-white/30 group-hover:text-[hsl(var(--cyan-glow))]/60 flex items-center justify-center gap-1">
                              <Calculator className="h-3 w-3" /> View calculation
                            </p>
                          </div>
                        </div>
                      </Card>

                      {/* Section 4: Competitive Landscape */}
                      <Card className="bg-navy-card border-white/10 p-8 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                            <Shield className="h-5 w-5 text-cyan-400/70" />
                          </div>
                          <h2 className="text-2xl font-bold text-white">Competitive Landscape</h2>
                        </div>

                        <div className="space-y-4 mb-6">
                          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <h4 className="font-semibold text-white mb-2">AWS SageMaker</h4>
                            <p className="text-white/50 text-sm mb-2">Full ML lifecycle platform from AWS</p>
                            <div className="flex items-start gap-2">
                              <Badge className="bg-emerald-500/10 text-emerald-400/80 border-emerald-500/20 text-xs shrink-0">Differentiation</Badge>
                              <p className="text-white/60 text-sm">We're 10x simpler to use, cloud-agnostic, and focused specifically on deployment.</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-6 border-l-4 border-[hsl(var(--cyan-glow))]/50">
                          <h4 className="text-sm font-semibold text-[hsl(var(--cyan-glow))]/70 uppercase tracking-wider mb-2">Competitive Moat</h4>
                          <p className="text-white/80 leading-relaxed">
                            Proprietary ML optimization algorithms, high switching costs, and first-mover advantage with SOC2/HIPAA compliance.
                          </p>
                        </div>
                      </Card>

                      {/* Section 5: Team */}
                      <Card className="bg-navy-card border-white/10 p-8 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-pink-400/70" />
                          </div>
                          <h2 className="text-2xl font-bold text-white">Founding Team</h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {demoMemo.team.map((member, i) => (
                            <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--cyan-glow))]/30 to-purple-500/30 flex items-center justify-center">
                                  <span className="text-white font-bold">{member.name.charAt(0)}</span>
                                </div>
                                <div>
                                  <p className="font-semibold text-white">{member.name}</p>
                                  <p className="text-sm text-[hsl(var(--cyan-glow))]/70">{member.role}</p>
                                </div>
                              </div>
                              <p className="text-white/50 text-sm">{member.background}</p>
                            </div>
                          ))}
                        </div>
                      </Card>

                      {/* Traction Section */}
                      <Card className="bg-navy-card border-emerald-500/20 p-8 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-emerald-400/70" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-white">Traction & Progress</h2>
                            <p className="text-white/40 text-sm">Key metrics and milestones</p>
                          </div>
                        </div>
                        <p className="text-white/80 leading-relaxed">
                          {demoMemo.traction}
                        </p>
                      </Card>

                      {/* Current Ask */}
                      <Card className="bg-navy-card border-[hsl(var(--cyan-glow))]/30 p-8 shadow-[0_0_15px_rgba(6,182,212,0.08)]">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 rounded-xl bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-[hsl(var(--cyan-glow))]/70" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-white">Current Ask</h2>
                            <p className="text-white/40 text-sm">Fundraising goals and use of funds</p>
                          </div>
                        </div>
                        <p className="text-white/80 leading-relaxed">
                          Raising {demoMemo.funding_goal} to expand engineering team, accelerate product development, and scale go-to-market efforts.
                        </p>
                      </Card>

                      {/* Footer */}
                      <div className="text-center py-8 border-t border-white/10">
                        <p className="text-white/40 text-sm">
                          Generated by In-Sync • Last updated: Today
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}

        {/* Interests Modal - EXACTLY matches InterestsModal.tsx */}
        {showInterestsModal && (
          <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4" onClick={() => { setShowInterestsModal(false); setInterestsIsFullscreen(false); }}>
            <div
              className={`bg-[hsl(var(--navy-deep))] border-[hsl(var(--cyan-glow))]/20 border rounded-lg overflow-hidden transition-all duration-300 ${
                interestsIsFullscreen
                  ? "max-w-[100vw] w-[100vw] h-[100vh] max-h-[100vh] rounded-none"
                  : "max-w-2xl max-h-[80vh] w-full"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 pb-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Incoming Interests
                    </h2>
                    <p className="text-white/60 text-sm mt-1">
                      VC analysts that want to connect with you
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setInterestsIsFullscreen(!interestsIsFullscreen)}
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    {interestsIsFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                  </Button>
                </div>
              </div>

              <ScrollArea className={`p-6 pt-4 ${interestsIsFullscreen ? "h-[calc(100vh-100px)]" : "max-h-[60vh]"}`}>
                {demoInterests.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                      <Building2 className="h-8 w-8 text-white/20" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">No incoming interests yet</h3>
                    <p className="text-white/60 text-sm">
                      When VC analysts are interested in connecting, they will appear here.
                    </p>
                  </div>
                ) : (
                  <div className={`${interestsIsFullscreen ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}`}>
                    {demoInterests.map((interest) => (
                      <Card key={interest.id} className="bg-white/5 border-white/10 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            {/* Avatar */}
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[hsl(var(--cyan-glow))] to-[hsl(var(--primary))] flex items-center justify-center shrink-0">
                              <Building2 className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-white mb-1 cursor-pointer hover:text-[hsl(var(--cyan-glow))] transition-colors">
                                {interest.analyst_name || 'VC Analyst'}
                              </h4>
                              <p className="text-sm text-white/60 mb-2">
                                {interest.analyst_title ? `${interest.analyst_title} at ` : ''}{interest.firm_name}
                              </p>

                              <div className="flex flex-wrap gap-2 mb-3">
                                <Badge className="bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))] border-[hsl(var(--cyan-glow))]/20 text-xs">
                                  AI/ML
                                </Badge>
                                <Badge className="bg-white/10 text-white/80 border-white/20 text-xs">
                                  Seed
                                </Badge>
                              </div>

                              {interest.sync_note && (
                                <div className="bg-white/5 rounded-lg p-3 border border-white/10 mb-3">
                                  <p className="text-white/70 text-sm italic">"{interest.sync_note}"</p>
                                </div>
                              )}

                              <div className="flex flex-wrap gap-3 text-xs text-white/50">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  San Francisco, CA
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {interest.created_at}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2 shrink-0">
                            <Button
                              size="sm"
                              className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        )}

        {/* Syncs Modal - EXACTLY matches SyncsModal.tsx */}
        {showSyncsModal && (
          <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4" onClick={() => { setShowSyncsModal(false); setSyncsIsFullscreen(false); }}>
            <div
              className={`bg-[hsl(var(--navy-deep))] border-white/10 border rounded-lg text-white overflow-hidden transition-all duration-300 ${
                syncsIsFullscreen
                  ? "max-w-[100vw] w-[100vw] h-[100vh] max-h-[100vh] rounded-none"
                  : "max-w-2xl max-h-[80vh] w-full"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 pb-0">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-xl font-semibold">
                    <img src={syncsLogo} alt="Syncs" className="h-6 w-10 object-contain" />
                    Active Syncs
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSyncsIsFullscreen(!syncsIsFullscreen)}
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    {syncsIsFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                  </Button>
                </div>
              </div>

              <ScrollArea className={`p-6 pt-4 ${syncsIsFullscreen ? "h-[calc(100vh-100px)]" : "max-h-[60vh]"}`}>
                {demoSyncs.length === 0 ? (
                  <div className="text-center py-12">
                    <img src={syncsLogo} alt="Syncs" className="h-16 w-24 object-contain mx-auto mb-4 opacity-20" />
                    <h3 className="text-lg font-semibold mb-2">No active syncs yet</h3>
                    <p className="text-white/60 text-sm">
                      When analysts accept your requests or you accept theirs, they'll appear here.
                    </p>
                  </div>
                ) : (
                  <div className={`${syncsIsFullscreen ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}`}>
                    {demoSyncs.map((sync) => (
                      <div
                        key={sync.id}
                        className="bg-white/5 border border-white/10 rounded-lg p-4"
                      >
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[hsl(var(--cyan-glow))] to-[hsl(var(--primary))] flex items-center justify-center shrink-0">
                            <Building2 className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-white cursor-pointer hover:text-[hsl(var(--cyan-glow))] transition-colors">
                                {sync.analyst_name || 'VC Analyst'}
                              </h4>
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                                Synced
                              </Badge>
                            </div>

                            {/* Show firm name underneath analyst name */}
                            <p className="text-sm text-white/70 mb-1">
                              {sync.analyst_title ? `${sync.analyst_title} at ` : ''}{sync.firm_name}
                            </p>

                            {sync.hq_location && (
                              <p className="text-sm text-white/60 flex items-center gap-1 mb-2">
                                <MapPin className="h-3 w-3" />
                                {sync.hq_location}
                              </p>
                            )}

                            {sync.stage_focus && sync.stage_focus.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {sync.stage_focus.slice(0, 3).map((stage, i) => (
                                  <Badge key={i} className="bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))] border-[hsl(var(--cyan-glow))]/20 text-xs">
                                    {stage}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                              <p className="text-xs text-white/50 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Synced {sync.synced_at}
                              </p>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                                >
                                  <Video className="mr-1 h-3 w-3" />
                                  Schedule
                                  <ExternalLink className="ml-1 h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-[hsl(var(--cyan-glow))]/30 text-[hsl(var(--cyan-glow))] hover:bg-[hsl(var(--cyan-glow))]/10"
                                  onClick={() => setShowMessagesModal(true)}
                                >
                                  <MessageSquare className="mr-1 h-3 w-3" />
                                  Message
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        )}

        {/* Pending Modal - EXACTLY matches PendingModal.tsx */}
        {showPendingModal && (
          <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4" onClick={() => { setShowPendingModal(false); setPendingIsFullscreen(false); }}>
            <div
              className={`bg-[hsl(var(--navy-deep))] border-white/10 border rounded-lg text-white overflow-hidden transition-all duration-300 ${
                pendingIsFullscreen
                  ? "max-w-[100vw] w-[100vw] h-[100vh] max-h-[100vh] rounded-none"
                  : "max-w-2xl max-h-[80vh] w-full"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 pb-0">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-xl font-semibold">
                    <Eye className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
                    Pending Requests
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setPendingIsFullscreen(!pendingIsFullscreen)}
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    {pendingIsFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                  </Button>
                </div>
              </div>

              <ScrollArea className={`p-6 pt-4 ${pendingIsFullscreen ? "h-[calc(100vh-100px)]" : "max-h-[60vh]"}`}>
                {demoPending.length === 0 ? (
                  <div className="text-center py-12">
                    <Eye className="h-12 w-12 text-white/20 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No pending requests</h3>
                    <p className="text-white/60 text-sm">
                      Your sync requests to analysts will appear here while awaiting response.
                    </p>
                  </div>
                ) : (
                  <div className={`${pendingIsFullscreen ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}`}>
                    {demoPending.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white/5 border border-white/10 rounded-lg p-4"
                      >
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500/50 to-orange-500/50 flex items-center justify-center shrink-0">
                            <Clock className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-white cursor-pointer hover:text-[hsl(var(--cyan-glow))] transition-colors">
                                VC Analyst
                              </h4>
                              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                                Pending
                              </Badge>
                            </div>

                            {/* Show firm name underneath analyst name */}
                            <p className="text-sm text-white/70 mb-1">
                              {item.firm_name}
                            </p>

                            {item.hq_location && (
                              <p className="text-sm text-white/60 flex items-center gap-1 mb-2">
                                <MapPin className="h-3 w-3" />
                                {item.hq_location}
                              </p>
                            )}

                            {item.stage_focus && item.stage_focus.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {item.stage_focus.slice(0, 3).map((stage, i) => (
                                  <Badge key={i} className="bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))] border-[hsl(var(--cyan-glow))]/20 text-xs">
                                    {stage}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {item.sync_note && (
                              <div className="bg-white/5 rounded-md p-2 mb-2">
                                <p className="text-sm text-white/70 italic">"{item.sync_note}"</p>
                              </div>
                            )}

                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                              <p className="text-xs text-white/50 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Sent {item.sent_at}
                              </p>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                              >
                                <X className="mr-1 h-3 w-3" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        )}

        {/* Messages Modal - EXACTLY matches MessagesModal.tsx */}
        {showMessagesModal && (
          <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4" onClick={() => { setShowMessagesModal(false); setMessagesIsFullscreen(false); setSelectedMessageThread(null); setNewMessage(""); }}>
            <div
              className={`bg-[hsl(var(--navy-deep))] border-white/10 border rounded-lg text-white overflow-hidden transition-all duration-300 ${
                messagesIsFullscreen
                  ? "max-w-[100vw] w-[100vw] h-[100vh] max-h-[100vh] rounded-none"
                  : "max-w-3xl max-h-[80vh] w-full"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 pb-0">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-xl font-semibold">
                    <MessageSquare className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
                    Messages
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMessagesIsFullscreen(!messagesIsFullscreen)}
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    {messagesIsFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                  </Button>
                </div>
              </div>

              {demoMessages.length === 0 ? (
                <div className="text-center py-12 px-6">
                  <MessageSquare className="h-12 w-12 text-white/20 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                  <p className="text-white/60 text-sm">
                    Start a conversation by syncing with investors.
                  </p>
                </div>
              ) : selectedMessageThread ? (
                // Thread view
                <div className={`flex flex-col ${messagesIsFullscreen ? "h-[calc(100vh-100px)]" : "h-[60vh]"}`}>
                  <div className="px-6 py-3 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedMessageThread(null)}
                        className="text-white/60 hover:text-white"
                      >
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back
                      </Button>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--cyan-glow))] to-[hsl(var(--primary))] flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">{selectedMessageThread.other_user_company}</p>
                          <p className="text-xs text-white/50">{selectedMessageThread.other_user_name}</p>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                    >
                      <Video className="mr-1 h-3 w-3" />
                      Schedule Meeting
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </div>

                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-3">
                      {selectedMessageThread.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === "self" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg px-4 py-2 ${
                              msg.sender === "self"
                                ? "bg-[hsl(var(--cyan-glow))]/20 text-white"
                                : "bg-white/5 text-white/90"
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <p className="text-xs text-white/40 mt-1">{msg.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <div className="p-4 border-t border-white/10 flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    />
                    <Button
                      size="icon"
                      disabled={!newMessage.trim()}
                      className="bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--cyan-bright))] disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                // Thread list view
                <ScrollArea className={`p-6 pt-4 ${messagesIsFullscreen ? "h-[calc(100vh-100px)]" : "max-h-[60vh]"}`}>
                  <div className={`${messagesIsFullscreen ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-2"}`}>
                    {demoMessages.map((thread) => (
                      <div
                        key={thread.id}
                        className="bg-white/5 border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => setSelectedMessageThread(thread)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(var(--cyan-glow))] to-[hsl(var(--primary))] flex items-center justify-center shrink-0">
                            <Building2 className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-white text-sm truncate">
                                {thread.other_user_company}
                              </h4>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-white/50">
                                  {thread.last_message_time}
                                </span>
                                {thread.unread_count > 0 && (
                                  <Badge className="bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))] text-xs h-5 w-5 p-0 flex items-center justify-center">
                                    {thread.unread_count}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-white/50 mb-1">{thread.other_user_name}</p>
                            <p className="text-sm text-white/70 truncate">{thread.last_message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>
        )}

        {/* Investor Profile Modal - EXACTLY matches InvestorProfileModal.tsx */}
        {showInvestorModal && selectedInvestor && (
          <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4" onClick={() => { setShowInvestorModal(false); setInvestorViewMode("condensed"); setInvestorIsFullscreen(false); }}>
            <div
              className={`bg-[hsl(var(--navy-deep))] border-[hsl(var(--cyan-glow))]/20 border rounded-lg overflow-hidden transition-all duration-300 ${
                investorIsFullscreen
                  ? 'max-w-[100vw] w-[100vw] h-[100vh] max-h-[100vh] rounded-none'
                  : 'max-w-5xl max-h-[95vh] w-full'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <ScrollArea className={investorIsFullscreen ? "h-[100vh]" : "max-h-[95vh]"}>
                <div className="p-6 space-y-6">
                  {/* Back Button */}
                  <Button
                    onClick={() => { setShowInvestorModal(false); setInvestorViewMode("condensed"); setInvestorIsFullscreen(false); }}
                    className="bg-[hsl(var(--cyan-glow))] text-[#151a24] hover:bg-[hsl(var(--cyan-bright))] shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all duration-300 font-semibold"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>

                  {/* Header */}
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Investment Thesis</h2>
                      <p className="text-white/60">Investor profile and investment criteria</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Tabs value={investorViewMode} onValueChange={(v) => setInvestorViewMode(v as "condensed" | "full")}>
                        <TabsList className="bg-white/10">
                          <TabsTrigger value="condensed" className="data-[state=active]:bg-[hsl(var(--cyan-glow))] data-[state=active]:text-[hsl(var(--navy-deep))]">
                            <FileText className="h-4 w-4 mr-2" />
                            Condensed
                          </TabsTrigger>
                          <TabsTrigger value="full" className="data-[state=active]:bg-[hsl(var(--cyan-glow))] data-[state=active]:text-[hsl(var(--navy-deep))]">
                            <Eye className="h-4 w-4 mr-2" />
                            Full Thesis
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setInvestorIsFullscreen(!investorIsFullscreen)}
                        className="border-white/20 text-white/70 hover:text-white hover:bg-white/10"
                      >
                        {investorIsFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Condensed View */}
                  {investorViewMode === "condensed" && (
                    <div className="space-y-6">
                      {/* Executive Summary Card */}
                      <Card className="bg-navy-card border-[hsl(var(--cyan-glow))]/30 p-8 relative overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.08)]">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[hsl(var(--cyan-glow))]/5 rounded-full -translate-y-1/2 translate-x-1/2" />

                        <div className="relative z-10">
                          <div className="flex items-start justify-between gap-6 mb-6">
                            <div className="flex items-center gap-4">
                              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[hsl(var(--cyan-glow))] to-[hsl(var(--primary))] flex items-center justify-center shadow-lg shadow-[hsl(var(--cyan-glow))]/20">
                                <Building2 className="h-10 w-10 text-white" />
                              </div>
                              <div>
                                <h1 className="text-3xl font-bold text-white mb-2">{selectedInvestor.firm_name}</h1>
                                <div className="flex flex-wrap gap-2">
                                  {selectedInvestor.sector_tags.slice(0, 1).map((sector, i) => (
                                    <Badge key={i} className="bg-[hsl(var(--cyan-glow))]/20 text-[hsl(var(--cyan-glow))] border-[hsl(var(--cyan-glow))]/30 text-sm">
                                      {sector}
                                    </Badge>
                                  ))}
                                  {selectedInvestor.stage_focus.slice(0, 1).map((stage, i) => (
                                    <Badge key={i} className="bg-white/10 text-white/80 border-white/20 text-sm">
                                      {stage}
                                    </Badge>
                                  ))}
                                  {selectedInvestor.hq_location && (
                                    <Badge className="bg-[hsl(var(--cyan-bright))]/20 text-[hsl(var(--cyan-bright))] border-[hsl(var(--cyan-bright))]/30 text-sm">
                                      <MapPin className="h-3 w-3 mr-1" /> {selectedInvestor.hq_location}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Thesis Statement */}
                          <div className="bg-white/5 rounded-xl p-4 mb-6">
                            <p className="text-lg text-white/90 italic">
                              "{selectedInvestor.thesis_statement?.slice(0, 200)}{selectedInvestor.thesis_statement && selectedInvestor.thesis_statement.length > 200 ? '...' : ''}"
                            </p>
                          </div>

                          {/* Key Metrics Row */}
                          <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all group border border-transparent hover:border-[hsl(var(--cyan-glow))]/30">
                              <p className="text-sm text-white/50 mb-1 group-hover:text-[hsl(var(--cyan-glow))] transition-colors">Check Size</p>
                              <p className="text-xl font-bold text-white">{selectedInvestor.check_sizes?.[0] || "—"}</p>
                              <p className="text-xs text-white/30 mt-1 group-hover:text-white/50 flex items-center justify-center gap-1">
                                View details <ChevronRight className="h-3 w-3" />
                              </p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all group border border-transparent hover:border-[hsl(var(--cyan-glow))]/30">
                              <p className="text-sm text-white/50 mb-1 group-hover:text-[hsl(var(--cyan-glow))] transition-colors">Stage Focus</p>
                              <p className="text-xl font-bold text-white">{selectedInvestor.stage_focus?.[0] || "—"}</p>
                              <p className="text-xs text-white/30 mt-1 group-hover:text-white/50 flex items-center justify-center gap-1">
                                View details <ChevronRight className="h-3 w-3" />
                              </p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all group border border-transparent hover:border-[hsl(var(--cyan-glow))]/30">
                              <p className="text-sm text-white/50 mb-1 group-hover:text-[hsl(var(--cyan-glow))] transition-colors">Decision Time</p>
                              <p className="text-xl font-bold text-white">2-4 weeks</p>
                              <p className="text-xs text-white/30 mt-1 group-hover:text-white/50 flex items-center justify-center gap-1">
                                View details <ChevronRight className="h-3 w-3" />
                              </p>
                            </div>
                          </div>
                        </div>
                      </Card>

                      {/* Quick Stats Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="bg-navy-card border-white/10 p-4 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                              <DollarSign className="h-5 w-5 text-[hsl(var(--cyan-glow))]/70" />
                            </div>
                            <div>
                              <p className="text-white/40 text-xs font-medium">AUM</p>
                              <p className="text-white font-semibold">{selectedInvestor.aum || "—"}</p>
                            </div>
                          </div>
                        </Card>
                        <Card className="bg-navy-card border-white/10 p-4 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                              <Briefcase className="h-5 w-5 text-purple-400/70" />
                            </div>
                            <div>
                              <p className="text-white/40 text-xs font-medium">Fund Type</p>
                              <p className="text-white font-semibold">{selectedInvestor.fund_type || "—"}</p>
                            </div>
                          </div>
                        </Card>
                        <Card className="bg-navy-card border-white/10 p-4 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                              <TrendingUp className="h-5 w-5 text-emerald-400/70" />
                            </div>
                            <div>
                              <p className="text-white/40 text-xs font-medium">Lead/Follow</p>
                              <p className="text-white font-semibold">{selectedInvestor.lead_follow || "—"}</p>
                            </div>
                          </div>
                        </Card>
                        <Card className="bg-navy-card border-white/10 p-4 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                              <Handshake className="h-5 w-5 text-amber-400/70" />
                            </div>
                            <div>
                              <p className="text-white/40 text-xs font-medium">Support Style</p>
                              <p className="text-white font-semibold">Hands-on</p>
                            </div>
                          </div>
                        </Card>
                      </div>

                      {/* Fast Signals & Hard Nos */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <Card className="bg-navy-card border-white/10 p-6 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                              <Zap className="h-4 w-4 text-emerald-400/70" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">Fast Signals</h3>
                          </div>
                          <p className="text-white/70 leading-relaxed">
                            Strong technical team, product-market fit indicators, clear differentiation...
                          </p>
                        </Card>

                        <Card className="bg-navy-card border-white/10 p-6 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                              <XCircle className="h-4 w-4 text-rose-400/70" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">Hard Nos</h3>
                          </div>
                          <p className="text-white/70 leading-relaxed">
                            {selectedInvestor.hard_nos.length > 0
                              ? selectedInvestor.hard_nos.slice(0, 2).join(", ") + (selectedInvestor.hard_nos.length > 2 ? "..." : "")
                              : "Dealbreakers for this investor."}
                          </p>
                        </Card>
                      </div>
                    </div>
                  )}

                  {/* Full Thesis View */}
                  {investorViewMode === "full" && (
                    <div className="space-y-8">
                      {/* Header Section */}
                      <Card className="bg-navy-card border-[hsl(var(--cyan-glow))]/30 p-8 shadow-[0_0_15px_rgba(6,182,212,0.08)]">
                        <div className="text-center mb-8">
                          <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-[hsl(var(--cyan-glow))] to-[hsl(var(--primary))] flex items-center justify-center shadow-lg shadow-[hsl(var(--cyan-glow))]/20 mb-4">
                            <Building2 className="h-12 w-12 text-white" />
                          </div>
                          <h1 className="text-4xl font-bold text-white mb-2">{selectedInvestor.firm_name}</h1>
                          <p className="text-xl text-white/70 mb-4">{selectedInvestor.fund_type} • {selectedInvestor.lead_follow}</p>
                          <div className="flex justify-center gap-4 text-sm text-white/60">
                            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {selectedInvestor.hq_location || "Location not specified"}</span>
                            {selectedInvestor.aum && <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" /> {selectedInvestor.aum}</span>}
                          </div>
                        </div>

                        <div className="max-w-3xl mx-auto">
                          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                            <h3 className="text-sm font-semibold text-[hsl(var(--cyan-glow))] uppercase tracking-wider mb-3">Investment Thesis</h3>
                            <p className="text-lg text-white/90 leading-relaxed">
                              {selectedInvestor.thesis_statement || "Investment thesis will appear here."}
                            </p>
                          </div>
                        </div>
                      </Card>

                      {/* Firm Description */}
                      {selectedInvestor.firm_description && (
                        <Card className="bg-navy-card border-white/10 p-8 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                              <Building2 className="h-5 w-5 text-[hsl(var(--cyan-glow))]/70" />
                            </div>
                            <h2 className="text-xl font-bold text-white">About the Firm</h2>
                          </div>
                          <p className="text-white/70 leading-relaxed">
                            {selectedInvestor.firm_description}
                          </p>
                        </Card>
                      )}

                      {/* Focus Areas */}
                      {selectedInvestor.sub_themes && selectedInvestor.sub_themes.length > 0 && (
                        <Card className="bg-navy-card border-white/10 p-8 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                              <Target className="h-5 w-5 text-purple-400/70" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Focus Areas</h2>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {selectedInvestor.sub_themes.map((theme, i) => (
                              <Badge key={i} className="bg-purple-500/20 border-purple-500/40 text-purple-300 px-3 py-1.5">
                                {theme}
                              </Badge>
                            ))}
                          </div>
                        </Card>
                      )}

                      {/* Fast Signals & Hard Nos */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <Card className="bg-navy-card border-green-500/20 p-6 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                              <Zap className="h-5 w-5 text-green-400/70" />
                            </div>
                            <div>
                              <h2 className="text-xl font-bold text-white">Fast Signals</h2>
                              <p className="text-white/40 text-sm">What makes them move quickly</p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3 text-white/80">
                              <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                              <span>Strong technical founding team</span>
                            </div>
                            <div className="flex items-start gap-3 text-white/80">
                              <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                              <span>Clear product-market fit signals</span>
                            </div>
                            <div className="flex items-start gap-3 text-white/80">
                              <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                              <span>Differentiated technology or approach</span>
                            </div>
                          </div>
                        </Card>

                        <Card className="bg-navy-card border-red-500/20 p-6 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                              <XCircle className="h-5 w-5 text-red-400/70" />
                            </div>
                            <div>
                              <h2 className="text-xl font-bold text-white">Hard Nos</h2>
                              <p className="text-white/40 text-sm">Dealbreakers</p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            {selectedInvestor.hard_nos.length > 0 ? (
                              selectedInvestor.hard_nos.map((no, i) => (
                                <div key={i} className="flex items-start gap-3 text-white/80">
                                  <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                                  <span>{no}</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-white/40 italic">Not specified</p>
                            )}
                          </div>
                        </Card>
                      </div>

                      {/* Investment Parameters */}
                      <Card className="bg-navy-card border-white/10 p-8 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-emerald-400/70" />
                          </div>
                          <h2 className="text-xl font-bold text-white">Investment Parameters</h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                          <div>
                            <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Check Size</p>
                            <div className="flex flex-wrap gap-2">
                              {selectedInvestor.check_sizes.map((size, i) => (
                                <Badge key={i} className="bg-white/10 border-white/20 text-white">
                                  {size}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Stage Focus</p>
                            <div className="flex flex-wrap gap-2">
                              {selectedInvestor.stage_focus.map((stage, i) => (
                                <Badge key={i} className="bg-white/10 border-white/20 text-white">
                                  {stage}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Decision Timeline</p>
                            <span className="text-white">2-4 weeks</span>
                          </div>
                        </div>
                      </Card>

                      {/* Sectors & Target Customers */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <Card className="bg-navy-card border-white/10 p-6 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                              <Briefcase className="h-5 w-5 text-blue-400/70" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Sectors</h2>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {selectedInvestor.sector_tags.map((sector, i) => (
                              <Badge key={i} className="bg-blue-500/20 border-blue-500/40 text-blue-300">
                                {sector}
                              </Badge>
                            ))}
                          </div>
                        </Card>

                        <Card className="bg-navy-card border-white/10 p-6 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                              <Users className="h-5 w-5 text-cyan-400/70" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Target Customers</h2>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge className="bg-cyan-500/20 border-cyan-500/40 text-cyan-300">
                              Enterprise
                            </Badge>
                            <Badge className="bg-cyan-500/20 border-cyan-500/40 text-cyan-300">
                              SMB
                            </Badge>
                          </div>
                        </Card>
                      </div>

                      {/* Value-Add */}
                      <Card className="bg-navy-card border-amber-500/20 p-8 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                            <Handshake className="h-5 w-5 text-amber-400/70" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-white">How They Add Value</h2>
                            <p className="text-white/40 text-sm">Hands-on engagement</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {selectedInvestor.operating_support.map((support, i) => (
                            <Badge key={i} className="bg-amber-500/20 border-amber-500/40 text-amber-300">
                              {support}
                            </Badge>
                          ))}
                        </div>
                      </Card>
                    </div>
                  )}

                  {/* Analysts Section */}
                  <div className="border-t border-white/10 pt-6">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-white mb-2">Team Members at {selectedInvestor.firm_name}</h3>
                      <p className="text-white/60 text-sm">Connect directly with an analyst sourcing in your area</p>
                    </div>

                    <div className="grid gap-4">
                      {[
                        { id: "1", name: "Anna", location: "Boston, MA", vertical: "AI/ML", oneLiner: "Passionate about deep tech and founder-first investing." },
                        { id: "2", name: "John", location: "New York, NY", vertical: "FinTech", oneLiner: "Former founder, now helping the next generation scale." },
                      ].map((analyst) => (
                        <Card
                          key={analyst.id}
                          className="bg-navy-card border-white/10 p-5 hover:border-[hsl(var(--cyan-glow))]/40 transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.05)]"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                              {/* Analyst Avatar */}
                              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[hsl(var(--cyan-glow))]/30 to-[hsl(var(--primary))]/30 flex items-center justify-center border border-[hsl(var(--cyan-glow))]/20 flex-shrink-0">
                                <Users className="h-7 w-7 text-[hsl(var(--cyan-glow))]/80" />
                              </div>

                              {/* Analyst Info */}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-lg font-semibold text-white mb-1">{analyst.name}</h4>
                                <div className="flex flex-wrap gap-2 mb-2">
                                  <Badge className="bg-[hsl(var(--cyan-glow))]/20 text-[hsl(var(--cyan-glow))] border-[hsl(var(--cyan-glow))]/30 text-xs">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {analyst.location}
                                  </Badge>
                                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                                    <Target className="h-3 w-3 mr-1" />
                                    {analyst.vertical}
                                  </Badge>
                                </div>
                                <p className="text-white/60 text-sm italic">"{analyst.oneLiner}"</p>
                              </div>
                            </div>

                            {/* Sync Button */}
                            <Button
                              className="bg-[hsl(220,60%,8%)] text-[hsl(var(--cyan-glow))] hover:bg-[hsl(220,60%,12%)] border border-[hsl(var(--cyan-glow))]/40 shadow-[0_0_15px_rgba(6,182,212,0.15)] flex-shrink-0 h-auto py-3 px-4"
                            >
                              <img
                                src={insyncInfinity}
                                alt="Sync"
                                className="mr-3 h-12 w-20 object-contain brightness-125 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                              />
                              <span className="text-sm whitespace-nowrap">
                                Sync with {analyst.name}
                              </span>
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Application Flow View - matches FounderApplication.tsx exactly
  return (
    <div className="fixed inset-0 z-50 overflow-auto" style={{ background: "var(--gradient-navy-teal)" }} onWheel={(e) => {
      // Prevent body scroll when modals are open
      if (showMemoModal || showInterestsModal || showSyncsModal || showPendingModal || showMessagesModal || showInvestorModal) {
        e.stopPropagation();
      }
    }}>
      {/* Decorative Elements - matching FounderApplication */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] border border-[hsl(var(--cyan-glow))]/30 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] border border-[hsl(var(--cyan-glow))]/20 rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Header with demo controls */}
      <div className="sticky top-0 z-20 bg-[hsl(var(--navy-deep))]/80 backdrop-blur-lg border-b border-white/10">
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
