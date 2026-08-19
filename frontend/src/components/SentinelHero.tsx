import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { SentinelMask3D } from './SentinelMask3D';
import { SentinelSketchLogo } from './SentinelSketchLogo';

interface SentinelHeroProps {
  onGetStarted: () => void;
  onExploreDemo: () => void;
  onOpenMenu?: () => void;
}

export const SentinelHero: React.FC<SentinelHeroProps> = ({
  onGetStarted,
  onExploreDemo,
  onOpenMenu,
}) => {
  const [showUpdate, setShowUpdate] = useState(true);

  return (
    <section className="relative w-full min-h-[96vh] flex flex-col justify-between bg-[#052824] px-6 sm:px-10 pt-6 pb-8 overflow-hidden select-none">
      {/* Top Navbar */}
      <div className="w-full flex items-center justify-between z-30">
        {/* Top-Left Logo — White Outline Sketch Mask Only */}
        <div className="cursor-pointer" onClick={onGetStarted}>
          <SentinelSketchLogo size={80} />
        </div>

        {/* Top-Right Nav Elements */}
        <div className="flex items-center gap-3">
          <button
            onClick={onGetStarted}
            className="sentinel-pill-black uppercase cursor-pointer"
          >
            GET SENTINEL
          </button>
          <button
            onClick={onOpenMenu}
            className="w-10 h-10 rounded-full bg-[#0c0d0e] hover:bg-[#1a1c1e] text-white flex items-center justify-center font-bold text-sm cursor-pointer transition-colors shadow-lg"
          >
            ⊜
          </button>
        </div>
      </div>

      {/* Center Hero Stage (Typography + Overlapping Mascot + DIG IN Button Below) */}
      <div className="relative my-auto flex flex-col items-center justify-center z-10 w-full">
        {/* Giant Display Typography */}
        <div className="relative text-center flex flex-col items-center justify-center pointer-events-none select-none z-10 w-full max-w-6xl mx-auto">
          <h1 className="font-sentinel-headline text-[13.5vw] sm:text-[11.5vw] lg:text-[10vw] text-[#bbf3e5] uppercase leading-[0.84] tracking-tight drop-shadow-sm">
            WHERE <br />
            YOUR JOBS <br />
            LIVES
          </h1>
        </div>

        {/* 3D Compact Sentinel Mask (Overlapping/Cutting the last word "LIVES" by ~20%) */}
        <div className="relative -mt-10 sm:-mt-14 lg:-mt-16 z-20 w-48 sm:w-56 h-36 sm:h-44 flex items-center justify-center">
          <SentinelMask3D height="160px" />
        </div>

        {/* Action Button: DIG IN (Positioned Below the Mascot Character) */}
        <div className="z-30 mt-4 sm:mt-6">
          <button
            onClick={onGetStarted}
            className="sentinel-pill-white uppercase cursor-pointer shadow-2xl hover:scale-105 transition-all text-xs sm:text-sm font-black px-8 py-3.5 flex items-center gap-2"
          >
            DIG IN <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Floating Update Pill */}
      {showUpdate && (
        <div className="relative sm:absolute bottom-4 left-2 sm:left-6 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white text-[#121214] text-xs font-medium shadow-2xl animate-fadeIn self-start">
          <span className="font-extrabold text-[11px] uppercase tracking-wider text-black">
            UPDATE
          </span>
          <span className="text-[11px] text-gray-700 font-normal">
            Live ingestion active across RemoteOK & WWR...
          </span>
          <button
            onClick={() => setShowUpdate(false)}
            className="text-gray-400 hover:text-black ml-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </section>
  );
};
