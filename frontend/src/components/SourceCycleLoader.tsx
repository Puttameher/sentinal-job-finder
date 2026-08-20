import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

interface LogLine {
  delay: number;
  text: string;
  type: 'dim' | 'normal' | 'success' | 'warn';
}

const LOG_LINES: LogLine[] = [
  { delay: 0,    text: 'Initializing ingestion pipeline v1.0.0', type: 'dim' },
  { delay: 200,  text: 'Resolving DNS · remoteok.com...', type: 'dim' },
  { delay: 480,  text: 'TLS handshake complete (TLSv1.3) ✓', type: 'success' },
  { delay: 720,  text: 'GET https://remoteok.com/api → 200 OK', type: 'success' },
  { delay: 950,  text: 'Fetched 100+ raw records from RemoteOK', type: 'normal' },
  { delay: 1150, text: 'Pre-filtering non-tech listings...', type: 'dim' },
  { delay: 1380, text: 'Pydantic invariant validation running...', type: 'dim' },
  { delay: 1580, text: '94 records valid · 6 rejected (invalid URL / empty title)', type: 'warn' },
  { delay: 1800, text: 'Circuit breaker CLOSED — source healthy', type: 'success' },
  { delay: 2050, text: 'Resolving DNS · weworkremotely.com...', type: 'dim' },
  { delay: 2280, text: 'GET .../remote-programming-jobs.rss → 200 OK', type: 'success' },
  { delay: 2480, text: 'Parsed 82 RSS items · schema drift check passed', type: 'success' },
  { delay: 2700, text: 'Merging & deduplicating 176 validated records', type: 'normal' },
  { delay: 2900, text: 'Applying keyword filters · ranking by relevance...', type: 'dim' },
  { delay: 3100, text: 'Pipeline complete — rendering results', type: 'success' },
];

const TYPE_STYLE: Record<LogLine['type'], string> = {
  dim:     'text-white/30',
  normal:  'text-white/65',
  success: 'text-emerald-400',
  warn:    'text-amber-400',
};

const STEPS = [
  { label: 'Connecting to sources' },
  { label: 'Validating records' },
  { label: 'Applying filters' },
  { label: 'Rendering results' },
];

export const SourceCycleLoader: React.FC = () => {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [cursor, setCursor] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    LOG_LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setVisibleLines((prev) => [...prev, i]);
      }, line.delay);
      timers.push(t);
    });

    // Progress steps
    const stepTimers = [
      setTimeout(() => setActiveStep(1), 900),
      setTimeout(() => setActiveStep(2), 1900),
      setTimeout(() => setActiveStep(3), 2900),
    ];

    const cursorTimer = setInterval(() => setCursor((c) => !c), 500);

    return () => {
      timers.forEach(clearTimeout);
      stepTimers.forEach(clearTimeout);
      clearInterval(cursorTimer);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleLines]);

  const isDone = visibleLines.length >= LOG_LINES.length;

  return (
    <div className="w-full max-w-2xl mx-auto my-8 animate-fadeIn">
      {/* Glass card */}
      <div
        className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(10,30,25,0.92) 0%, rgba(5,18,14,0.97) 100%)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
        }}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-[11px] font-mono text-white/25 tracking-wide">
            sentinel-ingestion-pipeline — bash
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: isDone ? '#28c840' : '#febc2e' }}
            />
            <span className="text-[10px] font-mono text-white/30">
              {isDone ? 'done' : 'running'}
            </span>
          </div>
        </div>

        {/* Terminal body */}
        <div className="px-5 pt-4 pb-3 font-mono text-[12px] leading-relaxed space-y-[3px] min-h-[150px] max-h-[200px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-emerald-500 font-bold">❯</span>
            <span className="text-white/40">sentinel ingest --resilient --validate</span>
          </div>

          {visibleLines.map((lineIdx) => {
            const line = LOG_LINES[lineIdx];
            return (
              <div key={lineIdx} className="flex items-start gap-2" style={{ animation: 'fadeInUp 0.15s ease' }}>
                <span className="text-white/20 shrink-0 select-none mt-px">›</span>
                <span className={TYPE_STYLE[line.type]}>{line.text}</span>
              </div>
            );
          })}

          {/* Blinking cursor */}
          {!isDone && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-white/20 select-none">›</span>
              <span
                className="inline-block w-[6px] h-[13px] rounded-sm bg-emerald-400"
                style={{ opacity: cursor ? 1 : 0, transition: 'opacity 0.1s' }}
              />
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Progress steps */}
        <div className="px-5 py-4 border-t border-white/[0.07] flex items-center justify-between gap-2">
          {STEPS.map((step, i) => {
            const done = i < activeStep;
            const active = i === activeStep && !isDone;
            return (
              <div key={i} className="flex items-center gap-1.5 min-w-0">
                {done ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <Circle
                    className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-amber-400 animate-pulse' : 'text-white/15'}`}
                  />
                )}
                <span
                  className={`text-[10px] font-mono truncate transition-colors duration-300 ${
                    done ? 'text-emerald-400' : active ? 'text-amber-300' : 'text-white/20'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
