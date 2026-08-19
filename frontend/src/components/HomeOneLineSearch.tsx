import React, { useState } from 'react';
import { Search, ArrowRight, Activity, ShieldCheck, Zap } from 'lucide-react';
import { IngestionResponse } from '../types';
import { SourceCycleLoader } from './SourceCycleLoader';

interface HomeOneLineSearchProps {
  onSearch: (query: string, location: string, company: string, preferredSource: string) => Promise<void>;
  loading: boolean;
  ingestionData: IngestionResponse | null;
  onOpenDashboard: () => void;
}

export const HomeOneLineSearch: React.FC<HomeOneLineSearchProps> = ({
  onSearch,
  loading,
  ingestionData,
  onOpenDashboard,
}) => {
  const [query, setQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, '', '', '');
  };

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-[#031c19] text-white select-none border-t border-emerald-500/15">
      <div className="max-w-4xl mx-auto space-y-6 text-center">
        {/* Sleek One-Line Search Capsule */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex items-center justify-between p-2 rounded-full border border-white/15 shadow-2xl transition-all duration-300 focus-within:border-emerald-400/50"
          style={{
            background: 'linear-gradient(135deg, rgba(14, 38, 33, 0.9), rgba(8, 24, 21, 0.95))',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="flex items-center gap-3 pl-4 sm:pl-6 flex-1">
            <Search className="w-5 h-5 text-emerald-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search live engineering opportunities (e.g. Python, React, Remote)..."
              className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-white/40 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mm-pill-white text-xs sm:text-sm font-bold uppercase tracking-wider px-6 sm:px-8 py-3 shrink-0 flex items-center gap-2 cursor-pointer hover:scale-105 transition-all"
          >
            {loading ? 'Ingesting...' : 'Search'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Loading State Animation */}
        {loading && (
          <div className="py-6">
            <SourceCycleLoader />
          </div>
        )}

        {/* One-Line Live Result Summary Banner */}
        {!loading && ingestionData && (
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10 text-xs sm:text-sm text-white/80 animate-fadeIn">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Zap className="w-4 h-4" />
                {ingestionData.total_count} Jobs Ingested
              </span>
              <span className="text-white/30">•</span>
              <span className="text-white/70">
                Source: <strong className="text-white uppercase font-mono text-xs">{ingestionData.source_used}</strong>
              </span>
              <span className="text-white/30">•</span>
              <span className="text-white/70">
                Latency: <strong className="text-white font-mono text-xs">{Math.round(ingestionData.latency_ms)}ms</strong>
              </span>
            </div>

            <button
              onClick={onOpenDashboard}
              className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-300 hover:text-emerald-200 cursor-pointer transition-colors"
            >
              Open Live Dashboard <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Minimal Sub-line */}
        <p className="text-xs text-white/40 font-mono tracking-wide">
          Resilient real-time ingestion via RemoteOK API, WeWorkRemotely RSS, and Synthetic Sandbox.
        </p>
      </div>
    </section>
  );
};
