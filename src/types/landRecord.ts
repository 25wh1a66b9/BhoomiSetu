export type DocumentType = 
  | 'Sale Deed'
  | 'ROR / Record of Rights'
  | 'Mutation Record'
  | 'Survey Record'
  | 'Cadastral Map'
  | 'Other';

export type LanguageCode = 
  | 'en' 
  | 'te' 
  | 'hi' 
  | 'ta' 
  | 'kn' 
  | 'mr' 
  | 'bn';

export type RecordStatus = 
  | 'Verified' 
  | 'Needs Review' 
  | 'Validated' 
  | 'Pending' 
  | 'Rejected' 
  | 'Uploaded';

export type LandClassification = 
  | 'Wet Land (Tari / Irrigated)' 
  | 'Dry Land (Khushki / Rainfed)' 
  | 'Baghayat (Garden / Orchard)' 
  | 'Commercial / Non-Agricultural' 
  | 'Government Poramboke' 
  | 'Forest / Assigned';

export type OwnershipType = 
  | 'Pattedar (Absolute Title)' 
  | 'Joint Ownership' 
  | 'Inam / Occupancy Right' 
  | 'Leasehold' 
  | 'Ancestral Inheritance';

export interface ExtractedField {
  key: string;
  label: string;
  value: string;
  regionalValue?: string;
  confidence: number; // 0 to 100
  needsReview?: boolean;
  reviewReason?: string;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface ValidationRuleResult {
  id: string;
  title: string;
  description: string;
  status: 'passed' | 'warning' | 'failed';
  fieldAffected?: string;
}

export interface LandRecord {
  id: string; // e.g. LR-1001
  documentType: DocumentType;
  primaryLanguage: LanguageCode;
  uploadDate: string;
  processedDate: string;
  status: RecordStatus;
  overallConfidence: number;
  validationScore: number;
  
  // Land & Ownership Details
  ownerName: string;
  ownerNameRegional?: string;
  fatherHusbandName: string;
  fatherHusbandNameRegional?: string;
  surveyNumber: string; // e.g. "124/2"
  khasraNumber: string; // e.g. "124"
  khataNumber: string; // e.g. "482"
  plotNumber: string; // e.g. "Plot 18"
  area: string; // e.g. "2.45 Acres"
  areaInSqYards?: number;
  village: string;
  villageRegional?: string;
  mandalTehsil: string;
  district: string;
  state: string;
  landClassification: LandClassification;
  ownershipType: OwnershipType;
  
  // Registration & Mutation
  mutationNumber: string;
  registrationNumber: string;
  registrationDate: string;
  previousOwner: string;
  currentOwner: string;
  
  // Extended details
  extractedFields: ExtractedField[];
  validationRules: ValidationRuleResult[];
  notes?: string;
  documentImageUrl?: string;
  cadastralParcelId?: string;
  
  // Landowner Contact & Citizen Customer Care Details (for Verified Lands)
  ownerContact?: OwnerContact;
}

export interface OwnerContact {
  phone: string;
  alternatePhone?: string;
  email: string;
  address: string;
  preferredContactHours: string;
  authorizedRepresentative?: string;
  isKycVerified: boolean;
  allowDirectEnquiry: boolean;
  tahsilHelpdeskNumber: string;
  revenueInspectorName: string;
  revenueInspectorPhone: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  recordId: string;
  previousStatus: string;
  newStatus: string;
  ipAddress?: string;
  remarks?: string;
  // Columns requested in Section 12:
  userOrSystem: string;
  details: string;
  ipOrHash: string;
}

export interface CadastralParcel {
  id: string;
  surveyNumber: string;
  subDivision: string;
  owner: string;
  village: string;
  district: string;
  area: string;
  status: RecordStatus;
  landType: string;
  coordinates: { x: number; y: number }[];
  centroid: { x: number; y: number };
  ownerContact?: OwnerContact;
}

export interface ApiEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST';
  path: string;
  description: string;
  category: string;
  status: string;
  latency?: string;
  sampleRequest: string;
  sampleResponse: string;
}
