import React from "react";
import Link from "next/link";
import { Layers, ShieldCheck, Zap, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-bold shadow-glow">
                <Layers className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Task<span className="text-amber-500">Flow</span>
              </span>
            </Link>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Full-Stack Freelance Marketplace SaaS connecting ambitious businesses with vetted engineering, design, and marketing professionals.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Verified Escrow & Quality Guaranteed</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Marketplace
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/explore?category=Web+Development" className="hover:text-amber-500 transition">
                  Web & App Development
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Graphic+Design" className="hover:text-amber-500 transition">
                  UI/UX & Graphic Design
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Content+Writing" className="hover:text-amber-500 transition">
                  Technical & SEO Writing
                </Link>
              </li>
              <li>
                <Link href="/explore?category=Digital+Marketing" className="hover:text-amber-500 transition">
                  Digital Marketing & Ads
                </Link>
              </li>
              <li>
                <Link href="/explore?category=AI+%26+Machine+Learning" className="hover:text-amber-500 transition">
                  AI & RAG Integrations
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Platform
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-amber-500 transition">
                  About TaskFlow
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-500 transition">
                  Support & Contact
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-amber-500 transition">
                  Client & Freelancer Portal
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-amber-500 transition">
                  Browse Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture Badge */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 space-y-3 shadow-sm dark:shadow-none">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-white">
              <Zap className="h-4 w-4 text-amber-500" />
              <span>Production Architecture</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
              Built with Next.js App Router, TypeScript strict mode, MongoDB Mongoose, and JWT HTTP-only authentication.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] text-amber-600 dark:text-amber-300 font-mono font-medium">Next.js 14</span>
              <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] text-slate-700 dark:text-slate-300 font-mono font-medium">MongoDB</span>
              <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-medium">Tailwind</span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 dark:border-slate-800/80 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} TaskFlow Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="h-3 w-3 text-rose-500 fill-rose-500" /> by Nabil · Full-Stack Web Development
          </p>
        </div>
      </div>
    </footer>
  );
}
