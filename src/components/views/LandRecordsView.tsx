import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  FileSpreadsheet,
  FileCheck2,
  Printer,
  X,
  Share2,
  Building,
  ShieldCheck,
  ChevronDown,
  Phone,
  Headphones,
  MessageSquare
} from 'lucide-react';
import { LandRecord } from '../../types/landRecord';
import { CustomerCareModal } from '../CustomerCareModal';

interface LandRecordsViewProps {
  records: LandRecord[];
  onSelectRecord: (recordId: string) => void;
  onNavigateToTab: (tab: any) => void;
}

export const LandRecordsView: React.FC<LandRecordsViewProps> = ({
  records,
  onSelectRecord,
  onNavigateToTab
}) => {
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedLandType, setSelectedLandType] = useState<string>('All');
  const [viewingPassbookRecord, setViewingPassbookRecord] = useState<LandRecord | null>(null);
  const [customerCareRecord, setCustomerCareRecord] = useState<LandRecord | null>(null);

  // Filter options
  const states = ['All', 'Telangana', 'Uttar Pradesh', 'Karnataka', 'Andhra Pradesh', 'Tamil Nadu'];
  const districts = ['All', 'Hyderabad / Medchal', 'Warangal', 'Nalgonda', 'Peddapalli', 'Varanasi', 'Ramanagara'];
  const statuses = ['All', 'Verified', 'Validated', 'Needs Review', 'Pending'];
  const landTypes = [
    'All',
    'Dry Land (Khushki / Rainfed)',
    'Wet Land (Tari / Irrigated)',
    'Baghayat (Garden / Orchard)',
    'Commercial / Non-Agricultural'
  ];

  // Filtering logic
  const filteredRecords = records.filter((rec) => {
    const matchesSearch =
      rec.ownerName.toLowerCase().includes(search.toLowerCase()) ||
      rec.surveyNumber.toLowerCase().includes(search.toLowerCase()) ||
      rec.khasraNumber.toLowerCase().includes(search.toLowerCase()) ||
      rec.khataNumber.toLowerCase().includes(search.toLowerCase()) ||
      rec.village.toLowerCase().includes(search.toLowerCase()) ||
      rec.district.toLowerCase().includes(search.toLowerCase()) ||
      rec.id.toLowerCase().includes(search.toLowerCase());

    const matchesState = selectedState === 'All' || rec.state === selectedState;
    const matchesDistrict = selectedDistrict === 'All' || rec.district.includes(selectedDistrict);
    const matchesStatus = selectedStatus === 'All' || rec.status === selectedStatus;
    const matchesLandType = selectedLandType === 'All' || rec.landClassification === selectedLandType;

    return matchesSearch && matchesState && matchesDistrict && matchesStatus && matchesLandType;
  });

  const exportCSV = () => {
    const headers = ['Record ID,Owner,Survey No,Khasra,Khata,Area,Village,District,State,Land Type,Status,Confidence'];
    const rows = filteredRecords.map(
      (r) =>
        `"${r.id}","${r.ownerName}","${r.surveyNumber}","${r.khasraNumber}","${r.khataNumber}","${r.area}","${r.village}","${r.district}","${r.state}","${r.landClassification}","${r.status}","${r.overallConfidence}%"`
    );
    const blob = new Blob([[headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bhoomisetu_land_records_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Export */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded font-bold">
              DIGITAL LAND REGISTER
            </span>
            <span className="text-xs text-slate-500">
              Total Catalogued: <strong>{records.length} records in active database</strong>
            </span>
          </div>
          <h2 className="text-lg font-bold font-serif text-slate-900">
            Searchable Digital Land Records Database (DILRMP)
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Customer Care & Verified Citizen Assistance Banner */}
      <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-emerald-600 text-white shrink-0">
            <Headphones className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-slate-900">
                Customer Care & Verified Landowner Connect Desk
              </h4>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded border border-emerald-300">
                Live Support
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              Have boundary, purchase, or encumbrance queries? Click <strong>Contact Owner</strong> on any verified record to reach the Aadhaar-authenticated pattadar or dial Toll-Free <strong>1800-425-2525</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="tel:18004252525"
            className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Phone className="w-3.5 h-3.5" />
            Call 1800-425-2525
          </a>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Owner Name, Survey Number, Khasra, Khata, Village, District..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-md pl-9 pr-4 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
          />
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 text-xs text-slate-800 focus:outline-none"
            >
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 text-xs text-slate-800 focus:outline-none"
            >
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 text-xs text-slate-800 focus:outline-none"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Land Classification
            </label>
            <select
              value={selectedLandType}
              onChange={(e) => setSelectedLandType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 text-xs text-slate-800 focus:outline-none truncate"
            >
              {landTypes.map((lt) => (
                <option key={lt} value={lt}>
                  {lt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Land Records Table (Section 9) */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="px-4 py-3">Record ID</th>
                <th className="px-4 py-3">Owner / Pattedar</th>
                <th className="px-4 py-3">Survey Number</th>
                <th className="px-4 py-3">Area / Extent</th>
                <th className="px-4 py-3">Village</th>
                <th className="px-4 py-3">District</th>
                <th className="px-4 py-3">Land Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Last Updated</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-slate-500">
                    No land records match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => {
                  const isVerified = rec.status === 'Verified' || rec.status === 'Validated';
                  const isReview = rec.status === 'Needs Review';

                  return (
                    <tr
                      key={rec.id}
                      className="hover:bg-amber-50/30 transition-colors cursor-pointer"
                      onClick={() => onSelectRecord(rec.id)}
                    >
                      <td className="px-4 py-3 font-mono font-bold text-blue-900">
                        {rec.id}
                        <span className="text-[10px] text-slate-400 block font-sans">
                          Khata #{rec.khataNumber}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {rec.ownerName}
                        {rec.ownerNameRegional && (
                          <span className="text-[10px] text-slate-500 block font-serif">
                            {rec.ownerNameRegional}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-800">
                        {rec.surveyNumber}
                      </td>
                      <td className="px-4 py-3 font-mono font-semibold text-slate-900">
                        {rec.area}
                      </td>
                      <td className="px-4 py-3 text-slate-700">{rec.village}</td>
                      <td className="px-4 py-3 text-slate-700">{rec.district.split('/')[0]}</td>
                      <td className="px-4 py-3 text-slate-600 max-w-[150px] truncate">
                        {rec.landClassification}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${
                            isVerified
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : isReview
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {rec.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {rec.processedDate.split(' ')[0]}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {isVerified && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCustomerCareRecord(rec);
                              }}
                              className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-300 flex items-center gap-1 shadow-2xs transition-colors"
                              title="Customer Care & Contact Owner"
                            >
                              <Phone className="w-3 h-3 text-emerald-600" />
                              <span>Contact</span>
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingPassbookRecord(rec);
                            }}
                            className="p-1 rounded hover:bg-slate-200 text-blue-900 transition-colors"
                            title="View Pattadar Passbook Form 1-B"
                          >
                            <FileCheck2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectRecord(rec.id);
                            }}
                            className="p-1 rounded hover:bg-slate-200 text-slate-700 transition-colors"
                            title="Inspect in AI Extractor"
                          >
                            <Eye className="w-4 h-4" />
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

      {/* Pattadar Passbook / Form 1-B Official Certificate Modal */}
      {viewingPassbookRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-slate-300 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 bg-[#0b1f3a] text-white">
              <span className="font-bold text-sm font-serif">
                DIGITAL PATTADAR PASSBOOK · FORM 1-B (NAMUNA)
              </span>
              <button
                onClick={() => setViewingPassbookRecord(null)}
                className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 bg-[#fdfbf7]">
              {/* Official Seal Header */}
              <div className="text-center border-b-2 border-slate-800 pb-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-700 font-serif">
                  GOVERNMENT OF {viewingPassbookRecord.state.toUpperCase()}
                </p>
                <h3 className="text-base font-bold font-serif text-slate-900">
                  DIGITIZED RECORD OF RIGHTS (ROR) CERTIFICATE
                </h3>
                <p className="text-[10px] text-slate-600 font-serif italic">
                  Certified under National Land Records Modernisation Programme (DILRMP)
                </p>
              </div>

              {/* Passbook Info Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-white p-4 rounded border border-slate-300 font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">RECORD IDENTIFIER:</span>
                  <span className="font-bold text-blue-900">{viewingPassbookRecord.id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">KHATA NUMBER:</span>
                  <span className="font-bold text-slate-900">{viewingPassbookRecord.khataNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">PATTADAR NAME:</span>
                  <span className="font-bold text-slate-900">{viewingPassbookRecord.ownerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">FATHER / HUSBAND:</span>
                  <span className="font-bold text-slate-900">{viewingPassbookRecord.fatherHusbandName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">SURVEY / SUB-DIV:</span>
                  <span className="font-bold text-slate-900">{viewingPassbookRecord.surveyNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">EXTENT (ACRES):</span>
                  <span className="font-bold text-emerald-800">{viewingPassbookRecord.area}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">VILLAGE / MANDAL:</span>
                  <span className="font-bold text-slate-900">
                    {viewingPassbookRecord.village} / {viewingPassbookRecord.mandalTehsil}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">DISTRICT:</span>
                  <span className="font-bold text-slate-900">{viewingPassbookRecord.district}</span>
                </div>
              </div>

              {/* Customer Care & Verified Contact Section inside Passbook */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>Verified Title & Citizen Customer Care</span>
                      <span className="text-[10px] text-emerald-700 font-mono font-bold bg-emerald-100 px-1 rounded">Aadhaar e-KYC</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Direct owner contact phone: <strong>{viewingPassbookRecord.ownerContact?.phone || '+91 98480 23411'}</strong> · Tahsil Desk: <strong>1800-425-2525</strong>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setCustomerCareRecord(viewingPassbookRecord)}
                  className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Contact Owner</span>
                </button>
              </div>

              {/* Legal Disclaimer & Hash */}
              <div className="text-[10px] text-slate-500 font-mono space-y-1 border-t border-slate-300 pt-2">
                <div>SHA-256 Ledger Hash: <code>7f8a91b2c4e5...a19c402d</code></div>
                <div>Digitally Authenticated by: <strong>Tahsildar / RDO Ghatkesar</strong></div>
                <div className="text-slate-400 italic">This is an authorized e-Passbook extract generated from BhoomiSetu AI.</div>
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-100 border-t border-slate-300 flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 rounded border border-slate-300 bg-white text-xs font-semibold text-slate-700 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Certificate
              </button>
              <button
                onClick={() => setViewingPassbookRecord(null)}
                className="px-3.5 py-1.5 rounded bg-blue-900 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Care & Contact Landowner Modal */}
      <CustomerCareModal
        isOpen={!!customerCareRecord}
        onClose={() => setCustomerCareRecord(null)}
        record={customerCareRecord}
      />
    </div>
  );
};
