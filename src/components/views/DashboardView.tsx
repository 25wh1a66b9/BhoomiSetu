import React, { useState } from 'react';
import {
  FileCheck2,
  FileClock,
  AlertOctagon,
  CopyCheck,
  TrendingUp,
  Files,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  Building2,
  MapPin,
  ExternalLink,
  Phone,
  Headphones,
  Mail,
  UserCheck
} from 'lucide-react';
import { LandRecord } from '../../types/landRecord';
import { STATE_ANALYTICS_DATA, DISTRICT_ANALYTICS_DATA, MONTHLY_TREND_DATA } from '../../data/mockData';
import { AIWorkflowBanner } from '../AIWorkflowBanner';
import { CustomerCareModal } from '../CustomerCareModal';

interface DashboardViewProps {
  records: LandRecord[];
  onSelectRecord: (recordId: string) => void;
  onNavigateToTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  records,
  onSelectRecord,
  onNavigateToTab
}) => {
  const [selectedCareRecord, setSelectedCareRecord] = useState<LandRecord | null>(null);

  // Aggregate stats
  const totalProcessed = 14820;
  const successfullyDigitized = 13290;
  const pendingVerification = records.filter((r) => r.status === 'Needs Review' || r.status === 'Pending').length + 1177;
  const validationErrors = records.filter((r) => r.status === 'Needs Review').length + 348;
  const avgAccuracy = 95.4;
  const duplicateDetected = 42;
  const verifiedCount = records.filter((r) => r.status === 'Verified').length;

  return (
    <div className="space-y-5">
      {/* Top Banner & Quick Intro */}
      <div className="bg-gradient-to-r from-[#0b1f3a] via-[#102d57] to-[#0b1f3a] text-white p-5 rounded-lg border border-slate-700 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                NATIONAL MISSION DASHBOARD
              </span>
              <span className="text-slate-400 text-xs">Live Telemetry · 23 Sep 2026</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-white">
              Intelligent Land Record Digitization & Validation Portal
            </h1>
            <p className="text-xs text-slate-300 max-w-3xl mt-1 leading-relaxed">
              Converting legacy physical land records, Urdu/Modi/Devanagari/Telugu manuscripts, 1-B Pahani ledgers, and cadastral maps into legally validated, survey-linked digital records using Computer Vision, OCR, and Cadastral GIS AI.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigateToTab('upload')}
              className="px-3.5 py-2 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Files className="w-3.5 h-3.5" />
              Upload Record
            </button>
            <button
              onClick={() => onNavigateToTab('gis')}
              className="px-3.5 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white font-medium text-xs border border-white/20 flex items-center gap-1.5 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Open GIS Map
            </button>
          </div>
        </div>
      </div>

      {/* AI Processing Workflow Banner */}
      <AIWorkflowBanner />

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {/* Total Documents Processed */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-medium uppercase font-mono">Total Processed</span>
            <Files className="w-4 h-4 text-blue-700" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {totalProcessed.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-600 mt-1 flex items-center font-medium">
            <ArrowUpRight className="w-3 h-3 mr-0.5 inline" /> +14.2% this month
          </div>
        </div>

        {/* Successfully Digitized */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-medium uppercase font-mono">Digitized</span>
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">
            {successfullyDigitized.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            89.7% automated pass rate
          </div>
        </div>

        {/* Pending Verification */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-medium uppercase font-mono">Pending Review</span>
            <FileClock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-700 font-mono tabular-nums">
            {pendingVerification.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Assigned to Tahsildar queue
          </div>
        </div>

        {/* Validation Errors */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-medium uppercase font-mono">Validation Alerts</span>
            <AlertOctagon className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-700 font-mono tabular-nums">
            {validationErrors.toLocaleString()}
          </div>
          <div className="text-[10px] text-red-600 mt-1 font-medium">
            Area / Sub-div mismatch
          </div>
        </div>

        {/* Average Extraction Accuracy */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-medium uppercase font-mono">Avg Accuracy</span>
            <TrendingUp className="w-4 h-4 text-blue-900" />
          </div>
          <div className="text-2xl font-bold text-blue-900 font-mono tabular-nums">
            {avgAccuracy}%
          </div>
          <div className="text-[10px] text-emerald-600 mt-1 font-medium">
            +1.2% active learning gain
          </div>
        </div>

        {/* Duplicate Records Detected */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-medium uppercase font-mono">Duplicates Caught</span>
            <CopyCheck className="w-4 h-4 text-purple-700" />
          </div>
          <div className="text-2xl font-bold text-purple-800 font-mono tabular-nums">
            {duplicateDetected}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Prevented fraudulent sales
          </div>
        </div>
      </div>

      {/* Visual Charts Row 1: Documents Processed Over Time & Validation Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Documents Processed Over Time (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Digitization Volume & Success Rate (Monthly)
              </h3>
              <p className="text-xs text-slate-500">Historical intake from April to September 2026</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#0f2c59]" /> Total Processed
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" /> Verified Automatically
              </span>
            </div>
          </div>

          {/* SVG Bar & Trend Chart */}
          <div className="h-52 w-full flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-200">
            {MONTHLY_TREND_DATA.map((item, idx) => {
              const maxVal = 3000;
              const heightPct = (item.count / maxVal) * 100;
              const verifiedPct = (item.verified / maxVal) * 100;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] p-1.5 rounded pointer-events-none whitespace-nowrap z-20 font-mono">
                    {item.month}: {item.count} total ({item.verified} verified)
                  </div>

                  <div className="w-full max-w-[48px] flex items-end justify-center gap-1 h-full">
                    {/* Total bar */}
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-1/2 bg-[#0f2c59] rounded-t-xs transition-all group-hover:brightness-110"
                    />
                    {/* Verified bar */}
                    <div
                      style={{ height: `${verifiedPct}%` }}
                      className="w-1/2 bg-emerald-500 rounded-t-xs transition-all group-hover:brightness-110"
                    />
                  </div>
                  <span className="text-[11px] font-mono text-slate-600 mt-2 font-medium">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-2">
            <span>Baseline target: 2,500 docs/month</span>
            <span className="font-mono text-emerald-600 font-semibold">Current Pace: 2,780/month (+11.2%)</span>
          </div>
        </div>

        {/* Validation Status & Extraction Accuracy Distribution (1 Col) */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">
              Validation Status & Accuracy Tiers
            </h3>
            <p className="text-xs text-slate-500 mb-3">Field confidence distribution across ingested records</p>

            {/* Circular / Ring Progress Graphic */}
            <div className="flex items-center justify-center my-3">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  {/* Background Circle */}
                  <path
                    className="text-slate-100"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* High Confidence (82%) */}
                  <path
                    className="text-emerald-500"
                    strokeDasharray="82, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Medium Confidence (12%) */}
                  <path
                    className="text-amber-500"
                    strokeDasharray="12, 100"
                    strokeDashoffset="-82"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Low Confidence (6%) */}
                  <path
                    className="text-red-500"
                    strokeDasharray="6, 100"
                    strokeDashoffset="-94"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-xl font-bold text-slate-900 font-mono">95.4%</span>
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-mono">
                    AVG SCORE
                  </span>
                </div>
              </div>
            </div>

            {/* Legend Breakdown */}
            <div className="space-y-2 mt-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  High Confidence (&gt;90%)
                </span>
                <span className="font-mono font-bold text-slate-900">82.4% (12,210)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Medium Confidence (75–90%)
                </span>
                <span className="font-mono font-bold text-slate-900">11.8% (1,750)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  Low Confidence (&lt;75% Review)
                </span>
                <span className="font-mono font-bold text-red-700">5.8% (860)</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 mt-3 text-center">
            <button
              onClick={() => onNavigateToTab('verification')}
              className="text-xs text-amber-600 hover:text-amber-700 font-semibold flex items-center justify-center gap-1 w-full"
            >
              Open Pending Verification Cases ({pendingVerification})
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Visual Charts Row 2: State-wise & District-wise records */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* State-wise Digitization Progress */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">State-wise Digitization Progress</h3>
              <p className="text-xs text-slate-500">DILRMP implementation across 6 target pilot states</p>
            </div>
            <button
              onClick={() => onNavigateToTab('analytics')}
              className="text-xs text-blue-900 hover:underline font-medium"
            >
              Detailed Analytics →
            </button>
          </div>

          <div className="space-y-3">
            {STATE_ANALYTICS_DATA.map((stateItem) => (
              <div key={stateItem.state} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-800">{stateItem.state}</span>
                  <span className="font-mono text-slate-600">
                    {stateItem.digitized.toLocaleString()} / {stateItem.totalRecords.toLocaleString()}{' '}
                    <strong className="text-emerald-700 ml-1">({stateItem.progressPct}%)</strong>
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                  <div
                    style={{ width: `${stateItem.progressPct}%` }}
                    className="bg-emerald-600 h-full rounded-full transition-all"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* District-wise Records */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">District-wise Records & Pending Cases</h3>
              <p className="text-xs text-slate-500">Pilot district performance and queue backlog</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              Telangana Pilot
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-medium">
                  <th className="py-2">District</th>
                  <th className="py-2 text-right">Total Records</th>
                  <th className="py-2 text-right">Verified</th>
                  <th className="py-2 text-right">Pending Review</th>
                  <th className="py-2 text-right">Accuracy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {DISTRICT_ANALYTICS_DATA.map((d) => (
                  <tr key={d.district} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2 font-sans font-semibold text-slate-800">{d.district}</td>
                    <td className="py-2 text-right tabular-nums">{d.total.toLocaleString()}</td>
                    <td className="py-2 text-right tabular-nums text-emerald-700 font-semibold">
                      {d.verified.toLocaleString()}
                    </td>
                    <td className="py-2 text-right tabular-nums text-amber-700">
                      {d.needsReview.toLocaleString()}
                    </td>
                    <td className="py-2 text-right tabular-nums font-bold text-blue-900">{d.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Customer Care & Verified Landowner Connect Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-lg p-4 shadow-sm border border-emerald-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 shrink-0">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 px-2 py-0.5 rounded font-bold">
                CITIZEN CARE DESK
              </span>
              <span className="text-xs text-emerald-300 font-medium">
                {verifiedCount} Verified Properties with Direct Contact Enabled
              </span>
            </div>
            <h3 className="text-base font-bold font-serif text-white mt-0.5">
              Verified Landowner Directory & Citizen Assistance Portal
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl mt-0.5 leading-relaxed">
              Citizens and prospective buyers can directly communicate with Aadhaar e-KYC verified pattadars, clarify sub-division boundaries, or contact the local Tahsil Revenue Inspector helpdesk.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigateToTab('helpdesk')}
            className="px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Open Help Desk & Chat</span>
          </button>
          <a
            href="tel:18004252525"
            className="px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>1800-425-2525</span>
          </a>
          <button
            onClick={() => onNavigateToTab('records')}
            className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 flex items-center gap-1.5 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>Browse Verified Lands</span>
          </button>
        </div>
      </div>

      {/* Section 3: Recent Processing Activity Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Recent Processing Activity</h3>
            <p className="text-xs text-slate-500">Latest records processed by AI OCR and validation pipeline</p>
          </div>
          <button
            onClick={() => onNavigateToTab('records')}
            className="text-xs font-semibold text-blue-900 hover:text-blue-700 flex items-center gap-1 self-start sm:self-auto"
          >
            View All Land Records Registry ({records.length})
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="px-4 py-2.5">Document ID</th>
                <th className="px-4 py-2.5">Village</th>
                <th className="px-4 py-2.5">District</th>
                <th className="px-4 py-2.5">Owner / Pattedar</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5 text-right">Confidence</th>
                <th className="px-4 py-2.5">Date</th>
                <th className="px-4 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {records.slice(0, 8).map((rec) => {
                const isVerified = rec.status === 'Verified' || rec.status === 'Validated';
                const isReview = rec.status === 'Needs Review';

                return (
                  <tr
                    key={rec.id}
                    onClick={() => onSelectRecord(rec.id)}
                    className="hover:bg-amber-50/40 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 font-mono font-bold text-blue-900 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      {rec.id}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {rec.village}
                      {rec.villageRegional && (
                        <span className="text-[10px] text-slate-500 block">{rec.villageRegional}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{rec.district}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {rec.ownerName}
                      <span className="text-[10px] text-slate-500 block font-mono">
                        Survey {rec.surveyNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          isVerified
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : isReview
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold tabular-nums">
                      <span
                        className={`${
                          rec.overallConfidence >= 90
                            ? 'text-emerald-700'
                            : rec.overallConfidence >= 75
                            ? 'text-amber-700'
                            : 'text-red-700'
                        }`}
                      >
                        {rec.overallConfidence}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {rec.uploadDate.split(' ')[0]}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isVerified && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCareRecord(rec);
                            }}
                            className="px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-300 flex items-center gap-1 shadow-2xs transition-colors"
                            title="Contact Verified Owner"
                          >
                            <Phone className="w-3 h-3 text-emerald-600" />
                            <span>Contact</span>
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectRecord(rec.id);
                          }}
                          className="text-xs font-semibold text-blue-900 hover:text-blue-700 hover:underline"
                        >
                          Inspect
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Care Modal */}
      <CustomerCareModal
        isOpen={!!selectedCareRecord}
        onClose={() => setSelectedCareRecord(null)}
        record={selectedCareRecord}
      />
    </div>
  );
};
