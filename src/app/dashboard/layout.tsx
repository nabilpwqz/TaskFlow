"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  LayoutDashboard,
  ShoppingBag,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Settings,
  Shield,
  Loader2,
} from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Authentication Required</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Please log in to view your orders, deliverables, and dashboard analytics.
        </p>
        <Link
          href="/login"
          className="rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Orders & Delivery", href: "/dashboard/orders", icon: ShoppingBag },
    { label: "Messages", href: "/dashboard/messages", icon: MessageSquare },
    ...(user.role === "freelancer" || user.role === "admin"
      ? [
          { label: "Manage Services", href: "/dashboard/services", icon: Sparkles },
          { label: "Earnings & Stats", href: "/dashboard/earnings", icon: TrendingUp },
        ]
      : []),
    ...(user.role === "admin"
      ? [{ label: "Admin Panel", href: "/admin", icon: Shield, badge: "Admin" }]
      : []),
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 pt-4 pb-8 sm:px-6 sm:pt-6 sm:pb-10 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar Navigation */}
        <aside className="md:col-span-3">
          <div className="sticky top-18 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 shadow-sm dark:shadow-glass backdrop-blur-md">
            {/* User Profile Mini */}
            <div className="flex items-center gap-3 p-2 mb-4 border-b border-slate-100 dark:border-slate-800">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-amber-500/40"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
                  {user.name.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="rounded bg-amber-500/10 px-1.5 py-0.2 text-[10px] font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="flex md:flex-col overflow-x-auto pb-1 md:pb-0 gap-1 md:space-y-1 no-scrollbar">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between shrink-0 whitespace-nowrap rounded-xl px-3 py-2 text-xs font-semibold transition ${
                      isActive
                        ? "bg-amber-500 text-slate-950 shadow-sm"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="ml-2 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.2 text-[9px] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="md:col-span-9">{children}</main>
      </div>
    </div>
  );
}
