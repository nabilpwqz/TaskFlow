"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Order, OrderStatus } from "@/types";
import { ORDER_STATUSES } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  RotateCcw,
  Star,
  Send,
  Loader2,
  ExternalLink,
  ShieldCheck,
  Check,
} from "lucide-react";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");

  // Action modals state
  const [deliveryModalOrder, setDeliveryModalOrder] = useState<Order | null>(null);
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [deliveryLink, setDeliveryLink] = useState("");

  const [revisionModalOrder, setRevisionModalOrder] = useState<Order | null>(null);
  const [revisionFeedback, setRevisionFeedback] = useState("");

  const [reviewModalOrder, setReviewModalOrder] = useState<Order | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDeliver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryModalOrder) return;
    setActionLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/orders/${deliveryModalOrder._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "deliver",
          deliveryMessage,
          deliveryFiles: deliveryLink ? [{ name: "Project_Deliverable", url: deliveryLink, size: "Cloud" }] : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDeliveryModalOrder(null);
        setDeliveryMessage("");
        setDeliveryLink("");
        fetchOrders();
      } else {
        setErrorMsg(data.error || "Failed to submit delivery");
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionModalOrder) return;
    setActionLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/orders/${revisionModalOrder._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "request_revision",
          revisionFeedback,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRevisionModalOrder(null);
        setRevisionFeedback("");
        fetchOrders();
      } else {
        setErrorMsg(data.error || "Failed to request revision");
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to approve this work? Funds will be released to the freelancer.")) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "complete" }),
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
      } else {
        alert(data.error || "Failed to complete order");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalOrder) return;
    setActionLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: reviewModalOrder._id,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReviewModalOrder(null);
        setReviewComment("");
        alert("Thank you! Your verified review has been published.");
        fetchOrders();
      } else {
        setErrorMsg(data.error || "Failed to submit review");
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return o.status === "IN_PROGRESS" || o.status === "REVISION_REQUESTED";
    if (activeTab === "delivered") return o.status === "DELIVERED";
    if (activeTab === "completed") return o.status === "COMPLETED";
    return true;
  });

  const isFreelancer = user?.role === "freelancer";

  // Visual Stepper Stages Calculator
  const getStepStatus = (orderStatus: OrderStatus, stepIndex: number) => {
    const stageMap: Record<OrderStatus, number> = {
      PENDING_PAYMENT: 0,
      IN_PROGRESS: 1,
      DELIVERED: 2,
      REVISION_REQUESTED: 2,
      COMPLETED: 3,
      CANCELLED: 0,
      DISPUTED: 2,
      REFUNDED: 0,
    };
    const currentStage = stageMap[orderStatus] || 1;
    if (currentStage > stepIndex) return "completed";
    if (currentStage === stepIndex) return "active";
    return "upcoming";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Order & Delivery Workflows</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage escrow-protected project deliveries, inspection milestones, and reviews.
          </p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: "all", label: `All Orders (${orders.length})` },
          { id: "active", label: `Active (${orders.filter((o) => o.status === "IN_PROGRESS" || o.status === "REVISION_REQUESTED").length})` },
          { id: "delivered", label: `Delivered (${orders.filter((o) => o.status === "DELIVERED").length})` },
          { id: "completed", label: `Completed (${orders.filter((o) => o.status === "COMPLETED").length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
              activeTab === tab.id
                ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                : "bg-slate-100 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500 mx-auto" />
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
            const statusConfig = ORDER_STATUSES[order.status] || ORDER_STATUSES.IN_PROGRESS;
            const otherParty = isFreelancer ? order.client : order.freelancer;
            const isClient = user?._id === order.clientId;

            return (
              <div
                key={order._id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm dark:shadow-glass transition hover:border-slate-300 dark:hover:border-slate-700/80"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-block rounded-md border px-2.5 py-1 text-xs font-semibold ${statusConfig.color}`}
                    >
                      {statusConfig.label}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      #{order._id.substring(0, 10)}
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{formatDate(order.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-amber-500 dark:text-amber-400">
                      {formatCurrency(order.price)}
                    </span>
                    <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                      Escrow Held
                    </span>
                  </div>
                </div>

                {/* Next-Level Visual Stepper Bar */}
                <div className="py-4 my-2 border-b border-slate-100 dark:border-slate-800/60">
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {[
                      { step: 0, title: "Order Activated", desc: "Requirements & Escrow" },
                      { step: 1, title: "In Production", desc: "Freelancer Work" },
                      { step: 2, title: "Work Delivered", desc: "Inspection & Feedback" },
                      { step: 3, title: "Completed", desc: "Approved & Reviewed" },
                    ].map((st) => {
                      const state = getStepStatus(order.status, st.step);
                      return (
                        <div key={st.step} className="flex flex-col items-center">
                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition ${
                              state === "completed"
                                ? "bg-emerald-500 text-white"
                                : state === "active"
                                ? "bg-amber-500 text-slate-950 ring-4 ring-amber-500/20 animate-pulse"
                                : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                            }`}
                          >
                            {state === "completed" ? <Check className="h-4 w-4" /> : st.step + 1}
                          </div>
                          <span
                            className={`mt-1.5 text-[11px] font-semibold ${
                              state === "active"
                                ? "text-amber-500"
                                : state === "completed"
                                ? "text-emerald-500"
                                : "text-slate-400"
                            }`}
                          >
                            {st.title}
                          </span>
                          <span className="text-[9px] text-slate-400 hidden sm:block">
                            {st.desc}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Content body */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-4">
                  {/* Service info */}
                  <div className="md:col-span-7 space-y-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {order.service?.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-semibold text-amber-500">
                        {order.packageSnapshot?.name} Package:
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {order.packageSnapshot?.deliveryDays}d turnaround, {order.packageSnapshot?.revisions} revisions
                      </span>
                    </div>

                    {order.requirements && (
                      <div className="rounded-xl bg-slate-50 dark:bg-slate-950/70 p-3 border border-slate-200 dark:border-slate-800/60 text-xs text-slate-700 dark:text-slate-300 mt-2">
                        <span className="font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                          Client Requirements:
                        </span>
                        {order.requirements}
                      </div>
                    )}
                  </div>

                  {/* Counterparty & Deadline info */}
                  <div className="md:col-span-5 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800/80 md:pl-6 pt-3 md:pt-0 text-xs space-y-3">
                    <div>
                      <span className="text-slate-400 text-[11px] block">
                        {isFreelancer ? "Client" : "Freelance Specialist"}:
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        {otherParty?.avatar ? (
                          <img
                            src={otherParty.avatar}
                            alt={otherParty.name}
                            className="h-6 w-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-800 text-amber-500 flex items-center justify-center font-bold text-xs">
                            {otherParty?.name ? otherParty.name.charAt(0) : "U"}
                          </div>
                        )}
                        <span className="font-semibold text-slate-900 dark:text-white">{otherParty?.name || "Participant"}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[11px] block">Due Deadline:</span>
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 mt-0.5">
                        <Clock className="h-3.5 w-3.5 text-amber-500" />
                        <span>{formatDate(order.dueAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery history preview if present */}
                {order.deliveries && order.deliveries.length > 0 && (
                  <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3.5 mb-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-purple-600 dark:text-purple-300 flex items-center gap-1.5">
                        <FileText className="h-4 w-4" />
                        Work Deliverable Submitted ({order.deliveries.length})
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatDate(order.deliveries[order.deliveries.length - 1].deliveredAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      &ldquo;{order.deliveries[order.deliveries.length - 1].message}&rdquo;
                    </p>
                    {order.deliveries[order.deliveries.length - 1].files?.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-amber-500 font-mono">
                        <span>📁 {f.name}</span>
                        {f.url && f.url !== "#" && (
                          <a href={f.url} target="_blank" rel="noreferrer" className="underline text-[11px]">
                            Open Deliverable
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Revision history if present */}
                {order.revisionRequests && order.revisionRequests.length > 0 && (
                  <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-3.5 mb-4 text-xs space-y-1">
                    <span className="font-semibold text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
                      <RotateCcw className="h-4 w-4" />
                      Client Revision Request:
                    </span>
                    <p className="text-slate-700 dark:text-slate-300">
                      &ldquo;{order.revisionRequests[order.revisionRequests.length - 1].feedback}&rdquo;
                    </p>
                  </div>
                )}

                {/* Action Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span>Protected by TaskFlow Escrow</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Freelancer Action: Submit Delivery */}
                    {!isClient &&
                      (order.status === "IN_PROGRESS" || order.status === "REVISION_REQUESTED") && (
                        <button
                          onClick={() => setDeliveryModalOrder(order)}
                          className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-500 transition shadow-sm"
                        >
                          Submit Delivery
                        </button>
                      )}

                    {/* Client Actions: Inspect, Revision, Approve */}
                    {isClient && order.status === "DELIVERED" && (
                      <>
                        <button
                          onClick={() => setRevisionModalOrder(order)}
                          className="rounded-xl border border-orange-500/30 bg-orange-500/10 px-3.5 py-2 text-xs font-semibold text-orange-500 hover:bg-orange-500/20 transition"
                        >
                          Request Revision
                        </button>
                        <button
                          onClick={() => handleCompleteOrder(order._id)}
                          className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition"
                        >
                          Approve & Complete
                        </button>
                      </>
                    )}

                    {/* Client Action: Leave Review if completed */}
                    {isClient && order.status === "COMPLETED" && (
                      <button
                        onClick={() => setReviewModalOrder(order)}
                        className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition shadow-glow"
                      >
                        <Star className="h-3.5 w-3.5 fill-slate-950" />
                        <span>Leave Verified Review</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-12 text-center shadow-sm dark:shadow-none">
          <CheckCircle2 className="h-10 w-10 text-slate-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">No orders in this category</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse published offerings in the marketplace to get started.
          </p>
        </div>
      )}

      {/* Delivery Submission Modal */}
      {deliveryModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 text-slate-900 dark:text-slate-200 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Submit Work Deliverable
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Order #{deliveryModalOrder._id.substring(0, 10)} · {deliveryModalOrder.service?.title}
            </p>

            <form onSubmit={handleDeliver} className="space-y-4">
              {errorMsg && (
                <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-2.5 text-xs text-rose-500">
                  {errorMsg}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Delivery Message / Summary
                </label>
                <textarea
                  required
                  rows={4}
                  value={deliveryMessage}
                  onChange={(e) => setDeliveryMessage(e.target.value)}
                  placeholder="Detail what was completed, instructions for the client, and how to verify..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Deliverable Attachment or Repository URL (Optional)
                </label>
                <input
                  type="text"
                  value={deliveryLink}
                  onChange={(e) => setDeliveryLink(e.target.value)}
                  placeholder="https://github.com/... or https://figma.com/..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDeliveryModalOrder(null)}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="rounded-xl bg-purple-600 px-5 py-2 text-xs font-bold text-white hover:bg-purple-500 disabled:opacity-50"
                >
                  {actionLoading ? "Submitting..." : "Submit to Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Revision Request Modal */}
      {revisionModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 text-slate-900 dark:text-slate-200 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Request Project Revision
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Please provide clear and actionable feedback for the freelancer.
            </p>

            <form onSubmit={handleRequestRevision} className="space-y-4">
              {errorMsg && (
                <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-2.5 text-xs text-rose-500">
                  {errorMsg}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Revision Feedback & Changes Needed
                </label>
                <textarea
                  required
                  rows={4}
                  value={revisionFeedback}
                  onChange={(e) => setRevisionFeedback(e.target.value)}
                  placeholder="Explain what needs adjustment before final approval..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRevisionModalOrder(null)}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="rounded-xl bg-orange-600 px-5 py-2 text-xs font-bold text-white hover:bg-orange-500 disabled:opacity-50"
                >
                  {actionLoading ? "Sending..." : "Submit Revision Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Submission Modal */}
      {reviewModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 text-slate-900 dark:text-slate-200 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Submit Verified Client Review
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Order #{reviewModalOrder._id.substring(0, 10)} is completed. Share your feedback!
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {errorMsg && (
                <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-2.5 text-xs text-rose-500">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Rating (1 to 5 Stars)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-2xl transition hover:scale-110"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= reviewRating
                            ? "fill-amber-500 text-amber-500"
                            : "text-slate-300 dark:text-slate-600"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-500 ml-2">
                    {reviewRating} of 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Review Comment
                </label>
                <textarea
                  required
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="How was the communication, turnaround speed, and quality of delivery?"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOrder(null)}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 disabled:opacity-50"
                >
                  {actionLoading ? "Publishing..." : "Publish Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
