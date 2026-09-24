import React, { useState } from 'react';
import {
  Code2,
  CheckCircle2,
  Copy,
  ExternalLink,
  Play,
  Terminal,
  Server,
  Layers,
  Check,
  ShieldAlert
} from 'lucide-react';
import { API_ENDPOINTS } from '../../data/mockData';
import { ApiEndpoint } from '../../types/landRecord';

export const ApiIntegrationView: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(API_ENDPOINTS[0]);
  const [copied, setCopied] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testing, setTesting] = useState<boolean>(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateApiCall = () => {
    setTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setTesting(false);
      setTestResult(selectedEndpoint.sampleResponse);
    }, 600);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded font-bold">
              OPEN REVENUE API GATEWAY
            </span>
            <span className="text-xs text-slate-500 font-mono">DILRMP OpenAPI 3.1 & OAuth2 mTLS Ready</span>
          </div>
          <h2 className="text-lg font-bold font-serif text-slate-900">
            Government Systems & Interoperability APIs
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Interconnecting State Revenue Portals (Dharani, Bhoomi, BanglarBhumi), SRO Registration Systems (CARD), Bhunaksha GIS, and PM-KISAN.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Gateway Healthy (5 Endpoints Online)
          </span>
        </div>
      </div>

      {/* Endpoints List & Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Endpoints Sidebar (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-lg border border-slate-200 shadow-xs p-3 space-y-2">
          <div className="p-2 border-b border-slate-200">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono">
              Available API Endpoints
            </h3>
            <span className="text-[11px] text-slate-500">Select an endpoint to inspect schema</span>
          </div>

          <div className="space-y-1.5">
            {API_ENDPOINTS.map((endpoint) => {
              const isSelected = selectedEndpoint.id === endpoint.id;
              const isPost = endpoint.method === 'POST';

              return (
                <button
                  key={endpoint.id}
                  onClick={() => {
                    setSelectedEndpoint(endpoint);
                    setTestResult(null);
                  }}
                  className={`w-full text-left p-3 rounded-md border transition-all ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-300 ring-1 ring-blue-400'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                        isPost
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {endpoint.method}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                      {endpoint.status}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {endpoint.name}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 truncate mt-0.5">
                    {endpoint.path}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Endpoint Inspector & Interactive Tester (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-4">
          {/* Top of Inspector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    selectedEndpoint.method === 'POST'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-700 text-white'
                  }`}
                >
                  {selectedEndpoint.method}
                </span>
                <span className="font-mono text-sm font-bold text-slate-900">
                  {selectedEndpoint.path}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">{selectedEndpoint.description}</p>
            </div>

            <button
              onClick={handleSimulateApiCall}
              disabled={testing}
              className="px-3.5 py-1.5 rounded-md bg-[#0b1f3a] hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs shrink-0"
            >
              <Play className="w-3.5 h-3.5 text-amber-400" />
              {testing ? 'Sending Request...' : 'Send Live Test Request'}
            </button>
          </div>

          {/* Sample Request Body / Query Params */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 font-mono text-[11px] uppercase">
                {selectedEndpoint.method === 'POST' ? 'Payload (application/json)' : 'Query Parameters'}
              </span>
              <button
                onClick={() => handleCopy(selectedEndpoint.sampleRequest)}
                className="text-[11px] text-slate-500 hover:text-slate-900 flex items-center gap-1 font-mono"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="bg-slate-900 text-slate-200 p-3 rounded-md text-[11px] font-mono overflow-x-auto max-h-48 border border-slate-800">
              {selectedEndpoint.sampleRequest}
            </pre>
          </div>

          {/* Sample Response / Real-time Test Output */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 font-mono text-[11px] uppercase">
                Response Payload (200 OK)
              </span>
              {testResult && (
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 font-semibold">
                  Round-trip latency: 38ms
                </span>
              )}
            </div>
            <pre className="bg-[#0f172a] text-emerald-400 p-3 rounded-md text-[11px] font-mono overflow-x-auto max-h-60 border border-slate-800">
              {testResult || selectedEndpoint.sampleResponse}
            </pre>
          </div>

          {/* Integration Guide Note */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded text-xs text-amber-900 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Security & Interoperability Standards:</span>
              <p className="text-[11px] leading-relaxed mt-0.5">
                All external callers must present an authorized NIC API Gateway Bearer Token with role-scoped permissions. Mutual TLS (mTLS) is enforced for state land administration databases.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
