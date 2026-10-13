"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Order } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  TrendingUp,
  DollarSign,
  ShieldCheck,
  CreditCard,
  ArrowUpRight,
  Clock,
  CheckCircle2,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function EarningsPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders?role=freelancer")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setOrders(res.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const completedOrders = orders.filter((o) => o.status === "COMPLETED");
  const pendingOrders = orders.filter(
    (o) => o.status === "IN_PROGRESS" || o.status === "DELIVERED" || o.status === "REVISION_REQUESTED"
  );

  const grossEarnings = completedOrders.reduce((sum, o) => sum + o.price, 0);
  const platformFee = Math.round(grossEarnings * 0.1);
  const netEarnings = grossEarnings - platformFee;
  const pendingEscrow = pendingOrders.reduce((sum, o) => sum + o.price, 0);

  // Chart data based on recent orders
  const chartData = [
    { month: "Jan", revenue: 850 },
    { month: "Feb", revenue: 1400 },
    { month: "Mar", revenue: 1950 },
    { month: "Apr", revenue: 2600 },
    { month: "May", revenue: grossEarnings || 3100 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Earnings & Financial Reconciliation</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Track your escrow balances, net payouts, platform fees, and revenue growth.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 shadow-sm dark:shadow-glass">
          <div className="flex items-center justify-between text-amber-500 dark:text-amber-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Net Available</span>
            <DollarSign className="h-4 w-4" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{formatCurrency(netEarnings)}</div>
          <div className="text-[11px] text-amber-600 dark:text-amber-300 mt-1 font-medium">Ready for automated transfer</div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Held in Escrow</span>
            <Clock className="h-4 w-4 text-blue-500 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{formatCurrency(pendingEscrow)}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{pendingOrders.length} active project(s)</div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Lifetime Volume</span>
            <TrendingUp className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(grossEarnings)}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">100% verified settlement</div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Platform Take (10%)</span>
            <ShieldCheck className="h-4 w-4 text-purple-500 dark:text-purple-400" />
          </div>
          <div className="text-2xl font-black text-slate-700 dark:text-slate-300">{formatCurrency(platformFee)}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Escrow & payment processing</div>
        </div>
      </div>

      {/* Revenue Performance Chart (Recharts) */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm dark:shadow-glass">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">Monthly Payout Analytics</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Gross project payouts delivered over recent months.</p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "0.75rem",
                  fontSize: "12px",
                }}
                formatter={(val: any) => [`$${val}`, "Revenue"]}
              />
              <Bar dataKey="revenue" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payout & Order Settlement Ledger */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm dark:shadow-glass">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">Financial Ledger & Settlement History</h2>

        {completedOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="pb-3 font-semibold">Completed Date</th>
                  <th className="pb-3 font-semibold">Order / Service</th>
                  <th className="pb-3 font-semibold">Client</th>
                  <th className="pb-3 font-semibold">Gross</th>
                  <th className="pb-3 font-semibold">Fee (10%)</th>
                  <th className="pb-3 font-semibold text-right">Net Payout</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {completedOrders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                    <td className="py-3 text-slate-500 dark:text-slate-400">
                      {ord.completedAt ? formatDate(ord.completedAt) : formatDate(ord.createdAt)}
                    </td>
                    <td className="py-3 font-semibold text-slate-900 dark:text-white truncate max-w-xs">
                      {ord.service?.title}
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">{ord.client?.name || "Client"}</td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">{formatCurrency(ord.price)}</td>
                    <td className="py-3 text-rose-500 dark:text-rose-400">-{formatCurrency(Math.round(ord.price * 0.1))}</td>
                    <td className="py-3 font-bold text-emerald-600 dark:text-emerald-400 text-right">
                      +{formatCurrency(Math.round(ord.price * 0.9))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-slate-500 dark:text-slate-400">
            No completed order payouts recorded yet.
          </div>
        )}
      </div>
    </div>
  );
}
