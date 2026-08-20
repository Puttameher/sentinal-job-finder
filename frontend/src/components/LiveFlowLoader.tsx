import React, { useState, useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────
   Toy-surface cat SVG — filled shapes, radial
   gradients, highlights for a 3D plushie look.
──────────────────────────────────────────────── */
const ToyCat: React.FC = () => (
  <svg width="96" height="80" viewBox="0 0 96 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bodyGrad" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#6ee7b7" />
        <stop offset="60%" stopColor="#34d399" />
        <stop offset="100%" stopColor="#059669" />
      </radialGradient>
      <radialGradient id="headGrad" cx="45%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#a7f3d0" />
        <stop offset="55%" stopColor="#34d399" />
        <stop offset="100%" stopColor="#065f46" />
      </radialGradient>
      <radialGradient id="bellyGrad" cx="50%" cy="50%" r="55%">
        <stop offset="0%" stopColor="#d1fae5" />
        <stop offset="100%" stopColor="#6ee7b7" />
      </radialGradient>
      <radialGradient id="earGrad" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stopColor="#fbcfe8" />
        <stop offset="100%" stopColor="#f9a8d4" />
      </radialGradient>
      <linearGradient id="tailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#059669" />
        <stop offset="100%" stopColor="#34d399" />
      </linearGradient>
      <radialGradient id="shadowGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(0,0,0,0.3)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0)" />
      </radialGradient>
    </defs>
    <ellipse cx="44" cy="76" rx="28" ry="5" fill="url(#shadowGrad)" />
    {/* Tail */}
    <path d="M14 55 Q4 48 6 36 Q8 26 16 34 Q18 38 15 44 Q12 50 16 56Z" fill="url(#tailGrad)" stroke="#059669" strokeWidth="0.5" />
    <path d="M12 40 Q9 36 11 32" stroke="#6ee7b7" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    {/* Body */}
    <ellipse cx="44" cy="54" rx="24" ry="18" fill="url(#bodyGrad)" />
    <ellipse cx="34" cy="44" rx="10" ry="6" fill="white" opacity="0.12" />
    {/* Belly */}
    <ellipse cx="44" cy="57" rx="14" ry="10" fill="url(#bellyGrad)" opacity="0.85" />
    {/* Legs */}
    <rect x="26" y="64" width="9" height="12" rx="4.5" fill="url(#bodyGrad)" stroke="#059669" strokeWidth="0.4" className="cat-leg-a" />
    <rect x="37" y="64" width="9" height="12" rx="4.5" fill="url(#bodyGrad)" stroke="#059669" strokeWidth="0.4" className="cat-leg-b" />
    <rect x="49" y="64" width="9" height="12" rx="4.5" fill="url(#bodyGrad)" stroke="#059669" strokeWidth="0.4" className="cat-leg-b" />
    <rect x="60" y="64" width="9" height="12" rx="4.5" fill="url(#bodyGrad)" stroke="#059669" strokeWidth="0.4" className="cat-leg-a" />
    {/* Paws */}
    <ellipse cx="30.5" cy="76" rx="4" ry="2.5" fill="#059669" opacity="0.5" className="cat-leg-a" />
    <ellipse cx="41.5" cy="76" rx="4" ry="2.5" fill="#059669" opacity="0.5" className="cat-leg-b" />
    <ellipse cx="53.5" cy="76" rx="4" ry="2.5" fill="#059669" opacity="0.5" className="cat-leg-b" />
    <ellipse cx="64.5" cy="76" rx="4" ry="2.5" fill="#059669" opacity="0.5" className="cat-leg-a" />
    {/* Head */}
    <circle cx="62" cy="32" r="22" fill="url(#headGrad)" />
    <ellipse cx="55" cy="23" rx="10" ry="7" fill="white" opacity="0.15" />
    {/* Ears */}
    <polygon points="46,15 50,4 57,16" fill="url(#headGrad)" stroke="#059669" strokeWidth="0.6" />
    <polygon points="49,14 51,7 55,15" fill="url(#earGrad)" />
    <polygon points="66,14 73,4 77,16" fill="url(#headGrad)" stroke="#059669" strokeWidth="0.6" />
    <polygon points="68,14 72,7 75,15" fill="url(#earGrad)" />
    {/* Eyes */}
    <ellipse cx="55" cy="30" rx="5.5" ry="5" fill="white" />
    <ellipse cx="55" cy="31" rx="3" ry="3.5" fill="#065f46" />
    <circle cx="56.5" cy="29.5" r="1.2" fill="white" />
    <ellipse cx="69" cy="30" rx="5.5" ry="5" fill="white" />
    <ellipse cx="69" cy="31" rx="3" ry="3.5" fill="#065f46" />
    <circle cx="70.5" cy="29.5" r="1.2" fill="white" />
    {/* Nose */}
    <path d="M61 37 L63 40 L65 37 Q63 35.5 61 37Z" fill="#f9a8d4" />
    {/* Mouth */}
    <path d="M63 40 Q60 44 58 43" stroke="#065f46" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7" />
    <path d="M63 40 Q66 44 68 43" stroke="#065f46" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7" />
    {/* Whiskers */}
    <line x1="40" y1="37" x2="52" y2="38" stroke="#a7f3d0" strokeWidth="0.8" strokeLinecap="round" opacity="0.8" />
    <line x1="40" y1="40" x2="52" y2="40" stroke="#a7f3d0" strokeWidth="0.8" strokeLinecap="round" opacity="0.8" />
    <line x1="40" y1="43" x2="52" y2="42" stroke="#a7f3d0" strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
    <line x1="74" y1="37" x2="86" y2="37" stroke="#a7f3d0" strokeWidth="0.8" strokeLinecap="round" opacity="0.8" />
    <line x1="74" y1="40" x2="86" y2="40" stroke="#a7f3d0" strokeWidth="0.8" strokeLinecap="round" opacity="0.8" />
    <line x1="74" y1="43" x2="86" y2="43" stroke="#a7f3d0" strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
  </svg>
);

// Status steps shown as the big animated headline
const STATUS_STEPS = [
  'Connecting…',
  'Fetching API…',
  'Parsing feeds…',
  'Validating…',
  'Ranking…',
  'Almost ready…',
];

interface LiveFlowLoaderProps {
  query?: string;
}

export const LiveFlowLoader: React.FC<LiveFlowLoaderProps> = ({ query }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [visible, setVisible] = useState(true); // controls crossfade
  const [catX, setCatX] = useState(-110);
  const animRef = useRef<number>(0);
  const catPosRef = useRef(-110);

  // Crossfade between status steps — fade out, swap, fade in
  useEffect(() => {
    if (stepIndex >= STATUS_STEPS.length - 1) return;
    const fadeOut = setTimeout(() => setVisible(false), 380); // start fade out
    const swap    = setTimeout(() => {
      setStepIndex((s) => s + 1);
      setVisible(true); // fade back in with new text
    }, 480);
    return () => { clearTimeout(fadeOut); clearTimeout(swap); };
  }, [stepIndex]);

  // Cat walk via rAF — faster speed
  useEffect(() => {
    const walk = () => {
      catPosRef.current += 2.4; // increased speed
      if (catPosRef.current > window.innerWidth + 110) catPosRef.current = -110;
      setCatX(catPosRef.current);
      animRef.current = requestAnimationFrame(walk);
    };
    animRef.current = requestAnimationFrame(walk);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div
      className="relative w-full min-h-[80vh] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #031a14 0%, #020f0b 60%, #041c17 100%)' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 45%, rgba(52,211,153,0.09) 0%, transparent 70%)',
        }}
      />

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">

        {/* Big animated headline — replaces "Explore Jobs" during load */}
        <h1
          className="text-5xl sm:text-7xl font-black tracking-tight text-white leading-none select-none"
          style={{
            textShadow: '0 0 60px rgba(52,211,153,0.18)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(-10px)',
            transition: 'opacity 0.18s ease, transform 0.18s ease',
          }}
        >
          {STATUS_STEPS[stepIndex]}
        </h1>

        {/* Query badge */}
        {query && (
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono border"
            style={{
              background: 'rgba(52,211,153,0.07)',
              borderColor: 'rgba(52,211,153,0.2)',
              color: '#6ee7b7',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            Searching for <span className="font-bold text-white ml-1">"{query}"</span>
          </div>
        )}

        {/* Progress bar */}
        <div className="w-40 h-0.5 rounded-full overflow-hidden bg-white/10">
          <div
            className="h-full rounded-full bg-emerald-400"
            style={{
              width: `${Math.round(((stepIndex + 1) / STATUS_STEPS.length) * 100)}%`,
              transition: 'width 0.45s cubic-bezier(0.16,1,0.3,1)',
            }}
          />
        </div>
      </div>

      {/* ── Walking cat strip ── */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ height: 100 }}>
        {/* Ground line */}
        <div
          className="absolute left-0 right-0"
          style={{
            bottom: 22,
            height: 1,
            background:
              'linear-gradient(90deg, transparent 0%, rgba(52,211,153,0.18) 20%, rgba(52,211,153,0.18) 80%, transparent 100%)',
          }}
        />
        <div className="absolute" style={{ bottom: 22, left: catX, willChange: 'left' }}>
          <ToyCat />
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes catLegA {
          0%   { transform-origin: top center; transform: rotate(-18deg); }
          100% { transform-origin: top center; transform: rotate(14deg); }
        }
        @keyframes catLegB {
          0%   { transform-origin: top center; transform: rotate(14deg); }
          100% { transform-origin: top center; transform: rotate(-18deg); }
        }
        .cat-leg-a { animation: catLegA 0.28s infinite alternate ease-in-out; }
        .cat-leg-b { animation: catLegB 0.28s infinite alternate ease-in-out; }
      `}</style>
    </div>
  );
};
