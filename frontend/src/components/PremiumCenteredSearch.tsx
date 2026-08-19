import React, { useState } from 'react';
import { Search, ArrowRight, Zap, CheckCircle2, ExternalLink, MapPin, Building, Tag, ShieldCheck } from 'lucide-react';
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
  const [activeSource, setActiveSource] = useState('');

  const quickPills = ['Python', 'React', 'Rust', 'Remote', 'DevOps', 'Golang', 'Staff Engineer'];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, '', '', activeSource);
  };

  const handlePillClick = (pill: string) => {
    setQuery(pill);
    onSearch(pill, '', '', activeSource);
  };

  return (
    <section className="relative w-full min-h-[85vh] flex flex-col items-center justify-center py-24 px-4 sm:px-6 lg:px-8 bg-[#041d1a] text-white select-none overflow-hidden border-t border-white/10">
      {/* Background Liquid Radial Ambiance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center space-y-6">
        {/* 1. Main Headline (Matching Reference Structure) */}
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white font-sans">
          Discover opportunities
        </h2>

        {/* 2. Sub-Headline (Matching Reference Structure) */}
        <p className="text-sm sm:text-base md:text-lg text-white/60 font-normal max-w-2xl mx-auto -mt-1">
          Enter any tech stack, role, or company to trigger resilient multi-source ingestion.
        </p>

        {/* 3. Search Capsule (Matching Reference Structure) */}
        <div className="w-full max-w-3xl pt-2">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center justify-between p-2 sm:p-2.5 rounded-full border border-white/15 transition-all duration-300 focus-within:border-white/30 focus-within:shadow-[0_0_30px_rgba(0,242,254,0.15)] shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(12, 33, 29, 0.9) 0%, rgba(6, 18, 16, 0.96) 100%)',
              backdropFilter: 'blur(30px)',
            }}
          >
            <div className="flex items-center gap-3 pl-4 sm:pl-6 flex-1 min-w-0">
              <Search className="w-5 h-5 text-white/50 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Python, React, Stripe, Remote, Golang, Staff..."
                className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-white/35 focus:outline-none py-2 font-normal"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 sm:px-8 py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wide text-white border border-white/20 hover:border-white/40 hover:bg-white/10 transition-all cursor-pointer shrink-0 shadow-lg whitespace-nowrap"
              style={{
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 100%)',
              }}
            >
              {loading ? 'Ingesting...' : 'Ingest Roles'}
            </button>
          </form>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-white/50">
          <span className="text-[11px] uppercase font-mono tracking-wider mr-1 text-white/40">Quick Search:</span>
          {quickPills.map((pill) => (
            <button
              key={pill}
              type="button"
              onClick={() => handlePillClick(pill)}
              className="px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-white/70 hover:text-white border border-white/10 transition-all cursor-pointer text-xs"
            >
              {pill}
            </button>
          ))}
        </div>

        {/* 4. Live Loading State Animation */}
        {loading && (
          <div className="w-full py-8 animate-fadeIn">
            <SourceCycleLoader />
          </div>
        )}

        {/* 5. Ingestion Results Live Feed */}
        {!loading && ingestionData && (
          <div className="w-full space-y-6 pt-4 animate-fadeIn">
            {/* Live Telemetry Summary Banner */}
            <div
              className="w-full rounded-2xl p-4 border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-white/80"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-left">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {ingestionData.total_count} Opportunities Normalized
                </span>
                <span className="text-white/20">•</span>
                <span className="text-white/70">
                  Active Tier: <strong className="text-white uppercase font-mono text-xs">{ingestionData.source_used}</strong>
                </span>
                <span className="text-white/20">•</span>
                <span className="text-white/70">
                  Latency: <strong className="text-white font-mono text-xs">{Math.round(ingestionData.latency_ms)}ms</strong>
                </span>
                <span className="text-white/20">•</span>
                <span className="text-emerald-400/90 font-mono text-xs">
                  Validation: {(ingestionData.validation_rate * 100).toFixed(0)}%
                </span>
              </div>

              <button
                onClick={onOpenDashboard}
                className="text-xs font-bold uppercase tracking-wider text-[#bbf3e5] hover:text-white cursor-pointer transition-colors flex items-center gap-1.5"
              >
                Open Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Top 3 Direct Opportunity Cards Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              {ingestionData.jobs.slice(0, 3).map((job) => (
                <div
                  key={job.id}
                  onClick={() => onSelectJob(job)}
                  className="p-5 rounded-2xl border border-white/10 hover:border-emerald-400/40 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
                  style={{
                    background: 'linear-gradient(135deg, rgba(14, 38, 33, 0.6) 0%, rgba(8, 22, 19, 0.8) 100%)',
                    backdropFilter: 'blur(16px)',
                  }}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-white/50 font-mono">
                      <span className="px-2 py-0.5 rounded bg-white/[0.06] uppercase text-[10px] text-[#bbf3e5]">
                        {job.source}
                      </span>
                      {job.posted_at && <span>{new Date(job.posted_at).toLocaleDateString()}</span>}
                    </div>

                    <h4 className="text-base font-bold text-white group-hover:text-[#bbf3e5] transition-colors line-clamp-2">
                      {job.title}
                    </h4>

                    <div className="flex items-center gap-3 text-xs text-white/60">
                      <span className="flex items-center gap-1">
                        <Building className="w-3 h-3 text-white/40" /> {job.company}
                      </span>
                      {job.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-white/40" /> {job.location}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-bold">
                      {job.salary_min ? `$${job.salary_min.toLocaleString()}` : 'Competitive'}
                    </span>
                    <span className="text-[#bbf3e5] group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-semibold text-[11px] uppercase">
                      Inspect <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
