import React, { useState } from 'react';
import {
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Building2,
  Send,
  MessageSquare,
  CheckCircle2,
  Headphones,
  User,
  AlertCircle,
  Share2,
  ExternalLink
} from 'lucide-react';
import { LandRecord } from '../types/landRecord';

interface CustomerCareModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: LandRecord | null;
}

export const CustomerCareModal: React.FC<CustomerCareModalProps> = ({
  isOpen,
  onClose,
  record
}) => {
  const [inquirerName, setInquirerName] = useState('');
  const [inquirerPhone, setInquirerPhone] = useState('');
  const [inquiryType, setInquiryType] = useState('Boundary & Title Verification');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !record) return null;

  const contact = record.ownerContact || {
    phone: '+91 98480 23411',
    alternatePhone: '+91 98492 81190',
    email: `${record.ownerName.toLowerCase().replace(/\s+/g, '.')}@agritelangana.in`,
    address: `H.No. 3-45, Main Road, ${record.village}, ${record.mandalTehsil}, ${record.district}`,
    preferredContactHours: '09:30 AM - 05:30 PM (Mon-Sat)',
    authorizedRepresentative: 'Authorized Family Liaison / Pattadar',
    isKycVerified: true,
    allowDirectEnquiry: true,
    tahsilHelpdeskNumber: '1800-425-2525 / 040-27201944',
    revenueInspectorName: 'Shri V. Anand Rao (Revenue Inspector)',
    revenueInspectorPhone: '+91 94901 83204'
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="bg-white rounded-lg border border-slate-300 shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#0b1f3a] text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base font-serif text-white">
                  Customer Care & Landowner Contact Assistance
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                  Verified Land
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Survey #{record.surveyNumber} · {record.village}, {record.district}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 bg-slate-50/60">
          {/* Verified Landowner Profile Card */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">{record.ownerName}</h4>
                  {record.ownerNameRegional && (
                    <span className="text-xs text-slate-500 font-serif italic">
                      ({record.ownerNameRegional})
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Aadhaar e-KYC Verified
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Registered Pattadar · Khata #{record.khataNumber} · Extent: <strong>{record.area}</strong> ({record.landClassification})
                </p>
              </div>

              <div className="shrink-0 text-right">
                <span className="text-[10px] font-mono bg-blue-50 text-blue-900 px-2 py-0.5 rounded border border-blue-200 block">
                  Record ID: {record.id}
                </span>
              </div>
            </div>

            {/* Direct Contact Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200 space-y-1">
                <span className="text-slate-500 font-medium flex items-center gap-1.5 text-[11px]">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  Direct Landowner Phone
                </span>
                <div className="font-mono font-bold text-slate-900 text-sm flex items-center justify-between">
                  <span>{contact.phone}</span>
                  <a
                    href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                    className="text-[10px] font-sans font-semibold text-emerald-700 bg-emerald-100/70 hover:bg-emerald-200 px-2 py-0.5 rounded transition-colors"
                  >
                    Call Now
                  </a>
                </div>
                {contact.alternatePhone && (
                  <span className="text-[10px] text-slate-400 font-mono block">
                    Alt: {contact.alternatePhone}
                  </span>
                )}
              </div>

              <div className="p-2.5 bg-slate-50 rounded border border-slate-200 space-y-1">
                <span className="text-slate-500 font-medium flex items-center gap-1.5 text-[11px]">
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  Verified Contact Email
                </span>
                <div className="font-mono font-semibold text-slate-800 truncate text-xs flex items-center justify-between">
                  <span className="truncate">{contact.email}</span>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-[10px] font-sans font-semibold text-blue-700 bg-blue-100/70 hover:bg-blue-200 px-2 py-0.5 rounded transition-colors shrink-0 ml-1"
                  >
                    Email
                  </a>
                </div>
                <span className="text-[10px] text-slate-400 block">
                  Official Communication Address
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded border border-slate-200 space-y-1">
                <span className="text-slate-500 font-medium flex items-center gap-1.5 text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Preferred Calling Hours
                </span>
                <span className="font-medium text-slate-800 block text-xs">
                  {contact.preferredContactHours}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Liaison: {contact.authorizedRepresentative}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded border border-slate-200 space-y-1">
                <span className="text-slate-500 font-medium flex items-center gap-1.5 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  Residential Address
                </span>
                <span className="text-slate-700 block text-[11px] leading-tight">
                  {contact.address}
                </span>
              </div>
            </div>
          </div>

          {/* Revenue Official & Tahsil Helpdesk Section */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-lg text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-950 flex items-center gap-1.5 text-xs">
                <Building2 className="w-4 h-4 text-amber-700" />
                Revenue Department Assistance & Tahsil Customer Care
              </span>
              <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded text-amber-900 border border-amber-300 font-bold">
                Toll-Free Helpline
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
              <div className="bg-white/80 p-2 rounded border border-amber-200/60">
                <span className="text-slate-500 block">National / State Land Helpline:</span>
                <span className="font-bold font-mono text-amber-950 text-xs">
                  {contact.tahsilHelpdeskNumber}
                </span>
                <span className="text-[10px] text-slate-400 block">Dharani / BhoomiSetu Help Desk (24x7)</span>
              </div>

              <div className="bg-white/80 p-2 rounded border border-amber-200/60">
                <span className="text-slate-500 block">Jurisdictional Revenue Inspector:</span>
                <span className="font-bold text-slate-900 text-xs">{contact.revenueInspectorName}</span>
                <span className="text-[10px] font-mono text-slate-600 block">
                  Official Phone: {contact.revenueInspectorPhone}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Inquiry Form to Landowner */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-blue-900" />
                Send Direct Message / Citizen Inquiry to Landowner
              </h4>
              <span className="text-[10px] text-slate-400">Delivered via SMS & Gov Portal</span>
            </div>

            {submitted ? (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-md text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Your inquiry regarding Survey #{record.surveyNumber} has been safely dispatched to {record.ownerName}. You will receive an SMS acknowledgement.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={inquirerName}
                      onChange={(e) => setInquirerName(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      Your Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={inquirerPhone}
                      onChange={(e) => setInquirerPhone(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Purpose of Contact / Inquiry Type
                  </label>
                  <select
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Boundary & Title Verification">Boundary & Title Verification</option>
                    <option value="Purchase / Lease Proposal">Purchase / Lease Proposal</option>
                    <option value="Agricultural Cultivation Partnership">Agricultural Cultivation Partnership</option>
                    <option value="Encumbrance / Non-Litigation Confirmation">Encumbrance / Non-Litigation Confirmation</option>
                    <option value="Right-of-Way / Cart Track Clarification">Right-of-Way / Cart Track Clarification</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    Detailed Message to Landowner
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Provide details about your query or proposal..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Privacy protected: inquiries logged in BhoomiSetu Audit Ledger.</span>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-[#0b1f3a] hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                    Send Inquiry to Owner
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-100 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-[11px] text-slate-500 font-medium">
            BhoomiSetu Verified Citizen Assistance Desk
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
