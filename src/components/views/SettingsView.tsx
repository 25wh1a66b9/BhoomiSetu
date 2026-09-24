import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Lock,
  UserCheck,
  Globe,
  Database,
  Building,
  Key,
  CheckCircle,
  Save
} from 'lucide-react';
import { LanguageCode } from '../../types/landRecord';
import { LANGUAGE_OPTIONS } from '../../data/mockData';

interface SettingsViewProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentLanguage,
  onLanguageChange
}) => {
  const [activeRole, setActiveRole] = useState<'Administrator' | 'Verifier' | 'Survey Officer' | 'Public User'>('Administrator');
  const [auditLoggingEnabled, setAuditLoggingEnabled] = useState<boolean>(true);
  const [encryptionStandard, setEncryptionStandard] = useState<string>('AES-256-GCM (Hardware HSM)');
  const [aadhaarEkycEnabled, setAadhaarEkycEnabled] = useState<boolean>(true);
  const [autoMaskPII, setAutoMaskPII] = useState<boolean>(true);
  const [jurisdictionState, setJurisdictionState] = useState<string>('Telangana');
  const [jurisdictionDistrict, setJurisdictionDistrict] = useState<string>('Warangal');
  const [jurisdictionMandal, setJurisdictionMandal] = useState<string>('Hanamkonda');
  const [savedToast, setSavedToast] = useState<boolean>(false);

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded font-bold">
              GOVERNANCE & SECURITY PARAMETERS
            </span>
            <span className="text-xs text-slate-500 font-mono">DILRMP Security Baseline v3.2</span>
          </div>
          <h2 className="text-lg font-bold font-serif text-slate-900">
            System Configuration, Access Control & Privacy
          </h2>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-md bg-[#0b1f3a] hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Save className="w-3.5 h-3.5 text-amber-400" />
          Save Configurations
        </button>
      </div>

      {savedToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-md text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>System security & jurisdiction settings updated successfully.</span>
        </div>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Role-Based Access Control (RBAC) */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <UserCheck className="w-4 h-4 text-blue-900" />
            <h3 className="font-bold text-slate-900 text-sm">Role-Based Access Control (RBAC)</h3>
          </div>
          <p className="text-xs text-slate-500">
            Select the current operating role profile to switch UI privilege level:
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {(['Administrator', 'Verifier', 'Survey Officer', 'Public User'] as const).map((role) => (
              <button
                key={role}
                onClick={() => setActiveRole(role)}
                className={`p-2.5 rounded-md border text-left font-semibold transition-all ${
                  activeRole === role
                    ? 'bg-blue-50 border-blue-500 text-blue-900 ring-1 ring-blue-500'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <div className="text-xs font-bold">{role}</div>
                <span className="text-[10px] text-slate-500 font-normal block mt-0.5">
                  {role === 'Administrator'
                    ? 'Full configuration & sign-off'
                    : role === 'Verifier'
                    ? 'HITL Queue & field correction'
                    : role === 'Survey Officer'
                    ? 'Cadastral GIS parcel edits'
                    : 'Read-only public search'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Security & Storage Encryption */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Lock className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-sm">Storage Encryption & Audit</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                Data at Rest Encryption Standard:
              </label>
              <input
                type="text"
                disabled
                value={encryptionStandard}
                className="w-full p-2 bg-slate-100 border border-slate-300 rounded font-mono text-slate-800 text-xs"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                FIPS 140-2 Level 3 certified cryptographic envelope.
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="font-semibold text-slate-800 block">Immutable Audit Logging:</span>
                <span className="text-[10px] text-slate-500">
                  Record every SHA-256 transaction hash to tamper-proof ledger
                </span>
              </div>
              <input
                type="checkbox"
                checked={auditLoggingEnabled}
                onChange={(e) => setAuditLoggingEnabled(e.target.checked)}
                className="w-4 h-4 text-blue-900 rounded"
              />
            </div>
          </div>
        </div>

        {/* 3. Aadhaar e-KYC & Data Privacy */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Shield className="w-4 h-4 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-sm">Aadhaar e-KYC & Privacy Controls</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 block">
                  Aadhaar e-KYC Integration (UIDAI Sandbox):
                </span>
                <span className="text-[10px] text-slate-500">
                  Auto-verify Pattedar name match with UIDAI biometric vault
                </span>
              </div>
              <input
                type="checkbox"
                checked={aadhaarEkycEnabled}
                onChange={(e) => setAadhaarEkycEnabled(e.target.checked)}
                className="w-4 h-4 text-blue-900 rounded"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                <span className="font-semibold text-slate-800 block">
                  Automatic PII Masking on Public Exports:
                </span>
                <span className="text-[10px] text-slate-500">
                  Redact mobile numbers, Aadhaar digits, and bank details on public RoRs
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoMaskPII}
                onChange={(e) => setAutoMaskPII(e.target.checked)}
                className="w-4 h-4 text-blue-900 rounded"
              />
            </div>
          </div>
        </div>

        {/* 4. Jurisdiction & Regional Language Settings */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Building className="w-4 h-4 text-purple-700" />
            <h3 className="font-bold text-slate-900 text-sm">Jurisdiction & Language Settings</h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                Active Indic Language Preference:
              </label>
              <select
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-xs font-medium"
              >
                {LANGUAGE_OPTIONS.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.native} ({lang.label})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase">State</label>
                <input
                  type="text"
                  value={jurisdictionState}
                  onChange={(e) => setJurisdictionState(e.target.value)}
                  className="w-full p-1.5 border border-slate-300 rounded text-xs font-semibold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase">District</label>
                <input
                  type="text"
                  value={jurisdictionDistrict}
                  onChange={(e) => setJurisdictionDistrict(e.target.value)}
                  className="w-full p-1.5 border border-slate-300 rounded text-xs font-semibold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase">Mandal</label>
                <input
                  type="text"
                  value={jurisdictionMandal}
                  onChange={(e) => setJurisdictionMandal(e.target.value)}
                  className="w-full p-1.5 border border-slate-300 rounded text-xs font-semibold text-slate-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 5. Citizen Care & Landowner Inquiry Gateway */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3 md:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded bg-emerald-100 text-emerald-800">
                <Globe className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Citizen Care & Landowner Contact Gateway</h3>
                <p className="text-[11px] text-slate-500">
                  Settings for direct citizen-to-landowner inquiries and 24x7 Tahsil Helpdesk
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
              Active Hotline
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                Citizen Toll-Free Helpline:
              </label>
              <input
                type="text"
                defaultValue="1800-425-2525"
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-xs font-mono font-semibold"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Operated Mon-Sat 08:00 AM - 08:00 PM IST
              </span>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">
                Helpdesk Support Email:
              </label>
              <input
                type="email"
                defaultValue="customercare@bhoomisetu.gov.in"
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-xs font-mono font-semibold"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Standard SLA response within 4 working hours
              </span>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">
                Pattadar SMS Notification Gateway:
              </label>
              <select className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-xs font-medium">
                <option value="cdac">CDAC National SMS Gateway (Govt)</option>
                <option value="nic">NIC Sandes Gateway</option>
              </select>
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Sends OTP & alerts when citizens submit land inquiries
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
