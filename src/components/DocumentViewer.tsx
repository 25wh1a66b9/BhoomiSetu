import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Eye, EyeOff, Layers, Maximize2 } from 'lucide-react';
import { ExtractedField, LandRecord } from '../types/landRecord';

interface DocumentViewerProps {
  record: LandRecord;
  selectedFieldKey?: string;
  onSelectField?: (fieldKey: string) => void;
  showBoundingBoxes?: boolean;
  onToggleBoundingBoxes?: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  record,
  selectedFieldKey,
  onSelectField,
  showBoundingBoxes = true,
  onToggleBoundingBoxes
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [highContrast, setHighContrast] = useState<boolean>(false);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-lg overflow-hidden border border-slate-700 shadow-inner">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-800 border-b border-slate-700 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-amber-400 font-mono">DOC REF: {record.id}</span>
          <span className="text-slate-500">·</span>
          <span className="truncate max-w-[180px]">{record.documentType}</span>
          <span className="text-slate-500">·</span>
          <span className="uppercase text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded font-mono">
            300 DPI SCAN
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`p-1.5 rounded transition-colors ${
              highContrast ? 'bg-amber-500/20 text-amber-300' : 'hover:bg-slate-700 text-slate-300'
            }`}
            title="Toggle Binarization / High Contrast Filter"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
          {onToggleBoundingBoxes && (
            <button
              onClick={onToggleBoundingBoxes}
              className={`p-1.5 rounded transition-colors ${
                showBoundingBoxes ? 'bg-emerald-500/20 text-emerald-300' : 'hover:bg-slate-700 text-slate-300'
              }`}
              title="Toggle AI OCR Bounding Boxes"
            >
              {showBoundingBoxes ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
          )}
          <div className="w-[1px] h-3.5 bg-slate-700 mx-1" />
          <button
            onClick={handleZoomOut}
            className="p-1.5 hover:bg-slate-700 rounded text-slate-300 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-1 text-[11px] font-mono text-slate-400 min-w-[36px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1.5 hover:bg-slate-700 rounded text-slate-300 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRotate}
            className="p-1.5 hover:bg-slate-700 rounded text-slate-300 transition-colors"
            title="Rotate 90°"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Scanned Document Canvas Viewport */}
      <div className="relative flex-1 overflow-auto p-4 bg-slate-950 flex items-center justify-center">
        <div
          style={{
            transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
            transformOrigin: 'center center',
            transition: 'transform 0.15s ease-out'
          }}
          className="relative transition-all duration-200"
        >
          {/* Authentic Document Canvas Representation */}
          <div
            className={`w-[600px] min-h-[780px] p-6 text-slate-900 shadow-2xl relative select-none rounded-[2px] transition-all ${
              highContrast
                ? 'bg-white filter contrast-150 grayscale'
                : 'bg-[#faf4e6] border-2 border-[#d9cca7]'
            }`}
            style={{
              backgroundImage: highContrast
                ? 'none'
                : 'radial-gradient(#c2b591 0.75px, transparent 0.75px), radial-gradient(#d6c9a3 0.75px, #faf4e6 0.75px)',
              backgroundSize: '30px 30px',
              backgroundPosition: '0 0, 15px 15px'
            }}
          >
            {/* Aging and Document Crease Visuals */}
            <div className="absolute inset-0 pointer-events-none opacity-30 bg-gradient-to-b from-amber-100/40 via-transparent to-amber-900/10" />
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-amber-900/15 pointer-events-none shadow-[0_1px_1px_rgba(255,255,255,0.4)]" />

            {/* Indian Non-Judicial Stamp Paper / Revenue Header */}
            <div className="border-b-2 border-slate-800 pb-3 mb-4 text-center relative">
              {/* Ashoka Emblem Motif in SVG */}
              <div className="flex justify-center mb-1">
                <div className="w-12 h-12 rounded-full border-2 border-slate-800 flex items-center justify-center p-1 bg-amber-50">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-slate-800 fill-current" aria-label="National Emblem">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1" />
                    <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="1" />
                  </svg>
                </div>
              </div>
              <p className="text-[10px] tracking-widest uppercase font-serif font-bold text-slate-700">
                GOVERNMENT OF TELANGANA / REVENUE DEPARTMENT
              </p>
              <h2 className="text-sm font-bold uppercase tracking-tight text-slate-900 font-serif">
                FORM 1-B (NAMUNA) · RECORD OF RIGHTS (PAHANI)
              </h2>
              <p className="text-[9px] text-slate-600 font-serif italic">
                Issued under Section 3 of the Telangana Rights in Land and Pattadar Pass Books Act
              </p>

              {/* Official Seal Watermark Stamp */}
              <div className="absolute right-2 top-0 border-2 border-red-700/60 rounded-full w-16 h-16 flex flex-col items-center justify-center p-0.5 rotate-[-12deg] pointer-events-none text-red-800/80 font-serif text-[7px] leading-tight text-center">
                <span>TAHSILDAR</span>
                <span className="font-bold text-[8px]">OFFICE</span>
                <span>CERTIFIED</span>
              </div>
            </div>

            {/* Document Metadata Bar */}
            <div className="grid grid-cols-3 gap-2 text-[10px] font-mono border border-slate-700 p-2 mb-3 bg-white/60">
              <div>
                <span className="text-slate-500">DISTRICT:</span>{' '}
                <span className="font-bold">{record.district}</span>
              </div>
              <div>
                <span className="text-slate-500">MANDAL:</span>{' '}
                <span className="font-bold">{record.mandalTehsil}</span>
              </div>
              <div>
                <span className="text-slate-500">VILLAGE:</span>{' '}
                <span className="font-bold">{record.village}</span>
              </div>
            </div>

            {/* Historical Tabular Record Section */}
            <div className="border border-slate-800 text-[10px] mb-4">
              <div className="grid grid-cols-12 bg-slate-200/80 font-semibold border-b border-slate-800 text-[9px] p-1 text-center font-serif">
                <div className="col-span-2 border-r border-slate-800">KHATA / KHASRA</div>
                <div className="col-span-3 border-r border-slate-800">PATTADAR NAME</div>
                <div className="col-span-2 border-r border-slate-800">SURVEY NO.</div>
                <div className="col-span-2 border-r border-slate-800">EXTENT (AC.GT)</div>
                <div className="col-span-3">CLASSIFICATION</div>
              </div>

              <div className="grid grid-cols-12 p-2 items-center bg-white/40 font-mono text-[10px]">
                <div className="col-span-2 border-r border-slate-400 pr-1 text-center">
                  <div className="font-bold">{record.khataNumber}</div>
                  <div className="text-[9px] text-slate-500 font-sans">Khasra {record.khasraNumber}</div>
                </div>
                <div className="col-span-3 border-r border-slate-400 px-1">
                  <div className="font-bold font-serif">{record.ownerName}</div>
                  <div className="text-[9px] text-slate-600 font-serif italic">
                    {record.ownerNameRegional || record.fatherHusbandName}
                  </div>
                </div>
                <div className="col-span-2 border-r border-slate-400 px-1 text-center font-bold text-slate-900">
                  {record.surveyNumber}
                </div>
                <div className="col-span-2 border-r border-slate-400 px-1 text-center font-bold">
                  {record.area}
                </div>
                <div className="col-span-3 pl-1 text-[9px] truncate">
                  {record.landClassification}
                </div>
              </div>
            </div>

            {/* Boundary Details (Chaukaddi / Four Boundaries) */}
            <div className="border border-dashed border-slate-600 p-2 text-[9px] mb-3 bg-amber-50/50 font-serif">
              <span className="font-bold uppercase text-[9px] block mb-1">
                Boundary Schedule (చౌహద్దులు / चौहद्दी):
              </span>
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div>• <strong>North:</strong> Survey No. 124/1 (G. Madhusudhan Rao)</div>
                <div>• <strong>South:</strong> Government Canal (Poramboke #125)</div>
                <div>• <strong>East:</strong> Village Cart Track & Survey 124/3</div>
                <div>• <strong>West:</strong> Gram Panchayat boundary stone</div>
              </div>
            </div>

            {/* Encumbrance & Mutation Endorsements */}
            <div className="border-t border-slate-400 pt-2 text-[9px] font-mono text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>Mutation Order: {record.mutationNumber}</span>
                <span>Reg. No: {record.registrationNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Registration Date: {record.registrationDate}</span>
                <span>Title: {record.ownershipType}</span>
              </div>
              <div className="text-[8px] italic text-slate-500 pt-2 border-t border-dotted border-slate-300">
                Archival Reference: SRO Hyderabad Volume 188, Pages 42–46. Scanned from Original Physical Ledger.
              </div>
            </div>

            {/* Rubber Stamp and Handwritten Ink Signatures */}
            <div className="mt-8 flex justify-between items-end pt-4">
              <div className="text-center font-serif text-[8px] text-blue-900 rotate-[-4deg]">
                <div className="border border-blue-900/70 px-2 py-1 rounded bg-blue-50/40 font-mono">
                  VERIFIED BY VRO<br />RAMPUR VILLAGE
                </div>
              </div>
              <div className="text-center font-serif text-[9px] text-slate-800">
                <div className="font-cursive italic font-semibold text-blue-800 text-sm mb-1 tracking-wider">
                  R. Verma
                </div>
                <div className="border-t border-slate-800 pt-0.5 text-[8px] font-bold">
                  Signature of Tahsildar / Revenue Authority
                </div>
              </div>
            </div>

            {/* Bounding Box Highlights Overlay */}
            {showBoundingBoxes &&
              record.extractedFields
                .filter((f) => f.boundingBox)
                .map((field) => {
                  const isSelected = selectedFieldKey === field.key;
                  const isLow = field.confidence < 75;
                  const isMed = field.confidence >= 75 && field.confidence < 90;

                  return (
                    <button
                      key={field.key}
                      onClick={() => onSelectField && onSelectField(field.key)}
                      style={{
                        position: 'absolute',
                        left: `${field.boundingBox!.x}%`,
                        top: `${field.boundingBox!.y}%`,
                        width: `${field.boundingBox!.width}%`,
                        height: `${field.boundingBox!.height}%`
                      }}
                      className={`absolute transition-all cursor-pointer rounded-xs border-2 text-left p-0.5 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-500/25 ring-2 ring-blue-400 z-30'
                          : isLow
                          ? 'border-red-500/80 bg-red-500/15 hover:bg-red-500/30 z-20'
                          : isMed
                          ? 'border-amber-500/80 bg-amber-500/15 hover:bg-amber-500/30 z-10'
                          : 'border-emerald-500/70 bg-emerald-500/10 hover:bg-emerald-500/20 z-10'
                      }`}
                      title={`${field.label}: ${field.value} (${field.confidence}%)`}
                    >
                      <span
                        className={`absolute -top-3.5 left-0 text-[8px] font-mono px-1 py-0.2 rounded font-bold leading-tight ${
                          isLow
                            ? 'bg-red-700 text-white'
                            : isMed
                            ? 'bg-amber-600 text-white'
                            : 'bg-emerald-700 text-white'
                        }`}
                      >
                        {field.confidence}%
                      </span>
                    </button>
                  );
                })}
          </div>
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="px-3 py-1.5 bg-slate-800/90 border-t border-slate-700 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Click colored bounding boxes on document to inspect extracted field & confidence rating</span>
        <span className="font-mono text-[10px] text-slate-400">LayoutLMv3 ·IndicOCR Engine</span>
      </div>
    </div>
  );
};
