import { NextRequest, NextResponse } from 'next/server';
import { getCampaignPerformance } from '@/lib/google-ads';
import { getCampaignInsights, getAudienceInsights } from '@/lib/meta-ads';

/**
 * Brand Health Score Calculator
 * Computes a composite score from live advertising data
 */
function calculateBrandHealth(googleData: any, metaData: any) {
  const scores: Record<string, { score: number; max: number; label: string }> = {};

  // 1. Brand Awareness (impressions / target reach)
  const totalImpressions =
    (googleData?.totals?.impressions || 0) + (metaData?.totals?.impressions || 0);
  const awarenessScore = Math.min(totalImpressions / 500000, 1) * 100;
  scores.awareness = { score: Math.round(awarenessScore), max: 100, label: 'Brand Awareness' };

  // 2. Engagement Rate (clicks / impressions)
  const totalClicks =
    (googleData?.totals?.clicks || 0) + (metaData?.totals?.clicks || 0);
  const engagementRate = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const engagementScore = Math.min(engagementRate / 3, 1) * 100; // 3% CTR = perfect
  scores.engagement = { score: Math.round(engagementScore), max: 100, label: 'Engagement Rate' };

  // 3. Conversion Efficiency
  const totalConversions = googleData?.totals?.conversions || 0;
  const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
  const conversionScore = Math.min(conversionRate / 2, 1) * 100; // 2% CVR = perfect
  scores.conversion = { score: Math.round(conversionScore), max: 100, label: 'Conversion Efficiency' };

  // 4. Ad Spend Efficiency (ROAS proxy)
  const totalSpend =
    (googleData?.totals?.spend || 0) + (metaData?.totals?.spend || 0);
  const costPerClick = totalClicks > 0 ? totalSpend / totalClicks : 0;
  const efficiencyScore = costPerClick > 0 ? Math.min(0.5 / costPerClick, 1) * 100 : 0;
  scores.efficiency = { score: Math.round(efficiencyScore), max: 100, label: 'Ad Spend Efficiency' };

  // 5. Content Quality (Meta engagement actions)
  const contentScore = metaData?.totals?.reach > 0 ?
    Math.min((metaData.totals.clicks / metaData.totals.reach) * 100 / 2, 1) * 100 : 50;
  scores.content = { score: Math.round(contentScore), max: 100, label: 'Content Quality' };

  // 6. Market Penetration (France reach estimate)
  const marketScore = Math.min((metaData?.totals?.reach || 0) / 100000, 1) * 100;
  scores.market = { score: Math.round(marketScore), max: 100, label: 'Market Penetration (FR)' };

  // Overall composite score
  const weights = { awareness: 0.2, engagement: 0.2, conversion: 0.25, efficiency: 0.15, content: 0.1, market: 0.1 };
  const overall = Object.entries(scores).reduce((sum, [key, val]) => {
    return sum + val.score * (weights[key as keyof typeof weights] || 0.1);
  }, 0);

  return {
    overall: Math.round(overall),
    breakdown: scores,
    rating: overall >= 80 ? 'Excellent' : overall >= 60 ? 'Good' : overall >= 40 ? 'Growing' : 'Needs Attention',
  };
}

export async function GET() {
  try {
    let googleData = { totals: { impressions: 0, clicks: 0, conversions: 0, spend: 0 } };
    let metaData = { totals: { impressions: 0, clicks: 0, reach: 0, spend: 0 } };

    try {
      const gRes = await getCampaignPerformance();
      if (gRes?.[0]?.results) {
        const campaigns = gRes[0].results;
        googleData.totals = {
          impressions: campaigns.reduce((s: number, r: any) => s + parseInt(r.metrics?.impressions || '0'), 0),
          clicks: campaigns.reduce((s: number, r: any) => s + parseInt(r.metrics?.clicks || '0'), 0),
          conversions: campaigns.reduce((s: number, r: any) => s + parseFloat(r.metrics?.conversions || '0'), 0),
          spend: campaigns.reduce((s: number, r: any) => s + parseInt(r.metrics?.costMicros || '0') / 1_000_000, 0),
        };
      }
    } catch (e) {}

    try {
      const mRes = await getCampaignInsights();
      if (mRes?.data) {
        metaData.totals = {
          impressions: mRes.data.reduce((s: number, r: any) => s + parseInt(r.impressions || '0'), 0),
          clicks: mRes.data.reduce((s: number, r: any) => s + parseInt(r.clicks || '0'), 0),
          reach: mRes.data.reduce((s: number, r: any) => s + parseInt(r.reach || '0'), 0),
          spend: mRes.data.reduce((s: number, r: any) => s + parseFloat(r.spend || '0'), 0),
        };
      }
    } catch (e) {}

    const health = calculateBrandHealth(googleData, metaData);

    return NextResponse.json({
      ...health,
      dataSnapshot: { google: googleData.totals, meta: metaData.totals },
      fetchedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
