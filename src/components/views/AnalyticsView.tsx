import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  FileCheck,
  AlertTriangle,
  CopyCheck,
  Users2,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Building
} from 'lucide-react';
import { STATE_ANALYTICS_DATA, DISTRICT_ANALYTICS_DATA, MONTHLY_TREND_DATA } from '../../data/mockData';

export const AnalyticsView: React.FC = () => {
  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded font-bold">
              NATIONAL ANALYTICS & MONITORING
            </span>
            <span className="text-xs text-slate-500 font-mono">DILRMP MIS Report · September 2026</span>
          </div>
          <h2 className="text-lg font-bold font-serif text-slate-900">
            Digitization Velocity, AI Accuracy & Verification Analytics
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md">
          <Calendar className="w-3.5 h-3.5 text-blue-900" />
          <span>FY 2026-27 (Q2 Cumulative)</span>
        </div>
      </div>

      {/* 8 Analytics Metrics Grid (Section 11) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Total records digitized */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium uppercase font-mono block">
            Total Digitized
          </span>
          <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">1,727,416</span>
          <span className="text-[10px] text-emerald-600 font-medium flex items-center mt-1">
            <ArrowUpRight className="w-3 h-3 mr-0.5" /> +18.4% YoY Growth
          </span>
        </div>

        {/* Records verified */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium uppercase font-mono block">
            Records Verified
          </span>
          <span className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">1,540,800</span>
          <span className="text-[10px] text-slate-500 mt-1 block">89.2% Final Clearance</span>
        </div>

        {/* Records pending */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium uppercase font-mono block">
            Records Pending
          </span>
          <span className="text-2xl font-bold text-amber-700 font-mono tabular-nums">186,616</span>
          <span className="text-[10px] text-slate-500 mt-1 block">Active Tahsildar Backlog</span>
        </div>

        {/* Extraction accuracy */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium uppercase font-mono block">
            Extraction Accuracy
          </span>
          <span className="text-2xl font-bold text-blue-900 font-mono tabular-nums">95.4%</span>
          <span className="text-[10px] text-emerald-600 font-medium mt-1 block">+1.2% this quarter</span>
        </div>

        {/* Validation accuracy */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium uppercase font-mono block">
            Validation Accuracy
          </span>
          <span className="text-2xl font-bold text-emerald-800 font-mono tabular-nums">98.8%</span>
          <span className="text-[10px] text-slate-500 mt-1 block">Zero False Inclusions</span>
        </div>

        {/* Average processing time */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium uppercase font-mono block">
            Avg Processing Time
          </span>
          <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">2.8 sec</span>
          <span className="text-[10px] text-emerald-600 font-medium mt-1 block">Per historical folio</span>
        </div>

        {/* Duplicate records */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium uppercase font-mono block">
            Duplicates Blocked
          </span>
          <span className="text-2xl font-bold text-purple-700 font-mono tabular-nums">1,482</span>
          <span className="text-[10px] text-slate-500 mt-1 block">Protected ₹480 Cr value</span>
        </div>

        {/* Manual corrections */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 font-medium uppercase font-mono block">
            Manual Corrections
          </span>
          <span className="text-2xl font-bold text-amber-800 font-mono tabular-nums">5.6%</span>
          <span className="text-[10px] text-slate-500 mt-1 block">Down from 18.2% baseline</span>
        </div>
      </div>

      {/* State-wise Digitization Chart & District Progress (Section 11) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* State-wise Digitization Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                State-wise Digitization Progress & Accuracy
              </h3>
              <p className="text-xs text-slate-500">
                Performance across 6 key pilot states under DILRMP 2.0
              </p>
            </div>
            <span className="text-xs font-mono bg-blue-50 text-blue-900 px-2 py-0.5 rounded font-bold">
              National Leader: Telangana (95%)
            </span>
          </div>

          <div className="space-y-4">
            {STATE_ANALYTICS_DATA.map((state) => (
              <div key={state.state} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 text-sm">{state.state}</span>
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="text-slate-600">
                      Digitized: <strong>{state.digitized.toLocaleString()}</strong>
                    </span>
                    <span className="text-emerald-700 font-bold">
                      Accuracy: {state.accuracy}%
                    </span>
                    <span className="font-bold text-blue-900">
                      {state.progressPct}%
                    </span>
                  </div>
                </div>

                {/* Progress bar with target indicator */}
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${state.progressPct}%` }}
                    className="bg-[#0f2c59] h-full rounded-full transition-all"
                  />
                </div>

                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Target: {state.totalRecords.toLocaleString()} legacy deeds</span>
                  <span>Pending Queue: {state.pending.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* District-wise Progress Table (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-200 pb-3 mb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                District-wise Processing Depth (Telangana Hub)
              </h3>
              <p className="text-xs text-slate-500">
                Mandal & Village sub-division conversion status
              </p>
            </div>

            <div className="space-y-3">
              {DISTRICT_ANALYTICS_DATA.map((dist) => (
                <div key={dist.district} className="border-b border-slate-100 pb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-800">{dist.district}</span>
                    <span className="font-mono text-emerald-700 font-bold">{dist.rate} Pass</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                    <span>Total: {dist.total.toLocaleString()}</span>
                    <span>Verified: {dist.verified.toLocaleString()}</span>
                    <span className="text-amber-700">Review: {dist.needsReview.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-900">
            <span className="font-bold block mb-0.5">Automated Throughput Benchmark:</span>
            <p className="text-[11px] leading-relaxed">
              District Warangal has reduced Tahsildar adjudication turn-around time from 42 days to 3.4 hours using automated Indic OCR extraction and cadastral cross-validation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
