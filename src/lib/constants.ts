export const APP_NAME = "TaskFlow";
export const APP_TAGLINE = "Freelance Marketplace Platform · Full-Stack SaaS";
export const COOKIE_NAME = process.env.APP_COOKIE_NAME || "taskflow_session";

export const CATEGORIES = [
  {
    id: "web-development",
    name: "Web Development",
    slug: "web-development",
    icon: "Code",
    description: "Custom websites, full-stack web apps, React, Next.js & backend APIs",
    popularSkills: ["React", "Next.js", "Node.js", "TypeScript", "Tailwind CSS"],
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "graphic-design",
    name: "Graphic Design",
    slug: "graphic-design",
    icon: "Palette",
    description: "Brand identity, UI/UX design, mobile interfaces & marketing assets",
    popularSkills: ["Figma", "UI/UX Design", "Logo Design", "Brand Kits", "Illustration"],
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "content-writing",
    name: "Content Writing",
    slug: "content-writing",
    icon: "PenTool",
    description: "SEO articles, technical documentation, copywriting & whitepapers",
    popularSkills: ["SEO Writing", "Technical Documentation", "Copywriting", "Blog Posts", "Whitepapers"],
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "digital-marketing",
    name: "Digital Marketing",
    slug: "digital-marketing",
    icon: "TrendingUp",
    description: "Paid advertising, SEO audits, social media growth & funnel optimization",
    popularSkills: ["Google Ads", "SEO", "Growth Marketing", "Social Media", "Analytics"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "ai-services",
    name: "AI & Machine Learning",
    slug: "ai-services",
    icon: "Sparkles",
    description: "AI agent integrations, LLM workflows, fine-tuning & prompt engineering",
    popularSkills: ["OpenAI", "LangChain", "Vector DBs", "Python", "Automation"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=80"
  }
];

export const ORDER_STATUSES = {
  PENDING_PAYMENT: {
    label: "Pending Payment",
    color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    badge: "Pending",
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    badge: "Active",
  },
  DELIVERED: {
    label: "Delivered",
    color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    badge: "Delivered",
  },
  REVISION_REQUESTED: {
    label: "Revision Requested",
    color: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    badge: "Revision",
  },
  COMPLETED: {
    label: "Completed",
    color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    badge: "Completed",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    badge: "Cancelled",
  },
  DISPUTED: {
    label: "Disputed",
    color: "bg-red-500/10 text-red-500 border-red-500/20",
    badge: "Dispute",
  },
  REFUNDED: {
    label: "Refunded",
    color: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    badge: "Refunded",
  },
} as const;
