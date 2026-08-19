import React from 'react';
import { Shield, Activity, Search, Terminal, BookOpen } from 'lucide-react';
import { SystemHealthResponse } from '../types';

interface HeaderProps {
  activeTab: 'search' | 'health' | 'demo' | 'docs';
  setActiveTab: (tab: 'search' | 'health' | 'demo' | 'docs') => void;
  systemHealth: SystemHealthResponse | null;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, systemHealth }) => {
  const overall = systemHealth?.overall_health || 'HEALTHY';

  const getHealthPill = () => {
    if (overall === 'HEALTHY') {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#122e25] text-emerald-300 border border-[#1e5243]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-mono tracking-tight text-[11px] uppercase">PIPELINES HEALTHY</span>
        </div>
      );
    } else if (overall === 'DEGRADED') {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#3d2716] text-[#f6851b] border border-[#6b3e1a]">
          <span className="w-2 h-2 rounded-full bg-[#f6851b] animate-pulse"></span>
          <span className="font-mono tracking-tight text-[11px] uppercase">FALLBACK ACTIVE</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#3d1620] text-rose-300 border border-[#6b1e2e]">
          <span className="w-2 h-2 rounded-full bg-rose-400"></span>
          <span className="font-mono tracking-tight text-[11px] uppercase">CIRCUITS TRIPPED</span>
        </div>
      );
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1b363c] bg-[#0e262b]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Emblem & Typography */}
          <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => setActiveTab('search')}>
            <div className="w-10 h-10 rounded-2xl bg-[#e2761b] flex items-center justify-center text-white shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white font-sans">
                  SENTINEL
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#143940] text-[#c4f4eb] border border-[#2d616c]">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-[#9ecfc5] font-medium hidden sm:block">
                Adaptive Job Ingestion & Resilience Mesh
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center p-1 rounded-2xl bg-[#091a1e] border border-[#1b363c]">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'search'
                  ? 'bg-white text-[#121214] font-extrabold shadow-sm'
                  : 'text-[#9ecfc5] hover:text-white hover:bg-[#143940]'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Opportunities</span>
            </button>

            <button
              onClick={() => setActiveTab('health')}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'health'
                  ? 'bg-white text-[#121214] font-extrabold shadow-sm'
                  : 'text-[#9ecfc5] hover:text-white hover:bg-[#143940]'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Telemetry</span>
            </button>

            <button
              onClick={() => setActiveTab('demo')}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'demo'
                  ? 'bg-[#e2761b] text-white font-extrabold shadow-sm'
                  : 'text-[#9ecfc5] hover:text-white hover:bg-[#143940]'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Demo Lab</span>
            </button>

            <button
              onClick={() => setActiveTab('docs')}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'docs'
                  ? 'bg-white text-[#121214] font-extrabold shadow-sm'
                  : 'text-[#9ecfc5] hover:text-white hover:bg-[#143940]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden md:inline">DECISIONS.md</span>
            </button>
          </nav>

          {/* Right Status Pill */}
          <div className="hidden lg:flex items-center gap-3">
            {getHealthPill()}
          </div>
        </div>
      </div>
    </header>
  );
};
