"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Service, ServicePackage } from "@/types";
import { useAuth } from "@/components/providers/AuthProvider";
import { formatCurrency } from "@/lib/utils";
import { Check, Clock, RotateCcw, X, ShieldCheck, Loader2 } from "lucide-react";

interface OrderModalProps {
  service: Service;
  selectedPackage: ServicePackage;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderModal({ service, selectedPackage, isOpen, onClose }: OrderModalProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [requirements, setRequirements] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handlePlaceOrder = async () => {
    if (!user) {
      setError("Please sign in to place an order.");
      return;
    }

    if (user._id === service.sellerId) {
      setError("You cannot order your own service.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: service._id,
          packageId: selectedPackage.id,
          requirements,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onClose();
        router.push("/dashboard/orders");
      } else {
        setError(data.error || "Failed to create order");
      }
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 p-6 shadow-2xl dark:shadow-glass text-slate-800 dark:text-slate-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-5 pr-8">
          <span className="rounded bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20">
            Secure Marketplace Checkout
          </span>
          <h2 className="mt-2 text-lg font-bold text-slate-900 dark:text-white leading-snug">
            {service.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Sold by {service.seller?.name || "Verified Professional"}
          </p>
        </div>

        {/* Selected Package Card */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4 mb-5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                {selectedPackage.name} Package
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{selectedPackage.description}</p>
            </div>
            <div className="text-right">
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                {formatCurrency(selectedPackage.price)}
              </span>
              <span className="block text-[11px] text-slate-400">Escrow Protected</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-amber-500" />
              <span>{selectedPackage.deliveryDays} Days Delivery</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RotateCcw className="h-3.5 w-3.5 text-amber-500" />
              <span>{selectedPackage.revisions} Revisions</span>
            </div>
          </div>
        </div>

        {/* Requirements form */}
        <div className="space-y-2 mb-5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            Project Requirements & Notes (Optional)
          </label>
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Describe what you need, your goals, or paste any links/design files..."
            rows={3}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-950 p-3 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition"
          />
        </div>

        {/* Error notice */}
        {error && (
          <div className="mb-4 rounded-lg bg-rose-500/10 border border-rose-500/30 p-2.5 text-xs text-rose-500">
            {error}
          </div>
        )}

        {/* Auth prompt if not logged in */}
        {!user && (
          <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300 flex items-center justify-between">
            <span>You are not signed in.</span>
            <Link
              href="/login"
              className="rounded-lg bg-amber-500 px-3 py-1 text-slate-950 font-bold hover:bg-amber-400 transition"
            >
              Sign in
            </Link>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Sandbox Mode: Instant activation</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2 text-xs font-bold text-slate-950 hover:from-amber-400 hover:to-amber-500 transition disabled:opacity-50 shadow-glow"
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Confirm & Place Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
