import React from 'react';
import {
  X,
  BrainCircuit,
  Cpu,
  PenTool,
  Binary,
  CheckCircle2,
  CopyX,
  Target,
  Users2,
  TrendingUp,
  RefreshCw,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface AIEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIEngineModal: React.FC<AIEngineModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const engines = [
    {
      title: 'Multilingual Indic OCR Engine',
      subtitle: 'Printed Script Recognition',
      desc: 'Hybrid CRNN + ResNet architecture pre-trained on 22 official Indian languages including Devanagari, Telugu, Kannada, Tamil, Bengali.',
      icon: Cpu,
      status: 'Active',
      metric: '97.4% Char Accuracy'
    },
    {
      title: 'Handwriting Recognition (HTR)',
      subtitle: 'Manuscript & Cursive Ink Decoder',
      desc: 'Vision Transformer (TrOCR-Indic) fine-tuned on historical revenue manuscripts, Urdu land deeds, and colonial cadastral surveyor notes.',
      icon: PenTool,
      status: 'Active',
      metric: '91.8% Word Accuracy'
    },
    {
      title: 'NLP Entity Extraction (NER)',
      subtitle: 'Revenue Schema Entity Parsing',
      desc: 'Spatial LayoutLMv3 multimodal model detecting 2D document coordinates for Survey Number, Khata, Khasra, Owner Name, Extent & Boundary Schedule.',
      icon: Binary,
      status: 'Active',
      metric: '96.2% F1 Score'
    },
    {
      title: 'Document Classification',
      subtitle: 'Revenue Document Categorizer',
      desc: 'Automated 6-way classification distinguishing Form 1-B Pahani, Registered Sale Deeds, Mutation Extracts, Khasra Passbooks, and Cadastral FMB Maps.',
      icon: Target,
      status: 'Active',
      metric: '98.9% Precision'
    },
    {
      title: 'Data Validation Engine',
      subtitle: 'Mathematical & Cadastral Verification',
      desc: 'Deterministic validator cross-referencing sub-division acreage sums, metric-to-traditional unit conversions (Acres-Guntas / Hectares), and syntax.',
      icon: CheckCircle2,
      status: 'Active',
      metric: '100% Deterministic'
    },
    {
      title: 'Duplicate Detection Engine',
      subtitle: 'Encumbrance & Double-Sale Scanner',
      desc: 'Jaro-Winkler phonetic name matcher combined with GIS polygon intersection to immediately catch fraudulent duplicate registrations or overlapping deeds.',
      icon: CopyX,
      status: 'Active',
      metric: '99.1% Recall'
    },
    {
      title: 'Confidence Scoring & Explainability',
      subtitle: 'Per-Token Uncertainty Estimator',
      desc: 'Deep Bayesian uncertainty model generating token-level confidence scores and natural-language explanations for faded characters or ink blots.',
      icon: BrainCircuit,
      status: 'Active',
      metric: 'Calibrated Softmax'
    },
    {
      title: 'Human-in-the-Loop Active Learning',
      subtitle: 'Continuous Model Fine-Tuning',
      desc: 'Routes low-confidence fields to Tahsildar / Revenue verifiers. Approved human corrections are vectorized as training samples to retrain regional models.',
      icon: Users2,
      status: 'Active',
      metric: 'Self-Improving Loop'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-lg border border-slate-300 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0b1f3a] text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base font-serif text-white">
                Bhu-Abhilekh AI Processing Architecture & Continuous Learning
              </h3>
              <p className="text-xs text-slate-300">
                Government of India · DILRMP 2.0 Intelligent Land Records Modernization Framework
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Section 17: AI Learning Mechanism */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <h4 className="font-bold text-slate-900 text-sm">
                  AI Continuous Learning & Model Retraining Feedback Loop
                </h4>
              </div>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                Active Self-Supervised Loop
              </span>
            </div>

            {/* Metrics requested in Section 17 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className="bg-white p-3 rounded border border-amber-200 shadow-xs">
                <span className="text-[11px] text-slate-500 block uppercase font-mono">Records Processed</span>
                <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">12,458</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Across 6 States</span>
              </div>
              <div className="bg-white p-3 rounded border border-amber-200 shadow-xs">
                <span className="text-[11px] text-slate-500 block uppercase font-mono">Manual Corrections</span>
                <span className="text-xl font-bold text-amber-700 font-mono tabular-nums">843</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">By Revenue Officers</span>
              </div>
              <div className="bg-white p-3 rounded border border-amber-200 shadow-xs">
                <span className="text-[11px] text-slate-500 block uppercase font-mono">Model Improvement</span>
                <span className="text-xl font-bold text-emerald-600 font-mono tabular-nums flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1 inline" /> +8.4%
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Since v1.0 Baseline</span>
              </div>
              <div className="bg-white p-3 rounded border border-amber-200 shadow-xs">
                <span className="text-[11px] text-slate-500 block uppercase font-mono">Current Extraction</span>
                <span className="text-xl font-bold text-blue-900 font-mono tabular-nums">94.6%</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Average Accuracy</span>
              </div>
            </div>

            {/* Visual Feedback Explanation */}
            <div className="p-3 bg-white/90 rounded border border-amber-200/80 text-xs text-slate-700">
              <div className="flex items-center gap-2 mb-2 font-semibold text-slate-800">
                <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
                <span>How Human Verification Powers Model Improvement:</span>
              </div>
              <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-[11px] font-medium text-slate-600">
                <div className="p-2 bg-slate-50 rounded border border-slate-200 text-center flex-1">
                  1. Low-confidence OCR detected (&lt;75%)
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-amber-500 shrink-0 hidden md:block" />
                <div className="p-2 bg-slate-50 rounded border border-slate-200 text-center flex-1">
                  2. Routed to Tahsildar / Verifier Queue
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-amber-500 shrink-0 hidden md:block" />
                <div className="p-2 bg-slate-50 rounded border border-slate-200 text-center flex-1">
                  3. Verifier verifies/edits character value
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-amber-500 shrink-0 hidden md:block" />
                <div className="p-2 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded text-center flex-1 font-semibold">
                  4. Automated fine-tuning feedback dataset
                </div>
              </div>
              <p className="mt-2 text-[11px] text-slate-500 leading-relaxed">
                Every verified human correction generates a cryptographically signed training pair. Weekly model retraining checkpoints continuously adapt to regional handwriting idiosyncrasies, local village boundary notation patterns, and aged ink degradation.
              </p>
            </div>
          </div>

          {/* Section 16: AI 8-Engine Subsystems */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-3">
              8 Core AI Subsystems in BhoomiSetu
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {engines.map((eng, idx) => {
                const Icon = eng.icon;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors bg-white flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded bg-blue-50 text-blue-900 border border-blue-100">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h5 className="font-bold text-slate-900 text-xs">{eng.title}</h5>
                            <span className="text-[10px] text-slate-500">{eng.subtitle}</span>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                          {eng.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed mb-2">{eng.desc}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-400">Benchmark Metric:</span>
                      <span className="font-bold text-blue-900">{eng.metric}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-[#0b1f3a] text-white hover:bg-slate-800 text-xs font-semibold transition-colors"
          >
            Close Architecture Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
