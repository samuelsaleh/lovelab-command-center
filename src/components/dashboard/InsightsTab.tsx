'use client';

import HealthScoreCard from './HealthScoreCard';
import SeverityCard from './SeverityCard';
import ActionItem from './ActionItem';
import { HEALTH_SCORES, INSIGHTS, ACTION_PLAN } from '@/data/google-ads-cache';

export default function InsightsTab() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-sm font-semibold text-gray-900">Account Health</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {HEALTH_SCORES.map((hs) => (
            <HealthScoreCard key={hs.category} {...hs} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-semibold text-gray-900">Issues &amp; Opportunities</h3>
        <div className="space-y-3">
          {INSIGHTS.map((insight, i) => (
            <SeverityCard key={i} {...insight} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-semibold text-gray-900">Priority Action Plan</h3>
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
          <div className="divide-y divide-gray-100">
            {ACTION_PLAN.map((step) => (
              <ActionItem key={step.step} {...step} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
