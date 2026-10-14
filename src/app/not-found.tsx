import React from "react";
import Link from "next/link";
import { Layers } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 font-bold mb-4">
        <Layers className="h-6 w-6" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Page Not Found</h1>
      <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 max-w-sm">
        The service listing, profile, or marketplace route you requested could not be located.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
      >
        Return to Home
      </Link>
    </div>
  );
}
