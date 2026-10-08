import React from "react";
import Link from "next/link";
import { Service } from "@/types";
import { Star, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const lowestPrice = Math.min(...(service.packages?.map((p) => p.price) || [100]));
  const fastestDelivery = Math.min(...(service.packages?.map((p) => p.deliveryDays) || [3]));

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-sm dark:shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-glow"
    >
      {/* Cover Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={service.coverImage || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800"}
          alt={service.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-2.5 left-2.5">
          <span className="rounded-md bg-white/90 dark:bg-slate-950/80 px-2 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/50 shadow-sm">
            {service.category}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-4 justify-between">
        <div>
          {/* Seller details */}
          <div className="flex items-center gap-2 mb-2.5">
            {service.seller?.avatar ? (
              <img
                src={service.seller.avatar}
                alt={service.seller.name}
                className="h-6 w-6 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
              />
            ) : (
              <div className="h-6 w-6 rounded-full bg-amber-500/20 text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center justify-center">
                {service.seller?.name ? service.seller.name.charAt(0) : "S"}
              </div>
            )}
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate">
              {service.seller?.name || "Verified Pro"}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
            {service.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2.5 text-xs">
            <div className="flex items-center text-amber-500">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500 mr-0.5" />
              <span className="font-bold text-slate-900 dark:text-white">
                {service.rating ? service.rating.toFixed(1) : "5.0"}
              </span>
            </div>
            <span className="text-slate-500 dark:text-slate-400">
              ({service.reviewCount || 0})
            </span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <div className="flex items-center text-slate-500 dark:text-slate-400 gap-1 text-[11px]">
              <Clock className="h-3 w-3" />
              <span>{fastestDelivery}d delivery</span>
            </div>
          </div>
        </div>

        {/* Price Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400">Starting at</span>
          <span className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
            {formatCurrency(lowestPrice)}
          </span>
        </div>
      </div>
    </Link>
  );
}
