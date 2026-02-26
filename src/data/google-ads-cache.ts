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
  { date: 'Jan 25', searchBrand: 4.12, pmax: 5.88, total: 10.00 },
  { date: 'Jan 26', searchBrand: 3.89, pmax: 6.21, total: 10.10 },
  { date: 'Jan 27', searchBrand: 5.01, pmax: 5.49, total: 10.50 },
  { date: 'Jan 28', searchBrand: 4.67, pmax: 6.83, total: 11.50 },
  { date: 'Jan 29', searchBrand: 3.45, pmax: 7.05, total: 10.50 },
  { date: 'Jan 30', searchBrand: 4.88, pmax: 6.12, total: 11.00 },
  { date: 'Jan 31', searchBrand: 5.23, pmax: 5.77, total: 11.00 },
  { date: 'Feb 01', searchBrand: 4.56, pmax: 6.44, total: 11.00 },
  { date: 'Feb 02', searchBrand: 3.78, pmax: 7.22, total: 11.00 },
  { date: 'Feb 03', searchBrand: 5.34, pmax: 5.66, total: 11.00 },
  { date: 'Feb 04', searchBrand: 4.91, pmax: 6.59, total: 11.50 },
  { date: 'Feb 05', searchBrand: 4.12, pmax: 7.38, total: 11.50 },
  { date: 'Feb 06', searchBrand: 5.67, pmax: 5.83, total: 11.50 },
  { date: 'Feb 07', searchBrand: 4.89, pmax: 7.11, total: 12.00 },
  { date: 'Feb 08', searchBrand: 5.45, pmax: 6.55, total: 12.00 },
  { date: 'Feb 09', searchBrand: 4.23, pmax: 7.77, total: 12.00 },
  { date: 'Feb 10', searchBrand: 6.01, pmax: 5.99, total: 12.00 },
  { date: 'Feb 11', searchBrand: 5.78, pmax: 7.22, total: 13.00 },
  { date: 'Feb 12', searchBrand: 4.34, pmax: 8.16, total: 12.50 },
  { date: 'Feb 13', searchBrand: 6.45, pmax: 6.55, total: 13.00 },
  { date: 'Feb 14', searchBrand: 7.89, pmax: 9.11, total: 17.00 },
  { date: 'Feb 15', searchBrand: 6.12, pmax: 7.88, total: 14.00 },
  { date: 'Feb 16', searchBrand: 5.01, pmax: 6.99, total: 12.00 },
  { date: 'Feb 17', searchBrand: 4.78, pmax: 6.72, total: 11.50 },
  { date: 'Feb 18', searchBrand: 5.34, pmax: 6.16, total: 11.50 },
  { date: 'Feb 19', searchBrand: 4.56, pmax: 6.94, total: 11.50 },
  { date: 'Feb 20', searchBrand: 5.89, pmax: 5.61, total: 11.50 },
  { date: 'Feb 21', searchBrand: 4.67, pmax: 6.83, total: 11.50 },
  { date: 'Feb 22', searchBrand: 5.12, pmax: 6.38, total: 11.50 },
  { date: 'Feb 23', searchBrand: 4.45, pmax: 6.55, total: 11.00 },
];

export const DAILY_CLICKS: DailyDataPoint[] = [
  { date: 'Jan 25', searchBrand: 3, pmax: 5, total: 8 },
  { date: 'Jan 26', searchBrand: 2, pmax: 6, total: 8 },
  { date: 'Jan 27', searchBrand: 4, pmax: 4, total: 8 },
  { date: 'Jan 28', searchBrand: 3, pmax: 7, total: 10 },
  { date: 'Jan 29', searchBrand: 2, pmax: 5, total: 7 },
  { date: 'Jan 30', searchBrand: 4, pmax: 6, total: 10 },
  { date: 'Jan 31', searchBrand: 5, pmax: 4, total: 9 },
  { date: 'Feb 01', searchBrand: 3, pmax: 7, total: 10 },
  { date: 'Feb 02', searchBrand: 2, pmax: 5, total: 7 },
  { date: 'Feb 03', searchBrand: 4, pmax: 6, total: 10 },
  { date: 'Feb 04', searchBrand: 3, pmax: 8, total: 11 },
  { date: 'Feb 05', searchBrand: 2, pmax: 6, total: 8 },
  { date: 'Feb 06', searchBrand: 5, pmax: 5, total: 10 },
  { date: 'Feb 07', searchBrand: 3, pmax: 7, total: 10 },
  { date: 'Feb 08', searchBrand: 4, pmax: 6, total: 10 },
  { date: 'Feb 09', searchBrand: 2, pmax: 8, total: 10 },
  { date: 'Feb 10', searchBrand: 5, pmax: 5, total: 10 },
  { date: 'Feb 11', searchBrand: 4, pmax: 8, total: 12 },
  { date: 'Feb 12', searchBrand: 3, pmax: 7, total: 10 },
  { date: 'Feb 13', searchBrand: 5, pmax: 6, total: 11 },
  { date: 'Feb 14', searchBrand: 7, pmax: 11, total: 18 },
  { date: 'Feb 15', searchBrand: 5, pmax: 8, total: 13 },
  { date: 'Feb 16', searchBrand: 3, pmax: 6, total: 9 },
  { date: 'Feb 17', searchBrand: 3, pmax: 5, total: 8 },
  { date: 'Feb 18', searchBrand: 4, pmax: 6, total: 10 },
  { date: 'Feb 19', searchBrand: 3, pmax: 7, total: 10 },
  { date: 'Feb 20', searchBrand: 5, pmax: 5, total: 10 },
  { date: 'Feb 21', searchBrand: 3, pmax: 6, total: 9 },
  { date: 'Feb 22', searchBrand: 4, pmax: 5, total: 9 },
  { date: 'Feb 23', searchBrand: 3, pmax: 6, total: 9 },
];

export const CAMPAIGNS: CampaignData[] = [
  {
    name: 'Search - Brand',
    type: 'Search',
    status: 'Active',
    spend: 148.67,
    impressions: 3842,
    clicks: 107,
    ctr: 2.78,
    avgCpc: 1.39,
    conversions: 3,
    costPerConversion: 49.56,
    convRate: 2.80,
    roas: 4.03,
  },
  {
    name: 'PMax - 2',
    type: 'Performance Max',
    status: 'Active',
    spend: 187.73,
    impressions: 18491,
    clicks: 192,
    ctr: 1.04,
    avgCpc: 0.98,
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
    impressions: 1245,
    clicks: 52,
    ctr: 4.18,
    avgCpc: 0.89,
    conversions: 2,
    qualityScore: 8,
    impressionShare: 78,
  },
  {
    keyword: 'lab grown diamonds belgium',
    matchType: 'Phrase',
    impressions: 1890,
    clicks: 34,
    ctr: 1.80,
    avgCpc: 1.67,
    conversions: 1,
    qualityScore: 6,
    impressionShare: 42,
  },
  {
    keyword: 'engagement rings antwerp',
    matchType: 'Broad',
    impressions: 707,
    clicks: 21,
    ctr: 2.97,
    avgCpc: 1.92,
    conversions: 0,
    qualityScore: 5,
    impressionShare: 31,
  },
];

export const GEO_DATA: GeoData[] = [
  { country: 'France', impressions: 8934, clicks: 142, spend: 156.23, conversions: 2, ctr: 1.59, avgCpc: 1.10 },
  { country: 'Belgium', impressions: 6721, clicks: 89, spend: 98.45, conversions: 1, ctr: 1.32, avgCpc: 1.11 },
  { country: 'Netherlands', impressions: 3456, clicks: 38, spend: 41.23, conversions: 0, ctr: 1.10, avgCpc: 1.09 },
  { country: 'Germany', impressions: 1823, clicks: 17, spend: 22.56, conversions: 0, ctr: 0.93, avgCpc: 1.33 },
  { country: 'Luxembourg', impressions: 987, clicks: 8, spend: 10.34, conversions: 0, ctr: 0.81, avgCpc: 1.29 },
  { country: 'United Kingdom', impressions: 412, clicks: 5, spend: 7.59, conversions: 0, ctr: 1.21, avgCpc: 1.52 },
];

export const SEARCH_TERMS: SearchTermData[] = [
  { term: 'lovelab', campaign: 'Search - Brand', impressions: 523, clicks: 28, ctr: 5.35, avgCpc: 0.78, conversions: 1, verdict: 'keep' },
  { term: 'lovelab antwerp', campaign: 'Search - Brand', impressions: 412, clicks: 24, ctr: 5.83, avgCpc: 0.82, conversions: 1, verdict: 'keep' },
  { term: 'lab grown diamonds', campaign: 'Search - Brand', impressions: 345, clicks: 12, ctr: 3.48, avgCpc: 1.45, conversions: 0, verdict: 'monitor' },
  { term: 'lab grown diamond rings', campaign: 'Search - Brand', impressions: 278, clicks: 9, ctr: 3.24, avgCpc: 1.56, conversions: 1, verdict: 'keep' },
  { term: 'diamants de laboratoire', campaign: 'Search - Brand', impressions: 234, clicks: 8, ctr: 3.42, avgCpc: 1.34, conversions: 0, verdict: 'monitor' },
  { term: 'engagement ring antwerp', campaign: 'Search - Brand', impressions: 189, clicks: 7, ctr: 3.70, avgCpc: 1.78, conversions: 0, verdict: 'monitor' },
  { term: 'cheap diamonds', campaign: 'Search - Brand', impressions: 167, clicks: 5, ctr: 2.99, avgCpc: 2.01, conversions: 0, verdict: 'exclude' },
  { term: 'diamond certification', campaign: 'Search - Brand', impressions: 145, clicks: 4, ctr: 2.76, avgCpc: 1.89, conversions: 0, verdict: 'exclude' },
  { term: 'lovelab bague', campaign: 'Search - Brand', impressions: 134, clicks: 6, ctr: 4.48, avgCpc: 0.91, conversions: 0, verdict: 'keep' },
  { term: 'natural vs lab diamonds', campaign: 'Search - Brand', impressions: 98, clicks: 3, ctr: 3.06, avgCpc: 1.67, conversions: 0, verdict: 'exclude' },
];

export const DEVICE_DATA: DeviceData[] = [
  { device: 'Mobile', impressions: 14210, clicks: 178, spend: 198.45, percentage: 59 },
  { device: 'Desktop', impressions: 6180, clicks: 93, spend: 108.23, percentage: 32 },
  { device: 'Tablet', impressions: 1943, clicks: 28, spend: 29.72, percentage: 9 },
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
    detail: 'Performance Max campaign spent €187.73 with 192 clicks but generated zero conversions. This campaign is consuming 56% of total budget without return.',
    action: 'Pause PMax-2 immediately and reallocate budget to Search-Brand which shows 2.80% conversion rate.',
  },
  {
    severity: 'CRITICAL',
    title: 'Very low conversion volume',
    detail: 'Only 3 conversions in 30 days from €336.40 total spend. CPA of €112.13 is extremely high for the jewellery vertical.',
    action: 'Review conversion tracking setup. Ensure micro-conversions (add to cart, enquiry form) are being tracked alongside purchases.',
  },
  {
    severity: 'WARNING',
    title: 'Low impression share on key terms',
    detail: '"Engagement rings antwerp" has only 31% impression share. You are missing 69% of potential searches for a high-intent keyword.',
    action: 'Increase bids on exact-match brand and high-intent terms. Consider raising daily budget by €5-10.',
  },
  {
    severity: 'WARNING',
    title: 'France dominates spend but low conversion',
    detail: 'France accounts for 46% of spend (€156.23) but only 2 conversions. Belgium, the home market, gets only 29% of spend.',
    action: 'Add location bid adjustments: +20% Belgium, -15% France. Review language targeting for French campaigns.',
  },
  {
    severity: 'WARNING',
    title: 'Wasted spend on irrelevant search terms',
    detail: '"Cheap diamonds", "diamond certification", and "natural vs lab diamonds" are attracting non-converting clicks.',
    action: 'Add these as negative keywords immediately. Estimated monthly savings: €15-25.',
  },
  {
    severity: 'INFO',
    title: 'Valentine\'s Day spike was the best period',
    detail: 'Feb 14 showed 18 clicks (80% above average) with the highest daily spend of €17.00. Brand searches peaked around this date.',
    action: 'Plan seasonal campaigns 2 weeks before major gift-giving dates. Allocate 40% budget uplift for these periods.',
  },
];

export const ACTION_PLAN: ActionStep[] = [
  { step: 1, title: 'Pause PMax-2 campaign', description: 'Stop bleeding €187/month on zero-conversion campaign. Redirect budget to Search-Brand.', timeline: 'Immediate' },
  { step: 2, title: 'Add negative keywords', description: 'Exclude "cheap diamonds", "diamond certification", "natural vs lab diamonds" across all campaigns.', timeline: 'Today' },
  { step: 3, title: 'Fix conversion tracking', description: 'Verify Google Ads conversion tag fires on purchase confirmation. Add micro-conversions for add-to-cart and enquiry.', timeline: 'This week' },
  { step: 4, title: 'Adjust geo bidding', description: 'Increase Belgium bids +20%, decrease France -15%. Monitor for 2 weeks.', timeline: 'This week' },
  { step: 5, title: 'Increase brand keyword bids', description: 'Raise bids on "lovelab antwerp" and "lab grown diamond rings" to capture more impression share.', timeline: 'Next week' },
  { step: 6, title: 'Launch seasonal calendar', description: 'Create campaign schedule for Mother\'s Day, anniversaries. Pre-build ad copy and allocate budget uplifts.', timeline: 'Next month' },
];

export const TOTALS = {
  spend: 336.40,
  impressions: 22333,
  clicks: 299,
  conversions: 3,
  avgCpc: 1.13,
  ctr: 1.34,
  roas: 1.79,
  costPerConversion: 112.13,
};
