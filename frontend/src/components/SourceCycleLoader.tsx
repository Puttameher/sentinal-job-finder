import React, { useState, useEffect } from 'react';
import { Sparkles, Shield, Cpu, Network, CheckCircle2, ArrowRight } from 'lucide-react';

const THINKING_PHRASES = [
  { step: 'Pacing & Handshake', text: 'Negotiating TLS & Gaussian jitter pacing with Primary API...', icon: Network, color: '#38bdf8' },
  { step: 'Triangulating Sources', text: 'Triangulating RemoteOK JSON, WeWorkRemotely RSS, & Sentinel Sandbox...', icon: Cpu, color: '#f97316' },
  { step: 'Resilience Telemetry', text: 'Checking 3-state Circuit Breakers & evaluating source health...', icon: Shield, color: '#34d399' },
  { step: 'Batch Validation', text: 'Executing strict Pydantic typed validation & Schema Drift detection...', icon: Sparkles, color: '#a855f7' },
  { step: 'Synthesizing Roles', text: 'Normalizing payloads and structuring live opportunity telemetry...', icon: CheckCircle2, color: '#e2761b' },
];

const SOURCES = [
  { name: 'RemoteOK API', color: '#f97316', status: 'ACTIVE' },
  { name: 'WeWorkRemotely RSS', color: '#34d399', status: 'STANDBY' },
  { name: 'Sentinel Sandbox', color: '#38bdf8', status: 'READY' },
];

export const SourceCycleLoader: React.FC = () => {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [sourceIndex, setSourceIndex] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const phraseInterval = setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % THINKING_PHRASES.length);
    }, 1100);

    const sourceInterval = setInterval(() => {
      setSourceIndex((prev) => (prev + 1) % SOURCES.length);
    }, 1500);

    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 350);

    return () => {
      clearInterval(phraseInterval);
      clearInterval(sourceInterval);
      clearInterval(dotInterval);
    };
  }, []);

  const currentPhase = THINKING_PHRASES[phaseIndex];
  const currentSource = SOURCES[sourceIndex];
  const CurrentIcon = currentPhase.icon;

  return (
    <div className="w-full max-w-2xl mx-auto my-12 p-8 rounded-3xl bg-[#031714]/90 border border-emerald-500/20 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center space-y-6 animate-fadeIn">
      {/* Animated Radar Glowing Node */}
      <div className="relative w-24 h-24 flex items-center justify-center">
        <div
          className="absolute inset-0 rounded-full animate-ping opacity-25"
          style={{ backgroundColor: currentPhase.color }}
        />
        <div
          className="absolute inset-2 rounded-full animate-pulse opacity-40 blur-sm"
          style={{ backgroundColor: currentPhase.color }}
        />
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-500 shadow-xl border border-white/20"
          style={{
            background: `radial-gradient(circle, ${currentPhase.color}40, #041a17)`,
          }}
        >
          <CurrentIcon className="w-7 h-7 text-white animate-bounce" />
        </div>
      </div>

      {/* Claude-style Deep Research Step Indicator */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/15 text-xs font-mono font-semibold uppercase tracking-wider text-emerald-300">
          <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: currentPhase.color }} />
          <span>Step 0{phaseIndex + 1} • {currentPhase.step}</span>
        </div>

        <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight font-sans transition-all duration-300 min-h-[40px] flex items-center justify-center">
          <span>{currentPhase.text}</span>
          <span className="text-emerald-400 font-mono w-6 text-left">{dots}</span>
        </h4>
      </div>

      {/* Active Ingestion Pipeline Bar */}
      <div className="w-full pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="text-white/40 font-mono uppercase text-[11px] font-bold">Ingestion Mesh:</span>
        <div className="flex items-center gap-2">
          {SOURCES.map((src, i) => (
            <div
              key={src.name}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300"
              style={{
                background: i === sourceIndex ? `${src.color}22` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${i === sourceIndex ? src.color + '60' : 'rgba(255,255,255,0.08)'}`,
                color: i === sourceIndex ? src.color : 'rgba(255,255,255,0.4)',
              }}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${i === sourceIndex ? 'animate-pulse' : ''}`}
                style={{ backgroundColor: src.color }}
              />
              {src.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
