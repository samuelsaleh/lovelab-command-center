/**
 * Meta (Facebook) Ads API Client for LoveLab Command Center
 * Uses the Meta Marketing API to fetch campaign and ad performance data
 */

const META_API_VERSION = 'v21.0';
const BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`;

function getAccessToken(): string {
  return process.env.META_ACCESS_TOKEN!;
}

function getAccountId(): string {
  return process.env.META_AD_ACCOUNT_ID!;
}

async function metaApiGet(endpoint: string, params: Record<string, string> = {}) {
  const token = getAccessToken();
  const searchParams = new URLSearchParams({
    access_token: token,
    ...params,
  });

  const response = await fetch(`${BASE_URL}${endpoint}?${searchParams}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Meta API Error: ${JSON.stringify(error)}`);
  }
  return response.json();
}

export async function getCampaigns() {
  const accountId = getAccountId();
  return metaApiGet(`/${accountId}/campaigns`, {
    fields: 'id,name,status,objective,daily_budget,lifetime_budget,created_time,updated_time',
    limit: '50',
  });
}

export async function getCampaignInsights(timeRange = 'last_30d') {
  const accountId = getAccountId();

  // Calculate date range
  const end = new Date();
  const start = new Date();
  const days = parseInt(timeRange.replace('last_', '').replace('d', '')) || 30;
  start.setDate(end.getDate() - days);

  return metaApiGet(`/${accountId}/insights`, {
    fields: 'campaign_name,campaign_id,impressions,clicks,spend,reach,ctr,cpc,cpm,actions,cost_per_action_type,video_avg_time_watched_actions',
    level: 'campaign',
    time_range: JSON.stringify({
      since: start.toISOString().split('T')[0],
      until: end.toISOString().split('T')[0],
    }),
    limit: '50',
  });
}

export async function getAdSetInsights(campaignId?: string) {
  const accountId = getAccountId();
  const params: Record<string, string> = {
    fields: 'adset_name,adset_id,impressions,clicks,spend,reach,actions',
    level: 'adset',
    time_range: JSON.stringify({
      since: new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0],
      until: new Date().toISOString().split('T')[0],
    }),
    limit: '50',
  };

  if (campaignId) {
    params.filtering = JSON.stringify([
      { field: 'campaign.id', operator: 'EQUAL', value: campaignId },
    ]);
  }

  return metaApiGet(`/${accountId}/insights`, params);
}

export async function getAdInsights() {
  const accountId = getAccountId();
  return metaApiGet(`/${accountId}/insights`, {
    fields: 'ad_name,ad_id,impressions,clicks,spend,reach,actions,cost_per_action_type',
    level: 'ad',
    time_range: JSON.stringify({
      since: new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0],
      until: new Date().toISOString().split('T')[0],
    }),
    limit: '50',
  });
}

export async function getAccountInfo() {
  const accountId = getAccountId();
  return metaApiGet(`/${accountId}`, {
    fields: 'name,account_status,currency,timezone_name,amount_spent,balance',
  });
}

export async function getAudienceInsights() {
  const accountId = getAccountId();
  return metaApiGet(`/${accountId}/insights`, {
    fields: 'impressions,clicks,spend,reach',
    breakdowns: 'age,gender',
    time_range: JSON.stringify({
      since: new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0],
      until: new Date().toISOString().split('T')[0],
    }),
    limit: '100',
  });
}
