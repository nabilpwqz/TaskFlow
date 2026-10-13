"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { Order, Notification } from "@/types";
import { ORDER_STATUSES } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowRight,
  Bell,
  Star,
  ExternalLink,
} from "lucide-react";

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [ordRes, notifRes] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/notifications"),
        ]);
        const ordData = await ordRes.json();
        const notifData = await notifRes.json();

        if (ordData.success) setOrders(ordData.data || []);
        if (notifData.success) setNotifications(notifData.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const isFreelancer = user?.role === "freelancer";
  const activeOrders = orders.filter(
    (o) => o.status === "IN_PROGRESS" || o.status === "DELIVERED" || o.status === "REVISION_REQUESTED"
  );
  const completedOrders = orders.filter((o) => o.status === "COMPLETED");
  const totalVolume = orders.reduce((sum, o) => sum + (o.status === "COMPLETED" ? o.price : 0), 0);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm dark:shadow-glass">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isFreelancer
                ? "Here is your active workload, recent client deliveries, and earnings."
                : "Track your active hires, inspect deliverables, and approve completed projects."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={isFreelancer ? "/dashboard/services" : "/explore"}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
            >
              <span>{isFreelancer ? "Manage Services" : "Hire Freelancers"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Projects</span>
            <Clock className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{activeOrders.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">In progress or delivered</div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Completed</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{completedOrders.length}</div>
          <div className="text-[11px] text-emerald-500 mt-1">100% verified approval</div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{isFreelancer ? "Total Earned" : "Total Spent"}</span>
            <TrendingUp className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-500 dark:text-amber-400">{formatCurrency(totalVolume)}</div>
          <div className="text-[11px] text-slate-400 mt-1">Completed transactions</div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Reputation</span>
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{user?.rating?.toFixed(1) || "5.0"}</div>
          <div className="text-[11px] text-slate-400 mt-1">Verified reviews</div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 shadow-sm dark:shadow-glass">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Orders & Activity</h2>
          <Link
            href="/dashboard/orders"
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline transition"
          >
            View all orders
          </Link>
        </div>

        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="pb-3 font-semibold">Service</th>
                  <th className="pb-3 font-semibold">{isFreelancer ? "Client" : "Freelancer"}</th>
                  <th className="pb-3 font-semibold">Package</th>
                  <th className="pb-3 font-semibold">Price</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {orders.slice(0, 5).map((order) => {
                  const statusConfig = ORDER_STATUSES[order.status] || ORDER_STATUSES.IN_PROGRESS;
                  const otherParty = isFreelancer ? order.client : order.freelancer;

                  return (
                    <tr key={order._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                      <td className="py-3.5 pr-4">
                        <div className="font-semibold text-slate-900 dark:text-white truncate max-w-xs">
                          {order.service?.title || "Service"}
                        </div>
                        <div className="text-[11px] text-slate-400">#{order._id.substring(0, 8)}</div>
                      </td>
                      <td className="py-3.5 pr-4 text-slate-600 dark:text-slate-300">
                        {otherParty?.name || "User"}
                      </td>
                      <td className="py-3.5 pr-4 text-slate-600 dark:text-slate-300">
                        {order.packageSnapshot?.name || "Standard"}
                      </td>
                      <td className="py-3.5 pr-4 font-bold text-slate-900 dark:text-white">
                        {formatCurrency(order.price)}
                      </td>
                      <td className="py-3.5 pr-4">
                        <span
                          className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-semibold ${statusConfig.color}`}
                        >
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <Link
                          href="/dashboard/orders"
                          className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-400">
            No orders found yet. Start by browsing services!
          </div>
        )}
      </div>

      {/* Notifications Alert Feed */}
      {notifications.length > 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 shadow-sm dark:shadow-none">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-4 w-4 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Latest Notifications</h2>
          </div>
          <div className="space-y-2.5">
            {notifications.slice(0, 4).map((n) => (
              <div
                key={n._id}
                className={`rounded-xl border p-3 text-xs transition ${
                  n.read
                    ? "border-slate-100 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400"
                    : "border-amber-500/20 bg-amber-500/5 text-slate-800 dark:text-slate-200"
                }`}
              >
                <div className="font-semibold text-slate-900 dark:text-white">{n.title}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</div>
                <div className="text-[10px] text-slate-400 mt-1">{formatDate(n.createdAt)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
