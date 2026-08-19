import React from 'react';
import { ShieldCheck, CheckCircle2, Zap, Server } from 'lucide-react';

export const SentinelSectionStats: React.FC = () => {
  const stats = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      value: "100%",
      label: "Invariant Validated",
      subtext: "Strict Pydantic field schemas"
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-[#bbf3e5]" />,
      value: "17 / 17",
      label: "Pytest Suite Passing",
      subtext: "Circuits, PACER, & Drift tests"
    },
    {
      icon: <Zap className="w-6 h-6 text-orange-400" />,
      value: "<250ms",
      label: "Median Ingestion Latency",
      subtext: "Non-blocking async HTTP pipelines"
    },
    {
      icon: <Server className="w-6 h-6 text-teal-300" />,
      value: "3-State",
      label: "Circuit Breaker Resilience",
      subtext: "CLOSED • OPEN • HALF_OPEN"
    }
  ];

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-[#041c17] text-white border-t border-emerald-500/20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-[#06241e]/80 border border-emerald-500/25 flex flex-col items-center text-center space-y-2 hover:border-emerald-400/50 transition-all shadow-lg"
            >
              <div className="p-3 rounded-2xl bg-white/[0.04] mb-1">
                {stat.icon}
              </div>
              <span className="text-3xl sm:text-4xl font-black text-white tracking-tight font-sans">
                {stat.value}
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#bbf3e5]">
                {stat.label}
              </span>
              <span className="text-[11px] text-white/50 font-mono">
                {stat.subtext}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
