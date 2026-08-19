import React from 'react';
import { X, Sparkles, ArrowRight, Code2, ShieldCheck } from 'lucide-react';
import { DriftDiagnosisResponse } from '../types';

interface DriftDiagnosisModalProps {
  diagnosis: DriftDiagnosisResponse | null;
  loading: boolean;
  onClose: () => void;
}

export const DriftDiagnosisModal: React.FC<DriftDiagnosisModalProps> = ({
  diagnosis,
  loading,
  onClose,
}) => {
  if (!diagnosis && !loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto mm-glass-glow-purple rounded-3xl p-7 sm:p-9 border border-purple-500/40">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-gray-400 hover:text-white bg-gray-900/80 hover:bg-gray-800 border border-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3.5 mb-2">
          <div className="w-11 h-11 rounded-2xl bg-purple-950/80 border border-purple-500/50 flex items-center justify-center shadow-lg shadow-purple-950/50">
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white font-sans">AI Schema Drift Diagnostic Assistant</h2>
            <p className="text-xs text-gray-300">
              Structural mutation analysis, confidence-scored field migrations, and adapter patch proposals.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-400 space-y-3">
            <Sparkles className="w-9 h-9 text-purple-400 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-gray-200">Analyzing schema variance & semantic embeddings...</p>
          </div>
        ) : diagnosis ? (
          <div className="mt-6 space-y-6">
            {/* Model & Source Meta */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-purple-950/40 border border-purple-800/40 text-xs">
              <span className="text-gray-300">
                Target Source: <strong className="text-purple-300 font-mono">{diagnosis.source_name}</strong>
              </span>
              <span className="text-purple-300 font-mono text-[11px] bg-purple-900/60 px-3 py-1 rounded-full border border-purple-700/50 font-bold">
                Engine: {diagnosis.model_used}
              </span>
            </div>

            {/* Diagnostic Summary */}
            <div className="p-5 rounded-2xl bg-gray-950/70 border border-white/10 text-xs text-gray-300 leading-relaxed font-normal">
              <strong className="text-gray-100 block mb-1.5 font-bold uppercase tracking-wider text-[11px]">
                Diagnostic Evaluation:
              </strong>
              {diagnosis.analysis}
            </div>

            {/* Suggested Field Mappings */}
            <div>
              <h4 className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider mb-3.5">
                Proposed Canonical Field Mappings
              </h4>

              <div className="space-y-3">
                {diagnosis.suggested_mappings.map((mapping, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl mm-glass border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2.5 py-0.5 rounded-md bg-rose-500/10 text-rose-400 font-mono font-bold border border-rose-500/20">
                          {mapping.canonical_field} (expected)
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-mono font-bold border border-emerald-500/20">
                          {mapping.suggested_source_field} (observed)
                        </span>
                      </div>
                      <p className="text-gray-400 text-[11px] mt-1">{mapping.reasoning}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-gray-500 block uppercase font-mono">Confidence</span>
                      <span className="text-base font-extrabold font-mono text-cyan-400">
                        {Math.round(mapping.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Generated Adapter Patch Proposal */}
            {diagnosis.suggested_adapter_patch && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Code2 className="w-4 h-4 text-purple-400" />
                  <h4 className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
                    Recommended Adapter Normalizer Patch (Advisory)
                  </h4>
                </div>
                <pre className="p-4 rounded-2xl bg-black/80 border border-white/10 text-[11px] font-mono text-emerald-300 overflow-x-auto">
                  {diagnosis.suggested_adapter_patch}
                </pre>
              </div>
            )}

            {/* Architectural Safety Statement */}
            <div className="p-4 rounded-2xl bg-gray-950/60 border border-white/5 text-xs text-gray-400 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                <strong>Architectural Boundary:</strong> Sentinel AI operates strictly as an advisory diagnostic assistant. Production code is never mutated autonomously.
              </span>
            </div>
          </div>
        ) : null}

        {/* Footer */}
        <div className="mt-7 pt-5 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors cursor-pointer border border-white/10"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
