import React from "react";
import { notFound } from "next/navigation";
import { DataStore } from "@/server/db/store";
import { ServiceDetailClient } from "./ServiceDetailClient";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const revalidate = 0;

interface ServicePageProps {
  params: {
    slug: string;
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  let service: any = null;
  let reviews: any[] = [];

  try {
    service = await DataStore.getServiceBySlug(params.slug);
    if (service) {
      reviews = await DataStore.getReviews({ serviceId: service._id });
    }
  } catch (err) {
    console.warn("ServiceDetailPage fetch error:", err);
  }

  if (!service) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pt-4 pb-8 sm:px-6 sm:pt-5 sm:pb-10 lg:px-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4">
        <Link href="/" className="hover:text-amber-500 transition">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/explore" className="hover:text-amber-500 transition">
          Marketplace
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          href={`/explore?category=${encodeURIComponent(service.category)}`}
          className="hover:text-amber-500 transition"
        >
          {service.category}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-slate-900 dark:text-slate-200 font-medium truncate max-w-xs">{service.title}</span>
      </nav>

      <ServiceDetailClient service={service} reviews={reviews} />
    </div>
  );
}
