import React from 'react';
import { ArrowRight } from 'lucide-react';

interface MetaMaskSectionCTAProps {
  onExploreJobs: () => void;
  onOpenDocs: () => void;
}

export const MetaMaskSectionCTA: React.FC<MetaMaskSectionCTAProps> = ({
  onExploreJobs,
  onOpenDocs,
}) => {
  return (
    <section className="relative w-full py-24 px-4 sm:px-6 lg:px-8 bg-[#132247] text-center overflow-hidden border-t border-[#1f356b]">
      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        <h2 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white font-sans uppercase leading-none">
          GET STARTED
        </h2>
        <p className="text-base sm:text-lg text-[#a9bde6] max-w-xl mx-auto leading-relaxed">
          Experience resilient, self-healing job data ingestion. Explore live listings or inspect architectural trade-offs.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={onExploreJobs}
            className="px-10 py-4 rounded-full font-black text-sm tracking-wider uppercase mm-btn-white shadow-2xl cursor-pointer"
          >
            START INGESTION →
          </button>
          <button
            onClick={onOpenDocs}
            className="px-8 py-4 rounded-full font-bold text-xs sm:text-sm tracking-wider uppercase bg-[#1f356b] hover:bg-[#28458a] text-white border border-[#325299] transition-all cursor-pointer"
          >
            READ DECISIONS.MD
          </button>
        </div>
      </div>
    </section>
  );
};
