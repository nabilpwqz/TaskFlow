"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Service } from "@/types";
import { CATEGORIES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import {
  Sparkles,
  Plus,
  Eye,
  Trash2,
  PauseCircle,
  PlayCircle,
  Loader2,
  Star,
  Check,
} from "lucide-react";
import Link from "next/link";

export default function FreelancerServicesPage() {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [category, setCategory] = useState("Web Development");
  const [coverImage, setCoverImage] = useState(
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800"
  );
  const [price, setPrice] = useState(250);
  const [deliveryDays, setDeliveryDays] = useState(3);

  const fetchMyServices = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/services?sellerId=${user._id}&status=all`);
      const data = await res.json();
      if (data.success) {
        setServices(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMyServices();
  }, [fetchMyServices]);

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          shortDesc,
          fullDesc,
          category,
          coverImage,
          packages: [
            {
              id: "basic",
              name: "Standard Package",
              description: shortDesc,
              price: Number(price),
              deliveryDays: Number(deliveryDays),
              revisions: 2,
              features: ["Dedicated Turnaround", "Source Deliverables", "Revisions Included"],
            },
          ],
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCreateModalOpen(false);
        setTitle("");
        setShortDesc("");
        setFullDesc("");
        fetchMyServices();
      } else {
        setErrorMsg(data.error || "Failed to create service");
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleToggleStatus = async (service: Service) => {
    const newStatus = service.status === "published" ? "paused" : "published";
    try {
      await fetch(`/api/services/${service._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchMyServices();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm("Are you sure you want to delete this service listing?")) return;
    try {
      await fetch(`/api/services/${serviceId}`, { method: "DELETE" });
      fetchMyServices();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Manage Freelance Services</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Publish tiered offerings, adjust package pricing, and track listing performance.
          </p>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-xs font-bold text-slate-950 hover:from-amber-400 hover:to-amber-500 transition shadow-glow"
        >
          <Plus className="h-4 w-4" />
          <span>Publish New Service</span>
        </button>
      </div>

      {/* Services List */}
      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500 mx-auto" />
        </div>
      ) : services.length > 0 ? (
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service._id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4 shadow-sm dark:shadow-glass transition hover:border-slate-300 dark:hover:border-slate-700/80"
            >
              <div className="flex items-center gap-4">
                <img
                  src={service.coverImage}
                  alt={service.title}
                  className="h-16 w-24 rounded-xl object-cover bg-slate-100 dark:bg-slate-800"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="rounded bg-amber-500/10 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                      {service.category}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                        service.status === "published"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-slate-100 dark:bg-slate-700/40 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {service.status === "published" ? "Live" : "Paused"}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{service.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span className="flex items-center text-amber-500 dark:text-amber-400">
                      <Star className="h-3.5 w-3.5 fill-amber-400 mr-1" />
                      {service.rating?.toFixed(1) || "5.0"} ({service.reviewCount || 0})
                    </span>
                    <span>•</span>
                    <span>{service.completedOrders || 0} completed orders</span>
                    <span>•</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      From {formatCurrency(service.packages[0]?.price || 100)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800">
                <Link
                  href={`/services/${service.slug}`}
                  target="_blank"
                  className="rounded-lg bg-slate-100 dark:bg-slate-800 p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
                  title="View Public Page"
                >
                  <Eye className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => handleToggleStatus(service)}
                  className="rounded-lg bg-slate-100 dark:bg-slate-800 p-2 text-slate-600 dark:text-slate-300 hover:text-amber-500 transition"
                  title={service.status === "published" ? "Pause Listing" : "Activate Listing"}
                >
                  {service.status === "published" ? (
                    <PauseCircle className="h-4 w-4" />
                  ) : (
                    <PlayCircle className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(service._id)}
                  className="rounded-lg bg-rose-500/10 p-2 text-rose-500 dark:text-rose-400 hover:bg-rose-500/20 transition"
                  title="Delete Service"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-12 text-center shadow-sm">
          <Sparkles className="h-10 w-10 text-amber-500/40 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">No services published yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Create your first service offering to start receiving client orders and building your freelance business.
          </p>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="mt-4 rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
          >
            Create Your First Service
          </button>
        </div>
      )}

      {/* Create Service Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 text-slate-900 dark:text-slate-200 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Publish New Freelance Service</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Fill in your offering details to publish it instantly to the TaskFlow public directory.
            </p>

            <form onSubmit={handleCreateService} className="space-y-4">
              {errorMsg && (
                <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-600 dark:text-rose-400">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Service Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Build High-Performance Next.js Web App with Tailwind & MongoDB"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-amber-500 focus:outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Marketplace Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none transition"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    required
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-amber-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Short Summary
                </label>
                <input
                  type="text"
                  required
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Brief 1-2 sentence overview of what the client gets..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-amber-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Service Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={fullDesc}
                  onChange={(e) => setFullDesc(e.target.value)}
                  placeholder="Describe your process, tech stack, deliverables, requirements from the client, and why you are the top choice..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-amber-500 focus:outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Package Price ($ USD)
                  </label>
                  <input
                    type="number"
                    min={5}
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Delivery Turnaround (Days)
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={deliveryDays}
                    onChange={(e) => setDeliveryDays(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2 text-xs font-bold text-slate-950 hover:from-amber-400 hover:to-amber-500 transition disabled:opacity-50 shadow-glow"
                >
                  {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Publish Service</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
