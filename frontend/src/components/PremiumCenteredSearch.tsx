import React, { useState } from 'react';
import { Search, ArrowRight, Zap, Shield, Sparkles, Filter, Database, CheckCircle2 } from 'lucide-react';
import { IngestionResponse, Job } from '../types';
import { SourceCycleLoader } from './SourceCycleLoader';

interface PremiumCenteredSearchProps {
  onSearch: (query: string, location: string, company: string, preferredSource: string) => Promise<void>;
  loading: boolean;
  ingestionData: IngestionResponse | null;
  onOpenDashboard: () => void;
  onSelectJob: (job: Job) => void;
}

export const PremiumCenteredSearch: React.FC<PremiumCenteredSearchProps> = ({
  onSearch,
  loading,
  ingestionData,
  onOpenDashboard,
  onSelectJob,
}) => {
  const [query, setQuery] = useState('');
  const [source, setSource] = useState('');
  const [location, setLocation] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, location, '', source);
  };

  const sources = [
    { id: '', label: 'All Protocols' },
    { id: 'remoteok', label: 'RemoteOK API' },
    { id: 'weworkremotely_rss', label: 'WWR RSS' },
    { id: 'sandbox_source', label: 'Sandbox' },
  ];

  return (
    <section className="relative w-full min-h-[70vh] flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-[#041d1a] text-white select-none overflow-hidden border-t border-white/10">
      {/* Liquid Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[200px] bg-orange-500/10 rounded-full blur-[90px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center space-y-8">
        {/* Subtle Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-xs font-mono text-[#bbf3e5]">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Resilient Multi-Source Ingestion Pipeline</span>
        </div>

        {/* Premium Liquid Glass Search Console */}
        <div
          className="w-full rounded-[28px] p-3 sm:p-4 border border-white/[0.12] shadow-2xl transition-all duration-500 hover:border-white/20"
          style={{
            background: 'linear-gradient(135deg, rgba(13, 40, 35, 0.85) 0%, rgba(6, 22, 19, 0.92) 100%)',
            backdropFilter: 'blur(36px) saturate(1.8)',
            WebkitBackdropFilter: 'blur(36px) saturate(1.8)',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
          }}
        >
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            {/* Input Bar */}
            <div className="relative flex items-center justify-between p-1.5 rounded-2xl bg-black/30 border border-white/10 focus-within:border-emerald-400/50 transition-colors">
              <div className="flex items-center gap-3 pl-4 flex-1">
                <Search className="w-5 h-5 text-emerald-400 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search opportunities (e.g. Python, React, Remote, Staff)..."
                  className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-white/40 focus:outline-none py-2.5 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mm-pill-white text-xs sm:text-sm font-extrabold uppercase tracking-wider px-6 sm:px-8 py-3.5 shrink-0 flex items-center gap-2 cursor-pointer hover:scale-105 transition-all shadow-lg"
              >
                {loading ? 'Ingesting...' : 'Search'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Pills Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-white/40 mr-1 text-[11px] font-mono uppercase">Source:</span>
                {sources.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSource(s.id)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-medium transition-all cursor-pointer ${
                      source === s.id
                        ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 shadow-sm'
                        : 'bg-white/[0.04] text-white/60 hover:text-white border border-white/5'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={onOpenDashboard}
                className="text-[11px] font-mono text-emerald-400/80 hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer ml-auto"
              >
                View Dashboard <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </form>
        </div>

        {/* Live Loading State */}
        {loading && (
          <div className="w-full py-4 animate-fadeIn">
            <SourceCycleLoader />
          </div>
        )}

        {/* Ingestion Results Summary Banner */}
        {!loading && ingestionData && (
          <div
            className="w-full rounded-2xl p-4 border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-white/80 animate-fadeIn"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {ingestionData.total_count} Opportunities Normalized
              </span>
              <span className="text-white/20">•</span>
              <span className="text-white/70">
                Source: <strong className="text-white uppercase font-mono text-xs">{ingestionData.source_used}</strong>
              </span>
              <span className="text-white/20">•</span>
              <span className="text-white/70">
                Latency: <strong className="text-white font-mono text-xs">{Math.round(ingestionData.latency_ms)}ms</strong>
              </span>
            </div>

            <button
              onClick={onOpenDashboard}
              className="text-xs font-bold uppercase tracking-wider text-emerald-300 hover:text-emerald-200 cursor-pointer transition-colors flex items-center gap-1.5"
            >
              Open Full Results ({ingestionData.jobs.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
