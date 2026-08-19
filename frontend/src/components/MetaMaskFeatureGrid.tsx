import React from 'react';
import { Layers, Shield, Sparkles, Cpu, Radio, Zap, ArrowUpRight, CheckCircle2, Lock } from 'lucide-react';

interface MetaMaskFeatureGridProps {
  onOpenDemo: () => void;
  onOpenDocs: () => void;
}

export const MetaMaskFeatureGrid: React.FC<MetaMaskFeatureGridProps> = ({
  onOpenDemo,
  onOpenDocs,
}) => {
  return (
    <section className="py-12 space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/25">
          <Layers className="w-3.5 h-3.5" />
          Production Engineering Architecture
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white font-sans tracking-tight">
          Engineered for <span className="bg-gradient-to-r from-orange-400 to-indigo-400 bg-clip-text text-transparent">zero-downtime</span> ingestion.
        </h2>
        <p className="text-sm text-gray-400 max-w-lg mx-auto">
          How Sentinel solves unreliability at every layer of the ingestion lifecycle.
        </p>
      </div>

      {/* 3 Core Feature Cards with 3D Tilt Hover Effects */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Multi-Source Connector Mesh */}
        <div className="group rounded-3xl p-7 mm-glass-card flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-white font-sans">
              Connector Abstraction
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Decouples source-specific ingestion protocols (REST API, RSS XML, Sandbox) from the rest of the application. Everything normalizes into one canonical Pydantic model.
            </p>
          </div>

          <div className="pt-6 border-t border-white/5 mt-6 flex items-center justify-between text-xs text-orange-400 font-bold">
            <span>REST • RSS • Synthetic</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 2: 3-State Circuit Breaker */}
        <div className="group rounded-3xl p-7 mm-glass-card flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-white font-sans">
              3-State Circuit Breaker
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              When an upstream source fails repeatedly, the circuit trips to <strong>OPEN</strong> and automatically diverts queries to fallback tiers. Probes recovery with canary requests in <strong>HALF_OPEN</strong>.
            </p>
          </div>

          <div className="pt-6 border-t border-white/5 mt-6 flex items-center justify-between text-xs text-emerald-400 font-bold">
            <span>CLOSED $\to$ OPEN $\to$ HALF_OPEN</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 3: AI Schema Drift Radar */}
        <div className="group rounded-3xl p-7 mm-glass-card flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-white font-sans">
              AI Schema Drift Radar
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Detects structural upstream key migrations (<code className="text-purple-300">position</code> $\to$ <code className="text-purple-300">job_headline</code>) and provides confidence-scored field translations without mutating production code.
            </p>
          </div>

          <div className="pt-6 border-t border-white/5 mt-6 flex items-center justify-between text-xs text-purple-400 font-bold">
            <span>Advisory AI Diagnostics</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Security & Ethical Boundary Callout Banner (MetaMask Style) */}
      <div className="p-8 rounded-3xl mm-glass-glow-cyan border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-left">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider font-mono">
            <Lock className="w-4 h-4" /> Technical & Ethical Stopping Boundary
          </div>
          <h4 className="text-xl font-black text-white font-sans">
            Built for compliance, resilience, and transparent data access.
          </h4>
          <p className="text-xs text-gray-300 max-w-2xl font-normal leading-relaxed">
            Sentinel strictly enforces polite request pacing, jittered backoff, and transparent user-agent signatures on public low-risk sources. We explicitly reject CAPTCHA circumvention and credential hijacking.
          </p>
        </div>

        <button
          onClick={onOpenDocs}
          className="px-6 py-3 rounded-2xl text-xs font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 whitespace-nowrap transition-all cursor-pointer shadow-md"
        >
          Read DECISIONS.md →
        </button>
      </div>
    </section>
  );
};
