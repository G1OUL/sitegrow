export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'good';

export type IssueCategory = 
  | 'conversion'     // Enquiries, phone calls, forms, CTA
  | 'seo'            // Titles, meta, headings, canonicals
  | 'usability'      // Mobile viewport, layout, touch targets
  | 'performance'    // Response speed, page weight, assets
  | 'security';      // HTTPS, security headers

export type IssueStatus = 'open' | 'in_progress' | 'resolved';

export interface AuditRecommendation {
  id: string;
  title: string;
  category: IssueCategory;
  severity: Severity;
  status: IssueStatus;
  impactScore: number; // e.g. 5-15 point gain
  whatIsIt: string;
  whyItMatters: string;
  howToFix: string;
  codeSnippet?: string;
  cmsGuide?: string; // WordPress, Shopify, Squarespace notes
  evidence?: string; // e.g., "Found 4 images missing alt attribute: logo.png, banner.jpg"
}

export type MeasurementType = 'measured' | 'estimated' | 'unavailable';

export interface AuditCheckItem {
  id: string;
  name: string;
  category: IssueCategory;
  type: MeasurementType;
  status: 'passed' | 'warning' | 'failed' | 'not_applicable';
  value: string | number | boolean;
  expected?: string;
  details: string;
}

export interface PillarScore {
  score: number; // 0-100
  label: string;
  passedCount: number;
  totalChecks: number;
  statusText: string;
}

export interface AuditResult {
  id: string;
  url: string;
  cleanUrl: string;
  siteName: string;
  timestamp: string;
  overallScore: number;
  previousScore?: number;
  industryAverage: number;
  isDemo?: boolean;
  pillars: {
    conversion: PillarScore;
    seo: PillarScore;
    usability: PillarScore;
    performance: PillarScore;
  };
  metrics: {
    responseTimeMs: number;
    htmlSizeBytes: number;
    isHttps: boolean;
    h1Count: number;
    h1Text?: string;
    titleTag?: string;
    titleLength: number;
    metaDescription?: string;
    metaDescriptionLength: number;
    hasViewport: boolean;
    imagesCount: number;
    imagesMissingAltCount: number;
    hasClickToCall: boolean;
    hasEmailLink: boolean;
    hasContactForm: boolean;
    ctaButtonCount: number;
    hasCanonical: boolean;
    canonicalUrl?: string;
    hasOpenGraph: boolean;
    securityHeadersCount: number;
  };
  checks: AuditCheckItem[];
  recommendations: AuditRecommendation[];
  limitations: string[];
}

export interface HistoricalAuditPoint {
  date: string;
  overallScore: number;
  conversionScore: number;
  seoScore: number;
  usabilityScore: number;
  performanceScore: number;
}

export interface UserSettings {
  businessName: string;
  websiteUrl: string;
  contactEmail: string;
  industry: string;
  scanDepth: 'quick' | 'deep';
  automatedScanFrequency: 'weekly' | 'biweekly' | 'monthly' | 'disabled';
  enableEmailAlerts: boolean;
  demoMode: boolean;
  agencyMode: boolean;
  agencyName?: string;
  agencyLogoUrl?: string;
  accentBrandColor?: string;
}

