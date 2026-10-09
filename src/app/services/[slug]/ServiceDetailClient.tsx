"use client";

import React, { useState } from "react";
import { Service, ServicePackage, Review } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { OrderModal } from "@/components/marketplace/OrderModal";
import {
  Star,
  Clock,
  RotateCcw,
  Check,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface ServiceDetailClientProps {
  service: Service;
  reviews: Review[];
}

export function ServiceDetailClient({ service, reviews }: ServiceDetailClientProps) {
  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    service.packages[0]?.id || "basic"
  );
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  const currentPackage =
    service.packages.find((p) => p.id === selectedPackageId) || service.packages[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Details, Description, Reviews (8 cols) */}
      <div className="lg:col-span-8 space-y-8">
        {/* Title & Category Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20">
              {service.category}
            </span>
            <div className="flex items-center text-xs text-amber-500 font-semibold gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-500" />
              <span className="text-slate-900 dark:text-white">{service.rating?.toFixed(1) || "5.0"}</span>
              <span className="text-slate-500 dark:text-slate-400">({service.reviewCount || 0} reviews)</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
            {service.title}
          </h1>
        </div>

        {/* Cover Image Gallery */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-sm dark:shadow-glass aspect-[16/9]">
          <img
            src={service.coverImage}
            alt={service.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Freelancer Profile Highlight */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-sm dark:shadow-none backdrop-blur-md">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {service.seller?.avatar ? (
                <img
                  src={service.seller.avatar}
                  alt={service.seller.name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-amber-500/30"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-lg">
                  {service.seller?.name ? service.seller.name.charAt(0) : "S"}
                </div>
              )}
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{service.seller?.name || "Verified Professional"}</span>
                  <span className="rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold">
                    Top Rated
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">@{service.seller?.username || "freelancer"}</p>
              </div>
            </div>

            <div className="text-right text-xs">
              <span className="text-amber-500 font-bold text-sm">
                ★ {service.seller?.rating || "5.0"}
              </span>
              <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                {service.completedOrders || 12} orders completed
              </span>
            </div>
          </div>
        </div>

        {/* Full Service Description */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6 shadow-sm dark:shadow-none">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">About This Service</h2>
          <div className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {service.fullDesc}
          </div>

          {/* Tags */}
          {service.tags && service.tags.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-2">
              {service.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/50"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Verified Reviews Section */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Verified Client Reviews</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Only verified buyers who completed orders can review.</p>
            </div>
            <div className="text-right">
              <span className="text-xl font-extrabold text-amber-500">
                ★ {service.rating?.toFixed(1) || "5.0"}
              </span>
              <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                {reviews.length} Total Reviews
              </span>
            </div>
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div
                  key={rev._id}
                  className="rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/60 p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      {rev.client?.avatar ? (
                        <img
                          src={rev.client.avatar}
                          alt={rev.client.name}
                          className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center">
                          {rev.client?.name ? rev.client.name.charAt(0) : "U"}
                        </div>
                      )}
                      <div>
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">
                          {rev.client?.name || "Verified Client"}
                        </span>
                        <span className="block text-[10px] text-slate-500 dark:text-slate-400">
                          {formatDate(rev.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-2">{rev.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-slate-400">
              No reviews yet. Be the first client to complete an order!
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Sticky Tiered Package Selector (4 cols) */}
      <div className="lg:col-span-4">
        <div className="sticky top-18 rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900/95 p-5 shadow-xl dark:shadow-glass backdrop-blur-xl">
          {/* Package Tabs */}
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 dark:bg-slate-950 p-1 mb-5">
            {service.packages.map((pkg) => {
              const isSelected = pkg.id === selectedPackageId;
              return (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedPackageId(pkg.id)}
                  className={`rounded-lg py-2 text-xs font-semibold uppercase tracking-wider transition ${
                    isSelected
                      ? "bg-amber-500 text-slate-950 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {pkg.name.split(" ")[0]}
                </button>
              );
            })}
          </div>

          {/* Package Details */}
          {currentPackage && (
            <div className="space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{currentPackage.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{currentPackage.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-amber-500 dark:text-amber-400">
                    {formatCurrency(currentPackage.price)}
                  </span>
                </div>
              </div>

              {/* Delivery and revisions specs */}
              <div className="flex items-center gap-4 py-3 border-y border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span>{currentPackage.deliveryDays} Days Delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="h-4 w-4 text-amber-500" />
                  <span>{currentPackage.revisions} Revisions</span>
                </div>
              </div>

              {/* Feature checklist */}
              <div className="space-y-2 py-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  What&apos;s included:
                </span>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  {currentPackage.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => setOrderModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-xs font-bold text-slate-950 shadow-glow hover:from-amber-400 hover:to-amber-500 transition"
              >
                <span>Continue ({formatCurrency(currentPackage.price)})</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              {/* Escrow Guarantee */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-2">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>TaskFlow Escrow · Funds released on completion</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Modal */}
      {currentPackage && (
        <OrderModal
          service={service}
          selectedPackage={currentPackage}
          isOpen={orderModalOpen}
          onClose={() => setOrderModalOpen(false)}
        />
      )}
    </div>
  );
}
