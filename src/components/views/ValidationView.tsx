import React, { useState } from 'react';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Building,
  Scale,
  Send,
  Check,
  X,
  FileText,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import { LandRecord } from '../../types/landRecord';

interface ValidationViewProps {
  currentRecord: LandRecord;
  onApproveRecord: (recordId: string) => void;
  onSendForVerification: (recordId: string, remarks?: string) => void;
  onRejectRecord: (recordId: string, remarks?: string) => void;
  allRecords: LandRecord[];
  onSelectRecord: (recordId: string) => void;
}

export const ValidationView: React.FC<ValidationViewProps> = ({
  currentRecord,
  onApproveRecord,
  onSendForVerification,
  onRejectRecord,
  allRecords,
  onSelectRecord
}) => {
  const [remarks, setRemarks] = useState('');
  const [actionNotice, setActionNotice] = useState<{ message: string; type: 'success' | 'warning' | 'danger' } | null>(null);

  // Validation rules
  const rules = [
    {
      id: 'r1',
      title: 'Owner details verified',
      desc: 'Matches Aadhaar e-KYC name and District Revenue Electoral Roll.',
      status: 'passed' as const
    },
    {
      id: 'r2',
      title: 'Survey number format valid',
      desc: 'Valid cadastral sub-division notation conforms to DILRMP standard format.',
      status: 'passed' as const
    },
    {
      id: 'r3',
      title: 'Village matched',
      desc: `${currentRecord.village} matched against State Revenue Directory index.`,
      status: 'passed' as const
    },
    {
      id: 'r4',
      title: 'Area within expected range',
      desc: currentRecord.id === 'LR-1002'
        ? 'Discrepancy: Extracted 1.78 Acres differs from parent parcel ledger allocation (1.18 Acres).'
        : `Extracted ${currentRecord.area} conforms to mother survey parcel boundary.`,
      status: currentRecord.id === 'LR-1002' ? ('failed' as const) : ('passed' as const)
    },
    {
      id: 'r5',
      title: 'Mutation record requires verification',
      desc: currentRecord.id === 'LR-1002'
        ? 'Mutation file MUT-2022-4102 has pending revenue appeal in Sub-Collector court.'
        : `Verified mutation ${currentRecord.mutationNumber} authorized by Tahsildar.`,
      status: currentRecord.id === 'LR-1002' ? ('warning' as const) : ('passed' as const)
    },
    {
      id: 'r6',
      title: 'Duplicate record detected / Title Overlap',
      desc: currentRecord.id === 'LR-1002'
        ? 'Potential overlap alert: Adjacent sub-division 89/3A boundary lines intersect by 12 links.'
        : 'Zero encumbrance, no duplicate or overlapping deeds detected.',
      status: currentRecord.id === 'LR-1002' ? ('failed' as const) : ('passed' as const)
    },
    {
      id: 'r7',
      title: 'Ownership consistency & Chain of Title',
      desc: `Transfer from ${currentRecord.previousOwner} to ${currentRecord.currentOwner} supported by deed.`,
      status: 'passed' as const
    },
    {
      id: 'r8',
      title: 'Registration verification with SRO Database',
      desc: `Registration Deed ${currentRecord.registrationNumber} verified with SRO archive.`,
      status: 'passed' as const
    }
  ];

  const handleApprove = () => {
    onApproveRecord(currentRecord.id);
    setActionNotice({ message: `Record ${currentRecord.id} approved and committed to Digital Land Register!`, type: 'success' });
  };

  const handleSendVerify = () => {
    onSendForVerification(currentRecord.id, remarks || 'Sent from Validation Workbench.');
    setActionNotice({ message: `Record ${currentRecord.id} sent to Tahsildar / Verifier Queue!`, type: 'warning' });
  };

  const handleReject = () => {
    onRejectRecord(currentRecord.id, remarks || 'Failed critical boundary and duplicate title checks.');
    setActionNotice({ message: `Record ${currentRecord.id} rejected. Audit log updated.`, type: 'danger' });
  };

  return (
    <div className="space-y-5">
      {/* Top Banner & Switcher */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded font-bold">
              INTELLIGENT VALIDATION ENGINE
            </span>
            <span className="text-xs text-slate-500">
              Validating Record: <strong className="font-mono text-slate-800">{currentRecord.id}</strong>
            </span>
          </div>
          <h2 className="text-lg font-bold font-serif text-slate-900">
            Multi-rule Integrity & Cadastral Verification
          </h2>
        </div>

        {/* Record Switcher */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-600 font-medium">Select Record:</label>
          <select
            value={currentRecord.id}
            onChange={(e) => onSelectRecord(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs font-mono font-bold text-slate-800 focus:outline-none"
          >
            {allRecords.map((r) => (
              <option key={r.id} value={r.id}>
                {r.id} - {r.ownerName} ({r.village})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Notice Alert */}
      {actionNotice && (
        <div
          className={`p-3 rounded-md text-xs font-medium flex items-center justify-between ${
            actionNotice.type === 'success'
              ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
              : actionNotice.type === 'warning'
              ? 'bg-amber-50 border border-amber-300 text-amber-800'
              : 'bg-red-50 border border-red-300 text-red-800'
          }`}
        >
          <span>{actionNotice.message}</span>
          <button onClick={() => setActionNotice(null)} className="p-1 hover:opacity-75">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Validation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Validation Score & Summary Card (1 Col) */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs text-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Composite Validation Score
            </span>

            {/* Score Ring */}
            <div className="my-4 flex items-center justify-center">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={
                      currentRecord.validationScore >= 90
                        ? 'text-emerald-600'
                        : currentRecord.validationScore >= 70
                        ? 'text-amber-500'
                        : 'text-red-600'
                    }
                    strokeDasharray={`${currentRecord.validationScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                    {currentRecord.validationScore}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono block">/ 100</span>
                </div>
              </div>
            </div>

            <div className="text-xs">
              <span
                className={`inline-block px-2.5 py-1 rounded font-bold uppercase text-[11px] font-mono ${
                  currentRecord.validationScore >= 90
                    ? 'bg-emerald-100 text-emerald-800'
                    : currentRecord.validationScore >= 70
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {currentRecord.validationScore >= 90
                  ? 'High Integrity · Eligible for Passbook'
                  : currentRecord.validationScore >= 70
                  ? 'Requires Revenue Review'
                  : 'High Risk Discrepancies'}
              </span>
            </div>

            <div className="border-t border-slate-100 mt-4 pt-3 text-left space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Rules Passed:</span>
                <strong className="text-emerald-700 font-mono">
                  {rules.filter((r) => r.status === 'passed').length} / {rules.length}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Warnings:</span>
                <strong className="text-amber-700 font-mono">
                  {rules.filter((r) => r.status === 'warning').length}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Critical Flags:</span>
                <strong className="text-red-700 font-mono">
                  {rules.filter((r) => r.status === 'failed').length}
                </strong>
              </div>
            </div>
          </div>

          {/* Action Decision Box with Buttons */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono">
              Adjudication Decision
            </h4>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Officer Endorsement Remarks:
              </label>
              <textarea
                rows={2}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter field inspection notes, survey stone verification remarks, or court decree references..."
                className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* The 3 requested action buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleApprove}
                className="w-full py-2 px-3 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                Approve Record
              </button>

              <button
                onClick={handleSendVerify}
                className="w-full py-2 px-3 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                Send for Verification
              </button>

              <button
                onClick={handleReject}
                className="w-full py-2 px-3 rounded-md bg-red-700 hover:bg-red-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <X className="w-3.5 h-3.5" />
                Reject Record
              </button>
            </div>
          </div>
        </div>

        {/* Validation Checklist Screen (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Automated Validation Rules Checklist
              </h3>
              <p className="text-xs text-slate-500">
                Cross-checking revenue registry, mathematical acreage conservation, and cadastral GIS
              </p>
            </div>
            <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded">
              8 Standard Checks Active
            </span>
          </div>

          <div className="space-y-3">
            {rules.map((rule) => {
              const isPassed = rule.status === 'passed';
              const isWarning = rule.status === 'warning';
              const isFailed = rule.status === 'failed';

              return (
                <div
                  key={rule.id}
                  className={`p-3.5 rounded-lg border transition-all ${
                    isPassed
                      ? 'bg-slate-50/70 border-slate-200'
                      : isWarning
                      ? 'bg-amber-50/80 border-amber-300'
                      : 'bg-red-50/80 border-red-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Status Icon */}
                    <div className="shrink-0 mt-0.5">
                      {isPassed && (
                        <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                      {isWarning && (
                        <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center">
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </div>
                      )}
                      {isFailed && (
                        <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center">
                          <X className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    {/* Rule Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`text-xs font-bold ${
                            isPassed
                              ? 'text-slate-900'
                              : isWarning
                              ? 'text-amber-950 font-bold'
                              : 'text-red-950 font-bold'
                          }`}
                        >
                          {rule.title}
                        </h4>

                        <span
                          className={`text-[10px] font-mono uppercase font-bold px-2 py-0.2 rounded ${
                            isPassed
                              ? 'text-emerald-700 bg-emerald-100/60'
                              : isWarning
                              ? 'text-amber-800 bg-amber-200/60'
                              : 'text-red-800 bg-red-200/60'
                          }`}
                        >
                          {isPassed ? '✓ Verified' : isWarning ? '⚠ Warning' : '✕ Failed'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{rule.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reference Info on Indian Land Validation Protocol */}
          <div className="p-3 bg-blue-50/60 border border-blue-200 rounded text-xs text-blue-900 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">DILRMP 2.0 Cadastral Validation Protocol:</span>
              <p className="text-[11px] text-blue-800 leading-relaxed mt-0.5">
                Every sub-division survey number must sum mathematically to the mother Khasra area registered in the village settlement register. Discrepancies exceeding ±0.01 Acre automatically trigger mandatory human verification before issuance of Pattadar Passbooks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
