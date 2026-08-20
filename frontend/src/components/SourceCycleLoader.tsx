import React, { useState, useEffect, useRef } from 'react';

// Real-looking log messages that simulate an actual scraping agent
const LOG_LINES = [
  { delay: 0,    text: 'Initializing ingestion pipeline...', type: 'info' },
  { delay: 220,  text: 'Resolving DNS for remoteok.com...', type: 'info' },
  { delay: 480,  text: 'TLS handshake complete (TLSv1.3)', type: 'success' },
  { delay: 650,  text: 'GET https://remoteok.com/api → 200 OK', type: 'success' },
  { delay: 850,  text: 'Received 142 raw records from RemoteOK', type: 'info' },
  { delay: 1050, text: 'Running Pydantic invariant validation...', type: 'info' },
  { delay: 1250, text: '139 records passed · 3 rejected (missing title or URL)', type: 'warn' },
  { delay: 1500, text: 'Circuit breaker CLOSED — source healthy ✓', type: 'success' },
  { delay: 1750, text: 'Resolving DNS for weworkremotely.com...', type: 'info' },
  { delay: 1950, text: 'GET https://weworkremotely.com/...rss → 200 OK', type: 'success' },
  { delay: 2150, text: 'Parsing XML feed with defusedxml...', type: 'info' },
  { delay: 2350, text: 'Received 85 RSS items · normalizing to canonical schema', type: 'info' },
  { delay: 2550, text: 'Schema drift check passed — all expected keys present', type: 'success' },
  { delay: 2750, text: 'Merging 224 validated records from 2 sources', type: 'info' },
  { delay: 2950, text: 'Applying keyword filters and relevance ranking...', type: 'info' },
  { delay: 3150, text: 'Pipeline complete. Rendering results.', type: 'success' },
];

const TYPE_COLORS: Record<string, string> = {
  info:    'text-white/60',
  success: 'text-emerald-400',
  warn:    'text-amber-400',
  error:   'text-red-400',
};

const TYPE_PREFIX: Record<string, string> = {
  info:    '›',
  success: '✓',
  warn:    '⚠',
  error:   '✗',
};

export const SourceCycleLoader: React.FC = () => {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [cursor, setCursor] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    LOG_LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setVisibleLines((prev) => [...prev, i]);
      }, line.delay);
      timers.push(t);
    });

    // Blink cursor
    const cursorTimer = setInterval(() => setCursor((c) => !c), 530);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(cursorTimer);
    };
  }, []);

  // Auto-scroll to bottom as lines appear
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleLines]);

  return (
    <div className="w-full max-w-2xl mx-auto my-6 rounded-2xl overflow-hidden border border-white/10 bg-[#0d1117] shadow-2xl">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#161b22] border-b border-white/10">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-xs font-mono text-white/30">sentinel-ingestion-pipeline</span>
      </div>

      {/* Terminal body */}
      <div className="px-5 py-4 font-mono text-xs space-y-1 min-h-[160px] max-h-[220px] overflow-y-auto">
        {visibleLines.map((lineIdx) => {
          const line = LOG_LINES[lineIdx];
          return (
            <div key={lineIdx} className="flex items-start gap-2 animate-fadeIn">
              <span className={`shrink-0 mt-px w-3 text-center ${TYPE_COLORS[line.type]}`}>
                {TYPE_PREFIX[line.type]}
              </span>
              <span className={TYPE_COLORS[line.type]}>{line.text}</span>
            </div>
          );
        })}

        {/* Blinking cursor line */}
        {visibleLines.length < LOG_LINES.length && (
          <div className="flex items-center gap-2">
            <span className="text-white/40 w-3 text-center">›</span>
            <span className={`w-2 h-3.5 bg-emerald-400 rounded-sm transition-opacity ${cursor ? 'opacity-100' : 'opacity-0'}`} />
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
