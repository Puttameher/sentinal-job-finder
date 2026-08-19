import React from 'react';
import { ArrowUpRight, Database, Layers, RefreshCw, Zap, TrendingUp, Search, ExternalLink } from 'lucide-react';
import { IngestionResponse, Job } from '../types';
import { JobSearch } from './JobSearch';

interface MetaMaskSectionIngestProps {
  onSearch: (query: string, location: string, company: string, preferredSource: string) => Promise<void>;
  loading: boolean;
  ingestionData: IngestionResponse | null;
  onSelectJob: (job: Job) => void;
  loadingOverlay?: React.ReactNode;
}

export const MetaMaskSectionIngest: React.FC<MetaMaskSectionIngestProps> = ({
  onSearch,
  loading,
  ingestionData,
  onSelectJob,
  loadingOverlay,
}) => {
  return (
    <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-[#0b2820] text-emerald-100 overflow-hidden border-t border-emerald-500/20">
      {/* Background Lighting */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Massive Block Headline (MetaMask Style: "TRADE ANYTHING") */}
        <div className="text-center space-y-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            Section 01 • Multi-Source Pipeline
          </span>
          <h2 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-[#c8f5d0] font-sans uppercase leading-none">
            INGEST ANYTHING
          </h2>
          <p className="text-sm sm:text-base text-emerald-200/80 max-w-xl mx-auto">
            From structured REST APIs to public RSS XML streams and synthetic sandbox sources. One unified normalized pipeline.
          </p>
        </div>

        {/* 4 Surrounding Feature Matrix Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 (Dark Teal) */}
          <div className="p-6 rounded-3xl bg-[#08201a]/90 border border-emerald-500/30 flex flex-col justify-between hover:border-emerald-400/60 transition-all shadow-xl">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white leading-snug">
                Public REST API Connector
              </h3>
              <p className="text-xs text-emerald-200/70 leading-relaxed">
                Connects to RemoteOK public endpoints with polite User-Agent headers, minimum request intervals, and sub-300ms latency.
              </p>
            </div>
            <div className="pt-4 border-t border-emerald-500/20 mt-4 flex items-center justify-between text-xs font-bold text-emerald-400">
              <span>JSON Protocol</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 2 (Light Green/Teal) */}
          <div className="p-6 rounded-3xl bg-[#08201a]/90 border border-emerald-500/30 flex flex-col justify-between hover:border-emerald-400/60 transition-all shadow-xl">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white leading-snug">
                XML / RSS Feed Stream
              </h3>
              <p className="text-xs text-emerald-200/70 leading-relaxed">
                Safe XML parsing via defusedxml for WeWorkRemotely feeds, converting raw channel items into canonical entities.
              </p>
            </div>
            <div className="pt-4 border-t border-emerald-500/20 mt-4 flex items-center justify-between text-xs font-bold text-teal-400">
              <span>XML/RSS Stream</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 3 (Purple/Teal) */}
          <div className="p-6 rounded-3xl bg-[#08201a]/90 border border-emerald-500/30 flex flex-col justify-between hover:border-emerald-400/60 transition-all shadow-xl">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white leading-snug">
                Pydantic Schema Normalizer
              </h3>
              <p className="text-xs text-emerald-200/70 leading-relaxed">
                Strict invariant validation guaranteeing clean titles, non-empty companies, valid HTTPS links, and ISO dates.
              </p>
            </div>
            <div className="pt-4 border-t border-emerald-500/20 mt-4 flex items-center justify-between text-xs font-bold text-purple-400">
              <span>Typed Invariants</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>

          {/* Card 4 (Peach/Teal) */}
          <div className="p-6 rounded-3xl bg-[#08201a]/90 border border-emerald-500/30 flex flex-col justify-between hover:border-emerald-400/60 transition-all shadow-xl">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white leading-snug">
                Zero-Downtime Fallback Tier
              </h3>
              <p className="text-xs text-emerald-200/70 leading-relaxed">
                If the primary source trips, traffic seamlessly diverts to secondary fallbacks without failing the search request.
              </p>
            </div>
            <div className="pt-4 border-t border-emerald-500/20 mt-4 flex items-center justify-between text-xs font-bold text-orange-400">
              <span>Automatic Failover</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Source Cycle Loading Animation */}
        {loadingOverlay && (
          <div className="pt-6">
            {loadingOverlay}
          </div>
        )}

        {/* Central Interactive Showcase (Live Job Opportunities Console) */}
        <div className={`pt-6 ${loadingOverlay ? 'opacity-40 pointer-events-none' : ''}`}>
          <JobSearch
            onSearch={onSearch}
            loading={loading}
            ingestionData={ingestionData}
            onSelectJob={onSelectJob}
          />
        </div>
      </div>
    </section>
  );
};
