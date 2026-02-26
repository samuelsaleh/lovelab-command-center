'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import TabNavigation from '@/components/dashboard/TabNavigation';
import type { TabId } from '@/components/dashboard/TabNavigation';

const OverviewTab = dynamic(() => import('@/components/dashboard/OverviewTab'), { ssr: false });
const CampaignsTab = dynamic(() => import('@/components/dashboard/CampaignsTab'), { ssr: false });
const GeographyTab = dynamic(() => import('@/components/dashboard/GeographyTab'), { ssr: false });
const SearchTermsTab = dynamic(() => import('@/components/dashboard/SearchTermsTab'), { ssr: false });
const InsightsTab = dynamic(() => import('@/components/dashboard/InsightsTab'), { ssr: false });

const TAB_COMPONENTS: Record<TabId, React.ComponentType> = {
  overview: OverviewTab,
  campaigns: CampaignsTab,
  geography: GeographyTab,
  'search-terms': SearchTermsTab,
  insights: InsightsTab,
};

export default function PerformancePage() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const ActiveComponent = TAB_COMPONENTS[activeTab];

  return (
    <>
      <div className="mb-6">
        <h2 className="mb-1 font-display text-xl font-semibold text-plum-dark sm:text-2xl">
          Google Ads Performance
        </h2>
        <p className="text-sm text-gray-500">
          Last 30 days &middot; 2 active campaigns &middot; Data refreshes from API or cached fallback
        </p>
      </div>

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <ActiveComponent />
    </>
  );
}
