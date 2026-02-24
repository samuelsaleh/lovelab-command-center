/**
 * Google Ads API Client for LoveLab Command Center
 * Uses the Google Ads REST API to fetch campaign data
 */

const GOOGLE_ADS_API_VERSION = 'v17';
const BASE_URL = `https://googleads.googleapis.com/${GOOGLE_ADS_API_VERSION}`;

interface GoogleAdsConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  developerToken: string;
  customerId: string;
  loginCustomerId?: string;
}

function getConfig(): GoogleAdsConfig {
  return {
    clientId: process.env.GOOGLE_ADS_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
    refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
    developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
    customerId: process.env.GOOGLE_ADS_CUSTOMER_ID!,
    loginCustomerId: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID,
  };
}

async function getAccessToken(config: GoogleAdsConfig): Promise<string> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: config.refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  const data = await response.json();
  return data.access_token;
}

export async function queryGoogleAds(query: string) {
  const config = getConfig();
  const accessToken = await getAccessToken(config);
  const customerId = config.customerId.replace(/-/g, '');

  const response = await fetch(
    `${BASE_URL}/customers/${customerId}/googleAds:searchStream`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'developer-token': config.developerToken,
        ...(config.loginCustomerId && {
          'login-customer-id': config.loginCustomerId.replace(/-/g, ''),
        }),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    }
  );

  const data = await response.json();
  return data;
}

export async function getCampaignPerformance(dateRange = 'LAST_30_DAYS') {
  const query = `
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      campaign.advertising_channel_type,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.conversions,
      metrics.ctr,
      metrics.average_cpc,
      metrics.conversions_value
    FROM campaign
    WHERE segments.date DURING ${dateRange}
    ORDER BY metrics.cost_micros DESC
    LIMIT 20
  `;
  return queryGoogleAds(query);
}

export async function getKeywordPerformance(dateRange = 'LAST_30_DAYS') {
  const query = `
    SELECT
      ad_group_criterion.keyword.text,
      ad_group_criterion.keyword.match_type,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.conversions,
      metrics.ctr
    FROM keyword_view
    WHERE segments.date DURING ${dateRange}
    ORDER BY metrics.impressions DESC
    LIMIT 50
  `;
  return queryGoogleAds(query);
}

export async function getSearchTermReport(dateRange = 'LAST_30_DAYS') {
  const query = `
    SELECT
      search_term_view.search_term,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.conversions
    FROM search_term_view
    WHERE segments.date DURING ${dateRange}
    ORDER BY metrics.impressions DESC
    LIMIT 50
  `;
  return queryGoogleAds(query);
}

export async function getAccountOverview() {
  const query = `
    SELECT
      customer.descriptive_name,
      customer.id,
      customer.currency_code,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.conversions
    FROM customer
    WHERE segments.date DURING LAST_30_DAYS
  `;
  return queryGoogleAds(query);
}
