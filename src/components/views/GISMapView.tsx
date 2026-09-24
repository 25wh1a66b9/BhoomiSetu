import React, { useState } from 'react';
import {
  MapPin,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Search,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Compass,
  Eye,
  Info,
  Sliders,
  Phone,
  ShieldCheck,
  Headphones
} from 'lucide-react';
import { CadastralParcel, RecordStatus, LandRecord, LandClassification } from '../../types/landRecord';
import { CADASTRAL_PARCELS } from '../../data/mockData';
import { CustomerCareModal } from '../CustomerCareModal';

interface GISMapViewProps {
  onSelectParcelRecord?: (surveyNumber: string) => void;
}

export const GISMapView: React.FC<GISMapViewProps> = ({ onSelectParcelRecord }) => {
  const [selectedParcel, setSelectedParcel] = useState<CadastralParcel>(CADASTRAL_PARCELS[1]); // Default to 124/2 (Ravi Kumar Reddy)
  const [zoom, setZoom] = useState<number>(1);
  const [mapMode, setMapMode] = useState<'cadastral' | 'satellite' | 'hybrid'>('cadastral');
  const [searchLocation, setSearchLocation] = useState<string>('');
  const [showSurveyNumbers, setShowSurveyNumbers] = useState<boolean>(true);
  const [showBoundaries, setShowBoundaries] = useState<boolean>(true);
  const [showWaterBodies, setShowWaterBodies] = useState<boolean>(true);
  const [isCustomerCareOpen, setIsCustomerCareOpen] = useState<boolean>(false);

  // Filter or highlight parcel from search
  const filteredParcels = CADASTRAL_PARCELS.filter(
    (p) =>
      !searchLocation ||
      p.surveyNumber.toLowerCase().includes(searchLocation.toLowerCase()) ||
      p.owner.toLowerCase().includes(searchLocation.toLowerCase()) ||
      p.village.toLowerCase().includes(searchLocation.toLowerCase())
  );

  const getStatusColor = (status: RecordStatus, isSatellite: boolean) => {
    switch (status) {
      case 'Verified':
      case 'Validated':
        return isSatellite
          ? { fill: 'rgba(16, 185, 129, 0.35)', stroke: '#10b981' }
          : { fill: 'rgba(209, 250, 229, 0.8)', stroke: '#059669' };
      case 'Needs Review':
        return isSatellite
          ? { fill: 'rgba(239, 68, 68, 0.45)', stroke: '#ef4444' }
          : { fill: 'rgba(254, 226, 226, 0.85)', stroke: '#dc2626' };
      default: // Pending
        return isSatellite
          ? { fill: 'rgba(245, 158, 11, 0.4)', stroke: '#f59e0b' }
          : { fill: 'rgba(254, 243, 199, 0.85)', stroke: '#d97706' };
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded font-bold">
              BHUNAKSHA & GIS INTEGRATION
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Coordinates: 17.4399° N, 78.6811° E (EPSG:4326)
            </span>
          </div>
          <h2 className="text-lg font-bold font-serif text-slate-900">
            Cadastral Survey Map & Parcel Topology Viewer
          </h2>
        </div>

        {/* Map Mode Toggle Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setMapMode('cadastral')}
            className={`px-3 py-1 rounded-md transition-all ${
              mapMode === 'cadastral'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cadastral FMB
          </button>
          <button
            onClick={() => setMapMode('satellite')}
            className={`px-3 py-1 rounded-md transition-all ${
              mapMode === 'satellite'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Satellite View
          </button>
          <button
            onClick={() => setMapMode('hybrid')}
            className={`px-3 py-1 rounded-md transition-all ${
              mapMode === 'hybrid'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hybrid Overlay
          </button>
        </div>
      </div>

      {/* Main Map + Inspection Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[680px]">
        {/* Map Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 rounded-lg border border-slate-700 shadow-inner relative flex flex-col overflow-hidden">
          {/* Top Map Floating Toolbar */}
          <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            {/* Search location inside map */}
            <div className="pointer-events-auto relative w-64 shadow-md">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search Survey # or Village..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full bg-slate-900/90 text-white placeholder-slate-400 text-xs pl-8 pr-3 py-1.5 rounded-md border border-slate-700 backdrop-blur-xs focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            {/* Layer Toggles Floating Card */}
            <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-xs border border-slate-700 px-3 py-1.5 rounded-md text-xs text-slate-200 flex items-center gap-3 shadow-md">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showSurveyNumbers}
                  onChange={(e) => setShowSurveyNumbers(e.target.checked)}
                  className="rounded text-amber-500"
                />
                <span className="text-[11px]">Survey #</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showBoundaries}
                  onChange={(e) => setShowBoundaries(e.target.checked)}
                  className="rounded text-amber-500"
                />
                <span className="text-[11px]">Boundaries</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showWaterBodies}
                  onChange={(e) => setShowWaterBodies(e.target.checked)}
                  className="rounded text-amber-500"
                />
                <span className="text-[11px]">Canal / Water</span>
              </label>
            </div>
          </div>

          {/* Floating Zoom & Map Controls */}
          <div className="absolute right-3 bottom-8 z-20 flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-xs p-1 rounded-md border border-slate-700 shadow-md">
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.2, 2.2))}
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.2, 0.7))}
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Cadastral / Satellite SVG Map Renderer */}
          <div className="flex-1 w-full h-full relative overflow-auto flex items-center justify-center p-4">
            <div
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'center center',
                transition: 'transform 0.2s ease-out'
              }}
              className="relative w-[700px] h-[450px] shadow-2xl rounded-md overflow-hidden"
            >
              {/* Satellite / Terrain Textured Canvas Simulation */}
              {mapMode !== 'cadastral' ? (
                <div
                  className="absolute inset-0 bg-slate-800"
                  style={{
                    backgroundImage:
                      'radial-gradient(#1e3a1f 2px, transparent 2px), radial-gradient(#264a27 2px, #1a331a 2px)',
                    backgroundSize: '24px 24px',
                    backgroundPosition: '0 0, 12px 12px'
                  }}
                >
                  {/* Simulated farmland crop rows & topography */}
                  <div className="absolute inset-0 opacity-40 bg-gradient-to-tr from-emerald-950 via-amber-950/40 to-emerald-900" />
                  <div className="absolute top-20 left-10 w-96 h-96 border border-emerald-500/20 rounded-full blur-2xl" />
                </div>
              ) : (
                <div
                  className="absolute inset-0 bg-[#f7f5ef] border border-[#d9d5c5]"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #ece8db 1px, transparent 1px), linear-gradient(to bottom, #ece8db 1px, transparent 1px)',
                    backgroundSize: '35px 35px'
                  }}
                />
              )}

              {/* SVG Cadastral Map Layer */}
              <svg className="absolute inset-0 w-full h-full select-none" viewBox="0 0 700 450">
                {/* Defs for gradients & patterns */}
                <defs>
                  <pattern id="hatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="8" stroke="#ef4444" strokeWidth="1.5" opacity="0.4" />
                  </pattern>
                  <linearGradient id="canalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#0369a1" stopOpacity="0.9" />
                  </linearGradient>
                </defs>

                {/* Village Perimeter Road (Cart Track) */}
                <path
                  d="M 60,40 L 640,30 L 630,380 L 70,390 Z"
                  fill="none"
                  stroke={mapMode === 'cadastral' ? '#94a3b8' : '#cbd5e1'}
                  strokeWidth="6"
                  strokeDasharray="8 4"
                />

                {/* Water Canal Poramboke if enabled */}
                {showWaterBodies && (
                  <path
                    d="M 95,175 L 240,160 L 440,150 L 590,180 L 580,220 L 430,190 L 230,200 L 90,215 Z"
                    fill="url(#canalGradient)"
                    stroke="#0284c7"
                    strokeWidth="1.5"
                  />
                )}

                {/* Land Parcels Polygons */}
                {filteredParcels.map((parcel) => {
                  const isSelected = selectedParcel.id === parcel.id;
                  const isSatellite = mapMode !== 'cadastral';
                  const style = getStatusColor(parcel.status, isSatellite);

                  const pointsString = parcel.coordinates.map((c) => `${c.x},${c.y}`).join(' ');

                  return (
                    <g key={parcel.id} className="cursor-pointer" onClick={() => setSelectedParcel(parcel)}>
                      {/* Polygon */}
                      <polygon
                        points={pointsString}
                        fill={
                          parcel.status === 'Needs Review'
                            ? 'url(#hatch)'
                            : isSelected
                            ? 'rgba(59, 130, 246, 0.45)'
                            : style.fill
                        }
                        stroke={isSelected ? '#2563eb' : style.stroke}
                        strokeWidth={isSelected ? '3.5' : showBoundaries ? '2' : '0.5'}
                        strokeDasharray={parcel.status === 'Needs Review' ? '4 2' : 'none'}
                        className="transition-all hover:opacity-90"
                      />

                      {/* Survey Number Label & Centroid */}
                      {showSurveyNumbers && (
                        <g>
                          <circle
                            cx={parcel.centroid.x}
                            cy={parcel.centroid.y}
                            r="3"
                            fill={isSelected ? '#1d4ed8' : '#475569'}
                          />
                          <text
                            x={parcel.centroid.x}
                            y={parcel.centroid.y - 7}
                            textAnchor="middle"
                            fill={mapMode === 'cadastral' ? '#0f172a' : '#ffffff'}
                            fontSize="11"
                            fontWeight="bold"
                            fontFamily="monospace"
                            className="pointer-events-none drop-shadow-xs"
                          >
                            {parcel.surveyNumber}
                          </text>
                          <text
                            x={parcel.centroid.x}
                            y={parcel.centroid.y + 14}
                            textAnchor="middle"
                            fill={mapMode === 'cadastral' ? '#475569' : '#e2e8f0'}
                            fontSize="9"
                            fontFamily="sans-serif"
                            className="pointer-events-none"
                          >
                            {parcel.area}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Compass Indicator */}
              <div className="absolute top-4 right-4 bg-slate-900/80 p-1.5 rounded-full border border-slate-700 text-amber-400">
                <Compass className="w-5 h-5 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Bottom Map Status Legend Bar */}
          <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Verified Parcel (Clean Title)
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Needs Review (Boundary/Area Alert)
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Pending Digitization
              </span>
            </div>
            <span className="font-mono text-[10px] text-slate-500">
              Survey of India Benchmark · Scale 1:2500
            </span>
          </div>
        </div>

        {/* Parcel Inspection Sidebar (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-lg border border-slate-200 shadow-xs p-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <span className="text-[10px] font-mono uppercase bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded font-bold">
                PARCEL ATTRIBUTE INSPECTOR
              </span>
              <h3 className="font-bold text-slate-900 text-base font-serif mt-1">
                Survey Parcel #{selectedParcel.surveyNumber}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                CAD ID: {selectedParcel.id} · Sub-division {selectedParcel.subDivision}
              </p>
            </div>

            {/* Status Card */}
            <div
              className={`p-3 rounded-md text-xs border ${
                selectedParcel.status === 'Verified'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : selectedParcel.status === 'Needs Review'
                  ? 'bg-red-50 border-red-300 text-red-900'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}
            >
              <div className="flex items-center justify-between font-bold mb-1">
                <span>Record Status:</span>
                <span className="font-mono">{selectedParcel.status}</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {selectedParcel.status === 'Verified'
                  ? 'Polygon coordinates verified with ground GCP survey stones. Clear ownership.'
                  : selectedParcel.status === 'Needs Review'
                  ? 'Area mismatch flagged between deed text (1.78 Ac) and GIS polygon perimeter (1.18 Ac).'
                  : 'Survey stones scheduled for DGPS re-measurement.'}
              </p>
            </div>

            {/* Field Attributes Table (Section 10 Requirements) */}
            <div className="space-y-2 text-xs divide-y divide-slate-100">
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Owner / Pattedar:</span>
                <strong className="text-slate-900 text-right">{selectedParcel.owner}</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Survey Number:</span>
                <strong className="text-blue-900 font-mono">{selectedParcel.surveyNumber}</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Computed Area:</span>
                <strong className="text-slate-900 font-mono">{selectedParcel.area}</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Village:</span>
                <strong className="text-slate-900">{selectedParcel.village}</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">District:</span>
                <strong className="text-slate-900">{selectedParcel.district}</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Land Classification:</span>
                <strong className="text-slate-900">{selectedParcel.landType}</strong>
              </div>
            </div>

            {/* Geo Coordinates */}
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-[11px] font-mono space-y-1">
              <span className="text-slate-500 block uppercase text-[9px]">GCP Benchmark Coordinates:</span>
              <div>Lat: 17°26'23.6" N</div>
              <div>Lon: 78°40'51.9" E</div>
            </div>

            {/* Landowner Contact & Customer Care Options (if verified) */}
            {selectedParcel.status === 'Verified' && (
              <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Verified Pattadar Contact</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-1 rounded">
                    KYC Verified
                  </span>
                </div>
                <div className="text-[11px] space-y-1 text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Phone:</span>
                    <strong className="font-mono text-emerald-900">
                      {selectedParcel.ownerContact?.phone || '+91 98480 23411'}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Toll-Free Desk:</span>
                    <strong className="font-mono text-slate-800">1800-425-2525</strong>
                  </div>
                </div>
                <button
                  onClick={() => setIsCustomerCareOpen(true)}
                  className="w-full mt-1 py-1.5 px-2.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Contact Owner & Customer Care</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Action Button */}
          <div className="pt-3 border-t border-slate-200">
            <button
              onClick={() => onSelectParcelRecord && onSelectParcelRecord(selectedParcel.surveyNumber)}
              className="w-full py-2 px-3 rounded-md bg-[#0b1f3a] hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              Inspect RoR Deed in AI Extractor
            </button>
          </div>
        </div>
      </div>

      {/* Customer Care Modal for GIS Parcel */}
      <CustomerCareModal
        isOpen={isCustomerCareOpen}
        onClose={() => setIsCustomerCareOpen(false)}
        record={{
          id: selectedParcel.id,
          documentType: 'Cadastral Map',
          primaryLanguage: 'en',
          uploadDate: '2026-09-20',
          processedDate: '2026-09-20',
          status: selectedParcel.status,
          overallConfidence: 96,
          validationScore: 97,
          ownerName: selectedParcel.owner,
          fatherHusbandName: 'Authorized Pattadar Record',
          surveyNumber: selectedParcel.surveyNumber,
          khasraNumber: selectedParcel.surveyNumber.split('/')[0] || selectedParcel.surveyNumber,
          khataNumber: '482',
          plotNumber: `Sub-division ${selectedParcel.subDivision}`,
          area: selectedParcel.area,
          village: selectedParcel.village,
          mandalTehsil: 'Ghatkesar',
          district: selectedParcel.district,
          state: 'Telangana',
          landClassification: (selectedParcel.landType || 'Wet Land (Tari / Irrigated)') as LandClassification,
          ownershipType: 'Pattedar (Absolute Title)',
          mutationNumber: 'MUT-GIS-2024',
          registrationNumber: 'SRO-REG-8812',
          registrationDate: '2020-04-12',
          previousOwner: 'Ancestral Title',
          currentOwner: selectedParcel.owner,
          extractedFields: [],
          validationRules: [],
          ownerContact: selectedParcel.ownerContact || {
            phone: '+91 98480 23411',
            alternatePhone: '+91 98492 81190',
            email: 'ravi.k.reddy@agritelangana.in',
            address: `${selectedParcel.village}, ${selectedParcel.district}`,
            preferredContactHours: '09:00 AM - 06:00 PM',
            isKycVerified: true,
            allowDirectEnquiry: true,
            tahsilHelpdeskNumber: '1800-425-2525 / 040-27201944',
            revenueInspectorName: 'Shri V. Anand Rao (Revenue Inspector)',
            revenueInspectorPhone: '+91 94901 83204'
          }
        }}
      />
    </div>
  );
};
