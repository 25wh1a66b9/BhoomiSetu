import React, { useState } from 'react';
import {
  Headphones,
  MessageSquare,
  HelpCircle,
  Send,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Search,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  AlertCircle,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Building,
  Calendar,
  Ticket
} from 'lucide-react';
import { LandRecord } from '../../types/landRecord';

interface HelpDeskViewProps {
  records: LandRecord[];
  onSelectRecord?: (recordId: string) => void;
  onNavigateToTab?: (tab: any) => void;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  recordData?: {
    id: string;
    owner: string;
    village: string;
    surveyNumber: string;
    status: string;
    confidence: number;
    eta?: string;
  };
}

export const HelpDeskView: React.FC<HelpDeskViewProps> = ({
  records,
  onSelectRecord,
  onNavigateToTab
}) => {
  // Navigation inside Help Desk
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'form' | 'faqs'>('chat');

  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    state: 'Telangana',
    district: 'Warangal',
    surveyOrDocId: '',
    category: 'Record Digitization Pending',
    priority: 'Normal',
    message: ''
  });
  const [submittedTicket, setSubmittedTicket] = useState<{
    ticketId: string;
    date: string;
    category: string;
  } | null>(null);

  // FAQ State
  const [faqSearch, setFaqSearch] = useState('');
  const [faqCategory, setFaqCategory] = useState<string>('All');
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(1);

  // Live Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'bot',
      text: 'Namaste! Welcome to BhoomiSetu Citizen Help Desk. I can check your land record digitization status, explain validation errors, or help you contact local revenue officers. How can I assist you today?',
      timestamp: '10:00 AM'
    },
    {
      id: 'm-2',
      sender: 'bot',
      text: '💡 Quick tip: Type your Document ID (e.g. LR-1001, LR-1002, LR-1007) or Survey Number to instantly check AI OCR progress.',
      timestamp: '10:00 AM'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);

  // FAQs Data
  const faqs = [
    {
      id: 1,
      category: 'Digitization Status',
      question: 'How long does AI land record digitization take once uploaded?',
      answer:
        'Standard scanned documents (PDFs, JPGs, TIFFs) are processed within 15 to 45 seconds through our CRNN and LayoutLMv3 pipeline. Once extracted, automated cadastral cross-verification runs in real-time. If flagged with low confidence (<75%), the record moves to the Human-in-the-Loop (HITL) Tahsil Verification Queue, which is audited by the local Revenue Inspector within 24 to 48 hours.'
    },
    {
      id: 2,
      category: 'Digitization Status',
      question: 'What does "Needs Review" status mean for my land record?',
      answer:
        'A "Needs Review" flag occurs when AI detects an ambiguity, such as: (1) low OCR confidence on faded ink or historical Modi/Urdu script, (2) area mismatch between deed text and cadastral map boundaries, or (3) missing sub-division numbers. A certified Village Revenue Officer (VRO) will review the high-resolution scan alongside physical pahani registers.'
    },
    {
      id: 3,
      category: 'Citizen Rights & Passbook',
      question: 'How can I download my digitally verified Form 1-B Pattadar Passbook?',
      answer:
        'Once your land record status reaches "Verified" or "Validated", navigate to the "Land Records" tab, locate your Khata or Survey Number, and click the Pattadar Passbook icon (Form 1-B). You can inspect the QR-coded, SHA-256 digitally signed e-Title Deed and print or export it directly for bank loan or registry purposes.'
    },
    {
      id: 4,
      category: 'Contacting Owners',
      question: 'How does the BhoomiSetu Landowner Direct Contact feature work?',
      answer:
        'To protect citizen privacy while enabling clean title transparency, BhoomiSetu provides Aadhaar-authenticated contact channels for verified land records. You can click "Contact Owner" on any verified land parcel to submit a direct enquiry or dial the Pattadar during permitted contact hours. All calls and messages are logged to prevent illicit broker solicitation.'
    },
    {
      id: 5,
      category: 'Verification & GIS',
      question: 'What if the cadastral map boundary does not match my physical land parcel?',
      answer:
        'You can submit a "DGPS Re-Survey Request" via our Help Desk contact form with your Survey Number and benchmark coordinates. A DGPS survey team equipped with Rovers will visit the field, take Ground Control Point (GCP) readings, and update the GIS parcel geometry on BhoomiSetu with official endorsement from the Assistant Director of Survey & Land Records.'
    },
    {
      id: 6,
      category: 'Citizen Rights & Passbook',
      question: 'Is the BhoomiSetu digital land record legally valid in courts and banks?',
      answer:
        'Yes. Under Section 65B of the Indian Evidence Act, 1872 and the Information Technology Act, 2000, e-records carrying the cryptographic SHA-256 ledger hash and digital signature of the Tahsildar / Revenue Divisional Officer (RDO) hold equal evidentiary status to physical certified extracts.'
    }
  ];

  const filteredFaqs = faqs.filter((f) => {
    const matchCategory = faqCategory === 'All' || f.category === faqCategory;
    const matchSearch =
      f.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.answer.toLowerCase().includes(faqSearch.toLowerCase());
    return matchCategory && matchSearch;
  });

  // Handle Chat Submit
  const handleSendMessage = (textToSend?: string) => {
    const msg = (textToSend || inputMessage).trim();
    if (!msg) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: msg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsBotTyping(true);

    setTimeout(() => {
      generateBotResponse(msg);
      setIsBotTyping(false);
    }, 800);
  };

  const generateBotResponse = (query: string) => {
    const lower = query.toLowerCase();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Look for exact or partial record IDs (e.g. LR-1001, 1002, LR-1007)
    const matchedRecord = records.find(
      (r) =>
        lower.includes(r.id.toLowerCase()) ||
        lower.includes(r.surveyNumber.toLowerCase()) ||
        lower.includes(r.khataNumber.toLowerCase())
    );

    if (matchedRecord) {
      const isVerified = matchedRecord.status === 'Verified' || matchedRecord.status === 'Validated';
      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: `Found Record ${matchedRecord.id} for Pattadar "${matchedRecord.ownerName}" in Village ${matchedRecord.village} (${matchedRecord.district}). Current Digitization Status: ${matchedRecord.status.toUpperCase()} (${matchedRecord.overallConfidence}% AI Confidence).`,
        timestamp: time,
        recordData: {
          id: matchedRecord.id,
          owner: matchedRecord.ownerName,
          village: `${matchedRecord.village}, ${matchedRecord.district}`,
          surveyNumber: matchedRecord.surveyNumber,
          status: matchedRecord.status,
          confidence: matchedRecord.overallConfidence,
          eta: isVerified ? 'Verified & Finalized' : 'Estimated queue resolution: 24 hours'
        }
      };
      setChatMessages((prev) => [...prev, botMsg]);
      return;
    }

    if (lower.includes('status') || lower.includes('check') || lower.includes('lr-')) {
      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: `To check status, please provide a valid Record ID (e.g. LR-1001, LR-1002, LR-1007, LR-1011) or your Survey Number. Currently, ${records.length} records are indexed in the live BhoomiSetu database.`,
        timestamp: time
      };
      setChatMessages((prev) => [...prev, botMsg]);
      return;
    }

    if (lower.includes('contact') || lower.includes('phone') || lower.includes('owner') || lower.includes('care')) {
      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: `You can reach the National BhoomiSetu Citizen Helpline directly at 1800-425-2525 (Toll-Free). For verified properties, direct owner contact is enabled on the "Land Records" and "GIS Map" views with Aadhaar e-KYC compliance.`,
        timestamp: time
      };
      setChatMessages((prev) => [...prev, botMsg]);
      return;
    }

    if (lower.includes('review') || lower.includes('error') || lower.includes('mismatch')) {
      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: `Records marked "Needs Review" have been routed to the Tahsil Human Verification Queue. A certified Revenue Inspector will review physical record books and cross-examine cadastral boundaries before final endorsement.`,
        timestamp: time
      };
      setChatMessages((prev) => [...prev, botMsg]);
      return;
    }

    // Default Fallback
    const fallbackMsg: ChatMessage = {
      id: `b-${Date.now()}`,
      sender: 'bot',
      text: `Thank you for your query. For official assistance, you can also fill out the Contact Form in the next tab or call Toll-Free 1800-425-2525. Would you like to check a specific Record ID like LR-1001 or LR-1007?`,
      timestamp: time
    };
    setChatMessages((prev) => [...prev, fallbackMsg]);
  };

  // Handle Contact Form Submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.message) {
      alert('Please fill in Name, Mobile Number, and Message.');
      return;
    }

    const tkt = `TKT-${new Date().getFullYear()}-BHU-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedTicket({
      ticketId: tkt,
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      category: formData.category
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0b1f3a] via-[#0d2a52] to-[#08172c] text-white p-5 rounded-lg border border-slate-700 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-400/30 font-bold">
                CITIZEN CARE & GRIEVANCE REDRESSAL
              </span>
              <span className="text-slate-300 text-xs">National Support Center</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-white flex items-center gap-2">
              <Headphones className="w-6 h-6 text-amber-400" />
              BhoomiSetu Help Desk & Customer Care
            </h1>
            <p className="text-xs text-slate-300 max-w-3xl mt-1 leading-relaxed">
              24x7 citizen support portal for inquiries regarding AI land record digitization, RoR validation status, cadastral map verification, and direct landowner connection.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href="tel:18004252525"
              className="px-3.5 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-sm"
            >
              <Phone className="w-4 h-4" />
              <span>1800-425-2525 (Toll-Free)</span>
            </a>
            <a
              href="mailto:customercare@bhoomisetu.gov.in"
              className="px-3.5 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 flex items-center gap-1.5 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-amber-300" />
              <span>customercare@bhoomisetu.gov.in</span>
            </a>
          </div>
        </div>
      </div>

      {/* Tabs Selector Bar */}
      <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveSubTab('chat')}
            className={`px-3.5 py-2 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'chat'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            Live Status Chatbot
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
          </button>

          <button
            onClick={() => setActiveSubTab('form')}
            className={`px-3.5 py-2 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'form'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Ticket className="w-3.5 h-3.5 text-amber-400" />
            Citizen Contact & Grievance Form
          </button>

          <button
            onClick={() => setActiveSubTab('faqs')}
            className={`px-3.5 py-2 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${
              activeSubTab === 'faqs'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            Citizen FAQs & Guidelines
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-500 pr-2">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-emerald-600" />
            Operating: <strong>Mon-Sat 08:00 AM - 08:00 PM</strong>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-blue-900" />
            SLA: <strong>24h Resolution</strong>
          </span>
        </div>
      </div>

      {/* SUB-TAB 1: LIVE STATUS CHATBOT */}
      {activeSubTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[640px]">
          {/* Main Chat Interface (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-lg border border-slate-200 shadow-xs flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  <Bot className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900">BhoomiSetu AI Assistant</h3>
                    <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded border border-emerald-300">
                      Online
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Live Record Digitization & Verification Inquiry Desk
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  setChatMessages([
                    {
                      id: `m-${Date.now()}`,
                      sender: 'bot',
                      text: 'Chat history reset. How may I help you with your land records today?',
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                  ])
                }
                className="p-1.5 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors"
                title="Clear Chat"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="px-3.5 py-2 bg-slate-100/70 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-[11px]">
              <span className="text-slate-400 font-semibold shrink-0">Quick Inquiries:</span>
              <button
                onClick={() => handleSendMessage('Check status of LR-1001')}
                className="px-2.5 py-1 rounded bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium whitespace-nowrap transition-colors"
              >
                Check LR-1001 (Rampur)
              </button>
              <button
                onClick={() => handleSendMessage('Check status of LR-1002')}
                className="px-2.5 py-1 rounded bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium whitespace-nowrap transition-colors"
              >
                Check LR-1002 (Needs Review)
              </button>
              <button
                onClick={() => handleSendMessage('Check status of LR-1007')}
                className="px-2.5 py-1 rounded bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium whitespace-nowrap transition-colors"
              >
                Check LR-1007 (Ananthapur)
              </button>
              <button
                onClick={() => handleSendMessage('How to contact verified landowner?')}
                className="px-2.5 py-1 rounded bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium whitespace-nowrap transition-colors"
              >
                Contact Landowner
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${
                    msg.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      msg.sender === 'user'
                        ? 'bg-amber-500 text-slate-950 font-bold text-xs'
                        : 'bg-blue-900 text-white'
                    }`}
                  >
                    {msg.sender === 'user' ? (
                      <User className="w-3.5 h-3.5" />
                    ) : (
                      <Bot className="w-3.5 h-3.5 text-amber-400" />
                    )}
                  </div>

                  <div
                    className={`max-w-[80%] rounded-lg p-3 text-xs leading-relaxed shadow-2xs ${
                      msg.sender === 'user'
                        ? 'bg-[#0b1f3a] text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {/* Rich Record Card inside Chat */}
                    {msg.recordData && (
                      <div className="mt-2.5 p-2.5 bg-slate-50 rounded border border-slate-300 text-[11px] text-slate-800 space-y-1">
                        <div className="flex items-center justify-between font-bold border-b border-slate-200 pb-1">
                          <span className="text-blue-900 font-mono">
                            {msg.recordData.id} · Survey #{msg.recordData.surveyNumber}
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded font-semibold ${
                              msg.recordData.status === 'Verified' || msg.recordData.status === 'Validated'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {msg.recordData.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 pt-0.5">
                          <div>
                            <span className="text-slate-500">Pattadar:</span>{' '}
                            <strong>{msg.recordData.owner}</strong>
                          </div>
                          <div>
                            <span className="text-slate-500">Village:</span>{' '}
                            <span>{msg.recordData.village}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Confidence:</span>{' '}
                            <strong className="text-emerald-700">{msg.recordData.confidence}%</strong>
                          </div>
                          <div>
                            <span className="text-slate-500">Resolution:</span>{' '}
                            <span className="font-mono text-slate-600">{msg.recordData.eta}</span>
                          </div>
                        </div>

                        {onSelectRecord && (
                          <button
                            onClick={() => onSelectRecord(msg.recordData!.id)}
                            className="w-full mt-2 py-1 px-2 rounded bg-blue-900 hover:bg-slate-800 text-white font-bold text-[10px] flex items-center justify-center gap-1 transition-colors"
                          >
                            <span>Inspect Full RoR in Extractor</span>
                            <ExternalLink className="w-3 h-3 text-amber-400" />
                          </button>
                        )}
                      </div>
                    )}

                    <span
                      className={`text-[9px] block text-right mt-1 ${
                        msg.sender === 'user' ? 'text-slate-300' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isBotTyping && (
                <div className="flex items-center gap-2 text-slate-500 text-xs italic">
                  <div className="w-7 h-7 rounded-full bg-blue-900 text-white flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  </div>
                  <span>BhoomiSetu Assistant is checking database registers...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-slate-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask a question or enter Record ID / Survey #..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="px-4 py-2 rounded-md bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar Status Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
            {/* Quick Live Status Card */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-slate-900">Live Support Telemetry</h4>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Helpdesk Status:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Available (0 wait time)
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Active Duty Officers:</span>
                  <strong className="text-slate-800">42 VROs & RIs online</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Verified Titles In Registry:</span>
                  <strong className="text-emerald-700 font-mono">
                    {records.filter((r) => r.status === 'Verified').length} Verified Records
                  </strong>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Average AI OCR Accuracy:</span>
                  <strong className="text-blue-900 font-mono">95.4% (CRNN+LayoutLMv3)</strong>
                </div>
              </div>

              <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900">
                <strong>Need immediate escalation?</strong> Call toll-free <strong>1800-425-2525</strong> to speak directly with an authorized Tahsil Revenue Officer.
              </div>
            </div>

            {/* Sample Verified Records to Test */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-2 flex-1">
              <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <FileText className="w-4 h-4 text-blue-900" />
                <h4 className="text-xs font-bold text-slate-900">Try Inquiring on These Records:</h4>
              </div>

              <div className="space-y-1.5 overflow-y-auto max-h-[220px] text-xs">
                {records.slice(0, 5).map((rec) => (
                  <button
                    key={rec.id}
                    onClick={() => handleSendMessage(`Check status of ${rec.id}`)}
                    className="w-full p-2 rounded border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-left transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold font-mono text-blue-900">{rec.id}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[170px]">
                        {rec.ownerName} ({rec.village})
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${
                        rec.status === 'Verified'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {rec.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CITIZEN CONTACT & GRIEVANCE FORM */}
      {activeSubTab === 'form' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-6 max-w-4xl mx-auto">
          {submittedTicket ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300 uppercase">
                  Grievance Registered Successfully
                </span>
                <h3 className="text-xl font-bold font-serif text-slate-900 mt-2">
                  Complaint Ticket #{submittedTicket.ticketId}
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                  Your grievance regarding <strong>{submittedTicket.category}</strong> has been logged to the National BhoomiSetu Redressal Ledger. An SMS with tracking link has been dispatched to {formData.mobile}.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg max-w-md mx-auto text-xs space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-500">Citizen Name:</span>
                  <strong>{formData.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Jurisdiction:</span>
                  <strong>{formData.district}, {formData.state}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Office:</span>
                  <strong>Tahsildar / Sub-Collector Desk</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Official SLA:</span>
                  <strong className="text-emerald-700">24-48 Hours Resolution</strong>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setSubmittedTicket(null);
                    setFormData({
                      name: '',
                      mobile: '',
                      email: '',
                      state: 'Telangana',
                      district: 'Warangal',
                      surveyOrDocId: '',
                      category: 'Record Digitization Pending',
                      priority: 'Normal',
                      message: ''
                    });
                  }}
                  className="px-4 py-2 rounded-md bg-[#0b1f3a] text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  Submit Another Inquiry
                </button>
                <button
                  onClick={() => setActiveSubTab('chat')}
                  className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Go to Live Chat
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded font-bold">
                    OFFICIAL REDRESSAL PORTAL
                  </span>
                  <span className="text-xs text-slate-500 font-mono">DILRMP Citizen Care Form</span>
                </div>
                <h3 className="text-base font-bold font-serif text-slate-900">
                  Submit Record Inquiry or Digitization Grievance
                </h3>
                <p className="text-xs text-slate-600">
                  Please provide your contact details and parcel identifiers. Inquiries are audited and responded to within 24 hours.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Citizen / Applicant Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Mobile Number (for SMS Tracking) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98480 12345"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. ramesh.sharma@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Record ID or Survey / Khasra Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. LR-1001 or Survey 124/2"
                    value={formData.surveyOrDocId}
                    onChange={(e) => setFormData({ ...formData, surveyOrDocId: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State</label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Telangana">Telangana</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">District</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Category of Inquiry / Grievance
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Record Digitization Pending">Record Digitization Pending</option>
                    <option value="Boundary / Cadastral Map Discrepancy">
                      Boundary / Cadastral Map Discrepancy
                    </option>
                    <option value="Aadhaar e-KYC Verification">Aadhaar e-KYC Verification</option>
                    <option value="Pattadar Passbook Form 1-B Query">
                      Pattadar Passbook Form 1-B Query
                    </option>
                    <option value="Mutation Status / Title Transfer">
                      Mutation Status / Title Transfer
                    </option>
                    <option value="Direct Landowner Contact Request">
                      Direct Landowner Contact Request
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority Level</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Normal">Normal (SLA: 48 Hours)</option>
                    <option value="Urgent">Urgent (Sale / Registry in Progress - 24 Hours)</option>
                    <option value="Legal Dispute">Legal Dispute / Court Sub judice</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 text-xs">
                  Detailed Description of Request / Error <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Specify survey number, village name, discrepancy details, or query regarding OCR extraction..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Protected by BhoomiSetu Public Grievance Redressal Charter
                </span>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-[#0b1f3a] hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  Submit Grievance
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* SUB-TAB 3: CITIZEN FAQS & GUIDELINES */}
      {activeSubTab === 'faqs' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base font-serif">
                Frequently Asked Questions for Citizens & Landowners
              </h3>
              <p className="text-xs text-slate-500">
                Official guidance on AI record digitization, cadastral maps, and legal title validation
              </p>
            </div>

            {/* FAQ Search */}
            <div className="relative w-full md:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search FAQs (e.g. Passbook, Modi script)..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          {/* FAQ Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
            {['All', 'Digitization Status', 'Citizen Rights & Passbook', 'Contacting Owners', 'Verification & GIS'].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setFaqCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    faqCategory === cat
                      ? 'bg-blue-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          {/* Accordion FAQ Items */}
          <div className="space-y-2.5 pt-1">
            {filteredFaqs.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No FAQs match your search criteria. You can ask directly in the Live Chat tab.
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isExpanded = expandedFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="border border-slate-200 rounded-lg overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                      className="w-full p-3.5 bg-slate-50/60 hover:bg-slate-100/80 text-left flex items-center justify-between gap-3 text-xs font-bold text-slate-900 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono bg-blue-100 text-blue-900 px-1.5 py-0.2 rounded font-bold">
                          {faq.category}
                        </span>
                        <span>{faq.question}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="p-4 bg-white text-xs text-slate-700 leading-relaxed border-t border-slate-200">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
