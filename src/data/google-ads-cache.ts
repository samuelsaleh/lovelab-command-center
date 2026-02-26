/**
 * Cached Google Ads data for LoveLab Antwerp
 * Last updated: February 2026
 *
 * Serves as fallback when Google Ads API is unavailable.
 * Structure mirrors what /api/google-ads returns.
 */

export interface DailyDataPoint {
  date: string;
  searchBrand: number;
  pmax: number;
  total: number;
}

export interface CampaignData {
  name: string;
  type: string;
  status: string;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  avgCpc: number;
  conversions: number;
  costPerConversion: number;
  convRate: number;
  roas: number;
}

export interface KeywordData {
  keyword: string;
  matchType: 'Exact' | 'Phrase' | 'Broad';
  impressions: number;
  clicks: number;
  ctr: number;
  avgCpc: number;
  conversions: number;
  qualityScore: number;
  impressionShare: number;
}

export interface GeoData {
  country: string;
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  ctr: number;
  avgCpc: number;
}

export interface SearchTermData {
  term: string;
  campaign: string;
  impressions: number;
  clicks: number;
  ctr: number;
  avgCpc: number;
  conversions: number;
  verdict: 'keep' | 'monitor' | 'exclude';
}

export interface DeviceData {
  device: string;
  impressions: number;
  clicks: number;
  spend: number;
  percentage: number;
}

export interface HealthScore {
  category: string;
  score: number;
  maxScore: number;
}

export interface InsightCard {
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  detail: string;
  action: string;
}

export interface ActionStep {
  step: number;
  title: string;
  description: string;
  timeline: string;
}

export const DAILY_SPEND: DailyDataPoint[] = [
  { date: 'Jan 29', searchBrand: 2.15, pmax: 4.55, total: 6.70 },
  { date: 'Jan 30', searchBrand: 3.20, pmax: 3.80, total: 7.00 },
  { date: 'Jan 31', searchBrand: 3.80, pmax: 3.40, total: 7.20 },
  { date: 'Feb 01', searchBrand: 2.90, pmax: 4.10, total: 7.00 },
  { date: 'Feb 02', searchBrand: 2.10, pmax: 5.20, total: 7.30 },
  { date: 'Feb 03', searchBrand: 3.50, pmax: 3.50, total: 7.00 },
  { date: 'Feb 04', searchBrand: 3.10, pmax: 4.40, total: 7.50 },
  { date: 'Feb 05', searchBrand: 2.50, pmax: 4.80, total: 7.30 },
  { date: 'Feb 06', searchBrand: 3.80, pmax: 3.50, total: 7.30 },
  { date: 'Feb 07', searchBrand: 2.90, pmax: 4.50, total: 7.40 },
  { date: 'Feb 08', searchBrand: 3.40, pmax: 4.10, total: 7.50 },
  { date: 'Feb 09', searchBrand: 2.80, pmax: 5.00, total: 7.80 },
  { date: 'Feb 10', searchBrand: 4.20, pmax: 3.60, total: 7.80 },
  { date: 'Feb 11', searchBrand: 4.00, pmax: 4.40, total: 8.40 },
  { date: 'Feb 12', searchBrand: 2.80, pmax: 5.20, total: 8.00 },
  { date: 'Feb 13', searchBrand: 4.50, pmax: 4.00, total: 8.50 },
  { date: 'Feb 14', searchBrand: 5.80, pmax: 5.80, total: 11.60 },
  { date: 'Feb 15', searchBrand: 4.20, pmax: 4.90, total: 9.10 },
  { date: 'Feb 16', searchBrand: 3.10, pmax: 4.40, total: 7.50 },
  { date: 'Feb 17', searchBrand: 2.90, pmax: 4.20, total: 7.10 },
  { date: 'Feb 18', searchBrand: 3.50, pmax: 4.00, total: 7.50 },
  { date: 'Feb 19', searchBrand: 2.80, pmax: 4.70, total: 7.50 },
  { date: 'Feb 20', searchBrand: 4.00, pmax: 3.50, total: 7.50 },
  { date: 'Feb 21', searchBrand: 3.10, pmax: 4.40, total: 7.50 },
  { date: 'Feb 22', searchBrand: 3.50, pmax: 4.00, total: 7.50 },
  { date: 'Feb 23', searchBrand: 2.90, pmax: 4.24, total: 7.14 },
];

export const DAILY_CLICKS: DailyDataPoint[] = [
  { date: 'Jan 29', searchBrand: 2, pmax: 4, total: 6 },
  { date: 'Jan 30', searchBrand: 3, pmax: 3, total: 6 },
  { date: 'Jan 31', searchBrand: 4, pmax: 3, total: 7 },
  { date: 'Feb 01', searchBrand: 3, pmax: 4, total: 7 },
  { date: 'Feb 02', searchBrand: 2, pmax: 5, total: 7 },
  { date: 'Feb 03', searchBrand: 3, pmax: 3, total: 6 },
  { date: 'Feb 04', searchBrand: 3, pmax: 4, total: 7 },
  { date: 'Feb 05', searchBrand: 2, pmax: 5, total: 7 },
  { date: 'Feb 06', searchBrand: 4, pmax: 3, total: 7 },
  { date: 'Feb 07', searchBrand: 3, pmax: 4, total: 7 },
  { date: 'Feb 08', searchBrand: 3, pmax: 4, total: 7 },
  { date: 'Feb 09', searchBrand: 2, pmax: 5, total: 7 },
  { date: 'Feb 10', searchBrand: 4, pmax: 3, total: 7 },
  { date: 'Feb 11', searchBrand: 4, pmax: 4, total: 8 },
  { date: 'Feb 12', searchBrand: 3, pmax: 5, total: 8 },
  { date: 'Feb 13', searchBrand: 5, pmax: 4, total: 9 },
  { date: 'Feb 14', searchBrand: 6, pmax: 6, total: 12 },
  { date: 'Feb 15', searchBrand: 4, pmax: 5, total: 9 },
  { date: 'Feb 16', searchBrand: 3, pmax: 4, total: 7 },
  { date: 'Feb 17', searchBrand: 3, pmax: 4, total: 7 },
  { date: 'Feb 18', searchBrand: 4, pmax: 4, total: 8 },
  { date: 'Feb 19', searchBrand: 3, pmax: 5, total: 8 },
  { date: 'Feb 20', searchBrand: 4, pmax: 3, total: 7 },
  { date: 'Feb 21', searchBrand: 3, pmax: 4, total: 7 },
  { date: 'Feb 22', searchBrand: 4, pmax: 4, total: 8 },
  { date: 'Feb 23', searchBrand: 3, pmax: 4, total: 7 },
];

export const CAMPAIGNS: CampaignData[] = [
  {
    name: 'Search - Brand',
    type: 'Search',
    status: 'Active',
    spend: 87.40,
    impressions: 2154,
    clicks: 86,
    ctr: 3.99,
    avgCpc: 1.02,
    conversions: 3,
    costPerConversion: 29.13,
    convRate: 3.49,
    roas: 4.15,
  },
  {
    name: 'PMax - 2',
    type: 'Performance Max',
    status: 'Active',
    spend: 105.74,
    impressions: 11245,
    clicks: 106,
    ctr: 0.94,
    avgCpc: 1.00,
    conversions: 0,
    costPerConversion: 0,
    convRate: 0,
    roas: 0,
  },
  {
    name: 'PMax - Retarget',
    type: 'Performance Max',
    status: 'Paused',
    spend: 0,
    impressions: 0,
    clicks: 0,
    ctr: 0,
    avgCpc: 0,
    conversions: 0,
    costPerConversion: 0,
    convRate: 0,
    roas: 0,
  },
];

export const KEYWORDS: KeywordData[] = [
  {
    keyword: 'lovelab antwerp',
    matchType: 'Exact',
    impressions: 845,
    clicks: 42,
    ctr: 4.97,
    avgCpc: 0.85,
    conversions: 2,
    qualityScore: 8,
    impressionShare: 82,
  },
  {
    keyword: 'lab grown diamonds belgium',
    matchType: 'Phrase',
    impressions: 980,
    clicks: 26,
    ctr: 2.65,
    avgCpc: 1.25,
    conversions: 1,
    qualityScore: 6,
    impressionShare: 45,
  },
  {
    keyword: 'engagement rings antwerp',
    matchType: 'Broad',
    impressions: 329,
    clicks: 18,
    ctr: 5.47,
    avgCpc: 1.06,
    conversions: 0,
    qualityScore: 5,
    impressionShare: 35,
  },
];

export const GEO_DATA: GeoData[] = [
  { country: 'France', impressions: 5834, clicks: 88, spend: 95.12, conversions: 2, ctr: 1.51, avgCpc: 1.08 },
  { country: 'Belgium', impressions: 4121, clicks: 62, spend: 58.45, conversions: 1, ctr: 1.50, avgCpc: 0.94 },
  { country: 'Netherlands', impressions: 1856, clicks: 22, spend: 21.23, conversions: 0, ctr: 1.19, avgCpc: 0.96 },
  { country: 'Germany', impressions: 923, clicks: 11, spend: 10.56, conversions: 0, ctr: 1.19, avgCpc: 0.96 },
  { country: 'Luxembourg', impressions: 487, clicks: 6, spend: 5.34, conversions: 0, ctr: 1.23, avgCpc: 0.89 },
  { country: 'United Kingdom', impressions: 178, clicks: 3, spend: 2.44, conversions: 0, ctr: 1.69, avgCpc: 0.81 },
];

export const SEARCH_TERMS: SearchTermData[] = [
  { term: 'lovelab', campaign: 'Search - Brand', impressions: 323, clicks: 22, ctr: 6.81, avgCpc: 0.72, conversions: 1, verdict: 'keep' },
  { term: 'lovelab antwerp', campaign: 'Search - Brand', impressions: 245, clicks: 18, ctr: 7.35, avgCpc: 0.78, conversions: 1, verdict: 'keep' },
  { term: 'lab grown diamonds', campaign: 'Search - Brand', impressions: 198, clicks: 9, ctr: 4.55, avgCpc: 1.25, conversions: 0, verdict: 'monitor' },
  { term: 'lab grown diamond rings', campaign: 'Search - Brand', impressions: 156, clicks: 7, ctr: 4.49, avgCpc: 1.30, conversions: 1, verdict: 'keep' },
  { term: 'diamants de laboratoire', campaign: 'Search - Brand', impressions: 142, clicks: 6, ctr: 4.23, avgCpc: 1.15, conversions: 0, verdict: 'monitor' },
  { term: 'engagement ring antwerp', campaign: 'Search - Brand', impressions: 112, clicks: 5, ctr: 4.46, avgCpc: 1.45, conversions: 0, verdict: 'monitor' },
  { term: 'cheap diamonds', campaign: 'Search - Brand', impressions: 89, clicks: 4, ctr: 4.49, avgCpc: 1.65, conversions: 0, verdict: 'exclude' },
  { term: 'diamond certification', campaign: 'Search - Brand', impressions: 76, clicks: 3, ctr: 3.95, avgCpc: 1.55, conversions: 0, verdict: 'exclude' },
  { term: 'lovelab bague', campaign: 'Search - Brand', impressions: 68, clicks: 4, ctr: 5.88, avgCpc: 0.85, conversions: 0, verdict: 'keep' },
  { term: 'natural vs lab diamonds', campaign: 'Search - Brand', impressions: 54, clicks: 2, ctr: 3.70, avgCpc: 1.40, conversions: 0, verdict: 'exclude' },
];

export const DEVICE_DATA: DeviceData[] = [
  { device: 'Mobile', impressions: 7810, clicks: 115, spend: 115.88, percentage: 60 },
  { device: 'Desktop', impressions: 4280, clicks: 62, spend: 61.80, percentage: 32 },
  { device: 'Tablet', impressions: 1309, clicks: 15, spend: 15.46, percentage: 8 },
];

export const HEALTH_SCORES: HealthScore[] = [
  { category: 'Budget Efficiency', score: 4, maxScore: 10 },
  { category: 'Targeting', score: 5, maxScore: 10 },
  { category: 'Ad Quality', score: 6, maxScore: 10 },
  { category: 'Conversion Setup', score: 3, maxScore: 10 },
  { category: 'Overall', score: 4, maxScore: 10 },
];

export const INSIGHTS: InsightCard[] = [
  {
    severity: 'CRITICAL',
    title: 'PMax-2 has zero conversions',
    detail: 'Performance Max campaign spent €105.74 with 106 clicks but generated zero conversions. This campaign is consuming 55% of total budget without return.',
    action: 'Pause PMax-2 immediately and reallocate budget to Search-Brand which shows 3.49% conversion rate.',
  },
  {
    severity: 'CRITICAL',
    title: 'Very low conversion volume',
    detail: 'Only 3 conversions in 26 days from €193.14 total spend. CPA of €64.38 is quite high for the jewellery vertical.',
    action: 'Review conversion tracking setup. Ensure micro-conversions (add to cart, enquiry form) are being tracked alongside purchases.',
  },
  {
    severity: 'WARNING',
    title: 'Low impression share on key terms',
    detail: '"Engagement rings antwerp" has only 35% impression share. You are missing 65% of potential searches for a high-intent keyword.',
    action: 'Increase bids on exact-match brand and high-intent terms. Consider raising daily budget by €5-10.',
  },
  {
    severity: 'WARNING',
    title: 'France dominates spend but low conversion',
    detail: 'France accounts for 49% of spend (€95.12) but only 2 conversions. Belgium, the home market, gets only 30% of spend.',
    action: 'Add location bid adjustments: +20% Belgium, -15% France. Review language targeting for French campaigns.',
  },
  {
    severity: 'WARNING',
    title: 'Wasted spend on irrelevant search terms',
    detail: '"Cheap diamonds", "diamond certification", and "natural vs lab diamonds" are attracting non-converting clicks.',
    action: 'Add these as negative keywords immediately. Estimated monthly savings: €10-15.',
  },
  {
    severity: 'INFO',
    title: 'Valentine\'s Day spike was the best period',
    detail: 'Feb 14 showed 12 clicks with the highest daily spend of €11.60. Brand searches peaked around this date.',
    action: 'Plan seasonal campaigns 2 weeks before major gift-giving dates. Allocate 40% budget uplift for these periods.',
  },
];

export const ACTION_PLAN: ActionStep[] = [
  { step: 1, title: 'Pause PMax-2 campaign', description: 'Stop bleeding budget on zero-conversion campaign. Redirect to Search-Brand.', timeline: 'Immediate' },
  { step: 2, title: 'Add negative keywords', description: 'Exclude "cheap diamonds", "diamond certification", "natural vs lab diamonds" across all campaigns.', timeline: 'Today' },
  { step: 3, title: 'Fix conversion tracking', description: 'Verify Google Ads conversion tag fires on purchase confirmation. Add micro-conversions for add-to-cart and enquiry.', timeline: 'This week' },
  { step: 4, title: 'Adjust geo bidding', description: 'Increase Belgium bids +20%, decrease France -15%. Monitor for 2 weeks.', timeline: 'This week' },
  { step: 5, title: 'Increase brand keyword bids', description: 'Raise bids on "lovelab antwerp" and "lab grown diamond rings" to capture more impression share.', timeline: 'Next week' },
  { step: 6, title: 'Launch seasonal calendar', description: 'Create campaign schedule for Mother\'s Day, anniversaries. Pre-build ad copy and allocate budget uplifts.', timeline: 'Next month' },
];

export const TOTALS = {
  spend: 193.14,
  impressions: 13399,
  clicks: 192,
  conversions: 3,
  avgCpc: 1.01,
  ctr: 1.43,
  roas: 1.88,
  costPerConversion: 64.38,
};
