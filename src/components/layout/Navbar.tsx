"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import {
  Layers,
  Search,
  Bell,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Sparkles,
  Shield,
  Briefcase,
  Sun,
  Moon,
  Check,
  Flame,
  LayoutDashboard,
  MessageSquare,
  TrendingUp,
  Compass,
  Info,
  Mail,
  ArrowRight,
} from "lucide-react";

export function Navbar() {
  const { user, firebaseUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetch("/api/notifications")
        .then((r) => r.json())
        .then((res) => {
          if (res.success && Array.isArray(res.data)) {
            setNotifications(res.data);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  // Close menus on path changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setNotifDropdownOpen(false);
  }, [pathname]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = async () => {
    try {
      for (const n of notifications.filter((item) => !item.read)) {
        await fetch("/api/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: n._id }),
        });
      }
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {}
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl transition-colors duration-200">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="flex items-center gap-2 transition hover:opacity-90 shrink-0">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 shadow-glow">
              <Layers className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                Task<span className="text-amber-500">Flow</span>
              </span>
              <span className="hidden xs:inline-block rounded-full bg-amber-500/10 px-1.5 py-0.2 text-[9px] font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                PRO
              </span>
            </div>
          </Link>

          {/* Desktop Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/explore"
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                pathname === "/explore"
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Explore Services
            </Link>
            <Link
              href="/about"
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                pathname === "/about"
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                pathname === "/contact"
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Contact
            </Link>
          </nav>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden lg:flex items-center flex-1 max-w-sm mx-6">
          <form action="/explore" method="GET" className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              name="q"
              placeholder="Search services, skills, or experts..."
              className="w-full rounded-full bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/60 pl-9 pr-4 py-1.5 text-xs sm:text-sm text-slate-900 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
            />
          </form>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Desktop Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 transition"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Night Mode"}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="h-4 w-4 transition-transform hover:-rotate-12" />
            )}
          </button>

          {user ? (
            <>
              {/* Notifications with interactive popover (available on both mobile and desktop) */}
              <div className="relative">
                <button
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="relative rounded-xl p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white transition"
                  title="Notifications"
                  aria-label="View notifications"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
                    </span>
                  )}
                </button>

                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-2xl z-50 backdrop-blur-xl animate-in fade-in duration-100">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        Notifications ({unreadCount} new)
                      </span>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="text-[10px] text-amber-500 font-semibold hover:underline flex items-center gap-1"
                        >
                          <Check className="h-3 w-3" />
                          <span>Mark all read</span>
                        </button>
                      )}
                    </div>

                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {notifications.length > 0 ? (
                        notifications.slice(0, 5).map((n) => (
                          <Link
                            key={n._id}
                            href={n.link || "/dashboard/orders"}
                            onClick={() => setNotifDropdownOpen(false)}
                            className={`block p-2 rounded-xl text-xs transition ${
                              n.read
                                ? "bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400"
                                : "bg-amber-500/10 border border-amber-500/20 text-slate-900 dark:text-white"
                            }`}
                          >
                            <div className="font-semibold text-xs">{n.title}</div>
                            <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">
                              {n.message}
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="py-6 text-center text-xs text-slate-400">
                          No alerts right now
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center mt-2">
                      <Link
                        href="/dashboard/orders"
                        onClick={() => setNotifDropdownOpen(false)}
                        className="text-[11px] font-semibold text-amber-500 hover:underline"
                      >
                        View all orders & alerts →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop User Dropdown */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700/80 bg-slate-100 dark:bg-slate-800/60 p-1 pr-2.5 text-xs text-slate-700 dark:text-slate-200 hover:border-amber-500/50 transition"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-6 w-6 rounded-full object-cover ring-1 ring-amber-500/40"
                    />
                  ) : (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-500 font-bold">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <span className="max-w-[100px] truncate font-medium">{user.name.split(" ")[0]}</span>
                  <span className="rounded bg-slate-200 dark:bg-slate-700/80 px-1 py-0.2 text-[10px] uppercase text-amber-600 dark:text-amber-400 font-semibold">
                    {user.role}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900/95 p-1.5 shadow-xl dark:shadow-glass z-50 backdrop-blur-xl animate-in fade-in duration-100"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-slate-900 dark:text-white text-xs truncate">{user.name}</span>
                        {firebaseUser && (
                          <span className="shrink-0 flex items-center gap-1 text-[9px] font-semibold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-full">
                            <Flame className="h-2.5 w-2.5" /> Firebase
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                      <UserIcon className="h-3.5 w-3.5 text-amber-500" />
                      Dashboard & Orders
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <Shield className="h-3.5 w-3.5" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Desktop Auth Buttons (hidden on smaller mobile to prevent bar overflow) */
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow-sm hover:from-amber-400 hover:to-amber-500 transition"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile hamburger icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-xl p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Responsive for Vivo V23e and small screens) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-slate-950/98 backdrop-blur-2xl px-4 py-4 space-y-4 max-h-[calc(100vh-3.5rem)] overflow-y-auto animate-in slide-in-from-top-2 duration-150 shadow-2xl">
          {/* 1. Mobile Search */}
          <form action="/explore" method="GET" onSubmit={() => setMobileMenuOpen(false)} className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              name="q"
              placeholder="Search services or skills..."
              className="w-full rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500 transition"
            />
          </form>

          {/* 2. Theme Mood Switcher (Inside Hamburger Menu) */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                {theme === "dark" ? <Moon className="h-3.5 w-3.5 text-amber-400" /> : <Sun className="h-3.5 w-3.5 text-amber-500" />}
                <span>Theme Mood</span>
              </span>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                {theme === "dark" ? "Night Mode" : "Light Mode"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { if (theme === "dark") toggleTheme(); }}
                className={`flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-bold transition ${
                  theme === "light"
                    ? "bg-white text-slate-900 shadow-sm border border-slate-300 ring-2 ring-amber-500/20"
                    : "bg-slate-200/60 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Sun className="h-3.5 w-3.5 text-amber-500" />
                <span>Light Mood</span>
              </button>
              <button
                type="button"
                onClick={() => { if (theme === "light") toggleTheme(); }}
                className={`flex items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-xs font-bold transition ${
                  theme === "dark"
                    ? "bg-slate-800 text-white shadow-sm border border-slate-700 ring-2 ring-amber-500/20"
                    : "bg-slate-200/60 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Moon className="h-3.5 w-3.5 text-amber-400" />
                <span>Night Mood</span>
              </button>
            </div>
          </div>

          {/* 3. Authentication: Login / Sign Up OR User Profile */}
          {user ? (
            <div className="space-y-3">
              {/* Profile Card */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-amber-500/40"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white truncate max-w-[150px]">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate max-w-[150px]">{user.email}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    {user.role}
                  </span>
                  {firebaseUser && (
                    <span className="flex items-center gap-0.5 text-[9px] font-semibold text-amber-500">
                      <Flame className="h-2.5 w-2.5" /> Firebase
                    </span>
                  )}
                </div>
              </div>

              {/* User Dashboard Links */}
              <div className="space-y-1">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  <LayoutDashboard className="h-4 w-4 text-amber-500" />
                  <span>My Dashboard</span>
                </Link>
                <Link
                  href="/dashboard/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  <Briefcase className="h-4 w-4 text-blue-500" />
                  <span>Orders & Delivery</span>
                </Link>
                <Link
                  href="/dashboard/messages"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  <MessageSquare className="h-4 w-4 text-emerald-500" />
                  <span>Project Messages</span>
                </Link>

                {(user.role === "freelancer" || user.role === "admin") && (
                  <>
                    <Link
                      href="/dashboard/services"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                    >
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      <span>Manage Services</span>
                    </Link>
                    <Link
                      href="/dashboard/earnings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                    >
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                      <span>Earnings & Financials</span>
                    </Link>
                  </>
                )}

                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40"
                  >
                    <Shield className="h-4 w-4" />
                    <span>Admin Governance Center</span>
                  </Link>
                )}
              </div>

              {/* Mobile Sign Out */}
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 w-full rounded-xl py-2.5 px-3 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 hover:bg-rose-100 transition shadow-sm"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            /* Log In & Sign Up for Visitors (Inside Hamburger Menu) */
            <div className="space-y-3 pt-1">
              <div className="space-y-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-2.5 px-4 text-xs font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition"
                >
                  <UserIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <span>Log In to Account</span>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-2.5 px-4 text-xs font-bold text-slate-950 hover:from-amber-400 hover:to-amber-500 shadow-sm transition"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Sign Up (Create Free Account)</span>
                </Link>
              </div>

            </div>
          )}

          {/* 4. General Marketplace Navigation */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
            <Link
              href="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-amber-500" />
                <span>Explore Services</span>
              </div>
              <ArrowRight className="h-3 w-3 text-slate-400" />
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-500" />
                <span>About TaskFlow</span>
              </div>
              <ArrowRight className="h-3 w-3 text-slate-400" />
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-500" />
                <span>Contact & Support</span>
              </div>
              <ArrowRight className="h-3 w-3 text-slate-400" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
