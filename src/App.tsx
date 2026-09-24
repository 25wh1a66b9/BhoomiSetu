import React, { useState } from 'react';
import { MOCK_LAND_RECORDS } from './data/mockData';
import { LandRecord, LanguageCode } from './types/landRecord';
import { Header } from './components/Header';
import { Sidebar, NavigationTab } from './components/Sidebar';
import { AIEngineModal } from './components/AIEngineModal';
import { DashboardView } from './components/views/DashboardView';
import { UploadView } from './components/views/UploadView';
import { ExtractionView } from './components/views/ExtractionView';
import { ValidationView } from './components/views/ValidationView';
import { VerificationQueueView } from './components/views/VerificationQueueView';
import { LandRecordsView } from './components/views/LandRecordsView';
import { GISMapView } from './components/views/GISMapView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { AuditTrailView } from './components/views/AuditTrailView';
import { ApiIntegrationView } from './components/views/ApiIntegrationView';
import { SettingsView } from './components/views/SettingsView';
import { HelpDeskView } from './components/views/HelpDeskView';

export default function App() {
  const [records, setRecords] = useState<LandRecord[]>(MOCK_LAND_RECORDS);
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [selectedRecordId, setSelectedRecordId] = useState<string>('LR-1001');
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isAIEngineModalOpen, setIsAIEngineModalOpen] = useState<boolean>(false);

  // Active record lookup
  const currentRecord = records.find((r) => r.id === selectedRecordId) || records[0];

  // Counts for sidebar badges
  const pendingReviewCount = records.filter(
    (r) => r.status === 'Needs Review' || r.status === 'Pending' || r.overallConfidence < 85
  ).length;

  const validationErrorCount = records.filter((r) => r.status === 'Needs Review').length;

  // Handlers
  const handleSelectRecord = (recordId: string) => {
    setSelectedRecordId(recordId);
    setActiveTab('extraction');
  };

  const handleUpdateRecord = (updatedRecord: LandRecord) => {
    setRecords((prev) => prev.map((r) => (r.id === updatedRecord.id ? updatedRecord : r)));
  };

  const handleApproveRecord = (recordId: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? {
              ...r,
              status: 'Verified',
              validationScore: 99,
              overallConfidence: Math.max(r.overallConfidence, 95)
            }
          : r
      )
    );
  };

  const handleSendForVerification = (recordId: string, remarks?: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? {
              ...r,
              status: 'Needs Review',
              notes: remarks || r.notes
            }
          : r
      )
    );
  };

  const handleRejectRecord = (recordId: string, remarks?: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? {
              ...r,
              status: 'Needs Review',
              validationScore: 35,
              notes: remarks || 'Rejected by Revenue Officer.'
            }
          : r
      )
    );
  };

  const handleRecordCreated = (newRecord: LandRecord) => {
    setRecords((prev) => [newRecord, ...prev]);
    setSelectedRecordId(newRecord.id);
  };

  const handleParcelRoRInspect = (surveyNumber: string) => {
    const match = records.find((r) => r.surveyNumber === surveyNumber);
    if (match) {
      setSelectedRecordId(match.id);
      setActiveTab('extraction');
    } else {
      setActiveTab('records');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-amber-400 selection:text-slate-950">
      {/* Top Header */}
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        pendingReviewCount={pendingReviewCount}
        onNavigateToHelpDesk={() => setActiveTab('helpdesk')}
      />

      {/* Main Workspace Body: Sidebar + Dynamic View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          pendingReviewCount={pendingReviewCount}
          validationErrorCount={validationErrorCount}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onOpenAIEngine={() => setIsAIEngineModalOpen(true)}
        />

        {/* Primary Content View Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/90">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                records={records}
                onSelectRecord={handleSelectRecord}
                onNavigateToTab={setActiveTab}
              />
            )}

            {activeTab === 'upload' && (
              <UploadView
                onRecordCreated={handleRecordCreated}
                onNavigateToExtraction={(recordId) => {
                  setSelectedRecordId(recordId);
                  setActiveTab('extraction');
                }}
                records={records}
              />
            )}

            {activeTab === 'extraction' && (
              <ExtractionView
                currentRecord={currentRecord}
                onUpdateRecord={handleUpdateRecord}
                onSendToVerification={handleSendForVerification}
                onNavigateToValidation={(recordId) => {
                  setSelectedRecordId(recordId);
                  setActiveTab('validation');
                }}
                allRecords={records}
                onSelectRecord={setSelectedRecordId}
              />
            )}

            {activeTab === 'validation' && (
              <ValidationView
                currentRecord={currentRecord}
                onApproveRecord={handleApproveRecord}
                onSendForVerification={handleSendForVerification}
                onRejectRecord={handleRejectRecord}
                allRecords={records}
                onSelectRecord={setSelectedRecordId}
              />
            )}

            {activeTab === 'verification' && (
              <VerificationQueueView
                records={records}
                onUpdateRecord={handleUpdateRecord}
                onApproveRecord={handleApproveRecord}
                onRejectRecord={handleRejectRecord}
              />
            )}

            {activeTab === 'records' && (
              <LandRecordsView
                records={records}
                onSelectRecord={handleSelectRecord}
                onNavigateToTab={setActiveTab}
              />
            )}

            {activeTab === 'gis' && (
              <GISMapView onSelectParcelRecord={handleParcelRoRInspect} />
            )}

            {activeTab === 'analytics' && <AnalyticsView />}

            {activeTab === 'audit' && <AuditTrailView />}

            {activeTab === 'api' && <ApiIntegrationView />}

            {activeTab === 'settings' && (
              <SettingsView
                currentLanguage={currentLanguage}
                onLanguageChange={setCurrentLanguage}
              />
            )}

            {activeTab === 'helpdesk' && (
              <HelpDeskView
                records={records}
                onSelectRecord={handleSelectRecord}
                onNavigateToTab={setActiveTab}
              />
            )}
          </div>
        </main>
      </div>

      {/* AI Processing Engine & Continuous Learning Modal */}
      <AIEngineModal
        isOpen={isAIEngineModalOpen}
        onClose={() => setIsAIEngineModalOpen(false)}
      />
    </div>
  );
}
