import React from 'react';
import { Lock, ArrowUpRight, ShieldAlert, Sparkles, Terminal, CheckCircle2, Shield } from 'lucide-react';
import { DemoControlPanel } from './DemoControlPanel';

interface MetaMaskSectionSecurityProps {
  onSimulate: (action: string, targetSource: string) => Promise<void>;
  onOpenDriftDiagnosis: (sourceName: string) => void;
  onRefreshSearch: () => void;
}

export const MetaMaskSectionSecurity: React.FC<MetaMaskSectionSecurityProps> = ({
  onSimulate,
  onOpenDriftDiagnosis,
  onRefreshSearch,
}) => {
  return (
    <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-[#241318] text-rose-100 overflow-hidden border-t border-rose-500/20">
      {/* Background Lighting */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-rose-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Massive Block Headline (MetaMask Style: "MAXIMUM SECURITY") */}
        <div className="text-center space-y-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40">
            Section 03 • Security & Ethical Boundary
          </span>
          <h2 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight text-[#ffd4df] font-sans uppercase leading-none">
            MAXIMUM SECURITY
          </h2>
          <p className="text-sm sm:text-base text-rose-200/80 max-w-xl mx-auto">
            Ethical data ingestion with explicit stopping boundaries. Demonstrating resilience without bypassing access controls.
          </p>
        </div>

        {/* 4 Surrounding Feature Matrix Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-[#1c0d12]/90 border border-rose-500/30 flex flex-col justify-between hover:border-rose-400/60 transition-all shadow-xl">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white leading-snug">
                Strict Stopping Boundary
              </h3>
              <p className="text-xs text-rose-200/70 leading-relaxed">
                No CAPTCHA solving, no credential stuffing, no anti-bot circumvention, and no authenticated scraping. Strictly low-risk public data.
              </p>
            </div>
            <div className="pt-4 border-t border-rose-500/20 mt-4 flex items-center justify-between text-xs font-bold text-rose-400">
              <span>Ethical Compliance</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-[#1c0d12]/90 border border-rose-500/30 flex flex-col justify-between hover:border-rose-400/60 transition-all shadow-xl">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white leading-snug">
                Detection Surface Parity
              </h3>
              <p className="text-xs text-rose-200/70 leading-relaxed">
                Awareness of TLS JA3/JA4 fingerprints, HTTP/2 frame signatures, User-Agent client hints, and ASN reputation.
              </p>
            </div>
            <div className="pt-4 border-t border-rose-500/20 mt-4 flex items-center justify-between text-xs font-bold text-amber-400">
              <span>WAF Fingerprints</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-[#1c0d12]/90 border border-rose-500/30 flex flex-col justify-between hover:border-rose-400/60 transition-all shadow-xl">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white leading-snug">
                AI Schema Drift Radar
              </h3>
              <p className="text-xs text-rose-200/70 leading-relaxed">
                Advisory AI diagnostic assistant that proposes confidence-scored field migrations without ever mutating production code autonomously.
              </p>
            </div>
            <div className="pt-4 border-t border-rose-500/20 mt-4 flex items-center justify-between text-xs font-bold text-purple-400">
              <span>Advisory AI Engine</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-3xl bg-[#1c0d12]/90 border border-rose-500/30 flex flex-col justify-between hover:border-rose-400/60 transition-all shadow-xl">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white leading-snug">
                Interactive Chaos Bench
              </h3>
              <p className="text-xs text-rose-200/70 leading-relaxed">
                Controlled sandbox source with stateful switches (HTTP 500, 429 rate limit, schema drift) for live interview demonstration.
              </p>
            </div>
            <div className="pt-4 border-t border-rose-500/20 mt-4 flex items-center justify-between text-xs font-bold text-emerald-400">
              <span>Live Fault Injection</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Central Chaos Demo Bench */}
        <div className="pt-6">
          <DemoControlPanel
            onSimulate={onSimulate}
            onOpenDriftDiagnosis={onOpenDriftDiagnosis}
            onRefreshSearch={onRefreshSearch}
          />
        </div>
      </div>
    </section>
  );
};
