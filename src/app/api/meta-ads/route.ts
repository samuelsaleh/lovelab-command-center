import { NextRequest, NextResponse } from 'next/server';
import { META_CACHED_DATA } from '@/data/meta-cache';

// Check if live Meta API is configured
const hasMetaToken = () => !!process.env.META_ACCESS_TOKEN && process.env.META_ACCESS_TOKEN !== 'your-meta-access-token';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'campaigns';

    // If no Meta token is configured, use cached data
    if (!hasMetaToken()) {
      console.log('No META_ACCESS_TOKEN configured — using cached data');

      const cached = META_CACHED_DATA;

      return NextResponse.json({
        platform: 'meta',
        source: 'cache',
        lastUpdated: cached.lastUpdated,
        data: cached.campaigns.map(c => ({
          campaignName: c.campaignName,
          campaignId: c.campaignId,
          impressions: c.metrics.impressions,
          clicks: c.metrics.clicks,
          spend: c.metrics.spend,
          reach: c.metrics.reach,
          ctr: c.metrics.ctr,
          cpc: c.metrics.cpc,
          actions: c.actions,
        })),
        totals: cached.totals,
        fetchedAt: cached.lastUpdated,
        note: 'Using cached data. To enable live data, add META_ACCESS_TOKEN to .env',
      });
    }

    // Live Meta API fetch
    const { getCampaigns, getCampaignInsights, getAccountInfo, getAudienceInsights } = await import('@/lib/meta-ads');
    const timeRange = searchParams.get('timeRange') || 'last_30d';

    let data;
    switch (type) {
      case 'campaigns':
        data = await getCampaigns();
        break;
      case 'insights':
        data = await getCampaignInsights(timeRange);
        break;
      case 'account':
        data = await getAccountInfo();
        break;
      case 'audience':
        data = await getAudienceInsights();
        break;
      default:
        data = await getCampaignInsights(timeRange);
    }

    const insights = data?.data?.map((row: any) => ({
      campaignName: row.campaign_name,
      campaignId: row.campaign_id,
      impressions: parseInt(row.impressions || '0'),
      clicks: parseInt(row.clicks || '0'),
      spend: parseFloat(row.spend || '0'),
      reach: parseInt(row.reach || '0'),
      ctr: parseFloat(row.ctr || '0'),
      cpc: parseFloat(row.cpc || '0'),
      actions: row.actions,
    })) || data;

    const totals = Array.isArray(insights)
      ? {
          spend: insights.reduce((sum: number, c: any) => sum + (c.spend || 0), 0),
          impressions: insights.reduce((sum: number, c: any) => sum + (c.impressions || 0), 0),
          clicks: insights.reduce((sum: number, c: any) => sum + (c.clicks || 0), 0),
          reach: insights.reduce((sum: number, c: any) => sum + (c.reach || 0), 0),
        }
      : null;

    return NextResponse.json({
      platform: 'meta',
      source: 'live',
      data: insights,
      totals,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Meta Ads API error, falling back to cache:', error);

    // Fallback to cached data on any error
    const cached = META_CACHED_DATA;
    return NextResponse.json({
      platform: 'meta',
      source: 'cache-fallback',
      data: cached.campaigns.map(c => ({
        campaignName: c.campaignName,
        campaignId: c.campaignId,
        impressions: c.metrics.impressions,
        clicks: c.metrics.clicks,
        spend: c.metrics.spend,
        reach: c.metrics.reach,
        ctr: c.metrics.ctr,
        cpc: c.metrics.cpc,
        actions: c.actions,
      })),
      totals: cached.totals,
      fetchedAt: cached.lastUpdated,
      note: 'Live API failed, using cached data',
    });
  }
}
