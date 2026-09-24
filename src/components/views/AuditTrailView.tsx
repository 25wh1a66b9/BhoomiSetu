import React, { useState } from 'react';
import {
  History,
  Shield,
  Search,
  Filter,
  CheckCircle,
  FileText,
  User,
  Cpu,
  Lock,
  Download,
  KeyRound
} from 'lucide-react';
import { AuditLogEntry } from '../../types/landRecord';
import { AUDIT_TRAIL_LOGS } from '../../data/mockData';

export const AuditTrailView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedAction, setSelectedAction] = useState('All');

  const actions = [
    'All',
    'Document Uploaded',
    'AI Extraction Completed',
    'Validation Performed',
    'Manual Edit by Officer',
    'Record Approved',
    'Record Exported'
  ];

  const filteredLogs = AUDIT_TRAIL_LOGS.filter((log) => {
    const matchesSearch =
      log.recordId.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.userOrSystem.toLowerCase().includes(search.toLowerCase()) ||
      log.ipOrHash.toLowerCase().includes(search.toLowerCase());

    const matchesAction = selectedAction === 'All' || log.action === selectedAction;

    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded font-bold flex items-center gap-1">
              <Lock className="w-3 h-3" />
              CRYPTOGRAPHIC IMMUTABLE LEDGER
            </span>
            <span className="text-xs text-slate-500 font-mono">
              SHA-256 Merkle Chain · Non-repudiation Guaranteed
            </span>
          </div>
          <h2 className="text-lg font-bold font-serif text-slate-900">
            National Land Records Immutable Audit Trail
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Cryptographically sealed timeline tracking every upload, AI OCR token extraction, revenue officer correction, and e-Passbook issuance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const text = JSON.stringify(filteredLogs, null, 2);
              const blob = new Blob([text], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `bhoomisetu_audit_trail_${new Date().toISOString().split('T')[0]}.json`;
              a.click();
            }}
            className="px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export Audit Ledger
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Record ID, Officer Name, IP or Hash..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-md pl-9 pr-4 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 sm:w-64">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs text-slate-800 focus:outline-none"
          >
            {actions.map((act) => (
              <option key={act} value={act}>
                {act}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Log Table (Section 12 Requirements) */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="px-4 py-3">Timestamp (IST)</th>
                <th className="px-4 py-3">Record ID</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">User / System</th>
                <th className="px-4 py-3">Event Details</th>
                <th className="px-4 py-3 font-mono">IP Address / Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-sans">
              {filteredLogs.map((log) => {
                const isSystem = log.userOrSystem.includes('AI') || log.userOrSystem.includes('Daemon') || log.userOrSystem.includes('Gateway');

                return (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-blue-900">
                      {log.recordId}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          log.action === 'Record Approved'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : log.action === 'Manual Edit by Officer'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : log.action === 'AI Extraction Completed'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">
                      <div className="flex items-center gap-1.5">
                        {isSystem ? (
                          <Cpu className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                        ) : (
                          <User className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                        )}
                        <span className="truncate">{log.userOrSystem}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-sm leading-relaxed">
                      {log.details}
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {log.ipOrHash}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
