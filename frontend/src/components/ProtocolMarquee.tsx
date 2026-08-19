import React from 'react';
import { Shield, Zap, RefreshCw, Cpu, Layers, CheckCircle2, Radio } from 'lucide-react';

export const ProtocolMarquee: React.FC = () => {
  const items = [
    { icon: <Zap className="w-4 h-4 text-[#e2761b] shrink-0" />, text: 'RemoteOK Live Public REST API' },
    { icon: <Radio className="w-4 h-4 text-[#c4f4eb] shrink-0" />, text: 'WeWorkRemotely RSS XML Stream' },
    { icon: <Shield className="w-4 h-4 text-emerald-400] shrink-0" />, text: '3-State Circuit Breaker (CLOSED / OPEN / HALF_OPEN)' },
    { icon: <CheckCircle2 className="w-4 h-4 text-teal-300 shrink-0" />, text: 'Pydantic Strict Invariant Validation' },
    { icon: <RefreshCw className="w-4 h-4 text-[#f6851b] shrink-0" />, text: 'Bounded Exponential Backoff with Jitter' },
    { icon: <Cpu className="w-4 h-4 text-purple-300 shrink-0" />, text: 'AI Schema Drift Semantic Radar' },
    { icon: <Layers className="w-4 h-4 text-[#e2761b] shrink-0" />, text: 'Deterministic Zero-Downtime Fallback Mesh' },
  ];

  return (
    <div className="w-full py-4 border-y border-[#1b363c]/80 bg-[#07171a] overflow-hidden select-none flex items-center">
      <div className="flex gap-6 whitespace-nowrap animate-marquee items-center">
        {[...items, ...items, ...items].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-[#0c2428] border border-[#204a52] text-xs sm:text-sm text-[#c4f4eb] font-semibold tracking-tight shadow-md hover:border-emerald-400/40 transition-colors"
          >
            {item.icon}
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
