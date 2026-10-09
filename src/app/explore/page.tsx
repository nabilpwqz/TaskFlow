import React from "react";
import { DataStore } from "@/server/db/store";
import { CATEGORIES } from "@/lib/constants";
import { ServiceCard } from "@/components/marketplace/ServiceCard";
import { Service } from "@/types";
import { Search, Filter, RotateCcw } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

interface ExplorePageProps {
  searchParams: {
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    minRating?: string;
    sort?: string;
    page?: string;
  };
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const q = searchParams.q || "";
  const category = searchParams.category || "all";
  const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : undefined;
  const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined;
  const minRating = searchParams.minRating ? Number(searchParams.minRating) : undefined;
  const sort = searchParams.sort || "newest";
  const page = searchParams.page ? Number(searchParams.page) : 1;

  let result: { items: Service[]; total: number; page: number; limit?: number; totalPages: number } = {
    items: [],
    total: 0,
    page: 1,
    totalPages: 1,
  };
  try {
    result = await DataStore.getServices({
      q,
      category,
      minPrice,
      maxPrice,
      minRating,
      sort,
      page,
      limit: 12,
    });
  } catch (err) {
    console.warn("ExplorePage getServices fallback:", err);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pt-4 pb-8 sm:px-6 sm:pt-6 sm:pb-10 lg:px-8">
      {/* Page Header */}
      <div className="mb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Explore Services & Top Talent
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Showing {result.total} vetted offerings ready to hire.
        </p>
      </div>

      {/* Main Filter Bar & Search */}
      <div className="mb-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 shadow-sm dark:shadow-glass backdrop-blur-md">
        <form method="GET" action="/explore" className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Search services, skills or technologies..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-amber-500 focus:outline-none"
              />
            </div>

            {/* Category Dropdown */}
            <div className="w-full md:w-56">
              <select
                name="category"
                defaultValue={category}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="w-full md:w-48">
              <select
                name="sort"
                defaultValue={sort}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="rating">Highest Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {/* Submit Filter Button */}
            <button
              type="submit"
              className="w-full md:w-auto flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
            >
              <Filter className="h-3.5 w-3.5" />
              <span>Filter</span>
            </button>
          </div>

          {/* Secondary filter chips */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400 text-[11px] font-medium">Quick categories:</span>
              {CATEGORIES.map((cat) => {
                const isActive = category.toLowerCase() === cat.name.toLowerCase();
                return (
                  <Link
                    key={cat.id}
                    href={`/explore?category=${encodeURIComponent(cat.name)}`}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition ${
                      isActive
                        ? "bg-amber-500 text-slate-950 font-bold"
                        : "border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-amber-500/40"
                    }`}
                  >
                    {cat.name}
                  </Link>
                );
              })}
            </div>

            {(q || category !== "all" || sort !== "newest") && (
              <Link
                href="/explore"
                className="flex items-center gap-1 text-[11px] text-amber-500 hover:underline"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset all filters</span>
              </Link>
            )}
          </div>
        </form>
      </div>

      {/* Services Grid */}
      {result.items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {result.items.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-12 text-center max-w-md mx-auto my-12 shadow-sm dark:shadow-none">
          <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No services found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Try adjusting your search keywords, budget, or clearing your selected category filters.
          </p>
          <Link
            href="/explore"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
          >
            Clear Filters
          </Link>
        </div>
      )}
    </div>
  );
}
