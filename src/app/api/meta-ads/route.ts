import { NextRequest, NextResponse } from 'next/server';
import { getCampaigns, getCampaignInsights, getAccountInfo, getAudienceInsights } from '@/lib/meta-ads';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'campaigns';
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

    // Transform Meta data into clean format
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
      timeRange,
      data: insights,
      totals,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Meta Ads API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Meta Ads data', details: error.message },
      { status: 500 }
    );
  }
}
