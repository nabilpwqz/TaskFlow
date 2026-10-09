import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  Award,
  Users,
  Sparkles,
  Lock,
  ArrowRight,
  TrendingUp,
  Scale,
  RefreshCw,
  Clock,
} from "lucide-react";

export const metadata = {
  title: "About TaskFlow — The Next-Gen Freelance Platform",
  description: "Learn how TaskFlow empowers builders, founders, and elite independent talent through verifiable milestones and escrow security.",
};

export default function AboutPage() {
  const pillars = [
    {
      icon: ShieldCheck,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      title: "Escrow Milestone Security",
      desc: "Every contract operates on automated escrow state machines. Funds are safely locked at checkout, protecting freelancers from non-payment and clients from unverified deliverables.",
    },
    {
      icon: Award,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      title: "Cryptographically Tethered Reviews",
      desc: "Zero review spam or bought ratings. Only clients with authentic, completed orders can submit ratings, preventing marketplace manipulation and preserving true talent signals.",
    },
    {
      icon: Zap,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      title: "Predictable, Flat 10% Platform Fee",
      desc: "Legacy freelance networks siphon 20% to 30% from independent contractors. TaskFlow uses an honest 10% platform take that funds arbitration, chat, and high-speed search.",
    },
    {
      icon: Scale,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      title: "Built-In Deliverable Inspection",
      desc: "Transparent file submissions, external deploy URLs, and revision tracking give clients complete clarity before approving fund disbursement to the seller.",
    },
    {
      icon: Lock,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20",
      title: "Enterprise OWASP Standards",
      desc: "HTTP-only SameSite cookies, Bcrypt password hashing, and role-based route guardrails ensure your company's proprietary assets and data remain insulated.",
    },
    {
      icon: Clock,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
      title: "Real-Time Direct Collaboration",
      desc: "Structured multi-party messaging threads allow instant communication between clients and engineers without intermediaries slowing down velocity.",
    },
  ];

  const comparisons = [
    {
      feature: "Platform Take Rate",
      legacy: "20% - 30% + withdrawal commissions",
      taskflow: "Flat 10% platform fee, transparent",
      highlight: true,
    },
    {
      feature: "Review Authenticity",
      legacy: "Often unverified or review-swapped",
      taskflow: "100% verified, 1-review-per-order rule",
      highlight: false,
    },
    {
      feature: "Deliverable Milestones",
      legacy: "Opaque status tracking & delayed disputes",
      taskflow: "Granular delivery inspection & revisions",
      highlight: false,
    },
    {
      feature: "Authentication & Security",
      legacy: "Fragmented sessions & high churn",
      taskflow: "JWT HTTP-only Lax cookies with OWASP guards",
      highlight: false,
    },
  ];

  return (
    <div className="relative overflow-hidden pt-6 pb-12 md:pt-8 md:pb-16">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[350px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-16">
        {/* Header / Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.2]">
            Reimagining the Freelance Marketplace Experience
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            TaskFlow was engineered to eliminate broken trust, inflated commissions, and friction from digital hiring. We unite visionary tech founders with elite independent engineers, designers, and creators through verified escrow milestones.
          </p>
        </div>

        {/* Real Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 text-center shadow-sm dark:shadow-none backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">100%</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Escrow Protected</div>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 text-center shadow-sm dark:shadow-none backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">99.4%</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Order Satisfaction</div>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 text-center shadow-sm dark:shadow-none backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">10%</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Flat Transparent Take</div>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 text-center shadow-sm dark:shadow-none backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Zero</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Fake Reviews</div>
          </div>
        </div>

        {/* 6 Core Pillars Grid */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Engineered on Transparent Principles
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Why leading developers and product teams choose TaskFlow over traditional marketplaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 p-6 shadow-sm dark:shadow-none hover:shadow-xl dark:hover:shadow-glow hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div
                      className={`h-11 w-11 rounded-xl ${p.bgColor} ${p.color} border ${p.borderColor} flex items-center justify-center font-bold mb-4`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Comparison Matrix Table */}
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6 sm:p-10 shadow-sm dark:shadow-none">
          <div className="mb-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Marketplace Evolution
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
              Legacy Platforms vs. TaskFlow
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <th className="py-3 px-4 font-semibold">Capability</th>
                  <th className="py-3 px-4 font-semibold">Legacy Freelance Networks</th>
                  <th className="py-3 px-4 font-bold text-amber-600 dark:text-amber-400">TaskFlow Platform</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {comparisons.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                      {c.feature}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                      {c.legacy}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                      <span>{c.taskflow}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Technical Architecture Standards Box */}
        <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-transparent to-amber-500/5 p-8 sm:p-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Engineering & Security Integrity
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-2xl">
            TaskFlow combines modern Next.js server actions, strict session validation, and a resilient multi-tier data store.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>Strict server-side role and ownership validation (OWASP API compliance)</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>MongoDB Mongoose integration with zero-downtime embedded fallback</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>JWT session claims stored in HTTP-only, secure, SameSite=Lax cookies</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>Deterministic state machine order lifecycle with deliverable revisions</span>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center space-y-4 pt-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Ready to Experience the Difference?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Discover verified services or join as an independent expert today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/explore"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 text-xs font-bold text-slate-950 hover:from-amber-400 hover:to-amber-500 transition shadow-glow"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 px-6 py-3 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-amber-500/40 hover:text-amber-500 transition"
            >
              <span>Create Account</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
