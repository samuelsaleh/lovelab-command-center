import { NextRequest, NextResponse } from 'next/server';
import { chat, generateRecommendations, generateAdCopy, ChatMessage } from '@/lib/ai-advisor';
import { getCampaignPerformance } from '@/lib/google-ads';
import { getCampaignInsights } from '@/lib/meta-ads';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, action, params } = body;

    // For special actions (ad copy generation, recommendations)
    if (action === 'recommendations') {
      let googleData = null;
      let metaData = null;

      try { googleData = await getCampaignPerformance(); } catch (e) {}
      try { metaData = await getCampaignInsights(); } catch (e) {}

      const response = await generateRecommendations(googleData, metaData);
      return NextResponse.json({ response });
    }

    if (action === 'adcopy') {
      const { collection, language, platform, audience } = params;
      const response = await generateAdCopy(collection, language, platform, audience);
      return NextResponse.json({ response });
    }

    // Regular chat — fetch live data to provide context
    let liveData: { google?: any; meta?: any } = {};

    try {
      const googleData = await getCampaignPerformance();
      liveData.google = googleData;
    } catch (e) {
      // Google data unavailable, continue without
    }

    try {
      const metaData = await getCampaignInsights();
      liveData.meta = metaData;
    } catch (e) {
      // Meta data unavailable, continue without
    }

    const chatMessages: ChatMessage[] = messages.map((m: any) => ({
      role: m.role,
      content: m.content,
    }));

    const response = await chat(chatMessages, liveData);

    return NextResponse.json({
      response,
      dataContext: {
        googleAvailable: !!liveData.google,
        metaAvailable: !!liveData.meta,
      },
    });
  } catch (error: any) {
    console.error('AI Chat error:', error);
    return NextResponse.json(
      { error: 'AI chat failed', details: error.message },
      { status: 500 }
    );
  }
}
