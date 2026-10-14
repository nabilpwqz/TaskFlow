"use client";

import React from "react";

export default function GlobalRootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full rounded-2xl border border-slate-800 bg-slate-900/90 p-8 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 font-bold border border-amber-500/20 text-2xl">
            ⚡
          </div>
          <h2 className="text-xl font-bold text-white">System Recovery</h2>
          <p className="mt-2 text-xs text-slate-400">
            A root-level exception occurred. Please refresh or retry loading TaskFlow.
          </p>
          {error?.digest && (
            <p className="mt-3 text-[10px] font-mono text-amber-400 bg-slate-950/60 py-1 px-2 rounded border border-slate-800">
              Digest: {error.digest}
            </p>
          )}
          <button
            onClick={() => reset()}
            className="mt-6 w-full rounded-xl bg-amber-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
