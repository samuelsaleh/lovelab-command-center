/**
 * Cached Meta Ads data — refreshed from Claude Cowork sessions
 * Last updated: February 24, 2026
 *
 * When META_ACCESS_TOKEN is not set, the app uses this cached data.
 * To refresh: ask Claude in Cowork to pull latest Meta data and update this file.
 */

export const META_CACHED_DATA = {
  lastUpdated: '2026-02-24T19:45:00Z',
  account: {
    id: 'act_510481432933248',
    name: 'Zillah Atzmon',
    currency: 'EUR',
  },
  campaigns: [
    {
      campaignId: '120241022245040676',
      campaignName: "Valentine's Day",
      status: 'ACTIVE',
      objective: 'OUTCOME_SALES',
      dateRange: { start: '2026-01-25', end: '2026-02-23' },
      metrics: {
        impressions: 45266,
        clicks: 401,
        spend: 136.12,
        reach: 21927,
        frequency: 2.06,
        ctr: 0.886,
        cpc: 0.339,
        cpm: 3.007,
        uniqueClicks: 362,
      },
      actions: {
        linkClicks: 235,
        pageEngagement: 8043,
        postEngagement: 8043,
        videoViews: 7743,
        postReactions: 60,
        netLikes: 55,
        comments: 5,
      },
      costPerAction: {
        videoView: 0.018,
        linkClick: 0.579,
        postEngagement: 0.017,
        pageEngagement: 0.017,
      },
    },
  ],
  totals: {
    spend: 136.12,
    impressions: 45266,
    clicks: 401,
    reach: 21927,
    videoViews: 7743,
    engagement: 8043,
  },
};
