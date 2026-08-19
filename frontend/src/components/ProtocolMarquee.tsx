import React from 'react';
import { Shield, Zap, RefreshCw, Cpu, Layers, CheckCircle2, Radio } from 'lucide-react';

export const ProtocolMarquee: React.FC = () => {
  const items = [
    { icon: <Zap className="w-3.5 h-3.5 text-[#e2761b]" />, text: 'RemoteOK Live Public REST API' },
    { icon: <Radio className="w-3.5 h-3.5 text-[#c4f4eb]" />, text: 'WeWorkRemotely RSS XML Stream' },
    { icon: <Shield className="w-3.5 h-3.5 text-emerald-400" />, text: '3-State Circuit Breaker (CLOSED / OPEN / HALF_OPEN)' },
    { icon: <CheckCircle2 className="w-3.5 h-3.5 text-teal-300" />, text: 'Pydantic Strict Invariant Validation' },
    { icon: <RefreshCw className="w-3.5 h-3.5 text-[#f6851b]" />, text: 'Bounded Exponential Backoff with Jitter' },
    { icon: <Cpu className="w-3.5 h-3.5 text-purple-300" />, text: 'AI Schema Drift Semantic Radar' },
    { icon: <Layers className="w-3.5 h-3.5 text-[#e2761b]" />, text: 'Deterministic Zero-Downtime Fallback Mesh' },
  ];

  return (
    <div className="w-full py-4 border-y border-[#1b363c] bg-[#091a1e] overflow-hidden">
      <div className="flex gap-8 whitespace-nowrap animate-marquee">
        {[...items, ...items].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0e262b] border border-[#234850] text-xs text-[#c4f4eb] font-medium tracking-tight"
          >
            {item.icon}
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
