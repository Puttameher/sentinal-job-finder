import React from 'react';
import { SentinelSketchLogo } from './SentinelSketchLogo';

interface SentinelClosingPageProps {
  onNavigate: (tab: 'home' | 'liveflow') => void;
}

export const SentinelClosingPage: React.FC<SentinelClosingPageProps> = ({ onNavigate }) => {
  return (
    <section className="relative w-full min-h-screen bg-black text-white flex flex-col justify-between px-6 sm:px-12 py-8 select-none border-t border-white/10">
      {/* Top Header & Architecture Badges (Matching Screenshot Top) */}
      <div className="w-full flex flex-col md:flex-row md:items-start justify-between gap-6 z-10">
        {/* Top-Left: Tech Stack Credits */}
        <div className="text-left space-y-1">
          <h3 className="font-bold text-sm sm:text-base text-white tracking-tight">
            Built with FastAPI • Python • Pydantic • Three.js
          </h3>
          <p className="text-xs text-white/50 font-normal tracking-normal">
            Resilient Ingestion via Circuit Breakers • Jittered Backoff • AI Schema Drift Radar
          </p>
        </div>

        {/* Top-Right: Horizontal Agent / Module List */}
        <div className="flex flex-wrap items-center gap-x-6 sm:gap-x-8 gap-y-2 text-xs font-medium text-white/70 tracking-wide">
          <button onClick={() => onNavigate('liveflow')} className="hover:text-white transition-colors cursor-pointer">
            Live Connector
          </button>
          <button onClick={() => onNavigate('liveflow')} className="hover:text-white transition-colors cursor-pointer">
            Circuit Breaker
          </button>
          <button onClick={() => onNavigate('liveflow')} className="hover:text-white transition-colors cursor-pointer">
            Telemetry Matrix
          </button>
          <button onClick={() => onNavigate('liveflow')} className="hover:text-white transition-colors cursor-pointer">
            Normalized Schema
          </button>
        </div>
      </div>

      {/* Center: Massive Display Wordmark + White Outline Character */}
      <div className="relative my-auto flex flex-col items-center justify-center text-center z-10 py-12">
        {/* White Outline Character Mascot */}
        <div className="mb-4 sm:mb-6 animate-pulse opacity-95">
          <SentinelSketchLogo size={120} />
        </div>

        {/* Giant Monolithic Headline */}
        <h1 className="text-7xl sm:text-9xl md:text-[12vw] lg:text-[13vw] font-black tracking-tighter text-white uppercase leading-none font-sans">
          Sentinel
        </h1>
      </div>

      {/* Bottom Bar: Pinned Horizontal Footer */}
      <div className="w-full pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-y-4 gap-x-6 text-[11px] sm:text-xs tracking-wider uppercase font-semibold text-white/70 z-10">
        {/* Left: Brand with White Outline Sketch Mascot */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <SentinelSketchLogo size={26} />
          <span className="font-black text-white tracking-tight text-sm sm:text-base normal-case">
            Sentinel
          </span>
        </div>

        {/* Horizontal Navigation Links */}
        <div className="flex flex-wrap items-center gap-x-6 sm:gap-x-8 gap-y-2">
          <button
            onClick={() => onNavigate('liveflow')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Multi-Source Ingestion
          </button>

          <button
            onClick={() => onNavigate('liveflow')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Telemetry Matrix
          </button>

          <a
            href="mailto:meherpra5@gmail.com"
            className="hover:text-white transition-colors normal-case"
          >
            meherpra5@gmail.com
          </a>

          <a
            href="tel:+916304276594"
            className="hover:text-white transition-colors"
          >
            +91-6304276594
          </a>

          <span className="text-white/40">
            © 2026
          </span>
        </div>
      </div>
    </section>
  );
};
