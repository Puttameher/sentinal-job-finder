import React from 'react';
import { ExternalLink, MapPin, Building, Calendar, DollarSign } from 'lucide-react';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
  onSelect: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onSelect }) => {
  const getSourceBadge = () => {
    if (job.source.includes('remoteok')) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#0d2a23] text-teal-300 border border-[#1b5245]">
          API: RemoteOK
        </span>
      );
    } else if (job.source.includes('rss') || job.source.includes('weworkremotely')) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#251c3d] text-indigo-300 border border-[#443370]">
          RSS: WeWorkRemotely
        </span>
      );
    } else {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#341922] text-rose-300 border border-[#5e2736]">
          Sandbox
        </span>
      );
    }
  };

  const formattedDate = job.posted_at
    ? new Date(job.posted_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : 'Recently';

  const formatSalary = () => {
    if (!job.salary_min && !job.salary_max) return null;
    if (job.salary_min && job.salary_max) {
      return `$${Math.round(job.salary_min / 1000)}k – $${Math.round(job.salary_max / 1000)}k`;
    }
    return `$${Math.round((job.salary_min || job.salary_max || 0) / 1000)}k+`;
  };

  return (
    <div className="group relative rounded-3xl p-6 mm-card-teal flex flex-col justify-between shadow-lg text-left">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-extrabold text-white group-hover:text-[#c8f5d0] transition-colors line-clamp-1">
              {job.title}
            </h3>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-[#a3d9cb]">
              <span className="flex items-center gap-1 font-bold text-white">
                <Building className="w-3.5 h-3.5 text-[#e2761b]" />
                {job.company}
              </span>
              <span className="text-[#3b7363]">•</span>
              <span className="flex items-center gap-1 text-[#a3d9cb]">
                <MapPin className="w-3.5 h-3.5 text-[#5c9185]" />
                {job.location}
              </span>
            </div>
          </div>
          {getSourceBadge()}
        </div>

        {/* Short Summary Description */}
        {job.description && (
          <p className="text-xs text-[#a3d9cb]/80 line-clamp-2 mt-2 leading-relaxed font-normal">
            {job.description}
          </p>
        )}

        {/* Tags */}
        {job.tags && job.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {job.tags.slice(0, 5).map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#08201a] text-[#c8f5d0] border border-[#1b4337]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="mt-6 pt-4 border-t border-[#1b4337] flex items-center justify-between text-xs">
        <div className="flex items-center gap-3 text-[#74ab9f]">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#5c9185]" />
            {formattedDate}
          </span>
          {formatSalary() && (
            <span className="flex items-center gap-0.5 font-extrabold text-emerald-400 font-mono">
              <DollarSign className="w-3.5 h-3.5" />
              {formatSalary()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelect(job)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white hover:bg-[#1b4337] bg-[#08201a] border border-[#1b4337] transition-colors cursor-pointer"
          >
            Inspect
          </button>
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider mm-btn-orange transition-all cursor-pointer shadow-md"
          >
            Apply <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
