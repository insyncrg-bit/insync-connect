import {
  CircleDot,
  Building2,
  Users,
  Target,
  Briefcase,
  TrendingUp,
  Map,
  Swords,
} from "lucide-react";

export const STEPS = [
  { id: 0, title: "Welcome", icon: CircleDot },
  { id: 1, title: "Company Info", icon: Building2 },
  { id: 2, title: "Team & Overview", icon: Users },
  { id: 3, title: "Value Proposition", icon: Target },
  { id: 4, title: "Business Model", icon: Briefcase },
  { id: 5, title: "Go-to-Market", icon: TrendingUp },
  { id: 6, title: "Customer & Market", icon: Map },
  { id: 7, title: "Competitors", icon: Swords },
];

export const VERTICALS = [
  "AI/ML",
  "FinTech",
  "HealthTech",
  "SaaS",
  "E-commerce",
  "EdTech",
  "PropTech",
  "Climate/CleanTech",
  "Consumer",
  "Enterprise Software",
  "Cybersecurity",
  "Other",
  "Marketplace / Network",
  "Developer Tools",
  "BioTech / Life Sciences",
  "Web3 / Crypto",
];

export const STAGES = [
  "Idea/Concept",
  "Pre-seed",
  "Seed",
  "Seed+",
  "Series A",
  "Series A+",
  "Series B+",
  "Bootstrapped / Revenue-funded",
  "Series C+",
];

export const VALUE_DRIVERS = [
  { 
    value: "scalability", 
    label: "True Scalability", 
    description: "Making life easier, more efficient, or intuitive",
  },
  { 
    value: "severity", 
    label: "Severity & Urgency", 
    description: "How urgent or costly is the problem (impact analysis)",
  },
  { 
    value: "unique-tech", 
    label: "Unique Technology Value", 
    description: "What makes your uniqueness attractive to customers daily life",
  },
  { 
    value: "emotional", 
    label: "Emotional & Social Value", 
    description: "Does it create status, trust, or peace of mind",
  },
  { 
    value: "adaptability", 
    label: "Adaptability", 
    description: "Across regions, geographies, groups of people",
  },
  { 
    value: "other", 
    label: "Other", 
    description: "A value proposition that doesn't fit the categories above",
  },
];

export const CUSTOMER_TYPES = ["B2B", "B2C", "Both"];

export const PRICING_STRATEGIES = [
  { id: "subscription", label: "Subscription" },
  { id: "transaction", label: "Transaction-based" },
  { id: "licensing", label: "One-time / Licensing" },
  { id: "advertising", label: "Advertising-driven" },
  { id: "services", label: "Services" },
  { id: "other", label: "Other" },
];

export const SAAS_METRICS = ["MRR", "ARR", "LTV", "CAC", "Churn Rate", "Net Revenue Retention"];
export const TRANSACTION_METRICS = ["GMV", "Take Rate", "Transaction Volume", "Average Transaction Size"];
export const LICENSING_METRICS = ["Revenue per License", "Renewal Rate", "Number of Licenses Sold"];
export const AD_METRICS = ["DAU/MAU", "CPM", "Ad Revenue per User", "Engagement Rate"];
export const SERVICES_METRICS = ["Revenue per Project", "Utilization Rate", "Average Contract Value"];
