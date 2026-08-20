import React, { useState, useEffect } from 'react';

// Inline website-style loading — pulsing glass cards with live status text
// NO terminal, NO fake CLI output.

const STATUS_STEPS = [
  'Connecting to live sources…',
  'Fetching from RemoteOK API…',
  'Normalizing RSS feed records…',
  'Validating schema integrity…',
  'Ranking by relevance…',
  'Rendering opportunities…',
];

export const SourceCycleLoader: React.FC = () => {
  const [stepIndex, setStepIndex] = useState(0);

  // Cycle through status messages
  useEffect(() => {
    if (stepIndex >= STATUS_STEPS.length - 1) return;
    const t = setTimeout(() => setStepIndex((s) => s + 1), 520);
    return () => clearTimeout(t);
  }, [stepIndex]);

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      {/* Status pill */}
      <div className="flex items-center justify-center gap-3">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
        <p className="text-sm font-medium text-white/70 transition-all duration-300">
          {STATUS_STEPS[stepIndex]}
        </p>
      </div>

      {/* Skeleton cards grid — 6 pulsing placeholders */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-3xl p-6 border border-white/[0.07] flex flex-col gap-4"
            style={{
              background: 'linear-gradient(135deg, rgba(16,40,30,0.7) 0%, rgba(8,22,18,0.85) 100%)',
              animationDelay: `${i * 80}ms`,
            }}
          >
            {/* Source badge skeleton */}
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div
                  className="h-3 w-16 rounded-full bg-white/10 animate-pulse"
                  style={{ animationDelay: `${i * 60}ms` }}
                />
                {/* Title */}
                <div
                  className="h-4 w-3/4 rounded-full bg-white/[0.12] animate-pulse"
                  style={{ animationDelay: `${i * 80 + 40}ms` }}
                />
                {/* Company + location row */}
                <div className="flex gap-2">
                  <div
                    className="h-3 w-1/3 rounded-full bg-white/[0.07] animate-pulse"
                    style={{ animationDelay: `${i * 80 + 80}ms` }}
                  />
                  <div
                    className="h-3 w-1/4 rounded-full bg-white/[0.05] animate-pulse"
                    style={{ animationDelay: `${i * 80 + 120}ms` }}
                  />
                </div>
              </div>
              {/* Badge */}
              <div
                className="h-5 w-20 rounded-full bg-white/[0.06] animate-pulse"
                style={{ animationDelay: `${i * 60 + 20}ms` }}
              />
            </div>

            {/* Description lines */}
            <div className="space-y-1.5">
              <div
                className="h-2.5 w-full rounded-full bg-white/[0.06] animate-pulse"
                style={{ animationDelay: `${i * 80 + 60}ms` }}
              />
              <div
                className="h-2.5 w-5/6 rounded-full bg-white/[0.04] animate-pulse"
                style={{ animationDelay: `${i * 80 + 100}ms` }}
              />
            </div>

            {/* Tags row */}
            <div className="flex gap-1.5">
              {[40, 56, 48].map((w, ti) => (
                <div
                  key={ti}
                  className="h-5 rounded-lg bg-white/[0.05] animate-pulse"
                  style={{ width: `${w}px`, animationDelay: `${i * 80 + ti * 30}ms` }}
                />
              ))}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
              <div
                className="h-3 w-16 rounded-full bg-white/[0.06] animate-pulse"
                style={{ animationDelay: `${i * 60 + 40}ms` }}
              />
              <div
                className="h-7 w-20 rounded-xl bg-white/[0.06] animate-pulse"
                style={{ animationDelay: `${i * 60 + 60}ms` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
