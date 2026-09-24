import React, { useState } from 'react';
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  FolderOpen,
  Eye,
  FileCheck
} from 'lucide-react';
import { DocumentType, LanguageCode, LandRecord } from '../../types/landRecord';
import { SAMPLE_PRESET_DOCUMENTS, LANGUAGE_OPTIONS } from '../../data/mockData';
import { DocumentViewer } from '../DocumentViewer';

interface UploadViewProps {
  onRecordCreated: (newRecord: LandRecord) => void;
  onNavigateToExtraction: (recordId: string) => void;
  records: LandRecord[];
}

export const UploadView: React.FC<UploadViewProps> = ({
  onRecordCreated,
  onNavigateToExtraction,
  records
}) => {
  const [docType, setDocType] = useState<DocumentType>('ROR / Record of Rights');
  const [language, setLanguage] = useState<LanguageCode>('te');
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<number>(0);
  const [processedRecord, setProcessedRecord] = useState<LandRecord | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const documentTypes: DocumentType[] = [
    'Sale Deed',
    'ROR / Record of Rights',
    'Mutation Record',
    'Survey Record',
    'Cadastral Map',
    'Other'
  ];

  const processingSteps = [
    { label: 'Document Pre-processing', detail: 'Adaptive Binarization, Deskewing, Noise Reduction' },
    { label: 'Multilingual Indic OCR', detail: 'CRNN + TrOCR Devanagari & Telugu Script Ingestion' },
    { label: 'NLP Field Extraction', detail: 'LayoutLMv3 Named Entity Recognition (Khasra, Area, Khata)' },
    { label: 'Cadastral & SRO Validation', detail: 'Cross-referencing Sub-division Acreage & Title Registry' },
    { label: 'Confidence & Anomaly Scoring', detail: 'Generating Per-field Confidence & Audit Hash' }
  ];

  const handleSelectPreset = (preset: typeof SAMPLE_PRESET_DOCUMENTS[0]) => {
    setActivePreset(preset.id);
    setDocType(preset.type);
    setLanguage(preset.language);
    setSelectedFile({
      name: `${preset.title.replace(/\s+/g, '_').toLowerCase()}.tiff`,
      size: '2.4 MB'
    });
    setProcessedRecord(null);
    setProcessingStep(0);
  };

  const handleSimulateUpload = () => {
    if (!selectedFile && !activePreset) {
      // Pick default preset if none selected
      handleSelectPreset(SAMPLE_PRESET_DOCUMENTS[0]);
    }

    setIsProcessing(true);
    setProcessingStep(1);

    // Stepped progression
    const t1 = setTimeout(() => setProcessingStep(2), 700);
    const t2 = setTimeout(() => setProcessingStep(3), 1500);
    const t3 = setTimeout(() => setProcessingStep(4), 2200);
    const t4 = setTimeout(() => setProcessingStep(5), 2900);
    const t5 = setTimeout(() => {
      setIsProcessing(false);
      // Link to appropriate existing record or create dynamic
      const match = records.find((r) => r.id === (activePreset ? SAMPLE_PRESET_DOCUMENTS.find(p => p.id === activePreset)?.recordDataId : 'LR-1001')) || records[0];
      setProcessedRecord(match);
    }, 3600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  };

  return (
    <div className="space-y-6">
      {/* Title & Guidance */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded font-bold">
                BATCH INGESTION WORKSTATION
              </span>
              <span className="text-xs text-slate-500">Supported Formats: PDF, JPG, PNG, TIFF</span>
            </div>
            <h2 className="text-xl font-bold font-serif text-slate-900">Upload Land Record</h2>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Upload scanned historical revenue registers, 1-B Pahani folios, registered sale deeds, or village cadastral survey maps for automated Indic OCR, handwriting decipherment, and cadastral cross-validation.
            </p>
          </div>

          {/* Quick Preset Selector for Live SIH Presentation */}
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-md max-w-xs shrink-0 text-xs">
            <span className="font-bold text-amber-900 block mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Demo Hackathon Quick-Load:
            </span>
            <p className="text-[11px] text-amber-800 leading-tight mb-2">
              Select an authentic legacy archive sample for instant demonstration:
            </p>
            <div className="space-y-1">
              {SAMPLE_PRESET_DOCUMENTS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`w-full text-left px-2 py-1 rounded text-[11px] truncate font-medium transition-all ${
                    activePreset === preset.id
                      ? 'bg-amber-600 text-white font-semibold'
                      : 'bg-white hover:bg-amber-100 text-slate-700 border border-amber-200'
                  }`}
                >
                  {preset.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Upload Grid: Config + Drag and Drop Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Upload Form Parameters (1 Col) */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
            Record Ingestion Metadata
          </h3>

          {/* Document Type Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Document Type <span className="text-red-500">*</span>
            </label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value as DocumentType)}
              className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
            >
              {documentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <span className="text-[10px] text-slate-500 mt-1 block">
              Directs LayoutLMv3 spatial template for revenue schema alignment.
            </span>
          </div>

          {/* Language Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Primary Document Script / Language <span className="text-red-500">*</span>
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
            >
              {LANGUAGE_OPTIONS.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.native} ({lang.label})
                </option>
              ))}
              <option value="other">Other Indic Script</option>
            </select>
            <span className="text-[10px] text-slate-500 mt-1 block">
              Initializes TrOCR-Indic lexicon and conjunct consonant glyph sets.
            </span>
          </div>

          {/* Archival Resolution Quality */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Source Scan Quality
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 border border-emerald-300 bg-emerald-50/50 rounded text-emerald-800 font-semibold flex items-center justify-between">
                <span>300 DPI</span>
                <span className="text-[10px]">Optimal</span>
              </div>
              <div className="p-2 border border-slate-200 bg-slate-50 rounded text-slate-600 flex items-center justify-between">
                <span>Greyscale / Color</span>
                <span className="text-[10px]">TIFF</span>
              </div>
            </div>
          </div>

          {/* Ingestion Action */}
          <div className="pt-2">
            <button
              onClick={handleSimulateUpload}
              disabled={isProcessing}
              className={`w-full py-2.5 px-4 rounded-md font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm ${
                isProcessing
                  ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                  : 'bg-[#0b1f3a] hover:bg-slate-800 text-white'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                  Processing Pipeline Active...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Start AI Digitization Pipeline
                </>
              )}
            </button>
          </div>
        </div>

        {/* Drag and Drop Zone & Preview (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Dropzone Container */}
          <div
            onClick={() => {
              if (!selectedFile) handleSelectPreset(SAMPLE_PRESET_DOCUMENTS[0]);
            }}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
              selectedFile
                ? 'border-blue-500 bg-blue-50/20'
                : 'border-slate-300 hover:border-amber-500 hover:bg-slate-50'
            }`}
          >
            <div className="max-w-md mx-auto flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-blue-900 mb-3 border border-slate-200">
                <Upload className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">
                Drag and drop your land record document here
              </h4>
              <p className="text-xs text-slate-500 mb-3">
                Or click to browse from local workstation. Accepts single or multi-page PDF, TIFF, JPG, PNG.
              </p>

              {selectedFile ? (
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded border border-blue-300 shadow-xs text-xs font-mono text-blue-900">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold">{selectedFile.name}</span>
                  <span className="text-slate-400">({selectedFile.size})</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span>Max file size: 50 MB</span>
                  <span>·</span>
                  <span>Auto-despeckling enabled</span>
                </div>
              )}
            </div>
          </div>

          {/* Stepped Processing Progress Tracker */}
          {isProcessing && (
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                  Autonomous Ingestion Pipeline Running
                </h4>
                <span className="font-mono text-xs font-bold text-blue-900">
                  Step {processingStep} of 5
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  style={{ width: `${(processingStep / 5) * 100}%` }}
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                />
              </div>

              {/* Step checklist */}
              <div className="space-y-2 pt-2">
                {processingSteps.map((step, idx) => {
                  const stepNum = idx + 1;
                  const isDone = processingStep > stepNum;
                  const isCurrent = processingStep === stepNum;

                  return (
                    <div
                      key={idx}
                      className={`flex items-start gap-2.5 p-2 rounded text-xs transition-all ${
                        isCurrent
                          ? 'bg-amber-50 border border-amber-200 font-semibold text-amber-950'
                          : isDone
                          ? 'text-slate-700 font-medium'
                          : 'text-slate-400'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : isCurrent ? (
                        <RefreshCw className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-mono">
                          {stepNum}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span>{step.label}</span>
                          {isDone && (
                            <span className="text-[10px] text-emerald-700 font-mono">Completed</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 leading-tight mt-0.5 font-sans">
                          {step.detail}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Final Result Card when Complete */}
          {processedRecord && !isProcessing && (
            <div className="bg-emerald-50/70 border border-emerald-300 rounded-lg p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-950 text-sm">
                      Document Successfully Digitized & Validated
                    </h4>
                    <span className="text-[11px] text-emerald-800 font-mono">
                      Generated Record ID: <strong>{processedRecord.id}</strong> ({processedRecord.documentType})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-white text-emerald-800 border border-emerald-300">
                    Confidence: {processedRecord.overallConfidence}%
                  </span>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-white text-blue-900 border border-blue-200">
                    Score: {processedRecord.validationScore}/100
                  </span>
                </div>
              </div>

              {/* Quick Summary of Extracted Data */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3 rounded-md border border-emerald-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Owner / Pattedar</span>
                  <span className="font-bold text-slate-900">{processedRecord.ownerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Survey & Sub-div</span>
                  <span className="font-bold text-blue-900 font-mono">{processedRecord.surveyNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Extent / Area</span>
                  <span className="font-bold text-slate-900 font-mono">{processedRecord.area}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Village / District</span>
                  <span className="font-bold text-slate-900 truncate block">
                    {processedRecord.village}, {processedRecord.district.split('/')[0]}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <button
                  onClick={() => {
                    setProcessedRecord(null);
                    setSelectedFile(null);
                  }}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Upload Another Document
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigateToExtraction(processedRecord.id)}
                    className="px-4 py-2 rounded-md bg-[#0b1f3a] hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    View in Split-Screen AI Extraction
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
