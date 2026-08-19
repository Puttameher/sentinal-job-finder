import React, { useState } from 'react';
import { Search, MapPin, Building, RefreshCw, AlertTriangle, ShieldCheck, Layers, ArrowRight } from 'lucide-react';
import { IngestionResponse, Job } from '../types';
import { JobCard } from './JobCard';

interface JobSearchProps {
  onSearch: (query: string, location: string, company: string, preferredSource: string) => Promise<void>;
  loading: boolean;
  ingestionData: IngestionResponse | null;
  onSelectJob: (job: Job) => void;
}

export const JobSearch: React.FC<JobSearchProps> = ({
  onSearch,
  loading,
  ingestionData,
  onSelectJob,
}) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('any');
  const [company, setCompany] = useState('any');
  const [preferredSource, setPreferredSource] = useState('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(
      query,
      location === 'any' ? '' : location,
      company === 'any' ? '' : company,
      preferredSource === 'all' ? '' : preferredSource
    );
  };

  const quickSkills = ['Python', 'FastAPI', 'React', 'TypeScript', 'Distributed Systems', 'Remote'];

  return (
    <div className="space-y-8">
      {/* Search Filter Card (MetaMask Style Card in Forest Green) */}
      <div className="rounded-3xl p-8 sm:p-10 bg-[#102d24] border border-[#265949] shadow-xl text-left space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1b4337] pb-4">
          <div>
            <h3 className="text-2xl font-black text-white font-sans uppercase">
              Opportunity Search & Filter Console
            </h3>
            <p className="text-xs text-[#a3d9cb] mt-0.5">
              Live normalized querying across registered APIs and XML streams.
            </p>
          </div>
          <div className="px-3 py-1 rounded-full bg-[#08201a] border border-[#1b4337] text-emerald-300 text-xs font-mono font-bold self-start">
            Pydantic Invariant Guard Active
          </div>
        </div>

        {/* Search Form Capsule */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2.5 p-1.5 rounded-2xl bg-[#08201a] border border-[#265949]">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-[#74ab9f]" />
              <input
                type="text"
                placeholder="Role, tech stack, or keywords (e.g. AI Engineer, Python)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-transparent text-sm text-white placeholder-[#5c9185] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-black text-sm uppercase tracking-wider mm-btn-orange cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Ingesting...
                </>
              ) : (
                <>
                  Search <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Filter Pills Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-medium">
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#08201a] border border-[#1b4337] text-[#c8f5d0]">
              <MapPin className="w-4 h-4 text-[#e2761b]" />
              <span className="text-[#74ab9f]">Location:</span>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent text-white outline-none w-full cursor-pointer font-semibold"
              >
                <option value="any" className="bg-[#102d24]">Any Location</option>
                <option value="remote" className="bg-[#102d24]">Remote / Worldwide</option>
                <option value="us" className="bg-[#102d24]">US / Americas</option>
                <option value="eu" className="bg-[#102d24]">Europe / UK</option>
              </select>
            </div>

            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#08201a] border border-[#1b4337] text-[#c8f5d0]">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span className="text-[#74ab9f]">Source:</span>
              <select
                value={preferredSource}
                onChange={(e) => setPreferredSource(e.target.value)}
                className="bg-transparent text-white outline-none w-full cursor-pointer font-semibold"
              >
                <option value="all" className="bg-[#102d24]">Auto Resilient Routing (All)</option>
                <option value="remoteok" className="bg-[#102d24]">RemoteOK (Live API)</option>
                <option value="weworkremotely_rss" className="bg-[#102d24]">WeWorkRemotely (RSS)</option>
                <option value="sandbox_source" className="bg-[#102d24]">Controlled Sandbox</option>
              </select>
            </div>

            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#08201a] border border-[#1b4337] text-[#c8f5d0]">
              <Building className="w-4 h-4 text-teal-300" />
              <span className="text-[#74ab9f]">Company:</span>
              <input
                type="text"
                placeholder="Any company"
                value={company === 'any' ? '' : company}
                onChange={(e) => setCompany(e.target.value || 'any')}
                className="bg-transparent text-white outline-none w-full placeholder-[#5c9185] font-semibold"
              >
              </input>
            </div>
          </div>

          {/* Quick Filter Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-[#74ab9f]">Popular:</span>
            {quickSkills.map((skill) => (
              <button
                type="button"
                key={skill}
                onClick={() => {
                  setQuery(skill);
                  onSearch(skill, location === 'any' ? '' : location, '', preferredSource === 'all' ? '' : preferredSource);
                }}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#08201a] hover:bg-[#153e32] text-[#c8f5d0] border border-[#1b4337] transition-all cursor-pointer"
              >
                #{skill}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Execution Telemetry Callout Bar */}
      {ingestionData && (
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 rounded-2xl bg-[#08201a] text-xs border border-[#1b4337] text-[#c8f5d0] shadow-md">
          <div className="flex items-center gap-3 font-medium">
            <span className="font-extrabold text-white">
              Showing {ingestionData.jobs.length} of {ingestionData.total_count} opportunities
            </span>
            <span className="text-[#3b7363]">•</span>
            <span>
              Source: <strong className="text-[#e2761b] font-mono">{ingestionData.source_used}</strong>
            </span>
            <span className="text-[#3b7363]">•</span>
            <span>
              Latency: <strong className="text-white font-mono">{ingestionData.latency_ms}ms</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              Validation: <strong className="font-mono">{ingestionData.validation_rate}%</strong>
            </span>

            {ingestionData.fallback_activated && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#3d2716] text-[#f6851b] border border-[#6b3e1a] font-bold">
                <AlertTriangle className="w-3.5 h-3.5" />
                Fallback Active
              </span>
            )}
          </div>
        </div>
      )}

      {/* Jobs Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-4 bg-[#08201a] rounded-3xl border border-[#1b4337]">
          <RefreshCw className="w-9 h-9 text-[#e2761b] animate-spin mx-auto" />
          <p className="text-base font-bold text-white font-sans">Pacing request & executing resilient pipeline...</p>
          <p className="text-xs text-[#74ab9f]">Checking circuit breakers, verifying Pydantic schema, and isolating malformed records</p>
        </div>
      ) : ingestionData && ingestionData.jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ingestionData.jobs.map((job) => (
            <JobCard key={job.id} job={job} onSelect={onSelectJob} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-3xl bg-[#08201a] border border-[#1b4337] space-y-3">
          <Search className="w-9 h-9 text-[#3b7363] mx-auto" />
          <h3 className="text-base font-bold text-white">No matching opportunities found</h3>
          <p className="text-xs text-[#74ab9f] max-w-sm mx-auto">
            Try adjusting keywords, clear filters, or reset fault simulations in Demo Lab.
          </p>
        </div>
      )}
    </div>
  );
};
