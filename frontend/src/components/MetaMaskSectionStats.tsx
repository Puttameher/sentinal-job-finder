import React from 'react';
import { Star, ShieldCheck, Zap, Layers, Cpu, Server } from 'lucide-react';

export const MetaMaskSectionStats: React.FC = () => {
  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-[#030712] text-gray-100 border-t border-white/5">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2 mb-8">
          <span className="text-xs font-mono font-bold uppercase text-gray-500 tracking-wider">
            Verified Resilience Benchmarks
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white font-sans">
            Trusted, Tested & Production-Verified
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Dark Green */}
          <div className="p-6 rounded-3xl bg-[#061a14] border border-emerald-500/30 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center gap-1 text-emerald-400 font-bold text-lg mb-2">
                <Star className="w-5 h-5 fill-emerald-400 text-emerald-400" />
                <span>100% Validated</span>
              </div>
              <p className="text-xs text-emerald-200/70 leading-relaxed">
                Zero corrupt records bypass our typed Pydantic validator. Invalid records are cleanly isolated.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-emerald-500/20 text-[11px] font-mono text-emerald-400 font-bold">
              PYDANTIC STRICT V2
            </div>
          </div>

          {/* Card 2: Light Blue */}
          <div className="p-6 rounded-3xl bg-[#0a192f] border border-sky-500/30 flex flex-col justify-between shadow-xl">
            <div>
              <div className="text-sky-400 font-black text-2xl mb-1 font-mono">
                17 / 17 Passed
              </div>
              <h4 className="text-sm font-bold text-white mb-2">Automated Pytest Suite</h4>
              <p className="text-xs text-sky-200/70 leading-relaxed">
                Unit & integration tests covering circuit transitions, jittered backoff, and AI drift suggestions.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-sky-500/20 text-[11px] font-mono text-sky-400 font-bold">
              1.17s TEST RUNTIME
            </div>
          </div>

          {/* Card 3: Lime Green */}
          <div className="p-6 rounded-3xl bg-[#112410] border border-lime-500/30 flex flex-col justify-between shadow-xl">
            <div>
              <div className="text-lime-400 font-black text-2xl mb-1 font-mono">
                &lt;250ms
              </div>
              <h4 className="text-sm font-bold text-white mb-2">Median Latency</h4>
              <p className="text-xs text-lime-200/70 leading-relaxed">
                Direct structured REST and RSS streaming without the multi-second overhead of headless browsers.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-lime-500/20 text-[11px] font-mono text-lime-400 font-bold">
              HIGH THROUGHPUT
            </div>
          </div>

          {/* Card 4: Purple */}
          <div className="p-6 rounded-3xl bg-[#180e2b] border border-purple-500/30 flex flex-col justify-between shadow-xl">
            <div>
              <div className="text-purple-400 font-black text-2xl mb-1 font-mono">
                Zero Downtime
              </div>
              <h4 className="text-sm font-bold text-white mb-2">3-State Circuit Breakers</h4>
              <p className="text-xs text-purple-200/70 leading-relaxed">
                Immediate failover to secondary tiers upon primary source degradation, ensuring uninterrupted search.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-purple-500/20 text-[11px] font-mono text-purple-400 font-bold">
              AUTOMATIC CANARY PROBE
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
