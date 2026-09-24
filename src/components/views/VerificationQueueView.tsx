import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit3,
  Check,
  X,
  Save,
  FileText,
  Filter,
  Layers,
  Search,
  ChevronRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { LandRecord } from '../../types/landRecord';
import { DocumentViewer } from '../DocumentViewer';

interface VerificationQueueViewProps {
  records: LandRecord[];
  onUpdateRecord: (updatedRecord: LandRecord) => void;
  onApproveRecord: (recordId: string) => void;
  onRejectRecord: (recordId: string, remarks?: string) => void;
}

export const VerificationQueueView: React.FC<VerificationQueueViewProps> = ({
  records,
  onUpdateRecord,
  onApproveRecord,
  onRejectRecord
}) => {
  // Low confidence (<85%) or Needs Review or Pending
  const reviewRecords = records.filter(
    (r) => r.status === 'Needs Review' || r.status === 'Pending' || r.overallConfidence < 85
  );

  const [activeReviewRecord, setActiveReviewRecord] = useState<LandRecord | null>(
    reviewRecords.length > 0 ? reviewRecords[0] : null
  );
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [editableForm, setEditableForm] = useState<Record<string, string>>({});
  const [verificationComment, setVerificationComment] = useState<string>('');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const openReviewModal = (record: LandRecord) => {
    setActiveReviewRecord(record);
    const formVals: Record<string, string> = {
      ownerName: record.ownerName,
      surveyNumber: record.surveyNumber,
      area: record.area,
      village: record.village,
      mandalTehsil: record.mandalTehsil,
      district: record.district,
      mutationNumber: record.mutationNumber,
      landClassification: record.landClassification
    };
    setEditableForm(formVals);
    setVerificationComment('Verified against physical Sub-Registrar volume and surveyor tippon.');
    setIsReviewModalOpen(true);
  };

  const handleSaveVerification = () => {
    if (!activeReviewRecord) return;

    const updated: LandRecord = {
      ...activeReviewRecord,
      ownerName: editableForm.ownerName || activeReviewRecord.ownerName,
      surveyNumber: editableForm.surveyNumber || activeReviewRecord.surveyNumber,
      area: editableForm.area || activeReviewRecord.area,
      village: editableForm.village || activeReviewRecord.village,
      mandalTehsil: editableForm.mandalTehsil || activeReviewRecord.mandalTehsil,
      district: editableForm.district || activeReviewRecord.district,
      mutationNumber: editableForm.mutationNumber || activeReviewRecord.mutationNumber,
      status: 'Verified',
      overallConfidence: 100, // human verified
      validationScore: 98,
      notes: verificationComment
    };

    onUpdateRecord(updated);
    setSaveToast(`Record ${updated.id} successfully verified & approved!`);
    setIsReviewModalOpen(false);
    setTimeout(() => setSaveToast(null), 3500);
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded font-bold">
              HUMAN-IN-THE-LOOP WORKSTATION
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Queue Backlog: <strong>{reviewRecords.length} Documents</strong>
            </span>
          </div>
          <h2 className="text-lg font-bold font-serif text-slate-900">
            Tahsildar & Revenue Verification Queue
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Manual adjudication queue for records with OCR uncertainty, area discrepancies, or boundary stone alerts.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="bg-red-50 text-red-800 border border-red-200 px-2.5 py-1 rounded font-mono font-bold">
            High Priority: {reviewRecords.filter((r) => r.overallConfidence < 75).length}
          </span>
          <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded font-mono font-bold">
            Medium: {reviewRecords.filter((r) => r.overallConfidence >= 75).length}
          </span>
        </div>
      </div>

      {saveToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-md text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Verification Queue Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono">
            Pending Adjudication Cases
          </h3>
          <span className="text-xs text-slate-500 font-sans">
            Click <strong>Review</strong> to open split-screen verification workstation
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="px-4 py-3">Record ID</th>
                <th className="px-4 py-3">Owner / Pattedar</th>
                <th className="px-4 py-3">Survey No.</th>
                <th className="px-4 py-3 text-right">Confidence</th>
                <th className="px-4 py-3">Primary Issue / Alert</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {reviewRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No pending verification records. All documents validated!
                  </td>
                </tr>
              ) : (
                reviewRecords.map((rec) => {
                  const issueText =
                    rec.id === 'LR-1002'
                      ? 'Character "3B" faded at crease; Area 1.78 Ac differs from mother parcel share.'
                      : rec.id === 'LR-1004'
                      ? 'Cadastral polygon stone coordinates blurry; unit conversion confirmation needed.'
                      : 'Low character confidence score on marginalia notations.';

                  return (
                    <tr key={rec.id} className="hover:bg-amber-50/40 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-blue-900">
                        {rec.id}
                        <span className="text-[10px] text-slate-500 block font-sans">
                          {rec.documentType}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {rec.ownerName}
                        <span className="text-[10px] text-slate-500 block">
                          {rec.village}, {rec.district}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-800">
                        {rec.surveyNumber}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] ${
                            rec.overallConfidence >= 90
                              ? 'bg-emerald-50 text-emerald-700'
                              : rec.overallConfidence >= 75
                              ? 'bg-amber-50 text-amber-800'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {rec.overallConfidence}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700 max-w-xs">
                        <span className="flex items-center gap-1.5 text-amber-800 font-medium text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          {issueText}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openReviewModal(rec)}
                            className="px-2.5 py-1 rounded bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs transition-colors flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            Review
                          </button>
                          <button
                            onClick={() => openReviewModal(rec)}
                            className="p-1 rounded hover:bg-slate-200 text-slate-600 transition-colors"
                            title="Edit fields"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onApproveRecord(rec.id)}
                            className="p-1 rounded hover:bg-emerald-100 text-emerald-700 transition-colors"
                            title="Direct Approve"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onRejectRecord(rec.id)}
                            className="p-1 rounded hover:bg-red-100 text-red-700 transition-colors"
                            title="Reject"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Verification Workstation Modal (Requested in Section 8) */}
      {isReviewModalOpen && activeReviewRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-slate-300 shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3 bg-[#0b1f3a] text-white">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded bg-amber-500/20 text-amber-400">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm font-serif">
                    Human Verification Workstation · Record {activeReviewRecord.id}
                  </h3>
                  <span className="text-[11px] text-slate-300">
                    Comparing physical scan against extracted text with real-time field override
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Split Screen */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 overflow-hidden bg-slate-100">
              {/* Left Side: Original Document Preview (6 cols) */}
              <div className="lg:col-span-6 h-full flex flex-col">
                <div className="text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>ORIGINAL SCANNED DOCUMENT INSPECTION</span>
                  <span className="font-mono text-slate-500 text-[10px]">High-Res Canvas</span>
                </div>
                <div className="flex-1 overflow-hidden rounded-md border border-slate-300">
                  <DocumentViewer record={activeReviewRecord} showBoundingBoxes={true} />
                </div>
              </div>

              {/* Right Side: Extracted Data + Validation Warnings + Editable Fields + Comments */}
              <div className="lg:col-span-6 h-full flex flex-col bg-white rounded-md border border-slate-300 p-4 overflow-y-auto space-y-4 shadow-inner">
                {/* Confidence & Issue Summary Banner */}
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                      Verification Flags & AI Uncertainty
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white text-amber-900 border border-amber-300">
                      Confidence: {activeReviewRecord.overallConfidence}%
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-900 leading-snug">
                    AI detected characters with sub-75% statistical certainty. Compare original document scan on the left to verify or edit values below.
                  </p>
                </div>

                {/* Editable Fields Form */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono border-b pb-1">
                    Editable Field Attributes
                  </h4>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        Land Owner Name:
                      </label>
                      <input
                        type="text"
                        value={editableForm.ownerName || ''}
                        onChange={(e) =>
                          setEditableForm({ ...editableForm, ownerName: e.target.value })
                        }
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        Survey Number:
                      </label>
                      <input
                        type="text"
                        value={editableForm.surveyNumber || ''}
                        onChange={(e) =>
                          setEditableForm({ ...editableForm, surveyNumber: e.target.value })
                        }
                        className="w-full p-2 bg-amber-50/50 border border-amber-400 rounded font-mono font-bold text-blue-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        Area / Extent:
                      </label>
                      <input
                        type="text"
                        value={editableForm.area || ''}
                        onChange={(e) =>
                          setEditableForm({ ...editableForm, area: e.target.value })
                        }
                        className="w-full p-2 bg-amber-50/50 border border-amber-400 rounded font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        Land Classification:
                      </label>
                      <input
                        type="text"
                        value={editableForm.landClassification || ''}
                        onChange={(e) =>
                          setEditableForm({ ...editableForm, landClassification: e.target.value })
                        }
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        Village:
                      </label>
                      <input
                        type="text"
                        value={editableForm.village || ''}
                        onChange={(e) =>
                          setEditableForm({ ...editableForm, village: e.target.value })
                        }
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">
                        Mandal / Tehsil:
                      </label>
                      <input
                        type="text"
                        value={editableForm.mandalTehsil || ''}
                        onChange={(e) =>
                          setEditableForm({ ...editableForm, mandalTehsil: e.target.value })
                        }
                        className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Verification Comments Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tahsildar / Verifier Verification Comments:
                  </label>
                  <textarea
                    rows={2}
                    value={verificationComment}
                    onChange={(e) => setVerificationComment(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Provide official rationale for adjustments..."
                  />
                </div>

                {/* Active Learning Notice */}
                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded text-[11px] text-blue-900 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <span>
                    Saving this verification digitally stamps the record and automatically queues these corrected tokens to improve future Indic OCR accuracy by ~0.4%.
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer with "Save Verification" Button */}
            <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-t border-slate-200">
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="px-3.5 py-1.5 rounded border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onRejectRecord(activeReviewRecord.id, verificationComment);
                    setIsReviewModalOpen(false);
                  }}
                  className="px-3.5 py-1.5 rounded bg-red-700 hover:bg-red-800 text-white text-xs font-semibold"
                >
                  Reject Record
                </button>
                <button
                  onClick={handleSaveVerification}
                  className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Verification
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
