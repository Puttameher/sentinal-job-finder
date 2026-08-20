import React from 'react';
import { X, ExternalLink, MapPin, Building, Calendar, Database, ShieldCheck, ChevronRight } from 'lucide-react';
import { Job } from '../types';

interface JobDetailModalProps {
  job: Job | null;
  onClose: () => void;
  onDiscoverMore?: () => void; // navigates to landing page search section
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, onClose, onDiscoverMore }) => {
  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto mm-glass-glow-orange rounded-3xl p-7 sm:p-9 border border-orange-500/30">

        {/* Top breadcrumb — "Discover Opportunities" redirect */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => { onClose(); onDiscoverMore?.(); }}
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer group"
          >
            <span className="opacity-60 group-hover:opacity-100 transition-opacity">←</span>
            Discover Opportunities
            <ChevronRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white bg-gray-900/80 hover:bg-gray-800 border border-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Source + ID badges */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-orange-500/10 text-orange-400 border border-orange-500/30">
            Source: {job.source}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-gray-900 text-gray-300 border border-white/5">
            ID: {job.external_id}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">{job.title}</h2>

        {/* Company / Location / Date */}
        <div className="flex flex-wrap items-center gap-4 mt-3.5 text-sm text-gray-300">
          <span className="flex items-center gap-1.5 font-bold text-orange-400">
            <Building className="w-4 h-4" />
            {job.company}
          </span>
          <span className="flex items-center gap-1.5 text-gray-400">
            <MapPin className="w-4 h-4 text-gray-500" />
            {job.location}
          </span>
          {job.posted_at && (
            <span className="flex items-center gap-1.5 text-gray-400">
              <Calendar className="w-4 h-4 text-gray-500" />
              {new Date(job.posted_at).toLocaleDateString(undefined, {
                month: 'long', day: 'numeric', year: 'numeric'
              })}
            </span>
          )}
        </div>

        {/* Tags */}
        {job.tags && job.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-white/10">
            {job.tags.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 rounded-lg text-xs font-semibold bg-gray-900/90 text-gray-200 border border-white/10">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Overview */}
        <div className="mt-7">
          <h4 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-2.5">
            Opportunity Overview
          </h4>
          <div className="p-5 rounded-2xl bg-gray-950/70 border border-white/10 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto font-normal">
            {job.description || 'No detailed description available in feed summary.'}
          </div>
        </div>

        {/* Pydantic Payload */}
        <div className="mt-7">
          <div className="flex items-center gap-2 mb-2.5">
            <Database className="w-4 h-4 text-orange-400" />
            <h4 className="text-xs font-mono font-bold text-orange-400 uppercase tracking-wider">
              Normalized Pydantic Payload
            </h4>
          </div>
          <pre className="p-4 rounded-2xl bg-black/80 border border-white/10 text-[11px] font-mono text-emerald-400 overflow-x-auto">
            {JSON.stringify(
              { id: job.id, source: job.source, external_id: job.external_id,
                title: job.title, company: job.company, location: job.location,
                url: job.url, salary_min: job.salary_min, salary_max: job.salary_max },
              null, 2
            )}
          </pre>
        </div>

        {/* Footer */}
        <div className="mt-7 pt-5 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Validated via Sentinel Pydantic schema
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-300 hover:text-white bg-gray-900 hover:bg-gray-800 border border-white/10 transition-colors cursor-pointer"
            >
              Close
            </button>
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold mm-btn-primary text-white transition-all cursor-pointer"
            >
              Apply on Platform <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
