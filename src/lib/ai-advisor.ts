/**
 * Claude AI Advisor for LoveLab Command Center
 * Powers the La Lumière AI chat with deep brand + marketing knowledge
 */

import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `You are "La Lumière AI", the marketing advisor for LoveLab Antwerp — a luxury lab-grown diamond jewellery brand.

BRAND CONTEXT:
- LoveLab Antwerp — designed and handcrafted in Antwerp, Belgium (diamond capital of the world)
- Philosophy: "La Lumière" (The Light) — making luxury diamonds accessible for everyday wear
- Tagline: "Where La Lumière Finds You" / "Carry La Lumière Every Day"
- Positioning: Accessible luxury, 30-50% more affordable than competing lab-grown diamond brands
- Website: https://www.lovelab.be
- Target Markets: France (primary), Belgium, Italy | Secondary: Germany, UK, USA, UAE

COLLECTIONS & PRICING:
- Cuty (€75+): Entry-level single diamond bracelet, 20+ cord colors — BESTSELLER. "Your First Lumière"
- Matchy (€295+): Two matching diamonds, connection theme. "Dual Lumière"
- Multi/Triply (€390+): Three diamonds, past/present/future. "Triple Lumière"
- Shapy (€320-450+): Fancy cuts: oval, pear, heart, marquise, emerald, cushion. "Shaped Lumière"
- Cubix (€500+): Bold cubic diamond, geometric minimalist. "Modern Lumière"
- Holy (€195+): Religious symbols: cross, Hamsa, Star of David. "Sacred Lumière"
- Classy (€285+): Fine jewellery — Mirano bracelets, Figaro necklaces, Lugano earrings. "Bijoux de Luxe" (coming soon)

PRODUCTS: Bracelets, necklaces, earrings with lab-grown diamonds (100% real, chemically identical to mined)
CUSTOMIZATION: 20+ cord colors, custom engravings, adjustable sizing XS-XL
METALS: 925 Sterling Silver, 18K Yellow Gold, 18K White Gold
DIAMOND SIZES: 0.05ct to 1.00ct in 10 shapes

TARGET AUDIENCE:
- Age: 18+, predominantly female + gift buyers (male partners, family)
- Personas: Self-purchaser, gift buyer, ethically-conscious consumer, first-time diamond buyer
- Income: Middle to upper-middle class

FRENCH KEYWORDS (for France campaigns):
- diamants de laboratoire, bracelet diamant, bijoux diamant, collier diamant
- bijoux de luxe abordables, bracelet personnalisable, diamant éthique, cadeau diamant

CAMPAIGN STRATEGY: B2C only. Phase 1: Brand Search → Phase 2: Performance Max
Commercial: Free shipping €200+, 14-day returns, made-to-order 2-4 weeks, worldwide shipping

YOUR ROLE:
- Analyze live Google Ads and Meta Ads performance data when provided
- Give specific, actionable marketing recommendations
- Generate ad copy in French, English, Dutch, German, and Italian
- Recommend budget allocation, audience targeting, and campaign structure
- Focus on B2C market entry, especially France
- Always reference specific LoveLab collections and pricing in recommendations
- Be concise, data-driven, and strategic`;

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  }
  return client;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function chat(
  messages: ChatMessage[],
  liveData?: { google?: any; meta?: any }
) {
  const anthropic = getClient();

  // Inject live data context if available
  let contextMessage = '';
  if (liveData) {
    contextMessage = '\n\n[LIVE DATA SNAPSHOT]\n';
    if (liveData.google) {
      contextMessage += `Google Ads (last 30 days): ${JSON.stringify(liveData.google)}\n`;
    }
    if (liveData.meta) {
      contextMessage += `Meta Ads (last 30 days): ${JSON.stringify(liveData.meta)}\n`;
    }
  }

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250514',
    max_tokens: 2048,
    system: SYSTEM_PROMPT + contextMessage,
    messages: messages.map(m => ({
      role: m.role,
      content: m.content,
    })),
  });

  const textBlock = response.content.find(b => b.type === 'text');
  return textBlock ? textBlock.text : 'I could not generate a response.';
}

export async function generateRecommendations(googleData: any, metaData: any) {
  const prompt = `Based on this live performance data, give me the top 5 most important and actionable recommendations for LoveLab right now. Be specific with numbers and next steps.

GOOGLE ADS DATA:
${JSON.stringify(googleData, null, 2)}

META ADS DATA:
${JSON.stringify(metaData, null, 2)}

Format each recommendation as:
- Priority: [Critical/High/Medium]
- Title: [short title]
- Analysis: [what the data shows]
- Action: [specific next step]`;

  return chat([{ role: 'user', content: prompt }]);
}

export async function generateAdCopy(
  collection: string,
  language: string,
  platform: string,
  audience?: string
) {
  const prompt = `Generate 5 ${platform} ad variations for the LoveLab ${collection} collection in ${language}.
${audience ? `Target audience: ${audience}` : ''}

For each ad provide:
- Headline (max 30 chars for Google, 40 for Meta)
- Description (max 90 chars for Google, 125 for Meta)
- Call to action

Make them compelling, on-brand with "La Lumière" philosophy, and include the starting price.`;

  return chat([{ role: 'user', content: prompt }]);
}
