import React from 'react';
import { SentinelSketchLogo } from './SentinelSketchLogo';

interface MetaMaskFooterFullProps {
  onNavigate: (tab: 'home' | 'telemetry' | 'lab' | 'education' | 'docs') => void;
}

export const MetaMaskFooterFull: React.FC<MetaMaskFooterFullProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-black text-white border-t border-white/10 py-6 px-4 sm:px-8 select-none">
      <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-y-4 gap-x-6 text-[12px] sm:text-[13px] tracking-wider uppercase font-medium">
        {/* Left: Brand with White Outline Sketch Mascot */}
        <div 
          onClick={() => {
            onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <SentinelSketchLogo size={28} />
          <span className="font-extrabold text-white tracking-tight text-base normal-case">
            Sentinel
          </span>
        </div>

        {/* Center / Right: Horizontal Links matching reference */}
        <div className="flex flex-wrap items-center gap-x-6 sm:gap-x-8 gap-y-2 text-white/70">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Multi-Source Ingestion
          </button>
          
          <button
            onClick={() => onNavigate('telemetry')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Telemetry Matrix
          </button>

          <button
            onClick={() => onNavigate('lab')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Chaos Lab
          </button>

          <button
            onClick={() => onNavigate('docs')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Architecture
          </button>

          <button
            onClick={() => onNavigate('education')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Privacy & Ethics
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
    </footer>
  );
};
