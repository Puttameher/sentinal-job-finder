import React from 'react';
import { Activity, CheckCircle2, AlertTriangle, XCircle, Clock, Cpu, Server, Sparkles, RefreshCw } from 'lucide-react';
import { SystemHealthResponse, SourceMetrics, TelemetryEvent } from '../types';

interface SystemHealthProps {
  systemHealth: SystemHealthResponse | null;
  onRefresh: () => void;
  onOpenDriftDiagnosis: (sourceName: string) => void;
}

export const SystemHealth: React.FC<SystemHealthProps> = ({
  systemHealth,
  onRefresh,
  onOpenDriftDiagnosis,
}) => {
  if (!systemHealth) {
    return (
      <div className="py-24 text-center text-purple-200">
        <Activity className="w-9 h-9 animate-spin text-[#e2761b] mx-auto mb-3" />
        Connecting to Sentinel Ingestion Telemetry...
      </div>
    );
  }

  const getCircuitBadge = (state: string) => {
    switch (state) {
      case 'CLOSED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#122e25] text-emerald-300 border border-[#1e5243]">
            <CheckCircle2 className="w-3.5 h-3.5" /> CLOSED (Healthy)
          </span>
        );
      case 'OPEN':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#3d1620] text-rose-300 border border-[#6b1e2e]">
            <XCircle className="w-3.5 h-3.5" /> OPEN (Tripped)
          </span>
        );
      case 'HALF_OPEN':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#3d2716] text-[#f6851b] border border-[#6b3e1a]">
            <AlertTriangle className="w-3.5 h-3.5" /> HALF-OPEN (Probing)
          </span>
        );
      default:
        return null;
    }
  };

  const getEventBadge = (level: string) => {
    switch (level) {
      case 'SUCCESS':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#122e25] text-emerald-300 border border-[#1e5243]">OK</span>;
      case 'WARN':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#3d2716] text-[#f6851b] border border-[#6b3e1a]">WARN</span>;
      case 'ERROR':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#3d1620] text-rose-300 border border-[#6b1e2e]">FAIL</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#2b2046] text-purple-200 border border-[#483770]">INFO</span>;
    }
  };

  return (
    <div className="space-y-8 text-left">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 rounded-3xl bg-[#1b132e] border border-[#3b2b61]">
        <div>
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-[#e2761b]" />
            <h3 className="text-2xl font-black text-white font-sans uppercase">
              System Telemetry & Circuit Matrix
            </h3>
          </div>
          <p className="text-xs text-[#c4b5e6] mt-1">
            Real-time state machines, latency tracking, and resilience monitoring across all connectors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-[#2b2046] hover:bg-[#392b5c] text-white border border-[#4e3c78] transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#e2761b]" /> Poll Fresh Telemetry
          </button>
        </div>
      </div>

      {/* Aggregate Pipeline Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl bg-[#1b132e] border border-[#3b2b61]">
          <div className="flex items-center justify-between text-xs text-[#c4b5e6] mb-2">
            <span className="font-bold uppercase tracking-wider text-[10px]">Total Ingestions</span>
            <Server className="w-4 h-4 text-[#e2761b]" />
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {systemHealth.total_pipeline_requests}
          </div>
          <div className="text-[11px] text-[#9a88c2] mt-1.5 font-medium">
            Active Primary: <span className="text-white font-mono font-bold">{systemHealth.active_primary_source}</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#1b132e] border border-[#3b2b61]">
          <div className="flex items-center justify-between text-xs text-[#c4b5e6] mb-2">
            <span className="font-bold uppercase tracking-wider text-[10px]">Fallback Activation</span>
            <AlertTriangle className="w-4 h-4 text-[#f6851b]" />
          </div>
          <div className="text-3xl font-black text-[#f6851b] font-mono">
            {systemHealth.fallback_rate}%
          </div>
          <div className="text-[11px] text-[#9a88c2] mt-1.5 font-medium">
            Traffic auto-diverted on degradation
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#1b132e] border border-[#3b2b61]">
          <div className="flex items-center justify-between text-xs text-[#c4b5e6] mb-2">
            <span className="font-bold uppercase tracking-wider text-[10px]">Overall Health</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">
            {systemHealth.overall_health}
          </div>
          <div className="text-[11px] text-[#9a88c2] mt-1.5 font-medium">
            Real-time pipeline score
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-[#1b132e] border border-[#3b2b61] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#c4b5e6] mb-1.5">
              <span className="font-bold uppercase tracking-wider text-[10px]">AI Schema Drift</span>
              <Sparkles className="w-4 h-4 text-purple-300" />
            </div>
            <div className="text-sm font-bold text-purple-200">
              Advisory Assistant Ready
            </div>
          </div>
          <button
            onClick={() => onOpenDriftDiagnosis('sandbox_source')}
            className="mt-3 w-full py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-[#372859] hover:bg-[#483575] text-white border border-[#58418f] transition-all cursor-pointer text-center"
          >
            Launch AI Diagnostic →
          </button>
        </div>
      </div>

      {/* Source Connectors Health Matrix */}
      <div>
        <h4 className="text-xs font-mono font-bold text-[#c4b5e6] uppercase tracking-wider mb-4">
          Registered Source Health Matrix
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {Object.entries(systemHealth.sources).map(([name, metrics]: [string, SourceMetrics]) => (
            <div
              key={name}
              className={`rounded-3xl p-6 bg-[#1b132e] border transition-all ${
                metrics.circuit_state === 'OPEN'
                  ? 'border-rose-500 shadow-xl'
                  : metrics.circuit_state === 'HALF_OPEN'
                  ? 'border-amber-500 shadow-xl'
                  : 'border-[#3b2b61]'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-4">
                <div>
                  <h5 className="font-black text-base text-white font-sans">{name}</h5>
                  <span className="text-xs text-[#c4b5e6]">
                    Health Score: <strong className="text-white font-mono">{metrics.health_score}%</strong>
                  </span>
                </div>
                {getCircuitBadge(metrics.circuit_state)}
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-xs pt-4 border-t border-[#2b2046] font-mono">
                <div className="p-3 rounded-2xl bg-[#130d21] border border-[#2b2046]">
                  <span className="text-[#9a88c2] block text-[10px] uppercase">Requests</span>
                  <span className="text-white font-bold">{metrics.successful_requests} ok / {metrics.failed_requests} fail</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#130d21] border border-[#2b2046]">
                  <span className="text-[#9a88c2] block text-[10px] uppercase">Avg Latency</span>
                  <span className="text-[#e2761b] font-bold">{metrics.avg_latency_ms}ms</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#130d21] border border-[#2b2046]">
                  <span className="text-[#9a88c2] block text-[10px] uppercase">Valid Records</span>
                  <span className="text-emerald-400 font-bold">{metrics.total_records_valid}</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#130d21] border border-[#2b2046]">
                  <span className="text-[#9a88c2] block text-[10px] uppercase">Rejected</span>
                  <span className="text-rose-400 font-bold">{metrics.total_records_rejected}</span>
                </div>
              </div>

              {/* Cooldown Alert */}
              {metrics.circuit_state === 'OPEN' && (
                <div className="mt-4 p-3 rounded-2xl bg-[#3d1620] border border-[#6b1e2e] text-xs text-rose-200">
                  Breaker Tripped ({metrics.circuit_tripped_count}x). Cooldown remaining: <strong className="font-mono">{metrics.cooldown_remaining_seconds}s</strong>
                </div>
              )}
              {metrics.last_error_message && (
                <div className="mt-3 text-[11px] text-[#9a88c2] truncate" title={metrics.last_error_message}>
                  Last Error: {metrics.last_error_message}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Live Resilience Event Journal */}
      <div className="rounded-3xl bg-[#1b132e] border border-[#3b2b61] p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4 border-b border-[#2b2046] pb-3">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-[#e2761b]" />
            <h4 className="text-sm font-black text-white uppercase tracking-wider font-sans">
              Live Resilience Activity Feed
            </h4>
          </div>
          <span className="text-xs text-[#c4b5e6] font-mono">
            {systemHealth.recent_events.length} events logged
          </span>
        </div>

        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {systemHealth.recent_events.map((evt: TelemetryEvent) => (
            <div
              key={evt.id}
              className="flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-[#130d21] hover:bg-[#18112b] border border-[#2b2046] text-xs transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getEventBadge(evt.level)}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white">{evt.action}</span>
                    <span className="text-[11px] font-mono text-[#9a88c2]">[{evt.source}]</span>
                  </div>
                  <p className="text-[#c4b5e6] mt-0.5">{evt.message}</p>
                </div>
              </div>

              <span className="text-[10px] font-mono text-[#9a88c2] whitespace-nowrap">
                {new Date(evt.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
