import React from 'react';
import { Shield, Zap, RefreshCw, Activity, Terminal, AlertTriangle, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { SystemHealthResponse } from '../types';
import { SystemHealth } from './SystemHealth';

interface SentinelSectionResilienceProps {
  systemHealth: SystemHealthResponse | null;
  onRefresh: () => Promise<void>;
  onOpenDriftDiagnosis: (sourceName: string) => void;
}

export const SentinelSectionResilience: React.FC<SentinelSectionResilienceProps> = ({
  systemHealth,
  onRefresh,
  onOpenDriftDiagnosis,
}) => {
  return (
    <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-[#09221b] text-emerald-100 overflow-hidden border-t border-emerald-500/20">
      {/* Background Radiance */}
      <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Massive Block Headline */}
        <div className="text-center space-y-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase bg-teal-500/20 text-teal-300 border border-teal-500/40">
            Section 02 • Fault Tolerance Matrix
          </span>
          <h2 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-[#c8f5d0] font-sans uppercase leading-none">
            TURN YOUR RESILIENCE ON
          </h2>
          <p className="text-sm sm:text-base text-emerald-200/80 max-w-2xl mx-auto">
            Industrial fault-isolation machinery with 3-state circuit breakers, bounded jitter pacing, and automated recovery telemetry.
          </p>
        </div>

        {/* 4 Surrounding Feature Matrix Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: 3-State Breaker */}
          <div className="p-6 rounded-3xl bg-[#061914]/90 border border-emerald-500/30 flex flex-col justify-between hover:border-emerald-400/60 transition-all shadow-xl">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white leading-snug">
                3-State Circuit Breakers
              </h3>
              <p className="text-xs text-emerald-200/70 leading-relaxed">
                Atomic state machine (CLOSED → OPEN → HALF_OPEN) isolating unhealthy upstream endpoints without blocking client threads.
              </p>
            </div>
            <div className="pt-4 border-t border-emerald-500/20 mt-4 flex items-center justify-between text-xs font-bold text-emerald-400">
              <span>Automatic Trip & Probe</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2: Jittered Request Pacer */}
          <div className="p-6 rounded-3xl bg-[#061914]/90 border border-emerald-500/30 flex flex-col justify-between hover:border-emerald-400/60 transition-all shadow-xl">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white leading-snug">
                Gaussian Jitter Pacer
              </h3>
              <p className="text-xs text-emerald-200/70 leading-relaxed">
                Destroys periodic request rhythms with polite randomized intervals, avoiding WAF rate limits and bot fingerprint triggers.
              </p>
            </div>
            <div className="pt-4 border-t border-emerald-500/20 mt-4 flex items-center justify-between text-xs font-bold text-teal-400">
              <span>Polite Ingestion</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 3: Batch Isolation */}
          <div className="p-6 rounded-3xl bg-[#061914]/90 border border-emerald-500/30 flex flex-col justify-between hover:border-emerald-400/60 transition-all shadow-xl">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white leading-snug">
                Corrupt Record Isolation
              </h3>
              <p className="text-xs text-emerald-200/70 leading-relaxed">
                A single malformed upstream listing is safely quarantined and logged without failing the rest of the 50-job batch.
              </p>
            </div>
            <div className="pt-4 border-t border-emerald-500/20 mt-4 flex items-center justify-between text-xs font-bold text-purple-400">
              <span>Zero-Blast Radius</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 4: Health Scoring */}
          <div className="p-6 rounded-3xl bg-[#061914]/90 border border-emerald-500/30 flex flex-col justify-between hover:border-emerald-400/60 transition-all shadow-xl">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white leading-snug">
                Moving Average Latency
              </h3>
              <p className="text-xs text-emerald-200/70 leading-relaxed">
                Continuous telemetry calculates health scores (0-100) based on success ratios and moving average response times.
              </p>
            </div>
            <div className="pt-4 border-t border-emerald-500/20 mt-4 flex items-center justify-between text-xs font-bold text-orange-400">
              <span>Live Observability</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Central Live System Health & Telemetry Studio */}
        <div className="pt-6">
          <SystemHealth
            systemHealth={systemHealth}
            onRefresh={onRefresh}
            onOpenDriftDiagnosis={onOpenDriftDiagnosis}
          />
        </div>
      </div>
    </section>
  );
};
