import React, { useState } from 'react';
import { Terminal, Play, RotateCcw, AlertTriangle, ShieldCheck, Flame, Cpu, Sparkles } from 'lucide-react';

interface DemoControlPanelProps {
  onSimulate: (action: string, targetSource: string) => Promise<void>;
  onOpenDriftDiagnosis: (sourceName: string) => void;
  onRefreshSearch: () => void;
}

export const DemoControlPanel: React.FC<DemoControlPanelProps> = ({
  onSimulate,
  onOpenDriftDiagnosis,
  onRefreshSearch,
}) => {
  const [activeSimulation, setActiveSimulation] = useState<string>('none');
  const [targetSource, setTargetSource] = useState<string>('sandbox_source');
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleAction = async (action: string, label: string) => {
    setLoading(true);
    setStatusMessage(null);
    try {
      await onSimulate(action, targetSource);
      setActiveSimulation(action);
      setStatusMessage(`Fault Injected: ${label}`);
      onRefreshSearch();
    } catch (err: any) {
      setStatusMessage(`Error: ${err.message || 'Simulation failed'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#261118] border border-[#522533]">
        <div className="flex items-center gap-3.5 mb-2">
          <div className="w-11 h-11 rounded-2xl bg-[#e2761b] flex items-center justify-center text-white shadow-md">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white font-sans uppercase">
              Resilience & Demo Chaos Bench
            </h3>
            <p className="text-xs text-[#d9aab5]">
              Interactive test bench to demonstrate circuit breakers, failovers, and schema drift detection in real-time.
            </p>
          </div>
        </div>

        {/* Target Source Selector */}
        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs">
          <span className="text-[#ffd4df] font-bold">Injection Target:</span>
          <select
            value={targetSource}
            onChange={(e) => setTargetSource(e.target.value)}
            className="px-4 py-2 rounded-xl bg-[#1a0b10] border border-[#522533] text-white outline-none font-semibold cursor-pointer"
          >
            <option value="sandbox_source">Controlled Sandbox Source (Safe for Live Demo)</option>
            <option value="remoteok">RemoteOK API Connector</option>
            <option value="weworkremotely_rss">WeWorkRemotely RSS Connector</option>
          </select>

          {statusMessage && (
            <span className="px-4 py-2 rounded-xl bg-[#3d1620] text-[#ffd4df] font-mono text-xs border border-[#6b1e2e] font-bold">
              {statusMessage}
            </span>
          )}
        </div>
      </div>

      {/* Interactive Simulation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Sim 1: HTTP 500 Outage */}
        <div className="p-6 rounded-3xl bg-[#261118] border border-[#522533] flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-extrabold text-sm text-rose-300 flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#e2761b]" /> 1. HTTP 500 Outage
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#3d1620] text-rose-300 border border-[#6b1e2e] font-bold">
                Circuit Breaker
              </span>
            </div>
            <p className="text-xs text-[#d9aab5] leading-relaxed">
              Injects internal server errors. Watch 3 failures trip the breaker to <strong className="text-white font-mono">OPEN</strong> and automatically divert queries to secondary fallback.
            </p>
          </div>

          <button
            onClick={() => handleAction('simulate_500', 'HTTP 500 Server Outage')}
            disabled={loading}
            className="mt-6 w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider bg-[#3d1620] hover:bg-[#521c2b] text-white border border-[#6b1e2e] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" /> Inject 500 Failure
          </button>
        </div>

        {/* Sim 2: 429 Rate Limit */}
        <div className="p-6 rounded-3xl bg-[#261118] border border-[#522533] flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-extrabold text-sm text-[#f6851b] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> 2. Rate Limit (429)
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#3d2716] text-[#f6851b] border border-[#6b3e1a] font-bold">
                Pacing & Backoff
              </span>
            </div>
            <p className="text-xs text-[#d9aab5] leading-relaxed">
              Simulates HTTP 429 Too Many Requests. Demonstrates exponential backoff with jitter and source isolation to prevent spamming.
            </p>
          </div>

          <button
            onClick={() => handleAction('simulate_429', '429 Rate Limit')}
            disabled={loading}
            className="mt-6 w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider bg-[#3d2716] hover:bg-[#52331c] text-white border border-[#6b3e1a] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" /> Inject 429 Rate Limit
          </button>
        </div>

        {/* Sim 3: Schema Drift & AI Diagnosis */}
        <div className="p-6 rounded-3xl bg-[#261118] border border-[#522533] flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-extrabold text-sm text-purple-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> 3. Schema Drift Mutation
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#251c3d] text-purple-300 border border-[#443370] font-bold">
                AI Diagnostic
              </span>
            </div>
            <p className="text-xs text-[#d9aab5] leading-relaxed">
              Upstream API renames keys (<code className="text-white">position</code> → <code className="text-white">job_headline</code>). Triggers drift detection & AI field-mapping proposals.
            </p>
          </div>

          <div className="mt-6 flex gap-2">
            <button
              onClick={() => handleAction('simulate_drift', 'Schema Drift Mutation')}
              disabled={loading}
              className="flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider bg-[#251c3d] hover:bg-[#342754] text-white border border-[#443370] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" /> Inject Drift
            </button>
            <button
              onClick={() => onOpenDriftDiagnosis(targetSource)}
              className="py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider mm-btn-orange transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> Inspect AI
            </button>
          </div>
        </div>

        {/* Sim 4: Malformed Payloads */}
        <div className="p-6 rounded-3xl bg-[#261118] border border-[#522533] flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-extrabold text-sm text-teal-300 flex items-center gap-2">
                <Cpu className="w-4 h-4" /> 4. Malformed JSON
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#122e25] text-emerald-300 border border-[#1e5243] font-bold">
                Record Isolation
              </span>
            </div>
            <p className="text-xs text-[#d9aab5] leading-relaxed">
              Injects corrupted records and invalid URL schemes. Valid records are accepted while broken items are isolated into telemetry logs.
            </p>
          </div>

          <button
            onClick={() => handleAction('simulate_malformed', 'Malformed Payload')}
            disabled={loading}
            className="mt-6 w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider bg-[#122e25] hover:bg-[#1a4034] text-white border border-[#1e5243] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" /> Inject Malformed Batch
          </button>
        </div>

        {/* Sim 5: Empty Payload */}
        <div className="p-6 rounded-3xl bg-[#261118] border border-[#522533] flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-extrabold text-sm text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> 5. Empty Response
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#1a0b10] text-gray-300 border border-[#522533] font-bold">
                Graceful Empty
              </span>
            </div>
            <p className="text-xs text-[#d9aab5] leading-relaxed">
              Returns empty payload <code className="text-white">[]</code>. System records telemetry without throwing unhandled exceptions.
            </p>
          </div>

          <button
            onClick={() => handleAction('simulate_empty', 'Empty Response')}
            disabled={loading}
            className="mt-6 w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider bg-[#1a0b10] hover:bg-[#2e131c] text-white border border-[#522533] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" /> Inject Empty Response
          </button>
        </div>

        {/* Restore All */}
        <div className="p-6 rounded-3xl bg-[#122e25] border border-[#1e5243] flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-extrabold text-sm text-emerald-300 flex items-center gap-2">
                <RotateCcw className="w-4 h-4" /> 6. Restore System
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#08201a] text-emerald-400 border border-[#1b4337] font-bold">
                Reset Healthy
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Clears all fault simulations, resets circuit breakers to <strong className="text-white font-mono">CLOSED</strong>, and restores full normal operation.
            </p>
          </div>

          <button
            onClick={() => handleAction('restore', 'System Restore')}
            disabled={loading}
            className="mt-6 w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider bg-[#08201a] hover:bg-[#0e2e25] text-white border border-[#1b4337] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restore All Sources
          </button>
        </div>
      </div>
    </div>
  );
};
