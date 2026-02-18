import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Users,
  Clock,
  Check,
  Send,
  Globe,
  Upload,
  UserCog,
  Shield,
  Handshake,
  FolderOpen,
  Briefcase,
  Plus,
  ChevronDown,
  ChevronUp,
  Linkedin,
  ExternalLink,
} from "lucide-react";

// Demo steps for VC application - matches actual InvestorApplication exactly
const STEPS = [
  { id: 0, title: "Welcome", icon: Sparkles },
  { id: 1, title: "Admin & Verification", icon: Shield },
  { id: 2, title: "Fund Overview", icon: Building2 },
  { id: 3, title: "Investment Strategy", icon: Target },
  { id: 4, title: "Value-Add", icon: Handshake },
  { id: 5, title: "Portfolio", icon: FolderOpen },
  { id: 6, title: "Deal Mechanics (Optional)", icon: Briefcase },
];

// Constants matching InvestorApplication
const FUND_TYPES = ["VC", "Micro-VC", "Seed Fund", "Angel Syndicate", "CVC", "Family Office", "Accelerator Fund"];
const STAGE_FOCUS = ["Idea/Concept", "Pre-seed", "Seed", "Seed+", "Series A", "Series A+", "Series B", "Series B+", "Series C+", "Growth", "Late Stage"];
const OPERATING_SUPPORT = [
  "Executive hiring",
  "IC hiring",
  "Sales strategy",
  "Marketing strategy",
  "Enterprise customer intros",
  "Fundraising prep",
  "Investor intros",
  "Product roadmap",
  "Technical architecture",
  "Strategic partnerships",
  "Channel partnerships",
  "Legal/compliance",
  "Security guidance",
  "Founder community",
  "Events/networking",
  "Other"
];
const DECISION_PROCESS = ["Partner-led", "IC", "Rolling", "Committee"];
const RESPONSE_TIMES = ["24h", "48h", "1 week", "2 weeks", "Varies"];
const DECISION_TIMES = ["2–4 wks", "4–8 wks", "8+ wks"];
const BOARD_INVOLVEMENT = ["None", "Observer", "Board seat sometimes", "Usually"];
const LOCATION_BRANCHES = ["Boston", "New York", "San Francisco", "Los Angeles", "Chicago", "Seattle", "Austin", "Denver", "Miami", "Atlanta", "Washington DC", "Philadelphia", "Dallas", "Houston", "Phoenix", "San Diego", "Toronto", "London", "Tel Aviv", "Singapore", "Berlin", "Paris", "Mumbai", "Bangalore", "Shanghai", "Tokyo", "Sydney", "Other"];

// Mock startups for dashboard - matches FounderApplication interface
const mockStartups = [
  {
    id: "startup-1",
    company_name: "NeuralFlow AI",
    founder_name: "Sarah Chen",
    location: "San Francisco, CA",
    stage: "Seed",
    vertical: "AI/ML Infrastructure",
    funding_goal: "$3M",
    website: "https://neuralflow.ai",
    description: "B2B SaaS platform enabling enterprises to deploy and manage ML models at scale with automated MLOps pipelines.",
    business_model: "B2B SaaS with usage-based pricing. Average contract value of $50K/year.",
    problem: "90% of ML models never make it to production due to infrastructure complexity and lack of MLOps expertise.",
    solution: "One-click deployment with automated scaling, monitoring, and rollback capabilities. No infrastructure expertise required.",
    traction: "15 enterprise customers, $800K ARR, 3x growth QoQ",
    team: [
      { name: "Sarah Chen", role: "CEO", background: "Ex-Google ML Engineer, Stanford CS PhD" },
      { name: "Michael Wu", role: "CTO", background: "Ex-AWS, 8 years ML infrastructure" },
    ],
    pitch_deck_url: "https://example.com/deck.pdf",
    linkedin_url: "https://linkedin.com/in/sarahchen",
    calendly_link: "https://calendly.com/neuralflow",
    user_id: "startup-user-1",
  },
  {
    id: "startup-2",
    company_name: "ClimateLedger",
    founder_name: "Marcus Johnson",
    location: "Austin, TX",
    stage: "Pre-seed",
    vertical: "Climate Tech",
    funding_goal: "$1.5M",
    website: "https://climateledger.io",
    description: "Carbon credit verification platform using blockchain for transparent ESG reporting and compliance.",
    business_model: "Transaction fee on verified carbon credits (2.5%) plus enterprise SaaS subscriptions.",
    problem: "Carbon credit markets lack transparency, leading to double-counting and greenwashing concerns.",
    solution: "Blockchain-based verification system that provides immutable audit trails and real-time carbon accounting.",
    traction: "Pilot with 3 Fortune 500 companies, $200K in LOIs",
    team: [
      { name: "Marcus Johnson", role: "CEO", background: "Former sustainability lead at Shell" },
      { name: "Elena Torres", role: "CTO", background: "Blockchain engineer, ex-ConsenSys" },
    ],
    pitch_deck_url: null,
    linkedin_url: "https://linkedin.com/in/marcusjohnson",
    calendly_link: null,
    user_id: "startup-user-2",
  },
  {
    id: "startup-3",
    company_name: "MedSync Health",
    founder_name: "Priya Patel",
    location: "Boston, MA",
    stage: "Seed",
    vertical: "Digital Health",
    funding_goal: "$4M",
    website: "https://medsynchealth.com",
    description: "AI-powered clinical workflow automation reducing administrative burden for healthcare providers by 60%.",
    business_model: "Per-provider monthly subscription ($500/month) with volume discounts for health systems.",
    problem: "Physicians spend 2+ hours daily on administrative tasks, leading to burnout and reduced patient care quality.",
    solution: "AI assistant that automates documentation, scheduling, and prior authorizations directly within existing EHR systems.",
    traction: "20 clinic partnerships, $500K ARR, 95% provider satisfaction score",
    team: [
      { name: "Priya Patel", role: "CEO", background: "Former physician, Harvard MBA" },
      { name: "James Liu", role: "CTO", background: "Ex-Epic, health IT veteran" },
    ],
    pitch_deck_url: "https://example.com/medsync-deck.pdf",
    linkedin_url: "https://linkedin.com/in/priyapatel",
    calendly_link: "https://calendly.com/medsync",
    user_id: "startup-user-3",
  },
  {
    id: "startup-4",
    company_name: "FinanceOS",
    founder_name: "David Kim",
    location: "New York, NY",
    stage: "Series A",
    vertical: "Fintech",
    funding_goal: "$10M",
    website: "https://financeos.co",
    description: "Unified treasury management platform for mid-market companies with real-time cash flow visibility.",
    business_model: "Monthly SaaS subscription based on transaction volume. $2K-$15K/month per customer.",
    problem: "Mid-market CFOs use 5+ tools to manage cash, payments, and forecasting with no unified view.",
    solution: "Single platform connecting all bank accounts with AI-powered cash forecasting and automated payments.",
    traction: "50+ customers, $2M ARR, 140% net revenue retention",
    team: [
      { name: "David Kim", role: "CEO", background: "Former CFO at Series D startup" },
      { name: "Anna Petrov", role: "CTO", background: "Ex-Stripe engineering lead" },
    ],
    pitch_deck_url: null,
    linkedin_url: "https://linkedin.com/in/davidkim",
    calendly_link: "https://calendly.com/financeos",
    user_id: "startup-user-4",
  },
];

// Demo data for interests (startups who want to sync with this VC)
const demoInterests = [
  {
    id: "int-1",
    requester_user_id: "startup-user-1",
    company_name: "NeuralFlow AI",
    founder_name: "Sarah Chen",
    vertical: "AI/ML Infrastructure",
    stage: "Seed",
    location: "San Francisco, CA",
    funding_goal: "$3M",
    sync_note: "Your thesis on AI infrastructure aligns perfectly with our roadmap. Would love to discuss a potential partnership.",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "int-2",
    requester_user_id: "startup-user-2",
    company_name: "ClimateLedger",
    founder_name: "Marcus Johnson",
    vertical: "Climate Tech",
    stage: "Pre-seed",
    location: "Austin, TX",
    funding_goal: "$1.5M",
    sync_note: null,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Demo data for syncs (mutual connections)
const demoSyncs = [
  {
    id: "sync-1",
    other_user_id: "startup-user-3",
    company_name: "MedSync Health",
    founder_name: "Priya Patel",
    vertical: "Digital Health",
    stage: "Seed",
    location: "Boston, MA",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sync-2",
    other_user_id: "startup-user-4",
    company_name: "FinanceOS",
    founder_name: "David Kim",
    vertical: "Fintech",
    stage: "Series A",
    location: "New York, NY",
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Demo data for pending requests (outgoing)
const demoPending = [
  {
    id: "pend-1",
    target_user_id: "startup-user-5",
    company_name: "SupplyChain360",
    founder_name: "Elena Rodriguez",
    vertical: "Supply Chain & Logistics",
    stage: "Seed",
    location: "Miami, FL",
    sync_note: "Your traction in the supply chain space is impressive. Would love to learn more about your expansion plans.",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Demo messages
const demoMessages = [
  {
    id: "msg-1",
    other_user_id: "startup-user-3",
    other_user_name: "Priya Patel",
    other_user_company: "MedSync Health",
    last_message: "Thanks for the intro to the health system. The meeting went great!",
    last_message_time: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    unread_count: 1,
    messages: [
      { id: "m1", sender: "self" as const, content: "I'd like to introduce you to our portfolio company's head of partnerships at a major health system.", timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString() },
      { id: "m2", sender: "other" as const, content: "That would be amazing! We've been looking to expand our health system partnerships.", timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
      { id: "m3", sender: "self" as const, content: "I'll set up the intro. Expect an email from Sarah at Northeast Health.", timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
      { id: "m4", sender: "other" as const, content: "Thanks for the intro to the health system. The meeting went great!", timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
    ],
  },
  {
    id: "msg-2",
    other_user_id: "startup-user-4",
    other_user_name: "David Kim",
    other_user_company: "FinanceOS",
    last_message: "The board deck is ready for your review.",
    last_message_time: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    unread_count: 0,
    messages: [
      { id: "m1", sender: "other" as const, content: "The board deck is ready for your review.", timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
    ],
  },
];

// Demo thesis data - matches InvestorApplication interface
const demoThesis = {
  firm_name: "Demo Ventures",
  firm_description: "Early-stage fund focused on technical B2B founders building enterprise software.",
  hq_location: "San Francisco, CA",
  aum: "$150M",
  fund_type: "Early Stage VC",
  stage_focus: ["Pre-seed", "Seed"],
  sector_tags: ["AI/ML", "Enterprise SaaS", "Developer Tools"],
  check_sizes: ["$500K - $2M"],
  thesis_statement: "We invest in technical founders building B2B software that becomes critical infrastructure for enterprises. We focus on AI/ML, developer tools, and enterprise SaaS.",
  sub_themes: ["MLOps", "Developer Experience", "Data Infrastructure", "API-First Products"],
  fast_signals: ["Technical founder with domain expertise", "Clear wedge into large market", "Early product-led growth"],
  hard_nos: ["Consumer apps", "Hardware-only", "Pre-product companies", "Crypto/Web3"],
  operating_support: ["Executive hiring", "Sales strategy", "Fundraising prep", "Product roadmap", "Technical architecture", "Investor intros"],
  support_style: "Hands-on during critical phases, otherwise available as needed",
  lead_follow: "Lead",
  geographic_focus: "US & Canada",
  b2b_b2c: "B2B only",
  customer_types: ["Enterprise", "SMB"],
  revenue_models: ["SaaS", "Usage-based"],
  minimum_traction: ["$50K ARR", "5+ paying customers"],
  board_involvement: "Board seat at Seed+",
  decision_process: "2 partner meetings, 2-week decision timeline",
  time_to_decision: "2-3 weeks",
};

// Demo analyst profile - matches AnalystProfile interface
const demoAnalystProfile = {
  name: "Alex Thompson",
  title: "Associate",
  firm_name: "Demo Ventures",
  email: "alex@demoventures.vc",
  location: "San Francisco, CA",
  vertical: "AI/ML, B2B SaaS",
  one_liner: "Former founder helping the next generation scale.",
  linkedin_url: "https://linkedin.com/in/alexthompson",
  profile_picture_url: null,
};

// Helper function to format relative time
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return "1 week ago";
  return `${Math.floor(diffDays / 7)} weeks ago`;
};

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

  // Modal states
  const [showThesisModal, setShowThesisModal] = useState(false);
  const [thesisViewMode, setThesisViewMode] = useState<"condensed" | "full">("condensed");
  const [showInterestsModal, setShowInterestsModal] = useState(false);
  const [showSyncsModal, setShowSyncsModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [showMemoModal, setShowMemoModal] = useState(false);
  const [memoViewMode, setMemoViewMode] = useState<"condensed" | "full">("condensed");
  const [selectedStartup, setSelectedStartup] = useState<typeof mockStartups[0] | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Messages modal state
  const [selectedThread, setSelectedThread] = useState<typeof demoMessages[0] | null>(null);
  const [messageInput, setMessageInput] = useState("");

  const goNext = () => {
    if (currentStep < 6) {
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

  // Dashboard View - Matching AnalystDashboard.tsx exactly
  if (showDashboard) {
    return (
      <div className={`fixed inset-0 z-50 bg-[#151a24] flex flex-col min-h-0 ${showThesisModal || showInterestsModal || showSyncsModal || showPendingModal || showMessagesModal || showMemoModal || showProfileModal ? 'overflow-hidden' : ''}`}>
        {/* Header - Matching AnalystDashboard header */}
        <header className="h-14 shrink-0 border-b border-white/10 bg-[hsl(var(--navy-header))] backdrop-blur-sm flex items-center px-6 gap-4 sticky top-0 z-20">
          <Button variant="ghost" size="sm" onClick={goBack} className="text-white/60 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Application
          </Button>
          <div className="h-6 w-px bg-white/20" />
          <span className="text-[hsl(var(--cyan-glow))] text-sm font-medium px-2 py-1 bg-[hsl(var(--cyan-glow))]/10 rounded">VC Demo</span>
          <div className="flex-1" />
          {/* Edit Profile Button - Matching AnalystDashboard */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowProfileModal(true)}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <UserCog className="h-4 w-4 mr-2" />
            Edit My Profile
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </header>

        {/* Content - Matching AnalystDashboard layout */}
        <main className="flex-1 min-h-0 overflow-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto space-y-10">
            {/* Welcome Section - Matching AnalystDashboard */}
            <div>
              <h1 className="text-4xl font-bold text-white">
                Welcome {demoAnalystProfile.name} from {demoAnalystProfile.firm_name}!
              </h1>
              <p className="text-white/60 mt-2">{demoAnalystProfile.title}</p>
            </div>

            {/* Thesis Quick Access - Matching AnalystDashboard exactly */}
            <Card
              className="bg-navy-card border-white/10 p-6 shadow-[0_0_20px_rgba(6,182,212,0.12)] hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:border-[hsl(var(--cyan-glow))]/50 transition-all duration-300 cursor-pointer"
              onClick={() => setShowThesisModal(true)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                    <FileText className="h-7 w-7 text-[hsl(var(--cyan-glow))]" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-white">{demoThesis.firm_name}'s Thesis</p>
                    <p className="text-sm text-white/60">
                      {demoThesis.stage_focus.slice(0, 2).join(" • ")}
                      {demoThesis.sector_tags[0] && ` • ${demoThesis.sector_tags[0]}`}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-6 w-6 text-white/60" />
              </div>
            </Card>

            {/* Stats - Matching AnalystDashboard exactly */}
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
                  <TrendingUp className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
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
                  <p className="text-3xl font-bold text-white">{demoMessages.reduce((acc, t) => acc + t.unread_count, 0)}</p>
                  <p className="text-base text-white/60">Messages</p>
                </div>
              </Card>
            </div>

            {/* Curated Startups - Matching AnalystDashboard exactly */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-white">Curated Startups</h2>
                <button className="text-sm text-[hsl(var(--cyan-glow))] hover:underline flex items-center gap-1">
                  View all <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockStartups.slice(0, 3).map((startup) => (
                  <Card
                    key={startup.id}
                    className="bg-navy-card border-white/10 p-5 shadow-[0_0_15px_rgba(6,182,212,0.08)] hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] hover:border-[hsl(var(--cyan-glow))]/40 transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[hsl(var(--cyan-glow))]/10 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white group-hover:text-[hsl(var(--cyan-glow))] transition-colors">
                            {startup.company_name}
                          </h4>
                          <p className="text-xs text-white/60 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {startup.location}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStageColor(startup.stage)}`}>
                        {startup.stage}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))]">
                        {startup.vertical}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                        {startup.funding_goal}
                      </span>
                    </div>

                    <p className="text-sm text-white/60 mb-4 line-clamp-2">{startup.business_model}</p>

                    <div className="pt-3 border-t border-white/10">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-[hsl(var(--cyan-glow))] hover:bg-[hsl(var(--cyan-glow))]/10"
                        onClick={() => {
                          setSelectedStartup(startup);
                          setMemoViewMode("condensed");
                          setShowMemoModal(true);
                        }}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        View Memo
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Exit Demo CTA */}
            <div className="mt-12 text-center">
              <p className="text-white/50 mb-4">Ready to discover your next portfolio company?</p>
              <Button onClick={onClose} className="bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--cyan-glow))]/90 font-semibold px-8">
                Exit Demo
              </Button>
            </div>
          </div>
        </main>

        {/* ========== MODALS ========== */}

        {/* Thesis Modal - matches InvestorThesisModal exactly */}
        {showThesisModal && (
          <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4" onClick={() => setShowThesisModal(false)}>
            <div className="max-w-5xl w-full max-h-[95vh] bg-[hsl(var(--navy-deep))] border border-[hsl(var(--cyan-glow))]/20 rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="max-h-[95vh] overflow-auto p-6 space-y-6">
                {/* Back Button */}
                <Button
                  onClick={() => setShowThesisModal(false)}
                  className="bg-[hsl(var(--cyan-glow))] text-[#151a24] hover:bg-[hsl(var(--cyan-bright))] shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all duration-300 font-semibold"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Your Dashboard
                </Button>

                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">My Thesis</h2>
                    <p className="text-white/60">Your investment thesis and criteria</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 rounded-lg p-1 flex">
                      <button
                        onClick={() => setThesisViewMode("condensed")}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${
                          thesisViewMode === "condensed"
                            ? "bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))]"
                            : "text-white/70 hover:text-white"
                        }`}
                      >
                        <FileText className="h-4 w-4" />
                        Condensed
                      </button>
                      <button
                        onClick={() => setThesisViewMode("full")}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${
                          thesisViewMode === "full"
                            ? "bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))]"
                            : "text-white/70 hover:text-white"
                        }`}
                      >
                        <Eye className="h-4 w-4" />
                        Full Thesis
                      </button>
                    </div>
                    <Button
                      className="bg-[hsl(var(--cyan-glow))]/20 text-[hsl(var(--cyan-glow))] hover:bg-[hsl(var(--cyan-glow))]/30 border border-[hsl(var(--cyan-glow))]/30"
                    >
                      <UserCog className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>

                {/* Condensed View */}
                {thesisViewMode === "condensed" && (
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
                              <h1 className="text-3xl font-bold text-white mb-2">{demoThesis.firm_name}</h1>
                              <div className="flex flex-wrap gap-2">
                                <span className="bg-[hsl(var(--cyan-glow))]/20 text-[hsl(var(--cyan-glow))] border border-[hsl(var(--cyan-glow))]/30 px-2 py-0.5 rounded-full text-sm">
                                  {demoThesis.sector_tags[0]}
                                </span>
                                <span className="bg-white/10 text-white/80 border border-white/20 px-2 py-0.5 rounded-full text-sm">
                                  {demoThesis.stage_focus[0]}
                                </span>
                                <span className="bg-[hsl(var(--cyan-bright))]/20 text-[hsl(var(--cyan-bright))] border border-[hsl(var(--cyan-bright))]/30 px-2 py-0.5 rounded-full text-sm flex items-center gap-1">
                                  <MapPin className="h-3 w-3" /> {demoThesis.hq_location}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Thesis Statement */}
                        <div className="bg-white/5 rounded-xl p-4 mb-6">
                          <p className="text-lg text-white/90 italic">
                            "{demoThesis.thesis_statement}"
                          </p>
                        </div>

                        {/* Key Metrics Row */}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all group border border-transparent hover:border-[hsl(var(--cyan-glow))]/30">
                            <p className="text-sm text-white/50 mb-1 group-hover:text-[hsl(var(--cyan-glow))] transition-colors">Check Size</p>
                            <p className="text-xl font-bold text-white">{demoThesis.check_sizes[0]}</p>
                            <p className="text-xs text-white/30 mt-1 group-hover:text-white/50 flex items-center justify-center gap-1">
                              View details <ArrowRight className="h-3 w-3" />
                            </p>
                          </div>
                          <div className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all group border border-transparent hover:border-[hsl(var(--cyan-glow))]/30">
                            <p className="text-sm text-white/50 mb-1 group-hover:text-[hsl(var(--cyan-glow))] transition-colors">Stage Focus</p>
                            <p className="text-xl font-bold text-white">{demoThesis.stage_focus[0]}</p>
                            <p className="text-xs text-white/30 mt-1 group-hover:text-white/50 flex items-center justify-center gap-1">
                              View details <ArrowRight className="h-3 w-3" />
                            </p>
                          </div>
                          <div className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all group border border-transparent hover:border-[hsl(var(--cyan-glow))]/30">
                            <p className="text-sm text-white/50 mb-1 group-hover:text-[hsl(var(--cyan-glow))] transition-colors">Decision Time</p>
                            <p className="text-xl font-bold text-white">{demoThesis.time_to_decision}</p>
                            <p className="text-xs text-white/30 mt-1 group-hover:text-white/50 flex items-center justify-center gap-1">
                              View details <ArrowRight className="h-3 w-3" />
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
                            <p className="text-white font-semibold">{demoThesis.aum}</p>
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
                            <p className="text-white font-semibold">{demoThesis.fund_type}</p>
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
                            <p className="text-white font-semibold">{demoThesis.lead_follow}</p>
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
                            <Target className="h-4 w-4 text-emerald-400/70" />
                          </div>
                          <h3 className="text-lg font-semibold text-white">Fast Signals</h3>
                        </div>
                        <p className="text-white/70 leading-relaxed">
                          {demoThesis.fast_signals.slice(0, 2).join(", ")}...
                        </p>
                      </Card>

                      <Card className="bg-navy-card border-white/10 p-6 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                            <X className="h-4 w-4 text-rose-400/70" />
                          </div>
                          <h3 className="text-lg font-semibold text-white">Hard Nos</h3>
                        </div>
                        <p className="text-white/70 leading-relaxed">
                          {demoThesis.hard_nos.slice(0, 2).join(", ")}...
                        </p>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Full Thesis View */}
                {thesisViewMode === "full" && (
                  <div className="space-y-8">
                    {/* Header Section */}
                    <Card className="bg-navy-card border-[hsl(var(--cyan-glow))]/30 p-8 shadow-[0_0_15px_rgba(6,182,212,0.08)]">
                      <div className="text-center mb-8">
                        <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-[hsl(var(--cyan-glow))] to-[hsl(var(--primary))] flex items-center justify-center shadow-lg shadow-[hsl(var(--cyan-glow))]/20 mb-4">
                          <Building2 className="h-12 w-12 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2">{demoThesis.firm_name}</h1>
                        <p className="text-xl text-white/70 mb-4">{demoThesis.fund_type} • {demoThesis.lead_follow}</p>
                        <div className="flex justify-center gap-4 text-sm text-white/60">
                          <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {demoThesis.hq_location}</span>
                          <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" /> {demoThesis.aum}</span>
                        </div>
                      </div>

                      <div className="max-w-3xl mx-auto">
                        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                          <h3 className="text-sm font-semibold text-[hsl(var(--cyan-glow))] uppercase tracking-wider mb-3">Investment Thesis</h3>
                          <p className="text-lg text-white/90 leading-relaxed">
                            {demoThesis.thesis_statement}
                          </p>
                        </div>
                      </div>
                    </Card>

                    {/* Focus Areas */}
                    <Card className="bg-navy-card border-white/10 p-8 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                          <Target className="h-5 w-5 text-purple-400/70" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Focus Areas</h2>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {demoThesis.sub_themes.map((theme, i) => (
                          <span key={i} className="bg-purple-500/20 border border-purple-500/40 text-purple-300 px-3 py-1.5 rounded-full text-sm">
                            {theme}
                          </span>
                        ))}
                      </div>
                    </Card>

                    {/* Fast Signals & Hard Nos */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card className="bg-navy-card border-green-500/20 p-6 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                            <Target className="h-5 w-5 text-green-400/70" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-white">Fast Signals</h2>
                            <p className="text-white/40 text-sm">What makes you move quickly</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {demoThesis.fast_signals.map((signal, i) => (
                            <div key={i} className="flex items-start gap-3 text-white/80">
                              <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                              <span>{signal}</span>
                            </div>
                          ))}
                        </div>
                      </Card>

                      <Card className="bg-navy-card border-red-500/20 p-6 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                            <X className="h-5 w-5 text-red-400/70" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-white">Hard Nos</h2>
                            <p className="text-white/40 text-sm">Dealbreakers</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {demoThesis.hard_nos.map((no, i) => (
                            <div key={i} className="flex items-start gap-3 text-white/80">
                              <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                              <span>{no}</span>
                            </div>
                          ))}
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
                            {demoThesis.check_sizes.map((size, i) => (
                              <span key={i} className="bg-white/10 border border-white/20 text-white px-3 py-1 rounded-full text-sm">
                                {size}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Stage Focus</p>
                          <div className="flex flex-wrap gap-2">
                            {demoThesis.stage_focus.map((stage, i) => (
                              <span key={i} className="bg-white/10 border border-white/20 text-white px-3 py-1 rounded-full text-sm">
                                {stage}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Decision Timeline</p>
                          <span className="text-white">{demoThesis.time_to_decision}</span>
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
                          {demoThesis.sector_tags.map((sector, i) => (
                            <span key={i} className="bg-blue-500/20 border border-blue-500/40 text-blue-300 px-3 py-1 rounded-full text-sm">
                              {sector}
                            </span>
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
                          {demoThesis.customer_types.map((type, i) => (
                            <span key={i} className="bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 px-3 py-1 rounded-full text-sm">
                              {type}
                            </span>
                          ))}
                        </div>
                        <p className="text-white/60 text-sm mt-4">
                          <span className="text-white/40">Focus:</span> {demoThesis.b2b_b2c}
                        </p>
                      </Card>
                    </div>

                    {/* Value-Add */}
                    <Card className="bg-navy-card border-amber-500/20 p-8 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                          <Handshake className="h-5 w-5 text-amber-400/70" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white">How You Add Value</h2>
                          <p className="text-white/40 text-sm">Hands-on engagement</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {demoThesis.operating_support.map((support, i) => (
                          <span key={i} className="bg-amber-500/20 border border-amber-500/40 text-amber-300 px-3 py-1 rounded-full text-sm">
                            {support}
                          </span>
                        ))}
                      </div>

                      <p className="text-white/60 text-sm">
                        <span className="text-white/40">Board involvement:</span> {demoThesis.board_involvement}
                      </p>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Interests Modal - matches InterestsModal exactly */}
        {showInterestsModal && (
          <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4" onClick={() => setShowInterestsModal(false)}>
            <div className="max-w-2xl w-full max-h-[80vh] bg-[hsl(var(--navy-deep))] border border-[hsl(var(--cyan-glow))]/20 rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 pb-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Incoming Interests</h2>
                    <p className="text-white/60 text-sm mt-1">Startups that want to connect with you</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowInterestsModal(false)}
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="p-6 pt-4 max-h-[60vh] overflow-auto">
                {demoInterests.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                      <Building2 className="h-8 w-8 text-white/20" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">No incoming interests yet</h3>
                    <p className="text-white/60 text-sm">When startups are interested in connecting, they will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {demoInterests.map((interest) => (
                      <Card key={interest.id} className="bg-white/5 border-white/10 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[hsl(var(--cyan-glow))] to-[hsl(var(--primary))] flex items-center justify-center shrink-0">
                              <Building2 className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-white mb-1 hover:text-[hsl(var(--cyan-glow))] transition-colors cursor-pointer">
                                {interest.company_name}
                              </h4>
                              <p className="text-sm text-white/60 mb-2">{interest.founder_name}</p>

                              <div className="flex flex-wrap gap-2 mb-3">
                                <span className="bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))] border border-[hsl(var(--cyan-glow))]/20 px-2 py-0.5 rounded-full text-xs">
                                  {interest.vertical}
                                </span>
                                <span className="bg-white/10 text-white/80 border border-white/20 px-2 py-0.5 rounded-full text-xs">
                                  {interest.stage}
                                </span>
                              </div>

                              {interest.sync_note && (
                                <div className="bg-white/5 rounded-lg p-3 border border-white/10 mb-3">
                                  <p className="text-white/70 text-sm italic">"{interest.sync_note}"</p>
                                </div>
                              )}

                              <div className="flex flex-wrap gap-3 text-xs text-white/50">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {interest.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  Raising {interest.funding_goal}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatRelativeTime(interest.created_at)}
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
              </div>
            </div>
          </div>
        )}

        {/* Syncs Modal - matches SyncsModal exactly */}
        {showSyncsModal && (
          <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4" onClick={() => setShowSyncsModal(false)}>
            <div className="max-w-2xl w-full max-h-[80vh] bg-[hsl(var(--navy-deep))] border border-white/10 rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 pb-0">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-xl text-white">
                    <TrendingUp className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
                    Active Syncs
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSyncsModal(false)}
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="p-6 pt-4 max-h-[60vh] overflow-auto">
                {demoSyncs.length === 0 ? (
                  <div className="text-center py-12">
                    <TrendingUp className="h-12 w-12 text-white/20 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">No active syncs yet</h3>
                    <p className="text-white/60 text-sm">When founders accept your requests or you accept theirs, they'll appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {demoSyncs.map((sync) => (
                      <div key={sync.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[hsl(var(--cyan-glow))] to-[hsl(var(--primary))] flex items-center justify-center shrink-0">
                            <Building2 className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-white hover:text-[hsl(var(--cyan-glow))] transition-colors cursor-pointer">
                                {sync.company_name}
                              </h4>
                              <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full text-xs">
                                Synced
                              </span>
                            </div>

                            <p className="text-sm text-white/70 mb-1">{sync.founder_name}</p>

                            <p className="text-sm text-white/60 flex items-center gap-1 mb-2">
                              <MapPin className="h-3 w-3" />
                              {sync.location}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-2">
                              <span className="bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))] border border-[hsl(var(--cyan-glow))]/20 px-2 py-0.5 rounded-full text-xs">
                                {sync.vertical}
                              </span>
                              <span className="bg-white/10 text-white/80 border border-white/20 px-2 py-0.5 rounded-full text-xs">
                                {sync.stage}
                              </span>
                            </div>

                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                              <p className="text-xs text-white/50 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Synced {formatRelativeTime(sync.created_at)}
                              </p>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-[hsl(var(--cyan-glow))]/30 text-[hsl(var(--cyan-glow))] hover:bg-[hsl(var(--cyan-glow))]/10"
                                  onClick={() => {
                                    setShowSyncsModal(false);
                                    const thread = demoMessages.find(m => m.other_user_id === sync.other_user_id);
                                    if (thread) {
                                      setSelectedThread(thread);
                                    }
                                    setShowMessagesModal(true);
                                  }}
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
              </div>
            </div>
          </div>
        )}

        {/* Pending Modal - matches PendingModal exactly */}
        {showPendingModal && (
          <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4" onClick={() => setShowPendingModal(false)}>
            <div className="max-w-2xl w-full max-h-[80vh] bg-[hsl(var(--navy-deep))] border border-white/10 rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 pb-0">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-xl text-white">
                    <Eye className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
                    Pending Requests
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPendingModal(false)}
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="p-6 pt-4 max-h-[60vh] overflow-auto">
                {demoPending.length === 0 ? (
                  <div className="text-center py-12">
                    <Eye className="h-12 w-12 text-white/20 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">No pending requests</h3>
                    <p className="text-white/60 text-sm">Your sync requests to founders will appear here while awaiting response.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {demoPending.map((pending) => (
                      <div key={pending.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500/50 to-orange-500/50 flex items-center justify-center shrink-0">
                            <Clock className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-white hover:text-[hsl(var(--cyan-glow))] transition-colors cursor-pointer">
                                {pending.company_name}
                              </h4>
                              <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-full text-xs">
                                Pending
                              </span>
                            </div>

                            <p className="text-sm text-white/70 mb-1">{pending.founder_name}</p>

                            <p className="text-sm text-white/60 flex items-center gap-1 mb-2">
                              <MapPin className="h-3 w-3" />
                              {pending.location}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-2">
                              <span className="bg-[hsl(var(--cyan-glow))]/10 text-[hsl(var(--cyan-glow))] border border-[hsl(var(--cyan-glow))]/20 px-2 py-0.5 rounded-full text-xs">
                                {pending.vertical}
                              </span>
                              <span className="bg-white/10 text-white/80 border border-white/20 px-2 py-0.5 rounded-full text-xs">
                                {pending.stage}
                              </span>
                            </div>

                            {pending.sync_note && (
                              <div className="bg-white/5 rounded-md p-2 mb-2">
                                <p className="text-sm text-white/70 italic">"{pending.sync_note}"</p>
                              </div>
                            )}

                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                              <p className="text-xs text-white/50 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Sent {formatRelativeTime(pending.created_at)}
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
              </div>
            </div>
          </div>
        )}

        {/* Messages Modal - matches MessagesModal exactly */}
        {showMessagesModal && (
          <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4" onClick={() => { setShowMessagesModal(false); setSelectedThread(null); }}>
            <div className="max-w-3xl w-full max-h-[80vh] bg-[hsl(var(--navy-deep))] border border-white/10 rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 pb-0">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-xl text-white">
                    <MessageSquare className="h-5 w-5 text-[hsl(var(--cyan-glow))]" />
                    Messages
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => { setShowMessagesModal(false); setSelectedThread(null); }}
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {selectedThread ? (
                // Thread view
                <div className="flex flex-col h-[60vh]">
                  <div className="px-6 py-3 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedThread(null)}
                        className="text-white/60 hover:text-white"
                      >
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back
                      </Button>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--cyan-glow))] to-[hsl(var(--primary))] flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">{selectedThread.other_user_company}</p>
                          <p className="text-xs text-white/50">{selectedThread.other_user_name}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 min-h-0 overflow-auto p-4">
                    <div className="space-y-3">
                      {selectedThread.messages.map((msg) => (
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
                            <p className="text-xs text-white/40 mt-1">{formatRelativeTime(msg.timestamp)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 border-t border-white/10 flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    />
                    <Button
                      size="icon"
                      className="bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--cyan-bright))]"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                // Thread list view
                <div className="p-6 pt-4 max-h-[60vh] overflow-auto">
                  {demoMessages.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 text-white/20 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">No messages yet</h3>
                      <p className="text-white/60 text-sm">Start a conversation by syncing with startups.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {demoMessages.map((thread) => (
                        <div
                          key={thread.id}
                          className="bg-white/5 border border-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/10 transition-colors"
                          onClick={() => setSelectedThread(thread)}
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
                                    {formatRelativeTime(thread.last_message_time)}
                                  </span>
                                  {thread.unread_count > 0 && (
                                    <span className="bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))] text-xs h-5 w-5 p-0 flex items-center justify-center rounded-full font-medium">
                                      {thread.unread_count}
                                    </span>
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
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MemoModal - matches MemoModal exactly */}
        {showMemoModal && selectedStartup && (
          <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4" onClick={() => setShowMemoModal(false)}>
            <div className="max-w-5xl w-full max-h-[95vh] bg-[hsl(var(--navy-deep))] border border-[hsl(var(--cyan-glow))]/20 rounded-lg overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex-1 min-h-0 overflow-auto">
                <div className="p-6 space-y-6">
                {/* Back Button */}
                <Button
                  onClick={() => setShowMemoModal(false)}
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
                    <div className="bg-white/10 rounded-lg p-1 flex">
                      <button
                        onClick={() => setMemoViewMode("condensed")}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${
                          memoViewMode === "condensed"
                            ? "bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))]"
                            : "text-white/70 hover:text-white"
                        }`}
                      >
                        <FileText className="h-4 w-4" />
                        Condensed
                      </button>
                      <button
                        onClick={() => setMemoViewMode("full")}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${
                          memoViewMode === "full"
                            ? "bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))]"
                            : "text-white/70 hover:text-white"
                        }`}
                      >
                        <Eye className="h-4 w-4" />
                        Full Memo
                      </button>
                    </div>
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
                              <h1 className="text-3xl font-bold text-white mb-2">{selectedStartup.company_name}</h1>
                              <div className="flex flex-wrap gap-2">
                                <span className="bg-[hsl(var(--cyan-glow))]/20 text-[hsl(var(--cyan-glow))] border border-[hsl(var(--cyan-glow))]/30 px-2 py-0.5 rounded-full text-sm">
                                  {selectedStartup.vertical}
                                </span>
                                <span className="bg-white/10 text-white/80 border border-white/20 px-2 py-0.5 rounded-full text-sm">
                                  {selectedStartup.stage}
                                </span>
                                <span className="bg-[hsl(var(--cyan-bright))]/20 text-[hsl(var(--cyan-bright))] border border-[hsl(var(--cyan-bright))]/30 px-2 py-0.5 rounded-full text-sm flex items-center gap-1">
                                  <MapPin className="h-3 w-3" /> {selectedStartup.location}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* One-liner */}
                        <div className="bg-white/5 rounded-xl p-4 mb-6">
                          <p className="text-lg text-white/90 italic">
                            "{selectedStartup.business_model.slice(0, 150)}{selectedStartup.business_model.length > 150 ? '...' : ''}"
                          </p>
                        </div>

                        {/* Key Metrics Row - Demo TAM/SAM/SOM */}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all group border border-transparent hover:border-[hsl(var(--cyan-glow))]/30">
                            <p className="text-sm text-white/50 mb-1 group-hover:text-[hsl(var(--cyan-glow))] transition-colors">TAM</p>
                            <p className="text-2xl font-bold text-white">$50B</p>
                            <p className="text-xs text-white/30 mt-1 group-hover:text-white/50 flex items-center justify-center gap-1">
                              View breakdown <ArrowRight className="h-3 w-3" />
                            </p>
                          </div>
                          <div className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all group border border-transparent hover:border-[hsl(var(--cyan-glow))]/30">
                            <p className="text-sm text-white/50 mb-1 group-hover:text-[hsl(var(--cyan-glow))] transition-colors">SAM</p>
                            <p className="text-2xl font-bold text-white">$5B</p>
                            <p className="text-xs text-white/30 mt-1 group-hover:text-white/50 flex items-center justify-center gap-1">
                              View breakdown <ArrowRight className="h-3 w-3" />
                            </p>
                          </div>
                          <div className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all group border border-transparent hover:border-[hsl(var(--cyan-glow))]/30">
                            <p className="text-sm text-white/50 mb-1 group-hover:text-[hsl(var(--cyan-glow))] transition-colors">SOM</p>
                            <p className="text-2xl font-bold text-white">$500M</p>
                            <p className="text-xs text-white/30 mt-1 group-hover:text-white/50 flex items-center justify-center gap-1">
                              View breakdown <ArrowRight className="h-3 w-3" />
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
                            <p className="text-white font-semibold">{selectedStartup.team?.length || 2}</p>
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
                            <p className="text-white font-semibold text-sm">SaaS</p>
                          </div>
                        </div>
                      </Card>
                      <Card className="bg-navy-card border-white/10 p-4 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                            <Target className="h-5 w-5 text-amber-400/70" />
                          </div>
                          <div>
                            <p className="text-white/40 text-xs font-medium">Raising</p>
                            <p className="text-white font-semibold">{selectedStartup.funding_goal}</p>
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
                          {selectedStartup.problem || "Problem statement will appear here based on the application."}
                        </p>
                      </Card>

                      <Card className="bg-navy-card border-white/10 p-6 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <TrendingUp className="h-4 w-4 text-emerald-400/70" />
                          </div>
                          <h3 className="text-lg font-semibold text-white">The Solution</h3>
                        </div>
                        <p className="text-white/70 leading-relaxed">
                          {selectedStartup.solution || selectedStartup.business_model}
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
                        <h1 className="text-4xl font-bold text-white mb-2">{selectedStartup.company_name}</h1>
                        <p className="text-xl text-white/70 mb-4">{selectedStartup.vertical} • {selectedStartup.stage}</p>
                        <div className="flex flex-wrap justify-center gap-4 text-sm text-white/60">
                          <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {selectedStartup.location}</span>
                          {selectedStartup.website && (
                            <a href={selectedStartup.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[hsl(var(--cyan-glow))] transition-colors">
                              <Globe className="h-4 w-4" /> {selectedStartup.website.replace('https://', '')}
                            </a>
                          )}
                          {selectedStartup.linkedin_url && (
                            <a href={selectedStartup.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[hsl(var(--cyan-glow))] transition-colors">
                              <Linkedin className="h-4 w-4" /> LinkedIn
                            </a>
                          )}
                          {selectedStartup.pitch_deck_url && (
                            <a href={selectedStartup.pitch_deck_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[hsl(var(--cyan-glow))] transition-colors">
                              <FileText className="h-4 w-4" /> Pitch Deck <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="max-w-3xl mx-auto">
                        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                          <h3 className="text-sm font-semibold text-[hsl(var(--cyan-glow))] uppercase tracking-wider mb-3">Executive Summary</h3>
                          <p className="text-lg text-white/90 leading-relaxed">
                            {selectedStartup.business_model}
                          </p>
                        </div>
                      </div>
                    </Card>

                    {/* Problem & Value Proposition */}
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
                            {selectedStartup.problem || "No problem statement provided."}
                          </p>
                        </div>

                        <div className="border-t border-white/10 pt-6">
                          <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">The Solution</h4>
                          <p className="text-white/80 leading-relaxed text-lg">
                            {selectedStartup.solution || selectedStartup.business_model}
                          </p>
                        </div>
                      </div>
                    </Card>

                    {/* Business Model */}
                    <Card className="bg-navy-card border-white/10 p-8 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-emerald-400/70" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Business Model</h2>
                      </div>

                      <p className="text-white/80 leading-relaxed">
                        {selectedStartup.business_model}
                      </p>
                    </Card>

                    {/* Team */}
                    <Card className="bg-navy-card border-white/10 p-8 shadow-[0_0_15px_rgba(6,182,212,0.05)]">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-pink-400/70" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Founding Team</h2>
                      </div>

                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedStartup.team && selectedStartup.team.length > 0 ? selectedStartup.team.map((member, i) => (
                          <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--cyan-glow))]/30 to-purple-500/30 flex items-center justify-center">
                                <span className="text-white font-bold">{member.name?.charAt(0) || "?"}</span>
                              </div>
                              <div>
                                <p className="font-semibold text-white">{member.name}</p>
                                <p className="text-sm text-[hsl(var(--cyan-glow))]/70">{member.role}</p>
                              </div>
                            </div>
                            <p className="text-white/50 text-sm">{member.background}</p>
                          </div>
                        )) : (
                          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(var(--cyan-glow))]/30 to-purple-500/30 flex items-center justify-center">
                                <span className="text-white font-bold">{selectedStartup.founder_name.charAt(0)}</span>
                              </div>
                              <div>
                                <p className="font-semibold text-white">{selectedStartup.founder_name}</p>
                                <p className="text-sm text-[hsl(var(--cyan-glow))]/70">Founder</p>
                              </div>
                            </div>
                          </div>
                        )}
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
                        {selectedStartup.traction}
                      </p>
                    </Card>
                  </div>
                )}

                {/* Sync Section */}
                <div className="border-t border-white/10 pt-6">
                  <Button
                    className="w-full bg-[hsl(220,60%,8%)] text-[hsl(var(--cyan-glow))] hover:bg-[hsl(220,60%,12%)] border border-[hsl(var(--cyan-glow))]/40 h-14 text-lg shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                  >
                    <TrendingUp className="mr-3 h-6 w-6" />
                    Request to Sync
                  </Button>
                </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Modal - Matching AnalystDashboard cyan colors */}
        {showProfileModal && (
          <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4" onClick={() => setShowProfileModal(false)}>
            <Card className="bg-navy-card border-white/10 w-full max-w-lg max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-navy-card z-30">
                <div className="flex items-center gap-3">
                  <UserCog className="h-6 w-6 text-[hsl(var(--cyan-glow))]" />
                  <h2 className="text-xl font-semibold text-white">Your Profile</h2>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowProfileModal(false)} className="text-white/60 hover:text-white">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-[hsl(var(--cyan-glow))]/20 flex items-center justify-center">
                    <Users className="h-8 w-8 text-[hsl(var(--cyan-glow))]" />
                  </div>
                  <div>
                    <Button variant="outline" size="sm" className="border-white/20 text-white/70 hover:bg-white/10">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                    <p className="text-xs text-white/40 mt-1">JPG, PNG up to 5MB</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/70 text-sm">Name</Label>
                    <Input className="bg-white/5 border-white/10 text-white mt-1 focus:border-[hsl(var(--cyan-glow))]/50" defaultValue={demoAnalystProfile.name} />
                  </div>
                  <div>
                    <Label className="text-white/70 text-sm">Title</Label>
                    <Input className="bg-white/5 border-white/10 text-white mt-1 focus:border-[hsl(var(--cyan-glow))]/50" defaultValue={demoAnalystProfile.title} />
                  </div>
                </div>
                <div>
                  <Label className="text-white/70 text-sm">Email</Label>
                  <Input className="bg-white/5 border-white/10 text-white mt-1 focus:border-[hsl(var(--cyan-glow))]/50" defaultValue={demoAnalystProfile.email} />
                </div>
                <div>
                  <Label className="text-white/70 text-sm">Firm</Label>
                  <Input className="bg-white/5 border-white/10 text-white mt-1 focus:border-[hsl(var(--cyan-glow))]/50" defaultValue={demoAnalystProfile.firm_name} />
                </div>
                <div>
                  <Label className="text-white/70 text-sm">LinkedIn</Label>
                  <Input className="bg-white/5 border-white/10 text-white mt-1 focus:border-[hsl(var(--cyan-glow))]/50" placeholder="linkedin.com/in/yourprofile" />
                </div>
                <div>
                  <Label className="text-white/70 text-sm">One-liner</Label>
                  <Textarea className="bg-white/5 border-white/10 text-white mt-1 focus:border-[hsl(var(--cyan-glow))]/50" placeholder="Brief description about yourself..." defaultValue="Former founder helping the next generation of technical founders scale." />
                </div>
                <div className="pt-4 flex gap-3">
                  <Button variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10" onClick={() => setShowProfileModal(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1 bg-[hsl(var(--cyan-glow))] text-[hsl(var(--navy-deep))] hover:bg-[hsl(var(--cyan-glow))]/90">
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    );
  }

  // Application Flow View - Matches InvestorApplication.tsx exactly
  return (
    <div className="fixed inset-0 z-50 overflow-auto" style={{ background: 'var(--gradient-navy-teal)' }} onWheel={(e) => {
      // Prevent body scroll when modals are open
      if (showThesisModal || showInterestsModal || showSyncsModal || showPendingModal || showMessagesModal || showMemoModal || showProfileModal) {
        e.stopPropagation();
      }
    }}>
      {/* Decorative Elements - matching InvestorApplication */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] border border-white/20 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] border border-white/15 rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Header with Skip Button */}
      <div className="sticky top-0 z-20 bg-[hsl(var(--navy-deep))]/80 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white/60 hover:text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Exit Demo
            </Button>
            <div className="h-6 w-px bg-white/20" />
            <span className="text-[hsl(var(--cyan-glow))] text-sm font-medium px-2 py-1 bg-white/10 rounded">VC Demo</span>
          </div>
          <Button onClick={skipToDashboard} variant="outline" size="sm" className="border-[hsl(var(--cyan-glow))]/30 text-[hsl(var(--cyan-glow))] hover:bg-white/10 bg-white/5">
            <SkipForward className="w-4 h-4 mr-2" />
            Skip to Dashboard
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-4 pb-16 relative z-10">
        <div className="container max-w-4xl mx-auto px-4 md:px-6">
          <div className="space-y-8">
            {/* Header Section - matching InvestorApplication */}
            <div className="text-center space-y-4">
              <div className="inline-block px-6 py-2 bg-white/10 backdrop-blur-sm border border-[hsl(var(--cyan-glow))]/30 rounded-full text-sm font-medium text-[hsl(var(--cyan-glow))]">
                IN-SYNC | INVESTOR APPLICATION
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                VC Thesis
              </h1>
              <p className="text-lg text-white/60 max-w-2xl mx-auto">
                Join the In-Sync Ecosystem
              </p>
            </div>

            {/* Progress Steps - matching InvestorApplication exactly */}
            <div className="hidden md:flex items-center justify-between bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index < currentStep;
                const isCurrent = currentStep === step.id;

                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(step.id)}
                    className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all ${
                      isCurrent ? "bg-white/20" : "hover:bg-white/10 cursor-pointer"
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

            {/* Mobile Progress */}
            <div className="md:hidden flex items-center justify-between bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
              <span className="text-white font-medium">Step {currentStep + 1} of 7</span>
              <span className="text-white/70 text-sm">{STEPS[currentStep]?.title}</span>
            </div>

            {/* Form Card - matching InvestorApplication */}
            <div className="bg-white/95 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-8 md:p-10 shadow-2xl">

              {/* Step 0: Welcome - matching InvestorApplication exactly */}
              {currentStep === 0 && (
                <div className="space-y-8">
                  <div className="text-center space-y-6">
                    <h2 className="text-3xl font-bold text-[hsl(var(--navy-deep))]">Welcome</h2>
                    <p className="text-lg text-[hsl(var(--navy-deep))]/80 max-w-2xl mx-auto">
                      Help us understand your <strong>investment thesis</strong>, <strong>deal criteria</strong>, and <strong>value-add</strong> so we can match you with the right startups.
                    </p>
                  </div>

                  <div className="bg-[hsl(var(--cyan-glow))]/10 border border-[hsl(var(--cyan-glow))]/30 rounded-xl p-6 space-y-4">
                    <p className="text-[hsl(var(--navy-deep))]/80">
                      This application is structured so that, by the end, you will have effectively created a <strong>comprehensive investor profile</strong>.
                    </p>
                    <p className="text-[hsl(var(--navy-deep))]/70">Every question helps founders understand:</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-5 bg-white border border-[hsl(var(--cyan-glow))]/20 rounded-xl">
                      <div className="text-2xl font-bold text-[hsl(var(--cyan-glow))] mb-2">THESIS</div>
                      <p className="text-[hsl(var(--navy-deep))]/70">Your investment philosophy & focus areas</p>
                    </div>
                    <div className="p-5 bg-white border border-[hsl(var(--cyan-glow))]/20 rounded-xl">
                      <div className="text-2xl font-bold text-[hsl(var(--cyan-glow))] mb-2">CRITERIA</div>
                      <p className="text-[hsl(var(--navy-deep))]/70">Stage, check size & what makes you say yes</p>
                    </div>
                    <div className="p-5 bg-white border border-[hsl(var(--cyan-glow))]/20 rounded-xl">
                      <div className="text-2xl font-bold text-[hsl(var(--cyan-glow))] mb-2">PROCESS</div>
                      <p className="text-[hsl(var(--navy-deep))]/70">How you evaluate & close deals</p>
                    </div>
                    <div className="p-5 bg-white border border-[hsl(var(--cyan-glow))]/20 rounded-xl">
                      <div className="text-2xl font-bold text-[hsl(var(--cyan-glow))] mb-2">VALUE-ADD</div>
                      <p className="text-[hsl(var(--navy-deep))]/70">How you support portfolio companies</p>
                    </div>
                  </div>

                  <p className="text-sm text-[hsl(var(--navy-deep))]/60 text-center italic">
                    Your profile will be shown to vetted founders seeking investment.
                  </p>
                </div>
              )}

              {/* Step 1: Admin & Verification - matching InvestorApplication exactly */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Admin & Verification</h2>
                    <p className="text-muted-foreground">Basic firm information and verification details</p>
                  </div>

                  {/* Profile & Documents (Optional) */}
                  <div className="p-6 bg-muted/30 rounded-xl space-y-6">
                    <h3 className="text-lg font-semibold text-[hsl(var(--navy-deep))]">Profile & Documents (Optional)</h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label>Profile Picture</Label>
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
                            <Upload className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <Button type="button" variant="outline" size="sm">
                              Upload
                            </Button>
                            <p className="text-xs text-muted-foreground mt-1">JPG, PNG, or GIF</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label>Thesis / Memo (Optional)</Label>
                        <p className="text-xs text-muted-foreground">Upload your investment thesis or firm memo if applicable</p>
                        <Button type="button" variant="outline" className="gap-2">
                          <Upload className="h-4 w-4" />
                          Upload File
                        </Button>
                        <p className="text-xs text-muted-foreground">PDF, DOC, or DOCX (max 20MB)</p>
                      </div>
                    </div>
                  </div>

                  {/* 1.1 Company Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[hsl(var(--navy-deep))]">1.1 Company Information</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firmName">Firm / Fund Name *</Label>
                        <Input id="firmName" placeholder="Acme Ventures" defaultValue="Demo Ventures" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website *</Label>
                        <Input id="website" type="url" placeholder="https://acmeventures.com" defaultValue="https://demoventures.vc" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="companyLinkedIn">Company LinkedIn</Label>
                        <Input id="companyLinkedIn" type="url" placeholder="https://linkedin.com/company/acme-ventures" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hqLocation">HQ Location *</Label>
                        <Input id="hqLocation" placeholder="Boston, MA" defaultValue="San Francisco, CA" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Other Location Branches</Label>
                      <div className="flex flex-wrap gap-2">
                        {LOCATION_BRANCHES.slice(0, 15).map(city => (
                          <button
                            key={city}
                            type="button"
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                              ["San Francisco", "New York"].includes(city)
                                ? "bg-[hsl(var(--navy-deep))] text-white"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 1.2 Company-Wide Password */}
                  <div className="p-6 bg-muted/30 rounded-xl space-y-4">
                    <h3 className="text-lg font-semibold text-[hsl(var(--navy-deep))]">1.2 Company-Wide Password</h3>
                    <p className="text-sm text-muted-foreground">
                      Create a shared password for your firm. Team members (analysts, associates, etc.) can use their personal email along with this company password to log into your firm's dashboard.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="companyPassword">Company Password *</Label>
                        <Input id="companyPassword" type="password" placeholder="••••••••" defaultValue="password123" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyConfirmPassword">Confirm Company Password *</Label>
                        <Input id="companyConfirmPassword" type="password" placeholder="••••••••" defaultValue="password123" />
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <p>Company password must be at least 6 characters.</p>
                      <p className="text-green-600 mt-1">Minimum 6 characters</p>
                    </div>

                    <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                      <p className="text-sm text-primary">
                        <strong>How it works:</strong> This shared company password allows anyone from your firm to create their own In-Sync dashboard using their company email. When they sign up with your company password, they'll automatically be associated with your firm.
                      </p>
                    </div>
                  </div>

                  {/* Team Members */}
                  <div className="p-6 bg-muted/30 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-[hsl(var(--navy-deep))]">Team Member(s) for Founder Communication *</h3>
                        <p className="text-sm text-muted-foreground">Who from your team will be the primary contact for startups on In-Sync? You can add multiple team members.</p>
                      </div>
                      <Button type="button" variant="outline" size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Member
                      </Button>
                    </div>

                    <div className="p-4 bg-background rounded-lg border space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Contact 1</span>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Name *</Label>
                          <Input placeholder="Jane Smith" defaultValue="Jane Smith" />
                        </div>
                        <div className="space-y-2">
                          <Label>Title *</Label>
                          <Input placeholder="Partner" defaultValue="Partner" />
                        </div>
                        <div className="space-y-2">
                          <Label>Email *</Label>
                          <Input type="email" placeholder="jane@acmeventures.com" defaultValue="jane@demoventures.vc" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Fund Overview - matching InvestorApplication exactly */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Fund Overview</h2>
                    <p className="text-muted-foreground">The "firm card" founders will see</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="firmDescription">Firm Description *</Label>
                    <Textarea
                      id="firmDescription"
                      placeholder="We invest in early-stage B2B SaaS companies transforming enterprise workflows..."
                      rows={4}
                      defaultValue="We invest in early-stage B2B SaaS companies transforming enterprise workflows through AI and automation."
                    />
                    <p className="text-xs text-muted-foreground">18/200 words</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="aum">AUM / Fund Size</Label>
                      <Input id="aum" placeholder="$50M - $100M" defaultValue="$150M" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fundVintage">Year Fund Founded</Label>
                      <Input id="fundVintage" placeholder="2020" defaultValue="2020" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ownershipTarget">Typical Ownership Target (%)</Label>
                      <Input id="ownershipTarget" placeholder="10-15%" defaultValue="10-15%" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Fund Type *</Label>
                    <Select defaultValue="VC">
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        {FUND_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="checkSize">Typical Check Size *</Label>
                    <Input id="checkSize" placeholder="e.g., $250K - $500K or $1M - $3M" defaultValue="$500K - $2M" />
                    <p className="text-xs text-muted-foreground">Enter your typical check size range</p>
                  </div>

                  <div className="space-y-3">
                    <Label>Stage Focus (select all that apply) *</Label>
                    <div className="flex flex-wrap gap-2">
                      {STAGE_FOCUS.map(stage => (
                        <button
                          key={stage}
                          type="button"
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            ["Pre-seed", "Seed"].includes(stage)
                              ? "bg-[hsl(var(--navy-deep))] text-white"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {stage}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Sector Tags (select all that apply)</Label>
                    <div className="space-y-3">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Search and select sectors..." />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          <SelectItem value="ai">AI/ML</SelectItem>
                          <SelectItem value="saas">SaaS</SelectItem>
                          <SelectItem value="fintech">FinTech</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Selected tags display */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {["AI/ML", "Enterprise SaaS", "Developer Tools"].map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium bg-primary text-primary-foreground"
                          >
                            {tag}
                            <button type="button" className="ml-1 hover:bg-primary-foreground/20 rounded-full p-0.5">
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Investment Strategy - matching InvestorApplication exactly */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Investment Strategy & "Why We Say Yes"</h2>
                    <p className="text-muted-foreground">Help founders understand what makes you move</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="thesisStatement">Thesis Statement (max 150 words) *</Label>
                    <Textarea
                      id="thesisStatement"
                      placeholder="We believe the future of work will be powered by AI-native tools that augment human creativity..."
                      rows={4}
                      defaultValue="We invest in technical founders building B2B software that becomes critical infrastructure for enterprises. We focus on AI/ML, developer tools, and enterprise SaaS."
                    />
                    <p className="text-xs text-muted-foreground">24/150 words</p>
                  </div>

                  <div className="space-y-3">
                    <Label>Sub-themes You're Actively Prioritizing</Label>
                    <Textarea
                      placeholder="AI infrastructure, vertical SaaS for healthcare, developer productivity tools..."
                      rows={3}
                      defaultValue="MLOps, Developer Experience, Data Infrastructure, API-First Products"
                    />
                  </div>

                  <div className="p-6 bg-muted/30 rounded-xl space-y-4">
                    <Label className="font-semibold">Non-Negotiables</Label>
                    <p className="text-sm text-muted-foreground">What are your absolute requirements for investment? (e.g., founder must have domain expertise, minimum revenue threshold, specific market size)</p>
                    <Textarea
                      placeholder="Examples: Founder with 5+ years domain experience, $50K+ MRR, B2B focus only, US-based company, technical co-founder required..."
                      rows={4}
                      defaultValue="Technical co-founder with domain expertise, US-based, B2B focus"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Hard "No's" / Exclusions</Label>
                    <p className="text-sm text-muted-foreground">What will automatically disqualify a company from your consideration?</p>
                    <Textarea
                      placeholder="Examples: No hardware companies, no pre-revenue, no single founders, no regulated industries, no crypto/web3..."
                      rows={3}
                      defaultValue="Consumer apps, hardware-only, pre-product companies, crypto/web3"
                    />
                  </div>

                  <div className="p-6 bg-muted/30 rounded-xl space-y-6">
                    <h3 className="font-semibold text-lg">Business Model Preferences</h3>

                    <div className="space-y-2">
                      <Label>B2B / B2C Preference *</Label>
                      <Select defaultValue="b2b">
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="b2b">B2B</SelectItem>
                          <SelectItem value="b2c">B2C</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Metrics You Care About Most (optional)</Label>
                    <Textarea
                      placeholder="e.g., MRR growth, Net revenue retention, CAC payback, Gross margin..."
                      rows={3}
                      defaultValue="MRR growth, Net revenue retention, CAC payback"
                    />
                    <p className="text-xs text-muted-foreground">Enter the metrics that matter most to you</p>
                  </div>
                </div>
              )}

              {/* Step 4: Value-Add - matching InvestorApplication exactly */}
              {currentStep === 4 && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Value-Add</h2>
                    <p className="text-muted-foreground">How you support portfolio companies after investing</p>
                  </div>

                  <div className="p-6 bg-muted/30 rounded-xl space-y-4">
                    <h3 className="font-semibold text-lg">Operating Support You Actively Provide *</h3>
                    <p className="text-sm text-muted-foreground">Select all areas where you provide hands-on support</p>
                    <div className="flex flex-wrap gap-2">
                      {OPERATING_SUPPORT.map(support => (
                        <button
                          key={support}
                          type="button"
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            ["Executive hiring", "Sales strategy", "Fundraising prep", "Product roadmap", "Technical architecture", "Investor intros"].includes(support)
                              ? "bg-[hsl(var(--navy-deep))] text-white"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {support}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="firmInvolvement">Once you invest, how involved do you get with the startup? *</Label>
                    <p className="text-sm text-muted-foreground">Describe your typical post-investment engagement level and what ongoing support looks like in practice</p>
                    <Textarea
                      id="firmInvolvement"
                      placeholder="E.g., We typically engage weekly with founders during the first 6 months, attending key meetings and providing strategic input. We're hands-on during fundraising and hiring key executives..."
                      rows={5}
                      defaultValue="We typically engage weekly with founders during the first 6 months, attending key meetings and providing strategic input. We're hands-on during fundraising and hiring key executives."
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Portfolio - matching InvestorApplication exactly */}
              {currentStep === 5 && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Portfolio</h2>
                    <p className="text-muted-foreground">Share your investment track record</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="portfolioList">Prominent Portfolio Companies</Label>
                    <p className="text-sm text-muted-foreground">List some of your notable investments</p>
                    <Textarea
                      id="portfolioList"
                      placeholder="e.g., Company A, Company B, Company C..."
                      rows={4}
                      defaultValue="Company A (Series B, $50M raised), Company B (acquired), Company C (Series A)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="portfolioCount">Portfolio Website Link</Label>
                    <p className="text-sm text-muted-foreground">Link to your firm's portfolio page (optional)</p>
                    <Input
                      id="portfolioCount"
                      type="url"
                      placeholder="https://yourfirm.com/portfolio"
                      defaultValue="https://demoventures.vc/portfolio"
                    />
                  </div>

                  <div className="p-4 bg-muted/30 rounded-xl space-y-4">
                    <div className="flex items-center gap-3">
                      <Checkbox id="signsNDAs" defaultChecked />
                      <Label htmlFor="signsNDAs">Do You Sign NDAs?</Label>
                    </div>
                    <Input placeholder="Under what conditions? (e.g., After term sheet)" defaultValue="After term sheet, on case-by-case basis" />
                  </div>
                </div>
              )}

              {/* Step 6: Deal Mechanics (Optional) - matching InvestorApplication exactly */}
              {currentStep === 6 && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-[hsl(var(--navy-deep))]">Deal Mechanics & Process (Optional)</h2>
                    <p className="text-muted-foreground">What founders really want to know - fill this out if you'd like</p>
                  </div>

                  <div className="p-4 bg-[hsl(var(--cyan-glow))]/10 border border-[hsl(var(--cyan-glow))]/30 rounded-xl">
                    <p className="text-sm text-[hsl(var(--navy-deep))]/80">
                      This section is entirely optional. You can skip it or fill in as much or as little as you'd like.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Decision Process</Label>
                      <Select defaultValue="Partner-led">
                        <SelectTrigger><SelectValue placeholder="Select process" /></SelectTrigger>
                        <SelectContent>
                          {DECISION_PROCESS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Board Involvement</Label>
                      <Select defaultValue="Board seat sometimes">
                        <SelectTrigger><SelectValue placeholder="Select involvement" /></SelectTrigger>
                        <SelectContent>
                          {BOARD_INVOLVEMENT.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Typical Time to First Response</Label>
                      <Select defaultValue="48h">
                        <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                        <SelectContent>
                          {RESPONSE_TIMES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Typical Time to Decision</Label>
                      <Select defaultValue="2–4 wks">
                        <SelectTrigger><SelectValue placeholder="Select time" /></SelectTrigger>
                        <SelectContent>
                          {DECISION_TIMES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-xl space-y-4">
                    <Label className="font-semibold">Do you give "No" with feedback?</Label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        className="flex-1 p-4 rounded-xl border-2 transition-all border-[hsl(var(--cyan-glow))] bg-[hsl(var(--cyan-glow))]/10"
                      >
                        <div className="font-semibold">Yes</div>
                        <div className="text-sm text-muted-foreground">We provide feedback with rejections</div>
                      </button>
                      <button
                        type="button"
                        className="flex-1 p-4 rounded-xl border-2 transition-all border-muted hover:border-muted-foreground/30"
                      >
                        <div className="font-semibold">No</div>
                        <div className="text-sm text-muted-foreground">We don't typically provide feedback</div>
                      </button>
                    </div>
                    <Input placeholder="When do you provide feedback? (e.g., After partner meeting, Always, etc.)" defaultValue="After partner meeting" className="mt-4" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="reserves">Follow-on Policy: Reserves (% of fund)</Label>
                      <Input id="reserves" placeholder="50%" defaultValue="50%" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="followOnWhen">When Do You Follow?</Label>
                      <Input id="followOnWhen" placeholder="Series A if hitting milestones" defaultValue="Series A if hitting milestones" />
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-[hsl(var(--navy-deep))]/10 to-primary/10 rounded-xl border border-primary/20">
                    <p className="text-sm text-muted-foreground text-center">
                      By submitting, you agree to our Terms of Service and Privacy Policy. Your information will be shared with matched founders through the In-Sync platform.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons - matching InvestorApplication */}
              <div className="flex gap-4 pt-8 mt-8 border-t">
                {currentStep > 0 && (
                  <Button type="button" variant="outline" onClick={goBack} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>
                )}

                <div className="flex-1" />

                {currentStep < 6 ? (
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
                    className="gap-2 bg-gradient-to-r from-[hsl(var(--navy-deep))] to-primary hover:opacity-90"
                  >
                    Submit Application
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
