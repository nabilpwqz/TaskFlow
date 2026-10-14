"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { formatCurrency, formatDate } from "@/lib/utils";
import { User } from "@/types";
import {
  Shield,
  Users,
  Briefcase,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchAdminData = async () => {
    try {
      const [analyticsRes, usersRes] = await Promise.all([
        fetch("/api/admin/analytics"),
        fetch("/api/admin/users"),
      ]);

      const aData = await analyticsRes.json();
      const uData = await usersRes.json();

      if (aData.success) setAnalytics(aData.data);
      if (uData.success) setUsersList(uData.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleUserStatus = async (targetUser: User) => {
    const newStatus = targetUser.status === "active" ? "suspended" : "active";
    setActionLoadingId(targetUser._id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: targetUser._id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="mx-auto max-w-md py-20 px-4 text-center">
        <Shield className="h-12 w-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Administrator Access Required</h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
          This area is restricted to TaskFlow platform operators and integrity moderators.
        </p>
        <Link
          href="/"
          className="rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition shadow-sm"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 pb-12 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Admin Governance Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1.5 tracking-tight">
            Platform Operations & Moderation
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Real-time marketplace telemetry, user account controls, and commission reconciliation.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5 text-amber-500" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Analytics KPI Grid */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-sm dark:shadow-glass hover:border-slate-300 dark:hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Gross Platform GMV</span>
              <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {formatCurrency(analytics.grossVolume || 0)}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Total completed project volume</div>
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 shadow-sm dark:shadow-glass hover:border-amber-500/50 transition">
            <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Platform Take (10%)</span>
              <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
              {formatCurrency(analytics.platformFee || 0)}
            </div>
            <div className="text-[11px] text-amber-700 dark:text-amber-300 mt-1 font-medium">Net platform SaaS commission</div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-sm dark:shadow-glass hover:border-slate-300 dark:hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Active Transactions</span>
              <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {analytics.activeOrdersCount || 0}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Under escrow & delivery</div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-sm dark:shadow-glass hover:border-slate-300 dark:hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider">Registered Accounts</span>
              <div className="h-8 w-8 rounded-lg bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {analytics.usersCount || 0}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {analytics.servicesCount || 0} published listings
            </div>
          </div>
        </div>
      )}

      {/* Users Moderation Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm dark:shadow-glass">
        <div className="mb-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            User Account Management & Access Control
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Review accounts, inspect role credentials, or instantly suspend/restore marketplace access.
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <Loader2 className="h-7 w-7 animate-spin text-amber-500 mx-auto" />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Loading user accounts...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="pb-3.5 font-bold">User</th>
                  <th className="pb-3.5 font-bold">Role</th>
                  <th className="pb-3.5 font-bold">Status</th>
                  <th className="pb-3.5 font-bold">Orders</th>
                  <th className="pb-3.5 font-bold">Registered</th>
                  <th className="pb-3.5 font-bold text-right">Moderation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {usersList.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        {u.avatar ? (
                          <img
                            src={u.avatar}
                            alt=""
                            className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-amber-500/15 dark:bg-slate-800 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-xs ring-1 ring-amber-500/30">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          u.role === "admin"
                            ? "bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20"
                            : u.role === "freelancer"
                            ? "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20"
                            : "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          u.status === "active"
                            ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
                            : "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            u.status === "active" ? "bg-emerald-500" : "bg-rose-500"
                          }`}
                        ></span>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-slate-700 dark:text-slate-300 font-medium">
                      {u.completedOrders || 0} completed
                    </td>
                    <td className="py-4 pr-4 text-slate-500 dark:text-slate-400">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="py-4 text-right">
                      {u._id !== user._id && (
                        <button
                          onClick={() => handleToggleUserStatus(u)}
                          disabled={actionLoadingId === u._id}
                          className={`rounded-xl px-3.5 py-1.5 text-[11px] font-bold transition shadow-sm ${
                            u.status === "active"
                              ? "bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30"
                              : "bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30"
                          }`}
                        >
                          {actionLoadingId === u._id
                            ? "Updating..."
                            : u.status === "active"
                            ? "Suspend Account"
                            : "Reactivate Account"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
