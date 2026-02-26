/**
 * Skill Loader for Marketing Skills
 * Loads and selects relevant skills based on user queries
 */

import fs from 'fs';
import path from 'path';

export interface Skill {
  id: string;
  name: string;
  platform: string;
  description: string;
  content: string;
  keywords: string[];
}

const SKILLS_DIR = path.join(process.cwd(), 'marketing-skills-main', 'Skills for Claude');

// Skill metadata with trigger keywords
const SKILL_METADATA: Record<string, { keywords: string[]; priority: number }> = {
  '01-google-and-meta-cpa-diagnostics': {
    keywords: ['cpa', 'cost per acquisition', 'cpa spike', 'cpa went up', 'cost increased', 'expensive', 'why is cost high'],
    priority: 1,
  },
  '02-google-and-meta-wasted-spend-finder': {
    keywords: ['wasted spend', 'waste', 'bleeding', 'money wasted', 'save money', 'cut spend', 'negative keywords', 'exclusions'],
    priority: 1,
  },
  '03-google-and-meta-budget-scenario-planner': {
    keywords: ['budget', 'scenario', 'what if', 'scale', 'increase budget', 'decrease budget', 'budget planning'],
    priority: 2,
  },
  '04-meta-creative-fatigue-detection': {
    keywords: ['creative fatigue', 'ad fatigue', 'frequency', 'stale ads', 'refresh creative', 'tired ads'],
    priority: 2,
  },
  '05-google-and-meta-client-report-narratives': {
    keywords: ['report', 'client report', 'narrative', 'summary', 'executive summary', 'monthly report'],
    priority: 2,
  },
  '06-google-and-meta-anomaly-detection': {
    keywords: ['anomaly', 'unusual', 'spike', 'drop', 'something wrong', 'weird', 'strange'],
    priority: 2,
  },
  '07-google-search-term-mining': {
    keywords: ['search terms', 'search queries', 'query report', 'keywords', 'search term mining'],
    priority: 2,
  },
  '08-meta-audience-overlap-analysis': {
    keywords: ['audience overlap', 'overlap', 'cannibalization', 'audiences competing'],
    priority: 3,
  },
  '09-google-and-meta-ad-copy-variant-generator': {
    keywords: ['ad copy', 'copy', 'headlines', 'descriptions', 'write ads', 'ad variations', 'creative'],
    priority: 2,
  },
  '10-google-and-meta-landing-page-audit': {
    keywords: ['landing page', 'lp', 'conversion rate', 'page audit', 'website'],
    priority: 2,
  },
  '11-google-bid-strategy-recommendations': {
    keywords: ['bid strategy', 'bidding', 'target cpa', 'maximize conversions', 'bid'],
    priority: 3,
  },
  '12-google-and-meta-day-hour-performance-breakdown': {
    keywords: ['day', 'hour', 'time', 'schedule', 'dayparting', 'best time', 'when to run'],
    priority: 3,
  },
  '13-meta-competitor-creative-analysis': {
    keywords: ['competitor', 'competition', 'competitor ads', 'ad library', 'what competitors'],
    priority: 3,
  },
  '14-google-quality-score-breakdown': {
    keywords: ['quality score', 'qs', 'ad relevance', 'expected ctr', 'landing page experience'],
    priority: 3,
  },
  '15-google-and-meta-channel-mix-optimizer': {
    keywords: ['channel mix', 'channel', 'google vs meta', 'platform split', 'allocation'],
    priority: 2,
  },
  '16-google-and-meta-conversion-path-analysis': {
    keywords: ['conversion path', 'attribution', 'customer journey', 'touchpoints', 'path'],
    priority: 3,
  },
  '17-google-and-meta-account-structure-review': {
    keywords: ['account structure', 'structure', 'campaign structure', 'organization', 'setup'],
    priority: 3,
  },
  '18-meta-frequency-cap-recommendations': {
    keywords: ['frequency cap', 'frequency', 'how often', 'impressions per user'],
    priority: 3,
  },
  '19-google-and-meta-roas-forecasting': {
    keywords: ['roas', 'forecast', 'predict', 'projection', 'revenue', 'return on ad spend'],
    priority: 2,
  },
  '20-google-keyword-cannibalization-check': {
    keywords: ['keyword cannibalization', 'cannibalization', 'duplicate keywords', 'keywords competing'],
    priority: 3,
  },
  '21-google-ad-extension-audit': {
    keywords: ['extensions', 'sitelinks', 'callouts', 'structured snippets', 'ad extensions'],
    priority: 3,
  },
  '22-meta-retargeting-window-analysis': {
    keywords: ['retargeting', 'remarketing', 'lookback window', 'retargeting window'],
    priority: 3,
  },
  '23-google-and-meta-campaign-naming-convention-builder': {
    keywords: ['naming convention', 'campaign names', 'naming', 'organize'],
    priority: 4,
  },
  '24-google-and-meta-geo-performance-analysis': {
    keywords: ['geo', 'geographic', 'location', 'country', 'region', 'city', 'where'],
    priority: 2,
  },
  '25-google-and-meta-device-performance-split': {
    keywords: ['device', 'mobile', 'desktop', 'tablet', 'device performance'],
    priority: 3,
  },
  '26-google-and-meta-attribution-model-comparison': {
    keywords: ['attribution model', 'attribution', 'last click', 'first click', 'data driven'],
    priority: 3,
  },
  '27-google-and-meta-pacing-monitor': {
    keywords: ['pacing', 'on track', 'underspending', 'overspending', 'budget pacing'],
    priority: 3,
  },
  '28-google-and-meta-ab-test-setup-and-analysis': {
    keywords: ['a/b test', 'split test', 'experiment', 'test setup', 'ab test'],
    priority: 3,
  },
  '29-google-and-meta-performance-benchmarking': {
    keywords: ['benchmark', 'benchmarking', 'industry average', 'compare', 'how do we compare'],
    priority: 3,
  },
  '30-google-and-meta-weekly-account-summary': {
    keywords: ['weekly', 'week', 'summary', 'weekly summary', 'this week', 'last week'],
    priority: 1,
  },
  '31-google-and-meta-ab-test-analyzer': {
    keywords: ['test results', 'which won', 'statistical significance', 'test analysis'],
    priority: 3,
  },
  '32-google-and-meta-ad-spend-allocator': {
    keywords: ['allocate', 'allocation', 'distribute budget', 'spend allocation', 'where to spend'],
    priority: 2,
  },
  '33-google-and-meta-competitor-teardown': {
    keywords: ['competitor analysis', 'competitive', 'competitor teardown', 'competition'],
    priority: 3,
  },
  '34-google-and-meta-content-repurposer': {
    keywords: ['repurpose', 'content', 'adapt', 'reuse content'],
    priority: 4,
  },
  '35-google-e2e-seo-assistant': {
    keywords: ['seo', 'organic', 'search optimization', 'organic search'],
    priority: 3,
  },
  '36-google-and-meta-email-sequence-writer': {
    keywords: ['email', 'email sequence', 'drip', 'nurture', 'email flow'],
    priority: 4,
  },
  '37-google-ads-audit': {
    keywords: ['google ads audit', 'audit google', 'full audit', 'account audit', 'health check'],
    priority: 1,
  },
  '38-google-and-meta-icp-research-assistant': {
    keywords: ['icp', 'ideal customer', 'persona', 'target audience', 'customer profile'],
    priority: 3,
  },
  '39-google-and-meta-landing-page-audit': {
    keywords: ['landing page audit', 'lp audit', 'page review'],
    priority: 2,
  },
  '40-linkedin-ads-audit': {
    keywords: ['linkedin', 'linkedin ads'],
    priority: 4,
  },
  '41-meta-ads-audit': {
    keywords: ['meta audit', 'facebook audit', 'instagram audit', 'meta ads audit'],
    priority: 1,
  },
  '42-google-programmatic-seo-builder': {
    keywords: ['programmatic seo', 'pseo', 'scaled content'],
    priority: 4,
  },
  '43-reddit-ads-audit': {
    keywords: ['reddit', 'reddit ads'],
    priority: 4,
  },
  '44-google-and-meta-utm-tracking-generator': {
    keywords: ['utm', 'tracking', 'utm builder', 'campaign tracking', 'parameters'],
    priority: 3,
  },
};

let skillsCache: Map<string, Skill> | null = null;

function parseSkillFile(filename: string, content: string): Skill {
  const lines = content.split('\n');
  const platform = lines[0]?.trim() || 'Google and Meta';
  
  // Extract title from first heading
  const titleMatch = content.match(/^#\s+\d+\/\s*(.+?)(?:\s*—|$)/m);
  const name = titleMatch ? titleMatch[1].trim() : filename.replace('.md', '');
  
  // Extract description from "What it does" section
  const whatItDoesMatch = content.match(/## What it does\n([\s\S]*?)(?=\n## |$)/);
  const description = whatItDoesMatch 
    ? whatItDoesMatch[1].trim().split('\n')[0] 
    : '';

  const id = filename.replace('.md', '');
  const metadata = SKILL_METADATA[id] || { keywords: [], priority: 5 };

  return {
    id,
    name,
    platform,
    description,
    content,
    keywords: metadata.keywords,
  };
}

export function loadAllSkills(): Map<string, Skill> {
  if (skillsCache) return skillsCache;

  skillsCache = new Map();

  try {
    const files = fs.readdirSync(SKILLS_DIR);
    
    for (const file of files) {
      if (!file.endsWith('.md') || file === 'README.md') continue;
      
      const filePath = path.join(SKILLS_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const skill = parseSkillFile(file, content);
      skillsCache.set(skill.id, skill);
    }
  } catch (error) {
    console.error('Error loading skills:', error);
  }

  return skillsCache;
}

export function selectSkillsForQuery(query: string, maxSkills: number = 3): Skill[] {
  const skills = loadAllSkills();
  const queryLower = query.toLowerCase();
  
  const scored: Array<{ skill: Skill; score: number }> = [];

  const skillArray = Array.from(skills.values());
  for (let i = 0; i < skillArray.length; i++) {
    const skill = skillArray[i];
    let score = 0;
    const metadata = SKILL_METADATA[skill.id];
    
    // Check keyword matches
    for (let j = 0; j < skill.keywords.length; j++) {
      if (queryLower.includes(skill.keywords[j].toLowerCase())) {
        score += 10;
      }
    }
    
    // Check name match
    if (queryLower.includes(skill.name.toLowerCase())) {
      score += 5;
    }
    
    // Apply priority boost (lower priority number = higher boost)
    if (metadata && score > 0) {
      score += (6 - metadata.priority) * 2;
    }
    
    if (score > 0) {
      scored.push({ skill, score });
    }
  }

  // Sort by score descending and take top N
  scored.sort((a, b) => b.score - a.score);
  
  return scored.slice(0, maxSkills).map(s => s.skill);
}

export function getSkillById(id: string): Skill | undefined {
  const skills = loadAllSkills();
  return skills.get(id);
}

export function formatSkillsForPrompt(skills: Skill[]): string {
  if (skills.length === 0) return '';
  
  return skills.map(skill => {
    return `### ${skill.name}\n${skill.content}`;
  }).join('\n\n---\n\n');
}

export function getSkillSummaries(): Array<{ id: string; name: string; description: string }> {
  const skills = loadAllSkills();
  return Array.from(skills.values()).map(s => ({
    id: s.id,
    name: s.name,
    description: s.description,
  }));
}
