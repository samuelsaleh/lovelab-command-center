import { NextRequest, NextResponse } from 'next/server';
import { getCampaignPerformance, getKeywordPerformance, getAccountOverview } from '@/lib/google-ads';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'campaigns';
    const dateRange = searchParams.get('dateRange') || 'LAST_30_DAYS';

    let data;

    switch (type) {
      case 'campaigns':
        data = await getCampaignPerformance(dateRange);
        break;
      case 'keywords':
        data = await getKeywordPerformance(dateRange);
        break;
      case 'overview':
        data = await getAccountOverview();
        break;
      default:
        data = await getCampaignPerformance(dateRange);
    }

    // Transform Google Ads data into a clean format
    const campaigns = data?.[0]?.results?.map((row: any) => ({
      id: row.campaign?.id,
      name: row.campaign?.name,
      status: row.campaign?.status,
      type: row.campaign?.advertisingChannelType,
      impressions: parseInt(row.metrics?.impressions || '0'),
      clicks: parseInt(row.metrics?.clicks || '0'),
      spend: (parseInt(row.metrics?.costMicros || '0') / 1_000_000),
      conversions: parseFloat(row.metrics?.conversions || '0'),
      ctr: parseFloat(row.metrics?.ctr || '0'),
      avgCpc: (parseInt(row.metrics?.averageCpc || '0') / 1_000_000),
    })) || [];

    return NextResponse.json({
      platform: 'google',
      dateRange,
      campaigns,
      totals: {
        spend: campaigns.reduce((sum: number, c: any) => sum + c.spend, 0),
        impressions: campaigns.reduce((sum: number, c: any) => sum + c.impressions, 0),
        clicks: campaigns.reduce((sum: number, c: any) => sum + c.clicks, 0),
        conversions: campaigns.reduce((sum: number, c: any) => sum + c.conversions, 0),
      },
      fetchedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Google Ads API error:', error.message);
    // Return empty-but-valid shape so the UI never breaks
    return NextResponse.json({
      platform: 'google',
      source: 'error-fallback',
      campaigns: [],
      totals: { spend: 0, impressions: 0, clicks: 0, conversions: 0 },
      fetchedAt: new Date().toISOString(),
      error: error.message,
    });
  }
}
