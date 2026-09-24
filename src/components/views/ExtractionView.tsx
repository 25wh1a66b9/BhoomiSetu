import React, { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  Send,
  AlertTriangle,
  CheckCircle,
  FileText,
  Search,
  ChevronDown,
  Layers,
  ArrowRight,
  Edit2,
  Check,
  ShieldAlert,
  Phone,
  ShieldCheck
} from 'lucide-react';
import { LandRecord, ExtractedField } from '../../types/landRecord';
import { DocumentViewer } from '../DocumentViewer';
import { CustomerCareModal } from '../CustomerCareModal';

interface ExtractionViewProps {
  currentRecord: LandRecord;
  onUpdateRecord: (updatedRecord: LandRecord) => void;
  onSendToVerification: (recordId: string, remarks?: string) => void;
  onNavigateToValidation: (recordId: string) => void;
  allRecords: LandRecord[];
  onSelectRecord: (recordId: string) => void;
}

export const ExtractionView: React.FC<ExtractionViewProps> = ({
  currentRecord,
  onUpdateRecord,
  onSendToVerification,
  onNavigateToValidation,
  allRecords,
  onSelectRecord
}) => {
  const [selectedFieldKey, setSelectedFieldKey] = useState<string>('surveyNumber');
  const [showBoundingBoxes, setShowBoundingBoxes] = useState<boolean>(true);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [editingFieldKey, setEditingFieldKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [verificationSent, setVerificationSent] = useState<boolean>(false);
  const [isCustomerCareOpen, setIsCustomerCareOpen] = useState<boolean>(false);

  // Filter confidence tiers for Section 6
  const fields = currentRecord.extractedFields;
  const highConfidence = fields.filter((f) => f.confidence >= 90);
  const medConfidence = fields.filter((f) => f.confidence >= 75 && f.confidence < 90);
  const lowConfidence = fields.filter((f) => f.confidence < 75);

  const handleRunAIExtraction = () => {
    setIsExtracting(true);
    setTimeout(() => {
      setIsExtracting(false);
    }, 1200);
  };

  const handleStartEdit = (field: ExtractedField) => {
    setEditingFieldKey(field.key);
    setEditValue(field.value);
  };

  const handleSaveEdit = (fieldKey: string) => {
    const updatedFields = currentRecord.extractedFields.map((f) => {
      if (f.key === fieldKey) {
        return {
          ...f,
          value: editValue,
          confidence: 100, // human-edited confidence is 100%
          needsReview: false
        };
      }
      return f;
    });

    const updatedRecord: LandRecord = {
      ...currentRecord,
      extractedFields: updatedFields,
      // update top-level field if matched
      ...(fieldKey in currentRecord ? { [fieldKey]: editValue } : {})
    };

    onUpdateRecord(updatedRecord);
    setEditingFieldKey(null);
  };

  const handleSendToHumanQueue = () => {
    onSendToVerification(currentRecord.id, 'Low confidence characters & area discrepancy sent to verification queue.');
    setVerificationSent(true);
    setTimeout(() => setVerificationSent(false), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Top Controls & Record Switcher */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase bg-blue-900 text-white px-2 py-0.5 rounded font-bold">
                MULTIMODAL AI EXTRACTOR
              </span>
              <span className="text-xs text-slate-500">Record: <strong>{currentRecord.id}</strong></span>
              <span className="text-xs font-semibold px-2 py-0.2 rounded border bg-amber-50 text-amber-800 border-amber-200">
                {currentRecord.documentType}
              </span>
            </div>
            <div className="text-xs text-slate-700 mt-1 font-medium">
              Owner: <strong>{currentRecord.ownerName}</strong> · Survey: <span className="font-mono">{currentRecord.surveyNumber}</span> · Village: {currentRecord.village} ({currentRecord.district})
            </div>
          </div>
        </div>

        {/* Switch Record & Extraction Run Button */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <select
              value={currentRecord.id}
              onChange={(e) => onSelectRecord(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 font-mono font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {allRecords.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.id} ({r.village} - {r.surveyNumber})
                </option>
              ))}
            </select>
          </div>

          {currentRecord.status === 'Verified' && (
            <button
              onClick={() => setIsCustomerCareOpen(true)}
              className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              title="Customer Care & Contact Verified Owner"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Contact Owner</span>
            </button>
          )}

          <button
            onClick={handleRunAIExtraction}
            disabled={isExtracting}
            className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            {isExtracting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Extracting...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Run AI Extraction
              </>
            )}
          </button>

          <button
            onClick={() => onNavigateToValidation(currentRecord.id)}
            className="px-3 py-1.5 rounded bg-[#0b1f3a] hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1 transition-colors shadow-xs"
          >
            Go to Validation
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Split-Screen Interface (Section 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[780px]">
        {/* LEFT SIDE: Scanned Document Preview (5 cols on lg) */}
        <div className="lg:col-span-6 h-full flex flex-col">
          <DocumentViewer
            record={currentRecord}
            selectedFieldKey={selectedFieldKey}
            onSelectField={(key) => setSelectedFieldKey(key)}
            showBoundingBoxes={showBoundingBoxes}
            onToggleBoundingBoxes={() => setShowBoundingBoxes(!showBoundingBoxes)}
          />
        </div>

        {/* RIGHT SIDE: Extracted Structured Information (7 cols on lg) */}
        <div className="lg:col-span-6 h-full flex flex-col bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          {/* Header */}
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono">
                Structured Revenue Attributes (18 Fields Extracted)
              </h3>
              <p className="text-[11px] text-slate-500">
                LayoutLMv3 Spatial NER · Indic script dual translation
              </p>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="flex items-center gap-1 text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> &gt;90%
              </span>
              <span className="flex items-center gap-1 text-amber-700">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> 75–89%
              </span>
              <span className="flex items-center gap-1 text-red-700">
                <span className="w-2 h-2 rounded-full bg-red-500" /> &lt;75%
              </span>
            </div>
          </div>

          {/* Scrollable Fields Grid */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
            {isExtracting ? (
              <div className="h-full flex flex-col items-center justify-center space-y-3 py-16">
                <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
                <div className="text-center">
                  <p className="font-bold text-slate-800 text-sm">Running Indic LayoutLMv3 Extraction...</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Aligning character bounding coordinates with Revenue Form 1-B schema
                  </p>
                </div>
              </div>
            ) : (
              fields.map((field) => {
                const isSelected = selectedFieldKey === field.key;
                const isEditing = editingFieldKey === field.key;
                const isHigh = field.confidence >= 90;
                const isMed = field.confidence >= 75 && field.confidence < 90;
                const isLow = field.confidence < 75;

                return (
                  <div
                    key={field.key}
                    onClick={() => setSelectedFieldKey(field.key)}
                    className={`py-2.5 px-3 rounded-md transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/70 border border-blue-200'
                        : isLow
                        ? 'bg-red-50/40 hover:bg-red-50/70'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-slate-600">
                            {field.label}
                          </span>
                          {field.needsReview && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-red-100 text-red-800 border border-red-300 font-mono">
                              Needs Review
                            </span>
                          )}
                        </div>

                        {/* Value Display / Inline Edit */}
                        {isEditing ? (
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="text-xs font-semibold text-slate-900 border border-blue-400 rounded px-2 py-1 w-full bg-white focus:outline-none"
                              autoFocus
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSaveEdit(field.key);
                              }}
                              className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                              title="Save verified value"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="mt-0.5 flex items-baseline gap-2">
                            <span className="text-xs font-bold text-slate-900">{field.value}</span>
                            {field.regionalValue && (
                              <span className="text-[11px] text-slate-500 font-serif italic">
                                ({field.regionalValue})
                              </span>
                            )}
                          </div>
                        )}

                        {/* Explainability Reason if Low Confidence */}
                        {field.reviewReason && (
                          <p className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200/80 rounded px-2 py-1 mt-1 leading-snug">
                            <strong>AI Root Cause:</strong> {field.reviewReason}
                          </p>
                        )}
                      </div>

                      {/* Right: Confidence Badge & Edit Action */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`font-mono text-xs font-bold px-2 py-0.5 rounded border tabular-nums ${
                            isHigh
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : isMed
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-red-50 text-red-700 border-red-200 animate-pulse'
                          }`}
                        >
                          {field.confidence}%
                        </span>

                        {!isEditing && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartEdit(field);
                            }}
                            className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700 transition-colors"
                            title="Correct / verify field"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Section 6: AI Confidence Analysis Box at Bottom */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                AI Confidence Analysis
              </span>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-emerald-700 font-semibold">
                  High: <strong>{highConfidence.length}</strong>
                </span>
                <span className="text-amber-700 font-semibold">
                  Medium: <strong>{medConfidence.length}</strong>
                </span>
                <span className="text-red-700 font-bold">
                  Low: <strong>{lowConfidence.length}</strong>
                </span>
              </div>
            </div>

            {lowConfidence.length > 0 ? (
              <div className="bg-red-50/70 border border-red-200 rounded p-2 text-xs text-red-900 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>
                    Uncertain characters detected: <strong>{lowConfidence.map((l) => `${l.label} (${l.confidence}%)`).join(', ')}</strong>
                  </span>
                </div>
                <button
                  onClick={handleSendToHumanQueue}
                  className="px-2.5 py-1 rounded bg-red-700 hover:bg-red-800 text-white font-bold text-[10px] shrink-0 transition-colors flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  {verificationSent ? 'Sent to Queue!' : 'Send to Human Verification'}
                </button>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded p-2 text-xs text-emerald-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[11px]">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  All extracted fields meet 75%+ statistical threshold for legal registration.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Care & Verified Pattadar Modal */}
      <CustomerCareModal
        isOpen={isCustomerCareOpen}
        onClose={() => setIsCustomerCareOpen(false)}
        record={currentRecord}
      />
    </div>
  );
};
