import React from 'react';
import { ArrowRight, Activity, ShieldCheck, Zap, Sparkles, Terminal, BookOpen, Layers } from 'lucide-react';
import { Sentinel3DHologram } from './Sentinel3DHologram';

interface MetaMaskHeroProps {
  onExploreJobs: () => void;
  onOpenTelemetry: () => void;
  onOpenDemo: () => void;
}

export const MetaMaskHero: React.FC<MetaMaskHeroProps> = ({
  onExploreJobs,
  onOpenTelemetry,
  onOpenDemo,
}) => {
  return (
    <section className="relative pt-6 pb-12 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: MetaMask-styled Copy & CTAs */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/30 shadow-sm shadow-orange-950/40">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            Adaptive Job Ingestion & Resilience Mesh
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white font-sans leading-[1.1]">
            The leading gateway to{' '}
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-indigo-400 bg-clip-text text-transparent">
              resilient data
            </span>{' '}
            ingestion.
          </h1>

          <p className="text-base sm:text-lg text-gray-300 max-w-xl font-normal leading-relaxed">
            Sentinel treats external sources as unreliable dependencies. Featuring 3-state circuit breakers, bounded jitter pacing, typed schema isolation, and AI schema drift radar.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onExploreJobs}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl font-extrabold text-sm mm-btn-primary text-white cursor-pointer shadow-lg shadow-orange-950/50"
            >
              Explore Opportunities <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenTelemetry}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-sm bg-gray-900/90 hover:bg-gray-800 text-gray-200 border border-white/10 hover:border-white/20 transition-all cursor-pointer shadow-sm"
            >
              <Activity className="w-4 h-4 text-orange-400" /> Live Telemetry
            </button>

            <button
              onClick={onOpenDemo}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-sm bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border border-purple-500/30 transition-all cursor-pointer shadow-sm"
            >
              <Terminal className="w-4 h-4 text-purple-400" /> Demo Lab
            </button>
          </div>

          {/* Mini Real-Time Metrics Ribbon */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-lg">
            <div>
              <span className="text-2xl font-black font-mono text-white">100%</span>
              <span className="block text-[11px] text-gray-400 font-medium mt-0.5">Typed Validation</span>
            </div>
            <div>
              <span className="text-2xl font-black font-mono text-orange-400">3-State</span>
              <span className="block text-[11px] text-gray-400 font-medium mt-0.5">Circuit Breakers</span>
            </div>
            <div>
              <span className="text-2xl font-black font-mono text-emerald-400">&lt;280ms</span>
              <span className="block text-[11px] text-gray-400 font-medium mt-0.5">Median Latency</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive 3D WebGL Hologram */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          {/* Subtle Backlight Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 via-purple-500/20 to-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <Sentinel3DHologram />
        </div>
      </div>
    </section>
  );
};
