"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home, ShieldAlert } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error for observability
    console.error("TaskFlow Global App Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="relative mb-6">
        <div className="absolute -inset-4 rounded-full bg-amber-500/10 blur-xl animate-pulse" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 shadow-glow">
          <ShieldAlert className="h-8 w-8" />
        </div>
      </div>

      <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-500 mb-3">
        <span>System Resilience Guard</span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
        Service Temporarily Unavailable
      </h1>

      <p className="mt-3 max-w-md text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        TaskFlow encountered a transient server processing condition. Your session and data remain safe.
      </p>

      {error?.digest && (
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-900/80 px-3 py-1 text-[11px] font-mono text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
          <span>Error Digest:</span>
          <span className="text-amber-500 font-bold">{error.digest}</span>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2.5 text-xs font-bold text-slate-950 hover:from-amber-400 hover:to-amber-500 transition shadow-glow"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </button>

        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 px-5 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-amber-500/40 hover:text-amber-500 transition"
        >
          <Home className="h-4 w-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
