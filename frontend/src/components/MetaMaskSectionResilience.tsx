import React from 'react';
import { Activity, ArrowUpRight, Cpu, ShieldCheck, Zap, AlertTriangle, RefreshCw } from 'lucide-react';
import { SystemHealthResponse } from '../types';
import { SystemHealth } from './SystemHealth';

interface MetaMaskSectionResilienceProps {
  systemHealth: SystemHealthResponse | null;
  onRefresh: () => void;
  onOpenDriftDiagnosis: (sourceName: string) => void;
}

export const MetaMaskSectionResilience: React.FC<MetaMaskSectionResilienceProps> = ({
  systemHealth,
  onRefresh,
  onOpenDriftDiagnosis,
}) => {
  return (
    <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-[#18112c] text-purple-100 overflow-hidden border-t border-purple-500/20">
      {/* Background Lighting */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Massive Block Headline (MetaMask Style: "TURN YOUR MONEY ON") */}
        <div className="text-center space-y-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40">
            Section 02 • System Telemetry & Circuit Matrix
          </span>
          <h2 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight text-[#e4d4ff] font-sans uppercase leading-none">
            TURN YOUR RESILIENCE ON
          </h2>
          <p className="text-sm sm:text-base text-purple-200/80 max-w-xl mx-auto">
            Continuous health telemetry, jittered exponential backoff, and 3-state circuit breakers preventing cascade outages.
          </p>
        </div>

        {/* 4 Surrounding Feature Matrix Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-[#110a24]/90 border border-purple-500/30 flex flex-col justify-between hover:border-purple-400/60 transition-all shadow-xl">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white leading-snug">
                3-State Circuit Breaker
              </h3>
              <p className="text-xs text-purple-200/70 leading-relaxed">
                Tracks consecutive failures. Trips from CLOSED $\to$ OPEN after 3 errors, probing recovery with canary requests in HALF_OPEN.
              </p>
            </div>
            <div className="pt-4 border-t border-purple-500/20 mt-4 flex items-center justify-between text-xs font-bold text-purple-400">
              <span>Failover State Machine</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-[#110a24]/90 border border-purple-500/30 flex flex-col justify-between hover:border-purple-400/60 transition-all shadow-xl">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white leading-snug">
                Jittered Request Pacer
              </h3>
              <p className="text-xs text-purple-200/70 leading-relaxed">
                Enforces polite delays (0.3s) and Gaussian randomized jitter, destroying mathematical periodicity detectable by WAFs.
              </p>
            </div>
            <div className="pt-4 border-t border-purple-500/20 mt-4 flex items-center justify-between text-xs font-bold text-indigo-400">
              <span>Anti-Periodicity</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-[#110a24]/90 border border-purple-500/30 flex flex-col justify-between hover:border-purple-400/60 transition-all shadow-xl">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white leading-snug">
                Batch Record Isolation
              </h3>
              <p className="text-xs text-purple-200/70 leading-relaxed">
                Malformed records or broken links are safely isolated into telemetry error logs without corrupting the batch.
              </p>
            </div>
            <div className="pt-4 border-t border-purple-500/20 mt-4 flex items-center justify-between text-xs font-bold text-cyan-400">
              <span>Fault Isolation</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-3xl bg-[#110a24]/90 border border-purple-500/30 flex flex-col justify-between hover:border-purple-400/60 transition-all shadow-xl">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white leading-snug">
                Continuous Health Scoring
              </h3>
              <p className="text-xs text-purple-200/70 leading-relaxed">
                Explainable mathematical score evaluating failure %, latency EMA, validation success %, and recovery state.
              </p>
            </div>
            <div className="pt-4 border-t border-purple-500/20 mt-4 flex items-center justify-between text-xs font-bold text-emerald-400">
              <span>Telemetry Score</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Central Telemetry Console */}
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
