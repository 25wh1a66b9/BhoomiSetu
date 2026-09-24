import React, { useState } from 'react';
import { Search, Bell, Globe, Shield, ChevronDown, CheckCircle, AlertTriangle, X, Headphones } from 'lucide-react';
import { LanguageCode } from '../types/landRecord';
import { LANGUAGE_OPTIONS } from '../data/mockData';

interface HeaderProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  pendingReviewCount: number;
  onNavigateToHelpDesk?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  searchQuery,
  onSearchChange,
  pendingReviewCount,
  onNavigateToHelpDesk
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Validation Discrepancy Flagged',
      detail: 'Record LR-1002 (Warangal) area computation differs from mother survey parcel.',
      time: '12m ago',
      type: 'warning'
    },
    {
      id: 2,
      title: 'Batch Extraction Completed',
      detail: 'Batch #419 with 24 ROR Pahani documents processed with 96.2% avg confidence.',
      time: '45m ago',
      type: 'success'
    },
    {
      id: 3,
      title: 'Cadastral GIS Sync',
      detail: 'Sub-division parcel geometries matched with Survey of India benchmark coordinates.',
      time: '2h ago',
      type: 'info'
    }
  ];

  const currentLangObj = LANGUAGE_OPTIONS.find((l) => l.code === currentLanguage) || LANGUAGE_OPTIONS[0];

  return (
    <header className="sticky top-0 z-40 bg-[#0b1f3a] text-white border-b border-slate-700/80 shadow-sm">
      {/* Tricolor Saffron/White/Green Micro-Stripe */}
      <div className="h-0.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600" />

      <div className="flex items-center justify-between px-4 lg:px-6 py-2.5">
        {/* System Name & Indian Government Lockup */}
        <div className="flex items-center gap-3">
          {/* Ashoka Wheel / Digital India Icon */}
          <div className="w-9 h-9 rounded bg-[#132c52] border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-label="Government of India Emblem">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1" />
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white font-serif">
                BHOOMISETU <span className="text-amber-400 font-sans text-xs uppercase px-1.5 py-0.2 rounded bg-amber-500/20 border border-amber-400/40">AI</span>
              </span>
              <span className="hidden xl:inline-block text-[11px] text-slate-300 font-medium border-l border-slate-600 pl-2">
                National Land Record Digitization & Verified Landowner Connect
              </span>
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
              <span>Department of Land Resources (DoLR)</span>
              <span>·</span>
              <span className="text-emerald-400">DILRMP 2.0 Compliant</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Survey No, Owner Name, Khasra, Khata, Village..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-[#132c52] border border-slate-600/80 rounded-md pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 transition-all font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Section: Language, Notifications, User */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Help Desk Quick Button */}
          {onNavigateToHelpDesk && (
            <button
              onClick={onNavigateToHelpDesk}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-600/60 rounded text-xs font-semibold text-emerald-300 transition-colors shadow-2xs"
              title="BhoomiSetu 24x7 Help Desk"
            >
              <Headphones className="w-3.5 h-3.5 text-emerald-400" />
              <span>Help Desk</span>
            </button>
          )}

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLangMenu(!showLangMenu);
                setShowNotifications(false);
                setShowUserMenu(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#132c52] hover:bg-[#1a3a6b] rounded border border-slate-600/80 text-xs font-medium text-slate-200 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{currentLangObj.native}</span>
              <span className="sm:hidden font-mono uppercase">{currentLangObj.code}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-1 w-44 bg-slate-900 border border-slate-700 rounded shadow-xl py-1 z-50 text-xs">
                <div className="px-3 py-1 text-[10px] text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                  Select Language / భాష
                </div>
                {LANGUAGE_OPTIONS.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-800 transition-colors ${
                      currentLanguage === lang.code ? 'text-amber-400 font-semibold bg-slate-800/60' : 'text-slate-300'
                    }`}
                  >
                    <span>{lang.native}</span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowLangMenu(false);
                setShowUserMenu(false);
              }}
              className="relative p-1.5 rounded bg-[#132c52] hover:bg-[#1a3a6b] border border-slate-600/80 text-slate-300 hover:text-white transition-colors"
              title="System Alerts & Notifications"
            >
              <Bell className="w-4 h-4" />
              {pendingReviewCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center border-2 border-[#0b1f3a]">
                  {pendingReviewCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-1 w-80 bg-slate-900 border border-slate-700 rounded shadow-2xl p-2 z-50 text-xs">
                <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-800">
                  <span className="font-semibold text-white">System Notifications</span>
                  <span className="text-[10px] text-amber-400 font-mono">{notifications.length} Unread</span>
                </div>
                <div className="divide-y divide-slate-800 max-h-72 overflow-y-auto mt-1">
                  {notifications.map((item) => (
                    <div key={item.id} className="p-2 hover:bg-slate-800/80 transition-colors">
                      <div className="flex items-start gap-2">
                        {item.type === 'warning' ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-slate-200 text-xs">{item.title}</p>
                          <p className="text-[11px] text-slate-400 leading-snug mt-0.5">{item.detail}</p>
                          <span className="text-[10px] text-slate-500 font-mono mt-1 block">{item.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Role: Administrator */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowLangMenu(false);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded bg-[#132c52] hover:bg-[#1a3a6b] border border-slate-600/80 transition-colors text-left"
            >
              <div className="w-7 h-7 rounded bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                BS
              </div>
              <div className="hidden lg:block leading-none">
                <div className="text-xs font-semibold text-slate-100">Boinapally Sirija, IAS</div>
                <div className="text-[10px] text-amber-300 font-medium">Role: Administrator</div>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-1 w-56 bg-slate-900 border border-slate-700 rounded shadow-2xl py-1 z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-800">
                  <div className="font-semibold text-white">Smt. Boinapally Sirija (IAS)</div>
                  <div className="text-[11px] text-slate-400">Joint Secretary (Land Reforms & Digital Records)</div>
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                    <Shield className="w-3 h-3" /> Digital India Gov-ID Verified
                  </div>
                </div>
                <div className="px-3 py-1.5 text-[11px] text-slate-400">
                  <div>NIC Identity: <strong>sirija-bhoomisetu-nic</strong></div>
                  <div>Jurisdiction: <strong>National Administration</strong></div>
                </div>
                <div className="border-t border-slate-800 px-3 py-1.5">
                  <button
                    onClick={() => setShowUserMenu(false)}
                    className="text-amber-400 hover:text-amber-300 text-xs font-medium"
                  >
                    Switch to Tahsildar / Verifier View
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
