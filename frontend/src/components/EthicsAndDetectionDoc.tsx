import React from 'react';
import { BookOpen, ShieldAlert, Cpu, CheckCircle2, Lock, FileText, Layers, Radio } from 'lucide-react';

export const EthicsAndDetectionDoc: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-8 rounded-3xl mm-glass-glow-cyan border border-cyan-500/30">
        <div className="flex items-center gap-3.5 mb-2">
          <div className="w-11 h-11 rounded-2xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center shadow-lg shadow-cyan-950/50">
            <BookOpen className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white font-sans">Detection Surface, Resilience & Ethical Boundary</h2>
            <p className="text-xs text-gray-300">
              Technical documentation fulfilling the Acdyon Challenge Assessment Part 1 specification.
            </p>
          </div>
        </div>
      </div>

      {/* 1. Detection Surface Breakdown */}
      <div className="p-8 rounded-3xl mm-glass border border-white/10 space-y-4">
        <div className="flex items-center gap-2.5">
          <Radio className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white font-sans">1. Ingestion Detection Surface Analysis</h3>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed font-normal">
          When consuming data from external platforms, anti-bot systems (e.g. Cloudflare, DataDome, Akamai) monitor three distinct technical layers:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-gray-950/70 border border-white/5 space-y-2">
            <span className="font-bold text-cyan-300 block">A. Network & TLS Layer</span>
            <ul className="list-disc list-inside text-gray-400 space-y-1 text-[11px]">
              <li>TLS Client Hello cipher suites & extension ordering (JA3 / JA4 fingerprints).</li>
              <li>HTTP/2 SETTINGS frame parameters & stream priority weights.</li>
              <li>ASN categorization (Datacenter vs Residential vs Mobile).</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-gray-950/70 border border-white/5 space-y-2">
            <span className="font-bold text-cyan-300 block">B. Header & Protocol Layer</span>
            <ul className="list-disc list-inside text-gray-400 space-y-1 text-[11px]">
              <li>Consistency between User-Agent and Sec-CH-UA platform hints.</li>
              <li>Header capitalization, ordering, and pseudo-header structures.</li>
              <li>Accept-Language, Accept-Encoding, and Referer headers.</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-gray-950/70 border border-white/5 space-y-2">
            <span className="font-bold text-cyan-300 block">C. Behavioral Layer</span>
            <ul className="list-disc list-inside text-gray-400 space-y-1 text-[11px]">
              <li>Robotic, perfectly uniform request intervals (detectable via FFT spectrum analysis).</li>
              <li>Unnatural deep pagination traversal without prior queries.</li>
              <li>Concurrent multi-threaded burst hammering.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Sentinel Ingestion Strategy */}
      <div className="p-8 rounded-3xl mm-glass border border-white/10 space-y-4">
        <div className="flex items-center gap-2.5">
          <Layers className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-white font-sans">2. Sentinel Ingestion & Resilience Strategy</h3>
        </div>
        <div className="space-y-3 text-xs text-gray-300 leading-relaxed font-normal">
          <p>
            Sentinel addresses unreliability through a <strong>modular, feedback-driven ingestion loop</strong> rather than brute force:
          </p>
          <div className="space-y-2.5">
            <div className="p-4 rounded-2xl bg-gray-950/70 border border-white/5">
              <strong className="text-emerald-300 block mb-1">Pacing with Jittered Backoff:</strong> Requests enforce a minimum polite inter-request interval (0.3s-0.5s) with randomized jitter to eliminate mathematical periodicity. On transient glitches (503/429), exponential backoff with bounded retries prevents cascading pressure.
            </div>
            <div className="p-4 rounded-2xl bg-gray-950/70 border border-white/5">
              <strong className="text-emerald-300 block mb-1">3-State Circuit Breaker (CLOSED / OPEN / HALF_OPEN):</strong> When an upstream provider exhibits repeated failure (3 consecutive faults), the circuit trips to <strong>OPEN</strong>. Traffic is immediately routed to the secondary fallback tier without stalling the user. After a cooldown, a single canary request probes for recovery.
            </div>
            <div className="p-4 rounded-2xl bg-gray-950/70 border border-white/5">
              <strong className="text-emerald-300 block mb-1">Batch Record Isolation:</strong> Corrupted items or schema mutations are isolated into validation rejection telemetry without failing the rest of the batch.
            </div>
          </div>
        </div>
      </div>

      {/* 3. Ethical and Stopping Boundary */}
      <div className="p-8 rounded-3xl mm-glass border border-rose-500/30 bg-rose-950/10 space-y-4">
        <div className="flex items-center gap-2.5">
          <Lock className="w-5 h-5 text-rose-400" />
          <h3 className="text-lg font-bold text-rose-300 font-sans">3. Technical & Ethical Stopping Boundary</h3>
        </div>
        <div className="text-xs text-gray-300 space-y-2 leading-relaxed font-normal">
          <p>
            In strict compliance with the assessment specification and engineering best practices, Sentinel defines an explicit operational boundary:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-400">
            <li><strong className="text-gray-200">Permitted & Implemented:</strong> Polite consumption of public structured REST endpoints, public RSS/XML feeds, controlled sandbox environments, jittered backoff, and transparent user-agent identification.</li>
            <li><strong className="text-rose-400 font-semibold">Strictly Prohibited & Excluded:</strong> CAPTCHA-solving services, anti-bot circumvention, credential stuffing/session hijacking, bypassing authentication barriers, account takeover, or violating authenticated Terms of Service.</li>
          </ul>
        </div>
      </div>

      {/* 4. DECISIONS.md Summary Viewer */}
      <div className="p-8 rounded-3xl mm-glass border border-white/10 space-y-4">
        <div className="flex items-center gap-2.5">
          <FileText className="w-5 h-5 text-orange-400" />
          <h3 className="text-lg font-bold text-white font-sans">4. Summary of DECISIONS.md (Architecture Rationale)</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-gray-950/70 border border-white/5">
            <span className="font-bold text-orange-400 block mb-1.5">1. Why this Ingestion Strategy?</span>
            <p className="text-gray-400 text-[11px]">
              Structured HTTP/REST and RSS connectors were chosen over headless browser automation because they are 10x faster, resource-efficient, deterministic, and highly testable.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-gray-950/70 border border-white/5">
            <span className="font-bold text-orange-400 block mb-1.5">2. Core Trade-off Under Time</span>
            <p className="text-gray-400 text-[11px]">
              We implemented deterministic source routing and stateful in-memory circuit breakers rather than a complex distributed Redis/Celery cluster to preserve understandability and clean interview explainability.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-gray-950/70 border border-white/5">
            <span className="font-bold text-orange-400 block mb-1.5">3. Where AI was Used</span>
            <p className="text-gray-400 text-[11px]">
              AI is restricted to an advisory Schema Drift Assistant proposing field mapping translations. The engine never allows AI to autonomously mutate production code.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
