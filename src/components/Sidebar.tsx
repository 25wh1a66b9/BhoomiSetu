import React from 'react';
import {
  LayoutDashboard,
  Upload,
  Cpu,
  CheckSquare,
  ListOrdered,
  FileSpreadsheet,
  MapPin,
  BarChart3,
  History,
  Code2,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  BrainCircuit,
  Headphones,
  Phone,
  MessageSquare,
  HelpCircle
} from 'lucide-react';

export type NavigationTab = 
  | 'dashboard'
  | 'upload'
  | 'extraction'
  | 'validation'
  | 'verification'
  | 'records'
  | 'gis'
  | 'analytics'
  | 'audit'
  | 'api'
  | 'settings'
  | 'helpdesk';

interface SidebarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  pendingReviewCount: number;
  validationErrorCount: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenAIEngine: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  pendingReviewCount,
  validationErrorCount,
  collapsed,
  onToggleCollapse,
  onOpenAIEngine
}) => {
  const navItems = [
    { id: 'dashboard' as NavigationTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload' as NavigationTab, label: 'Upload Records', icon: Upload },
    { id: 'extraction' as NavigationTab, label: 'AI Extraction', icon: Cpu, badge: 'Live AI' },
    {
      id: 'validation' as NavigationTab,
      label: 'Validation',
      icon: CheckSquare,
      badgeCount: validationErrorCount > 0 ? validationErrorCount : undefined,
      badgeColor: 'bg-amber-600 text-white'
    },
    {
      id: 'verification' as NavigationTab,
      label: 'Verification Queue',
      icon: ListOrdered,
      badgeCount: pendingReviewCount > 0 ? pendingReviewCount : undefined,
      badgeColor: 'bg-red-600 text-white'
    },
    { id: 'records' as NavigationTab, label: 'Land Records', icon: FileSpreadsheet },
    { id: 'gis' as NavigationTab, label: 'GIS / Map View', icon: MapPin },
    {
      id: 'helpdesk' as NavigationTab,
      label: 'BhoomiSetu Help Desk',
      icon: Headphones,
      badge: '24x7 Care'
    },
    { id: 'analytics' as NavigationTab, label: 'Analytics', icon: BarChart3 },
    { id: 'audit' as NavigationTab, label: 'Audit Trail', icon: History },
    { id: 'api' as NavigationTab, label: 'API Integration', icon: Code2 },
    { id: 'settings' as NavigationTab, label: 'Settings', icon: Settings }
  ];

  return (
    <aside
      className={`bg-[#08172c] text-slate-300 flex flex-col border-r border-slate-800 transition-all duration-300 select-none z-30 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Sidebar Header / Collapse Button */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-slate-800/80">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
              PORTAL NAVIGATION
            </span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white ml-auto"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? 'bg-amber-500/15 text-amber-300 font-semibold border-l-3 border-amber-400 pl-2.5 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-amber-400' : 'text-slate-400'
                }`}
              />

              {!collapsed && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}

              {!collapsed && item.badge && (
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
                  {item.badge}
                </span>
              )}

              {!collapsed && item.badgeCount !== undefined && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${item.badgeColor}`}
                >
                  {item.badgeCount}
                </span>
              )}

              {collapsed && item.badgeCount !== undefined && (
                <span className="w-2 h-2 rounded-full bg-red-500 absolute top-2 right-2" />
              )}
            </button>
          );
        })}
      </nav>

      {/* BhoomiSetu Help Desk Component Card */}
      {!collapsed ? (
        <div className="p-3 m-2 rounded-md bg-gradient-to-br from-[#0c2e36] to-[#081f26] border border-emerald-700/60 text-xs shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-emerald-200 flex items-center gap-1.5 text-[11px]">
              <Headphones className="w-3.5 h-3.5 text-emerald-400" />
              BhoomiSetu Help Desk
            </span>
            <span className="flex items-center gap-1 text-[9px] font-mono font-bold bg-emerald-900/80 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-600/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              24x7 Care
            </span>
          </div>
          <p className="text-[10px] text-slate-300 leading-tight mb-2">
            Instant digitization status, citizen grievance form & live support desk.
          </p>

          <div className="space-y-1.5">
            <button
              onClick={() => onTabChange('helpdesk')}
              className={`w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded font-bold text-[10px] transition-colors shadow-2xs ${
                activeTab === 'helpdesk'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              <MessageSquare className="w-3 h-3 text-amber-300" />
              Open Live Chat & Support
            </button>

            <a
              href="tel:18004252525"
              className="w-full flex items-center justify-center gap-1 py-1 px-2 rounded bg-slate-900/80 hover:bg-slate-900 border border-emerald-800/80 text-emerald-300 hover:text-white font-mono text-[10px] transition-colors"
            >
              <Phone className="w-2.5 h-2.5 text-emerald-400" />
              <span>Toll-Free: 1800-425-2525</span>
            </a>
          </div>
        </div>
      ) : (
        <div className="px-2 py-1 flex justify-center">
          <button
            onClick={() => onTabChange('helpdesk')}
            className={`p-2.5 rounded-md transition-colors ${
              activeTab === 'helpdesk'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-400 hover:bg-slate-800 hover:text-emerald-300'
            }`}
            title="BhoomiSetu Help Desk (1800-425-2525)"
          >
            <Headphones className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* AI Engine & SIH Hackathon Callout */}
      {!collapsed && (
        <div className="p-3 m-2 rounded-md bg-[#0e223d] border border-slate-700/70 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-slate-100 flex items-center gap-1.5 text-[11px]">
              <BrainCircuit className="w-3.5 h-3.5 text-amber-400" />
              AI OCR & NLP Engine
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed mb-2">
            Multilingual Indic OCR (CRNN+TrOCR), LayoutLMv3 Field Extraction, and Cadastral GIS Validator active.
          </p>
          <button
            onClick={onOpenAIEngine}
            className="w-full flex items-center justify-center gap-1.5 py-1 px-2 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] transition-colors shadow-sm"
          >
            <Sparkles className="w-3 h-3" />
            Inspect AI Architecture
          </button>
        </div>
      )}

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 text-[10px] text-slate-500 text-center">
        {!collapsed ? (
          <div>
            <div className="text-slate-400 font-medium">Smart India Hackathon Prototype</div>
            <div>DILRMP 2.0 · DoLR, Govt. of India</div>
          </div>
        ) : (
          <span className="font-mono text-[9px] text-amber-400">SIH</span>
        )}
      </div>
    </aside>
  );
};
