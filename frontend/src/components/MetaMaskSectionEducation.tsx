import React, { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';

interface MetaMaskSectionEducationProps {
  onOpenDocs: () => void;
}

export const MetaMaskSectionEducation: React.FC<MetaMaskSectionEducationProps> = ({ onOpenDocs }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-[#121214] border-t border-[#26262b]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
        {/* Left Column (Lavender / Purple Card): Newsletter */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#2b2046] border border-[#443370] text-[#e5d7ff] flex flex-col justify-between shadow-2xl">
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold uppercase text-[#c4b5e6] tracking-wider">
              Resilience Dispatch
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white font-sans uppercase leading-tight">
              RECEIVE SYSTEM UPDATES AND DRIFT ALERTS
            </h3>
            <p className="text-xs text-[#c4b5e6] leading-relaxed font-normal">
              Stay updated on upstream connector health, new RSS feeds, and AI schema migration patches.
            </p>

            <form onSubmit={handleSubscribe} className="pt-3 space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-2xl bg-[#1b132e] border border-[#443370] text-xs text-white placeholder-[#8774ab] outline-none focus:border-white font-semibold"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider mm-btn-white cursor-pointer"
                >
                  {subscribed ? 'SUBSCRIBED!' : 'SUBSCRIBE'}
                </button>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#c4b5e6]/80">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero spam. Only critical architecture & telemetry updates.</span>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column (Steel Blue Card): Educational Lesson Portal */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#172d42] border border-[#274869] text-[#c4dcf2] flex flex-col justify-between shadow-2xl">
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold uppercase text-[#9ac3e8] tracking-wider">
              Educational Breakdown
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white font-sans uppercase leading-tight">
              NEW TO RESILIENT INGESTION?
            </h3>
            <p className="text-xs text-[#9ac3e8] leading-relaxed font-normal">
              Learn how Sentinel replaces brittle browser scraping with structured API connectors, jittered backoff, and 3-state circuit breakers.
            </p>
          </div>

          <div className="pt-6">
            <button
              onClick={onOpenDocs}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider mm-btn-white transition-all cursor-pointer shadow-lg"
            >
              START ARCHITECTURE LESSON <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
