import React, { useState } from 'react';
import {
  Upload,
  SlidersHorizontal,
  FileText,
  PenTool,
  Brain,
  Tag,
  CheckCheck,
  Percent,
  UserCheck,
  Database,
  MapPin,
  ChevronRight,
  Info,
  X
} from 'lucide-react';

export interface WorkflowStage {
  id: string;
  name: string;
  shortName: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  engine: string;
  model: string;
  accuracy: string;
  indicSupport: string;
}

export const WORKFLOW_STAGES: WorkflowStage[] = [
  {
    id: 'upload',
    name: 'Document Upload',
    shortName: 'Upload',
    icon: Upload,
    description: 'Ingestion of scanned physical records (PDF, TIFF, JPG) from District Registrar & Tahsildar offices.',
    engine: 'Multi-format Ingestion Buffer',
    model: 'MIME Auto-Detect & DPI Normalizer',
    accuracy: '100% Fidelity',
    indicSupport: 'All Regional Archives'
  },
  {
    id: 'preprocess',
    name: 'Image Pre-processing',
    shortName: 'Pre-process',
    icon: SlidersHorizontal,
    description: 'Deskewing, Sauvola adaptive binarization, bleed-through reduction, and crease removal on aged parchment.',
    engine: 'OpenCV Computer Vision Pipeline',
    model: 'U-Net Document Cleaner + Morphological Filters',
    accuracy: '+28% OCR legibility boost',
    indicSupport: 'Preserves Matras & Diacritics'
  },
  {
    id: 'ocr',
    name: 'Multilingual OCR',
    shortName: 'Indic OCR',
    icon: FileText,
    description: 'Printed character recognition across Devanagari, Telugu, Kannada, Tamil, Bengali scripts and Latin.',
    engine: 'IndicOCR Hybrid Engine',
    model: 'CRNN + ResNet-50 + CTC Beam Search',
    accuracy: '97.4% on 300 DPI text',
    indicSupport: '22 Official Indian Languages'
  },
  {
    id: 'htr',
    name: 'Handwriting Recognition',
    shortName: 'Handwriting HTR',
    icon: PenTool,
    description: 'Decoding cursive ink notations, archaic revenue Urdu/Modi script marginalia, and Tahsildar signatures.',
    engine: 'TrOCR Vision-Transformer',
    model: 'TrOCR-Indic fine-tuned on National Archives Manuscripts',
    accuracy: '91.8% on historical handwritten ink',
    indicSupport: 'Telugu, Marathi, Hindi, Urdu'
  },
  {
    id: 'nlp',
    name: 'NLP Field Extraction',
    shortName: 'Field Extraction',
    icon: Brain,
    description: 'Named Entity Recognition (NER) for Khata, Khasra, Pattedar Name, Extent in Acres/Guntas, and boundaries.',
    engine: 'Spatial LayoutLMv3 Architecture',
    model: 'LayoutLMv3-Indic fine-tuned on Revenue Form 1-B & Deeds',
    accuracy: '96.2% F1 Score',
    indicSupport: 'Cross-lingual Indian Revenue Ontology'
  },
  {
    id: 'classification',
    name: 'Data Classification',
    shortName: 'Classification',
    icon: Tag,
    description: 'Categorizes land tenure (Pattedar, Ryotwari, Inam, Poramboke) and soil types (Khushki, Tari, Baghayat).',
    engine: 'Revenue Document Classifier',
    model: 'DistilRoBERTa-Legal-IN Multi-class',
    accuracy: '98.1% Precision',
    indicSupport: 'Revenue Tenurial Classifications'
  },
  {
    id: 'validation',
    name: 'Data Validation',
    shortName: 'Validation',
    icon: CheckCheck,
    description: 'Rule-based verification checking survey number syntax, mathematical area conversion, and mother parcel consistency.',
    engine: 'DILRMP Rule Engine Daemon',
    model: 'Deterministic Constraint Satisfaction + SRO Match',
    accuracy: '100% Deterministic',
    indicSupport: 'Metric & Traditional Land Units'
  },
  {
    id: 'confidence',
    name: 'Confidence Scoring',
    shortName: 'Confidence',
    icon: Percent,
    description: 'Computes field-level probability scores and generates explainability notes for uncertain characters.',
    engine: 'Bayesian Uncertainty Estimator',
    model: 'Token-level Softmax + Geometric Positional Weighting',
    accuracy: 'Calibrated Confidence Metric',
    indicSupport: 'Per-field Confidence'
  },
  {
    id: 'human',
    name: 'Human Verification',
    shortName: 'Human Review',
    icon: UserCheck,
    description: 'Routes low-confidence fields (<75%) and cadastral discrepancies to Tahsildars/RDOs for manual validation.',
    engine: 'Human-in-the-Loop (HITL) Queue',
    model: 'Interactive Side-by-Side Review Workstation',
    accuracy: 'Zero-Discrepancy Assurance',
    indicSupport: 'Bilingual Review Interface'
  },
  {
    id: 'digital',
    name: 'Digital Land Record',
    shortName: 'Digital RoR',
    icon: Database,
    description: 'Generates immutable digital Record of Rights (Pahani/Patta) with cryptographic SHA-256 seal and e-Sign.',
    engine: 'National Land Record Repository',
    model: 'JSON-LD + XML Interoperable Schema',
    accuracy: 'Auditable & Tamper-proof',
    indicSupport: 'English & Regional Bilingual Patta'
  },
  {
    id: 'gis',
    name: 'GIS / Government DB',
    shortName: 'GIS Integration',
    icon: MapPin,
    description: 'Links spatial cadastral parcel geometries into Bhunaksha / DILRMP GIS and state Dharani/Bhoomi registries.',
    engine: 'OGC WFS/WMS Spatial Service',
    model: 'Survey of India Benchmark Geo-referencing',
    accuracy: 'Sub-meter Parcel Topology',
    indicSupport: 'EPSG:4326 / State Grid Projections'
  }
];

interface AIWorkflowBannerProps {
  currentStageId?: string;
  onSelectStage?: (stageId: string) => void;
}

export const AIWorkflowBanner: React.FC<AIWorkflowBannerProps> = ({
  currentStageId,
  onSelectStage
}) => {
  const [selectedStage, setSelectedStage] = useState<WorkflowStage | null>(null);

  const activeStage = selectedStage || (currentStageId ? WORKFLOW_STAGES.find((s) => s.id === currentStageId) : null);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
            AI PROCESSING WORKFLOW PIPELINE
          </span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            · End-to-end autonomous digitization & human-assisted validation flow
          </span>
        </div>
        <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-medium">
          Click any step to inspect AI model & engine details
        </span>
      </div>

      {/* Horizontal Flow Container with Scroll */}
      <div className="relative overflow-x-auto pb-1.5 pt-1">
        <div className="flex items-center gap-1.5 min-w-max">
          {WORKFLOW_STAGES.map((stage, index) => {
            const Icon = stage.icon;
            const isSelected = activeStage?.id === stage.id;
            const isCurrent = currentStageId === stage.id;

            return (
              <React.Fragment key={stage.id}>
                <button
                  onClick={() => {
                    setSelectedStage(isSelected ? null : stage);
                    if (onSelectStage) onSelectStage(stage.id);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-left transition-all ${
                    isSelected
                      ? 'bg-[#0f2c59] text-white border-[#0f2c59] ring-2 ring-amber-400 shadow-sm'
                      : isCurrent
                      ? 'bg-amber-500/10 border-amber-400 text-slate-900 font-semibold'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950'
                        : isCurrent
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isSelected ? 'text-amber-300' : 'text-slate-500'
                    }`}
                  />
                  <span className="text-xs font-medium whitespace-nowrap">{stage.shortName}</span>
                </button>

                {index < WORKFLOW_STAGES.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Expanded Stage Detail Drawer */}
      {activeStage && (
        <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-md relative text-xs">
          <button
            onClick={() => setSelectedStage(null)}
            className="absolute right-2 top-2 p-1 text-slate-400 hover:text-slate-700"
            title="Close step detail"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-900 text-white font-mono text-[10px] font-bold">
                STAGE #{WORKFLOW_STAGES.findIndex((s) => s.id === activeStage.id) + 1}
              </span>
              <h4 className="font-bold text-slate-900 text-sm">{activeStage.name}</h4>
            </div>
            <div className="text-[11px] text-slate-600">
              Target Architecture: <strong className="text-slate-900">{activeStage.engine}</strong>
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed mb-3">{activeStage.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white p-2 rounded border border-slate-200 font-mono text-[11px]">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Underlying AI Model</span>
              <span className="font-semibold text-slate-800">{activeStage.model}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Demonstrated Metric</span>
              <span className="font-semibold text-emerald-700">{activeStage.accuracy}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Indic Script Compliance</span>
              <span className="font-semibold text-blue-800">{activeStage.indicSupport}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
