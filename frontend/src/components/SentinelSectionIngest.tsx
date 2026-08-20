import React from 'react';
import { IngestionResponse, Job } from '../types';
import { JobSearch } from './JobSearch';

interface SentinelSectionIngestProps {
  onSearch: (query: string, location: string, company: string, preferredSource: string) => Promise<void>;
  loading: boolean;
  ingestionData: IngestionResponse | null;
  onSelectJob: (job: Job) => void;
  loadingOverlay?: React.ReactNode;
}

export const SentinelSectionIngest: React.FC<SentinelSectionIngestProps> = ({
  onSearch,
  loading,
  ingestionData,
  onSelectJob,
  loadingOverlay,
}) => {
  return (
    <section className="relative w-full py-16 px-4 sm:px-6 lg:px-8 bg-[#0b2820] text-emerald-100 border-t border-emerald-500/20">
      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        {/* Loading overlay */}
        {loadingOverlay && (
          <div>{loadingOverlay}</div>
        )}

        {/* Job search and results */}
        <div className={loadingOverlay ? 'opacity-30 pointer-events-none' : ''}>
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
