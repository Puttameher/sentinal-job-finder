import React, { useState, useEffect } from 'react';

const SOURCES = [
  { name: 'RemoteOK', color: '#f97316' },
  { name: 'WeWorkRemotely', color: '#34d399' },
  { name: 'Sandbox', color: '#38bdf8' },
];

export const SourceCycleLoader: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const sourceInterval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SOURCES.length);
    }, 1200);

    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);

    return () => {
      clearInterval(sourceInterval);
      clearInterval(dotInterval);
    };
  }, []);

  const current = SOURCES[activeIndex];

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6">
      {/* Pulsing ring */}
      <div className="relative w-20 h-20 flex items-center justify-center">
        <div
          className="absolute inset-0 rounded-full animate-ping opacity-20"
          style={{ backgroundColor: current.color }}
        />
        <div
          className="absolute inset-1 rounded-full animate-pulse opacity-30"
          style={{ backgroundColor: current.color }}
        />
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{
            background: `radial-gradient(circle, ${current.color}33, ${current.color}11)`,
            border: `2px solid ${current.color}55`,
            boxShadow: `0 0 24px ${current.color}22`,
          }}
        >
          <div
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: current.color }}
          />
        </div>
      </div>

      {/* Source name cycling */}
      <div className="text-center">
        <p className="text-white/40 text-xs font-medium uppercase tracking-widest mb-2">
          Ingesting from
        </p>
        <p
          className="text-lg font-bold tracking-wide transition-all duration-300"
          style={{ color: current.color }}
          key={activeIndex}
        >
          <span className="inline-block animate-fadeIn">{current.name}</span>
          <span className="text-white/30 font-mono">{dots}</span>
        </p>
      </div>

      {/* Source pills */}
      <div className="flex items-center gap-2 mt-2">
        {SOURCES.map((source, i) => (
          <div
            key={source.name}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-300"
            style={{
              background:
                i === activeIndex ? `${source.color}18` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${i === activeIndex ? source.color + '40' : 'rgba(255,255,255,0.06)'}`,
              color: i === activeIndex ? source.color : 'rgba(255,255,255,0.3)',
            }}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? 'animate-pulse' : ''
              }`}
              style={{
                backgroundColor: i === activeIndex ? source.color : 'rgba(255,255,255,0.15)',
              }}
            />
            {source.name}
          </div>
        ))}
      </div>
    </div>
  );
};
