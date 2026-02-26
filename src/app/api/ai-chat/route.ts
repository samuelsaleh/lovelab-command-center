import { NextRequest, NextResponse } from 'next/server';
import { chat, generateRecommendations, generateAdCopy, ChatMessage } from '@/lib/ai-advisor';
import { getCampaignPerformance } from '@/lib/google-ads';
import { getCampaignInsights } from '@/lib/meta-ads';
import { selectSkillsForQuery, formatSkillsForPrompt } from '@/lib/skill-loader';

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
      console.log('Google Ads data unavailable');
    }

    try {
      const metaData = await getCampaignInsights();
      liveData.meta = metaData;
    } catch (e) {
      console.log('Meta Ads data unavailable');
    }

    const chatMessages: ChatMessage[] = messages.map((m: any) => ({
      role: m.role,
      content: m.content,
    }));

    // Get the latest user message to select relevant skills
    const latestUserMessage = chatMessages.filter(m => m.role === 'user').pop();
    let skillContext = '';
    
    if (latestUserMessage) {
      const selectedSkills = selectSkillsForQuery(latestUserMessage.content, 2);
      if (selectedSkills.length > 0) {
        skillContext = formatSkillsForPrompt(selectedSkills);
        console.log(`Selected skills: ${selectedSkills.map(s => s.name).join(', ')}`);
      }
    }

    const response = await chat(chatMessages, liveData, skillContext);

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
